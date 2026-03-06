# QA Plan Key Test Points — Gap Analysis
**Feature**: BCIN-6709 — Improve Report Error Handling for Continued Editing in Library  
**Source Plan**: `workspace-planner/projects/feature-plan/BCIN-6709/qa_plan_final.md`  
**Reference (real QA)**: `workspace-tester/projects/wdio/resources/BCIN-6567.xlsx` (human-authored test matrix)  
**Date**: 2026-03-05  
**Purpose**: Locate every flaw in the current **Test Key Points** section of the generated plan — row by row — so the team can fix the plan before it is reviewed.

**Related Design**: See `QA_PLAN_QUALITY_GATE_DESIGN.md` for the implementation spec. See `QA_PLAN_FIX_PLAN.md` for the row-by-row fix specification.

> [!IMPORTANT]
> This document covers **flaws only**. It does not re-state what is already correct.
> Two root causes drive almost all issues:
> 1. **Test Key Points feel like code review notes**, not executable test steps a QA engineer can pick up and run.
> 2. **Expected Results describe internal implementation state**, not observable UI/network outcomes.

---

## Root Cause Summary (Before Row-Level Breakdown)

| Root Cause | Description |
|---|---|
| **RC-1: Engineer-level vocabulary** | Test Key Points use `cmdMgr.reset()`, `stid=-1`, `recoverReportFromError()`, `isReCreateReportInstance` — terms only the developer who wrote the code can use. A QA engineer cannot act on these without reading source code. |
| **RC-2: Invisible verification steps** | "Verify X is called", "confirm flag set true" — these cannot be observed in a browser without a debugger attached. They are unit-test assertions, not manual QA steps. |
| **RC-3: Missing user action sequence** | Many rows have no clear "Given / When / Then" from a user's perspective. The "Test Key Points" column often jumps straight to what-to-verify rather than what-to-do. |
| **RC-4: Expected Results conflate symptoms with implementation** | E.g. "`cmdMgr.reset()` IS called; undo/redo cleared" — the correct observable expectation is "the Undo button becomes greyed out / disabled". |
| **RC-5: Missing failure/negative path behavior** | What does the UI show if the test fails? There is no description of the distinguishing incorrect behavior, making it impossible to know when to mark a test FAIL. |
| **RC-6: Test objects not ready / no setup steps** | Several rows reference BCIN-6706, BCIN-974 report objects but give no instructions on how to prepare them in a test environment. |
| **RC-7: Empty GitHub diff (upstream context failure)** | When `context/github_diff.md` or `context/github_<repo>.diff` is empty, qa-plan-github cannot produce meaningful Code Changes analysis. The workflow proceeds anyway, leading to thin or incorrect GitHub domain summaries. **GitHub diff is required** when a PR URL is provided; the workflow must STOP and notify the user if diff(s) are empty. |

---

## Upstream Context: Empty GitHub Diff (RC-7)

**Observed**: BCIN-6709 has `github_biweb.diff`, `github_mojojs.diff`, `github_web-dossier.diff` all 0 bytes. Only `github_react-report-editor.diff` has content (57 bytes).

**Impact**: qa-plan-github reads diff files to extract code changes, risk areas, and test scope. Empty diffs mean no code context for those repos — the GitHub domain summary is incomplete or inferred from other sources. Downstream synthesis then maps ACs to Code Changes without accurate code-level input, worsening RC-1 through RC-4.

**Design fix** (see `QA_PLAN_QUALITY_GATE_DESIGN.md`): Add Phase 1 Step 1b — **GitHub Diff Validation**. After fetching diffs, if any expected diff (single PR: `context/github_diff.md`; multi-repo: `context/github_<repo>.diff`) is empty when a GitHub PR URL was provided → STOP, notify user, do not proceed to Phase 2a or 2b. Message: *"GitHub diff is empty. The PR may be inaccessible, the URL may be wrong, or the repo may require different auth. Please verify the PR URL and retry. Cannot proceed without code changes."*

---

## Section 1 — Error Recovery: Pause Mode Resume Errors

### Row 1.1 — Max Rows Exceeded on Resume

**Current "Test Key Points":**
> Resume for report exceeding max rows

**Current "Expected Results":**
> Error dialog shows; server routes to reCreateInstance() (NOT undo()); XML contains `<os>8</os>`; no prompt popup; returns to pause mode (empty grid); can resume again

**Flaws:**

1. **Test Key Point is a label, not a test step.** "Resume for report exceeding max rows" tells the tester what scenario exists, not what actions to take. A tester needs: (1) which report to open, (2) what "Resume Data Retrieval" looks like, (3) what action triggers the max-rows condition.

2. **"server routes to reCreateInstance() (NOT undo())"** is an internal routing decision inside `RWManipulationBuilder.java`. A QA engineer cannot verify this without reading Java server logs or debug output. The observable equivalent is: "open the browser DevTools → Network tab → confirm a POST request matching `/instances/{id}/manipulations` appears with `reCreateInstance: true` in the request body."

3. **"XML contains `<os>8</os>`"** — same problem. The expected result requires inspecting raw XML payload. This belongs in an API/integration test, not a manual QA test. The user-facing equivalent is: "the report returns to pause mode showing an empty grid (no data rows), and no prompt dialog appears."

4. **"can resume again"** is vague — what does a successful second resume look like? Does data load? Does an error occur again? Expected result must state what a pass looks like.

5. **The acceptance criteria column is more useful than the Test Key Points column.** This is backwards. The acceptance criteria in the generated plan reads: *"Given report in pause mode with edits, when Resume Data Retrieval triggers rebuildDocument and it fails..."* — that is the correct format for a test point, but it is in the wrong column.

---

### Row 1.2 — SQL Failure on Resume

**Current "Test Key Points":**
> Open report with SQL failure (BCIN-6706) → click "Resume Data Retrieval" for → verify loading overlay is hidden when dialog appears

**Current "Expected Results":**
> Error dialog shows; loading overlay hidden; OK button clickable; returns to pause mode; no forced navigation to Library home

**Flaws:**

1. **Typo / incomplete step**: "click 'Resume Data Retrieval' for →" — the sentence is cut off. This will confuse a tester.

2. **"loading overlay hidden"** — the tester needs to know what this overlay looks like. Is it a full-screen spinner? A bar at the top? Without visual context, the tester cannot confirm it is gone vs never appeared.

3. **Missing setup**: How is the BCIN-6706 report configured? Is it a shared test object on a test server? Which server? The Excel matrix (BCIN-6709.xlsx) simply says "SQL error" under "Resume Data" — but the QA plan gives a Jira link without providing a direct path to the test object in IServer.

4. **"no forced navigation to Library home"** — this is a regression guard, not an expected result for the new behavior. It should be labeled as such: "REGRESSION: user stays on the report view; no automatic redirect."

5. **Missing failure signature**: What does a failing test look like? If the loading overlay remains stuck, can the tester immediately recognize that as a failure, or could it be a slow network? A pass/fail criterion is missing.

---

### Row 1.3 — Analytical Engine Error (Cartesian Join)

**Current "Test Key Points":**
> Open report (BCIN-974) → add conflicting attribute

**Current "Expected Results":**
> Engine error handled; returns to pause mode

**Flaws:**

1. **Extremely underspecified expected result.** "Engine error handled; returns to pause mode" has no observable detail. The real QA expectation (from the Excel matrix) is: the error dialog should appear, the user clicks OK, and the grid resets to an empty pause-mode state — not frozen, not showing stale running-mode data.

2. **"add conflicting attribute"** — which attribute? On which report? The Cartesian join error is triggered by adding a specific type of pair of attributes. Without specifying that, the test cannot be reproduced reliably by a different QA engineer.

3. **Priority is P0 but expected result is the thinnest in the section.** High-priority tests need the most detail, not the least.

4. **Missing: what is the error message text?** The Excel matrix asks whether the "engine error handled" dialog shows a meaningful message. The generated plan does not tell the tester what text to expect.

---

### Row 1.4 — MDX/ODBC Error

**Current "Test Key Points":**
> Open MDX report (BCEN-4129) → click "Resume Data Retrieval"

**Current "Expected Results":**
> Error dialog; returns to pause mode without crash

**Flaws:**

1. **"without crash"** is not a testable expected result — it is the absence of a failure. What does a successful recovery look like? What does the dialog title say? Can the tester click Resume again after dismissing?

2. **No error message spec.** MDX/ODBC errors produce a different error message than max-rows errors. The tester should be told what the error dialog text should read.

3. **BCEN-4129 is a different project prefix (BCEN vs BCIN).** This needs a note clarifying it is a real test object in a different board, and that the QA engineer needs access to that project to reproduce.

---

### Row 1.5 — Second Resume After Recovery (No Hang)

**Current "Test Key Points":**
> Recover from error → click "Resume Data Retrieval" again → verify no hanging

**Current "Expected Results":**
> No hanging/stuck state; cmdMgr.reset() NOT called (undo/redo preserved); request proceeds normally

**Flaws:**

1. **"cmdMgr.reset() NOT called"** — this is entirely unverifiable via manual testing. A QA engineer cannot observe whether `cmdMgr.reset()` was called without attaching a JavaScript debugger and setting a breakpoint. The correct user-facing equivalent is: **"after clicking Resume a second time, the Undo/Redo toolbar buttons remain in the same enabled/disabled state as before the error."**

2. **"no hanging"** — how long should the tester wait before calling it hung? 10 seconds? 30? The test plan needs a timeout threshold.

3. **"request proceeds normally"** — what does "proceeds normally" mean? Does data load? Does the grid populate? Or does another error appear (which might also be acceptable)?

---

## Section 2 — Error Recovery: Running Mode Manipulation Errors

### Row 2.1 — Row Limit Change in Advanced Properties

**Current "Test Key Points":**
> Open running report → File → Report Properties → Advanced Properties → set low row limit → Done. Verify cancelRequests complete callback calls cmdMgr.reset()

**Current "Expected Results":**
> Modeling service PUT succeeds; rebuildDocument fails; error dialog; returns to pause mode; cmdMgr.reset() IS called; undo/redo cleared

**Flaws:**

1. **"Verify cancelRequests complete callback calls cmdMgr.reset()"** — this is a source-code-level assertion. A manual QA tester cannot verify a JavaScript callback was invoked. The observable equivalent is: **"after the error dialog appears and you click OK, open Edit menu — Undo is greyed out (history was cleared)."**

2. **"Modeling service PUT succeeds; rebuildDocument fails"** — these are internal server-call outcomes. The user-visible footprint is: the row limit setting takes effect (visible in Advanced Properties if re-opened), but the grid goes empty (pause mode), and the error dialog appears. Write it from that angle.

3. **"set low row limit → Done"** — what is "low"? The Excel matrix and design doc both say "set to 300". The test key point should specify the exact value so it is reproducible.

4. **Missing undo/redo state verification step.** The expected result says "undo/redo cleared" but does not tell the tester how to verify this (open Edit menu, check button states, attempt Ctrl+Z).

---

### Row 2.2 — Document View Manipulation Error in Running Mode

**Current "Test Key Points":**
> Trigger manipulation error in running mode → verify grid updates and loading overlay hidden

**Current "Expected Results":**
> Grid view updates to pause mode (empty), not stale running-mode grid; mstrApp.appState set to DEFAULT; isViewTemplateDirty reset to false; loading overlay hidden

**Flaws:**

1. **"mstrApp.appState set to DEFAULT"** and **"isViewTemplateDirty reset to false"** — both are internal JavaScript state. Neither is visible in the UI without DevTools. The team should decide: is this a manual test or an automated unit test? If manual, rewrite the expected result as what the user sees. If automated, it should not appear in a manual QA plan row.

2. **"Trigger manipulation error in running mode"** — how? The test step must say what action triggers the error (e.g., "add an attribute that causes a Cartesian join while the report is in running mode").

3. **"not stale running-mode grid"** — good intent, but how does a tester distinguish a stale running-mode grid from a correct pause-mode empty grid? Describe the visual difference (e.g., "grid should show no data rows and the Run button should be visible, not a loading spinner").

---

### Row 2.3 — Modeling Service Manipulation Error (Join Type / Template Unit)

**Current "Test Key Points":**
> Perform modeling service operation causing error → verify cmdMgr.reset() called

**Current "Expected Results":**
> isModelingServiceManipulation=true → undo/redo history cleared

**Flaws:**

1. **"Perform modeling service operation causing error"** — no specific operation named. From the Excel matrix: this should be "update report filter" or "modify join type". A test step must name the specific action.

2. **"verify cmdMgr.reset() called"** and **"isModelingServiceManipulation=true"** — both internal state. Same RC-2 problem as above. Replace with: "after dismissing the error dialog, the Undo button is disabled." That is the only observable consequence the tester can check.

3. **The "prompt" and "modify join type" and "update grid template" sub-cases from the Excel matrix are all collapsed into this one row.** The generated plan does not distinguish between these three sub-scenarios. Each produces slightly different observable behavior and should be separate rows.

---

### Row 2.4 — Non-Modeling Manipulation Error (Undo/Redo Preserved)

**Current "Test Key Points":**
> Make several edits → trigger non-modeling error → verify cmdMgr.reset() NOT called

**Current "Expected Results":**
> Returns to pause mode; undo/redo history preserved; can undo after resuming

**Flaws:**

1. **"trigger non-modeling error"** — what action triggers a "non-modeling" error? The tester doesn't know what constitutes a modeling vs. non-modeling operation. The test step must specify an example action (e.g., "add a metric to the grid using the grid toolbar — not via File → Report Definition").

2. **"verify cmdMgr.reset() NOT called"** — unverifiable manually. Replace with the observable check: "after dismissing the error, press Ctrl+Z — confirm the previous edit is undone (attribute/metric reverts)."

3. **"can undo after resuming"** in expected results is good, but the test step doesn't say to click Resume first. The flow must be written out: error → OK → verify Undo still works → click Resume → verify successful run OR another error.

---

## Section 3 — Modeling Service Errors: No Instance Crash

### Row 3.1 — Remove Attribute Used in Filter

**Current "Test Key Points":**
> Open report (BCIN-6485) → remove attribute used in filter

**Current "Expected Results":**
> PUT /model/reports returns analytical error; grid still displays; error message shown; can continue editing

**Flaws:**

1. **"PUT /model/reports returns analytical error"** — the tester should not need to watch the network tab to confirm the primary expected result. The user-facing check is: the grid does NOT go blank/empty (unlike the other error types); the report data remains visible; an error toast or dialog appears.

2. **Missing: what error message should appear?** "Error message shown" is incomplete. What are the title and text of the message the user should read?

3. **"can continue editing"** — what does "continue editing" look like? Add another attribute? The tester needs one concrete follow-up action to confirm the report is still in an editable state.

4. **Critical distinction not highlighted**: This scenario is fundamentally different from Sections 1 & 2 — the instance is NOT recreated, data stays visible. The test key point should make this contrast explicit so the tester knows to deliberately check that the grid does NOT go to pause mode.

---

### Row 3.2 — No reCreateInstance Sent for Modeling Service Error

**Current "Test Key Points":**
> Trigger any PUT /model/reports error → check network tab

**Current "Expected Results":**
> No reCreateInstance API call; existing error handling proceeds; no osFlag=8 request

**Flaws:**

1. **"Trigger any PUT /model/reports error"** — relies on the tester knowing when a PUT to `/model/reports` fires. This is a network-layer event, not a user-visible action. The step should say what UI action triggers it (e.g., "update the report filter to remove an attribute currently in use").

2. **"check network tab"** is the only verification instruction — this means the entire test is about inspecting F12 network traffic. That is an automated/API test, not a user-facing manual test. It should either be moved to an automation section or rewritten for what a tester can observe in the UI alone.

3. **No user-visible expected result at all.** What does the user see? An error message? A toast? Does the grid change? The expected result only describes what is NOT happening server-side.

---

## Section 4 — Prompt Answer Errors

### Row 4.1 — Max Rows Error on Prompt Answer

**Current "Test Key Points":**
> Open prompted report → answer with values causing max rows exceeded → verify error dialog buttons

**Current "Expected Results":**
> Error dialog shows "OK" and "Cancel" buttons; click Cancel → returns to prompt with previous answers

**Flaws:**

1. **"answer with values causing max rows exceeded"** — what values? The tester needs to know which attribute members or filter values will trigger the max rows limit. Without this, reproducing the test is based on trial and error.

2. **"previous answers preserved"** — good expectation, but not in the expected result column. Add: "the prompt dialog reopens pre-populated with the same attribute member selections the user previously chose."

3. The Excel matrix shows two sub-paths: click OK (returns to pause mode) and click Cancel (returns to prompt). The generated plan mentions Cancel but **drops the click-OK path entirely**. Row 4.1 should have two sub-rows or explicitly document both paths.

---

### Row 4.2 — Max Rows Error on Reprompt

**Current "Test Key Points":**
> Open report → answer prompt → trigger reprompt → answer with max rows values

**Current "Expected Results":**
> Error dialog shows "OK" and "Cancel Reprompt" buttons; click Cancel Reprompt → returns to reprompt

**Flaws:**

1. **"trigger reprompt"** — what makes a reprompt happen? The tester needs to know which report type or which answer triggers a reprompt. This is not explained.

2. **"Cancel Reprompt" button text** — the code has a `// TODO lyk` comment indicating the button label is not finalized. The test plan should flag this as: **"PENDING UX SIGN-OFF — button label TBD; verify label reads 'Cancel Reprompt' or whatever UX finalizes."** Without that flag, a tester might fail a valid build because the button says "Cancel" instead of "Cancel Reprompt".

3. **Same missing click-OK path** as 4.1: clicking OK should dismiss the prompt and return to pause mode. Not documented.

---

### Row 4.3 — Non-Max-Rows Prompt Error (No Cancel Button)

**Current "Test Key Points":**
> Trigger non-max-rows prompt error

**Current "Expected Results":**
> Error shows "OK" and "Email" buttons only; NO "Cancel" button

**Flaws:**

1. **"Trigger non-max-rows prompt error"** — how? What specific prompt input causes a prompt error that is NOT a max-rows error? The tester has no guidance. Example: provide an answer that generates a SQL syntax error in the prompt resolution.

2. **"Email" button** — what should happen when Email is clicked? The expected result does not document the Email action outcome. The Excel matrix (row 23) specifies: "launch email client." That is missing from the expected result.

3. **This expected result contains a negative assertion ("NO Cancel button")** without a positive expected behavior. Add: "clicking OK dismisses the error dialog and the user is returned to pause mode (prompt is not re-opened)."

---

### Row 4.4 — Nested Prompt Error → Return to Prompt

**Current "Test Key Points":**
> Open nested prompt report → answer inner prompt causing error

**Current "Expected Results":**
> Returns to prompt with previous answers

**Flaws:**

1. **No setup instructions**: What is a "nested prompt report"? Which test report exposes this? This is the thinnest row in Section 4 yet it covers a complex scenario.

2. **"Returns to prompt with previous answers"** — which prompt? The inner or the outer? The expected result is ambiguous for nested scenarios.

3. **Missing button verification**: The expected result in 4.1 and 4.2 specifies which buttons appear. 4.4 skips this entirely — does the dialog show OK+Cancel? OK only?

---

### Row 4.5 — Consumption Mode: No Cancel Button

**Current "Test Key Points":**
> Trigger prompt error in consumption mode

**Current "Expected Results":**
> applyReportPromptAnswersFailure flag NOT set; old error handling

**Flaws:**

1. **"applyReportPromptAnswersFailure flag NOT set"** — internal Redux state. Unverifiable by a QA engineer. The observable expected result is: "only the standard error dialog appears with no Cancel/Cancel Reprompt button; behavior is identical to pre-BCIN-6709."

2. **"old error handling"** — what does old error handling look like? The tester needs to know the baseline so they can confirm there is no regression. Document the pre-existing behavior explicitly.

3. **"Trigger prompt error in consumption mode"** — what is the distinction between consumption mode and authoring mode in the Library UI? This needs a note for QA engineers who may not know how to switch modes.

---

### Row 4.6 — Cancel Prompt Still Works After Recovery

**Current "Test Key Points":**
> Recover from error → trigger reprompt → cancel prompt

**Current "Expected Results":**
> saveCancelPromptStateId properly set; cancel prompt returns to correct state

**Flaws:**

1. **"saveCancelPromptStateId properly set"** — internal Redux state. This cannot be manually verified. Replace with: "when cancel is clicked in the reprompt dialog, the report returns to the state it was in before the reprompt was triggered (data visible, same as pre-reprompt)."

2. **The step sequence is underspecified for a post-recovery scenario.** It should read: (1) trigger an error that is recovered, (2) run the report, (3) a reprompt dialog appears, (4) click Cancel in the reprompt, (5) verify correct state. Each of these steps needs to be spelled out.

---

## Section 5 — Scope & Boundary

### Row 5.1 — Consumption Mode: ReCreateErrorCatcher Not Rendered

**Current "Test Key Points":**
> Open report in consumption mode → trigger error

**Current "Expected Results":**
> ReCreateErrorCatcher not rendered; standard error handling applies

**Flaws:**

1. **"ReCreateErrorCatcher not rendered"** — this React component is internal. A tester cannot see whether it is rendered. The observable expected result is: "the standard error page/dialog appears; there is no Cancel or Cancel Reprompt button; the user is not kept on the report view after clicking OK."

2. **"trigger error"** — how? Which kind? This is a scope/boundary test; it needs a specific error example that would trigger the new behavior in authoring mode, to confirm it does NOT trigger it in consumption mode.

---

### Row 5.2 — Recovery Function Skips Consumption Mode

**Current "Test Key Points":**
> Trigger recoverable error in consumption mode

**Current "Expected Results":**
> recoverReportFromError returns { handled: false }

**Flaws:**

1. **Entire expected result is a function return value.** `recoverReportFromError returns { handled: false }` is a unit test assertion, not a QA test expected result. The entire row should be either merged with 5.1 or rewritten as: "the report behaves as it did before BCIN-6709 — no instance recreation, user may be navigated away from the report."

---

### Row 5.4 — All Deployment Types

**Current "Test Key Points":**
> Test error recovery on different deployments

**Current "Expected Results":**
> Recovery works consistently

**Flaws:**

1. **No test steps at all.** This is the most under-specified row in the entire plan. The Excel matrix lists: MCE, MEP, MCG, MCP, Tanzu, CMC. The test key point should specify: which error type to reproduce, on which deployment types, and what constitutes "consistent" behavior.

2. **"Recovery works consistently"** could mean anything. Specifies no measurable pass criterion.

3. **P1 priority but no test body** — this is a coverage gap, not just a wording issue.

---

### Row 5.5 — stid != -1 Does Not Use reCreateInstance

**Current "Test Key Points":**
> Send payload with stid=5, reCreateInstance=true

**Current "Expected Results":**
> Routes to normal undo(), not reCreateInstance()

**Flaws:**

1. **This is a server-side API test, not a UI test.** "Send payload with stid=5" requires crafting an HTTP request manually (via curl or Postman). It should be categorized under API/integration testing, not as a manual QA test key point.

2. **"Routes to normal undo()"** is a server-side routing decision. Neither the routing nor `undo()` invocation is observable from the browser UI. Remove from manual QA section or rewrite as an automated API test.

---

### Row 5.7 — isReCreateReportInstance Flag Lifecycle

**Current "Test Key Points":**
> Trace flag through full recovery flow

**Current "Expected Results":**
> Flag set true → API call → flag set false; no stale flag state

**Flaws:**

1. **"Trace flag"** is a debugging action, not a QA test step. You cannot trace a JavaScript flag manually in a browser without setting breakpoints in source code.

2. **The entire row is about internal flag management.** The observable proxy for this test is: "trigger a second error immediately after a first recovery completes — verify the second recovery also works correctly." That is how flag lifecycle issues surface to the user.

---

## Section 6 — Edge Cases & Negative Tests

### Row 6.1 — reCreateInstance API Call Fails (Network Timeout)

**Current "Test Key Points":**
> Simulate network timeout or server failure during recovery

**Current "Expected Results":**
> Unhandled promise rejection likely (no try/catch in code). Verify: (1) no blank/crashed screen, (2) existing ErrorCatcher catches rejection, (3) escalate to dev team to add try/catch if ungraceful

**Flaws:**

1. **The expected result already admits the behavior is likely broken ("Unhandled promise rejection likely").** This row should be classified as a **known defect to validate**, not a standard test case. It should say: "EXPECTED TO FAIL — document observed behavior and file a bug if ungraceful crash occurs."

2. **"Simulate network timeout"** — how? Network throttling in DevTools? Disabling Wi-Fi? Intercepting the specific request with a proxy? The setup is unspecified.

3. **"(3) escalate to dev team"** is not an expected result — it is an action item. These are different things and should not be mixed into the expected results column.

---

### Row 6.6 — Hex Conversion Edge Cases

**Current "Test Key Points":**
> Pass NaN, negative ints, hex strings to toHex()

**Current "Expected Results":**
> NaN → 0; negative int → correct unsigned hex; hex string → correct parse

**Flaws:**

1. **This is a unit test, not a manual QA test.** A QA engineer cannot call `ServerAPIErrorCodes.toHex()` from the browser without writing DevTools console scripts. This entire row belongs in the automation section, not Key Test Points.

2. **No UI-facing impact described.** What would a user see if hex conversion was broken? That breakdown is what belongs in the manual QA plan.

---

### Row 6.10 — Error Swallowed (swallow=true)

**Current "Test Key Points":**
> Trigger error matching IServerIgnoreCodeType

**Current "Expected Results":**
> No dialog rendered; error silently swallowed

**Flaws:**

1. **"Trigger error matching IServerIgnoreCodeType"** — a QA engineer does not know what action triggers error code `-2147205027`. The test step must describe the user action that produces this specific response from the server.

2. **"No dialog rendered"** — how does the tester confirm "no dialog" is the correct behavior vs. a bug where the dialog failed to render? The expected result needs a positive confirmation of continued usability: "no dialog appears AND the report remains in its current working state (no degradation)."

---

### Row 6.12 — External Error Handler Priority

**Current "Test Key Points":**
> External handler returns true

**Current "Expected Results":**
> Dialog NOT shown; external handled

**Flaws:**

1. **"External handler returns true"** is a code-level precondition, not a user action. There is no user-facing test step here at all. This row should either reference a specific SDK/embedding scenario (where the external handler is the embedding application) or be moved to an automation test.

2. **"External handled"** is not a testable result. What observable thing happens in the embedding application that the tester can validate?

---

### Row 6.13 — window.mstrApp Undefined During Recovery

**Current "Test Key Points":**
> Trigger error before mstrApp fully initialized

**Current "Expected Results":**
> No TypeError crash; error handled gracefully or fallback path taken

**Flaws:**

1. **"Trigger error before mstrApp fully initialized"** — this is a race condition. It cannot be reliably triggered manually. This is an automated test scenario (slow / throttled page load + timed error injection). Should not be in the manual QA test key points without explicit reproduction steps.

2. **"error handled gracefully or fallback path taken"** — the "or" means the tester does not know which outcome to expect. An expected result cannot be ambiguous. Decide: either it is graceful OR it fails in a known way. Document which.

---

## Summary: Flaw Frequency by Type

| Flaw Type | Count | Affected Rows / Scope |
|---|---|---|
| Upstream: empty GitHub diff (blocks quality Code Changes analysis) | 1 | `context/github_*.diff` — BCIN-6709: biweb, mojojs, web-dossier empty |
| Expected result references internal code/state (not user-visible) | 18 | 1.5, 2.1, 2.2, 2.3, 2.4, 3.2, 4.5, 4.6, 5.1, 5.2, 5.5, 5.7, 6.1, 6.6, 6.12, 6.13 |
| Test Key Point lacks specific user action steps | 14 | 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 3.2, 4.1, 4.3, 4.4, 5.4, 5.5, 6.1, 6.13 |
| Missing setup / test object / environment instruction | 9 | 1.2, 1.3, 1.4, 2.1, 4.1, 4.4, 5.5, 6.1, 6.10 |
| Missing negative/failure signature (how to recognize FAIL) | 8 | 1.1, 1.2, 1.3, 3.1, 4.3, 5.1, 6.1, 6.10 |
| Multi-path scenario collapsed to single row | 4 | 4.1, 4.2, 2.3, 2.4 |
| Row is a unit/API test misplaced in manual QA | 5 | 3.2, 5.2, 5.5, 5.7, 6.6 |
| Ambiguous expected result ("or", "consistently") | 3 | 5.4, 6.12, 6.13 |
| Unclear/unfinalized UI element (button label) | 1 | 4.2 |

---

## Recommended Fix Approach (Priority Order)

1. **P0 — Empty diff guard (workflow)**: When GitHub PR URL is provided, validate diff file(s) after fetch. If empty → STOP, notify user, do not proceed. See `QA_PLAN_QUALITY_GATE_DESIGN.md` Part D.

2. **P0 — Rewrite all Expected Results** to describe only observable UI + network outcomes. Every mention of a JavaScript function, flag, or internal class must be replaced with what a user sees/does in the browser.

3. **P0 — Add explicit user action sequences** to every Test Key Point row using a "Given / When / Then" or numbered step format.

4. **P1 — Move pure code-level tests out of Key Test Points**: rows 3.2, 5.2, 5.5, 5.7, 6.6, 6.12, 6.13 belong in an Automation / API Testing section, not in the manual QA table.

5. **P1 — Split collapsed multi-path rows**: 4.1 (OK path + Cancel path), 4.2 (OK path + Cancel Reprompt path), 2.3 (prompt sub-case, join type sub-case, grid template sub-case) should each be separate rows.

6. **P1 — Add environment + test object setup** for every row referencing BCIN-6706, BCIN-974, BCIN-6485, BCEN-4129 reports: include the IServer project name, folder path, or a setup script reference.

7. **P2 — Add FAIL criteria** to P0/P1 rows: "This test FAILS if..." makes the plan actionable for a tester making a pass/fail call.

8. **P2 — Flag row 4.2 button label** as "PENDING UX SIGN-OFF" until the TODO in `ActionLinks.js` is resolved.
