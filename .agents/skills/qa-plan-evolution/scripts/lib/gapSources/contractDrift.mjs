import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function hasText(haystack, needle) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export async function collectContractDriftObservations({ repoRoot, task }) {
  const skillPath = join(repoRoot, task.target_skill_path, 'SKILL.md');
  const referencePath = join(repoRoot, task.target_skill_path, 'reference.md');
  if (!existsSync(skillPath) || !existsSync(referencePath)) {
    return {
      source_type: 'contract_drift',
      required: true,
      status: 'missing_source',
      observations: [],
      errors: ['target SKILL.md or reference.md missing'],
    };
  }

  const skillDoc = readFileSync(skillPath, 'utf8');
  const referenceDoc = readFileSync(referencePath, 'utf8');
  const observations = [];
  const reportStateMentioned = hasText(skillDoc, 'REPORT_STATE') && hasText(referenceDoc, 'REPORT_STATE');
  if (!reportStateMentioned) {
    observations.push({
      id: 'obs-contract-report-state',
      source_type: 'contract_drift',
      source_path: referencePath,
      summary: 'REPORT_STATE contract is not consistently declared across target docs.',
      details: 'Target skill docs should preserve runtime state semantics.',
      taxonomy_candidates: ['traceability_gap'],
      target_files: [
        `${task.target_skill_path}/SKILL.md`,
        `${task.target_skill_path}/reference.md`,
      ],
      evals_affected: ['contract_evals'],
      confidence: 'medium',
      blocking: true,
    });
  }

  return {
    source_type: 'contract_drift',
    required: true,
    status: 'ok',
    observations,
    errors: [],
  };
}
