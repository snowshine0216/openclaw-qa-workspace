import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('fails when required render inputs are missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-render-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/lib/plan_render.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
  await rm(runDir, { recursive: true, force: true });
});

test('renders markdown when context inputs are present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-render-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'issue_summary.json'), JSON.stringify({ issue_key: 'BCIN-1', summary: 'Fix', status: 'Done', priority: 'High' }));
  await writeFile(join(runDir, 'context', 'fc_risk.json'), JSON.stringify({ risk_level: 'medium', fc_steps_count: 3 }));
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/lib/plan_render.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('Testing Plan'));
  assert.ok(r.stdout.includes('Exploratory Testing'), 'medium risk should include exploratory section');
  assert.ok(r.stdout.includes('Smoke test core flows'), 'medium risk should include smoke + targeted exploratory');
  await rm(runDir, { recursive: true, force: true });
});

