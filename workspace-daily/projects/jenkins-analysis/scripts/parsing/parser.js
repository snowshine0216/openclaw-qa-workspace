const {
  extractFullError,
  extractTestCaseInfo,
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
 */
const extractFailuresFromLog = (consoleText) => {
  const results = [];
  
  // Step 1: Split into file blocks
  const fileBlocks = splitByFilePattern(consoleText);
  
  if (fileBlocks.length === 0) {
    // Fallback: no file pattern found, parse as before
    return extractFailuresFromLogLegacy(consoleText);
  }
  
  // Step 2: Process each file block
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
};

module.exports = {
  extractFailuresFromLog
};
