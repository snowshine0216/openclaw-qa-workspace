# Feature QA Planning Orchestrator — Reference

## Canonical Entrypoint

- `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

## Phase 0 State Contract

| `REPORT_STATE` | Meaning | User Options |
|---|---|---|
| `FINAL_EXISTS` | final plan already exists | `Use Existing`, `Smart Refresh`, `Full Regenerate` |
| `DRAFT_EXISTS` | draft exists, no final | `Resume`, `Smart Refresh`, `Full Regenerate` |
| `CONTEXT_ONLY` | cached context exists, no draft/final | `Generate from Cache`, `Re-fetch + Regenerate` |
| `FRESH` | no existing artifacts | proceed with fresh run |

Never auto-select a destructive option.

## Planner state files

### `task.json`

Required additive fields:
- `run_key`
- `overall_status`
- `current_phase`
- `created_at`
- `updated_at`
- `phases`
- `latest_draft_version`
- `confluence_page_id` when known

### `run.json`

Required fields:
- `data_fetched_at`
- `output_generated_at`
- `notification_pending`
- `updated_at`

## QA-plan contract summary

Use `references/canonical-testcase-contract.md` as the single source of truth for:
- required section order
- allowed heading flexibility
- `N/A — <reason>` behavior
- manual testcase executability requirements
- source-usage expectations

## Runtime script deployment

Canonical helpers live in:
- `scripts/lib/save_context.sh`
- `scripts/lib/validate_context.sh`
- `scripts/lib/validate_testcase_structure.sh`
- `scripts/lib/validate_testcase_executability.sh`

At runtime, deploy them into `projects/feature-plan/scripts/` with:
- `scripts/lib/deploy_runtime_context_tools.sh`

Do not assume the runtime copies already exist.

## Validation gates by phase

- Phase 2: validate the unified draft for structure and executability
- Phase 3: review the validated draft and fail on removed sections or vague manual wording
- Phase 4: validate the refactored draft before finalization

## Failure handling

If a validation gate fails:
- do not silently continue
- rewrite once inside the current phase when the phase contract allows it
- if the artifact still fails, stop the workflow and surface the exact violations
