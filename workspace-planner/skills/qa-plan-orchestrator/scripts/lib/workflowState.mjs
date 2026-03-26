import { randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import { access, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRunRoot } from '../../../../../.agents/skills/lib/artifactRoots.mjs';

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
const ROUND_TRACKED_PHASES = ['phase4a', 'phase4b', 'phase5a', 'phase5b', 'phase6'];
const MODULE_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(MODULE_DIR, '..', '..');
const REPO_ROOT = resolve(SKILL_ROOT, '..', '..', '..');
export const DEFAULT_SUPPORTING_ISSUE_POLICY = 'context_only_no_defect_analysis';
export const DEFAULT_DEEP_RESEARCH_POLICY = 'tavily_first_confluence_second';
export const DEFAULT_DEEP_RESEARCH_TOPICS = [];
const REQUEST_PHASES = new Set(['phase0', 'phase1', 'phase2', 'phase3', 'phase4a', 'phase4b', 'phase5a', 'phase5b', 'phase6', 'phase7']);
const GENERATED_REQUEST_COMMAND_IDS = new Set([
  'cmd-research-tool-order',
  'cmd-support-mode-guardrail',
  'cmd-support-relation-expansion',
]);
const GENERATED_REQUEST_MATERIAL_PREFIXES = [
  'material-feature-',
  'material-confluence-',
  'material-support-',
  'material-research-',
];
const GENERATED_REQUEST_REQUIREMENT_PREFIXES = [
  'req-read-primary-confluence',
  'req-read-support-',
  'req-summarize-support-',
  'req-save-support-summary',
  'req-support-only-mode',
  'req-no-defect-analysis',
  'req-research-',
];

export function getSkillRoot() {
  return resolveCanonicalSkillRoot();
}

function resolveCanonicalSkillRoot() {
  const overridden = String(process.env.FQPO_CANONICAL_SKILL_ROOT || '').trim();
  if (!overridden) {
    return SKILL_ROOT;
  }
  const snapshotRootName = basename(SKILL_ROOT);
  if (snapshotRootName === 'candidate_snapshot' || snapshotRootName === 'champion_snapshot') {
    return overridden;
  }
  return SKILL_ROOT;
}

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

export async function ensureRunDirs(runDir) {
  await mkdir(join(runDir, 'context'), { recursive: true });
  await mkdir(join(runDir, 'drafts'), { recursive: true });
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

function ensureRequestedSourceFamilies(task) {
  const requested = normalizeRequestedSourceFamilies(task.requested_source_families);
  const normalized = requested.length > 0 ? requested : ['jira'];
  if (String(task.seed_confluence_url || '').trim() && !normalized.includes('confluence')) {
    normalized.push('confluence');
  }
  task.requested_source_families = normalized;
}

export function defaultTask(featureId, runKey) {
  const timestamp = nowIso();
  return {
    feature_id: featureId,
    primary_feature_id: featureId,
    feature_family: null,
    seed_confluence_url: null,
    knowledge_pack_key: null,
    requested_knowledge_pack_key: null,
    resolved_knowledge_pack_key: null,
    knowledge_pack_resolution_source: null,
    knowledge_pack_version: null,
    knowledge_pack_path: null,
    knowledge_pack_row_count: 0,
    knowledge_pack_deep_research_topics: [],
    supporting_issue_keys: [],
    supporting_issue_policy: DEFAULT_SUPPORTING_ISSUE_POLICY,
    deep_research_policy: DEFAULT_DEEP_RESEARCH_POLICY,
    deep_research_topics: [],
    supporting_summary_required: false,
    request_fulfillment_required: true,
    request_requirements: [],
    request_materials: [],
    request_commands: [],
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
    supporting_context_generated_at: null,
    deep_research_generated_at: null,
    deep_research_fallback_used: false,
    knowledge_pack_loaded_at: null,
    knowledge_pack_summary_generated_at: null,
    knowledge_pack_retrieval_generated_at: null,
    knowledge_pack_retrieval_mode: null,
    knowledge_pack_semantic_mode: 'disabled',
    knowledge_pack_semantic_warning: null,
    knowledge_pack_summary_artifact: null,
    knowledge_pack_retrieval_artifact: null,
    knowledge_pack_index_artifact: null,
    request_fulfillment_generated_at: null,
    has_supporting_artifacts: false,
    spawn_history: [],
    request_execution_log: [],
    unsatisfied_request_requirements: [],
    validation_history: [],
    blocking_issues: [],
  };
}

export async function loadState(featureId, runDir, options = {}) {
  const migration = await maybeMigrateLegacyRun(featureId, runDir);
  await ensureRunDirs(runDir);
  const taskPath = join(runDir, 'task.json');
  const runPath = join(runDir, 'run.json');
  const envRunKey = String(options.runKey || process.env.FQPO_RUN_KEY || '').trim();
  const existingTask = await readJson(taskPath, null);
  const persistedTask = existingTask ? { ...existingTask } : null;
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
  applyRequestModel(task, featureId);
  if (migration.migrated) {
    task.legacy_project_dir = migration.legacyRunDir;
    task.migrated_from_legacy_at = task.migrated_from_legacy_at || migration.migratedAt;
    run.legacy_migration = run.legacy_migration || {
      source: migration.legacyRunDir,
      migrated_at: migration.migratedAt,
    };
  }

  await syncTaskDraftState(task, runDir);

  return { taskPath, runPath, task, run, persistedTask };
}

export async function saveState({ taskPath, runPath, task, run }) {
  const timestamp = nowIso();
  task.updated_at = timestamp;
  run.updated_at = timestamp;
  await writeJson(taskPath, task);
  await writeJson(runPath, run);
}

export async function classifyReportState(runDir) {
  const contextDir = join(runDir, 'context');
  const draftsDir = join(runDir, 'drafts');
  const finalExists = await fileExists(join(runDir, 'qa_plan_final.md'));
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

export async function syncTaskDraftState(task, runDir) {
  const draftsByPhase = await listLatestDraftsByPhase(runDir);

  for (const phaseId of ROUND_TRACKED_PHASES) {
    const key = `${phaseId}_round`;
    const existingRound = Number(task?.[key] || 0);
    const discoveredRound = draftsByPhase.get(phaseId)?.round || 0;
    task[key] = Math.max(existingRound, discoveredRound);
  }

  const latestPhase = String(task?.latest_draft_phase || '').trim();
  if (latestPhase && draftsByPhase.has(latestPhase)) {
    const currentRound = parseRoundFromDraftName(basename(String(task?.latest_draft_path || '')));
    const discovered = draftsByPhase.get(latestPhase);
    if (currentRound < discovered.round) {
      task.latest_draft_path = discovered.relativePath;
    }
    return task;
  }

  if (!String(task?.latest_draft_path || '').trim()) {
    const latestDiscovered = findLatestDiscoveredDraft(draftsByPhase);
    if (latestDiscovered) {
      task.latest_draft_phase = latestDiscovered.phaseId;
      task.latest_draft_path = latestDiscovered.relativePath;
    }
  }

  return task;
}

export function resolveRunPaths(runDir, featureId) {
  return {
    runDir,
    contextDir: join(runDir, 'context'),
    draftsDir: join(runDir, 'drafts'),
    taskPath: join(runDir, 'task.json'),
    runPath: join(runDir, 'run.json'),
    artifactLookupPath: join(runDir, 'context', `artifact_lookup_${featureId}.md`),
  };
}

export function resolveDefaultRunDir(featureId, cwd = process.cwd()) {
  void cwd;
  const override = String(process.env.FQPO_RUN_DIR || '').trim();
  if (override) {
    return resolve(override);
  }
  return getRunRoot('workspace-planner', 'qa-plan-orchestrator', featureId);
}

export function normalizeIssueKeys(value) {
  const raw = Array.isArray(value)
    ? value
    : String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  return [...new Set(raw.map((item) => String(item || '').trim().toUpperCase()).filter(Boolean))];
}

function normalizeTopics(value) {
  const topics = Array.isArray(value) ? value : [];
  return [...new Set(topics.map((item) => String(item || '').trim()).filter(Boolean))];
}

function mergeRecordsById(existing, generated, idKey) {
  const merged = Array.isArray(existing) ? [...existing] : [];
  const seen = new Set(merged.map((entry) => String(entry?.[idKey] || '').trim()).filter(Boolean));
  for (const entry of Array.isArray(generated) ? generated : []) {
    const id = String(entry?.[idKey] || '').trim();
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    merged.push(entry);
  }
  return merged;
}

function replaceGeneratedRecords(existing, generated, idKey, isGeneratedId) {
  const preserved = Array.isArray(existing)
    ? existing.filter((entry) => !isGeneratedId(String(entry?.[idKey] || '').trim()))
    : [];
  return mergeRecordsById(preserved, generated, idKey);
}

function hasGeneratedPrefix(id, prefixes) {
  return prefixes.some((prefix) => id.startsWith(prefix));
}

function parseRawRequestText(task = {}) {
  const text = String(task.raw_user_request_text || task.user_request_text || '').trim();
  if (!text) return;

  if (!task.seed_confluence_url) {
    const confluenceUrl = text.match(/https?:\/\/[^\s)]+atlassian\.net\/wiki\/[^\s)]+/i)?.[0] || '';
    if (confluenceUrl) {
      task.seed_confluence_url = confluenceUrl;
    }
  }

  if (!Array.isArray(task.supporting_issue_keys) || task.supporting_issue_keys.length === 0) {
    const supportKeys = (text.match(/[A-Z][A-Z0-9]+-\d+/g) || [])
      .filter((issueKey) => String(issueKey).toUpperCase() !== String(task.feature_id || '').toUpperCase());
    task.supporting_issue_keys = normalizeIssueKeys(supportKeys);
  }

  const topics = [];
  if (/report editor.*workstation|workstation.*report editor/i.test(text)) {
    topics.push('report_editor_workstation_functionality');
  }
  if (/library\s+vs\s+workstation|library-vs-workstation/i.test(text)) {
    topics.push('report_editor_library_vs_workstation_gap');
  }
  task.deep_research_topics = normalizeTopics([
    ...normalizeTopics(task.deep_research_topics),
    ...topics,
  ]);

  if (/do not enter defect-analysis mode|support-only|context only/i.test(text)) {
    task.supporting_issue_policy = DEFAULT_SUPPORTING_ISSUE_POLICY;
  }
  if (/tavily-search\s+first.*confluence\s+second|confluence\s+second.*tavily-search\s+first/i.test(text)) {
    task.deep_research_policy = DEFAULT_DEEP_RESEARCH_POLICY;
  }
}

function phaseToken(phaseId) {
  const normalized = String(phaseId || '').trim().toLowerCase();
  return REQUEST_PHASES.has(normalized) ? normalized : 'phase7';
}

function createRequirement({
  requirementId,
  kind,
  userText,
  requiredPhase,
  requiredArtifacts = [],
  successPredicate,
  blockingOnMissing = true,
}) {
  return {
    requirement_id: requirementId,
    kind,
    user_text: userText,
    required_phase: phaseToken(requiredPhase),
    required_artifacts: requiredArtifacts,
    success_predicate: successPredicate,
    blocking_on_missing: Boolean(blockingOnMissing),
  };
}

function buildRequestMaterials(task, featureId) {
  const materials = [
    {
      material_id: `material-feature-${featureId}`,
      material_type: 'feature_id',
      source_value: featureId,
      role: 'primary_feature',
      must_read: true,
      must_summarize: false,
    },
  ];
  const confluenceUrl = String(task.seed_confluence_url || '').trim();
  if (confluenceUrl) {
    materials.push({
      material_id: `material-confluence-${featureId}`,
      material_type: 'confluence_url',
      source_value: confluenceUrl,
      role: 'primary_design_doc',
      must_read: true,
      must_summarize: false,
    });
  }
  for (const issueKey of normalizeIssueKeys(task.supporting_issue_keys)) {
    materials.push({
      material_id: `material-support-${issueKey}`,
      material_type: 'jira_issue',
      source_value: issueKey,
      role: 'supporting_issue',
      must_read: true,
      must_summarize: true,
    });
  }
  for (const topic of normalizeTopics(task.deep_research_topics)) {
    materials.push({
      material_id: `material-research-${topic}`,
      material_type: 'research_topic',
      source_value: topic,
      role: 'deep_research_topic',
      must_read: true,
      must_summarize: true,
    });
  }
  return materials;
}

function buildRequestCommands() {
  return [
    {
      command_id: 'cmd-research-tool-order',
      policy_type: 'tool_order',
      command_text: 'use tavily-search before confluence for deep research',
      enforced_by_phase: 'phase3',
      failure_message: 'Deep research must execute tavily-search before any confluence fallback.',
    },
    {
      command_id: 'cmd-support-mode-guardrail',
      policy_type: 'mode_guardrail',
      command_text: 'keep supporting issues in context_only_no_defect_analysis mode',
      enforced_by_phase: 'phase0',
      failure_message: 'Supporting issues are context evidence only and must not enter defect-analysis mode.',
    },
    {
      command_id: 'cmd-support-relation-expansion',
      policy_type: 'relation_expansion',
      command_text: 'expand parent plus linked inward and linked outward support-issue relations',
      enforced_by_phase: 'phase1',
      failure_message: 'Supporting issue digestion must include parent chain and linked relations.',
    },
  ];
}

function buildRequestRequirements(task, featureId) {
  const requirements = [];
  const confluenceUrl = String(task.seed_confluence_url || '').trim();
  if (confluenceUrl) {
    requirements.push(createRequirement({
      requirementId: 'req-read-primary-confluence',
      kind: 'read_material',
      userText: `read the primary Confluence page ${confluenceUrl}`,
      requiredPhase: 'phase1',
      requiredArtifacts: [`context/confluence_design_${featureId}.md`],
      successPredicate: 'primary confluence evidence exists',
    }));
  }

  const supportKeys = normalizeIssueKeys(task.supporting_issue_keys);
  for (const issueKey of supportKeys) {
    requirements.push(createRequirement({
      requirementId: `req-read-support-issue-${issueKey}`,
      kind: 'read_material',
      userText: `read Jira issue ${issueKey}`,
      requiredPhase: 'phase1',
      requiredArtifacts: [`context/supporting_issue_summary_${issueKey}_${featureId}.md`],
      successPredicate: 'supporting issue summary exists',
    }));
    requirements.push(createRequirement({
      requirementId: `req-read-support-description-${issueKey}`,
      kind: 'read_material',
      userText: `read the ${issueKey} description`,
      requiredPhase: 'phase1',
      requiredArtifacts: [`context/supporting_issue_summary_${issueKey}_${featureId}.md`],
      successPredicate: 'supporting issue summary captures description evidence',
    }));
    requirements.push(createRequirement({
      requirementId: `req-read-support-links-${issueKey}`,
      kind: 'read_material',
      userText: `read linked issues for ${issueKey}`,
      requiredPhase: 'phase1',
      requiredArtifacts: [`context/supporting_issue_relation_map_${featureId}.md`],
      successPredicate: 'supporting issue relation map includes linked issues',
    }));
    requirements.push(createRequirement({
      requirementId: `req-read-support-parent-${issueKey}`,
      kind: 'read_material',
      userText: `read parent issues for ${issueKey}`,
      requiredPhase: 'phase1',
      requiredArtifacts: [`context/supporting_issue_relation_map_${featureId}.md`],
      successPredicate: 'supporting issue relation map includes parent chain',
    }));
    requirements.push(createRequirement({
      requirementId: `req-summarize-support-${issueKey}`,
      kind: 'summarize_material',
      userText: `summarize ${issueKey} and its relations`,
      requiredPhase: 'phase1',
      requiredArtifacts: [
        `context/supporting_issue_summary_${issueKey}_${featureId}.md`,
        `context/supporting_issue_summary_${featureId}.md`,
      ],
      successPredicate: 'per-issue and aggregate support summaries exist',
    }));
  }

  if (supportKeys.length > 0) {
    requirements.push(createRequirement({
      requirementId: 'req-save-support-summary',
      kind: 'summarize_material',
      userText: 'save the support summary for future reference',
      requiredPhase: 'phase1',
      requiredArtifacts: [
        `context/supporting_issue_relation_map_${featureId}.md`,
        `context/supporting_issue_summary_${featureId}.md`,
      ],
      successPredicate: 'support relation map and aggregate support summary exist',
    }));
    requirements.push(createRequirement({
      requirementId: 'req-support-only-mode',
      kind: 'preserve_mode',
      userText: 'keep supporting issues in support-only mode',
      requiredPhase: 'phase0',
      requiredArtifacts: [`context/supporting_issue_request_${featureId}.md`],
      successPredicate: 'supporting issue policy is context_only_no_defect_analysis',
    }));
    requirements.push(createRequirement({
      requirementId: 'req-no-defect-analysis',
      kind: 'preserve_mode',
      userText: 'do not enter defect-analysis mode',
      requiredPhase: 'phase1',
      requiredArtifacts: [
        `context/supporting_issue_request_${featureId}.md`,
        `context/supporting_issue_summary_${featureId}.md`,
      ],
      successPredicate: 'no defect-analysis artifacts or routing appear in the workflow',
    }));
  }

  const topicRequirements = {
    report_editor_workstation_functionality: {
      id: 'req-research-report-editor-workstation',
      text: 'research report-editor functionality in Workstation',
      artifact: `context/deep_research_tavily_report_editor_workstation_${featureId}.md`,
    },
    report_editor_library_vs_workstation_gap: {
      id: 'req-research-library-vs-workstation-gap',
      text: 'research the Library vs Workstation report-editor gap',
      artifact: `context/deep_research_tavily_library_vs_workstation_gap_${featureId}.md`,
    },
  };
  for (const topic of normalizeTopics(task.deep_research_topics)) {
    const config = topicRequirements[topic] || {
      id: `req-research-${topic}`,
      text: `research ${topic}`,
      artifact: `context/deep_research_tavily_${topic}_${featureId}.md`,
    };
    requirements.push(createRequirement({
      requirementId: config.id,
      kind: 'perform_research',
      userText: config.text,
      requiredPhase: 'phase3',
      requiredArtifacts: [config.artifact],
      successPredicate: 'tavily-first research artifact exists',
    }));
  }
  if (normalizeTopics(task.deep_research_topics).length > 0) {
    requirements.push(createRequirement({
      requirementId: 'req-research-tool-order',
      kind: 'run_command_policy',
      userText: 'use tavily-search before confluence',
      requiredPhase: 'phase3',
      requiredArtifacts: [`context/deep_research_synthesis_report_editor_${featureId}.md`],
      successPredicate: 'tavily evidence recorded before any confluence fallback',
    }));
  }
  return requirements;
}

export function applyRequestModel(task, featureId = task?.feature_id || '') {
  const normalizedFeatureId = String(featureId || task?.feature_id || '').trim();
  task.primary_feature_id = String(task.primary_feature_id || normalizedFeatureId || '').trim();
  parseRawRequestText(task);
  task.seed_confluence_url = String(task.seed_confluence_url || '').trim() || null;
  ensureRequestedSourceFamilies(task);
  task.feature_family = String(task.feature_family || '').trim() || null;
  task.knowledge_pack_key = String(task.knowledge_pack_key || '').trim() || null;
  task.requested_knowledge_pack_key = String(
    task.requested_knowledge_pack_key
    || (!task.resolved_knowledge_pack_key ? task.knowledge_pack_key : '')
    || '',
  ).trim() || null;
  task.resolved_knowledge_pack_key = String(task.resolved_knowledge_pack_key || '').trim() || null;
  task.knowledge_pack_resolution_source = String(task.knowledge_pack_resolution_source || '').trim() || null;
  task.knowledge_pack_version = String(task.knowledge_pack_version || '').trim() || null;
  task.knowledge_pack_path = String(task.knowledge_pack_path || '').trim() || null;
  task.knowledge_pack_row_count = Number(task.knowledge_pack_row_count || 0);
  task.knowledge_pack_deep_research_topics = normalizeTopics(task.knowledge_pack_deep_research_topics);
  task.supporting_issue_keys = normalizeIssueKeys(task.supporting_issue_keys);
  task.supporting_issue_policy = String(task.supporting_issue_policy || DEFAULT_SUPPORTING_ISSUE_POLICY).trim();
  task.deep_research_policy = String(task.deep_research_policy || DEFAULT_DEEP_RESEARCH_POLICY).trim();
  task.deep_research_topics = normalizeTopics([
    ...normalizeTopics(task.deep_research_topics),
    ...task.knowledge_pack_deep_research_topics,
  ]);
  task.supporting_summary_required = task.supporting_issue_keys.length > 0;
  task.request_fulfillment_required = task.request_fulfillment_required !== false;
  task.request_materials = replaceGeneratedRecords(
    task.request_materials,
    buildRequestMaterials(task, normalizedFeatureId),
    'material_id',
    (id) => hasGeneratedPrefix(id, GENERATED_REQUEST_MATERIAL_PREFIXES),
  );
  task.request_commands = replaceGeneratedRecords(
    task.request_commands,
    buildRequestCommands(),
    'command_id',
    (id) => GENERATED_REQUEST_COMMAND_IDS.has(id),
  );
  task.request_requirements = replaceGeneratedRecords(
    task.request_requirements,
    buildRequestRequirements(task, normalizedFeatureId),
    'requirement_id',
    (id) => hasGeneratedPrefix(id, GENERATED_REQUEST_REQUIREMENT_PREFIXES),
  );
  return task;
}

export function buildRequestFulfillmentModel(task, featureId = task?.feature_id || '') {
  const normalizedFeatureId = String(featureId || task?.feature_id || '').trim();
  const requirements = Array.isArray(task.request_requirements) ? task.request_requirements : [];
  return {
    feature_id: normalizedFeatureId,
    generated_at: nowIso(),
    requirements: requirements.map((requirement) => ({
      requirement_id: requirement.requirement_id,
      user_text: requirement.user_text,
      required_phase: phaseToken(requirement.required_phase),
      required_artifacts: requirement.required_artifacts || [],
      blocking_on_missing: Boolean(requirement.blocking_on_missing),
      status: 'pending',
      evidence_artifacts: [],
      blocker_or_waiver_reason: '',
    })),
  };
}

export function resolveLegacyRunDir(featureId) {
  return resolve(resolveCanonicalSkillRoot(), 'runs', featureId);
}

async function maybeMigrateLegacyRun(featureId, runDir) {
  const override = String(process.env.FQPO_RUN_DIR || '').trim();
  if (override) {
    return { migrated: false, legacyRunDir: '' };
  }

  const canonicalExists = await fileExists(runDir);
  const legacyRunDir = resolveLegacyRunDir(featureId);
  const legacyExists = await fileExists(legacyRunDir);

  if (canonicalExists && legacyExists) {
    throw new Error(
      `MIGRATION_CONFLICT: Both canonical run (${runDir}) and legacy run (${legacyRunDir}) exist. ` +
      `Resolve manually by removing one or set FQPO_RUN_DIR to choose explicitly.`
    );
  }

  if (!canonicalExists && legacyExists) {
    throw new Error(
      `MIGRATION_REQUIRED: Legacy run exists at ${legacyRunDir} but canonical location ${runDir} is empty. ` +
      `Run migration script first before proceeding.`
    );
  }

  return { migrated: false, legacyRunDir: '' };
}

async function safeReadDir(path) {
  try {
    return await readdir(path);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function listLatestDraftsByPhase(runDir) {
  const draftsDir = join(runDir, 'drafts');
  const entries = await safeReadDir(draftsDir);
  const latest = new Map();

  for (const name of entries) {
    const match = name.match(/^qa_plan_(phase\d+[ab]?|subcategory)_r(\d+)\.md$/);
    if (!match) continue;
    const phaseId = normalizeDraftPhase(match[1]);
    const round = Number(match[2]);
    const current = latest.get(phaseId);
    if (!current || round > current.round) {
      latest.set(phaseId, {
        phaseId,
        round,
        relativePath: join('drafts', name),
      });
    }
  }

  return latest;
}

function normalizeDraftPhase(rawPhase) {
  return rawPhase === 'subcategory' ? 'phase4a' : rawPhase;
}

function parseRoundFromDraftName(name) {
  const match = String(name || '').match(/_r(\d+)\.md$/);
  return match ? Number(match[1]) : 0;
}

function findLatestDiscoveredDraft(draftsByPhase) {
  let latest = null;
  for (const phaseId of ROUND_TRACKED_PHASES) {
    const draft = draftsByPhase.get(phaseId);
    if (!draft) continue;
    latest = draft;
  }
  return latest;
}
