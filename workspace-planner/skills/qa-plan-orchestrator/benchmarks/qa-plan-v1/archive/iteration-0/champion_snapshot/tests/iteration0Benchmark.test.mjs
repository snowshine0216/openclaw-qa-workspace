import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildComparisonMetadata,
  buildSyntheticRunResult,
  collectGradingStatus,
  seedChampionSnapshot,
  seedSyntheticGrading,
  seedIterationWorkspace,
  shouldIncludeSnapshotEntry,
} from '../benchmarks/qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';

test('shouldIncludeSnapshotEntry excludes benchmark and node_modules roots', () => {
  assert.equal(shouldIncludeSnapshotEntry('benchmarks'), false);
  assert.equal(shouldIncludeSnapshotEntry('node_modules'), false);
  assert.equal(shouldIncludeSnapshotEntry('scripts'), true);
});

test('seedChampionSnapshot copies skill contents without recursively copying benchmarks', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'iteration0-snapshot-'));
  const sourceRoot = join(tmp, 'skill-root');
  const snapshotDir = join(tmp, 'snapshot');

  try {
    await mkdir(join(sourceRoot, 'scripts'), { recursive: true });
    await mkdir(join(sourceRoot, 'benchmarks', 'qa-plan-v1'), { recursive: true });
    await writeFile(join(sourceRoot, 'scripts', 'phase0.sh'), '#!/usr/bin/env bash\n', 'utf8');
    await writeFile(join(sourceRoot, 'benchmarks', 'qa-plan-v1', 'ignore.txt'), 'skip me', 'utf8');

    await seedChampionSnapshot(sourceRoot, snapshotDir);

    const copiedScript = await readFile(join(snapshotDir, 'scripts', 'phase0.sh'), 'utf8');
    assert.match(copiedScript, /usr\/bin\/env bash/);
    await assert.rejects(() => readFile(join(snapshotDir, 'benchmarks', 'qa-plan-v1', 'ignore.txt'), 'utf8'));
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('seedIterationWorkspace refreshes iteration-0 metadata and comparison manifests', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'iteration0-workspace-'));
  const skillRoot = join(tmp, 'skill');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v1');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0'), { recursive: true });
    await writeFile(join(skillRoot, 'scripts', 'phase0.sh'), '#!/usr/bin/env bash\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), JSON.stringify({
      skill_name: 'qa-plan-orchestrator',
      evals: [
        {
          id: 7,
          prompt: 'prompt text',
          expectations: ['expectation one'],
        },
      ],
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'benchmark_manifest.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v1',
      skill_name: 'qa-plan-orchestrator',
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'benchmark_context.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v1',
      iteration: 0,
      status: 'seeded_not_run',
    }, null, 2), 'utf8');

    const prepared = await seedIterationWorkspace({
      skillRoot,
      benchmarkRoot,
      iteration: 0,
      executorModel: 'gpt-5.4',
      reasoningEffort: 'high',
      runsPerConfiguration: 2,
    });

    assert.equal(prepared.evalCount, 1);
    const context = JSON.parse(await readFile(join(benchmarkRoot, 'iteration-0', 'benchmark_context.json'), 'utf8'));
    assert.equal(context.status, 'prepared_pending_execution');
    assert.equal(context.executor_model, 'gpt-5.4');
    assert.equal(context.reasoning_effort, 'high');

    const comparison = JSON.parse(await readFile(
      join(benchmarkRoot, 'iteration-0', 'eval-7', 'with_skill', 'run-1', 'comparison_metadata.json'),
      'utf8',
    ));
    assert.equal(comparison.semantic_role, 'champion_seed');
    assert.equal(comparison.configuration_dir, 'with_skill');

    const spawnManifest = JSON.parse(await readFile(join(benchmarkRoot, 'iteration-0', 'spawn_manifest.json'), 'utf8'));
    assert.equal(spawnManifest.tasks.length, 1);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('collectGradingStatus reports readiness only when every seeded run is graded', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'iteration0-grading-'));
  const iterationDir = join(tmp, 'iteration-0');

  try {
    await mkdir(join(iterationDir, 'eval-1', 'with_skill', 'run-1'), { recursive: true });
    await mkdir(join(iterationDir, 'eval-1', 'without_skill', 'run-1'), { recursive: true });
    await writeFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'grading.json'), '{}', 'utf8');

    const partial = await collectGradingStatus(iterationDir);
    assert.equal(partial.expectedRuns, 2);
    assert.equal(partial.gradedRuns, 1);
    assert.equal(partial.ready, false);

    await writeFile(join(iterationDir, 'eval-1', 'without_skill', 'run-1', 'grading.json'), '{}', 'utf8');
    const complete = await collectGradingStatus(iterationDir);
    assert.equal(complete.ready, true);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('buildComparisonMetadata encodes baseline semantics for with_skill and without_skill', () => {
  const withSkill = buildComparisonMetadata({
    benchmarkVersion: 'qa-plan-v1',
    iteration: 0,
    configurationDir: 'with_skill',
    evalId: 1,
    runNumber: 1,
    snapshotPath: 'iteration-0/champion_snapshot',
    executorModel: 'gpt-5.4',
    reasoningEffort: 'high',
  });
  const withoutSkill = buildComparisonMetadata({
    benchmarkVersion: 'qa-plan-v1',
    iteration: 0,
    configurationDir: 'without_skill',
    evalId: 1,
    runNumber: 1,
    snapshotPath: 'iteration-0/champion_snapshot',
  });

  assert.equal(withSkill.semantic_role, 'champion_seed');
  assert.equal(withoutSkill.semantic_role, 'no_skill_baseline');
  assert.equal(withSkill.model_name, 'gpt-5.4');
});

test('buildSyntheticRunResult differentiates with_skill from without_skill pass rates', () => {
  const withSkill = buildSyntheticRunResult({
    configurationDir: 'with_skill',
    runNumber: 1,
    assertions: ['a', 'b', 'c'],
  });
  const withoutSkill = buildSyntheticRunResult({
    configurationDir: 'without_skill',
    runNumber: 1,
    assertions: ['a', 'b', 'c'],
  });

  assert.equal(withSkill.summary.pass_rate, 1);
  assert.ok(withoutSkill.summary.pass_rate < 1);
});

test('seedSyntheticGrading writes grading and timing files for every prepared run', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'iteration0-synthetic-'));
  const skillRoot = join(tmp, 'skill');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v1');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0'), { recursive: true });
    await writeFile(join(skillRoot, 'scripts', 'phase0.sh'), '#!/usr/bin/env bash\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), JSON.stringify({
      skill_name: 'qa-plan-orchestrator',
      evals: [
        {
          id: 8,
          prompt: 'seed validation',
          expectations: ['alpha', 'beta'],
        },
      ],
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'benchmark_manifest.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v1',
      skill_name: 'qa-plan-orchestrator',
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'benchmark_context.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v1',
      iteration: 0,
      status: 'seeded_not_run',
    }, null, 2), 'utf8');

    await seedIterationWorkspace({
      skillRoot,
      benchmarkRoot,
      iteration: 0,
      runsPerConfiguration: 2,
    });

    const seeded = await seedSyntheticGrading(join(benchmarkRoot, 'iteration-0'));
    assert.equal(seeded.writtenRuns, 4);

    const grading = JSON.parse(await readFile(
      join(benchmarkRoot, 'iteration-0', 'eval-8', 'with_skill', 'run-1', 'grading.json'),
      'utf8',
    ));
    assert.equal(grading.summary.pass_rate, 1);

    const timing = JSON.parse(await readFile(
      join(benchmarkRoot, 'iteration-0', 'eval-8', 'without_skill', 'run-2', 'timing.json'),
      'utf8',
    ));
    assert.ok(timing.total_tokens > 0);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
