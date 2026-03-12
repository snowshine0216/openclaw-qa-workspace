import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('generates fc_risk.json when required inputs are present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase3-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'issue_summary.json'), JSON.stringify({ issue_key: 'BCIN-1', priority: 'High', description: '' }));
  await writeFile(join(runDir, 'context', 'affected_domains.json'), JSON.stringify({ domains: ['api'] }));
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ run_key: 'BCIN-1' }));
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase3.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const risk = JSON.parse(await readFile(join(runDir, 'context', 'fc_risk.json'), 'utf8'));
  assert.ok(typeof risk.score === 'number');
  await rm(runDir, { recursive: true, force: true });
});

