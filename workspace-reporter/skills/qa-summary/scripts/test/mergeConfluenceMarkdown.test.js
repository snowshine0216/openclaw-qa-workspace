import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  mergeConfluenceMarkdown,
  extractPageIdFromUrl,
} from '../lib/mergeConfluenceMarkdown.mjs';

test('extractPageIdFromUrl extracts ID from Confluence URL', () => {
  const url = 'https://company.atlassian.net/wiki/spaces/QA/pages/5949096102/Example';
  assert.equal(extractPageIdFromUrl(url), '5949096102');
});

test('extractPageIdFromUrl returns null for invalid URL', () => {
  assert.equal(extractPageIdFromUrl('https://example.com'), null);
  assert.equal(extractPageIdFromUrl(''), null);
});

test('create_new publishes only summary without planner content', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_plan_resolved_path: null })
  );
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\n| Field | Value |'
  );
  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'create_new',
    target: {},
  });
  assert.match(merged, /## 📊 QA Summary/);
  assert.match(merged, /### 1\. Feature Overview/);
});

test('create_new publishes only the summary draft regardless of planner QA Summary blocks', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  const plannerContent = '# Plan\n## 📊 QA Summary\n### 1. Old\nold content\n## Other';
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_plan_resolved_path: join(runDir, 'plan.md') })
  );
  await writeFile(join(runDir, 'plan.md'), plannerContent);
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-1 |'
  );
  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'create_new',
    target: {},
  });
  assert.match(merged, /## 📊 QA Summary/);
  assert.match(merged, /Feature \| BCIN-1/);
  // create_new publishes only summary — planner content must not bleed through
  assert.doesNotMatch(merged, /# Plan/);
  assert.doesNotMatch(merged, /old content/);
});

test('update_existing preserves content before and after QA Summary in existing page', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_plan_resolved_path: null })
  );
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\n| Field | Value |\n| --- | --- |\n| Feature | BCIN-1 |'
  );
  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'update_existing',
    target: { pageId: '123' },
    readPageContent: async () => '# Before\n## 📊 QA Summary\n### 1. Old\nold\n## After\nrest',
  });
  assert.match(merged, /# Before/);
  assert.match(merged, /## After/);
  assert.match(merged, /rest/);
  assert.doesNotMatch(merged, /### 1\. Old/);
});

test('update_existing replaces QA Summary on existing page content', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ planner_plan_resolved_path: null }));
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\nnew summary'
  );

  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'update_existing',
    target: { pageId: '123' },
    readPageContent: async () => '# Existing\n## 📊 QA Summary\nold summary\n## Notes\nkeep me',
  });

  assert.match(merged, /# Existing/);
  assert.match(merged, /new summary/);
  assert.match(merged, /## Notes/);
  assert.doesNotMatch(merged, /old summary/);
});

test('update_existing replaces legacy QA Summary headings instead of appending a second section', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ planner_plan_resolved_path: null }));
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\nnew summary'
  );

  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'update_existing',
    target: { pageId: '123' },
    readPageContent: async () => '# Existing\n## 5. QA Summary\nlegacy summary\n## 6. Notes\nkeep me',
  });

  assert.match(merged, /# Existing/);
  assert.match(merged, /## 📊 QA Summary/);
  assert.match(merged, /new summary/);
  assert.match(merged, /## 6\. Notes/);
  assert.doesNotMatch(merged, /legacy summary/);
  assert.equal((merged.match(/QA Summary/g) || []).length, 1);
});

test('update_existing appends summary when page has no QA Summary block', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ planner_plan_resolved_path: join(runDir, 'plan.md') }));
  await writeFile(join(runDir, 'plan.md'), '# Planner\nplanner body');
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\nnew summary'
  );

  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'update_existing',
    target: { pageId: '123' },
    readPageContent: async () => '# Existing\n## Notes\nkeep me',
  });

  assert.match(merged, /# Existing/);
  assert.match(merged, /## Notes/);
  assert.match(merged, /## 📊 QA Summary/);
  assert.match(merged, /new summary/);
  assert.doesNotMatch(merged, /# Planner/);
});

test('update_existing does not replace planner content when QA Summary is only mentioned in prose', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_plan_resolved_path: join(runDir, 'plan.md') })
  );
  await writeFile(join(runDir, 'plan.md'), '# Planner\nunused fallback');
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\nnew summary'
  );

  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'update_existing',
    target: { pageId: '123' },
    readPageContent: async () =>
      '# Existing\n## Notes\nSee QA Summary guidelines before publishing.\n### 1. Feature Overview\nkeep me',
  });

  assert.match(merged, /See QA Summary guidelines before publishing\./);
  assert.match(merged, /### 1\. Feature Overview\nkeep me/);
  assert.match(merged, /## 📊 QA Summary/);
  assert.match(merged, /new summary/);
});

test('update_existing blocks when current page content cannot be read safely', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_plan_resolved_path: join(runDir, 'plan.md') })
  );
  await writeFile(join(runDir, 'plan.md'), '# Planner\nunsafe fallback');
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\nnew summary'
  );

  await assert.rejects(
    mergeConfluenceMarkdown({
      featureKey: 'BCIN-1',
      runDir,
      publishMode: 'update_existing',
      target: { pageId: '123' },
      readPageContent: async () => '',
    }),
    /Unable to read existing Confluence page content/
  );
});

test('create_new publishes only QA summary without planner content', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-merge-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ planner_plan_resolved_path: join(runDir, 'plan.md') })
  );
  await writeFile(join(runDir, 'plan.md'), '# Full QA Plan\n## Background\nDetailed plan content here.');
  await writeFile(
    join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n### 1. Feature Overview\n| Field | Value |'
  );
  const merged = await mergeConfluenceMarkdown({
    featureKey: 'BCIN-1',
    runDir,
    publishMode: 'create_new',
    target: {},
  });
  assert.match(merged, /## 📊 QA Summary/);
  assert.doesNotMatch(merged, /# Full QA Plan/);
  assert.doesNotMatch(merged, /Detailed plan content here/);
});
