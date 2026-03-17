#!/usr/bin/env node
/**
 * Phase 0: Initialize task.json, run.json, planner lookup config.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectReportState } from './detectReportState.mjs';

const _dirname = dirname(fileURLToPath(import.meta.url));

function nowIso() {
  return new Date().toISOString();
}

function getCanonicalOptions(reportState) {
  switch (reportState) {
    case 'FINAL_EXISTS':
      return ['use_existing', 'smart_refresh', 'full_regenerate'];
    case 'DRAFT_EXISTS':
      return ['resume', 'smart_refresh', 'full_regenerate'];
    case 'CONTEXT_ONLY':
      return ['generate_from_cache', 'smart_refresh', 'full_regenerate'];
    case 'FRESH':
      return ['proceed'];
    default:
      return null;
  }
}

function chooseMode(reportState, refreshMode) {
  if (refreshMode) return refreshMode;
  switch (reportState) {
    case 'FINAL_EXISTS': return 'use_existing';
    case 'DRAFT_EXISTS': return 'resume';
    case 'CONTEXT_ONLY': return 'generate_from_cache';
    default: return 'proceed';
  }
}

function normalizeOptionalBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n'].includes(normalized)) return false;
  return null;
}

async function safeReadTask(taskPath) {
  try {
    const raw = await readFile(taskPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function archiveRun(runDir, featureKey) {
  const { execSync } = await import('node:child_process');
  const scriptDir = join(_dirname, '..');
  execSync(`bash "${scriptDir}/archive_run.sh" "${runDir}" "${featureKey}"`, {
    stdio: 'inherit',
  });
}

export async function runPhase0(featureKey, runDir, input = {}) {
  const skillRoot = join(_dirname, '..', '..');
  const configPath = join(skillRoot, 'config', 'runtime-sources.json');
  const taskPath = join(runDir, 'task.json');
  const existingTask = await safeReadTask(taskPath);
  const finalPath = join(runDir, `${featureKey}_QA_SUMMARY_FINAL.md`);

  let runtimeSources = { planner_run_root: '', defects_run_root: '' };
  try {
    const raw = await readFile(configPath, 'utf8');
    runtimeSources = JSON.parse(raw);
  } catch {
    // use defaults from design
    runtimeSources = {
      planner_run_root: 'workspace-planner/skills/qa-plan-orchestrator/runs',
      defects_run_root: 'workspace-reporter/skills/defects-analysis/runs',
    };
  }

  const plannerRunRoot = input.planner_run_root || runtimeSources.planner_run_root;
  const defectsRunRoot = input.defects_run_root || runtimeSources.defects_run_root;
  const reportState = detectReportState(runDir, featureKey);
  const canonicalOptions = getCanonicalOptions(reportState);
  const skipNotification = normalizeOptionalBoolean(input.skip_notification);

  if (
    existingTask?.overall_status === 'completed' &&
    existingTask?.selected_mode === 'use_existing' &&
    reportState === 'FINAL_EXISTS'
  ) {
    await readFile(finalPath, 'utf8');
    console.log('PHASE0_USE_EXISTING');
    return 0;
  }

  if (input.refresh_mode && canonicalOptions && !canonicalOptions.includes(input.refresh_mode)) {
    console.error(
      `BLOCKED: REPORT_STATE=${reportState}. REFRESH_MODE must be one of: ${canonicalOptions.join(', ')}`
    );
    return 2;
  }

  const selectedMode = chooseMode(reportState, input.refresh_mode);

  if (selectedMode === 'use_existing' && reportState === 'FINAL_EXISTS') {
    console.log('PHASE0_USE_EXISTING');
    return 0;
  }

  if (selectedMode === 'smart_refresh' || selectedMode === 'full_regenerate') {
    await archiveRun(runDir, featureKey);
  }

  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
  await mkdir(join(runDir, 'archive'), { recursive: true });

  const ts = nowIso();
  const task = {
    feature_key: featureKey,
    run_key: featureKey,
    config_path: configPath,
    report_state: reportState,
    selected_mode: selectedMode,
    planner_run_root: plannerRunRoot,
    planner_plan_path: input.planner_plan_path || null,
    planner_plan_resolved_path: null,
    planner_summary_path: null,
    feature_overview_table_path: null,
    feature_overview_source: null,
    defects_run_root: defectsRunRoot,
    defect_context_state: null,
    defect_reuse_mode: null,
    publish_mode: input.publish_mode || null,
    confluence_target: null,
    notification_target: input.notification_target || null,
    skip_notification: skipNotification,
    overall_status: 'in_progress',
    current_phase: 'phase0',
    review_status: null,
    notification_status: 'pending',
    updated_at: ts,
  };

  const run = {
    planner_context_resolved_at: null,
    defect_context_resolved_at: null,
    output_generated_at: null,
    review_completed_at: null,
    confluence_published_at: null,
    notification_pending: null,
    subtask_timestamps: {},
    updated_at: ts,
  };

  const lookup = {
    featureKey,
    plannerRunRoot,
    planPath: null,
    summaryPath: null,
    configLoaded: true,
    updated_at: ts,
  };

  await writeFile(taskPath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
  await writeFile(join(runDir, 'run.json'), `${JSON.stringify(run, null, 2)}\n`, 'utf8');
  await writeFile(
    join(runDir, 'context', 'planner_artifact_lookup.json'),
    `${JSON.stringify(lookup, null, 2)}\n`,
    'utf8'
  );
  await writeFile(
    join(runDir, 'context', 'planner_artifact_lookup.md'),
    `# Planner Artifact Lookup\n\nPlanner run root: ${plannerRunRoot}\nDefects run root: ${defectsRunRoot}\n`,
    'utf8'
  );

  console.log('PHASE0_DONE');
  return 0;
}

async function main() {
  const featureKey = process.argv[2];
  const runDir = process.argv[3];
  if (!featureKey || !runDir) {
    console.error('Usage: phase0.mjs <feature-key> <run-dir>');
    process.exit(1);
  }
  const input = {
    planner_run_root: process.env.PLANNER_RUN_ROOT,
    defects_run_root: process.env.DEFECTS_RUN_ROOT,
    planner_plan_path: process.env.PLANNER_PLAN_PATH,
    refresh_mode: process.env.REFRESH_MODE,
    publish_mode: process.env.PUBLISH_MODE,
    notification_target: process.env.NOTIFICATION_TARGET,
    skip_notification: process.env.SKIP_NOTIFICATION,
  };
  const code = await runPhase0(featureKey, runDir, input);
  process.exit(code);
}

if (process.argv[1]?.includes('phase0.mjs')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
