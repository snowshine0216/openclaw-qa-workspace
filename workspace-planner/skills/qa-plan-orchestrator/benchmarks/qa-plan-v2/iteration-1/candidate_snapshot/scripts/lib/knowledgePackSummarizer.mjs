function countRowsByType(rows = []) {
  const counts = {};
  for (const row of rows) {
    const key = String(row?.row_type || 'unknown');
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function buildKnowledgePackSummaryArtifacts({
  featureId,
  pack,
  normalizedRows = [],
  warnings = [],
}) {
  const json = {
    feature_id: featureId,
    generated_at: new Date().toISOString(),
    knowledge_pack_key: pack.pack_key,
    knowledge_pack_version: pack.version,
    knowledge_pack_row_count: normalizedRows.length,
    deep_research_topics: [...(pack.deep_research_topics || [])],
    retrieval_notes: [...(pack.retrieval_notes || [])],
    family_counts: {
      required_capabilities: (pack.required_capabilities || []).length,
      required_outcomes: (pack.required_outcomes || []).length,
      state_transitions: (pack.state_transitions || []).length,
      analog_gates: (pack.analog_gates || []).length,
      sdk_visible_contracts: (pack.sdk_visible_contracts || []).length,
      interaction_pairs: (pack.interaction_pairs || []).length,
      interaction_matrices: (pack.interaction_matrices || []).length,
      anti_patterns: (pack.anti_patterns || []).length,
      evidence_refs: (pack.evidence_refs || []).length,
    },
    normalized_row_type_counts: countRowsByType(normalizedRows),
    warnings: [...warnings],
  };

  const markdown = `# Knowledge Pack Summary — ${featureId}

- knowledge pack key: ${pack.pack_key}
- knowledge pack version: ${pack.version}
- normalized retrieval rows: ${normalizedRows.length}
- deep research topics: ${(pack.deep_research_topics || []).join(', ') || 'none'}

## Family Counts

- required_capabilities: ${(pack.required_capabilities || []).length}
- required_outcomes: ${(pack.required_outcomes || []).length}
- state_transitions: ${(pack.state_transitions || []).length}
- analog_gates: ${(pack.analog_gates || []).length}
- sdk_visible_contracts: ${(pack.sdk_visible_contracts || []).length}
- interaction_pairs: ${(pack.interaction_pairs || []).length}
- interaction_matrices: ${(pack.interaction_matrices || []).length}
- anti_patterns: ${(pack.anti_patterns || []).length}
- evidence_refs: ${(pack.evidence_refs || []).length}

## Retrieval Notes

${(pack.retrieval_notes || []).length > 0
    ? (pack.retrieval_notes || []).map((note) => `- ${note}`).join('\n')
    : '- none'}

## Warnings

${warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join('\n') : '- none'}
`;

  return { json, markdown };
}
