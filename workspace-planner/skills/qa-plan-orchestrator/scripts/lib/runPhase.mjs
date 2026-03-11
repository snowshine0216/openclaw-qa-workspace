#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  applyRequestModel,
  buildRequestFulfillmentModel,
  classifyReportState,
  DEFAULT_DEEP_RESEARCH_TOPICS,
  fileExists,
  isActiveStatus,
  isPhasePast,
  getNextPhaseRound,
  loadState,
  normalizeIssueKeys,
  normalizeRequestedSourceFamilies,
  nowCompactTimestamp,
  resolveDefaultRunDir,
  saveState,
  updateLatestDraftMetadata,
  writeJson,
} from './workflowState.mjs';
import { buildRuntimeSetup } from './runtimeEnv.mjs';
import {
  evaluateEvidenceCompleteness,
  evaluateSourceArtifactCompleteness,
  evaluateSpawnPolicy,
  validateRequestFulfillmentStatus,
} from './contextRules.mjs';
import { writeArtifactLookup } from './artifactLookup.mjs';
import {
  validateCoveragePreservationAudit,
  validateCoverageLedger,
  validateDraftCoveragePreservation,
  validateCheckpointAudit,
  validateCheckpointDelta,
  validateContextCoverageAudit,
  validateE2EMinimum,
  validateExecutableSteps,
  validateFinalLayering,
  validatePhase5aAcceptanceGate,
  validatePhase4aSubcategoryDraft,
  validatePhase4bCategoryLayering,
  validateQualityDelta,
  validateRoundProgression,
  validateReviewDelta,
  validateSectionReviewChecklist,
  validateXMindMarkHierarchy,
} from './qaPlanValidators.mjs';
import { writePhaseManifest } from './spawnManifestBuilders.mjs';

const PHASE_TO_GATE = {
  phase1: 'phase_1_evidence_gathering',
  phase3: 'phase_3_coverage_mapping',
  phase4a: 'phase_4a_subcategory_draft',
  phase4b: 'phase_4b_top_category_draft',
  phase5a: 'phase_5a_review_refactor',
  phase5b: 'phase_5b_checkpoint_refactor',
  phase6: 'phase_6_quality_refactor',
};

export async function runPhaseCli(argv = process.argv.slice(2)) {
  const [phaseId, featureId, maybeRunDir, maybeFlag] = argv;
  const post = maybeRunDir === '--post' || maybeFlag === '--post';
  const runDir = (!maybeRunDir || maybeRunDir === '--post')
    ? (featureId ? resolveDefaultRunDir(featureId) : '')
    : maybeRunDir;
  if (!phaseId || !featureId) {
    console.error('Usage: runPhase.mjs <phase-id> <feature-id> [run-dir] [--post]');
    process.exit(1);
  }

  try {
    if (phaseId === 'phase0') {
      await runPhase0(featureId, runDir);
    } else if (phaseId === 'phase1') {
      await runSpawnPhase(featureId, runDir, 'phase1', post);
    } else if (phaseId === 'phase2') {
      await runPhase2(featureId, runDir);
    } else if (phaseId === 'phase3') {
      await runSpawnPhase(featureId, runDir, 'phase3', post);
    } else if (phaseId === 'phase4a') {
      await runSpawnPhase(featureId, runDir, 'phase4a', post);
    } else if (phaseId === 'phase4b') {
      await runSpawnPhase(featureId, runDir, 'phase4b', post);
    } else if (phaseId === 'phase5a') {
      await runSpawnPhase(featureId, runDir, 'phase5a', post);
    } else if (phaseId === 'phase5b') {
      await runSpawnPhase(featureId, runDir, 'phase5b', post);
    } else if (phaseId === 'phase6') {
      await runSpawnPhase(featureId, runDir, 'phase6', post);
    } else if (phaseId === 'phase7') {
      await runPhase7(featureId, runDir);
    } else {
      throw new Error(`Unsupported phase: ${phaseId}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(error.code || 1);
  }
}

async function runPhase0(featureId, runDir) {
  const state = await loadState(featureId, runDir);
  const { task, run } = state;
  applyRequestModel(task, featureId);
  assertSupportOnlyMode(task);
  const nextRunKey = String(process.env.FQPO_RUN_KEY || task.run_key || '').trim();
  if (nextRunKey && task.run_key && nextRunKey !== task.run_key && isActiveStatus(task.overall_status)) {
    throw new Error(`CONCURRENT_RUN_BLOCKED: active run ${task.run_key} detected; resolve it before starting a new run`);
  }

  const requestedSources = normalizeRequestedSourceFamilies(task.requested_source_families).length > 0
    ? normalizeRequestedSourceFamilies(task.requested_source_families)
    : ['jira'];
  const contextDir = join(runDir, 'context');
  const runtimeSetup = await buildRuntimeSetup(featureId, requestedSources, contextDir, {
    supportingIssuePolicy: task.supporting_issue_policy,
    deepResearchPolicy: task.deep_research_policy,
    supportingIssueKeys: task.supporting_issue_keys,
  });
  task.has_supporting_artifacts = Boolean(runtimeSetup.has_supporting_artifacts);
  run.has_supporting_artifacts = Boolean(runtimeSetup.has_supporting_artifacts);

  task.report_state = await classifyReportState(runDir);
  task.current_phase = 'phase_0_runtime_setup';
  task.requested_source_families = requestedSources;
  task.overall_status = runtimeSetup.ok ? 'in_progress' : 'blocked';
  run.runtime_setup_generated_at = new Date().toISOString();
  await writePhase0RequestArtifacts(featureId, runDir, task, run);
  await updateRequestFulfillmentForPhase(state, 'phase0', []);

  await saveState(state);
  if (!runtimeSetup.ok) {
    throw new Error(`PHASE_0_BLOCKED: ${runtimeSetup.failures.join('; ')}`);
  }
  console.log('PHASE_0_COMPLETE');
}

async function runPhase2(featureId, runDir) {
  const state = await loadState(featureId, runDir);
  await writeArtifactLookup(featureId, runDir);
  state.task.current_phase = 'phase_2_artifact_index';
  state.task.overall_status = 'in_progress';
  state.run.artifact_index_generated_at = new Date().toISOString();
  await updateRequestFulfillmentForPhase(state, 'phase2', []);
  await saveState(state);
  console.log(`PHASE_2_COMPLETE: ${join(runDir, 'context', `artifact_lookup_${featureId}.md`)}`);
}

async function runPhase7(featureId, runDir) {
  const state = await loadState(featureId, runDir);
  await assertRequestFulfillmentReady(featureId, runDir, state.run);
  const sourcePath = await selectPromotionSource(runDir, state.task);
  const finalPath = join(runDir, 'qa_plan_final.md');
  if (await fileExists(finalPath)) {
    const archiveName = `qa_plan_final_${nowCompactTimestamp()}.md`;
    await rename(finalPath, join(runDir, archiveName));
  }

  await copyFile(sourcePath, finalPath);
  const lineage = await buildFinalizationLineage(featureId, runDir);
  await writeFile(
    join(runDir, 'context', `finalization_record_${featureId}.md`),
    `# Finalization Record\n\n- Source: ${sourcePath}\n- Promoted at: ${new Date().toISOString()}\n\n## Supporting Context Lineage\n${lineage.supporting}\n\n## Deep Research Lineage\n${lineage.research}\n`,
    'utf8'
  );

  state.task.current_phase = 'phase_7_finalization';
  state.task.overall_status = 'completed';
  state.run.finalized_at = new Date().toISOString();

  let feishuWarning = '';
  try {
    await maybeNotifyFeishu(featureId, runDir);
    state.run.notification_pending = false;
  } catch (error) {
    feishuWarning = `FEISHU_NOTIFY_FAILED: ${error.message}`;
    state.run.notification_pending = {
      feature_id: featureId,
      final_path: finalPath,
      error: error.message,
      queued_at: new Date().toISOString(),
    };
    console.log(feishuWarning);
  }

  await saveState(state);
  console.log(`PHASE_7_COMPLETE: ${finalPath}`);
}

async function runSpawnPhase(featureId, runDir, phaseId, post) {
  if (post) {
    await runPostValidation(featureId, runDir, phaseId);
    return;
  }

  const state = await loadState(featureId, runDir);
  const manifestPath = join(runDir, `${phaseId}_spawn_manifest.json`);
  const gate = PHASE_TO_GATE[phaseId];
  const rerunRequested = String(state.task.return_to_phase || '').trim().toLowerCase() === phaseId;
  if ((await fileExists(manifestPath)) && isPhasePast(state.task.current_phase, gate) && !rerunRequested) {
    console.log(`PHASE_ALREADY_COMPLETE: ${phaseId}`);
    return;
  }

  const outputPath = await writePhaseManifest(phaseId, featureId, runDir, manifestPath);
  console.log(`SPAWN_MANIFEST: ${outputPath}`);
}

async function runPostValidation(featureId, runDir, phaseId) {
  const state = await loadState(featureId, runDir);
  if (phaseId === 'phase1') {
    await postValidatePhase1(state);
  } else if (phaseId === 'phase3') {
    await postValidatePhase3(featureId, runDir, state);
  } else if (phaseId === 'phase4a') {
    await postValidatePhase4a(featureId, runDir, state);
  } else if (phaseId === 'phase4b') {
    await postValidatePhase4b(runDir, state);
  } else if (phaseId === 'phase5a') {
    await postValidatePhase5a(featureId, runDir, state);
  } else if (phaseId === 'phase5b') {
    await postValidatePhase5b(featureId, runDir, state);
  } else if (phaseId === 'phase6') {
    await postValidatePhase6(runDir, state);
  } else {
    throw new Error(`Unsupported post phase: ${phaseId}`);
  }
}

async function postValidatePhase1(state) {
  const requestedSourceFamilies = normalizeRequestedSourceFamilies(state.task.requested_source_families);
  const spawnHistory = Array.isArray(state.run.spawn_history) ? state.run.spawn_history : [];
  const runDir = dirname(state.taskPath);
  const contextArtifactPaths = (await readdir(join(runDir, 'context')).catch(() => []))
    .map((name) => `context/${name}`);
  const spawnPolicy = evaluateSpawnPolicy({ requestedSourceFamilies, spawnHistory });
  const completeness = evaluateEvidenceCompleteness({
    requestedSourceFamilies,
    spawnHistory,
    hasSupportingArtifacts: Boolean(state.run.has_supporting_artifacts),
    contextArtifactPaths,
  });
  const supportingContext = await validateSupportingContextArtifacts(state.task, runDir);

  const failures = [...spawnPolicy.failures, ...completeness.failures, ...supportingContext.failures];
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
  state.run.supporting_context_generated_at = supportingContext.generated ? new Date().toISOString() : state.run.supporting_context_generated_at;
  await updateRequestFulfillmentForPhase(state, 'phase1', supportingContext.executionLog);
  await saveState(state);
  console.log('PHASE_1_COMPLETE');
}

async function postValidatePhase3(featureId, runDir, state) {
  const ledgerPath = join(runDir, 'context', `coverage_ledger_${featureId}.md`);
  const content = await readRequiredText(ledgerPath);
  assertValidation(validateCoverageLedger(content), 'coverage ledger');
  const researchValidation = await validateDeepResearchArtifacts(featureId, runDir, state.task);
  if (!researchValidation.ok) {
    throw new Error(researchValidation.failures.join('; '));
  }
  await writeArtifactLookup(featureId, runDir);
  state.task.current_phase = 'phase_3_coverage_mapping';
  state.run.coverage_ledger_generated_at = new Date().toISOString();
  state.run.deep_research_generated_at = new Date().toISOString();
  state.run.deep_research_fallback_used = researchValidation.fallbackUsed;
  await updateRequestFulfillmentForPhase(state, 'phase3', researchValidation.executionLog);
  await saveState(state);
  console.log('PHASE_3_COMPLETE');
}

async function postValidatePhase4a(featureId, runDir, state) {
  const draftPath = await resolveDraftPath(state.task, runDir, 'phase4a');
  const content = await readRequiredText(draftPath);
  const expectedDraftPath = await readExpectedOutputDraftPath(runDir, 'phase4a');
  assertValidation(validateRoundProgression({ task: state.task, phaseId: 'phase4a', producedDraftPath: draftPath, expectedDraftPath }), 'phase4a round progression');
  assertValidation(validatePhase4aSubcategoryDraft(content, buildDesignValidationContext(state.task)), 'phase4a subcategory draft');
  assertValidation(validateExecutableSteps(content), 'phase4a draft');
  state.task.current_phase = 'phase_4a_subcategory_draft';
  updateLatestDraftMetadata(state.task, draftPath, 'phase4a');
  state.run.draft_generated_at = new Date().toISOString();
  await writeArtifactLookup(featureId, runDir);
  await saveState(state);
  console.log('PHASE_4A_COMPLETE');
}

async function postValidatePhase4b(runDir, state) {
  const beforePath = await resolvePreviousDraftPath(state.task, runDir, 'phase4b');
  const draftPath = await resolveDraftPath(state.task, runDir, 'phase4b');
  const [beforeContent, content] = await Promise.all([
    readRequiredText(beforePath),
    readRequiredText(draftPath),
  ]);
  const expectedDraftPath = await readExpectedOutputDraftPath(runDir, 'phase4b');
  assertValidation(validateRoundProgression({ task: state.task, phaseId: 'phase4b', producedDraftPath: draftPath, expectedDraftPath }), 'phase4b round progression');
  assertValidation(validateDraftCoveragePreservation(beforeContent, content, { allowTopLayerChange: true }), 'phase4b coverage preservation');
  assertValidation(validatePhase4bCategoryLayering(content, buildDesignValidationContext(state.task)), 'phase4b category layering');
  assertValidation(validateXMindMarkHierarchy(content), 'phase4b hierarchy');
  assertValidation(validateExecutableSteps(content), 'phase4b executable steps');
  assertValidation(validateE2EMinimum(content, { featureClassification: 'user_facing' }), 'phase4b e2e minimum');
  state.task.current_phase = 'phase_4b_top_category_draft';
  updateLatestDraftMetadata(state.task, draftPath, 'phase4b');
  state.run.draft_generated_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_4B_COMPLETE');
}

async function postValidatePhase5a(featureId, runDir, state) {
  const reviewNotesPath = join(runDir, 'context', `review_notes_${featureId}.md`);
  const reviewDeltaPath = join(runDir, 'context', `review_delta_${featureId}.md`);
  const beforePath = await resolvePreviousDraftPath(state.task, runDir, 'phase5a');
  const afterPath = await resolveDraftPath(state.task, runDir, 'phase5a');

  await Promise.all([
    readRequiredText(reviewNotesPath),
    readRequiredText(reviewDeltaPath),
    readRequiredText(beforePath),
    readRequiredText(afterPath),
  ]);
  const reviewNotesContent = await readRequiredText(reviewNotesPath);
  const reviewDeltaContent = await readRequiredText(reviewDeltaPath);
  const beforeContent = await readRequiredText(beforePath);
  const afterContent = await readRequiredText(afterPath);
  if (beforeContent === afterContent) {
    throw new Error('phase5a requires the latest draft to differ from the input draft');
  }

  const auditReqs = await listContextAuditRequirements(runDir, featureId);
  const expectedDraftPath = await readExpectedOutputDraftPath(runDir, 'phase5a');
  const roundProgression = validateRoundProgression({ task: state.task, phaseId: 'phase5a', producedDraftPath: afterPath, expectedDraftPath });
  assertValidation(
    validateContextCoverageAudit(reviewNotesContent, auditReqs, {
      requireSupportingAuditSection: normalizeIssueKeys(state.task.supporting_issue_keys).length > 0,
      requireDeepResearchAuditSection: Array.isArray(state.task.deep_research_topics) && state.task.deep_research_topics.length > 0,
    }),
    'phase5a context coverage audit'
  );
  assertValidation(
    validateCoveragePreservationAudit(reviewNotesContent, beforeContent, afterContent),
    'phase5a coverage preservation audit'
  );
  assertValidation(validateSectionReviewChecklist(reviewNotesContent), 'phase5a section review checklist');
  assertValidation(validateReviewDelta(reviewDeltaContent), 'phase5a review delta');
  assertValidation(roundProgression, 'phase5a round progression');
  const requestFulfillment = await loadRequestFulfillment(featureId, runDir);
  assertValidation(
    validatePhase5aAcceptanceGate(reviewNotesContent, reviewDeltaContent, roundProgression.failures, {
      unsatisfiedBlockingRequirements: collectUnsatisfiedBlockingRequirements(requestFulfillment),
    }),
    'phase5a acceptance gate'
  );

  state.task.current_phase = 'phase_5a_review_refactor';
  state.task.return_to_phase = extractReturnToPhase(reviewDeltaContent, ['## Verdict After Refactor', '## Final Disposition']);
  updateLatestDraftMetadata(state.task, afterPath, 'phase5a');
  state.run.review_completed_at = new Date().toISOString();
  await writeArtifactLookup(featureId, runDir);
  await saveState(state);
  console.log('PHASE_5A_COMPLETE');
}

async function postValidatePhase5b(featureId, runDir, state) {
  const draftPath = await resolveDraftPath(state.task, runDir, 'phase5b');
  const checkpointAuditPath = join(runDir, 'context', `checkpoint_audit_${featureId}.md`);
  const checkpointDeltaPath = join(runDir, 'context', `checkpoint_delta_${featureId}.md`);
  const beforePath = await resolvePreviousDraftPath(state.task, runDir, 'phase5b');
  const [checkpointAuditContent, checkpointDeltaContent, beforeContent, afterContent] = await Promise.all([
    readRequiredText(checkpointAuditPath),
    readRequiredText(checkpointDeltaPath),
    readRequiredText(beforePath),
    readRequiredText(draftPath),
  ]);
  if (beforeContent === afterContent) {
    throw new Error('phase5b requires the latest draft to differ from the input draft');
  }

  const expectedDraftPath = await readExpectedOutputDraftPath(runDir, 'phase5b');
  assertValidation(validateRoundProgression({ task: state.task, phaseId: 'phase5b', producedDraftPath: draftPath, expectedDraftPath }), 'phase5b round progression');
  assertValidation(validateDraftCoveragePreservation(beforeContent, afterContent), 'phase5b reviewed coverage preservation');
  assertValidation(validateCheckpointAudit(checkpointAuditContent), 'phase5b checkpoint audit');
  assertValidation(validateCheckpointDelta(checkpointDeltaContent), 'phase5b checkpoint delta');
  const requestFulfillment = await loadRequestFulfillment(featureId, runDir);
  const unsatisfiedBlockingRequirements = collectUnsatisfiedBlockingRequirements(requestFulfillment);
  if (unsatisfiedBlockingRequirements.length > 0) {
    throw new Error(`phase5b cannot recommend shipment while blocking request requirements remain unsatisfied: ${unsatisfiedBlockingRequirements.join(', ')}`);
  }

  state.task.current_phase = 'phase_5b_checkpoint_refactor';
  state.task.return_to_phase = extractReturnToPhase(checkpointDeltaContent, ['## Final Disposition']);
  updateLatestDraftMetadata(state.task, draftPath, 'phase5b');
  state.run.review_completed_at = new Date().toISOString();
  await writeArtifactLookup(featureId, runDir);
  await saveState(state);
  console.log('PHASE_5B_COMPLETE');
}

async function postValidatePhase6(runDir, state) {
  const draftPath = await resolveDraftPath(state.task, runDir, 'phase6');
  const qualityDeltaPath = join(runDir, 'context', `quality_delta_${state.task.feature_id}.md`);
  const beforePath = await resolvePreviousDraftPath(state.task, runDir, 'phase6');
  const beforeContent = await readRequiredText(beforePath);
  const draftContent = await readRequiredText(draftPath);
  const qualityDeltaContent = await readRequiredText(qualityDeltaPath);

  const expectedDraftPath = await readExpectedOutputDraftPath(runDir, 'phase6');
  assertValidation(validateRoundProgression({ task: state.task, phaseId: 'phase6', producedDraftPath: draftPath, expectedDraftPath }), 'phase6 round progression');
  assertValidation(validateDraftCoveragePreservation(beforeContent, draftContent), 'phase6 reviewed coverage preservation');
  assertValidation(validateFinalLayering(draftContent), 'phase6 final layering');
  assertValidation(validateExecutableSteps(draftContent), 'phase6 executable steps');
  assertValidation(validateXMindMarkHierarchy(draftContent), 'phase6 hierarchy');
  assertValidation(validateE2EMinimum(draftContent, { featureClassification: 'user_facing' }), 'phase6 e2e minimum');
  assertValidation(validateQualityDelta(qualityDeltaContent, {
    deep_research_topics: Array.isArray(state.task.deep_research_topics) ? state.task.deep_research_topics : [],
    hasSupportingContext: normalizeIssueKeys(state.task.supporting_issue_keys).length > 0,
  }), 'phase6 quality delta');

  state.task.current_phase = 'phase_6_quality_refactor';
  state.task.return_to_phase = extractReturnToPhase(qualityDeltaContent, ['## Verdict']);
  updateLatestDraftMetadata(state.task, draftPath, 'phase6');
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

async function selectPromotionSource(runDir, task = null) {
  const taskDraftPath = normalizeDraftPath(runDir, task?.latest_draft_path);
  if (taskDraftPath && await fileExists(taskDraftPath)) {
    return taskDraftPath;
  }

  const phases = ['phase6', 'phase5b', 'phase5a', 'phase4b', 'phase4a'];
  for (const phaseId of phases) {
    const latestPhaseDraft = await findLatestPhaseDraftPath(runDir, phaseId);
    if (latestPhaseDraft) return latestPhaseDraft;
  }

  const legacyCandidates = ['qa_plan_v3.md', 'qa_plan_v2.md', 'qa_plan_v1.md']
    .map((name) => join(runDir, 'drafts', name));
  for (const candidate of legacyCandidates) {
    if (await fileExists(candidate)) return candidate;
  }
  throw new Error('No draft artifact available for promotion.');
}

async function resolveDraftPath(task, runDir, phaseId) {
  const latestPhaseDraft = await findLatestPhaseDraftPath(runDir, phaseId);
  if (latestPhaseDraft) return latestPhaseDraft;

  const taskDraftPath = task?.latest_draft_phase === phaseId
    ? normalizeDraftPath(runDir, task.latest_draft_path)
    : '';
  if (taskDraftPath && await fileExists(taskDraftPath)) {
    return taskDraftPath;
  }

  const round = getNextPhaseRound(task, phaseId) > 1 ? getNextPhaseRound(task, phaseId) - 1 : 1;
  return join(runDir, 'drafts', `qa_plan_${phaseId}_r${round}.md`);
}

async function resolvePreviousDraftPath(task, runDir, phaseId) {
  if (String(task?.return_to_phase || '').trim().toLowerCase() === phaseId) {
    const taskDraftPath = normalizeDraftPath(runDir, task.latest_draft_path);
    if (taskDraftPath && await fileExists(taskDraftPath)) {
      return taskDraftPath;
    }
  }

  const previousMap = {
    phase4b: 'phase4a',
    phase5a: 'phase4b',
    phase5b: 'phase5a',
    phase6: 'phase5b',
  };
  const previousPhase = previousMap[phaseId];
  if (!previousPhase) {
    throw new Error(`No previous draft mapping configured for ${phaseId}`);
  }

  const latestPhaseDraft = await findLatestPhaseDraftPath(runDir, previousPhase);
  if (latestPhaseDraft) return latestPhaseDraft;

  if (task?.latest_draft_phase === previousPhase) {
    const taskDraftPath = normalizeDraftPath(runDir, task.latest_draft_path);
    if (taskDraftPath && await fileExists(taskDraftPath)) {
      return taskDraftPath;
    }
  }

  const round = Number(task?.[`${previousPhase}_round`] || 1);
  return join(runDir, 'drafts', `qa_plan_${previousPhase}_r${round}.md`);
}

function normalizeDraftPath(runDir, draftPath) {
  const normalized = String(draftPath || '').trim();
  if (!normalized) return '';
  return normalized.startsWith(runDir) ? normalized : join(runDir, normalized);
}

async function findLatestPhaseDraftPath(runDir, phaseId) {
  const draftsDir = join(runDir, 'drafts');
  const entries = await readdir(draftsDir).catch(() => []);
  const prefix = `qa_plan_${phaseId}_r`;
  const rounds = entries
    .map((name) => {
      const match = name.match(new RegExp(`^${prefix}(\\d+)\\.md$`));
      return match ? { round: Number(match[1]), path: join(draftsDir, name) } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.round - left.round);
  return rounds[0]?.path || '';
}

const PHASE5A_AUDIT_EXCLUDED_PREFIXES = [
  'runtime_setup_',
  'review_notes_',
  'review_delta_',
  'checkpoint_audit_',
  'checkpoint_delta_',
  'quality_delta_',
  'finalization_record_',
];

async function listContextAuditRequirements(runDir, featureId) {
  const contextDir = join(runDir, 'context');
  const entries = await readdir(contextDir).catch(() => []);
  const required = [];
  for (const name of entries) {
    if (!name.endsWith('.md')) continue;
    if (PHASE5A_AUDIT_EXCLUDED_PREFIXES.some((p) => name.startsWith(p))) continue;
    const filePath = join(contextDir, name);
    const content = await readFile(filePath, 'utf8').catch(() => '');
    const sections = content.match(/^##\s+.+$/gm) || [];
    const relPath = `context/${name}`;
    if (sections.length === 0) {
      required.push(`${relPath}::(document)`);
    } else {
      for (const h of sections) {
        required.push(`${relPath}::${h.trim()}`);
      }
    }
  }
  return required;
}

function extractReturnToPhase(content, headings = []) {
  const disposition = extractDisposition(content, headings);
  const match = disposition.match(/^return\s+(phase5a|phase5b)$/i);
  return match ? match[1].toLowerCase() : null;
}

function extractDisposition(content, headings = []) {
  for (const heading of headings) {
    const section = extractSection(content, heading);
    if (!section) continue;
    const match = section.match(/^- (accept|return phase5a|return phase5b)\s*$/im);
    if (match) {
      return match[1].toLowerCase();
    }
  }
  return '';
}

function extractSection(content, heading) {
  const text = String(content || '').replace(/\r\n/g, '\n');
  const start = text.indexOf(`${heading}\n`);
  if (start === -1) return '';
  const rest = text.slice(start + heading.length + 1);
  const nextHeadingOffset = rest.search(/\n##\s+/);
  if (nextHeadingOffset === -1) return rest.trim();
  return rest.slice(0, nextHeadingOffset).trim();
}

async function readExpectedOutputDraftPath(runDir, phaseId) {
  const manifestPath = join(runDir, `${phaseId}_spawn_manifest.json`);
  if (!(await fileExists(manifestPath))) {
    return '';
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const outputPath = String(manifest?.requests?.[0]?.source?.output_draft_path || '').trim();
  if (!outputPath) return '';
  return outputPath.startsWith(runDir) ? outputPath : join(runDir, outputPath);
}

async function writePhase0RequestArtifacts(featureId, runDir, task, run) {
  const contextDir = join(runDir, 'context');
  const requestPath = join(contextDir, `supporting_issue_request_${featureId}.md`);
  const fulfillmentJsonPath = join(contextDir, `request_fulfillment_${featureId}.json`);
  const fulfillmentMdPath = join(contextDir, `request_fulfillment_${featureId}.md`);
  const existingFulfillment = (await fileExists(fulfillmentJsonPath))
    ? JSON.parse(await readFile(fulfillmentJsonPath, 'utf8'))
    : null;
  const fulfillment = mergeRequestFulfillment(
    buildRequestFulfillmentModel(task, featureId),
    existingFulfillment,
  );
  run.request_fulfillment_generated_at = new Date().toISOString();
  run.unsatisfied_request_requirements = fulfillment.requirements
    .filter((requirement) => requirement.blocking_on_missing)
    .filter((requirement) => !isResolvedRequestStatus(requirement.status))
    .map((requirement) => requirement.requirement_id);
  await writeFile(requestPath, renderSupportingIssueRequest(task, featureId), 'utf8');
  await writeJson(fulfillmentJsonPath, fulfillment);
  await writeFile(fulfillmentMdPath, renderRequestFulfillmentMarkdown(fulfillment), 'utf8');
}

function assertSupportOnlyMode(task) {
  const hasSupportIssues = normalizeIssueKeys(task.supporting_issue_keys).length > 0;
  if (!hasSupportIssues) return;
  if (String(task.supporting_issue_policy || '').trim() !== 'context_only_no_defect_analysis' || task.defect_analysis_mode === true) {
    throw new Error('support-only issue context cannot be combined with defect-analysis mode');
  }
}

function renderSupportingIssueRequest(task, featureId) {
  const supportKeys = normalizeIssueKeys(task.supporting_issue_keys);
  return `# Supporting Issue Request — ${featureId}

- primary_feature_id: ${task.primary_feature_id || featureId}
- seed_confluence_url: ${task.seed_confluence_url || 'none'}
- supporting_issue_keys: ${supportKeys.join(', ') || 'none'}
- support issue policy: ${task.supporting_issue_policy}
- deep research policy: ${task.deep_research_policy}
- deep research topics: ${(task.deep_research_topics || []).join(', ') || 'none'}
`;
}

function renderRequestFulfillmentMarkdown(document) {
  const rows = document.requirements.map((requirement) => {
    return `| ${requirement.requirement_id} | ${requirement.required_phase} | ${requirement.status} | \`${(requirement.required_artifacts || []).join(', ')}\` | \`${(requirement.evidence_artifacts || []).join(', ')}\` | ${requirement.blocker_or_waiver_reason || '—'} |`;
  }).join('\n');
  return `# Request Fulfillment — ${document.feature_id}

| Requirement ID | Phase | Status | Required Artifacts | Evidence Artifacts | Blocker / Waiver |
|---|---|---|---|---|---|
${rows}
`;
}

async function validateSupportingContextArtifacts(task, runDir) {
  const failures = [];
  const executionLog = [];
  const featureId = task.feature_id;
  const supportKeys = normalizeIssueKeys(task.supporting_issue_keys);
  if (supportKeys.length === 0) {
    return { failures, executionLog, generated: false };
  }
  const requiredArtifacts = [
    join(runDir, 'context', `supporting_issue_relation_map_${featureId}.md`),
    join(runDir, 'context', `supporting_issue_summary_${featureId}.md`),
    ...supportKeys.map((issueKey) => join(runDir, 'context', `supporting_issue_summary_${issueKey}_${featureId}.md`)),
  ];
  for (const artifactPath of requiredArtifacts) {
    if (!(await fileExists(artifactPath))) {
      failures.push(`Missing required supporting context artifact: ${artifactPath}`);
    }
  }
  const contextFiles = await readdir(join(runDir, 'context')).catch(() => []);
  const defectArtifacts = contextFiles.filter((name) => name.toLowerCase().includes('defect_analysis'));
  if (defectArtifacts.length > 0) {
    failures.push(`Supporting issues must not produce defect-analysis artifacts: ${defectArtifacts.join(', ')}`);
  }
  if (failures.length === 0) {
    executionLog.push({
      phase: 'phase1',
      requirement_family: 'supporting_context',
      status: 'satisfied',
      artifacts: requiredArtifacts.map((artifactPath) => artifactPath.replace(`${runDir}/`, '')),
    });
  }
  return { failures, executionLog, generated: failures.length === 0 };
}

async function validateDeepResearchArtifacts(featureId, runDir, task) {
  const failures = [];
  const executionLog = [];
  let fallbackUsed = false;
  const topics = Array.isArray(task.deep_research_topics) && task.deep_research_topics.length > 0
    ? task.deep_research_topics
    : [];
  if (topics.length === 0) {
    return { ok: true, failures, executionLog, fallbackUsed };
  }
  const planPath = join(runDir, 'context', `deep_research_plan_${featureId}.md`);
  if (!(await fileExists(planPath))) {
    failures.push(`Deep research plan is missing: ${planPath}`);
  }
  const executionPath = join(runDir, 'context', `deep_research_execution_${featureId}.json`);
  if (!(await fileExists(executionPath))) {
    failures.push(`Deep research execution log is missing: ${executionPath}`);
    return { ok: failures.length === 0, failures, executionLog, fallbackUsed };
  }
  const executionDocument = JSON.parse(await readFile(executionPath, 'utf8'));
  const steps = Array.isArray(executionDocument.steps) ? executionDocument.steps : [];
  for (const topic of topics) {
    const tavilyPath = join(runDir, 'context', researchArtifactFilename('tavily', topic, featureId));
    const confluencePath = join(runDir, 'context', researchArtifactFilename('confluence', topic, featureId));
    const topicSteps = steps
      .filter((step) => String(step.topic_slug || '').trim() === topic)
      .sort((left, right) => Number(left.step || 0) - Number(right.step || 0));
    const tavilyStep = topicSteps.find((step) => String(step.tool || '').trim().toLowerCase() === 'tavily-search');
    const confluenceStep = topicSteps.find((step) => String(step.tool || '').trim().toLowerCase() === 'confluence');
    if (!(await fileExists(tavilyPath))) {
      failures.push(`Tavily-first artifact is missing for ${topic}: ${tavilyPath}`);
      continue;
    }
    if (!tavilyStep) {
      failures.push(`Deep research execution log is missing Tavily step for ${topic}.`);
    } else {
      executionLog.push({
        phase: 'phase3',
        topic_slug: topic,
        tool: 'tavily-search',
        status: tavilyStep.status || 'satisfied',
        artifacts: Array.isArray(tavilyStep.artifacts) ? tavilyStep.artifacts : [tavilyPath.replace(`${runDir}/`, '')],
        step: tavilyStep.step,
      });
    }
    if (await fileExists(confluencePath)) {
      fallbackUsed = true;
      const tavilyContent = await readRequiredText(tavilyPath);
      const hasInsufficiencyMarker = /INSUFFICIENT_TAVILY_EVIDENCE/i.test(tavilyContent);
      const lowReferenceCount = /credible_reference_count:\s*([0-2])\b/i.test(tavilyContent);
      const missingCheckpointEvidence = /missing_checkpoints:\s*(?!none\b).+/i.test(tavilyContent);
      if (!confluenceStep) {
        failures.push(`Deep research execution log is missing Confluence fallback step for ${topic}.`);
      } else if (!tavilyStep || Number(confluenceStep.step || 0) <= Number(tavilyStep.step || 0)) {
        failures.push(`Deep research execution order is invalid for ${topic}: Tavily must be recorded before Confluence fallback.`);
      }
      if (!hasInsufficiencyMarker) {
        failures.push(`Confluence fallback for ${topic} requires insufficiency to be recorded in the Tavily artifact first.`);
      }
      if (!lowReferenceCount && !missingCheckpointEvidence) {
        failures.push(`Confluence fallback for ${topic} requires machine-checkable Tavily insufficiency evidence.`);
      }
      executionLog.push({
        phase: 'phase3',
        topic_slug: topic,
        tool: 'confluence',
        status: confluenceStep?.status || 'satisfied',
        artifacts: Array.isArray(confluenceStep?.artifacts) ? confluenceStep.artifacts : [confluencePath.replace(`${runDir}/`, '')],
        step: confluenceStep?.step,
      });
    }
  }
  const synthesisPath = join(runDir, 'context', `deep_research_synthesis_report_editor_${featureId}.md`);
  if (!(await fileExists(synthesisPath))) {
    failures.push(`Deep research synthesis is missing: ${synthesisPath}`);
  }
  return { ok: failures.length === 0, failures, executionLog, fallbackUsed };
}

function buildDesignValidationContext(task) {
  return {
    requireSupportTrace: normalizeIssueKeys(task.supporting_issue_keys).length > 0,
    requireResearchTrace: Array.isArray(task.deep_research_topics) && task.deep_research_topics.length > 0,
    requireTraceability: normalizeIssueKeys(task.supporting_issue_keys).length > 0
      || Array.isArray(task.deep_research_topics) && task.deep_research_topics.length > 0,
    requiredTopics: Array.isArray(task.deep_research_topics) ? task.deep_research_topics : [],
  };
}

async function loadRequestFulfillment(featureId, runDir) {
  const jsonPath = join(runDir, 'context', `request_fulfillment_${featureId}.json`);
  if (!(await fileExists(jsonPath))) return null;
  return JSON.parse(await readFile(jsonPath, 'utf8'));
}

function collectUnsatisfiedBlockingRequirements(document) {
  const requirements = Array.isArray(document?.requirements) ? document.requirements : [];
  return requirements
    .filter((requirement) => requirement.blocking_on_missing)
    .filter((requirement) => !isResolvedRequestStatus(requirement.status))
    .map((requirement) => requirement.requirement_id);
}

async function updateRequestFulfillmentForPhase(state, phaseId, executionLog = []) {
  const featureId = state.task.feature_id;
  const runDir = dirname(state.taskPath);
  const jsonPath = join(runDir, 'context', `request_fulfillment_${featureId}.json`);
  const markdownPath = join(runDir, 'context', `request_fulfillment_${featureId}.md`);
  const document = (await fileExists(jsonPath))
    ? JSON.parse(await readFile(jsonPath, 'utf8'))
    : buildRequestFulfillmentModel(state.task, featureId);
  const requirements = Array.isArray(document.requirements) ? document.requirements : [];
  for (const requirement of requirements) {
    if (String(requirement.required_phase || '').trim().toLowerCase() !== phaseId) continue;
    const requiredArtifacts = Array.isArray(requirement.required_artifacts) ? requirement.required_artifacts : [];
    const evidenceArtifacts = [];
    for (const artifactPath of requiredArtifacts) {
      if (await fileExists(join(runDir, artifactPath))) {
        evidenceArtifacts.push(artifactPath);
      }
    }
    if (evidenceArtifacts.length === requiredArtifacts.length) {
      requirement.status = 'satisfied';
      requirement.evidence_artifacts = evidenceArtifacts;
      requirement.blocker_or_waiver_reason = '';
    }
  }
  document.generated_at = new Date().toISOString();
  state.run.request_execution_log = mergeExecutionLog(state.run.request_execution_log, executionLog);
  state.run.request_fulfillment_generated_at = document.generated_at;
  state.run.unsatisfied_request_requirements = requirements
    .filter((requirement) => requirement.blocking_on_missing)
    .filter((requirement) => !isResolvedRequestStatus(requirement.status))
    .map((requirement) => requirement.requirement_id);
  await writeJson(jsonPath, document);
  await writeFile(markdownPath, renderRequestFulfillmentMarkdown(document), 'utf8');
}

function mergeExecutionLog(existing, additions) {
  const current = Array.isArray(existing) ? [...existing] : [];
  for (const addition of additions) {
    const fingerprint = JSON.stringify(addition);
    if (!current.some((entry) => JSON.stringify(entry) === fingerprint)) {
      current.push(addition);
    }
  }
  return current;
}

function mergeRequestFulfillment(nextDocument, existingDocument) {
  if (!existingDocument || !Array.isArray(existingDocument.requirements)) {
    return nextDocument;
  }
  const priorById = new Map(
    existingDocument.requirements.map((requirement) => [String(requirement.requirement_id || '').trim(), requirement])
  );
  nextDocument.requirements = nextDocument.requirements.map((requirement) => {
    const previous = priorById.get(String(requirement.requirement_id || '').trim());
    if (!previous) return requirement;
    return {
      ...requirement,
      status: previous.status || requirement.status,
      evidence_artifacts: Array.isArray(previous.evidence_artifacts) ? previous.evidence_artifacts : requirement.evidence_artifacts,
      blocker_or_waiver_reason: previous.blocker_or_waiver_reason || requirement.blocker_or_waiver_reason,
    };
  });
  return nextDocument;
}

async function assertRequestFulfillmentReady(featureId, runDir, run) {
  const jsonPath = join(runDir, 'context', `request_fulfillment_${featureId}.json`);
  if (!(await fileExists(jsonPath))) {
    throw new Error(`Missing request fulfillment artifact: ${jsonPath}`);
  }
  const document = JSON.parse(await readFile(jsonPath, 'utf8'));
  const requirements = Array.isArray(document.requirements) ? document.requirements : [];
  for (const requirement of requirements) {
    if (String(requirement.status || '').trim().toLowerCase() !== 'satisfied') continue;
    const artifacts = Array.isArray(requirement.evidence_artifacts)
      ? requirement.evidence_artifacts
      : Array.isArray(requirement.required_artifacts)
        ? requirement.required_artifacts
        : [];
    for (const artifactPath of artifacts) {
      const absPath = join(runDir, String(artifactPath || '').trim());
      if (artifactPath && !(await fileExists(absPath))) {
        throw new Error(
          `Required artifact no longer exists (deleted or moved): ${artifactPath}. ` +
          `Cannot finalize without evidence for requirement ${requirement.requirement_id || 'unknown'}.`
        );
      }
    }
  }
  const unsatisfiedBlockingRequirements = collectUnsatisfiedBlockingRequirements(document);
  if (unsatisfiedBlockingRequirements.length > 0) {
    throw new Error(`Cannot finalize with unsatisfied blocking request requirements: ${unsatisfiedBlockingRequirements.join(', ')}`);
  }
  const validation = validateRequestFulfillmentStatus(document);
  if (!validation.ok) {
    throw new Error(validation.failures.join('; '));
  }
}

function isResolvedRequestStatus(status) {
  return ['satisfied', 'blocked_with_reason', 'explicitly_waived_by_user'].includes(
    String(status || '').trim().toLowerCase()
  );
}

async function buildFinalizationLineage(featureId, runDir) {
  const supportSummary = join(runDir, 'context', `supporting_issue_summary_${featureId}.md`);
  const researchSynthesis = join(runDir, 'context', `deep_research_synthesis_report_editor_${featureId}.md`);
  return {
    supporting: (await fileExists(supportSummary)) ? `- \`context/supporting_issue_summary_${featureId}.md\`` : '- none',
    research: (await fileExists(researchSynthesis)) ? `- \`context/deep_research_synthesis_report_editor_${featureId}.md\`` : '- none',
  };
}

function researchArtifactFilename(kind, topic, featureId) {
  if (topic === 'report_editor_workstation_functionality') {
    return `deep_research_${kind}_report_editor_workstation_${featureId}.md`;
  }
  if (topic === 'report_editor_library_vs_workstation_gap') {
    return `deep_research_${kind}_library_vs_workstation_gap_${featureId}.md`;
  }
  return `deep_research_${kind}_${topic}_${featureId}.md`;
}

async function maybeNotifyFeishu(featureId, runDir) {
  const command = String(process.env.FQPO_FEISHU_NOTIFY_CMD || '').trim();
  if (!command) {
    throw new Error(`no Feishu notification command configured for ${featureId} at ${runDir}`);
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
