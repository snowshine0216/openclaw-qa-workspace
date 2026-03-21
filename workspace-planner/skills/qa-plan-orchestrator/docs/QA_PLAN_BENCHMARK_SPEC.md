# QA Plan Orchestrator Benchmark Spec

> **Spec ID:** `qa-plan-orchestrator-benchmark-spec-2026-03-21`
> **Date:** 2026-03-21
> **Status:** Draft
> **Scope:** `workspace-planner/skills/qa-plan-orchestrator`

---

## Relationship to skill-evolution-orchestrator

- **Canonical campaign (this spec):** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/<benchmark-version>/` is the frozen, aggregateable source for `skill-creator` tooling and the eval viewer.
- **Evolution workflow root:** `skill-evolution-orchestrator` stores run state and working files under `.agents/skills/skill-evolution-orchestrator/runs/<run-key>/` (including `benchmarks/scoreboard_<run-key>.json` during a run).
- **Consistency rule:** When evolving `qa-plan-orchestrator`, Phases 4–6 must publish per-iteration results into this spec’s `benchmarks/<benchmark-version>/iteration-<n>/` layout so manifests, `benchmark.json`, and `scorecard.json` have a single authoritative location. The evolution run directory remains the idempotency and resume root.

See [SKILL_EVOLUTION_ORCHESTRATOR_DESIGN.md](./SKILL_EVOLUTION_ORCHESTRATOR_DESIGN.md) (section *Benchmark layout: canonical vs evolution run*).

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

`qa-plan-v2` is the first real global benchmark version. It is not a single-feature benchmark. Cases from multiple feature families live under one benchmark campaign and are explicitly separated by `evidence_mode`.

## Environment setup

- **In-repo:** Node.js and the eval harness under `workspace-planner/skills/qa-plan-orchestrator/evals/` (`run_evals.mjs`, `post_run.sh`).
- **Host install:** `skill-creator` scripts and viewer under `~/.agents/skills/skill-creator/` (or the equivalent path on the machine running aggregation); not vendored in this repository.
- **Optional:** `jq` for inspecting `benchmark.json`, `scorecard.json`, and manifests under `benchmarks/<benchmark-version>/`.

## Deliverables (benchmark campaign artifacts)

When creating or extending a benchmark version under `benchmarks/<benchmark-version>/`, these files are required at minimum (see [Files That Must Exist At Benchmark Root](#files-that-must-exist-at-benchmark-root)): `benchmark_manifest.json`, `fixtures_manifest.json`, `grading_rubric.md`, plus per-iteration directories as defined in this spec. `history.json`, `scoreboard.json`, and `notes.md` are updated as the campaign progresses.

## Non-Negotiable Rules

1. Freeze the benchmark manifest before iteration work starts.
2. Do not change benchmark prompts, fixtures, grading rubric, or weights within a live benchmark version.
3. Change only one axis at a time when measuring improvement:
   - skill version, or
   - model, or
   - knowledge-pack version
4. Do not accept a candidate if any blocking gate regresses, even if the aggregate score rises.
5. Use pairwise comparisons only. Every benchmark run must have one primary contender and one reference contender.
6. Keep `blind_pre_defect`, `retrospective_replay`, and `holdout_regression` separate in both scoring and acceptance. Replay gains must not hide blind regressions.

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
  "benchmark_scope": "global",
  "benchmark_profile": "global-cross-feature-v1",
  "frozen_at": "2026-03-21T00:00:00Z",
  "runs_per_configuration": 3,
  "evidence_modes": [
    "blind_pre_defect",
    "retrospective_replay",
    "holdout_regression"
  ],
  "supported_feature_families": [
    "report-editor",
    "docs"
  ],
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
    "blind_pre_defect": 0.25,
    "retrospective_replay": 0.6,
    "holdout_regression": 0.15
  },
  "acceptance_policy": {
    "require_blocking_cases_pass": true,
    "require_no_holdout_regression": true,
    "require_non_decreasing_blind_score": true,
    "require_non_decreasing_replay_score": true
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
      "fixture_id": "BCIN-7289-blind-pre-defect-bundle",
      "type": "blind_pre_defect_bundle",
      "feature_id": "BCIN-7289",
      "feature_family": "report-editor",
      "cutoff_policy": "all_customer_issues_only",
      "issue_scope": {
        "include_issue_classes": ["customer"],
        "exclude_issue_classes": ["non_customer"]
      },
      "materials": [
        {
          "material_type": "jira_feature",
          "source_id_or_url": "BCIN-7289",
          "included_in_blind": true
        }
      ]
    },
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
  "feature_family": "report-editor",
  "knowledge_pack_key": "report-editor",
  "evidence_mode": "retrospective_replay",
  "fixture_refs": ["BCIN-7289-defect-analysis-run"],
  "benchmark_profile": "global-cross-feature-v1",
  "eval_group": "defect_recall_replay",
  "severity_weight": 1.0
}
```

### `cases.json`

This is the frozen case catalog for the benchmark version. Every case must declare:

```json
{
  "case_id": "P5B-ANALOG-GATE-001",
  "feature_id": "BCIN-7289",
  "feature_family": "report-editor",
  "knowledge_pack_key": "report-editor",
  "primary_phase": "phase5b",
  "kind": "checkpoint_enforcement",
  "evidence_mode": "retrospective_replay",
  "blocking": true,
  "fixture_refs": ["BCIN-7289-defect-analysis-run"],
  "benchmark_profile": "global-cross-feature-v1",
  "focus": "historical analogs become required-before-ship gates"
}
```

Do not inline all raw source materials into `cases.json`.

Use `cases.json` for benchmark intent only. Frozen Jira ids, design-doc references, GitHub PR references, and similar benchmark inputs must live in `fixtures_manifest.json`.

Required fields:

1. `case_id`
2. `feature_id`
3. `feature_family`
4. `knowledge_pack_key`
5. `primary_phase`
6. `kind`
7. `evidence_mode`
8. `blocking`
9. `fixture_refs`
10. `benchmark_profile`
11. `focus`

Supported `evidence_mode` values:

1. `blind_pre_defect`
2. `retrospective_replay`
3. `holdout_regression`

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

## Evidence Modes

### `blind_pre_defect`

Use only customer-issue evidence and exclude non-customer issues.

Purpose:

1. predictive QA-plan quality
2. no-regression gate for future iterations

Contract:

1. every `blind_pre_defect` case must reference exactly one fixture of type `blind_pre_defect_bundle`
2. that bundle must declare `cutoff_policy: all_customer_issues_only`
3. `issue_scope` must include `customer` and exclude `non_customer`
4. replay, postmortem, or gap-analysis artifacts must not appear in that bundle

### `retrospective_replay`

Use known defect history and retrospective evidence on purpose.

Purpose:

1. verify the skill learned from known misses
2. measure replay improvement after skill evolution

### `holdout_regression`

Use unrelated features or holdout cases to protect against overfitting.

Purpose:

1. keep unrelated planning quality stable
2. reject changes that improve replay but damage other flows

## Scoring Schema

Use two decision layers:

1. blocking case gate
2. evidence-mode acceptance checks

### 1. Blocking case gate

The primary contender automatically fails if any blocking case has aggregate pass rate `< 1.0`.

### 2. Evidence-mode acceptance checks

Acceptance must be evaluated separately by evidence mode:

1. `blind_pre_defect`
   - no regression
   - primary mean pass rate must be `>=` reference mean pass rate
2. `retrospective_replay`
   - improvement required
   - primary mean pass rate must be `>` reference mean pass rate
3. `holdout_regression`
   - no regression
   - primary mean pass rate must be `>=` reference mean pass rate

### Mode score definition

For each evidence mode, compute:

```text
mean_pass_rate = average(run.result.pass_rate for runs in that mode and configuration)
```

This produces:

1. `mode_scores.primary.<mode>.mean_pass_rate`
2. `mode_scores.reference.<mode>.mean_pass_rate`
3. `mode_scores.delta.<mode>.mean_pass_rate`

If a mode has no cases in a comparison, its acceptance check may be treated as `true`, but this should be rare in a frozen benchmark version.

## Scorecard Schema

Each iteration `>= 1` must produce `scorecard.json`.

```json
{
  "benchmark_version": "qa-plan-v1",
  "iteration": 1,
  "comparison_mode": "iteration_compare",
  "primary_configuration": "new_skill",
  "reference_configuration": "old_skill",
  "acceptance_checks": {
    "blocking_cases_pass": true,
    "blind_pre_defect_non_regression": true,
    "retrospective_replay_improved": true,
    "holdout_regression_non_regression": true,
    "policy": {
      "require_blocking_cases_pass": true,
      "require_non_decreasing_blind_score": true,
      "require_non_decreasing_replay_score": true,
      "require_no_holdout_regression": true
    }
  },
  "mode_scores": {
    "primary": {
      "blind_pre_defect": {
        "eval_count": 6,
        "run_count": 18,
        "mean_pass_rate": 0.88
      },
      "retrospective_replay": {
        "eval_count": 6,
        "run_count": 18,
        "mean_pass_rate": 0.91
      },
      "holdout_regression": {
        "eval_count": 2,
        "run_count": 6,
        "mean_pass_rate": 0.84
      }
    },
    "reference": {
      "blind_pre_defect": {
        "eval_count": 6,
        "run_count": 18,
        "mean_pass_rate": 0.88
      },
      "retrospective_replay": {
        "eval_count": 6,
        "run_count": 18,
        "mean_pass_rate": 0.76
      },
      "holdout_regression": {
        "eval_count": 2,
        "run_count": 6,
        "mean_pass_rate": 0.84
      }
    },
    "delta": {
      "blind_pre_defect": {
        "eval_count_delta": 0,
        "run_count_delta": 0,
        "mean_pass_rate": 0.0
      },
      "retrospective_replay": {
        "eval_count_delta": 0,
        "run_count_delta": 0,
        "mean_pass_rate": 0.15
      },
      "holdout_regression": {
        "eval_count_delta": 0,
        "run_count_delta": 0,
        "mean_pass_rate": 0.0
      }
    }
  },
  "decision": {
    "result": "accept",
    "reason": "blind_pre_defect did not regress, retrospective_replay improved, and holdout_regression did not regress."
  }
}
```

## Acceptance Policy

### Candidate acceptance

Accept the candidate only when:

1. `blocking_cases_pass == true`
2. `blind_pre_defect_non_regression == true`
3. `retrospective_replay_improved == true`
4. `holdout_regression_non_regression == true`

### Tie policy

If `retrospective_replay` does not improve, keep the current champion even when blind and holdout are tied.

If replay improves but blind and holdout both tie exactly:

1. prefer the lower-regression-risk candidate
2. then prefer lower mean time
3. then prefer lower mean tokens
4. otherwise keep the current champion

### Model acceptance

When comparing models for the same skill snapshot:

1. do not replace the reference model unless the evidence-mode acceptance checks are at least equal
2. require replay improvement without blind or holdout regression, or
3. require equal evidence-mode checks with materially better efficiency:
   - `>= 10%` lower time, or
   - `>= 15%` lower tokens

## Recommended Eval Sets For `qa-plan-orchestrator`

### `core_regression`

Use the existing evals and smoke tests:

1. current `evals/evals.json`
2. `npm test`

### `retrospective_replay`

Start with BCIN-7289 and create replay evals for:

1. save-override scenario
2. report-builder element loading
3. template-sourced create + save
4. template + pause-mode prompt interaction
5. window title correctness
6. dialog interactivity analogs

### `holdout_regression`

Use at least two non-BCIN-7289 features from the same skill family, but not the ones used to propose the mutation.

### `blind_pre_defect`

Use cases that rely only on evidence available before the relevant defects were known.

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

The canonical scorer for `qa-plan-v2` is:

- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/lib/scoreBenchmarkV2.mjs`
- CLI: `npm run benchmark:v2:score`

### Run model compare

1. keep skill snapshot fixed
2. create `model-compare/<comparison-id>/`
3. run primary contender vs reference contender using `new_skill` and `old_skill`
4. store actual model identity only in `comparison_metadata.json`
5. aggregate and score

## References

Repository paths are relative to the repo root unless they start with `~/` (host-local OpenClaw skills install).

1. [run_evals.mjs](../evals/run_evals.mjs) — `workspace-planner/skills/qa-plan-orchestrator/evals/run_evals.mjs`
2. [post_run.sh](../evals/post_run.sh) — `workspace-planner/skills/qa-plan-orchestrator/evals/post_run.sh`
3. `~/.agents/skills/skill-creator/references/schemas.md` — not vendored in this repo; use the same `skill-creator` install as eval aggregation
4. `~/.agents/skills/skill-creator/scripts/aggregate_benchmark.py` — not vendored in this repo
5. [SKILL_EVOLUTION_ORCHESTRATOR_DESIGN.md](./SKILL_EVOLUTION_ORCHESTRATOR_DESIGN.md) — paired design for evolution runs and benchmark ownership
