#!/usr/bin/env node
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isExplicitRefreshMode } from './refresh_modes.mjs';

async function exists(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function getFeatureSummaryRecoveryPlan({ runDir, selectedAction }) {
  const featureSummaryPath = join(runDir, 'context', 'feature_summary.json');
  if (await exists(featureSummaryPath)) {
    return {
      status: 'ready',
      feature_summary_path: featureSummaryPath,
    };
  }

  const hasDefectSource =
    (await exists(join(runDir, 'context', 'defect_index.json'))) ||
    (await exists(join(runDir, 'context', 'jira_raw.json')));
  const hasPrSummary = await exists(join(runDir, 'context', 'pr_impact_summary.json'));

  if (hasDefectSource && hasPrSummary) {
    return {
      status: 'synthesize',
      feature_summary_path: featureSummaryPath,
    };
  }

  if (isExplicitRefreshMode(selectedAction)) {
    return {
      status: 'error',
      reason: 'missing structured summary inputs after explicit refresh',
      has_defect_source: hasDefectSource,
      has_pr_summary: hasPrSummary,
      feature_summary_path: featureSummaryPath,
    };
  }

  return {
    status: 'refresh',
    reason: 'missing structured summary inputs for reused canonical run',
    refresh_mode: 'smart_refresh',
    has_defect_source: hasDefectSource,
    has_pr_summary: hasPrSummary,
    feature_summary_path: featureSummaryPath,
  };
}

async function main() {
  const [runDir, selectedAction = ''] = process.argv.slice(2);
  if (!runDir) {
    console.error('Usage: feature_summary_recovery_plan.mjs <run-dir> [selected-action]');
    process.exit(1);
  }
  const plan = await getFeatureSummaryRecoveryPlan({ runDir, selectedAction });
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
