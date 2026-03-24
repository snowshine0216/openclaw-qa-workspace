#!/usr/bin/env node

/**
 * Internal LLM-backed benchmark executor for qa-plan-v2.
 * Public callers should invoke benchmark-runner.mjs.
 *
 * Direct usage:
 *   node benchmark-runner-llm.mjs --request <execution_request.json> [--model <name>]
 *
 * Reads LLM config from .env (skill root) via loadEnv:
 *   OPENAI_API_KEY or ANTHROPIC_API_KEY or GEMINI_API_KEY
 *   LLM_API_BASE_URL  (optional — redirect to any OpenAI-compatible endpoint)
 *   BENCHMARK_LLM_MODEL, BENCHMARK_LLM_MAX_TOKENS  (optional overrides)
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadEnv } from './lib/loadEnv.mjs';
import { buildBenchmarkRunnerPrompt } from './lib/benchmarkRunnerPrompt.mjs';
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

function buildSystemPrompt() {
  return [
    'You are executing a QA plan benchmark case for the qa-plan-orchestrator skill.',
    'Work only with the provided benchmark evidence.',
    'Produce both benchmark artifacts as strings.',
    'Return ONLY valid JSON with this exact shape:',
    '{"result_md":"<markdown for ./outputs/result.md>","execution_notes_md":"<markdown for ./outputs/execution_notes.md, including evidence used, files produced, and blockers>"}',
    'Do not wrap the JSON in markdown fences.',
  ].join('\n');
}

function tryParseStructuredResponse(content) {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed?.result_md !== 'string') {
      return null;
    }
    return {
      resultMd: parsed.result_md.trim(),
      executionNotesMd: typeof parsed.execution_notes_md === 'string'
        ? parsed.execution_notes_md.trim()
        : '',
    };
  } catch {
    return null;
  }
}

function extractFirstMarkdownFence(content) {
  const fenceMatch = content.match(/```(?:markdown)?\n([\s\S]+?)```/);
  return fenceMatch
    ? {
      fencedContent: fenceMatch[1].trim(),
      fullMatch: fenceMatch[0],
    }
    : null;
}

function parseRunnerArtifacts(content) {
  const structured = tryParseStructuredResponse(content);
  if (structured) {
    return structured;
  }

  const fenced = extractFirstMarkdownFence(content);
  if (fenced) {
    return {
      resultMd: fenced.fencedContent,
      executionNotesMd: content.replace(fenced.fullMatch, '').trim(),
    };
  }

  return {
    resultMd: content.trim(),
    executionNotesMd: '',
  };
}

function normalizeExecutionNotes(executionNotesMd) {
  const trimmed = String(executionNotesMd || '').trim();
  if (!trimmed) {
    return '# Execution Notes';
  }
  if (/^#\s+execution notes\b/i.test(trimmed)) {
    return trimmed;
  }
  return `# Execution Notes\n\n${trimmed}`;
}

function buildRuntimeMetadataSection({ durationMs, usage, configurationDir }) {
  return [
    '## Runtime Metadata',
    '',
    `- executor: benchmark-runner-llm`,
    `- duration_ms: ${durationMs}`,
    `- total_tokens: ${usage.total_tokens}`,
    `- configuration: ${configurationDir}`,
  ].join('\n');
}

function buildExecutionNotesDocument({ executionNotesMd, durationMs, usage, configurationDir }) {
  return [
    normalizeExecutionNotes(executionNotesMd),
    '',
    buildRuntimeMetadataSection({ durationMs, usage, configurationDir }),
  ].join('\n').trim();
}

export async function runBenchmarkRunnerCli(argv = process.argv) {
  const options = parseArgs(argv);
  const request = JSON.parse(await readFile(options.requestPath, 'utf8'));

  const outputDir = request.run.output_dir;
  await mkdir(outputDir, { recursive: true });

  const prompt = await buildBenchmarkRunnerPrompt(request);
  const systemPrompt = buildSystemPrompt();

  const startedAt = Date.now();
  const { content, usage } = await callLlm({
    prompt,
    systemPrompt,
    model: options.model,
    jsonMode: true,
  });
  const durationMs = Date.now() - startedAt;
  const artifacts = parseRunnerArtifacts(content);

  // Write result.md
  const resultPath = join(outputDir, 'result.md');
  await writeFile(resultPath, artifacts.resultMd, 'utf8');

  // Write execution_notes.md
  const notesPath = join(outputDir, 'execution_notes.md');
  await writeFile(
    notesPath,
    buildExecutionNotesDocument({
      executionNotesMd: artifacts.executionNotesMd,
      durationMs,
      usage,
      configurationDir: request.run.configuration_dir,
    }),
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

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedPath && currentPath === executedPath) {
  runBenchmarkRunnerCli(process.argv).catch((error) => {
    console.error(`[benchmark-runner-llm.mjs] ${error.message}`);
    process.exitCode = 1;
  });
}
