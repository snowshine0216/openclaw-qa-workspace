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
  const SCREENSHOT_RE = /- Failed:Screenshot\s+"((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)[^"]+)\s+-\s+(.+?)"\s+doesn't match the baseline\.\s+Visit\s+(http:\/\/[^:]+:3000\/projects\/[^\/]+\/suites\/[^\/]+\/runs\/\d+#test_\d+)\s+for details/g;
  
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
      snapshotUrl
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
 * 3. Fall back to legacy parser ([TC_ID] Name: pattern)
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
  
  // Step 3: Fallback to legacy parser
  console.log('⚠️ Using legacy parser (no file pattern or worker-ID format found)');
  return extractFailuresFromLogLegacy(consoleText);
};

module.exports = {
  extractFailuresFromLog
};
