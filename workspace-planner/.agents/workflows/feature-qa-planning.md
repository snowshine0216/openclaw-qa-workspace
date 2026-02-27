---
description: Central orchestration workflow for the QA Planner Agent to generate comprehensive QA plans from multiple feature artifacts (Jira, Confluence, GitHub, Figma).
---

# Feature QA Planning Workflow

Use this workflow to ingest feature artifacts (like Jira keys, Confluence URLs, GitHub PRs, and Figma designs) and act as the Master Orchestrator to generate, review, and publish a Test Plan.

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
*(Note: Steps 2 and 3 should be executed via concurrent agent tool calls or subagents while the bash script runs).*
4. **Update Freshness**: Update `task.json` with `data_fetched_at` (ISO timestamp) and update `subtask_timestamps` for each fetched source (e.g., `jira`, `confluence`, `github`, `figma`).
5. Update `task.json` phase to `plan_generation`.

## 2a. Parallel Source Analysis
1. Determine which sources exist (Jira and Confluence are always required, Figma/GitHub are optional if not provided).
2. **Sub-Task Staleness Check**: Check `task.json` for completed sub-tasks. Only re-run domain analyses whose output is missing or whose source data has changed (e.g., re-run `qa-plan-atlassian` only if Jira/Confluence fetched data changed).
3. Spawn parallel tasks to run domain-specific skills for missing/stale analyses. **Do not force structural mirroring in output**:
   - `qa-plan-atlassian` -> `projects/feature-plan/<feature-id>/context/qa_plan_atlassian_<feature-id>.md`
   - `qa-plan-figma` -> `projects/feature-plan/<feature-id>/context/qa_plan_figma_<feature-id>.md` (if Figma URL is present)
   - `qa-plan-github` -> `projects/feature-plan/<feature-id>/context/qa_plan_github_<feature-id>.md` (if GitHub PR is present)
   *(To spawn in parallel, execute multiple task tool calls or use `sessions_spawn` if supported).*
4. Wait for all spawned analysis tasks to complete. If any task fails, abort and notify the user. 
5. Update `task.json` with `subtask_timestamps` for each completed domain analysis (`qa-plan-atlassian`, `qa-plan-figma`, `qa-plan-github`) and update phase to `plan_synthesize`.

## 2b. Synthesize QA Plan
1. Call the `qa-plan-synthesize` skill, passing the paths of the generated domain summaries in the `context/` folder.
2. Direct the skill to synthesize the specific domain summaries into a single comprehensive Test Plan following the exact 9-section layout. Map Jira ACs to GitHub Code Changes to build the final `Test Key Points` table.
3. Use dynamic versioning for drafts: Determine the latest draft number `<N>`. Save the generated draft to `projects/feature-plan/<feature-id>/drafts/qa_plan_v<N+1>.md` (e.g., `v1` if starting fresh).
4. Track `latest_draft_version` in `task.json` and update phase to `review_refactor`.

## 3. Review & Refactor Loop
1. Spawn a sub-agent strictly using the `qa-plan-review` skill. Feed it the latest draft `drafts/qa_plan_v<N>.md` (determined from `task.json`), and below intermediate artifacts generated in phase 2:
   - `projects/feature-plan/<feature-id>/context/jira.json`
   - `projects/feature-plan/<feature-id>/context/github_pr.json`
   - `projects/feature-plan/<feature-id>/context/github_diff.md`
   - `projects/feature-plan/<feature-id>/qa_plan_final.md` (if exists from previous runs)
2. Ask the reviewer sub-agent to find any logical gaps, missing edge cases, or untouched requirements. Produce a `review_feedback.md`.
3. If issues are found, optionally archive the old draft to `archive/qa_plan_draft_<YYYYMMDD>_v<N>.md` and amend the latest draft to a new version `drafts/qa_plan_v<N+1>.md` based on review results. Update `latest_draft_version` in `task.json`.
4. Update `task.json` phase to `publication`.

## 4. Publication
1. Before writing, if `projects/feature-plan/<feature-id>/qa_plan_final.md` already exists, move it to `archive/qa_plan_final_<YYYYMMDD-HHMMSS>.md` to avoid silent overwrites.
2. Copy the final approved draft (`qa_plan_v<N>.md`) to `projects/feature-plan/<feature-id>/qa_plan_final.md`.
3. Generate an audit trail / changelog explaining what features and test strategies were captured. Append to `changelog.md` with an idempotency check (only append if current phase changes aren't already recorded), or explicitly overwrite per run.
4. **Convert Markdown to Confluence format** (CRITICAL): Run from workspace-planner root:
   ```bash
   node scripts/confluence/md-to-confluence.js \
     projects/feature-plan/<feature-id>/qa_plan_final.md \
     projects/feature-plan/<feature-id>/qa_plan_confluence.html
   ```
5. **Publish to Confluence with storage format**:
   ```bash
   confluence update <page-id> \
     --file projects/feature-plan/<feature-id>/qa_plan_confluence.html \
     --format storage
   ```
   **⚠️ NEVER publish raw Markdown** - Confluence requires HTML storage format!
6. **Verify publication**: Check that page renders correctly with formatted tables and headers.
7. Update `task.json` with `output_generated_at` (ISO timestamp) and phase to `confluence_review`. **Schema**: Include `data_fetched_at`, `output_generated_at`, `subtask_timestamps`, `latest_draft_version` — see `projects/feature-plan/docs/DESIGN_ENHANCEMENTS.md` §3.2.

## 5. Confluence Content Review
1. Spawn a sub-agent using the `qa-plan-confluence-review` skill. Pass it:
   - The Confluence page ID (from `task.json` or `run.json`)
   - `projects/feature-plan/<feature-id>/context/jira.json`
   - `projects/feature-plan/<feature-id>/context/github_pr.json`
   - `projects/feature-plan/<feature-id>/context/github_diff.md`
   - `projects/feature-plan/<feature-id>/qa_plan_final.md`
2. The skill will review the live Confluence page across three axes: **Formatting**, **Structure**, and **Cross-Artifact Accuracy**.
3. Save the review output using versioning: `projects/feature-plan/<feature-id>/qa_plan_confluence_review_v<N>.md` (or append to a single file with timestamps) to ensure iterative improvements are traceable. If cached data was used due to API failure earlier, embed a staleness warning in the review output header.
4. **If FAIL (generation fix required):** Explicitly update `task.json` phase to `review_refactor` and return to Phase 3 (Review & Refactor) with the specific fix list from the review file. Re-run subsequent phases after fixes.
5. **If FAIL (Confluence-side manual fixes):** Present the corrected text to the user. Wait for confirmation before proceeding.
6. **If PASS:** Surface any warnings to the user for awareness (do not block).
7. Update `task.json` phase to `completed` and mark overall_status as `completed`.