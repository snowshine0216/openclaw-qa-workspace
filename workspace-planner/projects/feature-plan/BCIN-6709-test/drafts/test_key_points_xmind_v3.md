# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

## EndToEnd - P0

### Continue editing after a row-limit error in Library authoring - P0

- Open a report in Library authoring mode with a low row limit configured
	- Make one or more report design changes
		- Click "Resume Data Retrieval"
			- A row-limit error is shown
				- Close the error dialog
					- The report returns to a usable editing state instead of forcing the user back to Library home
					- The previous design changes remain available when the design says they should be preserved
					- The user can continue editing the report

### Continue editing after a report error while the report is running - P0

- Open a report in Library authoring mode
	- Trigger a report error during a running-mode report refresh or manipulation flow described in the design and related issues
		- Close the error dialog when it appears
			- The report returns to a workable state for continued editing
			- The page does not remain in an endless loading state
			- The user does not need to reopen the report from scratch

### Return to the prompt with previous answers preserved after a prompt-related failure - P0

- Open a prompted report in Library authoring mode
	- Enter valid prompt answers and apply them
		- Trigger the prompt-related failure path covered by the design and web-dossier changes
			- The prompt flow returns instead of abandoning the session
				- The previous answers remain available for correction or retry
				- The user can continue the workflow without re-entering everything from scratch

### Keep the next action possible after recovery - P0

- Recover from a report-authoring error in Library
	- Attempt the next intended editing action
		- The next action succeeds or reaches its normal validation path
			- The report is not stuck in a dead or frozen state

## Report Creator Dialog - P3

### Report-creation dialog behavior is not the primary change area for this feature - P3

- This feature does not primarily change the report-creation dialog, but any recovery messaging or entry into authoring should not regress the existing authoring entry flow.

## Error handling / Special cases - P0

### Recover from the loading-forever scenario after pause partial data retrieval - P0

- Open a report scenario matching the behavior described in `BCIN-974`
	- Click the pause partial data retrieval path and trigger the failure condition
		- After the error is handled
			- The report does not remain forever loading
			- The user can still interact with the report editor
			- The user is not forced into a dead-end path

### Recover from the view-filter removal scenario without freezing the editor - P0

- Open the report-editor scenario described in `BCIN-6485`
	- Add an attribute used in a view filter and run the report
		- Remove the same attribute from the report and trigger the failure
			- The user sees the expected error response
			- The editor does not become permanently unusable
			- The user can continue or recover instead of being forced to abandon the session

### Show error details when they are expected - P1

- Trigger the intermittent missing-error-details scenario represented by `BCIN-6574`
	- Observe the error dialog or related recovery message
		- Error details or guidance appear consistently when the experience is supposed to expose them
			- The user is not left without any actionable explanation

### Keep continued-editing behavior aligned with similar historical defects - P1

- Reproduce a failure pattern aligned with `BCEN-4843` or `BCEN-4129`
	- Close or recover from the failure path
		- The user can continue working in the recovered flow expected by the new feature direction

## Security Test - P2

### Keep recovery messages free of internal implementation details - P2

- Trigger representative recovery and prompt-related failures in a production-like environment
	- Review all user-visible messages
		- Internal method names, raw flags, stack traces, and low-level implementation details are not shown to end users

## Pendo - P3

### Pendo is not a primary feature-change surface here - P3

- No direct analytics instrumentation change is evident in the gathered evidence, so this category is retained only to confirm no obvious recovery-flow analytics regression is introduced if instrumentation exists downstream.

## performance - P1

### Keep recovery fast enough for continued editing - P1

- Trigger a representative report-authoring recovery path
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

### Verify Workstation-related parity expectations from related evidence - P1

- Use the failed-report scenario represented by `BCIN-6706`
	- Validate whether users can inspect failure context or continue editing in the way the related issue expects
		- Workstation-related expectations are explicitly validated and any remaining parity gap is documented

## upgrade  / compatability - P2

### Keep existing consumption-mode behavior unchanged - P2

- Open the same report in a consumption-oriented flow that is outside the authoring recovery target
	- Trigger a relevant failure path
		- Existing non-authoring behavior does not regress because of the new authoring recovery work

### Keep cross-repo compatibility aligned - P1

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

### Embedding is not a primary feature-change surface here - P3

- No direct embedding-specific change is evident in the gathered evidence, so this category is retained to confirm the recovery behavior does not introduce an obvious embedding regression if the same authoring surface is embedded elsewhere.

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
