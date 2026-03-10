# Feature QA Planning Orchestrator — Reference

## Ownership

- `SKILL.md` defines how the orchestrator behaves
- `reference.md` defines runtime state, artifact naming, manifests, and phase gates
- `references/*.md` define writer/reviewer contracts

## Active Runtime References

- `references/phase4a-contract.md`
- `references/phase4b-contract.md`
- `references/review-rubric-phase5a.md`
- `references/review-rubric-phase5b.md`
- `references/review-rubric-phase6.md`

## Runtime State

### `REPORT_STATE`

| Value | Meaning | User interaction |
|---|---|---|
| `FINAL_EXISTS` | `qa_plan_final.md` already exists | user chooses reuse / smart_refresh / full_regenerate |
| `DRAFT_EXISTS` | one or more draft artifacts exist | user chooses resume / smart_refresh / full_regenerate |
| `CONTEXT_ONLY` | only context artifacts exist | user chooses generate from cache / smart_refresh / full_regenerate |
| `FRESH` | no prior artifacts exist | continue without prompt |

### `selected_mode` (after user choice)

| Value | Effect |
|---|---|
| `full_regenerate` | Reset to very beginning. Clear context, drafts, final. Next: Phase 0. |
| `smart_refresh` | Keep context evidence. Clear drafts and phase 2+ artifacts. Next: Phase 2. |
| `reuse` / `resume` | Continue from current state. No reset. |

After user chooses, run `scripts/apply_user_choice.sh <mode> <feature-id> <project-dir>` before proceeding.

### `task.json`

Required fields:

- `feature_id`
- `run_key`
- `overall_status`
- `current_phase`
- `report_state`
- `requested_source_families`
- `completed_source_families`
- `has_supporting_artifacts`
- `latest_draft_version`
- `latest_draft_path`
- `latest_draft_phase`
- `phase4a_round`
- `phase4b_round`
- `phase5a_round`
- `phase5b_round`
- `phase6_round`
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
- `artifact_index_generated_at`
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

## Artifact Families

### Phase 0

- `context/runtime_setup_<feature-id>.md`
- `context/runtime_setup_<feature-id>.json`

### Phase 1

- source-family evidence saved under `context/`
- `phase1_spawn_manifest.json`

### Phase 2

- `context/artifact_lookup_<feature-id>.md`

### Phase 3

- `context/coverage_ledger_<feature-id>.md`
- `phase3_spawn_manifest.json`

### Phase 4a

- `drafts/qa_plan_phase4a_r<round>.md`
- `phase4a_spawn_manifest.json`

### Phase 4b

- `drafts/qa_plan_phase4b_r<round>.md`
- `phase4b_spawn_manifest.json`

### Phase 5a

- `context/review_notes_<feature-id>.md`
- `context/review_delta_<feature-id>.md`
- `drafts/qa_plan_phase5a_r<round>.md`
- `phase5a_spawn_manifest.json`

### Phase 5b

- `context/checkpoint_audit_<feature-id>.md`
- `context/checkpoint_delta_<feature-id>.md`
- `drafts/qa_plan_phase5b_r<round>.md`
- `phase5b_spawn_manifest.json`

### Phase 6

- `context/quality_delta_<feature-id>.md`
- `drafts/qa_plan_phase6_r<round>.md`
- `phase6_spawn_manifest.json`

### Phase 7

- `context/finalization_record_<feature-id>.md`
- `qa_plan_final.md`

## Spawn Manifest Contract

Every manifest uses this shape:

```json
{
  "version": 1,
  "source_kind": "feature-qa-planning",
  "count": 1,
  "requests": [
    {
      "request": {},
      "openclaw": {
        "tool": "sessions_spawn",
        "args": {}
      },
      "handoff": {},
      "source": {}
    }
  ]
}
```

The orchestrator reads `requests[].openclaw.args`, spawns each request, waits for completion. For Phase 1 only, before `--post`, run `scripts/record_spawn_completion.sh phase1 <feature-id> <project-dir>` to record completed spawns into `run.json.spawn_history`. Then run the phase script with `--post`.

**sessions_spawn contract:** Pass `openclaw.args` to `sessions_spawn` exactly as-is. Do **not** add `streamTo` or other extra fields. `streamTo` is supported only for `runtime: "acp"` (ACP harness sessions), not for `runtime: "subagent"`. Manifests use `runtime: "subagent"`; adding `streamTo` will cause spawn failures.

## Source Routing

Use only these primary evidence skills (not generic tools):

- `jira` -> `jira-cli` skill
- `confluence` -> `confluence` skill
- `github` -> `github` skill
- `figma` -> browser exploration or approved snapshots

Do not substitute browser fetch or generic web fetch for Jira, Confluence, or GitHub primary evidence.

## Validators

The script-facing validator CLI is `scripts/lib/validate_plan_artifact.mjs`.

Supported validators:

- `validate_context_index`
- `validate_coverage_ledger`
- `validate_phase4a_subcategory_draft`
- `validate_phase4b_category_layering`
- `validate_context_coverage_audit`
- `validate_section_review_checklist`
- `validate_checkpoint_audit`
- `validate_checkpoint_delta`
- `validate_e2e_minimum`
- `validate_executable_steps`
- `validate_final_layering`
- `validate_quality_delta`
- `validate_review_delta`
- `validate_scenario_granularity`
- `validate_unresolved_step_handling`
- `validate_xmindmark_hierarchy`

## Phase Gates

- Phase 0: runtime setup files exist and `runtime_setup_<feature-id>.json` reports `ok: true`
- Phase 1: every requested source family passed spawn-policy and evidence-completeness checks
- Phase 2: `artifact_lookup_<feature-id>.md` exists and contains at least one artifact row
- Phase 3: `coverage_ledger_<feature-id>.md` passes validation
- Phase 4a: `qa_plan_phase4a_r<round>.md` passes `validate_phase4a_subcategory_draft` and executable-step validation
- Phase 4b: `qa_plan_phase4b_r<round>.md` passes canonical layering, hierarchy, E2E minimum, and executable-step validation
- Phase 5a: `review_notes`, `review_delta`, and `qa_plan_phase5a_r<round>.md` exist and pass the context-coverage + section-review gates
- Phase 5b: `checkpoint_audit`, `checkpoint_delta`, and `qa_plan_phase5b_r<round>.md` exist and pass checkpoint audit + delta validation
- Phase 6: `qa_plan_phase6_r<round>.md` passes final layering, hierarchy, E2E minimum, and executable-step checks, and `quality_delta` exists
- Phase 7: explicit user approval before promotion

## Concurrent Runs

Concurrent runs for the same `feature_id` are blocked while `task.json.overall_status` is one of:

- `in_progress`
- `awaiting_approval`
- `blocked`

If a new run key conflicts with an active run, Phase 0 fails with `CONCURRENT_RUN_BLOCKED`.
