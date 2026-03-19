import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveResumePhase } from '../lib/resolveResumePhase.mjs';

test('returns 0 when task.json is missing', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resolve-'));
  const result = resolveResumePhase(runDir);
  assert.equal(result, 0);
});

test('returns 4 when overall_status is awaiting_approval', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resolve-'));
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'awaiting_approval', current_phase: 'phase4' })
  );
  const result = resolveResumePhase(runDir);
  assert.equal(result, 4);
});

test('returns 5 when overall_status is approved', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resolve-'));
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'approved', current_phase: 'phase5' })
  );
  const result = resolveResumePhase(runDir);
  assert.equal(result, 5);
});

test('returns 4 when overall_status is review_in_progress', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resolve-'));
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'review_in_progress', current_phase: 'phase4' })
  );
  const result = resolveResumePhase(runDir);
  assert.equal(result, 4);
});

test('returns phase number from current_phase', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resolve-'));
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({ overall_status: 'in_progress', current_phase: 'phase2' })
  );
  const result = resolveResumePhase(runDir);
  assert.equal(result, 2);
});

test('returns phase 0 for completed use_existing runs so phase 0 can short-circuit safely', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resolve-'));
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'completed',
      selected_mode: 'use_existing',
      current_phase: 'phase6',
    })
  );
  const result = resolveResumePhase(runDir);
  assert.equal(result, 0);
});
