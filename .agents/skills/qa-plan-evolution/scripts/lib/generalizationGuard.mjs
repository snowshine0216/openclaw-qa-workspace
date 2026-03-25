function hasDefectLiteral(value) {
  return /[A-Z]+-\d+/i.test(String(value || ''));
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function hasSharedScopeProof(observation) {
  const featureFamilies = Array.isArray(observation.supporting_feature_families)
    ? observation.supporting_feature_families.filter(Boolean)
    : [];
  if (featureFamilies.length >= 2) {
    return true;
  }
  return observation.shared_scope_proof === true
    || observation.cross_feature_evidence === true
    || observation.explicit_structural_proof === true
    || observation.benchmark_proof === true;
}

function isOneOffRule(observation) {
  const rule = normalizeText(observation.generalized_rule);
  if (!rule) {
    return true;
  }
  const examples = Array.isArray(observation.source_examples)
    ? observation.source_examples.map((entry) => normalizeText(entry)).filter(Boolean)
    : [];
  return examples.includes(rule);
}

function knowledgePackTargets(task, observation) {
  const key = observation.knowledge_pack_key || observation.feature_family || task.knowledge_pack_key;
  if (!key) {
    return null;
  }
  return [
    `${task.target_skill_path}/knowledge-packs/${key}/pack.json`,
    `${task.target_skill_path}/knowledge-packs/${key}/pack.md`,
  ];
}

export function normalizeObservationForPromotion(task, observation) {
  if (!observation) {
    return null;
  }

  if (observation.advisory_only === true || observation.promotion_eligible === false) {
    return null;
  }

  if (
    hasDefectLiteral(observation.summary) ||
    hasDefectLiteral(observation.details) ||
    hasDefectLiteral(observation.knowledge_pack_delta) ||
    hasDefectLiteral(observation.generalized_rule)
  ) {
    return null;
  }

  const allowedMutationScope = Array.isArray(observation.allowed_mutation_scope)
    ? observation.allowed_mutation_scope
    : [];
  if (observation.generalization_scope === 'feature_family') {
    const targetFiles = knowledgePackTargets(task, observation);
    if (!targetFiles) {
      return null;
    }
    return {
      ...observation,
      target_files: targetFiles,
      knowledge_pack_delta:
        observation.knowledge_pack_delta ||
        observation.generalized_rule ||
        observation.summary ||
        'feature-family knowledge pack enrichment',
    };
  }

  if (observation.target_surface) {
    if (isOneOffRule(observation)) {
      return null;
    }
    if (!hasSharedScopeProof(observation)) {
      return null;
    }
  }

  if (
    allowedMutationScope.length > 0 &&
    !allowedMutationScope.includes('rubric_update') &&
    !allowedMutationScope.includes('template_update') &&
    observation.target_surface
  ) {
    return null;
  }

  return observation;
}

export function normalizeSourceResultsForPromotion(task, sourceResults) {
  return sourceResults.map((sourceResult) => ({
    ...sourceResult,
    observations: (sourceResult.observations ?? [])
      .map((observation) => normalizeObservationForPromotion(task, observation))
      .filter(Boolean),
  }));
}
