import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/orchestrate.sh');

test('rejects invalid issue key', () => {
  const r = spawnSync('bash', [SCRIPT, 'invalid-key'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
});

test('accepts Jira browse URL and normalizes to issue key', () => {
  const r = spawnSync('bash', [SCRIPT, 'https://jira.example.com/browse/ABC-123'], { encoding: 'utf8' });
  const err = (r.stderr || '') + (r.stdout || '');
  assert.ok(!err.includes('Invalid issue_key or URL'), 'URL should be normalized, not rejected');
});

