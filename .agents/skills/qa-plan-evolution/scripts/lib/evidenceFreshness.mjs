import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getProfileById } from './loadProfile.mjs';
import { loadQaPlanAdapter } from './evidence/adapters/qa-plan.mjs';

function fileMeta(repoRoot, rel) {
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) {
    return { path: rel, status: 'missing', mtime_ms: null, sha256: null };
  }
  const st = statSync(abs);
  return {
    path: rel,
    status: 'present',
    mtime_ms: st.mtimeMs,
    size: st.size,
  };
}

export function buildEvidenceFreshness({
  repoRoot,
  runRoot,
  task,
  profileId,
}) {
  const profile = getProfileById(profileId);
  const hooks = profile.evidence_hooks ?? {};
  const targetRel = task.target_skill_path;
  const items = [
    fileMeta(repoRoot, join(targetRel, 'SKILL.md')),
    fileMeta(repoRoot, join(targetRel, 'reference.md')),
    {
      ...fileMeta(repoRoot, join(targetRel, 'evals', 'evals.json')),
      required: false,
    },
  ];

  let defectsAnalysis = { status: 'skipped', reason: 'profile' };
  if (hooks.defects_analysis_refresh === 'required_when_stale') {
    defectsAnalysis = loadQaPlanAdapter().checkDefectsAnalysis(repoRoot, task);
  } else if (hooks.defects_analysis_refresh === 'optional') {
    defectsAnalysis = loadQaPlanAdapter().checkDefectsAnalysis(repoRoot, task);
    if (defectsAnalysis.status === 'missing_source') {
      defectsAnalysis = { status: 'optional', reason: 'no_defect_analysis_run_key_or_feature_id' };
    }
  }

  let knowledgePack = { status: 'skipped' };
  if (hooks.knowledge_pack_version_check && task.knowledge_pack_key) {
    const adapter = loadQaPlanAdapter();
    knowledgePack = adapter.checkKnowledgePack(repoRoot, task);
  }

  const blockingIssues = [];
  for (const item of items) {
    if (item.required !== false && item.status === 'missing') {
      blockingIssues.push({
        source: item.path,
        status: item.status,
      });
    }
  }
  if (
    hooks.defects_analysis_refresh === 'required_when_stale' &&
    ['missing', 'missing_source', 'stale', 'unparseable'].includes(defectsAnalysis.status)
  ) {
    blockingIssues.push({
      source: 'defects_analysis',
      status: defectsAnalysis.status,
    });
  }
  if (
    hooks.knowledge_pack_version_check &&
    task.knowledge_pack_key &&
    ['missing', 'stale', 'unparseable', 'bootstrap_incomplete'].includes(knowledgePack.status)
  ) {
    blockingIssues.push({
      source: 'knowledge_pack',
      status: knowledgePack.status,
    });
  }

  const blocking =
    blockingIssues.length > 0;

  return {
    profile_id: profileId,
    generated_at: new Date().toISOString(),
    items,
    defects_analysis: defectsAnalysis,
    knowledge_pack: knowledgePack,
    blocking_issues: blockingIssues,
    phase2_allowed: !blocking,
    blocking,
  };
}
