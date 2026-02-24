const extractFullError = (runBlock) => {
  const failedIndex = runBlock.indexOf('- Failed:');
  if (failedIndex === -1) return null;
  
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
  extractScreenshotInfo,
  extractSpectreUrl
};
