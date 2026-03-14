import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/phase0.sh');

test('delegates issue-class runs and writes delegated metadata', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_RUNTIME_ENV_OK: '1',
      TEST_JIRA_ISSUE_TYPE: 'Bug',
      TEST_SKIP_DELEGATE_SPAWN: '1',
    },
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /DELEGATED_RUN:/);
  const delegated = JSON.parse(
    await readFile(join(runDir, 'context', 'delegated_run.json'), 'utf8'),
  );
  assert.equal(delegated.route_kind, 'issue_class');

  await rm(runDir, { recursive: true, force: true });
});

test('initializes reporter-local run metadata for feature scope', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_RUNTIME_ENV_OK: '1',
      TEST_JIRA_ISSUE_TYPE: 'Feature',
    },
  });

  assert.equal(result.status, 0);
  const route = JSON.parse(await readFile(join(runDir, 'context', 'route_decision.json'), 'utf8'));
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(route.route_kind, 'reporter_scope_single_key');
  assert.equal(task.route_kind, 'reporter_scope_single_key');

  await rm(runDir, { recursive: true, force: true });
});

test('writes valid task.json for quoted JQL input', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase0-jql-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const rawInput = 'project = BCIN AND summary ~ "pin panel"';

  const result = spawnSync('bash', [SCRIPT, rawInput, runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_RUNTIME_ENV_OK: '1',
    },
  });

  assert.equal(result.status, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.raw_input, rawInput);
  assert.equal(task.route_kind, 'reporter_scope_jql');

  await rm(runDir, { recursive: true, force: true });
});

test('blocks destructive refresh when fetched data is less than one hour old', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-phase0-refresh-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const freshTimestamp = new Date().toISOString();
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), '# Final\n');
  await writeFile(
    join(runDir, 'run.json'),
    JSON.stringify({
      data_fetched_at: freshTimestamp,
      scope_discovered_at: freshTimestamp,
      output_generated_at: freshTimestamp,
      updated_at: freshTimestamp,
    }),
  );

  const result = spawnSync('bash', [SCRIPT, 'BCIN-5809', runDir], {
    encoding: 'utf8',
    env: {
      ...process.env,
      TEST_RUNTIME_ENV_OK: '1',
      SELECTED_MODE: 'full_regenerate',
    },
  });

  assert.equal(result.status, 2);
  assert.match(result.stdout + result.stderr, /DESTRUCTIVE_REFRESH_CONFIRMATION_REQUIRED/);
  const finalReport = await readFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), 'utf8');
  assert.match(finalReport, /Final/);

  await rm(runDir, { recursive: true, force: true });
});
