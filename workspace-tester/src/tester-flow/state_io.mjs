#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

export const PHASE_KEYS = [
  'phase_0_preflight',
  'phase_1_intake',
  'phase_2_generate',
  'phase_3_execute',
  'phase_4_heal',
  'phase_5_finalize',
];

const MODE_VALUES = new Set(['planner_first', 'direct', 'provided_plan']);

export function nowIso() {
  return new Date().toISOString();
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function toPosix(inputPath) {
  return inputPath.split(path.sep).join('/');
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

export function readJson(filePath) {
  if (!fileExists(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function sanitizeMode(mode, fallback = 'planner_first') {
  if (typeof mode === 'string' && MODE_VALUES.has(mode)) {
    return mode;
  }
  return fallback;
}

function defaultPhaseStatus() {
  return Object.fromEntries(PHASE_KEYS.map((phase) => [phase, 'pending']));
}

function normalizePhaseName(phaseName) {
  if (phaseName === 'phase_0_idempotency') {
    return 'phase_0_preflight';
  }
  return phaseName;
}

export function buildDefaultTask({
  workItemKey,
  executionMode = 'planner_first',
  intentSourceType = 'feature_id',
  intentInputRaw,
  preRouteStatus = 'plan_exists',
  plannerPresolveInvoked = false,
  modeDecisionSource = 'user_input',
  plannerInvocationRequired = false,
  planSourceKind = 'planner_output',
  planSourcePath = '',
  frameworkProfile = 'projects/library-automation/.agents/context/framework-profile.json',
}) {
  return {
    work_item_key: workItemKey,
    intent_source_type: intentSourceType,
    intent_input_raw: intentInputRaw ?? workItemKey,
    pre_route_status: preRouteStatus,
    planner_presolve_invoked: plannerPresolveInvoked,
    overall_status: 'running',
    current_phase: 'phase_0_preflight',
    execution_mode: sanitizeMode(executionMode),
    mode_decision_source: modeDecisionSource,
    mode_locked: true,
    planner_invocation_required: plannerInvocationRequired,
    plan_source_kind: planSourceKind,
    plan_source_path: planSourcePath,
    framework_profile: frameworkProfile,
    agents_root: '.agents',
    discovery_policy: 'workspace_root_only',
    phase_status: defaultPhaseStatus(),
    healing: {
      max_rounds: 3,
      current_round: 0,
      status: 'not_started',
    },
    updated_at: nowIso(),
  };
}

export function buildDefaultRun({
  workItemKey,
  executionMode = 'planner_first',
  plannerSpecsSource,
  intakeManifestPath,
}) {
  return {
    execution_mode: sanitizeMode(executionMode),
    pre_route_decision_log: [],
    planner_specs_source: plannerSpecsSource,
    resolved_plan_inputs: [],
    planner_artifact_path: null,
    intake_manifest_path: intakeManifestPath,
    generated_specs: [],
    failed_specs: [],
    mode_transition_log: [],
    legacy_path_used: false,
    legacy_path_reason: null,
    notification_pending: null,
    report_state: 'FRESH',
    data_fetched_at: null,
    output_generated_at: null,
    output_approved_at: null,
    // Compatibility fields retained on read only.
    run_key: workItemKey,
    tester_specs_dir: `projects/library-automation/specs/feature-plan/${workItemKey}`,
    archive_log: [],
  };
}

function migrateTaskSchema(task, fallbackTask) {
  const migrated = { ...fallbackTask, ...(task ?? {}) };

  if (!migrated.work_item_key && migrated.feature_key) {
    migrated.work_item_key = migrated.feature_key;
  }

  const legacyPhases = task?.phases ?? {};
  const existingPhaseStatus = task?.phase_status ?? {};
  const mergedPhaseStatus = defaultPhaseStatus();

  for (const [phase, value] of Object.entries(legacyPhases)) {
    const normalizedPhase = normalizePhaseName(phase);
    const status = typeof value === 'string' ? value : value?.status;
    if (normalizedPhase in mergedPhaseStatus && typeof status === 'string') {
      mergedPhaseStatus[normalizedPhase] = status;
    }
  }

  for (const [phase, status] of Object.entries(existingPhaseStatus)) {
    const normalizedPhase = normalizePhaseName(phase);
    if (normalizedPhase in mergedPhaseStatus && typeof status === 'string') {
      mergedPhaseStatus[normalizedPhase] = status;
    }
  }

  migrated.phase_status = mergedPhaseStatus;

  migrated.current_phase = normalizePhaseName(migrated.current_phase ?? 'phase_0_preflight');
  if (!(migrated.current_phase in mergedPhaseStatus)) {
    migrated.current_phase = 'phase_0_preflight';
  }

  migrated.execution_mode = sanitizeMode(migrated.execution_mode, fallbackTask.execution_mode);
  migrated.mode_locked = migrated.mode_locked !== false;
  migrated.healing = {
    max_rounds: 3,
    current_round: Number.isFinite(Number(migrated.healing?.current_round))
      ? Number(migrated.healing.current_round)
      : 0,
    status: typeof migrated.healing?.status === 'string' ? migrated.healing.status : 'not_started',
  };

  migrated.agents_root = '.agents';
  migrated.discovery_policy = 'workspace_root_only';

  if (!migrated.intent_source_type) {
    migrated.intent_source_type = fallbackTask.intent_source_type;
  }
  if (!migrated.intent_input_raw) {
    migrated.intent_input_raw = fallbackTask.intent_input_raw;
  }
  if (!migrated.pre_route_status) {
    migrated.pre_route_status = fallbackTask.pre_route_status;
  }
  if (typeof migrated.planner_presolve_invoked !== 'boolean') {
    migrated.planner_presolve_invoked = fallbackTask.planner_presolve_invoked;
  }
  if (!migrated.mode_decision_source) {
    migrated.mode_decision_source = fallbackTask.mode_decision_source;
  }
  if (!migrated.plan_source_kind) {
    migrated.plan_source_kind = fallbackTask.plan_source_kind;
  }
  if (!migrated.plan_source_path) {
    migrated.plan_source_path = fallbackTask.plan_source_path;
  }
  if (!migrated.framework_profile) {
    migrated.framework_profile = fallbackTask.framework_profile;
  }
  if (typeof migrated.planner_invocation_required !== 'boolean') {
    migrated.planner_invocation_required = fallbackTask.planner_invocation_required;
  }

  migrated.overall_status = typeof migrated.overall_status === 'string' ? migrated.overall_status : 'running';
  migrated.updated_at = nowIso();

  return migrated;
}

function migrateRunSchema(run, fallbackRun) {
  const migrated = { ...fallbackRun, ...(run ?? {}) };

  migrated.execution_mode = sanitizeMode(migrated.execution_mode, fallbackRun.execution_mode);
  migrated.pre_route_decision_log = Array.isArray(migrated.pre_route_decision_log)
    ? migrated.pre_route_decision_log
    : [];
  migrated.mode_transition_log = Array.isArray(migrated.mode_transition_log)
    ? migrated.mode_transition_log
    : [];
  migrated.generated_specs = Array.isArray(migrated.generated_specs)
    ? Array.from(new Set(migrated.generated_specs.filter((item) => typeof item === 'string')))
    : [];
  migrated.failed_specs = Array.isArray(migrated.failed_specs)
    ? Array.from(new Set(migrated.failed_specs.filter((item) => typeof item === 'string')))
    : [];
  migrated.resolved_plan_inputs = Array.isArray(migrated.resolved_plan_inputs)
    ? Array.from(new Set(migrated.resolved_plan_inputs.filter((item) => typeof item === 'string')))
    : [];

  migrated.legacy_path_used = false;
  migrated.legacy_path_reason = null;

  if (typeof migrated.notification_pending !== 'string' && migrated.notification_pending !== null) {
    migrated.notification_pending = null;
  }

  if (!migrated.intake_manifest_path) {
    migrated.intake_manifest_path = fallbackRun.intake_manifest_path;
  }
  if (!migrated.planner_specs_source) {
    migrated.planner_specs_source = fallbackRun.planner_specs_source;
  }
  if (!migrated.report_state) {
    migrated.report_state = 'FRESH';
  }

  return migrated;
}

export function loadOrInitState({
  runDir,
  workItemKey,
  executionMode,
  intentSourceType,
  intentInputRaw,
  preRouteStatus,
  plannerPresolveInvoked,
  modeDecisionSource,
  plannerInvocationRequired,
  planSourceKind,
  planSourcePath,
  plannerSpecsSource,
  intakeManifestPath,
  frameworkProfile,
}) {
  ensureDir(runDir);
  const taskPath = path.join(runDir, 'task.json');
  const runPath = path.join(runDir, 'run.json');

  const defaultTask = buildDefaultTask({
    workItemKey,
    executionMode,
    intentSourceType,
    intentInputRaw,
    preRouteStatus,
    plannerPresolveInvoked,
    modeDecisionSource,
    plannerInvocationRequired,
    planSourceKind,
    planSourcePath,
    frameworkProfile,
  });

  const defaultRun = buildDefaultRun({
    workItemKey,
    executionMode,
    plannerSpecsSource,
    intakeManifestPath,
  });

  const migratedTask = migrateTaskSchema(readJson(taskPath), defaultTask);
  const migratedRun = migrateRunSchema(readJson(runPath), defaultRun);

  return {
    taskPath,
    runPath,
    task: migratedTask,
    run: migratedRun,
  };
}

export function saveState({ taskPath, runPath, task, run }) {
  writeJson(taskPath, task);
  writeJson(runPath, run);
}

export function relativeToRoot(rootDir, absolutePath) {
  return toPosix(path.relative(rootDir, absolutePath));
}

export function toBoolean(input, defaultValue = false) {
  if (typeof input === 'boolean') {
    return input;
  }
  if (typeof input === 'string') {
    const value = input.trim().toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(value)) {
      return true;
    }
    if (['0', 'false', 'no', 'n', 'off'].includes(value)) {
      return false;
    }
  }
  return defaultValue;
}
