import { getProfileById } from './loadProfile.mjs';

const BUCKETS = [
  'smoke_checks',
  'contract_evals',
  'defect_replay_evals',
  'knowledge_pack_coverage_evals',
  'regression_evals',
];

export function buildBenchmarkCatalog({ profileId, targetSkillPath }) {
  const profile = getProfileById(profileId);
  const hooks = profile.evidence_hooks ?? {};

  const catalog = {
    profile_id: profileId,
    target_skill_path: targetSkillPath,
    generated_at: new Date().toISOString(),
    buckets: {},
  };

  for (const b of BUCKETS) {
    catalog.buckets[b] = { enabled: false, notes: [] };
  }

  catalog.buckets.smoke_checks.enabled = true;
  catalog.buckets.smoke_checks.notes.push('Run target skill package.json test script when present.');

  catalog.buckets.contract_evals.enabled = true;
  catalog.buckets.contract_evals.notes.push('Run target evals/evals.json harness when present.');

  if (hooks.defect_replay_evals) {
    catalog.buckets.defect_replay_evals.enabled = true;
    catalog.buckets.defect_replay_evals.notes.push('Defect replay per QA_PLAN_BENCHMARK_SPEC when campaign exists.');
  }

  if (profile.scoring_dimensions?.includes('knowledge_pack_coverage_score')) {
    catalog.buckets.knowledge_pack_coverage_evals.enabled = true;
  }

  catalog.buckets.regression_evals.enabled = true;
  catalog.buckets.regression_evals.notes.push('Pairwise champion vs challenger; regression_count must be zero.');

  return catalog;
}
