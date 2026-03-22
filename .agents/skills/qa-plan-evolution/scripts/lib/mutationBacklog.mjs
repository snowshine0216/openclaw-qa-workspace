import { getProfileById } from './loadProfile.mjs';
import { collectGapSourceResults as collectGapSourceResultsByProfile } from './gapSources/index.mjs';
import { buildGapTaxonomy, buildObservationClusterKey } from './gapTaxonomy.mjs';

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizedSorted(items) {
  return unique(items).sort();
}

function bucketRank(bucket) {
  const order = [
    'developer_artifact_missing',
    'sdk_or_api_visible_contract_dropped',
    'interaction_gap',
    'analog_risk_not_gated',
    'missing_scenario',
    'scenario_too_shallow',
    'knowledge_pack_gap',
    'traceability_gap',
  ];
  const index = order.indexOf(bucket);
  return index >= 0 ? index + 1 : order.length + 1;
}

function severityRank(severity) {
  if (severity === 'high') return 0;
  if (severity === 'medium') return 1;
  return 2;
}

function phaseRank(phase) {
  if (!phase) return 99;
  const matched = String(phase).match(/^phase(\d+)/i);
  if (!matched) return 99;
  return Number.parseInt(matched[1], 10);
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function mixedHypothesisError(bucket) {
  return new Error(`Gap ${bucket} has mixed root-cause hypotheses`);
}

function validateMutationInputs(gap, observations) {
  if (observations.length === 0) {
    throw new Error(`Gap ${gap.bucket} cannot produce mutation without source observations`);
  }

  const hypothesisKeys = normalizedSorted(
    observations.map((observation) => buildObservationClusterKey(gap.bucket, observation)),
  );
  if (hypothesisKeys.length !== 1 || (gap.hypothesis_key && hypothesisKeys[0] !== gap.hypothesis_key)) {
    throw mixedHypothesisError(gap.bucket);
  }

  const missingBucketSupport = observations.some(
    (observation) => !(observation.taxonomy_candidates ?? []).includes(gap.bucket),
  );
  if (missingBucketSupport) {
    throw mixedHypothesisError(gap.bucket);
  }
}

export async function collectGapSourceResults({ repoRoot, runRoot, task, profile }) {
  const resolvedProfile = profile ?? getProfileById(task.benchmark_profile);
  return collectGapSourceResultsByProfile({
    repoRoot,
    runRoot,
    task,
    profile: resolvedProfile,
  });
}

export async function buildGapSourceResults({ repoRoot, runRoot, task }) {
  const profile = getProfileById(task.benchmark_profile);
  const sourceResults = await collectGapSourceResults({
    repoRoot,
    runRoot,
    task,
    profile,
  });
  return { profile, sourceResults };
}

export function buildMutationBacklog({ taxonomy, sourceResults }) {
  const observationById = new Map();
  for (const sourceResult of sourceResults) {
    for (const observation of sourceResult.observations ?? []) {
      observationById.set(observation.id, observation);
    }
  }

  return taxonomy.gaps.map((gap, index) => {
    const observations = (gap.source_observation_ids ?? [])
      .map((id) => observationById.get(id))
      .filter(Boolean);
    validateMutationInputs(gap, observations);

    const targetFiles = normalizedSorted(
      gap.target_files ?? observations.flatMap((observation) => observation.target_files ?? []),
    );
    const derivedTargetFiles = normalizedSorted(
      observations.flatMap((observation) => observation.target_files ?? []),
    );
    if (targetFiles.length === 0) {
      throw new Error(`Gap ${gap.bucket} cannot produce mutation without target_files`);
    }
    if (!arraysEqual(targetFiles, derivedTargetFiles)) {
      throw mixedHypothesisError(gap.bucket);
    }

    const evalsAffected = normalizedSorted(
      gap.evals_affected ??
      observations.flatMap((observation) => observation.evals_affected ?? []),
    );
    const derivedEvalsAffected = normalizedSorted(
      observations.flatMap((observation) => observation.evals_affected ?? []),
    );
    if (evalsAffected.length === 0) {
      throw new Error(`Gap ${gap.bucket} cannot produce mutation without evals_affected`);
    }
    if (!arraysEqual(evalsAffected, derivedEvalsAffected)) {
      throw mixedHypothesisError(gap.bucket);
    }
    const severities = observations.map((observation) => observation.severity ?? 'medium');
    const affectedPhases = normalizedSorted(
      observations.map((observation) => observation.affected_phase).filter(Boolean),
    );
    const evidencePaths = normalizedSorted(
      observations.map((observation) => observation.source_path),
    );
    const priority = {
      severity_rank: Math.min(...severities.map((severity) => severityRank(severity))),
      bucket_rank: bucketRank(gap.bucket),
      phase_rank: Math.min(99, ...affectedPhases.map((phase) => phaseRank(phase))),
    };
    return {
      mutation_id: `mut-${index + 1}`,
      root_cause_bucket: gap.bucket,
      source_observation_ids: gap.source_observation_ids ?? [],
      target_files: targetFiles,
      expected_gain: gap.summary,
      regression_risk: gap.bucket === 'traceability_gap' ? 'low' : 'medium',
      evals_affected: evalsAffected,
      knowledge_pack_delta: observations
        .map((observation) => observation.knowledge_pack_delta)
        .filter(Boolean)
        .join('; ') || 'none',
      evidence_paths: evidencePaths,
      affected_phases: affectedPhases,
      priority,
      status: 'pending',
    };
  });
}

export async function seedGapTaxonomyAndBacklog({ repoRoot, task, runRoot }) {
  const { sourceResults } = await buildGapSourceResults({ repoRoot, task, runRoot });
  const taxonomy = buildGapTaxonomy({ sourceResults });
  return {
    source_results: sourceResults,
    taxonomy,
    mutations: buildMutationBacklog({
      taxonomy,
      sourceResults,
    }),
  };
}
