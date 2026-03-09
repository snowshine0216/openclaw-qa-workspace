# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

---
**Synthesis version**: v9
**Based on**: v8 + review consolidation (review_jira + review_confluence + review_github)
**Changes from v8**: B-1..B-7 blocking fixes applied; N-1..N-12 non-blocking fixes applied
**Date**: 2026-03-07

---

## EndToEnd - P0

### Continue editing after "Resume Data Retrieval" fails with row-limit error - P0

- Open a report in Library authoring mode that will exceed the configured row limit
	- Make one or more report design changes (e.g. add a metric or attribute)
		<!-- Edit preservation check: N-1 — validates Jira P0 "previously applied edits preserved" -->
		- Click "Resume Data Retrieval"
			- A row-limit error dialog appears ("Maximum number of results rows per report exceeded the current limit")
				- Click "OK" to dismiss the dialog
					- The report returns to pause mode (empty grid — no data rows, no loading spinner)
					- The user remains inside the same report editing workflow — not redirected to Library home
					- **The design changes made before the error are still visible in the report template** (edit preservation)
					- The editor is immediately usable for further edits

### Continue editing after a Cartesian-join execution error (BCIN-974) - P0
<!-- Jira-derived; acceptable instantiation of XR-01. Origin: BCIN-974. -->

- In Library authoring mode, open a report with attributes Object Category, Object Extended Type, Object Type, and add Change Type (as described in BCIN-974)
	- Click "Resume Data Retrieval"
		<!-- Edit preservation check: N-1 — validates Jira P0 "previously applied edits preserved" -->
		- A Cartesian-join execution error dialog appears
			- Dismiss the error dialog
				- The report does not remain stuck in perpetual loading
				- The editor remains interactive
				- **Report objects added before the error are still present** (edit preservation)
				- The user can continue editing without refreshing or reopening the page

### Return to prompt with previous answers preserved after prompt apply fails - P0

- Open a prompted report in Library authoring mode
	- Enter prompt answers and apply them in a setup that triggers the prompt-apply recovery path
		- The prompt dialog appears again instead of abandoning the session
			- The previously entered prompt answers remain populated in the prompt fields
				- The user can revise or resubmit without re-entering answers from scratch

### Report loads and remains interactive after prompt resubmission - P0
<!-- B-7 / GitHub GAP-4: split from "Return to prompt" to ensure resubmission success path is tested independently. Trace: XR-04, GH-08, GH-09 -->

- Following the "Return to prompt" recovery path, correct or resubmit the prompt answers
	- Wait for the report to load
		- The report opens successfully — grid is in running mode with data loaded
			- The editor accepts the next authoring action without freezing or returning to the prompt unexpectedly
				- The user can continue the report editing session

### Keep the next editing action possible after any recovery - P0

- Recover from any of the primary authoring failures covered by this feature (row-limit, Cartesian-join, view-filter removal, prompt apply)
	- Attempt the next intended editing action in the same report
		- The action succeeds or reaches its normal validation path
			- The report is not stuck in a frozen, blank, or dead state
				- No additional page refresh or reopen is required

---

## Functional - Pause Mode

### Pause mode: normal manipulation error transitions report from running grid to pause mode - P0
<!-- B-7 / Confluence GAP-1: standalone P0 for the grid-to-pause-mode view transition after normal manipulation failure.
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

### Pause mode: recovered report accepts the next action without hanging - P0

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
<!-- Note: P0 promoted intentionally from Jira P1 — this directly exercises the isReCreateReportInstance undo-reset policy (GH-04, GH-05, XR-03). -->

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

### View-filter removal failure does not freeze the editor - P0
<!-- Priority promoted to P0 (from Jira P1) — intentional: this is a direct regression of the core error-recovery fix.
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

## Error Messaging

### Error message guides the user toward fixing the failure - P1
<!-- B-2 / Jira GAP-2: new scenario. Tests actionable guidance quality, not just message presence. -->

- Trigger a row-limit execution failure in Library authoring mode
	- Read the error dialog content
		- The message explains the cause in understandable terms (e.g. "Maximum number of result rows exceeded")
			- The message includes or implies a corrective action the author can take (e.g. reduce row limit, filter data, revise report design)
				- The user can act on the message without needing to consult documentation or engineering
- Trigger a Cartesian-join execution failure
	- Read the error dialog content
		- The message identifies the nature of the failure clearly enough for the author to understand what to change

### Error details are shown consistently when the product is supposed to expose them (BCIN-6574) - P2
<!-- Downgraded from P1 → P2 per GitHub review (TG-1, PI-1): GH-10/GH-11/XR-06 are P2 in the traceability file.
     Jira source: BCIN-6574. -->

- Reproduce the intermittent missing-error-details scenario from BCIN-6574 by repeatedly running the affected report in Library
	- Observe the error dialog when a server-side failure occurs
		- Detailed error information or equivalent user guidance is shown consistently
			- The dialog does not intermittently omit the detail section for the same failure pattern

### Error dialog uses the mapped user-facing message for exceeded-row-limit recovery - P2
<!-- N-11 / Confluence GAP-2 -->

- Trigger the row-limit exceeded failure that activates the recovery dialog
	- Observe the exact text shown to the user
		- The message matches the mapped user-facing string for this error type (not an internal code or raw exception text)
			- The message is consistent across repeated occurrences of the same failure

### Error confirmation dialog is operable and completes recovery - P2
<!-- N-12 / Confluence GAP-3 -->

- Trigger a recovery error dialog
	- Click the confirmation action (e.g. "OK" button) to dismiss and proceed
		- The dialog dismisses immediately on click
			- Recovery proceeds to the expected next state without requiring additional user action
				- No secondary error, freeze, or blank state follows the confirmation

### Recovery messages do not expose internal implementation details - P2

- Trigger representative recovery and prompt-related failures in Library
	- Review all user-visible messages and dialogs
		- Internal method names, raw flag values, stack traces, and low-level code details are NOT shown to the user

### Updated Library and editor recovery strings appear correctly - P2
<!-- GitHub-sourced: productstrings PRs #15008, #15012 (GH-10, GH-11, XR-06) -->

- Trigger the main recovery flows affected by the productstrings changes
	- Review the user-visible Library and report-editor copy
		- Updated strings appear in the correct recovery states
			- No placeholder, missing, or obviously broken string is shown

### Obsolete recovery UI actions are absent from the updated error UI - P2
<!-- N-5 / GitHub GAP-2. Trace: XR-06, GH-10, GH-11 -->

- Trigger a recovery-related error state that shows updated user actions
	- Inspect all available actions in the error UI
		- Obsolete actions (e.g. a legacy cancel-only button or pre-feature recovery path) are not shown
			- The remaining actions support the new recovery flow cleanly without dead-end options

---

## Integration

### Report state (layout, template, prompt context) is preserved across all recovery paths - P1
<!-- B-4 / GitHub GAP-1. Trace: GH-01, GH-02, GH-03, XR-05 -->

- Open a report with visible state: custom layout, template settings, or prompt-driven filter context
	- Trigger each primary recovery path in sequence: row-limit, Cartesian-join, view-filter removal
		- After each recovery completes and the report returns to pause mode:
			- Report template settings (metrics, attributes, template structure) remain as they were before the error
				- Prompt-driven context (filter values applied from a prompt answer) is not reset
					- The recovered report UI does not show an obviously reset or blank state

### Recovery keeps the user inside the same report session across all paths - P1

- Trigger each supported recovery path in authoring mode: row-limit, Cartesian-join, view-filter removal, prompt apply
	- Complete each recovery flow
		- The user remains in the same report workflow for all paths
			- No path redirects to Library home
				- Each recovered report accepts follow-up edits

### Document view transitions to pause mode correctly after crashed-instance recovery - P1
<!-- ACT-3 fix: "stable and interactive" replaced with specific post-recovery UI state. -->

- Trigger a crashed-instance recovery scenario (pause mode → Resume Data Retrieval → failure)
	- Observe the recovered document view after dismissing the error
		- The grid is in **pause mode**: empty grid, no data rows, no loading spinner
			- All authoring controls are enabled (metric/attribute panels, filter panel, toolbar)
				- The report does NOT remain in running-mode grid or show a blank canvas

### Keep pause-data-retrieval path unblocked after execution error - P1

- Follow BCIN-974 reproduction steps until the execution error appears after "Resume Data Retrieval"
	- Dismiss the error and click "Pause Data Retrieval"
		- The page does NOT load forever
			- The editor remains interactive
				- The user is not forced to close or refresh the whole page

### Cross-repo recovery handshake completes end to end - P0
<!-- ACT-2 / B-3 fix: tied to specific row-limit failure path; observable confirmation specified. -->

- In Library authoring mode, trigger the row-limit failure path (the most reproducible core-recovery scenario)
	- Let the application complete the full recovery path: error dialog → dismiss → pause mode
		- Click "Resume Data Retrieval" again as the follow-up operation
			- The follow-up request is sent successfully (no "stuck loading" or secondary error)
				- The report loads or returns to pause mode as expected
					- The recovery contract between editor, controller, backend, and prompt layers has completed without a dead-end state

### Repeated recovery cycles remain stable - P1
<!-- Priority promoted from Jira P2 → P1: intentional — directly validates the robustness of the core recovery mechanism across sessions.
     Priority note: Jira P2 (BCIN-6709 sub test cases). Promoted because repeated-cycle stability is core to the "continued editing" user promise. -->

- Trigger a recoverable error and recover
	- Trigger the same or another recoverable error and recover again
		- Repeated recovery does not leave stale loading, frozen commands, or inconsistent report state
			- The editor remains fully responsive after each cycle

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
<!-- Jira-derived only (BCIN-6706). No GitHub evidence. Labeled as exploratory / gap-documentation. -->

- Launch Workstation and log in, as described in BCIN-6706
	- Create a new report from scratch and execute it until a report execution fails
		- Confirm whether the user can inspect failure context or continue editing comparably to Library
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

---

## i18n - P2

### Updated recovery strings appear correctly in non-English locales - P2

- Trigger the main recovery flows with the application set to a non-English locale
	- Review user-visible Library and report-editor copy
		- Updated strings appear correctly in the target locale
			- No placeholder or missing string is shown

---

## Performance - P2
<!-- Downgraded from P1 → P2 per GitHub review (TG-2, PI-2): no GitHub trace; outside GitHub-evidence scope. -->

### Recovery completes within reasonable editing-time expectation - P2

- Trigger a primary authoring recovery path (row-limit or Cartesian-join)
	- Measure the user-visible transition from error to usable report state
		- Recovery completes in a reasonable time (no indefinite loading state)

---

## Embedding - P3
<!-- Speculative — no GitHub backing. Retained as low-priority regression guard. -->

### Recovery feature does not introduce an obvious embedding-specific regression - P3

- If the authoring surface is embedded in a supported host flow, trigger a representative recovery scenario
	- Confirm the recovery UI and continued-editing behavior do not visibly break the embedded experience

---

## Report Creator Dialog - P3
<!-- Speculative — no GitHub backing. Retained as low-priority regression guard. -->

### New recovery feature does not change how users enter report authoring - P3

- Open the normal report-authoring entry flow
	- Enter authoring and begin editing
		- The path into report authoring behaves the same as before this feature

---

## AUTO: Automation-Only Tests - P0

### Unit / Integration Coverage - P0

- Validate recreated-instance behavior for report recovery logic (`recreate-report-error.ts`, `shared-recover-from-error.ts`)
- Validate undo/redo preservation vs reset policy by error class (`undo-redo-util.ts`, `isReCreateReportInstance` flag lifecycle)
- **Validate `isModelingServiceManipulation` flag gates undo/redo reset correctly** (`report-def-slice.ts`, `report-property-slice.ts`)
- Validate controller / command-manager behavior during recreate flow (`RootController.js`, `UICmdMgr.js`)
- Validate prompt-return behavior and prompt-answer preservation (`ErrorObjectTransform.js`, `promptActionCreators.js`)
- Validate backend `reCreateInstance` routing: stid=-1 path vs normal undo path (`RWManipulationBuilder.java`)
- **Validate `reCreateInstance: true` is NOT present in the POST body for modeling-service non-crash failures** (API-level assertion; moved from manual section AI-1 fix)
- Validate user-visible recovery strings and statuses where automated coverage is feasible (`Statuses.fdb`, `Strings.fdb`)
