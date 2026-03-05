#!/usr/bin/env node
/**
 * Spectre Scraper CLI
 */
const { fetchUrl, parseSpectreData } = require('../analysis/spectre');

const main = async () => {
  const spectreUrl = process.argv[2];
  
  if (!spectreUrl) {
    console.error('Usage: node spectre_cli.js <spectre_url>');
    console.error('Example: node spectre_cli.js http://10.23.33.4:3000/.../runs/1054#test_6055125');
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
    console.error(`Failed to parse data for test ID ${testId}`);
    process.exit(1);
  }
  
  console.log('=== Spectre Test Data ===\n');
  console.log(`Test ID: ${data.id}`);
  console.log(`Test Name: ${data.name}`);
  console.log(`Diff: ${data.diff}% (tolerance: ${data.diff_threshold}%)`);
  console.log(`Status: ${data.pass ? 'PASS' : 'FAIL'}\n`);
  
  console.log('Image URLs:');
  console.log(`  Baseline: ${data.baselineUrl || 'N/A'}`);
  console.log(`  Actual: ${data.actualUrl || 'N/A'}`);
  console.log(`  Diff: ${data.diffUrl || 'N/A'}\n`);
  
  // Classification
  if (data.diff !== null && data.diff_threshold !== null) {
    const overTolerance = data.diff > data.diff_threshold;
    const severity = data.diff < 1 ? '🟢 Minor' : data.diff < 5 ? '🟡 Moderate' : '🔴 Major';
    
    console.log('Analysis:');
    console.log(`  Severity: ${severity}`);
    console.log(`  Over tolerance: ${overTolerance ? 'YES' : 'NO'}`);
    
    if (data.diff < data.diff_threshold) {
      console.log(`  Recommendation: FALSE ALARM - diff (${data.diff}%) within tolerance (${data.diff_threshold}%)`);
    } else if (data.diff < 1) {
      console.log(`  Recommendation: Minor diff - review baseline or investigate`);
    } else {
      console.log(`  Recommendation: INVESTIGATE - significant visual change detected`);
    }
  }
  
  // JSON output
  console.log('\n=== JSON Output ===\n');
  console.log(JSON.stringify(data, null, 2));
};

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
