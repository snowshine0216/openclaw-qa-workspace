import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase3 } from '../lib/phase3.mjs';

async function makeRunDir(extraTask = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase3-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ feature_key: 'BCIN-7289', ...extraTask })
  );
  return runDir;
}

// --- Pre-spawn (mode !== --post) ---

test('pre-spawn emits phase3_spawn_manifest.json and returns 0', async () => {
  const runDir = await makeRunDir();
  const code = await runPhase3('BCIN-7289', runDir);
  assert.equal(code, 0);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  assert.equal(manifest.version, 1);
  assert.equal(manifest.source_kind, 'qa-summary-draft');
});

test('pre-spawn prompt contains feature key and rubric references', async () => {
  const runDir = await makeRunDir();
  await runPhase3('BCIN-7289', runDir);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  const prompt = manifest.requests[0].openclaw.args.task;
  assert.match(prompt, /BCIN-7289/);
  assert.match(prompt, /summary-generation-rubric/);
  assert.match(prompt, /summary-review-rubric/);
});

test('pre-spawn uses round 1 when task has no phase3_round', async () => {
  const runDir = await makeRunDir();
  await runPhase3('BCIN-7289', runDir);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Round 1/);
});

// --- --post accept ---

test('--post with accept verdict updates task to review_in_progress and returns 0', async () => {
  const runDir = await makeRunDir({ phase3_round: 0 });
  await writeFile(join(runDir, 'context', 'phase3_review_delta.md'), '## Verdict\n\n- accept\n');
  const code = await runPhase3('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.current_phase, 'phase3');
  assert.equal(task.overall_status, 'review_in_progress');
  assert.equal(task.return_to_phase, null);
});

// --- --post return phase3 retry ---

test('--post with return verdict re-emits spawn manifest and returns 0', async () => {
  const runDir = await makeRunDir({ phase3_round: 0 });
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- return phase3\n'
  );
  const code = await runPhase3('BCIN-7289', runDir, '--post');
  assert.equal(code, 0);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase3_round, 1);
  assert.equal(task.return_to_phase, 'phase3');
  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Round 2/);
});

test('--post with return verdict on round 2 uses round 3', async () => {
  const runDir = await makeRunDir({ phase3_round: 1 });
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- return phase3\n'
  );
  await runPhase3('BCIN-7289', runDir, '--post');
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase3_round, 2);
  const manifest = JSON.parse(await readFile(join(runDir, 'phase3_spawn_manifest.json'), 'utf8'));
  assert.match(manifest.requests[0].openclaw.args.task, /Round 3/);
});

// --- --post max rounds ---

test('--post blocks when phase3_round reaches MAX_ROUNDS (3)', async () => {
  const runDir = await makeRunDir({ phase3_round: 3 });
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- return phase3\n'
  );
  const code = await runPhase3('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
});

// --- --post missing delta ---

test('--post blocks when phase3_review_delta.md is missing', async () => {
  const runDir = await makeRunDir();
  const code = await runPhase3('BCIN-7289', runDir, '--post');
  assert.equal(code, 2);
});
