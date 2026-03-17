import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPhase0 } from '../lib/phase0.mjs';

const SKILL_ROOT = join(import.meta.dirname, '..', '..');

test('loads planner and defect run roots from config when no override', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });

  const origCwd = process.cwd();
  process.chdir(SKILL_ROOT);
  try {
    const code = await runPhase0('BCIN-7289', runDir, {});
    assert.equal(code, 0);
    const taskRaw = await readFile(join(runDir, 'task.json'), 'utf8');
    const task = JSON.parse(taskRaw);
    assert.equal(task.planner_run_root, 'workspace-planner/skills/qa-plan-orchestrator/runs');
    assert.equal(task.defects_run_root, 'workspace-reporter/skills/defects-analysis/runs');
    assert.equal(task.report_state, 'FRESH');
    assert.equal(task.selected_mode, 'proceed');
  } finally {
    process.chdir(origCwd);
  }
});

test('uses the documented default refresh mode when rerun state exists and no refresh_mode is provided', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase0-'));
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'), '# draft');

  const origCwd = process.cwd();
  process.chdir(SKILL_ROOT);
  try {
    const code = await runPhase0('BCIN-1', runDir, {});
    assert.equal(code, 0);
    const taskRaw = await readFile(join(runDir, 'task.json'), 'utf8');
    const task = JSON.parse(taskRaw);
    assert.equal(task.report_state, 'DRAFT_EXISTS');
    assert.equal(task.selected_mode, 'resume');
  } finally {
    process.chdir(origCwd);
  }
});

test('archives before overwrite when selected_mode is full_regenerate', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'archive'), { recursive: true });
  await writeFile(join(runDir, 'drafts', 'BCIN-1_QA_SUMMARY_DRAFT.md'), '# draft');

  const origCwd = process.cwd();
  process.chdir(SKILL_ROOT);
  try {
    const code = await runPhase0('BCIN-1', runDir, { refresh_mode: 'full_regenerate' });
    assert.equal(code, 0);
    const { readdir } = await import('node:fs/promises');
    const archiveFiles = await readdir(join(runDir, 'archive'));
    assert.ok(archiveFiles.some((f) => f.startsWith('BCIN-1_QA_SUMMARY_DRAFT_')));
  } finally {
    process.chdir(origCwd);
  }
});

test('short-circuits completed use_existing runs when the final artifact already exists', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase0-'));
  await writeFile(join(runDir, 'BCIN-1_QA_SUMMARY_FINAL.md'), '# Final Summary');
  await writeFile(
    join(runDir, 'task.json'),
    JSON.stringify({
      overall_status: 'completed',
      selected_mode: 'use_existing',
      current_phase: 'phase6',
    })
  );

  const origCwd = process.cwd();
  process.chdir(SKILL_ROOT);
  try {
    const code = await runPhase0('BCIN-1', runDir, {});
    assert.equal(code, 0);

    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.overall_status, 'completed');
    assert.equal(task.selected_mode, 'use_existing');
  } finally {
    process.chdir(origCwd);
  }
});

test('persists per-run notification settings into task.json', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });

  const origCwd = process.cwd();
  process.chdir(SKILL_ROOT);
  try {
    const code = await runPhase0('BCIN-7289', runDir, {
      notification_target: 'qa-chat',
      skip_notification: true,
    });
    assert.equal(code, 0);

    const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
    assert.equal(task.notification_target, 'qa-chat');
    assert.equal(task.skip_notification, true);
  } finally {
    process.chdir(origCwd);
  }
});

test('blocks when refresh_mode is not allowed for the current report state', async () => {
  const runDir = await mkdtemp(join(tmpdir(), 'qa-summary-phase0-'));
  await mkdir(join(runDir, 'context'), { recursive: true });

  const origCwd = process.cwd();
  process.chdir(SKILL_ROOT);
  try {
    const code = await runPhase0('BCIN-7289', runDir, { refresh_mode: 'resume' });
    assert.equal(code, 2);
  } finally {
    process.chdir(origCwd);
  }
});
