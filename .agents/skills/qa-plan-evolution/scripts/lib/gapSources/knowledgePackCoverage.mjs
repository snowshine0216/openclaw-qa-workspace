import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadQaPlanAdapter } from '../evidence/adapters/qa-plan.mjs';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function fileText(repoRoot, relativePath) {
  const fullPath = join(repoRoot, relativePath);
  if (!existsSync(fullPath)) {
    return '';
  }
  return readFileSync(fullPath, 'utf8');
}

export async function collectKnowledgePackCoverageObservations({ repoRoot, task }) {
  if (!task.knowledge_pack_key) {
    return {
      source_type: 'knowledge_pack_coverage',
      required: true,
      status: 'skipped',
      observations: [],
      errors: [],
    };
  }

  const adapter = loadQaPlanAdapter();
  const pack = adapter.checkKnowledgePack(repoRoot, task);
  if (pack.status !== 'present') {
    return {
      source_type: 'knowledge_pack_coverage',
      required: true,
      status: ['missing', 'skipped'].includes(pack.status) ? 'missing_source' : pack.status,
      observations: [],
      errors: [pack.reason || `knowledge pack ${task.knowledge_pack_key || '<missing>'} unavailable`],
    };
  }

  const packJsonPath = join(pack.path, 'pack.json');
  const packJson = readJson(packJsonPath);
  const corpus = [
    `${task.target_skill_path}/references/phase4a-contract.md`,
    `${task.target_skill_path}/references/review-rubric-phase5a.md`,
    `${task.target_skill_path}/references/review-rubric-phase5b.md`,
    `${task.target_skill_path}/evals/evals.json`,
    `${task.target_skill_path}/README.md`,
  ]
    .map((relativePath) => ({ relativePath, text: fileText(repoRoot, relativePath) }))
    .filter((entry) => entry.text);

  const observations = [];

  for (const capability of packJson.required_capabilities || []) {
    const covered = corpus.some((entry) =>
      entry.text.toLowerCase().includes(String(capability).toLowerCase()),
    );
    if (!covered) {
      observations.push({
        id: `obs-pack-capability-${String(capability).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        source_type: 'knowledge_pack_coverage',
        source_path: packJsonPath,
        summary: `Knowledge-pack capability "${capability}" is not mapped in target contracts or evals.`,
        details: 'Each required capability must map to a scenario, gate, or explicit exclusion.',
        taxonomy_candidates: ['knowledge_pack_gap'],
        target_files: [
          `${task.target_skill_path}/references/phase4a-contract.md`,
          `${task.target_skill_path}/evals/evals.json`,
        ],
        evals_affected: ['knowledge_pack_coverage'],
        knowledge_pack_key: task.knowledge_pack_key,
        confidence: 'high',
        blocking: true,
      });
    }
  }

  for (const analogGate of packJson.analog_gates || []) {
    const gateLabel = analogGate.behavior || analogGate.required_gate;
    const covered = corpus.some((entry) =>
      entry.text.includes('[ANALOG-GATE]') &&
      entry.text.toLowerCase().includes(String(gateLabel).toLowerCase()),
    );
    if (!covered) {
      observations.push({
        id: `obs-pack-analog-${String(gateLabel).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        source_type: 'knowledge_pack_coverage',
        source_path: packJsonPath,
        summary: `Analog gate "${gateLabel}" is not enforced in target review or summary artifacts.`,
        details: 'Historical analogs should be preserved as explicit analog-gate requirements.',
        taxonomy_candidates: ['analog_risk_not_gated', 'knowledge_pack_gap'],
        target_files: [
          `${task.target_skill_path}/references/review-rubric-phase5b.md`,
          `${task.target_skill_path}/scripts/lib/finalPlanSummary.mjs`,
        ],
        evals_affected: ['knowledge_pack_coverage', 'developer_smoke_generation'],
        knowledge_pack_key: task.knowledge_pack_key,
        confidence: 'high',
        blocking: true,
      });
    }
  }

  for (const sdkContract of packJson.sdk_visible_contracts || []) {
    const covered = corpus.some((entry) =>
      entry.text.includes(String(sdkContract)),
    );
    if (!covered) {
      observations.push({
        id: `obs-pack-sdk-${String(sdkContract).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        source_type: 'knowledge_pack_coverage',
        source_path: packJsonPath,
        summary: `SDK visible contract "${sdkContract}" is not mapped in target contracts or evals.`,
        details: 'SDK-visible outcomes must map to a scenario, gate, or explicit exclusion.',
        taxonomy_candidates: ['sdk_or_api_visible_contract_dropped', 'knowledge_pack_gap'],
        target_files: [
          `${task.target_skill_path}/references/phase4a-contract.md`,
          `${task.target_skill_path}/evals/evals.json`,
        ],
        evals_affected: ['knowledge_pack_coverage'],
        knowledge_pack_key: task.knowledge_pack_key,
        confidence: 'high',
        blocking: true,
      });
    }
  }

  for (const pair of packJson.interaction_pairs || []) {
    const labels = Array.isArray(pair) ? pair.map((term) => String(term)) : [];
    const covered = labels.length > 0 && corpus.some((entry) =>
      labels.every((term) => entry.text.toLowerCase().includes(term.toLowerCase())),
    );
    if (!covered) {
      const pairLabel = labels.join(' + ');
      observations.push({
        id: `obs-pack-interaction-${pairLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        source_type: 'knowledge_pack_coverage',
        source_path: packJsonPath,
        summary: `Interaction pair "${pairLabel}" is not mapped in target scenarios, review rules, or exclusions.`,
        details: 'Required interaction pairs must be covered by a scenario, review gate, or explicit exclusion.',
        taxonomy_candidates: ['interaction_gap', 'knowledge_pack_gap'],
        target_files: [
          `${task.target_skill_path}/references/review-rubric-phase5a.md`,
          `${task.target_skill_path}/evals/evals.json`,
        ],
        evals_affected: ['interaction_matrix_coverage', 'knowledge_pack_coverage'],
        knowledge_pack_key: task.knowledge_pack_key,
        confidence: 'high',
        blocking: true,
      });
    }
  }

  return {
    source_type: 'knowledge_pack_coverage',
    required: true,
    status: 'ok',
    observations,
    errors: [],
  };
}
