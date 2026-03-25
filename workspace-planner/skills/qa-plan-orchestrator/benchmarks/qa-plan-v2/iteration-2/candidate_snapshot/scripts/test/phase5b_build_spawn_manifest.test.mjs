import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase5b_build_spawn_manifest.mjs');

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
  const root = await mkdtemp(join(tmpdir(), 'phase5b-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-651');
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-651' }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: 'run-651' }, null, 2));
  await writeFile(join(runDir, 'drafts', 'qa_plan_phase5a_r1.md'), 'draft\n');
  await writeFile(join(runDir, 'context', 'review_notes_BCIN-651.md'), '# notes\n');
  await writeFile(join(runDir, 'context', 'review_delta_BCIN-651.md'), '# delta\n');
  await writeFile(join(runDir, 'context', 'artifact_lookup_BCIN-651.md'), '# lookup\n');
  return { root, runDir };
}

test('test_success_manifest', async () => {
  const { root, runDir } = await createProject();
  const outputPath = join(runDir, 'phase5b_spawn_manifest.json');
  const result = await runNode(['BCIN-651', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('review-rubric-phase5b'), 'task must reference review-rubric-phase5b');
  assert.ok(task.includes('Release Recommendation'), 'task must require a release recommendation');
  assert.ok(task.includes('bounded supplemental research pass'), 'task must describe bounded supplemental research');
  assert.ok(task.includes('return phase5a'), 'task must allow upstream return to phase5a');
  assert.ok(task.includes('return phase5b'), 'task must allow rerunning phase5b');
  assert.ok(task.includes('qa_plan_phase5b_r1.md'), 'task must target the phase-scoped draft path');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase5b-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-652');
  await mkdir(runDir, { recursive: true });
  const result = await runNode(['BCIN-652', runDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
