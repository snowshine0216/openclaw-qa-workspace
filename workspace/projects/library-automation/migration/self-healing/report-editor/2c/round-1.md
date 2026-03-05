# Round 1 Healing Summary (report-editor 2c)

- Timestamp: 2026-03-01T11:02:28Z
- Phase command: `npm run test:report-creator`
- WDIO source base used: `/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-tester/projects/wdio/specs/regression/reportEditor/reportCreator`
- Spec MD path passed: `specs/report-editor/report-creator/` (missing in repository)

## WDIO Mapping Used
- `tests/specs/report-editor/report-creator/create-by-cube.spec.ts` -> `ReportEditor_createByCube.spec.js`
- `tests/specs/report-editor/report-creator/create-by-cube-privilege.spec.ts` -> `ReportEditor_createByCubePrivilege.spec.js`
- `tests/specs/report-editor/report-creator/report-creator.spec.ts` -> `ReportEditor_reportCreator.spec.js`
- `tests/specs/report-editor/report-creator/report-template-security.spec.ts` -> `ReportEditor_reportTemplateSecurity.spec.js`
- `tests/specs/report-editor/report-creator/template.spec.ts` -> `ReportEditor_template.spec.js`
- `tests/specs/report-editor/report-creator/template-by-execution-mode.spec.ts` -> `ReportEditor_templateByExecutionMode.spec.js`

## Fixes Applied
- Updated `tests/page-objects/library/dossier-creator.ts`:
  - aligned add-button selector with WDIO-style create icon selectors
  - added WDIO-style tooltip dismissal before project option click
  - tightened project dropdown option matching to exact-text regex
  - added loading wait after project switch selection

## Rerun Result
- `1 passed, 25 failed, 16 skipped`
- Dominant failures:
  - `createNewReport` add button not visible in multiple tests
  - project dropdown interaction blocked / options unresolved
  - occasional redirect to `/auth/login` during run
