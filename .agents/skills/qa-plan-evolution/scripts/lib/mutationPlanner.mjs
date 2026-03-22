/**
 * Mutation planning helpers (gap taxonomy seeding).
 */
export { seedGapTaxonomyAndBacklog } from './mutationBacklog.mjs';

function comparePriority(left, right) {
  return (
    (left.priority?.severity_rank ?? 99) - (right.priority?.severity_rank ?? 99) ||
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

export function selectNextMutation({ mutations, addressedGapIds = [] }) {
  const addressed = new Set(addressedGapIds);
  const candidates = mutations
    .filter((mutation) => mutation.status === 'pending')
    .filter((mutation) => hasUnaddressedGap(mutation, addressed))
    .sort(comparePriority);
  return candidates[0] ?? null;
}
