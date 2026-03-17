import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildFeatureOverviewTable } from '../lib/buildFeatureOverviewTable.mjs';

test('extracts section 1 table from plan when present', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-summary-fo-'));
  const planPath = join(planDir, 'qa_plan.md');
  await writeFile(
    planPath,
    '# Plan\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |\n| Release | R1 |'
  );
  const result = await buildFeatureOverviewTable({
    featureKey: 'BCIN-7289',
    planPath,
    summaryPath: null,
  });
  assert.match(result.markdown, /### 1\. Feature Overview/);
  assert.match(result.markdown, /\| Feature \|/);
  assert.equal(result.metadata.source, 'planner_section');
});

test('fills missing rows with pending placeholders', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-summary-fo-'));
  const planPath = join(planDir, 'qa_plan.md');
  await writeFile(
    planPath,
    '# Plan\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |'
  );
  const result = await buildFeatureOverviewTable({
    featureKey: 'BCIN-7289',
    planPath,
    summaryPath: null,
  });
  assert.match(result.markdown, /\[PENDING/);
  assert.ok(result.metadata.missing_fields.length >= 0);
});

test('falls back to planner metadata when section 1 absent', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-summary-fo-'));
  const planPath = join(planDir, 'qa_plan.md');
  const summaryPath = join(planDir, 'context', 'final_plan_summary_BCIN-7289.md');
  await writeFile(planPath, '# Plan\nNo feature overview here.');
  const { mkdir } = await import('node:fs/promises');
  await mkdir(join(planDir, 'context'), { recursive: true });
  await writeFile(
    summaryPath,
    'Feature: BCIN-7289\nRelease: R1\nQA Owner: Team QA\nSE Design: Alice\nUX Design: Bob'
  );
  const result = await buildFeatureOverviewTable({
    featureKey: 'BCIN-7289',
    planPath,
    summaryPath,
  });
  assert.match(result.markdown, /### 1\. Feature Overview/);
  assert.match(result.markdown, /\| Release \| R1 \|/);
  assert.match(result.markdown, /\| QA Owner \| Team QA \|/);
  assert.match(result.markdown, /\| SE Design \| Alice \|/);
  assert.match(result.markdown, /\| UX Design \| Bob \|/);
  assert.equal(result.metadata.source, 'planner_metadata');
});

test('jiraMetadata overrides PENDING rows for Release and QA Owner', async () => {
  const planDir = await mkdtemp(join(tmpdir(), 'qa-bfot-jira-'));
  const planPath = join(planDir, 'qa_plan_final.md');
  await writeFile(
    planPath,
    '# QA Plan\n\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |\n'
  );
  const result = await buildFeatureOverviewTable({
    featureKey: 'BCIN-7289',
    planPath,
    summaryPath: null,
    jiraMetadata: { release: 'v2.0', qa_owner: 'alice@company.com' },
  });
  assert.match(result.markdown, /v2\.0/);
  assert.match(result.markdown, /alice@company\.com/);
  assert.doesNotMatch(result.markdown, /\[PENDING.*Release/);
  assert.doesNotMatch(result.markdown, /\[PENDING.*QA Owner/);
});
