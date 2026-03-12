import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('requires user choice for non-fresh state when SELECTED_MODE is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'issue.json'), '{}');
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase0.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  await rm(runDir, { recursive: true, force: true });
});

