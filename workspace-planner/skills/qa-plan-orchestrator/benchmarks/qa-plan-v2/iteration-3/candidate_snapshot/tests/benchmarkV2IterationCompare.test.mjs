import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
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

test('runIterationCompare does not reuse stale grading artifacts when no grading harness is provided', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-stale-executed-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');
  const staleRunDir = join(benchmarkRoot, 'iteration-1', 'eval-1', 'new_skill', 'run-1');
  const fakeExecutor = join(tmp, 'fake-executor-no-grading.mjs');
  const fakeGrader = join(tmp, 'fake-grader-noop.mjs');
  const oldExecutor = process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
  const oldGrader = process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;

  try {
    await writeFile(fakeExecutor, `#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const request = JSON.parse(await readFile(process.argv[process.argv.indexOf('--request') + 1], 'utf8'));
await mkdir(request.run.output_dir, { recursive: true });
await writeFile(join(request.run.output_dir, 'result.md'), '# result\\n', 'utf8');
await writeFile(request.run.metrics_path, JSON.stringify({ total_tokens: 3 }, null, 2), 'utf8');
`, 'utf8');
    await writeFile(fakeGrader, `#!/usr/bin/env node\nprocess.exit(0);\n`, 'utf8');
    process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = fakeExecutor;
    process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = fakeGrader;

    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'required capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\n', 'utf8');
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

    await mkdir(join(staleRunDir, 'outputs'), { recursive: true });
    await writeJson(join(staleRunDir, 'grading.json'), {
      summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
      expectations: [],
      execution_metrics: { total_tool_calls: 0, errors_encountered: 0 },
      user_notes_summary: { needs_review: [] },
      timing: { total_duration_seconds: 1 },
    });
    await writeJson(join(staleRunDir, 'timing.json'), {
      total_duration_seconds: 1,
      total_tokens: 0,
    });

    await assert.rejects(
      () => runIterationCompare({
        benchmarkRoot,
        skillRoot,
        iteration: 1,
      }),
      /grading\.json/,
    );
    assert.equal(existsSync(join(staleRunDir, 'grading.json')), false);
    assert.equal(existsSync(join(staleRunDir, 'timing.json')), true);
  } finally {
    if (oldExecutor === undefined) delete process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = oldExecutor;
    if (oldGrader === undefined) delete process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = oldGrader;
    await rm(tmp, { recursive: true, force: true });
  }
});

test('runIterationCompare invokes the default request-driven harness when executor and grader scripts are configured', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-default-harness-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');
  const fakeExecutor = join(tmp, 'fake-executor.mjs');
  const fakeGrader = join(tmp, 'fake-grader.mjs');
  const oldExecutor = process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
  const oldGrader = process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;

  try {
    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot'), { recursive: true });

    await writeFile(fakeExecutor, `#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const request = JSON.parse(await readFile(process.argv[process.argv.indexOf('--request') + 1], 'utf8'));
await mkdir(request.run.output_dir, { recursive: true });
await writeFile(join(request.run.output_dir, 'result.md'), '# result\\n', 'utf8');
await writeFile(join(request.run.output_dir, 'execution_notes.md'), request.run.configuration_dir + '\\n', 'utf8');
await writeFile(request.run.metrics_path, JSON.stringify({ total_tokens: 11 }, null, 2), 'utf8');
`, 'utf8');
    await writeFile(fakeGrader, `#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
const request = JSON.parse(await readFile(process.argv[process.argv.indexOf('--request') + 1], 'utf8'));
const passRate = request.run.configuration_dir === 'new_skill' ? 1 : 0.5;
await writeFile(request.run.grading_path, JSON.stringify({
  expectations: [{ text: 'blind', passed: passRate === 1, evidence: 'fake' }],
  summary: { passed: passRate === 1 ? 1 : 0, failed: passRate === 1 ? 0 : 1, total: 1, pass_rate: passRate },
  execution_metrics: { total_tool_calls: 0, errors_encountered: passRate === 1 ? 0 : 1 },
  user_notes_summary: { needs_review: [] }
}, null, 2), 'utf8');
`, 'utf8');

    process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = fakeExecutor;
    process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = fakeGrader;

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'README.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'required capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6 quality\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\n', 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 1,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: false,
        require_no_holdout_regression: false,
        require_non_target_family_non_regression: false,
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

    const result = await runIterationCompare({
      benchmarkRoot,
      skillRoot,
      iteration: 1,
    });

    const scorecard = JSON.parse(await readFile(result.scorecardPath, 'utf8'));
    const timing = JSON.parse(await readFile(join(benchmarkRoot, 'iteration-1', 'eval-1', 'new_skill', 'run-1', 'timing.json'), 'utf8'));
    const transcript = await readFile(join(benchmarkRoot, 'iteration-1', 'eval-1', 'new_skill', 'run-1', 'execution_transcript.log'), 'utf8');
    assert.equal(scorecard.scoring_fidelity, 'executed');
    assert.equal(scorecard.decision.result, 'accept');
    assert.equal(timing.total_tokens, 11);
    assert.match(transcript, /EXECUTOR/);
    assert.match(transcript, /GRADER/);
  } finally {
    if (oldExecutor === undefined) delete process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = oldExecutor;
    if (oldGrader === undefined) delete process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = oldGrader;
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
  const fakeExecutor = join(tmp, 'fake-executor-missing-grading.mjs');
  const fakeGrader = join(tmp, 'fake-grader-missing-grading.mjs');
  const oldExecutor = process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
  const oldGrader = process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;

  try {
    await writeFile(fakeExecutor, `#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const request = JSON.parse(await readFile(process.argv[process.argv.indexOf('--request') + 1], 'utf8'));
await mkdir(request.run.output_dir, { recursive: true });
await writeFile(join(request.run.output_dir, 'result.md'), '# result\\n', 'utf8');
await writeFile(request.run.metrics_path, JSON.stringify({ total_tokens: 5 }, null, 2), 'utf8');
`, 'utf8');
    await writeFile(fakeGrader, `#!/usr/bin/env node\nprocess.exit(0);\n`, 'utf8');
    process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = fakeExecutor;
    process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = fakeGrader;

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
    if (oldExecutor === undefined) delete process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = oldExecutor;
    if (oldGrader === undefined) delete process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = oldGrader;
    await rm(tmp, { recursive: true, force: true });
  }
});

test('runIterationCompare fails fast when the primary harness fails', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'benchmark-v2-fail-fast-'));
  const skillRoot = join(tmp, 'workspace-planner', 'skills', 'qa-plan-orchestrator');
  const benchmarkRoot = join(skillRoot, 'benchmarks', 'qa-plan-v2');
  const failExecutor = join(tmp, 'fail-executor.mjs');
  const oldExecutor = process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
  const oldGrader = process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;

  try {
    await writeFile(failExecutor, `#!/usr/bin/env node\nprocess.exit(1);\n`, 'utf8');
    process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = failExecutor;
    delete process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;

    await mkdir(join(skillRoot, 'evals'), { recursive: true });
    await mkdir(join(skillRoot, 'references'), { recursive: true });
    await mkdir(join(skillRoot, 'scripts', 'lib'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references'), { recursive: true });
    await mkdir(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib'), { recursive: true });

    await writeFile(join(skillRoot, 'SKILL.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'reference.md'), 'REPORT_STATE\nphase0\nphase5a\nphase5b\n', 'utf8');
    await writeFile(join(skillRoot, 'README.md'), 'developer_smoke_test_\nREADME.md\nreference.md\n', 'utf8');
    await writeFile(join(skillRoot, 'evals', 'evals.json'), '{"eval_groups":[]}', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4a-contract.md'), 'required capability\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'phase4b-contract.md'), 'top-layer\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5a.md'), 'Coverage Preservation Audit\nCross-Section Interaction Audit\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase5b.md'), '[ANALOG-GATE]\n', 'utf8');
    await writeFile(join(skillRoot, 'references', 'review-rubric-phase6.md'), 'phase6 quality\n', 'utf8');
    await writeFile(join(skillRoot, 'scripts', 'lib', 'finalPlanSummary.mjs'), 'Final Plan Summary\n', 'utf8');

    await writeJson(join(benchmarkRoot, 'benchmark_manifest.json'), {
      benchmark_version: 'qa-plan-v2',
      runs_per_configuration: 1,
      acceptance_policy: {
        require_blocking_cases_pass: true,
        require_non_decreasing_blind_score: true,
        require_non_decreasing_replay_score: false,
        require_no_holdout_regression: false,
        require_non_target_family_non_regression: false,
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
          focus: 'REPORT_STATE and phase0 remain documented',
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

    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'SKILL.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'reference.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'README.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4a-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'phase4b-contract.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5a.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase5b.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'references', 'review-rubric-phase6.md'), '', 'utf8');
    await writeFile(join(benchmarkRoot, 'iteration-0', 'champion_snapshot', 'scripts', 'lib', 'finalPlanSummary.mjs'), '', 'utf8');

    await assert.rejects(
      () => runIterationCompare({
        benchmarkRoot,
        skillRoot,
        iteration: 1,
      }),
      /executor script exited with code 1/i,
    );
    assert.equal(existsSync(join(benchmarkRoot, 'iteration-1', 'eval-1', 'new_skill', 'run-1', 'grading.json')), false);
  } finally {
    if (oldExecutor === undefined) delete process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_EXECUTOR_SCRIPT = oldExecutor;
    if (oldGrader === undefined) delete process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT;
    else process.env.QA_PLAN_BENCHMARK_GRADER_SCRIPT = oldGrader;
    await rm(tmp, { recursive: true, force: true });
  }
});
