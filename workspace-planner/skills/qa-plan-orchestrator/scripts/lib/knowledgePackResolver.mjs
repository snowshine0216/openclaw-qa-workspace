import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function normalize(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

function loadQaPlanCases(repoRoot, targetSkillPath) {
  const casesPath = join(repoRoot, targetSkillPath, 'benchmarks', 'qa-plan-v2', 'cases.json');
  if (!existsSync(casesPath)) {
    return [];
  }
  try {
    const payload = JSON.parse(readFileSync(casesPath, 'utf8'));
    return Array.isArray(payload.cases) ? payload.cases : [];
  } catch {
    return [];
  }
}

export function isQaPlanTarget({
  targetSkillName,
  targetSkillPath,
  benchmarkProfile,
}) {
  return (
    String(benchmarkProfile || '').startsWith('qa-plan') ||
    String(targetSkillName || '').includes('qa-plan') ||
    String(targetSkillPath || '').includes('qa-plan-orchestrator')
  );
}

export function resolveKnowledgePackKey({
  repoRoot,
  targetSkillPath,
  targetSkillName,
  benchmarkProfile,
  requestedKnowledgePackKey,
  featureFamily,
  featureId,
}) {
  const requested = normalize(requestedKnowledgePackKey);
  if (requested) {
    return { key: requested, source: 'provided' };
  }

  if (!isQaPlanTarget({ targetSkillName, targetSkillPath, benchmarkProfile })) {
    return { key: null, source: 'not_applicable' };
  }

  const normalizedFamily = normalize(featureFamily);
  if (normalizedFamily) {
    return { key: normalizedFamily, source: 'feature_family' };
  }

  const normalizedFeatureId = normalize(featureId);
  if (normalizedFeatureId) {
    const cases = loadQaPlanCases(repoRoot, targetSkillPath);
    const matchingKeys = [
      ...new Set(
        cases
          .filter((caseDefinition) => normalize(caseDefinition.feature_id) === normalizedFeatureId)
          .map((caseDefinition) => normalize(caseDefinition.knowledge_pack_key))
          .filter(Boolean),
      ),
    ];
    if (matchingKeys.length === 1) {
      return { key: matchingKeys[0], source: 'cases_lookup' };
    }
  }

  return { key: 'general', source: 'default_general' };
}
