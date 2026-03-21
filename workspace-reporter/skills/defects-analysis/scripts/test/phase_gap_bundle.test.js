import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, utimes } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(
  process.cwd(),
  'workspace-reporter/skills/defects-analysis/scripts/phase_gap_bundle.sh',
);

test('gap bundle phase requires a finalized report', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-gap-bundle-missing-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), '{"run_key":"BCIN-5809","invoked_by":"skill-evolution-orchestrator"}\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, INVOKED_BY: 'skill-evolution-orchestrator' },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /REPORT_FINAL/);

  await rm(runDir, { recursive: true, force: true });
});

test('gap bundle phase reuses a fresh existing bundle', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-gap-bundle-reuse-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), '{"run_key":"BCIN-5809","invoked_by":"skill-evolution-orchestrator"}\n');
  await writeFile(join(runDir, 'context', 'jira_raw.json'), '{"issues":[]}\n');
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), '# final\n', 'utf8');
  await writeFile(
    join(runDir, 'context', 'gap_bundle_BCIN-5809.json'),
    JSON.stringify({
      run_key: 'BCIN-5809',
      generated_at: '2099-03-21T00:00:00.000Z',
      feature_id: 'BCIN-5809',
      feature_family: 'report-editor',
      source_artifacts: ['BCIN-5809_REPORT_FINAL.md'],
      gaps: [],
    }, null, 2),
    'utf8',
  );
  await utimes(
    join(runDir, 'BCIN-5809_REPORT_FINAL.md'),
    new Date('2026-03-21T00:00:00.000Z'),
    new Date('2026-03-21T00:00:00.000Z'),
  );
  await utimes(
    join(runDir, 'context', 'gap_bundle_BCIN-5809.json'),
    new Date('2026-03-22T00:00:00.000Z'),
    new Date('2026-03-22T00:00:00.000Z'),
  );

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, INVOKED_BY: 'skill-evolution-orchestrator' },
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /GAP_BUNDLE_REUSED:/);

  await rm(runDir, { recursive: true, force: true });
});

test('gap bundle phase emits manifest and renders bundle-derived markdown on --post', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-gap-bundle-post-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), '{"run_key":"BCIN-5809","invoked_by":"skill-evolution-orchestrator"}\n');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        { key: 'BCIN-7667', fields: { summary: 'Developer smoke missed export guardrail' } },
      ],
    }, null, 2),
    'utf8',
  );
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), '# final\n', 'utf8');

  const first = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, INVOKED_BY: 'skill-evolution-orchestrator' },
  });
  assert.equal(first.status, 0);
  assert.match(first.stdout, /SPAWN_MANIFEST:/);

  await writeFile(
    join(runDir, 'context', 'gap_bundle_response_BCIN-5809.json'),
    JSON.stringify({
      run_key: 'BCIN-5809',
      generated_at: '2026-03-21T00:00:00.000Z',
      feature_id: 'BCIN-5809',
      feature_family: 'report-editor',
      source_artifacts: ['BCIN-5809_REPORT_FINAL.md'],
      gaps: [
        {
          gap_id: 'gap-1',
          root_cause_bucket: 'developer_artifact_missing',
          severity: 'high',
          title: 'Developer smoke artifact missing',
          summary: 'Developer smoke output is missing actionability.',
          source_defects: ['BCIN-7667'],
          affected_phase: 'phase7',
          recommended_target_files: [
            'workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs',
          ],
          recommended_change_type: 'artifact_generation',
          generalization_scope: 'feature_family',
          feature_family: 'report-editor',
        },
      ],
    }, null, 2),
    'utf8',
  );

  const second = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], {
    encoding: 'utf8',
    env: { ...process.env, INVOKED_BY: 'skill-evolution-orchestrator' },
  });
  assert.equal(second.status, 0);

  const bundle = JSON.parse(
    await readFile(join(runDir, 'context', 'gap_bundle_BCIN-5809.json'), 'utf8'),
  );
  const selfTestGap = await readFile(join(runDir, 'BCIN-5809_SELF_TEST_GAP_ANALYSIS.md'), 'utf8');
  const qaPlanCross = await readFile(join(runDir, 'BCIN-5809_QA_PLAN_CROSS_ANALYSIS.md'), 'utf8');
  assert.equal(bundle.gaps[0].root_cause_bucket, 'developer_artifact_missing');
  assert.match(selfTestGap, /Developer smoke artifact missing/);
  assert.match(qaPlanCross, /workspace-planner\/skills\/qa-plan-orchestrator\/scripts\/lib\/finalPlanSummary\.mjs/);

  await rm(runDir, { recursive: true, force: true });
});
