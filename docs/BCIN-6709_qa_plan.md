# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

---
**Source reviewed**: Confluence design page `5901516841`, linked issue context `BCEN-4843`, `BCIN-974`, `BCIN-6485`, `BCEN-4129`, `BCIN-6706`, and message-copy trace from productstrings / Figma evidence  
**Grouping rule**: each scenario name follows `mode | error type | detailed action`  
**Date**: 2026-03-09

---

## EndToEnd - P1
<!--top level category-->

### Pause mode | Row-limit rebuildDocument error | Click "Resume Data Retrieval" and keep editing - P1
<!-- P1: Directly validates the main BCIN-6709 code path from Confluence 2.2.1 and BCEN-4843. This is the primary authoring recovery flow after a crashed report instance. -->

- Open a report in Library authoring pause mode whose result set is known to exceed the configured row limit
<!--test point, should be concise and to the point-->
	- Make one or more visible design changes before execution, such as adding an attribute or metric to the template
		- Click "Resume Data Retrieval"
			- A recoverable execution error dialog appears
				- Click "OK"
					- The report returns to pause mode with no data rows and no endless spinner
					- The user stays inside the same report instead of being redirected to Library home
					- The design changes made before the error are still visible
					- The user can immediately make another edit or retry execution

### Pause mode | Cartesian-join rebuildDocument error | Add "Change Type" on the BCIN-974 report and continue editing - P1
<!-- P1: Direct code-relevant recovery scenario backed by BCIN-974 and the Confluence crashed-instance flow. It verifies a concrete non-row-limit execution failure using a named repro. -->

- In Library authoring pause mode, open the BCIN-974-style report that contains `Object Category`, `Object Extended Type`, and `Object Type`
	- Add the `Change Type` attribute to the template
		- Click "Resume Data Retrieval"
			- A Cartesian-join execution error dialog appears
				- Click "OK"
					- The report does not stay in perpetual loading
					- The editor remains usable in the same session
					- The newly added report objects are still visible for further editing

### Running mode | Modeling-service then rebuildDocument error | Lower Results Set Row Limit and continue editing - P1
<!-- P1: Directly exercises the running-mode modeling-service branch from Confluence 2.2.2. This is a core code path because the feature must distinguish modeling-service failures from normal manipulations. -->

- Open a normal report in Library authoring mode and enter running mode so data is visible
	- Open `File` -> `Report Properties` -> `Advanced Properties`
		- Set `Results Set Row Limit` to `300` or another value that is known to reproduce the failure in the QA environment, then click `Done`
			- An execution error dialog appears after the change is applied
				- Click "OK"
					- The report returns to pause mode instead of remaining on the running grid
					- Undo and redo are cleared for the failed modeling-service change
					- The report can still be edited after recovery

### Prompt flow | Prompt apply error | Return to prompt with previous answers preserved - P1
<!-- P1: Directly tied to the prompt-specific recovery branch in Confluence 2.2.3 and web-dossier changes. This is a core authoring code path, not just a message check. -->

- Open a prompted report in Library authoring mode
	- Enter prompt answers that are known to trigger the prompt-apply recovery path, such as a selection that exceeds the configured row limit for the report fixture
		- Submit the prompt
			- The prompt dialog reopens instead of leaving the report in a dead-end state
				- The previously entered answers remain populated
					- The user can change the answers and submit again without reopening the report

### Recovered session | Supported error path | Perform the next editing action without refresh - P1
<!-- P1: Directly validates the central promise of BCIN-6709: recovery is only useful if the next action still works. This covers the stale-request / hanging risk called out in Confluence Issue 1. -->

- Recover from any supported authoring error in this plan, such as row-limit, Cartesian join, prompt-apply failure, or modeling-service rebuild failure
	- Without refreshing the page, perform the next intended action, such as editing the template, clicking Undo, or retrying `Resume Data Retrieval`
		- The new action is accepted by the UI
			- The report is not stuck on a loading overlay or blocked controls
				- The user does not need to close and reopen the report to continue working

---

## Functional - Pause Mode

### Pause mode | Row-limit rebuildDocument error | Resume returns to pause mode with edits preserved - P1
<!-- P1: Direct code verification of the pause-mode recreate-instance flow from Confluence 2.2.1 and BCEN-4843. -->

- Open a report in authoring pause mode with a known row-limit failure setup
	- Make one or more normal report changes before running the report
		- Click "Resume Data Retrieval"
			- When the error dialog appears, click "OK"
				- The report lands in pause mode with an empty grid and enabled authoring controls
					- The design changes made before the error are still present in the template
					- The user can continue editing from that recovered state

### Pause mode | SQL or engine-side execution error | Resume Data Retrieval on a BCIN-6706-style fixture keeps the editor usable - P1
<!-- P1: Directly related to the same recovery code even though the error type is different. It broadens the core pause-mode recovery coverage beyond row-limit-only repros. -->

- Open a report fixture that reproduces a SQL or engine-side execution failure when data retrieval is resumed
	- Click "Resume Data Retrieval"
		- Wait for the execution error dialog to appear
			- Click "OK"
				- The loading overlay is removed
					- The report remains open in authoring mode
					- The user can still edit or retry the report without reopening it

### Pause mode | Crashed-instance follow-up action | Retry execution or another edit sends a fresh request instead of hanging - P1
<!-- P1: Direct code-path check for the stale-request cleanup discussed in Confluence Issue 1. -->

- Trigger and recover from a pause-mode rebuild failure
	- Immediately perform one of the following actions:
		- Click `Resume Data Retrieval` again
		- Make another design change
		- Click Undo or Redo if history is available
	- Observe the next action
		- The action starts normally instead of hanging with no response
			- The editor is not blocked by the prior failed request

### Pause mode | Normal manipulation history | Undo and redo remain available after recovery - P1
<!-- P1: Direct code verification of the undo/redo preservation rule for normal manipulations in the recreate flow. -->

- In pause mode, make one or more normal manipulations before reproducing the execution error, such as applying a view filter, sorting a column, or changing a display setting
	- Trigger the crashed-instance recovery path through `Resume Data Retrieval`
		- Dismiss the error dialog
			- The Undo button remains available
				- Undo reverts the last successful pre-error manipulation
					- Redo behaves consistently with the preserved history

### Pause mode | Recovered view state | Empty pause grid and authoring controls remain enabled - P1
<!-- P1: Directly verifies the empty-grid / rerender fix from Confluence Issue 3. -->

- Trigger any pause-mode crashed-instance recovery scenario
	- After clicking `OK` on the error dialog, inspect the recovered report layout
		- The report shows the pause-mode empty grid instead of the stale running grid
			- There is no endless loading spinner
				- Template editing controls remain enabled and clickable

---

## Functional - Running Mode

### Running mode | Modeling-service plus rebuildDocument error | Advanced Properties row-limit change clears undo and redo - P1
<!-- P1: Directly maps to Confluence 2.2.2 Issue 2 and the running-mode modeling-service recovery branch. -->

- Open a report in authoring mode and enter running mode
	- Open `File` -> `Report Properties` -> `Advanced Properties`
		- Change `Results Set Row Limit` to a value that triggers the documented failure, such as `300`, then click `Done`
			- When the error dialog appears, click `OK`
				- The report returns to pause mode
					- Undo is disabled
					- Redo is disabled
					- The user can continue editing from the recovered report

### Running mode | Modeling-service plus rebuildDocument error | Change Join Type to Cross Join and verify history reset - P1
<!-- P1: Direct code verification of a second modeling-service trigger named in the design. It guards against logic that only works for Advanced Properties. -->

- Open a report in running mode that contains a table relationship eligible for Join Type editing
	- Right-click the table relationship and change the Join Type to `Cross Join` in a setup that is known to cause an execution failure
		- When the error dialog appears, click `OK`
			- The report returns to pause mode
				- Undo and redo are both cleared for this failed modeling-service change
					- The user can still make a new report edit after recovery

### Running mode | Modeling-service plus rebuildDocument error | Add or remove a template unit that causes engine failure and verify history reset - P1
<!-- P1: Direct code verification of the third modeling-service trigger from Confluence. It ensures template-unit edits follow the same reset policy as other PUT-based changes. -->

- Open a report in running mode
	- Add or remove an attribute or metric from the report template in a setup that is known to cause an engine or row-limit failure
		- When the error dialog appears, click `OK`
			- The report returns to pause mode
				- Undo and redo are cleared for the failed template change
					- The template remains editable for the next action

### Running mode | Normal manipulation plus rebuildDocument error | View filter or sort failure returns to pause mode with history preserved - P1
<!-- P1: Directly tests the non-modeling-service running-mode branch from Confluence and the conditional undo/redo logic. -->

- Open a report in running mode
	- Perform a normal manipulation that triggers an execution failure, such as applying a view filter that causes a row-limit error or sorting a column that reproduces the rebuild failure
		- When the error dialog appears, click `OK`
			- The report returns to pause mode
				- Undo remains available
					- Redo remains available when history existed before the failure
					- The user can undo the failed manipulation path and continue editing

### Running mode | Crashed manipulation undo | Undo removes the failed object change and refreshes report objects - P1
<!-- P1: Directly validates Confluence Issue 4. This is core code because the fix updates report-object refresh after undo. -->

- Open a running report that reproduces the documented crashed-manipulation scenario, such as adding `User Entity Type`
	- Trigger the error and recover back to pause mode
		- Click `Undo`
			- The added object is removed from the report UI
				- The report object list refreshes correctly
					- The user can continue editing from the corrected state

---

## Functional - Modeling Service Non-Crash Path

### Current mode | Modeling-service request error | Failed definition update keeps the same mode and state - P1
<!-- P1: Directly validates the non-crashed modeling-service path from Confluence. The feature must not force a recreate-instance flow when the document instance is still healthy. -->

- Open a report in authoring mode and note whether it is currently in pause mode or running mode
	- Perform a modeling-service request that fails before the document instance is broken
		- Dismiss the validation or request error
			- The report stays in the same mode it was in before the failure
				- The current grid or pause layout is preserved
					- The user can continue working without reopening the report

### Running mode | View-filter removal validation error | Remove an attribute used in a view filter and keep the editor interactive - P1
<!-- P1: Directly tied to BCIN-6485 and to the modeling-service non-crash behavior. This is a concrete regression check for a real customer-facing issue. -->

- Open the BCIN-6485-style report in Library report editor
	- Add an attribute such as `Category` to the report and click `Resume Data Retrieval` so results are displayed
		- In the view filter area, apply a condition using that same attribute, such as `Category in Books`
			- In `Objects` -> `In Report`, remove the same attribute from the report
				- A validation error explains that the attribute cannot be removed because it is used in a view filter
					- After clicking `OK`, the grid does not stay on a permanent loading state
					- The report remains editable and the user is not forced back to Library home

---

## Functional - MDX / Engine Errors

### Running mode | MDX or ODBC engine error | Dismiss the dialog and correct the report without reopening - P1
<!-- P1: Directly related to the supported recovery code because BCEN-4129 was explicitly referenced as the same broken-instance problem this feature is addressing. -->

- Open an MDX report fixture in Library authoring mode and enter running mode
	- Apply the condition, metric change, or source-side selection that is known to reproduce the MDX or ODBC engine error for that fixture
		- When the error dialog appears, click `OK`
			- The report remains in the editor instead of closing
				- The user can remove or adjust the problematic design element
					- The report can be retried without reopening the page

### Pause mode | Engine or governing-setting error | Resume Data Retrieval returns to pause mode and preserves report design - P1
<!-- P1: Directly exercises the same recovery branch with an engine-side failure type rather than a row-limit-only failure. -->

- Open a report in pause mode that is configured to trigger an engine or governing-setting failure during execution
	- Make a visible design change before execution
		- Click `Resume Data Retrieval`
			- When the error dialog appears, click `OK`
				- The report returns to pause mode
					- The pre-error design changes are still visible
					- The user can continue editing instead of abandoning the report

---

## Functional - Prompt Flow

### Pause mode to prompt | Prompt-apply rows-exceeded error | Return to prompt with previous answers preserved - P1
<!-- P1: Direct code verification of Confluence 2.2.3 and the prompt-answer recovery logic. -->

- Open a prompted report in authoring mode
	- Enter prompt answers that exceed the configured row limit for that report fixture
		- Submit the prompt
			- The prompt returns instead of leaving the report in an unrecoverable state
				- The previous answers remain filled in
					- The user can revise and resubmit the prompt without re-entering everything

### Reprompt | Prompt-apply error | Return to reprompt with previous answers preserved - P1
<!-- P1: Direct code-path check for the separate reprompt recovery branch in the design and web-dossier changes. -->

- Open a prompted report, answer the initial prompt, and enter a reprompt flow in the QA fixture
	- Submit reprompt answers that reproduce the prompt-apply failure
		- The reprompt UI returns instead of dead-ending the report
			- The previously entered answers remain available
				- The user can correct and resubmit from the reprompt flow

### Prompt in prompt | Inner prompt error | Return to the same prompt level without losing earlier answers - P2
<!-- P2: Cross-flow coverage that is likely influenced by the same recovery code but depends on a more specialized QA fixture. -->

- Open a nested-prompt report fixture in authoring mode
	- Answer the outer prompt so the inner prompt is displayed
		- Submit inner-prompt answers that reproduce the prompt-apply error
			- The recovery flow returns the user to the failing prompt level
				- Earlier prompt answers remain available where applicable
					- The user can continue the prompt sequence without reopening the report

### Prompt recovery | Cancel path | Close the prompt and return to a safe authoring state - P1
<!-- P1: Direct verification of the prompt cancel/back behavior described in Confluence and Jira review notes. -->

- Trigger a prompt-related recovery state in authoring mode
	- Choose the cancel path from the prompt or reprompt UI
		- The prompt closes cleanly
			- The report grid is visible in a safe authoring state
				- The user can trigger the prompt again or make another design change without reopening the report

### Prompt recovery | Corrected resubmission | Report loads and stays interactive after the second submit - P1
<!-- P1: Directly validates the success branch after recovery. The feature is incomplete if users can return to prompt but still cannot finish execution. -->

- Follow the prompt-recovery path until the prompt returns with previous answers preserved
	- Correct the prompt values and submit again
		- The report loads successfully
			- The editor remains interactive after the load completes
				- The user can continue the report editing session

### Prompt recovery UI actions | Return to Prompt link is visible and works - P2
<!-- P2: UI-level validation influenced by the same code path but focused on the action surface rather than the core recovery engine. -->

- Trigger a prompt-apply failure that uses the recoverable prompt UI
	- Before leaving the error state, inspect the available recovery actions
		- A `Return to Prompt` action is visible
			- Clicking it returns the user to the prompt with prior answers preserved
				- No extra navigation is required to reach the recovered prompt

---

## xFunctional
### Create Report From Template - Running Mode - P2
<!-- P2: Compatibility sweep. This is not a new top-level feature branch in the design, but the same running-mode recovery code can affect reports created from templates. -->

- Create a report from a report template in the QA environment and open it in authoring mode
	- Enter running mode and trigger one supported recoverable failure, such as an Advanced Properties row-limit change or a template-unit change that causes execution failure
		- Complete the recovery flow
			- The created-from-template report follows the same running-mode recovery rules as a normal report
				- The report remains editable after recovery

### Repeat Different Error Paths After Error Recovery - P2
<!-- P2: Cross-functional stability check. It verifies that one recovery does not poison the next path, which is likely influenced by the stale-request cleanup and state-reset code. -->

- Recover from one supported error path, such as a pause-mode row-limit failure
	- In the same report session, trigger a different supported error path, such as a view-filter validation error or a prompt-apply error
		- Complete the second recovery flow
			- The second path behaves normally and does not inherit a broken state from the first one
				- The user can continue editing after the second recovery as well

---
## UI - Messaging
<!-- Refer to figma design https://www.figma.com/design/gzj8mez8AnHHm0u9tFJvFx/Report-enhancement?node-id=25-480&t=DD7XZoFhtWF4vpHL-0-->
### Report Failed to Run - P2
<!-- P2: User-facing copy and recovery guidance validation based on productstrings and Figma. It is influenced by code changes, but it is primarily a UX verification. -->

- In Report Editor, trigger the recoverable execution failure that uses the redesigned report error dialog, such as the row-limit recoverable path
	- Inspect the dialog before clicking `OK`
		- The title is `Application Error`
			- The headline is `Report Cannot Be Executed.`
				- The body text is `This report cannot be executed. See Show Details for more information. Click OK to return to Data Pause Mode.`
					- `Show Details` is available
					- Clicking `OK` returns the report to `Data Pause Mode`

### Dataset can't be loaded - P2
<!-- P2: User-facing Library messaging verification based on Figma and productstrings. It is cross-functional because the text and action surface depend on multiple repos. -->

- In Library Web, trigger the dataset-loading recoverable server-error flow used by this feature
	- Inspect the dialog before clicking `OK`
		- The title is `Server Error`
			- The body text says `One or more datasets failed to load.`
				- `Send Email` is not shown
					- Clicking `OK` returns the user to the previous report state instead of Library home

---

## Platform - P2

### Major browser coverage for continued editing after failure - P2
<!-- P2: Cross-platform regression sweep. The recovery behavior is code-driven but browser-specific rendering or event timing can affect it. -->

- In each major supported browser for Library authoring, run the following two paths:
	- Pause mode row-limit recovery
	- Running mode modeling-service recovery
	- For each browser, verify the dialog appears, `OK` recovers the report, and continued editing still works
		- Recovery behavior is consistent across the supported browser matrix
			- No browser leaves the report stuck, blank, or non-interactive after recovery
---
## Accessibility
<!-- N/A - Authoring mode is not supported in Accessibility testing -->

---
## Security
<!-- N/A - No security testing is required for this feature -->

---

## Upgrade / compatibility - P2

### Existing non-authoring behavior is unchanged - P2

- Open the same report in a consumption-oriented (non-authoring) flow
	- Trigger a relevant failure path
		- The new authoring recovery behavior is NOT applied to non-authoring mode
			- Out-of-scope behavior remains unchanged
### Workstation
- Connecting to 26.03 library
    - workflow is the same as before

---

## i18n - P2

### Updated recovery strings appear correctly in non-English locales - P2

- Trigger the main recovery flows with the application set to a non-English locale
	- Review user-visible Library and report-editor copy
		- Updated strings appear correctly in the target locale
			- No placeholder or missing string is shown

---

## Performance
<!-- N/A - No performance testing is required for this feature -->
---

## Embedding
<!-- N/A - No embedding testing is required for this feature -->
