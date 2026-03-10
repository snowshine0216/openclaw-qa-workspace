# BCIN-6709 Atlassian Context

## Primary Jira Issue
- **Issue**: BCIN-6709
- **Type**: Feature
- **Summary**: Improve the report error handling to allow and facilitate user to continue editing.
- **Priority**: Highest
- **Owner**: Wei (Irene) Jiang

## Problem Statement
When a report encounters errors, users currently have to exit and reopen the report to continue working. That causes loss of in-progress editing and has become a growing customer pain point, including escalation pressure.

## QA Intent Inferred from Jira
The feature goal is to improve recovery from report errors so users can keep working instead of losing progress and restarting the session.

## Related Jira Evidence
### BCIN-7543 — Dev-Improve the report error handling
This related implementation story provides the richer implementation trail for BCIN-6709.

#### Subtasks called out in Jira
- BCIN-7582 Prompt answer cancel revert back to prompt
- BCIN-7583 BIWeb xml command <os 8
- BCIN-7584 mojo to control the undo redo reset
- BCIN-7585 New string
- BCIN-7586 report-editor add extra error catcher
- BCIN-7587 report-editor error transform
- BCIN-7588 report-editor show document-view even when error pop up
- BCIN-7589 report-editor handle pause and data retrieval status switch
- BCIN-7590 Research and handle kinds of errors

## Evidence Discovered in Jira Comments
### PR / repo references surfaced from Jira comments
- **biweb**: https://github.com/mstr-kiai/biweb/pull/33041
- **web-dossier**: https://github.com/mstr-kiai/web-dossier/pull/22468
- **mojojs**: https://github.com/mstr-kiai/mojojs/pull/8873
- **productstrings**: https://github.com/mstr-kiai/productstrings/pull/15008
- **productstrings**: https://github.com/mstr-kiai/productstrings/pull/15012

## User-Observable Behaviors to Validate
1. A report error should no longer force the user to abandon the editing session immediately.
2. The UI should preserve or restore a usable editing state after an error.
3. Error messaging should help the user understand what happened and what can be done next.
4. Document view visibility and editor continuity are likely important after failure.
5. Prompt-answer and undo/redo related flows are likely regression-prone based on subtask naming.
6. Pause/data-retrieval state switching appears risk-prone and should be covered in recovery scenarios.

## Open Questions / To Confirm During Synthesis
- Which exact error classes are expected to be recoverable vs terminal?
- What user actions should remain available after each error type?
- How much draft/edit state should be preserved after recovery?
- Are there any expected differences between prompt-answer errors, data retrieval errors, and document-view rendering errors?

## Recommended Test Focus from Atlassian Evidence
- Recovery without losing in-progress edits
- Staying in report editor instead of forced reopen
- Clear error dialogs / affordances
- Prompt-answer cancellation / re-entry behavior
- Undo/redo reset or preservation behavior after error recovery
- Document-view visibility while error UI is displayed
- Pause/loading/data retrieval transitions after failures
