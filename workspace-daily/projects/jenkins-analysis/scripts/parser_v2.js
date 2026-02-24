#!/usr/bin/env node
/**
 * Enhanced Console Log Parser V2
 * 
 * Improvements:
 * - Extracts file names from "Failed Detail" section
 * - Captures full error messages with stack traces
 * - Deduplicates retries (run_1, run_2, run_3 → single entry with count)
 * - Includes file name in fingerprint calculation
 */

const crypto = require('crypto');

/**
 * Build fingerprint for failure matching across builds
 * Now includes fileName for uniqueness
 */
const buildFingerprint = (fileName, tcId, stepId, stepName, failureType) => {
  const payload = [fileName, tcId, stepId, stepName, failureType].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
};

/**
 * Extract full error message from run block
 * Captures from "- Failed:" to "at <Jasmine>" or end of block
 */
const extractFullError = (runBlock) => {
  const failedIndex = runBlock.indexOf('- Failed:');
  if (failedIndex === -1) return null;
  
  const lines = runBlock.slice(failedIndex).split('\n');
  const errorLines = [];
  
  for (const line of lines) {
    errorLines.push(line.trim());
    // Stop at Jasmine stack trace marker
    if (line.includes('at <Jasmine>')) break;
    // Also stop at other stack trace markers
    if (line.includes('at runMicrotasks')) break;
  }
  
  return errorLines.join('\n');
};

/**
 * Split console text into file blocks
 * Each block starts with "specs/...spec.js(N failed)"
 */
const splitByFilePattern = (consoleText) => {
  const FILE_RE = /^(specs\/[^\s]+\.spec\.js)\(\d+\s+failed\)/gm;
  const matches = [...consoleText.matchAll(FILE_RE)];
  
  if (matches.length === 0) {
    return [];
  }
  
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = matches[i + 1]?.index || consoleText.length;
    blocks.push({
      fileName: matches[i][1],
      content: consoleText.slice(start, end)
    });
  }
  
  return blocks;
};

/**
 * Extract test case info from block
 * Pattern: [TC86139_02] FUN | Report Editor | Grid View:
 */
const extractTestCaseInfo = (tcHeader) => {
  // Match [TC86139_02] FUN | Report Editor | Grid View:
  const TC_HEADER_RE = /\[(TC\d+[^\]]*)\]\s+([^:]+)/m;
  const match = tcHeader.match(TC_HEADER_RE);
  
  if (!match) return null;
  
  return {
    id: match[1],
    name: match[2].trim()
  };
};

/**
 * Extract screenshot details
 * Pattern: Screenshot "TC78888_01 - Custom info window..." doesn't match
 */
const extractScreenshotInfo = (runBlock) => {
  const SCREENSHOT_RE = /Screenshot\s+"(TC\d+_\d+)\s+-\s+(.+?)"\s+doesn't match/;
  const match = runBlock.match(SCREENSHOT_RE);
  
  if (!match) return null;
  
  return {
    stepId: match[1],
    stepName: match[2]
  };
};

/**
 * Extract Spectre URL
 * Pattern: Visit http://10.23.33.4:3000/projects/.../runs/2571#test_6055635 for details
 */
const extractSpectreUrl = (runBlock) => {
  const SPECTRE_URL_RE = /Visit\s+(http:\/\/[^:]+:3000\/projects\/[^\/]+\/suites\/[^\/]+\/runs\/\d+#test_\d+)\s+for details/;
  const match = runBlock.match(SPECTRE_URL_RE);
  
  return match ? match[1] : null;
};

/**
 * Parse a single run block
 * Extracts all error details from one run (run_1, run_2, etc.)
 */
const parseRunBlock = (runBlock, fileName, tcInfo) => {
  const runMatch = runBlock.match(/✗\s+(run_\d+)/);
  if (!runMatch) return null;
  
  const runLabel = runMatch[1];
  
  // Try screenshot failure first
  const screenshotInfo = extractScreenshotInfo(runBlock);
  if (screenshotInfo) {
    return {
      fileName,
      tcId: tcInfo.id,
      tcName: tcInfo.name,
      stepId: screenshotInfo.stepId,
      stepName: screenshotInfo.stepName,
      runLabel,
      failureType: 'screenshot_mismatch',
      failureMsg: `Screenshot "${screenshotInfo.stepId} - ${screenshotInfo.stepName}" doesn't match the baseline.`,
      fullErrorMsg: extractFullError(runBlock),
      snapshotUrl: extractSpectreUrl(runBlock)
    };
  }
  
  // Try assertion failure
  const ASSERTION_RE = /expected\s+(.+?)\s+to\s+(?:equal|be|contain)\s+(.+)/i;
  const assertionMatch = runBlock.match(ASSERTION_RE);
  if (assertionMatch) {
    return {
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
    };
  }
  
  // Generic fallback: any run with "- Failed:" message
  const FAILED_RE = /- Failed:(.+?)(?:\n|$)/;
  const failedMatch = runBlock.match(FAILED_RE);
  if (failedMatch) {
    return {
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
    };
  }
  
  return null;
};

/**
 * Deduplicate retry failures
 * Combines identical failures (same step, same error) into one entry with retry count
 */
const deduplicateRetries = (runResults) => {
  const map = new Map();
  
  runResults.forEach(result => {
    if (!result) return;
    
    // Key: file + TC + step + failure type
    const key = `${result.fileName}:${result.tcId}:${result.stepId}:${result.stepName}:${result.failureType}`;
    
    if (!map.has(key)) {
      map.set(key, {
        ...result,
        retryCount: 1,
        allUrls: result.snapshotUrl ? [result.snapshotUrl] : []
      });
    } else {
      const existing = map.get(key);
      existing.retryCount++;
      if (result.snapshotUrl && !existing.allUrls.includes(result.snapshotUrl)) {
        existing.allUrls.push(result.snapshotUrl);
      }
    }
  });
  
  return Array.from(map.values());
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
    // Split into test case blocks (allow leading whitespace)
    const tcBlocks = content.split(/(?=\s*\[?TC\d+\])/m).filter(b => b.trim() !== "");
    
    tcBlocks.forEach(tcBlock => {
      const tcInfo = extractTestCaseInfo(tcBlock);
      if (!tcInfo) return;
      
      // Split into run blocks
      const runBlocks = tcBlock.split(/(?=✗\s+run_\d+)/g).filter(r => r.includes('✗ run_'));
      
      // Parse each run
      const runResults = runBlocks.map(runBlock => parseRunBlock(runBlock, fileName, tcInfo));
      
      // Deduplicate retries
      const deduplicated = deduplicateRetries(runResults);
      
      results.push(...deduplicated);
    });
  });
  
  return results;
};

/**
 * Legacy parser (fallback for logs without file pattern)
 * Keeps original parsing logic for backwards compatibility
 */
const extractFailuresFromLogLegacy = (consoleText) => {
  const results = [];
  const TC_HEADER_RE = /^\[?(TC\d+)\]?\s+(.+?)\s*:/m;
  const RUN_BLOCK_RE = /✗\s+(run_\d+)/g;
  const SCREENSHOT_RE = /Screenshot\s+"(TC\d+_\d+)\s+-\s+(.+?)"\s+doesn't match/;
  const SPECTRE_URL_RE = /Visit\s+(http:\/\/.*:3000\/\S+)\s+for details/;
  const ASSERTION_RE = /expected\s+(.+?)\s+to\s+(?:equal|be|contain)\s+(.+)/i;

  const tcBlocks = consoleText.split(/(?=^\[?TC\d+\])/m).filter(b => b.trim() !== "");
  
  tcBlocks.forEach(block => {
    const headerMatch = block.match(TC_HEADER_RE);
    if (!headerMatch) return;
    const [_, tcId, tcName] = headerMatch;
    
    const runs = block.split(/(?=✗\s+run_\d+)/g).filter(r => r.includes('✗ run_'));
    runs.forEach(runBlock => {
      const runMatch = runBlock.match(RUN_BLOCK_RE);
      if (!runMatch) return;
      const runLabel = runMatch[0].replace('✗ ', '').trim();
      
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

module.exports = {
  extractFailuresFromLog,
  buildFingerprint,
  extractFullError,
  splitByFilePattern,
  deduplicateRetries,
  extractTestCaseInfo,
  extractScreenshotInfo,
  extractSpectreUrl
};
