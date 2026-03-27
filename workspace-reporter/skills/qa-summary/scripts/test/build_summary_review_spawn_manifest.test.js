import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import {
  buildSubagentPrompt,
  buildManifest,
} from '../lib/build_summary_review_spawn_manifest.mjs';

const SCRIPT = new URL('../lib/build_summary_review_spawn_manifest.mjs', import.meta.url).pathname;

const RUBRIC_PATHS = {
  formattingRef: '/refs/summary-formatting.md',
  reviewRubric: '/refs/summary-review-rubric.md',
};

// --- buildSubagentPrompt ---

test('round 1 prompt contains draft path and rubric paths', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    approvalFeedbackPath: null,
    round: 1,
  });
  assert.match(prompt, /BCIN-7289_QA_SUMMARY_DRAFT\.md/);
  assert.match(prompt, /summary-review-rubric\.md/);
  assert.match(prompt, /summary-formatting\.md/);
});

test('round 1 prompt instructs writing review, notes, delta, and result files', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    approvalFeedbackPath: null,
    round: 1,
  });
  assert.match(prompt, /BCIN-7289_QA_SUMMARY_REVIEW\.md/);
  assert.match(prompt, /phase4_review_notes\.md/);
  assert.match(prompt, /phase4_review_delta\.md/);
  assert.match(prompt, /review_result\.json/);
});

test('round 2 prompt includes prior review notes block', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: '/tmp/runs/BCIN-7289/context/phase4_review_notes.md',
    approvalFeedbackPath: null,
    round: 2,
  });
  assert.match(prompt, /Prior Review Notes \(Round 1\)/);
  assert.match(prompt, /phase4_review_notes\.md/);
});

test('prompt with approval feedback includes feedback block', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    approvalFeedbackPath: 'context/approval_feedback.json',
    round: 1,
  });
  assert.match(prompt, /Approval Feedback/);
  assert.match(prompt, /approval_feedback\.json/);
});

test('prompt instructs "return phase4" as return verdict', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    approvalFeedbackPath: null,
    round: 1,
  });
  assert.match(prompt, /return phase4/);
});

// --- buildManifest ---

test('manifest has version 1 and correct source_kind', () => {
  const manifest = buildManifest('task');
  assert.equal(manifest.version, 1);
  assert.equal(manifest.source_kind, 'qa-summary-review');
  assert.equal(manifest.requests.length, 1);
});

// --- CLI ---

async function makeRunDir(extraTask = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-review-manifest-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'drafts', 'BCIN-7289_QA_SUMMARY_DRAFT.md'),
    '## 📊 QA Summary\n'
  );
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_key: 'BCIN-7289', ...extraTask }));
  return runDir;
}

test('CLI writes phase4_spawn_manifest.json and prints SPAWN_MANIFEST', async () => {
  const runDir = await makeRunDir();
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SPAWN_MANIFEST:/);
  assert.match(result.stdout, /phase4_spawn_manifest\.json/);

  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.equal(manifest.version, 1);
  assert.match(manifest.requests[0].openclaw.args.task, /BCIN-7289_QA_SUMMARY_DRAFT/);
  assert.match(manifest.requests[0].openclaw.args.task, /Round 1/);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI includes approval feedback path when approval_feedback.json exists', async () => {
  const runDir = await makeRunDir();
  await writeFile(
    join(runDir, 'context', 'approval_feedback.json'),
    JSON.stringify({ decision: 'REVISION_REQUESTED', feedback: 'Fix section 3' })
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);

  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Approval Feedback/);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI uses round 2 when phase4_round is 1', async () => {
  const runDir = await makeRunDir({ phase4_round: 1 });
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);

  const manifest = JSON.parse(await readFile(join(runDir, 'phase4_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Round 2/);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 when arguments are missing', () => {
  const result = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
});
