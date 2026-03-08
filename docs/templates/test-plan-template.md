# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

---
**Synthesis version**: v9
**Based on**: v8 + review consolidation (review_jira + review_confluence + review_github)
**Changes from v8**: B-1..B-7 blocking fixes applied; N-1..N-12 non-blocking fixes applied
**Date**: 2026-03-07

---

## EndToEnd - P1
<!--top level category-->

### Continue editing after "Resume Data Retrieval" fails with row-limit error - P1
<!--sub category-->

- Open a report in Library authoring mode that will exceed the configured row limit
<!--test point, should be concise and to the point-->
	- Make one or more report design changes (e.g. add a metric or attribute)
		<!--test step, should be concise, executable, remove the dargon words. do confluence search if needed. Example: Edit preservation check: N-1 — validates Jira P1 "previously applied edits preserved" -->
		- Click "Resume Data Retrieval"
			- A row-limit error dialog appears ("Maximum number of results rows per report exceeded the current limit")
				- Click "OK" to dismiss the dialog
					- The report returns to pause mode (empty grid — no data rows, no loading spinner)
					<!-- expected result, should be understandable, from user perspective-->
					- The user remains inside the same report editing workflow — not redirected to Library home
					- **The design changes made before the error are still visible in the report template** (edit preservation)
					- The editor is immediately usable for further edits

### Continue editing after a Cartesian-join execution error (BCIN-974) - P1
<!-- Jira-derived; acceptable instantiation of XR-01. Origin: BCIN-974. -->

- In Library authoring mode, open a report with attributes Object Category, Object Extended Type, Object Type, and add Change Type (as described in BCIN-974)
	- Click "Resume Data Retrieval"
		<!-- Edit preservation check: N-1 — validates Jira P1 "previously applied edits preserved" -->
		- A Cartesian-join execution error dialog appears
			- Dismiss the error dialog
				- The report does not remain stuck in perpetual loading
				- The editor remains interactive
				- **Report objects added before the error are still present** (edit preservation)
				- The user can continue editing without refreshing or reopening the page

### Return to prompt with previous answers preserved after prompt apply fails - P1

- Open a prompted report in Library authoring mode
	- Enter prompt answers and apply them in a setup that triggers the prompt-apply recovery path
		- The prompt dialog appears again instead of abandoning the session
			- The previously entered prompt answers remain populated in the prompt fields
				- The user can revise or resubmit without re-entering answers from scratch

### Report loads and remains interactive after prompt resubmission - P1
<!-- B-7 / GitHub GAP-4: split from "Return to prompt" to ensure resubmission success path is tested independently. Trace: XR-04, GH-08, GH-09 -->

- Following the "Return to prompt" recovery path, correct or resubmit the prompt answers
	- Wait for the report to load
		- The report opens successfully — grid is in running mode with data loaded
			- The editor accepts the next authoring action without freezing or returning to the prompt unexpectedly
				- The user can continue the report editing session

### Keep the next editing action possible after any recovery - P1

- Recover from any of the primary authoring failures covered by this feature (row-limit, Cartesian-join, view-filter removal, prompt apply)
	- Attempt the next intended editing action in the same report
		- The action succeeds or reaches its normal validation path
			- The report is not stuck in a frozen, blank, or dead state
				- No additional page refresh or reopen is required

---

## Functional - Pause Mode

### Pause mode: normal manipulation error transitions report from running grid to pause mode - P1
<!-- B-7 / Confluence GAP-1: standalone P1 for the grid-to-pause-mode view transition after normal manipulation failure.
     "Normal manipulation" = POST /api/documents/{instanceId}/manipulations (view-template changes via updateViewTemplateThunkHelper) -->

- Open a report in Library authoring running mode (data is displayed in the grid)
	- Perform a normal (view-template) manipulation that causes an execution failure:
		- Apply a view filter that results in a row-limit or engine error
		- OR sort by a column that triggers a server-side rebuild failure
	- Observe the report UI after the error dialog is dismissed
		- The grid transitions to **pause mode** (empty grid, no data rows, no loading spinner)
			- The editor is in the expected pause-mode layout — NOT stuck in running-mode grid
				- Authoring controls remain enabled
				- The view does NOT remain as the pre-error running-mode grid display

### Pause mode: normal manipulation history is preserved after crashed-instance recovery - P1
<!-- "Normal manipulation" = POST /api/documents/{instanceId}/manipulations (view-template changes).
     Concrete user actions: apply view filter, sort rows, change display settings, resize column.
     Contrast with P1 "modeling-service" path which CLEARS history. -->

- Open a report in Library authoring pause mode
	- Perform one or more normal (view-template) manipulations before triggering the error:
		- Apply a view filter (e.g. add a category filter in the view filter panel)
		- OR sort rows by clicking a column header
		- OR change a display setting such as column width or font
	- Trigger the crashed-instance recovery flow (click "Resume Data Retrieval" in a row-limit setup)
		- Click "OK" to dismiss the error
			- The report returns to pause mode (empty grid, no spinner)
				- The Undo button is available (not grayed out)
					- Undo reverts to the state before the normal manipulation
					- Redo behavior is consistent with the preserved history

### Pause mode: recovered report accepts the next action without hanging - P1

- Recover from a pause-mode "Resume Data Retrieval" execution failure
	- Perform another authoring action after the error dialog is dismissed (e.g. click "Resume Data Retrieval" again, or make another design change)
		- The next action is sent successfully
			- The page does not hang without a request being sent
				- The user does not need to reopen the report to continue

---

## Functional - Running Mode

### Running mode: modeling-service manipulation clears undo and redo after recovery - P1
<!-- "Modeling-service manipulation" = PUT /api/model/reports/{reportId} (report definition changes).
     Three confirmed concrete options from Confluence design doc: -->
<!-- Note: P1 promoted intentionally from Jira P1 — this directly exercises the isReCreateReportInstance undo-reset policy (GH-04, GH-05, XR-03). -->

- Open a report in Library authoring mode and enter running mode (report data is displayed)
	- Perform one of the following modeling-service-based changes that will trigger a rebuild-document failure:
		- **Option A — Advanced Properties row limit**: Report Properties → Advanced Properties → set a low row limit → Done
		- **Option B — Join type change**: right-click a table relationship → Join Type → change to Cross Join on a report without a defined table relationship
		- **Option C — Template unit update**: add or remove an attribute or metric from the report template that causes a row-limit or analytical engine failure
	- Wait for the rebuild-document error dialog to appear
		- Dismiss the error
			- The report returns to pause mode (empty grid, no spinner)
				- **Undo history is cleared** (Undo button is grayed out)
				- **Redo history is cleared** (Redo button is grayed out)
				- The report remains usable for continued editing

### Running mode: normal manipulation preserves undo and redo after recovery - P1
<!-- "Normal manipulation" in running mode = POST /api/documents/{instanceId}/manipulations
     (view-template changes — NOT PUT /model/reports). -->

- Open a report in Library authoring mode and enter running mode
	- Perform a normal (non-modeling-service) manipulation that triggers a rebuild-document failure:
		- Apply or modify a view filter (e.g. add attribute to view filter panel and apply)
		- OR sort by a column that triggers a server-side rebuild failure
	- Wait for the error dialog to appear
		- Dismiss the error
			- The report returns to pause mode
				- **Undo history remains available** (Undo button is active)
				- **Redo history remains available** when it existed before the error
				- The user can undo the manipulation that caused the failure

### Running mode: user can undo a crashed manipulation after recovery - P1

- In running mode, perform a manipulation that leads to the crashed-manipulation scenario
	- Complete recovery and return to pause mode
		- Use Undo to revert the crashed manipulation
			- Report objects refresh to reflect the undo result
				- The user can continue editing from the corrected report state

---

## Functional - Modeling Service Non-Crash Path

### Modeling-service request failure keeps the report in its current mode — no instance recreation - P1
<!-- AI-1 fix: replaced "check Network tab for reCreateInstance flag" with user-observable criterion.
     API-level assertion (no reCreateInstance POST) moved to AUTO section. -->

- Perform a modeling-service request that fails (e.g. remove an attribute that is used in a filter, as in the BCIN-6485 test report)
	- Complete the error handling flow
		- The report stays in its current mode and state — it does **NOT** reset to a blank pause-mode grid
			- The current grid view is preserved (no unexpected page reload or blank canvas)
				- The user can continue making manipulations without needing to recover the session
					- The authoring mode remains the same as before the failed request

### View-filter removal failure does not freeze the editor - P1
<!-- Priority promoted to P1 (from Jira P1) — intentional: this is a direct regression of the core error-recovery fix.
     Priority note: Jira sub test cases classify as P1 (BCIN-6485). Promoted because it directly tests the freeze-prevention behavior that is the core user-observable outcome of this feature. -->

- In Library report editor, open the BCIN-6485 test report
	- Add an attribute (e.g. Category) to the report and click "Resume Data Retrieval" so results display
		- Add the same attribute to a view filter and apply a condition (e.g. Category In Books)
			<!-- Edit preservation check: N-1 -->
			- Remove the attribute from the "In Report" object list
				- The expected validation error appears ("attribute is used in a view filter")
					- After dismissing the error, the report does NOT remain stuck on a loading indicator
						- The user can continue editing (add different attributes, change the filter, etc.)
							- The report is NOT redirected to Library home

---

## Functional - MDX / Engine Errors

### MDX or analytical-engine error does not trap the author (BCEN-4129 / BCEN-4843) - P1
<!-- B-1 / Jira GAP-1: new scenario. Backed by BCEN-4129, BCEN-4843. Distinct from the Cartesian-join BCIN-974 path. -->

- In Library authoring mode, reproduce or simulate an MDX or analytical-engine-side error aligned with the failure patterns described in BCEN-4129 or BCEN-4843 (e.g. an expression or calculation that causes a server-side engine failure, not a row-limit or join error)
	- Observe the error handling behavior after the failure
		- An error dialog appears with a user-readable message
			- After dismissing the dialog, the user is NOT trapped in an unrecoverable state
				- The user can make a corrective edit (e.g. remove the problematic expression or metric) and attempt to run the report again
					- The report editing session does not require a page refresh or reopen

---

## Functional - Prompt Flow

### Cancel from prompt-related recovery returns to a safe authoring state - P1

- Trigger the prompt or reprompt recovery path (prompt-apply failure)
	- Choose the cancel path from the prompt dialog
		- The prompt dialog closes cleanly
			- The report grid is visible in pause mode (empty grid, no spinner)
				- **The author can re-trigger the prompt** (e.g. click "Resume Data Retrieval" or the prompt icon) without any additional recovery step
					- Design changes made before the failure are still present
					- The user is NOT forced back to Library home

### Prompt recovery UI actions (Return to Prompt link) are present and operable in the error state - P2
<!-- N-6 / GitHub GAP-3. Trace: XR-06, GH-08, GH-09, GH-11 -->

- Trigger a prompt-answer failure that activates the prompt recovery UI
	- Inspect the error state before taking any recovery action
		- A "Return to Prompt" link or equivalent recovery affordance is visible in the error UI
			- Clicking the link or action returns the user to the prompt with previous answers available
				- The UI does not require additional navigation to access the prompt recovery path

---

## xFunctional
### Create Report From Template - Running Mode - P2
<!-- Below should be example scenarios including combination test-->
### Repeat Different Error Paths After Error Recovery - P2
<!-- Below should be example scenarios including combination test-->

---
## UI - Messaging
<!-- Refer to figma design https://www.figma.com/design/gzj8mez8AnHHm0u9tFJvFx/Report-enhancement?node-id=25-480&t=DD7XZoFhtWF4vpHL-0-->
### Report Failed to Run
	- show report cannot be opened
### Dataset can't be loaded
	- Remove send email, click ok go back to previous status
---

## Platform - P2

### Major browser coverage for continued editing after failure - P2

- Test in Edge, Safari, Chrome

### Workstation parity expectations from BCIN-6706 - P2
<!-- Jira-derived only (BCIN-6706). No GitHub evidence. Labeled as exploratory / gap-documentation. -->

- Launch Workstation and log in, as described in BCIN-6706
	- Create a new report from scratch and execute it until a report execution fails
		- Confirm whether the user can inspect failure context or continue editing comparably to Library
			- Any remaining Workstation parity gap is documented clearly

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


---




