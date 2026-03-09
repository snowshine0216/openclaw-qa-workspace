# Confluence Domain Review — BCIN-6709 v8

## Coverage Gaps (items in sub_test_cases_confluence not covered in v8)

### 1. "Running mode: normal manipulation error returns the report to pause mode" — P0 (sub_test_cases_confluence)
The Confluence sub test cases have this as a **P0** scenario: running mode normal manipulation triggers rebuild-document error → report view updates back to pause mode (grid area does not remain in stale running-mode view). In v8, the closest scenario is **"Running mode: normal manipulation preserves undo and redo after recovery" (P1)**, which covers undo/redo behavior but does NOT explicitly test that the document view transitions from running-mode grid to pause-mode empty view. The grid-view transition verification is a distinct P0 check in sub_test_cases_confluence ("The grid area does not remain in the stale running-mode view") and is under-covered as a standalone verification in v8.

### 2. "Error confirmation is operable and completes recovery" — P2 (sub_test_cases_confluence)
Sub_test_cases_confluence has a dedicated accessibility/interaction case: trigger a supported error that shows an acknowledgment dialog, dismiss through visible confirmation action, confirm dialog closes and recovery continues. v8 covers keyboard accessibility under **"Recovery dialogs and prompt-return flows are keyboard accessible" (P2)**, but that scenario focuses on keyboard-only navigation. The Confluence sub test case specifically checks the dialog's visible confirmation action (button operability) and that recovery continues after acknowledgment — this is not explicitly covered as a standalone check in v8.

### 3. "Prompt apply error uses the documented Library Web prompt error handling path" — P2 (sub_test_cases_confluence)
Sub_test_cases_confluence has a UX/Error Messaging P2 case specifically verifying that the prompt-specific recovery path is used (not a dead-end state) and the user can continue the prompt workflow from the recovered state. v8 covers the prompt flow via **"Return to prompt with previous answers preserved after prompt apply fails" (P0)** and **"Cancel from prompt-related recovery returns to a safe authoring state" (P1)**, but neither explicitly verifies that the *prompt-specific recovery path* (as documented in the design spec) is triggered vs. a generic error handler. This distinction from sub_test_cases_confluence is not addressed.

### 4. "Error dialog uses the mapped user-facing message for exceeded-row-limit recovery" — P2 (sub_test_cases_confluence)
Sub_test_cases_confluence explicitly checks the row-limit error dialog message: "dialog uses a user-facing application/server error presentation", "message explains the row-limit problem in understandable language", "dialog does not require the user to reopen the report to continue". v8 covers **"Recovery messages do not expose internal implementation details" (P2)** and **"Error details are shown consistently" (P1/BCIN-6574)** but does not have a dedicated check that the row-limit error specifically uses a mapped user-facing message (rather than a raw error). This is a distinct gap.

---

## Correctness Issues (actions that contradict the design doc)

### 1. Running mode: modeling-service manipulation concrete user actions — partially correct but over-specified
v8 lists three confirmed options for modeling-service manipulation:
- Option A: Advanced Properties row limit (confirmed)
- Option B: Join type change via `join-menu.tsx` (confirmed from Confluence)
- Option C: Template unit update from `report-def-slice.ts`

The Confluence design doc (section 2.2) confirms that modeling-service manipulation = PUT /api/model/reports and that running-mode modeling-service failures clear undo/redo. Option A and C are well-supported. **Option B** ("right-click a table relationship → Join Type → change to Cross Join on a report without a defined table relationship") — the Confluence design doc describes this as a modeling-service manipulation but does not explicitly prescribe "Cross Join on a report without a defined table relationship" as the triggering condition. The step as written introduces a Jira/GitHub-sourced implementation detail ("join-menu.tsx") and a specific triggering condition not described in the Confluence design doc. This is a correctness concern when the review lens is Confluence-only.

### 2. "Pause mode: normal manipulation" — concrete user actions are correct
v8 correctly identifies normal manipulation as POST /api/documents/{instanceId}/manipulations (view-template changes) with concrete examples: apply a view filter, sort rows, change display settings. This matches Confluence design doc section 2.2 ("POST /api/documents/{id}/instances/{instanceId}/manipulations"). ✅ No issue here.

### 3. "Modeling-service request failure does NOT recreate the document instance" — test setup references "BCIN-6485 test report" and "remove an attribute used in a filter"
The Confluence design doc section 2.2 describes the non-crashed-instance path: modeling-service request fails, no reCreateInstance call, document stays in current mode. The reference to "BCIN-6485 test report" is Jira-sourced context. While the test action itself (remove an attribute used in a filter) is plausible from the design, the primary setup anchor is a Jira ticket, not the Confluence design spec. Under a Confluence-only review lens, this is a **minor correctness concern** (the test may be valid, but the evidence anchor is wrong).

---

## Priority Issues

### 1. "Running mode: normal manipulation error returns the report to pause mode" — should be P0, not covered at P0 in v8
As noted above, sub_test_cases_confluence assigns this **P0**. v8 does not have this as a standalone P0 scenario; the nearest running-mode normal manipulation check is P1 (undo/redo preservation). The grid-state-transition check is missing at P0.

### 2. "Keep the next editing action possible after any recovery" — P0 in v8, P0 in sub_test_cases_confluence ✅
Confirmed matching priority.

### 3. "Pause mode: recovered report accepts the next action" — P0 in both v8 and sub_test_cases_confluence ✅
Confirmed matching priority.

### 4. "Prompt apply error returns the user back to the prompt" — P0 in sub_test_cases_confluence; v8 covers this under "Return to prompt with previous answers preserved after prompt apply fails" — P0 ✅
Confirmed matching priority.

### 5. All P1 scenarios (undo/redo, non-crash path, prompt cancel, integration) — P1 in both v8 and sub_test_cases_confluence ✅
No priority gaps found for P1 items.

### 6. P2 error messaging items — in v8, "Error details are shown consistently (BCIN-6574)" is **P1**, while sub_test_cases_confluence treats the error dialog message check as **P2**. However, these are not the same scenario (BCIN-6574 is about intermittent missing details, while sub_test_cases_confluence P2 is about the row-limit mapped message). No direct conflict.

---

## Actionability Issues

### 1. "Cross-repo recovery handshake completes end to end" — P0 in v8
The expected result "Recovery completes without dead-end behavior" and "The follow-up operation confirms the server/client recovery contract works end to end" is vague from a design spec perspective. The Confluence design doc describes the specific interaction between react-report-editor, mojojs, biweb, and the server, but v8 does not specify which observable API calls or UI states confirm the handshake succeeded. Reviewers cannot deterministically pass/fail this without a more specific expected result (e.g., "no POST with reCreateInstance: true is triggered when it shouldn't be", "server returns 200 on follow-up manipulation").

### 2. "Repeated recovery cycles remain stable" — P1 in v8
The expected result "editor remains fully responsive after each cycle" is vague. The Confluence design doc implies stability is measured by the absence of stale loading states, frozen commands, or inconsistent report state, but v8 does not specify how many cycles constitute "repeated" or what specific checks confirm stability.

### 3. "Workstation parity expectations from BCIN-6706" — P2 in v8
This scenario is anchored in a Jira ticket (BCIN-6706) and says "confirm whether the user can inspect failure context or continue editing comparably to Developer" — this is exploratory/investigative rather than a verifiable expected result. From a Confluence design spec perspective, there is no Confluence-documented Workstation parity expectation, making this not actionable as a verifiable test case.

---

## Overcoverage (v8 items not backed by Confluence)

### 1. "Continue editing after a Cartesian-join execution error (BCIN-974)" — P0
The Confluence design doc references BCIN-974 in the component table as an example scenario but does not independently specify the Cartesian-join reproduction steps (attributes: Object Category, Object Extended Type, Object Type, Change Type). The specific repro steps are Jira-sourced. The general behavior (report recovers after execution error) is Confluence-backed, but the specific BCIN-974 repro is not a Confluence design doc artifact. **Marginally overcovered** as a Confluence evidence item.

### 2. "Error details are shown consistently when the product is supposed to expose them (BCIN-6574)" — P1
This scenario is explicitly anchored to Jira ticket BCIN-6574 ("intermittent missing-error-details scenario from BCIN-6574"). There is no equivalent scenario in sub_test_cases_confluence or the Confluence design doc. This is Jira-sourced and is **not backed by Confluence evidence**. Under a Confluence-only review lens this is overcoverage.

### 3. "Workstation parity expectations from BCIN-6706" — P2
Anchored entirely in Jira ticket BCIN-6706. Not referenced in the Confluence design doc or sub_test_cases_confluence. **Not backed by Confluence evidence.**

### 4. "AUTO: Automation-Only Tests" — P0 (unit/integration coverage)
The automation section references specific implementation file names (`recreate-report-error.ts`, `shared-recover-from-error.ts`, `undo-redo-util.ts`, `RootController.js`, `UICmdMgr.js`, `ErrorObjectTransform.js`, `promptActionCreators.js`, `RWManipulationBuilder.java`, `Statuses.fdb`, `Strings.fdb`). These file references come from GitHub diff analysis, not Confluence design doc. The Confluence design doc describes the behavioral contract but does not enumerate these implementation files. Under a Confluence-only lens, this section is **backed in behavior but over-specified with GitHub-sourced implementation details**.

### 5. "Major browser coverage for continued editing after failure" — P2
The Confluence design doc section 1.2 (Deployment Type Support) describes deployment environment coverage but does not enumerate browser-level test requirements (Chrome, Firefox, Safari, Edge). This scenario is standard QA practice but is not specifically Confluence-backed.

### 6. "Keep pause-data-retrieval path unblocked after execution error" (follow BCIN-974 steps) — P1
Step instruction "Follow BCIN-974 reproduction steps" is Jira-sourced. The general behavior (Pause Data Retrieval remains unblocked) is Confluence-backed via the component table BCIN-974 row, but the specific repro anchor is Jira.

---

## Verdict: NEEDS_FIXES

**Rationale:**

1. **P0 coverage gap**: The Confluence sub test case "Running mode: normal manipulation error returns the report to pause mode" (P0) — specifically the document view transitioning from running-mode grid to pause-mode empty view — is not covered at P0 in v8. This is the most critical gap.

2. **Two P2 Confluence sub test cases under-covered**: "Error dialog uses the mapped user-facing message for exceeded-row-limit recovery" and "Error confirmation is operable and completes recovery" are present in sub_test_cases_confluence but not directly represented as standalone checks in v8.

3. **Overcoverage with non-Confluence evidence**: BCIN-6574 (P1) and BCIN-6706 (P2) scenarios are Jira-only and not backed by Confluence design evidence. The AUTO section over-specifies implementation file names from GitHub diffs.

4. **Minor actionability issues**: "Cross-repo recovery handshake" and "Repeated recovery cycles" expected results need more specific, verifiable criteria.

**Recommended fixes before approval:**
- Add a standalone P0 scenario verifying the running-mode grid-to-pause-mode view transition after normal manipulation error.
- Add or strengthen P2 checks for row-limit error dialog message quality and dialog operability/confirmation.
- Downgrade or annotate BCIN-6574 and BCIN-6706 scenarios as Jira-sourced (not Confluence-backed), or move them to a Jira-domain section.
- Tighten expected results for cross-repo handshake and repeated-cycle stability scenarios.
