import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const SCRIPT_DIR = join(import.meta.dirname, '..');

test('archives final when present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-archive-'));
  await writeFile(join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md'), '# final');
  await mkdir(join(runDir, 'archive'), { recursive: true });
  execSync(`bash "${SCRIPT_DIR}/archive_run.sh" "${runDir}" BCIN-1`, { encoding: 'utf8' });
  const archiveFiles = await readdir(join(runDir, 'archive'));
  assert.ok(archiveFiles.some((f) => f.startsWith('BCIN-1_QA_SUMMARY_FINAL_')));
  try {
    await access(join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md'));
    assert.fail('final should have been moved');
  } catch {
    /* expected - file moved */
  }
});

test('archives draft when present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-archive-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'archive'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'), '# draft');
  execSync(`bash "${SCRIPT_DIR}/archive_run.sh" "${runDir}" BCIN-1`, { encoding: 'utf8' });
  const archiveFiles = await readdir(join(runDir, 'archive'));
  assert.ok(archiveFiles.some((f) => f.startsWith('BCIN-1_QA_SUMMARY_DRAFT_')));
});

test('no-op when no final or draft', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-archive-'));
  await mkdir(join(runDir, 'archive'), { recursive: true });
  execSync(`bash "${SCRIPT_DIR}/archive_run.sh" "${runDir}" BCIN-1`, { encoding: 'utf8' });
  const archiveFiles = await readdir(join(runDir, 'archive'));
  assert.equal(archiveFiles.length, 0);
});
