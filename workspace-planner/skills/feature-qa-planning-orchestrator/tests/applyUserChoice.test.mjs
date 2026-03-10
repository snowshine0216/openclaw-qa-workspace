import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { applyUserChoice } from '../scripts/lib/applyUserChoice.mjs';

test('full_regenerate clears context, drafts, final and resets state to Phase 0', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const projectDir = join(root, 'BCIN-999');
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await mkdir(join(projectDir, 'drafts'), { recursive: true });
  await writeFile(join(projectDir, 'context', 'jira_issue_BCIN-999.md'), 'evidence');
  await writeFile(join(projectDir, 'drafts', 'qa_plan_v1.md'), 'draft');
  await writeFile(join(projectDir, 'qa_plan_final.md'), 'final');
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({
    feature_id: 'BCIN-999',
    run_key: 'run-1',
    current_phase: 'phase_5_review_refactor',
    overall_status: 'in_progress',
  }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({
    run_key: 'run-1',
    spawn_history: [{ source_family: 'jira' }],
  }, null, 2));

  await applyUserChoice('BCIN-999', projectDir, 'full_regenerate');

  const task = JSON.parse(await readFile(join(projectDir, 'task.json'), 'utf8'));
  const run = JSON.parse(await readFile(join(projectDir, 'run.json'), 'utf8'));
  assert.equal(task.current_phase, null);
  assert.equal(task.overall_status, 'not_started');
  assert.equal(task.report_state, 'FRESH');
  assert.deepEqual(task.completed_source_families, []);
  assert.deepEqual(run.spawn_history, []);
  const contextFiles = await readdir(join(projectDir, 'context')).catch(() => []);
  const draftFiles = await readdir(join(projectDir, 'drafts')).catch(() => []);
  assert.equal(contextFiles.length, 0, 'context should be empty');
  assert.equal(draftFiles.length, 0, 'drafts should be empty');
  await assert.rejects(async () => access(join(projectDir, 'qa_plan_final.md')));
  await rm(root, { recursive: true, force: true });
});

test('smart_refresh keeps context, clears drafts, resets to Phase 2', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const projectDir = join(root, 'BCIN-888');
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await mkdir(join(projectDir, 'drafts'), { recursive: true });
  await writeFile(join(projectDir, 'context', 'jira_issue_BCIN-888.md'), 'evidence');
  await writeFile(join(projectDir, 'context', 'artifact_lookup_BCIN-888.md'), 'lookup');
  await writeFile(join(projectDir, 'drafts', 'qa_plan_v1.md'), 'draft');
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({
    feature_id: 'BCIN-888',
    run_key: 'run-2',
    current_phase: 'phase_5_review_refactor',
    overall_status: 'in_progress',
    requested_source_families: ['jira'],
  }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({
    run_key: 'run-2',
    spawn_history: [{ source_family: 'jira', artifact_paths: ['context/jira_issue_BCIN-888.md'] }],
  }, null, 2));

  await applyUserChoice('BCIN-888', projectDir, 'smart_refresh');

  const task = JSON.parse(await readFile(join(projectDir, 'task.json'), 'utf8'));
  const run = JSON.parse(await readFile(join(projectDir, 'run.json'), 'utf8'));
  assert.equal(task.current_phase, 'phase_1_evidence_gathering');
  assert.equal(task.overall_status, 'in_progress');
  assert.deepEqual(run.spawn_history, [{ source_family: 'jira', artifact_paths: ['context/jira_issue_BCIN-888.md'] }]);
  const jiraContent = await readFile(join(projectDir, 'context', 'jira_issue_BCIN-888.md'), 'utf8');
  assert.equal(jiraContent, 'evidence', 'context evidence should be preserved');
  await assert.rejects(async () => access(join(projectDir, 'context', 'artifact_lookup_BCIN-888.md')));
  const draftFiles = await readdir(join(projectDir, 'drafts')).catch(() => []);
  assert.equal(draftFiles.length, 0, 'drafts should be empty');
  await rm(root, { recursive: true, force: true });
});

test('applyUserChoice rejects invalid mode', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const projectDir = join(root, 'BCIN-777');
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await mkdir(join(projectDir, 'drafts'), { recursive: true });
  await writeFile(join(projectDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-777', run_key: 'r1' }, null, 2));
  await writeFile(join(projectDir, 'run.json'), JSON.stringify({ run_key: 'r1' }, null, 2));

  await assert.rejects(
    () => applyUserChoice('BCIN-777', projectDir, 'invalid_mode'),
    /Invalid mode/
  );
  await rm(root, { recursive: true, force: true });
});
