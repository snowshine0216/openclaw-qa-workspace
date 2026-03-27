import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase2 } from '../lib/phase2.mjs';

async function makeRunDir({ defectsRoot, extraTask = {} } = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: defectsRoot ?? '/tmp/no-defects',
      planner_run_root: '/tmp',
      ...extraTask,
    })
  );
  return runDir;
}

// --- User interaction blocks (pre-spawn) ---

test('blocks for reuse-or-regenerate when defect draft exists', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'BCIN-7289'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289', 'BCIN-7289_REPORT_DRAFT.md'), '# Draft');
  const runDir = await makeRunDir({ defectsRoot: defectsDir });
  const code = await runPhase2('BCIN-7289', runDir);
  assert.equal(code, 2);
});

test('blocks for reuse-or-regenerate when defect final exists', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'BCIN-7289'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289', 'BCIN-7289_REPORT_FINAL.md'), '# Report');
  const runDir = await makeRunDir({ defectsRoot: defectsDir });
  const code = await runPhase2('BCIN-7289', runDir);
  assert.equal(code, 2);
});

// --- Pre-spawn: no defect artifacts → spawn defects-analysis ---

test('pre-spawn emits defects-analysis spawn manifest when no artifacts exist', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'BCIN-7289'), { recursive: true });
  const runDir = await makeRunDir({ defectsRoot: defectsDir });
  const code = await runPhase2('BCIN-7289', runDir);
  assert.equal(code, 0);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase2_spawn_manifest.json'), 'utf8'));
  assert.equal(manifest.phase, 'phase2');
  assert.ok(manifest.requests[0].openclaw.args.includes('defects-analysis'));
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase2_step, 'defects_analysis_spawned');
});

// --- Pre-spawn: jira_raw with zero issues → emit defect-summary spawn manifest ---

test('pre-spawn with zero jira issues emits defect-summary spawn manifest', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  const defectsRunDir = join(defectsDir, 'BCIN-7289');
  await mkdir(join(defectsRunDir, 'context'), { recursive: true });
  await writeFile(join(defectsRunDir, 'context', 'jira_raw.json'), JSON.stringify({ issues: [] }));
  const runDir = await makeRunDir({ defectsRoot: defectsDir });
  const code = await runPhase2('BCIN-7289', runDir);
  assert.equal(code, 0);
  const state = JSON.parse(await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8'));
  assert.equal(state.kind, 'no_defects_found');
  const manifest = JSON.parse(await readFile(join(runDir, 'phase2_defect_summary_manifest.json'), 'utf8'));
  assert.equal(manifest.version, 1);
  assert.equal(manifest.source_kind, 'qa-summary-defect-summary');
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase2_step, 'defect_summary_spawned');
});

// --- Pre-spawn: existing final report + reuse → emit defect-summary spawn manifest ---

test('pre-spawn with DEFECT_REUSE_CHOICE=reuse emits defect-summary spawn manifest', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  await mkdir(join(defectsDir, 'BCIN-7289'), { recursive: true });
  await writeFile(join(defectsDir, 'BCIN-7289', 'BCIN-7289_REPORT_FINAL.md'), '# Report');
  const runDir = await makeRunDir({ defectsRoot: defectsDir });
  process.env.DEFECT_REUSE_CHOICE = 'reuse_existing_defects';
  try {
    const code = await runPhase2('BCIN-7289', runDir);
    assert.equal(code, 0);
    const manifest = JSON.parse(await readFile(join(runDir, 'phase2_defect_summary_manifest.json'), 'utf8'));
    assert.equal(manifest.source_kind, 'qa-summary-defect-summary');
    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.phase2_step, 'defect_summary_spawned');
  } finally {
    delete process.env.DEFECT_REUSE_CHOICE;
  }
});

// --- --post after defects-analysis spawn → emit defect-summary spawn manifest ---

test('--post with phase2_step=defects_analysis_spawned emits defect-summary spawn manifest', async () => {
  const defectsDir = await mkdtemp(join(tmpdir(), 'defects-'));
  const defectsRunDir = join(defectsDir, 'BCIN-7289');
  await mkdir(join(defectsRunDir, 'context'), { recursive: true });
  await writeFile(join(defectsRunDir, 'context', 'jira_raw.json'), JSON.stringify({ issues: [] }));
  const runDir = await makeRunDir({
    defectsRoot: defectsDir,
    extraTask: { phase2_step: 'defects_analysis_spawned' },
  });
  await writeFile(
    join(runDir, 'context', 'defect_context_state.json'),
    JSON.stringify({ kind: 'no_defects_found', defects_run_dir: defectsRunDir })
  );
  const code = await runPhase2('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase2_defect_summary_manifest.json'), 'utf8'));
  assert.equal(manifest.source_kind, 'qa-summary-defect-summary');
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase2_step, 'defect_summary_spawned');
});

// --- --post after defect-summary LLM spawn: validate ---

test('--post with phase2_step=defect_summary_spawned and defect_summary.json returns PHASE2_DONE', async () => {
  const runDir = await makeRunDir({ extraTask: { phase2_step: 'defect_summary_spawned' } });
  await writeFile(
    join(runDir, 'context', 'defect_summary.json'),
    JSON.stringify({ totalDefects: 1, openDefects: 1 })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({}));
  const code = await runPhase2('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.current_phase, 'phase2');
  assert.equal(task.phase2_step, 'done');
});

test('--post with phase2_step=defect_summary_spawned and no_defects.json returns PHASE2_DONE', async () => {
  const runDir = await makeRunDir({ extraTask: { phase2_step: 'defect_summary_spawned' } });
  await writeFile(
    join(runDir, 'context', 'no_defects.json'),
    JSON.stringify({ totalDefects: 0, noDefectsFound: true })
  );
  await writeFile(join(runDir, 'run.json'), JSON.stringify({}));
  const code = await runPhase2('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.current_phase, 'phase2');
});

test('--post with phase2_step=defect_summary_spawned and no output files blocks', async () => {
  const runDir = await makeRunDir({ extraTask: { phase2_step: 'defect_summary_spawned' } });
  const code = await runPhase2('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
});

// --- Path resolution ---

test('treats jira_raw with open issues and no report as no_defect_artifacts and spawns defects-analysis', async () => {
  const featureKey = 'BCIN-7289';
  const defectsRoot = await mkdtemp(join(tmpdir(), 'defects-'));
  const defectsRunDir = join(defectsRoot, featureKey);
  await mkdir(join(defectsRunDir, 'context'), { recursive: true });
  await writeFile(
    join(defectsRunDir, 'context', 'jira_raw.json'),
    JSON.stringify({ issues: [{ key: 'BCIN-7001', fields: { summary: 'Bug' } }] })
  );
  const runDir = await makeRunDir({ defectsRoot });
  const code = await runPhase2(featureKey, runDir);
  assert.equal(code, 0);
  const state = JSON.parse(await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8'));
  assert.equal(state.kind, 'no_defect_artifacts');
  const manifest = JSON.parse(await readFile(join(runDir, 'phase2_spawn_manifest.json'), 'utf8'));
  assert.ok(manifest.requests[0].openclaw.args.includes('defects-analysis'));
});

test('resolves relative defects_run_root from repository root', async () => {
  const featureKey = 'BCIN-7289';
  const repoDir = await mkdtemp(join(tmpdir(), 'qa-summary-repo-'));
  const runDir = join(repoDir, 'workspace-reporter', 'skills', 'qa-summary', 'runs', featureKey);
  const defectsRunDir = join(repoDir, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', featureKey);
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(defectsRunDir, { recursive: true });
  await writeFile(join(defectsRunDir, `${featureKey}_REPORT_FINAL.md`), '# Report');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      defects_run_root: 'workspace-reporter/skills/defects-analysis/runs',
      planner_run_root: '/tmp',
    })
  );
  const code = await runPhase2(featureKey, runDir);
  assert.equal(code, 2); // blocks for reuse choice
  const state = JSON.parse(await readFile(join(runDir, 'context', 'defect_context_state.json'), 'utf8'));
  assert.equal(state.kind, 'defect_final_exists');
});
