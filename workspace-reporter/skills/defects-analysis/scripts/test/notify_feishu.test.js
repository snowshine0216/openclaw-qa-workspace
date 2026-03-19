import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/notify_feishu.sh');

test('stores notification_pending on failure', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'defects-analysis-notify-'));
  const runDir = join(parent, 'BCIN-5809');
  await mkdir(runDir, { recursive: true });
  await writeFile(join(runDir, 'run.json'), '{"notification_pending":null}\n');
  const finalPath = join(runDir, 'BCIN-5809_REPORT_FINAL.md');
  await writeFile(finalPath, '# Final Report\n');

  const result = spawnSync('bash', [SCRIPT, runDir, finalPath], {
    encoding: 'utf8',
    env: { ...process.env, FEISHU_NOTIFY_SHOULD_FAIL: '1' },
  });

  assert.notEqual(result.status, 0);
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.ok(run.notification_pending?.payload);
  assert.equal(run.notification_pending.payload.run_key, 'BCIN-5809');
  assert.equal(run.notification_pending.payload.final, finalPath);

  await rm(parent, { recursive: true, force: true });
});

test('clears notification_pending on success', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'defects-analysis-notify-'));
  const runDir = join(parent, 'BCIN-5809');
  await mkdir(runDir, { recursive: true });
  await writeFile(
    join(runDir, 'run.json'),
    '{"notification_pending":{"payload":{"run_key":"BCIN-5809","final":"/tmp/x"}}}\n',
  );
  const finalPath = join(runDir, 'BCIN-5809_REPORT_FINAL.md');
  await writeFile(finalPath, '# Final Report\n');

  const result = spawnSync('bash', [SCRIPT, runDir, finalPath], {
    encoding: 'utf8',
    env: { ...process.env, FEISHU_NOTIFY_SHOULD_FAIL: '0' },
  });

  assert.equal(result.status, 0);
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(run.notification_pending, null);

  await rm(parent, { recursive: true, force: true });
});
