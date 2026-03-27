import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import {
  buildSubagentPrompt,
  buildManifest,
} from '../lib/build_summary_draft_spawn_manifest.mjs';

const SCRIPT = new URL('../lib/build_summary_draft_spawn_manifest.mjs', import.meta.url).pathname;

const RUBRIC_PATHS = {
  formattingRef: '/refs/summary-formatting.md',
  generationRubric: '/refs/summary-generation-rubric.md',
  reviewRubric: '/refs/summary-review-rubric.md',
};

// --- buildSubagentPrompt ---

test('round 1 prompt contains all rubric paths', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.match(prompt, /summary-formatting\.md/);
  assert.match(prompt, /summary-generation-rubric\.md/);
  assert.match(prompt, /summary-review-rubric\.md/);
});

test('round 1 prompt instructs writing draft, review notes, and delta', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.match(prompt, /BCIN-7289_QA_SUMMARY_DRAFT\.md/);
  assert.match(prompt, /phase3_review_notes\.md/);
  assert.match(prompt, /phase3_review_delta\.md/);
});

test('round 2 prompt includes prior review notes path', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: '/tmp/runs/BCIN-7289/context/phase3_review_notes.md',
    round: 2,
  });
  assert.match(prompt, /Prior Review Notes \(Round 1\)/);
  assert.match(prompt, /phase3_review_notes\.md/);
});

test('round 1 prompt does not include prior review block', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.doesNotMatch(prompt, /Prior Review Notes/);
});

test('prompt instructs "return phase3" as return verdict', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.match(prompt, /return phase3/);
});

// --- buildManifest ---

test('manifest has version 1 and correct source_kind', () => {
  const manifest = buildManifest('task');
  assert.equal(manifest.version, 1);
  assert.equal(manifest.source_kind, 'qa-summary-draft');
  assert.equal(manifest.requests.length, 1);
});

// --- CLI ---

async function makeRunDir(extraTask = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-draft-manifest-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_key: 'BCIN-7289', ...extraTask }));
  return runDir;
}

test('CLI writes phase3_spawn_manifest.json and prints SPAWN_MANIFEST', async () => {
  const runDir = await makeRunDir();
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SPAWN_MANIFEST:/);
  assert.match(result.stdout, /phase3_spawn_manifest\.json/);

  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  assert.equal(manifest.version, 1);
  assert.match(manifest.requests[0].openclaw.args.task, /BCIN-7289_QA_SUMMARY_DRAFT/);
  assert.match(manifest.requests[0].openclaw.args.task, /Round 1/);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI uses round 2 when phase3_round is 1 in task.json', async () => {
  const runDir = await makeRunDir({ phase3_round: 1 });
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);

  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Round 2/);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 when arguments are missing', () => {
  const result = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
});

// New tests for section 12 / C1-C12 / known_limitations_seed.json

test('prompt references known_limitations_seed.json as source artifact', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.match(prompt, /known_limitations_seed\.json/);
});

test('prompt says "all 12 numbered sections"', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.match(prompt, /all 12 numbered sections/);
});

test('prompt references C1\u2013C12 in self-review instructions', () => {
  const prompt = buildSubagentPrompt({
    runDir: '/tmp/runs/BCIN-7289',
    featureKey: 'BCIN-7289',
    rubricPaths: RUBRIC_PATHS,
    reviewNotesPath: null,
    round: 1,
  });
  assert.match(prompt, /C1.{1,3}C12/);
});
