---
name: defect-analysis
description: Runs defect analysis for a Jira issue, feature, story, epic, JQL query, or release version. Use this whenever the task is to analyze defects and produce QA risk report.
---

# Defect Analysis Skill

This skill is the canonical reporter-owned entrypoint for defect analysis. It preserves the reporter-local multi-defect analysis path, adds mandatory Phase 0 scope routing, and removes the old approval + Confluence publish flow.

The orchestrator has exactly three responsibilities:

1. Call `phaseN.sh`.
2. Handle blocking user interaction only when a phase returns a blocking condition that cannot be resolved safely by defaults.
3. When any phase prints `SPAWN_MANIFEST: <path>`, spawn subagents from that manifest, wait for completion, then call the same phase with `--post`.

## Required References

Always read:

- `reference.md`

When the route decision is `issue_class`, also respect:

- shared skill: `single-defect-analysis`

## Runtime Layout

All artifacts for one run live under `<skill-root>/runs/<run-key>/`:

```text
<skill-root>/runs/<run-key>/
  context/
  drafts/
  reports/
  archive/
  task.json
  run.json
  phase4_spawn_manifest.json
  <run-key>_REPORT_DRAFT.md
  <run-key>_REVIEW_SUMMARY.md
  <run-key>_REPORT_FINAL.md
```

Issue-class delegated runs still use this run root for routing evidence and delegation metadata, but the downstream analysis artifacts remain owned by `.agents/skills/single-defect-analysis`.

## Orchestrator Loop

For each phase `0..5`:

1. Run `scripts/phaseN.sh <raw-input> <run-dir>`.
2. If stdout includes `SPAWN_MANIFEST: <path>`:
   - run `node scripts/spawn_from_manifest.mjs <path> --cwd <run-dir>`
   - rerun `scripts/phaseN.sh <raw-input> <run-dir> --post`
3. If stdout includes `DELEGATED_RUN: <path>`, record the delegated path in the session summary and stop successfully.
4. Stop immediately on non-zero exit.

## Input Contract

Provide exactly one primary input:

- `issue_key` or `issue_url`
- `feature_key`
- `release_version`
- `jql_query`

Optional inputs:

- `refresh_mode` — `use_existing`, `resume`, `generate_from_cache`, `smart_refresh`, `full_regenerate`
- `invoked_by`
- `skip_notification`
- `notification_target`

## Output Contract

Always:

- `<skill-root>/runs/<run-key>/task.json`
- `<skill-root>/runs/<run-key>/run.json`
- `<skill-root>/runs/<run-key>/context/runtime_setup_<run-key>.json`
- `<skill-root>/runs/<run-key>/context/route_decision.json`

On delegated issue-class runs:

- `<skill-root>/runs/<run-key>/context/delegated_run.json`

On reporter-local runs:

- `<skill-root>/runs/<run-key>/<run-key>_REPORT_DRAFT.md`
- `<skill-root>/runs/<run-key>/<run-key>_REVIEW_SUMMARY.md`
- `<skill-root>/runs/<run-key>/<run-key>_REPORT_FINAL.md`
- `<skill-root>/runs/<run-key>/<run-key>_QA_PLAN_CROSS_ANALYSIS.md`
- `<skill-root>/runs/<run-key>/<run-key>_SELF_TEST_GAP_ANALYSIS.md`
- `<skill-root>/runs/<run-key>/context/gap_bundle_<run-key>.json`

## Shared Skill Reuse

- Direct reuse: `jira-cli`, `github`, `feishu-notify`, `single-defect-analysis`
- Reporter-local reuse: `report-quality-reviewer`
- Explicit non-use: `confluence`

## Phase Contract

### Phase 0

- idempotency defaulting
- Jira/GitHub runtime validation
- input classification
- issue-class delegation manifest creation

### Phase 1

- scope discovery for reporter-local single-key, release, or JQL input

### Phase 2

- Jira defect extraction and raw artifact persistence

### Phase 3

- defect normalization and PR link extraction

### Phase 4

- PR analysis spawn/post consolidation

### Phase 5

- orchestrator directly generates draft report from context
- self-review + finalize loop
- bundle validation
- Feishu completion marker or fallback notification persistence

## Automated Resume Policy

Unless the caller overrides the mode explicitly:

- `FINAL_EXISTS` -> `use_existing`
- `DRAFT_EXISTS` -> `resume`
- `CONTEXT_ONLY` -> `generate_from_cache`
- `FRESH` -> `proceed`

## Boundary Exclusions

- No Confluence publishing
- No QA summary generation
- No tester callback ownership
- No Jira mutation as part of normal completion
