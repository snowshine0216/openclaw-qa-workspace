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
      const newUrls = existing.allUrls || [];
      if (result.snapshotUrl && !newUrls.includes(result.snapshotUrl)) {
        newUrls.push(result.snapshotUrl);
      }
      
      // Update entry with latest details, but keep retryCount and allUrls
      map.set(key, {
        ...result,
        retryCount: existing.retryCount + 1,
        allUrls: newUrls
      });
    }
  });
  
  return Array.from(map.values());
};

module.exports = {
  splitByFilePattern,
  deduplicateRetries
};
