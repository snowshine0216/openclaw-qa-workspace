# Defect Analysis Skill - Reference

## Ownership

- `SKILL.md` defines orchestrator behavior.
- `reference.md` defines route classification, runtime state, artifact naming, automated defaults, and phase gates.

## Route Classification

| Condition | Route |
|---|---|
| exactly one Jira key or Jira URL resolves to issue type `Issue`, `Bug`, or `Defect` | `issue_class` -> delegate to `.agents/skills/single-defect-analysis` |
| exactly one Jira key or Jira URL resolves to issue type `Story`, `Feature`, or `Epic` | `reporter_scope_single_key` |
| explicit `feature_key` input | `reporter_scope_single_key` |
| explicit `release_version` input (optionally with `qa_owner`) | `reporter_scope_release` |
| explicit `jql_query` input | `reporter_scope_jql` |
| input cannot be resolved confidently | `blocked` |

## Input Classification Heuristics (classify_input.mjs)

When `jiraIssueType` is absent, use these heuristics to distinguish input kinds before optional Jira lookup:

| Pattern | Route | Examples |
|---------|-------|----------|
| Release version: `^\d+(\.\d+)*$` (digits and dots only) | `reporter_scope_release` | `26.03`, `1.0.0`, `2` |
| JQL: contains `project`, `=`, `AND`, `OR`, `IN`, `issuetype`, `order by` (case-insensitive) | `reporter_scope_jql` | `project = BCIN AND issuetype = Defect` |
| Jira URL: contains `jira`, `browse`, `atlassian` | resolve key from URL, then use `jiraIssueType` if fetched | `https://jira.example.com/browse/BCIN-9000` |
| Jira key: `^[A-Z][A-Z0-9]{1,10}-\d+$` | use `jiraIssueType` when available; else fetch minimal metadata | `BCIN-5809`, `BUG-123` |
| Ambiguous (e.g. `26.03` vs `ABC-26`): prefer release if matches `^\d+\.\d+` with no hyphen; else treat as potential Jira key and fetch | — | `26.03` → release; `ABC-26` → Jira key |

When both patterns could match, explicit input flags (`feature_key`, `release_version`, `jql_query`) take precedence. If heuristics cannot resolve confidently, return `blocked`.

## State Machine: REPORT_STATE Handling

| REPORT_STATE | Default action | Block condition |
|---|---|---|
| `FINAL_EXISTS` | `use_existing` | block only for explicit destructive refresh on fresh data |
| `DRAFT_EXISTS` | `resume` | block only if draft metadata is corrupted |
| `CONTEXT_ONLY` | `generate_from_cache` | only when `context/jira_raw.json` exists; otherwise treat the run as `FRESH` |
| `FRESH` | `proceed` | none |

## selected_mode

| Value | Effect |
|---|---|
| `use_existing` | Return previously completed final output without new external calls |
| `resume` | Continue from the latest incomplete phase |
| `generate_from_cache` | Rebuild outputs from cached context without Jira/GitHub refetch |
| `smart_refresh` | Archive downstream outputs, keep valid cache, and continue from the earliest stale phase |
| `full_regenerate` | Archive all prior outputs and refetch all external data |

## Run Root Convention

All reporter skill artifacts live under:

```text
workspace-reporter/skills/defects-analysis/runs/<run-key>/
```

Run-key derivation:

- `<ISSUE_KEY>` for single Jira key input
- `release_<VERSION>` for unfiltered release input (no qa_owner filter — only used when the user explicitly opts out)
- `release_<VERSION>__scope_<sha1_8>` for filtered release input (default for all release runs; e.g. release + `qa_owner=current_user`)
- `jql_<sha1_12>` for JQL input

> **Default:** release inputs always produce a scoped run key (`release_<VERSION>__scope_<sha1_8>`) because `qa_owner` defaults to `current_user`. A plain `release_<VERSION>` run key only occurs when the user explicitly requests all features with no owner filter.

## Artifact Families

- `context/` -> runtime setup, route decision, scope discovery, Jira payloads, issue summaries, PR summaries, delegation manifests
- `drafts/` -> intermediate repair drafts
- `reports/` -> auxiliary report-support artifacts
- `archive/` -> archived drafts/finals before destructive refresh
- `task.json`, `run.json`
- `phase4_spawn_manifest.json`
- `<run-key>_REPORT_DRAFT.md`, `<run-key>_REVIEW_SUMMARY.md`, `<run-key>_REPORT_FINAL.md`

Additional feature-run artifacts:

- `context/feature_metadata.json`
- `context/feature_summary.json`

Additional release-run artifacts:

- `context/feature_state_matrix.json`
- `context/feature_runs.json`
- `context/release_summary_inputs.json`
- `context/scope_query.json`
- `features/<feature-key>/packet_manifest.json`
- `features/<feature-key>/<feature-key>_REPORT_FINAL.md`
- `features/<feature-key>/feature_summary.json`

## Evolution Support Artifacts

When the shared `qa-plan-evolution` uses `defects-analysis` as an evidence source, these additive artifacts may exist under `runs/<run-key>/`:

- `context/analysis_freshness_<run-key>.json`
- `context/gap_bundle_<run-key>.json`
- `<run-key>_SELF_TEST_GAP_ANALYSIS.md`
- `<run-key>_QA_PLAN_CROSS_ANALYSIS.md`

### `analysis_freshness_<run-key>.json`

Fields emitted for freshness-aware reuse:

- `generated_at`
- `source_issue_timestamp`
- `pr_timestamp`
- `upstream_qa_plan_timestamp`
- `knowledge_pack_version_used`

These fields are additive only. Reporter-local flows remain valid when evolution does not consume them.

### Refresh Rule For Evolution Runs

- Evolution callers should prefer `smart_refresh` and regenerate only when the freshness artifact is stale relative to the target-skill evidence they compare against.
- If freshness metadata is current, `use_existing`, `resume`, or `generate_from_cache` should be preferred over destructive refresh.
- Gap-bundle generation is a separate additive phase. It is not part of the default reporter 0–5 loop and should run only when `invoked_by=qa-plan-evolution`.

## task.json Additive Schema

Required fields:

- `run_key`
- `raw_input`
- `route_kind`
- `release_version`
- `release_scope`
- `selected_mode`
- `overall_status`
- `current_phase`
- `feature_keys`
- `processed_features`
- `processed_defects`
- `processed_prs`
- `delegated_skill`
- `delegated_run_dir`
- `notification_status`
- `updated_at`

## run.json Additive Schema

Required fields:

- `data_fetched_at`
- `scope_discovered_at`
- `pr_analysis_completed_at`
- `output_generated_at`
- `review_completed_at`
- `spawn_history`
- `notification_pending`
- `auto_selected_defaults`
- `updated_at`

## Blocking Conditions

The workflow pauses only when one of these is true:

1. Jira or GitHub auth check fails in Phase 0.
2. The input cannot be mapped to exactly one route policy.
3. A destructive refresh is requested against data fresher than one hour without explicit confirmation.
4. Required cache files are missing for `resume` or `generate_from_cache`.
5. The self-review + finalize loop cannot reach `pass` after bounded auto-fix attempts.
6. Notification delivery fails and retry policy is exhausted.

## Notification Contract

Primary path for agent-orchestrated runs:

```text
FEISHU_NOTIFY: chat_id=<id> run_key=<run-key> final=<path>
```

Fallback path for non-agent execution:

- `scripts/notify_feishu.sh` calls shared `feishu-notify`
- on failure, persist the complete retry payload under `run.json.notification_pending`

## Report Format (12 Sections)

The orchestrator generates draft reports with these required sections. The report-quality-reviewer validates both their presence and minimum content quality:

1. Report Header — title, feature key, date, total defects
2. Executive Summary — defect distribution table, risk rating
3. Defect Breakdown by Status — completed, in progress, to do, additional open
4. Risk Analysis by Functional Area
5. Defect Analysis by Priority
6. Code Change Analysis — PR impact summaries
7. Residual Risk Assessment
8. Recommended QA Focus Areas
9. Test Environment Recommendations
10. Verification Checklist for Release
11. Conclusion
12. Appendix: Defect Reference List — Jira URLs

### Feature Summary Contract

Feature runs persist `context/feature_summary.json` with these minimum fields:

- `feature_key`
- `feature_title`
- `report_final_path`
- `risk_level`
- `total_defects`
- `open_defects`
- `open_high_defects`
- `pr_count`
- `repos_changed`
- `top_risk_areas`
- `blocking_defects`
- `generated_at`

This contract intentionally aligns with the normalized summary concepts already used by `workspace-reporter/skills/qa-summary/scripts/lib/buildDefectSummary.mjs`. Any additional release-only fields must be additive.

### Release Coordination Contract

Release runs are parent coordinators, not monolithic defect aggregators.

- Phase 1 computes per-feature state for canonical child runs under `runs/<feature-key>/`
- For release-scope runs, Phase 1 is also the enforcement point for the generated Jira query; the resolved query must be persisted in `context/scope_query.json`
- Phase 3 executes or reuses those child runs with the mapped selected action
- Child feature runs are expected to complete their own manifest-driven spawn/post loops before the release parent continues
- Phase 4 collects `feature_summary.json` outputs and materializes release packets under `runs/release_<version>/features/<feature-key>/`

## Spawn Manifest Contract

- `SPAWN_MANIFEST: <path>` is a handoff marker, not an error condition on its own
- `scripts/spawn_from_manifest.mjs` should first try `openclaw sessions spawn`
- When `openclaw` is unavailable in the runtime, the manifest runner should fall back to `codex exec` and still materialize any declared `output_file`
- Phase 5 generates the overall release report from `release_summary_inputs.json`

### Reviewer Fail Conditions

The reviewer must fail when any of these are true:

1. Generic filler or placeholder text remains in core sections.
2. Feature reports omit the feature-title callout.
3. Functional-area analysis is empty even though defects exist.
4. Open high-priority defects exist with no explicit blocking-defect callout.
5. PRs exist but Code Change Analysis only points to `context/prs/`.
6. Release reports are missing feature packet evidence or packet references.

## Validation Commands

- `node --test workspace-reporter/skills/defects-analysis/scripts/test/*.test.js`
- `node --test workspace-reporter/skills/report-quality-reviewer/scripts/test/*.test.js`
