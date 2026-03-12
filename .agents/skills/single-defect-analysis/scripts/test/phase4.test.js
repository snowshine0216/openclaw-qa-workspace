import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('renders testing plan and updates terminal state fields', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'sd-phase4-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'issue_summary.json'), JSON.stringify({ issue_key: 'BCIN-1', summary: 'Fix', status: 'Done', priority: 'High' }));
  await writeFile(join(runDir, 'context', 'fc_risk.json'), JSON.stringify({ risk_level: 'high', fc_steps_count: 3, rationale: [] }));
  await writeFile(join(runDir, 'context', 'affected_domains.json'), JSON.stringify({ domains: ['api', 'ui'] }));
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ run_key: 'BCIN-1', overall_status: 'in_progress' }));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ spawn_history: {}, notification_pending: null }));
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/phase4.sh');
  const r = spawnSync('bash', [script, 'BCIN-1', runDir], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const planPath = join(runDir, 'BCIN-1_TESTING_PLAN.md');
  await access(planPath, constants.F_OK);
  const plan = await readFile(planPath, 'utf8');
  assert.ok(plan.includes('Testing Plan'));
  const handoff = JSON.parse(await readFile(join(runDir, 'tester_handoff.json'), 'utf8'));
  assert.equal(handoff.issue_key, 'BCIN-1');
  assert.equal(handoff.risk_level, 'high');
  assert.deepEqual(handoff.affected_domains, ['api', 'ui']);
  await rm(runDir, { recursive: true, force: true });
});

