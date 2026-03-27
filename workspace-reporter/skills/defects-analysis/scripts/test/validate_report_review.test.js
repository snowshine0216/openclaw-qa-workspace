import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import { parseVerdict, updateTaskForRerun } from '../lib/validate_report_review.mjs';

const SCRIPT = new URL('../lib/validate_report_review.mjs', import.meta.url).pathname;

// --- Pure function tests ---

test('parseVerdict returns accept when delta ends with "- accept"', () => {
  const content = `## Blocking Findings\n\n| Criterion | Finding | Status |\nnone\n\n## Verdict\n\n- accept\n`;
  const result = parseVerdict(content);
  assert.equal(result.verdict, 'accept');
});

test('parseVerdict returns "return phase5" when delta ends with "- return phase5"', () => {
  const content = `## Blocking Findings\n\n| Criterion | Finding | Status |\n| C3 | no keys | fail |\n\n## Verdict\n\n- return phase5\n`;
  const result = parseVerdict(content);
  assert.equal(result.verdict, 'return phase5');
});

test('parseVerdict returns null when no verdict bullet present', () => {
  const content = `## Blocking Findings\n\nsome content\n\n## Verdict\n\nsome prose without a bullet\n`;
  const result = parseVerdict(content);
  assert.equal(result.verdict, null);
});

test('parseVerdict returns null for empty content', () => {
  const result = parseVerdict('');
  assert.equal(result.verdict, null);
});

test('parseVerdict is case-insensitive for accept', () => {
  const content = `## Verdict\n\n- Accept\n`;
  const result = parseVerdict(content);
  assert.equal(result.verdict, 'accept');
});

test('updateTaskForRerun sets return_to_phase to "phase5" and increments phase5_round', () => {
  const task = { run_key: 'X-1', phase5_round: 1 };
  const updated = updateTaskForRerun(task, 2);
  assert.equal(updated.return_to_phase, 'phase5');
  assert.equal(updated.phase5_round, 2);
  // original not mutated
  assert.equal(task.phase5_round, 1);
  assert.equal(task.return_to_phase, undefined);
});

test('updateTaskForRerun initializes phase5_round to 1 when not set', () => {
  const task = { run_key: 'X-1' };
  const updated = updateTaskForRerun(task, 1);
  assert.equal(updated.phase5_round, 1);
  assert.equal(updated.return_to_phase, 'phase5');
});

// --- CLI tests ---

async function makeRunDir(opts = {}) {
  const runDir = await mkdtemp(join(tmpdir(), 'defects-analysis-validate-review-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  const task = { run_key: 'BCIN-7289', route_kind: 'reporter_scope_single_key', phase5_round: opts.round ?? 0, ...opts.extraTask };
  await writeFile(join(runDir, 'task.json'), JSON.stringify(task));
  return runDir;
}

test('CLI exits 0 and prints REPORT_REVIEW_ACCEPTED when delta has accept verdict', async () => {
  const runDir = await makeRunDir();
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Blocking Findings\n\nnone\n\n## Verdict\n\n- accept\n',
  );

  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REPORT_REVIEW_ACCEPTED/);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 0 and prints REPORT_REVIEW_RETURN when delta has return phase5 verdict', async () => {
  const runDir = await makeRunDir({ round: 0 });
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Blocking Findings\n\n| C3 | no keys | fail |\n\n## Verdict\n\n- return phase5\n',
  );

  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REPORT_REVIEW_RETURN:1/);

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.return_to_phase, 'phase5');
  assert.equal(task.phase5_round, 1);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI increments round correctly on second return', async () => {
  const runDir = await makeRunDir({ round: 1 });
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Verdict\n\n- return phase5\n',
  );

  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REPORT_REVIEW_RETURN:2/);

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.phase5_round, 2);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 when report_review_delta.md is missing', async () => {
  const runDir = await makeRunDir();
  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /report_review_delta/i);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI exits 1 when delta has no valid verdict', async () => {
  const runDir = await makeRunDir();
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Verdict\n\nSome prose but no bullet verdict\n',
  );

  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /invalid.*verdict|no.*verdict/i);

  await rm(runDir, { recursive: true, force: true });
});

test('CLI clears return_to_phase on accept', async () => {
  const runDir = await makeRunDir({ extraTask: { return_to_phase: 'phase5', phase5_round: 1 } });
  await writeFile(
    join(runDir, 'context', 'report_review_delta.md'),
    '## Verdict\n\n- accept\n',
  );

  const result = spawnSync(process.execPath, [SCRIPT, runDir, 'BCIN-7289'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  assert.equal(task.return_to_phase, null);

  await rm(runDir, { recursive: true, force: true });
});
