import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase3_build_spawn_manifest.mjs');

function runNode(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [SCRIPT, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stderr }));
  });
}

async function createProject() {
  const root = await mkdtemp(join(tmpdir(), 'phase3-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-301');
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-301' }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({ run_key: 'run-301' }, null, 2));
  await writeFile(join(projectDir, 'context', 'artifact_lookup_BCIN-301.md'), '# lookup\n');
  return { root, projectDir };
}

test('test_success_manifest', async () => {
  const { root, projectDir } = await createProject();
  const outputPath = join(projectDir, 'phase3_spawn_manifest.json');
  const result = await runNode(['BCIN-301', projectDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('context-coverage-contract'), 'task must reference context-coverage-contract');
  assert.ok(task.includes('context-index-schema'), 'task must reference context-index-schema');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase3-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-302');
  await mkdir(projectDir, { recursive: true });
  const result = await runNode(['BCIN-302', projectDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
