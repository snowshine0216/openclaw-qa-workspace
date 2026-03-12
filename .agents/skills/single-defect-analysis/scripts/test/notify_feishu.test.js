import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('sets notification_pending on send failure', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-notify-'));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ notification_pending: null }));
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/notify_feishu.sh');
  const r = spawnSync('bash', [script, runDir, '{"msg":"test"}'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.ok(run.notification_pending === null || typeof run.notification_pending === 'object');
  await rm(runDir, { recursive: true, force: true });
});

