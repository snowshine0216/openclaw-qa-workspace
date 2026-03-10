# BCIN-6709 Test Key Points (XMind Draft v2)

- P0 Report recovery without manual reopen
  - Trigger a report execution or editing error during active report work
    - Expected: An error is shown to the user
    - Expected: The user is given an in-product recovery path instead of being forced to manually close and reopen the report
  - Use the offered recovery action
    - Expected: The user is returned to a recovered report flow that can continue from the product UI

- P0 Prompt error return path
  - Trigger a recoverable prompt-related failure while submitting prompt answers
    - Expected: The failure is surfaced through the product error UI
    - Expected: The dialog presents the intended recovery action for the prompt flow
  - Use the recovery action
    - Expected: The user is returned to the prompt/report flow instead of a dead-end blocked state

- P0 Reprompt error return path
  - Trigger the same class of recoverable failure during a reprompt flow
    - Expected: The failure is surfaced through the product error UI
    - Expected: The recovery actioning is correct for reprompt, not incorrectly reused from a different flow
  - Use the recovery action
    - Expected: The user is returned to the reprompt/report flow defined by the product

- P0 Truncation / maximum-rows recovery path
  - Trigger the truncation or maximum-rows failure path in a prompted report flow
    - Expected: The UI uses the dedicated recoverable handling for that failure class
    - Expected: The dialog does not expose the stale generic escalation path for that recoverable case
    - Expected: The dialog shows the intended return/recovery action for that path

- P0 Report Editor return to Data Pause Mode
  - Trigger the recoverable report execution error in Report Editor
    - Expected: The error dialog communicates the execution failure and visible recovery direction
  - Click OK from that error dialog
    - Expected: The user is returned to Data Pause Mode
    - Expected: The editor is not left in a blocked error state after the dialog is dismissed

- P0 Pause / data-retrieval recovery switching
  - Encounter an error while the report is moving through pause or data-retrieval related states
    - Expected: The visible state does not remain indefinitely stuck in an incorrect waiting state
    - Expected: After recovery, the user can proceed through the in-product recovery path without manual reopen

- P0 Error dialog copy matches failure type
  - Trigger visible error variants for different failure causes
    - Expected: The title and summary shown to the user match the failure type being surfaced
    - Expected: The shared dialog pattern does not show misleading summary text for the wrong failure cause

- P0 Undo/redo behavior remains coherent after recovery
  - Make visible edits, then trigger a recoverable report error and recover through the product path
    - Expected: Undo/redo behavior after recovery matches the intended design for that flow
    - Expected: Using undo or redo after recovery does not leave the report in an inconsistent or confusing state

- P1 Document view continuity during error handling
  - Trigger an error while document view is open
    - Expected: Error handling does not replace the report experience with an obviously broken blank/missing view
  - Dismiss the error through the offered product action
    - Expected: The user can still navigate within the report experience from the visible UI

- P1 Details disclosure behavior
  - Open an error dialog that exposes details
    - Expected: Show Details expands the details area
    - Expected: Hide details collapses it back
    - Expected: Primary actions remain visible while details are expanded

- P1 Primary action clarity and keyboard reachability in the modal
  - Open the error dialog in collapsed state
    - Expected: Initial focus lands inside the modal
    - Expected: The primary acknowledgment action is visually clear
  - Navigate the dialog by keyboard
    - Expected: The user can reach the details toggle, OK, and any visible secondary action
  - Expand details and continue keyboard navigation
    - Expected: The primary action remains visually clear and reachable after expansion

- P1 Send Email visibility by error variant
  - Compare visible error dialog variants that include different action sets
    - Expected: Send Email appears only in the variant where the design includes it
    - Expected: Send Email does not replace or hide the primary OK acknowledgment action
  - Trigger the recoverable truncation-related path
    - Expected: That recoverable path does not show the stale generic Send Email action

- P1 Updated error copy for dataset-load failures
  - Trigger the dataset-load failure path in the relevant Library/web surface
    - Expected: The user sees the updated dataset failure wording for that path
    - Expected: The wording shown is consistent with the configured product strings for that surface

- P1 Localization hookup for changed strings
  - Verify the updated error strings in English
    - Expected: The changed recovery/error strings are displayed in English in the affected surfaces
  - If a non-English locale is available, switch locale and repeat
    - Expected: The same recovery/error surfaces display localized strings rather than missing, broken, or fallback keys

- P1 Non-truncation failure keeps distinct handling
  - Trigger a prompt/report failure that is not the truncation or maximum-rows case
    - Expected: The UI does not incorrectly use the truncation-specific recovery model
    - Expected: The visible handling remains appropriate for the non-truncation failure type

- P1 Non-recovery flows still reset undo/redo when intended
  - Use a non-recovery action path that should reset history
    - Expected: Undo/redo reset behavior still follows the intended design for that non-recovery path
    - Expected: The recovery-focused changes do not accidentally preserve history in flows that should reset it

- P1 BIWeb XML command <os 8 traceability check
  - Execute the recovery scenario associated with the BIWeb-side recreate path
    - Expected: The end-user recovery flow tied to that path is covered by an observable recovery outcome in the product
    - Expected: The recovery path completes without leaving the user stranded in an error-only state

- P2 Long-details layout stability
  - Open an expanded error dialog with long technical details
    - Expected: Long details remain readable and visually contained within the dialog
    - Expected: Content does not overlap action buttons or key summary text

- P2 Cross-variant modal structure consistency
  - Compare Application-style and Server-style error dialog layouts where available
    - Expected: Title, summary, details area, and actions follow a recognizable shared pattern
    - Expected: Users can identify the dialogs as the same family of recovery UI
