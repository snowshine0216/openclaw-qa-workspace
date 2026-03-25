import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildBaselineScriptArgs,
  ensurePrepared,
  resolveSkillRootForBenchmarkRoot,
} from '../benchmarks/qa-plan-v2/scripts/run_benchmark.mjs';

test('ensurePrepared invokes run_baseline directly when the spawn manifest is missing', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'benchmark-prepare-'));
  const benchRoot = join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'benchmarks', 'qa-plan-v2');
  const iterationDir = join(benchRoot, 'iteration-0');
  await mkdir(iterationDir, { recursive: true });

  const calls = [];
  try {
    const manifestPath = await ensurePrepared(benchRoot, 0, async (scriptPath, extraArgs) => {
      calls.push({ scriptPath, extraArgs });
      const generatedPath = join(iterationDir, 'spawn_manifest.json');
      await writeFile(generatedPath, JSON.stringify({ tasks: [] }), 'utf8');
    });

    assert.equal(calls.length, 1);
    assert.match(calls[0].scriptPath, /run_baseline\.mjs$/);
    assert.deepEqual(calls[0].extraArgs, [
      '--prepare-only',
      '--benchmark-root',
      benchRoot,
      '--skill-root',
      join(repoRoot, 'workspace-planner', 'skills', 'qa-plan-orchestrator'),
    ]);
    assert.equal(manifestPath, join(iterationDir, 'spawn_manifest.json'));
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});

test('ensurePrepared reuses an existing spawn manifest without rerunning prepare', async () => {
  const benchRoot = await mkdtemp(join(tmpdir(), 'benchmark-prepare-existing-'));
  const iterationDir = join(benchRoot, 'iteration-0');
  const manifestPath = join(iterationDir, 'spawn_manifest.json');
  await mkdir(iterationDir, { recursive: true });
  await writeFile(manifestPath, JSON.stringify({ tasks: [] }), 'utf8');

  let invoked = false;
  try {
    const resolved = await ensurePrepared(benchRoot, 0, async () => {
      invoked = true;
    });

    assert.equal(invoked, false);
    assert.equal(resolved, manifestPath);
  } finally {
    await rm(benchRoot, { recursive: true, force: true });
  }
});

test('resolveSkillRootForBenchmarkRoot derives the owning skill directory', () => {
  const benchmarkRoot = '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2';
  assert.equal(
    resolveSkillRootForBenchmarkRoot(benchmarkRoot),
    '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator',
  );
});

test('buildBaselineScriptArgs preserves the selected benchmark root and derived skill root', () => {
  const benchmarkRoot = '/tmp/repo/workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2';
  assert.deepEqual(
    buildBaselineScriptArgs({ mode: 'aggregate', benchmarkRoot }),
    [
      '--aggregate-only',
      '--benchmark-root',
      benchmarkRoot,
      '--skill-root',
      resolve(benchmarkRoot, '..', '..'),
    ],
  );
});
