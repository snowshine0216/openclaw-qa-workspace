import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, chmod, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('stops successfully when phase0 returns a delegated run marker', async () => {
  const root = await mkdtemp(join(tmpdir(), 'reporter-orchestrate-'));
  const scriptsDir = join(root, 'scripts');
  await mkdir(scriptsDir, { recursive: true });
  await writeFile(
    join(scriptsDir, 'phase0.sh'),
    '#!/usr/bin/env bash\necho "DELEGATED_RUN: delegated.json"\nexit 0\n'
  );
  await chmod(join(scriptsDir, 'phase0.sh'), 0o755);
  await writeFile(
    join(scriptsDir, 'orchestrate.sh'),
    '#!/usr/bin/env bash\nbash "$(dirname "$0")/phase0.sh" "$@"\n'
  );
  await chmod(join(scriptsDir, 'orchestrate.sh'), 0o755);
  const r = spawnSync('bash', [join(scriptsDir, 'orchestrate.sh'), 'BCIN-9000'], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('DELEGATED_RUN:'));
  await rm(root, { recursive: true, force: true });
});
