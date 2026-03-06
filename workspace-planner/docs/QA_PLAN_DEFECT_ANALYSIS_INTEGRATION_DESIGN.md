# QA Plan Defect Analysis Integration Design

## 1. Background

The Feature QA Planning workflow currently synthesizes QA plans based on Atlassian, Figma, and GitHub context. However, for features that involve refactoring, bug-fixing, or have existing reported defects (linked under the feature key), the Test Plan should directly reflect the risk areas and QA focus points identified by analyzing those defects. 

The `workspace-reporter` agent already has a comprehensive `defect-analysis` workflow that produces standardized QA Risk & Defect Analysis Reports. This design document outlines how the QA Planner will conditionally invoke the Reporter agent to perform this analysis and merge the findings into the QA Plan.

---

## 2. Trigger Condition

**Phase 1: Information Gathering**
During Phase 1, the planner fetches the feature's Jira context to `projects/feature-plan/<feature-id>/context/jira.json`.

**Phase 2a: Detection & Confirmation**
Before spawning parallel analysis tasks, the planner must determine if defects exist and confirm with the user whether to proceed with defect analysis:

1. **Check for Existing Report (Idempotency):** If `../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md` already exists, STOP and ask: *"Use existing defect report / Re-run defect analysis / Skip defect analysis."* If the user chooses "Use existing," copy the file to `context/qa_plan_defect_analysis_<feature-id>.md` and skip spawning. If "Re-run" or "Skip," proceed accordingly.
2. **Auto-Detect via Shared Script (No Duplication):** Invoke the Reporter's defect-fetch logic — **do not copy JQL or cache logic**. Reference: `workspace-reporter/.agents/workflows/defect-analysis.md` Phase 0a and Phase 1.
   - **Canonical source:** Phase 0a populates `projects/defects-analysis/.cache/project_keys.txt`. Phase 1 uses cross-project JQL: `project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent="<FEATURE_KEY>" OR text ~ "<FEATURE_KEY>")` — see `skills/jira-cli/references/issue-search.md` for why `linkedIssues` fails across projects.
   - **Integration:** Use the shared script `../workspace-reporter/scripts/fetch-defects-for-feature.sh <feature-id>`. This script (single source of truth) runs Phase 0a if cache is stale, executes the JQL, writes to `projects/defects-analysis/<feature-id>/context/jira_raw.json` (relative to `workspace-reporter`), and outputs the defect count. The planner `cd`s into `workspace-reporter` first so `.env` and relative paths resolve correctly:
     ```bash
     # Guard: script must exist before invoking (create it per §6 before updating the workflow)
     if [ ! -f "../workspace-reporter/scripts/fetch-defects-for-feature.sh" ]; then
       echo "ERROR: fetch-defects-for-feature.sh not found. Complete §6 file changes first." >&2
       exit 1
     fi
     cd ../workspace-reporter && scripts/fetch-defects-for-feature.sh <feature-id>
     # Output: DEFECT_COUNT=N (parsable); output path is relative to workspace-reporter cwd
     ```
   - **Prerequisite:** `workspace-reporter/scripts/fetch-defects-for-feature.sh` **must be created first** (see §6) before the planner workflow is updated to call it. Jira credentials are sourced from `workspace-reporter/.env` inside the script.
3. **Interactive User Confirmation:** Regardless of what the auto-detection finds, pause and ask the user before spawning the sub-agent.
   - *If defects are found:* "Detected N defects linked to this feature. Invoke Defect Analysis sub-agent? (Y/n)"
   - *If no defects are found:* "No defects automatically detected (Note: unlinked cross-project defects may be missed if project cache is empty). Do you want to manually invoke Defect Analysis anyway? (y/N)"
4. **State Update:** `defect_analysis` in `task.json` is initialized to `"not_applicable"` at Phase 0 (see §6), then transitions per the state machine below:
   ```
   not_applicable → pending → in_progress → completed
                                           ↘ skipped  (user decline or graceful failure)
   ```
   - Phase 0 init: `"not_applicable"` (always present from the start).
   - User confirms defect analysis: set to `"pending"`.
   - Sub-agent is spawned: set to `"in_progress"`.
   - Report copied to context successfully: set to `"completed"`.
   - User declines at any confirmation step, or graceful failure: set to `"skipped"`.

---

## 3. Invoking the Reporter Agent (Phase 2a)

If the trigger condition is met, a new parallel task is added to Phase 2a (Parallel Source Analysis).

### Mechanism
- **Spawn Tool:** Use `sessions_spawn` (OpenClaw) depending on the environment.
- **Agent Profile:** Launch a sub-agent using the `reporter` profile / pointing to `workspace-reporter`.
- **Prompt Instruction:**
  > *"Run the `defect-analysis` workflow for feature `<feature-id>`. Proceed directly up to and including Phase 5 (User Approval). **Do NOT proceed to Phase 6 (Publish to Confluence).** Once the user approves the final report, exit successfully so the planner can resume."*
- **Parallelism:** This invocation runs concurrently with `qa-plan-atlassian`, `qa-plan-figma`, and `qa-plan-github`. **Phase 2b synthesis does not start until all parallel tasks are complete** — including defect approval. The defect-analysis workflow has a mandatory User Approval step; the planner blocks until the sub-agent exits successfully.
- **Failure Handling (non-fatal):** If the Reporter sub-agent fails to produce the final report, or the user rejects it indefinitely, this is **not** treated as a fatal Phase 2a failure (unlike other domain skills). The planner must: (1) set `defect_analysis: "skipped"` in `task.json`; (2) surface a warning to the user; (3) proceed to Phase 2b using the remaining domain summaries. The Phase 2a "abort-on-failure" rule does **not** apply to the defect analysis task.

### Cross-Workspace Pathing
The Reporter agent operates in `workspace-reporter` and saves its final output to:
`../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md`

Once the Reporter sub-agent completes successfully, the QA Planner will copy this file into its local context folder for synthesis:
`cp ../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md projects/feature-plan/<feature-id>/context/qa_plan_defect_analysis_<feature-id>.md`

---

## 4. Synthesize Merge Logic (Phase 2b)

The output of the defect analysis must be merged into the feature QA Plan naturally. The `qa-plan-synthesize` skill will be updated to consume the `qa_plan_defect_analysis_<feature-id>.md` file (if it exists).

**Mapping Rules for Synthesis:**
1. **Executive Summary → Context-Aware Category (Emoji-Prefixed):** Extract high-level defect stability from the defect analysis report and inject a brief mention into the QA Plan's `## 📝 Background` section, after the background content. Use an emoji-prefixed subheading — **category name depends on whether defects affect customers**:
   - **Customer impact (affected customers is not empty):** Use subheading `### 📢 Business Context` (or equivalent). Summarize which customers/segments are affected and the business impact.
   - **Internal defects only (affected customers is empty):** Use subheading `### 🩺 Defect Health`. Summarize defect distribution (e.g., N completed, M open), risk rating, and stability.
   - If both apply, include both subheadings with the relevant content under each.
2. **Defect Findings → Test Key Points (Single Merge):** Merge all defect-derived content (Risk Analysis by Functional Area, Recommended QA Focus Areas, Testing Focus checklists) into the `## 🧪 Test Key Points` section only. Do **not** map to Risk & Mitigation. Convert functional risk areas and QA focus areas into test scenarios; mark `Related Code Change` or `AC` as `[Regression]` or `[Defect Fix Verification]` where appropriate.

---

## 5. Error Handling & Idempotency

- **Approval Block:** The `defect-analysis` workflow has a mandatory "User Approval" step (Phase 5). Phase 2b synthesis cannot begin until the human approves the defect report. The planner blocks until the sub-agent exits successfully.
- **Failures:** If the Reporter agent fails (or the user rejects it indefinitely), the Planner surfaces the error as a warning, offers the option to skip, and proceeds with remaining domain summaries (graceful degradation). See §3 Failure Handling for state transitions.
- **Resume Capability:** If the planner is interrupted while waiting, `projects/feature-plan/scripts/check_resume.sh` (located at `workspace-planner/projects/feature-plan/scripts/check_resume.sh`) must:
  - **(a)** observe `defect_analysis: "in_progress"` or `"pending"` in `task.json`;
  - **(b)** probe `../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md`;
  - **(c) Report exists AND `report_approved_at` is non-null:** copy to `context/qa_plan_defect_analysis_<feature-id>.md`, set `defect_analysis: "completed"`, proceed to Phase 2b;
  - **(d) Report exists BUT `report_approved_at` is null:** the report completed AI self-review (Phase 4a) but awaits human sign-off. Prompt: *"Defect report is AI-reviewed but not yet approved. (A) Open for approval — (B) Skip defect analysis."*
  - **(e) Report does not exist:** prompt the user to resume defect analysis from scratch or skip entirely.

---

## 6. Required File Changes

To implement this design, the following files will be updated:

| File | Proposed Change |
|------|-----------------|
| `workspace-reporter/scripts/fetch-defects-for-feature.sh` | **New.** Single source of truth for Phase 0a + Phase 1 JQL. Encapsulates: credential load from `.env`, project cache (run Phase 0a if stale/missing), cross-project JQL per `defect-analysis.md`, output to `projects/defects-analysis/<KEY>/context/jira_raw.json`. Prints `DEFECT_COUNT=N` (parsable) and exits 0. Prerequisite: Phase 0a logic runs first if `project_keys.txt` empty/missing. |
| `workspace-reporter/.agents/workflows/defect-analysis.md` | Refactor Phase 1 to call `scripts/fetch-defects-for-feature.sh <FEATURE_KEY>` instead of inline bash. Keeps JQL/cache logic in one place. |
| `workspace-reporter/scripts/README.md` | Add `fetch-defects-for-feature.sh` to the script table; used by defect-analysis Phase 1 and planner Phase 2a auto-detect. |
| `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` | - Update Phase 2: add idempotency check (if `_REPORT_FINAL.md` exists, offer Use existing / Re-run / Skip); run `../workspace-reporter/scripts/fetch-defects-for-feature.sh` for defect count (no duplicated JQL); spawn Reporter agent when confirmed.<br>- Add the file copy logic from `workspace-reporter` to `context/`.<br>- Explicitly state that synthesis does not start until all parallel tasks (including defect approval) are complete.<br>- Pass the new context file to `qa-plan-synthesize` in the synthesis phase. |
| `workspace-planner/skills/qa-plan-synthesize/SKILL.md` | - Add `qa_plan_defect_analysis_<feature-id>.md` (Optional) to the Prerequisites section.<br>- In Step 2 ("Read and Parse All Summaries"), add item **5. Defect Analysis summary (Optional):** read after the Atlassian summary if the file exists; extract Executive Summary, Risk Analysis by Functional Area, Recommended QA Focus Areas, and the Affected Customers field.<br>- In Step 3 merge strategy table, add row: **Defect Analysis** → merge all findings into `## 🧪 Test Key Points` only; do **not** map to Risk & Mitigation.<br>- Add mapping rules note beneath the table: if `Affected Customers` non-empty → inject `### 📢 Business Context` into `## 📝 Background`; if internal-only → inject `### 🩺 Defect Health`; if both apply, include both subheadings. Mark defect-derived rows with `[Regression]` or `[Defect Fix Verification]` in the Related Code Change/AC column. |
| `workspace-planner/projects/feature-plan/scripts/check_resume.sh` | - Add defect analysis state tracking: check `defect_analysis: "in_progress"` or `"pending"`; probe `_REPORT_FINAL.md`; bifurcate on `report_approved_at` null vs non-null per §5 Resume Capability rules; copy to context or prompt user accordingly. |
| `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` (Phase 0 / Phase 2) | - In Phase 0, add `"defect_analysis": "not_applicable"` to the `task.json` initialization block so the field is always present from the start.<br>- In Phase 2, add explicit carve-out: defect analysis failure is non-fatal; set `defect_analysis: "skipped"` and proceed rather than aborting. |

---

## 7. Implementation Status

| File | Status | Notes |
|------|--------|-------|
| `workspace-reporter/scripts/fetch-defects-for-feature.sh` | ✅ Implemented | New script: Phase 0a cache + Phase 1 JQL, loads `.env`, prints `DEFECT_COUNT=N` |
| `workspace-reporter/.agents/workflows/defect-analysis.md` | ✅ Implemented | Phase 1 refactored to call `scripts/fetch-defects-for-feature.sh` |
| `workspace-reporter/scripts/README.md` | ✅ Implemented | Added `fetch-defects-for-feature.sh` to script table |
| `workspace-planner/skills/feature-qa-planning-orchestrator/SKILL.md` | ✅ Implemented | Phase 0: `defect_analysis: "not_applicable"`; Phase 2: idempotency, auto-detect, spawn, copy, non-fatal handling; Phase 3: pass defect file to synthesize |
| `workspace-planner/skills/qa-plan-synthesize/SKILL.md` | ✅ Implemented | Defect Analysis prerequisite, Step 2 item 5, merge table row, Background/Test Key Points mapping rules |
| `workspace-planner/projects/feature-plan/scripts/check_resume.sh` | ✅ Implemented | Defect analysis state tracking: `in_progress`/`pending` → probe `_REPORT_FINAL.md`; bifurcate on `report_approved_at`; copy or prompt per §5 |

---

## 8. Resolved Questions

1. **Wait State:** Does the current orchestration platform support blocking the master planner elegantly while the Reporter agent waits for a human to approve the defect analysis? 
   - **Resolution:** Yes.
2. **Directory Structure:** Is it guaranteed that `workspace-reporter` always exists at `../workspace-reporter` relative to `workspace-planner`? (Assuming standard OpenClaw QA workspace setup, yes).
   - **Resolution:** Yes, this is guaranteed.
3. **JQL Duplication:** How does the planner auto-detect defects without duplicating the Reporter's JQL and cache logic?
   - **Resolution:** Extract Phase 0a + Phase 1 into `workspace-reporter/scripts/fetch-defects-for-feature.sh`. Both planner (auto-detect) and defect-analysis workflow (Phase 1) call this script.

---

## 9. References

| Reference | Purpose |
|----------|---------|
| `workspace-reporter/.agents/workflows/defect-analysis.md` | Phase 0a (Project Discovery), Phase 1 (Jira Extraction) — canonical JQL, cache, and credential requirements |
| `workspace-reporter/skills/jira-cli/references/issue-search.md` | Credential loading, cross-project JQL rationale (`linkedIssues` fails across projects) |