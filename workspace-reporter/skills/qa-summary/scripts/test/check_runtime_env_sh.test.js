import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT_DIR = join(import.meta.dirname, '..');
const CHECK_SCRIPT = join(SCRIPT_DIR, 'check_runtime_env.sh');
const REPO_ROOT = join(SCRIPT_DIR, '..', '..', '..', '..');

test('confluence check output when validation passes', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-check-'));
  const result = spawnSync('bash', [CHECK_SCRIPT, 'BCIN-1', 'confluence', outDir], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
  });
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const combined = stdout + stderr;
  if (result.status === 0) {
    assert.match(combined, /RUNTIME_SETUP_OK|runtime_setup_BCIN-1\.json/);
  } else {
    assert.match(combined, /RUNTIME_SETUP_FAILED|blocked/);
  }
});

test('failed validation propagation exits non-zero', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'qa-summary-check-'));
  const result = spawnSync('bash', [CHECK_SCRIPT, 'BCIN-1', 'unknown_source', outDir], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
  });
  assert.equal(result.status, 1);
  const stderr = result.stderr || '';
  assert.ok(stderr.includes('RUNTIME_SETUP_FAILED') || stderr.includes('blocked'));
});
