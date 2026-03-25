# QA Plan Evolution Workflow And Concrete Example

## Purpose

This document explains how `qa-plan-evolution` evolves `qa-plan-orchestrator`, how the `qa-plan-v2` benchmark is used, what the baseline does, and how the workflow decides whether a mutation is good enough to promote.

Use this doc when:

- you are preparing the baseline
- you are about to run iteration 1 or later
- you need to explain why a mutation was accepted or rejected

## The Two Roots

There are two different runtime roots during `qa-plan-orchestrator` evolution.

### 1. Evolution run root

This is the idempotent workflow root used by the shared orchestrator:

```text
.agents/skills/qa-plan-evolution/runs/<run-key>/
```

This tree owns:

- `task.json`
- `run.json`
- `context/`
- `candidates/iteration-<n>/`
- `benchmarks/scoreboard_<run-key>.json`

### 2. Canonical benchmark root

This is the frozen benchmark campaign for `qa-plan-orchestrator`:

```text
workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/
```

This tree owns:

- `benchmark_manifest.json`
- `cases.json`
- `fixtures_manifest.json`
- `iteration-0/`
- `iteration-1/`, `iteration-2/`, and later comparison outputs
- `history.json`

Rule: the evolution run root is for orchestration state and resume. The `qa-plan-v2` tree is the authoritative record for benchmark comparison and promotion decisions.

## Important Naming Distinction

There are two different profile concepts:

1. Shared orchestrator benchmark profile
   - example: `qa-plan-defect-recall`
   - defined in `.agents/skills/qa-plan-evolution/evals/evals.json`
2. Frozen qa-plan benchmark campaign profile
   - example: `global-cross-feature-v1`
   - defined in `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/benchmark_manifest.json`

Do not treat them as the same setting.

For the shared orchestrator run, use the shared profile that matches the objective:

- `qa-plan-knowledge-pack-coverage` for non-replay evolution runs
- `qa-plan-defect-recall` only when replay is intentionally enabled with `defect_analysis_run_key`

For a single-target operator workflow such as `report-editor`, pass `feature_family` and usually `feature_id` so mutation selection and knowledge-pack resolution stay anchored to that family. This scopes the evolution focus, but it does not shrink `qa-plan-v2` into a single-family benchmark. The global case catalog still runs, and non-target families remain the blind/holdout non-regression guardrail.

## End-To-End Workflow

### Step 1. Freeze the benchmark surface

Before mutation work starts, freeze:

- case catalog
- fixtures
- grading rubric
- blocking vs advisory classification
- acceptance policy

For `qa-plan-orchestrator`, this frozen benchmark is `qa-plan-v2`.

### Step 2. Prepare and execute the baseline

Baseline is always `iteration-0`.

Purpose:

- prove the current champion skill is better than `without_skill`
- freeze the benchmark matrix before mutation work starts
- establish the current champion snapshot for later candidate comparison

Baseline uses these configuration names:

- `with_skill`
- `without_skill`

This is handled by:

- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/run_baseline.mjs`

### Step 3. Start an evolution run

The shared orchestrator creates a run under:

```text
.agents/skills/qa-plan-evolution/runs/<run-key>/
```

For `qa-plan-orchestrator`, use a `qa-plan-*` profile that matches the evidence mode:

- default: non-replay evolution with blind and holdout gating
- replay-enabled: `qa-plan-defect-recall` when `defect_analysis_run_key` is available

### Step 4. Refresh evidence and classify gaps

Phases 1 and 2 automatically orchestrate defect evidence:

- check if retrospective or replay evidence is required by the benchmark profile
- auto-invoke `workspace-reporter/skills/defects-analysis` if the required evidence for the feature context is missing or stale
- read the machine-readable `gap_bundle_<run-key>.json` instead of raw markdown
- classify misses into the standard gap taxonomy buckets (e.g., `missing_scenario`, `developer_artifact_missing`)
- build a mutation backlog sequenced by priority and affected phase

Each mutation must be tied to an explicit root-cause bucket sourced from the gap bundle.

### Step 5. Select exactly one mutation

Phase 3 selects one bounded mutation for the next challenger.

Rule: do not mutate multiple hypotheses in one iteration.

### Step 6. Validate and publish benchmark comparison

Phase 4 validates the target skill and then publishes `iteration-<n>` results into `qa-plan-v2`. Iteration comparison can run in two modes: `synthetic_structural_compare` or `executed_benchmark_compare`.

For qa-plan under executed mode, that means:

- snapshot the candidate skill
- materialize run directories for the cases being evaluated
- **Operator Precondition**: real agent runs must write `outputs/`, `grading.json`, and `timing.json` to the benchmark directory before a scorecard can be generated
- compare `new_skill` vs `old_skill` (Baseline uses `with_skill` vs `without_skill`)
- write `benchmark.json`
- write `scorecard.json`

> **Note:** If `synthetic_structural_compare` is used as a fallback, no real execution happens. The resulting scorecard will carry `scoring_fidelity: "synthetic"` and it cannot trigger a promotion.

### Step 7. Accept or reject the mutation

Phase 5 reads the published `scorecard.json` and decides promotion based on strict acceptance limits.

If accepted:

- the candidate becomes the new champion for the next iteration

If rejected or blocked:

- the candidate is discarded
- the champion remains unchanged

**Promotion Guards:** Phase 5 will refuse to promote and will output a "reject" or "blocked_synthetic" result if:
- `scoring_fidelity` is `"synthetic"`
- A required test category has a `null` mean score (absent evidence cannot silently pass)

### Step 8. Finalize only with approval

Accepted challengers do not finalize automatically.

Phase 6 archives the previous champion, records the accepted candidate, and waits for explicit final approval before writing the final summary.

## What Baseline Actually Tells You

Baseline does not answer:

- "is my new mutation good?"

Baseline answers:

- "what is the frozen champion surface I will compare later mutations against?"
- "does the current skill beat a no-skill baseline on the frozen benchmark matrix?"

This matters because mutation quality is decided later by candidate-vs-champion comparison, not by baseline generation.

## How The Workflow Knows A Mutation Is Good

For `qa-plan-v2`, the real decision comes from `scorecard.json`. The acceptance gates apply strict null-safety: a `null` score is treated as **absent evidence** and will fail the gate, not silently pass.

The candidate is accepted only when all of these are true:

1. all blocking cases for the candidate pass
2. `blind_pre_defect` mean pass rate does not decrease
3. `holdout_regression` mean pass rate does not decrease
4. **If replay is enabled via defect analysis context**: `retrospective_replay` mean pass rate improves

> **Note on Replay Evidence:** `retrospective_replay` cases are strictly **opt-in**. They are triggered during scorecard generation only if the operator provides an explicit `defect_analysis_run_key` OR provides enough feature context (`feature_id`, `feature_family`) for the workflow to automatically derive or generate the defect evidence.

That rule is stricter than "overall score improved".

Replay improvements (when active) are not allowed to hide:

- regressions in blind planning quality
- regressions in holdout cases
- failures on blocking cases

## Concrete Example

### Scenario

Assume the current champion skill often misses historical analog gating in Phase 5b for report-editor work.

Use the real blocking benchmark case:

- `P5B-ANALOG-GATE-001`

Case focus from `cases.json`:

- historical analogs become required-before-ship gates

### Baseline state

At time of writing, the repository already contains a prepared `qa-plan-v2` baseline:

- `iteration-0/benchmark_context.json` shows `status: prepared_pending_execution`
- `history.json` shows `current_champion_iteration: 0`

This means the benchmark matrix and champion snapshot exist, but the baseline grading/execution still needs to be completed before the benchmark becomes the stable comparison reference.

Practical implication:

- `qa-plan-evolution` already applies to `qa-plan-v2`
- promotion decisions are structurally wired up
- but `iteration-0` still needs executed benchmark outputs before the campaign is fully trustworthy as the authoritative acceptance gate

### Iteration 1 hypothesis

Phase 2 identifies a gap like:

- `checkpoint_enforcement`
- the skill documents analog risks, but does not force them into required release gates

Phase 3 turns that into one bounded mutation:

- strengthen Phase 5b wording so analog findings become explicit blocking gates
- ensure Phase 7 developer smoke guidance is derived from those analog gates

Possible target files:

- `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`
- `workspace-planner/skills/qa-plan-orchestrator/scripts/phase7.sh`
- `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json`

### What Phase 4 publishes

Phase 4 creates:

- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-1/candidate_snapshot/`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-1/benchmark.json`
- `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/iteration-1/scorecard.json`

The comparison is:

- `new_skill` = iteration 1 candidate
- `old_skill` = current champion from `history.json`

### Accepted example (with Replay Enabled)

Suppose a `defect_analysis_run_key` (or feature context) was provided, so replay is evaluated, and `scorecard.json` effectively shows:

- blind pre-defect: `0.92 -> 0.92`
- retrospective replay: `0.58 -> 0.75`
- holdout regression: `1.00 -> 1.00`
- all blocking cases pass

Result:

- accept

Why:

- blind quality did not regress
- replay coverage improved (required because replay was enabled)
- holdout safety did not regress
- no blocking benchmark case failed
- the scorecard has `scoring_fidelity: "executed"`

### Rejected example

Suppose the mutation improves replay but weakens blind planning:

- blind pre-defect: `0.92 -> 0.84`
- retrospective replay: `0.58 -> 0.81`
- holdout regression: `1.00 -> 1.00`
- all blocking cases pass

Result:

- reject

Why:

- replay got better, but `blind_pre_defect` regressed
- the benchmark policy does not allow replay gains to hide blind regressions

This is the core anti-overfitting rule of `qa-plan-v2`.

## Practical Answer To "How Does It Know?"

When you are generating the baseline, the system does not yet know whether a future mutation is good. It is building the frozen reference point.

The mutation is judged later by this sequence:

1. publish candidate-vs-champion results into `qa-plan-v2/iteration-<n>/`
2. compute `scorecard.json`
3. apply the benchmark acceptance checks
4. accept only if all required checks pass

In short:

- baseline establishes the ruler
- iteration scoring measures the candidate against that ruler

## Operator Checklist

Before iteration work:

- freeze `qa-plan-v2`
- finish `iteration-0` baseline execution and aggregation
- confirm `history.json` points to the intended champion

Recommended single-family invocation when the current mutation target is `report-editor`:

```bash
./.agents/skills/qa-plan-evolution/scripts/orchestrate.sh --with-phase0 \
  --run-key "qa-plan-orchestrator__report-editor__$(date -u +%Y%m%dT%H%M%SZ)" \
  --target-skill-path workspace-planner/skills/qa-plan-orchestrator \
  --target-skill-name qa-plan-orchestrator \
  --benchmark-profile qa-plan-knowledge-pack-coverage \
  --feature-family report-editor \
  --feature-id BCIN-7289
```

Canonical operator inspection:

```bash
./.agents/skills/qa-plan-evolution/scripts/check_resume.sh --run-key "qa-plan-orchestrator__report-editor__<timestamp>"
./.agents/skills/qa-plan-evolution/scripts/progress.sh --run-key "qa-plan-orchestrator__report-editor__<timestamp>"
```

The authoritative run home is:

```text
.agents/skills/qa-plan-evolution/runs/<run-key>/
```

Enable replay only when you intentionally want defect-backed evaluation:

```bash
./.agents/skills/qa-plan-evolution/scripts/orchestrate.sh --with-phase0 \
  --run-key "qa-plan-orchestrator__report-editor__replay__$(date -u +%Y%m%dT%H%M%SZ)" \
  --target-skill-path workspace-planner/skills/qa-plan-orchestrator \
  --target-skill-name qa-plan-orchestrator \
  --benchmark-profile qa-plan-defect-recall \
  --feature-family report-editor \
  --feature-id BCIN-7289 \
  --knowledge-pack-key report-editor \
  --defect-analysis-run-key BCIN-7289
```

For each iteration (orchestrated automatically):

- Phase 3 selects one bounded mutation from the gap bundle
- Phase 4 publishes benchmark comparison artifacts
- Phase 5 inspects `iteration-<n>/scorecard.json`
- Phase 5 rejects on any blocking or non-regression failure
- promote only after Phase 6 manual approval

## Key Files

- Shared skill entry: `.agents/skills/qa-plan-evolution/SKILL.md`
- Shared runtime rules: `.agents/skills/qa-plan-evolution/reference.md`
- Shared benchmark profiles: `.agents/skills/qa-plan-evolution/evals/evals.json`
- Qa-plan benchmark spec: `workspace-planner/skills/qa-plan-orchestrator/references/qa-plan-benchmark-spec.md`
- Qa-plan benchmark manifest: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/benchmark_manifest.json`
- Qa-plan case catalog: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/cases.json`
- Baseline runner: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/run_baseline.mjs`
- Iteration scorer: `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/score_iteration.mjs`
