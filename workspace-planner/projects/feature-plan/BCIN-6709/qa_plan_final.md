# BCIN-6709

---
**Source reviewed**: `context/qa_plan_atlassian_BCIN-6709.md`, `context/jira_issue_BCIN-6709.md`, `context/jira_issue_BCIN-7543.md`, `context/jira_related_issues_BCIN-6709.md`, `context/design_doc_BCIN-6709_5901516841.md`, `context/qa_plan_github_BCIN-6709.md`, `context/qa_plan_github_traceability_BCIN-6709.md`, `context/qa_plan_figma_BCIN-6709.md`, `context/sub_test_cases_atlassian_BCIN-6709_v2.md`, `context/sub_test_cases_github_BCIN-6709_v2.md`, `context/sub_test_cases_figma_BCIN-6709_v2.md`, `context/review_consolidated_BCIN-6709.md`
**Grouping rule**: each scenario name reads like `mode | error type | detailed action`
**Date**: 2026-03-09
---

## EndToEnd - P1

### running mode | report execution failure | recover in the same authoring session - P1
- In **Report Editor** with a report already open in authoring and grid data visible, reproduce the recoverable report-execution branch that opens the redesigned error dialog.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform **Show Details** to confirm the dialog exposes technical details, then click **OK**.
    - Verify the dialog title is **`Application Error`**, the message body headline reads **`Report Cannot Be Executed.`**, the body tells the user to use **Show Details** and click **OK** to return to **Data Pause Mode**, the same report stays open, and the editor lands in **Data Pause Mode** instead of leaving the session.
- In **Library Web authoring** on the same recovery path, reproduce the recoverable dataset-load failure popup.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform **Show Details**, then click **OK**.
    - Verify the popup headline is **`Server Error`**, the popup text is **`One or more datasets failed to load.`**, **Send Email** is not shown, the report stays in the current authoring session, and the user returns to the prior recoverable report state instead of Library home.
- In **Report Editor** immediately after the dialog closes, continue working in the same report.
  - Perform one concrete follow-up edit such as removing one metric from the template grid.
    - Verify the follow-up request is accepted in the same open report, the UI updates for that action, and the user is not forced to reopen the report.
- In **Library Web authoring** immediately after the popup closes, continue working in the same report.
  - Perform one concrete follow-up action such as reopening **Reprompt** from the current report session.
    - Verify the follow-up request is accepted in the same open report, the UI updates for that action, and the user is not forced to reopen the report.

## Functional - Pause Mode

### pause mode | rebuildDocument crash | click Resume Data Retrieval and return to paused canvas - P1
- In **Library Web report authoring** with the report already in **Pause Mode**, reproduce the recoverable **Resume Data Retrieval** failure branch.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform **Resume Data Retrieval** and dismiss the recovery dialog with **OK**.
    - Verify the same report remains open, the canvas returns to **Pause Mode**, and the page does not redirect to Library home.
- In **Library Web report authoring** after that recovery, check the recovered canvas.
  - Perform a visual check of the report canvas before taking any new action.
    - Verify the paused or empty authoring view is shown and the stale running grid from before the error is no longer visible.
- In **Library Web report authoring** after the first failed resume recovers to **Pause Mode**, reproduce the same entry point again.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform **Resume Data Retrieval** a second time from the recovered paused state.
    - Verify the UI accepts the second click, a new request is sent from the same report, and the session does not hang on the previously failed request.

## Functional - Running Mode

### running mode | normal manipulation crash | recover to Data Pause Mode and continue editing - P1
- In **Report Editor** with the report already running and data visible, reproduce a recoverable **normal manipulation** failure.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform the exact manipulation that raises the recoverable error, then click **OK** on the error dialog.
    - Verify the stale pre-error grid is removed, the report stays open in the same authoring session, and the editor lands in **Data Pause Mode**.
- In **Report Editor** immediately after recovering from that normal manipulation failure, check history continuity.
  - Perform **Undo** and **Redo** against the valid edits that existed before the failure.
    - Verify the earlier valid edits are still present in history for this branch, **Undo** and **Redo** remain available, and stepping backward or forward updates the current report instead of reopening the object.
- In **Report Editor** after recovering to **Data Pause Mode**, continue working in the same report.
  - Perform one concrete edit such as removing one metric from the template grid or opening **Template** and **Report Properties**.
    - Verify the edit panels open on the current report, the change is accepted, and the surface does not stay in a broken half-loaded state.

## Functional - Modeling Service Non-Crash Path

### running mode | modeling-service non-crash path | N/A from cached context - P1
- N/A — no deterministic repro available from current fixtures.

## Functional - MDX / Engine Errors

### prompt flow | row-limit engine error | return to prompt with previous answers preserved - P1
- In **Library Web authoring** on a prompted report, reproduce the recoverable prompt-answer failure for **maximum number of result rows exceeded the current limit**.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform prompt submit with the row-limit-triggering answer set, then use the recovery path that returns to prompt.
    - Verify the same prompt opens again on the same report, the previously entered prompt answers remain populated, and the visible error guidance tells the user how to correct the row-limit condition.

### running mode | engine-style execution failure | show guided recovery copy instead of legacy copy - P1
- In **Report Editor** on a report that hits the recoverable execution-failure branch, open the redesigned error dialog.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform a direct check of the visible title and message before clicking **OK**.
    - Verify the dialog title is **`Application Error`**, the message body headline is **`Report Cannot Be Executed.`**, and the body uses **`This report cannot be executed. See Show Details for more information. Click OK to return to Data Pause Mode.`** instead of legacy wording such as **`Report cannot be opened.`** or **`This report type is not supported.`**.
- In **Library Web authoring** on the matching recoverable dataset-load branch, open the redesigned server-error popup.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform a direct check of the visible message and actions before clicking **OK**.
    - Verify the popup headline is **`Server Error`**, the popup uses **`One or more datasets failed to load.`**, shows **Show Details**, and does not show **Send Email**.

### running mode | MDX or SQL backend family | N/A from cached context - P1
- N/A — no deterministic repro available from current fixtures.

## Functional - Prompt Flow

### prompt mode | initial prompt apply failure | preserve answers and stay in the current report - P1
- In **Library Web authoring** on a prompted report, reproduce the recoverable **initial prompt** failure branch.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform prompt submit with the prepared error-triggering answer set.
    - Verify the prompt flow returns to the same report instead of exiting the session, the previous answers are still populated in the prompt, and the user can modify the answers and submit again.

### prompt mode | reprompt apply failure | return to reprompt instead of the first entry flow - P1
- In **Library Web authoring** on a report that already supports **Reprompt**, reproduce the recoverable **reprompt** failure branch.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform **Reprompt**, submit the error-triggering answer set, and reopen the recovered prompt flow.
    - Verify the user returns to **Reprompt** for that same report rather than the initial prompt-entry flow, the prior answers remain present, and a different answer set can be submitted from the same open report.

### prompt mode | prompt-in-prompt apply failure | return to the active nested prompt state - P1
- In **Library Web authoring** inside a **prompt-in-prompt** flow, reproduce the recoverable nested prompt failure branch.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform submit on the nested prompt answer set that causes the recoverable error.
    - Verify the nested prompt becomes active again on the same report, the prompt controls remain interactive, and the user can correct the answer without reopening the report.

## xFunctional

### mixed mode | cross-surface recovery parity | compare Report Editor and Library Web recovery outcomes - P2
- In **Report Editor** and **Library Web authoring**, run the matched recoverable execution-failure flow for the same feature branch.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform the error-triggering action on both surfaces, inspect the visible dialog or popup, and click **OK**.
    - Verify **Report Editor** returns to **Data Pause Mode** with report-specific copy, **Library Web** returns to the previous recoverable report state with dataset-load copy, and neither surface redirects the user away from the current report.

### mixed mode | post-recovery continuation | continue editing after one recovery in each branch - P2
- In **Report Editor** after a normal manipulation recovery and in **Library Web authoring** after a prompt recovery, continue from the recovered report.
  - Perform one follow-up action on each surface, such as a template edit in Report Editor and a corrected prompt submit in Library Web.
    - Verify both actions execute in the same recovered sessions, no stale error overlay blocks the screen, and each surface remains usable after the next request.

## UI - Messaging

### running mode | report execution message | validate final Report Editor copy and affordances - P2
- In **Report Editor** when the recoverable error dialog first appears, inspect the dialog before dismissing it.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform checks on the title, body headline, body guidance, action button, and details affordance.
    - Verify the dialog title is **`Application Error`**, the message body headline is **`Report Cannot Be Executed.`**, the body includes the **Data Pause Mode** guidance, **Show Details** is available, and **OK** is the visible recovery action.
- In **Report Editor** with the same dialog open, inspect the details region behavior.
  - Perform **Show Details**, review the technical payload, then collapse it.
    - Verify the details region expands inside the dialog, the long text is readable or scrollable, collapsing restores the original dialog layout, and **OK** remains clickable.

### running mode | Library server error message | validate final Library copy and action set - P2
- In **Library Web authoring** when the recoverable server-error popup appears, inspect the popup before dismissing it.
  <!-- TODO: specify trigger — confirm with BCIN-7543 fixture details -->
  - Perform checks on the headline, body text, action set, and details affordance.
    - Verify the popup headline is **`Server Error`**, the popup text is **`One or more datasets failed to load.`**, **Show Details** is available, **OK** is the visible action, and **Send Email** is absent.
- In **Library Web authoring** with that popup open, inspect the details region behavior.
  - Perform **Show Details**, review the technical payload, then collapse it.
    - Verify the details panel expands and collapses cleanly, the user-facing message stays visible, and the popup remains operable.

## Platform

### scope | authoring-only behavior | confirm consumption mode is not treated as the same recovery surface - P2
- In **Library Web**, compare the same report opened once in **authoring mode** and once in **consumption mode**.
  - Perform the in-scope recoverable error flow only on the authoring session and compare the available recovery affordances between the two sessions.
    - Verify the authoring session shows the in-place recovery behavior described by this feature, and consumption mode is not presented as the same report-authoring recovery surface.

### locale | localized recovery copy | confirm no broken strings in another supported locale - P2
- In **Report Editor** and **Library Web authoring**, rerun one recoverable error flow in **English** and in one additional supported locale.
  - Perform the same error flow and inspect the recovery text in both locales.
    - Verify the visible recovery strings render as approved localized product copy or supported fallback text, with no raw localization keys, placeholders, or broken tokens.
