import {
  statSync,
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
export function detectReportStateSync(runRoot) {
  const finalPath = join(runRoot, 'evolution_final.md');
  if (existsSync(finalPath)) return 'FINAL_EXISTS';

  const candidates = join(runRoot, 'candidates');
  if (existsSync(candidates)) {
    const it = readdirSync(candidates);
    if (it.some((n) => n.startsWith('iteration-'))) return 'DRAFT_EXISTS';
  }

  const ctx = join(runRoot, 'context');
  if (existsSync(ctx)) {
    const files = readdirSync(ctx);
    if (files.some((f) => f.includes('gap_taxonomy') || f.includes('evidence_freshness'))) {
      return 'CONTEXT_ONLY';
    }
  }

  return 'FRESH';
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJson(path, obj) {
  const text = `${JSON.stringify(obj, null, 2)}\n`;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      writeFileSync(path, text, 'utf8');
      return;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export function loadTask(runRoot) {
  const p = join(runRoot, 'task.json');
  if (!existsSync(p)) return null;
  return readJson(p);
}

export function loadRun(runRoot) {
  const p = join(runRoot, 'run.json');
  if (!existsSync(p)) return null;
  return readJson(p);
}

export function ensureRunDirs(runRoot) {
  for (const sub of [
    'context',
    'drafts',
    'candidates',
    'benchmarks',
    'archive',
    'jobs',
  ]) {
    mkdirSync(join(runRoot, sub), { recursive: true });
  }
}

export function clearRunArtifacts(runRoot) {
  for (const rel of [
    'context',
    'drafts',
    'candidates',
    'benchmarks',
    'archive',
    'task.json',
    'run.json',
    'evolution_final.md',
    'phase1_spawn_manifest.json',
  ]) {
    rmSync(join(runRoot, rel), { recursive: true, force: true });
  }
}

export function isoNow() {
  return new Date().toISOString();
}

export function createTaskSkeleton({
  runKey,
  targetSkillName,
  targetSkillPath,
  benchmarkProfile,
  featureId,
  featureFamily,
  requestedKnowledgePackKey,
  resolvedKnowledgePackKey,
  knowledgePackResolutionSource,
  knowledgePackKey,
  defectAnalysisRunKey,
  maxIterations,
  reportState,
}) {
  const now = isoNow();
  return {
    run_key: runKey,
    target_skill_name: targetSkillName,
    target_skill_path: targetSkillPath,
    overall_status: 'not_started',
    current_phase: 'phase0',
    report_state: reportState,
    feature_id: featureId ?? null,
    feature_family: featureFamily ?? null,
    requested_knowledge_pack_key: requestedKnowledgePackKey ?? null,
    resolved_knowledge_pack_key: resolvedKnowledgePackKey ?? null,
    knowledge_pack_resolution_source: knowledgePackResolutionSource ?? null,
    knowledge_pack_key: knowledgePackKey ?? null,
    defect_analysis_run_key: defectAnalysisRunKey ?? null,
    benchmark_profile: benchmarkProfile,
    current_iteration: 0,
    max_iterations: maxIterations,
    canonical_run_root: null,
    scratch_run_root: null,
    runtime_root_mode: 'canonical_only',
    next_action: null,
    next_action_reason: null,
    pending_job_ids: [],
    blocking_reason: null,
    accepted_iteration: null,
    champion_snapshot_path: null,
    pending_finalization_iteration: null,
    champion_archive_path: null,
    finalization_approved_at: null,
    created_at: now,
    updated_at: now,
  };
}

export function createRunSkeleton(runKey) {
  const now = isoNow();
  return {
    run_key: runKey,
    started_at: now,
    updated_at: now,
    freshness_checked_at: null,
    gap_taxonomy_generated_at: null,
    benchmark_catalog_generated_at: null,
    latest_validation_completed_at: null,
    latest_score_completed_at: null,
    finalized_at: null,
    notification_pending: null,
    latest_promotion_commit: null,
    accepted_iteration: null,
    rejected_iterations: [],
    iteration_history: [],
    blocking_issues: [],
    consecutive_rejections: 0,
    champion_archive_history: [],
    phase_receipts: {},
  };
}

export function hashJsonPayload(payload) {
  return createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');
}

export function fileMtimeMs(path) {
  return existsSync(path) ? statSync(path).mtimeMs : 0;
}
