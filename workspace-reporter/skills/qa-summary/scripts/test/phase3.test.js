import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase3 } from '../lib/phase3.mjs';

test('builds full draft with section 1 plus sections 2 through 10', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase3-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(
    join(runDir, 'context', 'feature_overview_table.md'),
    '### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |'
  );
  await writeFile(
    join(runDir, 'context', 'defect_summary.json'),
    JSON.stringify({
      totalDefects: 1,
      openDefects: 0,
      resolvedDefects: 1,
      defects: [],
      prs: [],
    })
  );
  const code = await runPhase3('BCIN-7289', runDir);
  assert.equal(code, 0);
  const draft = await readFile(join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'), 'utf8');
  assert.match(draft, /### 1\. Feature Overview/);
  assert.match(draft, /### 10\. Automation Coverage/);
});

test('blocks when feature overview table is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase3-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(join(runDir, 'context', 'defect_summary.json'), '{}');
  const code = await runPhase3('BCIN-7289', runDir);
  assert.equal(code, 2);
});

test('blocks when defect context is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase3-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  await writeFile(
    join(runDir, 'context', 'feature_overview_table.md'),
    '### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-7289 |'
  );

  const code = await runPhase3('BCIN-7289', runDir);
  assert.equal(code, 2);
});
