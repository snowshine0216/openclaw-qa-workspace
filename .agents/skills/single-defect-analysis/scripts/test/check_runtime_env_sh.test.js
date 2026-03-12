import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

test('wrapper exits non-zero without run key', () => {
  const script = join(process.cwd(), '.agents/skills/single-defect-analysis/scripts/check_runtime_env.sh');
  const r = spawnSync('bash', [script], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
});

