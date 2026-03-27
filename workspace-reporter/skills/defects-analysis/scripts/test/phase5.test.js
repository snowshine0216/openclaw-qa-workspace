import test from 'node:test';
import assert from 'node:assert/strict';
import { access, chmod, mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase5.sh');

// Ensure the node binary directory is in PATH so bash scripts can call `node`
const NODE_BIN_DIR = dirname(process.execPath);
const TEST_ENV_BASE = {
  ...process.env,
  PATH: `${NODE_BIN_DIR}:${process.env.PATH ?? ''}`,
};

const JIRA_RAW = JSON.stringify({
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
});

async function setupBaseRun(opts = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase5-'));
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}');
  await writeFile(join(runDir, 'context', 'runtime_setup_BCIN-5809.json'), '{}');
  await writeFile(join(runDir, 'context', 'jira_raw.json'), opts.jiraRaw ?? JIRA_RAW);
  await writeFile(
    join(runDir, 'context', 'pr_impact_summary.json'),
    '{"pr_count":1,"domains":["api","ui"]}\n',
  );
  // Pre-populate feature_metadata.json so phase5.sh skips the extract_feature_metadata node call
  await writeFile(
    join(runDir, 'context', 'feature_metadata.json'),
    JSON.stringify({ feature_key: 'BCIN-5809', feature_title: 'Test Feature', release_version: '26.04' }),
  );
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      run_key: 'BCIN-5809',
      route_kind: 'reporter_scope_single_key',
      overall_status: 'review_in_progress',
      current_phase: 'phase5',
      phase5_round: 0,
      ...opts.taskExtra,
    }),
  );
  await writeFile(join(runDir, 'run.json'), '{"spawn_history":{},"notification_pending":null}\n');
  return runDir;
}

// ── Pre-spawn tests ──────────────────────────────────────────────────────────

test('pre-spawn: emits SPAWN_MANIFEST and exits 0', async () => {
  const runDir = await setupBaseRun();

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...TEST_ENV_BASE, JIRA_SERVER: 'https://jira.real.example' },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SPAWN_MANIFEST:/);
  const manifestPath = join(runDir, 'phase5_spawn_manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.count, 1);
  assert.ok(manifest.requests[0].openclaw.args.task);

  await rm(runDir, { recursive: true, force: true });
});

test('pre-spawn: manifest prompt contains defect key from jira_raw', async () => {
  const runDir = await setupBaseRun();

  spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...TEST_ENV_BASE, JIRA_SERVER: 'https://jira.real.example' },
  });

  const manifest = JSON.parse(await readFile(join(runDir, 'phase5_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /BUG-1/);

  await rm(runDir, { recursive: true, force: true });
});

test('pre-spawn: uses stub MANIFEST_SCRIPT when env override provided', async () => {
  const runDir = await setupBaseRun();
  const stubScript = join(runDir, 'stub-manifest.mjs');
  await writeFile(
    stubScript,
    `#!/usr/bin/env node\nimport { writeFileSync } from 'node:fs';\nimport { join } from 'node:path';\nconst runDir = process.argv[2];\nconst manifest = { version:1, source_kind:'test', count:1, requests:[{openclaw:{args:{task:'stub'}}}] };\nwriteFileSync(join(runDir,'phase5_spawn_manifest.json'), JSON.stringify(manifest));\nprocess.stdout.write('SPAWN_MANIFEST: ' + join(runDir,'phase5_spawn_manifest.json') + '\\n');\n`,
  );
  await chmod(stubScript, 0o755);

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...TEST_ENV_BASE, MANIFEST_SCRIPT: stubScript, JIRA_SERVER: 'https://jira.real.example' },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SPAWN_MANIFEST:/);

  await rm(runDir, { recursive: true, force: true });
});

// ── Post tests ───────────────────────────────────────────────────────────────

test('post: finalizes report and emits FEISHU_NOTIFY when delta is accept', async () => {
  const runDir = await setupBaseRun();
  await writeFile(
    join(runDir, 'BCIN-5809_REPORT_DRAFT.md'),
    '# QA Risk & Defect Analysis Report\n\n[BUG-1](https://jira.real.example/browse/BUG-1) Crash when a < b\n',
  );
  await writeFile(join(runDir, 'context', 'report_review_delta.md'), '## Verdict\n\n- accept\n');
  await writeFile(join(runDir, 'context', 'report_review_notes.md'), '## Report Review Notes\n\n### C1\n**Verdict**: pass\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], {
    encoding: 'utf8',
    env: { ...TEST_ENV_BASE, FEISHU_CHAT_ID: 'oc_test_chat', JIRA_SERVER: 'https://jira.real.example' },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /FEISHU_NOTIFY:/);
  assert.match(result.stdout, /PHASE5_DONE/);

  const finalReport = await readFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), 'utf8');
  assert.match(finalReport, /QA Risk & Defect Analysis Report/);

  const freshness = JSON.parse(
    await readFile(join(runDir, 'context', 'analysis_freshness_BCIN-5809.json'), 'utf8'),
  );
  assert.equal(freshness.source_issue_timestamp, '2026-03-10T12:00:00.000+0000');

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.overall_status, 'completed');
  assert.equal(task.notification_status, 'sent');

  await rm(runDir, { recursive: true, force: true });
});

test('post: exits 0 without finalizing when delta is return phase5', async () => {
  const runDir = await setupBaseRun({ taskExtra: { phase5_round: 0 } });
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Blocking Findings\n\n| C3 | no keys | fail |\n\n## Verdict\n\n- return phase5\n',
  );

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], {
    encoding: 'utf8',
    env: { ...TEST_ENV_BASE, JIRA_SERVER: 'https://jira.real.example' },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REPORT_REVIEW_RETURN:1/);

  // Final report must NOT exist
  await assert.rejects(access(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), constants.R_OK));

  // task.json updated with return_to_phase
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.return_to_phase, 'phase5');
  assert.equal(task.phase5_round, 1);

  await rm(runDir, { recursive: true, force: true });
});

test('post: exits 1 when review delta is missing', async () => {
  const runDir = await setupBaseRun();

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], {
    encoding: 'utf8',
    env: { ...TEST_ENV_BASE, JIRA_SERVER: 'https://jira.real.example' },
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /report_review_delta/i);

  await rm(runDir, { recursive: true, force: true });
});

test('post: persists notification pending when Feishu delivery fails', async () => {
  const runDir = await setupBaseRun();
  await writeFile(
    join(runDir, 'BCIN-5809_REPORT_DRAFT.md'),
    '# QA Risk & Defect Analysis Report\n',
  );
  await writeFile(join(runDir, 'context', 'report_review_delta.md'), '## Verdict\n\n- accept\n');
  await writeFile(join(runDir, 'context', 'report_review_notes.md'), '## Report Review Notes\n\n### C1\n**Verdict**: pass\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir, '--post'], {
    encoding: 'utf8',
    env: {
      ...TEST_ENV_BASE,
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
