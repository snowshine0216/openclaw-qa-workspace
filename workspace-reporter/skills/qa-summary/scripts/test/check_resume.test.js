import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectReportState } from '../lib/detectReportState.mjs';

test('returns FINAL_EXISTS when final summary is present', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resume-'));
  await writeFile(join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md'), '# final');
  const result = detectReportState(runDir, 'BCIN-1');
  assert.equal(result, 'FINAL_EXISTS');
});

test('returns DRAFT_EXISTS when draft exists', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resume-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'), '# draft');
  const result = detectReportState(runDir, 'BCIN-1');
  assert.equal(result, 'DRAFT_EXISTS');
});

test('returns CONTEXT_ONLY when only planner lookup context exists', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resume-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'planner_artifact_lookup.json'), '{}');
  const result = detectReportState(runDir, 'BCIN-1');
  assert.equal(result, 'CONTEXT_ONLY');
});

test('returns CONTEXT_ONLY when only the extracted feature overview table exists', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resume-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await writeFile(join(runDir, 'context', 'feature_overview_table.md'), '### 1. Feature Overview');
  const result = detectReportState(runDir, 'BCIN-1');
  assert.equal(result, 'CONTEXT_ONLY');
});

test('returns FRESH when no artifacts exist', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-resume-'));
  const result = detectReportState(runDir, 'BCIN-1');
  assert.equal(result, 'FRESH');
});
