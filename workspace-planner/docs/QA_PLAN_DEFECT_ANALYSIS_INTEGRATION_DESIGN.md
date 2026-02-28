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
2. **Auto-Detect via `issuelinks` and JQL:** Use the same JQL and cache as the Reporter agent (reuse `workspace-reporter/projects/defects-analysis/.cache/project_keys.txt`) so cross-project defects are not missed. Read `context/jira.json` and inspect `issuelinks`; for child defects use JQL: `issuetype = Defect AND parent = "<feature-id>"`. The Reporter's defect-analysis workflow uses a dynamic project-key cache — the planner should invoke the same lookup or read from the cache if already populated.
3. **Interactive User Confirmation:** Regardless of what the auto-detection finds, pause and ask the user before spawning the sub-agent.
   - *If defects are found:* "Detected N defects linked to this feature. Invoke Defect Analysis sub-agent? (Y/n)"
   - *If no defects are found:* "No defects automatically detected (Note: unlinked cross-project defects may be missed if project cache is empty). Do you want to manually invoke Defect Analysis anyway? (y/N)"
4. **State Update:** 
   - If the user confirms, set the state in `task.json` to reflect that defect analysis is required (`defect_analysis: "pending"`).
   - If the user declines, set it to `"skipped"`.

---

## 3. Invoking the Reporter Agent (Phase 2a)

If the trigger condition is met, a new parallel task is added to Phase 2a (Parallel Source Analysis).

### Mechanism
- **Spawn Tool:** Use `sessions_spawn` (OpenClaw)  depending on the environment.
- **Agent Profile:** Launch a sub-agent using the `reporter` profile / pointing to `workspace-reporter`.
- **Prompt Instruction:** 
  > *"Run the `defect-analysis` workflow for feature `<feature-id>`. Proceed directly up to final report generation and User Approval. Once completely finished and approved, exit so the planner can resume."*
- **Parallelism:** This invocation runs concurrently with `qa-plan-atlassian`, `qa-plan-figma`, and `qa-plan-github`. **Phase 2b synthesis does not start until all parallel tasks are complete** — including defect approval. The defect-analysis workflow has a mandatory User Approval step; the planner blocks until the sub-agent exits successfully.

### Cross-Workspace Pathing
The Reporter agent operates in `workspace-reporter` and saves its final output to:
`../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md`

Once the Reporter sub-agent completes successfully, the QA Planner will copy this file into its local context folder for synthesis:
`cp ../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md projects/feature-plan/<feature-id>/context/qa_plan_defect_analysis_<feature-id>.md`

---

## 4. Synthesize Merge Logic (Phase 2b)

The output of the defect analysis must be merged into the feature QA Plan naturally. The `qa-plan-synthesize` skill will be updated to consume the `qa_plan_defect_analysis_<feature-id>.md` file (if it exists).

**Mapping Rules for Synthesis:**
1. **Executive Summary / Defect Health:** Extract high-level defect stability and inject a brief mention into the QA Plan's `## 📊 Summary` or `### 3. Business Context` section.
2. **Risk Analysis by Functional Area:** Map these identified risk areas directly into the QA Plan's `## ⚠️ Risk & Mitigation` section. Ensure each functional risk area gets a row with a matching Test Mitigation.
3. **Recommended QA Focus Areas:** Use these focus areas to generate or enhance test scenarios in the `## 🧪 Test Key Points` section. The `Related Code Change` or `AC` column for these scenarios can be marked as `[Regression]` or `[Defect Fix Verification]`.

---

## 5. Error Handling & Idempotency

- **Approval Block:** The `defect-analysis` workflow has a mandatory "User Approval" step (Phase 5). This means the parallel synthesis (Phase 2b) cannot begin until the human approves the defect report. The planner must wait indefinitely for the sub-agent to successfully exit.
- **Failures:** If the Reporter agent fails to produce the final report (or the user rejects it indefinitely), the Planner should surface the error, offer the user the option to skip defect analysis, and proceed with the remaining available domain summaries (graceful degradation).
- **Resume Capability:** If the planner is interrupted while waiting, the planner's `check_resume.sh` (or resume logic) must: (a) observe `defect_analysis: "in_progress"` or `"pending"` in `task.json`; (b) probe `../workspace-reporter/projects/defects-analysis/<feature-id>/<feature-id>_REPORT_FINAL.md`; (c) if the report exists, copy it into `context/qa_plan_defect_analysis_<feature-id>.md` and proceed to synthesis; otherwise prompt the user to resume defect analysis or skip.

---

## 6. Required File Changes

To implement this design, the following files will be updated:

| File | Proposed Change |
|------|-----------------|
| `workspace-planner/.agents/workflows/feature-qa-planning.md` | - Update Phase 2a: add idempotency check (if `_REPORT_FINAL.md` exists, offer Use existing / Re-run / Skip); use Reporter's JQL/cache for defect detection; spawn Reporter agent when confirmed.<br>- Add the file copy logic from `workspace-reporter` to `context/`.<br>- Explicitly state that Phase 2b synthesis does not start until all parallel tasks (including defect approval) are complete.<br>- Pass the new context file to `qa-plan-synthesize` in Phase 2b. |
| `workspace-planner/skills/qa-plan-synthesize/SKILL.md` | - Add `qa_plan_defect_analysis_<feature-id>.md` to the Prerequisites and Step 1 input list.<br>- Add instruction on how to ingest `qa_plan_defect_analysis_<feature-id>.md`.<br>- Map defect risk areas to the Risk & Mitigation table.<br>- Map QA Focus Areas to Test Key Points.<br>- Deduplicate risks when defect-derived risk areas overlap with existing Technical/Data/UX risk subsections; prefer merging into existing subsections. |
| `workspace-planner/scripts/check_resume.sh` (if applicable) | - Add state tracking for external defect analysis report dependency: check `defect_analysis: "in_progress"` or `"pending"`; probe for `_REPORT_FINAL.md`; if exists, copy to context and proceed; otherwise prompt to resume or skip. |

---

## 7. Resolved Questions

1. **Wait State:** Does the current orchestration platform support blocking the master planner elegantly while the Reporter agent waits for a human to approve the defect analysis? 
   - **Resolution:** Yes.
2. **Directory Structure:** Is it guaranteed that `workspace-reporter` always exists at `../workspace-reporter` relative to `workspace-planner`? (Assuming standard OpenClaw QA workspace setup, yes).
   - **Resolution:** Yes, this is guaranteed.