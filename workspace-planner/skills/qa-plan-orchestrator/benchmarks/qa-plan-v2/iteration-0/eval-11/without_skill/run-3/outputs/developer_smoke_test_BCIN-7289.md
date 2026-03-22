# Developer Smoke Test — BCIN-7289

**Feature family:** report-editor  
**Phase alignment:** phase7 finalization output  
**Replay mode:** retrospective reconstruction from copied evidence only

## Derivation Rule

This checklist includes only rows supported by the replay evidence as:

- `P1`,
- `P1 + ANALOG-GATE`,
- or explicit `REQUIRED_BEFORE_SHIP` analog gates.

Rows identified in the replay as **missing plan scenarios** are excluded from this phase7 derivation.

## Smoke Checklist

| [ ] | Scenario | Source class | Trigger | Acceptance signal | Est. time | Evidence basis |
|---|---|---|---|---|---|---|
| [ ] | Create a report from template and save it as a new report | `P1` | Create a report from a template and click `Save` | A new report is created in the target folder and the source template is not overwritten | 5 min | Cross-analysis maps BCIN-7667 to `Create Report End-to-End Journey` and `Template Operations`; self-test analysis says this defect cluster should be prevented by a dev smoke artifact |
| [ ] | Save over an existing report without crash or HTTP failure | `P1` | Open or create a report, choose an existing target, and confirm overwrite on save | Save completes without JS error or `400` response and the updated report is visible immediately | 5 min | Cross-analysis maps BCIN-7669 and BCIN-7724 to the save-override P1 path |
| [ ] | Blank-report first open stays within the accepted performance budget | `P1 + ANALOG-GATE` | Create a blank report in the baseline project environment | First open is within the accepted baseline and does not regress to the reported slow path | 10 min | BCIN-7675 is mapped to the P1 performance scenario and to the DE332080 analog class in self-test analysis |
| [ ] | Save As honors prompt options such as "do not prompt" | `P1` | Run `Save As` on a prompt-based report with `do not prompt` selected | Save completes and the prompt flow respects the selected option | 5 min | Cross-analysis maps BCIN-7677 to the P1 save-as scenario |
| [ ] | Convert to Intelligent Cube or Datamart shows a correct confirm dialog | `P1` | Start Convert to Cube or Datamart from the embedded editor | The Library-style confirm dialog content is readable and correctly formatted | 5 min | Cross-analysis maps BCIN-7673 to a P1 convert-dialog scenario |
| [ ] | Prompt-based report accepts answers and runs through the edit flow | `P1` | Open a prompt-based report in edit flow, answer the prompt, and run or save | Prompt answers are accepted and the report completes the flow without blocking failure | 5 min | Cross-analysis maps BCIN-7685 to the P1 edit E2E journey |
| [ ] | Newly created subset report saves without `instanceId` failure | `P1` | Create a subset report and perform save or save-as | Save completes without `instanceId` null error | 5 min | Cross-analysis maps BCIN-7687 to the P1 save path |
| [ ] | Save As to a folder refreshes folder visibility immediately | `P1 + ANALOG-GATE` | Save a report into a target folder | The saved report appears in the folder immediately without manual refresh | 5 min | Cross-analysis maps BCIN-7691 to P1 and to the DE332260 analog gate |
| [ ] | Close with unsaved changes shows a single confirm path and does not rerun the report | `P1` | Make unsaved changes, cancel or discard current prompt answer, then close the editor | A confirm-close dialog appears once and the report does not unexpectedly rerun | 5 min | Cross-analysis maps BCIN-7707 to the P1 close/cancel scenario |
| [ ] | New-report save dialog is complete and interactive | `ANALOG-GATE` | Save a newly created report and inspect the native comments dialog | Expected fields are present and interactive, including `Set as template` and other expected controls | 5 min | Cross-analysis marks BCIN-7688 as the DE331555 analog; self-test analysis promotes this scenario to `REQUIRED_BEFORE_SHIP` |
| [ ] | Error dialog dismisses when its source window closes | `ANALOG-GATE` | Trigger the relevant error dialog, then close the owning editor window | The error dialog closes with the source window and does not remain orphaned onscreen | 5 min | Self-test analysis lists DE334755 as `REQUIRED_BEFORE_SHIP`; trigger wording is inferred from the scenario title because the replay fixture does not provide fuller steps |

## Excluded From This Phase7 Derivation

- Report Builder prompt element loading after double-click: replay marks this as a missing scenario, not an existing P1 input to phase7.
- Template report plus pause-mode prompt execution: replay marks this as a missing combination scenario.
- Window-title correctness across blank create, IC create, and edit: replay marks this as a missing scenario generated from SDK coverage rather than an existing plan row.
