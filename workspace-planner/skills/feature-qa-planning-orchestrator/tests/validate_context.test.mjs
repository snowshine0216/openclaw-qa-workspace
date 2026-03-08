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
const VALIDATE_EXEC_SRC = join(SCRIPT_DIR, 'validate_testcase_executability.sh');

const VALID_MARKDOWN = `# Feature\n\n## EndToEnd\n\n### Main flow\n- In Library Web authoring, open the editor\n  - Verify the editor loads\n\n## Functional\n\n### Edit flow\n- In Library Web authoring, add one metric\n  - Verify the metric appears in the grid\n\n## xFunction\n\n### Cross-surface parity\n- In Workstation, repeat the edit flow\n  - Verify the template updates\n\n## Error handling / Special cases\n\n### Resume failure\n- In Library Web authoring, click Resume Data Retrieval after opening the report in pause mode\n  - Verify the report returns to Data Pause Mode\n\n## Accessibility\n\n### Keyboard\n- N/A — no new accessibility impact introduced\n\n## i18n\n\n### Locale\n- N/A — no locale-sensitive change is in scope\n\n## performance\n\n### Coverage\n- N/A — no explicit performance-sensitive change in scope\n\n## upgrade / compatability\n\n### Coverage\n- N/A — no upgrade-specific impact in scope\n\n## Embedding\n\n### Coverage\n- N/A — not an embedding feature\n\n## AUTO: Automation-Only Tests\n\n### Automation-only\n- Verify internal-only retry handling\n\n## 📎 Artifacts Used\n\n- context/jira_issue_BCIN-6709.md\n`;

async function runScript(scriptPath, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [scriptPath, ...args], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
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
  await cp(VALIDATE_EXEC_SRC, join(scriptsDir, 'validate_testcase_executability.sh'));
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

test('resolve mode prefers v2 when present', async () => {
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

test('validate structure mode delegates to structure validator', async () => {
  const { tmp, scriptsDir } = await setupScripts();
  const artifact = join(tmp, 'draft.md');
  await writeFile(artifact, VALID_MARKDOWN);

  const { code, stdout } = await runScript(join(scriptsDir, 'validate_context.sh'), ['BCIN-6709', '--validate-testcase-structure', artifact], join(scriptsDir, '..'));
  assert.equal(code, 0);
  assert.match(stdout, /STRUCTURE_OK/);
  assert.match(stdout, /CONTEXT_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('validate executability mode delegates to executability validator', async () => {
  const { tmp, scriptsDir } = await setupScripts();
  const artifact = join(tmp, 'draft.md');
  await writeFile(artifact, VALID_MARKDOWN);

  const { code, stdout } = await runScript(join(scriptsDir, 'validate_context.sh'), ['BCIN-6709', '--validate-testcase-executability', artifact], join(scriptsDir, '..'));
  assert.equal(code, 0);
  assert.match(stdout, /EXECUTABILITY_OK/);
  assert.match(stdout, /CONTEXT_OK/);
  await rm(tmp, { recursive: true, force: true });
});
