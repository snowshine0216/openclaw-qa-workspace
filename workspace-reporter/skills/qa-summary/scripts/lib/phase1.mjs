#!/usr/bin/env node
/**
 * Phase 1: Resolve planner artifacts, extract feature overview table.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { resolvePlannerArtifact } from './resolvePlannerArtifact.mjs';
import { buildFeatureOverviewTable } from './buildFeatureOverviewTable.mjs';
import { persistPlannerResolution } from './persistPlannerResolution.mjs';

export async function runPhase1(featureKey, runDir) {
  const taskPath = join(runDir, 'task.json');
  let task = {};
  try {
    const raw = await readFile(taskPath, 'utf8');
    task = JSON.parse(raw);
  } catch {
    console.error('BLOCKED: Missing task.json. Run Phase 0 first.');
    return 2;
  }

  const resolved = await resolvePlannerArtifact({
    featureKey,
    plannerRunRoot: task.planner_run_root,
    plannerPlanPath: task.planner_plan_path,
    runDir,
  });

  if (!resolved.planPath) {
    console.error(`BLOCKED: Provide QA plan markdown for ${featureKey}`);
    return 2;
  }

  await writeFile(
    join(runDir, 'context', 'planner_artifact_lookup.json'),
    `${JSON.stringify({ ...resolved, featureOverviewSource: null }, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'planner_summary_seed.md'),
    resolved.seedMarkdown,
    'utf8'
  );

  const featureOverview = await buildFeatureOverviewTable({
    featureKey,
    planPath: resolved.planPath,
    summaryPath: resolved.summaryPath,
  });

  resolved.featureOverviewSource = featureOverview.metadata.source;

  await writeFile(
    join(runDir, 'context', 'feature_overview_table.md'),
    featureOverview.markdown,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'feature_overview_source.json'),
    `${JSON.stringify(featureOverview.metadata, null, 2)}\n`,
    'utf8'
  );

  await persistPlannerResolution(runDir, resolved);
  const persistedTask = JSON.parse(await readFile(taskPath, 'utf8'));

  const ts = new Date().toISOString();
  persistedTask.current_phase = 'phase1';
  persistedTask.updated_at = ts;
  await writeFile(taskPath, `${JSON.stringify(persistedTask, null, 2)}\n`, 'utf8');

  const runPath = join(runDir, 'run.json');
  let run = {};
  try {
    const raw = await readFile(runPath, 'utf8');
    run = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  run.planner_context_resolved_at = ts;
  run.updated_at = ts;
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');

  console.log('PHASE1_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  if (!featureKey || !runDir) {
    console.error('Usage: phase1.mjs <feature-key> <run-dir>');
    process.exit(1);
  }
  const code = await runPhase1(featureKey, runDir);
  process.exit(code);
}

if (process.argv[1]?.includes('phase1.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
