# Cancel Report Execution - Authoring Mode

**Seed:** `tests/seed.spec.ts`

## Scenarios (from WDIO Report_authoring_cancel_execution.spec.js)

- [TC99428_01] Cancel when resume data - Edit report (pause mode), resume no wait, cancel in loading bar, assert still pause mode
- [TC99428_02] (DISABLED) Cancel when resume data on prompt report before prompt - Unstable in WDIO
- [TC99428_03] Cancel when resume data on prompt report after apply prompt - Switch design mode, run no wait, cancel, assert prompt editor
- [TC99428_04] Cancel when re-prompt in authoring - Reprompt, run no wait, cancel, assert prompt editor and selections
- [TC99428_05] Cancel re-execute in authoring - Sort, re-execute no wait, cancel, assert grid and undo
- [TC99428_06] Cancel during linking in authoring - Open link no wait, don't save, cancel, assert Library
