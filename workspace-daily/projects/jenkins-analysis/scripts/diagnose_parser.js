#!/usr/bin/env node
/**
 * Diagnostic Script for Sort/Subtotals Parser Issue
 * Helps identify why parser returns 0 failures despite "Failed Detail" existing
 */

const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.resolve(__dirname, '../reports/Tanzu_Report_Env_Upgrade_1243');

console.log('===== Sort Job Diagnostic =====\n');

// Read Sort console
const sortPath = path.join(REPORT_DIR, 'LibraryWeb_Report_Sort_888_console.json');
const sortData = JSON.parse(fs.readFileSync(sortPath, 'utf8'));
const sortText = sortData.console;

console.log('1. Failed Detail Section:');
const sortLines = sortText.split('\n');
let inFailedDetail = false;
for (let i = 0; i < sortLines.length; i++) {
  if (sortLines[i].includes('Failed Detail')) {
    inFailedDetail = true;
    console.log(`   Found at line ${i}\n`);
    for (let j = i; j < Math.min(i + 10, sortLines.length); j++) {
      console.log(`   ${j}: ${sortLines[j]}`);
    }
    break;
  }
}

console.log('\n2. Test Regex Patterns:\n');

// Test file pattern
const FILE_RE = /^(specs\/[^\s]+\.spec\.js)\(\d+\s+failed\)/gm;
const fileMatches = [...sortText.matchAll(FILE_RE)];
console.log(`   File pattern matches: ${fileMatches.length}`);
if (fileMatches.length > 0) {
  console.log(`   First match: "${fileMatches[0][0]}"`);
}

// Test TC header pattern
const TC_RE = /\[(TC\d+[^\]]*)\]\s+([^:]+)/m;
const tcMatch = sortText.match(TC_RE);
console.log(`\n   TC pattern match: ${tcMatch ? 'YES' : 'NO'}`);
if (tcMatch) {
  console.log(`   TC ID: ${tcMatch[1]}`);
  console.log(`   TC Name: ${tcMatch[2]}`);
}

// Test run pattern
const RUN_RE = /[✗�]+\s+(run_\d+)/g;
const runMatches = [...sortText.matchAll(RUN_RE)];
console.log(`\n   Run pattern matches: ${runMatches.length}`);
if (runMatches.length > 0) {
  console.log(`   Runs found: ${runMatches.map(m => m[1]).join(', ')}`);
}

console.log('\n3. Extract TC Header Manually:\n');
const tcHeaderLine = sortLines.find(line => line.includes('[TC'));
if (tcHeaderLine) {
  console.log(`   Raw line: "${tcHeaderLine}"`);
  console.log(`   Hex codes: ${[...tcHeaderLine.substring(0, 50)].map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
  
  // Test various regex patterns
  const patterns = [
    { name: 'Current V2', regex: /\[(TC\d+[^\]]*)\]\s+([^:]+)/m },
    { name: 'Original V1', regex: /^\[?(TC\d+)\]?\s+(.+?)\s*:/m },
    { name: 'Flexible', regex: /\[?(TC\d+[^\]]*)\]?\s+(.+?):/m },
    { name: 'No colon', regex: /\[(TC\d+[^\]]*)\]\s+([^:\n]+)/m }
  ];
  
  console.log('\n   Testing patterns:');
  patterns.forEach(({ name, regex }) => {
    const match = tcHeaderLine.match(regex);
    console.log(`   - ${name}: ${match ? `✓ (${match[1]}, ${match[2]})` : '✗'}`);
  });
}

console.log('\n4. Full Parser Test:\n');
const { extractFailuresFromLog } = require('./parser_v2');
const failures = extractFailuresFromLog(sortText);
console.log(`   Failures extracted: ${failures.length}`);
if (failures.length > 0) {
  console.log(`   First: ${JSON.stringify(failures[0], null, 2)}`);
}

console.log('\n===== Subtotals Job Diagnostic =====\n');

// Same for Subtotals
const subtotalsPath = path.join(REPORT_DIR, 'LibraryWeb_Report_Subtotals_919_console.json');
const subtotalsData = JSON.parse(fs.readFileSync(subtotalsPath, 'utf8'));
const subtotalsText = subtotalsData.console;

const subtotalsLines = subtotalsText.split('\n');
const tcSubtotalsLine = subtotalsLines.find(line => line.includes('[TC'));
if (tcSubtotalsLine) {
  console.log(`TC Header: "${tcSubtotalsLine}"`);
  const tcMatch2 = tcSubtotalsLine.match(/\[(TC\d+[^\]]*)\]\s+([^:]+)/m);
  console.log(`Match: ${tcMatch2 ? `✓ (${tcMatch2[1]}, ${tcMatch2[2]})` : '✗'}`);
}

const subtotalsFailures = extractFailuresFromLog(subtotalsText);
console.log(`Failures extracted: ${subtotalsFailures.length}`);

console.log('\n===== Summary =====\n');
console.log(`Sort: ${failures.length} failures`);
console.log(`Subtotals: ${subtotalsFailures.length} failures`);
console.log(`\nIf both are 0, the issue is likely in TC header parsing or run block splitting.`);
