const REQUIRED_PHASE5A_ROW_TYPES = new Set([
  'required_capability',
  'required_outcome',
  'interaction_pair',
  'sdk_visible_contract',
  'state_transition',
]);

function normalizeCandidate(candidate = {}) {
  return {
    knowledge_pack_row_id: String(candidate.knowledge_pack_row_id || candidate.row_id || '').trim(),
    row_type: String(candidate.row_type || '').trim(),
    title: String(candidate.title || '').trim(),
    status: String(candidate.status || 'unmapped').trim(),
    match_method: String(candidate.match_method || 'bm25').trim(),
    query_source: String(candidate.query_source || '').trim(),
    score: Number(candidate.score || 0),
  };
}

export function buildCoverageLedgerArtifacts({
  featureId,
  knowledgePackKey,
  knowledgePackVersion,
  candidates = [],
}) {
  const normalizedCandidates = candidates.map(normalizeCandidate);
  const json = {
    feature_id: featureId,
    generated_at: new Date().toISOString(),
    knowledge_pack_key: knowledgePackKey || null,
    knowledge_pack_version: knowledgePackVersion || null,
    candidates: normalizedCandidates,
  };

  const rows = normalizedCandidates.length > 0
    ? normalizedCandidates
      .map((candidate) => `- ${candidate.knowledge_pack_row_id} | ${candidate.row_type} | ${candidate.title} | ${candidate.match_method} | ${candidate.status} | ${candidate.query_source || 'none'} | ${candidate.score}`)
      .join('\n')
    : '- none';

  const markdown = `# Coverage Ledger

## Coverage Rules Used
- knowledge_pack_key: ${knowledgePackKey || 'none'}
- knowledge_pack_version: ${knowledgePackVersion || 'none'}

## Scenario Mapping Table
${rows}

## Coverage Distribution Summary
- candidate_count: ${normalizedCandidates.length}

## Explicit Exclusions
- none
`;

  return { json, markdown };
}

export function collectUnresolvedPackRows(candidates = [], rowTypes = REQUIRED_PHASE5A_ROW_TYPES) {
  return candidates
    .map(normalizeCandidate)
    .filter((candidate) => rowTypes.has(candidate.row_type))
    .filter((candidate) => candidate.status === 'unmapped');
}

export function collectRequiredAnalogRowIds(candidates = []) {
  return candidates
    .map(normalizeCandidate)
    .filter((candidate) => candidate.row_type === 'analog_gate')
    .map((candidate) => candidate.knowledge_pack_row_id);
}

export function collectUnresolvedBlockingAnalogRowIds(candidates = []) {
  return candidates
    .map(normalizeCandidate)
    .filter((candidate) => candidate.row_type === 'analog_gate')
    .filter((candidate) => candidate.status === 'unmapped')
    .map((candidate) => candidate.knowledge_pack_row_id);
}
