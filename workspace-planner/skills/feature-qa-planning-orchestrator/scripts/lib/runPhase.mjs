#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  classifyReportState,
  fileExists,
  isActiveStatus,
  isPhasePast,
  loadState,
  normalizeRequestedSourceFamilies,
  nowCompactTimestamp,
  saveState,
  updateLatestDraftVersion,
} from './workflowState.mjs';
import { buildRuntimeSetup } from './runtimeEnv.mjs';
import { evaluateEvidenceCompleteness, evaluateSourceArtifactCompleteness, evaluateSpawnPolicy } from './contextRules.mjs';
import { writeArtifactLookup } from './artifactLookup.mjs';
import {
  validateCoverageLedger,
  validateE2EMinimum,
  validateExecutableSteps,
  validateReviewDelta,
  validateXMindMarkHierarchy,
} from './qaPlanValidators.mjs';
import { writePhaseManifest } from './spawnManifestBuilders.mjs';

const PHASE_TO_GATE = {
  phase1: 'phase_1_evidence_gathering',
  phase3: 'phase_3_coverage_mapping',
  phase4a: 'phase_4a_subcategory_draft',
  phase4b: 'phase_4b_top_category_draft',
  phase5: 'phase_5_review_refactor',
  phase6: 'phase_6_quality_refactor',
};

export async function runPhaseCli(argv = process.argv.slice(2)) {
  const [phaseId, featureId, projectDir, maybePost] = argv;
  const post = maybePost === '--post';
  if (!phaseId || !featureId || !projectDir) {
    console.error('Usage: runPhase.mjs <phase-id> <feature-id> <project-dir> [--post]');
    process.exit(1);
  }

  try {
    if (phaseId === 'phase0') {
      await runPhase0(featureId, projectDir);
    } else if (phaseId === 'phase1') {
      await runSpawnPhase(featureId, projectDir, 'phase1', post);
    } else if (phaseId === 'phase2') {
      await runPhase2(featureId, projectDir);
    } else if (phaseId === 'phase3') {
      await runSpawnPhase(featureId, projectDir, 'phase3', post);
    } else if (phaseId === 'phase4a') {
      await runSpawnPhase(featureId, projectDir, 'phase4a', post);
    } else if (phaseId === 'phase4b') {
      await runSpawnPhase(featureId, projectDir, 'phase4b', post);
    } else if (phaseId === 'phase5') {
      await runSpawnPhase(featureId, projectDir, 'phase5', post);
    } else if (phaseId === 'phase6') {
      await runSpawnPhase(featureId, projectDir, 'phase6', post);
    } else if (phaseId === 'phase7') {
      await runPhase7(featureId, projectDir);
    } else {
      throw new Error(`Unsupported phase: ${phaseId}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(error.code || 1);
  }
}

async function runPhase0(featureId, projectDir) {
  const state = await loadState(featureId, projectDir);
  const { task, run } = state;
  const nextRunKey = String(process.env.FQPO_RUN_KEY || task.run_key || '').trim();
  if (nextRunKey && task.run_key && nextRunKey !== task.run_key && isActiveStatus(task.overall_status)) {
    throw new Error(`CONCURRENT_RUN_BLOCKED: active run ${task.run_key} detected; resolve it before starting a new run`);
  }

  const requestedSources = normalizeRequestedSourceFamilies(task.requested_source_families).length > 0
    ? normalizeRequestedSourceFamilies(task.requested_source_families)
    : ['jira'];
  const contextDir = join(projectDir, 'context');
  const runtimeSetup = await buildRuntimeSetup(featureId, requestedSources, contextDir);
  task.has_supporting_artifacts = Boolean(runtimeSetup.has_supporting_artifacts);
  run.has_supporting_artifacts = Boolean(runtimeSetup.has_supporting_artifacts);

  task.report_state = await classifyReportState(projectDir);
  task.current_phase = 'phase_0_runtime_setup';
  task.requested_source_families = requestedSources;
  task.overall_status = runtimeSetup.ok ? 'in_progress' : 'blocked';
  run.runtime_setup_generated_at = new Date().toISOString();

  await saveState(state);
  if (!runtimeSetup.ok) {
    throw new Error(`PHASE_0_BLOCKED: ${runtimeSetup.failures.join('; ')}`);
  }
  console.log('PHASE_0_COMPLETE');
}

async function runPhase2(featureId, projectDir) {
  const state = await loadState(featureId, projectDir);
  await writeArtifactLookup(featureId, projectDir);
  state.task.current_phase = 'phase_2_artifact_index';
  state.task.overall_status = 'in_progress';
  state.run.artifact_index_generated_at = new Date().toISOString();
  await saveState(state);
  console.log(`PHASE_2_COMPLETE: ${join(projectDir, 'context', `artifact_lookup_${featureId}.md`)}`);
}

async function runPhase7(featureId, projectDir) {
  const state = await loadState(featureId, projectDir);
  const sourcePath = await selectPromotionSource(projectDir);
  const finalPath = join(projectDir, 'qa_plan_final.md');
  if (await fileExists(finalPath)) {
    const archiveName = `qa_plan_final_${nowCompactTimestamp()}.md`;
    await rename(finalPath, join(projectDir, archiveName));
  }

  await copyFile(sourcePath, finalPath);
  await writeFile(
    join(projectDir, 'context', `finalization_record_${featureId}.md`),
    `# Finalization Record\n\n- Source: ${sourcePath}\n- Promoted at: ${new Date().toISOString()}\n`,
    'utf8'
  );

  state.task.current_phase = 'phase_7_finalization';
  state.task.overall_status = 'completed';
  state.run.finalized_at = new Date().toISOString();

  let feishuWarning = '';
  try {
    await maybeNotifyFeishu(featureId, projectDir);
  } catch (error) {
    feishuWarning = `FEISHU_NOTIFY_FAILED: ${error.message}`;
    console.log(feishuWarning);
  }

  await saveState(state);
  console.log(`PHASE_7_COMPLETE: ${finalPath}`);
}

async function runSpawnPhase(featureId, projectDir, phaseId, post) {
  if (post) {
    await runPostValidation(featureId, projectDir, phaseId);
    return;
  }

  const state = await loadState(featureId, projectDir);
  const manifestPath = join(projectDir, `${phaseId}_spawn_manifest.json`);
  const gate = PHASE_TO_GATE[phaseId];
  if ((await fileExists(manifestPath)) && isPhasePast(state.task.current_phase, gate)) {
    console.log(`PHASE_ALREADY_COMPLETE: ${phaseId}`);
    return;
  }

  const outputPath = await writePhaseManifest(phaseId, featureId, projectDir, manifestPath);
  console.log(`SPAWN_MANIFEST: ${outputPath}`);
}

async function runPostValidation(featureId, projectDir, phaseId) {
  const state = await loadState(featureId, projectDir);
  if (phaseId === 'phase1') {
    await postValidatePhase1(state);
  } else if (phaseId === 'phase3') {
    await postValidatePhase3(featureId, projectDir, state);
  } else if (phaseId === 'phase4a') {
    await postValidatePhase4a(featureId, projectDir, state);
  } else if (phaseId === 'phase4b') {
    await postValidatePhase4b(projectDir, state);
  } else if (phaseId === 'phase5') {
    await postValidatePhase5(featureId, projectDir, state);
  } else if (phaseId === 'phase6') {
    await postValidatePhase6(projectDir, state);
  } else {
    throw new Error(`Unsupported post phase: ${phaseId}`);
  }
}

async function postValidatePhase1(state) {
  const requestedSourceFamilies = normalizeRequestedSourceFamilies(state.task.requested_source_families);
  const spawnHistory = Array.isArray(state.run.spawn_history) ? state.run.spawn_history : [];
  const spawnPolicy = evaluateSpawnPolicy({ requestedSourceFamilies, spawnHistory });
  const completeness = evaluateEvidenceCompleteness({
    requestedSourceFamilies,
    spawnHistory,
    hasSupportingArtifacts: Boolean(state.run.has_supporting_artifacts),
  });

  const failures = [...spawnPolicy.failures, ...completeness.failures];
  if (failures.length > 0) {
    const families = new Set();
    requestedSourceFamilies.forEach((sourceFamily) => {
      const entries = spawnHistory.filter((entry) => normalizeRequestedSourceFamilies([entry.source_family || entry.sourceFamily]).includes(sourceFamily));
      if (entries.length !== 1) {
        families.add(sourceFamily);
        return;
      }
      const artifactCheck = evaluateSourceArtifactCompleteness({
        sourceFamily,
        artifactPaths: entries[0].artifact_paths || entries[0].artifactPaths || [],
      });
      if (!artifactCheck.ok) {
        families.add(sourceFamily);
      }
    });

    families.forEach((family) => console.error(`REMEDIATION_REQUIRED: ${family}`));
    const error = new Error(failures.join('; '));
    error.code = 2;
    throw error;
  }

  state.task.current_phase = 'phase_1_evidence_gathering';
  state.task.overall_status = 'in_progress';
  state.run.data_fetched_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_1_COMPLETE');
}

async function postValidatePhase3(featureId, projectDir, state) {
  const ledgerPath = join(projectDir, 'context', `coverage_ledger_${featureId}.md`);
  const content = await readRequiredText(ledgerPath);
  assertValidation(validateCoverageLedger(content), 'coverage ledger');
  await writeArtifactLookup(featureId, projectDir);
  state.task.current_phase = 'phase_3_coverage_mapping';
  state.run.coverage_ledger_generated_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_3_COMPLETE');
}

async function postValidatePhase4a(featureId, projectDir, state) {
  const draftPath = join(projectDir, 'drafts', `qa_plan_subcategory_${featureId}.md`);
  const content = await readRequiredText(draftPath);
  assertValidation(validateExecutableSteps(content), 'phase4a draft');
  state.task.current_phase = 'phase_4a_subcategory_draft';
  updateLatestDraftVersion(state.task, draftPath);
  state.run.draft_generated_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_4A_COMPLETE');
}

async function postValidatePhase4b(projectDir, state) {
  const draftPath = join(projectDir, 'drafts', 'qa_plan_v1.md');
  const content = await readRequiredText(draftPath);
  assertValidation(validateXMindMarkHierarchy(content), 'phase4b hierarchy');
  assertValidation(validateE2EMinimum(content, { featureClassification: 'user_facing' }), 'phase4b e2e minimum');
  state.task.current_phase = 'phase_4b_top_category_draft';
  updateLatestDraftVersion(state.task, draftPath);
  state.run.draft_generated_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_4B_COMPLETE');
}

async function postValidatePhase5(featureId, projectDir, state) {
  const reviewNotesPath = join(projectDir, 'context', `review_notes_${featureId}.md`);
  const reviewDeltaPath = join(projectDir, 'context', `review_delta_${featureId}.md`);
  const beforePath = join(projectDir, 'drafts', 'qa_plan_v1.md');
  const afterPath = join(projectDir, 'drafts', 'qa_plan_v2.md');

  await Promise.all([
    readRequiredText(reviewNotesPath),
    readRequiredText(reviewDeltaPath),
    readRequiredText(beforePath),
    readRequiredText(afterPath),
  ]);
  const beforeContent = await readRequiredText(beforePath);
  const afterContent = await readRequiredText(afterPath);
  if (beforeContent === afterContent) {
    throw new Error('phase5 requires qa_plan_v2.md to differ from qa_plan_v1.md');
  }

  state.task.current_phase = 'phase_5_review_refactor';
  updateLatestDraftVersion(state.task, afterPath);
  state.run.review_completed_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_5_COMPLETE');
}

async function postValidatePhase6(projectDir, state) {
  const draftPath = join(projectDir, 'drafts', 'qa_plan_v3.md');
  const qualityDeltaPath = join(projectDir, 'context', `quality_delta_${state.task.feature_id}.md`);
  const draftContent = await readRequiredText(draftPath);
  const qualityDeltaContent = await readRequiredText(qualityDeltaPath);

  assertValidation(validateExecutableSteps(draftContent), 'phase6 executable steps');
  assertValidation(validateXMindMarkHierarchy(draftContent), 'phase6 hierarchy');
  assertValidation(validateReviewDelta(qualityDeltaContent), 'phase6 quality delta');

  state.task.current_phase = 'phase_6_quality_refactor';
  updateLatestDraftVersion(state.task, draftPath);
  state.run.refactor_completed_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_6_COMPLETE');
}

function assertValidation(result, label) {
  if (!result.ok) {
    throw new Error(`${label} validation failed: ${result.failures.join('; ')}`);
  }
}

async function readRequiredText(path) {
  if (!(await fileExists(path))) {
    throw new Error(`Missing required file: ${path}`);
  }
  return readFile(path, 'utf8');
}

async function selectPromotionSource(projectDir) {
  const candidates = ['qa_plan_v3.md', 'qa_plan_v2.md', 'qa_plan_v1.md']
    .map((name) => join(projectDir, 'drafts', name));
  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }
  throw new Error('No draft artifact available for promotion.');
}

async function maybeNotifyFeishu(featureId, projectDir) {
  const command = String(process.env.FQPO_FEISHU_NOTIFY_CMD || '').trim();
  if (!command) {
    throw new Error(`no Feishu notification command configured for ${featureId} at ${projectDir}`);
  }

  const result = spawnSync(command, {
    shell: true,
    encoding: 'utf8',
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'notification command failed').trim());
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPhaseCli();
}
