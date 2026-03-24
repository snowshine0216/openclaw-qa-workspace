import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

function sanitizeProjectionFilename(rowId) {
  return `${String(rowId || '').replace(/:/g, '--').replace(/[^A-Za-z0-9._-]/g, '-')}.md`;
}

function buildProjectionMarkdown(row) {
  const keywords = Array.isArray(row.keywords) && row.keywords.length > 0
    ? row.keywords.join(', ')
    : 'none';
  const sourceIssueRefs = Array.isArray(row.source_issue_refs) && row.source_issue_refs.length > 0
    ? row.source_issue_refs.join(', ')
    : 'none';

  return `# Row: ${row.row_id}

- row_type: ${row.row_type}
- pack_key: ${row.pack_key}
- pack_version: ${row.pack_version}
- title: ${row.title}
- keywords: ${keywords}
- source_issue_refs: ${sourceIssueRefs}

${row.search_text}
`;
}

async function ensureCleanProjectionDir(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

async function loadQmdCreateStore() {
  const module = await import('@tobilu/qmd');
  if (typeof module.createStore !== 'function') {
    throw new Error('The installed @tobilu/qmd package does not export createStore');
  }
  return module.createStore;
}

async function runLexicalSearch(store, queryText) {
  if (typeof store.searchLex === 'function') {
    return store.searchLex(queryText, { limit: 20 });
  }
  if (typeof store.search === 'function') {
    return store.search(queryText, { limit: 20 });
  }
  if (typeof store.structuredSearch === 'function') {
    return store.structuredSearch({ query: queryText, limit: 20 });
  }
  throw new Error('The installed @tobilu/qmd package does not expose a supported lexical search method');
}

function normalizeSearchHits(hits = []) {
  return hits.map((hit) => ({
    id: String(hit?.id || hit?.row_id || hit?.docId || '').trim(),
    score: Number(hit?.score || hit?.bm25 || 0),
  })).filter((hit) => hit.id);
}

function buildCandidateFromRow(row, matchedCandidate = null) {
  if (matchedCandidate) {
    return matchedCandidate;
  }

  return {
    knowledge_pack_row_id: row.row_id,
    row_type: row.row_type,
    title: row.title,
    status: String(row.status || 'unmapped').trim(),
    match_method: 'none',
    query_source: '',
    score: 0,
  };
}

function buildRetrievalArtifacts({ featureId, pack, candidates, queryInputs, warnings }) {
  const json = {
    feature_id: featureId,
    generated_at: new Date().toISOString(),
    knowledge_pack_key: pack.pack_key,
    knowledge_pack_version: pack.version,
    query_inputs: queryInputs,
    candidates,
    warnings,
  };

  const markdown = `# Knowledge Pack Retrieval — ${featureId}

- knowledge_pack_key: ${pack.pack_key}
- knowledge_pack_version: ${pack.version}

## Query Inputs
${queryInputs.map((input) => `- ${input.query_source}: ${input.text}`).join('\n') || '- none'}

## Candidate Matches
${candidates.length > 0
    ? candidates.map((candidate) => `- ${candidate.knowledge_pack_row_id} | ${candidate.row_type} | ${candidate.title} | ${candidate.match_method} | ${candidate.query_source} | ${candidate.score} | ${candidate.status}`).join('\n')
    : '- none'}

## Warnings
${warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join('\n') : '- none'}
`;

  return { json, markdown };
}

export async function buildKnowledgePackQueryInputs({ featureId, runDir, task = {} }) {
  const contextDir = join(runDir, 'context');
  const inputs = [];

  async function pushFile(querySource, filename) {
    try {
      const text = (await readFile(join(contextDir, filename), 'utf8')).trim();
      if (text) {
        inputs.push({ query_source: querySource, text });
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  await pushFile('jira_summary', `jira_issue_${featureId}.md`);
  await pushFile('jira_related_issues', `jira_related_issues_${featureId}.md`);
  await pushFile('confluence_design', `confluence_design_${featureId}.md`);

  const contextEntries = await readdir(contextDir).catch(() => []);
  for (const entry of contextEntries
    .filter((name) => /^supporting_issue_summary_/.test(name))
    .sort()) {
    await pushFile('supporting_issue_summaries', entry);
  }

  await pushFile('deep_research_synthesis', `deep_research_synthesis_report_editor_${featureId}.md`);

  const requestText = [
    ...(Array.isArray(task.request_requirements) ? task.request_requirements.map((requirement) => requirement.user_text) : []),
    ...(Array.isArray(task.request_materials) ? task.request_materials.map((material) => material.source_value) : []),
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join('\n');
  if (requestText) {
    inputs.push({ query_source: 'request_requirements_and_materials', text: requestText });
  }

  return inputs;
}

export async function retrieveKnowledgePackCoverage({
  featureId,
  runDir,
  pack,
  normalizedRows = [],
  queryInputs = [],
  semanticMode = 'disabled',
  createStore = null,
}) {
  const contextDir = join(runDir, 'context');
  const projectionDir = join(contextDir, 'knowledge_pack_projection');
  const dbPath = join(contextDir, 'knowledge_pack_qmd.sqlite');
  const rowById = new Map(normalizedRows.map((row) => [row.row_id, row]));
  const warnings = [];

  await ensureCleanProjectionDir(projectionDir);
  for (const row of normalizedRows) {
    await writeFile(join(projectionDir, sanitizeProjectionFilename(row.row_id)), buildProjectionMarkdown(row), 'utf8');
  }

  const createStoreImpl = createStore || await loadQmdCreateStore();
  const store = await createStoreImpl({
    dbPath,
    config: {
      collections: {
        pack: {
          path: projectionDir,
          pattern: '*.md',
        },
      },
    },
  });

  const bestByRowId = new Map();
  try {
    await store.update();
    for (const queryInput of queryInputs) {
      if (!String(queryInput?.text || '').trim()) continue;
      const hits = normalizeSearchHits(await runLexicalSearch(store, queryInput.text));
      for (const hit of hits) {
        const row = rowById.get(hit.id);
        if (!row) continue;
        const existing = bestByRowId.get(hit.id);
        if (!existing || hit.score > existing.score) {
          bestByRowId.set(hit.id, {
            knowledge_pack_row_id: row.row_id,
            row_type: row.row_type,
            title: row.title,
            status: 'unmapped',
            match_method: 'bm25',
            query_source: queryInput.query_source,
            score: hit.score,
          });
        }
      }
    }
  } finally {
    if (store && typeof store.close === 'function') {
      await store.close();
    }
  }

  let semanticWarning = null;
  let retrievalMode = 'bm25_only';
  if (semanticMode === 'qmd') {
    semanticWarning = 'qmd semantic augmentation was requested, but no embedding configuration was detected; continuing with BM25 only.';
  } else if (semanticMode === 'openclaw_memory') {
    semanticWarning = process.env.OPENCLAW_SESSION === '1'
      ? 'openclaw_memory semantic augmentation is not configured in this runtime; continuing with BM25 only.'
      : 'openclaw_memory semantic augmentation requires OPENCLAW_SESSION=1; continuing with BM25 only.';
  }
  if (semanticWarning) {
    warnings.push(semanticWarning);
  }

  const candidates = normalizedRows
    .map((row) => buildCandidateFromRow(row, bestByRowId.get(row.row_id)))
    .sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.knowledge_pack_row_id.localeCompare(right.knowledge_pack_row_id);
  });
  const retrievalArtifacts = buildRetrievalArtifacts({
    featureId,
    pack,
    candidates,
    queryInputs,
    warnings,
  });

  return {
    candidates,
    retrievalArtifacts,
    retrievalMode,
    semanticMode,
    semanticWarning,
    warnings,
    indexPath: dbPath,
    projectionDir,
  };
}
