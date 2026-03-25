const VALID_BUCKETS = new Set([
  'missing_scenario',
  'scenario_too_shallow',
  'analog_risk_not_gated',
  'interaction_gap',
  'sdk_or_api_visible_contract_dropped',
  'developer_artifact_missing',
  'traceability_gap',
  'knowledge_pack_gap',
]);

function uniqueSorted(items) {
  return [...new Set((items ?? []).filter(Boolean))].sort();
}

export function buildObservationClusterKey(bucket, observation) {
  const knowledgePackKey = observation.knowledge_pack_key || '';
  const generalizedRule = String(observation.generalized_rule || '').trim().toLowerCase();
  const targetSurface = String(observation.target_surface || '').trim().toLowerCase();
  if (generalizedRule || targetSurface) {
    const scopePack = observation.generalization_scope === 'feature_family' ? knowledgePackKey : '';
    return `${bucket}|rule:${generalizedRule}|surface:${targetSurface}|pack:${scopePack}`;
  }
  const evalsAffected = uniqueSorted(observation.evals_affected);
  const targetFiles = uniqueSorted(observation.target_files);
  return `${bucket}|evals:${evalsAffected.join(',')}|files:${targetFiles.join(',')}|pack:${knowledgePackKey}`;
}

export function buildGapTaxonomy({ sourceResults }) {
  const grouped = new Map();
  for (const sourceResult of sourceResults) {
    for (const observation of sourceResult.observations ?? []) {
      for (const bucket of observation.taxonomy_candidates ?? []) {
        if (!VALID_BUCKETS.has(bucket)) {
          continue;
        }
        const clusterKey = buildObservationClusterKey(bucket, observation);
        const current = grouped.get(clusterKey) ?? {
          bucket,
          hypothesis_key: clusterKey,
          evidence: new Set(),
          source_observation_ids: [],
          target_files: uniqueSorted(observation.target_files),
          evals_affected: uniqueSorted(observation.evals_affected),
          knowledge_pack_key: observation.knowledge_pack_key || null,
          generalized_rule: observation.generalized_rule || null,
          target_surface: observation.target_surface || null,
          summaries: [],
        };
        current.evidence.add(observation.source_path);
        current.source_observation_ids.push(observation.id);
        current.summaries.push(observation.summary);
        grouped.set(clusterKey, current);
      }
    }
  }

  const gaps = [...grouped.values()].map((gap) => ({
    bucket: gap.bucket,
    hypothesis_key: gap.hypothesis_key,
    summary:
      gap.summaries.length === 1
        ? gap.summaries[0]
        : `${gap.summaries.length} observations indicate ${gap.bucket}`,
    evidence: [...gap.evidence].sort(),
    source_observation_ids: [...new Set(gap.source_observation_ids)],
    target_files: gap.target_files,
    evals_affected: gap.evals_affected,
    knowledge_pack_key: gap.knowledge_pack_key,
    generalized_rule: gap.generalized_rule,
    target_surface: gap.target_surface,
  }));

  return {
    buckets: [...VALID_BUCKETS],
    gaps,
  };
}
