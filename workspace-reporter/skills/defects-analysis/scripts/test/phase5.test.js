import test from 'node:test';
import assert from 'node:assert/strict';
import { access, chmod, mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
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

test('does not promote shallow boilerplate output when reviewer fails the draft', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase5-shallow-'));
  const reporterScript = join(runDir, 'stub-generate-report.mjs');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-3',
          fields: {
            summary: 'Boilerplate rejection path',
            description: 'No PR linked',
            status: { name: 'Open' },
            priority: { name: 'High' },
            assignee: { displayName: 'Ada' },
            resolutiondate: null,
            comment: { comments: [] },
          },
        },
      ],
    }),
  );
  await writeFile(
    join(runDir, 'task.json'),
    '{"run_key":"BCIN-5809","route_kind":"reporter_scope_single_key","overall_status":"review_in_progress","current_phase":"phase5"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"spawn_history":{},"notification_pending":null}\n');
  await writeFile(
    reporterScript,
    `#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [runDir, runKey] = process.argv.slice(2);
const headings = [
  '## 1. Report Header',
  '## 2. Executive Summary',
  '## 3. Defect Breakdown by Status',
  '## 4. Risk Analysis by Functional Area',
  '## 5. Defect Analysis by Priority',
  '## 6. Code Change Analysis',
  '## 7. Residual Risk Assessment',
  '## 8. Recommended QA Focus Areas',
  '## 9. Test Environment Recommendations',
  '## 10. Verification Checklist for Release',
  '## 11. Conclusion',
  '## 12. Appendix: Defect Reference List',
];

writeFileSync(
  join(runDir, \`\${runKey}_REPORT_DRAFT.md\`),
  \`\${headings.join('\\n')}\\n\\nSee context/prs/ for details.\\nReview open defects and prioritize testing by priority and functional area.\\n\`,
  'utf8',
);
`,
  );
  await chmod(reporterScript, 0o755);

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      REPORTER_SCRIPT: reporterScript,
      JIRA_SERVER: 'https://jira.real.example',
    },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /failed to converge/i);
  const review = await readFile(join(runDir, 'BCIN-5809_REVIEW_SUMMARY.md'), 'utf8');
  assert.match(review, /## Review Result: fail/);
  await assert.rejects(
    access(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), constants.R_OK),
  );

  await rm(runDir, { recursive: true, force: true });
});

test('applies deterministic formatting auto-fixes before failing phase5 review', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase5-autofix-'));
  const reporterScript = join(runDir, 'stub-generate-report.mjs');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BCIN-5809',
          fields: {
            summary: 'Embed Library Report Editor into the Workstation Report Authoring',
            description: 'Fix in https://github.com/org/workstation-report-editor/pull/12',
            status: { name: 'Open' },
            priority: { name: 'High' },
            assignee: { displayName: 'Ada' },
            resolutiondate: null,
            comment: { comments: [] },
          },
        },
      ],
    }),
  );
  await writeFile(
    join(runDir, 'context', 'pr_impact_summary.json'),
    JSON.stringify({
      pr_count: 1,
      repos_changed: ['workstation-report-editor'],
    }),
  );
  await writeFile(
    join(runDir, 'task.json'),
    '{"run_key":"BCIN-5809","route_kind":"reporter_scope_single_key","overall_status":"review_in_progress","current_phase":"phase5"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"spawn_history":{},"notification_pending":null}\n');
  await writeFile(
    reporterScript,
    `#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [runDir, runKey] = process.argv.slice(2);
writeFileSync(
  join(runDir, \`\${runKey}_REPORT_DRAFT.md\`),
  \`## 1. Report Header
Feature Title: Embed Library Report Editor into the Workstation Report Authoring
## 2. Executive Summary
Feature title present, risk remains high.
## 3. Defect Breakdown by Status
BCIN-5809 remains open.
## 4. Risk Analysis by Functional Area
| Area | Open | High |
|------|------|------|
| Save Flow | 1 | 1 |
## 5. Defect Analysis by Priority
Blocking defects: BCIN-5809
## 6. Code Change Analysis
workstation-report-editor PR #12 affects save flow.
## 7. Residual Risk Assessment
Overall Risk Level: **HIGH**
## 8. Recommended QA Focus Areas
Save flow
## 9. Test Environment Recommendations
Exercise translated prompt fixtures.
## 10. Verification Checklist for Release
Confirm save path and prompt persistence.
## 11. Conclusion
Release Recommendation: hold release until BCIN-5809 is resolved.
## 12. Appendix: Defect Reference List
BCIN-5809\`,
  'utf8',
);
`,
  );
  await chmod(reporterScript, 0o755);

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      REPORTER_SCRIPT: reporterScript,
      FEISHU_CHAT_ID: 'oc_test_chat',
      JIRA_SERVER: 'https://jira.real.example',
    },
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const finalReport = await readFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), 'utf8');
  const review = await readFile(join(runDir, 'BCIN-5809_REVIEW_SUMMARY.md'), 'utf8');
  assert.match(finalReport, /\*\*Feature Title:\*\* Embed Library Report Editor/);
  assert.match(review, /## Review Result: pass/);

  await rm(runDir, { recursive: true, force: true });
});
