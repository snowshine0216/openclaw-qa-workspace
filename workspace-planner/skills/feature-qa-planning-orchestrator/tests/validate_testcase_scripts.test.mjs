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

test('structure script rejects illegal plan heading replacement', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'structure_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, '# T\n\n## EndToEnd\n\n### A\n- x\n\n## Functional - Pause Mode\n\n### B\n- y\n\n## Functional - Running Mode\n\n### C\n- z\n\n## Functional - Modeling Service Non-Crash Path\n\n### D\n- z\n\n## Functional - MDX / Engine Errors\n\n### E\n- z\n\n## Functional - Prompt Flow\n\n### F\n- z\n\n## xFunctional\n\n### G\n- z\n\n## Analytics\n\n- N/A — wrong heading\n\n## Platform\n\n### H\n- N/A — test fixture\n');
  const result = await runScript(STRUCTURE_SCRIPT, file);
  assert.notEqual(result.code, 0);
  assert.match(result.stdout, /ILLEGAL_HEADING: Analytics/);
  await rm(tmp, { recursive: true, force: true });
});

test('executability script rejects vague manual wording', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'exec_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, '# T\n\n## EndToEnd\n\n### A\n- When an error occurs, click OK\n  - Verify correct recovery after recovery\n\n## Functional - Pause Mode\n\n### B\n- Add one metric\n  - Verify the metric appears\n\n## Functional - Running Mode\n\n### C\n- N/A — covered in another fixture\n\n## Functional - Modeling Service Non-Crash Path\n\n### D\n- N/A — covered in another fixture\n\n## Functional - MDX / Engine Errors\n\n### E\n- N/A — covered in another fixture\n\n## Functional - Prompt Flow\n\n### F\n- N/A — covered in another fixture\n\n## xFunctional\n\n### G\n- N/A — no cross-flow case in this fixture\n\n## UI - Messaging\n\n### H\n- N/A — no copy validation in this fixture\n\n## Platform\n\n### I\n- N/A — no browser sweep in this fixture\n');
  const result = await runScript(EXEC_SCRIPT, file);
  assert.notEqual(result.code, 0);
  assert.match(result.stdout, /EXEC_VAGUE_TRIGGER/);
  assert.match(result.stdout, /EXEC_VAGUE_EXPECTED_RESULT/);
  await rm(tmp, { recursive: true, force: true });
});

test('structure script accepts allowed aliases for required sections', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'structure_alias_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, '# T\n\n## E2E - P1\n\n### A\n- Open the report in pause mode\n  - Verify the report stays open\n\n## Pause Mode\n\n### B\n- N/A — no extra pause-mode coverage in this fixture\n\n## Running Mode\n\n### C\n- N/A — no running-mode coverage in this fixture\n\n## Modeling Service Non-Crash Path\n\n### D\n- N/A — no modeling-service non-crash coverage in this fixture\n\n## MDX / Engine Errors\n\n### E\n- N/A — no engine-error coverage in this fixture\n\n## Prompt Flow\n\n### F\n- N/A — no prompt coverage in this fixture\n\n## Cross-Functional\n\n### G\n- N/A — no cross-functional coverage in this fixture\n\n## Messaging\n\n### H\n- N/A — no messaging coverage in this fixture\n\n## Browser Coverage\n\n### I\n- N/A — no platform sweep in this fixture\n');
  const result = await runScript(STRUCTURE_SCRIPT, file);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /STRUCTURE_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('structure script rejects duplicated required sections', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'structure_dupe_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, '# T\n\n## EndToEnd\n\n### A\n- Open the report\n  - Verify it stays open\n\n## Functional - Pause Mode\n\n### B\n- N/A — fixture\n\n## Functional - Running Mode\n\n### C\n- N/A — fixture\n\n## Functional - Modeling Service Non-Crash Path\n\n### D\n- N/A — fixture\n\n## Functional - MDX / Engine Errors\n\n### E\n- N/A — fixture\n\n## Functional - Prompt Flow\n\n### F\n- N/A — fixture\n\n## xFunctional\n\n### G\n- N/A — fixture\n\n## UI - Messaging\n\n### H\n- N/A — fixture\n\n## Platform\n\n### I\n- N/A — fixture\n\n## Platform\n\n### J\n- N/A — duplicate\n');
  const result = await runScript(STRUCTURE_SCRIPT, file);
  assert.notEqual(result.code, 0);
  assert.match(result.stdout, /DUPLICATE_HEADING: Platform/);
  await rm(tmp, { recursive: true, force: true });
});
