# QA Plan Fix Plan — BCIN-6709
**Based on**: `QA_PLAN_KEY_TEST_POINTS_GAP_ANALYSIS.md`  
**Target file**: `workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md`  
**Date**: 2026-03-05  
**Status**: Proposed — Awaiting User Approval

---

> [!IMPORTANT]
> This plan addresses the **two root causes** identified in the gap analysis:
> 1. Test Key Points read like **code review notes**, not executable steps a QA engineer can run.
> 2. Expected Results describe **internal implementation state**, not observable UI/network outcomes.

---

## Approach: What We Will Do

The fix is **a targeted rewrite of the `## 🧪 Test Key Points` section** of `qa_plan_final.md`.

We will **NOT**:
- Re-run the full workflow (no new Jira/Confluence/GitHub fetches needed — context is already rich)
- Modify the Background, QA Goals, Risk & Mitigation, or Sign-off sections
- Create a new draft version — we will produce `qa_plan_final.md` directly as a v3 patch

We **WILL**:
1. Rewrite every flawed row's **Test Key Points** column with explicit `Given / When / Then` or numbered step sequences
2. Rewrite every flawed row's **Expected Results** column to describe only observable UI / network outcomes
3. Split multi-path rows into sub-rows
4. Re-categorize API/unit-test rows into an explicit `AUTO` sub-section
5. Add setup notes for rows requiring specific test objects

---

## Source of Truth for Rewrites

All rewrites will be grounded in these already-gathered context files:

| Source File | What It Provides |
|---|---|
| `context/qa_plan_atlassian_BCIN-6709.md` | Functional scenarios, acceptance criteria, mode transition map |
| `context/qa_plan_github_BCIN-6709.md` | Code-level detail for each file change, risk areas per component |
| `qa_plan_final.md` Sections 4–8 (Risk, Reference, Checklist, Notes) | Error codes table, API contract, test data list — all user-facing |
| `QA_PLAN_KEY_TEST_POINTS_GAP_ANALYSIS.md` | Row-by-row flaw list and recommended fix direction per row |

No new external calls required.

---

## Row-by-Row Fix Specification

### Fix Class A — Rewrite Expected Results to User-Visible Outcomes

These rows have **internal code/flag references** in expected results that must be replaced with observable facts.

| Row | Current (to remove) | Replace with |
|-----|---------------------|--------------|
| 1.5 | `cmdMgr.reset() NOT called (undo/redo preserved)` | `After clicking Resume a second time, the Undo/Redo toolbar buttons remain in the same enabled/disabled state as before the error` |
| 2.1 | `cmdMgr.reset() IS called; undo/redo cleared` | `Open Edit menu → Undo is greyed out (no undo history). Previously set row limit (e.g. 300) is visible if Advanced Properties is re-opened` |
| 2.2 | `mstrApp.appState set to DEFAULT; isViewTemplateDirty reset to false` | `Grid shows no data rows; the Run button is visible; no loading spinner remains; layout matches pause mode` |
| 2.3 | `isModelingServiceManipulation=true → undo/redo history cleared` | `After dismissing the error dialog, the Undo button is disabled (history was cleared). The specific operation (e.g. join type change) cannot be undone` |
| 2.4 | `cmdMgr.reset() NOT called` | `After dismissing the error dialog, press Ctrl+Z — the most recent successful edit is undone (attribute/metric reverts to its previous state)` |
| 4.5 | `applyReportPromptAnswersFailure flag NOT set; old error handling` | `Standard error dialog appears with no Cancel / Cancel Reprompt button. Behavior is identical to pre-BCIN-6709 consumption mode error behavior` |
| 4.6 | `saveCancelPromptStateId properly set` | `Clicking Cancel in the reprompt dialog returns the report to the state it was in before the reprompt was triggered — data visible, same as before the reprompt started` |
| 5.1 | `ReCreateErrorCatcher not rendered; standard error handling applies` | `Standard error dialog appears (no Cancel / Cancel Reprompt button); after clicking OK, user may be navigated away from the report (pre-BCIN-6709 behavior is preserved)` |
| 5.2 | `recoverReportFromError returns { handled: false }` | `Merge into Row 5.1 — no standalone row needed; this verifies the same observable outcome as 5.1` |
| 5.5 | `Routes to normal undo(), not reCreateInstance()` | `Move to AUTO section — this is a server-side API test; observable UI proxy: perform operation with stid != -1 → error → normal error dialog appears without instance recreation` |
| 5.7 | `Flag set true → API call → flag set false; no stale flag state` | `Move to AUTO section. Observable proxy: trigger a second error immediately after a first recovery completes — verify the second recovery also completes correctly (no stuck state)` |
| 6.1 | `Unhandled promise rejection likely... escalate to dev team` | `Classify as KNOWN DEFECT TO VALIDATE: expected to fail ungracefully. Document observed behavior. PASS = ErrorCatcher displays a recoverable message. FAIL = blank screen / app crash` |
| 6.6 | Remove from manual QA | `Move to AUTO section — toHex() unit test; no user-facing observable outcome` |
| 6.12 | `External handler returns true` (code precondition, not user action) | `Move to AUTO section — requires SDK embedding setup; not a manual QA test point` |
| 6.13 | `error handled gracefully or fallback path taken` | `Move to AUTO section — race condition; not reliably triggerable manually. If kept in manual, single expected result must be defined: either graceful OR fail-known` |

---

### Fix Class B — Add User Action Sequences to Test Key Points

These rows have labels or vague triggers with no `Given / When / Then` or numbered steps.

| Row | Problem | Fix Direction |
|-----|---------|---------------|
| 1.1 | `Resume for report exceeding max rows` (label only) | Add: `(1) Open a report whose Results Set Row Limit is exceeded (test object: BCEN-4843 or configure IServer limit to 300). (2) Confirm report is in pause mode. (3) Click "Resume Data Retrieval". (4) Observe error dialog` |
| 1.3 | `Open report (BCIN-974) → add conflicting attribute` | Add: `(1) Open BCIN-974 report (Cartesian join scenario). (2) In pause mode, open the attribute selector. (3) Add a second attribute that causes a Cartesian join (specify which pair of attributes). (4) Observe error` |
| 2.1 | `set low row limit → Done` | Change "low" to exact value: `set Results Set Row Limit to 300` |
| 2.2 | `Trigger manipulation error in running mode` | Add: `(1) Open a running report. (2) Trigger: add an attribute that causes a Cartesian join while the report is in running mode (see BCIN-974 setup)` |
| 2.3 | `Perform modeling service operation causing error` | Add: `(1) Open any report. (2) Via File → Report Definition, update join type to a combination that causes an analytical engine failure. (3) Observe error` |
| 2.4 | `trigger non-modeling error` | Add: `(1) Make 3+ edits (add attributes/metrics via the grid toolbar — NOT via File → Report Definition). (2) Trigger a scenario causing max rows or SQL error. (3) Error dialog appears. (4) Click OK. (5) Press Ctrl+Z` |
| 4.1 | `answer with values causing max rows exceeded` | Add concrete values: `select attribute members totaling > [configured row limit] rows` or use the specific BCEN-4843 test object |
| 4.3 | `Trigger non-max-rows prompt error` | Add: `(1) Open a prompted report. (2) Provide an attribute member selection that generates a SQL syntax error or an unsupported prompt type response (not a rows-exceeded error). (3) Observe dialog` |
| 4.4 | `Open nested prompt report → answer inner prompt causing error` | Add: `(1) Identify a nested prompt report (specify test object). (2) The outer prompt appears. (3) Answer outer → inner prompt appears. (4) Answer inner prompt with values that cause an error. (5) Observe which prompt dialog returns` |
| 5.4 | `Test error recovery on different deployments` | Add: `For each deployment type (MCE, MEP, MCG, MCP, Tanzu, CMC): (1) Open a report in authoring mode. (2) Trigger a max rows error. (3) Verify error dialog + pause mode recovery. Pass criterion: recovery completes within 30 seconds on all deployment types` |
| 6.10 | `Trigger error matching IServerIgnoreCodeType` | Add: `(1) Engineer must configure a test scenario that returns error code -2147205027 from IServer. (2) Observe that no dialog appears. (3) Confirm report remains in working state (user can continue editing)` |

---

### Fix Class C — Split Multi-Path Rows Into Sub-Rows

| Current Row | New Rows |
|-------------|----------|
| 4.1 (Cancel path only) | 4.1a: Click Cancel → returns to prompt with previous answers<br>4.1b: Click OK → error dismissed, returns to pause mode |
| 4.2 (Cancel Reprompt path only) | 4.2a: Click Cancel Reprompt → returns to reprompt<br>4.2b: Click OK → error dismissed, returns to pause mode<br>**Note on 4.2**: Flag button label as `⚠️ PENDING UX SIGN-OFF — button may read "Cancel" rather than "Cancel Reprompt" until ActionLinks.js TODO is resolved` |
| 2.3 (3 sub-cases collapsed) | 2.3a: Join type change causes error<br>2.3b: Template unit (grid template) change causes error<br>2.3c: Prompt sub-case causing error |

---

### Fix Class D — Add Setup / Test Object Notes

These rows reference test objects without setup instructions. Add prefixed notes:

| Row | Add Setup Note |
|-----|---------------|
| 1.2 | `⚙️ Setup: BCIN-6706 — SQL failure report. Location: [specify IServer project/folder]. Ask SE team for exact path or use linked Jira to find test environment` |
| 1.3 | `⚙️ Setup: BCIN-974 — Cartesian join report. Trigger: add [specify attribute pair] to the report template while in pause mode` |
| 1.4 | `⚙️ Setup: BCEN-4129 — MDX/ODBC error report. Note: BCEN-4129 is in a different Jira board (BCEN != BCIN). QA engineer must have access to the BCEN board project to locate this test object` |
| 3.1 | `⚙️ Setup: BCIN-6485 — report with filter using attribute. Action to trigger: remove that attribute from the report template` |
| 4.4 | `⚙️ Setup: Identify a report with prompt-in-prompt (nested prompt) configuration in the QA IServer environment. Ask SE team if not available` |
| 5.5 | Move to AUTO — no setup note needed |

---

### Fix Class E — Add FAIL Criteria to P0/P1 Rows

Each P0 and P1 row must have: `"This test FAILS if..."`. Add as a new line in Expected Results:

| Row | Fail Criterion to Add |
|-----|-----------------------|
| 1.1 | `FAILS if: user is navigated to Library home page, OR error dialog does not appear, OR "Resume Data Retrieval" button is permanently disabled after error` |
| 1.2 | `FAILS if: loading overlay remains visible after error dialog appears, OR user cannot click OK, OR user is navigated away from the report` |
| 1.3 | `FAILS if: report crashes to blank screen OR user is navigated to Library home` |
| 1.5 | `FAILS if: second Resume request hangs > 30 seconds with no dialog or progress` |
| 2.1 | `FAILS if: undo/redo history is NOT cleared (Ctrl+Z still works after error), or if error dialog does not appear` |
| 2.4 | `FAILS if: Ctrl+Z does NOT undo the last successful edit after recovering from error` |
| 3.1 | `FAILS if: grid goes empty / report enters pause mode (it should remain in editable state with data visible)` |
| 4.1a/4.1b | `FAILS if: prompt dialog does not reopen with previous selections intact (for Cancel path)` |

---

### Fix Class F — Rows to Move to AUTO Section

These rows are unit/API tests and should NOT appear in the manual QA test table. Create a new `### AUTO: Automation-Only Tests` subsection under Section 6 to hold them:

| Row | Automation Test Description |
|-----|-----------------------------|
| 3.2 | API verification — no reCreateInstance call for modeling service errors: use network interceptor / test proxy to confirm `reCreateInstance` field is absent from PUT /model/reports response |
| 5.2 | Unit test — `recoverReportFromError()` returns `{ handled: false }` when `isConsumptionMode=true` |
| 5.5 | API test — POST manipulation with `stid=5, reCreateInstance=true` → server routes to `undo()` not `reCreateInstance()`. Use curl/Postman against test IServer. |
| 5.7 | Automated integration test — flag lifecycle: `isReCreateReportInstance` = true before API call, false after. Add console log tracing or Jest mock |
| 6.6 | Unit test — `ServerAPIErrorCodes.toHex()`: NaN→0, negative int→unsigned hex, hex string→parse |
| 6.12 | SDK/embedding automated test — external error handler priority; requires embedding client setup |
| 6.13 | Automated test with page load throttling — `window.mstrApp` undefined during recovery |

---

## Execution Plan

### Phase 1 — Preparation (No editing yet)
1. Archive current `qa_plan_final.md` to `archive/qa_plan_final_20260305.md`
2. Confirm fix spec with user (this document)

### Phase 2 — Execute Row Rewrites in `qa_plan_final.md`
Apply all fix classes in this order to minimize re-reads:

| Step | Fix Class | Rows Affected | Action |
|------|-----------|---------------|--------|
| 2a | Class F (Move to AUTO) | 3.2, 5.2, 5.5, 5.7, 6.6, 6.12, 6.13 | Remove from main table; add to new `### AUTO` subsection at end of Section 6 |
| 2b | Class C (Split rows) | 4.1, 4.2, 2.3 | Each current row becomes 2–3 sub-rows |
| 2c | Class A (Expected Results rewrite) | 1.5, 2.1, 2.2, 2.3, 2.4, 4.5, 4.6, 5.1, 6.1 | Replace internal state references with observable outcomes |
| 2d | Class B (Add action sequences) | 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 4.1, 4.3, 4.4, 5.4, 6.10 | Add numbered step sequences to Test Key Points column |
| 2e | Class D (Setup notes) | 1.2, 1.3, 1.4, 3.1, 4.4 | Prepend `⚙️ Setup:` note to Test Key Points |
| 2f | Class E (FAIL criteria) | 1.1, 1.2, 1.3, 1.5, 2.1, 2.4, 3.1, 4.1 | Append `FAILS if:` line to Expected Results |
| 2g | Row 5.4 | 5.4 | Full rewrite of both Key Points and Expected Result |
| 2h | Row 6.1 | 6.1 | Reclassify as KNOWN DEFECT, rewrite expected result |

### Phase 3 — Update qa_plan_final.md Header
- Update `Plan Status` to `Draft v3 (Fixed — user-facing rewrite)`
- Add a one-line changelog note at the top of the Notes section

### Phase 4 — Self-Review Checklist
Before marking done, verify against each root cause:
- [ ] RC-1: Zero occurrences of `cmdMgr.`, `stid=`, `recoverReportFromError()`, `isReCreateReportInstance` in Test Key Points or Expected Results columns (except in the new AUTO subsection)
- [ ] RC-2: Zero occurrences of `flag set`, `flag NOT set`, `returns {`, `IS called`, `NOT called` in Expected Results (AUTO section excepted)
- [ ] RC-3: Every P0/P1 row has a numbered step sequence or Given/When/Then in Test Key Points
- [ ] RC-4: Every Expected Result describes what a tester sees in the browser (UI state, button states, dialog text)
- [ ] RC-5: Every P0/P1 row has a `FAILS if:` entry
- [ ] RC-6: Every row referencing BCIN-6706, BCIN-974, BCIN-6485, BCEN-4129 has a `⚙️ Setup:` prefix

---

## What the Fix Does NOT Cover (Out of Scope)

| Item | Reason |
|------|--------|
| Re-fetching Jira / GitHub / Confluence context | Context already gathered; no new information needed |
| Changing test priorities (P0/P1/P2) | Gap analysis did not flag priority assignments as wrong |
| Modifying Risk & Mitigation, QA Goals, or Sign-off sections | These sections are already user-facing and not flagged in the gap analysis |
| Rows 6.2–6.5, 6.7–6.9, 6.11, 6.14, 6.15 | These rows were NOT flagged in the gap analysis — they are already correct |
| Sections 5.3, 5.6 | These rows were NOT flagged — they are already correct |

---

## Estimated Effort

| Activity | Rows Touched | Estimated Time |
|----------|-------------|----------------|
| Class F: Move to AUTO | 7 rows | 15 min |
| Class C: Row splits | 3 rows → 7–8 rows | 20 min |
| Class A: Expected Results rewrites | 14 rows | 30 min |
| Class B: Add action sequences | 11 rows | 30 min |
| Class D: Setup notes | 5 rows | 10 min |
| Class E: FAIL criteria | 8 rows | 15 min |
| Rows 5.4, 6.1 special cases | 2 rows | 10 min |
| Header + changelog update | — | 5 min |
| **Total** | | **~2 hours** |

---

> [!NOTE]
> The `qa-plan-synthesize` skill's Step 3 consolidation instructions **already specify** that Test Key Points should be user-facing (§ Consolidation Approach, "Test Key Points" row). The root cause of these flaws is that the skill instruction exists but wasn't enforced during synthesis. A follow-up improvement to the skill prompt should add an explicit quality gate checklist (the RC-1 through RC-6 checks above) to prevent recurrence.
