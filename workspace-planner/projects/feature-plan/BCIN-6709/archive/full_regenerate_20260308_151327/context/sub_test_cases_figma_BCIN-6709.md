# Figma-only Sub Test Cases: BCIN-6709

## Scope
Derived only from visible UI evidence in `qa_plan_figma_BCIN-6709.md`.

## Test Cases

### TC-FIGMA-01 — Application Error modal shows clear failure summary
- **Priority:** P0
- **Coverage:** application error modal behavior
- **Precondition:** A report or document open attempt reaches the visible application-error state.
- **Steps:**
  1. Open the item until the error modal appears.
  2. Observe the modal title.
  3. Observe the summary message shown in the modal body.
  4. Observe the available action buttons/links.
- **Expected Result:**
  - A blocking error modal is shown.
  - The title reads **Application Error**.
  - A clear summary message is visible, such as **Report cannot be opened**, **Report Cannot Be Executed**, or **This report type is not supported**.
  - **OK** is visible.
  - A details toggle is visible in the collapsed state as **Show Details**.

### TC-FIGMA-02 — Server Error modal shows dataset failure summary
- **Priority:** P0
- **Coverage:** server error modal behavior
- **Precondition:** A report or document load attempt reaches the visible server-error state.
- **Steps:**
  1. Open the item until the error modal appears.
  2. Observe the modal title.
  3. Observe the summary message shown in the modal body.
  4. Observe the available actions.
- **Expected Result:**
  - A blocking error modal is shown.
  - The title reads **Server Error**.
  - The summary message explains that one or more datasets failed to load or are not loaded for the item.
  - **OK** is visible.
  - In the expanded design variant, **Send Email** is visible as a secondary action.

### TC-FIGMA-03 — Show Details expands the error modal
- **Priority:** P0
- **Coverage:** show details behavior
- **Precondition:** An error modal is displayed in collapsed state with **Show Details** visible.
- **Steps:**
  1. In the error modal, click **Show Details**.
  2. Observe the body area of the modal.
  3. Observe the details toggle label after expansion.
  4. Confirm the primary action remains visible.
- **Expected Result:**
  - The modal changes from condensed to expanded state.
  - Additional technical detail text becomes visible.
  - The toggle label changes from **Show Details** to **Hide details**.
  - **OK** remains available while details are open.

### TC-FIGMA-04 — Hide details returns the modal to condensed state
- **Priority:** P0
- **Coverage:** hide details behavior
- **Precondition:** An error modal is displayed in expanded state with **Hide details** visible.
- **Steps:**
  1. In the expanded error modal, click **Hide details**.
  2. Observe the modal body.
  3. Observe the details toggle label after collapse.
- **Expected Result:**
  - The expanded technical details are hidden.
  - The modal returns to its condensed layout.
  - The toggle label switches back to **Show Details**.
  - **OK** remains visible and usable.

### TC-FIGMA-05 — Expanded details are readable and contained within the dialog
- **Priority:** P0
- **Coverage:** detail readability and layout
- **Precondition:** An error modal is displayed in expanded state.
- **Steps:**
  1. Expand the modal details.
  2. Review the visible technical text area.
  3. Observe the layout of the text area relative to the modal boundaries and action buttons.
- **Expected Result:**
  - The expanded technical text is readable as displayed.
  - The text remains visually contained within the modal.
  - The layout does not overlap the title, summary, toggle, or action buttons.
  - Action buttons remain visible and reachable in the expanded state.

### TC-FIGMA-06 — Long technical details do not break modal layout
- **Priority:** P1
- **Coverage:** long detail readability/layout
- **Precondition:** An error modal displays a long technical detail message in expanded state.
- **Steps:**
  1. Open an error modal variant with long technical details.
  2. Expand details if needed.
  3. Observe the visible layout and spacing of the modal content.
- **Expected Result:**
  - Long technical text remains readable.
  - Content does not appear clipped, overlapped, or visually broken.
  - **OK** remains visible.
  - If shown in this variant, **Send Email** remains visible.

### TC-FIGMA-07 — Prompt-report row-limit failure exposes detail text in Server Error modal
- **Priority:** P0
- **Coverage:** server error details for prompt report failure
- **Precondition:** The visible server-error variant for prompt-report failure is displayed.
- **Steps:**
  1. Open the prompt-report failure state.
  2. Observe the summary text in the modal.
  3. Expand details if the modal is not already expanded.
  4. Review the visible technical detail text.
- **Expected Result:**
  - The modal uses the **Server Error** pattern.
  - The summary communicates dataset/report load failure at a high level.
  - Expanded details expose the visible limit-related technical message.
  - The dialog still provides **OK** as the primary acknowledgment path.

### TC-FIGMA-08 — OK dismisses Application Error modal through the intended recovery flow
- **Priority:** P0
- **Coverage:** OK flow, recovery destination expectation
- **Precondition:** An **Application Error** modal is visible.
- **Steps:**
  1. Open a report/document until the **Application Error** modal appears.
  2. Click **OK**.
  3. Observe where the user lands after the modal closes.
- **Expected Result:**
  - The modal closes after **OK** is clicked.
  - The user is returned to the intended safe recovery state.
  - The user is not unexpectedly taken to an unrelated destination such as library home or pause mode unless that is the intended design for that entry path.

### TC-FIGMA-09 — OK dismisses Server Error modal through the intended recovery flow
- **Priority:** P0
- **Coverage:** OK flow, recovery destination expectation
- **Precondition:** A **Server Error** modal is visible.
- **Steps:**
  1. Open a report/document until the **Server Error** modal appears.
  2. Click **OK**.
  3. Observe where the user lands after the modal closes.
- **Expected Result:**
  - The modal closes after **OK** is clicked.
  - The user returns to the intended recovery destination for that flow.
  - The user is not unexpectedly dropped into an unrelated page or state.

### TC-FIGMA-10 — Recovery destination is consistent with the user’s current context
- **Priority:** P1
- **Coverage:** recovery destination expectations
- **Precondition:** Error states can be reached from different visible contexts, such as report/document open flow or prompt-report flow.
- **Steps:**
  1. Reach an error modal from one available entry context.
  2. Click **OK** and note the landing destination.
  3. Repeat from another available entry context.
  4. Compare the observed recovery destinations.
- **Expected Result:**
  - Each error flow returns the user to an expected safe state for that context.
  - Recovery behavior is understandable and does not feel random.
  - If behavior differs by entry context, the destination still aligns with the context the user came from.

### TC-FIGMA-11 — Send Email is visible only in the intended Server Error variant
- **Priority:** P1
- **Coverage:** send email visibility
- **Precondition:** Multiple visible error modal variants are available for comparison.
- **Steps:**
  1. Open the visible **Application Error** variant.
  2. Observe whether **Send Email** is shown.
  3. Open the visible **Server Error** variant that includes the secondary action.
  4. Observe whether **Send Email** is shown.
- **Expected Result:**
  - **Send Email** is shown only in the modal variant where the design includes it.
  - **OK** remains the clearly available acknowledgment action.
  - The secondary action does not replace or hide **OK**.

### TC-FIGMA-12 — Error dialog structure stays consistent across visible failure types
- **Priority:** P2
- **Coverage:** cross-variant modal structure consistency
- **Precondition:** Multiple visible error modal variants are available.
- **Steps:**
  1. Compare the visible **Application Error** and **Server Error** modal variants.
  2. Review title placement, summary placement, detail toggle placement, and action placement.
  3. Review whether each variant still presents a clear primary acknowledgment path.
- **Expected Result:**
  - Different failure types reuse a consistent modal pattern.
  - The title, summary, details area, and action area are arranged consistently.
  - Users can recognize the dialog as the same recovery pattern across failure types.
