#!/usr/bin/env node

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_CODEX_MODEL,
  extractTotalTokens,
  finalizeOutputs,
  materializeRequestWorkspace,
  runCodexExec,
  writeRuntimeLogs,
} from './lib/codexBenchmarkRuntime.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    requestPath: '',
    model: DEFAULT_CODEX_MODEL,
  };

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--request' && args[index + 1]) {
      options.requestPath = args[index + 1];
      index += 1;
    } else if (value === '--model' && args[index + 1]) {
      options.model = args[index + 1];
      index += 1;
    }
  }

  if (!options.requestPath) {
    throw new Error('Missing required --request <path> argument.');
  }

  return options;
}

function buildPrompt(request) {
  const common = [
    `You are executing benchmark case ${request.case_id} for qa-plan-orchestrator.`,
    `Feature: ${request.feature_id}.`,
    `Feature family: ${request.feature_family}.`,
    `Primary phase/checkpoint under test: ${request.primary_phase}.`,
    `Evidence mode: ${request.evidence_mode}.`,
    `Configuration: ${request.run.configuration_dir}.`,
    '',
    'Rules:',
    '- Work only inside this temporary workspace.',
    '- Use only copied benchmark evidence under ./inputs/fixtures/.',
    '- Do not use any external web access.',
    '- Save the main deliverable to ./outputs/result.md.',
    '- Save any supporting artifacts only under ./outputs/.',
    '- Save a concise ./outputs/execution_notes.md with evidence used, files produced, and blockers.',
    '',
    `Benchmark prompt: ${request.prompt}`,
    '',
    'Benchmark expectations:',
    ...request.expectations.map((line) => `- ${line}`),
    '',
  ];

  if (request.run.configuration_dir === 'with_skill') {
    common.push(
      'Use the qa-plan-orchestrator skill snapshot under ./skill_snapshot as the authoritative workflow package.',
      'Read ./skill_snapshot/SKILL.md and the minimum required companion references needed for this case before producing outputs.',
    );
  } else {
    common.push(
      'Do not read or use qa-plan-orchestrator skill files or any other skill package.',
      'Solve this baseline run from the benchmark prompt and copied fixtures only.',
    );
  }

  common.push('', 'Reply with a brief execution summary after writing the files.');
  return `${common.join('\n')}\n`;
}

async function main() {
  const options = parseArgs(process.argv);
  const request = JSON.parse(await (await import('node:fs/promises')).readFile(options.requestPath, 'utf8'));
  const workspace = await materializeRequestWorkspace({
    request,
    requestPath: options.requestPath,
    workspacePrefix: 'qa-plan-benchmark-runner-',
    includeSkillSnapshot: request.run.configuration_dir === 'with_skill',
  });
  const prompt = buildPrompt(request);
  const lastMessagePath = join(workspace.workspaceDir, 'codex_last_message.md');
  const codexResult = await runCodexExec({
    workdir: workspace.workspaceDir,
    prompt,
    outputLastMessagePath: lastMessagePath,
    model: options.model,
  });

  const debugDir = join(request.run.run_dir, 'codex_runner_debug');
  await writeRuntimeLogs({
    destinationDir: debugDir,
    prompt,
    stdout: codexResult.stdout,
    stderr: codexResult.stderr,
    lastMessagePath,
  });

  if (codexResult.code !== 0) {
    throw new Error(`codex exec failed with exit code ${codexResult.code}`);
  }

  const totalTokens = extractTotalTokens(codexResult.stdout);
  await finalizeOutputs({
    sourceOutputsDir: workspace.outputsDir,
    destinationOutputsDir: request.run.output_dir,
    fallbackResultPath: 'Benchmark runner completed without a written result artifact.',
    lastMessagePath,
    metrics: {
      total_tokens: totalTokens,
      model: options.model || DEFAULT_CODEX_MODEL || null,
      duration_ms: codexResult.durationMs,
    },
  });

  console.log(`RUNNER_COMPLETE: ${request.run.output_dir}`);
}

main().catch((error) => {
  const scriptName = join(__dirname, 'benchmark-runner.mjs');
  console.error(`[${scriptName}] ${error.message}`);
  process.exitCode = 1;
});
