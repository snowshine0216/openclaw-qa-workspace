import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase4a_build_spawn_manifest.mjs');

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
  const root = await mkdtemp(join(tmpdir(), 'phase4a-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-401');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-401' }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: 'run-401' }, null, 2));
  await writeFile(join(runDir, 'context', 'artifact_lookup_BCIN-401.md'), '# lookup\n');
  return { root, runDir };
}

test('test_success_manifest', async () => {
  const { root, runDir } = await createProject();
  const outputPath = join(runDir, 'phase4a_spawn_manifest.json');
  const result = await runNode(['BCIN-401', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('phase4a-contract'), 'task must reference phase4a-contract');
  assert.ok(task.includes('bounded supplemental research'), 'task must mention bounded supplemental research');
  assert.ok(task.includes('qa_plan_phase4a_r1.md'), 'task must target the phase-scoped draft path');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase4a-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-402');
  await mkdir(runDir, { recursive: true });
  const result = await runNode(['BCIN-402', runDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
