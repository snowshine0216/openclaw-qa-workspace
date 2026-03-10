#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { normalizeSpawnInput } = require(path.join(
  __dirname,
  '../../../../../.agents/skills/spawn-agent-session/scripts/lib/normalize-spawn-request.js',
));

class CliError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

function usage() {
  return [
    'Usage: generate-rcas-via-agent.js --manifest <path> --output <path> [options]',
    'Options:',
    '  --bridge-module <path>  Spawn bridge module path (or use RCA_ORCHESTRATOR_SPAWN_BRIDGE)',
    '  --agent-id <id>         Default: reporter',
    '  --mode <mode>           Default: run',
    '  --runtime <runtime>     Default: subagent',
    '  --batch-size <n>        Default: 5',
  ].join('\n');
}

function readOptionValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new CliError(`Missing value for ${flag}\n${usage()}`);
  }
  return value;
}

function parseArgs(argv) {
  const options = {
    manifest: '',
    output: '',
    bridgeModule: process.env.RCA_ORCHESTRATOR_SPAWN_BRIDGE || '',
    agentId: 'reporter',
    mode: 'run',
    runtime: 'subagent',
    batchSize: 5,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--manifest') { options.manifest = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--output') { options.output = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--bridge-module') { options.bridgeModule = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--agent-id') { options.agentId = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--mode') { options.mode = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--runtime') { options.runtime = readOptionValue(argv, index, arg); index += 1; continue; }
    if (arg === '--batch-size') { options.batchSize = Number(readOptionValue(argv, index, arg)); index += 1; continue; }
    if (arg === '--help' || arg === '-h') { throw new CliError(usage(), 0); }
    throw new CliError(`Unknown argument: ${arg}\n${usage()}`);
  }

  if (!options.manifest || !options.output) {
    throw new CliError(`Missing required arguments\n${usage()}`);
  }
  if (!Number.isInteger(options.batchSize) || options.batchSize <= 0) {
    throw new CliError('batch-size must be a positive integer');
  }
  return options;
}

function readJsonFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new CliError(`${label} not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function taskTemplate() {
  return [
    'Generate RCA for {{issue_key}}.',
    'Read skill instructions from: .agents/skills/rca/SKILL.md',
    'Input JSON: {{input_file}}',
    'Output RCA to: {{output_file}}',
    'Announce: "RCA complete: {{issue_key}}" on success or "RCA failed: {{issue_key}}" on failure.',
  ].join('\n');
}

function toLegacyManifest(manifest) {
  return {
    rca_inputs: (manifest.rca_inputs || []).map((entry) => ({
      issue_key: entry.issue_key,
      input_file: entry.rca_input_file || entry.input_file,
      output_file: entry.output_file,
    })),
  };
}

function chunkRequests(requests, batchSize) {
  const batches = [];
  for (let index = 0; index < requests.length; index += batchSize) {
    batches.push(requests.slice(index, index + batchSize));
  }
  return batches;
}

function loadBridge(bridgeModule) {
  if (!bridgeModule) {
    throw new CliError('Missing spawn bridge. Set RCA_ORCHESTRATOR_SPAWN_BRIDGE or pass --bridge-module.');
  }
  const resolvedPath = path.isAbsolute(bridgeModule) ? bridgeModule : path.resolve(process.cwd(), bridgeModule);
  const loaded = require(resolvedPath);
  const spawnBatch = typeof loaded === 'function' ? loaded : loaded.spawnBatch;
  if (typeof spawnBatch !== 'function') {
    throw new CliError(`Spawn bridge must export spawnBatch(requests, context): ${resolvedPath}`);
  }
  return { spawnBatch, resolvedPath };
}

function isoNow() {
  return new Date().toISOString();
}

function normalizeResult(rawResult, request) {
  if (!rawResult || typeof rawResult !== 'object') {
    throw new CliError(`Spawn bridge returned invalid result for ${request.request.label}`);
  }

  return {
    issue_key: rawResult.issue_key || request.source.issue_key,
    label: rawResult.label || request.request.label,
    status: rawResult.status || 'failed',
    started_at: rawResult.started_at || isoNow(),
    finished_at: rawResult.finished_at || isoNow(),
    output_file: rawResult.output_file || request.handoff.result_contract.expected_outputs[0] || '',
    session_id: rawResult.session_id || null,
    session_error: rawResult.session_error || null,
  };
}

async function runBatches(requests, bridge, options, manifest) {
  const results = [];
  const batches = chunkRequests(requests, options.batchSize);

  for (let index = 0; index < batches.length; index += 1) {
    const batch = batches[index];
    const batchResults = await bridge.spawnBatch(batch, {
      batchIndex: index,
      batchSize: options.batchSize,
      totalBatches: batches.length,
      manifest,
      outputPath: options.output,
    });

    if (!Array.isArray(batchResults) || batchResults.length !== batch.length) {
      throw new CliError(`Spawn bridge returned ${Array.isArray(batchResults) ? batchResults.length : 'non-array'} results for batch ${index + 1}`);
    }

    batchResults.forEach((item, itemIndex) => {
      results.push(normalizeResult(item, batch[itemIndex]));
    });
  }

  return results;
}

async function main(argv) {
  const options = parseArgs(argv);
  const manifest = readJsonFile(options.manifest, 'Manifest file');
  const bridge = loadBridge(options.bridgeModule);
  const normalized = normalizeSpawnInput(toLegacyManifest(manifest), {
    agentId: options.agentId,
    mode: options.mode,
    runtime: options.runtime,
    taskTemplate: taskTemplate(),
    labelTemplate: 'rca-{{issue_key}}',
    attachmentName: 'rca-input.json',
    thread: false,
  });

  const results = await runBatches(normalized.requests, bridge, options, manifest);
  const output = {
    generated_at: isoNow(),
    total_issues: results.length,
    bridge_module: bridge.resolvedPath,
    results,
  };

  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => process.exit(0))
    .catch((error) => {
      if (error instanceof CliError) {
        const writer = error.exitCode === 0 ? console.log : console.error;
        writer(error.message);
        process.exit(error.exitCode);
      }
      console.error(error.stack || error.message);
      process.exit(1);
    });
}

module.exports = {
  chunkRequests,
  loadBridge,
  normalizeResult,
  parseArgs,
  taskTemplate,
  toLegacyManifest,
};
