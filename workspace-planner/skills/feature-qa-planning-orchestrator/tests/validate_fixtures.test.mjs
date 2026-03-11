import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'scripts', 'validate-fixtures.mjs');
const BCIN_6709_FIXTURE = join(__dirname, '..', '..', '..', 'projects', 'feature-plan', 'BCIN-6709', 'qa_plan_final.md');

function runValidateFixtures(args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [SCRIPT, ...args], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('validate-fixtures defaults to the active QA plan template', async () => {
  const result = await runValidateFixtures();
  assert.equal(result.code, 0);
  assert.match(result.stdout, /"ok": true/);
});

test('BCIN-6709 fixture passes structure and executability validation (regression)', { skip: !existsSync(BCIN_6709_FIXTURE) }, async () => {
  const result = await runValidateFixtures([BCIN_6709_FIXTURE]);
  assert.equal(result.code, 0, `BCIN-6709 fixture should pass: ${result.stderr || result.stdout}`);
  assert.match(result.stdout, /"ok": true/);
});
