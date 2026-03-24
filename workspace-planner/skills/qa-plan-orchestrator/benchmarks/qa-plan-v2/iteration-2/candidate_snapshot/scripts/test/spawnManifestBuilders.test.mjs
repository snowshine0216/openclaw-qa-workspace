import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  buildSupportingIssueSpawnRequest,
  buildDeepResearchSpawnRequest,
} from '../lib/spawnManifestBuilders.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function runManifestScript(scriptName, args) {
  const script = join(__dirname, '..', scriptName);
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [script, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function createPhaseProject(featureId, extraDrafts = {}) {
  const root = await mkdtemp(join(tmpdir(), 'spawn-manifest-preflight-'));
  const runDir = join(root, 'workspace-planner', 'skills', 'qa-plan-orchestrator', 'runs', featureId);
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: featureId }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: `run-${featureId}` }, null, 2));
  await writeFile(join(runDir, 'context', `artifact_lookup_${featureId}.md`), '# Artifact Lookup\n');
  for (const [name, content] of Object.entries(extraDrafts)) {
    await writeFile(join(runDir, name), content);
  }
  return { root, runDir };
}

test('buildSupportingIssueSpawnRequest emits requirement trace ids and output artifacts', () => {
  const request = buildSupportingIssueSpawnRequest({
    featureId: 'BCIN-7289',
    supportingIssueKey: 'BCED-2416',
    runDir: '/tmp/fqpo/runs/BCIN-7289',
    requestRequirementIds: ['req-read-support', 'req-save-summary'],
  });

  assert.equal(request.source.kind, 'supporting-issue-context');
  assert.equal(request.source.supporting_issue_key, 'BCED-2416');
  assert.deepEqual(request.source.request_requirement_ids, ['req-read-support', 'req-save-summary']);
  assert.deepEqual(request.source.output_artifact_paths, [
    'context/supporting_issue_relation_map_BCIN-7289.md',
    'context/supporting_issue_summary_BCED-2416_BCIN-7289.md',
    'context/supporting_issue_summary_BCIN-7289.md',
  ]);
  assert.match(request.openclaw.args.task, /context_only_no_defect_analysis/);
  assert.match(request.openclaw.args.task, /never become defect-analysis triggers/i);
  assert.match(request.openclaw.args.task, /aggregate support summary/i);
});

test('buildDeepResearchSpawnRequest emits tavily-first ordering and output artifacts', () => {
  const request = buildDeepResearchSpawnRequest({
    featureId: 'BCIN-7289',
    topicSlug: 'report_editor_workstation_functionality',
    runDir: '/tmp/fqpo/runs/BCIN-7289',
    deepResearchPolicy: 'tavily_first_confluence_second',
    requestRequirementIds: ['req-research-workstation', 'req-tool-order'],
  });

  assert.equal(request.source.kind, 'deep-research');
  assert.equal(request.source.topic_slug, 'report_editor_workstation_functionality');
  assert.deepEqual(request.source.request_requirement_ids, ['req-research-workstation', 'req-tool-order']);
  assert.match(request.openclaw.args.task, /Tavily/i);
  assert.match(request.openclaw.args.task, /Confluence fallback/i);
  assert.deepEqual(request.source.output_artifact_paths, [
    'context/deep_research_tavily_report_editor_workstation_BCIN-7289.md',
    'context/deep_research_confluence_report_editor_workstation_BCIN-7289.md',
  ]);
  assert.match(request.openclaw.args.task, /explicitly record Tavily-first ordering/i);
  assert.match(request.openclaw.args.task, /fallback reason/i);
});

test('phase4b manifest task includes SUBAGENT_QUICK_CHECKLIST preflight block', async () => {
  const { root, runDir } = await createPhaseProject('BCIN-PF1', {
    'drafts/qa_plan_phase4a_r1.md': 'draft\n',
  });
  const outputPath = join(runDir, 'phase4b_spawn_manifest.json');
  const result = await runManifestScript('phase4b_build_spawn_manifest.mjs', ['BCIN-PF1', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('subagent-quick-checklist'), 'task must reference the checklist file');
  assert.ok(task.includes('Preflight before you write'), 'task must contain preflight instruction block');
  assert.ok(task.includes('Do not tag grouping/subcategory bullets'), 'task must include the grouping-tag rule');
  assert.ok(task.includes('Deduplicate only when trigger'), 'task must include the dedup rule');
  assert.ok(task.includes('user-observable wording'), 'task must include observable wording rule');
  await rm(root, { recursive: true, force: true });
});

test('phase5a manifest task includes SUBAGENT_QUICK_CHECKLIST preflight block', async () => {
  const { root, runDir } = await createPhaseProject('BCIN-PF2', {
    'drafts/qa_plan_phase4b_r1.md': 'grouped draft\n',
    'context/review_notes_BCIN-PF2.md': '# Review Notes\n',
    'context/review_delta_BCIN-PF2.md': '# Review Delta\n',
  });
  const outputPath = join(runDir, 'phase5a_spawn_manifest.json');
  const result = await runManifestScript('phase5a_build_spawn_manifest.mjs', ['BCIN-PF2', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('subagent-quick-checklist'), 'phase5a task must reference the checklist file');
  assert.ok(task.includes('Preflight before you write'), 'phase5a task must contain preflight instruction block');
  await rm(root, { recursive: true, force: true });
});

test('phase5b manifest task includes SUBAGENT_QUICK_CHECKLIST preflight block', async () => {
  const { root, runDir } = await createPhaseProject('BCIN-PF3', {
    'drafts/qa_plan_phase5a_r1.md': 'reviewed draft\n',
    'context/review_notes_BCIN-PF3.md': '# Review Notes\n',
    'context/review_delta_BCIN-PF3.md': '# Review Delta\n',
  });
  const outputPath = join(runDir, 'phase5b_spawn_manifest.json');
  const result = await runManifestScript('phase5b_build_spawn_manifest.mjs', ['BCIN-PF3', runDir, outputPath]);
  assert.equal(result.code, 0, result.stderr);
  const manifest = JSON.parse(await readFile(outputPath, 'utf8'));
  const task = manifest.requests[0].openclaw.args.task;
  assert.ok(task.includes('subagent-quick-checklist'), 'phase5b task must reference the checklist file');
  assert.ok(task.includes('Preflight before you write'), 'phase5b task must contain preflight instruction block');
  assert.ok(task.includes('Do not tag grouping/subcategory bullets'), 'phase5b task must include the grouping-tag rule');
  await rm(root, { recursive: true, force: true });
});

test('buildDeepResearchSpawnRequest rejects unsupported research ordering policy', () => {
  assert.throws(() => {
    buildDeepResearchSpawnRequest({
      featureId: 'BCIN-7289',
      topicSlug: 'report_editor_workstation_functionality',
      runDir: '/tmp/fqpo/runs/BCIN-7289',
      deepResearchPolicy: 'confluence_first',
      requestRequirementIds: ['req-research-workstation'],
    });
  }, /tavily_first_confluence_second/);
});
