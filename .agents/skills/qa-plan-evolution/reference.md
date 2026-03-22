# QA Plan Evolution — Reference

## Ownership

- `SKILL.md` defines when the skill triggers and what it orchestrates
- `reference.md` defines runtime state, artifact naming, scoring, iteration rules, and target-skill safety gates

## Runtime Root Convention

All per-run artifacts live under:

```text
<skill-root>/runs/<run-key>/
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
|------|---------|------------------|
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
- `requested_knowledge_pack_key`
- `resolved_knowledge_pack_key`
- `knowledge_pack_resolution_source`
- `knowledge_pack_key`
- `defect_analysis_run_key`
- `benchmark_profile`
- `current_iteration`
- `max_iterations`
- `accepted_iteration`
- `champion_snapshot_path`
- `pending_finalization_iteration`
- `champion_archive_path`
- `finalization_approved_at`
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
- `champion_archive_history`

## Evidence Freshness Rules

Evidence is stale when any required input changed after the evidence artifact timestamp:

1. Jira defect set changed
2. linked PR set changed
3. target skill final output changed
4. target-skill eval catalog changed
5. referenced knowledge pack changed

When stale evidence is detected and the benchmark profile marks it `required`, Phase 1 must refresh before Phase 2 may continue.

For qa-plan runs, missing knowledge packs are scaffolded automatically and marked `bootstrap_status: "incomplete"` until an operator fills required content and sets `bootstrap_status` to `ready`.

## Benchmark Policy

Every run must build a benchmark catalog with these buckets:

1. `smoke_checks`
2. `contract_evals`
3. `defect_replay_evals`
4. `knowledge_pack_coverage_evals`
5. `regression_evals`

Blocking acceptance rule (profile-dependent; see `evals/evals.json`):

- all blocking smoke checks pass
- all blocking eval groups pass
- challenger does not regress primary metrics declared for the profile
- non-target feature families do not regress in active blind/holdout modes
- `regression_count == 0` for blocking gates

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

## Gap Sources

Phase 2 is profile-driven. Each `benchmark_profile` may declare `gap_sources`.

Examples:

- `generic-skill-regression` -> `target_eval_failures`, `contract_drift`, `smoke_regressions`
- `qa-plan-defect-recall` -> `target_eval_failures`, `replay_eval_misses`, `defects_cross_analysis`, `knowledge_pack_coverage`

Gap sources are resolved through adapter modules under `scripts/lib/gapSources/`. The shared orchestrator consumes normalized observations; target-specific parsing stays in the adapters.

For `defects_cross_analysis`, the adapter must prefer `context/gap_bundle_<run-key>.json` and fall back to markdown parsing only for backward compatibility.

## Mutation Hypothesis Contract

Each mutation in `mutation_backlog_<run-key>.md` must contain:

- `mutation_id`
- `root_cause_bucket`
- `target_files`
- `expected_gain`
- `regression_risk`
- `evals_affected`
- `knowledge_pack_delta`
- `priority`
- `status`

Only one mutation may be `selected_for_iteration` at a time.

When defect-backed iterations are finalized, persist `context/accepted_gap_ids_<run-key>.json` so later iterations do not re-select already-promoted gaps from the same bundle.

## Acceptance and Stop Rules

Stop when any of these are true:

1. `current_iteration == max_iterations`
2. no blocking gaps remain
3. `3` consecutive rejected iterations occur
4. user stops the run explicitly

Accepted challengers do not finalize automatically. Phase 6 archives the current champion and accepted candidate, then sets `overall_status=awaiting_approval` until the operator reruns Phase 6 with `--finalize`.

When finalizing, write:

- `evolution_final.md`
- `benchmarks/scoreboard_<run-key>.json`
- `context/accepted_gap_ids_<run-key>.json` (when defect-backed evidence selected source observations)
- `context/accepted_mutations_<run-key>.md`
- `context/rejected_mutations_<run-key>.md`
- `context/git_promotion_<run-key>_i<n>.json` (when accepted finalize produces a commit)

When a mutation is rejected, write:

- `context/rejection_restore_<run-key>_i<n>.json`

## Target-Skill Safety Rules

1. Preserve the target skill's `REPORT_STATE` semantics unless the change is explicitly benchmarked.
2. Preserve the target skill's runtime output location under its own `runs/<run-key>/`.
3. Do not accept challenger changes that weaken existing validators without stronger replacement checks.
4. Knowledge packs must remain reviewable text or JSON artifacts in the target skill tree; do not make hidden or opaque retrieval mandatory.

## Canonical benchmark (qa-plan)

When evolving `qa-plan-orchestrator`:

- **Benchmark root:** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/`
- **Profile:** `global-cross-feature-v1` (declared in `benchmark_manifest.json`)
- **Default evidence mode:** `blind_pre_defect`
  - Activates all phase-contract and holdout-regression blocking cases.
  - Does NOT require a `defect_analysis_run_key`.
  - Keeps iteration decisions free from noise introduced by newly logged defects.
- **Adding replay evidence:** only when operator explicitly provides `defect_analysis_run_key`.
  - Activates `retrospective_replay` cases: `P4A-SDK-CONTRACT-001`, `P5A-INTERACTION-AUDIT-001`, `P5A-COVERAGE-PRESERVATION-001`, `P5B-ANALOG-GATE-001`, `P7-DEV-SMOKE-001`.
  - Do not enable automatically — newly logged defects must not contaminate the mutation decision.
- **Iteration comparison:** use executed comparison for promotion decisions. The synthetic structural comparator is fallback-only and cannot promote a challenger.
  - Executed compare: `scripts/run_iteration_compare.mjs`
  - Synthetic fallback: `scripts/lib/publishIterationComparison.mjs`
- **Iteration scoring:** run `scripts/score_iteration.mjs` after each Phase 5 decision:
  ```bash
  node workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/scripts/score_iteration.mjs \
    --iteration <n> --profile global-cross-feature-v1
  ```
- **Synthetic scorecards:** if `scoring_fidelity === "synthetic"`, the scorecard must report `decision.result: "blocked_synthetic"` and Phase 6 must refuse promotion.
- **Acceptance gate:** a challenger is rejected if any case in `blocking_case_ids` from `benchmark_manifest.json` fails.
- **Cross-family gate:** for active blind/holdout evidence modes, non-target feature families must be non-regressing.
- **Evolution run root** (for `REPORT_STATE` / task state): `.agents/skills/qa-plan-evolution/runs/<run-key>/`
- **Benchmark campaign root** (frozen, append-only): `benchmarks/qa-plan-v2/` — publish outputs there per `docs/QA_PLAN_BENCHMARK_SPEC.md`.

The skill's own `evals/evals.json` remains the smoke gate. `qa-plan-v2` cases are the acceptance gate for challenger promotion.
