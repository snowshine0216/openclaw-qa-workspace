# BCIN-6709 Jira-Only Sub Test Cases

## Scope and Evidence
These sub test cases are derived only from Jira/Atlassian evidence in:
- `projects/feature-plan/BCIN-6709/context/qa_plan_atlassian_BCIN-6709.md`
- `projects/feature-plan/BCIN-6709/context/jira_issue_BCIN-6709.txt`
- `projects/feature-plan/BCIN-6709/context/jira_issue_BCIN-7543.txt`

## Jira-Inferred Coverage Focus
- Recover from report errors without forcing the user to exit and reopen
- Preserve editing continuity after an error
- Handle prompt-answer cancel / return-to-prompt behavior
- Keep document view visible even when an error appears
- Handle pause and data retrieval status switching around errors
- Validate expected undo/redo behavior after recovery flows

---

## TC-JIRA-01 Recover from report error without forced reopen
**Priority:** P0  
**Goal:** Confirm a report error does not force the user to abandon the report and reopen it to keep working.

**Preconditions:**
- A report is open in edit mode.
- The user has made visible in-progress edits.
- A recoverable report error condition can be triggered.

**Steps:**
1. Open the report and make a visible edit.
2. Trigger a report error during the editing session.
3. Observe the error handling shown to the user.
4. Without reopening the report, attempt to continue editing in the same session.

**Expected Results:**
- An error is shown to the user when the failure occurs.
- The report session remains available instead of forcing the user out of the editor.
- The user can continue working without closing and reopening the report.
- Previously entered visible edits are not lost solely because the error occurred.

---

## TC-JIRA-02 Editing continuity after error recovery
**Priority:** P0  
**Goal:** Confirm the editing experience remains usable after an error is handled.

**Preconditions:**
- A report is open in edit mode.
- The user can make at least two visible edits before the error occurs.

**Steps:**
1. Open the report and make multiple visible edits.
2. Trigger a report error.
3. Dismiss or complete the available recovery path.
4. Continue editing the report.
5. Save or apply another visible edit after recovery.

**Expected Results:**
- The editor returns to a usable state after the error.
- The user can continue making additional edits after recovery.
- The post-recovery edit behaves like a normal edit from the user perspective.
- The editing flow is not reset in a way that blocks continued work.

---

## TC-JIRA-03 Error message supports user continuation
**Priority:** P1  
**Goal:** Confirm the error handling gives the user enough direction to understand the interruption and continue.

**Preconditions:**
- A report is open and a recoverable error can be triggered.

**Steps:**
1. Trigger a report error while editing.
2. Read the error dialog, banner, or other visible message.
3. Review the available user actions.

**Expected Results:**
- The UI clearly indicates that an error occurred.
- The message is visible and understandable from a user perspective.
- The available actions support continuation or recovery rather than only abandoning the session.
- The error handling does not leave the user with an unclear blocked state.

---

## TC-JIRA-04 Prompt answer cancel returns user to prompt
**Priority:** P0  
**Goal:** Validate the Jira-indicated prompt-answer cancel flow returns the user to the prompt instead of breaking the session.

**Preconditions:**
- A report flow includes a visible prompt that requires user input.
- A prompt-answer action can be canceled.

**Steps:**
1. Open the report and reach a prompt that asks for user input.
2. Start answering the prompt.
3. Cancel the prompt-answer action.
4. Observe the prompt state.
5. Re-enter the prompt and provide an answer.

**Expected Results:**
- Canceling the answer returns the user to the prompt state.
- The prompt remains usable after canceling.
- The session does not fall into an unrecoverable error state because of the cancel action.
- The user can answer the prompt again and continue.

---

## TC-JIRA-05 Prompt flow remains recoverable after interruption
**Priority:** P1  
**Goal:** Confirm prompt-related interruption does not permanently block the report editing flow.

**Preconditions:**
- A report contains a prompt flow that affects report editing or viewing.

**Steps:**
1. Enter a report prompt flow.
2. Interrupt the prompt flow through cancel or an error path.
3. Attempt to re-open or re-answer the prompt.
4. Continue into the report after the prompt is handled.

**Expected Results:**
- The user can return to the prompt experience after the interruption.
- The prompt can be completed after the interruption.
- The user can proceed back into the report flow without reopening the report.

---

## TC-JIRA-06 Document view remains visible when error appears
**Priority:** P0  
**Goal:** Validate the document view remains visible even when an error pop-up appears.

**Preconditions:**
- A report document view is visible.
- A visible error pop-up can be triggered during the session.

**Steps:**
1. Open the report so the document view is visible.
2. Trigger an error that displays an error pop-up.
3. Observe the page behind or around the error pop-up.

**Expected Results:**
- The error pop-up is shown.
- The document view remains visible while the error pop-up is present.
- The error handling does not replace the document view with a blank or missing report view.

---

## TC-JIRA-07 Document view is still usable after dismissing error
**Priority:** P1  
**Goal:** Confirm the report view remains available after the error UI is dismissed or cleared.

**Preconditions:**
- A report document view is open.
- An error pop-up can be triggered and dismissed.

**Steps:**
1. Open the report and confirm the document view is visible.
2. Trigger the error pop-up.
3. Dismiss or close the error UI if an action is available.
4. Observe the report view.
5. Attempt a basic user action in the report view.

**Expected Results:**
- The document view is still present after the error UI is dismissed.
- The report does not require reopening to regain the document view.
- The user can perform at least a basic follow-up action in the same session.

---

## TC-JIRA-08 Pause to data-retrieval status switching during recovery
**Priority:** P1  
**Goal:** Validate the UI handles pause and data retrieval status changes cleanly around error recovery.

**Preconditions:**
- A report flow can show pause and data retrieval states.
- An error can occur during or around those states.

**Steps:**
1. Start a report action that shows a pause or waiting state.
2. Let the report move into data retrieval, or otherwise switch between the two visible states.
3. Trigger or encounter an error during this flow.
4. Observe the status shown to the user before and after recovery.
5. Continue the report session.

**Expected Results:**
- The visible state changes are understandable to the user.
- The UI does not get stuck in the wrong visible state after the error.
- After recovery, the report can continue from a valid visible state.
- The user can stay in the same session and proceed.

---

## TC-JIRA-09 No stuck pause state after recoverable error
**Priority:** P1  
**Goal:** Confirm a recoverable error does not leave the report indefinitely paused from the user perspective.

**Preconditions:**
- A report action can enter a visible pause or waiting state.

**Steps:**
1. Trigger a flow that causes the report to enter a visible pause state.
2. Cause or encounter a recoverable error during that period.
3. Wait for the UI to settle.
4. Try to continue working in the report.

**Expected Results:**
- The report does not remain indefinitely stuck in pause because of the error.
- The user can either continue, retry, or otherwise recover in-session.
- The final visible state is consistent with continued work.

---

## TC-JIRA-10 No stuck data-retrieval state after recoverable error
**Priority:** P1  
**Goal:** Confirm a recoverable error does not leave the report indefinitely showing data retrieval when the user should be able to continue.

**Preconditions:**
- A report action can enter a visible data retrieval state.

**Steps:**
1. Trigger a flow that causes visible data retrieval.
2. Cause or encounter a recoverable error during that flow.
3. Observe the visible report state after the error.
4. Attempt to continue in the report.

**Expected Results:**
- The UI does not remain indefinitely stuck showing data retrieval after recovery should be possible.
- The report returns to a usable visible state.
- The user can continue without reopening the report.

---

## TC-JIRA-11 Undo behavior after error recovery
**Priority:** P1  
**Goal:** Validate undo remains understandable and usable after an error and recovery flow.

**Preconditions:**
- A report is open in edit mode.
- The user can make visible edits that normally affect undo history.

**Steps:**
1. Make one or more visible edits in the report.
2. Trigger a recoverable error.
3. Recover and return to a usable editing state.
4. Use Undo.
5. Observe the visible result.

**Expected Results:**
- Undo behavior is available or otherwise behaves consistently with the recovered state.
- The result of Undo is understandable from the user perspective.
- The report does not enter a broken or confusing state when Undo is used after recovery.

---

## TC-JIRA-12 Redo behavior after error recovery
**Priority:** P2  
**Goal:** Validate redo remains understandable and usable after an error and recovery flow.

**Preconditions:**
- A report is open in edit mode.
- The user can make visible edits and use Undo/Redo controls.

**Steps:**
1. Make visible edits in the report.
2. Trigger a recoverable error.
3. Recover to a usable editing state.
4. Use Undo.
5. Use Redo.
6. Observe the visible result.

**Expected Results:**
- Redo behavior is available or otherwise consistent with the recovered state.
- The visible report result after Redo is understandable to the user.
- Using Redo after recovery does not trigger a broken editing state.

---

## TC-JIRA-13 Undo/redo state does not mislead user after recovery
**Priority:** P2  
**Goal:** Confirm undo/redo state after recovery does not mislead the user into thinking the report is editable when it is not, or vice versa.

**Preconditions:**
- A report supports visible undo/redo actions.

**Steps:**
1. Make a visible edit in the report.
2. Trigger a recoverable error.
3. Return to the report after recovery.
4. Observe the availability and effect of Undo/Redo controls.

**Expected Results:**
- The visible Undo/Redo state matches what the user can actually do next.
- The user is not presented with controls that appear usable but fail unexpectedly.
- The report stays stable while the user checks or uses Undo/Redo after recovery.

---

## TC-JIRA-14 Multiple recoverable interruptions in one session
**Priority:** P2  
**Goal:** Confirm the report remains recoverable if the user encounters more than one recoverable interruption in the same editing session.

**Preconditions:**
- A report is open in edit mode.
- At least two recoverable interruption points can be triggered in one session.

**Steps:**
1. Open the report and make a visible edit.
2. Trigger a first recoverable error and continue editing.
3. Trigger a second recoverable interruption such as another error or prompt-related interruption.
4. Continue working again in the same session.

**Expected Results:**
- The user can recover from repeated interruptions within the same session.
- The editor remains usable after each recovery.
- The user is not forced to reopen the report after repeated recoverable failures.

---

## TC-JIRA-15 In-progress visible edits are retained across recovery path
**Priority:** P0  
**Goal:** Confirm user-visible in-progress work is retained when a recoverable error occurs.

**Preconditions:**
- A report is open in edit mode.
- The user can make visible edits before the error occurs.

**Steps:**
1. Open the report and make visible edits that can be recognized after recovery.
2. Trigger a recoverable report error.
3. Complete the recovery path and return to the report.
4. Inspect the report content and editing context.

**Expected Results:**
- User-visible in-progress edits remain present, or the user returns to a state that clearly preserves ongoing work.
- The user does not lose visible work solely because the recoverable error occurred.
- The report remains open for continued editing.

---

## Traceability to Jira Evidence
- **BCIN-6709:** user currently must exit and reopen after report errors; goal is to continue editing without losing work.
- **BCIN-7582:** prompt answer cancel should revert back to prompt.
- **BCIN-7584:** undo/redo reset behavior is a risk area.
- **BCIN-7586 / BCIN-7587 / BCIN-7590:** broader report error handling and transformation coverage.
- **BCIN-7588:** document view should remain visible even when error pop-up appears.
- **BCIN-7589:** pause and data retrieval status switching is a specific recovery risk area.
