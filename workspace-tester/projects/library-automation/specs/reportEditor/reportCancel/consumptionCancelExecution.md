# Cancel Report Execution - Consumption Mode

**Seed:** `tests/seed.spec.ts`

## Scenarios (from WDIO Report_consumption_cancel_execution.spec.js)

- [TC99427_01] Cancel initial execution - Open report (no wait), click cancel, assert Library page
- [TC99427_02] Cancel initial execution on prompt report - Same with prompt report
- [TC99427_03] Cancel apply prompt on report - Open with prompt, run no wait, cancel, assert prompt editor
- [TC99427_04] Cancel re-prompt - Reprompt, run no wait, cancel, assert prompt editor and selections
- [TC99427_05] Reset report and cancel - Sort, reset no wait, cancel, assert Library
- [TC99427_06] Apply bookmark and cancel - Sort, move to page-by, apply bookmark, cancel, assert Library
- [TC99427_07] Cancel linking to target report no prompt - Open contextual link no wait, cancel, assert source unchanged
- [TC99427_08] Cancel linking to target report with prompt - Link, apply prompt no wait, cancel, assert prompt editor and source
- [TC99427_09] Cancel re-execute - Sort, re-execute no wait, cancel in loading bar, assert grid and undo
