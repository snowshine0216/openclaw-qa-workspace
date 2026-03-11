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

async function createProject(featureId, requestedSources, hasSupportingArtifacts = false) {
  const root = await mkdtemp(join(tmpdir(), 'phase1-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', featureId);
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({
    feature_id: featureId,
    requested_source_families: requestedSources,
  }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({
    run_key: `run-${featureId}`,
    has_supporting_artifacts: hasSupportingArtifacts,
  }, null, 2));
  return { root, runDir };
}

async function createProjectWithSeedConfluence(featureId) {
  const root = await mkdtemp(join(tmpdir(), 'phase1-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', featureId);
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({
    feature_id: featureId,
    requested_source_families: ['jira'],
    seed_confluence_url: 'https://example.atlassian.net/wiki/spaces/BCIN/pages/123',
  }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({
    run_key: `run-${featureId}`,
    has_supporting_artifacts: false,
  }, null, 2));
  return { root, runDir };
}

test('test_success_single_source', async () => {
  const { root, runDir } = await createProject('BCIN-201', ['jira']);
  const outputPath = join(runDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-201', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 1);
  assert.equal(manifest.requests[0].source.source_family, 'jira');
  const args = manifest.requests[0].openclaw.args;
  assert.ok(args.task.includes('context-coverage-contract'), 'task must reference context-coverage-contract');
  assert.ok(args.task.includes('reference.md'), 'task must reference reference.md');
  assert.ok(args.task.includes('jira_issue_BCIN-201.md'), 'Jira task must require main issue artifact');
  assert.ok(args.task.includes('jira_related_issues_BCIN-201.md'), 'Jira task must require related issues artifact');
  assert.equal(args.runtime, 'subagent');
  assert.ok(!('streamTo' in args), 'openclaw.args must not contain streamTo when runtime is subagent');
  await rm(root, { recursive: true, force: true });
});

test('test_success_multi_source', async () => {
  const { root, runDir } = await createProject('BCIN-202', ['jira', 'confluence']);
  const outputPath = join(runDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-202', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.equal(manifest.count, 2);
  assert.deepEqual(manifest.requests.map((item) => item.source.source_family), ['jira', 'confluence']);
  const args = manifest.requests[0].openclaw.args;
  assert.ok(args.task.includes('context-coverage-contract'), 'task must reference context-coverage-contract');
  assert.equal(args.runtime, 'subagent');
  assert.ok(!('streamTo' in args), 'openclaw.args must not contain streamTo when runtime is subagent');
  await rm(root, { recursive: true, force: true });
});

test('test_missing_task_json', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase1-manifest-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', 'BCIN-203');
  await mkdir(runDir, { recursive: true });
  const result = await runNode(['BCIN-203', runDir]);
  assert.equal(result.code, 1);
  await rm(root, { recursive: true, force: true });
});

test('test_empty_requested_sources', async () => {
  const { root, runDir } = await createProject('BCIN-204', []);
  const outputPath = join(runDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-204', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.deepEqual(manifest.requests.map((item) => item.source.source_family), ['jira']);
  await rm(root, { recursive: true, force: true });
});

test('test_jira_with_supporting_artifacts_includes_supporting_summary', async () => {
  const { root, runDir } = await createProject('BCIN-205', ['jira'], true);
  const outputPath = join(runDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-205', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('supporting_issue_summary_BCIN-205.md'), 'Jira task with supporting artifacts must require supporting summary');
  assert.ok(task.includes('supporting_issue_relation_map_BCIN-205.md'), 'Jira task with supporting artifacts must require supporting relation map');
  await rm(root, { recursive: true, force: true });
});

test('test_seed_confluence_url_infers_confluence_source_family', async () => {
  const { root, runDir } = await createProjectWithSeedConfluence('BCIN-206');
  const outputPath = join(runDir, 'phase1_spawn_manifest.json');
  const result = await runNode(['BCIN-206', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  assert.deepEqual(
    manifest.requests.map((item) => item.source.source_family),
    ['jira', 'confluence'],
  );
  await rm(root, { recursive: true, force: true });
});
