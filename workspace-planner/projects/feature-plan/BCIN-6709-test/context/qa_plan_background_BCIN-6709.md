# Background Context: BCIN-6709 — Improve Report Error Handling

## Why this feature exists

According to `context/jira_issue_BCIN-6709.md`, the current report authoring experience is fragile when report errors occur:
- users must exit and reopen the report to continue working
- previous editing work is lost
- customer complaints have increased, including at least one escalation

This makes BCIN-6709 a high-priority usability and recovery feature rather than a net-new authoring capability.

## Planning-relevant scope

Based on `context/qa_plan_atlassian_BCIN-6709.md`, the refreshed design scope is:
- **In scope:** report **authoring mode** error handling and recovery
- **Out of scope:** report **consumption mode**
- **Primary goal:** allow users to continue editing after certain report/manipulation failures
- **Recovery goal:** recreate the server-side instance when needed and return the user to a usable state instead of forcing exit

## Core recovery expectations

The latest Atlassian and GitHub summaries align on four material recovery expectations:

1. **Pause-mode recovery**
   - If "Resume Data Retrieval" fails, the user should return to **pause mode** instead of being stuck or redirected away.

2. **Running-mode recovery**
   - If a report manipulation crashes the instance during editing, the system should recreate the instance and keep the user in a recoverable editing flow.

3. **Prompt recovery**
   - If prompt-answer application fails in authoring mode, the user should return to the **prompt flow** with previous prompt answers preserved.

4. **User-visible guidance**
   - The product should show a clear error message that explains the failure and helps the user continue or avoid repeating it.

## State-handling rules that matter for QA

A major planning distinction in the refreshed artifacts is that not all failures should recover the same way.

### Normal manipulation failures
Examples in the summaries include regular editing/manipulation actions that fail after the report is already open.

Expected QA outcome:
- instance is recreated if needed
- user remains able to continue editing
- **undo/redo should be preserved**

### Modeling service manipulation failures
Examples in the summaries include advanced property changes or structural/report-definition updates that later fail during rebuild/update processing.

Expected QA outcome:
- instance is recreated or reverted to a safe state
- user returns to a usable editing state, often **pause mode**
- **undo/redo should be cleared/reset** because the report structure changed

### Non-crashing modeling-service errors
`context/qa_plan_atlassian_BCIN-6709.md` also identifies a separate class of modeling-service failures where the document instance is **not** crashed.

Expected QA outcome:
- user can continue manipulating the report
- grid/editor remains usable
- no broken recovery flow should be triggered unnecessarily

## Material technical behaviors surfaced by the rerun

These items are important because they explain what QA should observe externally, even when the implementation lives across multiple repos.

### Request queue cleanup
The refreshed artifacts call out a prior stuck state where pending request flags could block future actions after an error.

QA implication:
- after recovery, subsequent user actions should send requests normally
- the editor should not remain hung with no further interaction possible

### Undo/redo branch control
The rerun consistently identifies a recovery flag used to distinguish "recreate instance" recovery from other flows.

QA implication:
- verify undo/redo behavior separately for:
  - normal manipulation failure
  - modeling-service rebuild/update failure

### Document/grid re-render protection
The refreshed summaries explicitly mention a fix for an empty grid / bad re-render state after revert.

QA implication:
- after recovery, the document/report view should render normally
- recovery must not leave the main editor blank or partially refreshed

### No forced navigation away
The rerun identifies server/client changes intended to stop the app from forcing the user away from the report after a handled error.

QA implication:
- recovery should keep the user inside the report authoring workflow
- unexpected navigation back to Library home is a regression

## Related issue context to preserve in planning

The rerun artifacts connect BCIN-6709 to concrete issue-driven scenarios:
- `BCEN-4843` — end-user continued operation after report error
- `BCIN-6706` — SQL failure / continue editing scenario
- `BCIN-6485` — remove attribute used in filter causing hang / unusable editor
- `BCIN-974` — pause/partial retrieval path that blocks further interaction
- `BCIN-7543` — development story for the implementation work
- dependency noted in summaries: `F43454` for prompt-answer cancellation/back-to-prompt flow

These linked issues are useful as source scenarios for regression and edge-case coverage.

## Repositories/components implicated by the rerun

The refreshed GitHub summary shows the behavior spans multiple layers:
- `react-report-editor` — recovery flow, view state, undo/redo handling
- `mojojs` — command manager/request cleanup behavior
- `biweb` — server-side recovery support
- `web-dossier` — prompt-error handling in authoring-related flows

Planning implication:
- this is a **cross-repo integration feature**, so QA should favor end-to-end behavior validation over isolated UI-only checks

## Design input availability

The current artifact set includes:
- Jira-derived summaries
- GitHub-derived summaries and traceability
- related-issue context

The current artifact set does **not** include a usable Figma design artifact:
- `context/figma_link_BCIN-6709.md` = `NO_FIGMA_LINK_FOUND_IN_CURRENT_JIRA_RAW_SCAN`

Planning implication:
- UI expectations should be taken from implementation/design-summary text and observed behavior, not from a Figma spec

## Sources used for this refresh

- `context/jira_issue_BCIN-6709.md`
- `context/jira_related_issues_BCIN-6709.md`
- `context/qa_plan_atlassian_BCIN-6709.md`
- `context/qa_plan_github_BCIN-6709.md`
- `context/qa_plan_github_traceability_BCIN-6709.md`
- `context/figma_link_BCIN-6709.md`
