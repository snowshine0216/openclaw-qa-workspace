---
name: feature-qa-planning-orchestrator
description: Canonical workspace-planner entrypoint for end-to-end QA plan generation. Orchestrates Phase 0 idempotency, context gathering, parallel domain analysis, synthesis, review/refactor, publication, and live Confluence review.
---

# Feature QA Planning Orchestrator

This skill is the canonical replacement for the removed legacy `feature-qa-planning` workflow file.

## When to Use

Use this skill when the user provides a feature key and one or more artifacts such as:
- Jira issue key
- Confluence design URL
- GitHub PR URL(s)
- Figma URL
- Background research notes

## Required Inputs

- `feature_id`: issue key such as `BCIN-6709`
- `jira_key`: usually same as `feature_id`
- `confluence_url`: optional but strongly recommended
- `github_pr_urls`: optional array of PR URLs
- `figma_url`: optional
- `background_context_path`: optional path under `context/`

Working directory:
- `workspace-planner/projects/feature-plan/<feature-id>/`

## Core Rules

- Always start with Phase 0 by running `../scripts/check_resume.sh <feature-id>` from the feature directory.
- Respect `REPORT_STATE` exactly: `FINAL_EXISTS`, `DRAFT_EXISTS`, `CONTEXT_ONLY`, `FRESH`.
- Never silently choose a destructive path.
- Archive before overwrite.
- Reuse shared skills directly: `jira-cli`, `confluence`, `feishu-notify`.
- Reuse planner-local skills directly: `qa-plan-atlassian`, `qa-plan-github`, `qa-plan-figma`, `qa-plan-synthesize`, `qa-plan-review`, `qa-plan-refactor`, `qa-plan-confluence-review`.
- Keep code/internal details out of manual QA rows; user-facing outcomes belong in `Test Key Points` and `Expected Results`.

## Workflow

### Phase 0 — Existing-State Check and Preparation

1. Confirm user intent and summarize the provided artifacts.
2. Run `../scripts/check_resume.sh <feature-id>`.
3. Parse `REPORT_STATE` and stop for user choice when prior artifacts exist:
   - `FINAL_EXISTS` → `Use Existing | Smart Refresh | Full Regenerate`
   - `DRAFT_EXISTS` → `Resume | Smart Refresh | Full Regenerate`
   - `CONTEXT_ONLY` → `Generate from Cache | Re-fetch + Regenerate`
   - `FRESH` → proceed
4. If `DEFECT_ANALYSIS_RESUME` is emitted, follow the resume guidance before moving on.
5. Initialize or update `task.json` and `run.json` additively.

Required `task.json` fields:
```json
{
  "run_key": "BCIN-6709",
  "overall_status": "in_progress",
  "current_phase": "phase_1_context_acquisition",
  "defect_analysis": "not_applicable",
  "latest_draft_version": null,
  "subtask_timestamps": {},
  "phases": {}
}
```

Required `run.json` fields:
```json
{
  "data_fetched_at": null,
  "output_generated_at": null,
  "notification_pending": null,
  "updated_at": null
}
```

### Phase 1 — Context Acquisition and Normalization

1. Set `task.json.current_phase` to `phase_1_context_acquisition`; set `task.json.phases.context_gathering.status` to `in_progress`; update `task.json.updated_at`.
2. Fetch Jira and Confluence context.
3. Fetch each GitHub PR into per-PR artifacts:
   - `context/github_pr_<owner>_<repo>_pr<id>.json`
   - `context/github_<owner>_<repo>_pr<id>.diff`
4. Maintain legacy aliases only as downstream compatibility artifacts while consumers still need them:
   - `context/github_pr.json`
   - `context/github_diff.md`
5. Validate that each required per-PR artifact exists and is non-empty.
6. Update freshness timestamps in `run.json` and `task.json.subtask_timestamps`.
7. When Phase 1 completes successfully, set `task.json.phases.context_gathering.status` to `completed`, record its completion timestamp, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_2_domain_analysis`.

### Phase 2 — Parallel Domain Analysis and Defect Enrichment

1. Set `task.json.current_phase` to `phase_2_domain_analysis`; keep `task.json.overall_status` as `in_progress`; update `task.json.updated_at`.
2. Run planner-local analysis skills in parallel when relevant:
   - `qa-plan-atlassian`
   - `qa-plan-github`
   - `qa-plan-figma`
3. Handle defect-analysis integration using the reporter workspace contract.
4. If an approved defect report exists, copy it to:
   - `context/qa_plan_defect_analysis_<feature-id>.md`
5. Defect-analysis failure is non-fatal; mark `defect_analysis` as `skipped` and continue with a warning.
6. Do not start synthesis until required parallel tasks finish.
7. Record Phase 2 completion in `task.json.subtask_timestamps`, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_3_synthesis`.

### Phase 3 — Synthesis and Draft Creation

1. Set `task.json.current_phase` to `phase_3_synthesis`; set `task.json.phases.plan_generation.status` to `in_progress`; update `task.json.updated_at`.
2. Invoke `qa-plan-synthesize` with all domain summaries and optional defect analysis.
3. Require translation of code facts into user-facing behavior before any manual QA row is written.
4. Route automation-only checks into `### AUTO: Automation-Only Tests`.
5. Run the self-healing User Executability check before saving.
6. Save to the next dynamic draft path:
   - `drafts/qa_plan_v<N+1>.md`
7. Update `task.json.latest_draft_version`.
8. When the draft is written successfully, set `task.json.phases.plan_generation.status` to `completed`, record the draft path in the phase output fields, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_4_review_refactor`.

### Phase 4 — Review and Refactor Loop

1. Set `task.json.current_phase` to `phase_4_review_refactor`; set `task.json.phases.review_refactor.status` to `in_progress`; update `task.json.updated_at`.
2. Run `qa-plan-review` on the latest draft and context.
3. If status is `Requires Updates`, run `qa-plan-refactor`, then review again.
4. Maximum automatic refactor rounds: 2.
5. If status remains unresolved after 2 rounds, keep `task.json.phases.review_refactor.status` as `failed`, add the blocking findings to `task.json.errors`, update `task.json.updated_at`, and return findings to the user.
6. Never publish on `Rejected`; if rejected, keep `task.json.overall_status` as `in_progress` or `failed` according to the blocker and do not advance phases.
7. When review passes, set `task.json.phases.review_refactor.status` to `completed`, record the final iteration count, update `task.json.updated_at`, and advance `task.json.current_phase` to `phase_5_publication_live_review`.

### Phase 5 — Publication and Live Review

1. Set `task.json.current_phase` to `phase_5_publication_live_review`; set `task.json.phases.publication.status` to `in_progress`; update `task.json.updated_at`.
2. Archive existing `qa_plan_final.md` before overwrite.
3. Copy the latest approved draft to `qa_plan_final.md`.
4. Update `run.json.output_generated_at`.
5. Publish directly with `confluence` using Markdown mode.
6. Run `qa-plan-confluence-review` and save versioned review artifacts:
   - `qa_plan_confluence_review_v<N>.md`
7. Branch on the live review verdict before any completion notification:
   - pass → continue to notification and completion
   - generation fix required → stop, keep `task.json.phases.publication.status` as `failed`, update `task.json.updated_at`, and loop back to Phase 3 or Phase 4 with the returned fix list
   - Confluence-only manual fix required → stop, keep `task.json.phases.publication.status` as `failed`, persist the manual fix instructions, and wait for the human to confirm the page is fixed before re-running Phase 5
8. If publication or notification cannot finish, persist retry data to `run.json.notification_pending` and do not mark the run complete.
9. Use `feishu-notify` directly for final notification only after the live review passes.
10. After successful notification, clear `run.json.notification_pending`, set `task.json.phases.publication.status` to `completed`, set `task.json.current_phase` to `completed`, set `task.json.overall_status` to `completed`, and update completion timestamps in both `task.json` and `run.json`.

## Handoff Artifacts

Required planner outputs:
- `workspace-planner/projects/feature-plan/<feature-id>/task.json`
- `workspace-planner/projects/feature-plan/<feature-id>/run.json`
- `workspace-planner/projects/feature-plan/<feature-id>/drafts/qa_plan_v<N>.md`
- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_final.md`
- `workspace-planner/projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md`

## Validation

Before considering the run complete:
```bash
cd workspace-planner/projects/feature-plan/<feature-id>
../scripts/check_resume.sh <feature-id>
jq -r '.current_phase,.latest_draft_version,.defect_analysis' task.json
jq -r '.data_fetched_at,.output_generated_at,.notification_pending' run.json
ls drafts/qa_plan_v*.md
```

## Related Skills

- `qa-plan-atlassian`
- `qa-plan-github`
- `qa-plan-figma`
- `qa-plan-synthesize`
- `qa-plan-review`
- `qa-plan-refactor`
- `qa-plan-confluence-review`
- `jira-cli`
- `confluence`
- `feishu-notify`
