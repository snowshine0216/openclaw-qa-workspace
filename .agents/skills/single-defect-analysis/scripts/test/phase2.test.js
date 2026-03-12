import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('writes no_pr_links marker when PR list is empty', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase2-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'pr_links.json'), '[]');
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase2.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const marker = await readFile(join(runDir, 'context', 'no_pr_links.md'), 'utf8');
  assert.ok(marker.includes('No PR links'));
  await rm(runDir, { recursive: true, force: true });
});

test('emits phase2_spawn_manifest when PR links exist (jq 1.7 compatible)', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase2-pr-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'pr_links.json'), '["https://github.com/org/repo/pull/12"]');
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase2.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase2_spawn_manifest.json'), 'utf8'));
  assert.ok(Array.isArray(manifest.requests));
  assert.equal(manifest.requests.length, 1);
  assert.ok(manifest.requests[0].openclaw.args.output_file.includes('pr-1_impact.md'));
  await rm(runDir, { recursive: true, force: true });
});

