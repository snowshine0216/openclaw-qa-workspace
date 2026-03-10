import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase4b_build_spawn_manifest.mjs');

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
  const root = await mkdtemp(join(tmpdir(), 'phase4b-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-501');
  await mkdir(join(projectDir, 'drafts'), { recursive: true });
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-501' }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({ run_key: 'run-501' }, null, 2));
  await writeFile(join(projectDir, 'drafts', 'qa_plan_subcategory_BCIN-501.md'), 'draft\n');
  return { root, projectDir };
}

test('test_success_manifest', async () => {
  const { root, projectDir } = await createProject();
  const outputPath = join(projectDir, 'phase4b_spawn_manifest.json');
  const result = await runNode(['BCIN-501', projectDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('qa-plan-contract'), 'task must reference qa-plan-contract');
  assert.ok(task.includes('executable-step-rubric'), 'task must reference executable-step-rubric');
  assert.ok(task.includes('qa-plan-template'), 'task must reference qa-plan-template');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase4b-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-502');
  await mkdir(projectDir, { recursive: true });
  const result = await runNode(['BCIN-502', projectDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
