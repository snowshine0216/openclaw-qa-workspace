#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import {
  validateCheckpointAudit,
  validateCheckpointDelta,
  validateContextIndex,
  validateContextCoverageAudit,
  validateCoverageLedger,
  validateE2EMinimum,
  validateExecutableSteps,
  validateFinalLayering,
  validatePhase4aSubcategoryDraft,
  validatePhase4bCategoryLayering,
  validateQualityDelta,
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
  case 'validate_section_review_checklist':
    result = validateSectionReviewChecklist(content);
    break;
  case 'validate_checkpoint_audit':
    result = validateCheckpointAudit(content);
    break;
  case 'validate_checkpoint_delta':
    result = validateCheckpointDelta(content);
    break;
  case 'validate_final_layering':
    result = validateFinalLayering(content);
    break;
  case 'validate_quality_delta':
    result = validateQualityDelta(content);
    break;
  case 'validate_executable_steps':
    result = validateExecutableSteps(content);
    break;
  case 'validate_xmindmark_hierarchy':
    result = validateXMindMarkHierarchy(content);
    break;
  case 'validate_review_delta':
    result = validateReviewDelta(content);
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
