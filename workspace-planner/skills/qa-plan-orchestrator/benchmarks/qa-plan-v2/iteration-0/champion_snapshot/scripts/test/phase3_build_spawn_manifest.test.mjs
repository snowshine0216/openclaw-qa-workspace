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
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-301');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-301' }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: 'run-301' }, null, 2));
  await writeFile(join(runDir, 'context', 'artifact_lookup_BCIN-301.md'), '# lookup\n');
  return { root, runDir };
}

test('test_success_manifest', async () => {
  const { root, runDir } = await createProject();
  const outputPath = join(runDir, 'phase3_spawn_manifest.json');
  const result = await runNode(['BCIN-301', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('context-coverage-contract'), 'task must reference context-coverage-contract');
  assert.ok(task.includes('context-index-schema'), 'task must reference context-index-schema');
  assert.ok(!task.includes('Tavily'), 'task must not force deep research when not requested');
  assert.equal(manifest.requests[0].source.phase, 'phase3');
  assert.deepEqual(manifest.requests[0].source.topic_requests, []);
  await rm(root, { recursive: true, force: true });
});

test('test_success_manifest_with_explicit_deep_research_topics', async () => {
  const { root, runDir } = await createProject();
  await writeFile(join(runDir, 'task.json'), JSON.stringify({
    feature_id: 'BCIN-301',
    deep_research_topics: [
      'report_editor_workstation_functionality',
      'report_editor_library_vs_workstation_gap',
    ],
  }, null, 2));
  const outputPath = join(runDir, 'phase3_spawn_manifest.json');
  const result = await runNode(['BCIN-301', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('Tavily'), 'task must enforce Tavily-first research');
  assert.ok(task.includes('Confluence fallback'), 'task must describe Confluence fallback');
  assert.equal(manifest.requests[0].source.topic_requests.length, 2);
  await rm(root, { recursive: true, force: true });
});

test('test_missing_context', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase3-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-302');
  await mkdir(runDir, { recursive: true });
  const result = await runNode(['BCIN-302', runDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});
