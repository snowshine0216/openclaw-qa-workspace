---
description: Central orchestration workflow for the QA Planner Agent to generate comprehensive QA plans from multiple feature artifacts (Jira, Confluence, GitHub, Figma).
---

# Feature QA Planning Workflow

Use this workflow to ingest feature artifacts (like Jira keys, Confluence URLs, GitHub PRs, and Figma designs) and act as the Master Orchestrator to generate, review, and publish a Test Plan.

**Global rule:** All phases (0–5) must be executed in order; none may be silently skipped. Notify the user after each phase before advancing.

## 0. Preparation and Information Confirmation
1. Accept the target Feature ID (e.g. `BCIN-1234`) and related artifacts from the user.
2. Based on the provided artifacts, double confirm with user the requirements, and raise questions if you have doubts. ONLY proceed with user approval.
3. Ensure the working directory is `projects/feature-plan/<feature-id>`.
4. From `projects/feature-plan/`, run `./scripts/check_resume.sh <feature-id>`. Parse the output for `REPORT_STATE` (FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH) and freshness timestamps.
5. **Phase 0a: Tiered Existence Check (Idempotency)**: Before any external call, classify current state:
   - If `qa_plan_final.md` exists: Display freshness (`output_generated_at` from `task.json`). Offer options: **Use Existing / Smart Refresh / Full Regenerate**.
   - If a draft exists (no final): Offer options: **Resume to Approval / Smart Refresh / Full Regenerate**.
   - If only `context/` data exists (no output): Display data age (`data_fetched_at`). Offer options: **Generate from Cache / Re-fetch + Regenerate**.
   - If `task.json` is missing or corrupted with partial cache on disk: Reconstruct minimal state. Offer: "Resume from inferred state or restart from scratch?"
   - **Do not proceed until the user chooses an option.**
6. If "Full Regenerate" is chosen and final exists: Move `qa_plan_final.md` to `archive/qa_plan_final_<YYYYMMDD-HHMMSS>.md` before proceeding. If data is < 1 hour old, warn and require explicit confirmation.
7. If starting fresh or "Full Regenerate" is confirmed, explicitly clear `projects/feature-plan/<feature-id>/context/` if it exists. Reinitialize `task.json` with `overall_status` `in_progress` and `current_phase` `context_gathering`.

## 1. Information Gathering & Context Extraction
*Execute the required CLI context-gathering tools concurrently using bash background jobs, while simultaneously using agent tool calls for specific skills.*

1. **Cleanup on Full Re-fetch**: If this is a full re-fetch, clear `projects/feature-plan/<feature-id>/context/*` first to avoid stale artifacts from removed optional sources.
2. **Parallel CLI Execution**: Use bash background jobs (`&`) and `wait` to fetch Jira, Confluence, and GitHub artifacts concurrently:
   ```bash
   # Run from projects/feature-plan/<feature-id>/; scripts are in ../scripts/
   (
     ../scripts/retry.sh 3 2 jira issue view <KEY> --format json > context/jira.json & 
     ../scripts/retry.sh 3 2 confluence read <URL> > context/confluence.md & 
     ../scripts/retry.sh 3 2 gh pr view <URL> --json title,body,commits,files > context/github_pr.json & 
     gh pr diff <URL> > context/github_diff.md &
     wait
   )
   ```
3. **Figma Context**: Use `agent-browser` (CLI) or `browser-use` with the `qa-plan-figma` skill to extract image contexts and UX expectations (if a Figma URL is provided). Save output to `context/figma.md`.
4. **Update Freshness**: Update `task.json` with `data_fetched_at` (ISO timestamp) and update `subtask_timestamps` for each fetched source (e.g., `jira`, `confluence`, `github`, `figma`).
5. Update `task.json` phase to `plan_generation`.
6. **Notify the user** when context gathering is complete. Do not silently skip to the next phase.

## 2a. Parallel Domain Analysis (Spawn Sessions)
1. Determine which sources exist (Jira and Confluence are always required, Figma/GitHub are optional if not provided).
2. **Sub-Task Staleness Check**: Check `task.json` for completed sub-tasks. Only re-run domain analyses whose output is missing or whose source data has changed.
3. **Spawn 2 (or more) Sessions for Parallel Analysis**: *Do not spawn sub-agents.* Spawn separate sessions with tasks such as:
   - Session A task: "Follow `qa-plan-atlassian` skill, analyze `context/jira.json` + `context/confluence.md`, output to `projects/feature-plan/<feature-id>/context/qa_plan_atlassian_<feature-id>.md`"
   - Session B task: "Follow `qa-plan-github` skill, analyze `context/github_diff.md` + `context/github_pr.json`, output to `projects/feature-plan/<feature-id>/context/qa_plan_github_<feature-id>.md`" (if PR is present)
4. Wait for all spawned sessions to complete. If any session fails, abort and notify the user. 
5. Update `task.json` with `subtask_timestamps` for each completed domain analysis (`qa-plan-atlassian`, `qa-plan-github`, etc.) and update phase to `plan_synthesize`.
6. **Notify the user** when parallel domain analysis is complete. Do not silently skip.

## 2b. Synthesize QA Plan
1. Read the `qa-plan-synthesize` SKILL.md and follow it explicitly.
2. Merge all domain summaries from `context/` into a single comprehensive QA plan following the exact 9-section layout. Map Jira ACs to GitHub Code Changes to build the final `Test Key Points` table.
3. Use dynamic versioning for drafts: Determine the latest draft number `<N>`. Save the generated draft to `projects/feature-plan/<feature-id>/drafts/qa_plan_v<N+1>.md`.
4. Track `latest_draft_version` in `task.json` and update phase to `review_refactor`.
5. **Notify the user** when synthesis is complete. Do not silently skip.

## 3. Pre-Publish Review & Refactor Loop
1. **Spawn a session for review**: *Do not spawn a sub-agent.* Spawn a new session with the task: "Follow `qa-plan-review` skill, review `drafts/qa_plan_v<N>.md` against context artifacts, output `projects/feature-plan/<feature-id>/drafts/review_feedback.md`". 
   - Feed it `jira.json`, `github_pr.json`, `github_diff.md`, and any existing `qa_plan_final.md`.
2. Wait for the review session to complete and produce `review_feedback.md`.
3. If issues are found, optionally archive the old draft and amend the latest draft to a new version `drafts/qa_plan_v<N+1>.md` based on review results. Update `latest_draft_version` in `task.json`.
4. Update `task.json` phase to `publication`.
5. **Notify the user** with the review results before proceeding to Publication. Wait for confirmation. Do not silently skip.

## 4. Publication
1. **Archive existing content**: Before writing, if `projects/feature-plan/<feature-id>/qa_plan_final.md` already exists, move it to `archive/qa_plan_final_<YYYYMMDD-HHMMSS>.md` to avoid silent overwrites.
2. Copy the final approved draft (`qa_plan_v<N>.md`) to `projects/feature-plan/<feature-id>/qa_plan_final.md`.
3. Generate an audit trail / changelog explaining what features and test strategies were captured. Append to `changelog.md` with an idempotency check, or explicitly overwrite per run.
4. **Convert Markdown to Confluence HTML** (CRITICAL): Run from workspace-planner root:
   ```bash
   node scripts/confluence/md-to-confluence.js \
     projects/feature-plan/<feature-id>/qa_plan_final.md \
     projects/feature-plan/<feature-id>/qa_plan_confluence.html
   ```
5. **Publish to Confluence**: Update the existing page using storage format:
   ```bash
   confluence update <page-id> \
     --file projects/feature-plan/<feature-id>/qa_plan_confluence.html \
     --format storage
   ```
   **⚠️ NEVER publish raw Markdown** - Confluence requires HTML storage format!
6. Verify publication: Check that page renders correctly. Update `task.json` phase to `confluence_review` and record `output_generated_at`.
7. **Notify the user** when publication is done. Do not silently skip.

## 5. Post-Publish Confluence Content Review
1. **Spawn a session for Confluence review**: *Do not spawn a sub-agent.* Spawn a new session with the task: "Follow `qa-plan-confluence-review` skill, review live page `<page-id>` against artifacts". Pass it the existing contexts.
2. Save the review output using versioning: `projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md`.
3. **If FAIL (generation fix required):** Explicitly update `task.json` phase to `review_refactor`, fix the draft, and republish.
4. **If FAIL (Confluence-side manual fixes):** Present the corrected text to the user. Wait for confirmation.
5. **If PASS:** Update `task.json` phase to `completed` and mark overall_status as `completed`.
6. **Notify the user** with the final result. Do not silently skip.