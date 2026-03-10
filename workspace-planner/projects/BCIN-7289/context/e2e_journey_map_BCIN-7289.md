# E2E Journey Map — BCIN-7289

## Journey 1 — Create New Report with Embedded Editor
- Setup: user has authoring privileges, new report editor preference enabled, target environment supports embedded report editor
- Entry: create a new report from Workstation
- Flow: launch embedded report editor → add report objects / filters / prompt inputs as needed → resume data retrieval → save via native Workstation dialog
- Completion signal: saved report remains accessible in Workstation and reopening shows the saved definition

## Journey 2 — Edit Existing Report with Embedded Editor
- Setup: editable existing report, new report editor preference enabled
- Entry: open existing report from Workstation
- Flow: embedded editor loads existing definition → user edits structure/filter/prompted behavior → save → close → reopen
- Completion signal: updated report opens correctly and saved changes persist

## Journey 3 — Recovery / Failure Handling During Embedded Authoring
- Setup: embedded editor enabled, report open in Workstation
- Entry: either embedded editor startup fails, auth expires, or user cancels/closes while executing
- Flow: Workstation handles error without redirecting user into orphaned Library state; fallback or recovery path remains available
- Completion signal: user can either continue in fallback editor, recover auth cleanly, or close/cancel without crash or dead-end
