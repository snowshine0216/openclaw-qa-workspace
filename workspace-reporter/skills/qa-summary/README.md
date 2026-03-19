# QA Summary Skill

Canonical entrypoint for QA summary generation and optional Confluence publication.

## Run Root Layout

All runtime artifacts for one feature live under:

```
<skill-root>/runs/<feature-key>/
  context/          # planner lookup, defect context, publish choices
  drafts/           # working QA summary draft
  archive/          # archived prior outputs
  task.json
  run.json
  phase2_spawn_manifest.json
  phase4_spawn_manifest.json
  <feature-key>_QA_SUMMARY_REVIEW.md
  <feature-key>_QA_SUMMARY_MERGED.md
  <feature-key>_QA_SUMMARY_FINAL.md
```

## Required Inputs

- **feature_key** (required): Jira feature key (e.g. BCIN-7289)

## Optional Inputs

- **planner_run_root**: Override default planner run root
- **planner_plan_path**: Direct path to QA plan Markdown
- **defects_run_root**: Override default defect-analysis run root
- **refresh_mode**: `use_existing`, `resume`, `generate_from_cache`, `smart_refresh`, `full_regenerate`
- **publish_mode**: `skip`, `update_existing`, `create_new`
- **confluence_page_url** / **confluence_page_id**: For update flow

## Data Sources

- **Planner context**: Default `workspace-planner/skills/qa-plan-orchestrator/runs/<feature-key>/qa_plan_final.md`
- **Defect context**: Resolved via `workspace-reporter/skills/defects-analysis`
- **Summary draft**: Reporter-generated sections 1–10 from planner + defect context

## Smoke Tests

```bash
node --test workspace-reporter/skills/qa-summary/scripts/test/*.test.js
```

## Orchestration

```bash
bash workspace-reporter/skills/qa-summary/scripts/orchestrate.sh BCIN-7289
```
