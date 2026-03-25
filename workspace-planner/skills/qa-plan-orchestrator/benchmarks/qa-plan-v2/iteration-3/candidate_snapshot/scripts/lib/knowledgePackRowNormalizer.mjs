function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values) {
  return [...new Set(
    toArray(values)
      .map((value) => String(value || '').trim())
      .filter(Boolean),
  )];
}

function normalizePairValue(value) {
  return String(value || '').trim().toLowerCase();
}

export function slugifyKnowledgePackToken(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function buildSearchText(parts) {
  return uniqueStrings(parts).join(' ');
}

function mergeRow(existing, next) {
  return {
    ...existing,
    ...next,
    keywords: uniqueStrings([...(existing.keywords || []), ...(next.keywords || [])]),
    source_issue_refs: uniqueStrings([...(existing.source_issue_refs || []), ...(next.source_issue_refs || [])]),
    declared_in: uniqueStrings([...(existing.declared_in || []), ...(next.declared_in || [])]),
    required_gate: Boolean(existing.required_gate || next.required_gate),
    status: next.status || existing.status || 'unmapped',
    search_text: buildSearchText([existing.search_text, next.search_text]),
  };
}

function addRow(rowsById, row) {
  const existing = rowsById.get(row.row_id);
  rowsById.set(row.row_id, existing ? mergeRow(existing, row) : row);
}

function buildBaseRow(pack, partial) {
  return {
    row_id: partial.row_id,
    row_type: partial.row_type,
    pack_key: pack.pack_key,
    pack_version: pack.version,
    title: partial.title,
    keywords: uniqueStrings(partial.keywords),
    search_text: buildSearchText(partial.searchTextParts),
    source_issue_refs: uniqueStrings(partial.source_issue_refs),
    declared_in: uniqueStrings(partial.declared_in),
    required_gate: Boolean(partial.required_gate),
    status: partial.status || 'unmapped',
  };
}

function canonicalInteractionPair(pair) {
  const values = toArray(pair)
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  if (values.length < 2) return null;
  const decorated = values.map((value) => ({
    value,
    normalized: normalizePairValue(value),
  }));
  decorated.sort((left, right) => left.normalized.localeCompare(right.normalized));
  return decorated;
}

export function normalizeKnowledgePackRows(pack = {}) {
  const rowsById = new Map();

  for (const capability of uniqueStrings(pack.required_capabilities)) {
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `capability:${slugifyKnowledgePackToken(capability)}`,
      row_type: 'required_capability',
      title: capability,
      keywords: [capability],
      searchTextParts: [capability],
      declared_in: ['required_capabilities'],
    }));
  }

  for (const outcome of toArray(pack.required_outcomes)) {
    const keywords = uniqueStrings(outcome?.keywords);
    const title = keywords[0] || String(outcome?.id || '').trim() || String(outcome?.observable_outcome || '').trim();
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `outcome:${String(outcome?.id || '').trim()}`,
      row_type: 'required_outcome',
      title,
      keywords,
      searchTextParts: [title, ...keywords, outcome?.observable_outcome],
      declared_in: ['required_outcomes'],
    }));
  }

  for (const transition of toArray(pack.state_transitions)) {
    const title = `${String(transition?.from || '').trim()} -> ${String(transition?.to || '').trim()}`;
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `transition:${String(transition?.id || '').trim()}`,
      row_type: 'state_transition',
      title,
      keywords: [transition?.from, transition?.to, transition?.trigger],
      searchTextParts: [title, transition?.trigger, transition?.observable_outcome],
      declared_in: ['state_transitions'],
    }));
  }

  for (const analog of toArray(pack.analog_gates)) {
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `analog:${String(analog?.source_issue || '').trim()}`,
      row_type: 'analog_gate',
      title: String(analog?.behavior || '').trim(),
      keywords: [analog?.behavior, analog?.source_issue],
      searchTextParts: [analog?.behavior, analog?.source_issue],
      source_issue_refs: [analog?.source_issue],
      declared_in: ['analog_gates'],
      required_gate: Boolean(analog?.required_gate),
    }));
  }

  for (const contract of uniqueStrings(pack.sdk_visible_contracts)) {
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `sdk:${slugifyKnowledgePackToken(contract)}`,
      row_type: 'sdk_visible_contract',
      title: contract,
      keywords: [contract],
      searchTextParts: [contract],
      declared_in: ['sdk_visible_contracts'],
    }));
  }

  for (const pair of [
    ...toArray(pack.interaction_pairs).map((entry) => ({ entry, declared_in: 'interaction_pairs' })),
    ...toArray(pack.interaction_matrices).flatMap((matrix) => toArray(matrix?.pairs).map((entry) => ({
      entry,
      declared_in: 'interaction_matrices',
    }))),
  ]) {
    const canonical = canonicalInteractionPair(pair.entry);
    if (!canonical) continue;
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `interaction:${canonical[0].normalized}__${canonical[1].normalized}`,
      row_type: 'interaction_pair',
      title: `${canonical[0].value} <-> ${canonical[1].value}`,
      keywords: [canonical[0].value, canonical[1].value],
      searchTextParts: [canonical[0].value, canonical[1].value],
      declared_in: [pair.declared_in],
    }));
  }

  for (const antiPattern of uniqueStrings(pack.anti_patterns)) {
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `anti_pattern:${slugifyKnowledgePackToken(antiPattern)}`,
      row_type: 'anti_pattern',
      title: antiPattern,
      keywords: [antiPattern],
      searchTextParts: [antiPattern],
      declared_in: ['anti_patterns'],
    }));
  }

  for (const evidence of toArray(pack.evidence_refs)) {
    addRow(rowsById, buildBaseRow(pack, {
      row_id: `evidence_ref:${String(evidence?.type || '').trim()}:${String(evidence?.id || '').trim()}`,
      row_type: 'evidence_ref',
      title: String(evidence?.topic || '').trim() || String(evidence?.id || '').trim(),
      keywords: [evidence?.topic, evidence?.id],
      searchTextParts: [evidence?.topic, evidence?.id],
      source_issue_refs: [evidence?.id],
      declared_in: ['evidence_refs'],
    }));
  }

  return [...rowsById.values()].sort((left, right) => left.row_id.localeCompare(right.row_id));
}
