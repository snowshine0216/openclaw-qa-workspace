# GitHub Traceability: BCIN-6709

## Status

This traceability file is refreshed from the currently accessible GitHub evidence, but the GitHub domain remains **FAIL CLOSED** because three required compare URLs still return `404`.

## Evidence-to-Test Mapping

| Trace ID | Evidence | Code Surface | Required Test Focus | Priority |
|----------|----------|--------------|---------------------|----------|
| GH-01 | `github_diff_react-report-editor_compare.json` | `recreate-report-error.ts`, `recreate-error-catcher.tsx`, `shared-recover-from-error.ts` | recreate report instance after manipulation failure and keep user on-page | P0 |
| GH-02 | `github_diff_react-report-editor_compare.json` | `doc-view-slice.ts`, `document-view.tsx` | document view re-render after recovery with no blank grid | P1 |
| GH-03 | `github_diff_react-report-editor_compare.json` | `report-def-slice.ts`, `report-property-slice.ts` | preserve report state that should survive recovery | P1 |
| GH-04 | `github_diff_react-report-editor_compare.json` | `undo-redo-util.ts` | verify history preservation vs reset by error type | P0 |
| GH-05 | `github_pr_mojojs_8873.json` | `RootController.js`, `UICmdMgr.js` | validate controller / command-manager behavior during recreate flow | P0 |
| GH-06 | `github_pr_biweb_33041.json` | `RWManipulationBuilder.java`, `RWManipulationImpl.java`, `RWManipulation.java` | verify backend/API support for `reCreateReportInstance` and blocking-error refresh | P0 |
| GH-07 | `github_pr_server_10905.json` | `MSICmdUtilXMLReportExec.cpp`, `MsiXML.idl` | confirm refresh enters no-action mode on blocking errors | P1 |
| GH-08 | `github_pr_web-dossier_22468.json` | `ErrorObjectTransform.js`, `ServerAPIErrorCodes.js` | validate prompt-error code mapping into recovery behavior | P0 |
| GH-09 | `github_pr_web-dossier_22468.json` | `ActionLinkContainer/index.js`, `promptActionCreators.js` | return to prompt with existing answers preserved | P0 |
| GH-10 | `github_pr_productstrings_15008.json` | `LIBRARY/Strings.fdb` | verify Library copy/message exposure for recovery states | P2 |
| GH-11 | `github_pr_productstrings_15012.json` | `REACT_REPORT_EDITOR/Statuses.fdb`, `REACT_REPORT_EDITOR/Strings.fdb` | verify editor-side recovery labels, statuses, and messaging | P2 |

## Required Cross-Repo Scenarios

| Scenario ID | Scenario | GitHub Evidence |
|-------------|----------|-----------------|
| XR-01 | report manipulation fails, report instance is recreated, user stays in Library and continues working | GH-01, GH-05, GH-06 |
| XR-02 | blocking error + refresh path enters no-action/recreate behavior correctly | GH-06, GH-07 |
| XR-03 | undo/redo is preserved for recoverable errors but reset for designated error classes | GH-04, GH-05 |
| XR-04 | prompt answer flow fails and returns user to prompt with prior answers preserved | GH-08, GH-09 |
| XR-05 | recovery completes and document view refreshes without blank or stale content | GH-01, GH-02, GH-03 |
| XR-06 | recovery-related messages and statuses are correct in both Library and report editor surfaces | GH-10, GH-11 |

## Coverage Gaps Caused By Failed Fetches

| Missing Evidence | Impact on Traceability |
|------------------|------------------------|
| `mstr-kiai/biweb compare m2021...revertReport` | cannot confirm whether PR `#33041` fully represents all branch-level changes |
| `mstr-kiai/mojojs compare m2021...revertReport` | cannot confirm whether PR `#8873` fully represents all branch-level changes |
| `mstr-kiai/web-dossier compare m2021...revertReport` | cannot confirm whether PR `#22468` fully represents all branch-level changes |

## Priority Rule For Synthesis

- assign **P0** when a scenario directly exercises recovery correctness, undo/redo policy, prompt preservation, or blocking-error refresh behavior evidenced here
- assign **P1** when a scenario validates state consistency, re-render correctness, or server/client contract robustness
- assign **P2** when a scenario mainly validates copy, status text, styling, or low-risk regression around the recovery feature

## Evidence Files

- `context/qa_plan_github_BCIN-6709.md`
- `context/github_fetch_status_BCIN-6709.json`
- `context/github_diff_react-report-editor_compare.json`
- `context/github_pr_biweb_33041.json`
- `context/github_pr_mojojs_8873.json`
- `context/github_pr_productstrings_15008.json`
- `context/github_pr_productstrings_15012.json`
- `context/github_pr_server_10905.json`
- `context/github_pr_web-dossier_22468.json`
