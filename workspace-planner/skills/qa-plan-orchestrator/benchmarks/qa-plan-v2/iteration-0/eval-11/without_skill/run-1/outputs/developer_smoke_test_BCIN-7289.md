# Developer Smoke Test — BCIN-7289

Retrospective reconstruction of the **expected phase7 output artifact** using only the copied replay evidence under `./inputs/fixtures/`.

Per the replay evidence, this checklist should be derived from:
- all P1 scenarios
- all `[ANALOG-GATE]` scenarios

Because `qa_plan_final.md` is not present in the fixture, the rows below are reconstructed from the explicit P1 mappings, gap definitions, and analog-gate rules recorded in the replay documents.

| Check | Scenario Name | Trigger | Acceptance Signal | Est. Time |
|---|---|---|---|---|
| [ ] | [P1] Save overrides existing report without error | Open an existing report, modify it, and click `Save` when the target name already exists | Save completes without JS/null/400 error and the updated report is visible immediately in the target folder | 5 min |
| [ ] | [P1] New report created from a template saves as a new report | Create a report from a template and click `Save` | A new report is created; the source template is not overwritten or modified | 5 min |
| [ ] | [P1] Report Builder loads attribute or metric elements after double-click | Open a prompt-based report in the embedded editor, enter Report Builder, and double-click an attribute or metric | Elements load for selection with no empty list and no error state | 5 min |
| [ ] | [P1] Save As respects native dialog and prompt options | Use `Save As` on a prompt-based report and exercise the prompt option path | Native Workstation save dialog opens and the selected prompt behavior is honored without an unexpected rerun | 5 min |
| [ ] | [P1] Subset report save completes without `instanceId` or null-reference failure | Save a newly created subset report | Save succeeds without crash and the report remains usable after save | 5 min |
| [ ] | [P1] Convert to Intelligent Cube or Datamart shows the expected confirm dialog | Start a convert-to-cube or convert-to-datamart action from the embedded editor | The Library-style confirm dialog renders with correct content and actionable buttons | 5 min |
| [ ] | [P1] Prompt-based report accepts answers and continues the run path | Execute a prompt-based report and provide answers | Prompt answers are accepted and the report proceeds normally through run or follow-on save/edit actions | 5 min |
| [ ] | [P1] Close with unsaved changes shows confirm dialog and discard does not rerun | Make an unsaved change, attempt to close, and choose discard | A single confirm dialog appears and discard closes cleanly without re-running the report | 5 min |
| [ ] | [P1] Edit report flow opens the correct report and title in Workstation | Double-click an existing report to edit it in the embedded editor | The correct report opens and the window title matches the report being edited | 5 min |
| [ ] | [P1] Save and convert dialogs work in zh-CN and one additional locale | Repeat the core save and convert flows in Chinese and one second locale | Dialog labels, buttons, and titles are localized correctly without English fallback or broken keys | 10 min |
| [ ] | [ANALOG-GATE] Save As folder visibility is immediate | Save or Save As into a folder and return to the destination location | The saved report is visible immediately; no stale folder state remains | 5 min |
| [ ] | [ANALOG-GATE] Save dialog completeness is present and interactive | Save a newly created report and inspect the native save/comments dialog | Expected fields are present and interactive; `Set as template` is enabled when applicable | 5 min |
| [ ] | [ANALOG-GATE] Error dialog dismisses after source closes | Reproduce an error dialog and then close the originating window or source state | The error dialog dismisses with the source and does not remain as an orphaned popup | 5 min |

## Replay Evidence Used

- `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`
- `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`
- `BCIN-7289_REPORT_FINAL.md`
