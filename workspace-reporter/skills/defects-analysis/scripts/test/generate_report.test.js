import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { generateReport } from '../lib/generate_report.mjs';

async function writeJiraRaw(runDir, issues) {
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({ issues }),
    'utf8',
  );
}

function createIssue(key, priority, status = 'Open') {
  return {
    key,
    fields: {
      summary: `${priority} defect`,
      status: { name: status },
      priority: { name: priority },
      assignee: { displayName: 'Ada' },
      resolutiondate: null,
    },
  };
}

test('generateReport marks Highest/Critical/P0/P1 open defects as HIGH risk', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-report-'));
  try {
    await writeJiraRaw(runDir, [
      createIssue('BUG-1', 'Highest'),
      createIssue('BUG-2', 'Critical'),
      createIssue('BUG-3', 'P0'),
      createIssue('BUG-4', 'P1'),
      createIssue('BUG-5', 'Medium', 'Resolved'),
    ]);

    const outPath = generateReport(runDir, 'BCIN-5809', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    assert.match(report, /### Risk Rating: \*\*HIGH\*\*/);
    assert.match(report, /High-risk open: 4\. Medium\/Low: 1 total\./);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});

test('generateReport keeps low risk when high-risk priorities are already resolved', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-report-'));
  try {
    await writeJiraRaw(runDir, [
      createIssue('BUG-1', 'Highest', 'Resolved'),
      createIssue('BUG-2', 'Critical', 'Done'),
      createIssue('BUG-3', 'Low', 'Open'),
    ]);

    const outPath = generateReport(runDir, 'BCIN-5810', 'https://jira.example.com');
    const report = await readFile(outPath, 'utf8');

    assert.match(report, /### Risk Rating: \*\*LOW\*\*/);
    assert.match(report, /High-risk open: 0\. Medium\/Low: 3 total\./);
  } finally {
    await rm(runDir, { recursive: true, force: true });
  }
});
