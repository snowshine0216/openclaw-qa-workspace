import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/check_resume.sh');

function runCheckResume(runKey, runDir) {
  const result = spawnSync('bash', [SCRIPT, runKey, runDir], { encoding: 'utf8' });
  const line = result.stdout.split('\n').find((entry) => entry.startsWith('REPORT_STATE='));
  return line ? line.split('=')[1] : null;
}

test('returns FINAL_EXISTS when final report is present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-resume-'));
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), '# Final\n');
  assert.equal(runCheckResume('BCIN-5809', runDir), 'FINAL_EXISTS');
  await rm(runDir, { recursive: true, force: true });
});

test('returns DRAFT_EXISTS when draft exists without final', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-resume-'));
  await writeFile(join(runDir, 'BCIN-5809_REPORT_DRAFT.md'), '# Draft\n');
  assert.equal(runCheckResume('BCIN-5809', runDir), 'DRAFT_EXISTS');
  await rm(runDir, { recursive: true, force: true });
});

test('returns CONTEXT_ONLY when route metadata exists without reports', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-resume-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'route_decision.json'), '{}\n');
  assert.equal(runCheckResume('BCIN-5809', runDir), 'CONTEXT_ONLY');
  await rm(runDir, { recursive: true, force: true });
});

test('returns FRESH when no reporter artifacts exist', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-resume-'));
  assert.equal(runCheckResume('BCIN-5809', runDir), 'FRESH');
  await rm(runDir, { recursive: true, force: true });
});
