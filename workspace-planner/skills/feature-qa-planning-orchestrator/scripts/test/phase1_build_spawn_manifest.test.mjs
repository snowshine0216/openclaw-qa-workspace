import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '..', 'phase1_build_spawn_manifest.mjs');

function runNode(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [SCRIPT, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function createProject(featureId, requestedSources) {
  const root = await mkdtemp(join(tmpdir(), 'phase1-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', featureId);
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({
    feature_id: featureId,
    requested_source_families: requestedSources,
  }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({
    run_key: `run-${featureId}`,
    has_supporting_artifacts: false,
  }, null, 2));
  return { root, projectDir };
}

test('test_success_single_source', async () => {
  const { root, projectDir } = await createProject('BCIN-201', ['jira']);
  const outputPath = join(projectDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-201', projectDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  assert.equal(manifest.requests[0].source.source_family, 'jira');
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('context-coverage-contract'), 'task must reference context-coverage-contract');
  assert.ok(task.includes('reference.md'), 'task must reference reference.md');
  await rm(root, { recursive: true, force: true });
});

test('test_success_multi_source', async () => {
  const { root, projectDir } = await createProject('BCIN-202', ['jira', 'confluence']);
  const outputPath = join(projectDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-202', projectDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 2);
  assert.deepEqual(manifest.requests.map((item) => item.source.source_family), ['jira', 'confluence']);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('context-coverage-contract'), 'task must reference context-coverage-contract');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_task_json', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase1-manifest-'));
  const projectDir = join(root, 'projects', 'feature-plan', 'BCIN-203');
  await mkdir(projectDir, { recursive: true });
  const result = await runNode(['BCIN-203', projectDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});

test('test_empty_requested_sources', async () => {
  const { root, projectDir } = await createProject('BCIN-204', []);
  const result = await runNode(['BCIN-204', projectDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
