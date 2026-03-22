# QA Plan v2 Benchmark Integration Remediation Plan

## Overview

This plan closes the gap between:

1. the benchmark contract documented for `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2`
2. the current `qa-plan-evolution` implementation used to evolve `qa-plan-orchestrator`

Today, the shared evolution skill does publish iteration artifacts into `qa-plan-v2`, but it does not execute the benchmark in the same way the benchmark docs describe. Instead, it performs synthetic snapshot scoring from skill text and rubric files.

That is good enough for a lightweight structural comparator, but it is not good enough if `qa-plan-v2` is supposed to be the real acceptance gate for challenger promotion.

This plan makes the implementation consistent with the benchmark contract.

## Current State

### What already works

1. `qa-plan-v2` exists as the canonical benchmark root.
2. `iteration-0` baseline preparation works.
3. the shared evolution skill writes iteration outputs into the canonical benchmark tree.
4. Phase 6 updates `qa-plan-v2/history.json` when an accepted challenger is finalized.

### What is currently wrong

1. Phase 4 uses `publishIterationComparison.mjs`, which fabricates `grading.json`, `timing.json`, and `outputs/result.md` from snapshot text instead of executing benchmark runs.
2. replay cases are always included during qa-plan iteration scoring, even though the shared skill contract says replay evidence should be opt-in via `defect_analysis_run_key`.
3. `benchmark:v2:batch` is wired correctly in `package.json` and `run_batch.mjs` already exists, but the script cannot run until `iteration-0/spawn_manifest.json` is populated by a baseline prepare step. Correcting the baseline surface (FD-5) unblocks it — no new script is required.
4. `scoreBenchmarkV2.buildScorecard` treats a `null` mean as non-regression (`true`) instead of absent evidence. This means an unexecuted benchmark silently passes every acceptance gate.
5. checked-in baseline artifacts are stale for this machine and still contain machine-specific absolute paths.
6. the baseline has not been executed yet in this workspace, so `iteration-0` is still only a prepared surface.

## Goal

Make `qa-plan-v2` a real benchmark input to `qa-plan-evolution`, not just a frozen case catalog plus scorecard math.

The target behavior is:

1. baseline execution uses the prepared benchmark run directories and real per-run artifacts
2. iteration scoring is based on executed or explicitly materialized benchmark runs
3. replay cases participate only when the operator enables replay evidence
4. docs, scripts, and artifact paths agree

## Functional Design 1

### Goal

Validate the existing batch workflow end-to-end once the baseline surface is populated.

> **Note:** `run_batch.mjs` and `lib/batchRunnerV2.mjs` already exist and are fully implemented with all six batch definitions. The batch workflow was blocked only because `iteration-0/spawn_manifest.json` did not exist, not because the script was missing. FD-5 is the prerequisite that unblocks this design.

### Required Change

**Files to change:**

1. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/README.md`
2. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_EXECUTION_BATCHES.md`

**No new scripts to create.** `run_batch.mjs` exists. Do not create a duplicate.

**Expected content changes:**

1. benchmark docs
   - document that `benchmark:v2:batch` requires a completed `benchmark:v2:prepare` run before it can be called
   - document whether batches are only for baseline or also for iteration comparisons
   - remove any language that implies the script is missing

**Validation expectations (run after FD-5 is completed):**

1. `npm run benchmark:v2:batch -- --batch 1` succeeds.
2. the generated batch manifest lists only the runs belonging to the selected batch.
3. the generated checklist paths match the current workspace root, not a stale machine path.

## Functional Design 2

### Goal

Separate baseline execution from iteration comparison and make both explicit.

### Filter Ownership Decision

The evidence-mode filter for replay opt-in **lives in `publishIterationComparison.mjs`** (or its replacement `run_iteration_compare.mjs` from FD-4). `scoreBenchmarkV2` remains a pure aggregation layer and must not filter — it consumes only the runs that were written by the comparison entry point. This ownership rule applies equally to FD-3.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/runTargetValidation.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/publishIterationComparison.mjs`
3. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/score_iteration.mjs`
4. `.agents/skills/qa-plan-evolution/SKILL.md`
5. `.agents/skills/qa-plan-evolution/reference.md`

**Expected content changes:**

1. baseline remains a separate operator workflow
   - prepare
   - execute runs
   - aggregate
2. iteration comparison must declare one of two modes:
   - `synthetic_structural_compare`
   - `executed_benchmark_compare`
3. the default promotion path for qa-plan should use `executed_benchmark_compare` once the benchmark runner exists
4. if synthetic mode remains available, it must be documented as a fallback and must not be presented as equivalent to real benchmark execution
5. synthetic scorecards must carry `scoring_fidelity: "synthetic"` in the scorecard JSON and the `decision.result` field must be set to `"blocked_synthetic"` instead of `"accept"` — promotion is not permitted when `scoring_fidelity` is `"synthetic"`

**Validation expectations:**

1. the evolution skill can state which comparison mode produced the iteration scorecard.
2. a scorecard generated from synthetic mode has `scoring_fidelity: "synthetic"` and `decision.result: "blocked_synthetic"` — it cannot trigger promotion.
3. a scorecard generated from executed mode has `scoring_fidelity: "executed"` and is backed by real run artifacts.

## Functional Design 3

### Goal

Honor evidence-mode gating and replay opt-in rules.

### Filter Ownership (see FD-2)

The filter is owned by the comparison entry point (`publishIterationComparison.mjs` or `run_iteration_compare.mjs`). `scoreBenchmarkV2` must not be modified to add case filtering — it aggregates whatever runs it is given.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/runTargetValidation.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/publishIterationComparison.mjs`
4. `.agents/skills/qa-plan-evolution/SKILL.md`
5. `.agents/skills/qa-plan-evolution/reference.md`

**Expected content changes:**

1. default qa-plan iteration scoring includes:
   - `blind_pre_defect`
   - `holdout_regression`
2. `retrospective_replay` cases are skipped during run materialization (not written to `eval-N/*/run-M/`) unless `defect_analysis_run_key` is explicitly provided to the comparison entry point
3. benchmark iteration context records:
   - active evidence modes (e.g. `["blind_pre_defect", "holdout_regression"]`)
   - replay source identifier (or `null` if replay was not activated)
   - `replay_enabled_by_operator: true/false`

**Validation expectations:**

1. qa-plan evolution without `defect_analysis_run_key` excludes replay cases from iteration comparison; `benchmark_context.json` shows `replay_enabled_by_operator: false`.
2. qa-plan evolution with `defect_analysis_run_key` includes replay cases and records the key in `benchmark_context.json`.
3. no hidden replay activation occurs.

## Functional Design 4

### Goal

Replace synthetic case grading with real per-run grading for benchmark-backed promotion, and fix the null-safety bug in the acceptance gate.

### Operator Precondition

`run_iteration_compare.mjs` grades what is already in the eval-run directories. The operator must ensure that real agent runs have written `outputs/`, `grading.json`, and `timing.json` into each `eval-N/{new_skill,old_skill}/run-M/` directory before calling the compare script. The script must reject (not silently pass) if required grading files are absent.

### Required Change

**Files to change:**

1. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/publishIterationComparison.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/runTargetValidation.mjs`
3. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/scoreBenchmarkV2.mjs`

**Files to create:**

1. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/run_iteration_compare.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/gradingHarness.mjs`

**Expected content changes:**

1. `run_iteration_compare.mjs`
   - materialize `iteration-<n>/new_skill/old_skill` run surfaces
   - execute benchmark runs or invoke the configured grading harness
   - persist `outputs/`, `grading.json`, and `timing.json`
   - throw a hard error if a required grading file is missing and the caller did not opt into synthetic mode
2. `publishIterationComparison.mjs`
   - stop fabricating grading from snapshot text
   - become either:
     - a wrapper around the real iteration runner, or
     - a clearly synthetic fallback utility (sets `scoring_fidelity: "synthetic"` and blocks promotion per FD-2)
3. `scoreBenchmarkV2.mjs`
   - **P0 null-safety fix:** a `null` mean score must be treated as absent evidence and must cause the acceptance gate to **fail**, not silently pass. Replace the `null => true` fallback with `null => false` (or throw, depending on policy). Update the acceptance policy object to expose `null_score_policy: "reject"` so it is auditable.
   - keep acceptance logic separate from execution
   - consume real `benchmark.json` assembled from actual runs

**Validation expectations:**

1. `iteration-<n>/benchmark.json` is assembled from real per-run grading files.
2. deleting a run's `grading.json` prevents scorecard generation — the script exits non-zero.
3. acceptance decisions can be traced back to run directories.
4. a scorecard produced when both primary and reference have zero run data results in `decision.result: "reject"`, not `"accept"`.

## Functional Design 5

### Goal

Refresh and normalize baseline artifacts for the active workspace before execution.

### Required Change

**Files to change:**

1. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/run_baseline.mjs`
2. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/benchmarkV2.mjs`
3. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md`

**Expected content changes:**

1. baseline preparation should always regenerate machine-local paths
2. generated checklist artifacts should not be committed if they are machine-specific, or they should use repo-relative paths
3. operator docs must distinguish:
   - prepared baseline
   - partially executed baseline
   - aggregated baseline

**Validation expectations:**

1. after `npm run benchmark:v2:prepare`, all generated paths resolve under the current workspace.
2. no machine-specific absolute path remains in newly generated baseline artifacts.

## Functional Design 6

### Goal

Align docs with the real implementation level.

### Required Change

**Files to change:**

1. `.agents/skills/qa-plan-evolution/README.md`
2. `.agents/skills/qa-plan-evolution/SKILL.md`
3. `.agents/skills/qa-plan-evolution/reference.md`
4. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/README.md`
5. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_EXECUTION_BATCHES.md`
6. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md`

**Expected content changes:**

1. clearly state whether the current qa-plan iteration path is synthetic or benchmark-executed
2. document the replay opt-in rule in one place and make all other docs match it
3. document baseline status requirements before using the benchmark as a promotion gate
4. `QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md`: remove any absolute paths; update any text that implies `benchmark:v2:batch` is blocked or the script is missing; align operator steps with the actual prepare → batch → execute → aggregate workflow

**Validation expectations:**

1. no doc claims `run_batch.mjs` is missing or that the script must be created
2. no doc implies replay is always active if the contract says it is opt-in
3. no doc claims synthetic scoring is equivalent to executed benchmark scoring
4. `QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md` contains no machine-specific absolute paths

## Tests

Stub tests only. No implementation in this plan section.

### Shared evolution skill

1. `test_phase4_qa_plan_without_defect_analysis_excludes_replay_cases()`
2. `test_phase4_qa_plan_with_defect_analysis_includes_replay_cases()`
3. `test_phase4_qa_plan_structural_compare_is_marked_synthetic()` — assert `scoring_fidelity === "synthetic"` and `decision.result === "blocked_synthetic"`
4. `test_phase4_qa_plan_synthetic_scorecard_is_blocked_from_promotion()` — assert that Phase 6 promotion gate refuses a scorecard with `scoring_fidelity: "synthetic"`
5. `test_phase6_finalization_updates_history_after_executed_benchmark_acceptance()`

### Qa-plan benchmark

1. `test_run_batch_materializes_batch_manifest_for_batch_1()` — requires `iteration-0/spawn_manifest.json` to be present (FD-5 prerequisite)
2. `test_run_batch_rejects_unknown_batch_number()`
3. `test_iteration_compare_requires_real_grading_files_before_scorecard()` — deleting `grading.json` for one run must cause script to exit non-zero
4. `test_baseline_prepare_rewrites_paths_for_current_workspace()`
5. `test_scorecard_rejects_when_run_data_missing_instead_of_silently_passing()` — a scorecard with `null` mean scores on both sides must produce `decision.result: "reject"`, not `"accept"`

## Documentation Changes

### Shared evolution skill

1. add this plan as the benchmark-integration remediation source of truth
2. update related docs index in the shared skill README

### Qa-plan benchmark

1. document the difference between baseline execution and iteration comparison
2. document synthetic mode only if it remains as an explicit non-gating fallback

## Implementation Checklist

1. ~~Restore `benchmark:v2:batch` by adding the missing script~~ — `run_batch.mjs` already exists; do not create a duplicate. Unblock the script by completing item 2 first, then run the FD-1 validation tests.
2. Regenerate local `iteration-0` artifacts so paths match the current workspace (FD-5 prerequisite for FD-1 and FD-3).
3. Resolve filter ownership at the comparison entry point (`publishIterationComparison.mjs` owns the replay opt-in filter — not `scoreBenchmarkV2`).
4. Fix the P0 null-safety bug in `scoreBenchmarkV2.buildScorecard` — `null` means absent evidence and must fail the gate, not pass it.
5. Add `scoring_fidelity` field and `blocked_synthetic` promotion guard to synthetic scorecards.
6. Split synthetic comparison from real benchmark comparison in the qa-plan iteration path.
7. Promote executed comparison to the default challenger acceptance path.
8. Update docs so operators know whether they are running a real benchmark or a structural proxy; include `QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md` in the doc update scope.

## Operator Guidance Right Now

After the implemented benchmark integration work:

1. it is acceptable to run `npm run benchmark:v2:prepare` to refresh the local baseline surface
2. it is acceptable to execute baseline runs manually from `iteration-0/spawn_manifest.json`
3. executed comparison through `run_iteration_compare.mjs` is the promotion-eligible path
4. synthetic comparison remains fallback-only and must stay blocked from promotion
5. the remaining cleanup is documentation alignment and removal of stale absolute-path artifacts

## References

1. `.agents/skills/qa-plan-evolution/SKILL.md`
2. `.agents/skills/qa-plan-evolution/reference.md`
3. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_SPEC.md`
4. `workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_BENCHMARK_EXECUTION_BATCHES.md`
5. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/benchmark_manifest.json`
6. `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/cases.json`
