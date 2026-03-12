import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

test('returns valid score payload for valid inputs', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sd-risk-'));
  const issue = join(root, 'issue.json');
  const domains = join(root, 'domains.json');
  await writeFile(issue, JSON.stringify({ issue_key: 'BCIN-1', priority: 'high', description: 'x' }));
  await writeFile(domains, JSON.stringify({ domains: ['api', 'ui'] }));
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/lib/risk_score.sh');
  const r = spawnSync('bash', [script, issue, domains], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  const parsed = JSON.parse(r.stdout);
  assert.ok(typeof parsed.score === 'number');
  assert.ok(parsed.risk_level);
  await rm(root, { recursive: true, force: true });
});

