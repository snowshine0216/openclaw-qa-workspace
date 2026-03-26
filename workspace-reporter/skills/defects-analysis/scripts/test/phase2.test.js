import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase2.sh');

test('writes jira_raw and per-issue files from provided fixture json', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":["BCIN-5809"]}\n');

  const jiraRaw = {
    issues: [
      {
        key: 'BUG-1',
        fields: {
          summary: 'Pin panel hides unexpectedly',
          description: 'See https://github.com/org/repo/pull/12',
          status: { name: 'Resolved' },
          priority: { name: 'High' },
          assignee: { displayName: 'Ada' },
          resolutiondate: '2026-03-10T12:00:00.000+0000',
          comment: { comments: [] },
        },
      },
    ],
  };

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, TEST_JIRA_RAW_JSON: JSON.stringify(jiraRaw) },
  });

  assert.equal(result.status, 0);
  const raw = JSON.parse(await readFile(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
  const issue = JSON.parse(await readFile(join(runDir, 'context', 'jira_issues', 'BUG-1.json'), 'utf8'));
  assert.equal(raw.issues.length, 1);
  assert.equal(issue.key, 'BUG-1');

  await rm(runDir, { recursive: true, force: true });
});

test('reuses cached jira_raw.json for generate_from_cache without refetching', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-cache-'));
  await mkdir(join(runDir, 'context', 'jira_issues'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":["BCIN-5809"]}\n');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-CACHED',
          fields: {
            summary: 'Cached defect',
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
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"generate_from_cache","processed_defects":0,"current_phase":"phase1_scope"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"data_fetched_at":"2026-03-10T12:00:00Z"}\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: '/definitely/missing' },
  });

  assert.equal(result.status, 0);
  const raw = JSON.parse(await readFile(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
  assert.equal(raw.issues[0].key, 'BUG-CACHED');

  await rm(runDir, { recursive: true, force: true });
});

test('reuses cached jira_raw.json for smart_refresh without refetching', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-smart-refresh-'));
  await mkdir(join(runDir, 'context', 'jira_issues'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":["BCIN-5809"]}\n');
  await writeFile(
    join(runDir, 'context', 'jira_raw.json'),
    JSON.stringify({
      issues: [
        {
          key: 'BUG-SMART',
          fields: {
            summary: 'Smart refresh cached defect',
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
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"smart_refresh","processed_defects":0,"current_phase":"phase1_scope"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"data_fetched_at":"2026-03-10T12:00:00Z"}\n');

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: '/definitely/missing' },
  });

  assert.equal(result.status, 0);
  const raw = JSON.parse(await readFile(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
  assert.equal(raw.issues[0].key, 'BUG-SMART');

  await rm(runDir, { recursive: true, force: true });
});

test('handles empty feature scope without crashing live extraction', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-empty-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":[]}\n');
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"proceed","processed_defects":0,"current_phase":"phase1_scope"}\n',
  );
  await writeFile(join(runDir, 'run.json'), '{"data_fetched_at":null}\n');

  const result = spawnSync('bash', [SCRIPT, 'project = BCIN', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: '/definitely/missing' },
  });

  assert.equal(result.status, 0);
  const raw = JSON.parse(await readFile(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
  assert.deepEqual(raw, { issues: [] });

  await rm(runDir, { recursive: true, force: true });
});

test('blocks generate_from_cache when jira_raw.json is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-missing-cache-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":["BCIN-5809"]}\n');
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"generate_from_cache","processed_defects":0,"current_phase":"phase1_scope"}\n',
  );

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: '/definitely/missing' },
  });

  assert.equal(result.status, 2);
  assert.match(result.stdout + result.stderr, /CACHE_REQUIRED_MISSING/);

  await rm(runDir, { recursive: true, force: true });
});

test('uses direct JQL extraction for reporter_scope_jql runs', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-jql-'));
  const jiraStub = join(runDir, 'jira-run.sh');
  const logFile = join(runDir, 'jira.log');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":[]}\n');
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'jql_deadbeefcafe', route_kind: 'reporter_scope_jql' }),
  );
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"proceed","processed_defects":0,"current_phase":"phase1_scope"}\n',
  );
  await writeFile(
    jiraStub,
    `#!/usr/bin/env bash
set -euo pipefail
printf 'CMD=%s\\n' "$*" >> "${logFile}"
if [[ "$1 $2" == "project list" ]]; then
  exit 1
fi
if [[ "$1 $2" == "issue list" ]]; then
  cat <<'EOF'
[{"key":"BUG-123","fields":{"summary":"Direct defect","status":{"name":"Resolved"},"priority":{"name":"High"},"assignee":{"displayName":"Ada"},"resolutiondate":"2026-03-10T12:00:00.000+0000","comment":{"comments":[]}}}]
EOF
  exit 0
fi
exit 1
`,
  );
  spawnSync('chmod', ['+x', jiraStub], { encoding: 'utf8' });

  const rawInput = 'project = BCIN AND issuetype = Defect';
  const result = spawnSync('bash', [SCRIPT, rawInput, runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: jiraStub },
  });

  assert.equal(result.status, 0);
  const raw = JSON.parse(await readFile(join(runDir, 'context', 'jira_raw.json'), 'utf8'));
  const log = await readFile(logFile, 'utf8');
  assert.equal(raw.issues[0].key, 'BUG-123');
  assert.match(log, new RegExp(`CMD=issue list --jql ${rawInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  assert.doesNotMatch(log, /project list/);

  await rm(runDir, { recursive: true, force: true });
});

test('feature-based extraction JQL uses linkedIssues + parent + Parent Link (not text~)', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase2-jql-linked-'));
  const jiraStub = join(runDir, 'jira-run.sh');
  const logFile = join(runDir, 'jira.log');
  await mkdir(join(runDir, 'context', 'jira_issues'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_keys.json'), '{"feature_keys":["FEAT-1"]}\n');
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'FEAT-1', route_kind: 'feature_keys' }),
  );
  await writeFile(
    join(runDir, 'task.json'),
    '{"selected_mode":"proceed","processed_defects":0,"current_phase":"phase1_scope"}\n',
  );
  await writeFile(
    jiraStub,
    `#!/usr/bin/env bash
set -euo pipefail
printf 'CMD=%s\\n' "$*" >> "${logFile}"
if [[ "$1 $2" == "project list" ]]; then
  printf 'KEY\\tNAME\\nBCIN\\tBCIN Project\\n'
  exit 0
fi
if [[ "$1 $2" == "issue list" ]]; then
  printf '[{"key":"BUG-99","fields":{"summary":"linked defect","status":{"name":"Open"},"priority":{"name":"High"},"assignee":{"displayName":"Ada"},"resolutiondate":null,"comment":{"comments":[]}}}]\\n'
  exit 0
fi
exit 1
`,
  );
  spawnSync('chmod', ['+x', jiraStub], { encoding: 'utf8' });

  const result = spawnSync('bash', [SCRIPT, 'FEAT-1', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: jiraStub },
  });

  assert.equal(result.status, 0, `phase2 failed:\n${result.stderr}`);
  const log = await readFile(logFile, 'utf8');

  assert.match(log, /linkedIssues\("FEAT-1"\)/, 'JQL must use linkedIssues()');
  assert.match(log, /parent = "FEAT-1"/, 'JQL must include parent =');
  assert.match(log, /"Parent Link" = "FEAT-1"/, 'JQL must include "Parent Link" =');
  assert.doesNotMatch(log, /text ~ "FEAT-1"/, 'JQL must NOT use text ~ (old noisy clause)');

  await rm(runDir, { recursive: true, force: true });
});
