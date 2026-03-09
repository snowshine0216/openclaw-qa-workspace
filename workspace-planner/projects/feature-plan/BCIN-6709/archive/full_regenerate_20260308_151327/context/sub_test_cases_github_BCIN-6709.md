# BCIN-6709 — GitHub-Only Sub Test Cases

## Scope
These sub test cases are derived only from:
- `projects/feature-plan/BCIN-6709/context/qa_plan_github_BCIN-6709.md`
- `projects/feature-plan/BCIN-6709/context/qa_plan_github_traceability_BCIN-6709.md`

## Test Cases

### GH-TC-01 — Recover prompted report execution after a truncation or maximum-rows failure
**Priority:** P0  
**Coverage:** report recreation/recovery, prompt-answer failure handling, error copy

**Preconditions:**
1. Open a prompted report in a user flow that can trigger report execution.
2. Use data or conditions that produce a recoverable report execution failure tied to truncation or maximum rows.

**Steps:**
1. Answer the prompt and submit it.
2. Wait for the report execution to fail.
3. Verify the error dialog that appears.
4. Review the visible action buttons or links.
5. Click the recovery action shown in the dialog.

**Expected Results:**
- The failure is shown as a recoverable report execution problem, not a dead-end failure.
- The dialog uses product-specific recovery wording instead of a generic escalation path.
- The dialog does not show the generic **Send Email** action for this recoverable truncation-related path.
- The visible action is a single OK-style return/recovery action.
- After the action is clicked, the report returns to a usable recovery state instead of remaining blocked.

---

### GH-TC-02 — Recover reprompt execution after a truncation or maximum-rows failure
**Priority:** P0  
**Coverage:** report recreation/recovery, prompt-answer failure handling, reprompt routing

**Preconditions:**
1. Open a report flow that supports reprompt.
2. Use conditions that produce the same recoverable truncation or maximum-rows failure during reprompt.

**Steps:**
1. Enter the reprompt flow.
2. Submit the reprompted answers.
3. Wait for the failure dialog.
4. Verify the available action in the dialog.
5. Click the recovery action.

**Expected Results:**
- The reprompt failure shows the recoverable report error path.
- The reprompt flow uses the correct recovery action wiring and does not behave like an unrelated generic error.
- The dialog does not show a stale **Send Email** option for the recoverable truncation path.
- After the recovery action is clicked, the user is returned to a usable report state.

---

### GH-TC-03 — Keep generic handling for non-truncation report failures
**Priority:** P1  
**Coverage:** conditional error routing, prompt-answer failure handling

**Preconditions:**
1. Open a report flow that can fail during prompt submission.
2. Use a failure condition that is not the truncation or maximum-rows suberror path.

**Steps:**
1. Submit the prompt answer.
2. Wait for the error state.
3. Inspect the dialog title, message, and actions.
4. Compare the behavior with the truncation-specific recovery flow.

**Expected Results:**
- The non-truncation failure does not incorrectly use the truncation-specific recovery action model.
- The UI behavior is intentionally different from the special recoverable truncation flow.
- The feature does not over-apply the new recovery path to unrelated report failures.

---

### GH-TC-04 — Return to Data Pause Mode from the report execution error dialog
**Priority:** P0  
**Coverage:** dataset/pause-mode recovery, error copy

**Preconditions:**
1. Open the report editor in a flow that can surface the report execution error dialog.
2. Trigger the recoverable report execution failure.

**Steps:**
1. Wait for the report editor error dialog to appear.
2. Verify the dialog title.
3. Verify the dialog body message.
4. Click **OK**.

**Expected Results:**
- The title shown is **Report Cannot Be Executed.**
- The message tells the user the report cannot be executed, points them to **Show Details**, and says **Click OK to return to Data Pause Mode.**
- Clicking **OK** returns the user to **Data Pause Mode**.
- The editor is not left in an unusable blocked state after the dialog is dismissed.

---

### GH-TC-05 — Show the updated dataset failure copy in Library or web error surfaces
**Priority:** P1  
**Coverage:** error copy

**Preconditions:**
1. Open a Library or web flow that surfaces the updated dataset-load error.
2. Trigger the relevant recoverable data or execution failure.

**Steps:**
1. Wait for the error message to appear.
2. Read the user-visible error copy.

**Expected Results:**
- The visible message reads **One or more datasets failed to load.**
- The older wording about data not being loaded for the item is not shown in this updated path.

---

### GH-TC-06 — Recreate the report instance and keep the editor usable after recovery
**Priority:** P0  
**Coverage:** report recreation/recovery, dataset/pause-mode recovery

**Preconditions:**
1. Open a report authoring or editing flow.
2. Make the report reach the recoverable error path.

**Steps:**
1. Trigger the recoverable report execution or manipulation failure.
2. Use the recovery action presented by the product.
3. Wait for the report to reopen or recover.
4. Interact with the recovered report.

**Expected Results:**
- The report is recreated or recovered into a usable state.
- The user can continue working instead of being forced to abandon the report.
- Recovery behaves like a controlled return path, not a crash loop.

---

### GH-TC-07 — Preserve undo and redo history during recoverable report recreation when appropriate
**Priority:** P0  
**Coverage:** conditional undo/redo reset behavior, report recreation/recovery

**Preconditions:**
1. Open a report editing flow with visible undo and redo behavior.
2. Make one or more user changes so history exists.
3. Trigger a recoverable report error that uses the recreation path.

**Steps:**
1. Perform an edit.
2. Trigger the recoverable failure.
3. Complete the recovery flow.
4. Check whether undo and redo are available.
5. Try using undo and redo after recovery.

**Expected Results:**
- Undo and redo are not cleared unnecessarily during the recoverable path.
- History remains coherent for the user after recovery.
- Undo and redo do not become stuck, misleading, or disconnected from the visible report state.

---

### GH-TC-08 — Reset undo and redo only for flows that are meant to reset history
**Priority:** P1  
**Coverage:** conditional undo/redo reset behavior

**Preconditions:**
1. Open a report editing flow with existing history.
2. Use a non-recovery flow or action path that should still reset history.

**Steps:**
1. Perform edits to create undo and redo history.
2. Complete the non-recovery action path.
3. Check the undo and redo state.

**Expected Results:**
- Undo and redo are reset only when the flow is supposed to reset them.
- The new conditional reset behavior does not preserve history in cases where a reset is still expected.

---

### GH-TC-09 — Keep the recovered editor view stable without unnecessary document refresh symptoms
**Priority:** P2  
**Coverage:** report recreation/recovery, dataset/pause-mode recovery

**Preconditions:**
1. Open a report in the editor.
2. Trigger the recoverable error path.

**Steps:**
1. Start the recovery flow.
2. Watch the report area while recovery completes.
3. Continue interacting with the report after recovery.

**Expected Results:**
- The editor returns in a stable, usable state.
- The recovery flow does not cause obvious unnecessary visual refresh behavior such as repeated reload flicker or duplicate recovery screens.
- The visible report content and controls remain coherent after recovery.

---

### GH-TC-10 — Keep report definition and property changes coherent after recovery
**Priority:** P1  
**Coverage:** report recreation/recovery, cross-repo regressions

**Preconditions:**
1. Open the report editor.
2. Make a visible report change before triggering recovery.

**Steps:**
1. Change a report setting or definition in a user-visible way.
2. Trigger the recoverable error path.
3. Complete recovery.
4. Review the visible report setup after recovery.

**Expected Results:**
- The report does not return in a visibly inconsistent state after recovery.
- User-visible report settings and layout remain coherent after the recovery flow.
- Recovery does not leave the editor showing mismatched state across visible report panels.

---

### GH-TC-11 — Verify prompt and reprompt paths stay aligned across Library and Report Editor surfaces
**Priority:** P1  
**Coverage:** cross-repo regressions, prompt-answer failure handling, error copy

**Preconditions:**
1. Have access to both the Library or web surface and the Report Editor surface.
2. Trigger equivalent recoverable failures in both areas.

**Steps:**
1. Trigger a recoverable prompt-related failure in Library or web.
2. Capture the visible message and recovery action.
3. Trigger the comparable recoverable failure in Report Editor.
4. Capture the visible message and recovery action.
5. Compare the behavior between surfaces.

**Expected Results:**
- Each surface shows the intended product-specific copy for its context.
- The recovery action model is consistent with the feature intent across repos.
- No surface regresses to outdated generic handling while another surface uses the new recovery UX.

---

### GH-TC-12 — Verify the recovered flow does not expose stale escalation actions
**Priority:** P1  
**Coverage:** error copy, cross-repo regressions

**Preconditions:**
1. Trigger a recoverable truncation-related report failure.

**Steps:**
1. Open the error dialog.
2. Inspect all visible actions.
3. Repeat in both prompt and reprompt flows if available.

**Expected Results:**
- The dialog does not expose the generic **Send Email** action in the recoverable truncation path.
- The available actions match the recovery design instead of an older escalation-oriented design.

---

### GH-TC-13 — Verify English localization hooks for the new recovery copy
**Priority:** P2  
**Coverage:** error copy, cross-repo regressions

**Preconditions:**
1. Use the product in English.
2. Trigger both the Library or web error surface and the Report Editor error surface.

**Steps:**
1. Trigger the Library or web dataset failure message.
2. Trigger the Report Editor report execution error dialog.
3. Review all visible copy.

**Expected Results:**
- Library or web shows **One or more datasets failed to load.**
- Report Editor shows **Report Cannot Be Executed.**
- Report Editor shows the return-to-Data-Pause-Mode guidance in the dialog body.
- The strings are not missing, blank, or replaced with placeholder text.

## Coverage Mapping
- **Report recreation/recovery:** GH-TC-01, GH-TC-02, GH-TC-04, GH-TC-06, GH-TC-07, GH-TC-09, GH-TC-10
- **Conditional undo/redo reset behavior:** GH-TC-07, GH-TC-08
- **Prompt-answer failure handling:** GH-TC-01, GH-TC-02, GH-TC-03, GH-TC-11
- **Dataset/Pause-Mode recovery:** GH-TC-04, GH-TC-05, GH-TC-06, GH-TC-09
- **Error copy:** GH-TC-01, GH-TC-04, GH-TC-05, GH-TC-11, GH-TC-12, GH-TC-13
- **Cross-repo regressions:** GH-TC-10, GH-TC-11, GH-TC-12, GH-TC-13
