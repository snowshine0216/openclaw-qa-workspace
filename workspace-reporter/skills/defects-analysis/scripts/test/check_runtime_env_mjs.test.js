import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import { buildRuntimeSetup } from '../check_runtime_env.mjs';

test('writes runtime setup json and markdown artifacts', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'defects-analysis-runtime-'));
  const result = await buildRuntimeSetup('BCIN-5809', ['jira', 'github'], outDir, {
    env: { TEST_RUNTIME_ENV_OK: '1' },
  });

  assert.equal(result.blocked, false);
  const json = JSON.parse(await readFile(join(outDir, 'runtime_setup_BCIN-5809.json'), 'utf8'));
  const markdown = await readFile(join(outDir, 'runtime_setup_BCIN-5809.md'), 'utf8');
  assert.equal(json.setup_entries.length, 2);
  assert.match(markdown, /Runtime Setup/);

  await rm(outDir, { recursive: true, force: true });
});

test('resolves jira wrapper independently of caller cwd', async () => {
  const workDir = await mkdtemp(join(tmpdir(), 'defects-analysis-runtime-cwd-'));
  const binDir = join(workDir, 'bin');
  const outDir = join(workDir, 'out');
  const envFile = join(workDir, '.jira.env');
  const logFile = join(workDir, 'jira.log');
  const jiraStub = join(binDir, 'jira');
  const script = join(
    process.cwd(),
    'workspace-reporter/skills/defects-analysis/scripts/check_runtime_env.mjs',
  );

  await mkdir(binDir, { recursive: true });
  await writeFile(envFile, 'JIRA_API_TOKEN=test-token\nJIRA_BASE_URL=https://jira.real.example\n');
  await writeFile(
    jiraStub,
    '#!/usr/bin/env bash\nset -euo pipefail\nprintf \'CMD=%s\\n\' \"$*\" >> "$JIRA_STUB_LOG"\necho "jira ok"\n',
  );
  await writeFile(logFile, '');
  spawnSync('chmod', ['+x', jiraStub], { encoding: 'utf8' });

  const result = spawnSync('node', [script, 'BCIN-5809', 'jira', outDir], {
    cwd: workDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${binDir}:${process.env.PATH}`,
      JIRA_ENV_FILE: envFile,
      JIRA_STUB_LOG: logFile,
    },
  });

  assert.equal(result.status, 0);
  const json = JSON.parse(await readFile(join(outDir, 'runtime_setup_BCIN-5809.json'), 'utf8'));
  const log = await readFile(logFile, 'utf8');
  assert.equal(json.setup_entries[0].status, 'ok');
  assert.match(log, /CMD=me/);

  await rm(workDir, { recursive: true, force: true });
});

test('marks setup as blocked when a required source fails', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'defects-analysis-runtime-'));
  const result = await buildRuntimeSetup('BCIN-5809', ['jira'], outDir, {
    env: { TEST_RUNTIME_ENV_OK: '0' },
  });

  assert.equal(result.blocked, true);
  assert.equal(result.setup_entries[0].status, 'blocked');

  await rm(outDir, { recursive: true, force: true });
});
