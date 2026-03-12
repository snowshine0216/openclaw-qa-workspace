import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('archives existing artifacts and keeps originals on smart_refresh', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sd-archive-'));
  const runDir = join(root, 'run');
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'BCIN-1_TESTING_PLAN.md'), '# Plan\n');
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/archive_run.sh');
  const r = spawnSync('bash', [script, runDir, 'smart_refresh'], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const plan = await readFile(join(runDir, 'BCIN-1_TESTING_PLAN.md'), 'utf8');
  assert.ok(plan.includes('Plan'));
  await rm(root, { recursive: true, force: true });
});

test('full_regenerate clears plan, drafts, and stale PR impact artifacts', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sd-archive-fr-'));
  const runDir = join(root, 'run');
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context', 'prs'), { recursive: true });
  await writeFile(join(runDir, 'BCIN-1_TESTING_PLAN.md'), '# Plan\n');
  await writeFile(join(runDir, 'context', 'prs', 'pr-1_impact.md'), '# PR impact\n');
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/archive_run.sh');
  const r = spawnSync('bash', [script, runDir, 'full_regenerate'], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.equal(existsSync(join(runDir, 'BCIN-1_TESTING_PLAN.md')), false);
  assert.equal(existsSync(join(runDir, 'context', 'prs', 'pr-1_impact.md')), false);
  await rm(root, { recursive: true, force: true });
});

