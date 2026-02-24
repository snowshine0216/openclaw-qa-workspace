#!/usr/bin/env node
/**
 * Spectre Scraper - Extract image comparison data from Spectre HTML
 */

const https = require('https');
const http = require('http');
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
    console.error(`Test ID ${testId} not found`);
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
    testId: testId,
    testName: nameMatch ? nameMatch[1].trim() : 'Unknown',
    baselineUrl: imageMatches[0] ? imageMatches[0][1] : null,
    actualUrl: imageMatches[1] ? imageMatches[1][1] : null,
    diffUrl: imageMatches[2] ? imageMatches[2][1] : null,
    diffPct: diffPctMatch ? parseFloat(diffPctMatch[1]) : null,
    tolerance: toleranceMatch ? parseFloat(toleranceMatch[1]) : null,
    passed: passed
  };
};

const main = async () => {
  const spectreUrl = process.argv[2];
  
  if (!spectreUrl) {
    console.error('Usage: node spectre_scraper.js <spectre_url>');
    console.error('Example: node spectre_scraper.js http://10.23.33.4:3000/.../runs/1054#test_6055125');
    process.exit(1);
  }
  
  // Extract test ID from URL
  const testIdMatch = spectreUrl.match(/#test_(\d+)/);
  if (!testIdMatch) {
    console.error('URL must contain #test_<id>');
    process.exit(1);
  }
  
  const testId = testIdMatch[1];
  const baseUrl = spectreUrl.split('#')[0];
  
  console.log(`Fetching: ${baseUrl}`);
  console.log(`Looking for test ID: ${testId}\n`);
  
  const html = await fetchUrl(baseUrl);
  const data = parseSpectreData(html, testId);
  
  if (!data) {
    process.exit(1);
  }
  
  console.log('=== Spectre Test Data ===\n');
  console.log(`Test ID: ${data.testId}`);
  console.log(`Test Name: ${data.testName}`);
  console.log(`Diff: ${data.diffPct}% (tolerance: ${data.tolerance}%)`);
  console.log(`Status: ${data.passed ? 'PASS' : 'FAIL'}\n`);
  
  console.log('Image URLs:');
  console.log(`  Baseline: ${data.baselineUrl || 'N/A'}`);
  console.log(`  Actual: ${data.actualUrl || 'N/A'}`);
  console.log(`  Diff: ${data.diffUrl || 'N/A'}\n`);
  
  // Classification
  if (data.diffPct !== null && data.tolerance !== null) {
    const overTolerance = data.diffPct > data.tolerance;
    const severity = data.diffPct < 1 ? '🟢 Minor' : data.diffPct < 5 ? '🟡 Moderate' : '🔴 Major';
    
    console.log('Analysis:');
    console.log(`  Severity: ${severity}`);
    console.log(`  Over tolerance: ${overTolerance ? 'YES' : 'NO'}`);
    
    if (data.diffPct < data.tolerance) {
      console.log(`  Recommendation: FALSE ALARM - diff (${data.diffPct}%) within tolerance (${data.tolerance}%)`);
    } else if (data.diffPct < 1) {
      console.log(`  Recommendation: Minor diff - review baseline or investigate`);
    } else {
      console.log(`  Recommendation: INVESTIGATE - significant visual change detected`);
    }
  }
  
  // JSON output
  console.log('\n=== JSON Output ===\n');
  console.log(JSON.stringify(data, null, 2));
};

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
