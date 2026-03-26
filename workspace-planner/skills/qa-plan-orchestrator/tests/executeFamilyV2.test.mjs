import test from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  executeFamilyRuns,
  parseExecuteFamilyArgs,
} from '../benchmarks/qa-plan-v2/scripts/lib/executeFamilyV2.mjs';

async function writeJson(path, payload) {
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function createFamilyFilteredBenchmarkRoot(rootDir) {
  const benchmarkRoot = join(rootDir, 'benchmarks', 'qa-plan-v2');
  const iterationDir = join(benchmarkRoot, 'iteration-0');
  const snapshotDir = join(iterationDir, 'champion_snapshot');
  const blindSnapshotPath = join(rootDir, 'fixtures-src', 'jira', 'BCIN-976.customer-scope.json');

  await mkdir(snapshotDir, { recursive: true });
  await mkdir(join(rootDir, 'fixtures-src', 'jira'), { recursive: true });
  await writeFile(join(snapshotDir, 'SKILL.md'), '# snapshot\n', 'utf8');
  await writeFile(blindSnapshotPath, '{"feature_id":"BCIN-976"}\n', 'utf8');

  await writeJson(join(benchmarkRoot, 'fixtures_manifest.json'), {
    benchmark_version: 'qa-plan-v2',
    fixtures: [
      {
        fixture_id: 'BLIND-REPORT',
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
            snapshot_path: 'fixtures-src/jira/BCIN-976.customer-scope.json',
            included_in_blind: true,
          },
        ],
      },
      {
        fixture_id: 'BLIND-DOCS',
        type: 'blind_pre_defect_bundle',
        feature_id: 'DOCS',
        feature_family: 'docs',
        cutoff_policy: 'all_customer_issues_only',
        issue_scope: {
          include_issue_classes: ['customer'],
          exclude_issue_classes: ['non_customer'],
        },
        materials: [],
      },
    ],
  });

  await writeJson(join(iterationDir, 'spawn_manifest.json'), {
    benchmark_version: 'qa-plan-v2',
    iteration: 0,
    tasks: [
      {
        eval_id: 1,
        eval_name: 'report-case',
        case_id: 'REPORT-1',
        feature_id: 'BCIN-976',
        feature_family: 'report-editor',
        knowledge_pack_key: 'report-editor',
        primary_phase: 'phase0',
        kind: 'phase_contract',
        evidence_mode: 'blind_pre_defect',
        blocking: true,
        fixture_refs: ['BLIND-REPORT'],
        benchmark_profile: 'global-cross-feature-v1',
        prompt: 'Run report-editor case.',
        expectations: ['report-editor expectation'],
        with_skill_runs: [
          { run_number: 1, run_dir: 'eval-1/with_skill/run-1', output_dir: 'eval-1/with_skill/run-1/outputs' },
        ],
        without_skill_runs: [
          { run_number: 1, run_dir: 'eval-1/without_skill/run-1', output_dir: 'eval-1/without_skill/run-1/outputs' },
        ],
      },
      {
        eval_id: 2,
        eval_name: 'docs-case',
        case_id: 'DOCS-1',
        feature_id: 'DOCS',
        feature_family: 'docs',
        knowledge_pack_key: 'docs',
        primary_phase: 'docs',
        kind: 'phase_contract',
        evidence_mode: 'blind_pre_defect',
        blocking: false,
        fixture_refs: ['BLIND-DOCS'],
        benchmark_profile: 'global-cross-feature-v1',
        prompt: 'Run docs case.',
        expectations: ['docs expectation'],
        with_skill_runs: [
          { run_number: 1, run_dir: 'eval-2/with_skill/run-1', output_dir: 'eval-2/with_skill/run-1/outputs' },
        ],
        without_skill_runs: [],
      },
    ],
  });

  for (const runDir of [
    join(iterationDir, 'eval-1', 'with_skill', 'run-1'),
    join(iterationDir, 'eval-1', 'without_skill', 'run-1'),
    join(iterationDir, 'eval-2', 'with_skill', 'run-1'),
  ]) {
    await mkdir(join(runDir, 'outputs'), { recursive: true });
  }

  return { benchmarkRoot, iterationDir };
}

test('parseExecuteFamilyArgs requires family and executor path', () => {
  assert.throws(() => parseExecuteFamilyArgs(['node', 'script']), /Missing required --family/);
  assert.throws(
    () => parseExecuteFamilyArgs(['node', 'script', '--family', 'report-editor']),
    /Missing required --executor-script/,
  );

  const parsed = parseExecuteFamilyArgs([
    'node',
    'script',
    '--family',
    'report-editor',
    '--executor-script',
    '/tmp/fake-runner.mjs',
    '--grader-script',
    '/tmp/fake-grader.mjs',
    '--rerun-completed',
    '--reuse-executor-output',
  ]);

  assert.equal(parsed.familyName, 'report-editor');
  assert.equal(parsed.executorScript, '/tmp/fake-runner.mjs');
  assert.equal(parsed.graderScript, '/tmp/fake-grader.mjs');
  assert.equal(parsed.rerunCompleted, true);
  assert.equal(parsed.reuseExecutorOutput, true);
});

test('executeFamilyRuns only executes the selected feature family', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-family-execute-'));

  try {
    const { benchmarkRoot, iterationDir } = await createFamilyFilteredBenchmarkRoot(tmp);
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
await writeFile(join(request.run.output_dir, 'metrics.json'), JSON.stringify({ total_tokens: 321 }, null, 2), 'utf8');
await writeFile(join(dirname(requestPath), 'family-observation.json'), JSON.stringify({ case_id: request.case_id }, null, 2), 'utf8');
`, 'utf8');
    await chmod(runnerScript, 0o755);

    await writeFile(graderScript, `#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const requestPath = args[args.indexOf('--request') + 1];
const request = JSON.parse(await readFile(requestPath, 'utf8'));
await writeFile(join(request.run.run_dir, 'grading.json'), JSON.stringify({
  expectations: request.expectations.map((text) => ({ text, passed: true, evidence: 'ok' })),
  summary: { passed: request.expectations.length, failed: 0, total: request.expectations.length, pass_rate: 1 }
}, null, 2), 'utf8');
`, 'utf8');
    await chmod(graderScript, 0o755);

    const result = await executeFamilyRuns({
      benchmarkRoot,
      benchmarkDefinitionRoot: benchmarkRoot,
      iteration: 0,
      familyName: 'report-editor',
      executorScript: runnerScript,
      graderScript,
    });

    assert.equal(result.familyDefinition.feature_family, 'report-editor');
    assert.equal(result.totalRuns, 2);
    assert.equal(result.executedRuns, 2);
    assert.equal(result.skippedRuns, 0);

    assert.equal(existsSync(join(iterationDir, 'eval-1', 'with_skill', 'run-1', 'execution_request.json')), true);
    assert.equal(existsSync(join(iterationDir, 'eval-2', 'with_skill', 'run-1', 'execution_request.json')), false);

    const familyManifest = JSON.parse(await readFile(join(iterationDir, 'families', 'report-editor', 'family_manifest.json'), 'utf8'));
    assert.equal(familyManifest.summary.completed_run_count, 2);
    assert.equal(familyManifest.summary.pending_run_count, 0);
    assert.equal(familyManifest.tasks.length, 1);
    assert.equal(familyManifest.tasks[0].case_id, 'REPORT-1');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('executeFamilyRuns can reuse executor outputs and run grader only', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-family-reuse-'));

  try {
    const { benchmarkRoot, iterationDir } = await createFamilyFilteredBenchmarkRoot(tmp);
    const runnerScript = join(tmp, 'unexpected-runner.mjs');
    const graderScript = join(tmp, 'reuse-grader.mjs');
    const withSkillRunDir = join(iterationDir, 'eval-1', 'with_skill', 'run-1');
    const withoutSkillRunDir = join(iterationDir, 'eval-1', 'without_skill', 'run-1');

    for (const runDir of [withSkillRunDir, withoutSkillRunDir]) {
      await writeFile(join(runDir, 'execution_transcript.log'), 'runner transcript\n', 'utf8');
      await writeFile(join(runDir, 'timing.json'), JSON.stringify({ total_tokens: 99, duration_ms: 1, total_duration_seconds: 0.001 }, null, 2), 'utf8');
      await writeFile(join(runDir, 'outputs', 'result.md'), '# existing runner output\nphase0 focus is covered\n', 'utf8');
    }

    await writeFile(runnerScript, `#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
await writeFile(${JSON.stringify(join(tmp, 'runner-should-not-run.txt'))}, 'called', 'utf8');
process.exit(1);
`, 'utf8');
    await chmod(runnerScript, 0o755);

    await writeFile(graderScript, `#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const args = process.argv.slice(2);
const requestPath = args[args.indexOf('--request') + 1];
const request = JSON.parse(await readFile(requestPath, 'utf8'));
await writeFile(join(request.run.run_dir, 'grading.json'), JSON.stringify({
  expectations: request.expectations.map((text) => ({ text, passed: true, evidence: 'reused executor output' })),
  summary: { passed: request.expectations.length, failed: 0, total: request.expectations.length, pass_rate: 1 }
}, null, 2), 'utf8');
`, 'utf8');
    await chmod(graderScript, 0o755);

    const result = await executeFamilyRuns({
      benchmarkRoot,
      benchmarkDefinitionRoot: benchmarkRoot,
      iteration: 0,
      familyName: 'report-editor',
      executorScript: runnerScript,
      graderScript,
      reuseExecutorOutput: true,
    });

    assert.equal(result.executedRuns, 2);
    assert.equal(existsSync(join(tmp, 'runner-should-not-run.txt')), false);
    assert.equal(existsSync(join(withSkillRunDir, 'grading.json')), true);
    assert.equal(existsSync(join(withoutSkillRunDir, 'grading.json')), true);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
