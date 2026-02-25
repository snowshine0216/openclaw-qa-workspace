const extractFullError = (runBlock) => {
  const failedIndex = runBlock.indexOf('- Failed:');
  if (failedIndex === -1) {
    // Try alternative: look for "Error in" pattern
    const errorIndex = runBlock.indexOf('Error in');
    if (errorIndex === -1) return null;
    
    const lines = runBlock.slice(errorIndex).split('\n');
    const errorLines = [];
    
    for (const line of lines) {
      errorLines.push(line.trimEnd());
      if (line.includes('at <Jasmine>')) break;
      if (line.includes('at runMicrotasks')) break;
      if (errorLines.length >= 20) break; // Limit to 20 lines
    }
    
    return errorLines.join('\n');
  }
  
  const lines = runBlock.slice(failedIndex).split('\n');
  const errorLines = [];
  
  for (const line of lines) {
    errorLines.push(line.trimEnd()); // don't trim leading whitespace for stack traces
    // Stop at Jasmine stack trace marker
    if (line.includes('at <Jasmine>')) break;
    // Also stop at other stack trace markers
    if (line.includes('at runMicrotasks')) break;
  }
  
  return errorLines.join('\n');
};

const extractTestCaseInfo = (tcHeader) => {
  // Match [TC86139_02], [QAC-487_3], [BCIN-5296], etc.
  // Flexible pattern: [<ID>] followed by descriptive text
  const TC_HEADER_RE = /\[((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+[^\]]*)\]\s+([^\n]+)/m;
  const match = tcHeader.match(TC_HEADER_RE);
  
  if (!match) return null;
  
  return {
    id: match[1],
    name: match[2].trim().replace(/\s*:\s*$/, '') // remove trailing colons if any
  };
};

/**
 * Extract TC info from worker-ID error format: [0-1] Error in "... [TC_ID] ..."
 */
const extractTestCaseInfoFromError = (errorLine) => {
  // Pattern 1: [Worker-ID] Error in "... [TC_ID] ..."
  const workerPattern = /Error in "([^"]*?)\s+\[((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+[^\]]*)\]\s+([^"]+)"/;
  let match = errorLine.match(workerPattern);
  if (match) {
    return { 
      id: match[2], 
      name: match[3].trim(),
      suite: match[1].trim()
    };
  }
  
  // Pattern 2: Standard [TC_ID] Name (fallback)
  const standardPattern = /\[((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+[^\]]*)\]\s+([^\n:]+)/;
  match = errorLine.match(standardPattern);
  if (match) {
    return { 
      id: match[1], 
      name: match[2].trim(),
      suite: null
    };
  }
  
  return null;
};

/**
 * Extract file name from full spec path or file:// URL
 */
const extractFileName = (text) => {
  // Pattern 1: file:///path/to/spec.js
  let match = text.match(/file:\/\/\/[^\s]+?\/([^\/\s:]+\.spec\.js)/);
  if (match) {
    return match[1];
  }
  
  // Pattern 2: specs/path/to/spec.js
  match = text.match(/specs\/[^\s]+?\/([^\/\s:]+\.spec\.js)/);
  if (match) {
    return match[1];
  }
  
  // Pattern 3: Just the filename.spec.js
  match = text.match(/([^\s\/]+\.spec\.js)/);
  if (match) {
    return match[1];
  }
  
  return 'unknown.spec.js';
};

const extractScreenshotInfo = (runBlock) => {
  // Updated to support all ID prefixes
  const SCREENSHOT_RE = /Screenshot\s+"((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)[^"]+)\s+-\s+(.+?)"\s+doesn't match/;
  const match = runBlock.match(SCREENSHOT_RE);
  
  if (!match) return null;
  
  return {
    stepId: match[1],
    stepName: match[2]
  };
};

const extractSpectreUrl = (runBlock) => {
  const SPECTRE_URL_RE = /Visit\s+(http:\/\/[^:]+:3000\/projects\/[^\/]+\/suites\/[^\/]+\/runs\/\d+#test_\d+)\s+for details/;
  const match = runBlock.match(SPECTRE_URL_RE);
  
  return match ? match[1] : null;
};

module.exports = {
  extractFullError,
  extractTestCaseInfo,
  extractTestCaseInfoFromError,
  extractFileName,
  extractScreenshotInfo,
  extractSpectreUrl
};
