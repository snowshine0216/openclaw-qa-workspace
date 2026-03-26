# QA Plan Evolution — Agent Design

> **Design ID:** `qa-plan-evolution-qa-plan-2026-03-21`
> **Date:** 2026-03-21
> **Status:** Implemented design aligned to the current shared runtime and qa-plan benchmark contract; this document records the qa-plan-specific supplement that must stay synchronized with `.agents/skills/qa-plan-evolution`
> **Scope:** `.agents/skills/qa-plan-evolution`, additive hooks in `workspace-planner/skills/qa-plan-orchestrator`, additive freshness/output hooks in `workspace-reporter/skills/defects-analysis`
>
> **Constraint:** Design artifact and qa-plan supplement; update this file when the benchmark contract changes so it stays aligned with the shared skill docs and `qa-plan-v2`.
>
> **Reviewer Gate:** Keep this document aligned with the shared skill docs, `qa-plan-v2`, and the implemented gap-source pipeline whenever the benchmark contract changes.

---

## 0. Environment Setup

- **Workspace:** This repository (`openclaw-qa-workspace`).
- **Shell tooling:** `bash`, `jq` for inspecting `task.json` and `run.json`.
- **Node.js:** Required for `scripts/lib/*.mjs` and for target-skill eval runners (for example `workspace-planner/skills/qa-plan-orchestrator/evals/run_evals.mjs`).
- **Credentials:** Do not write secrets into repo artifacts. Runs that refresh evidence inherit credential usage from invoked skills (`jira-cli`, `defects-analysis`, and so on) per each skill’s documented env and `TOOLS.md` conventions.
- **skill-creator (host):** Benchmark aggregation may call scripts under `~/.agents/skills/skill-creator/`; that path is outside the repo and varies by machine.

No additional global setup beyond standard OpenClaw workspace tooling and target-skill eval dependencies.

## 1. Design Deliverables

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.agents/skills/qa-plan-evolution/SKILL.md` | Via `skill-creator` — **Done** |
| CREATE | `.agents/skills/qa-plan-evolution/reference.md` | Runtime state, scoring, gates — **Done** |
| CREATE | `.agents/skills/qa-plan-evolution/README.md` | Operator overview — **Done** |
| CREATE | `.agents/skills/qa-plan-evolution/scripts/` | `phase0.sh`–`phase6.sh`, `lib/`, `scripts/test/` — **Done** |
| CREATE | `.agents/skills/qa-plan-evolution/evals/evals.json` | Benchmark profiles — **Done** |
| ~~CREATE~~ | ~~`workspace-planner/.agents/workflows/qa-plan-orchestrator-skill-evolution.md`~~ | **Superseded:** operator entry is only `.agents/skills/qa-plan-evolution/SKILL.md` (no separate planner workflow file). |
| UPDATE | `AGENTS.md` (repo root) | SOP pointer for skill evolution — **Done** |
| UPDATE | `workspace-planner/AGENTS.md` | Planner evolution + knowledge packs — **Done** |
| UPDATE | `workspace-planner/skills/qa-plan-orchestrator/` | Per Functional Design 5 — implemented; docs must stay aligned with `qa-plan-v2` |
| UPDATE | `workspace-reporter/skills/defects-analysis/` | Per Functional Design 6 — implemented; gap bundle and freshness hooks are live |

## 2. AGENTS.md Sync

- **Root `AGENTS.md`:** Add `qa-plan-evolution` as the canonical entry for skill self-improvement; include the skill path under `.agents/skills/qa-plan-evolution/`.
- **`workspace-planner/AGENTS.md`:** State that planner-side **qa-plan** skill evolution uses the shared skill `.agents/skills/qa-plan-evolution/` (this design doc is the qa-plan supplement); state that `knowledge-packs/` under `qa-plan-orchestrator` are mandatory coverage inputs when present for the feature family.

## Overview

The current `qa-plan-orchestrator` produces structurally valid QA plans, but the BCIN-7289 retrospective shows a repeatable failure mode: the plan can pass current contract checks and still miss concrete defect-exposing scenarios, cross-state interactions, developer self-test guidance, and feature-specific historical risks.

This design introduces a reusable self-improvement workflow named `qa-plan-evolution`. Its job is to evolve one target skill at a time using a champion-vs-challenger loop modeled after the useful parts of Karpathy's `autoresearch` pattern:

1. Freeze a benchmark set.
2. Refresh missing or stale evidence.
3. Generate bounded improvement hypotheses.
4. Apply one candidate mutation per iteration.
5. Run smoke tests and evals.
6. Compare challenger to champion.
7. Keep only non-regressing improvements.
8. Repeat up to a hard cap of 10 iterations.

The first target is `workspace-planner/skills/qa-plan-orchestrator`. The design also standardizes:

1. Defect-analysis freshness checks before evolution begins.
2. Gap analysis outputs that explain:
   - why self-testing missed issues
   - where the QA plan was incomplete
   - where the plan existed but was not actionable or traceable
3. Feature knowledge packs so feature-family-specific coverage is not re-discovered from scratch each run.
4. Replay-style evals based on known defect sets so improvements are judged by defect recall, not just formatting compliance.

The result is a repeatable SOP for evolving `qa-plan-orchestrator` now and other skills later without uncontrolled rewrites.

## Architecture

### Workflow chart (generic — all target skills)

`qa-plan-evolution` is **profile-driven**: Phase 1–2 and 4–5 only load optional evidence sources, gap sources, and scoring dimensions that the selected **benchmark profile** declares. Steps such as `defects-analysis` refresh, defect replay, or knowledge-pack deltas are **not** universal; they apply only when the profile enables them (for example `qa-plan-defect-recall`). Generic skills with `generic-skill-regression` typically run: inspect target artifacts → build benchmark catalog → gap taxonomy from eval failures and contracts → smoke + contract evals → score regression only.

```text
User request
  -> Phase 0: classify target skill, run REPORT_STATE, load champion baseline, lock max_iterations<=10
  -> Phase 1: refresh evidence (benchmark_profile-driven)
       -> inspect target-skill artifacts and eval manifest
       -> refresh optional upstream evidence per profile (manifests list what is required)
       -> build benchmark catalog and frozen eval set reference
  -> Phase 2: derive gap taxonomy and bounded mutation hypotheses (profile-driven)
       -> classify misses using sources and buckets enabled for this profile
  -> Phase 3: prepare one challenger iteration
       -> choose one hypothesis
       -> candidate patch plan (+ optional pack deltas only when profile includes packs)
  -> Phase 4: execute validation
       -> target skill smoke tests
       -> target skill evals
       -> optional extra eval buckets per profile (e.g. replay, holdout)
  -> Phase 5: score challenger vs champion
       -> regression gate (always)
       -> primary metrics per benchmark_profile (not fixed to “defect recall”)
  -> Phase 6: accept/reject challenger, archive learning, route next step
       -> if accepted and iteration < max and open gaps remain -> return phase2
       -> else finalize
```

### Workflow extension (qa-plan-orchestrator only)

When the target is `qa-plan-orchestrator` and the orchestrator profile is one of `qa-plan-defect-recall`, `qa-plan-knowledge-pack-coverage`, or similar, the **same phase numbers** apply but the shared orchestrator uses a **qa-plan evidence adapter** plus profile-declared gap sources. Phase 1 may refresh `defects-analysis` runs and check knowledge-pack versions; Phase 2 resolves adapter-backed `gap_sources` such as `defects_cross_analysis` and `knowledge_pack_coverage`; Phase 4 runs qa-plan benchmark comparison with replay enabled only when `defect_analysis_run_key` is present; Phase 5 scores against the canonical `qa-plan-v2` outputs that the profile and benchmark mode produced.

```text
(Extends generic chart — same Phase 0–6 shell)

Phase 1 additions:
  -> regenerate or refresh workspace-reporter defects-analysis when stale/missing and profile requires it
  -> verify feature knowledge-pack paths and versions referenced by the benchmark fixtures

Phase 2 additions:
  -> resolve profile-declared gap sources
  -> normalize `GapObservation` records from defects cross-analysis, replay misses, and knowledge-pack coverage inputs
  -> build one bounded mutation backlog entry per hypothesis cluster

Phase 3 additions:
  -> knowledge-pack delta files when mutation targets coverage rules

Phase 4 additions:
  -> defect replay evals against frozen defect sets
  -> holdout regression evals when manifest includes them

Phase 5 additions:
  -> defect recall vs champion, contract compliance, knowledge-pack coverage (when scoring groups include them)
```

### Operator entry (qa-plan target)

**Purpose:** Keep the shared skill generic while documenting how planners evolve `qa-plan-orchestrator`.

**Canonical entry:** `.agents/skills/qa-plan-evolution/SKILL.md` and `reference.md`, plus this file and [qa-plan-benchmark-spec.md](../references/qa-plan-benchmark-spec.md). There is no separate planner workflow file under `workspace-planner/.agents/workflows/`.

**Operator outline:**

1. Preconditions: feature id / family, `benchmark_version`, knowledge-pack key when applicable.
2. Set inputs:
   - orchestrator `benchmark_profile` → usually `qa-plan-knowledge-pack-coverage` for blind/holdout-only iterations or `qa-plan-defect-recall` when replay evidence is intentionally enabled
   - `target_skill_path` → `workspace-planner/skills/qa-plan-orchestrator`
   - qa-plan benchmark definition root → `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/`
   - qa-plan benchmark archive root → `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/archive/`
   - qa-plan benchmark runtime root → `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/qa-plan-v2/`
   - qa-plan-v2 benchmark manifest profile → `global-cross-feature-v1`
   - enable replay only when `defect_analysis_run_key` is present
3. Invoke `qa-plan-evolution` scripts only (`scripts/orchestrate.sh`); no parallel NLG playbook.
4. Point to benchmark runtime root under `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/<benchmark-version>/` (for example `qa-plan-v2/`). Frozen baselines live under the archive root in the source tree.
5. User approval and Feishu steps consistent with Phase 6 in this design.

The shared `SKILL.md` lists qa-plan-specific files to read; planner defaults (profiles, benchmark paths) live in this design doc and `README.md` under the shared skill.

State transitions:

| From | Event | To |
|------|-------|----|
| `FRESH` | first run initialized | `iteration_1_ready` |
| `DRAFT_EXISTS` | resume selected | `current_iteration_ready` |
| `CONTEXT_ONLY` | generate-from-cache selected | `evidence_ready` |
| `evidence_ready` | gap taxonomy complete | `hypothesis_ready` |
| `hypothesis_ready` | challenger prepared | `validation_ready` |
| `validation_ready` | all blocking checks pass | `scoring_ready` |
| `validation_ready` | blocking regression found | `iteration_rejected` |
| `scoring_ready` | challenger improves and no regression | `iteration_accepted` |
| `scoring_ready` | challenger not better or regresses | `iteration_rejected` |
| `iteration_accepted` | gaps remain and iteration < max | `evidence_ready` |
| `iteration_accepted` | no blocking gaps or iteration=max | `completed` |
| `iteration_rejected` | iteration < max | `hypothesis_ready` |
| any | unrecoverable error | `blocked` |

### Folder structure

```text
.agents/skills/qa-plan-evolution/
  SKILL.md
  reference.md
  README.md
  scripts/
    orchestrate.sh
    check_runtime_env.sh
    check_resume.sh
    phase0.sh
    phase1.sh
    phase2.sh
    phase3.sh
    phase4.sh
    phase5.sh
    phase6.sh
    lib/
      workflowState.mjs
      evidenceFreshness.mjs
      evidence/
        adapters/qa-plan.mjs
      benchmarkCatalog.mjs
      gapSources/
        index.mjs
        targetEvalFailures.mjs
        contractDrift.mjs
        smokeRegressions.mjs
        replayEvalMisses.mjs
        knowledgePackCoverage.mjs
        defectsCrossAnalysis.mjs
      gapTaxonomy.mjs
      loadProfile.mjs
      manifestRunner.mjs
      mutationBacklog.mjs
      mutationPlanner.mjs
      runTargetValidation.mjs
      scoreCandidate.mjs
      knowledgePackIndex.mjs
      artifactCatalog.mjs
      snapshot.mjs
  scripts/test/
  evals/
  benchmarks/
    <family>/
      archive/          # Frozen baselines (versioned, read-only)

workspace-artifacts/skills/shared/qa-plan-evolution/
  runs/<run-key>/
    context/
    drafts/
    candidates/
      iteration-1/
      iteration-2/
    archive/
    benchmarks/
    task.json
    run.json
    phase1_spawn_manifest.json
    evolution_final.md
  benchmarks/
    <family>/           # Active iterations (gitignored)

workspace-planner/skills/qa-plan-orchestrator/
  knowledge-packs/
    report-editor/
      pack.md
      pack.json
  references/
    phase4a-contract.md
    review-rubric-phase5a.md
    review-rubric-phase5b.md
  scripts/
    phase7.sh
    lib/finalPlanSummary.mjs
  evals/
    evals.json

workspace-reporter/skills/defects-analysis/
  scripts/
    phase0.sh
    phase5.sh
  reference.md
```

Design placement:

1. `qa-plan-evolution` is shared because the SOP should work for multiple skills.
2. `qa-plan-orchestrator` knowledge packs stay workspace-local because they are planner-domain artifacts and should evolve with planner contracts.
3. `defects-analysis` remains reporter-local; only freshness and output contracts are extended.

### Benchmark layout: definition, archive, and runtime roots

Per the workspace artifact root convention (`docs/WORKSPACE_ARTIFACT_ROOT_CONVENTION.md`):

- **Benchmark definition root (`qa-plan-orchestrator`):** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/<benchmark-version>/` — manifests, case definitions, grading rubrics (source-owned, versioned).
- **Benchmark archive root:** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/<benchmark-version>/archive/` — frozen baseline snapshots promoted from runtime (versioned, read-only).
- **Benchmark runtime root:** `workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/benchmarks/<benchmark-version>/` — active `iteration-*`, `candidate_snapshot/`, `champion_snapshot/`, scorecards, and `skill-creator` aggregates (gitignored, ephemeral).
- **Per-run operational tree:** `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/benchmarks/` — working artifacts (`scoreboard_<run-key>.json`, `benchmark_catalog_<run-key>.json`, and related files) for idempotency and resume.
- **Consistency rule:** For target `qa-plan-orchestrator`, Phases 4–6 **must** publish iteration results into the benchmark runtime root so `aggregate_benchmark.py` and the eval viewer consume the same layout as the benchmark spec. The evolution run directory remains the workflow root for `REPORT_STATE` and task state; the qa-plan benchmark runtime tree is the authoritative record for champion versus candidate comparisons.
- **Legacy compatibility:** When both canonical artifact-root state and legacy in-skill state exist, the canonical artifact-root state silently wins.

### Target skill profile (generalization)

| Hook | Required | Notes |
|------|------------|-------|
| `target_skill_path` | yes | Repo path to the target skill |
| Smoke test entrypoint | yes | Script or package target defined by the skill |
| Eval manifest | yes | For example `evals/evals.json` |
| `benchmark_profile` | yes | Includes `generic-skill-regression` for skills without defect replay |
| Defect / reporter evidence | optional | `defects-analysis` when policy requires it |
| Knowledge packs | optional | Skill-local packs when domain requires them |

Gap taxonomy buckets apply fully to QA-plan profiles; other skills use a subset or profile-specific mappings **without** changing the phase structure.

**Implementation note:** Encode QA-plan-specific Phase 1–2 and 4–5 behavior in `benchmark_profile` manifests and small adapter modules (for example `evidence/adapters/qa-plan.mjs`) rather than hard-coding `qa-plan-orchestrator` in every phase script.

### Gap-source model

Each orchestrator `benchmark_profile` declares `gap_sources`. A gap source is an adapter-backed evidence input that can produce normalized findings for Phase 2.

Shared orchestrator responsibilities:

1. resolve enabled `gap_sources`
2. invoke the corresponding adapter
3. collect `GapObservation[]`
4. map observations into shared taxonomy buckets
5. create bounded mutation backlog entries

Target-skill responsibilities:

1. provide source artifacts that adapters can read
2. keep source-specific parsing in adapter modules
3. keep target-specific file targeting and eval mapping reviewable in artifacts

Example profile-to-source mapping:

| Orchestrator profile | Gap sources |
|---|---|
| `generic-skill-regression` | `target_eval_failures`, `contract_drift`, `smoke_regressions` |
| `qa-plan-defect-recall` | `target_eval_failures`, `replay_eval_misses`, `defects_cross_analysis`, `knowledge_pack_coverage` |
| `qa-plan-knowledge-pack-coverage` | `target_eval_failures`, `knowledge_pack_coverage`, `contract_drift` |

### Workflow phases — user interaction and notifications

#### Per-phase interaction (Done / Blocked / Questions / Assumption)

| Phase | Done | Blocked | Questions | Assumption policy |
|-------|------|---------|-----------|-------------------|
| 0 | `REPORT_STATE` classified; `task.json` / `run.json` initialized | invalid inputs or missing run root | when `FINAL_EXISTS` / `DRAFT_EXISTS` / `CONTEXT_ONLY` — user selects resume, smart refresh, or full regenerate | never auto-select destructive options; stop if intent is ambiguous |
| 1 | Evidence freshness and benchmark catalog written | required prerequisite stale or missing | optional confirm when spawning sub-workflows from manifest | record documented assumptions in `evidence_freshness_<run-key>.md` |
| 2 | Gap taxonomy and mutation backlog written | insufficient evidence to classify gaps | — | one bounded hypothesis per backlog item |
| 3 | Exactly one mutation selected; candidate plan written | — | optional approval if scope crosses multiple skills | single mutation per iteration |
| 4 | Validation report for challenger | blocking smoke or eval failure | — | fail-fast; no silent skips |
| 5 | `score.json` and `decision.md` written | — | — | reject on regression per acceptance rules |
| 6 | `evolution_final.md`; champion archive updated | — | explicit user approval before treating repo edits as promoted | stop after max iterations or three consecutive rejections |

#### Finalization and Feishu notification

- **When:** Phase 6 completes successfully and `evolution_final.md` is written (after any required user approval).
- **Action:** Invoke shared `feishu-notify` with the run key, path to `evolution_final.md`, and target skill identity (per workspace `TOOLS.md` chat routing).
- **Failure:** If Feishu send fails, persist the full payload and error to `run.json.notification_pending`. Do not roll back finalized artifacts; operators retry or send manually from the pending payload.
- **Verification command:**

```bash
jq '.notification_pending' "workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/run.json"
# Expect null or false after a successful send; non-null object indicates pending manual notification
```

## Skills Content Specification

### 3.1 `.agents/skills/qa-plan-evolution/SKILL.md`

```md
---
name: qa-plan-evolution
description: Evolves an existing skill through a bounded champion-vs-challenger loop. Use whenever the user asks to improve a skill, reduce misses or blind spots in a skill output, compare known defects to generated outputs, add feature-specific knowledge packs, or run repeatable eval-safe skill improvement with a maximum iteration cap.
---

# QA Plan Evolution

This skill is the canonical entrypoint for repeatable skill self-improvement in OpenClaw workspaces.

The orchestrator has exactly three responsibilities:

1. Call `phaseN.sh`
2. Interact with the user only for `REPORT_STATE` choices or final approval decisions
3. When any phase prints `SPAWN_MANIFEST: <path>`, spawn from that manifest, wait, then rerun the same phase with `--post`

The orchestrator does not perform evolution logic inline. It does not score candidates manually, rewrite target files inline, or skip validations. All logic must live in scripts and persisted artifacts.

## Required References

Always read:

- `reference.md`

When the target skill is `qa-plan-orchestrator`, also read:

- `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
- `workspace-planner/skills/qa-plan-orchestrator/reference.md`
- `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
- `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`
- `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`
- `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`

When defect evidence is part of the benchmark, also read:

- `workspace-reporter/skills/defects-analysis/SKILL.md`
- `workspace-reporter/skills/defects-analysis/reference.md`

## Runtime Layout

All artifacts for one evolution run live under `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/`:

```text
workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/
  context/
  drafts/
  candidates/
    iteration-1/
  benchmarks/
  archive/
  task.json
  run.json
  phase1_spawn_manifest.json
  evolution_final.md
```

## Input Contract

Required inputs:

- `target_skill_path`
- `target_skill_name`

Optional inputs:

- `feature_id`
- `feature_family`
- `knowledge_pack_key`
- `max_iterations` (default `10`, hard cap `10`)
- `refresh_mode`
- `defect_analysis_run_key`
- `benchmark_profile`

## Output Contract

Always:

- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/task.json`
- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/run.json`
- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/context/evidence_freshness_<run-key>.md`
- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/context/gap_taxonomy_<run-key>.md`
- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/context/mutation_backlog_<run-key>.md`
- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/benchmarks/scoreboard_<run-key>.json`
- `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/evolution_final.md`

Per iteration:

- `candidates/iteration-<n>/candidate_plan.md`
- `candidates/iteration-<n>/candidate_patch_summary.md`
- `candidates/iteration-<n>/validation_report.md`
- `candidates/iteration-<n>/score.json`
- `candidates/iteration-<n>/decision.md`

## Phase Contract

### Phase 0

- initialize runtime state
- run `REPORT_STATE`
- normalize inputs
- lock `max_iterations`
- detect target-skill family

### Phase 1

- inspect evidence freshness
- regenerate missing or stale evidence
- require defect-analysis artifacts when benchmark policy says they are mandatory

### Phase 2

- create gap taxonomy
- classify misses into reusable root-cause buckets
- create bounded mutation hypotheses

### Phase 3

- select one hypothesis for the current challenger
- prepare candidate patch plan
- update feature knowledge-pack deltas when required

### Phase 4

- run target skill smoke tests
- run target skill evals
- run qa-plan benchmark comparison
- include replay cases only when `defect_analysis_run_key` is present

### Phase 5

- score challenger vs champion
- reject on any blocking regression
- persist acceptance or rejection decision

### Phase 6

- archive accepted candidate as new champion
- stop when no blocking gaps remain or max iterations is reached
- emit final summary and next-step guidance

## Evolution Rules

1. Do not mutate more than one bounded hypothesis per iteration.
2. Do not accept a challenger that regresses blocking evals or smoke tests.
3. Do not exceed `10` iterations.
4. When defect-analysis evidence is stale, refresh it before proposing skill changes.
5. Feature knowledge-pack requirements must map to concrete scenarios, gates, or explicit exclusions.
6. Preserve target-skill idempotency semantics and runtime state contracts unless the iteration explicitly benchmarks a contract change.
```

### 4.1 `.agents/skills/qa-plan-evolution/reference.md`

```md
# QA Plan Evolution — Reference

## Ownership

- `SKILL.md` defines when the skill triggers and what it orchestrates
- `reference.md` defines runtime state, artifact naming, scoring, iteration rules, and target-skill safety gates

## Runtime Root Convention

All per-run artifacts live under:

```text
workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/
```

### Run-Root Artifact Families

- `context/` — freshness checks, gap taxonomy, mutation backlog, evidence index
- `drafts/` — proposed design deltas or mutation notes
- `candidates/iteration-<n>/` — per-iteration challenger outputs
- `benchmarks/` — benchmark profile, eval manifests, scoreboard
- `archive/` — archived champion snapshots and prior finals
- `task.json`, `run.json`

## Runtime State

### `REPORT_STATE`

| Value | Meaning | User interaction |
|---|---|---|
| `FINAL_EXISTS` | `evolution_final.md` already exists | user chooses use_existing / smart_refresh / full_regenerate |
| `DRAFT_EXISTS` | one or more iteration artifacts exist | user chooses resume / smart_refresh / full_regenerate |
| `CONTEXT_ONLY` | freshness and backlog exist but no completed iteration | user chooses generate_from_cache / smart_refresh / full_regenerate |
| `FRESH` | no prior artifacts exist | continue without prompt |

### `task.json`

Required fields:

- `run_key`
- `target_skill_name`
- `target_skill_path`
- `overall_status`
- `current_phase`
- `report_state`
- `feature_id`
- `feature_family`
- `knowledge_pack_key`
- `benchmark_profile`
- `current_iteration`
- `max_iterations`
- `accepted_iteration`
- `champion_snapshot_path`
- `created_at`
- `updated_at`

Allowed `overall_status` values:

- `not_started`
- `in_progress`
- `blocked`
- `awaiting_approval`
- `completed`

### `run.json`

Required fields:

- `run_key`
- `started_at`
- `updated_at`
- `freshness_checked_at`
- `gap_taxonomy_generated_at`
- `benchmark_catalog_generated_at`
- `latest_validation_completed_at`
- `latest_score_completed_at`
- `finalized_at`
- `notification_pending`
- `accepted_iteration`
- `rejected_iterations`
- `iteration_history`
- `blocking_issues`

## Evidence Freshness Rules

Evidence is stale when any required input changed after the evidence artifact timestamp:

1. Jira defect set changed
2. linked PR set changed
3. target skill final output changed
4. target-skill eval catalog changed
5. referenced knowledge pack changed

When stale evidence is detected and the benchmark profile marks it `required`, Phase 1 must refresh before Phase 2 may continue.

## Benchmark Policy

Every run must build a benchmark catalog with these buckets:

1. `smoke_checks`
2. `contract_evals`
3. `defect_replay_evals`
4. `knowledge_pack_coverage_evals`
5. `regression_evals`

Blocking acceptance rule:

- all blocking smoke checks pass
- all blocking eval groups pass
- challenger `defect_recall_score >= champion`
- challenger `regression_count == 0`

## Gap Taxonomy Contract

`gap_taxonomy_<run-key>.md` must classify misses into one or more of:

- `missing_scenario`
- `scenario_too_shallow`
- `analog_risk_not_gated`
- `interaction_gap`
- `sdk_or_api_visible_contract_dropped`
- `developer_artifact_missing`
- `traceability_gap`
- `knowledge_pack_gap`

No mutation hypothesis may be proposed without at least one explicit taxonomy mapping.

## Mutation Hypothesis Contract

Each mutation in `mutation_backlog_<run-key>.md` must contain:

- `mutation_id`
- `root_cause_bucket`
- `target_files`
- `expected_gain`
- `regression_risk`
- `evals_affected`
- `knowledge_pack_delta`
- `status`

Only one mutation may be `selected_for_iteration` at a time.

## Acceptance and Stop Rules

Stop when any of these are true:

1. `current_iteration == max_iterations`
2. no blocking gaps remain
3. `3` consecutive rejected iterations occur
4. user stops the run explicitly

When finalizing, write:

- `evolution_final.md`
- `benchmarks/scoreboard_<run-key>.json`
- `context/accepted_mutations_<run-key>.md`
- `context/rejected_mutations_<run-key>.md`

## Target-Skill Safety Rules

1. Preserve the target skill's `REPORT_STATE` semantics unless the change is explicitly benchmarked.
2. Preserve the target skill's runtime output location under `workspace-artifacts/skills/<workspace>/<skill>/runs/<run-key>/`.
3. Do not accept challenger changes that weaken existing validators without stronger replacement checks.
4. Knowledge packs must remain reviewable text or JSON artifacts in the target skill tree; do not make hidden or opaque retrieval mandatory.
```

## Data Models

### `qa-plan-evolution/task.json`

```json
{
  "run_key": "qa-plan-orchestrator__BCIN-7289__2026-03-21T10-00-00Z",
  "target_skill_name": "qa-plan-orchestrator",
  "target_skill_path": "workspace-planner/skills/qa-plan-orchestrator",
  "overall_status": "in_progress",
  "current_phase": "phase2",
  "report_state": "FRESH",
  "feature_id": "BCIN-7289",
  "feature_family": "report-editor",
  "knowledge_pack_key": "report-editor",
  "defect_analysis_run_key": "BCIN-7289",
  "benchmark_profile": "qa-plan-defect-recall",
  "current_iteration": 1,
  "max_iterations": 10,
  "accepted_iteration": null,
  "champion_snapshot_path": "workspace-artifacts/skills/shared/qa-plan-evolution/runs/.../archive/champion-initial",
  "created_at": "2026-03-21T10:00:00Z",
  "updated_at": "2026-03-21T10:10:00Z"
}
```

### `qa-plan-evolution/run.json`

```json
{
  "run_key": "qa-plan-orchestrator__BCIN-7289__2026-03-21T10-00-00Z",
  "started_at": "2026-03-21T10:00:00Z",
  "updated_at": "2026-03-21T10:10:00Z",
  "freshness_checked_at": "2026-03-21T10:03:00Z",
  "gap_taxonomy_generated_at": "2026-03-21T10:07:00Z",
  "benchmark_catalog_generated_at": "2026-03-21T10:04:00Z",
  "latest_validation_completed_at": null,
  "latest_score_completed_at": null,
  "finalized_at": null,
  "notification_pending": false,
  "accepted_iteration": null,
  "rejected_iterations": [],
  "iteration_history": [],
  "blocking_issues": []
}
```

### `qa-plan-orchestrator/knowledge-packs/report-editor/pack.json`

```json
{
  "pack_key": "report-editor",
  "version": "2026-03-21",
  "required_capabilities": [
    "template-based creation",
    "save override",
    "prompt execution",
    "report builder interaction",
    "window title correctness",
    "i18n dialogs"
  ],
  "analog_gates": [
    {
      "source_issue": "DE332260",
      "behavior": "folder visibility refresh after save",
      "required_gate": true
    },
    {
      "source_issue": "DE331555",
      "behavior": "save dialog completeness and interactivity",
      "required_gate": true
    }
  ],
  "sdk_visible_contracts": [
    "setWindowTitle",
    "errorHandler"
  ],
  "interaction_pairs": [
    ["template-based creation", "pause-mode prompts"],
    ["close-confirmation", "prompt editor open"]
  ]
}
```

## Functional Design 1

### Goal

Create a canonical evolution workflow that preserves OpenClaw idempotency while forcing evidence refresh and benchmark-driven acceptance.

### Required Change for Phase 0

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase0.sh`

**Script Purpose:** Initialize the evolution run, preserve `REPORT_STATE`, normalize inputs, and enforce `max_iterations <= 10`.

**Script Inputs:**

- `run_key`
- `target_skill_path`
- `target_skill_name`
- optional `feature_id`
- optional `feature_family`
- optional `knowledge_pack_key`
- optional `max_iterations`

**Script Outputs:**

- `task.json`
- `run.json`
- `context/runtime_setup_<run-key>.md`
- `context/runtime_setup_<run-key>.json`

**Script User Interaction:**

- prompt only when `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`

**Detailed Implementation:**

1. Resolve run root under `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/`.
2. Detect `REPORT_STATE` from prior artifacts.
3. Reject `max_iterations > 10`.
4. Snapshot current target skill into `archive/champion-initial/` when starting fresh.
5. Persist normalized input state to `task.json` and `run.json`.

### Required Change for Phase 1

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase1.sh`

**Script Purpose:** Build an evidence catalog and refresh missing or stale prerequisites before mutation planning starts.

**Script Inputs:**

- `task.json`
- target skill contracts and eval files
- optional defect-analysis run root
- optional knowledge pack path

**Script Outputs:**

- `context/evidence_freshness_<run-key>.md`
- `context/evidence_freshness_<run-key>.json`
- `context/benchmark_catalog_<run-key>.md`
- `benchmarks/benchmark_catalog_<run-key>.json`
- optional `phase1_spawn_manifest.json`

**Script User Interaction:**

- none by default

**Detailed Implementation:**

1. Compare timestamps and content hashes for:
   - target skill `SKILL.md`
   - target skill `reference.md`
   - target skill eval catalog
   - referenced knowledge pack
   - defect-analysis artifacts
2. When defect-analysis is stale and required, emit a spawn manifest that reruns `workspace-reporter/skills/defects-analysis`.
3. Mark each prerequisite `fresh`, `stale`, `missing`, or `optional`.
4. Block Phase 2 while any required prerequisite remains `stale` or `missing`.

## Functional Design 2

### Goal

Derive the gap taxonomy and mutation backlog from profile-declared evidence sources instead of placeholder heuristics or inline target-specific parsing.

### Required Change for Phase 2

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase2.sh`

**Primary implementation module:** `.agents/skills/qa-plan-evolution/scripts/lib/mutationBacklog.mjs`

**New support modules:**

1. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/index.mjs`
2. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/targetEvalFailures.mjs`
3. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/contractDrift.mjs`
4. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/smokeRegressions.mjs`
5. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/replayEvalMisses.mjs`
6. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/knowledgePackCoverage.mjs`
7. `.agents/skills/qa-plan-evolution/scripts/lib/gapSources/defectsCrossAnalysis.mjs`
8. `.agents/skills/qa-plan-evolution/scripts/lib/gapTaxonomy.mjs`

**Script Purpose:** Build the gap taxonomy and mutation backlog from normalized evidence observations selected by the orchestrator `benchmark_profile`.

**Script Inputs:**

- selected orchestrator profile from `.agents/skills/qa-plan-evolution/evals/evals.json`
- fresh target-skill artifacts and contracts
- benchmark catalog
- profile-selected evidence sources such as defects-analysis outputs, replay eval misses, and knowledge-pack coverage inputs

**Script Outputs:**

- `context/gap_taxonomy_<run-key>.md`
- `context/gap_taxonomy_<run-key>.json`
- `context/mutation_backlog_<run-key>.md`
- `context/mutation_backlog_<run-key>.json`

**Script User Interaction:**

- none

**Detailed Implementation:**

1. Load the selected profile from `.agents/skills/qa-plan-evolution/evals/evals.json`.
2. Resolve `gap_sources` from the profile.
3. Invoke one adapter per enabled source.
4. Require adapter outputs to conform to a normalized `GapObservation` model.
5. Reject Phase 2 when a profile-required source is unresolved and Phase 1 allowed progress only because that source was optional for freshness.
6. Map each observation into one or more shared taxonomy buckets.
7. Cluster related observations into one bounded mutation candidate per hypothesis.
8. Reject any mutation candidate that:
   - has no source observations
   - has empty `target_files`
   - has empty `evals_affected`
   - mixes multiple root-cause hypotheses

### Required Change for Phase 3

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase3.sh`

**Script Purpose:** Select one mutation for the current challenger iteration and prepare a concrete patch plan.

**Script Inputs:**

- `mutation_backlog_<run-key>.json`
- current iteration number
- benchmark policy

**Script Outputs:**

- `candidates/iteration-<n>/candidate_plan.md`
- `candidates/iteration-<n>/candidate_scope.json`
- `candidates/iteration-<n>/knowledge_pack_delta.md`

**Script User Interaction:**

- optional approval if the candidate touches more than one target skill

**Detailed Implementation:**

1. Choose the highest-value mutation with lowest regression risk.
2. Reject combined multi-hypothesis edits.
3. Produce a patch plan that lists:
   - files to modify
   - files to create
   - tests/evals to add or update
   - knowledge-pack deltas

## Functional Design 3

### Goal

Validate candidate improvements with real target-skill smoke checks and replay-style evals, not only format validators.

### Required Change for Phase 4

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase4.sh`

**Script Purpose:** Execute validation for the current challenger.

**Script Inputs:**

- candidate scope
- target skill tests
- target skill eval harness
- replay fixtures

**Script Outputs:**

- `candidates/iteration-<n>/validation_report.md`
- `candidates/iteration-<n>/validation_report.json`
- `candidates/iteration-<n>/smoke_results.json`
- `candidates/iteration-<n>/eval_results.json`

**Script User Interaction:**

- none

**Detailed Implementation:**

1. Run target skill smoke tests first.
2. Run target skill evals second.
3. Run defect replay evals third.
4. Fail fast on blocking smoke or eval regression.
5. Persist command logs and summarized outcomes.

### Required Change for Phase 5

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase5.sh`

**Script Purpose:** Score challenger vs champion and produce an accept/reject decision.

**Script Inputs:**

- validation outputs
- benchmark catalog
- champion scoreboard

**Script Outputs:**

- `candidates/iteration-<n>/score.json`
- `candidates/iteration-<n>/decision.md`
- `benchmarks/scoreboard_<run-key>.json`

**Script User Interaction:**

- none

**Detailed Implementation:**

1. Compute:
   - `defect_recall_score`
   - `contract_compliance_score`
   - `knowledge_pack_coverage_score`
   - `regression_count`
2. Accept only when:
   - no blocking regression exists
   - defect recall does not decrease
   - at least one meaningful metric improves or a blocking gap is closed
3. Update `run.json.iteration_history`.

## Functional Design 4

### Goal

Finalize the accepted champion, stop at clear boundaries, and make learnings reusable across future runs.

### Required Change for Phase 6

**Script Path:** `.agents/skills/qa-plan-evolution/scripts/phase6.sh`

**Script Purpose:** Archive the accepted candidate, stop or loop, and emit a final evolution summary.

**Script Inputs:**

- latest score and decision
- `run.json`
- current candidate outputs

**Script Outputs:**

- `context/accepted_mutations_<run-key>.md`
- `context/rejected_mutations_<run-key>.md`
- `evolution_final.md`
- archived champion snapshot under `archive/`

**Script User Interaction:**

- explicit approval before finalizing accepted changes into the champion summary artifact

**Detailed Implementation:**

1. If accepted, archive prior champion and mark the iteration as champion.
2. If rejected and iterations remain, route back to Phase 2.
3. Stop early after three consecutive rejected iterations.
4. Summarize:
   - accepted mutations
   - rejected mutations
   - residual gaps
   - next suggested benchmark additions

## Functional Design 5

### Goal

Make `qa-plan-orchestrator` a strong first target for the evolution loop through additive hooks only.

### Required Change for `workspace-planner/skills/qa-plan-orchestrator`

**Files to change:**

1. `workspace-planner/skills/qa-plan-orchestrator/references/phase4a-contract.md`
2. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5a.md`
3. `workspace-planner/skills/qa-plan-orchestrator/references/review-rubric-phase5b.md`
4. `workspace-planner/skills/qa-plan-orchestrator/scripts/phase7.sh`
5. `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs`
6. `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
7. `workspace-planner/skills/qa-plan-orchestrator/README.md`
8. `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.md`
9. `workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json`

**Expected content changes:**

1. `phase4a-contract.md`
   - add mandatory SDK/API visible-outcome scenario generation
   - require knowledge-pack item mapping to scenarios or exclusions
2. `review-rubric-phase5a.md`
   - add cross-section interaction audit
   - add knowledge-pack coverage audit
3. `review-rubric-phase5b.md`
   - promote historical analogs to `[ANALOG-GATE]`
   - require release recommendation to list all analog gates explicitly
4. `phase7.sh` and `finalPlanSummary.mjs`
   - generate `developer_smoke_test_<feature-id>.md`
   - derive rows from P1 plus `[ANALOG-GATE]`
5. `evals/evals.json`
   - add replay eval groups:
     - `defect_recall_replay`
     - `self_test_gap_explanation`
     - `knowledge_pack_coverage`
     - `developer_smoke_generation`
     - `interaction_matrix_coverage`
6. `knowledge-packs/report-editor/*`
   - add required capabilities, analog gates, SDK contracts, interaction pairs

**Validation expectations:**

1. Existing blocking evals stay green.
2. New replay evals fail on current known misses and pass after accepted improvements.
3. Developer smoke output is deterministic and diffable.

## Functional Design 6

### Goal

Make `defects-analysis` a reliable freshness source rather than a one-off manual artifact.

### Required Change for `workspace-reporter/skills/defects-analysis`

**Files to change:**

1. `workspace-reporter/skills/defects-analysis/reference.md`
2. `workspace-reporter/skills/defects-analysis/scripts/phase0.sh`
3. `workspace-reporter/skills/defects-analysis/scripts/phase5.sh`

**Expected content changes:**

1. Add freshness metadata fields to emitted analysis outputs:
   - source issue timestamp
   - PR timestamp
   - upstream QA plan timestamp
   - knowledge-pack version used
2. Add optional output contracts for:
   - self-test gap analysis
   - QA plan cross-analysis
3. Allow evolution runs to request regeneration only when stale.

**Validation expectations:**

1. Existing reporter-local flows remain valid.
2. Freshness metadata is additive only.

## Tests

### Script-to-test stub table

| Script | Test file | Required stub focus |
|---|---|---|
| `.agents/skills/qa-plan-evolution/scripts/phase0.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase0.test.sh` | REPORT_STATE handling, max-iteration cap, champion snapshot initialization |
| `.agents/skills/qa-plan-evolution/scripts/phase1.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase1.test.sh` | freshness detection, stale defect-analysis routing, benchmark catalog generation |
| `.agents/skills/qa-plan-evolution/scripts/phase2.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase2.test.sh` | gap taxonomy generation, mutation backlog integrity |
| `.agents/skills/qa-plan-evolution/scripts/phase3.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase3.test.sh` | single-mutation selection, knowledge-pack delta generation |
| `.agents/skills/qa-plan-evolution/scripts/phase4.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase4.test.sh` | smoke/eval ordering, fail-fast regression behavior |
| `.agents/skills/qa-plan-evolution/scripts/phase5.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase5.test.sh` | challenger scoring, acceptance gate, regression rejection |
| `.agents/skills/qa-plan-evolution/scripts/phase6.sh` | `.agents/skills/qa-plan-evolution/scripts/test/phase6.test.sh` | accept/reject routing, stop conditions, final summary generation |
| `.agents/skills/qa-plan-evolution/scripts/lib/evidenceFreshness.mjs` | `.agents/skills/qa-plan-evolution/scripts/test/evidenceFreshness.test.mjs` | timestamp/hash freshness rules |
| `.agents/skills/qa-plan-evolution/scripts/lib/scoreCandidate.mjs` | `.agents/skills/qa-plan-evolution/scripts/test/scoreCandidate.test.mjs` | defect recall and regression scoring math |
| `workspace-planner/skills/qa-plan-orchestrator/scripts/lib/finalPlanSummary.mjs` | `workspace-planner/skills/qa-plan-orchestrator/scripts/test/finalPlanSummary.test.mjs` | developer smoke generation from P1 and analog gates |

### Per-test-file detailed stubs

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase0.test.sh
test_phase0_rejects_iteration_cap_over_ten() {
  local run_dir="/tmp/skill-evolution-phase0-cap"
  mkdir -p "$run_dir"
  run_script_expect_failure ".agents/skills/qa-plan-evolution/scripts/phase0.sh" \
    "RUN-1" "$run_dir" "workspace-planner/skills/qa-plan-orchestrator" "qa-plan-orchestrator" "BCIN-7289" "report-editor" "report-editor" "11"
  assert_output_contains "max_iterations"
}

test_phase0_initializes_champion_snapshot_for_fresh_run() {
  local run_dir="/tmp/skill-evolution-phase0-fresh"
  mkdir -p "$run_dir"
  run_script_expect_success ".agents/skills/qa-plan-evolution/scripts/phase0.sh" \
    "RUN-2" "$run_dir" "workspace-planner/skills/qa-plan-orchestrator" "qa-plan-orchestrator"
  assert_file_exists "$run_dir/archive/champion-initial"
  assert_json_value "$run_dir/task.json" "report_state" "FRESH"
}
```

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase1.test.sh
test_phase1_marks_defect_analysis_stale_when_qa_plan_is_newer() {
  local run_dir="/tmp/skill-evolution-phase1-stale"
  arrange_stale_defect_analysis_fixture "$run_dir"
  run_script_expect_success ".agents/skills/qa-plan-evolution/scripts/phase1.sh" "RUN-3" "$run_dir"
  assert_output_contains "SPAWN_MANIFEST:"
  assert_json_value "$run_dir/context/evidence_freshness_RUN-3.json" "required_items.defect_analysis.status" "stale"
}

test_phase1_builds_benchmark_catalog_with_replay_bucket() {
  local run_dir="/tmp/skill-evolution-phase1-bench"
  arrange_benchmark_fixture "$run_dir"
  run_script_expect_success ".agents/skills/qa-plan-evolution/scripts/phase1.sh" "RUN-4" "$run_dir"
  assert_json_array_contains "$run_dir/benchmarks/benchmark_catalog_RUN-4.json" "buckets" "defect_replay_evals"
}
```

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase2.test.sh
test_phase2_generates_gap_taxonomy_from_cross_analysis() {
  const runDir = '/tmp/skill-evolution-phase2-taxonomy';
  const result = runPhase2Fixture(runDir, 'BCIN-7289');
  assert.equal(result.exitCode, 0);
  assert.match(readFileSync(`${runDir}/context/gap_taxonomy_RUN-5.md`, 'utf8'), /missing_scenario/);
}

test_phase2_rejects_mutation_without_target_files() {
  const backlog = buildMutationBacklog([{ mutation_id: 'M-1', target_files: [] }]);
  assert.throws(() => validateMutationBacklog(backlog), /target_files/);
}
```

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase3.test.sh
test('selects exactly one mutation for the challenger iteration', () => {
  const runDir = '/tmp/skill-evolution-phase3-select';
  const result = runPhase3Fixture(runDir, { selectedCount: 1 });
  assert.equal(result.selectedMutationCount, 1);
  assert.ok(result.candidatePlanPath.endsWith('candidate_plan.md'));
});

test('writes knowledge-pack delta when the mutation touches feature coverage rules', () => {
  const runDir = '/tmp/skill-evolution-phase3-pack';
  runPhase3Fixture(runDir, { mutationType: 'knowledge_pack_gap' });
  assert.ok(existsSync(`${runDir}/candidates/iteration-1/knowledge_pack_delta.md`));
});
```

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase4.test.sh
test('fails fast when a blocking smoke test regresses', () => {
  const runDir = '/tmp/skill-evolution-phase4-regression';
  const result = runPhase4Fixture(runDir, { smokePass: false });
  assert.equal(result.status, 'failed');
  assert.equal(result.evalsStarted, false);
});

test('runs replay evals after target smoke and contract evals', () => {
  const runDir = '/tmp/skill-evolution-phase4-order';
  const result = runPhase4Fixture(runDir, { smokePass: true, evalPass: true });
  assert.deepEqual(result.executionOrder, ['smoke', 'contract_evals', 'defect_replay_evals']);
});
```

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase5.test.sh
test('rejects challenger when defect recall drops below champion', () => {
  const score = scoreCandidate({ championRecall: 0.82, challengerRecall: 0.76, regressionCount: 0 });
  assert.equal(score.decision, 'reject');
});

test('accepts challenger that improves recall without regressions', () => {
  const score = scoreCandidate({ championRecall: 0.82, challengerRecall: 0.88, regressionCount: 0 });
  assert.equal(score.decision, 'accept');
});
```

```bash
# .agents/skills/qa-plan-evolution/scripts/test/phase6.test.sh
test_phase6_routes_back_to_phase2_after_rejected_iteration_when_budget_remains() {
  local run_dir="/tmp/skill-evolution-phase6-retry"
  arrange_rejected_iteration_fixture "$run_dir"
  run_script_expect_success ".agents/skills/qa-plan-evolution/scripts/phase6.sh" "RUN-6" "$run_dir"
  assert_json_value "$run_dir/task.json" "current_phase" "phase2"
}

test_phase6_finalizes_after_third_consecutive_rejection() {
  local run_dir="/tmp/skill-evolution-phase6-stop"
  arrange_three_rejections_fixture "$run_dir"
  run_script_expect_success ".agents/skills/qa-plan-evolution/scripts/phase6.sh" "RUN-7" "$run_dir"
  assert_file_exists "$run_dir/evolution_final.md"
  assert_output_contains "stop_condition=three_consecutive_rejections"
}
```

```javascript
// .agents/skills/qa-plan-evolution/scripts/test/evidenceFreshness.test.mjs
test('marks evidence stale when referenced knowledge-pack version changes', () => {
  const result = computeEvidenceFreshness({
    artifactUpdatedAt: '2026-03-20T10:00:00Z',
    knowledgePackUpdatedAt: '2026-03-21T09:00:00Z'
  });
  assert.equal(result.status, 'stale');
});
```

```javascript
// .agents/skills/qa-plan-evolution/scripts/test/scoreCandidate.test.mjs
test('reports regression_count when any blocking eval fails', () => {
  const result = scoreCandidate({
    championRecall: 0.8,
    challengerRecall: 0.85,
    blockingEvalFailures: 1
  });
  assert.equal(result.regression_count, 1);
  assert.equal(result.decision, 'reject');
});
```

```javascript
// workspace-planner/skills/qa-plan-orchestrator/scripts/test/finalPlanSummary.test.mjs
test('generates developer smoke rows from P1 scenarios and analog gates', () => {
  const draft = buildQaPlanFixture({
    priorities: ['P1'],
    analogGates: ['Save Dialog Completeness']
  });
  const result = generateFinalPlanSummaryArtifacts(draft);
  assert.match(result.developerSmokeMarkdown, /Save Dialog Completeness/);
  assert.match(result.developerSmokeMarkdown, /\| \[ \] \|/);
});
```

## Evals

### New eval workspace

Create `.agents/skills/qa-plan-evolution/evals/evals.json` with benchmark profiles for:

1. `qa-plan-defect-recall`
2. `qa-plan-knowledge-pack-coverage`
3. `generic-skill-regression`

### Required `qa-plan-orchestrator` eval additions

Append blocking eval groups to `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`:

1. `defect_recall_replay`
   - prompt uses BCIN-7289 defect set
   - passes only when the plan or derivative artifacts contain scenarios that would expose the known misses
2. `self_test_gap_explanation`
   - passes only when the workflow can explain why self-testing failed
3. `knowledge_pack_coverage`
   - passes only when every report-editor knowledge item maps to scenario, gate, or explicit exclusion
4. `developer_smoke_generation`
   - passes only when `developer_smoke_test_<feature-id>.md` is generated with deterministic rows
5. `interaction_matrix_coverage`
   - passes only when at least one interaction scenario exists for each required interaction pair

### Evaluation acceptance policy

1. Existing blocking eval groups must remain green.
2. New replay evals must be blocking for `qa-plan-orchestrator` evolution runs.
3. Accepted iterations must store score deltas relative to the previous champion.

## Documentation Changes

### AGENTS.md

1. Root `AGENTS.md`
   - mention `qa-plan-evolution` as the canonical SOP for skill self-improvement work
2. `workspace-planner/AGENTS.md`
   - add that **qa-plan** skill evolution uses `.agents/skills/qa-plan-evolution/` (generic skill) plus this design doc; no separate planner workflow file
   - add that knowledge packs under `qa-plan-orchestrator/knowledge-packs/` are mandatory coverage inputs when present

### README.md

1. Add `.agents/skills/qa-plan-evolution/README.md`
2. Update `workspace-planner/skills/qa-plan-orchestrator/README.md` to document:
   - knowledge-pack inputs
   - developer smoke artifact
   - replay eval expectations

### README impact

- New operator-facing content lives in `.agents/skills/qa-plan-evolution/README.md` (how to run phases, run root layout, link to benchmark spec for qa-plan).
- `qa-plan-orchestrator/README.md` must cross-link to `references/qa-plan-benchmark-spec.md` and the benchmark definition root for frozen campaigns. Active iterations live under the benchmark runtime root.

## MVP and release phasing

| Stage | Scope | Exit criteria |
|-------|--------|----------------|
| **MVP** | Phase 0–1 scripts; frozen `qa-plan-orchestrator/benchmarks/qa-plan-v1/` baseline; manual or semi-automated candidate apply for Phase 3; Phase 4 runs existing smoke + evals | One full baseline (`iteration-0`) recorded under benchmark runtime root; evolution run `task.json` / `run.json` reproducible |
| **V1** | Phases 2–6 automated; champion promotion; `defects-analysis` freshness metadata; Feishu path | End-to-end champion versus challenger loop without manual score copying; notification verified or `notification_pending` populated |
| **V2** | Second target skill using `generic-skill-regression` only | Proves target skill profile without qa-plan-specific evidence |

## Quality gates (design review)

- [ ] Paths in this doc and [qa-plan-benchmark-spec.md](../references/qa-plan-benchmark-spec.md) are repo-relative where applicable.
- [ ] Benchmark definition, archive, and runtime root roles are consistent with implementation per workspace artifact root convention.
- [ ] Phase scripts exist for each phase; tests stubbed or implemented per Tests section.
- [ ] Feishu notification and `notification_pending` behavior match workspace conventions.
- [ ] `openclaw-agent-design-review` run completes with no P0/P1 findings before implementation freeze.

## Implementation Checklist

1. ~~Create `.agents/skills/qa-plan-evolution/` with `SKILL.md`, `reference.md`, `README.md`, `scripts/`, `scripts/test/`, and `evals/`.~~ **Done**
2. ~~Implement Phase 0-6 entry scripts and helper modules with persistent artifacts only under `workspace-artifacts/skills/shared/qa-plan-evolution/runs/<run-key>/`.~~ **Done** (`scripts/phase0.sh`–`phase6.sh`, `scripts/lib/*.mjs`, optional `--run-root` / `--repo-root`)
3. Add **profile-driven** evidence freshness in Phase 1: always inspect target skill artifacts and eval catalog; run defects-analysis refresh, knowledge-pack version checks, and related hooks **only** when the selected `benchmark_profile` declares them (see qa-plan extensions in Architecture). **Done**
4. ~~Add mutation backlog and candidate scoring artifacts.~~ **Done**
5. ~~Add `qa-plan-orchestrator/knowledge-packs/report-editor/pack.md` and `pack.json`.~~ **Done**
6. ~~Update `phase4a` and `phase5a/5b` contracts to consume knowledge-pack and analog-gate rules.~~ **Done**
7. ~~Update `phase7.sh` and `finalPlanSummary.mjs` to generate `developer_smoke_test_<feature-id>.md`.~~ **Done**
8. ~~Extend `qa-plan-orchestrator/evals/evals.json` with replay and knowledge-pack eval groups.~~ **Done**
9. ~~Extend `defects-analysis` output metadata for freshness-aware reuse.~~ **Done**
10. ~~Add script tests and eval fixtures before implementation is considered review-ready.~~ **Done** (`phase0`–`phase6`, `evidenceFreshness`, `gapSources`, `scoreCandidate`, and package `npm test`)
11. Run target-skill smoke tests and evals after each candidate mutation. **Operational** (phase4 runs `npm test` + `evals/run_evals.mjs --dry-run` when present)
12. Do not finalize implementation until the required design-review gate passes.
13. ~~Create `workspace-planner/.agents/workflows/qa-plan-orchestrator-skill-evolution.md` (NLG playbook for qa-plan evolution) and wire it from `workspace-planner/AGENTS.md` per §2 AGENTS.md Sync.~~ **Superseded** — entry is only the shared skill; workflow file removed.

## References

1. `workspace-artifacts/skills/workspace-reporter/defects-analysis/runs/BCIN-7289/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
2. `workspace-artifacts/skills/workspace-reporter/defects-analysis/runs/BCIN-7289/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
3. `workspace-planner/skills/qa-plan-orchestrator/SKILL.md`
4. `workspace-planner/skills/qa-plan-orchestrator/reference.md`
5. `workspace-planner/skills/qa-plan-orchestrator/evals/evals.json`
6. `workspace-planner/skills/qa-plan-orchestrator/docs/SUPPORTING_ARTIFACT_SUMMARIZATION_AND_DEEP_RESEARCH_DESIGN.md`
7. `.agents/skills/openclaw-agent-design/SKILL.md`
8. `.agents/skills/openclaw-agent-design/reference.md`
9. `https://raw.githubusercontent.com/karpathy/autoresearch/master/README.md`
10. `https://raw.githubusercontent.com/karpathy/autoresearch/master/program.md`
