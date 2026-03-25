import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  buildScorecard,
  computeFamilyModeScores,
  computeModeScores,
  loadCaseIndex,
  writeScorecardForIteration,
} from '../benchmarks/qa-plan-v2/scripts/lib/scoreBenchmarkV2.mjs';

function buildRun({ evalId, configuration, passRate }) {
  return {
    eval_id: evalId,
    configuration,
    run_number: 1,
    result: {
      pass_rate: passRate,
      passed: Math.round(passRate * 10),
      failed: 10 - Math.round(passRate * 10),
      total: 10,
      time_seconds: 100,
      tokens: 1000,
      tool_calls: 10,
      errors: 0,
    },
    expectations: [],
    notes: [],
  };
}

test('computeModeScores groups mean pass rate by evidence mode and configuration', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', blocking: true }],
    [2, { evidence_mode: 'retrospective_replay', blocking: true }],
    [3, { evidence_mode: 'holdout_regression', blocking: true }],
  ]);
  const benchmark = {
    runs: [
      buildRun({ evalId: 1, configuration: 'new_skill', passRate: 0.9 }),
      buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.8 }),
      buildRun({ evalId: 2, configuration: 'new_skill', passRate: 0.9 }),
      buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.7 }),
      buildRun({ evalId: 3, configuration: 'new_skill', passRate: 0.8 }),
      buildRun({ evalId: 3, configuration: 'old_skill', passRate: 0.8 }),
    ],
  };

  const scores = computeModeScores({
    benchmark,
    caseIndex,
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
  });

  assert.equal(scores.primary.blind_pre_defect.mean_pass_rate, 0.9);
  assert.equal(scores.reference.retrospective_replay.mean_pass_rate, 0.7);
  assert.equal(scores.delta.holdout_regression.mean_pass_rate, 0);
});

test('buildScorecard accepts only when blind and holdout do not regress and replay improves', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', blocking: true }],
    [2, { evidence_mode: 'retrospective_replay', blocking: true }],
    [3, { evidence_mode: 'holdout_regression', blocking: true }],
  ]);
  const benchmark = {
    metadata: {
      skill_name: 'qa-plan-orchestrator',
    },
    runs: [
      buildRun({ evalId: 1, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.8 }),
      buildRun({ evalId: 2, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.6 }),
      buildRun({ evalId: 3, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 3, configuration: 'old_skill', passRate: 0.9 }),
    ],
  };
  const manifest = {
    benchmark_version: 'qa-plan-v2',
    acceptance_policy: {
      require_blocking_cases_pass: true,
      require_no_holdout_regression: true,
      require_non_decreasing_blind_score: true,
      require_non_decreasing_replay_score: true,
    },
  };

  const scorecard = buildScorecard({
    benchmark,
    benchmarkManifest: manifest,
    caseIndex,
    comparisonMode: 'iteration_compare',
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
    iteration: 1,
  });

  assert.equal(scorecard.decision.result, 'accept');
  assert.equal(scorecard.acceptance_checks.blind_pre_defect_non_regression, true);
  assert.equal(scorecard.acceptance_checks.retrospective_replay_improved, true);
  assert.equal(scorecard.acceptance_checks.holdout_regression_non_regression, true);
});

test('buildScorecard rejects when blind_pre_defect regresses even if replay improves', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', blocking: true }],
    [2, { evidence_mode: 'retrospective_replay', blocking: true }],
    [3, { evidence_mode: 'holdout_regression', blocking: true }],
  ]);
  const benchmark = {
    runs: [
      buildRun({ evalId: 1, configuration: 'new_skill', passRate: 0.7 }),
      buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.8 }),
      buildRun({ evalId: 2, configuration: 'new_skill', passRate: 0.95 }),
      buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.5 }),
      buildRun({ evalId: 3, configuration: 'new_skill', passRate: 0.9 }),
      buildRun({ evalId: 3, configuration: 'old_skill', passRate: 0.9 }),
    ],
  };
  const manifest = {
    benchmark_version: 'qa-plan-v2',
    acceptance_policy: {
      require_blocking_cases_pass: true,
      require_no_holdout_regression: true,
      require_non_decreasing_blind_score: true,
      require_non_decreasing_replay_score: true,
    },
  };

  const scorecard = buildScorecard({
    benchmark,
    benchmarkManifest: manifest,
    caseIndex,
    comparisonMode: 'iteration_compare',
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
    iteration: 1,
  });

  assert.equal(scorecard.decision.result, 'reject');
  assert.equal(scorecard.acceptance_checks.blind_pre_defect_non_regression, false);
  assert.equal(scorecard.acceptance_checks.retrospective_replay_improved, true);
});

test('computeFamilyModeScores computes per-family pass rates by mode', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', feature_family: 'report-editor', blocking: true }],
    [2, { evidence_mode: 'blind_pre_defect', feature_family: 'visualization', blocking: true }],
    [3, { evidence_mode: 'holdout_regression', feature_family: 'docs', blocking: true }],
  ]);
  const benchmark = {
    runs: [
      buildRun({ evalId: 1, configuration: 'new_skill', passRate: 0.9 }),
      buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.9 }),
      buildRun({ evalId: 2, configuration: 'new_skill', passRate: 0.95 }),
      buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.9 }),
      buildRun({ evalId: 3, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 3, configuration: 'old_skill', passRate: 1 }),
    ],
  };

  const scores = computeFamilyModeScores({
    benchmark,
    caseIndex,
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
  });

  assert.equal(scores.delta.blind_pre_defect['visualization'].mean_pass_rate, 0.05);
  assert.equal(scores.delta.holdout_regression.docs.mean_pass_rate, 0);
});

test('buildScorecard rejects when non-target families regress on blind/holdout modes', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', feature_family: 'report-editor', blocking: true }],
    [2, { evidence_mode: 'blind_pre_defect', feature_family: 'visualization', blocking: true }],
    [3, { evidence_mode: 'holdout_regression', feature_family: 'docs', blocking: true }],
  ]);
  const benchmark = {
    metadata: {
      target_feature_family: 'report-editor',
      active_evidence_modes: ['blind_pre_defect', 'holdout_regression'],
    },
    runs: [
      buildRun({ evalId: 1, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.95 }),
      buildRun({ evalId: 2, configuration: 'new_skill', passRate: 0.7 }),
      buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.9 }),
      buildRun({ evalId: 3, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 3, configuration: 'old_skill', passRate: 1 }),
    ],
  };
  const manifest = {
    benchmark_version: 'qa-plan-v2',
    acceptance_policy: {
      require_blocking_cases_pass: true,
      require_no_holdout_regression: true,
      require_non_decreasing_blind_score: true,
      require_non_decreasing_replay_score: false,
      require_non_target_family_non_regression: true,
    },
  };

  const scorecard = buildScorecard({
    benchmark,
    benchmarkManifest: manifest,
    caseIndex,
    comparisonMode: 'executed_benchmark_compare',
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
    iteration: 1,
  });

  assert.equal(scorecard.decision.result, 'reject');
  assert.equal(scorecard.acceptance_checks.non_target_family_non_regression, false);
});

test('buildScorecard rejects missing evidence instead of silently passing null mean scores', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', blocking: true }],
    [2, { evidence_mode: 'holdout_regression', blocking: true }],
  ]);
  const benchmark = {
    metadata: {
      active_evidence_modes: ['blind_pre_defect', 'holdout_regression'],
    },
    runs: [],
  };
  const manifest = {
    benchmark_version: 'qa-plan-v2',
    acceptance_policy: {
      require_blocking_cases_pass: true,
      require_no_holdout_regression: true,
      require_non_decreasing_blind_score: true,
      require_non_decreasing_replay_score: true,
    },
  };

  const scorecard = buildScorecard({
    benchmark,
    benchmarkManifest: manifest,
    caseIndex,
    comparisonMode: 'executed_benchmark_compare',
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
    iteration: 1,
  });

  assert.equal(scorecard.decision.result, 'reject');
  assert.equal(scorecard.acceptance_checks.blind_pre_defect_non_regression, false);
  assert.equal(scorecard.acceptance_checks.holdout_regression_non_regression, false);
  assert.equal(scorecard.acceptance_checks.policy.null_score_policy, 'reject');
});

test('buildScorecard blocks synthetic scorecards from promotion', () => {
  const caseIndex = new Map([
    [1, { evidence_mode: 'blind_pre_defect', blocking: true }],
    [2, { evidence_mode: 'holdout_regression', blocking: true }],
  ]);
  const benchmark = {
    metadata: {
      active_evidence_modes: ['blind_pre_defect', 'holdout_regression'],
    },
    runs: [
      buildRun({ evalId: 1, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.8 }),
      buildRun({ evalId: 2, configuration: 'new_skill', passRate: 1 }),
      buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.9 }),
    ],
  };
  const manifest = {
    benchmark_version: 'qa-plan-v2',
    acceptance_policy: {
      require_blocking_cases_pass: true,
      require_no_holdout_regression: true,
      require_non_decreasing_blind_score: true,
      require_non_decreasing_replay_score: true,
    },
  };

  const scorecard = buildScorecard({
    benchmark,
    benchmarkManifest: manifest,
    caseIndex,
    comparisonMode: 'synthetic_structural_compare',
    primaryConfiguration: 'new_skill',
    referenceConfiguration: 'old_skill',
    iteration: 1,
    scoringFidelity: 'synthetic',
  });

  assert.equal(scorecard.scoring_fidelity, 'synthetic');
  assert.equal(scorecard.decision.result, 'blocked_synthetic');
});

test('writeScorecardForIteration writes scorecard.json from benchmark and case metadata', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-score-'));
  const benchmarkRoot = join(tmp, 'benchmarks', 'qa-plan-v2');
  const iterationDir = join(benchmarkRoot, 'iteration-1');

  try {
    await mkdir(iterationDir, { recursive: true });
    await writeFile(join(benchmarkRoot, 'benchmark_manifest.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v2',
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_no_holdout_regression: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: true,
      },
    }, null, 2), 'utf8');
    await writeFile(join(benchmarkRoot, 'cases.json'), JSON.stringify({
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'CASE-1',
          feature_id: 'BCIN-1',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'phase0',
          kind: 'phase_contract',
          evidence_mode: 'blind_pre_defect',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'blind check',
        },
        {
          case_id: 'CASE-2',
          feature_id: 'BCIN-2',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'phase5b',
          kind: 'checkpoint_enforcement',
          evidence_mode: 'retrospective_replay',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'replay check',
        },
      ],
    }, null, 2), 'utf8');
    await writeFile(join(iterationDir, 'benchmark.json'), JSON.stringify({
      runs: [
        buildRun({ evalId: 1, configuration: 'new_skill', passRate: 1 }),
        buildRun({ evalId: 1, configuration: 'old_skill', passRate: 0.8 }),
        buildRun({ evalId: 2, configuration: 'new_skill', passRate: 1 }),
        buildRun({ evalId: 2, configuration: 'old_skill', passRate: 0.75 }),
      ],
    }, null, 2), 'utf8');

    const scorecardPath = await writeScorecardForIteration({
      benchmarkRoot,
      iterationDir,
      iteration: 1,
      comparisonMode: 'iteration_compare',
      primaryConfiguration: 'new_skill',
      referenceConfiguration: 'old_skill',
    });

    const written = JSON.parse(await readFile(scorecardPath, 'utf8'));
    assert.equal(written.decision.result, 'accept');
    assert.equal(written.mode_scores.primary.blind_pre_defect.mean_pass_rate, 1);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('loadCaseIndex maps eval ids to sorted cases', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-index-'));
  const casesPath = join(tmp, 'cases.json');
  try {
    await writeFile(casesPath, JSON.stringify({
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'CASE-A',
          feature_id: 'A',
          feature_family: 'docs',
          knowledge_pack_key: 'docs',
          primary_phase: 'docs',
          kind: 'phase_contract',
          evidence_mode: 'blind_pre_defect',
          blocking: false,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'a',
        },
      ],
    }, null, 2), 'utf8');
    const caseIndex = await loadCaseIndex(casesPath);
    assert.equal(caseIndex.get(1).case_id, 'CASE-A');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
