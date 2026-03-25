import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveKnowledgePackKey } from './knowledgePackResolver.mjs';
import { normalizeKnowledgePackRows } from './knowledgePackRowNormalizer.mjs';

export const KNOWN_DEEP_RESEARCH_TOPIC_SLUGS = [
  'report_editor_workstation_functionality',
  'report_editor_library_vs_workstation_gap',
];

const OPTIONAL_ARRAY_FIELDS = [
  'required_capabilities',
  'required_outcomes',
  'state_transitions',
  'analog_gates',
  'sdk_visible_contracts',
  'interaction_pairs',
  'interaction_matrices',
  'anti_patterns',
  'evidence_refs',
  'deep_research_topics',
  'retrieval_notes',
];

async function readPackDocument(packRootDir, key) {
  const path = join(packRootDir, key, 'pack.json');
  try {
    const content = await readFile(path, 'utf8');
    return {
      path,
      document: JSON.parse(content),
    };
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (error.name === 'SyntaxError') {
      throw new Error(`Invalid knowledge pack JSON at ${path}`);
    }
    throw error;
  }
}

function normalizePackDocument(pack, path) {
  if (!String(pack?.pack_key || '').trim()) {
    throw new Error(`Knowledge pack at ${path} is missing pack_key`);
  }
  if (!String(pack?.version || '').trim()) {
    throw new Error(`Knowledge pack at ${path} is missing version`);
  }

  const warnings = [];
  const normalized = { ...pack };
  for (const field of OPTIONAL_ARRAY_FIELDS) {
    if (!Array.isArray(normalized[field])) {
      if (!(field in normalized)) {
        warnings.push(`optional content family ${field} is absent`);
      }
      normalized[field] = [];
    }
  }

  const invalidTopics = normalized.deep_research_topics.filter(
    (topic) => !KNOWN_DEEP_RESEARCH_TOPIC_SLUGS.includes(String(topic || '').trim()),
  );
  if (invalidTopics.length > 0) {
    throw new Error(
      `Knowledge pack at ${path} uses unsupported deep_research_topics: ${invalidTopics.join(', ')}. ` +
      `Supported values: ${KNOWN_DEEP_RESEARCH_TOPIC_SLUGS.join(', ')}`,
    );
  }

  return {
    pack: normalized,
    warnings,
  };
}

function buildNullPackResult({ requestedKnowledgePackKey, warnings = [] }) {
  return {
    mode: 'null_pack',
    pack: null,
    normalizedRows: [],
    warnings,
    taskPatch: {
      requested_knowledge_pack_key: requestedKnowledgePackKey ? String(requestedKnowledgePackKey).trim().toLowerCase() : null,
      knowledge_pack_key: null,
      resolved_knowledge_pack_key: null,
      knowledge_pack_resolution_source: 'null_pack',
      knowledge_pack_version: null,
      knowledge_pack_path: null,
      knowledge_pack_row_count: 0,
      knowledge_pack_deep_research_topics: [],
    },
  };
}

export async function loadKnowledgePackRuntime({
  featureId,
  requestedKnowledgePackKey = null,
  featureFamily = null,
  packRootDir,
  repoRoot,
  targetSkillPath = 'workspace-planner/skills/qa-plan-orchestrator',
  targetSkillName = 'qa-plan-orchestrator',
  benchmarkProfile = 'qa-plan-v2',
}) {
  const resolution = resolveKnowledgePackKey({
    repoRoot,
    targetSkillPath,
    targetSkillName,
    benchmarkProfile,
    requestedKnowledgePackKey,
    featureFamily,
    featureId,
  });

  const warnings = [];
  const requested = requestedKnowledgePackKey ? String(requestedKnowledgePackKey).trim().toLowerCase() : null;
  const inferredKey = String(resolution?.key || '').trim().toLowerCase() || null;
  let source = String(resolution?.source || '').trim() || null;
  let selectedKey = inferredKey;
  let packEntry = selectedKey ? await readPackDocument(packRootDir, selectedKey) : null;

  if (requested && !packEntry) {
    throw new Error(`Requested knowledge pack "${requested}" does not exist in ${packRootDir}`);
  }

  if (!requested && selectedKey && !packEntry && selectedKey !== 'general') {
    warnings.push(`Knowledge pack "${selectedKey}" was inferred but missing; falling back to general.`);
    selectedKey = 'general';
    source = 'default_general';
    packEntry = await readPackDocument(packRootDir, selectedKey);
  }

  if (!packEntry) {
    warnings.push('No active knowledge pack was resolved; continuing in null-pack mode.');
    return buildNullPackResult({
      requestedKnowledgePackKey: requested,
      warnings,
    });
  }

  const normalized = normalizePackDocument(packEntry.document, packEntry.path);
  const normalizedRows = normalizeKnowledgePackRows(normalized.pack);
  warnings.push(...normalized.warnings);

  return {
    mode: 'active_pack',
    pack: normalized.pack,
    normalizedRows,
    warnings,
    taskPatch: {
      requested_knowledge_pack_key: requested,
      knowledge_pack_key: normalized.pack.pack_key,
      resolved_knowledge_pack_key: normalized.pack.pack_key,
      knowledge_pack_resolution_source: source,
      knowledge_pack_version: normalized.pack.version,
      knowledge_pack_path: packEntry.path,
      knowledge_pack_row_count: normalizedRows.length,
      knowledge_pack_deep_research_topics: [...normalized.pack.deep_research_topics],
    },
  };
}
