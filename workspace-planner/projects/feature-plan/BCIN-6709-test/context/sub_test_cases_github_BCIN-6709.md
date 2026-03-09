#
BCIN-6709_GitHub-domain sub test cases

## Scope & Evidence

- Source scope: GitHub artifacts only
- Primary inputs:
  - `context/qa_plan_github_BCIN-6709.md`
  - `context/qa_plan_github_traceability_BCIN-6709.md`
  - `context/github_diff_react-report-editor.md`
  - `context/github_pr_biweb_33041.json`
  - `context/github_pr_mojojs_8873.json`
  - `context/github_pr_server_10905.json`
  - `context/github_pr_web-dossier_22468.json`
  - `context/github_pr_productstrings_15008.json`
  - `context/github_pr_productstrings_15012.json`
  - `context/github_fetch_status_BCIN-6709.json`
- Constraint: three compare URLs remain unavailable, so this file stays within accessible GitHub evidence only
- Priority rule applied strictly:
  - `P0`: recovery correctness, undo/redo policy, prompt preservation, blocking-error refresh
  - `P1`: state consistency, rerender correctness, repeated recovery robustness
  - `P2`: copy, labels, presentation, low-risk regression

## EndToEnd - GitHub Domain

### Report Recovery In Library Authoring - P0

- Recover from a manipulation failure and continue editing in the same report

  - Open a report in Library authoring and perform a report manipulation that triggers the new recovery path

    - Wait for the recovery flow to finish without leaving the current authoring page

      - Perform another report action after recovery, such as refresh or a new manipulation

        - The report stays open in Library authoring, the report becomes usable again, and the next action can proceed successfully

- Recover from a blocking error through refresh without losing the report session

  - Open a report in Library authoring and trigger a blocking-error scenario that requires refresh-based recovery

    - Start the refresh path from the error state

      - Wait for the report to recover

        - The report refreshes into a usable state instead of forcing the user out of the report, and the session continues on the same report

### Undo / Redo Preservation Policy - P0

- Preserve undo/redo history for recoverable normal manipulations

  - Open a report and make a recoverable normal manipulation that creates undo history

    - Trigger the recovery flow

      - After recovery, use undo and redo

        - Previously valid undo/redo history is still available and behaves correctly after recovery

- Reset undo/redo history for designated modeling-style or analytical error classes

  - Open a report and trigger the recovery flow with an error class that should clear history

    - Wait for the report to recover

      - Check undo and redo availability

        - Undo/redo is reset when the error type requires reset, and the editor does not expose stale history

### Prompt Error Recovery - P0

- Return to prompt flow with previous answers preserved after prompt-answer failure

  - Open a prompt-driven report and enter prompt answers

    - Submit the answers in a way that triggers the prompt recovery path

      - Wait for the application to route back to the prompt experience

        - The prompt reopens with the previously entered answers preserved for correction or resubmission

- Continue report usage after recovering from prompt-answer failure

  - Recover from a prompt-answer failure back to the prompt

    - Correct or resubmit the prompt answers

      - Let the report load again

        - The report opens successfully and remains interactive for subsequent report actions

### Cross-Repo Recovery Handshake - P0

- Validate end-to-end recovery across client and server support

  - Trigger a recoverable report error in Library authoring

    - Let the application complete the recovery path

      - Perform a follow-up report operation

        - Recovery completes without dead-end behavior, and the follow-up operation confirms the server/client recovery contract works end to end

## State Consistency / Robustness

### Document Rerender After Recovery - P1

- Rerender the report view cleanly after recovery

  - Trigger the report recovery flow from a visible report with data on screen

    - Wait for the report view to come back

      - Inspect the recovered view and interact with it

        - The recovered report does not show a blank grid, stale canvas, or frozen view, and interactions work normally

- Preserve valid report state across recovery

  - Open a report with visible state such as current layout, template, or prompt-driven context

    - Trigger the recovery flow

      - Wait for recovery to finish

        - Expected state that should survive recovery remains intact, and the report does not reopen in an obviously reset or inconsistent state

### Repeated Failure / Recovery Cycles - P1

- Recover correctly across repeated failure cycles

  - Trigger a recoverable report error and let recovery finish

    - Trigger the same or another recoverable report error again

      - Recover a second time and continue working

        - Repeated recovery does not leave stale loading behavior, frozen commands, or inconsistent report state

- Keep command state consistent after recovery

  - Trigger report recovery and immediately perform another supported action after the report becomes interactive

    - Repeat with multiple action types such as manipulation and refresh

      - Observe command responsiveness after each recovery

        - Commands respond normally after recovery and do not behave as if a previous request is still stuck

### Blocking-Error Refresh Robustness - P1

- Use refresh-based recovery without entering a no-op or broken state

  - Trigger a blocking error and start the refresh recovery path

    - Wait for recovery to complete

      - Try a normal report interaction after recovery

        - The report exits the error state into a usable mode and does not remain stuck in a nonresponsive intermediate state

## Messaging / Presentation

### Recovery Messages And Statuses - P2

- Show recovery-related messaging correctly in Library-facing surfaces

  - Trigger a recoverable report error in a Library surface that exposes user messaging

    - Observe the message content shown during the error and recovery flow

      - Compare the visible wording with the new recovery behavior

        - The visible messaging matches the recovery path and does not show outdated or conflicting guidance

- Show recovery-related messaging correctly in report-editor surfaces

  - Trigger a recoverable report error in report editor

    - Observe statuses, labels, and action text shown during recovery

      - Let recovery finish and recheck the visible status area

        - Editor-side labels and statuses remain consistent with the recovery experience before and after recovery

### Prompt Recovery UI Presentation - P2

- Present prompt recovery links and actions correctly

  - Trigger a prompt-answer failure that routes back to the prompt experience

    - Inspect the recovery actions presented to the user

      - Use the visible recovery action to continue

        - Prompt recovery actions are present, usable, and aligned with the prompt recovery flow

- Remove outdated or irrelevant recovery actions from the error UI

  - Trigger a recovery-related error state that shows updated user actions

    - Inspect the available actions in the error UI

      - Compare them with the intended streamlined recovery path

        - Obsolete actions are not shown, and the remaining actions support the new recovery flow cleanly

## Traceability

| Test Area | Priority | GitHub Trace IDs |
|-----------|----------|------------------|
| Report recovery in Library authoring | P0 | XR-01, GH-01, GH-05, GH-06 |
| Blocking-error refresh recovery | P0/P1 | XR-02, GH-06, GH-07 |
| Undo / redo preservation policy | P0 | XR-03, GH-04, GH-05 |
| Prompt-answer recovery with preserved answers | P0 | XR-04, GH-08, GH-09 |
| Clean rerender and preserved usable state | P1 | XR-05, GH-01, GH-02, GH-03 |
| Recovery messages / statuses / links | P2 | XR-06, GH-10, GH-11 |

## GitHub-Only Coverage Notes

- This file intentionally avoids Jira/Confluence-only scenarios unless they are already reflected in GitHub evidence
- The strongest evidence comes from `react-report-editor` compare data plus PR metadata from `biweb`, `mojojs`, `server`, `web-dossier`, and `productstrings`
- Missing compare evidence for `biweb`, `mojojs`, and `web-dossier` means these cases should be treated as GitHub-supported but branch-incomplete coverage, not full repo-diff coverage
