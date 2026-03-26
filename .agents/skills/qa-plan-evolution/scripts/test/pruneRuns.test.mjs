import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, utimes, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pruneRunDirs } from '../lib/pruneRuns.mjs';

async function makeRunDir(runsRoot, runKey, mtimeMs) {
  const runPath = join(runsRoot, runKey);
  await mkdir(runPath, { recursive: true });
  const seconds = mtimeMs / 1000;
  await utimes(runPath, seconds, seconds);
}

async function touchRunFile(runsRoot, runKey, relativePath, mtimeMs) {
  const filePath = join(runsRoot, runKey, relativePath);
  await mkdir(join(filePath, '..'), { recursive: true });
  await writeFile(filePath, `${runKey}:${relativePath}\n`, 'utf8');
  const seconds = mtimeMs / 1000;
  await utimes(filePath, seconds, seconds);
}

test('pruneRunDirs keeps newest runs by mtime', async () => {
  const skillRoot = await mkdtemp(join(tmpdir(), 'seo-prune-runs-'));
  const runsRoot = join(skillRoot, 'runs');
  const now = Date.now();

  try {
    await makeRunDir(runsRoot, 'run-old', now - 3000);
    await makeRunDir(runsRoot, 'run-mid', now - 2000);
    await makeRunDir(runsRoot, 'run-new', now - 1000);

    const result = pruneRunDirs({ runsRoot, keepCount: 2, minAgeMs: 0 });

    assert.deepEqual(result.kept.sort(), ['run-mid', 'run-new']);
    assert.deepEqual(result.removed, ['run-old']);
  } finally {
    await rm(skillRoot, { recursive: true, force: true });
  }
});

test('pruneRunDirs protects explicit run keys outside keep window', async () => {
  const skillRoot = await mkdtemp(join(tmpdir(), 'seo-prune-runs-protect-'));
  const runsRoot = join(skillRoot, 'runs');
  const now = Date.now();

  try {
    await makeRunDir(runsRoot, 'run-old', now - 3000);
    await makeRunDir(runsRoot, 'run-mid', now - 2000);
    await makeRunDir(runsRoot, 'run-new', now - 1000);

    const result = pruneRunDirs({
      runsRoot,
      keepCount: 1,
      minAgeMs: 0,
      protectRunKeys: ['run-old'],
    });

    assert.deepEqual(result.kept.sort(), ['run-new', 'run-old']);
    assert.deepEqual(result.removed, ['run-mid']);
    assert.equal(
      result.skipped.some((item) => item.run_key === 'run-old' && item.reason === 'protected'),
      true,
    );
  } finally {
    await rm(skillRoot, { recursive: true, force: true });
  }
});

test('pruneRunDirs dry-run reports removals without deleting directories', async () => {
  const skillRoot = await mkdtemp(join(tmpdir(), 'seo-prune-runs-dry-'));
  const runsRoot = join(skillRoot, 'runs');
  const now = Date.now();

  try {
    await makeRunDir(runsRoot, 'run-old', now - 3000);
    await makeRunDir(runsRoot, 'run-mid', now - 2000);
    await makeRunDir(runsRoot, 'run-new', now - 1000);

    const result = pruneRunDirs({ runsRoot, keepCount: 1, minAgeMs: 0, dryRun: true });

    assert.deepEqual(result.removed.sort(), ['run-mid', 'run-old']);
    const verify = pruneRunDirs({ runsRoot, keepCount: 3, dryRun: true });
    assert.equal(verify.total_runs, 3);
  } finally {
    await rm(skillRoot, { recursive: true, force: true });
  }
});

test('pruneRunDirs keeps runs with newer nested artifacts even when the run directory mtime is stale', async () => {
  const skillRoot = await mkdtemp(join(tmpdir(), 'seo-prune-runs-nested-'));
  const runsRoot = join(skillRoot, 'runs');
  const now = Date.now();

  try {
    await makeRunDir(runsRoot, 'run-stale-parent', now - 5_000);
    await makeRunDir(runsRoot, 'run-other', now - 3_000);
    await makeRunDir(runsRoot, 'run-old', now - 7_000);
    await touchRunFile(runsRoot, 'run-stale-parent', 'context/task.json', now - 500);
    await makeRunDir(runsRoot, 'run-stale-parent', now - 5_000);

    const result = pruneRunDirs({ runsRoot, keepCount: 1, minAgeMs: 0 });

    assert.deepEqual(result.kept, ['run-stale-parent']);
    assert.deepEqual(result.removed.sort(), ['run-old', 'run-other']);
  } finally {
    await rm(skillRoot, { recursive: true, force: true });
  }
});
