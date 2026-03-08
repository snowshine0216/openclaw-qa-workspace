import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STRUCTURE_SCRIPT = join(__dirname, '..', 'scripts', 'lib', 'validate_testcase_structure.sh');
const EXEC_SCRIPT = join(__dirname, '..', 'scripts', 'lib', 'validate_testcase_executability.sh');

function runScript(scriptPath, filePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [scriptPath, 'BCIN-6709', filePath], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('structure script rejects illegal fixed-heading rename', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'structure_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, '# T\n\n## EndToEnd\n\n### A\n- x\n\n## Functional\n\n### B\n- y\n\n## Platform\n\n- N/A — wrong heading\n');
  const result = await runScript(STRUCTURE_SCRIPT, file);
  assert.notEqual(result.code, 0);
  assert.match(result.stdout, /ILLEGAL_HEADING: Platform/);
  await rm(tmp, { recursive: true, force: true });
});

test('executability script rejects vague manual wording', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'exec_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, '# T\n\n## EndToEnd\n\n### A\n- Recover from a supported report execution or manipulation error\n  - Verify correct recovery\n\n## Functional\n\n### B\n- Add one metric\n  - Verify the metric appears\n\n## xFunction\n\n### C\n- N/A — no cross-surface behavior in scope\n\n## Error handling / Special cases\n\n### D\n- N/A — covered above\n\n## Accessibility\n\n### E\n- N/A — no accessibility change\n\n## i18n\n\n### F\n- N/A — no i18n change\n\n## performance\n\n### G\n- N/A — no performance change\n\n## upgrade / compatability\n\n### H\n- N/A — no compatibility change\n\n## Embedding\n\n### I\n- N/A — not an embedding feature\n\n## AUTO: Automation-Only Tests\n\n### J\n- cmdMgr.reset()\n\n## 📎 Artifacts Used\n\n- context/a.md\n');
  const result = await runScript(EXEC_SCRIPT, file);
  assert.notEqual(result.code, 0);
  assert.match(result.stdout, /EXEC_VAGUE_TRIGGER/);
  assert.match(result.stdout, /EXEC_VAGUE_EXPECTED_RESULT/);
  await rm(tmp, { recursive: true, force: true });
});
