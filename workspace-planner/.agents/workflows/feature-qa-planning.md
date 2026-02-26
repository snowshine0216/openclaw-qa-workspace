---
description: Central orchestration workflow for the QA Planner Agent to generate comprehensive QA plans from multiple feature artifacts (Jira, Confluence, GitHub, Figma).
---

# Feature QA Planning Workflow

Use this workflow to ingest feature artifacts (like Jira keys, Confluence URLs, GitHub PRs, and Figma designs) and act as the Master Orchestrator to generate, review, and publish a Test Plan.

## 0. Preparation and Information Confirmation
1. Accept the target Feature ID (e.g. `BCIN-1234`) and related artifacts from the user.
2. Based on the provided artifects, double confirm with user the requirements, and raise questions if you have doubts. ONLY proceed with user approval
2. Ensure the working directory is `projects/feature-plan/<feature-id>`.
3. Run `scripts/check_resume.sh <feature-id>` to determine if there is an in-progress `task.json` that you can resume. If so, skip directly to the `resume_from` phase.
4. If starting fresh, initialize `projects/feature-plan/<feature-id>/task.json` with overall_status `in_progress` and current_phase `context_gathering`.


## 1. Information Gathering & Context Extraction
*Run the CLI tools (these should ideally run in parallel) and save outputs to `projects/feature-plan/<feature-id>/context/`.*
1. **Jira**: Use `scripts/retry.sh 3 2 jira issue view <KEY> --format json > context/jira.json`
2. **Confluence**: Extract PRDs via `scripts/retry.sh 3 2 confluence read <URL> > context/confluence.md` (if Confluence link provided).
3. **GitHub**: Use `scripts/retry.sh 3 2 gh pr view <URL> --json title,body,commits,files > context/github_pr.json` and `gh pr diff <URL> > context/github_diff.md`
4. **Figma**: Use `agent-browser` (CLI) or `browser-use` with `qa-plan-figma` skill to extract image contexts and UX expectations (if Figma URL provided).
5. Update `task.json` phase to `plan_generation`.

## 2. QA Plan Architecture Generation
1. Call the `qa-plan-architect-orchestrator` skill, passing the context files gathered in the `context/` folder.
2. Direct the skill to synthesize the contexts into a master Test Plan covering Business Context, UX design validation, AC validation, Performance, Security, etc.
3. Save the generated draft to `projects/feature-plan/<feature-id>/drafts/qa_plan_v1.md`.
4. Update `task.json` phase to `review_refactor`.

## 3. Review & Refactor Loop
1. Spawn a sub-agent strictly using the `qa-plan-review` skill. Feed it `drafts/qa_plan_v1.md` and the initial requirements context.
2. Ask the reviewer sub-agent to find any logical gaps, missing edge cases, or untouched requirements. Produce a `review_feedback.md`.
3. If issues are found, use the `qa-plan-refactor` skill to amend `drafts/qa_plan_v1.md` to `drafts/qa_plan_v2.md`.
4. Update `task.json` phase to `publication`.

## 4. Publication
1. Copy the final approved draft to `projects/feature-plan/<feature-id>/qa_plan_final.md`.
2. Generate an audit trail / changelog explaining what features and test strategies were captured. Save as `changelog.md`.
3. **Convert Markdown to Confluence format** (CRITICAL):
   ```bash
   node scripts/confluence/md-to-confluence.js \
     projects/feature-plan/<feature-id>/qa_plan_final.md \
     projects/feature-plan/<feature-id>/qa_plan_confluence.html
   ```
4. **Publish to Confluence with storage format**:
   ```bash
   confluence update <page-id> \
     --file projects/feature-plan/<feature-id>/qa_plan_confluence.html \
     --format storage
   ```
   **⚠️ NEVER publish raw Markdown** - Confluence requires HTML storage format!
5. **Verify publication**: Check that page renders correctly with formatted tables and headers.
6. Update `task.json` phase to `completed` and mark overall_status as `completed`