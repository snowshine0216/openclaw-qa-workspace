import { join } from 'node:path';

import { loadJson, writeJson } from '../../../qa-plan-v1/scripts/lib/iteration0Benchmark.mjs';

export async function loadCaseIndex(casesPath) {
  const casesDocument = await loadJson(casesPath);
  return new Map(casesDocument.cases.map((caseDefinition, index) => [index + 1, caseDefinition]));
}

function calculateMean(values) {
  if (values.length === 0) {
    return null;
  }
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));
}

export function computeModeScores({
  benchmark,
  caseIndex,
  primaryConfiguration,
  referenceConfiguration,
}) {
  const modes = ['blind_pre_defect', 'retrospective_replay', 'holdout_regression'];
  const buckets = {
    primary: Object.fromEntries(modes.map((mode) => [mode, []])),
    reference: Object.fromEntries(modes.map((mode) => [mode, []])),
  };
  const evalSets = {
    primary: Object.fromEntries(modes.map((mode) => [mode, new Set()])),
    reference: Object.fromEntries(modes.map((mode) => [mode, new Set()])),
  };

  for (const run of benchmark.runs || []) {
    const caseDefinition = caseIndex.get(run.eval_id);
    if (!caseDefinition) {
      continue;
    }
    const mode = caseDefinition.evidence_mode;
    if (run.configuration === primaryConfiguration) {
      buckets.primary[mode].push(run.result.pass_rate);
      evalSets.primary[mode].add(run.eval_id);
    } else if (run.configuration === referenceConfiguration) {
      buckets.reference[mode].push(run.result.pass_rate);
      evalSets.reference[mode].add(run.eval_id);
    }
  }

  const primary = {};
  const reference = {};
  const delta = {};

  for (const mode of modes) {
    primary[mode] = {
      eval_count: evalSets.primary[mode].size,
      run_count: buckets.primary[mode].length,
      mean_pass_rate: calculateMean(buckets.primary[mode]),
    };
    reference[mode] = {
      eval_count: evalSets.reference[mode].size,
      run_count: buckets.reference[mode].length,
      mean_pass_rate: calculateMean(buckets.reference[mode]),
    };

    const primaryMean = primary[mode].mean_pass_rate;
    const referenceMean = reference[mode].mean_pass_rate;
    delta[mode] = {
      eval_count_delta: primary[mode].eval_count - reference[mode].eval_count,
      run_count_delta: primary[mode].run_count - reference[mode].run_count,
      mean_pass_rate: primaryMean == null || referenceMean == null
        ? null
        : Number((primaryMean - referenceMean).toFixed(4)),
    };
  }

  return { primary, reference, delta };
}

function computeBlockingCasePass({
  benchmark,
  caseIndex,
  configuration,
}) {
  const blockingRuns = (benchmark.runs || []).filter((run) => {
    const caseDefinition = caseIndex.get(run.eval_id);
    return run.configuration === configuration && caseDefinition?.blocking;
  });

  if (blockingRuns.length === 0) {
    return true;
  }

  return blockingRuns.every((run) => run.result.pass_rate >= 1);
}

function isModeActive(activeEvidenceModes, mode) {
  return activeEvidenceModes.has(mode);
}

function evaluateModeCheck({
  activeEvidenceModes,
  mode,
  primaryMean,
  referenceMean,
  predicate,
}) {
  if (!isModeActive(activeEvidenceModes, mode)) {
    return true;
  }
  if (primaryMean == null || referenceMean == null) {
    return false;
  }
  return predicate(primaryMean, referenceMean);
}

export function buildScorecard({
  benchmark,
  benchmarkManifest,
  caseIndex,
  comparisonMode,
  primaryConfiguration,
  referenceConfiguration,
  iteration,
  scoringFidelity = benchmark.metadata?.scoring_fidelity ?? 'executed',
}) {
  const modeScores = computeModeScores({
    benchmark,
    caseIndex,
    primaryConfiguration,
    referenceConfiguration,
  });
  const activeEvidenceModes = new Set(
    benchmark.metadata?.active_evidence_modes ??
      Object.entries(modeScores.primary)
        .filter(([, value]) => value.run_count > 0)
        .map(([mode]) => mode),
  );

  const primaryBlind = modeScores.primary.blind_pre_defect.mean_pass_rate;
  const referenceBlind = modeScores.reference.blind_pre_defect.mean_pass_rate;
  const primaryReplay = modeScores.primary.retrospective_replay.mean_pass_rate;
  const referenceReplay = modeScores.reference.retrospective_replay.mean_pass_rate;
  const primaryHoldout = modeScores.primary.holdout_regression.mean_pass_rate;
  const referenceHoldout = modeScores.reference.holdout_regression.mean_pass_rate;

  const acceptanceChecks = {
    blocking_cases_pass: computeBlockingCasePass({
      benchmark,
      caseIndex,
      configuration: primaryConfiguration,
    }),
    blind_pre_defect_non_regression: evaluateModeCheck({
      activeEvidenceModes,
      mode: 'blind_pre_defect',
      primaryMean: primaryBlind,
      referenceMean: referenceBlind,
      predicate: (primary, reference) => primary >= reference,
    }),
    retrospective_replay_improved: evaluateModeCheck({
      activeEvidenceModes,
      mode: 'retrospective_replay',
      primaryMean: primaryReplay,
      referenceMean: referenceReplay,
      predicate: (primary, reference) => primary > reference,
    }),
    holdout_regression_non_regression: evaluateModeCheck({
      activeEvidenceModes,
      mode: 'holdout_regression',
      primaryMean: primaryHoldout,
      referenceMean: referenceHoldout,
      predicate: (primary, reference) => primary >= reference,
    }),
  };

  const shouldRequireBlocking = benchmarkManifest.acceptance_policy?.require_blocking_cases_pass !== false;
  const shouldRequireBlind = isModeActive(activeEvidenceModes, 'blind_pre_defect') &&
    benchmarkManifest.acceptance_policy?.require_non_decreasing_blind_score !== false;
  const shouldRequireReplay = isModeActive(activeEvidenceModes, 'retrospective_replay') &&
    benchmarkManifest.acceptance_policy?.require_non_decreasing_replay_score !== false;
  const shouldRequireHoldout = isModeActive(activeEvidenceModes, 'holdout_regression') &&
    benchmarkManifest.acceptance_policy?.require_no_holdout_regression !== false;

  const decisionPassed =
    (!shouldRequireBlocking || acceptanceChecks.blocking_cases_pass) &&
    (!shouldRequireBlind || acceptanceChecks.blind_pre_defect_non_regression) &&
    (!shouldRequireReplay || acceptanceChecks.retrospective_replay_improved) &&
    (!shouldRequireHoldout || acceptanceChecks.holdout_regression_non_regression);
  const blockedSynthetic = scoringFidelity === 'synthetic';

  return {
    benchmark_version: benchmarkManifest.benchmark_version,
    iteration,
    comparison_mode: comparisonMode,
    scoring_fidelity: scoringFidelity,
    primary_configuration: primaryConfiguration,
    reference_configuration: referenceConfiguration,
    active_evidence_modes: [...activeEvidenceModes],
    acceptance_checks: {
      ...acceptanceChecks,
      policy: {
        require_blocking_cases_pass: shouldRequireBlocking,
        require_non_decreasing_blind_score: shouldRequireBlind,
        require_non_decreasing_replay_score: shouldRequireReplay,
        require_no_holdout_regression: shouldRequireHoldout,
        null_score_policy: 'reject',
      },
    },
    mode_scores: modeScores,
    decision: {
      result: blockedSynthetic
        ? 'blocked_synthetic'
        : (decisionPassed ? 'accept' : 'reject'),
      reason: blockedSynthetic
        ? 'Synthetic structural comparison is informative only and cannot promote a challenger.'
        : (decisionPassed
          ? 'blind_pre_defect did not regress, retrospective_replay improved, and holdout_regression did not regress.'
          : 'One or more evidence-mode acceptance checks failed.'),
    },
  };
}

export async function writeScorecardForIteration({
  benchmarkRoot,
  iterationDir,
  iteration,
  comparisonMode,
  primaryConfiguration,
  referenceConfiguration,
  scoringFidelity = null,
}) {
  const benchmarkManifest = await loadJson(join(benchmarkRoot, 'benchmark_manifest.json'));
  const caseIndex = await loadCaseIndex(join(benchmarkRoot, 'cases.json'));
  const benchmark = await loadJson(join(iterationDir, 'benchmark.json'));

  const scorecard = buildScorecard({
    benchmark,
    benchmarkManifest,
    caseIndex,
    comparisonMode,
    primaryConfiguration,
    referenceConfiguration,
    iteration,
    scoringFidelity: scoringFidelity ?? benchmark.metadata?.scoring_fidelity ?? 'executed',
  });

  const scorecardPath = join(iterationDir, 'scorecard.json');
  await writeJson(scorecardPath, scorecard);
  return scorecardPath;
}
