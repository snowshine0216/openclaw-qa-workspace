# QA Plan Orchestrator Benchmark Spec

> **Spec ID:** `qa-plan-orchestrator-benchmark-spec-2026-03-21`
> **Date:** 2026-03-21
> **Status:** Draft
> **Scope:** `workspace-planner/skills/qa-plan-orchestrator`

---

## Overview

This spec defines the canonical benchmark layout, metadata, and scoring schema for `qa-plan-orchestrator`.

It is designed to solve three problems:

1. Build a frozen baseline before any skill evolution work starts.
2. Compare `champion_skill` vs `candidate_skill` across iterations without benchmark drift.
3. Compare different models on the same frozen benchmark without confusing model change with skill change.

The spec is intentionally compatible with the existing `skill-creator` aggregation and viewer tooling:

- `evals/run_evals.mjs`
- `evals/post_run.sh`
- `~/.agents/skills/skill-creator/scripts/aggregate_benchmark.py`
- `~/.agents/skills/skill-creator/eval-viewer/generate_review.py`

## Non-Negotiable Rules

1. Freeze the benchmark manifest before iteration work starts.
2. Do not change benchmark prompts, fixtures, grading rubric, or weights within a live benchmark version.
3. Change only one axis at a time when measuring improvement:
   - skill version, or
   - model, or
   - knowledge-pack version
4. Do not accept a candidate if any blocking gate regresses, even if the aggregate score rises.
5. Use pairwise comparisons only. Every benchmark run must have one primary contender and one reference contender.

## Canonical Root Layout

```text
workspace-planner/skills/qa-plan-orchestrator/
  benchmarks/
    qa-plan-v1/
      benchmark_manifest.json
      fixtures_manifest.json
      grading_rubric.md
      scoreboard.json
      history.json
      notes.md
      iteration-0/
        benchmark_context.json
        champion_snapshot/
        eval-1/
          eval_metadata.json
          with_skill/
            run-1/
              eval_metadata.json
              comparison_metadata.json
              outputs/
              grading.json
              timing.json
            run-2/
            run-3/
          without_skill/
            run-1/
            run-2/
            run-3/
        eval-2/
        benchmark.json
        benchmark.md
      iteration-1/
        benchmark_context.json
        candidate_snapshot/
        eval-1/
          eval_metadata.json
          new_skill/
            run-1/
              eval_metadata.json
              comparison_metadata.json
              outputs/
              grading.json
              timing.json
            run-2/
            run-3/
          old_skill/
            run-1/
            run-2/
            run-3/
        eval-2/
        benchmark.json
        benchmark.md
        scorecard.json
      iteration-2/
      model-compare/
        model-bcmp-2026-03-21-gpt54-vs-gpt53/
          benchmark_context.json
          eval-1/
            eval_metadata.json
            new_skill/
              run-1/
                comparison_metadata.json
            old_skill/
              run-1/
                comparison_metadata.json
          benchmark.json
          benchmark.md
          scorecard.json
```

## Comparison Modes

Use these modes and config directory names.

### 1. Baseline value proof

Purpose:

- show that the current skill is better than no skill

Config directory names:

- `with_skill`
- `without_skill`

Use only in `iteration-0`.

### 2. Iteration comparison

Purpose:

- compare `candidate_skill` against the currently accepted `champion_skill`

Config directory names:

- `new_skill`
- `old_skill`

Semantic meaning:

- `new_skill` = candidate under test
- `old_skill` = current champion

These names are preferred because the viewer already recognizes them as primary vs baseline.

### 3. Model comparison

Purpose:

- compare the same skill snapshot across two different models
- compare the same benchmark across two model+skill bundles when explicitly needed

Config directory names:

- `new_skill`
- `old_skill`

Semantic meaning is not inferred from the directory name. It must be declared in `comparison_metadata.json`.

This is intentional: it keeps compatibility with the current viewer while allowing the real distinction to live in metadata.

## Benchmark Versioning

Each benchmark campaign lives under:

```text
benchmarks/<benchmark-version>/
```

Example:

```text
benchmarks/qa-plan-v1/
```

`benchmark-version` must change only when one or more of these change:

1. eval prompt set
2. fixture set
3. grading rubric
4. scoring weights
5. benchmark inclusion rules

If you change any of the above, start a new benchmark version. Do not append to the old one.

## Files That Must Exist At Benchmark Root

### `benchmark_manifest.json`

Frozen contract for the benchmark campaign.

```json
{
  "benchmark_version": "qa-plan-v1",
  "skill_name": "qa-plan-orchestrator",
  "skill_path": "workspace-planner/skills/qa-plan-orchestrator",
  "frozen_at": "2026-03-21T00:00:00Z",
  "runs_per_configuration": 3,
  "comparison_modes": [
    "baseline_value",
    "iteration_compare",
    "model_compare"
  ],
  "eval_sets": {
    "core_regression": [1, 2, 3],
    "defect_replay": ["BCIN-7289-R1", "BCIN-7289-R2"],
    "holdout_regression": ["HOLDOUT-REPORT-1", "HOLDOUT-REPORT-2"]
  },
  "blocking_groups": [
    "smoke_checks",
    "contract_evals",
    "holdout_regression"
  ],
  "scored_groups": [
    "defect_recall_replay",
    "knowledge_pack_coverage",
    "self_test_actionability",
    "holdout_regression"
  ],
  "weights": {
    "defect_recall_replay": 0.45,
    "knowledge_pack_coverage": 0.2,
    "self_test_actionability": 0.15,
    "holdout_regression": 0.2
  },
  "acceptance_policy": {
    "require_blocking_pass": true,
    "require_no_regression": true,
    "require_non_decreasing_defect_recall": true,
    "minimum_mean_runs": 3
  }
}
```

### `fixtures_manifest.json`

Frozen list of fixtures and artifact sources used by this benchmark version.

```json
{
  "benchmark_version": "qa-plan-v1",
  "fixtures": [
    {
      "fixture_id": "BCIN-7289-defect-analysis",
      "path": "workspace-reporter/skills/defects-analysis/runs/BCIN-7289",
      "type": "defect_replay_source",
      "locked_at": "2026-03-21T00:00:00Z"
    },
    {
      "fixture_id": "report-editor-knowledge-pack-v1",
      "path": "workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor",
      "type": "knowledge_pack",
      "locked_at": "2026-03-21T00:00:00Z"
    }
  ]
}
```

### `grading_rubric.md`

Human-readable explanation of how graders judge:

1. whether a scenario would expose a known defect
2. whether a knowledge-pack item is mapped to a scenario or explicit exclusion
3. whether the developer smoke output is actionable
4. whether holdout regressions exist

### `history.json`

Tracks accepted and rejected iterations inside one benchmark version.

```json
{
  "benchmark_version": "qa-plan-v1",
  "started_at": "2026-03-21T00:00:00Z",
  "current_champion_iteration": 0,
  "iterations": [
    {
      "iteration": 0,
      "label": "baseline",
      "role": "champion_seed",
      "skill_snapshot": "benchmarks/qa-plan-v1/iteration-0/champion_snapshot",
      "grading_result": "baseline",
      "is_current_champion": true
    }
  ]
}
```

## What Goes Into `iteration-0`

`iteration-0` is the frozen baseline. It is not a candidate.

It must contain:

1. `champion_snapshot/`
   - copy of the exact current `qa-plan-orchestrator` skill tree before any evolution changes
2. `benchmark_context.json`
   - benchmark version, model, knowledge-pack version, eval IDs, fixture version
3. `eval-*` directories
   - each eval executed in `with_skill` and `without_skill`
4. `benchmark.json`
   - aggregate output from `aggregate_benchmark.py`
5. `benchmark.md`
   - human-readable summary

Purpose of `iteration-0`:

1. establish no-skill value baseline
2. establish champion reference score
3. freeze the starting point for all later comparisons

### `iteration-0/benchmark_context.json`

```json
{
  "benchmark_version": "qa-plan-v1",
  "iteration": 0,
  "comparison_mode": "baseline_value",
  "primary_configuration": "with_skill",
  "reference_configuration": "without_skill",
  "skill_snapshot_role": "champion_seed",
  "skill_snapshot_path": "benchmarks/qa-plan-v1/iteration-0/champion_snapshot",
  "knowledge_pack_version": "report-editor-2026-03-21",
  "executor_model": "gpt-5.4",
  "reasoning_effort": "high",
  "runs_per_configuration": 3
}
```

## What Goes Into `champion_skill`

`champion_skill` is the currently accepted best version within one benchmark version.

It is represented by:

1. a snapshot path
2. a scorecard
3. an entry in `history.json`

Do not infer champion state only from `benchmark.json`.

### Champion metadata contract

Store this in each run's `comparison_metadata.json` when the champion participates in a comparison:

```json
{
  "semantic_role": "champion_skill",
  "comparison_mode": "iteration_compare",
  "configuration_dir": "old_skill",
  "skill_name": "qa-plan-orchestrator",
  "skill_snapshot_path": "benchmarks/qa-plan-v1/iteration-0/champion_snapshot",
  "skill_snapshot_label": "champion-v0",
  "model_name": "gpt-5.4",
  "reasoning_effort": "high",
  "knowledge_pack_version": "report-editor-2026-03-21",
  "benchmark_version": "qa-plan-v1",
  "eval_id": 1,
  "run_number": 1
}
```

## What Goes Into `candidate_skill`

`candidate_skill` exists only for iterations `>= 1`.

Each iteration must contain:

1. `candidate_snapshot/`
   - the exact mutated skill snapshot under test
2. `benchmark_context.json`
3. `eval-*` directories
   - each eval executed in `new_skill` and `old_skill`
4. `benchmark.json`
5. `benchmark.md`
6. `scorecard.json`

### Candidate metadata contract

Store this in each run's `comparison_metadata.json`:

```json
{
  "semantic_role": "candidate_skill",
  "comparison_mode": "iteration_compare",
  "configuration_dir": "new_skill",
  "skill_name": "qa-plan-orchestrator",
  "skill_snapshot_path": "benchmarks/qa-plan-v1/iteration-1/candidate_snapshot",
  "skill_snapshot_label": "candidate-v1",
  "parent_champion_snapshot_path": "benchmarks/qa-plan-v1/iteration-0/champion_snapshot",
  "model_name": "gpt-5.4",
  "reasoning_effort": "high",
  "knowledge_pack_version": "report-editor-2026-03-21",
  "benchmark_version": "qa-plan-v1",
  "eval_id": 1,
  "run_number": 1
}
```

## Model Comparison Metadata

When comparing models, keep the skill snapshot fixed unless the experiment explicitly says otherwise.

### Required model metadata

Every run in a model comparison must include:

```json
{
  "semantic_role": "reference_contender",
  "comparison_mode": "model_compare",
  "configuration_dir": "old_skill",
  "skill_name": "qa-plan-orchestrator",
  "skill_snapshot_path": "benchmarks/qa-plan-v1/iteration-2/candidate_snapshot",
  "skill_snapshot_label": "candidate-v2",
  "model_name": "gpt-5.3-codex",
  "model_provider": "openai",
  "reasoning_effort": "high",
  "temperature": null,
  "top_p": null,
  "knowledge_pack_version": "report-editor-2026-03-21",
  "benchmark_version": "qa-plan-v1",
  "eval_id": 1,
  "run_number": 1,
  "comparison_group_id": "gpt54-vs-gpt53-on-candidate-v2"
}
```

For the primary contender:

```json
{
  "semantic_role": "primary_contender",
  "comparison_mode": "model_compare",
  "configuration_dir": "new_skill",
  "skill_name": "qa-plan-orchestrator",
  "skill_snapshot_path": "benchmarks/qa-plan-v1/iteration-2/candidate_snapshot",
  "skill_snapshot_label": "candidate-v2",
  "model_name": "gpt-5.4",
  "model_provider": "openai",
  "reasoning_effort": "high",
  "temperature": null,
  "top_p": null,
  "knowledge_pack_version": "report-editor-2026-03-21",
  "benchmark_version": "qa-plan-v1",
  "eval_id": 1,
  "run_number": 1,
  "comparison_group_id": "gpt54-vs-gpt53-on-candidate-v2"
}
```

### Model comparison rules

1. Keep skill snapshot fixed.
2. Keep benchmark version fixed.
3. Keep knowledge-pack version fixed.
4. Keep grader rubric fixed.
5. Use at least `3` runs per configuration.
6. Compare medians or means with variance, not a single run.

## Per-Eval Layout

Each eval directory must contain:

```text
eval-1/
  eval_metadata.json
  <configuration-dir>/
    run-1/
      eval_metadata.json
      comparison_metadata.json
      outputs/
      grading.json
      timing.json
```

### `eval_metadata.json`

This stays compatible with `skill-creator`:

```json
{
  "eval_id": 1,
  "eval_name": "defect-replay-template-save",
  "prompt": "Create a QA plan for BCIN-7289 and ensure template-based report creation and save risks are covered.",
  "assertions": [
    "Plan contains template-sourced new-report save scenario",
    "Plan distinguishes create-new-report from overwrite-template behavior"
  ],
  "eval_group": "defect_recall_replay",
  "severity_weight": 1.0
}
```

### `grading.json`

Use the existing `skill-creator` schema, but require these additions in `expectations[].text` tagging:

1. prefix each expectation with its eval group
2. include severity if it is a replay assertion

Example:

```json
{
  "expectations": [
    {
      "text": "[defect_recall_replay][high] Plan contains template-sourced new-report save scenario",
      "passed": true,
      "evidence": "Found in qa_plan_phase6_r1.md under Template Operations"
    }
  ],
  "summary": {
    "passed": 6,
    "failed": 1,
    "total": 7,
    "pass_rate": 0.8571
  },
  "timing": {
    "total_duration_seconds": 190.2
  }
}
```

## Scoring Schema

Use two decision layers:

1. blocking gates
2. weighted quality score

### 1. Blocking gates

A candidate automatically loses if any of these are false:

1. `smoke_checks_pass == true`
2. `contract_evals_pass == true`
3. `holdout_regression_pass == true`
4. `blocking_regression_count == 0`
5. `defect_recall_mean >= champion_defect_recall_mean`

### 2. Weighted quality score

Only compute this after blocking gates pass.

```text
quality_score =
  0.45 * defect_recall_replay_score +
  0.20 * knowledge_pack_coverage_score +
  0.15 * self_test_actionability_score +
  0.20 * holdout_regression_score
```

All component scores are normalized to `0.0 - 1.0`.

### Component definitions

#### `defect_recall_replay_score`

Definition:

- weighted pass rate over defect-replay evals

Formula:

```text
sum(passed_assertion_weight) / sum(all_assertion_weight)
```

Severity weights:

- `high`: `1.0`
- `medium`: `0.6`
- `low`: `0.3`

#### `knowledge_pack_coverage_score`

Definition:

- fraction of required knowledge-pack items that map to:
  - explicit scenario
  - explicit gate
  - explicit exclusion with rationale

Formula:

```text
mapped_items / required_items
```

#### `self_test_actionability_score`

Definition:

- fraction of required smoke-test rows generated with:
  - scenario name
  - trigger
  - acceptance signal
  - estimated time

Formula:

```text
valid_smoke_rows / required_smoke_rows
```

#### `holdout_regression_score`

Definition:

- weighted pass rate over holdout evals not used to design the mutation

Formula:

```text
sum(passed_holdout_weight) / sum(all_holdout_weight)
```

## Scorecard Schema

Each iteration `>= 1` must produce `scorecard.json`.

```json
{
  "benchmark_version": "qa-plan-v1",
  "iteration": 1,
  "comparison_mode": "iteration_compare",
  "primary_role": "candidate_skill",
  "reference_role": "champion_skill",
  "primary_configuration": "new_skill",
  "reference_configuration": "old_skill",
  "blocking_gates": {
    "smoke_checks_pass": true,
    "contract_evals_pass": true,
    "holdout_regression_pass": true,
    "blocking_regression_count": 0,
    "defect_recall_non_decreasing": true
  },
  "scores": {
    "candidate": {
      "defect_recall_replay_score": 0.88,
      "knowledge_pack_coverage_score": 0.92,
      "self_test_actionability_score": 0.95,
      "holdout_regression_score": 0.84,
      "quality_score": 0.891
    },
    "champion": {
      "defect_recall_replay_score": 0.76,
      "knowledge_pack_coverage_score": 0.81,
      "self_test_actionability_score": 0.42,
      "holdout_regression_score": 0.84,
      "quality_score": 0.725
    },
    "delta": {
      "defect_recall_replay_score": 0.12,
      "knowledge_pack_coverage_score": 0.11,
      "self_test_actionability_score": 0.53,
      "holdout_regression_score": 0.0,
      "quality_score": 0.166
    }
  },
  "efficiency": {
    "candidate_mean_time_seconds": 210.4,
    "champion_mean_time_seconds": 198.9,
    "candidate_mean_tokens": 48120,
    "champion_mean_tokens": 45005
  },
  "decision": {
    "result": "accept",
    "reason": "Blocking gates passed and quality score improved without holdout regression."
  }
}
```

## Acceptance Policy

### Candidate acceptance

Accept the candidate only when:

1. all blocking gates pass
2. `candidate.quality_score > champion.quality_score`
3. `candidate.defect_recall_replay_score >= champion.defect_recall_replay_score`
4. `candidate.holdout_regression_score >= champion.holdout_regression_score`

### Tie policy

If `quality_score` ties within `±0.01`:

1. prefer the lower-regression-risk candidate
2. then prefer lower mean time
3. then prefer lower mean tokens
4. otherwise keep the current champion

### Model acceptance

When comparing models for the same skill snapshot:

1. do not replace the reference model unless blocking gates are equal
2. require `quality_score` improvement of at least `0.02`, or
3. require equal quality with materially better efficiency:
   - `>= 10%` lower time, or
   - `>= 15%` lower tokens

## Recommended Eval Sets For `qa-plan-orchestrator`

### `core_regression`

Use the existing evals and smoke tests:

1. current `evals/evals.json`
2. `npm test`

### `defect_replay`

Start with BCIN-7289 and create replay evals for:

1. save-override scenario
2. report-builder element loading
3. template-sourced create + save
4. template + pause-mode prompt interaction
5. window title correctness
6. dialog interactivity analogs

### `holdout_regression`

Use at least two non-BCIN-7289 features from the same skill family, but not the ones used to propose the mutation.

### `knowledge_pack_coverage`

Start with:

1. report-editor required capabilities
2. analog gates
3. SDK/API visible contracts
4. interaction pairs

## Execution SOP

### Build baseline

1. snapshot current skill into `iteration-0/champion_snapshot/`
2. freeze `benchmark_manifest.json`, `fixtures_manifest.json`, and `grading_rubric.md`
3. run `iteration-0` with `with_skill` vs `without_skill`
4. generate `benchmark.json` and `benchmark.md`
5. register `iteration-0` as the current champion in `history.json`

### Run iteration compare

1. create `iteration-N/candidate_snapshot/`
2. run `new_skill` vs `old_skill`
3. aggregate results
4. compute `scorecard.json`
5. update `history.json`

### Run model compare

1. keep skill snapshot fixed
2. create `model-compare/<comparison-id>/`
3. run primary contender vs reference contender using `new_skill` and `old_skill`
4. store actual model identity only in `comparison_metadata.json`
5. aggregate and score

## References

1. [run_evals.mjs](/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/evals/run_evals.mjs)
2. [post_run.sh](/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/evals/post_run.sh)
3. [schemas.md](/Users/vizcitest/.agents/skills/skill-creator/references/schemas.md)
4. [aggregate_benchmark.py](/Users/vizcitest/.agents/skills/skill-creator/scripts/aggregate_benchmark.py)
5. [QA_PLAN_EVOLUTION_DESIGN.md](/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-planner/skills/qa-plan-orchestrator/docs/QA_PLAN_EVOLUTION_DESIGN.md)
