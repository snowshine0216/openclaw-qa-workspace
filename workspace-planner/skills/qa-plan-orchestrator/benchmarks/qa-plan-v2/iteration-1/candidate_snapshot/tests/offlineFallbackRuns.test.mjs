import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  OFFLINE_FALLBACK_MARKER,
  collectOfflineFallbackRunDirs,
} from '../benchmarks/qa-plan-v2/scripts/lib/offlineFallbackRuns.mjs';

test('collectOfflineFallbackRunDirs finds runs with offline marker in execution_notes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'offline-fb-'));
  try {
    const runDir = join(root, 'eval-1', 'with_skill', 'run-1');
    await mkdir(join(runDir, 'outputs'), { recursive: true });
    await writeFile(
      join(runDir, 'outputs', 'execution_notes.md'),
      `${OFFLINE_FALLBACK_MARKER}\n`,
      'utf8',
    );
    const set = await collectOfflineFallbackRunDirs(root);
    assert.equal(set.size, 1);
    assert.ok([...set][0].includes('eval-1'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('collectOfflineFallbackRunDirs ignores runs without marker', async () => {
  const root = await mkdtemp(join(tmpdir(), 'offline-fb-'));
  try {
    const runDir = join(root, 'eval-2', 'without_skill', 'run-2');
    await mkdir(join(runDir, 'outputs'), { recursive: true });
    await writeFile(join(runDir, 'outputs', 'execution_notes.md'), 'real notes\n', 'utf8');
    const set = await collectOfflineFallbackRunDirs(root);
    assert.equal(set.size, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
