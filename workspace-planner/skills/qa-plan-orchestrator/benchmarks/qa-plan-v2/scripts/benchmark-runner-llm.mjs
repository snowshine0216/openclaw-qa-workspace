#!/usr/bin/env node

/**
 * Autonomous LLM-backed benchmark executor for qa-plan-v2.
 * Replaces benchmark-runner.mjs (Codex-only) and benchmark-runner-ide-wait.mjs (human-in-loop).
 *
 * Usage:
 *   node benchmark-runner-llm.mjs --request <execution_request.json>
 *
 * Reads LLM config from environment (.env loaded by caller via --env-file):
 *   OPENAI_API_KEY or ANTHROPIC_API_KEY or GEMINI_API_KEY
 *   LLM_API_BASE_URL  (optional — redirect to any OpenAI-compatible endpoint)
 *   BENCHMARK_LLM_MODEL, BENCHMARK_LLM_MAX_TOKENS  (optional overrides)
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { materializeRequestWorkspace, finalizeOutputs, writeJson } from './lib/codexBenchmarkRuntime.mjs';
import { callLlm } from './lib/llmApiClient.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = { requestPath: '' };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--request' && args[i + 1]) {
      options.requestPath = args[i + 1];
      i += 1;
    }
  }
  if (!options.requestPath) {
    throw new Error('Missing required --request <path> argument.');
  }
  return options;
}

function buildSystemPrompt() {
  return [
    'You are executing a QA plan benchmark case for the qa-plan-orchestrator skill.',
    'Work only with the provided benchmark evidence.',
    'Save the main deliverable to ./outputs/result.md.',
    'Save a concise ./outputs/execution_notes.md with evidence used, files produced, and blockers.',
    'Reply with the full content of result.md followed by a brief execution summary.',
  ].join('\n');
}

function buildPrompt(request) {
  const lines = [
    `Benchmark case: ${request.case_id}`,
    `Feature: ${request.feature_id}`,
    `Feature family: ${request.feature_family}`,
    `Primary phase under test: ${request.primary_phase}`,
    `Evidence mode: ${request.evidence_mode}`,
    `Configuration: ${request.run.configuration_dir}`,
    '',
    'Rules:',
    '- Use only the benchmark evidence listed below.',
    '- Save the main deliverable to ./outputs/result.md.',
    '- Save ./outputs/execution_notes.md with: evidence used, files produced, blockers.',
    '',
    `Benchmark prompt:\n${request.prompt}`,
    '',
    'Expectations:',
    ...request.expectations.map((e) => `- ${e}`),
    '',
  ];

  if (request.run.configuration_dir === 'with_skill') {
    lines.push(
      'Use the qa-plan-orchestrator skill snapshot (./skill_snapshot/SKILL.md) as the authoritative workflow package.',
      'Read SKILL.md and minimum required companion references before producing outputs.',
    );
  } else {
    lines.push(
      'Do not use any qa-plan-orchestrator skill files.',
      'Produce the baseline output from the benchmark prompt and fixtures only.',
    );
  }

  if (request.fixtures && request.fixtures.length > 0) {
    lines.push('', 'Available fixtures:');
    for (const fixture of request.fixtures) {
      lines.push(`- ${fixture.fixture_id}: ${fixture.local_path || '(no local path)'}`);
    }
  }

  lines.push('', 'Write result.md first, then a short execution summary.');
  return lines.join('\n');
}

function extractResultMd(content) {
  // If the response contains a markdown code block, extract that
  const fenceMatch = content.match(/```(?:markdown)?\n([\s\S]+?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  // Otherwise treat whole response as result
  return content.trim();
}

async function main() {
  const options = parseArgs(process.argv);
  const request = JSON.parse(await readFile(options.requestPath, 'utf8'));

  const outputDir = request.run.output_dir;
  await mkdir(outputDir, { recursive: true });

  const prompt = buildPrompt(request);
  const systemPrompt = buildSystemPrompt();

  const startedAt = Date.now();
  const { content, usage } = await callLlm({ prompt, systemPrompt });
  const durationMs = Date.now() - startedAt;

  // Write result.md
  const resultPath = join(outputDir, 'result.md');
  await writeFile(resultPath, extractResultMd(content), 'utf8');

  // Write execution_notes.md
  const notesPath = join(outputDir, 'execution_notes.md');
  await writeFile(
    notesPath,
    [
      '# Execution Notes',
      '',
      `- executor: benchmark-runner-llm`,
      `- duration_ms: ${durationMs}`,
      `- total_tokens: ${usage.total_tokens}`,
      `- configuration: ${request.run.configuration_dir}`,
    ].join('\n'),
    'utf8',
  );

  // Write metrics.json
  const metricsPath = request.run.metrics_path || join(outputDir, 'metrics.json');
  await writeJson(metricsPath, {
    total_tokens: usage.total_tokens,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    duration_ms: durationMs,
    executor: 'benchmark-runner-llm',
  });

  console.log(`RUNNER_COMPLETE: ${outputDir}`);
}

main().catch((error) => {
  console.error(`[benchmark-runner-llm.mjs] ${error.message}`);
  process.exitCode = 1;
});
