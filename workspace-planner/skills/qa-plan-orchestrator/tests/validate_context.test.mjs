import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT_DIR = join(__dirname, '..', 'scripts', 'lib');
const VALIDATE_CONTEXT_SRC = join(SCRIPT_DIR, 'validate_context.sh');
const VALIDATE_STRUCTURE_SRC = join(SCRIPT_DIR, 'validate_testcase_structure.sh');
<<<<<<< Updated upstream:workspace-planner/skills/qa-plan-orchestrator/tests/validate_context.test.mjs
const REPO_ROOT = join(__dirname, '..', '..', '..', '..');
=======
const VALIDATE_STRUCTURE_MJS_SRC = join(SCRIPT_DIR, 'validate_testcase_structure.mjs');
const TESTCASE_RULES_SRC = join(SCRIPT_DIR, 'testCaseRules.mjs');
const VALIDATE_EXEC_SRC = join(SCRIPT_DIR, 'validate_testcase_executability.sh');
>>>>>>> Stashed changes:workspace-planner/skills/feature-qa-planning-orchestrator/tests/validate_context.test.mjs

const VALID_XMINDMARK = `Feature QA Plan

- EndToEnd
    * Main flow
        - Open the report in pause mode and click Resume Data Retrieval
        - Verify the report stays in the same editing session
- Functional - Pause Mode
    * Pause retry
        - Click Resume Data Retrieval again after recovery
        - Verify the request is accepted instead of hanging
- Functional - Running Mode
    * Running-mode recovery
        - Lower Results Set Row Limit and dismiss the error
        - Verify Undo is disabled after recovery
`;

async function runScript(scriptPath, args, cwd, env = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [scriptPath, ...args], { cwd, env: { ...process.env, ...env }, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function setupScripts() {
  const tmp = await mkdtemp(join(tmpdir(), 'val_ctx_'));
  const scriptsDir = join(tmp, 'scripts');
  await mkdir(scriptsDir, { recursive: true });
  await cp(VALIDATE_CONTEXT_SRC, join(scriptsDir, 'validate_context.sh'));
  await cp(VALIDATE_STRUCTURE_SRC, join(scriptsDir, 'validate_testcase_structure.sh'));
<<<<<<< Updated upstream:workspace-planner/skills/qa-plan-orchestrator/tests/validate_context.test.mjs
=======
  await cp(VALIDATE_STRUCTURE_MJS_SRC, join(scriptsDir, 'validate_testcase_structure.mjs'));
  await cp(TESTCASE_RULES_SRC, join(scriptsDir, 'testCaseRules.mjs'));
  await cp(VALIDATE_EXEC_SRC, join(scriptsDir, 'validate_testcase_executability.sh'));
>>>>>>> Stashed changes:workspace-planner/skills/feature-qa-planning-orchestrator/tests/validate_context.test.mjs
  return { tmp, scriptsDir };
}

test('default mode reports CONTEXT_OK when all artifacts exist', async () => {
  const { tmp, scriptsDir } = await setupScripts();
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await writeFile(join(ctxDir, 'qa_plan_atlassian_BCIN-6709.md'), 'ok');

  const { code, stdout } = await runScript(join(scriptsDir, 'validate_context.sh'), ['BCIN-6709', 'qa_plan_atlassian_BCIN-6709'], join(scriptsDir, '..'));
  assert.equal(code, 0);
  assert.match(stdout, /CONTEXT_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('default mode reports missing artifacts clearly', async () => {
  const { tmp, scriptsDir } = await setupScripts();
  const { code, stdout } = await runScript(join(scriptsDir, 'validate_context.sh'), ['BCIN-6709', 'qa_plan_atlassian_BCIN-6709'], join(scriptsDir, '..'));
  assert.notEqual(code, 0);
  assert.match(stdout, /CONTEXT_MISSING/);
  assert.match(stdout, /qa_plan_atlassian_BCIN-6709/);
  await rm(tmp, { recursive: true, force: true });
});

test('resolve mode prefers v2 when present for legacy callers', async () => {
  const { tmp, scriptsDir } = await setupScripts();
  const ctxDir = join(tmp, 'BCIN-6709', 'context');
  await mkdir(ctxDir, { recursive: true });
  await writeFile(join(ctxDir, 'sub_test_cases_atlassian_BCIN-6709.md'), 'base');
  await writeFile(join(ctxDir, 'sub_test_cases_atlassian_BCIN-6709_v2.md'), 'v2');

  const { code, stdout } = await runScript(join(scriptsDir, 'validate_context.sh'), ['BCIN-6709', '--resolve-sub-testcases', 'atlassian'], join(scriptsDir, '..'));
  assert.equal(code, 0);
  assert.match(stdout, /_v2\.md/);
  assert.match(stdout, /RESOLVED_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate structure mode delegates to markxmind validator', async () => {
  const { tmp, scriptsDir } = await setupScripts();
  const artifact = join(tmp, 'draft.md');
  await writeFile(artifact, VALID_XMINDMARK);

  const { code, stdout } = await runScript(
    join(scriptsDir, 'validate_context.sh'),
    ['BCIN-6709', '--validate-testcase-structure', artifact],
    join(scriptsDir, '..'),
    { REPO_ROOT }
  );
  assert.equal(code, 0);
  assert.match(stdout, /STRUCTURE_OK/);
  assert.match(stdout, /CONTEXT_OK/);
  await rm(tmp, { recursive: true, force: true });
});
