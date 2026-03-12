import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { buildRuntimeSetup } from '../check_runtime_env.mjs';

test('buildRuntimeSetup writes json and md artifacts', async () => {
  const out = await mkdtemp(join(tmpdir(), 'sd-runtime-'));
  const result = await buildRuntimeSetup('BCIN-1', [], out);
  assert.equal(result.ok, true);
  const json = JSON.parse(await readFile(join(out, 'runtime_setup_BCIN-1.json'), 'utf8'));
  const md = await readFile(join(out, 'runtime_setup_BCIN-1.md'), 'utf8');
  assert.equal(json.feature_id, 'BCIN-1');
  assert.ok(md.includes('Runtime Setup'));
  await rm(out, { recursive: true, force: true });
});

test('cli exits non-zero when run key missing', () => {
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/check_runtime_env.mjs');
  const r = spawnSync('node', [script], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
});

