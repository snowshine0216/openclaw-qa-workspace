import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import { parseVerdict, updateTaskForRerun } from '../lib/validate_summary_review.mjs';

const SCRIPT = new URL('../lib/validate_summary_review.mjs', import.meta.url).pathname;

// --- parseVerdict ---

test('parseVerdict returns accept for phase3', () => {
  const content = '## Verdict\n\n- accept\n';
  assert.equal(parseVerdict(content, 'phase3').verdict, 'accept');
});

test('parseVerdict returns accept for phase4', () => {
  const content = '## Verdict\n\n- accept\n';
  assert.equal(parseVerdict(content, 'phase4').verdict, 'accept');
});

test('parseVerdict returns "return phase3" for phase3 delta', () => {
  const content = '## Verdict\n\n- return phase3\n';
  assert.equal(parseVerdict(content, 'phase3').verdict, 'return phase3');
});

test('parseVerdict returns "return phase4" for phase4 delta', () => {
  const content = '## Verdict\n\n- return phase4\n';
  assert.equal(parseVerdict(content, 'phase4').verdict, 'return phase4');
});

test('parseVerdict returns null for wrong phase verdict', () => {
  const content = '## Verdict\n\n- return phase3\n';
  assert.equal(parseVerdict(content, 'phase4').verdict, null);
});

test('parseVerdict returns null when no verdict bullet', () => {
  const content = '## Verdict\n\nsome prose\n';
  assert.equal(parseVerdict(content, 'phase3').verdict, null);
});

test('parseVerdict returns null for empty content', () => {
  assert.equal(parseVerdict('', 'phase3').verdict, null);
});

test('parseVerdict is case-insensitive for accept', () => {
  const content = '## Verdict\n\n- Accept\n';
  assert.equal(parseVerdict(content, 'phase3').verdict, 'accept');
});

// --- updateTaskForRerun ---

test('updateTaskForRerun sets return_to_phase and roundKey for phase3', () => {
  const task = { run_key: 'X-1' };
  const updated = updateTaskForRerun(task, 'phase3', 1);
  assert.equal(updated.return_to_phase, 'phase3');
  assert.equal(updated.phase3_round, 1);
  assert.equal(task.phase3_round, undefined, 'original not mutated');
});

test('updateTaskForRerun sets return_to_phase and roundKey for phase4', () => {
  const task = { phase4_round: 1 };
  const updated = updateTaskForRerun(task, 'phase4', 2);
  assert.equal(updated.return_to_phase, 'phase4');
  assert.equal(updated.phase4_round, 2);
  assert.equal(task.phase4_round, 1, 'original not mutated');
});

// --- CLI ---

async function makeRunDir(opts = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-validate-review-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const task = { feature_key: 'BCIN-7289', ...opts.extraTask };
  await writeFile(join(runDir, 'task.json'), JSON.stringify(task));
  return runDir;
}

test('CLI exits 0 and prints REVIEW_ACCEPTED for phase3 accept verdict', async () => {
  const runDir = await makeRunDir();
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- accept\n'
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase3'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REVIEW_ACCEPTED/);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 0 and prints REVIEW_ACCEPTED for phase4 accept verdict', async () => {
  const runDir = await makeRunDir();
  await writeFile(
    join(runDir, 'context', 'phase4_review_delta.md'),
    '## Verdict\n\n- accept\n'
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase4'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REVIEW_ACCEPTED/);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI prints REVIEW_RETURN:1 on first return phase3', async () => {
  const runDir = await makeRunDir({ extraTask: { phase3_round: 0 } });
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- return phase3\n'
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase3'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REVIEW_RETURN:1/);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.return_to_phase, 'phase3');
  assert.equal(task.phase3_round, 1);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI increments round on second return', async () => {
  const runDir = await makeRunDir({ extraTask: { phase3_round: 1 } });
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- return phase3\n'
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase3'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REVIEW_RETURN:2/);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI clears return_to_phase on accept', async () => {
  const runDir = await makeRunDir({ extraTask: { return_to_phase: 'phase3', phase3_round: 1 } });
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\n- accept\n'
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase3'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.return_to_phase, null);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 when delta file is missing', async () => {
  const runDir = await makeRunDir();
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase3'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /phase3_review_delta/i);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 when verdict is invalid', async () => {
  const runDir = await makeRunDir();
  await writeFile(
    join(runDir, 'context', 'phase3_review_delta.md'),
    '## Verdict\n\nSome prose\n'
  );
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase3'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /invalid.*verdict|no.*verdict/i);
  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 for invalid phase argument', async () => {
  const runDir = await makeRunDir();
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'phase9'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  await rm(runDir, { recursive: true, force: true });
});
