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
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-501');
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-501' }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: 'run-501' }, null, 2));
  await writeFile(join(runDir, 'drafts', 'qa_plan_phase4a_r1.md'), 'draft\n');
  return { root, runDir };
}

test('test_success_manifest', async () => {
  const { root, runDir } = await createProject();
  const outputPath = join(runDir, 'phase4b_spawn_manifest.json');
  const result = await runNode(['BCIN-501', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('phase4b-contract'), 'task must reference phase4b-contract');
  assert.ok(task.includes('canonical top-layer'), 'task must describe canonical top-layer grouping');
  assert.ok(task.includes('Few-shot cleanup belongs to Phase 6'), 'task must keep few-shot cleanup in Phase 6');
  assert.ok(task.includes('qa_plan_phase4b_r1.md'), 'task must target the phase-scoped draft path');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase4b-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-502');
  await mkdir(runDir, { recursive: true });
  const result = await runNode(['BCIN-502', runDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
