# Feature QA Planning Orchestrator — Reference

## Ownership

- `SKILL.md` owns workflow entry and phase summary.
- `reference.md` owns runtime state, artifact naming, validators, source-routing rules, and promotion gates.
- `references/*.md` own writer, reviewer, and schema contracts.
- `README.md` is a short package map only.

## Runtime state contract

### Naming convention note

Use this naming split consistently:
- JavaScript runtime values and validator return fields use `camelCase` (for example: `hasSupportingArtifacts`, `requestedSourceFamilies`, `spawnHistory`).
- Persisted state in `task.json` and `run.json` uses `snake_case` (for example: `has_supporting_artifacts`, `requested_source_families`).
- When moving values from validator/runtime code into persisted state, convert field names deliberately instead of mixing styles in the same layer.

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
- `has_supporting_artifacts`
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
- `has_supporting_artifacts`
- `spawn_history`
- `validation_history`
- `blocking_issues`

### State update rule

If a phase changes saved artifacts, phase ownership, blocking state, spawn decisions, or supporting-artifact state, both `task.json` and `run.json` must be updated before the phase is considered complete.

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
- `context/supporting_artifact_summary_<feature-id>.md` (optional but required when supporting artifacts are part of the requested evidence set)
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

### Mandatory source-family enforcement

- Primary system-of-record evidence must use the canonical route for that source family.
- Jira, Confluence, GitHub, and Figma gathering must not be collapsed into one mixed-source context agent when multiple source families are requested.
- If more than one source family is requested, spawn one dedicated context-gathering sub-agent per source family.
- If a required canonical route is unavailable, Phase 0 fails closed and the run is blocked until the missing route/access is resolved.
- Do not silently substitute browser scraping, generic web fetch, or another source-family skill for Jira/Confluence/GitHub primary evidence.

Forbidden for primary system-of-record evidence:

- browser fetch for Jira
- browser fetch for Confluence
- browser fetch for GitHub
- generic web fetch for Jira
- generic web fetch for Confluence
- generic web fetch for GitHub
- substituting `jira-cli` for Confluence evidence
- substituting `confluence` for Jira evidence
- substituting `github` for Jira or Confluence evidence

## Runtime setup contract

Before Phase 1 starts, `context/runtime_setup_<feature-id>.md` must record:

- requested source families
- canonical required skill or access path per source family
- which source references are primary specs vs supporting artifacts
- availability validation method used
- auth/access validation method used
- pass/fail result
- blockers when applicable

Phase 0 is blocked when any requested source family lacks an approved access path.
Phase 0 also blocks when a requested Jira/Confluence/GitHub family does not have its canonical skill route available and validated.

## Spawn-history contract

Each `run.json.spawn_history` entry should be structured, not freeform. Record:

- `spawn_id`
- `phase`
- `source_family`
- `approved_skill`
- `artifact_paths`
- `status`

Validation expectations:
- if `source_family = jira`, `approved_skill` must be `jira-cli`
- if `source_family = confluence`, `approved_skill` must be `confluence`
- if `source_family = github`, `approved_skill` must be `github`
- if `source_family = figma`, `approved_skill` must be `browser` or `approved_snapshot`

Artifact completeness expectations:
- `jira` must include `jira_issue_<feature-id>.md` and `jira_related_issues_<feature-id>.md`
- `confluence` must include `confluence_design_<feature-id>.md`
- `github` must include `github_diff_<feature-id>.md` and `github_traceability_<feature-id>.md`
- `figma` must include `figma_metadata_<feature-id>.md`

## Failure handling

- Do not silently continue past a failed phase gate.
- Required source families that are not `retrieved` block Phase 1.
- Runtime blockers block Phase 0.
- Missing canonical Jira/Confluence/GitHub routing blocks Phase 0.
- Evidence gathered through a forbidden path for Jira/Confluence/GitHub is invalid and must be re-fetched through the canonical skill.
- Missing required source-specific artifacts block Phase 1 even when routing/spawn policy passed.
- Supporting artifacts must not silently redefine primary feature scope. If supporting-artifact evidence appears to change scope, stop and require explicit user confirmation.
- Supporting-artifact evidence that lacks extracted lessons, risk patterns, or regression implications is incomplete for planning purposes.
- Phase 1 remediation should be source-local by default: re-run only the failing source family unless multiple source families failed or a shared runtime blocker invalidates the whole phase.
- Valid source-family artifacts should be retained across Phase 1 remediation. Do not discard good Jira/Confluence/GitHub/Figma artifacts because a different source failed.
- Escalate after one targeted retry when the failure is still unresolved, access is blocked, or required user input is missing.
- Empty mandatory coverage candidates for a `user_facing` feature block Phase 2 until the user chooses a follow-up path.
- Review findings that remain non-`resolved` block Phase 6.
- User rejection in Phase 7 returns the workflow to Phase 5 for a fresh review/refactor cycle.

## Phase gates

- Phase 0: do not enter Phase 1 unless `runtime_setup_<feature-id>.md` exists, requested source families are non-empty, and runtime blockers are absent.
- Phase 1: do not enter Phase 2 unless every required source family is retrieved through its approved access path and the saved artifacts pass source-specific evidence completeness validation.
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
