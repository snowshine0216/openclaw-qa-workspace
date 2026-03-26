#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import {
  validateRequestFulfillmentManifest,
  validateRequestFulfillmentStatus,
  validateResearchOrder,
  validateSupportingContextIntegrity,
} from './contextRules.mjs';
import {
  validateCoveragePreservationAudit,
  validateCheckpointAudit,
  validateCheckpointDelta,
  validateContextIndex,
  validateContextCoverageAudit,
  validateCoverageLedger,
  validateDraftCoveragePreservation,
  validateE2EMinimum,
  validateExecutableSteps,
  validateFinalLayering,
  validatePhase5aAcceptanceGate,
  validatePhase4aSubcategoryDraft,
  validatePhase4bCategoryLayering,
  validateQualityDelta,
  validateRoundProgression,
  validateScenarioGranularity,
  validateSectionReviewChecklist,
  validateReviewDelta,
  validateUnresolvedStepHandling,
  validateXMindMarkHierarchy,
} from './qaPlanValidators.mjs';

const [, , validatorName, filePath, ...rest] = process.argv;

if (!validatorName || !filePath) {
  console.error('Usage: validate_plan_artifact.mjs <validator> <file-path> [args...]');
  process.exit(1);
}

const content = await readFile(filePath, 'utf8');
let result;
const parsed = filePath.endsWith('.json') ? JSON.parse(content) : null;

switch (validatorName) {
  case 'validate_context_index':
    result = validateContextIndex(content);
    break;
  case 'validate_coverage_ledger':
    result = validateCoverageLedger(content, rest);
    break;
  case 'validate_scenario_granularity': {
    const coverageLedgerPath = rest[0];
    const draftPath = rest[1];
    if (!coverageLedgerPath || !draftPath) {
      console.error('validate_scenario_granularity requires <coverage-ledger-path> <draft-file-path> [review-rewrite-requests-path] [review-delta-path]');
      process.exit(1);
    }
    const coverageLedgerContent = await readFile(coverageLedgerPath, 'utf8');
    const draftContent = await readFile(draftPath, 'utf8');
    const reviewRewriteRequestsContent = rest[2] ? await readFile(rest[2], 'utf8') : '';
    const reviewDeltaContent = rest[3] ? await readFile(rest[3], 'utf8') : '';
    result = validateScenarioGranularity(
      content,
      coverageLedgerContent,
      draftContent,
      reviewRewriteRequestsContent,
      reviewDeltaContent
    );
    break;
  }
  case 'validate_e2e_minimum':
    result = validateE2EMinimum(content, { featureClassification: rest[0] || 'user_facing' });
    break;
  case 'validate_phase4a_subcategory_draft':
    result = validatePhase4aSubcategoryDraft(content);
    break;
  case 'validate_phase4b_category_layering':
    result = validatePhase4bCategoryLayering(content);
    break;
  case 'validate_context_coverage_audit':
    result = validateContextCoverageAudit(content, rest);
    break;
  case 'validate_coverage_preservation_audit': {
    const beforeDraftPath = rest[0];
    const afterDraftPath = rest[1];
    if (!beforeDraftPath || !afterDraftPath) {
      console.error('validate_coverage_preservation_audit requires <before-draft-path> <after-draft-path>');
      process.exit(1);
    }
    const beforeDraftContent = await readFile(beforeDraftPath, 'utf8');
    const afterDraftContent = await readFile(afterDraftPath, 'utf8');
    result = validateCoveragePreservationAudit(content, beforeDraftContent, afterDraftContent);
    break;
  }
  case 'validate_section_review_checklist':
    result = validateSectionReviewChecklist(content);
    break;
  case 'validate_phase5a_acceptance_gate': {
    const reviewNotesPath = rest[0];
    const roundIntegrityFailures = rest.slice(1);
    if (!reviewNotesPath) {
      console.error('validate_phase5a_acceptance_gate requires <review-notes-path> [round-integrity-failure...]');
      process.exit(1);
    }
    const reviewNotesContent = await readFile(reviewNotesPath, 'utf8');
    result = validatePhase5aAcceptanceGate(reviewNotesContent, content, roundIntegrityFailures);
    break;
  }
  case 'validate_checkpoint_audit':
    result = validateCheckpointAudit(content);
    break;
  case 'validate_checkpoint_delta':
    result = validateCheckpointDelta(content);
    break;
  case 'validate_final_layering':
    result = validateFinalLayering(content);
    break;
  case 'validate_draft_coverage_preservation': {
    const afterDraftPath = rest[0];
    if (!afterDraftPath) {
      console.error('validate_draft_coverage_preservation requires <after-draft-path>');
      process.exit(1);
    }
    const afterDraftContent = await readFile(afterDraftPath, 'utf8');
    result = validateDraftCoveragePreservation(content, afterDraftContent);
    break;
  }
  case 'validate_quality_delta':
    result = validateQualityDelta(content);
    break;
  case 'validate_round_progression': {
    const phaseId = rest[0];
    const taskJsonPath = rest[1];
    if (!phaseId || !taskJsonPath) {
      console.error('validate_round_progression requires <phase-id> <task-json-path>');
      process.exit(1);
    }
    const task = JSON.parse(await readFile(taskJsonPath, 'utf8'));
    result = validateRoundProgression({ task, phaseId, producedDraftPath: filePath });
    break;
  }
  case 'validate_executable_steps':
    result = validateExecutableSteps(content);
    break;
  case 'validate_xmindmark_hierarchy':
    result = validateXMindMarkHierarchy(content);
    break;
  case 'validate_review_delta':
    result = validateReviewDelta(content);
    break;
  case 'validate_supporting_context_integrity':
    result = validateSupportingContextIntegrity(parsed || {});
    break;
  case 'validate_request_fulfillment_manifest':
    result = validateRequestFulfillmentManifest(parsed || {});
    break;
  case 'validate_request_fulfillment_status':
    result = validateRequestFulfillmentStatus(parsed || {});
    break;
  case 'validate_research_order':
    result = validateResearchOrder(parsed || {});
    break;
  case 'validate_unresolved_step_handling': {
    const reviewPath = rest[0];
    if (!reviewPath) {
      console.error('validate_unresolved_step_handling requires <review-file-path>');
      process.exit(1);
    }
    const reviewContent = await readFile(reviewPath, 'utf8');
    result = validateUnresolvedStepHandling(reviewContent, content, rest.slice(1));
    break;
  }
  default:
    console.error(`Unknown validator: ${validatorName}`);
    process.exit(1);
}

if (!result.ok) {
  for (const failure of result.failures) {
    console.error(`VALIDATION_FAILED: ${failure}`);
  }
  process.exit(1);
}

console.log(`VALIDATION_OK: ${validatorName}`);
