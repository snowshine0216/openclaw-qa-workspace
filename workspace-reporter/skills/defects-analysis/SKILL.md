---
name: defect-analysis
description: Runs defect analysis for a Jira issue, feature, story, epic, JQL query, or release version. Use this whenever the task is to analyze defects and produce QA risk report.
---

# Defect Analysis Skill

This skill is the canonical reporter-owned entrypoint for defect analysis. It preserves the reporter-local multi-defect analysis path, adds mandatory Phase 0 scope routing, and now separates rich feature reporting from release-level coordination and fan-out.

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
   - For release inputs, **always** pass `--qa-owner` to `phase0.sh` and `phase1.sh`:
     - Default (no explicit owner given): pass `--qa-owner current_user`
     - Explicit owner given by user: pass the value as-is (e.g. `--qa-owner me` or `--qa-owner user@example.com`)
   - Example: `phase0.sh "26.04" <run-dir> --qa-owner current_user`
   - This ensures `release_scope` is always set in `route_decision.json` and the Jira query includes the owner filter.
2. If stdout includes `SPAWN_MANIFEST: <path>`:
   - run `node scripts/spawn_from_manifest.mjs <path> --cwd <run-dir>`
   - rerun `scripts/phaseN.sh <raw-input> <run-dir> --post`
   - treat `SPAWN_MANIFEST` as a normal handoff marker, not a failure by itself
3. If stdout includes `DELEGATED_RUN: <path>`, record the delegated path in the session summary and stop successfully.
4. Stop immediately on non-zero exit.

### Phase 5 Review Loop

Phase 5 uses a subagent spawn pattern. After `phase5.sh --post` returns exit 0, read `task.json`:

- If `task.return_to_phase === "phase5"`:
  - If `task.phase5_round >= 3`: stop with error "Phase 5 failed to converge after 3 rounds — review the context/report_review_delta.md for blocking criteria"
  - Otherwise: re-run Phase 5 from the beginning (pre-spawn → spawn subagent → --post)
- If `task.return_to_phase` is absent, null, or empty: Phase 5 is complete, continue normally

The loop terminates when the subagent's self-review passes all criteria (`context/report_review_delta.md` ends with `- accept`) or when the max-round limit is reached.

## Input Contract

Provide exactly one primary input:

- `issue_key` or `issue_url`
- `feature_key`
- `release_version`
- `jql_query`

Optional inputs:

- `refresh_mode` — `use_existing`, `resume`, `generate_from_cache`, `smart_refresh`, `full_regenerate`
- `qa_owner` — release-scope filter (`current_user`/`me` or explicit account value). **For `release_version` inputs this defaults to `current_user` unless the user explicitly opts out.** Ignored for single-key and JQL inputs.
- `qa_owner_field` — optional Jira field label override; default `QA Owner`
- `invoked_by`
- `skip_notification`
- `notification_target`

## Output Contract

Always:

- `<skill-root>/runs/<run-key>/task.json`
- `<skill-root>/runs/<run-key>/run.json`
- `<skill-root>/runs/<run-key>/context/runtime_setup_<run-key>.json`
- `<skill-root>/runs/<run-key>/context/route_decision.json`
- `<skill-root>/runs/<run-key>/context/scope_query.json`

On delegated issue-class runs:

- `<skill-root>/runs/<run-key>/context/delegated_run.json`

On reporter-local runs:

- `<skill-root>/runs/<run-key>/<run-key>_REPORT_DRAFT.md`
- `<skill-root>/runs/<run-key>/<run-key>_REVIEW_SUMMARY.md`
- `<skill-root>/runs/<run-key>/<run-key>_REPORT_FINAL.md`
- `<skill-root>/runs/<run-key>/context/analysis_freshness_<run-key>.json`
- `<skill-root>/runs/<run-key>/context/feature_metadata.json` for feature runs
- `<skill-root>/runs/<run-key>/context/feature_summary.json` for feature runs

On release runs:

- `<skill-root>/runs/release_<version>/context/feature_state_matrix.json`
- `<skill-root>/runs/release_<version>/context/feature_runs.json`
- `<skill-root>/runs/release_<version>/context/release_summary_inputs.json`
- `<skill-root>/runs/release_<version>/features/<feature-key>/packet_manifest.json`
- `<skill-root>/runs/release_<version>/features/<feature-key>/<feature-key>_REPORT_FINAL.md`
- `<skill-root>/runs/release_<version>/features/<feature-key>/feature_summary.json`

When `invoked_by=qa-plan-evolution` triggers the dedicated gap-bundle phase:

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
- release scope is enforced through the generated Jira query and persisted in `context/scope_query.json`
- release runs compute per-feature `report_state` and default action mapping

### Phase 2

- feature and JQL runs perform Jira defect extraction and raw artifact persistence
- release parent runs stay coordinator-only and do not flatten release defects into one monolithic `jira_raw.json`

### Phase 3

- feature and JQL runs normalize defects, extract PR links, and persist `feature_metadata.json`
- release runs execute or reuse canonical child feature runs sequentially and persist `feature_runs.json`

### Phase 4

- feature and JQL runs perform PR analysis spawn/post consolidation
- manifest execution may fall back from `openclaw` to `codex` when `openclaw` is unavailable in the current runtime
- release runs collect child `feature_summary.json` outputs and materialize release packet folders

### Phase 5

- pre-spawn: builds spawn manifest with raw facts (defects, PRs) and instructs subagent via rubrics
- subagent (LLM-driven): generates comprehensive report + self-reviews against `references/report-review-rubric.md`, writes `context/report_review_notes.md` and `context/report_review_delta.md`
- post: validates review delta verdict; if `return phase5`, orchestrator loops (max 3 rounds); if `accept`, finalizes
- feature runs persist `feature_summary.json` after finalization
- release runs generate one overall release report from collected feature summaries
- bundle validation for report artifacts (`context/report_review_delta.md` and `context/report_review_notes.md` required)
- Feishu completion marker or fallback notification persistence

### Dedicated Gap Bundle Phase

- `scripts/phase_gap_bundle.sh` is additive and not part of the default 0–5 operator flow
- it is only available when `invoked_by=qa-plan-evolution`
- it emits a gap-bundle spawn manifest, validates the JSON response, writes `gap_bundle_<run-key>.json`, and deterministically renders the two markdown gap analyses

## Automated Resume Policy

Unless the caller overrides the mode explicitly:

- `FINAL_EXISTS` -> `use_existing`
- `DRAFT_EXISTS` -> `resume`
- `CONTEXT_ONLY` -> `generate_from_cache` only when `context/jira_raw.json` exists
- `FRESH` -> `proceed`

## Boundary Exclusions

- No Confluence publishing
- No QA summary generation
- No tester callback ownership
- No Jira mutation as part of normal completion
