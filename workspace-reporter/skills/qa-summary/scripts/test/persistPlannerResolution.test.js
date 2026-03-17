import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { persistPlannerResolution } from '../lib/persistPlannerResolution.mjs';

test('updates task planner paths', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-persist-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const task = {
    feature_key: 'BCIN-7289',
    planner_run_root: '/tmp/planner',
    overall_status: 'in_progress',
  };
  await writeFile(join(runDir, 'task.json'), JSON.stringify(task, null, 2));
  const resolved = {
    planPath: '/tmp/planner/BCIN-7289/qa_plan_final.md',
    summaryPath: '/tmp/planner/BCIN-7289/context/final_plan_summary_BCIN-7289.md',
    featureOverviewSource: 'planner_section',
  };
  await persistPlannerResolution(runDir, resolved);
  const updated = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(updated.planner_plan_resolved_path, resolved.planPath);
  assert.equal(updated.planner_summary_path, resolved.summaryPath);
  assert.equal(updated.feature_overview_source, 'planner_section');
  assert.ok(updated.updated_at);
});

test('preserves unrelated task fields', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-persist-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const task = {
    feature_key: 'BCIN-7289',
    defects_run_root: '/tmp/defects',
    overall_status: 'in_progress',
  };
  await writeFile(join(runDir, 'task.json'), JSON.stringify(task, null, 2));
  await persistPlannerResolution(runDir, {
    planPath: '/tmp/plan.md',
    summaryPath: null,
  });
  const updated = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(updated.defects_run_root, '/tmp/defects');
});
