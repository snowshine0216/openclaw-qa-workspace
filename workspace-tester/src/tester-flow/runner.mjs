#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  loadOrInitState,
  saveState,
  nowIso,
  toBoolean,
  relativeToRoot,
  sanitizeMode,
} from './state_io.mjs';
import {
  normalizeExecutionMode,
  resolveModeInputs,
  hasCriticalSeed,
  synthesizeSeed,
} from './validate_inputs.mjs';
import { buildSpecManifest } from './manifest_builder.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_TESTER_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(WORKSPACE_TESTER_ROOT, '..');
const LIB_AUTOMATION_DIR = path.join(WORKSPACE_TESTER_ROOT, 'projects/library-automation');
const RUNS_ROOT = path.join(WORKSPACE_TESTER_ROOT, 'memory/tester-flow/runs');
const PLANNER_FEATURE_ROOT = path.join(REPO_ROOT, 'workspace-planner/projects/feature-plan');
const CANONICAL_WORKFLOW_PATH = path.join(
  WORKSPACE_TESTER_ROOT,
  '.agents/workflows/planner-spec-generation-healing.md'
);

function toPosix(inputPath) {
  return inputPath.split(path.sep).join('/');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    if (args[key] === undefined) {
      args[key] = next;
    } else if (Array.isArray(args[key])) {
      args[key].push(next);
    } else {
      args[key] = [args[key], next];
    }
    i += 1;
  }
  return args;
}

function getListArg(args, key) {
  const value = args[key];
  if (value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

function fail(message, details) {
  if (details) {
    process.stderr.write(`${message}\n${details}\n`);
  } else {
    process.stderr.write(`${message}\n`);
  }
  process.exit(1);
}

function nowStamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function runCommand({ command, cwd, env = {}, timeoutMs }) {
  const result = spawnSync(command, {
    shell: true,
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    timeout: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : undefined,
  });
  return {
    code: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function dedupeSorted(items) {
  return Array.from(new Set(items)).sort();
}

function assertCanonicalWorkflowPresent() {
  if (!fs.existsSync(CANONICAL_WORKFLOW_PATH)) {
    fail(
      `Blocker: canonical workflow missing at ${toPosix(CANONICAL_WORKFLOW_PATH)}.`,
      'Expected .agents/workflows/planner-spec-generation-healing.md'
    );
  }
}

function plannerPaths(workItemKey) {
  return {
    qaPlan: path.join(PLANNER_FEATURE_ROOT, workItemKey, 'qa_plan_final.md'),
    specsDir: path.join(PLANNER_FEATURE_ROOT, workItemKey, 'specs'),
  };
}

function resolveIntent(args) {
  if (typeof args['work-item-key'] === 'string') {
    return {
      workItemKey: args['work-item-key'],
      intentSourceType: 'feature_id',
      intentInputRaw: args['work-item-key'],
    };
  }
  if (typeof args['feature-id'] === 'string') {
    return {
      workItemKey: args['feature-id'],
      intentSourceType: 'feature_id',
      intentInputRaw: args['feature-id'],
    };
  }
  if (typeof args['issue-key'] === 'string') {
    return {
      workItemKey: args['issue-key'],
      intentSourceType: 'issue_key',
      intentInputRaw: args['issue-key'],
    };
  }
  if (typeof args.intent === 'string') {
    return {
      workItemKey: args.intent,
      intentSourceType: 'feature_id',
      intentInputRaw: args.intent,
    };
  }
  return null;
}

function ensurePlannerArtifactsOrPresolve({ workItemKey, plannerPresolveCmd }) {
  const paths = plannerPaths(workItemKey);
  let exists = fs.existsSync(paths.qaPlan) && fs.existsSync(paths.specsDir);
  let presolveInvoked = false;

  if (!exists) {
    presolveInvoked = true;
    if (!plannerPresolveCmd) {
      fail(
        `Planner artifacts are missing for ${workItemKey}.`,
        'Set PLANNER_PRESOLVE_CMD or pass --planner-presolve-cmd to auto-invoke planner pre-step.'
      );
    }

    const result = runCommand({
      command: plannerPresolveCmd,
      cwd: REPO_ROOT,
      env: {
        WORK_ITEM_KEY: workItemKey,
      },
    });

    if (result.code !== 0) {
      fail(
        `Planner pre-step failed for ${workItemKey}.`,
        `${result.stdout}\n${result.stderr}`.trim()
      );
    }

    exists = fs.existsSync(paths.qaPlan) && fs.existsSync(paths.specsDir);
    if (!exists) {
      fail(
        `Planner pre-step completed but artifacts are still missing for ${workItemKey}.`,
        `Expected ${toPosix(paths.qaPlan)} and ${toPosix(paths.specsDir)}`
      );
    }
  }

  return {
    paths,
    presolveInvoked,
    preRouteStatus: presolveInvoked ? 'plan_missing' : 'plan_exists',
  };
}

function resolveModeAndPlanSource({
  requestedMode,
  modeDecisionSource,
  workItemKey,
  plannerSpecsSource,
}) {
  const executionMode = requestedMode ? normalizeExecutionMode(requestedMode) : 'planner_first';

  if (executionMode === 'planner_first') {
    return {
      executionMode,
      modeDecisionSource,
      planSourceKind: 'planner_output',
      planSourcePath: relativeToRoot(WORKSPACE_TESTER_ROOT, plannerSpecsSource),
    };
  }

  if (executionMode === 'direct') {
    return {
      executionMode,
      modeDecisionSource,
      planSourceKind: 'direct_requirements',
      planSourcePath: `direct://${workItemKey}`,
    };
  }

  return {
    executionMode,
    modeDecisionSource,
    planSourceKind: 'provided_plan',
    planSourcePath: `provided://${workItemKey}`,
  };
}

function loadStateForRun({ runDir, workItemKey, executionMode, intentSourceType, intentInputRaw, preRouteStatus, plannerPresolveInvoked, modeDecisionSource, plannerInvocationRequired, planSourceKind, planSourcePath, plannerSpecsSource, frameworkProfile }) {
  const intakeManifestPath = relativeToRoot(
    WORKSPACE_TESTER_ROOT,
    path.join(runDir, 'context/spec_manifest.json')
  );

  return loadOrInitState({
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
  });
}

function appendInitialLogs({ state, intentSourceType, intentInputRaw, workItemKey, preRouteStatus, executionMode, route }) {
  state.run.pre_route_decision_log.push({
    at: nowIso(),
    intent_source_type: intentSourceType,
    intent_input_raw: intentInputRaw,
    work_item_key: workItemKey,
    plan_existence: preRouteStatus === 'plan_exists' ? 'exists' : 'missing_then_resolved',
    route,
  });

  state.run.mode_transition_log.push({
    at: nowIso(),
    from: null,
    to: executionMode,
    reason: 'initial_mode_gate',
  });
}

function phaseStart(task, phase) {
  task.current_phase = phase;
  task.phase_status[phase] = 'running';
  task.updated_at = nowIso();
}

function phaseComplete(task, phase, nextPhase = null) {
  task.phase_status[phase] = 'completed';
  task.current_phase = nextPhase ?? phase;
  task.updated_at = nowIso();
}

function classifyReportState({ runDir, workItemKey }) {
  const summaryPath = path.join(runDir, 'reports/execution-summary.md');
  const intakeDir = path.join(LIB_AUTOMATION_DIR, `specs/feature-plan/${workItemKey}`);
  const generatedDir = path.join(LIB_AUTOMATION_DIR, `tests/specs/feature-plan/${workItemKey}`);

  if (fs.existsSync(summaryPath)) {
    return 'FINAL_EXISTS';
  }

  const hasGeneratedSpecs = fs.existsSync(generatedDir)
    && walkFiles(generatedDir).some((item) => item.endsWith('.spec.ts'));
  const hasIntakeSpecs = fs.existsSync(intakeDir)
    && walkFiles(intakeDir).some((item) => item.endsWith('.md'));

  if (hasGeneratedSpecs || fs.existsSync(path.join(runDir, 'task.json')) || fs.existsSync(path.join(runDir, 'run.json'))) {
    return 'DRAFT_EXISTS';
  }
  if (hasIntakeSpecs) {
    return 'CONTEXT_ONLY';
  }
  return 'FRESH';
}

function walkFiles(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  const output = [];
  const stack = [baseDir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        output.push(fullPath);
      }
    }
  }
  return output;
}

function commonParentDirectory(filePaths) {
  if (filePaths.length === 0) {
    return null;
  }
  const segments = filePaths.map((filePath) => toPosix(path.resolve(filePath)).split('/'));
  const minLen = Math.min(...segments.map((parts) => parts.length));
  const common = [];
  for (let index = 0; index < minLen; index += 1) {
    const value = segments[0][index];
    if (segments.every((parts) => parts[index] === value)) {
      common.push(value);
    } else {
      break;
    }
  }
  return common.length > 0 ? common.join('/') : path.parse(path.resolve(filePaths[0])).root;
}

function ensureSeedLine(markdownText, seedLine) {
  if (hasCriticalSeed(markdownText)) {
    return markdownText;
  }
  return `${seedLine}\n\n${markdownText}`;
}

function buildDirectMarkdown({ sourcePath, workItemKey, sourceText }) {
  const ext = path.extname(sourcePath).toLowerCase();
  const scenarioName = path.basename(sourcePath, ext).replace(/[^A-Za-z0-9_-]+/g, '-').toLowerCase();
  const seedLine = synthesizeSeed({ workItemKey, scenarioId: scenarioName || 'scenario' });

  if (ext === '.md') {
    return ensureSeedLine(sourceText, seedLine);
  }

  const language = ext === '.json' ? 'json' : 'text';
  return [
    `# Direct Scenario: ${scenarioName || 'scenario'}`,
    '',
    seedLine,
    '',
    '## Source Context',
    '',
    `Source: ${toPosix(sourcePath)}`,
    '',
    `\`\`\`${language}`,
    sourceText,
    '\`\`\`',
    '',
  ].join('\n');
}

function readFrameworkProfile(frameworkProfilePath) {
  if (!fs.existsSync(frameworkProfilePath)) {
    const result = runCommand({
      command: 'npm run preflight:framework-profile',
      cwd: LIB_AUTOMATION_DIR,
    });
    if (result.code !== 0) {
      fail('Failed to generate framework profile.', `${result.stdout}\n${result.stderr}`.trim());
    }
  }

  if (!fs.existsSync(frameworkProfilePath)) {
    fail(`Framework profile not found: ${toPosix(frameworkProfilePath)}`);
  }

  return JSON.parse(fs.readFileSync(frameworkProfilePath, 'utf8'));
}

function extractSeedReference(markdownText) {
  const match = markdownText.match(/^\*\*Seed:\*\*\s*(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

function collectFailedSpecsFromPlaywrightJson(reportJsonPath) {
  if (!fs.existsSync(reportJsonPath)) {
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));
  } catch {
    return [];
  }

  const failedStatuses = new Set(['failed', 'timedOut', 'interrupted']);
  const failedFiles = new Set();

  function specFailed(spec) {
    const tests = spec?.tests ?? [];
    for (const test of tests) {
      const results = test?.results ?? [];
      for (const result of results) {
        if (failedStatuses.has(result?.status)) {
          return true;
        }
      }
    }
    return false;
  }

  function walkSuite(suite) {
    for (const spec of suite?.specs ?? []) {
      if (specFailed(spec) && typeof spec.file === 'string') {
        failedFiles.add(spec.file);
      }
    }
    for (const child of suite?.suites ?? []) {
      walkSuite(child);
    }
  }

  for (const suite of parsed?.suites ?? []) {
    walkSuite(suite);
  }

  return Array.from(failedFiles).sort();
}

function normalizeSpecPathsToWorkspace(specPaths) {
  return dedupeSorted(
    specPaths.map((specPath) => {
      let absolute;
      if (path.isAbsolute(specPath)) {
        absolute = specPath;
      } else {
        const direct = path.resolve(LIB_AUTOMATION_DIR, specPath);
        const underTests = path.resolve(LIB_AUTOMATION_DIR, 'tests', specPath);
        if (fs.existsSync(direct)) {
          absolute = direct;
        } else if (fs.existsSync(underTests)) {
          absolute = underTests;
        } else if (specPath.startsWith('specs/')) {
          absolute = path.resolve(LIB_AUTOMATION_DIR, 'tests', specPath);
        } else {
          absolute = direct;
        }
      }
      return relativeToRoot(WORKSPACE_TESTER_ROOT, absolute);
    })
  );
}

function toLibraryRelativeSpecPath(specPath) {
  const absolute = path.isAbsolute(specPath)
    ? specPath
    : path.resolve(WORKSPACE_TESTER_ROOT, specPath);
  return toPosix(path.relative(LIB_AUTOMATION_DIR, absolute));
}

function runPlaywrightForSpecs({ specPaths, reportOutputPath, project, timeoutMs }) {
  ensureDir(path.dirname(reportOutputPath));

  const relativeSpecs = dedupeSorted(specPaths.map((item) => toLibraryRelativeSpecPath(item)));
  const quotedSpecs = relativeSpecs.map((item) => `'${item.replace(/'/g, "'\\''")}'`).join(' ');
  const projectArg = project ? ` --project='${project.replace(/'/g, "'\\''")}'` : '';
  const command = `PLAYWRIGHT_JSON_OUTPUT_NAME='${toPosix(reportOutputPath)}' npx playwright test ${quotedSpecs}${projectArg} --retries=0 --reporter=json`;
  const result = runCommand({ command, cwd: LIB_AUTOMATION_DIR, timeoutMs });
  const failedFiles = collectFailedSpecsFromPlaywrightJson(reportOutputPath);

  return {
    result,
    failedSpecs: normalizeSpecPathsToWorkspace(failedFiles),
  };
}

function resolveRunDirFromArgs(args, workItemKey) {
  if (typeof args['run-dir'] === 'string') {
    return path.isAbsolute(args['run-dir'])
      ? args['run-dir']
      : path.resolve(WORKSPACE_TESTER_ROOT, args['run-dir']);
  }
  return path.join(RUNS_ROOT, workItemKey);
}

function writeHealingReport({ runDir, failedSpecs, round }) {
  const reportPath = path.join(runDir, 'healing/healing_report.md');
  ensureDir(path.dirname(reportPath));
  const rows = failedSpecs.map((specPath, index) => {
    return `| ${index + 1} | ${specPath} | N/A | Final rerun after round ${round} | Failed after max rounds | No successful automated fix | Inspect locators/env or preserve original intent manually | N/A (no WDIO mapping provided to runtime) |`;
  });
  const content = [
    '# Healing Report',
    '',
    `Generated at: ${nowIso()}`,
    `Max rounds attempted: ${round}`,
    '',
    '| # | Script | URL | Step | Why it fails | Fixes applied | Suggestion to next step | Original step alignment |',
    '|---|---|---|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
  fs.writeFileSync(reportPath, content, 'utf8');
  return reportPath;
}

function parseFeishuChatId() {
  const toolsPath = path.join(WORKSPACE_TESTER_ROOT, 'TOOLS.md');
  if (!fs.existsSync(toolsPath)) {
    return '';
  }
  const text = fs.readFileSync(toolsPath, 'utf8');
  const match = text.match(/github-updates:\s*(\S+)/);
  return match?.[1] ?? '';
}

function buildNotificationPayload({ workItemKey, finalStatus, generatedCount, failedCount, summaryPath, healingReportPath }) {
  const lines = [
    `Playwright test run completed`,
    `Feature: ${workItemKey}`,
    `Status: ${finalStatus}`,
    `Specs: ${generatedCount - failedCount}/${generatedCount} passed`,
    `Summary: ${summaryPath}`,
    `Updated: ${nowIso()}`,
  ];
  if (healingReportPath) {
    lines.push(`Healing report: ${healingReportPath}`);
  }
  lines.push('Published by Tester Agent (planner-spec-generation-healing).');
  return lines.join('\n');
}

function ensureRequired(value, name) {
  if (!value || typeof value !== 'string') {
    fail(`Missing required argument: --${name}`);
  }
}

function commandR0(args) {
  assertCanonicalWorkflowPresent();
  const intent = resolveIntent(args);
  if (!intent) {
    fail('R0 requires one of --work-item-key, --feature-id, --issue-key, or --intent.');
  }

  const requestedMode = typeof args['execution-mode'] === 'string' ? args['execution-mode'] : null;
  const plannerPresolveCmd = args['planner-presolve-cmd'] || process.env.PLANNER_PRESOLVE_CMD || '';
  let planner;
  if (requestedMode && requestedMode !== 'planner_first') {
    const paths = plannerPaths(intent.workItemKey);
    const plannerArtifactsExist = fs.existsSync(paths.qaPlan) && fs.existsSync(paths.specsDir);
    planner = {
      paths,
      presolveInvoked: false,
      preRouteStatus: plannerArtifactsExist ? 'plan_exists' : 'plan_missing',
    };
  } else {
    planner = ensurePlannerArtifactsOrPresolve({
      workItemKey: intent.workItemKey,
      plannerPresolveCmd,
    });
  }

  const modeInfo = resolveModeAndPlanSource({
    requestedMode,
    modeDecisionSource: requestedMode ? 'user_input' : 'r0_route',
    workItemKey: intent.workItemKey,
    plannerSpecsSource: planner.paths.specsDir,
  });

  const runDir = path.join(RUNS_ROOT, intent.workItemKey);
  const frameworkProfileRel = 'projects/library-automation/.agents/context/framework-profile.json';
  const state = loadStateForRun({
    runDir,
    workItemKey: intent.workItemKey,
    executionMode: modeInfo.executionMode,
    intentSourceType: intent.intentSourceType,
    intentInputRaw: intent.intentInputRaw,
    preRouteStatus: planner.preRouteStatus,
    plannerPresolveInvoked: planner.presolveInvoked,
    modeDecisionSource: modeInfo.modeDecisionSource,
    plannerInvocationRequired: planner.presolveInvoked,
    planSourceKind: modeInfo.planSourceKind,
    planSourcePath: modeInfo.planSourcePath,
    plannerSpecsSource: toPosix(planner.paths.specsDir),
    frameworkProfile: frameworkProfileRel,
  });

  const firstRoute = state.run.pre_route_decision_log.length === 0;
  const firstModeTransition = state.run.mode_transition_log.length === 0;

  state.task.work_item_key = intent.workItemKey;
  state.task.intent_source_type = intent.intentSourceType;
  state.task.intent_input_raw = intent.intentInputRaw;
  state.task.pre_route_status = planner.preRouteStatus;
  state.task.planner_presolve_invoked = planner.presolveInvoked;
  state.task.execution_mode = modeInfo.executionMode;
  state.task.mode_decision_source = modeInfo.modeDecisionSource;
  state.task.mode_locked = true;
  state.task.plan_source_kind = modeInfo.planSourceKind;
  state.task.plan_source_path = modeInfo.planSourcePath;
  state.task.planner_invocation_required = planner.presolveInvoked;
  state.task.overall_status = 'running';
  state.task.framework_profile = frameworkProfileRel;

  state.run.execution_mode = modeInfo.executionMode;
  state.run.planner_specs_source = toPosix(planner.paths.specsDir);
  state.run.legacy_path_used = false;
  state.run.legacy_path_reason = null;

  if (firstRoute || args['force-route-log'] === true) {
    appendInitialLogs({
      state,
      intentSourceType: intent.intentSourceType,
      intentInputRaw: intent.intentInputRaw,
      workItemKey: intent.workItemKey,
      preRouteStatus: planner.preRouteStatus,
      executionMode: modeInfo.executionMode,
      route: planner.presolveInvoked ? 'invoke_planner_then_tester' : 'invoke_tester_workflow',
    });
  } else if (firstModeTransition) {
    state.run.mode_transition_log.push({
      at: nowIso(),
      from: null,
      to: modeInfo.executionMode,
      reason: 'initial_mode_gate',
    });
  }

  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${intent.workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`EXECUTION_MODE=${modeInfo.executionMode}\n`);

  return {
    workItemKey: intent.workItemKey,
    runDir,
    executionMode: modeInfo.executionMode,
  };
}

function commandPhase0(args) {
  assertCanonicalWorkflowPresent();
  ensureRequired(args['work-item-key'], 'work-item-key');

  const workItemKey = args['work-item-key'];
  const initialRunDir = resolveRunDirFromArgs(args, workItemKey);
  const requestedModeRaw = typeof args['execution-mode'] === 'string' ? args['execution-mode'] : null;
  const newRunOnModeChange = toBoolean(args['new-run-on-mode-change'], false);

  let runDir = initialRunDir;
  let state = loadStateForRun({
    runDir,
    workItemKey,
    executionMode: requestedModeRaw ?? 'planner_first',
    intentSourceType: 'feature_id',
    intentInputRaw: workItemKey,
    preRouteStatus: 'plan_exists',
    plannerPresolveInvoked: false,
    modeDecisionSource: requestedModeRaw ? 'user_input' : 'r0_route',
    plannerInvocationRequired: false,
    planSourceKind: 'planner_output',
    planSourcePath: toPosix(plannerPaths(workItemKey).specsDir),
    plannerSpecsSource: toPosix(plannerPaths(workItemKey).specsDir),
    frameworkProfile: 'projects/library-automation/.agents/context/framework-profile.json',
  });

  const persistedMode = sanitizeMode(state.task.execution_mode, 'planner_first');
  const requestedMode = requestedModeRaw ? normalizeExecutionMode(requestedModeRaw) : persistedMode;

  if (persistedMode !== requestedMode) {
    if (!newRunOnModeChange) {
      fail(
        `Mode transition rejected for ${workItemKey}: persisted=${persistedMode}, requested=${requestedMode}.`,
        'Set --new-run-on-mode-change true to start a mode-shift namespace.'
      );
    }

    const modeShiftDir = path.join(RUNS_ROOT, workItemKey, `mode-shift-${nowStamp()}`);
    const modeShiftState = loadStateForRun({
      runDir: modeShiftDir,
      workItemKey,
      executionMode: requestedMode,
      intentSourceType: state.task.intent_source_type,
      intentInputRaw: state.task.intent_input_raw,
      preRouteStatus: state.task.pre_route_status,
      plannerPresolveInvoked: state.task.planner_presolve_invoked,
      modeDecisionSource: 'user_input',
      plannerInvocationRequired: state.task.planner_invocation_required,
      planSourceKind: state.task.plan_source_kind,
      planSourcePath: state.task.plan_source_path,
      plannerSpecsSource: state.run.planner_specs_source,
      frameworkProfile: state.task.framework_profile,
    });

    modeShiftState.run.pre_route_decision_log = [...state.run.pre_route_decision_log];
    modeShiftState.run.mode_transition_log = [
      ...state.run.mode_transition_log,
      {
        at: nowIso(),
        from: persistedMode,
        to: requestedMode,
        reason: 'mode_shift_override',
      },
    ];

    state = modeShiftState;
    runDir = modeShiftDir;
  }

  phaseStart(state.task, 'phase_0_preflight');

  const plannerDefaultDir = plannerPaths(workItemKey).specsDir;
  const plannerSpecsDir = (args['planner-specs-dir'] || state.run.planner_specs_source || plannerDefaultDir).toString();
  const providedPlanPaths = getListArg(args, 'provided-plan');
  const requirementPaths = getListArg(args, 'requirements');

  const modeInput = resolveModeInputs({
    mode: requestedMode,
    rootDir: WORKSPACE_TESTER_ROOT,
    plannerSpecsDir,
    providedPlanPaths,
    requirementPaths,
  });

  const frameworkProfileRaw = args['framework-profile'] || state.task.framework_profile || 'projects/library-automation/.agents/context/framework-profile.json';
  const frameworkProfileAbs = path.isAbsolute(frameworkProfileRaw)
    ? frameworkProfileRaw
    : path.resolve(WORKSPACE_TESTER_ROOT, frameworkProfileRaw);

  readFrameworkProfile(frameworkProfileAbs);

  state.task.work_item_key = workItemKey;
  state.task.execution_mode = requestedMode;
  state.task.mode_locked = true;
  state.task.mode_decision_source = requestedModeRaw ? 'user_input' : state.task.mode_decision_source;
  state.task.framework_profile = relativeToRoot(WORKSPACE_TESTER_ROOT, frameworkProfileAbs);
  state.task.agents_root = '.agents';
  state.task.discovery_policy = 'workspace_root_only';

  if (requestedMode === 'planner_first') {
    state.task.plan_source_kind = 'planner_output';
    state.task.plan_source_path = relativeToRoot(WORKSPACE_TESTER_ROOT, plannerDefaultDir);
  } else if (requestedMode === 'direct') {
    state.task.plan_source_kind = 'direct_requirements';
    state.task.plan_source_path = `direct://${workItemKey}`;
  } else {
    state.task.plan_source_kind = 'provided_plan';
    state.task.plan_source_path = `provided://${workItemKey}`;
  }

  state.run.execution_mode = requestedMode;
  state.run.planner_specs_source = toPosix(path.resolve(plannerSpecsDir));
  state.run.resolved_plan_inputs = modeInput.files.map((item) => toPosix(path.resolve(item)));
  state.run.report_state = classifyReportState({ runDir, workItemKey });

  phaseComplete(state.task, 'phase_0_preflight', 'phase_1_intake');

  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`EXECUTION_MODE=${requestedMode}\n`);

  return {
    workItemKey,
    runDir,
    executionMode: requestedMode,
  };
}

function commandPhase1(args) {
  ensureRequired(args['work-item-key'], 'work-item-key');
  const workItemKey = args['work-item-key'];
  const runDir = resolveRunDirFromArgs(args, workItemKey);

  const state = loadStateForRun({
    runDir,
    workItemKey,
    executionMode: 'planner_first',
    intentSourceType: 'feature_id',
    intentInputRaw: workItemKey,
    preRouteStatus: 'plan_exists',
    plannerPresolveInvoked: false,
    modeDecisionSource: 'r0_route',
    plannerInvocationRequired: false,
    planSourceKind: 'planner_output',
    planSourcePath: relativeToRoot(WORKSPACE_TESTER_ROOT, plannerPaths(workItemKey).specsDir),
    plannerSpecsSource: toPosix(plannerPaths(workItemKey).specsDir),
    frameworkProfile: 'projects/library-automation/.agents/context/framework-profile.json',
  });

  phaseStart(state.task, 'phase_1_intake');

  const intakeDir = path.join(LIB_AUTOMATION_DIR, `specs/feature-plan/${workItemKey}`);
  const targetRoot = path.join(LIB_AUTOMATION_DIR, `tests/specs/feature-plan/${workItemKey}`);
  const mode = sanitizeMode(state.task.execution_mode, 'planner_first');
  const resolvedInputs = dedupeSorted(state.run.resolved_plan_inputs);

  if (resolvedInputs.length === 0) {
    fail(`No resolved plan inputs found in run state: ${toPosix(path.join(runDir, 'run.json'))}`);
  }

  fs.rmSync(intakeDir, { recursive: true, force: true });
  ensureDir(intakeDir);

  const commonBase = commonParentDirectory(resolvedInputs) ?? path.dirname(resolvedInputs[0]);

  for (const sourcePath of resolvedInputs) {
    const sourceText = fs.readFileSync(sourcePath, 'utf8');
    const relative = toPosix(path.relative(commonBase, sourcePath));
    const ext = path.extname(sourcePath).toLowerCase();

    let destinationRelative = relative;
    let contentToWrite = sourceText;

    if (mode === 'direct') {
      const withoutExt = relative.replace(/\.[^.]+$/, '');
      destinationRelative = `${withoutExt}.md`;
      contentToWrite = buildDirectMarkdown({
        sourcePath,
        workItemKey,
        sourceText,
      });
    }

    if (mode !== 'direct' && ext !== '.md') {
      fail(`Non-markdown file found for mode ${mode}: ${toPosix(sourcePath)}`);
    }

    const destinationPath = path.join(intakeDir, destinationRelative);
    ensureDir(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, contentToWrite, 'utf8');
  }

  const manifest = buildSpecManifest({
    workItemKey,
    intakeDir,
    targetRoot,
    workspaceRoot: WORKSPACE_TESTER_ROOT,
  });

  if (manifest.spec_count === 0) {
    fail(`Intake manifest is empty for ${workItemKey}.`);
  }

  const manifestPath = path.join(runDir, 'context/spec_manifest.json');
  ensureDir(path.dirname(manifestPath));
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  state.run.intake_manifest_path = relativeToRoot(WORKSPACE_TESTER_ROOT, manifestPath);
  state.run.data_fetched_at = nowIso();

  phaseComplete(state.task, 'phase_1_intake', 'phase_2_generate');
  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`MANIFEST=${toPosix(manifestPath)}\n`);
}

function runGeneratorCommand({ generatorCmd, sourceMdPath, targetSpecPath, seedReference, frameworkProfilePath, workItemKey, runDir }) {
  return runCommand({
    command: generatorCmd,
    cwd: WORKSPACE_TESTER_ROOT,
    env: {
      WORK_ITEM_KEY: workItemKey,
      SOURCE_MARKDOWN: sourceMdPath,
      TARGET_SPEC_PATH: targetSpecPath,
      SEED_REFERENCE: seedReference,
      FRAMEWORK_PROFILE_PATH: frameworkProfilePath,
      RUN_DIR: runDir,
    },
  });
}

function commandPhase2(args) {
  ensureRequired(args['work-item-key'], 'work-item-key');
  const workItemKey = args['work-item-key'];
  const runDir = resolveRunDirFromArgs(args, workItemKey);

  const state = loadStateForRun({
    runDir,
    workItemKey,
    executionMode: 'planner_first',
    intentSourceType: 'feature_id',
    intentInputRaw: workItemKey,
    preRouteStatus: 'plan_exists',
    plannerPresolveInvoked: false,
    modeDecisionSource: 'r0_route',
    plannerInvocationRequired: false,
    planSourceKind: 'planner_output',
    planSourcePath: relativeToRoot(WORKSPACE_TESTER_ROOT, plannerPaths(workItemKey).specsDir),
    plannerSpecsSource: toPosix(plannerPaths(workItemKey).specsDir),
    frameworkProfile: 'projects/library-automation/.agents/context/framework-profile.json',
  });

  phaseStart(state.task, 'phase_2_generate');

  const manifestPath = path.join(runDir, 'context/spec_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    fail(`Manifest not found: ${toPosix(manifestPath)}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const specs = Array.isArray(manifest.specs) ? manifest.specs : [];
  if (specs.length === 0) {
    fail(`Manifest has no specs: ${toPosix(manifestPath)}`);
  }

  const frameworkProfileAbs = path.resolve(WORKSPACE_TESTER_ROOT, state.task.framework_profile);
  readFrameworkProfile(frameworkProfileAbs);

  const generatorCmd = args['generator-cmd'] || process.env.PLAYWRIGHT_GENERATOR_CMD || '';
  if (!generatorCmd) {
    fail(
      'Generation command is not configured.',
      'Set PLAYWRIGHT_GENERATOR_CMD (or pass --generator-cmd) to invoke your specialist generator.'
    );
  }
  const generated = new Set(state.run.generated_specs);
  const failedGeneration = [];

  for (const spec of specs) {
    const sourceMdPath = path.resolve(WORKSPACE_TESTER_ROOT, spec.source_path);
    const targetSpecPath = path.resolve(WORKSPACE_TESTER_ROOT, spec.target_spec_path);
    const markdown = fs.readFileSync(sourceMdPath, 'utf8');
    const seedReference = extractSeedReference(markdown);

    if (!seedReference) {
      fail(`Missing **Seed:** in intake markdown: ${toPosix(sourceMdPath)}`);
    }

    let result = runGeneratorCommand({
      generatorCmd,
      sourceMdPath,
      targetSpecPath,
      seedReference,
      frameworkProfilePath: frameworkProfileAbs,
      workItemKey,
      runDir,
    });

    if (result.code !== 0) {
      result = runGeneratorCommand({
        generatorCmd,
        sourceMdPath,
        targetSpecPath,
        seedReference,
        frameworkProfilePath: frameworkProfileAbs,
        workItemKey,
        runDir,
      });
    }

    if (result.code === 0) {
      generated.add(relativeToRoot(WORKSPACE_TESTER_ROOT, targetSpecPath));
    } else {
      failedGeneration.push(relativeToRoot(WORKSPACE_TESTER_ROOT, targetSpecPath));
    }
  }

  state.run.generated_specs = dedupeSorted([...generated]);
  state.run.failed_specs = dedupeSorted(failedGeneration);

  if (state.run.generated_specs.length === 0) {
    fail(`Generation produced no specs for ${workItemKey}.`);
  }

  phaseComplete(state.task, 'phase_2_generate', 'phase_3_execute');
  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`GENERATED_COUNT=${state.run.generated_specs.length}\n`);
  process.stdout.write(`GENERATION_FAILURE_COUNT=${state.run.failed_specs.length}\n`);
}

function commandPhase3(args) {
  ensureRequired(args['work-item-key'], 'work-item-key');
  const workItemKey = args['work-item-key'];
  const runDir = resolveRunDirFromArgs(args, workItemKey);

  const state = loadStateForRun({
    runDir,
    workItemKey,
    executionMode: 'planner_first',
    intentSourceType: 'feature_id',
    intentInputRaw: workItemKey,
    preRouteStatus: 'plan_exists',
    plannerPresolveInvoked: false,
    modeDecisionSource: 'r0_route',
    plannerInvocationRequired: false,
    planSourceKind: 'planner_output',
    planSourcePath: relativeToRoot(WORKSPACE_TESTER_ROOT, plannerPaths(workItemKey).specsDir),
    plannerSpecsSource: toPosix(plannerPaths(workItemKey).specsDir),
    frameworkProfile: 'projects/library-automation/.agents/context/framework-profile.json',
  });

  phaseStart(state.task, 'phase_3_execute');

  if (state.run.generated_specs.length === 0) {
    fail(`No generated specs available for execution: ${toPosix(path.join(runDir, 'run.json'))}`);
  }

  const testProject = typeof args.project === 'string'
    ? args.project
    : (process.env.PLAYWRIGHT_TEST_PROJECT || 'chromium').trim() || 'chromium';
  const commandTimeoutMsRaw = args['command-timeout-ms'] ?? process.env.PLAYWRIGHT_COMMAND_TIMEOUT_MS;
  const commandTimeoutMs = Number.isFinite(Number(commandTimeoutMsRaw))
    ? Number(commandTimeoutMsRaw)
    : undefined;
  const reportOutputPath = path.join(runDir, 'logs/phase3-playwright.json');
  const execution = runPlaywrightForSpecs({
    specPaths: state.run.generated_specs,
    reportOutputPath,
    project: testProject,
    timeoutMs: commandTimeoutMs,
  });

  state.run.failed_specs = execution.failedSpecs;

  phaseComplete(state.task, 'phase_3_execute', 'phase_4_heal');
  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`FAILED_COUNT=${state.run.failed_specs.length}\n`);
  if (execution.result.code !== 0) {
    process.stdout.write(`PHASE3_EXIT_CODE=${execution.result.code}\n`);
  }
}

function invokeHealer({ healerCmd, failedSpecs, workItemKey, runDir }) {
  if (!healerCmd) {
    return { code: 0, stdout: 'healer command not configured; skipped', stderr: '' };
  }

  return runCommand({
    command: healerCmd,
    cwd: WORKSPACE_TESTER_ROOT,
    env: {
      WORK_ITEM_KEY: workItemKey,
      FAILED_SPECS: failedSpecs.join(','),
      RUN_DIR: runDir,
      FRAMEWORK_PROFILE_PATH: path.resolve(WORKSPACE_TESTER_ROOT, 'projects/library-automation/.agents/context/framework-profile.json'),
    },
  });
}

function commandPhase4(args) {
  ensureRequired(args['work-item-key'], 'work-item-key');
  const workItemKey = args['work-item-key'];
  const runDir = resolveRunDirFromArgs(args, workItemKey);

  const state = loadStateForRun({
    runDir,
    workItemKey,
    executionMode: 'planner_first',
    intentSourceType: 'feature_id',
    intentInputRaw: workItemKey,
    preRouteStatus: 'plan_exists',
    plannerPresolveInvoked: false,
    modeDecisionSource: 'r0_route',
    plannerInvocationRequired: false,
    planSourceKind: 'planner_output',
    planSourcePath: relativeToRoot(WORKSPACE_TESTER_ROOT, plannerPaths(workItemKey).specsDir),
    plannerSpecsSource: toPosix(plannerPaths(workItemKey).specsDir),
    frameworkProfile: 'projects/library-automation/.agents/context/framework-profile.json',
  });

  phaseStart(state.task, 'phase_4_heal');

  if (!Array.isArray(state.run.failed_specs) || state.run.failed_specs.length === 0) {
    state.task.healing.status = 'not_started';
    state.task.healing.current_round = 0;
    phaseComplete(state.task, 'phase_4_heal', 'phase_5_finalize');
    saveState(state);

    process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
    process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
    process.stdout.write('HEALING_SKIPPED=true\n');
    return;
  }

  const maxRounds = 3;
  const testProject = typeof args.project === 'string'
    ? args.project
    : (process.env.PLAYWRIGHT_TEST_PROJECT || 'chromium').trim() || 'chromium';
  const commandTimeoutMsRaw = args['command-timeout-ms'] ?? process.env.PLAYWRIGHT_COMMAND_TIMEOUT_MS;
  const commandTimeoutMs = Number.isFinite(Number(commandTimeoutMsRaw))
    ? Number(commandTimeoutMsRaw)
    : undefined;
  const healerCmd = args['healer-cmd'] || process.env.PLAYWRIGHT_HEALER_CMD || '';
  let unresolved = [...state.run.failed_specs];
  let healingReportPath = null;

  for (let round = 1; round <= maxRounds; round += 1) {
    state.task.healing.current_round = round;
    state.task.healing.status = 'in_progress';
    saveState(state);

    const healer = invokeHealer({
      healerCmd,
      failedSpecs: unresolved,
      workItemKey,
      runDir,
    });

    if (healer.code !== 0) {
      process.stderr.write(`Healer command failed at round ${round}. Continuing rerun of failed specs.\n`);
    }

    const reportOutputPath = path.join(runDir, `logs/heal-round-${round}.json`);
    const rerun = runPlaywrightForSpecs({
      specPaths: unresolved,
      reportOutputPath,
      project: testProject,
      timeoutMs: commandTimeoutMs,
    });

    unresolved = rerun.failedSpecs;
    state.run.failed_specs = unresolved;

    if (unresolved.length === 0) {
      state.task.healing.status = 'passed';
      phaseComplete(state.task, 'phase_4_heal', 'phase_5_finalize');
      saveState(state);
      process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
      process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
      process.stdout.write(`HEALING_RESULT=passed\n`);
      process.stdout.write(`HEALING_ROUNDS=${round}\n`);
      return;
    }
  }

  state.task.healing.current_round = maxRounds;
  state.task.healing.status = 'failed';
  healingReportPath = writeHealingReport({ runDir, failedSpecs: unresolved, round: maxRounds });
  phaseComplete(state.task, 'phase_4_heal', 'phase_5_finalize');
  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`HEALING_RESULT=failed\n`);
  process.stdout.write(`HEALING_REPORT=${toPosix(healingReportPath)}\n`);
}

function commandPhase5(args) {
  ensureRequired(args['work-item-key'], 'work-item-key');
  const workItemKey = args['work-item-key'];
  const runDir = resolveRunDirFromArgs(args, workItemKey);

  const state = loadStateForRun({
    runDir,
    workItemKey,
    executionMode: 'planner_first',
    intentSourceType: 'feature_id',
    intentInputRaw: workItemKey,
    preRouteStatus: 'plan_exists',
    plannerPresolveInvoked: false,
    modeDecisionSource: 'r0_route',
    plannerInvocationRequired: false,
    planSourceKind: 'planner_output',
    planSourcePath: relativeToRoot(WORKSPACE_TESTER_ROOT, plannerPaths(workItemKey).specsDir),
    plannerSpecsSource: toPosix(plannerPaths(workItemKey).specsDir),
    frameworkProfile: 'projects/library-automation/.agents/context/framework-profile.json',
  });

  phaseStart(state.task, 'phase_5_finalize');

  const generatedCount = state.run.generated_specs.length;
  const failedCount = state.run.failed_specs.length;
  const finalStatus = failedCount > 0 ? 'failed' : 'completed';

  const summaryPath = path.join(runDir, 'reports/execution-summary.md');
  const healingReportPath = path.join(runDir, 'healing/healing_report.md');
  const summaryContent = [
    '# Execution Summary',
    '',
    `Work item key: ${workItemKey}`,
    `Completed at: ${nowIso()}`,
    `Final status: ${finalStatus}`,
    `Generated specs: ${generatedCount}`,
    `Failed specs: ${failedCount}`,
    '',
    '## Generated Specs',
    ...state.run.generated_specs.map((spec) => `- ${spec}`),
    '',
    '## Failed Specs',
    ...(failedCount > 0 ? state.run.failed_specs.map((spec) => `- ${spec}`) : ['- None']),
    '',
  ].join('\n');

  ensureDir(path.dirname(summaryPath));
  fs.writeFileSync(summaryPath, summaryContent, 'utf8');

  state.task.overall_status = finalStatus;
  state.run.output_generated_at = nowIso();
  state.run.report_state = finalStatus === 'completed' ? 'FINAL_EXISTS' : 'DRAFT_EXISTS';

  const payload = buildNotificationPayload({
    workItemKey,
    finalStatus,
    generatedCount,
    failedCount,
    summaryPath: relativeToRoot(WORKSPACE_TESTER_ROOT, summaryPath),
    healingReportPath: fs.existsSync(healingReportPath)
      ? relativeToRoot(WORKSPACE_TESTER_ROOT, healingReportPath)
      : null,
  });

  const notifyCmd = args['notify-cmd'] || process.env.FEISHU_NOTIFY_CMD || '';
  const chatId = process.env.FEISHU_CHAT_ID || parseFeishuChatId();

  if (notifyCmd) {
    const notify = runCommand({
      command: notifyCmd,
      cwd: WORKSPACE_TESTER_ROOT,
      env: {
        FEISHU_CHAT_ID: chatId,
        FEISHU_PAYLOAD: payload,
        WORK_ITEM_KEY: workItemKey,
      },
    });
    if (notify.code === 0) {
      state.run.notification_pending = null;
    } else {
      state.run.notification_pending = payload;
    }
  } else {
    state.run.notification_pending = payload;
  }

  phaseComplete(state.task, 'phase_5_finalize', 'phase_5_finalize');
  saveState(state);

  process.stdout.write(`WORK_ITEM_KEY=${workItemKey}\n`);
  process.stdout.write(`RUN_DIR=${toPosix(runDir)}\n`);
  process.stdout.write(`FINAL_STATUS=${finalStatus}\n`);
  process.stdout.write(`SUMMARY=${toPosix(summaryPath)}\n`);
}

function commandFull(args) {
  const initial = parseArgs([
    '--work-item-key',
    args['work-item-key'] || args['feature-id'] || args['issue-key'] || args.intent || '',
    ...(args['execution-mode'] ? ['--execution-mode', args['execution-mode']] : []),
    ...(args['planner-presolve-cmd'] ? ['--planner-presolve-cmd', args['planner-presolve-cmd']] : []),
  ]);

  const intent = resolveIntent(initial);
  if (!intent) {
    fail('full flow requires --work-item-key, --feature-id, --issue-key, or --intent.');
  }

  const r0Result = commandR0({
    'work-item-key': intent.workItemKey,
    ...(args['execution-mode'] ? { 'execution-mode': args['execution-mode'] } : {}),
    ...(args['planner-presolve-cmd'] ? { 'planner-presolve-cmd': args['planner-presolve-cmd'] } : {}),
  });

  const phase0Result = commandPhase0({
    'work-item-key': intent.workItemKey,
    ...(args['execution-mode'] ? { 'execution-mode': args['execution-mode'] } : {}),
    ...(args['new-run-on-mode-change'] !== undefined
      ? { 'new-run-on-mode-change': args['new-run-on-mode-change'] }
      : {}),
    ...(args['planner-specs-dir'] ? { 'planner-specs-dir': args['planner-specs-dir'] } : {}),
    ...(args['framework-profile'] ? { 'framework-profile': args['framework-profile'] } : {}),
    ...(getListArg(args, 'provided-plan').length > 0 ? { 'provided-plan': getListArg(args, 'provided-plan') } : {}),
    ...(getListArg(args, 'requirements').length > 0 ? { requirements: getListArg(args, 'requirements') } : {}),
  });

  const activeRunDir = phase0Result?.runDir ?? r0Result?.runDir ?? resolveRunDirFromArgs({ 'work-item-key': intent.workItemKey }, intent.workItemKey);

  const phaseArgs = { 'work-item-key': intent.workItemKey, 'run-dir': activeRunDir };
  if (typeof args.project === 'string') phaseArgs.project = args.project;

  commandPhase1(phaseArgs);
  commandPhase2(phaseArgs);
  commandPhase3(phaseArgs);
  commandPhase4(phaseArgs);
  commandPhase5(phaseArgs);
}

function printHelp() {
  const lines = [
    'Usage: runner.mjs <command> [options]',
    '',
    'Commands:',
    '  r0',
    '  phase0',
    '  phase1',
    '  phase2',
    '  phase3',
    '  phase4',
    '  phase5',
    '  full',
    '',
    'Common options:',
    '  --work-item-key <key>',
    '  --execution-mode <planner_first|direct|provided_plan>',
    '  --new-run-on-mode-change <true|false>',
    '  --planner-specs-dir <path>',
    '  --provided-plan <path>  (repeatable)',
    '  --requirements <path>   (repeatable)',
    '  --run-dir <path>',
    '  --project <name>   (default: chromium; Playwright project for Phase 3/4)',
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
}

function main() {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (!command || command === 'help' || command === '--help') {
    printHelp();
    return;
  }

  try {
    if (command === 'r0') {
      commandR0(args);
      return;
    }
    if (command === 'phase0') {
      commandPhase0(args);
      return;
    }
    if (command === 'phase1') {
      commandPhase1(args);
      return;
    }
    if (command === 'phase2') {
      commandPhase2(args);
      return;
    }
    if (command === 'phase3') {
      commandPhase3(args);
      return;
    }
    if (command === 'phase4') {
      commandPhase4(args);
      return;
    }
    if (command === 'phase5') {
      commandPhase5(args);
      return;
    }
    if (command === 'full') {
      commandFull(args);
      return;
    }
    fail(`Unsupported command: ${command}`);
  } catch (error) {
    fail(`tester-flow ${command} failed: ${error.message}`, error.stack);
  }
}

main();
