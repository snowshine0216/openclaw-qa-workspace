const {
  extractFullError,
  extractTestCaseInfo,
  extractTestCaseInfoFromError,
  extractFileName,
  extractScreenshotInfo,
  extractSpectreUrl
} = require('./extractors');

const {
  splitByFilePattern,
  deduplicateRetries
} = require('./deduplication');

const SUPPORTED_ID_PATTERN = '(?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\\d+[^\\]]*';

const inferFailureTypeFromMessage = (failureMsg) => {
  if (!failureMsg) return 'generic_failure';
  const msg = failureMsg.toLowerCase();
  if (msg.includes('screenshot') && msg.includes("doesn't match")) return 'screenshot_mismatch';
  if (msg.includes('expected') || msg.includes('expect(') || msg.includes('assert')) return 'assertion_failure';
  if (msg.includes('timeout') || msg.includes('timed out')) return 'timeout';
  if (msg.includes('stale element')) return 'stale_element';
  if (msg.includes('element') && (msg.includes('not found') || msg.includes("wasn't found"))) return 'element_not_found';
  return 'generic_failure';
};

const extractFailureMsgFromBlock = (caseBlock) => {
  const lines = caseBlock
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (/^[✕x●]/.test(line)) continue;
    if (line.startsWith('at ')) continue;
    if (/^\d+\s+\|/.test(line)) continue;
    if (/^\^+$/.test(line)) continue;
    return line.replace(/^Error:\s*/, '').slice(0, 300);
  }

  return 'Test failed';
};

const extractJestErrorContext = (caseBlock) => {
  const lines = caseBlock.split('\n').map(line => line.trimEnd());
  const startIndex = lines.findIndex(line =>
    /^\s*(?:Error:|expect\(|Expected:|Received:|- Failed:)/.test(line)
  );

  if (startIndex === -1) return null;

  const collected = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (collected.length > 0 && line.trim() === '') break;
    collected.push(line);
    if (collected.length >= 12) break;
  }

  return collected.join('\n').trim() || null;
};

const normalizeJestCaseName = (name) => {
  return (name || '').replace(/\s+/g, ' ').trim();
};

const extractJestDetailBlocks = (fileBlock) => {
  const DETAIL_RE = new RegExp(
    `^\\s*●\\s+(?:.+?\\s>\\s+)?\\[(${SUPPORTED_ID_PATTERN})\\]\\s+(.+?)\\s*$`,
    'gm'
  );
  const detailMatches = [...fileBlock.matchAll(DETAIL_RE)];

  return detailMatches.map((match, index) => {
    const start = match.index;
    const end = detailMatches[index + 1]?.index || fileBlock.length;
    return {
      tcId: match[1].trim(),
      tcName: normalizeJestCaseName(match[2]),
      startIndex: start,
      block: fileBlock.slice(start, end),
      consumed: false
    };
  });
};

const pickJestDetailBlock = (detailBlocks, tcId, tcName) => {
  const normalizedTcName = normalizeJestCaseName(tcName);
  const exactIndex = detailBlocks.findIndex((entry) => (
    !entry.consumed && entry.tcId === tcId && entry.tcName === normalizedTcName
  ));
  if (exactIndex !== -1) {
    detailBlocks[exactIndex].consumed = true;
    return detailBlocks[exactIndex].block;
  }

  const tcOnlyIndex = detailBlocks.findIndex((entry) => (
    !entry.consumed && entry.tcId === tcId
  ));
  if (tcOnlyIndex !== -1) {
    detailBlocks[tcOnlyIndex].consumed = true;
    return detailBlocks[tcOnlyIndex].block;
  }

  return '';
};

/**
 * Parse a single run block and extract ALL failures within it
 * Returns an array of failure objects (one run block can have multiple screenshot failures)
 */
const parseRunBlock = (runBlock, fileName, tcInfo) => {
  // Match run label - handle both ✗ and corrupted emoji (U+FFFD replacement chars)
  const runMatch = runBlock.match(/[✗�]+\s+(run_\d+)/);
  if (!runMatch) return [];
  
  const runLabel = runMatch[1];
  const results = [];
  
  // Extract ALL screenshot failures in this run block
  const SCREENSHOT_RE = /(?:- Failed:)?\s*Screenshot\s+"((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)[^"]+)\s+-\s+(.+?)"\s+doesn't match(?:\s+the\s+baseline)?\.?(?:\s+Visit\s+(http:\/\/[^\s]+)\s+for details)?/g;
  
  for (const match of runBlock.matchAll(SCREENSHOT_RE)) {
    const [, stepId, stepName, snapshotUrl] = match;
    results.push({
      fileName,
      tcId: tcInfo.id,
      tcName: tcInfo.name,
      stepId,
      stepName,
      runLabel,
      failureType: 'screenshot_mismatch',
      failureMsg: `Screenshot "${stepId} - ${stepName}" doesn't match the baseline.`,
      fullErrorMsg: extractFullError(runBlock),
      snapshotUrl: snapshotUrl || extractSpectreUrl(runBlock)
    });
  }
  
  // If no screenshot failures, try other failure types
  if (results.length === 0) {
    // Try assertion failure
    const ASSERTION_RE = /expected\s+(.+?)\s+to\s+(?:equal|be|contain)\s+(.+)/i;
    const assertionMatch = runBlock.match(ASSERTION_RE);
    if (assertionMatch) {
      results.push({
        fileName,
        tcId: tcInfo.id,
        tcName: tcInfo.name,
        stepId: tcInfo.id + "_0X",
        stepName: "Assertion Failure",
        runLabel,
        failureType: 'assertion_failure',
        failureMsg: "Assertion failed",
        fullErrorMsg: extractFullError(runBlock),
        snapshotUrl: null
      });
    } else {
      // Generic fallback: any run with "- Failed:" message
      const FAILED_RE = /- Failed:(.+?)(?:\n|$)/;
      const failedMatch = runBlock.match(FAILED_RE);
      if (failedMatch) {
        results.push({
          fileName,
          tcId: tcInfo.id,
          tcName: tcInfo.name,
          stepId: tcInfo.id,
          stepName: tcInfo.name,
          runLabel,
          failureType: 'generic_failure',
          failureMsg: failedMatch[1].trim(),
          fullErrorMsg: extractFullError(runBlock),
          snapshotUrl: null
        });
      }
    }
  }
  
  return results;
};

/**
 * Jest parser: Handles "FAIL specs/...spec.js" blocks and test-level failures
 * Uses TC tags in test names: "✕ [TC123] some test"
 */
const extractFailuresFromLogJest = (consoleText) => {
  const results = [];
  const FILE_HEADER_RE = /^FAIL\s+([^\s]+\.spec\.js)\s*$/gm;
  const CASE_RE = new RegExp(
    `^\\s*[✕x]\\s+\\[(${SUPPORTED_ID_PATTERN})\\]\\s+(.+?)(?:\\s+\\(\\d+\\s*ms\\))?\\s*$`,
    'gm'
  );
  const SCREENSHOT_RE = new RegExp(
    `Screenshot\\s+"((${SUPPORTED_ID_PATTERN})\\s+-\\s+(.+?))"\\s+doesn't match(?:\\s+the\\s+baseline)?\\.?(?:\\s|$)`,
    'i'
  );

  const fileHeaders = [...consoleText.matchAll(FILE_HEADER_RE)];
  for (let fileIndex = 0; fileIndex < fileHeaders.length; fileIndex++) {
    const currentHeader = fileHeaders[fileIndex];
    const fileName = currentHeader[1];
    const start = currentHeader.index + currentHeader[0].length;
    const end = fileHeaders[fileIndex + 1]?.index || consoleText.length;
    const fileBlock = consoleText.slice(start, end);
    const caseMatches = [...fileBlock.matchAll(CASE_RE)];
    const detailBlocks = extractJestDetailBlocks(fileBlock);
    const firstDetailStart = detailBlocks[0]?.startIndex ?? fileBlock.length;

    for (let i = 0; i < caseMatches.length; i++) {
      const caseMatch = caseMatches[i];
      const tcId = caseMatch[1].trim();
      const tcName = caseMatch[2].trim();
      const start = caseMatch.index;
      const nextCaseStart = caseMatches[i + 1]?.index || fileBlock.length;
      const end = Math.min(nextCaseStart, firstDetailStart);
      const summaryBlock = fileBlock.slice(start, end);
      const detailBlock = pickJestDetailBlock(detailBlocks, tcId, tcName);
      const caseBlock = detailBlock ? `${summaryBlock}\n${detailBlock}` : summaryBlock;

      const screenshotMatch = caseBlock.match(SCREENSHOT_RE);
      const screenshotStepId = screenshotMatch ? screenshotMatch[2].trim() : tcId;
      const screenshotStepName = screenshotMatch ? screenshotMatch[3].trim() : tcName;
      const snapshotUrl = extractSpectreUrl(caseBlock);
      const failureMsg = screenshotMatch
        ? `Screenshot "${screenshotStepId} - ${screenshotStepName}" doesn't match the baseline.`
        : extractFailureMsgFromBlock(caseBlock);

      results.push({
        fileName,
        tcId,
        tcName,
        stepId: screenshotStepId,
        stepName: screenshotStepName,
        runLabel: 'run_1',
        failureType: screenshotMatch ? 'screenshot_mismatch' : inferFailureTypeFromMessage(failureMsg),
        failureMsg,
        fullErrorMsg: extractFullError(caseBlock) || extractJestErrorContext(caseBlock),
        snapshotUrl: snapshotUrl || null
      });
    }
  }

  return deduplicateRetries(results);
};

/**
 * Worker-ID format parser: Handles [Worker-ID] Error in "..." format
 * Common in multi-worker WDIO runs (e.g., [0-1] Error in "...")
 */
const extractFailuresFromLogWorkerFormat = (consoleText) => {
  const results = [];
  
  // Build a map of worker IDs to their running spec files
  const workerSpecMap = new Map();
  const runningPattern = /\[(\d+-\d+)\]\s+(?:RUNNING|RETRYING)\s+in\s+\w+\s+-\s+file:\/\/\/specs\/(.+?\.spec\.js)/g;
  for (const match of consoleText.matchAll(runningPattern)) {
    const [, workerId, specPath] = match;
    workerSpecMap.set(workerId, specPath.split('/').pop());
  }
  
  // Pattern: [Worker-ID] Error in "Suite Name [TC_ID] Test Name"
  const ERROR_RE = /\[(\d+-\d+)\]\s+Error in "([^"]*?)\s+\[((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+[^\]]*)\]\s+([^"]+)"/gm;
  
  const matches = [...consoleText.matchAll(ERROR_RE)];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const [fullMatch, workerId, suiteName, tcId, tcName] = match;
    
    // Get spec file from worker map
    const fileName = workerSpecMap.get(workerId) || extractFileName(consoleText.slice(Math.max(0, match.index - 5000), match.index + 1000));
    
    // Find associated failure message and context
    const startIdx = match.index;
    const nextMatchIdx = matches[i + 1]?.index || consoleText.length;
    const errorBlock = consoleText.slice(startIdx, Math.min(nextMatchIdx, startIdx + 3000));
    
    // Extract run label if present
    const runMatch = errorBlock.match(/[✗�]+\s+(run_\d+)/);
    const runLabel = runMatch ? runMatch[1] : 'run_1';
    
    // Extract failure details
    let failureMsg = 'Test failed';
    let failureType = 'generic_failure';
    
    // Check for screenshot failure
    const screenshotMatch = errorBlock.match(/Screenshot\s+"([^"]+)"\s+doesn't match/);
    if (screenshotMatch) {
      failureMsg = `Screenshot "${screenshotMatch[1]}" doesn't match the baseline.`;
      failureType = 'screenshot_mismatch';
    } else {
      // Try to extract first line of error after "Error in"
      const lines = errorBlock.split('\n');
      for (let j = 1; j < Math.min(lines.length, 5); j++) {
        const line = lines[j].trim();
        if (line && !line.startsWith('[') && !line.startsWith('(Session') && !line.startsWith('at ')) {
          failureMsg = line.slice(0, 200);
          break;
        }
      }
      
      // Detect failure type from message
      if (failureMsg.includes('element') && (failureMsg.includes('not found') || failureMsg.includes("wasn't found"))) {
        failureType = 'element_not_found';
      } else if (failureMsg.includes('timeout') || failureMsg.includes('not clickable')) {
        failureType = 'timeout';
      } else if (failureMsg.includes('stale element')) {
        failureType = 'stale_element';
      }
    }
    
    // Extract snapshot URL if present
    const urlMatch = errorBlock.match(/Visit\s+(http:\/\/[^:\s]+:3000\/[^\s]+)/);
    const snapshotUrl = urlMatch ? urlMatch[1] : null;
    
    // Extract full error message
    const fullErrorMsg = extractFullError(errorBlock);
    
    results.push({
      fileName,
      tcId,
      tcName: tcName.trim(),
      stepId: tcId, // Default to tcId, can be refined later
      stepName: tcName.trim(),
      runLabel,
      failureType,
      failureMsg,
      fullErrorMsg: fullErrorMsg || errorBlock.slice(0, 500),
      snapshotUrl,
      retryCount: 1
    });
  }
  
  return results;
};

/**
 * Legacy parser (fallback for logs without file pattern)
 * Keeps original parsing logic for backwards compatibility
 * Now supports multiple ID prefixes: TC, QAC-, BCIN-, etc.
 */
const extractFailuresFromLogLegacy = (consoleText) => {
  const results = [];
  // Updated to support multiple ID prefixes
  const TC_HEADER_RE = /^\[?((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+[^\]]*)\]?\s+(.+?)\s*:/m;
  const RUN_BLOCK_RE = /[✗�]+\s+(run_\d+)/g;
  // Updated screenshot pattern to support all ID prefixes
  const SCREENSHOT_RE = /Screenshot\s+"((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)[^"]+)\s+-\s+(.+?)"\s+doesn't match/;
  const SPECTRE_URL_RE = /Visit\s+(http:\/\/[^:]+:3000\/\S+)\s+for details/;
  const ASSERTION_RE = /expected\s+(.+?)\s+to\s+(?:equal|be|contain)\s+(.+)/i;

  // Split by any supported ID prefix
  const tcBlocks = consoleText.split(/(?=^\[?(?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+\]?)/m).filter(b => b.trim() !== "");
  
  tcBlocks.forEach(block => {
    const headerMatch = block.match(TC_HEADER_RE);
    if (!headerMatch) return;
    const [_, tcId, tcName] = headerMatch;
    
    const runs = block.split(/(?=[✗�]+\s+run_\d+)/g).filter(r => /[✗�]+\s+run_\d+/.test(r));
    runs.forEach(runBlock => {
      const runMatch = runBlock.match(RUN_BLOCK_RE);
      if (!runMatch) return;
      const runLabel = runMatch[0].replace(/[✗�]+\s+/, '').trim();
      
      const screenshotMatch = runBlock.match(SCREENSHOT_RE);
      if (screenshotMatch) {
        const [failureMsg, stepId, stepName] = screenshotMatch;
        const urlMatch = runBlock.match(SPECTRE_URL_RE);
        results.push({
          fileName: 'unknown.spec.js',  // No file name in legacy format
          tcId, tcName,
          stepId, stepName, runLabel,
          failureType: 'screenshot_mismatch',
          failureMsg: failureMsg.trim(),
          fullErrorMsg: extractFullError(runBlock),
          snapshotUrl: urlMatch ? urlMatch[1] : null,
          retryCount: 1  // No deduplication in legacy
        });
        return;
      }
      
      const assertionMatch = runBlock.match(ASSERTION_RE);
      if (assertionMatch) {
        results.push({
          fileName: 'unknown.spec.js',
          tcId, tcName,
          stepId: tcId + "_0X", stepName: "Assertion Failure", runLabel,
          failureType: 'assertion_failure',
          failureMsg: "Assertion failed",
          fullErrorMsg: extractFullError(runBlock),
          snapshotUrl: null,
          retryCount: 1
        });
      }
    });
  });
  
  return results;
};

/**
 * Main parsing function: Extract all failures from console log
 * Returns deduplicated failure entries with file names
 * 
 * Parsing strategy (in order):
 * 1. Try file-based V2 parser (specs/...spec.js pattern)
 * 2. Try worker-ID format parser ([0-1] Error in "..." pattern)
 * 3. Try Jest "FAIL specs/...spec.js" parser
 * 4. Fall back to legacy parser ([TC_ID] Name: pattern)
 */
const extractFailuresFromLog = (consoleText) => {
  const results = [];
  
  // Step 1: Try file-based V2 parser
  const fileBlocks = splitByFilePattern(consoleText);
  
  if (fileBlocks.length > 0) {
    // Process each file block
    fileBlocks.forEach(({ fileName, content }) => {
      // Split into test case blocks - allow any prefix before [TC...], [QAC-...], [BCIN-...], etc.
      const tcBlocks = content.split(/(?=.*?\[(?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+)/m).filter(b => {
        const trimmed = b.trim();
        return trimmed !== "" && /\[(?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+/.test(trimmed);
      });
      
      tcBlocks.forEach(tcBlock => {
        const tcInfo = extractTestCaseInfo(tcBlock);
        if (!tcInfo) return;
        
        // Split into run blocks (handle both ✗ and corrupted emoji U+FFFD)
        const runBlocks = tcBlock.split(/(?=[✗�]+\s+run_\d+)/g).filter(r => /[✗�]+\s+run_\d+/.test(r));
        
        // Parse each run - parseRunBlock now returns an array of failures
        const runResults = runBlocks.flatMap(runBlock => parseRunBlock(runBlock, fileName, tcInfo));
        
        // Deduplicate retries
        const deduplicated = deduplicateRetries(runResults);
        
        results.push(...deduplicated);
      });
    });
    
    return results;
  }
  
  // Step 2: Try worker-ID format parser
  const workerFailures = extractFailuresFromLogWorkerFormat(consoleText);
  if (workerFailures.length > 0) {
    console.log(`✅ Worker-ID parser extracted ${workerFailures.length} failures`);
    return workerFailures;
  }
  
  // Step 3: Try Jest format parser
  const jestFailures = extractFailuresFromLogJest(consoleText);
  if (jestFailures.length > 0) {
    console.log(`✅ Jest parser extracted ${jestFailures.length} failures`);
    return jestFailures;
  }
  
  // Step 4: Fallback to legacy parser
  console.log('⚠️ Using legacy parser (no file pattern, worker-ID format, or Jest FAIL block found)');
  return extractFailuresFromLogLegacy(consoleText);
};

module.exports = {
  extractFailuresFromLog,
  extractFailuresFromLogJest
};
