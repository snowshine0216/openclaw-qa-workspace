# BCIN-6709 — Confluence-Derived Sub Test Cases

## Scope

- Source limited to `context/confluence_design_doc_BCIN-6709.md`
- Covers only design-described authoring-mode recovery behavior
- Excludes GitHub diff details, Jira-only expectations, and unsupported inferred behavior

## Functional - P0

### Pause mode: "Resume Data Retrieval" fails with a crashed instance and returns to pause mode - P0

- Open a report in authoring pause mode with a setup that can reproduce the row-limit execution failure
	- Click "Resume Data Retrieval"
		- Wait for the execution error dialog to appear
			- Click "OK"
				- The report returns to pause mode instead of Library home
				- Previous manipulations are preserved in the recovered report state
				- The report remains editable after recovery

### Pause mode: recovered report accepts the next action after error handling - P0

- Recover from a pause-mode "Resume Data Retrieval" execution failure
	- Perform another authoring action after the error dialog is dismissed
		- The new action is sent successfully
		- The page does not hang without request
		- The user does not need to reopen the report to continue

### Running mode: normal manipulation error returns the report to pause mode - P0

- Open a report in authoring mode and enter running mode
	- Perform a normal manipulation that triggers a rebuild-document error
		- Complete the error recovery flow
			- The report view updates back to pause mode
			- The grid area does not remain in the stale running-mode view
			- The report remains usable for continued editing

### Prompt apply error returns the user back to the prompt - P0

- Open a prompted report in authoring mode
	- Enter prompt answers and apply them in a setup that reproduces the documented prompt apply error
		- The system returns to the prompt instead of leaving the report unusable
		- The previous prompt answers remain populated
		- The user can revise the answers and try again

## Functional Variants - P1

### Pause mode: normal manipulation history is preserved after crashed-instance recovery - P1

- In pause mode, make one or more normal report manipulations before reproducing the execution error
	- Trigger the crashed-instance recovery flow through "Resume Data Retrieval"
		- The recovered report keeps the earlier successful manipulation state
		- Undo remains available for preserved history
		- Redo behavior remains consistent with the preserved history state

### Running mode: modeling-service manipulation clears undo and redo after recovery - P1

- In running mode, perform a modeling-service-based change that is followed by a rebuild-document failure
	- Complete recovery
		- The report returns to a usable state
		- Undo history is cleared
		- Redo history is cleared

### Running mode: normal manipulation preserves undo and redo after recovery - P1

- In running mode, perform a normal manipulation that is followed by a rebuild-document failure
	- Complete recovery
		- The report returns to a usable state
		- Undo history remains available
		- Redo history remains available when it existed before the error

### Running mode: user can undo the crashed manipulation after recovery - P1

- In running mode, perform a manipulation that leads to the documented crashed-manipulation scenario
	- Complete recovery and return to pause mode
		- Undo can be used to revert the crashed manipulation outcome in UI
		- Report objects refresh to reflect the undo result
		- The user can continue editing from the corrected report state

### Modeling-service request failure does not recreate the document instance - P1

- Perform a modeling-service request that fails in the documented non-crashed-instance path
	- Complete the error handling flow
		- The page keeps the previous mode and state
		- The document view displays normally after handling the error
		- The user can continue manipulations without recreating the document instance

### Prompt flow: cancel from prompt-related recovery returns to a safe authoring state - P1

- Trigger the documented prompt or reprompt recovery path
	- Choose the cancel path from the prompt flow
		- The prompt closes cleanly
		- The report stays available in a usable authoring state
		- The user is not forced back to Library home

## Integration - P1

### Recovery keeps the user inside the same report session - P1

- Trigger each supported Confluence-described recovery path in authoring mode
	- Complete the recovery flow
		- The user remains in the same report workflow
		- The application does not redirect to Library home
		- The recovered report can accept follow-up edits

### Recovery refreshes the document view without leaving an empty editor grid - P1

- Trigger a crashed-instance recovery scenario that returns the report to pause mode
	- Observe the recovered document view
		- The document view refreshes correctly
		- The editor does not remain as an empty report area
		- The recovered UI is stable and usable

## UX / Error Messaging - P2

### Error dialog uses the mapped user-facing message for exceeded-row-limit recovery - P2

- Trigger the documented "Maximum number of results rows per report exceeded the current limit" scenario
	- Review the error dialog shown to the user
		- The dialog uses a user-facing application/server error presentation
		- The message explains the row-limit problem in understandable language
		- The dialog does not require the user to reopen the report to continue

### Prompt apply error uses the documented Library Web prompt error handling path - P2

- Trigger the documented prompt-apply error scenario in authoring mode
	- Review the user-visible error handling result
		- The prompt-specific recovery path is used
		- The report is returned to prompt handling instead of a dead-end state
		- The user can continue the prompt workflow from the recovered state

### Recovery does not expose raw internal details in the end-user dialog - P2

- Trigger a supported Confluence-described recovery error
	- Review the user-visible error dialog
		- The dialog shows a user-facing title and message
		- Raw stack traces are not shown to the end user
		- Recovery messaging stays consistent with the documented error mapping intent

## Accessibility / Interaction - P2

### Error confirmation is operable and completes recovery - P2

- Trigger a supported error that shows an acknowledgment dialog
	- Dismiss the dialog through its visible confirmation action
		- The dialog closes successfully
		- Recovery continues to the documented target state
		- The report becomes usable again after the acknowledgment

## Compatibility / Scope Guard - P2

### Feature applies only to report authoring mode - P2

- Open the same report outside authoring mode
	- Reproduce an error that is outside the design scope
		- The new authoring recovery behavior is not incorrectly applied to non-authoring mode
		- No authoring-only recovery UI is shown in the out-of-scope mode
		- Out-of-scope behavior remains unchanged by this feature
