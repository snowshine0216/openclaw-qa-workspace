import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  executeBatchRuns,
  parseExecuteBatchArgs,
} from '../benchmarks/qa-plan-v2/scripts/lib/executeBatchV2.mjs';

async function writeJson(path, payload) {
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function createFixtureBackedBenchmarkRoot(rootDir) {
  const benchmarkRoot = join(rootDir, 'benchmarks', 'qa-plan-v2');
  const iterationDir = join(benchmarkRoot, 'iteration-0');
  const snapshotDir = join(iterationDir, 'champion_snapshot');
  const blindSnapshotPath = join(rootDir, 'fixtures-src', 'jira', 'BCIN-976.customer-scope.json');
  const replaySourceDir = join(rootDir, 'fixtures-src', 'replay-run');
  const relativeBlindSnapshotPath = 'fixtures-src/jira/BCIN-976.customer-scope.json';
  const relativeReplaySourceDir = 'fixtures-src/replay-run';

  await mkdir(snapshotDir, { recursive: true });
  await mkdir(join(rootDir, 'fixtures-src', 'jira'), { recursive: true });
  await mkdir(replaySourceDir, { recursive: true });

  await writeFile(join(snapshotDir, 'SKILL.md'), '# snapshot\n', 'utf8');
  await writeFile(blindSnapshotPath, '{"feature_id":"BCIN-976"}\n', 'utf8');
  await writeFile(join(replaySourceDir, 'qa_plan_final.md'), '# replay fixture\n', 'utf8');

  await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
    benchmark_version: 'qa-plan-v2',
    skill_name: 'qa-plan-orchestrator',
    runs_per_configuration: 1,
    blocking_case_ids: ['CASE-1'],
    advisory_case_ids: ['CASE-23'],
  });

  await writeJson(join(benchmarkRoot, 'fixtures_manifest.json'), {
    benchmark_version: 'qa-plan-v2',
    fixtures: [
      {
        fixture_id: 'BLIND-BCIN-976',
        type: 'blind_pre_defect_bundle',
        feature_id: 'BCIN-976',
        feature_family: 'report-editor',
        cutoff_policy: 'all_customer_issues_only',
        issue_scope: {
          include_issue_classes: ['customer'],
          exclude_issue_classes: ['non_customer'],
        },
        materials: [
          {
            material_type: 'jira_customer_issue_export',
            source_id_or_url: 'BCIN-976 customer scope export',
            snapshot_path: relativeBlindSnapshotPath,
            included_in_blind: true,
          },
        ],
      },
      {
        fixture_id: 'REPLAY-BCIN-7289',
        type: 'defect_replay_source',
        path: relativeReplaySourceDir,
      },
    ],
  });

  await writeJson(join(iterationDir, 'spawn_manifest.json'), {
    benchmark_version: 'qa-plan-v2',
    iteration: 0,
    tasks: [
      {
        eval_id: 1,
        eval_name: 'case-1',
        case_id: 'CASE-1',
        feature_id: 'BCIN-976',
        feature_family: 'report-editor',
        knowledge_pack_key: 'report-editor',
        primary_phase: 'phase0',
        kind: 'phase_contract',
        evidence_mode: 'blind_pre_defect',
        blocking: true,
        fixture_refs: ['BLIND-BCIN-976'],
        benchmark_profile: 'global-cross-feature-v1',
        prompt: 'Run phase0 blind case.',
        expectations: ['phase0 focus is covered', 'phase0 alignment exists'],
        with_skill_runs: [
          {
            run_number: 1,
            run_dir: join(iterationDir, 'eval-1', 'with_skill', 'run-1'),
            output_dir: join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'outputs'),
          },
        ],
        without_skill_runs: [
          {
            run_number: 1,
            run_dir: join(iterationDir, 'eval-1', 'without_skill', 'run-1'),
            output_dir: join(iterationDir, 'eval-1', 'without_skill', 'run-1', 'outputs'),
          },
        ],
      },
      {
        eval_id: 23,
        eval_name: 'case-23',
        case_id: 'CASE-23',
        feature_id: 'BCIN-7289',
        feature_family: 'report-editor',
        knowledge_pack_key: 'report-editor',
        primary_phase: 'phase5b',
        kind: 'checkpoint_enforcement',
        evidence_mode: 'retrospective_replay',
        blocking: false,
        fixture_refs: ['REPLAY-BCIN-7289'],
        benchmark_profile: 'global-cross-feature-v1',
        prompt: 'Run phase5b replay case.',
        expectations: ['phase5b focus is covered', 'phase5b alignment exists'],
        with_skill_runs: [
          {
            run_number: 1,
            run_dir: join(iterationDir, 'eval-23', 'with_skill', 'run-1'),
            output_dir: join(iterationDir, 'eval-23', 'with_skill', 'run-1', 'outputs'),
          },
        ],
        without_skill_runs: [],
      },
    ],
  });

  for (const runDir of [
    join(iterationDir, 'eval-1', 'with_skill', 'run-1'),
    join(iterationDir, 'eval-1', 'without_skill', 'run-1'),
    join(iterationDir, 'eval-23', 'with_skill', 'run-1'),
  ]) {
    await mkdir(join(runDir, 'outputs'), { recursive: true });
  }

  return { benchmarkRoot, iterationDir, blindSnapshotPath, replaySourceDir };
}

test('parseExecuteBatchArgs requires batch number and executor path', () => {
  assert.throws(() => parseExecuteBatchArgs(['node', 'script']), /Missing required --batch/);
  assert.throws(() => parseExecuteBatchArgs(['node', 'script', '--batch', '1']), /Missing required --executor-script/);

  const parsed = parseExecuteBatchArgs([
    'node',
    'script',
    '--batch',
    '1',
    '--executor-script',
    '/tmp/fake-runner.mjs',
    '--grader-script',
    '/tmp/fake-grader.mjs',
    '--rerun-completed',
  ]);

  assert.equal(parsed.batchNumber, 1);
  assert.equal(parsed.executorScript, '/tmp/fake-runner.mjs');
  assert.equal(parsed.graderScript, '/tmp/fake-grader.mjs');
  assert.equal(parsed.rerunCompleted, true);
});

test('executeBatchRuns invokes executor and grader with isolated request payloads', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-execute-'));

  try {
    const { benchmarkRoot, iterationDir, blindSnapshotPath, replaySourceDir } = await createFixtureBackedBenchmarkRoot(tmp);

    const runnerScript = join(tmp, 'fake-runner.mjs');
    const graderScript = join(tmp, 'fake-grader.mjs');

    await writeFile(runnerScript, `#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const requestPath = args[args.indexOf('--request') + 1];
const request = JSON.parse(await readFile(requestPath, 'utf8'));
await mkdir(request.run.output_dir, { recursive: true });
await writeFile(join(request.run.output_dir, 'result.md'), '# executed\\n', 'utf8');
await writeFile(join(request.run.output_dir, 'metrics.json'), JSON.stringify({ total_tokens: 1234 }, null, 2), 'utf8');
await writeFile(join(dirname(requestPath), 'executor-observation.json'), JSON.stringify({
  configuration: request.run.configuration_dir,
  fixture_local_paths: request.fixtures.map((fixture) => fixture.local_path || null),
  material_local_paths: request.fixtures.flatMap((fixture) => (fixture.materials || []).map((material) => material.local_path || null)),
  skill_snapshot_path: request.skill_snapshot_path,
}, null, 2), 'utf8');
console.log('runner-complete');
`, 'utf8');
    await chmod(runnerScript, 0o755);

    await writeFile(graderScript, `#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const requestPath = args[args.indexOf('--request') + 1];
const request = JSON.parse(await readFile(requestPath, 'utf8'));
const expectations = request.expectations.map((text) => ({ text, passed: true, evidence: 'graded by fake grader' }));
await writeFile(join(request.run.run_dir, 'grading.json'), JSON.stringify({
  expectations,
  summary: { passed: expectations.length, failed: 0, total: expectations.length, pass_rate: 1 },
}, null, 2), 'utf8');
console.log('grader-complete');
`, 'utf8');
    await chmod(graderScript, 0o755);

    const result = await executeBatchRuns({
      benchmarkRoot,
      iteration: 0,
      batchNumber: 1,
      executorScript: runnerScript,
      graderScript,
    });

    assert.equal(result.totalRuns, 3);
    assert.equal(result.executedRuns, 3);
    assert.equal(result.skippedRuns, 0);

    const requestPath = join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'execution_request.json');
    const request = JSON.parse(await readFile(requestPath, 'utf8'));
    assert.equal(request.case_id, 'CASE-1');
    assert.equal(request.run.configuration_dir, 'with_skill');
    assert.equal(request.fixture_refs[0], 'BLIND-BCIN-976');
    assert.ok(request.skill_snapshot_path.endsWith('iteration-0/champion_snapshot'));

    const copiedBlindFixture = join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'inputs', 'fixtures', 'BLIND-BCIN-976', 'materials', 'BCIN-976.customer-scope.json');
    assert.equal(existsSync(copiedBlindFixture), true);
    assert.equal(await readFile(copiedBlindFixture, 'utf8'), await readFile(blindSnapshotPath, 'utf8'));

    const copiedReplayFixture = join(iterationDir, 'eval-23', 'with_skill', 'run-1', 'inputs', 'fixtures', 'REPLAY-BCIN-7289', 'source', 'qa_plan_final.md');
    assert.equal(existsSync(copiedReplayFixture), true);
    assert.equal(await readFile(copiedReplayFixture, 'utf8'), await readFile(join(replaySourceDir, 'qa_plan_final.md'), 'utf8'));

    const timing = JSON.parse(await readFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'timing.json'), 'utf8'));
    assert.equal(timing.total_tokens, 1234);
    assert.ok(timing.duration_ms >= 0);

    const grading = JSON.parse(await readFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'grading.json'), 'utf8'));
    assert.equal(grading.summary.pass_rate, 1);

    const observation = JSON.parse(await readFile(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'executor-observation.json'), 'utf8'));
    assert.ok(observation.material_local_paths.some((entry) => entry && entry.endsWith('BCIN-976.customer-scope.json')));
    assert.ok(observation.skill_snapshot_path.endsWith('iteration-0/champion_snapshot'));

    const batchManifest = JSON.parse(await readFile(join(iterationDir, 'batches', 'batch-1', 'batch_manifest.json'), 'utf8'));
    assert.equal(batchManifest.summary.completed_run_count, 3);
    assert.equal(batchManifest.summary.pending_run_count, 0);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
