# BCIN-7543 — Dev-Improve the report error handling

- Type: Story
- Status: To Do
- Due: 2026-03-06
- Assignee: Yuankun Li
- Jira: https://strategyagile.atlassian.net/browse/BCIN-7543

## Relationship to BCIN-6709
BCIN-7543 appears to be the implementation story that expands BCIN-6709 into concrete technical work.

## Subtasks surfaced in Jira
- BCIN-7582 Prompt answer cancel revert back to prompt — To Do
- BCIN-7583 BIWeb xml command <os 8 — Done
- BCIN-7584 mojo to control the undo redo reset — Done
- BCIN-7585 New string — Done
- BCIN-7586 report-editor add extra error catcher — To Do
- BCIN-7587 report-editor error transform — To Do
- BCIN-7588 report-editor show document-view even when error pop up — To Do
- BCIN-7589 report-editor handle pause and data retrieval status switch — To Do
- BCIN-7590 Research and handle kinds of errors — Done

## Latest Jira evidence refreshed
Recent Jira comments reference the following implementation artifacts:
- biweb PR 33041 (created, later merged to m2021)
- mojojs PR 8873 (created, merged to m2021)
- productstrings PR 15008 (created, merged to m2021)
- productstrings PR 15012 (created, merged to next)
- web-dossier PR 22468 (created, merged to m2021)
- Build note: 11.6.0400.00027

## QA-relevant implications
The work spans multiple layers:
- editor/runtime error capture and transform
- keeping document view visible when errors occur
- pause/data retrieval state switching
- undo/redo/reset behavior recovery
- prompt cancel behavior
- string changes and likely UX messaging updates
