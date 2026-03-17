import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import assert from 'node:assert';
import { findRepoRoot, findRepoRootSync } from '../../lib/findRepoRoot.mjs';

test('findRepoRoot finds repo when .agents exists', async () => {
  const tmp = resolve(mkdtempSync(join(tmpdir(), 'findRepoRoot-')));
  try {
    mkdirSync(join(tmp, 'sub', 'deep'), { recursive: true });
    mkdirSync(join(tmp, '.agents'));
    const result = await findRepoRoot(resolve(tmp, 'sub', 'deep'));
    assert.strictEqual(result, tmp);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('findRepoRoot finds repo when AGENTS.md exists', async () => {
  const tmp = resolve(mkdtempSync(join(tmpdir(), 'findRepoRoot-')));
  try {
    mkdirSync(join(tmp, 'sub'), { recursive: true });
    writeFileSync(join(tmp, 'AGENTS.md'), '');
    const result = await findRepoRoot(resolve(tmp, 'sub'));
    assert.strictEqual(result, tmp);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('findRepoRoot returns null when neither marker exists', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'findRepoRoot-'));
  try {
    mkdirSync(join(tmp, 'sub', 'deep'), { recursive: true });
    const result = await findRepoRoot(join(tmp, 'sub', 'deep'));
    assert.strictEqual(result, null);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('findRepoRoot finds repo from skill subdir', async () => {
  const startDir = join(process.cwd(), '.agents', 'skills', 'skill-path-registrar', 'scripts');
  const result = await findRepoRoot(startDir);
  assert.ok(result !== null, 'expected to find repo root from skill subdir');
  assert.strictEqual(result, process.cwd());
});

test('findRepoRootSync finds repo when .agents exists', () => {
  const tmp = resolve(mkdtempSync(join(tmpdir(), 'findRepoRootSync-')));
  try {
    mkdirSync(join(tmp, 'sub', 'deep'), { recursive: true });
    mkdirSync(join(tmp, '.agents'));
    const result = findRepoRootSync(resolve(tmp, 'sub', 'deep'));
    assert.strictEqual(result, tmp);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
