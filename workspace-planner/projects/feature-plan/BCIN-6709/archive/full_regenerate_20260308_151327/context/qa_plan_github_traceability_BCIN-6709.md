# GitHub Traceability — BCIN-6709

## Cross-repo mapping
| Repo / artifact | Evidence | Changed surface | User-visible implication | QA trace notes |
|---|---|---|---|---|
| `mstr-kiai/biweb` PR #33041 | New `reCreateInstance` path; `<os>8` support; manipulation builder/impl/interface updates | Server-facing manipulation payload and instance refresh path | Report recovery can recreate an instance instead of only failing or plain undoing | Trace to recovery after report execution/manipulation errors, especially `stid:-1` flows |
| `mstr-kiai/mojojs` PR #8873 | `cmdMgr.reset()` becomes conditional via `shouldResetUndoRedo` | Runtime command/undo-redo state handling | Undo/redo history should be preserved for recovery flows and reset only when appropriate | Trace to post-error editing continuity and history behavior |
| `mstr-kiai/web-dossier` PR #22468 | Error transform/action-link updates; prompt error tagging; `DFC_QRYENG_RES_TRUNC` handling; tests | Popup actions, error copy, prompt/reprompt routing in Library/web | Specific recoverable report failures show report-aware actioning instead of generic email path | Trace to popup title/message/action verification and prompt vs reprompt split |
| `mstr-kiai/productstrings` PR #15008 | Adds localized Library string 6665 | Library error copy | User sees **“One or more datasets failed to load.”** | Trace to Library/web-dossier error text assertion |
| `mstr-kiai/productstrings` PR #15012 | Adds Report Editor statuses/strings 382/383 | Report Editor title/message localization | User sees **“Report Cannot Be Executed.”** and return-to-Data-Pause-Mode guidance | Trace to editor-specific dialog copy and localization |
| `react-report-editor` compare artifact | New recreate error catcher, shared recovery logic, store and document-view changes | Editor recovery UI, state recovery, document rendering, undo/redo helpers | Editor likely offers a dedicated recovery UX and preserves more state after failure | Trace to editor recovery landing state, rerender behavior, and store consistency |

## Detailed evidence ledger

### 1) biweb PR #33041
- URL: https://github.com/mstr-kiai/biweb/pull/33041
- Title: `BCIN-7543; support new <os>8 flag for reCreateReportInstance`
- Files:
  - `BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationBuilder.java`
  - `BIWebSDK/code/java/src/com/microstrategy/web/objects/RWManipulationImpl.java`
  - `BIWebSDK/code/java/src/com/microstrategy/web/objects/rw/RWManipulation.java`
- Trace points:
  - action payload accepts `reCreateInstance`
  - `stateId == -1` + `reCreateInstance` uses dedicated recreate path
  - refresh request emits `<os>8`
- QA relevance:
  - validate error recovery path can recreate a usable report instance
  - validate no incorrect fallback to normal undo/cancel behavior

### 2) mojojs PR #8873
- URL: https://github.com/mstr-kiai/mojojs/pull/8873
- Title: `BCIN-7543; Improve the report error handling`
- Files:
  - `production/code/mojo/js/source/vi/controllers/RootController.js`
  - `production/code/mojo/js/source/vi/controllers/UICmdMgr.js`
- Trace points:
  - `shouldResetUndoRedo` replaces narrower recreation flag
  - reset behavior wrapped in `try/finally`
- QA relevance:
  - validate undo/redo state after recoverable error
  - validate non-recovery manipulations still reset correctly

### 3) web-dossier PR #22468
- URL: https://github.com/mstr-kiai/web-dossier/pull/22468
- Title: `BCIN-7543; Improve the report error handling`
- Files:
  - `production/src/react/src/components/popup/ActionLinkContainer/index.js`
  - `production/src/react/src/constants/ActionLinks.js`
  - `production/src/react/src/modules/prompt/promptActionCreators.js`
  - `production/src/react/src/server/ServerAPIErrorCodes.js`
  - `production/src/react/src/services/transforms/ErrorObjectTransform.js`
  - `production/src/react/src/services/transforms/__tests__/ErrorObjectTransform.test.js`
- Trace points:
  - adds prompt-specific action types for returning from error
  - flags report prompt-answer failures in state/action flow
  - adds explicit detection of `DFC_QRYENG_RES_TRUNC`
  - for truncation-related prompt failures, popup action becomes a single return action rather than email/escalation
  - string copy updated from “not loaded for this item” to “failed to load”
- QA relevance:
  - validate prompt and reprompt each show the correct action wiring
  - validate truncation vs non-truncation error behavior differs as intended
  - validate no stale Send Email action in recoverable path

### 4) productstrings PR #15008
- URL: https://github.com/mstr-kiai/productstrings/pull/15008
- Title: `BCIN-7543; Improve the report error handling`
- Files:
  - `LIBRARY/Strings.fdb`
- Trace points:
  - adds localized string id `6665`
  - English copy: `One or more datasets failed to load.`
- QA relevance:
  - validate exact Library copy in UI
  - validate localization hookup does not regress existing dataset-load messaging

### 5) productstrings PR #15012
- URL: https://github.com/mstr-kiai/productstrings/pull/15012
- Title: `BCIN-7543; Improve the report error handling`
- Files:
  - `REACT_REPORT_EDITOR/Statuses.fdb`
  - `REACT_REPORT_EDITOR/Strings.fdb`
- Trace points:
  - adds status/string keys `cannotExecuteReport` and `cannotExecuteReportError`
  - English title: `Report Cannot Be Executed.`
  - English message: `This report cannot be executed. See Show Details for more information. Click OK to return to Data Pause Mode.`
- QA relevance:
  - validate editor-specific title/message exactly
  - validate return to Data Pause Mode after OK

### 6) react-report-editor compare artifact
- Artifact: `projects/feature-plan/BCIN-6709/context/github_compare_react-report-editor_m2021_revertReport.json`
- Commit themes observed:
  - `reCreateReportInstance 1-7`
  - modeling service error handling by `ErrorCatcher` without rerender document view
  - `Modify updateShouldResetUndoRedo`
  - `Update error string`
- Files changed (high-signal subset):
  - `production/src/components/document-view/document-view.tsx`
  - `production/src/components/error-catcher/error-catcher.tsx`
  - `production/src/components/recreate-error-catcher/recreate-error-catcher.tsx`
  - `production/src/components/recreate-error-catcher/recreate-report-error.ts`
  - `production/src/store/shared/shared-recover-from-error.ts`
  - `production/src/store/doc-view-slice/doc-view-slice.ts`
  - `production/src/store/report-def-slice/report-def-slice.ts`
  - `production/src/store/report-property-slice/report-property-slice.ts`
  - `production/src/utils/undo-redo-util.ts`
- QA relevance:
  - validate dedicated editor recovery UI renders when expected
  - validate document view does not unnecessarily rerender during recovery
  - validate report definition/properties/UI state remain coherent after recovery

## Suggested scenario trace matrix
| Scenario | biweb | mojojs | web-dossier | productstrings | react-report-editor |
|---|---|---|---|---|---|
| Prompted report execution fails with truncation/max rows | recreate request path | preserve/reset history correctly | special recoverable popup action | Library text | editor recovery UI/state |
| Reprompt execution fails with truncation/max rows | same backend path | same history risk | separate reprompt action path | Library text | editor recovery UI/state |
| Report failure without truncation suberror | possible backend recovery plumbing | history risk still possible | generic error action path retained | Library text | editor behavior may differ |
| Click OK from report-specific error | recreated instance may be used | history state after landing | popup action routing | localized copy | return to Data Pause Mode |
| Continue editing after recovery | instance valid | undo/redo valid | no stale popup state | n/a | doc view + store state coherent |

## Important caveat
The PRs consistently reference the same design/problem area but use mixed ticket labels (`BCIN-6709`, `BCIN-7543`, `BCEN-4843`). For QA traceability, treat them as one implementation stream unless Atlassian evidence later splits scope.
