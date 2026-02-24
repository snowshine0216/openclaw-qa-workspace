#!/usr/bin/env node
/**
 * Test Parser V2 with Real Console Log
 * Fetches build 2201 console log and tests the new parser
 */

const { extractFailuresFromLog } = require('./parser_v2');
const https = require('https');
const http = require('http');

const CONSOLE_URL = 'http://tec-l-1081462.labs.microstrategy.com:8080/view/CustomAppWebTest/job/LibraryWeb_CustomApp_Pipeline/2201/consoleText';

async function fetchConsoleLog(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  console.log('🧪 Testing Parser V2 with Real Console Log\n');
  console.log(`📥 Fetching console log from build 2201...`);
  
  try {
    const consoleText = await fetchConsoleLog(CONSOLE_URL);
    console.log(`✅ Fetched ${consoleText.length} bytes\n`);
    
    console.log('🔍 Parsing failures...');
    const failures = extractFailuresFromLog(consoleText);
    
    console.log(`\n📊 Results: Found ${failures.length} unique failures\n`);
    
    failures.forEach((failure, idx) => {
      console.log(`${idx + 1}. ${failure.tcId} - ${failure.tcName}`);
      console.log(`   File: ${failure.fileName}`);
      console.log(`   Step: ${failure.stepId} - ${failure.stepName}`);
      console.log(`   Retries: ${failure.retryCount}x`);
      console.log(`   Type: ${failure.failureType}`);
      console.log(`   Snapshot: ${failure.snapshotUrl ? '✓' : '✗'}`);
      console.log(`   Full Error: ${failure.fullErrorMsg ? failure.fullErrorMsg.substring(0, 80) + '...' : 'N/A'}`);
      console.log('');
    });
    
    // Validation
    console.log('✅ Validation:');
    const hasFileNames = failures.every(f => f.fileName && f.fileName !== 'unknown.spec.js');
    const hasRetries = failures.some(f => f.retryCount > 1);
    const hasFullErrors = failures.every(f => f.fullErrorMsg && f.fullErrorMsg.length > 0);
    
    console.log(`   - File names extracted: ${hasFileNames ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Retries deduplicated: ${hasRetries ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Full errors captured: ${hasFullErrors ? '✅ YES' : '❌ NO'}`);
    
    if (hasFileNames && hasRetries && hasFullErrors) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log('\n⚠️  Some validations failed - review output above');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  test();
}

module.exports = { test };
