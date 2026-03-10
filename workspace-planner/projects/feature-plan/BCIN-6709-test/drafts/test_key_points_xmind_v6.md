# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

## EndToEnd - P0

### Continue editing after clicking "Resume Data Retrieval" on a report that exceeds the row limit - P0

- Open a report in Library authoring mode and set the maximum rows limit low enough to reproduce the row-limit failure described in the Jira and design evidence
	- Make one or more report design changes
		- Click "Resume Data Retrieval"
			- A row-limit error appears
				- Close the error dialog
					- The report remains in the same authoring workflow instead of sending the user back to Library home
					- The prior design changes remain available when the recovery flow is supposed to preserve them
					- The user can continue editing immediately after recovery

### Continue editing after a report execution error caused by a Cartesian-join scenario - P0

- In Library authoring mode, create the report scenario described in `BCIN-974` with attributes `Object Category`, `Object Extended Type`, `Object Type`, and then add `Change Type`
	- Click "Resume Data Retrieval"
		- A Cartesian-join execution error appears
			- Dismiss the error dialog
				- The report does not remain forever loading
				- The editor remains interactive
				- The user can continue editing instead of refreshing or reopening the page

### Return to the prompt with previous answers preserved after prompt apply fails - P0

- Open a prompted report in Library authoring mode
	- Enter prompt answers and apply them
		- Trigger the prompt-related recovery path described in the design and reflected in the GitHub prompt-handling evidence
			- The prompt is shown again instead of abandoning the session
				- The previous answers remain available for review and retry
				- The user can continue the workflow without re-entering all prompt values from scratch

### Keep the next editing action possible after recovery - P0

- Recover from one of the primary report-authoring failures covered by this feature
	- Attempt the next intended editing action in the same report
		- The next action succeeds or reaches its normal validation path
			- The report is not stuck in a frozen, blank, or dead state

## Report Creator Dialog - P3

### Confirm the new recovery feature does not change how users enter report authoring - P3

- Open the normal report-authoring entry flow that leads into the affected editor experience
	- Enter authoring and begin editing
		- The path into report authoring behaves the same as before this recovery feature

## Error handling / Special cases - P0

### Recover from the view-filter removal failure without freezing the editor - P0

- In Library report editor, add an attribute such as category and click "Resume Data Retrieval" so results display, as described in `BCIN-6485`
	- Add the same attribute to a view filter and apply a condition such as category in books
		- In the "In Report" object list, remove the attribute from the report
			- The expected error appears stating that the attribute is used in a view filter
				- After dismissing the error, the report does not become permanently stuck on a loading icon
				- The user can recover and continue instead of being forced to abandon the report

### Keep the editor usable after dismissing the pause-partial-data-retrieval failure - P0

- Follow the `BCIN-974` reproduction steps until the report execution error appears after clicking "Resume Data Retrieval"
	- Dismiss the error and click "Pause Data Retrieval"
		- The page does not load forever
			- The editor remains interactive
			- The user is not forced to close or refresh the whole page to continue

### Show detailed error information when the experience is supposed to expose it - P1

- Reproduce the intermittent missing-error-details scenario from `BCIN-6574` by repeatedly running the affected report in Library
	- Observe the error dialog or error surface when a server-side failure occurs
		- Detailed error information or equivalent user guidance is shown consistently when the product is expected to expose it
			- The user is not left without any actionable explanation of the failure

### Keep continued-editing behavior aligned with related historical defects - P1

- Reproduce a failure pattern aligned with `BCEN-4843` or `BCEN-4129`
	- Close or recover from the failure path
		- The user can continue working in the recovered flow expected by the new feature direction

## Security Test - P2

### Keep recovery messages free of internal implementation details - P2

- Trigger representative recovery and prompt-related failures in a production-like environment
	- Review all user-visible messages
		- Internal method names, raw flags, stack traces, and low-level implementation details are not shown to end users

## Pendo - P3

### Confirm the recovery flow does not introduce an obvious user-journey tracking break - P3

- Move through the primary recovery flow from error to continued editing
	- Confirm the recovery path does not visibly skip, break, or distort the expected user journey in a way that would obviously disrupt downstream tracking of the editing flow

## performance - P1

### Keep recovery fast enough for continued editing - P1

- Trigger a primary authoring recovery path such as the row-limit or Cartesian-join scenario
	- Measure the user-visible transition from error to usable report state
		- Recovery completes within a reasonable editing-time expectation
			- The page does not remain in a prolonged or indefinite loading state

### Remain stable across repeated recovery cycles - P1

- Trigger the same or similar recovery scenario multiple times in one session
	- Continue editing between failures
		- The report remains usable across repeated recovery cycles
			- The editor does not degrade into a frozen or blank state

## Platform - P2

### Verify major browser coverage for continued editing after failure - P2

- Repeat a key recovery scenario in Chrome
	- The report recovers and remains editable

- Repeat a key recovery scenario in Firefox
	- The report recovers and remains editable

- Repeat a key recovery scenario in Safari
	- The report recovers and remains editable

- Repeat a key recovery scenario in Edge
	- The report recovers and remains editable

### Verify Workstation failed-report parity expectations from `BCIN-6706` - P2

- Launch Workstation and log in to an environment, as described in `BCIN-6706`
	- Create a new report from scratch and execute it until the report execution fails
		- Confirm whether the user can inspect failure context or continue editing in a way comparable to Developer
			- Any remaining Workstation parity gap is documented clearly

## upgrade  / compatability - P2

### Keep existing consumption-mode behavior unchanged - P2

- Open the same report in a consumption-oriented flow that is outside the authoring recovery target
	- Trigger a relevant failure path
		- Existing non-authoring behavior does not regress because of the new authoring recovery work

### Keep cross-repo compatibility aligned during recovery - P2

- Execute a recovery path that depends on backend, controller, editor, prompt, and string layers together
	- Complete the recovery flow
		- The repos behave as one compatible system rather than leaving the user in a mixed or inconsistent state

## Accessibility - P2

### Keep recovery dialogs and prompt-return flows keyboard accessible - P2

- Trigger a recovery dialog or prompt-return flow
	- Navigate the flow by keyboard
		- Focus is placed meaningfully
		- The user can complete the recovery path without needing a mouse

## Embedding - P3

### Confirm the recovery feature does not introduce an obvious embedding-specific regression - P3

- If the same authoring surface is embedded in a supported host flow, trigger a representative recovery scenario
	- Confirm the recovery UI and continued-editing behavior do not visibly break the embedded experience

## i18n - P2

### Verify updated recovery strings and statuses appear correctly - P2

- Trigger the main recovery flows affected by the `productstrings` changes
	- Review the user-visible Library and report-editor copy
		- The updated strings appear in the correct recovery states
		- The status or guidance text matches the intended behavior
		- No placeholder, missing, or obviously broken string is shown

## AUTO: Automation-Only Tests

### Unit / Integration Coverage - P0

- Validate recreated-instance behavior for report recovery logic
- Validate history-preservation versus reset policy by failure class
- Validate prompt-return behavior and prompt-answer preservation logic
- Validate controller / command-manager behavior during recovery coordination
- Validate user-visible recovery strings and statuses where automated coverage is feasible
