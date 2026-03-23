import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase5a_build_spawn_manifest.mjs');

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
  const root = await mkdtemp(join(tmpdir(), 'phase5a-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-601');
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-601' }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: 'run-601' }, null, 2));
  await writeFile(join(runDir, 'drafts', 'qa_plan_phase4b_r1.md'), 'draft\n');
  await writeFile(join(runDir, 'context', 'artifact_lookup_BCIN-601.md'), '# lookup\n');
  return { root, runDir };
}

test('test_success_manifest', async () => {
  const { root, runDir } = await createProject();
  const outputPath = join(runDir, 'phase5a_spawn_manifest.json');
  const result = await runNode(['BCIN-601', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.equal(manifest.requests[0].source.output_draft_path, join(runDir, 'drafts', 'qa_plan_phase5a_r1.md'));
  assert.ok(task.includes('review-rubric-phase5a'), 'task must reference review-rubric-phase5a');
  assert.ok(task.includes('section-by-section review'), 'task must require section-by-section review');
  assert.ok(task.includes('bounded supplemental research pass'), 'task must describe bounded supplemental research');
  assert.ok(task.includes('return phase5a'), 'task must describe the rerun disposition');
  assert.ok(task.includes('qa_plan_phase5a_r1.md'), 'task must target the phase-scoped draft path');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase5a-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-602');
  await mkdir(runDir, { recursive: true });
  const result = await runNode(['BCIN-602', runDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});

test('test_rerun_advances_to_next_real_round', async () => {
  const { root, runDir } = await createProject();
  await writeFile(join(runDir, 'drafts', 'qa_plan_phase5a_r2.md'), 'existing phase5a rerun draft\n');
  await writeFile(join(runDir, 'drafts', 'qa_plan_phase5b_r1.md'), 'later checkpoint draft\n');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      feature_id: 'BCIN-601',
      current_phase: 'phase_5b_checkpoint_refactor',
      return_to_phase: 'phase5a',
      latest_draft_phase: 'phase5b',
      latest_draft_path: 'drafts/qa_plan_phase5b_r1.md',
    }, null, 2)
  );

  const outputPath = join(runDir, 'phase5a_spawn_manifest.json');
  const result = await runNode(['BCIN-601', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('qa_plan_phase5a_r3.md'), 'rerun must target the next phase5a round');
  await rm(root, { recursive: true, force: true });
});
