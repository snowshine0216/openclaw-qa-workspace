import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { applyUserChoice } from '../scripts/lib/applyUserChoice.mjs';

test('full_regenerate clears context, drafts, final and resets state to Phase 0', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const runDir = join(root, 'BCIN-999');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'context', 'jira_issue_BCIN-999.md'), 'evidence');
  await writeFile(join(runDir, 'drafts', 'qa_plan_v1.md'), 'draft');
  await writeFile(join(runDir, 'qa_plan_final.md'), 'final');
  await writeFile(join(runDir, 'task.json'), JSON.stringify({
    feature_id: 'BCIN-999',
    run_key: 'run-1',
    current_phase: 'phase_5_review_refactor',
    overall_status: 'in_progress',
  }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({
    run_key: 'run-1',
    spawn_history: [{ source_family: 'jira' }],
  }, null, 2));

  await applyUserChoice('BCIN-999', runDir, 'full_regenerate');

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(task.current_phase, null);
  assert.equal(task.overall_status, 'not_started');
  assert.equal(task.report_state, 'FRESH');
  assert.deepEqual(task.completed_source_families, []);
  assert.deepEqual(run.spawn_history, []);
  const contextFiles = await readdir(join(runDir, 'context')).catch(() => []);
  const draftFiles = await readdir(join(runDir, 'drafts')).catch(() => []);
  assert.equal(contextFiles.length, 0, 'context should be empty');
  assert.equal(draftFiles.length, 0, 'drafts should be empty');
  await assert.rejects(async () => access(join(runDir, 'qa_plan_final.md')));
  await rm(root, { recursive: true, force: true });
});

test('smart_refresh keeps context, clears drafts, resets to Phase 2', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const runDir = join(root, 'BCIN-888');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'context', 'jira_issue_BCIN-888.md'), 'evidence');
  await writeFile(join(runDir, 'context', 'artifact_lookup_BCIN-888.md'), 'lookup');
  await writeFile(join(runDir, 'drafts', 'qa_plan_v1.md'), 'draft');
  await writeFile(join(runDir, 'task.json'), JSON.stringify({
    feature_id: 'BCIN-888',
    run_key: 'run-2',
    current_phase: 'phase_5_review_refactor',
    overall_status: 'in_progress',
    requested_source_families: ['jira'],
  }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({
    run_key: 'run-2',
    spawn_history: [{ source_family: 'jira', artifact_paths: ['context/jira_issue_BCIN-888.md'] }],
  }, null, 2));

  await applyUserChoice('BCIN-888', runDir, 'smart_refresh');

  const task = JSON.parse(await readFile(join(runDir, 'task.json'), 'utf8'));
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(task.current_phase, 'phase_1_evidence_gathering');
  assert.equal(task.overall_status, 'in_progress');
  assert.deepEqual(run.spawn_history, [{ source_family: 'jira', artifact_paths: ['context/jira_issue_BCIN-888.md'] }]);
  const jiraContent = await readFile(join(runDir, 'context', 'jira_issue_BCIN-888.md'), 'utf8');
  assert.equal(jiraContent, 'evidence', 'context evidence should be preserved');
  await assert.rejects(async () => access(join(runDir, 'context', 'artifact_lookup_BCIN-888.md')));
  const draftFiles = await readdir(join(runDir, 'drafts')).catch(() => []);
  assert.equal(draftFiles.length, 0, 'drafts should be empty');
  await rm(root, { recursive: true, force: true });
});

test('applyUserChoice rejects invalid mode', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const runDir = join(root, 'BCIN-777');
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'task.json'), JSON.stringify({ feature_id: 'BCIN-777', run_key: 'r1' }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({ run_key: 'r1' }, null, 2));

  await assert.rejects(
    () => applyUserChoice('BCIN-777', runDir, 'invalid_mode'),
    /Invalid mode/
  );
  await rm(root, { recursive: true, force: true });
});

test('smart_refresh removes derived knowledge-pack artifacts and keeps evidence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'apply-choice-'));
  const runDir = join(root, 'BCIN-889');
  await mkdir(join(runDir, 'context', 'knowledge_pack_projection'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await writeFile(join(runDir, 'context', 'jira_issue_BCIN-889.md'), 'evidence');
  await writeFile(join(runDir, 'context', 'knowledge_pack_summary_BCIN-889.md'), 'summary');
  await writeFile(join(runDir, 'context', 'knowledge_pack_summary_BCIN-889.json'), '{}');
  await writeFile(join(runDir, 'context', 'knowledge_pack_retrieval_BCIN-889.md'), 'retrieval');
  await writeFile(join(runDir, 'context', 'knowledge_pack_retrieval_BCIN-889.json'), '{}');
  await writeFile(join(runDir, 'context', 'coverage_ledger_BCIN-889.md'), 'ledger');
  await writeFile(join(runDir, 'context', 'coverage_ledger_BCIN-889.json'), '{}');
  await writeFile(join(runDir, 'context', 'knowledge_pack_qmd.sqlite'), 'sqlite');
  await writeFile(join(runDir, 'context', 'knowledge_pack_qmd.sqlite-wal'), 'wal');
  await writeFile(join(runDir, 'context', 'knowledge_pack_qmd.sqlite-shm'), 'shm');
  await writeFile(join(runDir, 'context', 'knowledge_pack_projection', 'row.md'), '# row');
  await writeFile(join(runDir, 'task.json'), JSON.stringify({
    feature_id: 'BCIN-889',
    run_key: 'run-3',
    current_phase: 'phase_5_review_refactor',
    overall_status: 'in_progress',
    requested_source_families: ['jira'],
  }, null, 2));
  await writeFile(join(runDir, 'run.json'), JSON.stringify({
    run_key: 'run-3',
    spawn_history: [{ source_family: 'jira', artifact_paths: ['context/jira_issue_BCIN-889.md'] }],
    knowledge_pack_summary_generated_at: '2026-03-23T00:00:00.000Z',
    knowledge_pack_summary_artifact: 'context/knowledge_pack_summary_BCIN-889.md',
    knowledge_pack_retrieval_generated_at: '2026-03-23T00:05:00.000Z',
    knowledge_pack_retrieval_artifact: 'context/knowledge_pack_retrieval_BCIN-889.md',
  }, null, 2));

  await applyUserChoice('BCIN-889', runDir, 'smart_refresh');

  const jiraContent = await readFile(join(runDir, 'context', 'jira_issue_BCIN-889.md'), 'utf8');
  assert.equal(jiraContent, 'evidence');
  assert.equal(
    await readFile(join(runDir, 'context', 'knowledge_pack_summary_BCIN-889.md'), 'utf8'),
    'summary',
  );
  await assert.rejects(async () => access(join(runDir, 'context', 'knowledge_pack_qmd.sqlite')));
  await assert.rejects(async () => access(join(runDir, 'context', 'knowledge_pack_projection')));
  const run = JSON.parse(await readFile(join(runDir, 'run.json'), 'utf8'));
  assert.equal(run.knowledge_pack_summary_generated_at, '2026-03-23T00:00:00.000Z');
  assert.equal(run.knowledge_pack_summary_artifact, 'context/knowledge_pack_summary_BCIN-889.md');
  assert.equal(run.knowledge_pack_retrieval_generated_at, null);
  assert.equal(run.knowledge_pack_retrieval_artifact, null);
  await rm(root, { recursive: true, force: true });
});

test('applyUserChoice CLI uses run-dir terminology in usage output', async () => {
  const module = await import('../scripts/lib/applyUserChoice.mjs');
  const originalExit = process.exit;
  const originalError = console.error;
  const errors = [];
  let exitCode = null;

  console.error = (message) => {
    errors.push(String(message));
  };
  process.exit = (code) => {
    exitCode = code;
    throw new Error(`exit:${code}`);
  };

  try {
    await assert.rejects(
      () => module.runApplyUserChoiceCli([]),
      /exit:1/
    );
  } finally {
    process.exit = originalExit;
    console.error = originalError;
  }

  assert.equal(exitCode, 1);
  assert.match(errors.join('\n'), /run-dir/);
  assert.doesNotMatch(errors.join('\n'), /project-dir/);
});
