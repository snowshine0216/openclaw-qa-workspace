# Developer Smoke Test — BCIN-7289

Retrospective reconstruction for benchmark `P7-DEV-SMOKE-001`.

This file is phase7-shaped output reconstructed from replay evidence. It was not present in the source fixture. The row set is derived from the P1 scenarios and analog-gate scenarios called out in the copied evidence.

## Scope

- Runtime target: Workstation `26.04` latest build
- Backend: `tec-l-1183620.labs.microstrategy.com`
- Account: `bxu` with empty password
- Flag: new report editor enabled
- Key locales: English and `zh-CN`

## Checklist

| Done | Scenario Name | Trigger | Acceptance Signal | Est. Time |
|---|---|---|---|---|
| [ ] | Save overrides existing report | Open an existing report, make a change, and click `Save` to overwrite the existing object. | Save completes without JS crash or `400` error, and the updated report is visible immediately. | 5 min |
| [ ] | Save As folder visibility is immediate `[ANALOG-GATE]` | Save a report into a target folder by using `Save As`. | The destination folder refreshes immediately and shows the new or updated report without manual refresh. | 5 min |
| [ ] | Save dialog completeness for new report `[ANALOG-GATE]` | Save a newly created report and inspect the native comments dialog. | Expected fields are present and interactive, including enabled `Set as template` and applicable certification controls. | 5 min |
| [ ] | Close and cancel dialog behaves correctly `[ANALOG-GATE]` | Make unsaved changes, leave the prompt editor open, and close the main editor window. | A single confirm dialog appears, is not suppressed, and dismisses cleanly when the source window closes. | 5 min |
| [ ] | New report from template saves as a new report | Create a report from a template and click `Save`. | A new report is created in the target folder and the source template is not overwritten. | 5 min |
| [ ] | Save As honors prompt handling | Use `Save As` on a prompted report and exercise `do not prompt` or pause-mode behavior. | Prompt handling matches the selected behavior and the save path completes without unexpected reruns or extra prompts. | 5 min |
| [ ] | Report Builder loads prompt elements after double-click | Open a report with attribute or metric prompts, enter Report Builder, and double-click an attribute or metric. | Elements load for selection without errors or empty results. | 5 min |
| [ ] | Convert to Cube dialog renders correctly | Start `Convert to Intelligent Cube` or Datamart from the embedded editor. | The Library-style confirm dialog renders correctly, with readable content and expected actions. | 5 min |
| [ ] | Edit existing report opens with correct title | Double-click an existing report to edit it in Workstation. | The embedded editor opens with the actual report name in the title instead of a stale or placeholder value. | 5 min |
| [ ] | View and Format menus are present and usable | Open the embedded editor and expand the native toolbar menus. | `View` and `Format` are present at the expected level and their core actions respond normally. | 5 min |
| [ ] | i18n coverage for save and convert flows | Repeat key save and convert dialogs in `zh-CN` and one other locale. | Button labels, dialog titles, and window titles render in the active locale rather than falling back to English. | 10 min |

## Evidence Basis

| Scenario Name | Fixture basis |
|---|---|
| Save overrides existing report | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 1; `BCIN-7289_REPORT_FINAL.md` P0 item 1 and verification checklist |
| Save As folder visibility is immediate `[ANALOG-GATE]` | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Tier 2 for BCIN-7691; `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` DE332260 analog gate |
| Save dialog completeness for new report `[ANALOG-GATE]` | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 6 and BCIN-7688 note; `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` DE331555 analog gate |
| Close and cancel dialog behaves correctly `[ANALOG-GATE]` | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Tier 3 for BCIN-7708 and BCIN-7709; `BCIN-7289_SELF_TEST_GAP_ANALYSIS.md` DE334755 analog gate |
| New report from template saves as a new report | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 3 |
| Save As honors prompt handling | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Tier 1 for BCIN-7677; `BCIN-7289_REPORT_FINAL.md` P0 prompt handling note |
| Report Builder loads prompt elements after double-click | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 2; `BCIN-7289_REPORT_FINAL.md` verification checklist for BCIN-7727 |
| Convert to Cube dialog renders correctly | `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Tier 1 for BCIN-7673; `BCIN-7289_REPORT_FINAL.md` P1 intelligent cube conversion |
| Edit existing report opens with correct title | `BCIN-7289_REPORT_FINAL.md` P1 edit report flow; `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gaps 5 and 10 |
| View and Format menus are present and usable | `BCIN-7289_REPORT_FINAL.md` P1 view and format menus; `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Tier 1 for BCIN-7704 |
| i18n coverage for save and convert flows | `BCIN-7289_REPORT_FINAL.md` P1 i18n coverage; `BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md` Gap 7 |
