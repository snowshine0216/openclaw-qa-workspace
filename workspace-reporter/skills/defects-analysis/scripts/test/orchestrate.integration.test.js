import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(
  process.cwd(),
  'workspace-reporter/skills/defects-analysis/scripts/orchestrate.sh',
);
const RUN_DIR = join(
  process.cwd(),
  'workspace-reporter/skills/defects-analysis/runs/BCIN-5809',
);

test('runs the full reporter-local flow with test fixtures', async () => {
  await rm(RUN_DIR, { recursive: true, force: true });

  const jiraRaw = {
    issues: [
      {
        key: 'BUG-1',
        fields: {
          summary: 'Panel hides unexpectedly',
          description: 'Fix in https://github.com/org/repo/pull/12',
          status: { name: 'Resolved' },
          priority: { name: 'High' },
          assignee: { displayName: 'Ada' },
          resolutiondate: '2026-03-10T12:00:00.000+0000',
          comment: { comments: [] },
        },
      },
    ],
  };

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_RUNTIME_ENV_OK: '1',
      TEST_JIRA_ISSUE_TYPE: 'Feature',
      TEST_JIRA_RAW_JSON: JSON.stringify(jiraRaw),
      TEST_SPAWN_OUTPUT_MODE: 'materialize',
      FEISHU_CHAT_ID: 'oc_test_chat',
    },
  });

  assert.equal(result.status, 0);
  const finalReport = await readFile(join(RUN_DIR, 'BCIN-5809_REPORT_FINAL.md'), 'utf8');
  assert.match(finalReport, /QA Risk & Defect Analysis Report/);

  await rm(RUN_DIR, { recursive: true, force: true });
});
