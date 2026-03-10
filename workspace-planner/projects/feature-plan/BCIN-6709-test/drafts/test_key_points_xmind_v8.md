# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

---
**Synthesis version**: v8
**Method**: 3-step protocol — Collect → Research → Deduplicate
**Sources**: sub_test_cases_jira, sub_test_cases_confluence, sub_test_cases_github
**Research applied**: confluence_design_doc (normal manipulation = POST manipulations API; modeling-service manipulation = PUT /model/reports API)
**Date**: 2026-03-07

---

## EndToEnd - P0

### Continue editing after "Resume Data Retrieval" fails with row-limit error - P0

- Open a report in Library authoring mode that will exceed the configured row limit
	- Make one or more report design changes (e.g. add a metric or attribute)
		- Click "Resume Data Retrieval"
			- A row-limit error dialog appears ("Maximum number of results rows per report exceeded the current limit")
				- Click "OK" to dismiss the dialog
					- The report returns to pause mode (empty grid — no data rows)
					- The user remains inside the same report editing workflow — not redirected to Library home
					- Previous design changes are still present in the report
					- The editor is immediately usable for further edits (e.g. add filter to narrow data)

### Continue editing after a Cartesian-join execution error (BCIN-974) - P0

- In Library authoring mode, open a report with attributes Object Category, Object Extended Type, Object Type, and add Change Type (as described in BCIN-974)
	- Click "Resume Data Retrieval"
		- A Cartesian-join execution error dialog appears
			- Dismiss the error dialog
				- The report does not remain stuck in perpetual loading
				- The editor remains interactive
				- The user can continue editing without refreshing or reopening the page

### Return to prompt with previous answers preserved after prompt apply fails - P0

- Open a prompted report in Library authoring mode
	- Enter prompt answers and apply them in a setup that triggers the prompt-apply recovery path
		- The prompt dialog appears again instead of abandoning the session
			- The previously entered prompt answers remain populated in the prompt fields
				- The user can revise or resubmit without re-entering answers from scratch
				- The report remains available after successful resubmission

### Keep the next editing action possible after any recovery - P0

- Recover from any of the primary authoring failures covered by this feature (row-limit, Cartesian-join, view-filter removal, prompt apply)
	- Attempt the next intended editing action in the same report
		- The action succeeds or reaches its normal validation path
			- The report is not stuck in a frozen, blank, or dead state
			- No additional page refresh or reopen is required

---

## Functional - Pause Mode

### Pause mode: normal manipulation history is preserved after crashed-instance recovery - P1

<!-- Research applied: "normal manipulation" = POST /api/documents/{instanceId}/manipulations
     (view template changes via doc-view-slice / updateViewTemplateThunkHelper).
     Concrete user actions: apply a view filter, sort rows, change a display setting, resize a column. -->

- Open a report in Library authoring pause mode
	- Perform one or more normal (view-template) manipulations before triggering the error:
		- Apply a view filter (e.g. add a category filter in the view filter panel)
		- OR sort rows by clicking a column header
		- OR change a display setting such as column width or font in the report editor
	- Trigger the crashed-instance recovery flow by clicking "Resume Data Retrieval" in a setup that causes a row-limit or execution failure
		- Click "OK" to dismiss the error
			- The report returns to pause mode
				- The Undo button is available (not grayed out)
				- Undo reverts to the state before the normal manipulation
				- Redo behavior is consistent with the preserved history

### Pause mode: recovered report accepts the next action without hanging - P0

- Recover from a pause-mode "Resume Data Retrieval" execution failure
	- Perform another authoring action after the error dialog is dismissed (e.g. click "Resume Data Retrieval" again, or make another design change)
		- The next action is sent successfully
			- The page does not hang without a request being sent
			- The user does not need to reopen the report to continue

---

## Functional - Running Mode

### Running mode: modeling-service manipulation clears undo and redo after recovery - P1

<!-- Research applied: "modeling-service manipulation" = PUT /api/model/reports/{reportId}
     (report definition changes via modifyReportDefinition / report-def-slice / report-property-slice).
     Confirmed concrete user actions from research_modeling_service.md and confluence_design_doc: -->

- Open a report in Library authoring mode and enter running mode (click "Switch to Design Mode" / execute the report)
	- Perform one of the following modeling-service-based changes that will trigger a rebuild-document failure:
		- **Option A — Advanced Properties row limit** (confirmed): File → Report Properties → Advanced Properties → set a low row limit → Done
		- **Option B — Join type change** (confirmed from Confluence `join-menu.tsx`): right-click a table relationship → Join Type → change to Cross Join on a report without a defined table relationship
		- **Option C — Template unit update** (confirmed from Confluence `report-def-slice.ts`): add or remove an attribute or metric from the report template that causes a row-limit or analytical engine failure
	- Wait for the rebuild-document error dialog to appear
		- Dismiss the error
			- The report returns to pause mode
				- Undo history is cleared (Undo button is grayed out)
				- Redo history is cleared (Redo button is grayed out)
				- The report remains usable for continued editing

### Running mode: normal manipulation preserves undo and redo after recovery - P1

<!-- Research applied: "normal manipulation" in running mode = POST /api/documents/{instanceId}/manipulations
     (view-template changes via updateViewTemplateThunkHelper in doc-view-slice.ts — NOT PUT /model/reports).
     Concrete user actions: apply or change a view filter while in running mode, sort rows, change display settings. -->

- Open a report in Library authoring mode and enter running mode so data is displayed
	- Perform a normal (non-modeling-service) manipulation that triggers a rebuild-document failure:
		- Apply or modify a view filter (e.g. add attribute to view filter panel and apply)
		- OR sort by a column that triggers a server-side rebuild failure
	- Wait for the error dialog to appear
		- Dismiss the error
			- The report returns to pause mode
				- Undo history remains available (Undo button is active)
				- Redo history remains available when it existed before the error
				- The user can undo the manipulation that caused the failure

### Running mode: user can undo a crashed manipulation after recovery - P1

- In running mode, perform a manipulation that leads to the crashed-manipulation scenario
	- Complete recovery and return to pause mode
		- Use Undo to revert the crashed manipulation
			- Report objects refresh to reflect the undo result
				- The user can continue editing from the corrected report state

---

## Functional - Modeling Service Non-Crash Path

### Modeling-service request failure does NOT recreate the document instance - P1

- Perform a modeling-service request that fails (PUT /api/model/reports returns an error) — e.g. remove an attribute that is used in a filter (BCIN-6485 test report)
	- Complete the error handling flow
		- The report stays in its current mode and state — it does NOT jump to pause mode empty grid
			- The document view remains displaying the grid (not blank)
			- The user can continue making manipulations without the instance being recreated
			- No `reCreateInstance` API call is made (check Network tab — no POST with `reCreateInstance: true`)

### View-filter removal failure does not freeze the editor - P0

- In Library report editor, open the BCIN-6485 test report
	- Add an attribute (e.g. Category) to the report and click "Resume Data Retrieval" so results display
		- Add the same attribute to a view filter and apply a condition (e.g. Category In Books)
			- Remove the attribute from the "In Report" object list
				- The expected validation error appears ("attribute is used in a view filter")
					- After dismissing the error, the report does NOT remain stuck on a loading indicator
					- The user can continue editing (add different attributes, change the filter, etc.)
					- No forced redirect to Library home

---

## Functional - Prompt Flow

### Cancel from prompt-related recovery returns to a safe authoring state - P1

- Trigger the prompt or reprompt recovery path (prompt-apply failure)
	- Choose the cancel path from the prompt dialog
		- The prompt closes cleanly
			- The report stays available in a usable authoring state
				- The user is NOT forced back to Library home
				- No infinite loading state

---

## Error Messaging

### Error details are shown consistently when the product is supposed to expose them (BCIN-6574) - P1

- Reproduce the intermittent missing-error-details scenario from BCIN-6574 by repeatedly running the affected report in Library
	- Observe the error dialog when a server-side failure occurs
		- Detailed error information or equivalent user guidance is shown consistently
			- The dialog does not intermittently omit the detail section for the same failure pattern
				- The user can understand the cause and decide how to continue

### Recovery messages do not expose internal implementation details - P2

- Trigger representative recovery and prompt-related failures in Library
	- Review all user-visible messages and dialogs
		- Internal method names, raw flag values (e.g. isReCreateReportInstance), stack traces, and low-level code details are NOT shown to the user

### Updated Library and editor recovery strings appear correctly (productstrings PRs) - P2

- Trigger the main recovery flows affected by the productstrings changes
	- Review the user-visible Library and report-editor copy
		- Updated strings appear in the correct recovery states
			- No placeholder, missing, or obviously broken string is shown

---

## Integration

### Recovery keeps the user inside the same report session across all paths - P1

- Trigger each supported recovery path in authoring mode: row-limit, Cartesian-join, view-filter removal, prompt apply
	- Complete each recovery flow
		- The user remains in the same report workflow for all paths
			- No path redirects to Library home
				- Each recovered report accepts follow-up edits

### Document view refreshes correctly after crashed-instance recovery - P1

- Trigger a crashed-instance recovery scenario (pause mode → Resume Data Retrieval → failure)
	- Observe the recovered document view
		- The editor grid does NOT remain blank or show a stale running-mode view
			- The report UI is stable and interactive after recovery

### Keep pause-data-retrieval path unblocked after execution error - P1

- Follow BCIN-974 reproduction steps until the execution error appears after "Resume Data Retrieval"
	- Dismiss the error and click "Pause Data Retrieval"
		- The page does NOT load forever
			- The editor remains interactive
				- The user is not forced to close or refresh the whole page

### Repeated recovery cycles remain stable - P1

- Trigger a recoverable error and recover
	- Trigger the same or another recoverable error and recover again
		- Repeated recovery does not leave stale loading, frozen commands, or inconsistent report state
			- The editor remains fully responsive after each cycle

### Cross-repo recovery handshake completes end to end - P0

- Trigger a recoverable report error in Library authoring
	- Let the application complete the full recovery path (react-report-editor → mojojs → biweb → server)
		- Perform a follow-up report operation
			- Recovery completes without dead-end behavior
				- The follow-up operation confirms the server/client recovery contract works end to end

---

## Workflow / Usability

### Cancel is not the only exit from a broken authoring state - P1

- Trigger a report authoring error that previously left the page loading with only a cancel option
	- Observe the recovery options after dismissing the error message
		- The user has a path to continue editing without being forced to cancel out of the report
			- Using no action other than dismissing the error does not trap the user in a dead-end state

### Continued editing supports iterative trial-and-error authoring - P2

- Open a report early in creation when filters are not yet defined
	- Run the report, hit an execution error, revise the design, and run again
		- The report author can continue the iterative edit-and-check workflow
			- The application does not force a restart of the report session

---

## Platform - P2

### Major browser coverage for continued editing after failure - P2

- Repeat a key recovery scenario (row-limit or Cartesian-join) in Chrome
	- The report recovers and remains editable

- Repeat the same scenario in Firefox
	- The report recovers and remains editable

- Repeat in Safari
	- The report recovers and remains editable

- Repeat in Edge
	- The report recovers and remains editable

### Workstation parity expectations from BCIN-6706 - P2

- Launch Workstation and log in, as described in BCIN-6706
	- Create a new report from scratch and execute it until a report execution fails
		- Confirm whether the user can inspect failure context or continue editing comparably to Developer
			- Any remaining Workstation parity gap is documented clearly

---

## Accessibility - P2

### Recovery dialogs and prompt-return flows are keyboard accessible - P2

- Trigger a recovery dialog or prompt-return flow
	- Navigate the flow using keyboard only
		- Focus is placed on the dialog immediately
			- The user can dismiss the dialog and complete recovery without a mouse

---

## upgrade / compatibility - P2

### Existing non-authoring behavior is unchanged - P2

- Open the same report in a consumption-oriented (non-authoring) flow
	- Trigger a relevant failure path
		- The new authoring recovery behavior is NOT applied to non-authoring mode
			- Out-of-scope behavior remains unchanged

### Cross-repo compatibility holds during recovery - P2

- Execute a recovery path that depends on backend, controller, editor, prompt, and string layers together
	- Complete the recovery flow
		- All repos behave as one compatible system

---

## i18n - P2

### Updated recovery strings appear correctly in non-English locales - P2

- Trigger the main recovery flows with the application set to a non-English locale
	- Review user-visible Library and report-editor copy
		- Updated strings appear correctly in the target locale
			- No placeholder or missing string is shown

---

## Performance - P1

### Recovery completes within reasonable editing-time expectation - P1

- Trigger a primary authoring recovery path (row-limit or Cartesian-join)
	- Measure the user-visible transition from error to usable report state
		- Recovery completes in a reasonable time (no indefinite loading state)

---

## Embedding - P3

### Recovery feature does not introduce an obvious embedding-specific regression - P3

- If the authoring surface is embedded in a supported host flow, trigger a representative recovery scenario
	- Confirm the recovery UI and continued-editing behavior do not visibly break the embedded experience

---

## Report Creator Dialog - P3

### New recovery feature does not change how users enter report authoring - P3

- Open the normal report-authoring entry flow
	- Enter authoring and begin editing
		- The path into report authoring behaves the same as before this feature

---

## AUTO: Automation-Only Tests - P0

### Unit / Integration Coverage - P0

- Validate recreated-instance behavior for report recovery logic (`recreate-report-error.ts`, `shared-recover-from-error.ts`)
- Validate undo/redo preservation vs reset policy by error class (`undo-redo-util.ts`, `isReCreateReportInstance` flag lifecycle)
- Validate `isModelingServiceManipulation` flag correctly gates undo/redo reset (`report-def-slice.ts`, `report-property-slice.ts`)
- Validate controller / command-manager behavior during recreate flow (`RootController.js`, `UICmdMgr.js`)
- Validate prompt-return behavior and prompt-answer preservation (`ErrorObjectTransform.js`, `promptActionCreators.js`)
- Validate backend `reCreateInstance` routing: stid=-1 path vs normal undo path (`RWManipulationBuilder.java`)
- Validate user-visible recovery strings and statuses where automated coverage is feasible (`Statuses.fdb`, `Strings.fdb`)
