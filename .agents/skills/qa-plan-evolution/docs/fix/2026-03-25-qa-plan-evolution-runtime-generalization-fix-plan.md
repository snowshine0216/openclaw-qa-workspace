# Design: qa-plan-evolution Runtime, Resume, and Generalization Remediation

Generated on 2026-03-25
Status: DRAFT
Scope: `.agents/skills/qa-plan-evolution`

## Overview

This plan fixes four linked failures in the current `qa-plan-evolution` skill:

1. run artifacts are not consistently rooted in one canonical place, so resume is unreliable
2. spawned background work can finish outside the orchestrator's awareness, so progress stalls until a human manually re-invokes it
3. the run state remembers too little, so later iterations do not know exactly what is done, blocked, or reusable
4. defect-driven mutations can overfit to a specific defect key or feature-family example instead of extracting a reusable rule

The recommendation is to keep the existing 7-phase structure, but harden it with:

1. one canonical run home under `.agents/skills/qa-plan-evolution/runs/<run-key>/`
2. richer `task.json` / `run.json` state instead of parallel state stores
3. explicit async job tracking with re-entry semantics
4. a generalization guard that blocks defect-literal mutations from being promoted

## Problem Statement

The current code and docs already say the runtime root should be `<skill-root>/runs/<run-key>/`, but the actual workflow still tolerates arbitrary `--run-root` locations and has recent handoff docs pointing at `/tmp/qa-plan-evolution-runs/...`. That split breaks resumability because the operator cannot trust one stable place to inspect or continue a run.

The orchestration layer also assumes that `SPAWN_MANIFEST` work is either synchronous or immediately post-checkable. In practice, benchmark and evidence-refresh work can outlive the phase call, but the run state does not retain enough job metadata to detect completion and re-enter the blocked phase automatically.

Finally, the defect-to-mutation pipeline is still too willing to turn concrete defect evidence into concrete rubric edits. The fallback path in `scripts/lib/gapSources/defectsCrossAnalysis.mjs` can emit hard-coded rubric targets and replay evals from markdown bullets, which is the opposite of the intended behavior. A `report-editor` miss should enrich the `report-editor` knowledge pack or a reusable planner rule, not inject a defect name or one-off example into global rubric text.

## Goals

1. Every evolution run is discoverable and resumable from one canonical folder.
2. Every spawned async task is persisted with status, completion evidence, and next-step ownership.
3. Every phase can tell what was already completed, what is pending, and what inputs changed.
4. Defect-backed mutations become generalized structural rules, not defect-specific patches.
5. Re-running the same run should be fast because completed receipts and unchanged artifacts are reused.

## Non-Goals

1. Replacing the 7-phase model with a new orchestrator.
2. Rewriting `workspace-planner/skills/qa-plan-orchestrator` in this plan.
3. Making benchmark execution purely synchronous.

## Premises

1. The canonical evolution record must live under `.agents/skills/qa-plan-evolution/runs/<run-key>/`, even if some heavyweight scratch work happens elsewhere.
2. Reporter and benchmark artifacts may remain in their own skill trees, but the evolution run must store stable references and completion receipts for them.
3. A mutation is promotion-eligible only if it can be stated as a generalized rule, scoped knowledge-pack enrichment, or reusable structural contract change.

## Approaches Considered

### Approach A: Minimal Patch

Keep `--run-root`, add a few docs, and patch `check_resume.sh`.

Pros:
- smallest diff
- low short-term risk

Cons:
- does not solve split-brain runtime roots
- does not solve background job completion
- does not stop defect-literal mutations

### Approach B: Canonical Run Root + Existing-State Expansion + Generalization Guard

Keep the current phase layout, but expand the existing `task.json` / `run.json` model, add explicit async job tracking, and add promotion guards for generalized mutations.

Pros:
- fixes all four reported failures without replacing the whole system
- keeps current scripts and tests mostly recognizable
- gives operators one stable resume and progress model

Cons:
- touches most phase runners and several tests
- requires stronger contracts in docs and manifests

### Approach C: Full Orchestrator Rewrite

Collapse the current phase shell/node split into a new workflow engine.

Pros:
- maximum long-term freedom

Cons:
- too much surface area
- high regression risk
- not necessary to solve the current failures

## Recommendation

Choose Approach B. It is the smallest design that actually fixes the runtime-path drift, async-progress blind spot, missing memory, and mutation overfitting together without introducing a second durable state layer.

## Architecture

### Workflow Chart

```text
phase0
  -> allocate canonical run home
  -> initialize task/run state
  -> record runtime pointers and next action

phase1
  -> refresh evidence / spawn async prerequisites
  -> if async work pending, persist job state and stop as awaiting_async
  -> on re-entry, detect completion and continue

phase2
  -> normalize observations
  -> cluster by generalized rule
  -> build bounded mutation backlog

phase3
  -> select next unattempted mutation from ledger
  -> materialize candidate snapshot
  -> spawn bounded patch task

phase4
  -> validate candidate
  -> run or poll benchmark compare
  -> persist benchmark receipt

phase5
  -> score challenger vs champion
  -> persist attempt outcome, stop reason, and reuse metadata

phase6
  -> archive / restore / finalize
  -> update champion pointers, receipts, and next action
```

### Runtime Model

The canonical run home becomes:

```text
.agents/skills/qa-plan-evolution/runs/<run-key>/
  task.json
  run.json
  jobs/
    <job-id>.json
  context/
  drafts/
  candidates/
  benchmarks/
  archive/
```

`task.json` and `run.json` remain the operator-facing truth for what is done, pending, blocked, reusable, and next. Job files are append-only support artifacts for async reconciliation, not a second source of truth.

### State Ownership

| State family | Authoritative store | Notes |
|---|---|---|
| Run identity, target skill, chosen profile, canonical/scratch paths | `task.json` | immutable or rarely-changing run contract |
| Current phase, current iteration, next action, overall status | `task.json` | current control-plane state lives here |
| Approval / finalization status | `task.json` | operator-facing workflow status |
| Timing history, iteration history, rejection counters, archive history | `run.json` | append-oriented historical record |
| Fingerprints for reusable phase outputs | `run.json` | historical execution metadata, not control-plane routing |
| Latest validation / score completion timestamps | `run.json` | derived execution history |
| Async job details and probe fields | `jobs/<job-id>.json` | per-job detail; summarized into `task.json` when needed for next action |
| Pending job summary (`pending_job_ids`, blocking async reason) | `task.json` | only the minimal summary needed for control flow |
| Mutation evidence refs, accepted/rejected mutation artifacts | files under `context/` | reviewable artifacts, not duplicated into JSON beyond ids/summaries |

Rules:

1. do not store the same authoritative field in both `task.json` and `run.json`
2. `task.json` answers "what should happen next?"
3. `run.json` answers "what already happened?"
4. job files answer "what is happening inside this async unit of work?"

### Validity Model

Use one shared vocabulary across all phases:

| Term | Meaning | Used by |
|---|---|---|
| `fingerprint` | deterministic hash or normalized signature of the inputs that matter for deciding whether prior output is reusable | phase2, phase4, async completion checks |
| `freshness` | whether an artifact is newer than the inputs and markers it depends on | phase1, async completion checks |
| `completion` | whether a unit of work reached a terminal success state | async jobs, spawned phases |
| `reuse` | whether a prior phase artifact may be consumed again without recomputation | phase2, phase4 |
| `invalidated` | prior result exists but must not be reused because inputs, timestamps, or status markers changed | all reusable phases |

Rules:

1. phases may invent new fields, but not new validity concepts, unless the plan is updated first
2. `completion` is binary and terminal for a given attempt; retries create a new attempt record or increment retry metadata
3. `freshness` is a timestamp/fingerprint relationship, not a human judgment
4. `reuse` is allowed only when both `completion=true` and `invalidated=false`
5. `success_marker` is one implementation detail that may be used to prove `completion`; it is not a separate validity concept

### Operator Summary Contract

The operator-facing summary lives in `task.json` as a small canonical snapshot. It should answer, without opening other files:

1. what phase the run is in
2. what the next action is
3. whether the run is blocked, waiting, or ready
4. which async jobs are pending
5. which iteration is active

Recommended summary fields in `task.json`:

- `overall_status`
- `current_phase`
- `current_iteration`
- `next_action`
- `next_action_reason`
- `pending_job_ids`
- `blocking_reason`
- `accepted_iteration`
- `pending_finalization_iteration`

Rules:

1. `check_resume.sh` and `progress.sh` are renderers of the same summary contract; they must not compute separate truths
2. job files and `run.json` provide detail, but operator commands should summarize from `task.json` first and drill down only when needed
3. if a renderer needs data that is not in the summary contract, the contract should be expanded instead of duplicating logic across scripts

### Bounded Reconciliation

Performance rules for polling and resume:

1. `orchestrate.sh`, `check_resume.sh`, and `progress.sh` must read canonical summary JSON first and stop early when that summary is sufficient
2. job reconciliation may inspect only:
   - `task.json`
   - `run.json`
   - declared pending job files
   - declared completion-probe artifact paths
3. reconciliation must not rescan entire `candidates/`, `benchmarks/`, or `archive/` trees unless a stored fingerprint is missing or explicitly invalidated
4. summary rendering must be O(number of pending jobs), not O(size of run directory)
5. fingerprint recomputation should be limited to the specific artifact family being validated, not the whole run

### Polling and Backoff Contract

1. default behavior is manual-trigger reconciliation: each `orchestrate.sh`, `check_resume.sh`, or `progress.sh` invocation performs one bounded reconciliation pass
2. if active polling is used inside a single orchestration attempt, it must be short-lived and bounded:
   - start with a short interval
   - back off in stepped or exponential increments
   - stop after a fixed max wait and surface "pending, resume later"
3. active polling must never become a long-running daemon inside this refactor
4. timeout and expiry decisions are based on job metadata, not on unbounded waiting in the orchestrator process
5. operator-visible output should make clear whether the system is:
   - ready now
   - still waiting
   - expired / blocked
   - safe to resume later

### Generalization Boundary

Defect evidence may justify one of three mutation classes only:

1. knowledge-pack enrichment scoped to the affected feature family
2. reusable planner/rubric rule backed by multiple observations or explicit structural evidence
3. collection/runtime fixes that improve evidence handling itself

Defect evidence may not directly become:

1. a raw defect key inserted into rubric text
2. a one-off example phrased as a global rule
3. a global rubric edit when the evidence only supports a feature-family-local knowledge-pack change

## Functional Design 1: Canonical Run Home

### Goal

Make resume deterministic by ensuring every run has one stable home inside the skill tree.

### Required Change

**Files to change**

1. `.agents/skills/qa-plan-evolution/scripts/lib/paths.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/phases/common.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/workflowState.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase0.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/check_resume.sh`
6. `.agents/skills/qa-plan-evolution/scripts/orchestrate.sh`
7. `.agents/skills/qa-plan-evolution/README.md`
8. `.agents/skills/qa-plan-evolution/SKILL.md`
9. `.agents/skills/qa-plan-evolution/reference.md`

**Expected content changes**

1. `getRunRoot(runKey)` remains the only canonical run location for operator use.
2. `--run-root` is downgraded from "normal operator path" to one of:
   - test-only
   - CI-only
   - scratch-only
3. If an alternate scratch path is still allowed, phase0 must always create the canonical run home and persist a pointer to any external scratch directory; resume never depends on scratch path discovery.
4. canonical run home is the only authoritative state location for:
   - `task.json`
   - `run.json`
   - async job files
   - next-action markers
   - acceptance / rejection records
   - final summaries
5. scratch paths are explicitly non-authoritative and may contain only disposable work surfaces such as:
   - candidate snapshots
   - benchmark temp directories
   - unpacked manifests
   - transient compare outputs that are later copied or summarized into canonical artifacts
6. `task.json` and `run.json` gain stable path fields:
   - `canonical_run_root`
   - `scratch_run_root`
   - `runtime_root_mode`
7. `check_resume.sh` reads canonical `task.json` / `run.json` and prints:
   - last completed phase
   - pending async jobs
   - next required command
8. docs stop describing `/tmp` as an acceptable durable run root for normal operator usage.

**Validation expectations**

1. starting a run without overrides always writes to `.agents/skills/qa-plan-evolution/runs/<run-key>/`
2. if scratch mode is used, `check_resume.sh --run-key <key>` still resolves the run from the canonical path
3. deleting scratch data does not make the run unresumable, though it may require regenerating disposable work surfaces
4. no operator-facing docs describe `/tmp/...` as the authoritative resume location

## Functional Design 2: Async Job Tracking and Automatic Re-entry

### Goal

Make spawned work observable so the orchestrator can resume itself instead of depending on manual "progress" invocations.

### Required Change

**Files to change**

1. `.agents/skills/qa-plan-evolution/scripts/orchestrate.sh`
2. `.agents/skills/qa-plan-evolution/scripts/lib/manifestRunner.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase1.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase4.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/spawn_defects_analysis.sh`
6. `.agents/skills/qa-plan-evolution/scripts/lib/workflowState.mjs`
7. `.agents/skills/qa-plan-evolution/reference.md`
8. `.agents/skills/qa-plan-evolution/README.md`

**Files to create**

1. `.agents/skills/qa-plan-evolution/scripts/lib/asyncJobStore.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/progress.sh`

**Expected content changes**

1. every spawned job gets a persisted record under `jobs/<job-id>.json`
2. job records include:
   - `phase`
   - `job_type`
   - `status`
   - `spawn_manifest_path`
   - `spawn_results_path`
   - `expected_artifacts`
   - `completion_probe`
   - `success_marker`
   - `freshness_inputs`
   - `timeout_at`
   - `retry_count`
   - `retry_policy`
   - `blocking_reason`
   - `started_at`
   - `completed_at`
   - `last_checked_at`
3. job lifecycle is explicit and finite:
   - `queued`
   - `running`
   - `completed`
   - `failed`
   - `expired`
   - `cancelled`
4. `manifestRunner.mjs` stops being write-only; it must persist status transitions and artifact checks
5. a completion probe is phase-owned and must require all of:
   - expected artifacts exist
   - success marker exists or equivalent success status is recorded
   - artifact freshness is newer than the job's `started_at` and relevant input fingerprints
   - `spawn_results.json` does not report a failed request
6. every async job has one retry owner:
   - orchestrator-owned retries for transient local-command or polling failures
   - operator-owned retries for semantic failures in the spawned workflow
7. `orchestrate.sh` gains a pre-phase reconciliation step:
   - poll pending jobs
   - mark completed jobs
   - mark expired jobs when `timeout_at` passes
   - rerun the owning phase with `--post` only when the completion probe succeeds
8. phase1 and phase4 stop assuming that a spawned prerequisite is immediately post-checkable
9. `progress.sh --run-key <key>` becomes the read-only operator summary for active runs

**Validation expectations**

1. a spawned defects-analysis job leaves a persisted job record
2. a second `orchestrate.sh` invocation observes the completed job and re-enters phase1 `--post` automatically
3. pending benchmark work appears in `progress.sh` output with status and expected artifact paths
4. a failed async job records failure reason and keeps the run in an explicit blocked state
5. stale artifacts from a prior attempt do not satisfy a new job's completion probe
6. a timed-out job moves to `expired` and surfaces an operator action instead of being polled forever

## Functional Design 3: Persistent Memory and Smooth Iteration

### Goal

Let the run know exactly what has been completed, attempted, accepted, rejected, and safely reusable.

### Required Change

**Files to change**

1. `.agents/skills/qa-plan-evolution/scripts/lib/workflowState.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/phases/common.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase0.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase1.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase2.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase3.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase4.mjs`
8. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase5.mjs`
9. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase6.mjs`
10. `.agents/skills/qa-plan-evolution/scripts/lib/latestValidationEvidence.mjs`
11. `.agents/skills/qa-plan-evolution/scripts/lib/evidenceFreshness.mjs`
12. `.agents/skills/qa-plan-evolution/reference.md`

**Expected content changes**

1. `task.json` and `run.json` record phase-level receipts directly:
   - input fingerprint
   - key output artifacts
   - completion timestamp
   - reusable or invalidated
2. `iteration_history` becomes richer:
   - selected mutation signature
   - selected observation ids
   - generalization scope
   - validation fingerprint
   - score fingerprint
   - stop reason
3. phase2 does not rebuild work when inputs and source observations are unchanged
4. phase4 can reuse a prior validation receipt if candidate snapshot fingerprint is unchanged
5. phase6 updates `task.json` / `run.json` using stable stop reasons such as:
   - `awaiting_async_prerequisite`
   - `awaiting_final_approval`
   - `ready_for_phase3`
   - `ready_for_phase4`
   - `stop_no_pending_mutations`
   - `stop_max_iterations`
   - `stop_three_consecutive_rejections`

**Validation expectations**

1. rerunning phase2 on unchanged evidence reuses the prior taxonomy/backlog receipt
2. rerunning phase4 on unchanged candidate snapshot reuses the prior validation receipt or explicitly explains why it is invalidated
3. `check_resume.sh` can answer "what has done / what hasn't done" from `task.json`, `run.json`, and job files without scanning the whole tree heuristically

## Functional Design 4: Generalized Mutation Contract

### Goal

Stop defect-specific language from leaking into promoted evolution changes.

### Required Change

**Files to change**

1. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/defectsCrossAnalysis.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/gapTaxonomy.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/mutationBacklog.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/mutationPlanner.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/evidence/adapters/qa-plan.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase2.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase3.mjs`
8. `.agents/skills/qa-plan-evolution/SKILL.md`
9. `.agents/skills/qa-plan-evolution/reference.md`
10. `.agents/skills/qa-plan-evolution/docs/PHASE2_GENERALIZED_GAP_ANALYSIS_PATCH.md`
11. `.agents/skills/qa-plan-evolution/docs/SIMPLIFIED_EVOLUTION_MODEL.md`

**Files to create**

1. `.agents/skills/qa-plan-evolution/scripts/lib/generalizationGuard.mjs`

**Expected content changes**

1. structured gap bundles become the required source for promotion-eligible defect-driven mutations
2. markdown bullet fallback may remain for human diagnosis, but not for automatic promotion-grade mutation targeting
3. every observation emitted from defects analysis must declare:
   - `generalization_scope`
   - `generalized_rule`
   - `target_surface`
   - `source_examples`
   - `allowed_mutation_scope`
4. phase2 clusters by generalized rule and target surface, not by defect id
5. phase2 rejects or downgrades observations that only say "fix BCIN-7289" or equivalent
6. `generalizationGuard.mjs` blocks mutation plans when:
   - `knowledge_pack_delta` contains raw defect ids
   - `expected_gain` is phrased as a one-off scenario rather than a reusable rule
   - target scope is global rubric text but evidence scope is only one feature family
7. planner preference becomes:
   - feature-family knowledge-pack enrichment first
   - shared rubric/template update only when cross-feature evidence or explicit structural proof exists

### Promotion Matrix

| Evidence shape | Allowed mutation scope | Promotion rule |
|---|---|---|
| One feature family, one or more defects, no structural benchmark drift | `knowledge_pack_enrichment` only | promote only into the affected knowledge pack |
| One feature family plus planner/runtime collection defect | `collection_stage` or `knowledge_pack_enrichment` | promote only if the fix improves evidence collection or local pack coverage without changing shared rubric semantics |
| Multiple feature families showing the same normalized gap and same target surface | `rubric_update` or `template_update` allowed | require at least 2 distinct feature families or 1 feature family plus holdout/benchmark evidence showing the same structural miss |
| Benchmark/contract drift without defect evidence, but reproducible in shared planner outputs | `rubric_update` or `template_update` allowed | require explicit failing contract/benchmark case and a target surface that is already shared |
| Markdown-only fallback evidence with no structured gap bundle | advisory only | may inform humans, but cannot drive promotion-grade mutation selection |
| Evidence containing raw defect ids or one-off examples in proposed rule text | advisory only until normalized | block automatic promotion until rewritten as a generalized rule |

Additional promotion gates:

1. a shared rubric/template mutation must name the reusable rule in generalized language and must not mention a defect key or one-off scenario wording
2. a shared mutation must cite the exact benchmark, contract, or multi-family observations that justify shared scope
3. if evidence is mixed, default down to the narrower mutation scope
4. if a mutation could be solved equally by pack enrichment or shared rubric change, prefer pack enrichment unless shared-scope proof is explicit

**Validation expectations**

1. a `report-editor`-only miss produces a knowledge-pack mutation unless cross-feature evidence supports a shared rule
2. raw defect ids may appear in evidence refs only, not in promoted mutation text or target contract wording
3. fallback markdown parsing cannot silently generate global rubric edits with hard-coded file targets

## Functional Design 5: Operator UX and Recoverability

### Goal

Give the operator one obvious way to start, inspect, and resume the run.

### Required Change

**Files to change**

1. `.agents/skills/qa-plan-evolution/README.md`
2. `.agents/skills/qa-plan-evolution/SKILL.md`
3. `.agents/skills/qa-plan-evolution/reference.md`
4. `.agents/skills/qa-plan-evolution/docs/QA_PLAN_EVOLUTION_WORKFLOW_AND_EXAMPLE.md`

**Expected content changes**

1. document one canonical operator loop:
   - start run
   - inspect progress
   - resume run
   - finalize accepted mutation
2. remove doc language that treats ad-hoc `/tmp` inspection as normal
3. document the generalized mutation rule explicitly with examples of acceptable and blocked mutations
4. explain the difference between:
   - evidence source
   - generalized rule
   - target mutation surface

**Validation expectations**

1. an operator can resume a stale run using only the run key
2. docs show where to look for pending async jobs and next action
3. docs include at least one blocked example: "do not write defect keys into rubric text"

## Tests

Stub tests only. No implementation in this section.

### Test Levels

Use these levels explicitly:

- `unit`: pure helpers with deterministic inputs/outputs
- `phase script integration`: one phase entrypoint plus filesystem artifacts
- `orchestrator integration`: multi-phase behavior across `orchestrate.sh`, manifests, job files, and resume flow

Bias:

1. async reconciliation, canonical-vs-scratch behavior, and operator summary behavior should default to `phase script integration` or `orchestrator integration`
2. generalization matrix logic may be unit-tested, but promotion eligibility must also have at least one integration-style proof through phase2/phase3 selection
3. pure unit tests are insufficient for any behavior that depends on timestamps, file existence, shell orchestration, or cross-phase state persistence

### Runtime and resume

1. `test_phase0_writes_canonical_run_root_even_when_scratch_root_is_provided()` — `phase script integration`
2. `test_check_resume_reads_task_run_and_pending_jobs_summary()` — `phase script integration`
3. `test_orchestrate_reconciles_pending_jobs_before_running_next_phase()` — `orchestrator integration`

### Async job lifecycle

1. `test_phase1_spawn_records_async_job_metadata()` — `phase script integration`
2. `test_progress_reports_pending_defects_analysis_job()` — `phase script integration`
3. `test_phase4_benchmark_job_completion_triggers_post_reentry()` — `orchestrator integration`
4. `test_failed_async_job_marks_run_blocked_with_reason()` — `phase script integration`
5. `test_stale_artifacts_do_not_satisfy_completion_probe()` — `phase script integration` — **CRITICAL regression**
6. `test_failed_spawn_results_block_post_reentry()` — `orchestrator integration` — **CRITICAL regression**
7. `test_timed_out_job_transitions_to_expired_and_surfaces_operator_action()` — `phase script integration` — **CRITICAL regression**

### Memory and reuse

1. `test_phase2_reuses_receipt_when_gap_inputs_are_unchanged()` — `phase script integration`
2. `test_phase4_reuses_validation_receipt_when_candidate_snapshot_is_unchanged()` — `phase script integration`
3. `test_phase6_next_action_is_persisted_with_stable_stop_reason()` — `phase script integration`
4. `test_canonical_resume_survives_scratch_deletion()` — `orchestrator integration` — **CRITICAL regression**
5. `test_operator_summary_contract_is_rendered_consistently_by_check_resume_and_progress()` — `phase script integration`

### Generalization guard

1. `test_defects_cross_analysis_requires_structured_gap_bundle_for_promotion_eligible_mutations()` — `phase script integration`
2. `test_generalization_guard_rejects_defect_literal_knowledge_pack_delta()` — `unit`
3. `test_feature_family_local_gap_prefers_knowledge_pack_mutation_over_global_rubric_edit()` — `unit` + one `phase script integration` proof
4. `test_cross_feature_evidence_allows_shared_rule_mutation()` — `unit` + one `phase script integration` proof
5. `test_markdown_fallback_observations_are_advisory_not_promotion_eligible()` — `phase script integration`
6. `test_promotion_matrix_defaults_mixed_evidence_to_narrower_scope()` — `unit`

### QA Scenario Artifact

Write a tester-facing artifact alongside implementation so `/qa` and `/qa-only` can verify workflow behavior without reading implementation code.

Recommended artifact path:

- `.agents/skills/qa-plan-evolution/docs/fix/qa-plan-evolution-runtime-qa-scenarios.md`

Required QA scenarios:

1. start a fresh run and confirm canonical run-root creation
2. hit a blocked evidence-refresh state and confirm `next_action` / blocking reason are visible
3. resume a run after async prerequisite completion and confirm re-entry happens once
4. simulate an expired async job and confirm operator-facing status changes to expired / blocked
5. accept an iteration and confirm awaiting-approval state is visible before finalize
6. reject an iteration and confirm candidate snapshot is restored to champion baseline
7. finalize an accepted iteration and confirm summary, archive, and promotion metadata are coherent
8. verify markdown-only defect evidence cannot drive promotion-grade shared rubric mutation

## Documentation Changes

### Shared evolution skill

1. update `SKILL.md`, `README.md`, and `reference.md` to make canonical runtime root and async resume behavior explicit
2. add this fix plan to the related docs section
3. align `SIMPLIFIED_EVOLUTION_MODEL.md` with the new generalization guard so manual evolution still produces reusable rules

### Examples and operator docs

1. refresh `QA_PLAN_EVOLUTION_WORKFLOW_AND_EXAMPLE.md` to show canonical run paths and progress inspection
2. remove examples that normalize `/tmp` as the durable run home

## Implementation Checklist

1. Introduce `asyncJobStore.mjs` and `generalizationGuard.mjs`; keep durable state inside `task.json` and `run.json`.
2. Make phase0 always allocate the canonical run home under `.agents/skills/qa-plan-evolution/runs/<run-key>/`.
3. Reconcile `--run-root` so it cannot undermine resume for normal operator usage.
4. Persist async job metadata and completion probes for phase1 and phase4 spawned work.
5. Add orchestration pre-flight reconciliation so completed jobs trigger automatic `--post` re-entry.
6. Expand `task.json` and `run.json` to remember completed work, invalidation, and next action.
7. Require structured, generalized defect observations for promotion-grade mutation planning.
8. Add guardrails that block defect-literal or feature-example-only global mutations.
9. Update tests before landing the refactor so the old behavior cannot creep back.
10. Update docs and examples last, after the new runtime model and generalization contract are implemented.

## Eng Review Notes

This section captures the decisions made during `/plan-eng-review` on 2026-03-25.

### Scope decisions

1. reduce scope from a multi-store state redesign to an expansion of the existing `task.json` / `run.json` model
2. keep only two new helper modules as part of the core refactor:
   - `asyncJobStore.mjs`
   - `generalizationGuard.mjs`
3. do not introduce parallel durable stores such as `runLedger.mjs`, `phaseReceipts.mjs`, or a separate `artifact_index.json`

### Architecture decisions

1. canonical run home under `.agents/skills/qa-plan-evolution/runs/<run-key>/` is the only authoritative state location
2. scratch paths are allowed only as disposable work surfaces; deleting scratch data must not make a run unresumable
3. async completion must use an explicit contract:
   - terminal job states
   - freshness checks
   - success markers
   - timeout / expiry handling
   - retry ownership
4. generalization must use an explicit promotion matrix rather than reviewer intuition
5. shared rubric/template mutations require shared-scope proof; otherwise default to narrower feature-family scope

### Code quality decisions

1. `task.json` owns control-plane state: what should happen next
2. `run.json` owns historical execution state: what already happened
3. job files own per-job async detail only
4. one shared validity vocabulary is required across phases:
   - `fingerprint`
   - `freshness`
   - `completion`
   - `reuse`
   - `invalidated`
5. `check_resume.sh` and `progress.sh` must render the same canonical operator summary contract from `task.json`

### Test decisions

1. regression coverage is mandatory for:
   - stale artifacts incorrectly satisfying completion
   - failed `spawn_results` incorrectly allowing re-entry
   - timed-out jobs never surfacing operator action
   - canonical resume failing after scratch deletion
2. test levels must be explicit:
   - `unit`
   - `phase script integration`
   - `orchestrator integration`
3. async reconciliation and canonical-root behavior must be tested at integration level, not unit-only
4. the plan must require a QA-facing scenario artifact for operator workflow verification

### Performance decisions

1. reconciliation and summary rendering must be bounded and read canonical summary JSON first
2. resume/polling logic must avoid rescanning whole run trees unless fingerprints are missing or invalidated
3. default behavior is manual-trigger reconciliation with only short-lived bounded active polling inside one orchestration attempt

## References

1. `.agents/skills/qa-plan-evolution/SKILL.md`
2. `.agents/skills/qa-plan-evolution/reference.md`
3. `.agents/skills/qa-plan-evolution/scripts/orchestrate.sh`
4. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase0.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase1.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/lib/phases/phase4.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/lib/manifestRunner.mjs`
8. `.agents/skills/qa-plan-evolution/scripts/lib/workflowState.mjs`
9. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/defectsCrossAnalysis.mjs`
10. `.agents/skills/qa-plan-evolution/docs/QA_PLAN_V2_BENCHMARK_INTEGRATION_REMEDIATION_PLAN.md`
