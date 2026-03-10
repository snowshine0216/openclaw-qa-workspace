import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase6_build_spawn_manifest.mjs');

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
  const root = await mkdtemp(join(tmpdir(), 'phase6-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-701');
  await mkdir(join(projectDir, 'drafts'), { recursive: true });
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-701' }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({ run_key: 'run-701' }, null, 2));
  await writeFile(join(projectDir, 'drafts', 'qa_plan_phase5b_r1.md'), 'draft\n');
  await writeFile(join(projectDir, 'context', 'artifact_lookup_BCIN-701.md'), '# lookup\n');
  await writeFile(join(projectDir, 'context', 'review_notes_BCIN-701.md'), '# notes\n');
  await writeFile(join(projectDir, 'context', 'review_delta_BCIN-701.md'), '# delta\n');
  await writeFile(join(projectDir, 'context', 'checkpoint_audit_BCIN-701.md'), '# checkpoint audit\n');
  await writeFile(join(projectDir, 'context', 'checkpoint_delta_BCIN-701.md'), '# checkpoint delta\n');
  return { root, projectDir };
}

test('test_success_manifest', async () => {
  const { root, projectDir } = await createProject();
  const outputPath = join(projectDir, 'phase6_spawn_manifest.json');
  const result = await runNode(['BCIN-701', projectDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('review-rubric-phase6'), 'task must reference review-rubric-phase6');
  assert.ok(task.includes('checkpoint_audit_BCIN-701.md'), 'task must require checkpoint audit input');
  assert.ok(task.includes('qa_plan_phase6_r1.md'), 'task must target the phase-scoped draft path');
  assert.ok(task.includes('e2e-coverage-rules'), 'task must reference e2e-coverage-rules');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase6-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-702');
  await mkdir(projectDir, { recursive: true });
  const result = await runNode(['BCIN-702', projectDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
