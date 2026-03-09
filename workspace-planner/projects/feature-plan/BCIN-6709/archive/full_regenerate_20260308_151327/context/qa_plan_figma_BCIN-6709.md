# Figma Domain Summary: BCIN-6709

## Summary
- **Source**: Local Figma snapshot images only
- **Artifacts reviewed**:
  - `projects/feature-plan/BCIN-6709/figma/image.png`
  - `projects/feature-plan/BCIN-6709/figma/image (1).png`
- **Focus**: visible error dialogs, recovery affordances, and user-observable report/document behavior

## Visible UI states

### 1. Application error dialog for report/document open failure
Observed variants in the snapshots show a modal-style error dialog with:
- Title such as **"Application Error"**
- Primary message such as:
  - **"Report cannot be opened."**
  - **"Report Cannot Be Executed."**
  - **"This report type is not supported."**
- Expand/collapse affordance via **"Show Details"**
- Confirm action via **"OK"**
- Detailed technical text displayed when expanded

### 2. Server error dialog for dataset/prompt report failure
Another visible modal variant shows:
- Title **"Server Error"**
- Summary message such as **"One or more datasets failed to load."** / **"One or more datasets are not loaded for this item."**
- Detail toggle via **"Hide details"** / implied expanded state
- Primary action **"OK"**
- Secondary action **"Send Email"** in one design variant
- Expanded technical details for a prompt report max-row-limit failure

## User-observable behaviors to validate

### Error dialog behavior
- Error dialog appears as a blocking modal over report/document context.
- Short summary text is shown first, with optional technical details behind a toggle.
- Toggling details changes the dialog between condensed and expanded states.
- The dialog supports acknowledgement through **OK**.
- Different failure types reuse a similar dialog structure but with different titles/messages.

### Recovery/navigation affordances
- The annotation text in the mockups indicates concern that clicking **OK** currently returns the user away from the active report context (for example to Pause Mode or library home).
- This makes post-error recovery a primary test area:
  - whether **OK** closes only the dialog,
  - whether the user is returned to the previous safe state,
  - whether navigation outcome differs between normal report open errors and prompt-report dataset errors.

### Detail disclosure behavior
- **Show Details / Hide details** is a key interaction and should be validated for:
  - correct label switching,
  - expanded technical content visibility,
  - stable dialog layout when content grows,
  - preservation of primary action availability while details are open.

## Testable scenarios

### P0
1. **Unsupported/open-failure report error**
   - Trigger a report open failure.
   - Verify the user sees an error modal with a clear title and summary.
   - Verify **OK** is available.
   - Verify the user lands in the intended recovery state after acknowledging the error.

2. **Executed-but-failed dataset error**
   - Trigger a dataset failure while opening or rendering a document/report.
   - Verify the summary explains that one or more datasets failed to load.
   - Verify details can be expanded.
   - Verify recovery does not unexpectedly dump the user to an unrelated home/state.

3. **Details toggle behavior**
   - Open the error dialog.
   - Expand details using **Show Details**.
   - Verify long technical text is readable and contained within the dialog.
   - Collapse details and verify the dialog returns to condensed state.

4. **Prompt report max-row-limit error**
   - Reproduce a prompt-report failure due to row limit.
   - Verify the error copy is understandable at summary level.
   - Verify details expose the limit-related message.
   - Verify **OK** returns the user to the correct prior state.

### P1
1. **Dialog copy consistency across error types**
   - Validate title/body wording is accurate for unsupported type, execution failure, and dataset load failure.
   - Check the same generic message is not misleading across distinct failure modes.

2. **Secondary action usefulness**
   - Validate whether **Send Email** appears only where intended.
   - Verify the secondary action is visually distinct from **OK** and does not distract from recovery.

3. **Long technical details rendering**
   - Verify expanded stack traces / query-engine text does not clip, overlap, or push buttons off-screen.

## Edge cases from the designs
- Very long backend/detail text in expanded state.
- Multiple distinct failure causes using a shared dialog pattern.
- User acknowledgement leading to different destinations depending on entry point (report page, prompt flow, library home, pause mode).
- Copy mismatch between actual failure cause and high-level dialog summary.

## Accessibility / usability checks
- Focus should land inside the modal when it opens.
- Keyboard users should be able to reach **Show Details/Hide details**, **OK**, and any secondary action.
- The default action should be visually clear.
- Expanded details should remain readable without truncating primary recovery actions.

## Key QA takeaway
The snapshots are centered on **error-state UX**, not normal authoring flows. The highest-risk area is the combination of:
- generic or inaccurate error messaging,
- expandable technical details,
- and what happens after the user clicks **OK**.

This feature should prioritize validation of **error copy accuracy, detail disclosure behavior, and recovery destination after modal dismissal**.