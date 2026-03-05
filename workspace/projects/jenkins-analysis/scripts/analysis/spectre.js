const http = require('http');
const https = require('https');
const { URL } = require('url');

const fetchUrl = (urlString) => {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const client = url.protocol === 'https:' ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const parseSpectreData = (html, testId) => {
  // Extract test block containing the testId
  const testIdAnchor = `id="test_${testId}"`;
  const testBlockStart = html.indexOf(testIdAnchor);
  
  if (testBlockStart === -1) {
    return null;
  }
  
  // Extract ~2000 chars around the test
  const testBlock = html.substring(testBlockStart, testBlockStart + 2000);
  
  // Extract image URLs (they're in order: baseline, actual, diff)
  const imageMatches = [...testBlock.matchAll(/class="test__image" href="([^"]*)"/g)];
  
  // Extract diff percentage
  const diffPctMatch = testBlock.match(/(\d+\.?\d*)%\s+difference/);
  
  // Extract tolerance
  const toleranceMatch = testBlock.match(/(\d+\.?\d*)%\s+tolerance/);
  
  // Extract test name
  const nameMatch = testBlock.match(/<span class="test__name">([^<]+)</);
  
  // Check pass/fail
  const passed = testBlock.includes('test--passed') || !testBlock.includes('test--failed');
  
  return {
    id: testId,
    name: nameMatch ? nameMatch[1].trim() : null,
    diff: diffPctMatch ? parseFloat(diffPctMatch[1]) : null,
    diff_threshold: toleranceMatch ? parseFloat(toleranceMatch[1]) : null,
    pass: passed,
    baselineUrl: imageMatches[0] ? imageMatches[0][1] : null,
    actualUrl: imageMatches[1] ? imageMatches[1][1] : null,
    diffUrl: imageMatches[2] ? imageMatches[2][1] : null
  };
};

const fetchSpectreData = async (snapshotUrl) => {
  if (!snapshotUrl || !snapshotUrl.includes('10.23.33.4:3000')) return null;
  
  // Extract test ID from URL
  const testIdMatch = snapshotUrl.match(/#test_(\d+)/);
  if (!testIdMatch) return null;
  
  const testId = testIdMatch[1];
  const baseUrl = snapshotUrl.split('#')[0];
  
  try {
    const html = await fetchUrl(baseUrl);
    return parseSpectreData(html, testId);
  } catch (error) {
    console.error(`Spectre fetch error: ${error.message}`);
    return null;
  }
};

const parseSpectreUrl = (snapshotUrl) => {
  if (!snapshotUrl) return null;
  const match = snapshotUrl.match(/http:\/\/.*:3000\/projects\/(.+?)\/suites\/(.+?)\/runs\/(\d+)#test_(\d+)/);
  return match ? { project: match[1], suite: match[2], runId: parseInt(match[3]), testId: parseInt(match[4]) } : null;
};

const classifySpectreResult = (spectreData) => {
  if (!spectreData) return { verified: 0, falseAlarm: 0, reason: "Spectre data unavailable" };
  
  if (spectreData.pass) return { verified: 2, falseAlarm: 1, reason: "Spectre pass=true — baseline already updated or test fluke" };
  if (spectreData.diff < 1.0) return { verified: 2, falseAlarm: 1, reason: `diff=${spectreData.diff}% below 1% margin — likely cosmetic noise` };
  if (spectreData.diff > spectreData.diff_threshold) return { verified: 1, falseAlarm: 0, reason: `diff=${spectreData.diff}% exceeds threshold ${spectreData.diff_threshold}% — confirmed visual regression` };
  
  return { verified: 2, falseAlarm: 1, reason: "Spectre fail, but diff is under threshold" };
};

module.exports = {
  fetchUrl,
  parseSpectreData,
  fetchSpectreData,
  parseSpectreUrl,
  classifySpectreResult
};
