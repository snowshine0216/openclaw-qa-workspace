#!/usr/bin/env node
/**
 * Artifact-based REPORT_STATE classifier for qa-summary skill.
 * Outputs: FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH
 */

import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';

export function detectReportState(runDir, featureKey = null) {
  const key = featureKey ?? basename(runDir);
  if (existsSync(join(runDir, `${key}_QA_SUMMARY_FINAL.md`))) {
    return 'FINAL_EXISTS';
  }
  if (existsSync(join(runDir, 'drafts', `${key}_QA_SUMMARY_DRAFT.md`))) {
    return 'DRAFT_EXISTS';
  }
  if (
    existsSync(join(runDir, 'context', 'planner_artifact_lookup.json')) ||
    existsSync(join(runDir, 'context', 'feature_overview_table.md')) ||
    existsSync(join(runDir, 'context', 'defect_context_state.json'))
  ) {
    return 'CONTEXT_ONLY';
  }
  return 'FRESH';
}

function main() {
  const runDir = process.argv[2];
  const featureKey = process.argv[3] ?? (runDir ? basename(runDir) : null);
  if (!runDir) {
    console.error('Usage: detectReportState.mjs <run-dir> [feature-key]');
    process.exit(1);
  }
  const state = detectReportState(runDir, featureKey);
  console.log(state);
}

const currentPath = new URL(import.meta.url).pathname;
const executedPath = process.argv[1] ?? '';
if (executedPath && (executedPath === currentPath || executedPath.endsWith('detectReportState.mjs'))) {
  main();
}
