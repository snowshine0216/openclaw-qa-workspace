import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const RUNNER = join(
  __dirname,
  '../benchmarks/qa-plan-v2/scripts/benchmark-runner.mjs',
);
const GRADER = join(
  __dirname,
  '../benchmarks/qa-plan-v2/scripts/benchmark-grader.mjs',
);

test('benchmark-runner delegates to the LLM backend through the public wrapper', async () => {
  const content = await readFile(RUNNER, 'utf8');

  assert.match(content, /runBenchmarkRunnerCli/);
  assert.match(content, /benchmark-runner-llm\.mjs/);
  assert.match(content, /\[benchmark-runner\.mjs\]/);
});

test('benchmark-grader delegates to the LLM backend through the public wrapper', async () => {
  const content = await readFile(GRADER, 'utf8');

  assert.match(content, /runBenchmarkGraderCli/);
  assert.match(content, /benchmark-grader-llm\.mjs/);
  assert.match(content, /\[benchmark-grader\.mjs\]/);
});
