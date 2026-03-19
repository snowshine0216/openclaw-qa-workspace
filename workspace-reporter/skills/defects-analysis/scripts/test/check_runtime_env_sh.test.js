import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

test('fails fast when wrapper args are missing', () => {
  const script = join(process.cwd(), 'workspace-reporter/skills/defects-analysis/scripts/check_runtime_env.sh');
  const r = spawnSync('bash', [script], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
});
