import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase1 } from '../lib/phase1.mjs';

test('returns blocked when planner markdown cannot be resolved', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      planner_run_root: '/tmp/does-not-exist-qa-plan',
      planner_plan_path: null,
    })
  );
  const code = await runPhase1('BCIN-7289', runDir);
  assert.equal(code, 2);
});

test('writes normalized section 1 artifacts when plan exists', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-plan-'));
  const planPath = join(planDir, 'qa_plan_final.md');
  await writeFile(
    planPath,
    `# QA Plan\n\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |\n| QA Owner | team |`
  );
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      planner_run_root: planDir,
      planner_plan_path: planPath,
    })
  );
  const code = await runPhase1('BCIN-7289', runDir);
  assert.equal(code, 0);
  const featureTable = await readFile(join(runDir, 'context', 'feature_overview_table.md'), 'utf8');
  assert.match(featureTable, /### 1\. Feature Overview/);
  assert.match(featureTable, /QA Owner/);
  const source = JSON.parse(
    await readFile(join(runDir, 'context', 'feature_overview_source.json'), 'utf8')
  );
  assert.equal(source.source, 'planner_section');
});

test('preserves resolved planner paths in task.json after phase completion', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-plan-'));
  const featureDir = join(planDir, 'BCIN-7289');
  await mkdir(join(featureDir, 'context'), { recursive: true });

  const planPath = join(featureDir, 'qa_plan_final.md');
  const summaryPath = join(featureDir, 'context', 'final_plan_summary_BCIN-7289.md');
  await writeFile(
    planPath,
    `# QA Plan\n\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |\n| QA Owner | team |`
  );
  await writeFile(summaryPath, '# Planner Summary');

  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      planner_run_root: planDir,
      planner_plan_path: null,
      planner_plan_resolved_path: null,
      planner_summary_path: null,
      feature_overview_source: null,
    })
  );

  const code = await runPhase1('BCIN-7289', runDir);
  assert.equal(code, 0);

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.planner_plan_resolved_path, planPath);
  assert.equal(task.planner_summary_path, summaryPath);
  assert.match(task.feature_overview_table_path, /context\/feature_overview_table\.md$/);
  assert.equal(task.feature_overview_source, 'planner_section');
});

test('resolves repo-relative planner roots even when run_dir is outside the repo', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-external-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      planner_run_root: 'workspace-reporter/skills/qa-summary/scripts/test/fixtures/planner-runs',
      planner_plan_path: null,
    })
  );

  const code = await runPhase1('BCIN-ROOT', runDir);
  assert.equal(code, 0);

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.match(
    task.planner_plan_resolved_path,
    /workspace-reporter\/skills\/qa-summary\/scripts\/test\/fixtures\/planner-runs\/BCIN-ROOT\/qa_plan_final\.md$/
  );

  const featureTable = await readFile(join(runDir, 'context', 'feature_overview_table.md'), 'utf8');
  assert.match(featureTable, /Feature Overview/);
  assert.match(featureTable, /BCIN-ROOT/);
});
