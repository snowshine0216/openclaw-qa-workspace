# BCIN-6709 — Jira-Derived Sub Test Cases

## Scope

- Source limited to Jira-backed artifacts: `context/jira_issue_BCIN-6709.md`, `context/jira_related_issues_BCIN-6709.md`, `context/jira_comment_pr_links_BCIN-6709.md`, `context/jira_issue_BCEN-4129.md`, `context/jira_issue_BCEN-4843.md`, `context/jira_issue_BCIN-6485.md`, `context/jira_issue_BCIN-6574.md`, `context/jira_issue_BCIN-6706.md`, `context/jira_issue_BCIN-7543.md`, `context/jira_issue_BCIN-974.md`, and `context/qa_plan_atlassian_BCIN-6709.md`
- Covers only user-visible behaviors explicitly stated or summarized from Jira / Atlassian evidence
- Excludes GitHub implementation details and Confluence-only design behaviors unless the Atlassian summary explicitly restates them

## Functional - P0

### Report execution error no longer forces the author out of report editing - P0

- Open a report in Library authoring mode and make one or more unsaved design changes
	- Trigger a report execution error called out in Jira, such as exceeding the maximum row limit
		- Dismiss the error dialog
			- The user remains inside the same report editing workflow
			- The page does not redirect to Library home
			- The report remains available for continued editing

### Previously applied report edits are preserved after an execution failure - P0

- Open a report in Library authoring mode
	- Add or modify report design elements such as filters or objects
		- Switch to running mode or click the action that executes the report and trigger the documented failure
			- Return to the editable report state after dismissing the error
				- The previously made design changes are still present
				- The user does not need to reopen the report to recover those edits

### Row-limit execution failure shows an actionable error and allows continued authoring - P0

- Open a report in Library authoring mode with data conditions that reproduce the Jira-described row-limit failure
	- Execute the report until the error appears: maximum number of result rows exceeded the current limit
		- Dismiss the error dialog
			- The error message clearly indicates the row-limit problem
			- The author can continue working on the report to narrow data, such as by adjusting filters
			- The editor does not become stuck in perpetual loading

### Error recovery supports continued report manipulation after the first failure - P0

- Recover from any Jira-described report error in authoring mode
	- Perform another edit action, such as adding or removing a report object or changing a filter
		- The new manipulation succeeds or returns a normal validation error
			- The editor remains responsive after the follow-up action
			- The report does not require refresh or reopen before the next manipulation

## Functional Variants - P1

### Cancel is not the only way out after an error in authoring mode - P1

- Trigger a report authoring error that previously left the page loading forever with a visible cancel option
	- Observe the recovery options after dismissing the error message
		- The user has a path to continue editing without being forced to cancel out of the report
		- If cancel is present, using no action other than dismissing the error does not trap the user in a dead-end state

### View-filter validation error does not freeze the report editor - P1

- Open a report in Library authoring mode and resume data retrieval
	- Add an attribute view filter and apply it
		- Remove the same attribute from the report, reproducing the Jira validation error that it is used in a view filter
			- The validation message is shown
			- The grid does not remain stuck on a loading indicator afterward
			- The author can continue editing or saving the report after the error

### Pause-data-retrieval path does not block further interaction forever - P1

- Open a report in Library authoring mode that cannot be executed because of the documented cartesian join or similar execution error
	- Dismiss the execution error
		- Click "Pause Data Retrieval"
			- The page does not remain in endless loading
			- User interaction remains available after the pause action
			- The report can still be edited without refreshing the full page

### MDX or engine error does not cause unavoidable loss of authoring progress - P1

- Create or edit a report in a scenario that reproduces a Jira-described MDX or engine-side error
	- Trigger the error from authoring workflow
		- Review the post-error editor state
			- The UI is not reduced to a cancel-only dead end
			- The user has a way to recover editing context without losing all progress

### Similar failure patterns are handled consistently across common report-error scenarios - P1

- Reproduce at least these Jira-backed error families in Library authoring mode: row-limit failure, view-filter removal validation failure, and non-executable report plus pause-data-retrieval flow
	- Recover from each error
		- The report remains recoverable for continued authoring in each scenario
		- None of the scenarios leave the editor permanently hung
		- None of the scenarios force immediate return to Library home

## Error Messaging - P1

### Error details are available when report execution fails - P1

- Trigger a report execution failure in Library like the Jira-described row-limit case
	- Inspect the error dialog presented to the user
		- Error details are shown consistently enough for the user to understand the cause
		- The dialog does not omit the detail section intermittently for the same failure pattern
		- The displayed details help the author decide how to continue editing

### Error message helps the user avoid or fix the failure - P1

- Trigger a report error while authoring in Library
	- Review the user-facing message shown after the failure
		- The message explains what caused the error in understandable terms
		- The message supports corrective action, such as reducing rows or revising the design
		- The user can act on that information without reopening the report from scratch

## Workflow / Usability - P2

### Report remains editable after repeated execution failures in the same session - P2

- Open a report in authoring mode and make a change
	- Trigger a Jira-backed execution failure, recover, then trigger a second failure of the same type
		- The editor still remains responsive after each recovery
		- Unsaved authoring progress from before the latest failure is not unexpectedly discarded

### Continued editing flow supports iterative trial-and-error authoring - P2

- Open a report early in creation when strict filters are not yet defined
	- Run the report, hit an execution error, revise the design, and run again
		- The report author can continue the iterative edit-and-check workflow described in Jira
		- The application does not punish exploratory authoring by forcing a restart of the report session

### Cancel action does not become a destructive-only escape from a broken state - P2

- Trigger a Jira-described error scenario that historically showed a cancel action while the report was stuck
	- Observe the editor before using cancel
		- The report has a recoverable usable state without mandatory cancellation
		- If cancel is used, it behaves as an explicit user choice rather than the only path left after the error

## Scope Guard - P2

### Behavior applies to Library report authoring scenarios called out in Jira - P2

- Reproduce the recovery flow in Library report authoring mode for the Jira-backed scenarios
	- Compare with a non-authoring or out-of-scope report viewing flow
		- The improved recovery is verified on the authoring workflows explicitly described in Jira
		- No unsupported parity or non-Jira behavior is assumed beyond those stated scenarios
