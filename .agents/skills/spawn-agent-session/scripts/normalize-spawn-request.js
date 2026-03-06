#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { normalizeSpawnInput } = require('./lib/normalize-spawn-request');

const ALLOWED_FLAGS = new Set([
  '--agent-id',
  '--mode',
  '--runtime',
  '--task-template',
  '--label-template',
  '--thread',
]);

const usage = () => 'Usage: node normalize-spawn-request.js <input-file> [--agent-id <id>] [--mode <mode>] [--runtime <runtime>] [--task-template <template>] [--label-template <template>] [--thread <true|false>]';

const parseThread = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error('--thread must be true or false');
};

const optionKey = (flag) => flag.replace(/^--/, '').replace(/-([a-z])/g, (_, char) => char.toUpperCase());

const readFlagValue = (argv, index, flag) => {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }

  return value;
};

const assertAllowedFlag = (flag) => {
  if (!ALLOWED_FLAGS.has(flag)) {
    throw new Error(`Unsupported flag: ${flag}`);
  }
};

const parseArgs = (argv) => {
  if (argv.length === 0) {
    throw new Error(usage());
  }

  const [inputPath, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];
    if (!flag.startsWith('--')) {
      throw new Error(`Unexpected argument: ${flag}`);
    }

    assertAllowedFlag(flag);
    const value = readFlagValue(rest, index, flag);
    options[optionKey(flag)] = flag === '--thread' ? parseThread(value) : value;
    index += 1;
  }

  return { inputPath, options };
};

const readJsonFile = (inputPath) => {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${inputPath}: ${error.message}`);
  }
};

const main = () => {
  try {
    const { inputPath, options } = parseArgs(process.argv.slice(2));
    const resolvedPath = path.resolve(inputPath);
    const input = readJsonFile(resolvedPath);
    const normalized = normalizeSpawnInput(input, options);
    process.stdout.write(`${JSON.stringify(normalized, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
};

main();
