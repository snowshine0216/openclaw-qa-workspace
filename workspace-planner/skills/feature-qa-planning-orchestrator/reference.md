# Feature QA Planning Orchestrator — Reference

## Canonical Entrypoint

- `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

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
- `data_fetched_at`
- `context_index_generated_at`
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
- `context/context_index_<feature-id>.md`
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

## Failure handling

- Do not silently continue past a failed phase gate.
- Required source families that are not `retrieved` block Phase 1.
- Runtime blockers block Phase 0.
- Empty mandatory coverage candidates for a `user_facing` feature block Phase 2 until the user chooses a follow-up path.
- Review findings that remain non-`resolved` block Phase 6.
- User rejection in Phase 7 returns the workflow to Phase 5 for a fresh review/refactor cycle.

## Concurrent-run policy

Concurrent runs for the same `feature_id` are unsupported while artifact names remain feature-id scoped.

An active run is any run with `overall_status`:
- `in_progress`
- `awaiting_approval`
- `blocked`

If another active run with a different `run_key` is detected, stop before Phase 1 and require the user to resume, replace, or stop.
