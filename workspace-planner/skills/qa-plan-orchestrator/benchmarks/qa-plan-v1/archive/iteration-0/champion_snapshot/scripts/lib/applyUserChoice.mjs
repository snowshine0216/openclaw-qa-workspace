#!/usr/bin/env node
/**
 * Apply user choice from REPORT_STATE options.
 * - full_regenerate: reset to very beginning (Phase 0), clear all artifacts (context, drafts, final)
 * - smart_refresh: reset to Phase 2, keep context evidence, clear drafts and phase 2+ artifacts
 */
import { rm, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import {
  defaultRun,
  defaultTask,
  ensureRunDirs,
  loadState,
  nowIso,
  saveState,
} from './workflowState.mjs';

const MODES = new Set(['full_regenerate', 'smart_refresh']);

async function clearDirectory(dirPath) {
  try {
    await rm(dirPath, { recursive: true });
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

async function clearDraftsAndFinal(runDir) {
  const draftsDir = join(runDir, 'drafts');
  const finalPath = join(runDir, 'qa_plan_final.md');
  await clearDirectory(draftsDir);
  try {
    await unlink(finalPath);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

async function clearPhase2PlusContextArtifacts(runDir, featureId) {
  const contextDir = join(runDir, 'context');
  const toDelete = [
    `artifact_lookup_${featureId}.md`,
    `coverage_ledger_${featureId}.md`,
    `review_notes_${featureId}.md`,
    `review_delta_${featureId}.md`,
    `checkpoint_audit_${featureId}.md`,
    `checkpoint_delta_${featureId}.md`,
    `quality_delta_${featureId}.md`,
    `finalization_record_${featureId}.md`,
  ];
  for (const name of toDelete) {
    try {
      await unlink(join(contextDir, name));
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }
}

export async function applyUserChoice(featureId, runDir, mode) {
  const normalized = String(mode || '').trim().toLowerCase();
  if (!MODES.has(normalized)) {
    throw new Error(`Invalid mode: ${mode}. Use full_regenerate or smart_refresh.`);
  }

  const state = await loadState(featureId, runDir);
  const { task, run } = state;
  const runKey = task.run_key;

  if (normalized === 'full_regenerate') {
    await clearDirectory(join(runDir, 'context'));
    await clearDraftsAndFinal(runDir);
    await ensureRunDirs(runDir);
    const requestedSources = task.requested_source_families || ['jira'];
    Object.assign(task, defaultTask(featureId, runKey));
    task.feature_id = featureId;
    task.run_key = runKey;
    task.requested_source_families = requestedSources;
    task.selected_mode = 'full_regenerate';
    Object.assign(run, defaultRun(runKey));
    run.run_key = runKey;
    run.started_at = nowIso();
    run.updated_at = nowIso();
    task.updated_at = nowIso();
    run.updated_at = nowIso();
  } else if (normalized === 'smart_refresh') {
    await clearDraftsAndFinal(runDir);
    await clearPhase2PlusContextArtifacts(runDir, featureId);
    await ensureRunDirs(runDir);
    task.current_phase = 'phase_1_evidence_gathering';
    task.overall_status = 'in_progress';
    task.selected_mode = 'smart_refresh';
    task.latest_draft_version = null;
    task.latest_draft_path = null;
    task.latest_draft_phase = null;
    task.latest_review_version = null;
    task.latest_validation_version = null;
    task.phase4a_round = 0;
    task.phase4b_round = 0;
    task.phase5a_round = 0;
    task.phase5b_round = 0;
    task.phase6_round = 0;
    task.return_to_phase = null;
    run.artifact_index_generated_at = null;
    run.coverage_ledger_generated_at = null;
    run.draft_generated_at = null;
    run.review_completed_at = null;
    run.refactor_completed_at = null;
    run.finalized_at = null;
  }

  await saveState(state);
  return { mode: normalized, task, run };
}

export async function runApplyUserChoiceCli(argv = process.argv.slice(2)) {
  const [mode, featureId, runDir] = argv;
  if (!mode || !featureId || !runDir) {
    console.error('Usage: applyUserChoice.mjs <full_regenerate|smart_refresh> <feature-id> <run-dir>');
    process.exit(1);
  }
  try {
    const result = await applyUserChoice(featureId, runDir, mode);
    console.log(`USER_CHOICE_APPLIED: ${result.mode}`);
    console.log(`NEXT_PHASE: ${result.mode === 'full_regenerate' ? 'phase0' : 'phase2'}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runApplyUserChoiceCli();
}
