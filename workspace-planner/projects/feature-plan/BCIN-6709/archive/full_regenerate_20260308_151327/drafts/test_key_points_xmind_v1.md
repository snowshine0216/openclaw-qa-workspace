# BCIN-6709 Test Key Points (XMind Draft v1)

- P0 Report error recovery without forced reopen
  - Trigger a recoverable report error after making visible edits
    - Expected: An error is shown but the report session is not abandoned automatically
    - Expected: The user can continue in the same session without manually reopening the report
    - Expected: Previously entered visible edits are not lost only because the error occurred
  - Continue editing after recovery
    - Expected: The editor returns to a usable state after recovery
    - Expected: The user can make another visible edit successfully after recovery

- P0 Prompt-answer recovery and reprompt continuity
  - Cancel a prompt answer and return to the prompt
    - Expected: Cancel returns the user to a usable prompt state
    - Expected: The user can re-answer the prompt and continue
  - Trigger a recoverable prompt execution failure
    - Expected: The error path is recoverable rather than a dead-end failure
    - Expected: The user can return to a usable report state after acknowledging the error
  - Trigger the same recoverable failure during reprompt
    - Expected: Reprompt uses the intended recovery action and returns the user to a usable state

- P0 Error dialog primary recovery behavior
  - Show an Application Error modal for a report open/execute/type failure
    - Expected: The dialog title and summary clearly communicate the failure
    - Expected: OK is visible as the primary acknowledgment action
    - Expected: Show Details is available in the collapsed state
  - Show a Server Error modal for dataset or prompt-report failure
    - Expected: The dialog title and summary communicate the dataset/report failure clearly
    - Expected: OK is visible as the primary acknowledgment action
  - Click OK from a recoverable error dialog
    - Expected: The dialog closes and returns the user to the intended safe recovery destination
    - Expected: The user is not sent to an unrelated page or blocked state

- P0 Details toggle behavior in error dialogs
  - Expand error details with Show Details
    - Expected: Additional technical detail text becomes visible
    - Expected: The toggle label changes to Hide details
    - Expected: OK remains visible and usable
  - Collapse the expanded details area
    - Expected: The dialog returns to condensed layout
    - Expected: The toggle label changes back to Show Details

- P0 Document view visibility during errors
  - Trigger an error while document view is visible
    - Expected: The error popup appears without replacing the document view with a blank or missing page
    - Expected: The document view remains visible behind or around the popup
  - Dismiss the error and resume
    - Expected: The document view remains available after the error UI is dismissed
    - Expected: The user can perform at least one basic follow-up action in the same session

- P0 Data Pause Mode recovery
  - Trigger the recoverable report execution error dialog in Report Editor
    - Expected: The dialog title is Report Cannot Be Executed.
    - Expected: The message tells the user to click OK to return to Data Pause Mode
  - Click OK from that dialog
    - Expected: The user is returned to Data Pause Mode
    - Expected: The editor is not left in an unusable blocked state

- P0 Undo/redo coherence after recoverable recreation
  - Make visible edits, then trigger recoverable report recreation
    - Expected: Undo and redo are not cleared unnecessarily during the recoverable path
    - Expected: History remains understandable and coherent after recovery
    - Expected: Using undo/redo does not break the recovered report state

- P1 Non-truncation failures keep distinct handling
  - Trigger a prompt-related failure that is not the truncation/maximum-rows recovery case
    - Expected: The UI does not incorrectly use the truncation-specific recovery path
    - Expected: The feature does not over-apply the new recovery model to unrelated failures

- P1 Send Email visibility rules
  - Compare Application Error and Server Error variants
    - Expected: Send Email is shown only in the dialog variant where the design includes it
    - Expected: Send Email does not replace or hide OK
  - Trigger the recoverable truncation-related path
    - Expected: The dialog does not expose the generic Send Email action for that recoverable flow

- P1 Error copy accuracy
  - Trigger the updated dataset failure path in Library or related web surface
    - Expected: The visible message reads One or more datasets failed to load.
    - Expected: Older wording is not shown in that updated path
  - Trigger the recoverable report execution error in Report Editor
    - Expected: The title/body copy matches the new recovery wording and directions

- P1 Pause/data-retrieval switching around recovery
  - Encounter an error during pause or data retrieval transitions
    - Expected: The visible state changes remain understandable to the user
    - Expected: The UI does not remain indefinitely stuck in pause or data retrieval after recovery should be possible
    - Expected: The report returns to a valid usable state in the same session

- P1 Recovered report state coherence
  - Make a visible report setting or layout change before triggering recovery
    - Expected: The recovered report returns in a visibly coherent state
    - Expected: Visible report settings, layout, and panels do not appear mismatched after recovery
  - Observe the report area while recovery completes
    - Expected: Recovery does not show repeated reload flicker or duplicate recovery screens

- P1 Cross-surface consistency
  - Compare equivalent recoverable failures between Library/web and Report Editor
    - Expected: Each surface shows the intended product-specific copy for its context
    - Expected: No surface regresses to outdated generic handling while another surface uses the new recovery UX

- P1 Long details readability and layout
  - Open an expanded error dialog with long technical details
    - Expected: The details remain readable and visually contained within the dialog
    - Expected: Content does not overlap title, summary, toggle, or action buttons
    - Expected: Action buttons remain visible and reachable

- P2 Redo behavior after recovery
  - Use redo after recovering from a report error
    - Expected: Redo behavior remains understandable and consistent with the recovered state
    - Expected: Redo does not place the report into a broken or confusing state

- P2 Cross-variant modal structure consistency
  - Compare Application Error and Server Error dialog layouts
    - Expected: Title, summary, details area, and action area follow a consistent modal pattern
    - Expected: Users can recognize the dialogs as the same family of recovery experience across failure types
