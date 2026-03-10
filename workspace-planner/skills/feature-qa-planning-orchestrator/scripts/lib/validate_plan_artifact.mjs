#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import {
  validateContextIndex,
  validateCoverageLedger,
  validateE2EMinimum,
  validateExecutableSteps,
  validateReviewDelta,
  validateUnresolvedStepHandling,
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
  case 'validate_e2e_minimum':
    result = validateE2EMinimum(content, { featureClassification: rest[0] || 'user_facing' });
    break;
  case 'validate_executable_steps':
    result = validateExecutableSteps(content);
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
