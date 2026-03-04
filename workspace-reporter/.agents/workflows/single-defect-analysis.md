---
description: Single-issue defect analysis. Input: one Jira issue key/URL. Output: testing plan (FC steps + exploratory) + tester handoff. Handles test outcome callback (Phase 7). Invoked by Tester Agent via session_spawn.
---

# Single-Defect Analysis Workflow

**Trigger:** One Jira issue key or URL (e.g., `BCIN-7890` or `https://*.atlassian.net/browse/BCIN-7890`) with no accompanying QA plan.
**Invocation:** Called via `session_spawn` from the Tester Agent. The Tester provides the issue key and a notification callback path.
**Output:** `projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md` + `tester_handoff.json` + notification to Tester.
**Callback:** Phase 7 when Tester reports PASS/FAIL + evidence.

**⚠️ User Confirmation Principle:** Before any future action, always confirm with the user. Never make self-decisions without explicit approval. See REPORTER_AGENT_DESIGN.md Section 1.1.

> **Design Reference:** See `projects/docs/REPORTER_AGENT_DESIGN.md` for the full design specification.
> **Testing Plan Format:** See `skills/defect-analysis-reporter/SKILL.md` section on Testing Plan Output.

---

## Phase 1: Detect Single-Issue Mode

1. Parse input: if it matches a single Jira issue key pattern (`[A-Z]+-\d+`) or a Jira browse URL, proceed. Otherwise this workflow does not apply.
2. Extract the issue key (e.g., `BCIN-7890`).
3. Set working directory: `projects/defects-analysis/<ISSUE_KEY>/`.
4. **Idempotency check** — check if a testing plan already exists:
   ```bash
   scripts/check_resume.sh <ISSUE_KEY>
   ```
   Read `REPORT_STATE` line:
   | `REPORT_STATE` | Action |
   |---|---|
   | `TESTING_PLAN_EXISTS` | Present plan date. **STOP.** Ask: **(A) Use Existing — (B) Regenerate** |
   | `DRAFT_EXISTS` or `FINAL_EXISTS` | Present state. Ask: **(A) Generate Testing Plan from existing data — (B) Full Regenerate** |
   | `FRESH` | Proceed to Phase 2 |

5. Initialize `task.json` with mode flag:
   ```json
   {
     "issue_key": "<ISSUE_KEY>",
     "mode": "single_issue_testing_plan",
     "overall_status": "in_progress",
     "current_phase": "issue_fetch",
     "invoked_by": "tester-agent",
     "invoked_at": "<ISO8601>",
     "testing_plan_generated_at": null,
     "tester_notified_at": null
   }
   ```

---

## Phase 2: Fetch Issue Details

1. **Load Jira credentials** from `.env`.
2. Fetch the single issue:
   ```bash
   scripts/retry.sh 3 2 jira issue view <ISSUE_KEY> --format json \
     > projects/defects-analysis/<ISSUE_KEY>/context/issue.json
   ```
3. Extract: `summary`, `description`, `priority`, `labels`, `components`, `status`, `assignee`, `fixVersions`, `comments`.
4. Extract GitHub PR links from description + comments (regex on `github.com/*/pull/\d+`).

---

## Phase 3: Fetch Fix PR Diff (if linked)

If PR links are found (from Phase 2):

1. For each PR (max 3), fetch meta and diff:
   ```bash
   scripts/retry.sh 3 5 gh pr view <PR_URL> --json title,body,files \
     > projects/defects-analysis/<ISSUE_KEY>/context/prs/<PR_ID>_meta.json
   scripts/retry.sh 3 5 gh pr diff <PR_URL> \
     > projects/defects-analysis/<ISSUE_KEY>/context/prs/<PR_ID>_diff.md
   ```
2. For each PR, synthesize a brief **Fix Risk Analysis** (≤ 30 words):
   - Files changed, complexity (High/Medium/Low), regression risk area
   - Save to `context/prs/<PR_ID>_impact.md`
3. Infer **affected domains** from changed file paths (map to: filter / autoAnswers / aibot / other).
4. Update `task.json` → `pr_analysis_complete: true`, `affected_domains: [...]`.

If **no PR links found:**
- Note: "No fix PR linked. Testing plan will be based on issue description and labels only."
- Proceed with issue context alone.

---

## Phase 4: FC Risk Assessment

Score the fix confidence risk using these signals:

| Signal | Weight | Source |
|--------|--------|---------|
| Priority P1/P2 | +3 | Jira `priority` |
| Fix touches > 3 files | +2 | PR diff file count |
| Fix touches > 1 domain | +3 | PR diff → domain map |
| Issue labels include `regression-risk` | +2 | Jira `labels` |
| Config/feature-flag change only | -2 | PR diff: only config files |
| Issue description < 50 words (vague) | +1 | Description length |
| Status is already `Done`/`Fixed` | -1 | Jira `status` |

**Risk level:**
- Score ≥ 5 → **HIGH** → exploratory testing required
- Score 2–4 → **MEDIUM** → smoke + targeted exploratory
- Score < 2 → **LOW** → FC steps only

Record in `task.json` → `fc_risk: { score, risk_level, rationale }`.

---

## Phase 5: Generate Testing Plan

Read `skills/defect-analysis-reporter/SKILL.md` section on Testing Plan output.

Generate `projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md`:

```markdown
# Testing Plan: <ISSUE_KEY>

## Issue
**Summary:** <summary>
**Priority:** <priority> | **Status:** <status>
**Labels:** <labels>
**Risk Level:** <HIGH/MEDIUM/LOW> (Score: <N>)

## Fix Summary
<PR URL(s) if available>
**Affected Domains:** <domains>
**Fix Risk Analysis:** <per-PR summary>

---

## 1. FC Verification Steps

> Mandatory smoke steps to verify the reported bug is fixed.

| Step | Action | Expected Result |
|------|--------|-----------------|
| FC-01 | <specific reproduction step from issue> | <fix confirmed: no error / correct behaviour> |
| FC-02 | <step 2 if needed> | <expected> |
...

**Pre-conditions:**
- Environment: <staging URL / feature flag if known>
- Test data: <if specified in issue>

---

## 2. Exploratory Testing

> <Only if risk level is MEDIUM or HIGH. Omit section for LOW risk.>

### 2.1 Regression Areas

Based on the fix scope, the following adjacent areas carry regression risk:

| Area | Risk | Suggested Exploration |
|------|------|-----------------------|
| <component / domain> | <High/Medium> | <what to explore> |
...

### 2.2 Exploratory Charter

- **Target:** <Feature area, e.g. CalendarFilter reset behaviour>
- **Focus:** <What to look for: UI glitches, edge cases, data integrity>
- **Time-box:** <15 / 30 min>
- **Heuristics:** CRUD, boundary values, error paths
```

Save to: `projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md`

Update `task.json` → `current_phase: testing_plan_complete`, `testing_plan_generated_at: <ISO8601>`.

---

## Phase 6: Notify Tester Agent

1. Write the plan path and summary to the **tester handoff file**:
   ```bash
   # Path: projects/defects-analysis/<ISSUE_KEY>/tester_handoff.json
   {
     "issue_key": "<ISSUE_KEY>",
     "testing_plan_path": "workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md",
     "risk_level": "<HIGH/MEDIUM/LOW>",
     "fc_steps_count": <N>,
     "exploratory_required": <true/false>,
     "affected_domains": ["<domain1>", "<domain2>"],
     "generated_at": "<ISO8601>"
   }
   ```
2. **Notify via `message` skill** (Feishu) or via `session_spawn` callback to Tester:
   > ✅ Testing Plan ready for `<ISSUE_KEY>`: `<risk_level>` risk, `<N>` FC steps, exploratory testing `<required/not required>`.
   > Plan path: `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md`
   > Tester: Please read plan, execute, and notify reporter with PASS or FAIL + evidence.
3. Update `task.json` → `tester_notified_at: <ISO8601>`.
4. **STOP.** Wait for the Tester agent to execute and report back. ➤ See **Phase 7** for outcome handling.

---

## Phase 7: Test Outcome Handling

> **Trigger:** The Tester Agent has completed test execution and notifies the Reporter with `PASS` or `FAIL` + evidence.
> **Input:** Tester provides: issue key, result (`PASS`/`FAIL`), evidence paths (screenshots, execution report), run key.

### 7.1 Receive Test Results

1. Read the tester's execution report:
   ```
   workspace-tester/memory/tester-flow/runs/<ISSUE_KEY>/reports/execution-summary.md
   ```
2. Check `task.json` → confirm `tester_notified_at` is set (guard against duplicate calls).
3. Write results to `task.json`:
   ```json
   { "test_result": "PASS | FAIL", "test_completed_at": "<ISO8601>", "evidence_path": "..." }
   ```

### 7.2 If Test PASS ✅

1. **Present to user:**
   > ✅ Testing PASSED for `<ISSUE_KEY>`. FC steps verified. Ready to close the issue.
   > Evidence: `<execution_report_path>`
   > Shall I (A) **Close the Jira issue** (transition to Done + add verification comment) or (B) **Just notify you** and take no action?

2. **Wait for user approval.** Do NOT close Jira without explicit approval.

3. **If user approves closure:**
   - Add verification comment to Jira:
     ```bash
     jira issue comment add <ISSUE_KEY> \
       "✅ FC Verified by QA on <date>. All FC steps passed. Evidence: <summary>"
     ```
   - Transition to Done (if not already):
     ```bash
     jira issue transition <ISSUE_KEY> --to="Done" --resolution="Fixed"
     ```
   - Update `task.json` → `overall_status: completed`, `jira_closed_at: <ISO8601>`.
   - Notify via `message` skill:
     > ✅ `<ISSUE_KEY>` FC verified and closed. No regressions found.

### 7.3 If Test FAIL ❌

1. **Present to user with evidence:**
   > ❌ Testing FAILED for `<ISSUE_KEY>`.
   > Failed steps: `<summary from execution report>`
   > Evidence: `<path>`
   >
   > Choose an action:
   > (A) **Add a comment** to the existing issue (bug not fully fixed)
   > (B) **File a new defect** (regression — different from original)
   > (C) **No action** — notify me only

2. **Wait for user choice.** Do NOT file or comment without explicit approval.

3. **If user chooses (A) — Add comment to existing issue:**
   - Read `skills/bug-report-formatter/SKILL.md` for comment format.
   - Add comment:
     ```bash
     jira issue comment add <ISSUE_KEY> \
       "❌ FC re-test FAILED on <date>. <failed_step_summary>. Evidence: <path>"
     ```
   - Update `task.json` → `overall_status: fail_comment_added`.

4. **If user chooses (B) — File new defect:**
   - Read `skills/bug-report-formatter/SKILL.md`.
   - Construct a full bug report:
     - Summary: `[REGRESSION] <description derived from failure>`
     - Link to original issue: `<ISSUE_KEY>`
     - Steps from failed FC step(s)
     - Evidence: screenshots/logs paths
   - **Confirm the report with user before filing.** Show full report draft.
   - On approval:
     ```bash
     jira issue create \
       --summary "[REGRESSION] <summary>" \
       --type Bug \
       --priority <inferred from risk> \
       --description "<formatted report>"
     ```
   - Link new issue to original:
     ```bash
     jira issue link <NEW_KEY> <ISSUE_KEY> --type "is caused by"
     ```
   - Update `task.json` → `overall_status: fail_new_defect_filed`, `new_defect_key: <NEW_KEY>`.
5. Notify via `message` skill with outcome summary.

---

## Integration Notes (Tester Agent)

When invoked by the Tester Agent via `session_spawn`:
- **Input**: Single issue key (e.g., `BCIN-7890`)
- **Output**: `<ISSUE_KEY>_TESTING_PLAN.md` + `tester_handoff.json`
- **Callback**: After testing, the Tester calls back with PASS/FAIL → handled by Phase 7
- **Files consumed by Tester:**
  - `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/<ISSUE_KEY>_TESTING_PLAN.md`
  - `workspace-reporter/projects/defects-analysis/<ISSUE_KEY>/tester_handoff.json`
