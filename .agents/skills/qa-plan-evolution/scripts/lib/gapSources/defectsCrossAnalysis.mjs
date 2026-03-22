import { existsSync, readFileSync } from 'node:fs';
import { loadQaPlanAdapter } from '../evidence/adapters/qa-plan.mjs';

const PATTERN_BUCKETS = [
  { pattern: /missing scenario/i, bucket: 'missing_scenario' },
  { pattern: /interaction/i, bucket: 'interaction_gap' },
  { pattern: /developer smoke|developer self-test/i, bucket: 'developer_artifact_missing' },
  { pattern: /traceability/i, bucket: 'traceability_gap' },
];

function deriveBucket(text) {
  return (
    PATTERN_BUCKETS.find((entry) => entry.pattern.test(text))?.bucket ??
    'missing_scenario'
  );
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function severityRank(severity) {
  if (severity === 'high') return 0;
  if (severity === 'medium') return 1;
  return 2;
}

function mapStructuredGapToObservation(task, sourcePath, gap, index) {
  return {
    id: gap.gap_id ?? `obs-defects-cross-gap-${index + 1}`,
    source_type: 'defects_cross_analysis',
    source_path: sourcePath,
    summary: gap.summary,
    details: gap.title ?? gap.summary,
    taxonomy_candidates: [gap.root_cause_bucket],
    target_files: gap.recommended_target_files ?? [],
    evals_affected: ['defect_recall_replay'],
    knowledge_pack_key: task.knowledge_pack_key ?? gap.feature_family ?? null,
    confidence: severityRank(gap.severity) === 0 ? 'high' : 'medium',
    blocking: severityRank(gap.severity) < 2,
    severity: gap.severity ?? 'medium',
    affected_phase: gap.affected_phase ?? null,
    feature_family: gap.feature_family ?? task.feature_family ?? null,
    generalization_scope: gap.generalization_scope ?? null,
    source_defects: gap.source_defects ?? [],
  };
}

export async function collectDefectsCrossAnalysisObservations({ repoRoot, task }) {
  const adapter = loadQaPlanAdapter();
  const defectsInfo = adapter.checkDefectsAnalysis(repoRoot, task);
  if (defectsInfo.status !== 'present' && defectsInfo.status !== 'stale') {
    return {
      source_type: 'defects_cross_analysis',
      required: true,
      status: ['missing', 'missing_source'].includes(defectsInfo.status)
        ? 'missing_source'
        : defectsInfo.status,
      observations: [],
      errors: [defectsInfo.reason || 'defects-analysis artifacts unavailable'],
    };
  }

  if (defectsInfo.gap_bundle_path && existsSync(defectsInfo.gap_bundle_path)) {
    const bundle = readJson(defectsInfo.gap_bundle_path);
    const observations = (bundle.gaps ?? []).map((gap, index) =>
      mapStructuredGapToObservation(task, defectsInfo.gap_bundle_path, gap, index),
    );
    return {
      source_type: 'defects_cross_analysis',
      required: true,
      status: 'ok',
      observations,
      errors: [],
    };
  }

  const sourcePaths = [
    defectsInfo.qa_plan_cross_analysis_path,
    defectsInfo.self_test_gap_analysis_path,
  ].filter(Boolean);
  const observations = [];
  for (const sourcePath of sourcePaths) {
    if (!existsSync(sourcePath)) {
      continue;
    }
    const content = readFileSync(sourcePath, 'utf8');
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- ') || line.startsWith('* '));
    for (const [index, line] of lines.entries()) {
      const summary = line.replace(/^[-*]\s+/, '');
      observations.push({
        id: `obs-defects-cross-${index + 1}-${deriveBucket(summary)}`,
        source_type: 'defects_cross_analysis',
        source_path: sourcePath,
        summary,
        details: summary,
        taxonomy_candidates: [deriveBucket(summary)],
        target_files: [
          `${task.target_skill_path}/references/phase4a-contract.md`,
          `${task.target_skill_path}/references/review-rubric-phase5a.md`,
          `${task.target_skill_path}/scripts/lib/finalPlanSummary.mjs`,
        ],
        evals_affected: ['defect_recall_replay', 'self_test_gap_explanation'],
        knowledge_pack_key: task.knowledge_pack_key,
        confidence: 'high',
        blocking: true,
      });
    }
  }

  return {
    source_type: 'defects_cross_analysis',
    required: true,
    status: 'ok',
    observations,
    errors: [],
  };
}
