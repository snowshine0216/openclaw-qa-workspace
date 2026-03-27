---
name: qa-summary
description: Builds QA summary drafts and optional Confluence updates for a feature. Use this whenever the task is to write a QA summary for a feature.
---

# QA Summary Skill

This skill is the canonical entrypoint for QA summary generation and optional publication.

The orchestrator has exactly three responsibilities:

1. Call `phaseN.sh`
2. Handle blocking user interaction only when a phase requires a `REPORT_STATE` decision, a missing-artifact handoff, a defect-analysis reuse/regenerate choice, a publish choice, or final summary approval
3. When any phase prints `SPAWN_MANIFEST: <path>`, spawn subagents from that manifest, wait for completion, then call the same phase with `--post`

The orchestrator does not resolve planner files inline, does not generate summary content inline, and does not mutate Confluence inline. Scripts own those behaviors.

## Required References

Always read:

- `reference.md`
- `references/runtime-and-state.md`

Load phase-specific references only when the phase needs them:

- `references/planner-and-defects.md` for Phase 1 and Phase 2
- `references/summary-formatting.md` for Phase 3
- `references/summary-generation-rubric.md` for Phase 3
- `references/summary-review-rubric.md` for Phase 3 and Phase 4
- `references/publish-and-notification.md` for Phase 5 and Phase 6

## Required Runtime Config

Always load:

- `config/runtime-sources.json`

This file is the source of truth for default planner and defect-analysis run roots. Caller-provided path overrides may replace these defaults for one run, but the skill must always load the config file first and persist the resolved values into `task.json`.

When Phase 2 delegates or refreshes defect state, also respect skill: `defects-analysis`

## Resume Flow

The orchestrator must resume from the phase implied by `task.json.current_phase` and `task.json.overall_status` instead of always restarting useful completed work.

Required behavior:

- `not_started` or missing `task.json` -> start at Phase 0
- `in_progress` with `current_phase = phase0|phase1|phase2|phase3|phase4|phase5|phase6` -> rerun that phase
- `review_in_progress` -> resume at Phase 4
- `awaiting_approval` -> render the reviewed draft and wait for approval; if the user requests revision, regenerate the draft from the persisted Phase 1-3 context with the approval feedback applied, then return to Phase 4 review
- `approved` -> resume at Phase 5
- `completed` with `selected_mode = use_existing` -> return final output

Phase scripts are shell entrypoints that invoke Node modules under `scripts/lib/` (e.g. `phase0.sh` calls `node scripts/lib/phase0.mjs` or equivalent). The `.sh` files are orchestration boundaries; pure extraction and transformation logic belongs in the `.mjs` helpers. `check_resume.sh` is a thin shell wrapper around `scripts/lib/detectReportState.mjs`.

## Runtime Layout

All artifacts for one run live under `<skill-root>/runs/<feature-key>/`:

```text
<skill-root>/runs/<feature-key>/
  context/
  drafts/
  archive/
  task.json
  run.json
  phase2_spawn_manifest.json
  phase4_spawn_manifest.json
  <feature-key>_QA_SUMMARY_REVIEW.md
  <feature-key>_QA_SUMMARY_MERGED.md
  <feature-key>_QA_SUMMARY_FINAL.md
```

## Input Contract

Required:

- `feature_key`

Optional:

- `planner_run_root` — optional per-run override; default is loaded from `config/runtime-sources.json`
- `planner_plan_path` — direct Markdown override supplied by the caller or the user
- `defects_run_root` — optional per-run override; default is loaded from `config/runtime-sources.json`
- `refresh_mode` — `use_existing`, `resume`, `generate_from_cache`, `smart_refresh`, `full_regenerate`
- `publish_mode` — `skip`, `update_existing`, `create_new`
- `confluence_page_url`
- `confluence_page_id`
- `notification_target`
- `skip_notification`

## Output Contract

Always:

- `<skill-root>/runs/<feature-key>/task.json`
- `<skill-root>/runs/<feature-key>/run.json`
- `<skill-root>/runs/<feature-key>/context/planner_artifact_lookup.json`
- `<skill-root>/runs/<feature-key>/context/feature_overview_table.md`
- `<skill-root>/runs/<feature-key>/drafts/<feature-key>_QA_SUMMARY_DRAFT.md`
- `<skill-root>/runs/<feature-key>/<feature-key>_QA_SUMMARY_REVIEW.md`
- `<skill-root>/runs/<feature-key>/<feature-key>_QA_SUMMARY_FINAL.md`

Conditional:

- `<skill-root>/runs/<feature-key>/context/no_defects.json`
- `<skill-root>/runs/<feature-key>/context/feature_overview_source.json`
- `<skill-root>/runs/<feature-key>/context/phase3_review_notes.md`
- `<skill-root>/runs/<feature-key>/context/phase3_review_delta.md`
- `<skill-root>/runs/<feature-key>/context/phase4_review_notes.md`
- `<skill-root>/runs/<feature-key>/context/phase4_review_delta.md`
- `<skill-root>/runs/<feature-key>/phase2_spawn_manifest.json`
- `<skill-root>/runs/<feature-key>/phase2_defect_summary_manifest.json`
- `<skill-root>/runs/<feature-key>/phase3_spawn_manifest.json`
- `<skill-root>/runs/<feature-key>/phase4_spawn_manifest.json`
- `<skill-root>/runs/<feature-key>/<feature-key>_QA_SUMMARY_MERGED.md`

## Shared Skill Reuse

- Direct shared reuse: `confluence`, `feishu-notify`
- Reporter-local reuse: `defects-analysis`
- Explicit non-use: direct `jira-cli` and `github` access inside this skill. Those remain owned by `defects-analysis`.

## Phase Contract

### Phase 0

- Entry: `scripts/phase0.sh`
- Work: load `config/runtime-sources.json`, resolve the effective planner and defect-analysis run roots, classify `REPORT_STATE`, initialize run state, apply archive-before-overwrite rules, capture planner lookup configuration, and record whether planner artifacts must come from config defaults or per-run overrides
- Reference: `references/runtime-and-state.md`
- Output:
  - `task.json`
  - `run.json`
  - `context/planner_artifact_lookup.json`
  - `context/planner_artifact_lookup.md`
- User interaction:
  - when `REPORT_STATE` is `FINAL_EXISTS`, `DRAFT_EXISTS`, or `CONTEXT_ONLY`, present the canonical options from `references/runtime-and-state.md`
  - if the user selects a destructive mode, archive current draft/final artifacts before continuing

### Phase 1

- Entry: `scripts/phase1.sh`
- Work: resolve planner artifacts from the config-backed planner run root or the direct override, persist the exact source paths used for generation, write a planner seed artifact for later draft generation, and extract a normalized Section 1 Feature Overview table for draft mode
- Reference: `references/planner-and-defects.md`
- Output:
  - `context/planner_artifact_lookup.json`
  - `context/planner_artifact_lookup.md`
  - `context/planner_summary_seed.md`
  - `context/feature_overview_table.md`
  - `context/feature_overview_source.json`
- User interaction:
  - if neither `planner_plan_path` nor the default planner artifact exists, stop and ask the user to provide a QA plan in Markdown

### Phase 2

- Entry: `scripts/phase2.sh`
- Work: inspect existing reporter defect-analysis artifacts from the resolved config-backed run root, ask the user whether to reuse or regenerate when prior analysis exists, spawn `defects-analysis` only when needed (step `defects_analysis_spawned`), then spawn a defect-summary subagent (step `defect_summary_spawned`) to normalize raw defect artifacts into `defect_summary.json` using `references/planner-and-defects.md` as schema reference. Two-step spawn flow tracked via `task.phase2_step`.
- Reference: `references/planner-and-defects.md`
- Output:
  - `context/defect_context_state.json`
  - `context/defect_summary.json` — written by LLM subagent
  - `context/no_defects.json` when zero defects are found — written by LLM subagent
  - `phase2_spawn_manifest.json` when defect-analysis must run
  - `phase2_defect_summary_manifest.json` for defect-summary LLM spawn
- User interaction:
  - when prior defect-analysis artifacts exist, ask the user to choose `reuse_existing_defects` or `regenerate_defects`
  - when the user selects `regenerate_defects`, Phase 2 post-processing must summarize the freshly spawned default defects-analysis run instead of stale override artifacts

### Phase 3

- Entry: `scripts/phase3.sh`
- Work: spawn a draft-generation subagent that reads planner + defect context, applies `references/summary-generation-rubric.md` to produce all 10 sections, then self-reviews against `references/summary-review-rubric.md` (criteria C1–C10). Only advances on a self-review verdict of `accept`. On `return phase3`, increments `task.phase3_round` and re-spawns with prior review notes (max 3 rounds).
- Reference: `references/summary-formatting.md`, `references/summary-generation-rubric.md`, `references/summary-review-rubric.md`
- Output:
  - `drafts/<feature-key>_QA_SUMMARY_DRAFT.md` — written by LLM subagent
  - `context/phase3_review_notes.md` — per-criterion self-review
  - `context/phase3_review_delta.md` — verdict
  - `phase3_spawn_manifest.json`
- User interaction:
  - none

### Phase 4

- Entry: `scripts/phase4.sh`
- Work: when `task.json.overall_status = awaiting_approval`, re-render the already reviewed draft and block for approval; if approval feedback is provided, spawn a draft-regeneration subagent with the approval feedback, then re-enter the Phase 4 review loop. Otherwise spawn an internal review subagent that reads the draft against `references/summary-review-rubric.md`, applies structural fixes in-place (missing sections, missing tables, missing bullets only), and writes the verdict. Only transitions to `awaiting_approval` when verdict is `accept`. On `return phase4`, increments `task.phase4_round` and re-spawns (max 3 rounds).
- Reference: `references/summary-formatting.md`, `references/summary-review-rubric.md`
- Output:
  - `<feature-key>_QA_SUMMARY_REVIEW.md` — written by LLM subagent
  - `context/phase4_review_notes.md` — per-criterion verdicts
  - `context/phase4_review_delta.md` — verdict
  - `context/review_result.json` — machine-readable result
  - `phase4_spawn_manifest.json`
- User interaction:
  - no approval prompt is shown until review verdict is `accept`
  - print the reviewed draft in chat only after a passing review
  - require explicit `APPROVE` or revision feedback before continuing

### Phase 5

- Entry: `scripts/phase5.sh`
- Work: ask the user whether to skip publish, update an existing Confluence page, or create a new Confluence page; if publish is selected, validate Confluence access, merge Markdown, and publish according to `references/publish-and-notification.md`
- Reference: `references/publish-and-notification.md`
- Output:
  - `context/publish_choice.json`
  - `context/confluence_target.json`
  - `context/runtime_setup_<feature-key>.json`
  - `context/runtime_setup_<feature-key>.md`
  - `<feature-key>_QA_SUMMARY_MERGED.md` when publish is selected
- User interaction:
  - `skip`
  - `update_existing` — requires a Confluence link or exact page ID from the user
  - `create_new` — may optionally accept a parent page link or destination details from the user

### Phase 6

- Entry: `scripts/phase6.sh`
- Work: finalize local artifacts by copying the reviewed draft (post-Phase 4 auto-fix loop) to final output, update terminal timestamps, and send Feishu notification or record `notification_pending`
- Reference: `references/publish-and-notification.md`
- Output:
  - `<feature-key>_QA_SUMMARY_FINAL.md`
  - `task.json`
  - `run.json`
- User interaction:
  - none unless notification delivery fails and the caller chooses to retry immediately

## Automated Resume Policy

Unless the caller explicitly overrides the mode:

- `FINAL_EXISTS` -> `use_existing`
- `DRAFT_EXISTS` -> `resume`
- `CONTEXT_ONLY` -> `generate_from_cache`
- `FRESH` -> `proceed`

## Boundary Exclusions

- No direct Jira or GitHub fetching in this skill
- No silent Confluence publish
- No summary generation without a planner Markdown source
- No deletion of historical summary artifacts; archive only
