#!/usr/bin/env node

const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

function usageText() {
  return 'Usage: send-feishu-notification.js --chat-id <chat-id> (--file <path> | --message <text>)';
}

function fail(message) {
  throw new CliError(message);
}

function help() {
  throw new CliError(usageText(), 0);
}

function readOptionValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) fail(`Missing value for ${flag}\n${usageText()}`);
  return value;
}

function parseCliArgs(argv) {
  const options = { message: '', file: '', chatId: '', openclawBin: process.env.OPENCLAW_BIN || 'openclaw' };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--message') { options.message = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--file') { options.file = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--chat-id') { options.chatId = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--help' || arg === '-h') help();
    fail(`Unknown argument: ${arg}`);
  }

  if (!options.chatId) fail(`Missing required --chat-id\n${usageText()}`);
  if (!Boolean(options.file) === !Boolean(options.message)) fail('Choose exactly one of --file or --message');
  return options;
}

function readMessage(options) {
  if (options.message) return options.message;
  if (!fs.existsSync(options.file)) fail(`Message file not found: ${options.file}`);
  return fs.readFileSync(options.file, 'utf8');
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function buildManualCommand(chatId, message) {
  return `openclaw message send --channel feishu --target ${shellQuote(chatId)} --message ${shellQuote(message)}`;
}

function sendNotification(options, message) {
  const args = ['message', 'send', '--channel', 'feishu', '--target', options.chatId, '--message', message];
  execFileSync(options.openclawBin, args, { stdio: 'inherit', maxBuffer: 10 * 1024 * 1024 });
}

function runCli(argv) {
  try {
    const options = parseCliArgs(argv);
    const message = readMessage(options);

    try {
      sendNotification(options, message);
    } catch (error) {
      console.error('OpenClaw CLI failed. Manual send command:');
      console.error(buildManualCommand(options.chatId, message));
      console.error(error.message);
      return 1;
    }

    console.log('Feishu notification sent successfully');
    return 0;
  } catch (error) {
    if (error instanceof CliError) {
      const writer = error.exitCode === 0 ? console.log : console.error;
      writer(error.message);
      return error.exitCode;
    }
    console.error(error.message);
    return 1;
  }
}

if (require.main === module) {
  process.exit(runCli(process.argv.slice(2)));
}

module.exports = {
  buildManualCommand,
  parseCliArgs,
  readMessage,
  runCli,
  sendNotification,
  shellQuote,
  usageText,
};
