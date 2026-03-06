# Feature QA Planning Orchestrator — Reference

## Canonical Entrypoint

- `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md`

The legacy file `workspace-planner/.agents/workflows/feature-qa-planning.md` has been removed. All active routing must point to the orchestrator skill.

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

## Defect Analysis State Machine

`not_applicable -> pending -> in_progress -> completed`

Fallback:
- `pending -> skipped`
- `in_progress -> skipped`

## Draft Versioning

- Determine next draft from `task.json.latest_draft_version` when present.
- Fall back to scanning `drafts/qa_plan_v*.md`.
- Never overwrite an older draft version in place.

## Confluence Review Versioning

- Save live review artifacts as `qa_plan_confluence_review_v<N>.md`.
- If a new live review is produced, increment the version instead of overwriting the old file.

## Shared Skill Reuse

Use these directly when they fit:
- `jira-cli`
- `confluence`
- `feishu-notify`

Do not introduce a wrapper without a clear contract gap.
