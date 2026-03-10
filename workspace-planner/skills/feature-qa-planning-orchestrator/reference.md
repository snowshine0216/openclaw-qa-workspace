# Feature QA Planning Orchestrator — Reference

## Ownership

- `SKILL.md` owns workflow entry and phase summary.
- `reference.md` owns runtime state, artifact naming, validators, source-routing rules, and promotion gates.
- `references/*.md` own writer, reviewer, and schema contracts.
- `README.md` is a short package map only.

## Runtime state contract

### `REPORT_STATE`

| `REPORT_STATE` | Meaning | User options |
|---|---|---|
| `FINAL_EXISTS` | final plan already exists | `Use Existing`, `Smart Refresh`, `Full Regenerate` |
| `DRAFT_EXISTS` | draft exists, no final | `Resume`, `Smart Refresh`, `Full Regenerate` |
| `CONTEXT_ONLY` | cached context exists, no draft/final | `Generate from Cache`, `Re-fetch + Regenerate` |
| `FRESH` | no existing artifacts | proceed with fresh run |

Never auto-select a destructive option.

### `task.json`

Required fields:
- `feature_id`
- `run_key`
- `overall_status`
- `current_phase`
- `report_state`
- `selected_mode`
- `requested_source_families`
- `completed_source_families`
- `spawn_plan`
- `artifacts`
- `latest_draft_version`
- `latest_review_version`
- `latest_validation_version`
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
- `runtime_setup_generated_at`
- `data_fetched_at`
- `context_index_generated_at`
- `scenario_units_generated_at`
- `coverage_ledger_generated_at`
- `draft_generated_at`
- `review_completed_at`
- `refactor_completed_at`
- `finalized_at`
- `notification_pending`
- `spawn_history`
- `validation_history`
- `blocking_issues`

### State update rule

If a phase changes saved artifacts, phase ownership, blocking state, or spawn decisions, both `task.json` and `run.json` must be updated before the phase is considered complete.

## Artifact directories and naming

- `context/` stores every intermediate artifact that another phase may need to read, review, or resume from.
- `drafts/` stores only candidate QA-plan outputs.
- `qa_plan_final.md` is promotion-only and must never be used as a scratch draft.

Canonical artifact families:
- `context/runtime_setup_<feature-id>.md`
- `context/context_index_<feature-id>.md`
- `context/scenario_units_<feature-id>.md`
- `context/coverage_ledger_<feature-id>.md`
- `context/coverage_gaps_<feature-id>.md`
- `context/e2e_journey_map_<feature-id>.md`
- `context/review_qa_plan_<feature-id>.md`
- `context/review_rewrite_requests_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- `context/finalization_record_<feature-id>.md`
- `drafts/qa_plan_v<N>.md`

## Validator inventory

Available runtime validators:
- `validate_context.sh` — context artifact existence and legacy compatibility checks
- `validate_testcase_structure.sh` — XMindMark validation via `markxmind`
- `validate_plan_artifact.mjs validate_context_index`
- `validate_plan_artifact.mjs validate_coverage_ledger [candidate-id...]` — candidate ids come from `context_index` when mandatory candidates exist
- `validate_plan_artifact.mjs validate_scenario_granularity <draft-path> [review-rewrite-requests-path] [review-delta-path]`
- `validate_plan_artifact.mjs validate_e2e_minimum`
- `validate_plan_artifact.mjs validate_executable_steps`
- `validate_plan_artifact.mjs validate_review_delta`
- `validate_plan_artifact.mjs validate_unresolved_step_handling`

Runtime deployment helper:
- `scripts/lib/deploy_runtime_context_tools.sh`

## Contract references

Use these docs together:
- `references/qa-plan-contract.md`
- `references/context-coverage-contract.md`
- `references/executable-step-rubric.md`
- `references/review-rubric.md`
- `references/context-index-schema.md`
- `references/e2e-coverage-rules.md`

## Source-routing contract

Phase 0 and Phase 1 must use these source-family paths:

- `jira` -> shared `jira-cli` skill
- `confluence` -> shared `confluence` skill
- `github` -> shared `github` skill
- `figma` -> browser-based exploration or approved local snapshots

Forbidden for primary system-of-record evidence:

- browser fetch for Jira
- browser fetch for Confluence
- browser fetch for GitHub
- generic web fetch for Jira
- generic web fetch for Confluence
- generic web fetch for GitHub

## Runtime setup contract

Before Phase 1 starts, `context/runtime_setup_<feature-id>.md` must record:

- requested source families
- approved skill or access path per source family
- validation method used
- pass/fail result
- blockers when applicable

Phase 0 is blocked when any requested source family lacks an approved access path.

## Spawn-history contract

Each `run.json.spawn_history` entry should be structured, not freeform. Record:

- `spawn_id`
- `phase`
- `source_family`
- `approved_skill`
- `artifact_paths`
- `status`

## Failure handling

- Do not silently continue past a failed phase gate.
- Required source families that are not `retrieved` block Phase 1.
- Runtime blockers block Phase 0.
- Empty mandatory coverage candidates for a `user_facing` feature block Phase 2 until the user chooses a follow-up path.
- Review findings that remain non-`resolved` block Phase 6.
- User rejection in Phase 7 returns the workflow to Phase 5 for a fresh review/refactor cycle.

## Phase gates

- Phase 0: do not enter Phase 1 unless `runtime_setup_<feature-id>.md` exists, requested source families are non-empty, and runtime blockers are absent.
- Phase 1: do not enter Phase 2 unless every required source family is retrieved through its approved access path.
- Phase 2: do not enter Phase 3 unless `context_index_<feature-id>.md` is valid and `scenario_units_<feature-id>.md` exists.
- Phase 3: do not enter Phase 4 unless every mandatory coverage candidate and every `must_stand_alone` scenario unit is classified in the coverage ledger.
- Phase 4: do not enter Phase 5 unless draft validation has no blocking failures.
- Phase 5: do not enter Phase 6 unless review verdict is saved and required rewrite requests are persisted.
- Phase 6: do not enter Phase 7 unless review-delta validation passes, scenario-granularity validation passes, and required rewrites are resolved.
- Phase 7: do not promote unless the user explicitly approves and the candidate satisfies the promotion checks above.

## Concurrent-run policy

Concurrent runs for the same `feature_id` are unsupported while artifact names remain feature-id scoped.

An active run is any run with `overall_status`:
- `in_progress`
- `awaiting_approval`
- `blocked`

If another active run with a different `run_key` is detected, stop before Phase 1 and require the user to resume, replace, or stop.
