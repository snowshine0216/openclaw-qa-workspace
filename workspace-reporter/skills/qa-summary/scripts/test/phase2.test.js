import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase2 } from '../lib/phase2.mjs';

test('blocks for reuse-or-regenerate when defect draft exists', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'BCIN-7289'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289', 'BCIN-7289_REPORT_DRAFT.md'), '# Draft');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsDir,
      planner_run_root: '/tmp',
    })
  );
  const code = await runPhase2('BCIN-7289', runDir);
  assert.equal(code, 2);
});

test('blocks for reuse-or-regenerate when defect final exists', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'BCIN-7289'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289', 'BCIN-7289_REPORT_FINAL.md'), '# Report');
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsDir,
      planner_run_root: '/tmp',
    })
  );
  const code = await runPhase2('BCIN-7289', runDir);
  assert.equal(code, 2);
});

test('writes no_defects when consolidated summary has zero defects', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289_REPORT_FINAL.md'), '# Report\nNo defects.');
  await writeFile(join(defectsDir, 'context', 'jira_raw.json'), JSON.stringify({ issues: [] }));
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(runDir, 'context', 'planner_summary_seed.md'), '');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsDir,
      planner_run_root: '/tmp',
    })
  );
  const code = await runPhase2('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const noDefects = JSON.parse(
    await readFile(join(runDir, 'context', 'no_defects.json'), 'utf8')
  );
  assert.equal(noDefects.noDefectsFound, true);
  assert.equal(noDefects.totalDefects, 0);
});

test('removes stale defect_summary when regenerated summary has zero defects', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'context'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289_REPORT_FINAL.md'), '# Report\nNo defects.');
  await writeFile(join(defectsDir, 'context', 'jira_raw.json'), JSON.stringify({ issues: [] }));

  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(runDir, 'context', 'planner_summary_seed.md'), '');
  await writeFile(
    join(runDir, 'context', 'defect_summary.json'),
    JSON.stringify({ totalDefects: 3, openDefects: 1 })
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsDir,
      planner_run_root: '/tmp',
    })
  );

  const code = await runPhase2('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);

  const { existsSync } = await import('node:fs');
  assert.equal(existsSync(join(runDir, 'context', 'defect_summary.json')), false);
  assert.equal(existsSync(join(runDir, 'context', 'no_defects.json')), true);
});

test('treats jira_raw with issues but no report artifacts as incomplete and emits a spawn manifest', async () => {
  const featureKey = 'BCIN-7289';
  const defectsRoot = await mkdtemp(join(tmpdir(), 'defects-'));
  const defectsRunDir = join(defectsRoot, featureKey);
  await mkdir(join(defectsRunDir, 'context'), { recursive: true });
  await writeFile(
    join(defectsRunDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-7001',
          fields: { summary: 'Existing defect cache should not bypass regeneration.' },
        },
      ],
    })
  );

  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsRoot,
      planner_run_root: '/tmp',
    })
  );

  const code = await runPhase2(featureKey, runDir);
  assert.equal(code, 0);

  const state = JSON.parse(
    await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8')
  );
  assert.equal(state.kind, 'no_defect_artifacts');

  const manifest = JSON.parse(
    await readFile(join(runDir, 'phase2_spawn_manifest.json'), 'utf8')
  );
  assert.equal(manifest.phase, 'phase2');
  assert.match(manifest.requests[0].openclaw.args.join(' '), /--skill defects-analysis/);
});

test('treats jira_raw with zero issues as no_defects_found without spawning defect analysis', async () => {
  const featureKey = 'BCIN-7289';
  const defectsRoot = await mkdtemp(join(tmpdir(), 'defects-'));
  const defectsRunDir = join(defectsRoot, featureKey);
  await mkdir(join(defectsRunDir, 'context'), { recursive: true });
  await writeFile(join(defectsRunDir, 'context', 'jira_raw.json'), JSON.stringify({ issues: [] }));

  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsRoot,
      planner_run_root: '/tmp',
    })
  );

  const code = await runPhase2(featureKey, runDir);
  assert.equal(code, 0);

  const state = JSON.parse(
    await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8')
  );
  assert.equal(state.kind, 'no_defects_found');

  const { existsSync } = await import('node:fs');
  assert.equal(existsSync(join(runDir, 'phase2_spawn_manifest.json')), false);
});

test('resolves relative defects_run_root from repository root', async () => {
  const repoDir = await mkdtemp(join(tmpdir(), 'qa-summary-repo-'));
  const featureKey = 'BCIN-7289';
  const runDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'qa-summary',
    'runs',
    featureKey
  );
  const defectsRunDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'defects-analysis',
    'runs',
    featureKey
  );

  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(defectsRunDir, { recursive: true });
  await writeFile(join(defectsRunDir, `${featureKey}_REPORT_FINAL.md`), '# Report');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: 'workspace-reporter/skills/defects-analysis/runs',
      planner_run_root: 'workspace-planner/skills/qa-plan-orchestrator/runs',
    })
  );

  const code = await runPhase2(featureKey, runDir);
  assert.equal(code, 2);

  const state = JSON.parse(
    await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8')
  );
  assert.equal(state.kind, 'defect_final_exists');
  assert.equal(
    state.defects_run_dir,
    join(repoDir, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', featureKey)
  );
});

test('resolves repo-relative defects roots even when run_dir is outside the repo', async () => {
  const featureKey = 'BCIN-ROOT';
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-external-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: 'workspace-reporter/skills/qa-summary/scripts/test/fixtures/defects-runs',
      planner_run_root: '/tmp',
    })
  );

  const code = await runPhase2(featureKey, runDir);
  assert.equal(code, 2);

  const state = JSON.parse(
    await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8')
  );
  assert.equal(state.kind, 'defect_final_exists');
  assert.match(
    state.defects_run_dir,
    /workspace-reporter\/skills\/qa-summary\/scripts\/test\/fixtures\/defects-runs\/BCIN-ROOT$/
  );
});

test('uses spawned default-root defect artifacts during post-processing when overrides point elsewhere', async () => {
  const featureKey = 'BCIN-7289';
  const repoDir = await mkdtemp(join(tmpdir(), 'qa-summary-repo-'));
  const runDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'qa-summary',
    'runs',
    featureKey
  );
  const defaultDefectsRunDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'defects-analysis',
    'runs',
    featureKey
  );
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(defaultDefectsRunDir, 'context'), { recursive: true });
  await writeFile(join(defaultDefectsRunDir, `${featureKey}_REPORT_FINAL.md`), '# Report\nNo defects.');
  await writeFile(
    join(defaultDefectsRunDir, 'context', 'jira_raw.json'),
    JSON.stringify({ issues: [] })
  );
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(runDir, 'context', 'planner_summary_seed.md'), '');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: 'custom/defects/runs',
      planner_run_root: '/tmp',
    })
  );

  const code = await runPhase2(featureKey, runDir, '--post');
  assert.equal(code, 0);

  const noDefects = JSON.parse(
    await readFile(join(runDir, 'context', 'no_defects.json'), 'utf8')
  );
  assert.equal(noDefects.noDefectsFound, true);
  assert.equal(noDefects.totalDefects, 0);
});

test('prefers freshly regenerated default-root defect artifacts over stale override artifacts', async () => {
  const featureKey = 'BCIN-7289';
  const repoDir = await mkdtemp(join(tmpdir(), 'qa-summary-repo-'));
  const runDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'qa-summary',
    'runs',
    featureKey
  );
  const configuredDefectsRunDir = join(repoDir, 'custom', 'defects', 'runs', featureKey);
  const defaultDefectsRunDir = join(
    repoDir,
    'workspace-reporter',
    'skills',
    'defects-analysis',
    'runs',
    featureKey
  );

  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(configuredDefectsRunDir, 'context'), { recursive: true });
  await mkdir(join(defaultDefectsRunDir, 'context'), { recursive: true });

  await writeFile(join(configuredDefectsRunDir, `${featureKey}_REPORT_FINAL.md`), '# Stale report');
  await writeFile(
    join(configuredDefectsRunDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-7001',
          fields: {
            summary: 'Stale cached defect',
            status: { name: 'Resolved' },
            priority: { name: 'P1' },
            resolution: { name: 'Done' },
          },
        },
      ],
    })
  );

  await writeFile(join(defaultDefectsRunDir, `${featureKey}_REPORT_FINAL.md`), '# Fresh report\nNo defects.');
  await writeFile(
    join(defaultDefectsRunDir, 'context', 'jira_raw.json'),
    JSON.stringify({ issues: [] })
  );

  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(runDir, 'context', 'planner_summary_seed.md'), '');
  await writeFile(
    join(runDir, 'context', 'defect_context_state.json'),
    JSON.stringify({
      kind: 'defect_final_exists',
      defects_run_dir: configuredDefectsRunDir,
      defect_report_path: join(configuredDefectsRunDir, `${featureKey}_REPORT_FINAL.md`),
      userChoice: 'regenerate_defects',
      updated_at: new Date().toISOString(),
    })
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: 'custom/defects/runs',
      planner_run_root: '/tmp',
    })
  );

  const code = await runPhase2(featureKey, runDir, '--post');
  assert.equal(code, 0);

  const noDefects = JSON.parse(
    await readFile(join(runDir, 'context', 'no_defects.json'), 'utf8')
  );
  assert.equal(noDefects.noDefectsFound, true);
  assert.equal(noDefects.totalDefects, 0);
});

test('blocks when reusing an existing defect report without jira_raw context', async () => {
  const featureKey = 'BCIN-7289';
  const defectsRoot = await mkdtemp(join(tmpdir(), 'defects-'));
  const defectsRunDir = join(defectsRoot, featureKey);
  await mkdir(defectsRunDir, { recursive: true });
  await writeFile(join(defectsRunDir, `${featureKey}_REPORT_FINAL.md`), '# Report');

  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(runDir, 'context', 'planner_summary_seed.md'), '');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsRoot,
      planner_run_root: '/tmp',
    })
  );

  process.env.DEFECT_REUSE_CHOICE = 'reuse_existing_defects';
  try {
    const code = await runPhase2(featureKey, runDir);
    assert.equal(code, 2);
  } finally {
    delete process.env.DEFECT_REUSE_CHOICE;
  }
});
