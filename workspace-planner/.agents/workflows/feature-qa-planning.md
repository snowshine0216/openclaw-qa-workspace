---
description: Central orchestration workflow for the QA Planner Agent to generate comprehensive QA plans from multiple feature artifacts (Jira, Confluence, GitHub, Figma).
---

# Feature QA Planning Workflow

Use this workflow to ingest feature artifacts (like Jira keys, Confluence URLs, GitHub PRs, and Figma designs) and act as the Master Orchestrator to generate, review, and publish a Test Plan.

## 0. Preparation and Information Confirmation
1. Accept the target Feature ID (e.g. `BCIN-1234`) and related artifacts from the user.
2. Based on the provided artifacts, double confirm with the user the requirements, and raise questions if you have doubts. ONLY proceed with user approval.
3. Ensure the working directory is `projects/feature-plan/<feature-id>`. Scripts run from feature dir use `../scripts/` (e.g. `../scripts/check_resume.sh`).
4. Run `../scripts/check_resume.sh <feature-id>`. Parse `REPORT_STATE` from output. If `DEFECT_ANALYSIS_RESUME` is emitted (when `defect_analysis` was `in_progress` or `pending`), handle per §5 Resume Capability: `COMPLETED` → proceed to Phase 2b; `AWAITING_APPROVAL` → prompt (A) Open for approval / (B) Skip; `NOT_FOUND` → prompt resume or skip.
   - **FINAL_EXISTS**: Display data/output freshness (from output). STOP and present: (A) Use Existing (B) Smart Refresh (C) Full Regenerate. Wait for user choice. If (C), archive `qa_plan_final.md` to `archive/qa_plan_final_<YYYYMMDD>.md` before proceeding.
   - **DRAFT_EXISTS**: STOP and present: (A) Resume to Approval (B) Smart Refresh (C) Full Regenerate. Wait for user choice.
   - **CONTEXT_ONLY**: STOP and present: (A) Generate from Cache (B) Re-fetch + Regenerate. Wait for user choice.
   - **FRESH**: Proceed to step 5.
5. Check resume: If output indicates `RESUMABLE`, skip directly to the `resume_from` phase. Otherwise:
6. If starting fresh, initialize `projects/feature-plan/<feature-id>/task.json` with overall_status `in_progress`, current_phase `context_gathering`, and **`defect_analysis: "not_applicable"`** (always present from the start; state machine: `not_applicable` → `pending` → `in_progress` → `completed` or `skipped`).


## 1. Information Gathering & Context Extraction
*Execute the required CLI context-gathering tools concurrently using bash background jobs, while simultaneously using agent tool calls for specific skills.*

1. **Parallel CLI Execution**: From feature dir `projects/feature-plan/<feature-id>`, use `../scripts/retry.sh` for API calls. Run concurrently:
   ```bash
   (
     ../scripts/retry.sh 3 2 jira issue view <KEY> --format json > context/jira.json &
     ../scripts/retry.sh 3 2 confluence read <URL> > context/confluence.md &

     # One or more PR URLs can be provided.
     # Parse each URL as .../<owner>/<repo>/pull/<id>.
     # Use owner+repo+pr-id filenames to avoid collisions across forks/orgs.
     # Example: https://github.com/owner/repo/pull/123
     #   diff: context/github_owner_repo_pr123.diff
     #   meta: context/github_pr_owner_repo_pr123.json
     # Populate PR_URLS from user input. Keep empty when no GitHub PR URLs are provided.
     PR_URLS=()
     # Example:
     # PR_URLS+=("https://github.com/owner/repo/pull/123")
     # PR_URLS+=("https://github.com/owner/repo/pull/456")
     if [ "${#PR_URLS[@]}" -gt 0 ]; then
       PR_META_FILES=()
       PR_DIFF_FILES=()
       for PR_URL in "${PR_URLS[@]}"; do
         OWNER="$(echo "$PR_URL" | awk -F/ '{print tolower($(NF-3))}')"
         REPO="$(echo "$PR_URL" | awk -F/ '{print tolower($(NF-2))}')"
         PR_ID="$(echo "$PR_URL" | awk -F/ '{print $NF}')"
         META_FILE="context/github_pr_${OWNER}_${REPO}_pr${PR_ID}.json"
         DIFF_FILE="context/github_${OWNER}_${REPO}_pr${PR_ID}.diff"
         PR_META_FILES+=("$META_FILE")
         PR_DIFF_FILES+=("$DIFF_FILE")
         ../scripts/retry.sh 3 2 gh pr view "$PR_URL" --json title,body,commits,files > "$META_FILE" &
         gh pr diff "$PR_URL" > "$DIFF_FILE" &
       done
     fi

     # Always synchronize background jobs (Jira/Confluence and optional GitHub jobs)
     # before leaving Phase 1 fetch.
     wait

     if [ "${#PR_URLS[@]}" -gt 0 ]; then
       # Backward-compatible aliases for downstream consumers:
       # 1) Keep legacy context/github_pr.json as single-PR-shaped payload
       # 2) Aggregate all per-PR diffs into legacy context/github_diff.md
       if [ "${#PR_META_FILES[@]}" -eq 0 ] || [ "${#PR_DIFF_FILES[@]}" -eq 0 ]; then
         echo "ERROR: No GitHub PR artifacts generated from provided PR URLs." >&2
         exit 1
       fi

       if [ "${#PR_META_FILES[@]}" -eq 1 ]; then
         cp "${PR_META_FILES[0]}" context/github_pr.json
       else
         # Preserve legacy schema for old consumers by keeping github_pr.json as a single PR object.
         cp "${PR_META_FILES[0]}" context/github_pr.json
         # Full multi-PR metadata set for updated consumers.
         jq -s '.' "${PR_META_FILES[@]}" > context/github_pr_multi.json
       fi

       if [ "${#PR_DIFF_FILES[@]}" -eq 1 ]; then
         cp "${PR_DIFF_FILES[0]}" context/github_diff.md
       else
         cat "${PR_DIFF_FILES[@]}" > context/github_diff.md
       fi
     fi
   )
   ```
1b. **GitHub Diff Validation** (required when any GitHub PR URL is provided):
   - Build expected PR list from provided PR URLs: each `.../<owner>/<repo>/pull/<id>` maps to:
     - `context/github_<owner>_<repo>_pr<id>.diff` (required)
     - `context/github_pr_<owner>_<repo>_pr<id>.json` (required)
   - Validate each expected per-PR artifact: `missing` or `0 bytes` => FAIL for that PR.
   - Guard against silent partial fetch:
     - non-empty per-PR diff count MUST equal number of PR URLs
     - non-empty per-PR metadata count MUST equal number of PR URLs
   - Validate legacy aliases for downstream compatibility:
     - `context/github_diff.md` must exist and be non-empty when GitHub PR URL(s) are provided.
     - `context/github_pr.json` must exist and be non-empty when GitHub PR URL(s) are provided.
   - For multi-PR runs, `context/github_pr_multi.json` should also exist and be non-empty for full PR coverage checks.
   - If any expected artifact fails validation: STOP and notify user:
     - `"GitHub artifact(s) empty or missing for PR(s): [owner/repo#pr list]. The PR may be inaccessible, the URL may be wrong, or repo auth may be insufficient. Please verify PR URLs/access and retry. Cannot proceed without code changes."`
   - Do NOT proceed to Phase 2a or 2b until all expected GitHub artifacts are non-empty.
   - If no GitHub PR URL is provided, skip this validation entirely (GitHub remains optional).
2. **Figma Context**: Use `agent-browser` (CLI) or `browser-use` with the `qa-plan-figma` skill to extract image contexts and UX expectations (if a Figma URL is provided). Save output to `context/figma.md`.
*(Note: Steps 2 and 3 should be executed via concurrent agent tool calls or subagents while the bash script runs).*
3. Update `task.json` current_phase to `understanding_check`.
4. **Understanding Check & Background Research**:
   - Summarize your current understanding of the feature based on the gathered context so far and present it to the user.
   - Evaluate if additional domain knowledge or background information is needed. If so, prompt the user for permission to execute the `tavily-search` skill.
   - If executed, compile the `tavily-search` output and save it to `projects/feature-plan/<feature-id>/context/qa_plan_background_<feature-id>.md`. Record in `task.json` that background research was completed (e.g. `tavily_supplement: completed`).
   - Alternatively, if user approves, you may defer execution to Phase 2a to run `tavily-search` in parallel with domain skills; in that case record `tavily_supplement: pending`.
   - Wait for user confirmation before proceeding.
5. Update `task.json` phase to `plan_generation`.

## 2a. Parallel Source Analysis
1. Determine which sources exist (Jira and Confluence are always required, Figma/GitHub are optional if not provided).
2. **Defect Analysis (Conditional):**
   - **Idempotency:** If `../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md` exists, STOP and ask: *"Use existing defect report / Re-run defect analysis / Skip defect analysis."* If user chooses **Use existing**, copy the file to `context/qa_plan_defect_analysis_<feature-id>.md`, set `defect_analysis: "completed"` in `task.json`, and skip spawning. If **Re-run** or **Skip**, proceed accordingly.
   - **Auto-Detect:** If not using existing, invoke the shared script (guard: script must exist):
     ```bash
     if [ ! -f "../workspace-reporter/scripts/fetch-defects-for-feature.sh" ]; then
       echo "ERROR: fetch-defects-for-feature.sh not found." >&2
       exit 1
     fi
     cd ../workspace-reporter && scripts/fetch-defects-for-feature.sh <feature-id>
     # Output: DEFECT_COUNT=N
     ```
   - **User Confirmation:** Ask before spawning. *If defects found:* "Detected N defects linked to this feature. Invoke Defect Analysis sub-agent? (Y/n)". *If none:* "No defects automatically detected. Do you want to manually invoke Defect Analysis anyway? (y/N)"
   - **Spawn (if confirmed):** Set `defect_analysis: "pending"` → `in_progress`. Use `sessions_spawn` to launch the Reporter agent with: *"Run the `defect-analysis` workflow for feature `<feature-id>`. Proceed up to and including Phase 5 (User Approval). **Do NOT proceed to Phase 6 (Publish to Confluence).** Exit successfully once the user approves the final report."*
   - **On success:** Copy `../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md` to `context/qa_plan_defect_analysis_<feature-id>.md`. Set `defect_analysis: "completed"`.
   - **Failure handling (non-fatal):** If the Reporter sub-agent fails or the user rejects indefinitely, set `defect_analysis: "skipped"`, surface a warning, and **proceed to Phase 2b** with the remaining domain summaries. The defect analysis task does **not** trigger Phase 2a abort-on-failure.
3. Spawn parallel tasks to run domain-specific skills. **Do not force structural mirroring in output**:
   - `qa-plan-atlassian` -> `projects/feature-plan/<feature-id>/context/qa_plan_atlassian_<feature-id>.md`
   - `qa-plan-figma` -> `projects/feature-plan/<feature-id>/context/qa_plan_figma_<feature-id>.md` (if Figma url present)
   - `qa-plan-github` -> `projects/feature-plan/<feature-id>/context/qa_plan_github_<feature-id>.md` (if GitHub PR present)
   - `qa-plan-github` traceability -> `projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_<feature-id>.md` (if GitHub PR present)
   - `tavily-search` -> `projects/feature-plan/<feature-id>/context/qa_plan_background_<feature-id>.md` (**only if** background research is needed **and** not already executed in Phase 1; check `task.json` `tavily_supplement` or presence of `qa_plan_background_<feature-id>.md`)
   *(To spawn in parallel, execute multiple task tool calls or use `sessions_spawn` if supported).*
4. **Wait for all spawned analysis tasks to complete** — including defect analysis approval. Phase 2b synthesis does **not** start until all parallel tasks (including defect) are done.
5. If any **domain skill** task fails (atlassian, figma, github, tavily), abort and notify the user. Defect analysis failure is handled per step 2 (non-fatal).
6. Update `task.json` phase to `plan_synthesize`.

## 2b. Synthesize QA Plan
1. Update `task.json` current_phase to `strategy_confirmation`.
2. **Strategy Display**: Before synthesizing, explicitly declare the adopted testing strategy to the user. If the feature is not strictly backend-only, emphasize E2E user flows, overall test coverage, and UX with user-facing `Test Key Points`. The strategy declaration MUST include and commit to all 6 rules below, then request user approval before proceeding:
   - R1: No JavaScript/Java function names, flag names, or internal state names in `Test Key Points` and `Expected Results`.
   - R2: Every `Expected Results` sentence must be verifiable from browser UI or browser Network tab, without debugger/console/source-code inspection.
   - R3: Every P0/P1 manual row must have numbered action steps (or Given/When/Then equivalent).
   - R4: Distinct user paths (for example `OK` vs `Cancel`) must be separate rows.
   - R5: Every P0/P1 manual row must include `FAILS if:` in `Expected Results`.
   - R6: Unit/API-only checks must go to `### AUTO: Automation-Only Tests`.
   - Required approval prompt text:
     - `"I will apply R1-R6 during synthesis to produce user-executable Test Key Points. Proceed?"`
3. Call the `qa-plan-synthesize` skill, passing the paths of the generated domain summaries in the `context/` folder, including `qa_plan_background_<feature-id>.md` (if it exists) and **`qa_plan_defect_analysis_<feature-id>.md`** (if defect analysis completed — see Phase 2a).
4. Direct the skill to synthesize the specific domain summaries into a single comprehensive Test Plan following the exact 9-section layout. Map Jira ACs to GitHub Code Changes to build the final `Test Key Points` table, and enforce routing rules:
   - Use GitHub `Test Scope` to route scenarios: XFUNC -> manual user-facing rows; COMP + not user-observable -> `AUTO` section.
   - Incorporate GitHub `E2E Scenarios to Add` into the final plan (do not drop them).
   - Keep code-level references in `Related Code Change` only; keep `Test Key Points` and `Expected Results` user-facing.
5. Save the generated draft to `projects/feature-plan/<feature-id>/drafts/qa_plan_v1.md`.
6. Update `task.json` phase to `review_refactor`.

## 3. Review & Refactor Loop
1. Spawn a sub-agent strictly using the `qa-plan-review` skill. Feed it the **latest draft** (e.g. `drafts/qa_plan_v1.md` — resolve from `task.json` `latest_draft_version` or scan `drafts/qa_plan_v*.md`) and these intermediate artifacts from Phase 2:
   - `projects/feature-plan/<feature-id>/context/jira.json`
   - `projects/feature-plan/<feature-id>/context/github_pr.json`
   - `projects/feature-plan/<feature-id>/context/github_pr_multi.json` (if multiple PRs were provided)
   - `projects/feature-plan/<feature-id>/context/github_pr_*_*_pr*.json` (all per-PR metadata files)
   - `projects/feature-plan/<feature-id>/context/github_diff.md` (legacy alias if present)
   - `projects/feature-plan/<feature-id>/context/github_*_*_pr*.diff` (all per-PR diffs)
   - `projects/feature-plan/<feature-id>/context/qa_plan_github_traceability_<feature-id>.md` (if present)
   - `projects/feature-plan/<feature-id>/context/qa_plan_background_<feature-id>.md` (if it exists)
   *(Note: Do NOT pass `qa_plan_final.md` — it does not exist until Phase 4.)*
2. Ask the reviewer sub-agent to find logical gaps, missing edge cases, untouched requirements, and User Executability violations (UE-1..UE-6). Capture the report artifact path returned by `qa-plan-review` (expected format: `qa_plan_review_<feature_id>_<date>.md`) as `REVIEW_REPORT_PATH`.
3. If review status is `Approved`, update `task.json` phase to `publication`.
4. If review status is `Requires Updates`:
   - Invoke `qa-plan-refactor` skill with the latest draft and `REVIEW_REPORT_PATH`.
   - Re-run `qa-plan-review` on the refactored draft.
   - Maximum 2 refactor rounds. If status is still `Requires Updates` after round 2, stop and return findings to user for manual decision.
   - If status becomes `Approved` in any round, proceed to Phase 4.
5. If review status is `Rejected`, stop and return findings to user; do not auto-publish.

## 4. Publication
1. Copy the final approved draft (latest from `drafts/qa_plan_v*.md`) to `projects/feature-plan/<feature-id>/qa_plan_final.md`. If `qa_plan_final.md` already exists (e.g. from Full Regenerate), archive it first to `archive/qa_plan_final_<YYYYMMDD>.md`.
2. Generate an audit trail / changelog explaining what features and test strategies were captured. Save as `changelog.md`.
3. **Publish markdown directly to Confluence**:
   ```bash
   confluence update <page-id> --file qa_plan_final.md --format markdown
   ```
   **Confluence page ID**: Obtained from user input at start, or stored in `task.json` (e.g. `confluence_page_id`) from a prior run. If unknown, prompt the user before publishing.
   Publish markdown directly with `--format markdown`.
4. **Verify publication**: Check that page renders correctly with formatted tables and headers.
5. Update `task.json` phase to `confluence_review`.

## 5. Confluence Content Review
1. Spawn a sub-agent using the `qa-plan-confluence-review` skill. Pass it:
   - The Confluence page ID (from user input or `task.json` `confluence_page_id`)
   - `projects/feature-plan/<feature-id>/context/jira.json`
   - `projects/feature-plan/<feature-id>/context/github_pr.json`
   - `projects/feature-plan/<feature-id>/context/github_pr_multi.json` (if multiple PRs were provided)
   - `projects/feature-plan/<feature-id>/context/github_pr_*_*_pr*.json` (all per-PR metadata files)
   - `projects/feature-plan/<feature-id>/context/github_diff.md`
   - `projects/feature-plan/<feature-id>/context/github_*_*_pr*.diff` (all per-PR diffs)
   - `projects/feature-plan/<feature-id>/context/qa_plan_background_<feature-id>.md` (if it exists)
   - `projects/feature-plan/<feature-id>/qa_plan_final.md`
2. The skill will review the live Confluence page across three axes: **Formatting**, **Structure**, and **Cross-Artifact Accuracy**.
3. Save the review output to `projects/feature-plan/<feature-id>/qa_plan_confluence_review.md`.
4. **If FAIL (generation fix required):** Return to Phase 3 (Review & Refactor) with the specific fix list from the review file. Re-run Phase 4 after fixes.
5. **If FAIL (Confluence-side manual fixes):** Present the corrected text to the user. Wait for confirmation before proceeding.
6. **If PASS:** Surface any warnings to the user for awareness (do not block).
7. Update `task.json` phase to `completed` and mark overall_status as `completed`.
