# Feature QA Planning Orchestrator — Reference

## Canonical Entrypoint

- `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

The legacy workflow file remains retired. All routing should use the orchestrator skill.

## Phase 0 State Contract

| `REPORT_STATE` | Meaning | User Options |
|---|---|---|
| `FINAL_EXISTS` | final plan already exists | `Use Existing`, `Smart Refresh`, `Full Regenerate` |
| `DRAFT_EXISTS` | draft exists, no final | `Resume`, `Smart Refresh`, `Full Regenerate` |
| `CONTEXT_ONLY` | cached context exists, no draft/final | `Generate from Cache`, `Re-fetch + Regenerate` |
| `FRESH` | no existing artifacts | proceed with fresh run |

Never auto-select a destructive option.

## Planner State Files

### `task.json`

Required additive fields:
- `run_key`
- `overall_status`
- `current_phase`
- `created_at`
- `updated_at`
- `phases`
- `defect_analysis`
- `latest_draft_version`
- `subtask_timestamps`
- `confluence_page_id` when known

### `run.json`

Required fields:
- `data_fetched_at`
- `output_generated_at`
- `notification_pending`
- `updated_at`

## Testcase contract summary

Use `references/canonical-testcase-contract.md` as the single source of truth for:
- canonical top-level heading order
- rename rules
- `N/A — <reason>` behavior
- manual testcase executability requirements
- manual vs `AUTO` placement

## Validation gates by phase

- Phase 2: validate each domain sub-testcase artifact for structure and executability
- Phase 4: validate each refactored domain artifact before accepting `_v2`
- Phase 5: validate the synthesized draft before moving to consolidated review
- Phase 7: validate the final refactored draft before publication

Use these scripts:
- `validate_context.sh`
- `validate_testcase_structure.sh`
- `validate_testcase_executability.sh`

## Failure handling

If a validation gate fails:
- do not silently continue
- rewrite once inside the current phase when the phase contract allows it
- if the artifact still fails, stop the workflow and surface the exact structural or executability violations

## Shared Skill Reuse

Use these directly when they fit:
- `jira-cli`
- `confluence`
- `feishu-notify`

Do not introduce a wrapper without a clear contract gap.
