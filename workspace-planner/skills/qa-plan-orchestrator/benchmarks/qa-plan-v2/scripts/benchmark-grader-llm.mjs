#!/usr/bin/env node

/**
 * Internal LLM-backed benchmark grader for qa-plan-v2.
 * Public callers should invoke benchmark-grader.mjs.
 *
 * Direct usage:
 *   node benchmark-grader-llm.mjs --request <execution_request.json> [--model <name>]
 *
 * Reads LLM config from .env (skill root) via loadEnv:
 *   OPENAI_API_KEY or ANTHROPIC_API_KEY or GEMINI_API_KEY
 *   LLM_API_BASE_URL  (optional — redirect to any OpenAI-compatible endpoint)
 *   BENCHMARK_LLM_MODEL, BENCHMARK_LLM_MAX_TOKENS  (optional overrides)
 */

import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadEnv } from './lib/loadEnv.mjs';
import { parseGradingResponse } from './lib/benchmarkGraderResponse.mjs';
import { writeJson } from './lib/codexBenchmarkRuntime.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
loadEnv(join(__dirname, '../../..'));
import { callLlm } from './lib/llmApiClient.mjs';

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    requestPath: '',
    model: '',
  };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--request' && args[i + 1]) {
      options.requestPath = args[i + 1];
      i += 1;
    } else if (args[i] === '--model' && args[i + 1]) {
      options.model = args[i + 1];
      i += 1;
    }
  }
  if (!options.requestPath) {
    throw new Error('Missing required --request <path> argument.');
  }
  return options;
}

async function readOutputsCorpus(outputsDir) {
  const entries = await readdir(outputsDir, { withFileTypes: true }).catch(() => []);
  const parts = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = extname(entry.name).toLowerCase();
    if (!['.md', '.txt', '.json'].includes(ext)) continue;
    const content = await readFile(join(outputsDir, entry.name), 'utf8').catch(() => '');
    parts.push(`=== ${entry.name} ===\n${content}`);
  }
  return parts.join('\n\n');
}

function buildGradingPrompt(request, outputsCorpus) {
  const expectationLines = (request.expectations || []).map((text, index) => `- exp-${index + 1}: ${text}`);
  return [
    'You are grading a qa-plan-orchestrator benchmark run.',
    'Evaluate every expectation listed below against the output files provided.',
    '',
    `Case: ${request.case_id}`,
    `Configuration: ${request.run.configuration_dir}`,
    `Evidence mode: ${request.evidence_mode || ''}`,
    '',
    'Expectations:',
    ...expectationLines,
    '',
    '=== OUTPUT FILES ===',
    outputsCorpus || '(no output files found)',
    '',
    'Return one result per expectation and preserve the provided expectation id in each result.',
    'Respond with ONLY valid JSON matching this schema exactly:',
    JSON.stringify({
      expectations: [
        { id: 'exp-1', text: '<expectation text>', passed: true, evidence: '<quote or reasoning>' },
      ],
      summary: { passed: 0, failed: 0, total: 0, pass_rate: 0.0 },
    }, null, 2),
  ].join('\n');
}

export async function runBenchmarkGraderCli(argv = process.argv) {
  const options = parseArgs(argv);
  const request = JSON.parse(await readFile(options.requestPath, 'utf8'));

  const outputsDir = request.run.output_dir;
  const outputsCorpus = await readOutputsCorpus(outputsDir);

  const prompt = buildGradingPrompt(request, outputsCorpus);
  const { content } = await callLlm({
    prompt,
    jsonMode: true,
    model: options.model,
  });

  const grading = parseGradingResponse(content, request.expectations || []);
  await writeJson(request.run.grading_path, grading);
  await writeJson(
    join(outputsDir, 'grading_summary.md'),
    undefined, // not json — write text below
  ).catch(() => {});
  // Write readable summary alongside grading.json
  const { passed, failed, total, pass_rate } = grading.summary;
  const summaryText = `pass_rate: ${pass_rate}\npassed: ${passed}\nfailed: ${failed}\ntotal: ${total}\n`;
  const { writeFile } = await import('node:fs/promises');
  await writeFile(join(outputsDir, 'grading_summary.md'), summaryText, 'utf8');

  console.log(`GRADER_COMPLETE: ${request.run.grading_path}`);
}

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedPath && currentPath === executedPath) {
  runBenchmarkGraderCli(process.argv).catch((error) => {
    console.error(`[benchmark-grader-llm.mjs] ${error.message}`);
    process.exitCode = 1;
  });
}
