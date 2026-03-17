# QA Summary Planner And Defects

## Planner Artifact Lookup

The workflow must resolve planner artifacts in this order:

1. `planner_plan_path` provided explicitly by the caller or the user
2. `<planner_run_root>/<feature-key>/qa_plan_final.md`
3. metadata companion: `<planner_run_root>/<feature-key>/context/final_plan_summary_<feature-key>.md`

Rules:

- `qa_plan_final.md` is the canonical required Markdown source for summary generation.
- `final_plan_summary_<feature-key>.md` is optional companion context. It never replaces `qa_plan_final.md`, but when present its markdown must be merged into the Phase 1 planner seed so Phase 2 can still recover planner-summary-only PR references.
- `planner_run_root` comes from `config/runtime-sources.json` unless the caller provides an explicit per-run override.
- If `qa_plan_final.md` cannot be resolved, the workflow must stop and ask the user to provide the QA plan in Markdown.
- If both `final_plan_summary_<feature-key>.md` and `qa_plan_final.md` are missing, the workflow must block and request a QA plan Markdown file from the user.

## Feature Overview Extraction (Section 1)

Section 1 must be present in the draft artifact used for review and approval.

Rules:

- Phase 1 extracts `### 1. Feature Overview` from `qa_plan_final.md` into `context/feature_overview_table.md`.
- If the planner section exists but table rows are missing, normalize to required rows and fill missing values with `[PENDING — <field> not provided in planner artifact.]`.
- If the planner section does not exist, build a fallback table from available planner metadata (`final_plan_summary_<feature-key>.md`) and fill unknown values with `[PENDING]`.
- Phase 3 must block if `context/feature_overview_table.md` is missing to prevent generating a partial draft.

## `feature_overview_source.json` Schema

```json
{
  "source": "planner_section",
  "table_path": "runs/BCIN-7289/context/feature_overview_table.md",
  "fallback_used": false,
  "missing_fields": [],
  "updated_at": "2026-03-16T08:11:00Z"
}
```

`source` is one of `planner_section`, `planner_metadata`, or `fallback_default`.

Additional seed rule:

- `context/planner_summary_seed.md` must preserve both the planner summary markdown and the canonical plan markdown when both artifacts exist.

## Defect Context State

| Value | Meaning | Required behavior |
|---|---|---|
| `defect_final_exists` | reporter defect-analysis final report exists under the resolved defect run root | ask user to reuse or regenerate |
| `defect_draft_exists` | defect-analysis draft or partial context exists | ask user to regenerate unless the user explicitly accepts draft-based reuse |
| `no_defect_artifacts` | no defect-analysis artifacts found | run `defects-analysis` or continue with no-defect mode if the delegated result explicitly states zero defects |
| `no_defects_found` | the chosen defect source confirms zero defects | continue to summary generation; do not fail |

## `defect_context_state.json` Schema

```json
{
  "kind": "defect_final_exists",
  "defects_run_dir": "workspace-reporter/skills/defects-analysis/runs/BCIN-7289",
  "defect_report_path": "workspace-reporter/skills/defects-analysis/runs/BCIN-7289/BCIN-7289_REPORT_FINAL.md",
  "userChoice": "reuse_existing_defects",
  "updated_at": "2026-03-16T08:15:00Z"
}
```

`kind` is one of `defect_final_exists`, `defect_draft_exists`, `no_defect_artifacts`, `no_defects_found`.
`userChoice` is one of `reuse_existing_defects`, `regenerate_defects`, or `null` when user input is still required.

Post-processing precedence:

- `reuse_existing_defects` means summarize the configured defect run root.
- `regenerate_defects` means summarize the freshly spawned default defects-analysis run when those regenerated artifacts exist, even if the configured override still contains stale artifacts.

## `defect_summary.json` Schema

```json
{
  "totalDefects": 3,
  "openDefects": 1,
  "resolvedDefects": 2,
  "noDefectsFound": false,
  "defects": [
    {
      "key": "BCIN-7001",
      "summary": "Filter state not cleared",
      "priority": "P1",
      "status": "Resolved",
      "resolution": "Done",
      "url": "https://jira.example/browse/BCIN-7001",
      "linkedPrs": [
        "https://github.com/org/repo/pull/123"
      ]
    }
  ],
  "prs": [
    {
      "url": "https://github.com/org/repo/pull/123",
      "repository": "org/repo",
      "number": 123,
      "sourceKind": "defect_fix",
      "extractionSource": "defect_comments",
      "linkedDefectKeys": [
        "BCIN-7001"
      ],
      "riskLevel": "MEDIUM",
      "notes": "Fixes defect behavior."
    },
    {
      "url": "https://github.com/org/repo/pull/150",
      "repository": "org/repo",
      "number": 150,
      "sourceKind": "feature_change",
      "extractionSource": "feature_comments",
      "linkedDefectKeys": [],
      "riskLevel": "LOW",
      "notes": "Feature-level implementation PR referenced by the feature."
    }
  ]
}
```

Rules:

- `prs` must include both defect-fix PRs and feature-level PRs.
- `feature_change` PRs may be extracted from feature comments or from the planner/QA summary context when feature comments are incomplete.
- `sourceKind` is one of `defect_fix` or `feature_change`.
- `extractionSource` is one of `defect_comments`, `feature_comments`, or `qa_summary`.

## `no_defects.json` Schema

```json
{
  "totalDefects": 0,
  "openDefects": 0,
  "resolvedDefects": 0,
  "noDefectsFound": true,
  "defects": [],
  "prs": [
    {
      "url": "https://github.com/org/repo/pull/150",
      "repository": "org/repo",
      "number": 150,
      "sourceKind": "feature_change",
      "extractionSource": "feature_comments",
      "linkedDefectKeys": [],
      "riskLevel": "LOW",
      "notes": "Feature-level PR still included for section 2 coverage."
    }
  ]
}
```

Section mapping:

- Section 2 "Code Changes Summary" uses all entries in `prs`, including both `defect_fix` and `feature_change`.
- Sections 3, 4, and 5 use the defect counters plus `defects`.
- Sections 6 through 10 may use either `defects` or `prs` depending on available evidence from planner and defect-analysis context.
