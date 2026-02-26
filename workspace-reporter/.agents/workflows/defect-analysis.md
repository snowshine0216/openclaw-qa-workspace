---
description: Run defect analysis for a Jira feature, JQL query, or release version. Generates standardized QA risk reports. Always confirms with user before proceeding to next phases.
---

# Defect Analysis Workflow

Use this workflow to ingest a Jira feature issue key, JQL query, or **release version** (e.g., 26.03), analyze linked defects per feature, fetch and analyze PRs in parallel, and produce standardized QA Risk & Defect Analysis Reports (one per feature).

**⚠️ User Confirmation Principle:** Before any future action, always confirm with the user. Never make self-decisions without explicit approval. See REPORTER_AGENT_DESIGN.md Section 1.1.

> **Design Reference:** See `projects/docs/REPORTER_AGENT_DESIGN.md` for the full design specification.
> **Report Format Reference:** See `skills/defect-analysis-reporter/SKILL.md` for the exact output structure.

---

## 0. Preparation & Resume Check

1. Accept from the user: a Feature ID (e.g., `BCIN-1234`), JQL query, or **release version** (e.g., `26.03`).
2. **Confirm with user** before proceeding — raise questions if anything is unclear. **Do not proceed without approval.**
3. **Load Jira credentials** from workspace `.env` before any jira-cli call (see `skills/jira-cli/references/issue-search.md`). System profile may not have the current token.
4. Set working directory: `projects/defects-analysis/<FEATURE_KEY>/` (single) or `projects/defects-analysis/release_<VERSION>/` (release-scoped).
5. **Report Status Check + Resume Check** — run before any API call:
   ```bash
   scripts/check_resume.sh <FEATURE_KEY>
   # or
   scripts/check_resume.sh release_<VERSION>
   ```
   Read the `REPORT_STATE=` line from output and act accordingly:

   | `REPORT_STATE` | Required Action |
   |---|---|
   | `FINAL_EXISTS` | **STOP.** Present freshness info. Ask: **(A) Use Existing — (B) Smart Refresh — (C) Full Regenerate** |
   | `DRAFT_EXISTS` | **STOP.** Present draft date. Ask: **(A) Resume to Approval — (B) Smart Refresh — (C) Full Regenerate** |
   | `CONTEXT_ONLY` | **STOP.** Present data age + PR count. Ask: **(A) Generate from Cache — (B) Re-fetch Jira + Regenerate** |
   | `FRESH` | Proceed normally to step 6 |

   **If user picks an option that involves archiving** (Smart Refresh, Full Regenerate, Generate from Cache):
   ```bash
   scripts/archive_report.sh <FEATURE_KEY> FINAL   # exit 2 = nothing to archive, that's fine
   scripts/archive_report.sh <FEATURE_KEY> DRAFT   # exit 2 = nothing to archive, that's fine
   ```
   **Guard**: If data age is < 1 hour and user picks Full Regenerate, warn and require explicit re-confirmation.

6. If starting fresh or after a Full Regenerate:
   - **Single-feature:** Create `projects/defects-analysis/<FEATURE_KEY>/context/jira_issues/`, `context/prs/`, and `archive/`
   - **Release-scoped:** Create `projects/defects-analysis/release_<VERSION>/context/` and initialize `batch_task.json` with `feature_keys[]`, `completed_features[]`; create per-feature dirs after user confirms list in Phase 0a
   - Initialize `task.json` (or `batch_task.json`):
     ```json
     {
       "feature_key": "<FEATURE_KEY>",
       "overall_status": "in_progress",
       "current_phase": "context_gathering",
       "processed_defects": 0,
       "total_defects": 0,
       "processed_prs": 0,
       "total_prs": 0,
       "failed_prs": [],
       "jira_fetched_at": null,
       "report_generated_at": null,
       "report_approved_at": null,
       "pr_analysis_timestamps": {},
       "archive_log": []
     }
     ```

---

## 0a. Release Discovery (if release version given)

*Goal: Fetch feature keys. **STOP and confirm with user before defect analysis.***

1. Run JQL with pagination:
   ```bash
   scripts/retry.sh 3 2 jira issue list \
     --jql '"QA Owner[User Picker (single user)]" = currentUser() AND "Release[Version Picker (single version)]" = <VERSION> AND type = Feature' \
     --format json --paginate 50 \
     > projects/defects-analysis/release_<VERSION>/context/features_raw.json
   ```
2. Parse the feature list. For each feature key, run `scripts/check_resume.sh <FEATURE_KEY>` and collect the `REPORT_STATE` output.
3. **STOP. Present the feature state matrix and ask user:**
   ```
   Feature State Summary for Release <VERSION>:

   | Feature    | State           | Last Report    | Default Action       |
   |------------|-----------------|----------------|----------------------|
   | BCIN-5809  | ✅ Final         | 2026-01-28     | Skip (use existing)  |
   | BCIN-5810  | 📝 Draft only    | 2026-02-10     | Resume to approval   |
   | BCIN-5811  | 🔄 Context only  | 2026-02-12     | Generate from cache  |
   | BCIN-5812  | 🆕 Fresh         | —              | Full analysis        |
   ...
   Plan: X skipped, Y resumed, Z from cache, N fresh. Estimated API calls: ~A Jira + ~B GitHub.
   ```
   > *"Proceed with the default plan, regenerate all, or customize per-feature?"*
4. **Do NOT run Phase 1 until user explicitly confirms.**

---

## 0b. Project Discovery (Always Run)

*Goal: Fetch all accessible Jira projects and cache their keys. Used by Phase 1 JQL to ensure no projects are missed.*

1. Check cache freshness:
   ```bash
   CACHE_FILE="projects/defects-analysis/.cache/project_keys.txt"
   CACHE_JSON="projects/defects-analysis/.cache/jira_projects.json"

   if [ -f "$CACHE_FILE" ] && [ $(( $(date +%s) - $(date -r "$CACHE_FILE" +%s) )) -lt 86400 ]; then
     echo "✅ Using cached project list (< 24h old)"
   else
     echo "🔄 Fetching project list from Jira..."
     mkdir -p projects/defects-analysis/.cache
     scripts/retry.sh 3 2 jira project list --format json \
       > "$CACHE_JSON"
     jq -r '.[].key' "$CACHE_JSON" > "$CACHE_FILE"
     echo "✅ Cached $(wc -l < "$CACHE_FILE") projects to $CACHE_FILE"
   fi
   ```
2. Verify `project_keys.txt` is non-empty. If empty, check Jira credentials and retry.
3. The cache lives at `projects/defects-analysis/.cache/` (shared across all analyses, gitignored).

**Note:** Re-fetch the cache if you suspect new projects have been added, or if the cache is stale. Run `rm "$CACHE_FILE"` to force a refresh.

---

## 1. Jira Extraction (Scalable)

*Goal: Fetch all defects associated with the feature(s).*

**Prerequisite:** Source Jira credentials from workspace `.env` before any jira-cli call. See `skills/jira-cli/references/issue-search.md`. Phase 0b must have run to populate `project_keys.txt`.

**Single-feature mode:**
1. Load project keys from cache, then run with retry (page size 50). Use cross-project JQL (linkedIssues fails across projects — see jira-cli references):
   ```bash
   # Load all project keys from Phase 0b cache
   PROJECT_KEYS=$(cat projects/defects-analysis/.cache/project_keys.txt | tr '\n' ',' | sed 's/,$//')

   scripts/retry.sh 3 2 jira issue list \
     --jql "project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent=\"<FEATURE_KEY>\" OR text ~ \"<FEATURE_KEY>\")" \
     --format json \
     --paginate 50 \
     > projects/defects-analysis/<FEATURE_KEY>/context/jira_raw.json
   ```

**Release-scoped mode (parallel, max 3–5 features at a time):**
For each confirmed feature key, run the same JQL with `<FEATURE_KEY>` substituted. Save to `projects/defects-analysis/release_<VERSION>/<FEATURE_KEY>/context/jira_raw.json`.

2. Verify output files are non-empty. If empty, check the JQL with the user.
3. Update `task.json` → `current_phase: issue_triage`, `total_defects: <N>`, `jira_fetched_at: <ISO timestamp>`.

---

## 2. Issue Triage & PR Extraction

*Goal: Parse each issue and extract PR links.*

1. Read `context/jira_raw.json`.
2. For each issue, extract:
   - `Key`, `Summary`, `Status`, `Priority`, `Assignee`, `Resolution Date` (Fixed Date), `Description`, `Comments`
3. Save individual JSON to `context/jira_issues/<KEY>.json`.
4. Run regex on description and comments to extract all GitHub PR URLs.
5. Update `task.json` → `current_phase: parallel_pr_analysis`, `total_prs: <M>`.

---

## 3. Parallel PR Analysis (Max 5 Concurrent Sub-agents)

*Goal: Fetch PR diffs and synthesize Fix Risk Analysis for each PR.*

For each extracted PR URL (batch max 5 at a time):

1. Spawn a PR Analyzer Sub-agent with the `github` skill:
   ```bash
   scripts/retry.sh 3 5 gh pr view <PR_URL> --json title,body,files > context/prs/<PR_ID>_meta.json
   scripts/retry.sh 3 5 gh pr diff <PR_URL> > context/prs/<PR_ID>_diff.md
   ```
2. The sub-agent synthesizes a **Fix Risk Analysis** and saves to `context/prs/<PR_ID>_impact.md`:
   ```markdown
   ## PR <PR_ID> Fix Risk Analysis
   **Files Changed:** <list key files>
   **Complexity:** High / Medium / Low
   **Regression Risk:** <1–2 sentence summary of what could regress>
   ```
3. On sub-agent failure after retries: log PR ID to `task.json` → `failed_prs[]` and continue (graceful degradation).
4. Emit heartbeat every 60 seconds: `"⏳ Analyzed <X>/<total> PR diffs..."`
5. Update `task.json` after each PR completes → `processed_prs: <running count>`, `pr_analysis_timestamps.<PR_ID>: <ISO timestamp>`.

---

## 4. Report Generation

*Goal: Generate the standardized Markdown draft.*

1. Read `skills/defect-analysis-reporter/SKILL.md` for the full format specification.
2. Invoke the `defect-analysis-reporter` skill:
   - Input: `context/jira_raw.json` + all `context/prs/*.md` files
   - Output: `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md`
3. Update `task.json` → `current_phase: self_review`, `report_generated_at: <ISO timestamp>`.

---

## 4a. AI Self-Review

*Goal: Act as a preliminary quality gate before the human reviews.*

1. **Invoke the `report-quality-reviewer` skill** to evaluate the draft report:
   - Input: `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md`
   - Context Inputs: `context/jira_raw.json` + `context/prs/*.md`
2. **Output**: Generate `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REVIEW_SUMMARY.md` based on the skill's evaluation format.
3. **Hybrid Auto-fix Protocol**:
   - **Objective errors**: If missing sections or mismatching defect counts, auto-fix the draft and regenerate (max 1-2 retries).
   - **Subjective warnings**: Do NOT auto-fix. Emit warnings to the `_REVIEW_SUMMARY.md`.
4. Update `task.json` → `current_phase: approval`.

---

## 5. User Approval

*Goal: Human-in-the-loop sign-off before publishing.*

1. Pause execution and present the user with the paths to the draft and the review summary:
   > `"✅ Draft report is ready at: projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md`
   > `🔍 Self-review summary is at: projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REVIEW_SUMMARY.md`
   > `Please review and reply with: APPROVE to publish to Confluence, or REJECT to send via Feishu."`
2. **Wait for user response.** Do not proceed without approval.

---

## 6. Publish

*Goal: Distribute the approved report.*

**If APPROVED:**
1. Convert to Confluence storage format:
   ```bash
   node scripts/confluence/md-to-confluence.js \
     projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md \
     projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_confluence.html
   ```
2. Publish:
   ```bash
   confluence update <page-id> \
     --file projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_confluence.html \
     --format storage
   ```
   ⚠️ **NEVER publish raw Markdown** — Confluence requires HTML storage format.

**If REJECTED / Alternative:**
1. Use the `message` skill to broadcast the Executive Summary section + local file link to the Feishu team channel.

**Final Steps (regardless of path):**
2. Archive any existing final report, then copy draft to final:
   ```bash
   # Archive old final if it exists (exit 2 = not found, that's fine)
   scripts/archive_report.sh <FEATURE_KEY> FINAL || true

   cp projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md \
      projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_FINAL.md
   ```
3. Update `task.json`:
   ```json
   {
     "overall_status": "completed",
     "current_phase": "completed",
     "report_approved_at": "<ISO timestamp>"
   }
   ```

---

## Integration Notes (Feature Summary Workflow)

When invoked by the **Feature Summary Workflow** as a sub-step:
- **Input**: Feature ID, JQL string, or release version.
- **Output**: Path(s) to `<FEATURE_KEY>_REPORT_FINAL.md` (one per feature).
- The Feature Summary Workflow will consume:
  - `## Executive Summary` → defect health snapshot
  - `## Risk Analysis by Functional Area` → QA focus identification
  - `## Recommended QA Focus Areas` → merged into feature test strategy
