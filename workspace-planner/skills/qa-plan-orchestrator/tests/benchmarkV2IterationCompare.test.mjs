import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import { publishIterationComparison } from '../benchmarks/qa-plan-v2/scripts/lib/publishIterationComparison.mjs';
import { runIterationCompare } from '../benchmarks/qa-plan-v2/scripts/run_iteration_compare.mjs';

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

test('publishIterationComparison writes benchmark.json and scorecard.json aligned to qa-plan-v2', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-iteration-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(skillRoot, 'knowledge-packs', 'report-editor'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'developer_smoke_test_\ntavily-search\nconfluence\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'SDK/API visible outcomes\nrequired capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\nCross-Section Interaction Audit\npause-mode prompts\nprompt editor open\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\nRelease Recommendation\nsave dialog completeness and interactivity\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6 quality\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\ndeveloper_smoke_test_\n', 'utf8');
    await writeFile(join(skillRoot, 'knowledge-packs', 'report-editor', 'pack.json'), JSON.stringify({
      version: '2026-03-21',
      required_capabilities: ['template-based creation'],
      analog_gates: [{ behavior: 'save dialog completeness and interactivity' }],
      sdk_visible_contracts: [],
      interaction_pairs: [],
    }, null, 2), 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 2,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: true,
        require_no_holdout_regression: true,
      },
    });
    await writeJson(join(benchmarkRoot, 'cases.json'), {
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'P0-IDEMPOTENCY-001',
          feature_id: 'BCIN-976',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'phase0',
          kind: 'phase_contract',
          evidence_mode: 'blind_pre_defect',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'REPORT_STATE and resume semantics remain stable',
        },
        {
          case_id: 'P5B-ANALOG-GATE-001',
          feature_id: 'BCIN-7289',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'phase5b',
          kind: 'checkpoint_enforcement',
          evidence_mode: 'retrospective_replay',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'historical analogs become required-before-ship gates',
        },
        {
          case_id: 'HOLDOUT-REGRESSION-001',
          feature_id: 'BCIN-6709',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'holdout',
          kind: 'holdout_regression',
          evidence_mode: 'holdout_regression',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'holdout remains stable',
        },
      ],
    });
    await writeJson(join(benchmarkRoot, 'history.json'), {
      benchmark_version: 'qa-plan-v2',
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          role: 'champion_seed',
          skill_snapshot: 'iteration-0/champion_snapshot',
          is_current_champion: true,
        },
      ],
    });

    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4a-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4b-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5a.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5b.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase6.md'), '', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib', 'finalPlanSummary.mjs'), '', 'utf8');

    const result = await publishIterationComparison({
      benchmarkRoot,
      skillRoot,
      iteration: 1,
    });

    const benchmark = JSON.parse(await readFile(result.benchmarkJsonPath, 'utf8'));
    const scorecard = JSON.parse(await readFile(result.scorecardPath, 'utf8'));
    assert.equal(benchmark.metadata.comparison_mode, 'synthetic_structural_compare');
    assert.ok(Array.isArray(benchmark.runs));
    assert.equal(scorecard.scoring_fidelity, 'synthetic');
    assert.equal(scorecard.decision.result, 'blocked_synthetic');
    assert.equal(scorecard.primary_configuration, 'new_skill');
    assert.equal(scorecard.reference_configuration, 'old_skill');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('publishIterationComparison excludes replay cases without defect analysis and blocks synthetic promotion', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-synthetic-filter-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'developer_smoke_test_\nREADME.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'SDK/API visible outcomes\nrequired capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\nCross-Section Interaction Audit\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\nRelease Recommendation\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6 quality\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\n', 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 1,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: true,
        require_no_holdout_regression: true,
      },
    });
    await writeJson(join(benchmarkRoot, 'cases.json'), {
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'BLIND-1',
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
          case_id: 'REPLAY-1',
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
        {
          case_id: 'HOLDOUT-1',
          feature_id: 'BCIN-3',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'holdout',
          kind: 'holdout_regression',
          evidence_mode: 'holdout_regression',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'holdout check',
        },
      ],
    });
    await writeJson(join(benchmarkRoot, 'history.json'), {
      benchmark_version: 'qa-plan-v2',
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          role: 'champion_seed',
          skill_snapshot: 'iteration-0/champion_snapshot',
          is_current_champion: true,
        },
      ],
    });

    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4a-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4b-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5a.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5b.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase6.md'), '', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib', 'finalPlanSummary.mjs'), '', 'utf8');

    const result = await publishIterationComparison({
      benchmarkRoot,
      skillRoot,
      iteration: 1,
    });

    const benchmark = JSON.parse(await readFile(result.benchmarkJsonPath, 'utf8'));
    const scorecard = JSON.parse(await readFile(result.scorecardPath, 'utf8'));
    const context = JSON.parse(await readFile(join(result.iterationDir, 'benchmark_context.json'), 'utf8'));

    assert.deepEqual(context.active_evidence_modes, ['blind_pre_defect', 'holdout_regression']);
    assert.equal(context.replay_enabled_by_operator, false);
    assert.equal(context.replay_source_identifier, null);
    assert.equal(benchmark.runs.length, 4);
    assert.equal(scorecard.scoring_fidelity, 'synthetic');
    assert.equal(scorecard.decision.result, 'blocked_synthetic');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('publishIterationComparison includes replay cases when defect analysis is explicitly enabled', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-synthetic-replay-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'developer_smoke_test_\nREADME.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'SDK/API visible outcomes\nrequired capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\nCross-Section Interaction Audit\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\nRelease Recommendation\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6 quality\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\n', 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 1,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: true,
        require_no_holdout_regression: true,
      },
    });
    await writeJson(join(benchmarkRoot, 'cases.json'), {
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'BLIND-1',
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
          case_id: 'REPLAY-1',
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
    });
    await writeJson(join(benchmarkRoot, 'history.json'), {
      benchmark_version: 'qa-plan-v2',
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          role: 'champion_seed',
          skill_snapshot: 'iteration-0/champion_snapshot',
          is_current_champion: true,
        },
      ],
    });

    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4a-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4b-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5a.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5b.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase6.md'), '', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib', 'finalPlanSummary.mjs'), '', 'utf8');

    const result = await publishIterationComparison({
      benchmarkRoot,
      skillRoot,
      iteration: 1,
      defectAnalysisRunKey: 'BCIN-7289',
    });

    const benchmark = JSON.parse(await readFile(result.benchmarkJsonPath, 'utf8'));
    const context = JSON.parse(await readFile(join(result.iterationDir, 'benchmark_context.json'), 'utf8'));

    assert.deepEqual(context.active_evidence_modes, ['blind_pre_defect', 'retrospective_replay']);
    assert.equal(context.replay_enabled_by_operator, true);
    assert.equal(context.replay_source_identifier, 'BCIN-7289');
    assert.equal(benchmark.runs.some((run) => run.eval_id === 2), true);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('publishIterationComparison honors explicit evidence mode filters even when replay is available', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-synthetic-profile-filter-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'developer_smoke_test_\nREADME.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'SDK/API visible outcomes\nrequired capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\nCross-Section Interaction Audit\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\nRelease Recommendation\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6 quality\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\n', 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 1,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: true,
        require_no_holdout_regression: true,
      },
    });
    await writeJson(join(benchmarkRoot, 'cases.json'), {
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'BLIND-1',
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
          case_id: 'REPLAY-1',
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
        {
          case_id: 'HOLDOUT-1',
          feature_id: 'BCIN-3',
          feature_family: 'report-editor',
          knowledge_pack_key: 'report-editor',
          primary_phase: 'holdout',
          kind: 'holdout_regression',
          evidence_mode: 'holdout_regression',
          blocking: true,
          fixture_refs: [],
          benchmark_profile: 'global-cross-feature-v1',
          focus: 'holdout check',
        },
      ],
    });
    await writeJson(join(benchmarkRoot, 'history.json'), {
      benchmark_version: 'qa-plan-v2',
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          role: 'champion_seed',
          skill_snapshot: 'iteration-0/champion_snapshot',
          is_current_champion: true,
        },
      ],
    });

    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4a-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4b-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5a.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5b.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase6.md'), '', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib', 'finalPlanSummary.mjs'), '', 'utf8');

    const result = await publishIterationComparison({
      benchmarkRoot,
      skillRoot,
      iteration: 1,
      defectAnalysisRunKey: 'BCIN-7289',
      enabledEvidenceModes: ['blind_pre_defect'],
      targetFeatureFamily: 'report-editor',
    });

    const benchmark = JSON.parse(await readFile(result.benchmarkJsonPath, 'utf8'));
    const scorecard = JSON.parse(await readFile(result.scorecardPath, 'utf8'));
    const context = JSON.parse(await readFile(join(result.iterationDir, 'benchmark_context.json'), 'utf8'));

    assert.deepEqual(context.active_evidence_modes, ['blind_pre_defect']);
    assert.equal(context.replay_enabled_by_operator, false);
    assert.equal(context.replay_source_identifier, null);
    assert.equal(context.target_feature_family, 'report-editor');
    assert.equal(benchmark.metadata.target_feature_family, 'report-editor');
    assert.equal(benchmark.runs.every((run) => run.eval_id === 1), true);
    assert.equal(scorecard.acceptance_checks.policy.require_non_decreasing_replay_score, false);
    assert.equal(scorecard.acceptance_checks.policy.require_no_holdout_regression, false);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('runIterationCompare rejects missing grading files for executed benchmark mode', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-executed-missing-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'phase4a\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'phase4b\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'phase5a\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), 'phase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\n', 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 1,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: true,
        require_no_holdout_regression: true,
      },
    });
    await writeJson(join(benchmarkRoot, 'cases.json'), {
      benchmark_version: 'qa-plan-v2',
      cases: [
        {
          case_id: 'BLIND-1',
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
      ],
    });
    await writeJson(join(benchmarkRoot, 'history.json'), {
      benchmark_version: 'qa-plan-v2',
      current_champion_iteration: 0,
      iterations: [
        {
          iteration: 0,
          role: 'champion_seed',
          skill_snapshot: 'iteration-0/champion_snapshot',
          is_current_champion: true,
        },
      ],
    });

    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'reference.md'), 'REPORT_STATE\n', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4a-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4b-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5a.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5b.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase6.md'), '', 'utf8');
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib'), { recursive: true });
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib', 'finalPlanSummary.mjs'), '', 'utf8');

    await assert.rejects(
      () => runIterationCompare({
        benchmarkRoot,
        skillRoot,
        iteration: 1,
      }),
      /grading\.json/,
    );
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});
