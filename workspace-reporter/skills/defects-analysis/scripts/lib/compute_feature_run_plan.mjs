#!/usr/bin/env node
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { selectReleaseChildAction } from './refresh_modes.mjs';

async function exists(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function detectReportState(runsRoot, featureKey) {
  const featureRunDir = join(runsRoot, featureKey);
  if (await exists(join(featureRunDir, `${featureKey}_REPORT_FINAL.md`))) {
    return 'FINAL_EXISTS';
  }
  if (await exists(join(featureRunDir, `${featureKey}_REPORT_DRAFT.md`))) {
    return 'DRAFT_EXISTS';
  }
  if (await exists(join(featureRunDir, 'context', 'jira_raw.json'))) {
    return 'CONTEXT_ONLY';
  }
  return 'FRESH';
}

function defaultActionForState(state) {
  switch (state) {
    case 'FINAL_EXISTS':
      return 'use_existing';
    case 'DRAFT_EXISTS':
      return 'resume';
    case 'CONTEXT_ONLY':
      return 'generate_from_cache';
    default:
      return 'proceed';
  }
}

export async function computeFeatureRunPlan({ featureKeys, runsRoot, releaseRunDir, explicitMode = '' }) {
  const features = [];
  for (const featureKey of featureKeys) {
    const reportState = await detectReportState(runsRoot, featureKey);
    const defaultAction = defaultActionForState(reportState);
    features.push({
      feature_key: featureKey,
      report_state: reportState,
      default_action: defaultAction,
      selected_action: selectReleaseChildAction(defaultAction, explicitMode),
      canonical_run_dir: join(runsRoot, featureKey),
      release_packet_dir: join(releaseRunDir, 'features', featureKey),
    });
  }
  return { features };
}

async function main() {
  const [featureKeysJson, runsRoot, releaseRunDir, explicitMode = ''] = process.argv.slice(2);
  if (!featureKeysJson || !runsRoot || !releaseRunDir) {
    console.error('Usage: compute_feature_run_plan.mjs <feature-keys-json> <runs-root> <release-run-dir>');
    process.exit(1);
  }
  const plan = await computeFeatureRunPlan({
    featureKeys: JSON.parse(featureKeysJson),
    runsRoot,
    releaseRunDir,
    explicitMode,
  });
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
