#!/usr/bin/env node
/**
 * Records completed Phase 1 spawns into run.json.spawn_history.
 * Call this after all Phase 1 subagents finish, before phase1.sh --post.
 *
 * Resolution order:
 * 1. Read phase1_spawn_manifest.json
 * 2. For each request, infer source_family from source
 * 3. Scan context/ for artifacts matching that source's contract
 * 4. Build spawn_history entries and merge into run.json
 */
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getApprovedSourceRule, normalizeSourceFamily } from './contextRules.mjs';
import { fileExists, readJson } from './workflowState.mjs';

const ARTIFACT_PATTERNS = {
  jira: ['jira_issue_', 'jira_related_issues_'],
  confluence: ['confluence_design_'],
  github: ['github_diff_', 'github_traceability_'],
  figma: ['figma_metadata_'],
};

const SUPPORTING_ARTIFACT_PATTERNS = ['supporting_issue_summary_', 'supporting_artifact_summary_'];

function getField(record, camelKey, snakeKey) {
  return record?.[camelKey] ?? record?.[snakeKey];
}

async function collectArtifactPathsForSource(contextDir, sourceFamily, featureId, hasSupportingArtifacts) {
  const normalized = normalizeSourceFamily(sourceFamily);
  const patterns = ARTIFACT_PATTERNS[normalized] || [];
  const paths = [];
  let files = [];
  try {
    files = await readdir(contextDir);
  } catch {
    return paths;
  }
  const lowerFeatureId = String(featureId || '').toLowerCase();
  for (const name of files) {
    if (!name.endsWith('.md') && !name.endsWith('.json')) continue;
    const lower = name.toLowerCase();
    const relPath = `context/${name}`;
    for (const pattern of patterns) {
      if (lower.includes(pattern.toLowerCase())) {
        paths.push(relPath);
        break;
      }
    }
    if (hasSupportingArtifacts && SUPPORTING_ARTIFACT_PATTERNS.some((pattern) => lower.includes(pattern.toLowerCase()))) {
      if (!paths.includes(relPath)) paths.push(relPath);
    }
  }
  return [...new Set(paths)];
}

function buildDisallowedTools(sourceFamily) {
  const rule = getApprovedSourceRule(sourceFamily);
  if (!rule) return [];
  const tools = [];
  if (!rule.allowsBrowserFetch) {
    tools.push('browser fetch', 'generic web fetch');
  }
  if (!rule.allowsGenericWebFetch) {
    if (!tools.includes('generic web fetch')) tools.push('generic web fetch');
  }
  return [...new Set(tools)];
}

export async function recordPhase1SpawnCompletion(featureId, runDir) {
  const manifestPath = join(runDir, 'phase1_spawn_manifest.json');
  const runPath = join(runDir, 'run.json');
  const contextDir = join(runDir, 'context');

  if (!(await fileExists(manifestPath))) {
    throw new Error(`Missing phase1 spawn manifest at ${manifestPath}`);
  }
  const manifest = await readJson(manifestPath, null);
  if (!manifest?.requests?.length) {
    throw new Error(`Manifest has no requests: ${manifestPath}`);
  }

  const run = await readJson(runPath, null);
  if (!run) {
    throw new Error(`Missing run.json at ${runPath}`);
  }
  const hasSupportingArtifacts = Boolean(run.has_supporting_artifacts);
  const existingHistory = Array.isArray(run.spawn_history) ? run.spawn_history : [];
  const recordedSources = new Set(
    existingHistory.map((e) => normalizeSourceFamily(getField(e, 'sourceFamily', 'source_family')))
  );
  const recordedSupportKeys = new Set(
    existingHistory
      .filter((entry) => String(getField(entry, 'sourceKind', 'source_kind') || '').trim() === 'supporting-issue-context')
      .map((entry) => String(entry.supporting_issue_key || '').trim())
      .filter(Boolean)
  );

  const spawnHistory = [...existingHistory];

  for (const req of manifest.requests) {
    const source = req.source || {};
    const sourceKind = String(getField(source, 'kind', 'kind') || '').trim();
    if (sourceKind === 'supporting-issue-context') {
      const supportKey = String(source.supporting_issue_key || '').trim();
      if (!supportKey || recordedSupportKeys.has(supportKey)) continue;
      spawnHistory.push({
        source_kind: 'supporting-issue-context',
        supporting_issue_key: supportKey,
        request_requirement_ids: getField(source, 'requestRequirementIds', 'request_requirement_ids') || [],
        status: 'completed',
        artifact_paths: getField(source, 'outputArtifactPaths', 'output_artifact_paths') || [],
      });
      recordedSupportKeys.add(supportKey);
      continue;
    }
    const sourceFamily = getField(source, 'sourceFamily', 'source_family');
    if (!sourceFamily) continue;
    const normalized = normalizeSourceFamily(sourceFamily);
    if (recordedSources.has(normalized)) continue;

    const rule = getApprovedSourceRule(sourceFamily);
    const approvedSkill = rule?.approvedSkills?.[0] || 'unknown';
    const artifactPaths = await collectArtifactPathsForSource(
      contextDir,
      sourceFamily,
      featureId,
      hasSupportingArtifacts
    );

    spawnHistory.push({
      source_family: normalized,
      approved_skill: approvedSkill,
      status: 'completed',
      artifact_paths: artifactPaths,
      disallowed_tools: buildDisallowedTools(sourceFamily),
    });
    recordedSources.add(normalized);
  }

  run.spawn_history = spawnHistory;
  run.updated_at = new Date().toISOString();
  await writeFile(runPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');
  return spawnHistory;
}

export async function recordSpawnCompletionCli(argv = process.argv.slice(2)) {
  const [phaseId, featureId, runDir] = argv;
  if (!phaseId || !featureId || !runDir) {
    console.error('Usage: record_spawn_completion.sh <phase-id> <feature-id> <run-dir>');
    process.exit(1);
  }
  if (phaseId !== 'phase1') {
    console.error('Only phase1 is supported for spawn history recording.');
    process.exit(1);
  }
  try {
    const history = await recordPhase1SpawnCompletion(featureId, runDir);
    console.log(`SPAWN_HISTORY_RECORDED: ${history.length} entries`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  recordSpawnCompletionCli();
}
