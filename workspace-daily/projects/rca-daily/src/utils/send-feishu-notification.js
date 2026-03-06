#!/usr/bin/env node

/**
 * Send Feishu notification for daily RCA check via OpenClaw message tool
 * Usage: node send-feishu-notification.js <summary-file> <chat-id>
 */

const fs = require('fs');
const { execSync } = require('child_process');

const validateArguments = () => {
  if (process.argv.length < 4) {
    throw new Error('Usage: node send-feishu-notification.js <summary-file> <chat-id>');
  }
  return {
    summaryFile: process.argv[2],
    chatId: process.argv[3]
  };
};

const readSummaryFile = (summaryFile) => {
  if (!fs.existsSync(summaryFile)) {
    throw new Error(`Summary file not found: ${summaryFile}`);
  }
  return fs.readFileSync(summaryFile, 'utf8');
};

const sendNotificationWithClaw = (chatId, summary, summaryFile) => {
  console.log(`Sending Feishu notification to ${chatId}...`);
  console.log(`Message length: ${summary.length} characters`);
  console.log('');
  
  // Escape special characters for shell
  const escapedSummary = summary.replace(/'/g, "'\\''");
  const command = `openclaw message send --channel feishu --target '${chatId}' --message '${escapedSummary}'`;
  
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
};

const main = () => {
  let summaryFile = '';
  try {
    const { summaryFile: sFile, chatId } = validateArguments();
    summaryFile = sFile;
    
    const summary = readSummaryFile(summaryFile);
    sendNotificationWithClaw(chatId, summary, summaryFile);
    
  } catch (error) {
    console.error(`❌ Failed to send notification: ${error.message}`);
    console.error('');
    console.log('Fallback: Log summary to console');
    console.log('');
    
    if (summaryFile) {
      try {
        const summary = fs.readFileSync(summaryFile, 'utf8');
        console.log('--- Summary Content ---');
        console.log(summary);
        console.log('--- End Summary ---');
      } catch (readError) {
        console.error(`Cannot read summary file: ${readError.message}`);
      }
    }
    
    process.exit(1);
  }
};

main();
