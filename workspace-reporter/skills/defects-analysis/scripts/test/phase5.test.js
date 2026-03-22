import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase5.sh');

test('generates final bundle and emits feishu marker after a passing review', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase5-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-1',
          fields: {
            summary: 'Crash when a < b',
            description: 'Fix in https://github.com/org/repo/pull/12',
            status: { name: 'Resolved' },
            priority: { name: 'High' },
            assignee: { displayName: 'Ada' },
            resolutiondate: '2026-03-10T12:00:00.000+0000',
            comment: { comments: [] },
          },
        },
      ],
    }),
  );
  await writeFile(
    join(runDir, 'context', 'pr_impact_summary.json'),
    '{"pr_count":1,"domains":["api","ui"]}\n',
  );
  await writeFile(
    join(runDir, 'context', 'prs', 'pr-1_impact.md'),
    '# PR 12 Fix Risk Analysis\n\nRegression Risk: Medium\n',
  );
  await writeFile(
    join(runDir, 'task.json'),
    '{"run_key":"BCIN-5809","route_kind":"reporter_scope_single_key","overall_status":"review_in_progress","current_phase":"phase5"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"spawn_history":{},"notification_pending":null}\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, FEISHU_CHAT_ID: 'oc_test_chat', JIRA_SERVER: 'https://jira.real.example' },
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /FEISHU_NOTIFY:/);
  const finalReport = await readFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), 'utf8');
  const review = await readFile(join(runDir, 'BCIN-5809_REVIEW_SUMMARY.md'), 'utf8');
  const freshness = JSON.parse(
    await readFile(join(runDir, 'context', 'analysis_freshness_BCIN-5809.json'), 'utf8'),
  );
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.match(finalReport, /QA Risk & Defect Analysis Report/);
  assert.match(finalReport, /\[BUG-1\]\(https:\/\/jira\.real\.example\/browse\/BUG-1\)/);
  assert.match(finalReport, /Crash when a < b/);
  assert.match(review, /## Review Result: pass/);
  assert.equal(freshness.source_issue_timestamp, '2026-03-10T12:00:00.000+0000');
  await assert.rejects(
    access(join(runDir, 'BCIN-5809_SELF_TEST_GAP_ANALYSIS.md'), constants.R_OK),
  );
  await assert.rejects(
    access(join(runDir, 'BCIN-5809_QA_PLAN_CROSS_ANALYSIS.md'), constants.R_OK),
  );
  assert.equal(task.overall_status, 'completed');
  assert.equal(task.notification_status, 'sent');

  await rm(runDir, { recursive: true, force: true });
});

test('persists notification pending when Feishu delivery fails', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase5-notify-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-2',
          fields: {
            summary: 'Notification failure path',
            description: 'No PR linked',
            status: { name: 'Resolved' },
            priority: { name: 'Medium' },
            assignee: { displayName: 'Ada' },
            resolutiondate: '2026-03-10T12:00:00.000+0000',
            comment: { comments: [] },
          },
        },
      ],
    }),
  );
  await writeFile(join(runDir, 'context', 'pr_impact_summary.json'), '{"pr_count":0,"domains":[]}\n');
  await writeFile(
    join(runDir, 'task.json'),
    '{"run_key":"BCIN-5809","route_kind":"reporter_scope_single_key","overall_status":"review_in_progress","current_phase":"phase5","notification_status":"pending"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"spawn_history":{},"notification_pending":null}\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      FEISHU_NOTIFY_SHOULD_FAIL: '1',
      JIRA_SERVER: 'https://jira.real.example',
    },
  });

  assert.equal(result.status, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(task.notification_status, 'pending');
  assert.deepEqual(run.notification_pending.payload.run_key, 'BCIN-5809');

  await rm(runDir, { recursive: true, force: true });
});
