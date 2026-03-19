# QA Summary Runtime And State

## Runtime Source Config

Default upstream run roots are loaded from:

```text
<skill-root>/config/runtime-sources.json
```

Rules:

- The config file is the source of truth for default planner and defect-analysis run roots.
- Caller-supplied `planner_run_root` and `defects_run_root` are optional per-run overrides.
- Phase 0 must load the config file first, apply any explicit overrides second, and persist the resolved roots into `task.json`.

## Runtime Root Convention

All per-feature runtime artifacts live under:

```text
<skill-root>/runs/<feature-key>/
```

Artifact families:

- `context/` -> planner lookup results, defect context, publish choices, review state, Confluence readback
- `drafts/` -> working QA summary draft
- `archive/` -> archived prior draft/final artifacts
- `task.json`, `run.json`
- `phase2_spawn_manifest.json`, `phase4_spawn_manifest.json`
- `<feature-key>_QA_SUMMARY_REVIEW.md`
- `<feature-key>_QA_SUMMARY_MERGED.md`
- `<feature-key>_QA_SUMMARY_FINAL.md`

## REPORT_STATE

| Value | Meaning | User interaction |
|---|---|---|
| `FINAL_EXISTS` | `<feature-key>_QA_SUMMARY_FINAL.md` already exists | offer `use_existing`, `smart_refresh`, `full_regenerate` |
| `DRAFT_EXISTS` | draft exists but no final | offer `resume`, `smart_refresh`, `full_regenerate` |
| `CONTEXT_ONLY` | planner or defect context exists but no draft/final | offer `generate_from_cache`, `smart_refresh`, `full_regenerate` |
| `FRESH` | no prior summary artifacts exist | continue with `selected_mode = proceed` |

## selected_mode

| Value | Effect |
|---|---|
| `proceed` | start a new run with config-resolved defaults and no reuse behavior |
| `use_existing` | return previously completed final summary without new work |
| `resume` | continue from the latest incomplete phase |
| `generate_from_cache` | rebuild draft/final from planner and defect context already on disk |
| `smart_refresh` | archive downstream outputs, keep reusable context, and continue from the earliest stale phase |
| `full_regenerate` | archive prior outputs and rebuild from the beginning |

## task.json Additive Schema

Required fields:

- `feature_key`
- `run_key`
- `config_path`
- `report_state`
- `selected_mode`
- `planner_run_root`
- `planner_plan_path`
- `planner_plan_resolved_path`
- `planner_summary_path`
- `feature_overview_table_path`
- `feature_overview_source`
- `defects_run_root`
- `defect_context_state`
- `defect_reuse_mode`
- `publish_mode`
- `confluence_target`
- `overall_status`
- `current_phase`
- `review_status`
- `notification_status`
- `updated_at`

Allowed `overall_status` values:

- `not_started`
- `in_progress`
- `blocked`
- `review_in_progress`
- `awaiting_approval`
- `approved`
- `completed`
- `failed`

Derived workflow tags (`context_ready`, `analysis_in_progress`, `draft_ready`) are log-only labels derived from `current_phase` and are not persisted in `overall_status`.

## run.json Additive Schema

Required fields:

- `planner_context_resolved_at`
- `defect_context_resolved_at`
- `output_generated_at`
- `review_completed_at`
- `confluence_published_at`
- `notification_pending`
- `subtask_timestamps`
- `updated_at`

## `phase2_spawn_manifest.json` Schema

```json
{
  "version": 1,
  "phase": "phase2",
  "requests": [
    {
      "kind": "defects-analysis",
      "feature_key": "BCIN-7289",
      "openclaw": {
        "args": [
          "--skill",
          "defects-analysis",
          "--feature-key",
          "BCIN-7289"
        ]
      }
    }
  ]
}
```

## `phase4_spawn_manifest.json` Schema

```json
{
  "version": 1,
  "phase": "phase4",
  "requests": [
    {
      "kind": "qa-summary-review",
      "feature_key": "BCIN-7289",
      "openclaw": {
        "args": [
          "--skill",
          "qa-summary-review",
          "--feature-key",
          "BCIN-7289",
          "--draft",
          "drafts/BCIN-7289_QA_SUMMARY_DRAFT.md"
        ]
      }
    }
  ]
}
```

Path rule:

- `spawn_from_manifest.mjs` is invoked with `--cwd <skill-root>/runs/<feature-key>`.
- Manifest paths in `openclaw.args` must be relative to that run directory (for example `drafts/<feature-key>_QA_SUMMARY_DRAFT.md`), not repo-root-relative.

## `review_result.json` Schema

```json
{
  "verdict": "pass",
  "autoFixesApplied": 2,
  "warnings": [
    "Performance section uses pending placeholder."
  ],
  "requiresRefactor": false,
  "reviewOutputPath": "BCIN-7289_QA_SUMMARY_REVIEW.md",
  "updatedDraftPath": "drafts/BCIN-7289_QA_SUMMARY_DRAFT.md"
}
```

Rules:

- `verdict` is one of `pass` or `fail`.
- `requiresRefactor` is `true` when Phase 4 should apply a refactor pass and requeue review.
- `qa-summary-review` is responsible for producing this file before Phase 4 `--post` runs.

## `run.json.notification_pending` Schema

```json
{
  "channel": "feishu",
  "chat_id": "oc_xxx",
  "feature_key": "BCIN-7289",
  "final_path": "runs/BCIN-7289/BCIN-7289_QA_SUMMARY_FINAL.md",
  "page_url": "https://company.atlassian.net/wiki/...",
  "payload_file": "runs/BCIN-7289/context/notification_payload.json",
  "last_error": "network timeout",
  "recorded_at": "2026-03-16T08:30:00Z"
}
```
