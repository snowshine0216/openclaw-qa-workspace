import { randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

export const PHASE_ORDER = [
  'phase_0_runtime_setup',
  'phase_1_evidence_gathering',
  'phase_2_artifact_index',
  'phase_3_coverage_mapping',
  'phase_4a_subcategory_draft',
  'phase_4b_top_category_draft',
  'phase_5a_review_refactor',
  'phase_5b_checkpoint_refactor',
  'phase_6_quality_refactor',
  'phase_7_finalization',
];

const PHASE_INDEX = new Map(PHASE_ORDER.map((phase, index) => [phase, index]));
const ACTIVE_STATUSES = new Set(['in_progress', 'awaiting_approval', 'blocked']);

export function nowIso() {
  return new Date().toISOString();
}

export function nowCompactTimestamp() {
  return nowIso().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z').replace('T', '_');
}

export async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function ensureProjectDirs(projectDir) {
  await mkdir(join(projectDir, 'context'), { recursive: true });
  await mkdir(join(projectDir, 'drafts'), { recursive: true });
}

export async function readJson(path, fallback = null) {
  try {
    const content = await readFile(path, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function normalizeRequestedSourceFamilies(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim().toLowerCase()).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function defaultTask(featureId, runKey) {
  const timestamp = nowIso();
  return {
    feature_id: featureId,
    run_key: runKey,
    overall_status: 'not_started',
    current_phase: null,
    report_state: 'FRESH',
    selected_mode: null,
    requested_source_families: ['jira'],
    completed_source_families: [],
    has_supporting_artifacts: false,
    spawn_plan: [],
    artifacts: {},
    latest_draft_version: null,
    latest_draft_path: null,
    latest_draft_phase: null,
    latest_review_version: null,
    latest_validation_version: null,
    phase4a_round: 0,
    phase4b_round: 0,
    phase5a_round: 0,
    phase5b_round: 0,
    phase6_round: 0,
    return_to_phase: null,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export function defaultRun(runKey) {
  const timestamp = nowIso();
  return {
    run_key: runKey,
    started_at: timestamp,
    updated_at: timestamp,
    runtime_setup_generated_at: null,
    data_fetched_at: null,
    artifact_index_generated_at: null,
    coverage_ledger_generated_at: null,
    draft_generated_at: null,
    review_completed_at: null,
    refactor_completed_at: null,
    finalized_at: null,
    notification_pending: false,
    has_supporting_artifacts: false,
    spawn_history: [],
    validation_history: [],
    blocking_issues: [],
  };
}

export async function loadState(featureId, projectDir, options = {}) {
  await ensureProjectDirs(projectDir);
  const taskPath = join(projectDir, 'task.json');
  const runPath = join(projectDir, 'run.json');
  const envRunKey = String(options.runKey || process.env.FQPO_RUN_KEY || '').trim();
  const existingTask = await readJson(taskPath, null);
  const runKey = envRunKey || existingTask?.run_key || randomUUID();
  const task = existingTask ? { ...defaultTask(featureId, runKey), ...existingTask } : defaultTask(featureId, runKey);
  const run = (await readJson(runPath, null))
    ? { ...defaultRun(runKey), ...(await readJson(runPath, {})) }
    : defaultRun(runKey);

  task.feature_id = featureId;
  task.run_key = task.run_key || runKey;
  run.run_key = run.run_key || task.run_key;
  task.updated_at = task.updated_at || nowIso();
  run.updated_at = run.updated_at || nowIso();

  return { taskPath, runPath, task, run };
}

export async function saveState({ taskPath, runPath, task, run }) {
  const timestamp = nowIso();
  task.updated_at = timestamp;
  run.updated_at = timestamp;
  await writeJson(taskPath, task);
  await writeJson(runPath, run);
}

export async function classifyReportState(projectDir) {
  const contextDir = join(projectDir, 'context');
  const draftsDir = join(projectDir, 'drafts');
  const finalExists = await fileExists(join(projectDir, 'qa_plan_final.md'));
  if (finalExists) return 'FINAL_EXISTS';

  const draftFiles = await safeReadDir(draftsDir);
  if (draftFiles.some((name) => /^qa_plan_v\d+\.md$/.test(name) || /^qa_plan_(subcategory|phase\d+[ab]?_r\d+)\.md$/.test(name) || /^qa_plan_phase[456][ab]?_r\d+\.md$/.test(name) || /^qa_plan_subcategory_/.test(name))) {
    return 'DRAFT_EXISTS';
  }

  const contextFiles = await safeReadDir(contextDir);
  if (contextFiles.some((name) => name.endsWith('.md') || name.endsWith('.json'))) {
    return 'CONTEXT_ONLY';
  }

  return 'FRESH';
}

export function isActiveStatus(status) {
  return ACTIVE_STATUSES.has(String(status || '').trim());
}

export function isPhasePast(currentPhase, targetPhase) {
  const currentIndex = PHASE_INDEX.get(currentPhase);
  const targetIndex = PHASE_INDEX.get(targetPhase);
  if (currentIndex == null || targetIndex == null) return false;
  return currentIndex > targetIndex;
}

export function getNextPhaseRound(task, phaseId) {
  const key = `${phaseId}_round`;
  const current = Number(task?.[key] || 0);
  return current + 1;
}

export function updateLatestDraftMetadata(task, filename, phaseId = null) {
  const basenameValue = basename(filename);
  const versionMatch = basenameValue.match(/^qa_plan_v(\d+)\.md$/);
  if (versionMatch) {
    task.latest_draft_version = Number(versionMatch[1]);
  }

  const phaseMatch = basenameValue.match(/^qa_plan_(phase\d+[ab]?|subcategory)_r(\d+)\.md$/);
  if (phaseMatch) {
    const normalizedPhase = phaseId || phaseMatch[1];
    task.latest_draft_phase = normalizedPhase;
    task.latest_draft_path = filename;
    task[`${normalizedPhase}_round`] = Number(phaseMatch[2]);
    return;
  }

  if (phaseId) {
    task.latest_draft_phase = phaseId;
  }
  task.latest_draft_path = filename;
}

export function resolveProjectPaths(projectDir, featureId) {
  return {
    projectDir,
    contextDir: join(projectDir, 'context'),
    draftsDir: join(projectDir, 'drafts'),
    taskPath: join(projectDir, 'task.json'),
    runPath: join(projectDir, 'run.json'),
    artifactLookupPath: join(projectDir, 'context', `artifact_lookup_${featureId}.md`),
  };
}

async function safeReadDir(path) {
  try {
    return await readdir(path);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}
