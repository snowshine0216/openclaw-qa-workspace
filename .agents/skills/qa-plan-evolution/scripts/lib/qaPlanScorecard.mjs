function readPrimaryModePassRate(scorecard, mode) {
  const value = scorecard?.mode_scores?.primary?.[mode]?.mean_pass_rate;
  return value == null ? null : value;
}

function firstDefinedModeScore(scorecard, modes) {
  for (const mode of modes) {
    const value = readPrimaryModePassRate(scorecard, mode);
    if (value != null) {
      return value;
    }
  }
  return null;
}

function resolveKnowledgePackCoverageScore(scorecard, validationSummary) {
  const activeModes = new Set(
    Array.isArray(scorecard?.active_evidence_modes)
      ? scorecard.active_evidence_modes
      : [],
  );
  const preferredModes = [
    ...(activeModes.has('holdout_regression') ? ['holdout_regression'] : []),
    ...(activeModes.has('retrospective_replay') ? ['retrospective_replay'] : []),
    ...(activeModes.has('blind_pre_defect') ? ['blind_pre_defect'] : []),
    'holdout_regression',
    'retrospective_replay',
    'blind_pre_defect',
  ];
  const modeScore = firstDefinedModeScore(scorecard, preferredModes);
  return modeScore ?? validationSummary.knowledge_pack_coverage_score ?? 0;
}

export function assertExecutedQaPlanScorecard(scorecard, context = 'qa-plan benchmark scorecard') {
  const scoringFidelity = scorecard?.scoring_fidelity ?? 'unknown';
  if (scoringFidelity !== 'executed') {
    throw new Error(
      `Invalid ${context} fidelity: expected "executed", received "${scoringFidelity}"`,
    );
  }
}

export function buildQaPlanOutcomeFromScorecard(scorecard, validationSummary = {}) {
  return {
    scores: {
      defect_recall_score:
        readPrimaryModePassRate(scorecard, 'retrospective_replay') ??
        validationSummary.defect_recall_score ??
        0,
      contract_compliance_score:
        readPrimaryModePassRate(scorecard, 'blind_pre_defect') ??
        validationSummary.contract_compliance_score ??
        0,
      knowledge_pack_coverage_score:
        resolveKnowledgePackCoverageScore(scorecard, validationSummary),
      regression_count: scorecard.decision?.result === 'accept' ? 0 : 1,
    },
    accept: scorecard.decision?.result === 'accept',
    blocking_regression: scorecard.decision?.result !== 'accept',
    primary_metrics: Array.isArray(scorecard.active_evidence_modes)
      ? scorecard.active_evidence_modes
      : ['blind_pre_defect', 'retrospective_replay', 'holdout_regression'],
    meaningful_improvement: scorecard.decision?.result === 'accept',
    benchmark_scorecard: scorecard,
  };
}
