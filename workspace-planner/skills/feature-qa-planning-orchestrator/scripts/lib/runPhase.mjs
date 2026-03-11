#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  classifyReportState,
  fileExists,
  isActiveStatus,
  isPhasePast,
  getNextPhaseRound,
  loadState,
  normalizeRequestedSourceFamilies,
  nowCompactTimestamp,
  saveState,
  updateLatestDraftMetadata,
} from './workflowState.mjs';
import { buildRuntimeSetup } from './runtimeEnv.mjs';
import { evaluateEvidenceCompleteness, evaluateSourceArtifactCompleteness, evaluateSpawnPolicy } from './contextRules.mjs';
import { writeArtifactLookup } from './artifactLookup.mjs';
import {
  validateCoverageLedger,
  validateCheckpointAudit,
  validateCheckpointDelta,
  validateContextCoverageAudit,
  validateE2EMinimum,
  validateExecutableSteps,
  validateFinalLayering,
  validatePhase4aSubcategoryDraft,
  validatePhase4bCategoryLayering,
  validateQualityDelta,
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
    } else if (phaseId === 'phase5a') {
      await runSpawnPhase(featureId, projectDir, 'phase5a', post);
    } else if (phaseId === 'phase5b') {
      await runSpawnPhase(featureId, projectDir, 'phase5b', post);
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
  const sourcePath = await selectPromotionSource(projectDir, state.task);
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
  const rerunRequested = String(state.task.return_to_phase || '').trim().toLowerCase() === phaseId;
  if ((await fileExists(manifestPath)) && isPhasePast(state.task.current_phase, gate) && !rerunRequested) {
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
  } else if (phaseId === 'phase5a') {
    await postValidatePhase5a(featureId, projectDir, state);
  } else if (phaseId === 'phase5b') {
    await postValidatePhase5b(featureId, projectDir, state);
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
  const draftPath = await resolveDraftPath(state.task, projectDir, 'phase4a');
  const content = await readRequiredText(draftPath);
  assertValidation(validatePhase4aSubcategoryDraft(content), 'phase4a subcategory draft');
  assertValidation(validateExecutableSteps(content), 'phase4a draft');
  state.task.current_phase = 'phase_4a_subcategory_draft';
  updateLatestDraftMetadata(state.task, draftPath, 'phase4a');
  state.run.draft_generated_at = new Date().toISOString();
  await writeArtifactLookup(featureId, projectDir);
  await saveState(state);
  console.log('PHASE_4A_COMPLETE');
}

async function postValidatePhase4b(projectDir, state) {
  const draftPath = await resolveDraftPath(state.task, projectDir, 'phase4b');
  const content = await readRequiredText(draftPath);
  assertValidation(validatePhase4bCategoryLayering(content), 'phase4b category layering');
  assertValidation(validateXMindMarkHierarchy(content), 'phase4b hierarchy');
  assertValidation(validateExecutableSteps(content), 'phase4b executable steps');
  assertValidation(validateE2EMinimum(content, { featureClassification: 'user_facing' }), 'phase4b e2e minimum');
  state.task.current_phase = 'phase_4b_top_category_draft';
  updateLatestDraftMetadata(state.task, draftPath, 'phase4b');
  state.run.draft_generated_at = new Date().toISOString();
  await saveState(state);
  console.log('PHASE_4B_COMPLETE');
}

async function postValidatePhase5a(featureId, projectDir, state) {
  const reviewNotesPath = join(projectDir, 'context', `review_notes_${featureId}.md`);
  const reviewDeltaPath = join(projectDir, 'context', `review_delta_${featureId}.md`);
  const beforePath = await resolvePreviousDraftPath(state.task, projectDir, 'phase5a');
  const afterPath = await resolveDraftPath(state.task, projectDir, 'phase5a');

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

  const auditReqs = await listContextAuditRequirements(projectDir, featureId);
  assertValidation(
    validateContextCoverageAudit(reviewNotesContent, auditReqs),
    'phase5a context coverage audit'
  );
  assertValidation(validateSectionReviewChecklist(reviewNotesContent), 'phase5a section review checklist');
  assertValidation(validateReviewDelta(reviewDeltaContent), 'phase5a review delta');

  state.task.current_phase = 'phase_5a_review_refactor';
  state.task.return_to_phase = extractReturnToPhase(reviewDeltaContent, ['## Verdict After Refactor', '## Final Disposition']);
  updateLatestDraftMetadata(state.task, afterPath, 'phase5a');
  state.run.review_completed_at = new Date().toISOString();
  await writeArtifactLookup(featureId, projectDir);
  await saveState(state);
  console.log('PHASE_5A_COMPLETE');
}

async function postValidatePhase5b(featureId, projectDir, state) {
  const draftPath = await resolveDraftPath(state.task, projectDir, 'phase5b');
  const checkpointAuditPath = join(projectDir, 'context', `checkpoint_audit_${featureId}.md`);
  const checkpointDeltaPath = join(projectDir, 'context', `checkpoint_delta_${featureId}.md`);
  const beforePath = await resolvePreviousDraftPath(state.task, projectDir, 'phase5b');
  const [checkpointAuditContent, checkpointDeltaContent, beforeContent, afterContent] = await Promise.all([
    readRequiredText(checkpointAuditPath),
    readRequiredText(checkpointDeltaPath),
    readRequiredText(beforePath),
    readRequiredText(draftPath),
  ]);
  if (beforeContent === afterContent) {
    throw new Error('phase5b requires the latest draft to differ from the input draft');
  }

  assertValidation(validateCheckpointAudit(checkpointAuditContent), 'phase5b checkpoint audit');
  assertValidation(validateCheckpointDelta(checkpointDeltaContent), 'phase5b checkpoint delta');

  state.task.current_phase = 'phase_5b_checkpoint_refactor';
  state.task.return_to_phase = extractReturnToPhase(checkpointDeltaContent, ['## Final Disposition']);
  updateLatestDraftMetadata(state.task, draftPath, 'phase5b');
  state.run.review_completed_at = new Date().toISOString();
  await writeArtifactLookup(featureId, projectDir);
  await saveState(state);
  console.log('PHASE_5B_COMPLETE');
}

async function postValidatePhase6(projectDir, state) {
  const draftPath = await resolveDraftPath(state.task, projectDir, 'phase6');
  const qualityDeltaPath = join(projectDir, 'context', `quality_delta_${state.task.feature_id}.md`);
  const draftContent = await readRequiredText(draftPath);
  const qualityDeltaContent = await readRequiredText(qualityDeltaPath);

  assertValidation(validateFinalLayering(draftContent), 'phase6 final layering');
  assertValidation(validateExecutableSteps(draftContent), 'phase6 executable steps');
  assertValidation(validateXMindMarkHierarchy(draftContent), 'phase6 hierarchy');
  assertValidation(validateE2EMinimum(draftContent, { featureClassification: 'user_facing' }), 'phase6 e2e minimum');
  assertValidation(validateQualityDelta(qualityDeltaContent), 'phase6 quality delta');

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

async function selectPromotionSource(projectDir, task = null) {
  const taskDraftPath = normalizeDraftPath(projectDir, task?.latest_draft_path);
  if (taskDraftPath && await fileExists(taskDraftPath)) {
    return taskDraftPath;
  }

  const phases = ['phase6', 'phase5b', 'phase5a', 'phase4b', 'phase4a'];
  for (const phaseId of phases) {
    const latestPhaseDraft = await findLatestPhaseDraftPath(projectDir, phaseId);
    if (latestPhaseDraft) return latestPhaseDraft;
  }

  const legacyCandidates = ['qa_plan_v3.md', 'qa_plan_v2.md', 'qa_plan_v1.md']
    .map((name) => join(projectDir, 'drafts', name));
  for (const candidate of legacyCandidates) {
    if (await fileExists(candidate)) return candidate;
  }
  throw new Error('No draft artifact available for promotion.');
}

async function resolveDraftPath(task, projectDir, phaseId) {
  const latestPhaseDraft = await findLatestPhaseDraftPath(projectDir, phaseId);
  if (latestPhaseDraft) return latestPhaseDraft;

  const taskDraftPath = task?.latest_draft_phase === phaseId
    ? normalizeDraftPath(projectDir, task.latest_draft_path)
    : '';
  if (taskDraftPath && await fileExists(taskDraftPath)) {
    return taskDraftPath;
  }

  const round = getNextPhaseRound(task, phaseId) > 1 ? getNextPhaseRound(task, phaseId) - 1 : 1;
  return join(projectDir, 'drafts', `qa_plan_${phaseId}_r${round}.md`);
}

async function resolvePreviousDraftPath(task, projectDir, phaseId) {
  if (String(task?.return_to_phase || '').trim().toLowerCase() === phaseId) {
    const taskDraftPath = normalizeDraftPath(projectDir, task.latest_draft_path);
    if (taskDraftPath && await fileExists(taskDraftPath)) {
      return taskDraftPath;
    }
  }

  const previousMap = {
    phase5a: 'phase4b',
    phase5b: 'phase5a',
    phase6: 'phase5b',
  };
  const previousPhase = previousMap[phaseId];
  if (!previousPhase) {
    throw new Error(`No previous draft mapping configured for ${phaseId}`);
  }

  const latestPhaseDraft = await findLatestPhaseDraftPath(projectDir, previousPhase);
  if (latestPhaseDraft) return latestPhaseDraft;

  if (task?.latest_draft_phase === previousPhase) {
    const taskDraftPath = normalizeDraftPath(projectDir, task.latest_draft_path);
    if (taskDraftPath && await fileExists(taskDraftPath)) {
      return taskDraftPath;
    }
  }

  const round = Number(task?.[`${previousPhase}_round`] || 1);
  return join(projectDir, 'drafts', `qa_plan_${previousPhase}_r${round}.md`);
}

function normalizeDraftPath(projectDir, draftPath) {
  const normalized = String(draftPath || '').trim();
  if (!normalized) return '';
  return normalized.startsWith(projectDir) ? normalized : join(projectDir, normalized);
}

async function findLatestPhaseDraftPath(projectDir, phaseId) {
  const draftsDir = join(projectDir, 'drafts');
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

async function listContextAuditRequirements(projectDir, featureId) {
  const contextDir = join(projectDir, 'context');
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
