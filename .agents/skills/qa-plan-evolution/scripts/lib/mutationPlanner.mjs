/**
 * Mutation planning helpers (gap taxonomy seeding).
 */
export { seedGapTaxonomyAndBacklog } from './mutationBacklog.mjs';

function comparePriority(left, right) {
  return (
    (left.priority?.severity_rank ?? 99) - (right.priority?.severity_rank ?? 99) ||
    (left.priority?.category_rank ?? 4) - (right.priority?.category_rank ?? 4) ||
    (left.priority?.bucket_rank ?? 99) - (right.priority?.bucket_rank ?? 99) ||
    (left.priority?.phase_rank ?? 99) - (right.priority?.phase_rank ?? 99) ||
    String(left.mutation_id).localeCompare(String(right.mutation_id))
  );
}

function hasUnaddressedGap(mutation, addressedGapIds) {
  const ids = mutation.source_observation_ids ?? [];
  if (ids.length === 0) {
    return true;
  }
  return ids.some((id) => !addressedGapIds.has(id));
}

export function mutationSignature(mutation = {}) {
  const observationIds = [...(mutation.source_observation_ids ?? [])]
    .map((id) => String(id))
    .sort();
  const targetFiles = [...(mutation.target_files ?? [])]
    .map((file) => String(file))
    .sort();
  const evalsAffected = [...(mutation.evals_affected ?? [])]
    .map((evalId) => String(evalId))
    .sort();

  return JSON.stringify({
    root_cause_bucket: String(mutation.root_cause_bucket ?? ''),
    source_observation_ids: observationIds,
    target_files: targetFiles,
    evals_affected: evalsAffected,
  });
}

export function selectNextMutation({
  mutations,
  addressedGapIds = [],
  rejectedMutationSignatures = [],
}) {
  const addressed = new Set(addressedGapIds);
  const rejected = new Set(rejectedMutationSignatures);
  const candidates = mutations
    .filter((mutation) => mutation.status === 'pending')
    .filter((mutation) => hasUnaddressedGap(mutation, addressed))
    .filter((mutation) => !rejected.has(mutationSignature(mutation)))
    .sort(comparePriority);
  return candidates[0] ?? null;
}
