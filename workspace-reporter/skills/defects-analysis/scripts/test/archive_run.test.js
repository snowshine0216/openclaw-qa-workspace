import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const SCRIPT = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/archive_run.sh');

test('moves prior draft and final into archive during smart refresh', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'reporter-archive-'));
  await mkdir(join(runDir, 'archive'), { recursive: true });
  await writeFile(join(runDir, 'BCIN-5809_REPORT_DRAFT.md'), 'draft');
  await writeFile(join(runDir, 'BCIN-5809_REPORT_FINAL.md'), 'final');
  const r = spawnSync('bash', [SCRIPT, runDir, 'smart_refresh'], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const archived = await readdir(join(runDir, 'archive'));
  assert.ok(archived.length >= 2);
  await rm(runDir, { recursive: true, force: true });
});
