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

test('writes background_solution_seed.md to context when planner has intro text', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-plan-bg-'));
  const planPath = join(planDir, 'qa_plan_final.md');
  await writeFile(
    planPath,
    [
      '# QA Plan',
      '',
      '### 1. Feature Overview',
      '| Field | Value |',
      '| --- | --- |',
      '| Feature | BCIN-7289 |',
      '| QA Owner | team |',
      '',
      '## 1. Introduction',
      '',
      'As users migrate from the old UI, they need new capabilities in the updated product.',
    ].join('\n')
  );
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-bg-'));
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
  const seed = await readFile(join(runDir, 'context', 'background_solution_seed.md'), 'utf8');
  assert.match(seed, /As users migrate from the old UI/);
});

test('writes empty background_solution_seed.md when no intro section exists in planner', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-plan-nobg-'));
  const planPath = join(planDir, 'qa_plan_final.md');
  await writeFile(
    planPath,
    [
      '# QA Plan',
      '',
      '### 1. Feature Overview',
      '| Field | Value |',
      '| --- | --- |',
      '| Feature | BCIN-7289 |',
      '| QA Owner | team |',
    ].join('\n')
  );
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-nobg-'));
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
  const seed = await readFile(join(runDir, 'context', 'background_solution_seed.md'), 'utf8');
  // Should be empty or minimal when no intro section
  assert.equal(seed.trim(), '');
});

test('persists jira_feature_meta.json when jira returns metadata', async () => {
  const { execSync } = await import('node:child_process');
  const planDir = await mkdtemp(join(tmpdir(), 'qa-plan-jira-'));
  const planPath = join(planDir, 'qa_plan_final.md');
  await writeFile(
    planPath,
    '# QA Plan\n\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |\n'
  );
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase1-jira-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_run_root: planDir, planner_plan_path: planPath })
  );

  // Create a fake jira CLI that returns metadata JSON
  const fakeJiraDir = await mkdtemp(join(tmpdir(), 'fake-jira-'));
  const fakeJira = join(fakeJiraDir, 'jira');
  await writeFile(
    fakeJira,
    '#!/usr/bin/env bash\necho \'{"fields":{"summary":"My Feature","fixVersions":[{"name":"v3.0"}],"customfield_qa_owner":{"displayName":"bob"}}}\'\n'
  );
  execSync(`chmod +x "${fakeJira}"`);

  const origPath = process.env.PATH;
  process.env.PATH = `${fakeJiraDir}:${origPath}`;
  try {
    const { runPhase1 } = await import('../lib/phase1.mjs');
    const code = await runPhase1('BCIN-7289', runDir);
    assert.equal(code, 0);
    const meta = JSON.parse(await readFile(join(runDir, 'context', 'jira_feature_meta.json'), 'utf8'));
    assert.equal(meta.release, 'v3.0');
    assert.equal(meta.qa_owner, 'bob');
    assert.equal(meta.summary, 'My Feature');
  } finally {
    process.env.PATH = origPath;
  }
});
