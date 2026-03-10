# BCIN-6709_Improve_Report_Error_Handling_for_Continued_Editing

## Functional - P1 ([MAIN CATEGORY WITH PRIORITY])

### Error Recovery — Pause Mode - P1 ([SUB-CATEGORY WITH PRIORITY])

- Trigger max rows error in pause mode [(STEP)]
	- Click "Resume Data Retrieval"
		- Error dialog appears
			- Click "OK"
				- Dialog closes [(EXPECTED RESULT)]
				- Report returns to pause mode [(EXPECTED RESULT)]
				- Grid shows pause-mode layout (no stale running rows) [(EXPECTED RESULT)]
				- User can continue editing [(EXPECTED RESULT)]

- Trigger SQL failure error in running mode [(STEP)] - P1
	- Report crashes during rebuildDocument
		- Error dialog shown
			- Click "OK"
				- Report returns to pause mode [(EXPECTED RESULT)]
				- Previous manipulations preserved [(EXPECTED RESULT)]
				- Undo button enabled if normal manipulation [(EXPECTED RESULT)]

- Trigger Cartesian join error (add conflicting attribute) [(STEP)] - P1
	- Modeling service succeeds
		- rebuildDocument fails
			- Error dialog shown
				- Click "OK"
					- Report in pause mode [(EXPECTED RESULT)]
					- Attribute added but not executed [(EXPECTED RESULT)]
					- User can undo the last manipulation [(EXPECTED RESULT)]

### Undo/Redo State Management - P1

- Normal manipulation error occurs [(STEP)]
	- Recovery triggered
		- Report returns to pause mode
			- Undo button enabled [(EXPECTED RESULT)]
			- Previous successful operations in undo history [(EXPECTED RESULT)]
			- Redo stack intact [(EXPECTED RESULT)]

- Modeling service manipulation error occurs [(STEP)] - P1
	- Advanced Properties modified
		- rebuildDocument fails
			- Recovery triggered
				- Undo button disabled [(EXPECTED RESULT)]
				- Redo button disabled [(EXPECTED RESULT)]
				- Command history cleared [(EXPECTED RESULT)]

### Prompt Error Handling - P1

- Answer prompt success → getInstance fails [(STEP)]
	- Prompt dialog shown with previous answers
		- User clicks "Apply"
			- Error occurs after prompt answer
				- Back to prompt dialog [(EXPECTED RESULT)]
				- Previous answers preserved in form [(EXPECTED RESULT)]
				- User can modify answers and retry [(EXPECTED RESULT)]

- Cancel prompt during error flow [(STEP)] - P1
	- Prompt error occurs
		- Prompt dialog shown
			- User clicks "Cancel"
				- Prompt dismissed [(EXPECTED RESULT)]
				- Report remains in pause mode [(EXPECTED RESULT)]

## Integration - P2 ([MAIN CATEGORY WITH PRIORITY])

### Cross-Repo Error Propagation - P2

- Error originates in biweb API [(STEP)]
	- reCreateInstance called with noActionMode=true
		- Response propagates to mojo
			- Reaches react-report-editor
				- Error dialog shown [(EXPECTED RESULT)]
				- User stays in report view [(EXPECTED RESULT)]
				- No navigation to Library home [(EXPECTED RESULT)]

### Request Queue Cleanup - P2

- Error occurs during active manipulation [(STEP)]
	- cancelRequests() called on mojo serverProxy
		- Pending requests cleaned up
			- holdRequests flag cleared [(EXPECTED RESULT)]
			- Subsequent requests proceed normally [(EXPECTED RESULT)]
			- No orphaned network requests [(EXPECTED RESULT)]

### Document View Refresh - P2

- Recovery completes [(STEP)]
	- reRenderDocView flag set to true
		- Document view useEffect triggered
			- Grid re-renders without full page reload [(EXPECTED RESULT)]
			- No empty grid state [(EXPECTED RESULT)]
			- Correct pause-mode layout displayed [(EXPECTED RESULT)]

## UX - P2

### Error Dialog UI - P2

- Error recovery in progress [(STEP)]
	- Error catcher component mounts
		- Loading overlay shown (if long recovery)
			- Recovery completes
				- Overlay dismissed [(EXPECTED RESULT)]
				- Clear error message displayed [(EXPECTED RESULT)]
				- Error severity styling correct (info/warning/error) [(EXPECTED RESULT)]

### Error Message Clarity - P2

- Max rows error shown [(STEP)]
	- Message includes actionable guidance
		- User understands how to avoid error [(EXPECTED RESULT)]
		- No internal error codes exposed [(EXPECTED RESULT)]

## Edge Cases - P3

### Rapid Sequential Errors - P3

- Trigger first error [(STEP)]
	- Recovery starts
		- Trigger second error immediately
			- Second error queued [(EXPECTED RESULT)]
			- First recovery completes [(EXPECTED RESULT)]
			- Second error shown after first [(EXPECTED RESULT)]
			- No race condition [(EXPECTED RESULT)]

### Error During Document View Re-Render - P3

- Recovery sets reRenderDocView flag [(STEP)]
	- Re-render begins
		- Error occurs mid-render
			- Graceful fallback [(EXPECTED RESULT)]
			- No white screen of death [(EXPECTED RESULT)]
			- User informed of critical error [(EXPECTED RESULT)]

### Network Timeout During Recovery API Call - P3

- Error triggers recovery [(STEP)]
	- reCreateInstance API called
		- Network timeout (>30s)
			- Timeout error shown [(EXPECTED RESULT)]
			- User can retry or exit [(EXPECTED RESULT)]
			- No indefinite loading state [(EXPECTED RESULT)]

### Error Immediately After Page Load - P3

- Fresh report opened [(STEP)]
	- No undo history exists
		- First manipulation fails
			- Recovery completes [(EXPECTED RESULT)]
			- Undo button disabled (correct, no history) [(EXPECTED RESULT)]
			- User can continue manipulations [(EXPECTED RESULT)]

### Recovery When Unsaved Property Changes Exist - P3

- User modifies report properties [(STEP)]
	- Properties not yet saved
		- Manipulation error occurs
			- Recovery triggered
				- Property changes preserved in UI state [(EXPECTED RESULT)]
				- User can save properties after recovery [(EXPECTED RESULT)]

## Security - P3

### Error Details Exposure - P3

- Error occurs in production mode [(STEP)]
	- Error dialog displayed
		- No stack traces visible [(EXPECTED RESULT)]
		- No internal class/method names exposed [(EXPECTED RESULT)]
		- Only user-friendly error message shown [(EXPECTED RESULT)]

## Platform - P2

### Browser Compatibility - P2

- Error recovery in Chrome [(STEP)]
	- Recovery completes successfully [(EXPECTED RESULT)]

- Error recovery in Firefox [(STEP)]
	- Recovery completes successfully [(EXPECTED RESULT)]

- Error recovery in Safari [(STEP)]
	- Recovery completes successfully [(EXPECTED RESULT)]

- Error recovery in Edge [(STEP)]
	- Recovery completes successfully [(EXPECTED RESULT)]

### Error Code Mapping Consistency - P2

- Error codes from web-dossier/ErrorObjectTransform [(STEP)]
	- toHex() and hexToSignedInt32() functions called
		- Correct error type identified [(EXPECTED RESULT)]
		- No JavaScript type conversion errors [(EXPECTED RESULT)]
		- Prompt errors correctly categorized [(EXPECTED RESULT)]

## Upgrade / Compatibility - P2

### Consumption Mode Unaffected - P2

- Open report in consumption mode [(STEP)]
	- Trigger error
		- Existing error handling still works [(EXPECTED RESULT)]
		- No regression in consumption behavior [(EXPECTED RESULT)]

### Deployment Types - P2

- Deploy to MCE [(STEP)]
	- Error recovery works [(EXPECTED RESULT)]

- Deploy to MEP [(STEP)]
	- Error recovery works [(EXPECTED RESULT)]

- Deploy to MCG [(STEP)]
	- Error recovery works [(EXPECTED RESULT)]

- Deploy to MCP [(STEP)]
	- Error recovery works [(EXPECTED RESULT)]

## AUTO: Automation-Only Tests

### Unit Tests - P1

- recoverReportFromError() function [(TEST)]
	- Returns correct payload for different error types
	- Handles NoActionMode flag correctly
	- isReCreateReportInstance flag lifecycle correct

- reCreateReportInstanceThunkHelper Redux thunk [(TEST)]
	- Dispatches correct actions
	- Handles async recovery
	- Error boundary in thunk

- cmdMgr.reset() conditional logic [(TEST)]
	- isReCreateReportInstance flag read correctly
	- Reset skipped when flag is true
	- Reset executes when flag is false

### Integration Tests - P1

- biweb reCreateInstance API [(TEST)]
	- Returns stid=-1 with noActionMode=true
	- Prompt resolution skipped when resolveExecution=true
	- NoActionMode configuration applied correctly

- mojo cancelRequests() [(TEST)]
	- existingRequests array cleared
	- holdRequests flag reset
	- No pending XHR after call

### API Contract Tests - P2

- reCreateInstance endpoint [(TEST)]
	- Accepts stid=-1 parameter
	- Returns correct error structure
	- NoActionMode flag in response

- rebuildDocument manipulation [(TEST)]
	- Fails with expected error codes
	- Error structure matches contract
