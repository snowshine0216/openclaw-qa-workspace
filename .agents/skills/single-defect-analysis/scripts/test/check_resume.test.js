import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/check_resume.sh');

function run(issueKey, runDir) {
  const r = spawnSync('bash', [SCRIPT, issueKey, runDir], { encoding: 'utf8' });
  const line = r.stdout.split('\n').find((v) => v.startsWith('REPORT_STATE='));
  return line ? line.split('=')[1] : null;
}

test('returns FINAL_EXISTS when final plan exists', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sd-check-resume-'));
  await writeFile(join(root, 'BCIN-1_TESTING_PLAN.md'), '# Plan\n');
  assert.equal(run('BCIN-1', root), 'FINAL_EXISTS');
  await rm(root, { recursive: true, force: true });
});

test('returns FRESH when run dir missing', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sd-check-resume-'));
  await rm(root, { recursive: true, force: true });
  assert.equal(run('BCIN-1', root), 'FRESH');
});

test('returns CONTEXT_ONLY when context files exist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sd-check-resume-'));
  await mkdir(join(root, 'context'), { recursive: true });
  await writeFile(join(root, 'context', 'issue.json'), '{}');
  assert.equal(run('BCIN-1', root), 'CONTEXT_ONLY');
  await rm(root, { recursive: true, force: true });
});

