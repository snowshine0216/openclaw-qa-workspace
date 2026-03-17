import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT_DIR = join(import.meta.dirname, '..');

test('exits with error for invalid manifest path', async () => {
  const result = spawnSync(
    'node',
    [join(SCRIPT_DIR, 'spawn_from_manifest.mjs'), '/nonexistent/manifest.json', '--cwd', tmpdir()],
    { encoding: 'utf8' }
  );
  assert.ok(result.status !== 0);
});

test('exits with error for invalid manifest json', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qa-summary-spawn-'));
  const badManifest = join(dir, 'bad.json');
  await writeFile(badManifest, 'not json');
  const result = spawnSync(
    'node',
    [join(SCRIPT_DIR, 'spawn_from_manifest.mjs'), badManifest, '--cwd', dir],
    { encoding: 'utf8' }
  );
  assert.ok(result.status !== 0);
});

test('accepts valid manifest structure', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'qa-summary-spawn-'));
  const manifest = join(dir, 'manifest.json');
  await writeFile(
    manifest,
    JSON.stringify({
      version: 1,
      phase: 'phase2',
      requests: [],
    })
  );
  const result = spawnSync(
    'node',
    [join(SCRIPT_DIR, 'spawn_from_manifest.mjs'), manifest, '--cwd', dir],
    { encoding: 'utf8' }
  );
  assert.equal(result.status, 0);
});
