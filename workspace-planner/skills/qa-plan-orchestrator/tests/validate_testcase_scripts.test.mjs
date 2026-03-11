import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STRUCTURE_SCRIPT = join(__dirname, '..', 'scripts', 'lib', 'validate_testcase_structure.sh');
const REPO_ROOT = join(__dirname, '..', '..', '..', '..');

function runStructureScript(filePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', [STRUCTURE_SCRIPT, filePath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, REPO_ROOT },
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('structure script accepts valid XMindMark', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'structure_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, `Feature QA Plan

- EndToEnd
    * Main flow
        - Open the report in pause mode
        - Verify the report stays open
- Functional
    * Pause retry
        - Click Resume Data Retrieval
        - Verify the request is accepted
`);
  const result = await runStructureScript(file);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /STRUCTURE_OK/);
  await rm(tmp, { recursive: true, force: true });
});

test('structure script rejects invalid XMindMark (first line starts with -)', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'structure_'));
  const file = join(tmp, 'draft.md');
  await writeFile(file, `- Invalid first line

- Topic 1
    * Subtopic
`);
  const result = await runStructureScript(file);
  assert.notEqual(result.code, 0);
  const output = result.stdout + result.stderr;
  assert.match(output, /central topic|First non-empty/);
  await rm(tmp, { recursive: true, force: true });
});
