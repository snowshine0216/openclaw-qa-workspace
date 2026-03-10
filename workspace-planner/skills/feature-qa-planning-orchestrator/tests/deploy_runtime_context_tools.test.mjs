import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT_SRC = join(__dirname, '..', 'scripts', 'lib', 'deploy_runtime_context_tools.sh');

function runDeploy(runtimeDir, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [SCRIPT_SRC, runtimeDir], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('deploy script copies helper tools into the runtime project directory', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'deploy_ctx_'));
  const runtimeDir = join(tmp, 'projects', 'feature-plan', 'scripts');

  const { code, stdout } = await runDeploy(runtimeDir, join(__dirname, '..'));
  assert.equal(code, 0);

  const files = (await readdir(runtimeDir)).sort();
  assert.deepEqual(files, [
    'contextRules.mjs',
    'qaPlanValidators.mjs',
    'save_context.sh',
    'validate_context.sh',
    'validate_plan_artifact.mjs',
    'validate_testcase_structure.sh',
  ]);

  for (const file of files) {
    await access(join(runtimeDir, file));
  }
  await access(join(runtimeDir, 'validate_plan_artifact.mjs'), constants.X_OK);
  const mode = (await stat(join(runtimeDir, 'validate_plan_artifact.mjs'))).mode;
  assert.notEqual(mode & 0o111, 0);

  assert.match(stdout, /DEPLOYED: save_context\.sh/);
  assert.match(stdout, /DEPLOYED: validate_context\.sh/);
  assert.match(stdout, /DEPLOYED: validate_testcase_structure\.sh/);
  assert.match(stdout, /DEPLOYED: qaPlanValidators\.mjs/);
  assert.match(stdout, /DEPLOYED: validate_plan_artifact\.mjs/);
  assert.match(stdout, /DEPLOYED: contextRules\.mjs/);
  await rm(tmp, { recursive: true, force: true });
});
