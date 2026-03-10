# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

## Functional - P1

### Continue editing after a max rows error in pause mode - P1

- Open a report in authoring mode and set up a case that exceeds the row limit
	- Click "Resume Data Retrieval"
		- An error dialog appears
			- Click "OK"
				- The dialog closes
				- The report returns to pause mode
				- The grid shows the pause-mode layout
				- The user can continue editing the report

### Continue editing after a report error in running mode - P1

- Open a report in authoring mode and trigger a report error while data is being rebuilt
	- Wait for the error dialog to appear
		- Click "OK"
			- The report returns to pause mode
			- Previous changes are still visible when the design expects them to be preserved
			- The user can continue editing instead of reopening the report

### Undo or continue based on the type of failed change - P1

- Make a normal report change that later triggers an error
	- Complete the recovery flow
		- Undo remains available
		- Earlier successful changes still appear in history
		- Redo remains available if it was available before the error

- Make a change that updates advanced properties and then triggers an error
	- Complete the recovery flow
		- Undo is no longer available
		- Redo is no longer available
		- The user can continue from the recovered state

### Return to the prompt with previous answers preserved - P1

- Open a prompted report in authoring mode
	- Enter prompt answers and apply them
		- Trigger the prompt-related error scenario
			- The prompt opens again
				- The previous answers are still filled in
				- The user can adjust the answers and try again

- Trigger a prompt-related error and choose to cancel from the prompt
	- The prompt closes
		- The report remains available in pause mode

## Integration - P2

### Keep the user inside the same report after recovery - P2

- Trigger a supported report error in authoring mode
	- Complete the recovery flow
		- The user remains in the same report
		- The application does not send the user back to the Library home page
		- The report remains editable after recovery

### Allow the next action after an error has been handled - P2

- Trigger a supported report error while a user action is in progress
	- Finish the recovery flow
		- The next user action sends successfully
		- The page is not stuck in a loading state
		- The user does not need to refresh the browser to continue

### Refresh the report view after recovery - P2

- Trigger a supported report error that returns the report to pause mode
	- Finish the recovery flow
		- The report view refreshes correctly
		- The grid is visible after recovery
		- The page does not show an empty report area

## UX - P2

### Show a clear and actionable error dialog - P2

- Trigger a supported report error
	- Review the dialog content shown to the user
		- The message explains what happened in user-friendly language
		- The message helps the user decide what to do next
		- The dialog does not expose internal implementation details

### Show the correct recovery state while the system is working - P2

- Trigger a supported report error during a longer recovery path
	- Watch the page while recovery is in progress
		- The page shows a clear recovery/loading state if needed
		- The recovery state disappears when recovery is complete
		- The report becomes usable again after recovery

## Edge Cases - P3

### Handle repeated errors without forcing a page refresh - P3

- Trigger one supported report error
	- While recovery is still settling, trigger another supported error scenario
		- The first recovery completes cleanly
		- The user sees the next error in a controlled way
		- The page does not become stuck or unusable

### Handle a timeout during recovery - P3

- Trigger a supported report error in an environment where recovery is delayed or times out
	- Wait for recovery to finish or fail
		- The user sees a clear timeout or failure message
		- The page does not stay in an endless loading state
		- The user understands whether to retry or exit

### Recover when the first change after opening the report fails - P3

- Open a report in authoring mode
	- Make the first change and trigger a supported report error
		- Recovery completes cleanly
		- Undo is unavailable if there is no prior history
		- The user can continue editing after recovery

### Preserve in-progress property changes where supported - P3

- Change report properties in authoring mode
	- Trigger a supported report error before finishing the overall workflow
		- The recovered page keeps the expected property state where the design says it should be preserved
		- The user can continue working from the recovered state

## Security - P3

### Keep internal error details hidden from end users - P3

- Trigger a supported report error in a production-like environment
	- Review the error dialog
		- The user does not see stack traces
		- The user does not see internal class names, function names, or raw system codes
		- The message remains user-friendly

## Platform - P2

### Support recovery in major browsers - P2

- Repeat a supported recovery scenario in Chrome
	- Recovery completes and the report remains usable

- Repeat a supported recovery scenario in Firefox
	- Recovery completes and the report remains usable

- Repeat a supported recovery scenario in Safari
	- Recovery completes and the report remains usable

- Repeat a supported recovery scenario in Edge
	- Recovery completes and the report remains usable

## Upgrade / Compatibility - P2

### Keep existing behavior in consumption mode - P2

- Open the same report in consumption mode
	- Trigger an error that belongs to the existing consumption flow
		- Existing consumption behavior remains unchanged
		- No new regression is introduced by the authoring-mode recovery feature

### Verify supported deployment environments - P2

- Validate one supported recovery scenario in MCE
	- Recovery works as expected

- Validate one supported recovery scenario in MEP
	- Recovery works as expected

- Validate one supported recovery scenario in MCG
	- Recovery works as expected

- Validate one supported recovery scenario in MCP
	- Recovery works as expected

## AUTO: Automation-Only Tests

### Unit Tests - P1

- Recovery logic returns the correct response for each supported error type
- Recovery logic preserves or clears history based on the type of failed change
- Recovery state exits cleanly after success and after failure

### Integration Tests - P1

- Recovery requests create a usable replacement instance for supported scenarios
- Follow-up user actions succeed after recovery completes
- Prompt-related recovery returns users to the prompt flow with preserved answers where required

### API Contract Tests - P2

- Recovery endpoints accept the required request shape
- Recovery endpoints return the expected response shape for supported error paths
- Prompt-related recovery responses stay compatible with the authoring flow
