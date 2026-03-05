#!/usr/bin/env node

/**
 * Send Feishu notification for daily RCA check via OpenClaw message tool
 * Usage: node send-feishu-notification.js <summary-file> <chat-id>
 */

const fs = require('fs');
const { execSync } = require('child_process');

if (process.argv.length < 4) {
  console.error('Usage: node send-feishu-notification.js <summary-file> <chat-id>');
  process.exit(1);
}

const summaryFile = process.argv[2];
const chatId = process.argv[3];

try {
  // Read summary content
  if (!fs.existsSync(summaryFile)) {
    console.error(`❌ Summary file not found: ${summaryFile}`);
    process.exit(1);
  }
  
  const summary = fs.readFileSync(summaryFile, 'utf8');
  
  console.log(`Sending Feishu notification to ${chatId}...`);
  console.log(`Message length: ${summary.length} characters`);
  console.log('');
  
  // Use OpenClaw CLI to send message
  // Escape special characters for shell
  const escapedSummary = summary.replace(/'/g, "'\\''");
  
  const command = `openclaw message send --channel feishu --target '${chatId}' --message '${escapedSummary}'`;
  
  // Execute command
  try {
    execSync(command, { 
      stdio: 'inherit',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large messages
    });
    
    console.log('');
    console.log('✅ Feishu notification sent successfully');
    
  } catch (execError) {
    console.error('');
    console.error('❌ OpenClaw CLI failed. Falling back to logging...');
    console.error('');
    console.log('--- Summary Content ---');
    console.log(summary);
    console.log('--- End Summary ---');
    console.log('');
    console.log(`Manual send command:`);
    console.log(`openclaw message send --channel feishu --target ${chatId} --message "$(cat ${summaryFile})"`);
  }
  
} catch (error) {
  console.error(`❌ Failed to send notification: ${error.message}`);
  console.error('');
  console.log('Fallback: Log summary to console');
  console.log('');
  
  try {
    const summary = fs.readFileSync(summaryFile, 'utf8');
    console.log('--- Summary Content ---');
    console.log(summary);
    console.log('--- End Summary ---');
  } catch (readError) {
    console.error(`Cannot read summary file: ${readError.message}`);
  }
  
  process.exit(1);
}
