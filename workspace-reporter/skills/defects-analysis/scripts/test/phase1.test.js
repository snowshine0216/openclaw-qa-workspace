import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase1.sh');

test('expands release scope into feature keys and default actions', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'release_26.03', route_kind: 'reporter_scope_release' }),
  );

  const result = spawnSync('bash', [SCRIPT, '26.03', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_FEATURE_KEYS_JSON: '["TST-5809","TST-5810"]',
    },
  });

  assert.equal(result.status, 0);
  const keys = JSON.parse(await readFile(join(runDir, 'context', 'feature_keys.json'), 'utf8'));
  const matrix = JSON.parse(
    await readFile(join(runDir, 'context', 'feature_state_matrix.json'), 'utf8'),
  );
  assert.deepEqual(keys.feature_keys, ['TST-5809', 'TST-5810']);
  assert.equal(matrix.features.length, 2);
  assert.deepEqual(
    matrix.features.map((entry) => entry.default_action),
    ['proceed', 'proceed'],
  );

  await rm(runDir, { recursive: true, force: true });
});

test('maps release feature states from canonical child runs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-plan-root-'));
  const runDir = join(root, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', 'release_26.03');
  const skillRunsDir = join(root, 'workspace-reporter', 'skills', 'defects-analysis', 'runs');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(skillRunsDir, 'BCIN-5809', 'context'), { recursive: true });
  await mkdir(join(skillRunsDir, 'BCIN-5810', 'context'), { recursive: true });
  await mkdir(join(skillRunsDir, 'BCIN-5811', 'context'), { recursive: true });
  await mkdir(join(skillRunsDir, 'BCIN-5812', 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'release_26.03', route_kind: 'reporter_scope_release' }),
  );
  await writeFile(join(skillRunsDir, 'BCIN-5809', 'BCIN-5809_REPORT_FINAL.md'), 'final\n');
  await writeFile(join(skillRunsDir, 'BCIN-5810', 'BCIN-5810_REPORT_DRAFT.md'), 'draft\n');
  await writeFile(join(skillRunsDir, 'BCIN-5811', 'context', 'jira_raw.json'), '{"issues":[]}\n');
  await writeFile(
    join(skillRunsDir, 'BCIN-5812', 'context', 'feature_summary.json'),
    '{"feature_key":"BCIN-5812"}\n',
  );

  const result = spawnSync('bash', [SCRIPT, '26.03', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      REPO_ROOT: root,
      TEST_FEATURE_KEYS_JSON: '["BCIN-5809","BCIN-5810","BCIN-5811","BCIN-5812","BCIN-5813"]',
    },
  });

  assert.equal(result.status, 0);
  const matrix = JSON.parse(
    await readFile(join(runDir, 'context', 'feature_state_matrix.json'), 'utf8'),
  );
  assert.deepEqual(
    matrix.features.map((entry) => [entry.feature_key, entry.report_state, entry.default_action]),
    [
      ['BCIN-5809', 'FINAL_EXISTS', 'use_existing'],
      ['BCIN-5810', 'DRAFT_EXISTS', 'resume'],
      ['BCIN-5811', 'CONTEXT_ONLY', 'generate_from_cache'],
      ['BCIN-5812', 'FRESH', 'proceed'],
      ['BCIN-5813', 'FRESH', 'proceed'],
    ],
  );

  await rm(root, { recursive: true, force: true });
});

test('applies explicit release refresh mode to every child selected action', async () => {
  const root = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-refresh-root-'));
  const runDir = join(root, 'workspace-reporter', 'skills', 'defects-analysis', 'runs', 'release_26.03');
  const skillRunsDir = join(root, 'workspace-reporter', 'skills', 'defects-analysis', 'runs');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(skillRunsDir, 'BCIN-5809', 'context'), { recursive: true });
  await mkdir(join(skillRunsDir, 'BCIN-5810', 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'release_26.03', route_kind: 'reporter_scope_release' }),
  );
  await writeFile(join(runDir, 'task.json'), '{"selected_mode":"smart_refresh"}\n');
  await writeFile(join(skillRunsDir, 'BCIN-5809', 'BCIN-5809_REPORT_FINAL.md'), 'final\n');
  await writeFile(join(skillRunsDir, 'BCIN-5810', 'BCIN-5810_REPORT_DRAFT.md'), 'draft\n');

  const result = spawnSync('bash', [SCRIPT, '26.03', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      REPO_ROOT: root,
      TEST_FEATURE_KEYS_JSON: '["BCIN-5809","BCIN-5810","BCIN-5811"]',
    },
  });

  assert.equal(result.status, 0);
  const matrix = JSON.parse(
    await readFile(join(runDir, 'context', 'feature_state_matrix.json'), 'utf8'),
  );
  assert.deepEqual(
    matrix.features.map((entry) => [entry.feature_key, entry.default_action, entry.selected_action]),
    [
      ['BCIN-5809', 'use_existing', 'smart_refresh'],
      ['BCIN-5810', 'resume', 'smart_refresh'],
      ['BCIN-5811', 'proceed', 'smart_refresh'],
    ],
  );

  await rm(root, { recursive: true, force: true });
});

test('uses plain jira project list output for release discovery', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-live-'));
  const jiraStub = join(runDir, 'jira-run.sh');
  const logFile = join(runDir, 'jira.log');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'release_26.03', route_kind: 'reporter_scope_release' }),
  );
  await writeFile(
    jiraStub,
    `#!/usr/bin/env bash
set -euo pipefail
printf 'CMD=%s\\n' "$*" >> "${logFile}"
if [[ "$1 $2" == "project list" ]]; then
  cat <<'EOF'
NAME KEY TYPE
Alpha BCIN software
Beta QA software
EOF
  exit 0
fi
if [[ "$1 $2" == "issue list" ]]; then
  cat <<'EOF'
[{"key":"BCIN-5809"},{"key":"BCIN-5810"}]
EOF
  exit 0
fi
exit 1
`,
  );
  spawnSync('chmod', ['+x', jiraStub], { encoding: 'utf8' });

  const result = spawnSync('bash', [SCRIPT, '26.03', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: jiraStub },
  });

  assert.equal(result.status, 0);
  const keys = JSON.parse(await readFile(join(runDir, 'context', 'feature_keys.json'), 'utf8'));
  const log = await readFile(logFile, 'utf8');
  const projectListLine = log
    .split('\n')
    .find((line) => line.startsWith('CMD=project list'));
  assert.deepEqual(keys.feature_keys, ['BCIN-5809', 'BCIN-5810']);
  assert.match(log, /CMD=project list/);
  assert.equal(projectListLine, 'CMD=project list');

  await rm(runDir, { recursive: true, force: true });
});

test('treats reporter_scope_jql as a direct query instead of feature keys', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-jql-'));
  const jiraStub = join(runDir, 'jira-run.sh');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({ run_key: 'jql_deadbeefcafe', route_kind: 'reporter_scope_jql' }),
  );
  await writeFile(
    jiraStub,
    `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1 $2" == "issue list" ]]; then
  cat <<'EOF'
[{"key":"BUG-123"},{"key":"BUG-456"}]
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
  const keys = JSON.parse(await readFile(join(runDir, 'context', 'feature_keys.json'), 'utf8'));
  const scope = JSON.parse(await readFile(join(runDir, 'context', 'scope.json'), 'utf8'));
  assert.deepEqual(keys.feature_keys, []);
  assert.equal(scope.query_mode, 'direct_jql');
  assert.equal(scope.raw_input, rawInput);

  await rm(runDir, { recursive: true, force: true });
});

test('adds qa owner currentUser clause to release discovery query when release scope is set', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-release-scope-query-'));
  const jiraStub = join(runDir, 'jira-run.sh');
  const logFile = join(runDir, 'jira.log');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({
      run_key: 'release_26.04__scope_1234abcd',
      route_kind: 'reporter_scope_release',
      release_version: '26.04',
      release_scope: {
        qa_owner_mode: 'current_user',
        qa_owner_value: null,
        qa_owner_field: 'QA Owner',
      },
    }),
  );
  await writeFile(
    jiraStub,
    `#!/usr/bin/env bash
set -euo pipefail
printf 'CMD=%s\\n' "$*" >> "${logFile}"
if [[ "$1 $2" == "project list" ]]; then
  cat <<'EOF'
NAME KEY TYPE
Alpha BCIN software
EOF
  exit 0
fi
if [[ "$1 $2" == "issue list" ]]; then
  cat <<'EOF'
[{"key":"BCIN-5809"}]
EOF
  exit 0
fi
exit 1
`,
  );
  spawnSync('chmod', ['+x', jiraStub], { encoding: 'utf8' });

  const result = spawnSync('bash', [SCRIPT, 'run defects analysis for release 26.04 with qa owner me', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: jiraStub },
  });

  assert.equal(result.status, 0);
  const log = await readFile(logFile, 'utf8');
  const scope = JSON.parse(await readFile(join(runDir, 'context', 'scope.json'), 'utf8'));
  assert.match(
    log,
    /CMD=issue list --jql project in \(BCIN\) AND "Release\[Version Picker \(single version\)\]" = "26\.04" AND type = Feature AND "QA Owner" = currentUser\(\) --raw --paginate 50/,
  );
  assert.equal(scope.release_version, '26.04');
  assert.equal(scope.release_scope.qa_owner_mode, 'current_user');
  assert.match(scope.query, /"QA Owner" = currentUser\(\)/);
  assert.equal(scope.raw_input, 'run defects analysis for release 26.04 with qa owner me');

  await rm(runDir, { recursive: true, force: true });
});

test('adds explicit qa owner clause to release discovery query when release scope is set', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase1-release-scope-explicit-'));
  const jiraStub = join(runDir, 'jira-run.sh');
  const logFile = join(runDir, 'jira.log');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(
    join(runDir, 'context', 'route_decision.json'),
    JSON.stringify({
      run_key: 'release_26.04__scope_deadbeef',
      route_kind: 'reporter_scope_release',
      release_version: '26.04',
      release_scope: {
        qa_owner_mode: 'explicit',
        qa_owner_value: 'qa.user@example.com',
        qa_owner_field: 'QA Owner',
      },
    }),
  );
  await writeFile(
    jiraStub,
    `#!/usr/bin/env bash
set -euo pipefail
printf 'CMD=%s\\n' "$*" >> "${logFile}"
if [[ "$1 $2" == "project list" ]]; then
  cat <<'EOF'
NAME KEY TYPE
Alpha BCIN software
EOF
  exit 0
fi
if [[ "$1 $2" == "issue list" ]]; then
  cat <<'EOF'
[{"key":"BCIN-5809"}]
EOF
  exit 0
fi
exit 1
`,
  );
  spawnSync('chmod', ['+x', jiraStub], { encoding: 'utf8' });

  const result = spawnSync('bash', [SCRIPT, 'run defects analysis for release 26.04 with qa owner qa.user@example.com', runDir], {
    encoding: 'utf8',
    env: { ...process.env, JIRA_CLI_SCRIPT: jiraStub },
  });

  assert.equal(result.status, 0);
  const log = await readFile(logFile, 'utf8');
  const scope = JSON.parse(await readFile(join(runDir, 'context', 'scope.json'), 'utf8'));
  assert.match(
    log,
    /CMD=issue list --jql project in \(BCIN\) AND "Release\[Version Picker \(single version\)\]" = "26\.04" AND type = Feature AND "QA Owner" = "qa\.user@example\.com" --raw --paginate 50/,
  );
  assert.equal(scope.release_scope.qa_owner_mode, 'explicit');
  assert.equal(scope.release_scope.qa_owner_value, 'qa.user@example.com');
  assert.match(scope.query, /"QA Owner" = "qa\.user@example\.com"/);

  await rm(runDir, { recursive: true, force: true });
});
