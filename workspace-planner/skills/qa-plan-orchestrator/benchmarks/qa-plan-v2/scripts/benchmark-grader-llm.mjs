#!/usr/bin/env node

/**
 * Autonomous LLM-backed benchmark grader for qa-plan-v2.
 * Replaces benchmark-grader.mjs (Codex-only).
 *
 * Usage:
 *   node benchmark-grader-llm.mjs --request <execution_request.json>
 *
 * Reads LLM config from environment (.env loaded by caller via --env-file):
 *   OPENAI_API_KEY or ANTHROPIC_API_KEY or GEMINI_API_KEY
 *   LLM_API_BASE_URL  (optional — redirect to any OpenAI-compatible endpoint)
 *   BENCHMARK_LLM_MODEL, BENCHMARK_LLM_MAX_TOKENS  (optional overrides)
 */

import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

import { writeJson } from './lib/codexBenchmarkRuntime.mjs';
import { callLlm } from './lib/llmApiClient.mjs';

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
  return [
    'You are grading a qa-plan-orchestrator benchmark run.',
    'Evaluate every expectation listed below against the output files provided.',
    '',
    `Case: ${request.case_id}`,
    `Configuration: ${request.run.configuration_dir}`,
    `Evidence mode: ${request.evidence_mode || ''}`,
    '',
    'Expectations:',
    ...request.expectations.map((e) => `- ${e}`),
    '',
    '=== OUTPUT FILES ===',
    outputsCorpus || '(no output files found)',
    '',
    'Respond with ONLY valid JSON matching this schema exactly:',
    JSON.stringify({
      expectations: [
        { text: '<expectation text>', passed: true, evidence: '<quote or reasoning>' },
      ],
      summary: { passed: 0, failed: 0, total: 0, pass_rate: 0.0 },
    }, null, 2),
  ].join('\n');
}

function parseGradingResponse(raw, expectations) {
  let parsed;
  try {
    // Strip markdown fences if present
    const jsonMatch = raw.match(/```(?:json)?\n?([\s\S]+?)```/) || raw.match(/(\{[\s\S]+\})/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[1] : raw);
  } catch {
    // Build a fallback grading so the pipeline doesn't halt on parse error
    const graded = expectations.map((text) => ({
      text,
      passed: false,
      evidence: 'Grader response was not valid JSON.',
    }));
    return {
      expectations: graded,
      summary: { passed: 0, failed: graded.length, total: graded.length, pass_rate: 0 },
      grader_parse_error: true,
      grader_raw_response: raw.slice(0, 2000),
    };
  }

  // Normalize summary in case model omits it
  const graded = parsed.expectations || [];
  const passed = graded.filter((e) => e.passed).length;
  const total = graded.length;
  return {
    expectations: graded,
    summary: {
      passed,
      failed: total - passed,
      total,
      pass_rate: total === 0 ? 1 : Number((passed / total).toFixed(4)),
    },
    ...parsed,
  };
}

async function main() {
  const options = parseArgs(process.argv);
  const request = JSON.parse(await readFile(options.requestPath, 'utf8'));

  const outputsDir = request.run.output_dir;
  const outputsCorpus = await readOutputsCorpus(outputsDir);

  const prompt = buildGradingPrompt(request, outputsCorpus);
  const { content } = await callLlm({ prompt, jsonMode: true });

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

main().catch((error) => {
  console.error(`[benchmark-grader-llm.mjs] ${error.message}`);
  process.exitCode = 1;
});
