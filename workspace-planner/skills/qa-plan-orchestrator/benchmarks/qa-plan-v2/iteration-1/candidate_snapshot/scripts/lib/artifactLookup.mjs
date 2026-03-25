import { readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileExists, readJson } from './workflowState.mjs';

const PHASE_COLUMNS = ['Phase 4a', 'Phase 4b', 'Phase 5a', 'Phase 5b', 'Phase 6'];

export async function writeArtifactLookup(featureId, runDir) {
  const contextDir = join(runDir, 'context');
  const lookupPath = join(contextDir, `artifact_lookup_${featureId}.md`);
  const existing = await readExistingLookup(lookupPath);
  const task = await readJson(join(runDir, 'task.json'), {});
  const rows = await buildRows(contextDir, featureId, existing, task);
  if (rows.length === 0) {
    throw new Error('Artifact lookup requires at least one context artifact.');
  }
  const missingRequiredArtifacts = collectMissingRequiredArtifacts(rows, task);
  if (missingRequiredArtifacts.length > 0) {
    throw new Error(`Artifact lookup is missing required request artifacts: ${missingRequiredArtifacts.join(', ')}`);
  }

  await writeFile(lookupPath, renderLookup(featureId, rows), 'utf8');
  return lookupPath;
}

async function buildRows(contextDir, featureId, existing, task) {
  const filenames = (await safeReadDir(contextDir))
    .filter((name) => name.endsWith('.md') || name.endsWith('.json'))
    .filter((name) => !name.startsWith(`artifact_lookup_${featureId}`))
    .filter((name) => !name.startsWith(`runtime_setup_${featureId}`))
    .sort();

  return filenames.map((filename, index) => {
    const filePath = `context/${filename}`;
    const preserved = existing.get(filePath) || {};
    const metadata = detectArtifactMetadata(filename, task);
    return {
      index: index + 1,
      artifactKey: preserved.artifactKey || metadata.artifactKey,
      filePath,
      artifactKind: metadata.artifactKind,
      sourceFamily: metadata.sourceFamily,
      policyTag: metadata.policyTag,
      sourcePhase: metadata.sourcePhase,
      phaseRequiredBy: metadata.phaseRequiredBy,
      requirementIds: metadata.requirementIds,
      satisfiesUserRequest: metadata.satisfiesUserRequest,
      phase4a: preserved.phase4a || '❌',
      phase4b: preserved.phase4b || '❌',
      phase5a: preserved.phase5a || preserved.phase5 || '❌',
      phase5b: preserved.phase5b || '❌',
      phase6: preserved.phase6 || '❌',
    };
  });
}

function renderLookup(featureId, rows) {
  const tableRows = rows.map((row) => {
    return `| ${row.index} | \`${row.artifactKey}\` | \`${row.filePath}\` | ${row.artifactKind} | ${row.sourceFamily} | ${row.policyTag} | ${row.sourcePhase} | ${row.phaseRequiredBy} | \`${row.requirementIds}\` | ${row.satisfiesUserRequest} | ${row.phase4a} | ${row.phase4b} | ${row.phase5a} | ${row.phase5b} | ${row.phase6} |`;
  }).join('\n');

  return `# Artifact Lookup — ${featureId}

| # | Artifact Key | File Path | Artifact Kind | Source Family | Policy Tag | Source Phase | Phase Required By | Requirement IDs | Satisfies User Request | Phase 4a | Phase 4b | Phase 5a | Phase 5b | Phase 6 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${tableRows}
`;
}

function detectArtifactMetadata(filename, task = {}) {
  const stem = basename(filename, '.md');
  const rules = [
    [/^jira_/, { artifactKey: 'jira_context', artifactKind: 'jira_issue', sourceFamily: 'jira', policyTag: 'primary' }],
    [/^confluence_/, { artifactKey: 'confluence_context', artifactKind: 'confluence_design', sourceFamily: 'confluence', policyTag: 'primary' }],
    [/^github_/, { artifactKey: 'github_context', artifactKind: 'github_evidence', sourceFamily: 'github', policyTag: 'primary' }],
    [/^figma_/, { artifactKey: 'figma_context', artifactKind: 'figma_evidence', sourceFamily: 'figma', policyTag: 'primary' }],
    [/^supporting_issue_request_/, { artifactKey: 'supporting_issue_request', artifactKind: 'supporting_issue_request', sourceFamily: 'jira', policyTag: 'support_context' }],
    [/^supporting_issue_relation_map_/, { artifactKey: 'supporting_issue_relation_map', artifactKind: 'supporting_issue_relation_map', sourceFamily: 'jira', policyTag: 'support_context' }],
    [/^supporting_issue_summary_/, { artifactKey: 'supporting_issue_summary', artifactKind: 'supporting_issue_summary', sourceFamily: 'jira', policyTag: 'support_context' }],
    [/^deep_research_plan_/, { artifactKey: 'deep_research_plan', artifactKind: 'deep_research_plan', sourceFamily: 'tavily-search', policyTag: 'deep_research' }],
    [/^deep_research_tavily_/, { artifactKey: 'deep_research_tavily', artifactKind: 'deep_research_tavily', sourceFamily: 'tavily-search', policyTag: 'deep_research' }],
    [/^deep_research_confluence_/, { artifactKey: 'deep_research_confluence', artifactKind: 'deep_research_confluence', sourceFamily: 'confluence', policyTag: 'deep_research_fallback' }],
    [/^deep_research_synthesis_/, { artifactKey: 'deep_research_synthesis', artifactKind: 'deep_research_synthesis', sourceFamily: 'tavily-search', policyTag: 'deep_research' }],
    [/^knowledge_pack_summary_.*\.json$/, { artifactKey: 'knowledge_pack_summary_json', artifactKind: 'knowledge_pack_summary_json', sourceFamily: 'workflow', policyTag: 'context' }],
    [/^knowledge_pack_summary_/, { artifactKey: 'knowledge_pack_summary', artifactKind: 'knowledge_pack_summary', sourceFamily: 'workflow', policyTag: 'context' }],
    [/^knowledge_pack_retrieval_.*\.json$/, { artifactKey: 'knowledge_pack_retrieval_json', artifactKind: 'knowledge_pack_retrieval_json', sourceFamily: 'workflow', policyTag: 'coverage' }],
    [/^knowledge_pack_retrieval_/, { artifactKey: 'knowledge_pack_retrieval', artifactKind: 'knowledge_pack_retrieval', sourceFamily: 'workflow', policyTag: 'coverage' }],
    [/^coverage_ledger_.*\.json$/, { artifactKey: 'coverage_ledger_json', artifactKind: 'coverage_ledger_json', sourceFamily: 'workflow', policyTag: 'coverage' }],
    [/^request_fulfillment_/, { artifactKey: 'request_fulfillment', artifactKind: 'request_fulfillment', sourceFamily: 'workflow', policyTag: 'request_audit' }],
    [/^coverage_ledger_/, { artifactKey: 'coverage_ledger', artifactKind: 'coverage_ledger', sourceFamily: 'workflow', policyTag: 'coverage' }],
    [/^review_notes_/, { artifactKey: 'review_notes', artifactKind: 'review_notes', sourceFamily: 'workflow', policyTag: 'review' }],
    [/^review_delta_/, { artifactKey: 'review_delta', artifactKind: 'review_delta', sourceFamily: 'workflow', policyTag: 'review' }],
    [/^checkpoint_audit_/, { artifactKey: 'checkpoint_audit', artifactKind: 'checkpoint_audit', sourceFamily: 'workflow', policyTag: 'checkpoint' }],
    [/^checkpoint_delta_/, { artifactKey: 'checkpoint_delta', artifactKind: 'checkpoint_delta', sourceFamily: 'workflow', policyTag: 'checkpoint' }],
    [/^quality_delta_/, { artifactKey: 'quality_delta', artifactKind: 'quality_delta', sourceFamily: 'workflow', policyTag: 'quality' }],
    [/^research_phase4a_/, { artifactKey: 'research_phase4a', artifactKind: 'research_phase4a', sourceFamily: 'workflow', policyTag: 'bounded_research' }],
    [/^research_phase4b_/, { artifactKey: 'research_phase4b', artifactKind: 'research_phase4b', sourceFamily: 'workflow', policyTag: 'bounded_research' }],
    [/^research_phase5a_/, { artifactKey: 'research_phase5a', artifactKind: 'research_phase5a', sourceFamily: 'workflow', policyTag: 'bounded_research' }],
    [/^research_phase5b_/, { artifactKey: 'research_phase5b', artifactKind: 'research_phase5b', sourceFamily: 'workflow', policyTag: 'bounded_research' }],
    [/^research_phase6_/, { artifactKey: 'research_phase6', artifactKind: 'research_phase6', sourceFamily: 'workflow', policyTag: 'bounded_research' }],
  ];

  let base = null;
  for (const [pattern, metadata] of rules) {
    if (pattern.test(stem)) {
      base = metadata;
      break;
    }
  }

  const fallback = {
    artifactKey: stem.replace(/_[A-Z]+-\d+$/, '').replace(/_/g, '_'),
    artifactKind: stem.replace(/_[A-Z]+-\d+$/, ''),
    sourceFamily: 'workflow',
    policyTag: 'context',
  };
  const requirementIds = findRequirementIds(`context/${filename}`, task);
  return {
    ...(base || fallback),
    sourcePhase: inferSourcePhase(filename),
    phaseRequiredBy: findPhaseRequiredBy(requirementIds, task),
    requirementIds: requirementIds.length > 0 ? requirementIds.join(', ') : '—',
    satisfiesUserRequest: requirementIds.length > 0 ? 'yes' : 'no',
  };
}

function inferSourcePhase(filename) {
  if (filename.startsWith('knowledge_pack_summary_')) return 'Phase 0';
  if (filename.startsWith('coverage_ledger_')) return 'Phase 3';
  if (filename.startsWith('knowledge_pack_retrieval_')) return 'Phase 3';
  if (filename.startsWith('review_')) return 'Phase 5a';
  if (filename.startsWith('checkpoint_')) return 'Phase 5b';
  if (filename.startsWith('quality_')) return 'Phase 6';
  if (filename.startsWith('research_phase4a_')) return 'Phase 4a';
  if (filename.startsWith('research_phase4b_')) return 'Phase 4b';
  if (filename.startsWith('research_phase5a_')) return 'Phase 5a';
  if (filename.startsWith('research_phase5b_')) return 'Phase 5b';
  if (filename.startsWith('research_phase6_')) return 'Phase 6';
  return 'Phase 1';
}

async function readExistingLookup(lookupPath) {
  const map = new Map();
  if (!(await fileExists(lookupPath))) return map;
  const content = await readFile(lookupPath, 'utf8');
  const lines = content.split('\n').filter((line) => /^\|\s*\d+\s*\|/.test(line));
  for (const line of lines) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    const isExtendedLookup = cells.length >= 15;
    const isSplitPhaseLookup = cells.length >= 9;
    const filePath = isExtendedLookup ? stripCode(cells[2]) : stripCode(cells[2]);
    map.set(filePath, {
      artifactKey: stripCode(cells[1]),
      phase4a: isExtendedLookup ? cells[10] : cells[4],
      phase4b: isExtendedLookup ? cells[11] : cells[5],
      phase5a: isExtendedLookup ? cells[12] : cells[6],
      phase5b: isExtendedLookup ? (cells[13] || '❌') : isSplitPhaseLookup ? (cells[7] || '❌') : '❌',
      phase5: isExtendedLookup ? cells[12] : cells[6],
      phase6: isExtendedLookup ? (cells[14] || '❌') : isSplitPhaseLookup ? (cells[8] || '❌') : (cells[7] || '❌'),
    });
  }
  return map;
}

function stripCode(value) {
  return String(value || '').replace(/^`|`$/g, '');
}

async function safeReadDir(dir) {
  try {
    return await readdir(dir);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function findRequirementIds(filePath, task = {}) {
  const requirements = Array.isArray(task.request_requirements) ? task.request_requirements : [];
  return requirements
    .filter((requirement) => {
      const artifacts = Array.isArray(requirement.required_artifacts) ? requirement.required_artifacts : [];
      return artifacts.includes(filePath);
    })
    .map((requirement) => String(requirement.requirement_id || '').trim())
    .filter(Boolean);
}

function findPhaseRequiredBy(requirementIds, task = {}) {
  if (requirementIds.length === 0) return '—';
  const requirements = Array.isArray(task.request_requirements) ? task.request_requirements : [];
  const phases = requirements
    .filter((requirement) => requirementIds.includes(String(requirement.requirement_id || '').trim()))
    .map((requirement) => String(requirement.required_phase || '').trim())
    .filter(Boolean);
  return phases.length > 0 ? [...new Set(phases)].join(', ') : '—';
}

function collectMissingRequiredArtifacts(rows, task = {}) {
  const rowPaths = new Set(rows.map((row) => row.filePath));
  const requirements = Array.isArray(task.request_requirements) ? task.request_requirements : [];
  const excludedPrefixes = ['context/runtime_setup_'];
  const requiredPhases = new Set(['phase0', 'phase1', 'phase2']);
  return requirements
    .filter((requirement) => requiredPhases.has(String(requirement.required_phase || '').trim().toLowerCase()))
    .flatMap((requirement) => {
      const artifacts = Array.isArray(requirement.required_artifacts) ? requirement.required_artifacts : [];
      return artifacts
        .map((artifactPath) => String(artifactPath || '').trim())
        .filter(Boolean)
        .filter((artifactPath) => !excludedPrefixes.some((prefix) => artifactPath.startsWith(prefix)));
    })
    .filter((artifactPath) => !rowPaths.has(String(artifactPath || '').trim()));
}
