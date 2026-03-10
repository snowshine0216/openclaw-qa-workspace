# Comprehensive QA Plan: BCIN-6709 — Improve Report Error Handling for Continued Editing in Library

## 📊 Summary

| Field | Value |
|-------|-------|
| **Feature Link** | [BCIN-6709](https://microstrategy.atlassian.net/browse/BCIN-6709) |
| **Release Version** | 26.04 |
| **QA Owner** | CTC QA Team |
| **SE Design Link** | [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841) |
| **UX Design Link** | N/A |
| **GitHub Compare Links** | [react-report-editor](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport), [mojojs](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport), [biweb](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport), [web-dossier](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) |
| **Date Generated** | 2026-02-27 |
| **Plan Status** | Draft |

## 📝 Background

### 1. Key Problem Statement

When a report encounters errors in Library authoring mode (e.g., max rows exceeded, SQL failures, analytical engine errors), the server instance crashes and becomes unusable. Users are forced to exit the report and reopen it, losing all previous edits. This has generated increasing customer complaints and at least one escalation.

### 2. Solution

Instead of forcing users to exit on error, the system recovers by:
- **Non-prompt errors (authoring mode)**: Recreate server instance via `undo stid:-1` with `<os>8</os>` (noActionMode=true), cancel in-flight requests, and return to pause mode
- **Prompt-related errors (Library web)**: Cancel prompt answers and return to the prompt dialog with previous answers preserved, using the F43454 cancel-prompt-answer mechanism
- **Modeling service errors**: The instance is NOT crashed. Error is shown, grid view remains displayable, undo/redo is reset

### 3. Business Context

- **User Impact**: Report authors can continue editing after encountering server errors without losing work
- **Technical Scope**: 4 repos (react-report-editor, mojojs, biweb, web-dossier), ~1,350 lines added across 24 files
- **Dependencies**: F43454 (cancel prompt answer and back to prompt) — already implemented
- **Scope Boundary**: Authoring mode ONLY. Consumption mode behavior is completely unchanged. No new feature flags required.

## 🎯 QA Goals

### 1. E2E: End to End

- Verify complete error → recovery → continue editing flow for each error type (max rows, SQL failure, analytical engine, prompt)
- Validate cross-repo integration: react-report-editor → biweb (Java) → mojojs → web-dossier
- Confirm state consistency between client and server after instance recreation
- Verify session and undo/redo state management across recovery cycles

### 2. FUN: Functionality

- Validate all 10 functional requirements from design doc (FR-1 through FR-10)
- Verify reCreateInstance API payload creates a clean instance without data and without prompt resolution
- Confirm error type classification (recoverable vs. non-recoverable) for all error codes
- Verify `isModelingServiceManipulation` flag correctly controls undo/redo reset behavior

### 3. UX: User Experience

- Verify error dialog shows clear, appropriate messages for each error type
- Validate error dialog severity styling (info, warning, error, critical)
- Confirm "Show Details" toggle works for errors with detail information
- Verify login form appears for authentication errors
- Confirm mojo loading indicator is dismissed when error dialog appears (no stuck overlay)

### 4. PERF: Performance

- Verify error recovery completes without visible delay beyond the reCreateInstance API call
- Test rapid repeated error → recovery cycles for memory leaks or stuck states
- Confirm `cancelRequests()` properly cleans up in-flight requests without hanging

### 5. SEC: Security

- Verify login form in error dialog performs real authentication via `service.login()`
- Confirm no sensitive error details (stack traces, internal codes) leak to end users in production mode

### 6. UPG: Upgrade and Compatibility

- Verify all deployment types supported: MCE, MEP, MCG, MCP, Tanzu, CMC
- Confirm backward compatibility: existing error handling in consumption mode is unchanged
- Verify existing ErrorCatcher still works for non-reCreate errors

### 6. ACC: Accessibility

- Error dialog receives focus when it appears; focus is trapped within the dialog
- Dialog is dismissible via keyboard (Escape key or Tab to OK → Enter)
- Screen reader announces error title and message when dialog opens
- Login form fields in auth error dialog have proper labels and ARIA attributes
- Error details toggle button is keyboard accessible

### 7. CER: Platform Certifications

- Verify error recovery behavior consistent across supported browsers (Chrome, Firefox, Safari, Edge)
- Verify no platform-specific JavaScript errors in error type conversion functions (`toHex`, `hexToSignedInt32`)

### 8. UPG: Upgrade and Compatibility

- Verify all deployment types supported: MCE, MEP, MCG, MCP, Tanzu, CMC
- Confirm backward compatibility: existing error handling in consumption mode is unchanged
- Verify existing ErrorCatcher still works for non-reCreate errors

### 9. INT: Integration (Cross-Repo)

- Validate end-to-end data flow: react-report-editor (error detection) → biweb (instance recreation via osFlag=8) → mojojs (cmdMgr reset guard) → web-dossier (prompt cancel flow)
- Verify `isReCreateReportInstance` flag timing between react-report-editor and mojojs via global `window.mstrApp`
- Confirm `cancelPromptAnswersAndBackToPrompt` integrates correctly with F43454 mechanism

### 10. AUTO: Automation

- Error type system unit tests: `ServerAPIErrorCodes.toHex()`, `hexToSignedInt32()`, `ConvertError()`, `shouldRecoverFromError()`
- `ReCreateErrorCatcher` component tests: severity rendering, swallow behavior, login form display
- Integration test candidates: max rows → recovery → pause mode, prompt error → cancel → back to prompt
- Manual-only: visual verification of error dialog styling, deployment-specific tests

## 🧪 Test Key Points

### 1. Error Recovery — Pause Mode Resume Errors (from Design Doc §2.2.1)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `shared-recover-from-error.ts` → `shouldRecoverFromError()` + `reCreateReportInstanceThunkHelper()` | Given report in pause mode with edits, when "Resume Data Retrieval" triggers rebuildDocument and it fails (max rows exceeded), then instance is recreated and user returns to pause mode | Open report exceeding max rows → click "Resume Data Retrieval" → observe error dialog → click OK | Error dialog shows; instance recreated; returns to pause mode (empty grid); no crash; can resume again |
| P0 | `shared-recover-from-error.ts`, `doc-view-slice.ts` catch block | Given SQL failure on resume, then error shown and returns to pause mode | Open report with SQL failure (BCIN-6706) → click "Resume Data Retrieval" | Error dialog shows; returns to pause mode; no forced navigation to Library home |
| P0 | `shared-recover-from-error.ts` → `isAnalyticalActionFailedRemove()` | Given analytical engine error on resume (cartesian join), then returns to pause mode | Open report (BCIN-974) → add conflicting attribute | Engine error handled; returns to pause mode |
| P1 | `shared-recover-from-error.ts` | Given MDX/ODBC error on resume, then returns to pause mode | Open MDX report (BCEN-4129) → click "Resume Data Retrieval" | Error dialog; returns to pause mode without crash |
| P0 | `reCreateReportInstanceThunkHelper()` | After error recovery, clicking "Resume Data Retrieval" again works | Recover from error → click "Resume Data Retrieval" again | No hanging/stuck state; request proceeds normally |

### 2. Error Recovery — Running Mode Manipulation Errors (from Design Doc §2.2.2)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `report-property-slice.ts` → `updateReportProperties` + `updateIsModelingServiceManipulation(true)` + `resetUndoRedo` | Given report running, when Advanced Properties row limit change triggers rebuildDocument error, then returns to pause mode with undo/redo cleared | Open running report → File → Report Properties → Advanced Properties → set low row limit → Done | Modeling service PUT succeeds; rebuildDocument fails; error dialog; returns to pause mode; undo/redo cleared |
| P0 | `document-view.tsx` → `reCreateErrorHandler` callback | Given running mode error, then document view re-renders correctly to pause mode | Trigger manipulation error in running mode | Grid view updates to pause mode (empty), not stale running-mode grid; `mstrApp.appState` set to DEFAULT; `isViewTemplateDirty` reset to false |
| P0 | `report-def-slice.ts` → `updateBaseTemplateUnits` catch block + `recoverReportFromError()` | Given modeling service manipulation (join type change, template unit update) fails with rebuildDocument error, then returns to pause mode with undo/redo cleared | Perform modeling service operation causing error | `isModelingServiceManipulation=true` → undo/redo history cleared |
| P1 | `doc-view-slice.ts` → `updateViewTemplateThunkHelper` catch block | Given normal (non-modeling) manipulation error, then returns to pause mode with undo/redo preserved | Make several edits → trigger non-modeling error | Returns to pause mode; undo/redo history preserved; can undo after resuming |

### 3. Modeling Service Errors — No Instance Crash (from Design Doc §2.2)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `recreate-report-error.ts` → `isAnalyticalActionFailedRemove()` checks code `8004da65` | Given report with filter using attribute, when remove attribute via modeling service fails, then instance NOT crashed, grid view remains | Open report (BCIN-6485) → remove attribute used in filter | PUT /model/reports returns analytical error; grid still displays; error message shown; can continue editing |
| P1 | `shared-recover-from-error.ts` → `shouldRecoverFromError()` | Given modeling service PUT error, verify instance is NOT recreated | Trigger any PUT /model/reports error | No reCreateInstance API call; existing error handling proceeds |

### 4. Prompt Answer Errors — Library Web (from Design Doc §2.2.3)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `ErrorObjectTransform.js` → new `applyReportPromptAnswersFailure` + `DFC_QRYENG_RES_TRUNC` detection; `ActionLinkContainer/index.js` → `CANCEL_AND_GO_BACK_PROMPT` handler | Given prompted report, when prompt answer causes max rows error, then cancel back to prompt | Open prompted report → answer with values causing max rows exceeded | Error dialog shows "OK" and "Cancel" buttons; click Cancel → returns to prompt with previous answers |
| P0 | `ErrorObjectTransform.js` → `isReprompt` check; `ActionLinks.js` → `CANCEL_AND_GO_BACK_REPROMPT` | Given reprompt scenario, when reprompt answer fails with max rows, then cancel back to reprompt | Open report → answer prompt → trigger reprompt → answer with max rows values | Error dialog shows "OK" and "Cancel Reprompt" buttons; click Cancel Reprompt → returns to reprompt |
| P0 | `promptActionCreators.js` → sets `error.applyReportPromptAnswersFailure` + `error.isReprompt` only when `selectIsInReportAuthoringMode` | Given prompt error WITHOUT max rows sub-error, then no cancel-back-to-prompt option | Trigger non-max-rows prompt error | Error shows "OK" and "Email" buttons only; NO "Cancel" button |
| P1 | `ActionLinkContainer/index.js` → `cancelPromptAnswersAndBackToPrompt` | Given prompt-in-prompt error, then cancel back to prompt | Open nested prompt report → answer inner prompt causing error | Returns to prompt with previous answers |
| P0 | `promptActionCreators.js` → `selectIsInReportAuthoringMode` guard | Given same prompt error in consumption mode, then old behavior applies | Trigger prompt error in consumption mode | `applyReportPromptAnswersFailure` flag NOT set; old error handling |
| P1 | `undo-redo-util.ts` → `saveCancelPromptStateId` | After error recovery, cancel prompt still works | Recover from error → trigger reprompt → cancel prompt | `saveCancelPromptStateId` properly set; cancel prompt returns to correct state |

### 5. Error Dialog UI & Behavior (from react-report-editor)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `recreate-error-catcher.tsx` → `componentDidUpdate()` calls `mstrApp.hideWait(true)` | Error dialog dismisses mojo loading indicator | Trigger error while loading indicator active | Loading overlay hidden; OK button clickable |
| P1 | `recreate-error-catcher.tsx` → `SeverityClasses` mapping | Error severity styling correct | Trigger errors of different severities | Each renders with correct CSS class |
| P1 | `recreate-error-catcher.tsx` → `LoginForm` component | Auth error shows login form | Trigger authentication error during manipulation | Login form appears with username/password; valid login dismisses dialog |
| P1 | `recreate-error-catcher.tsx` → `render()` severity CRITICAL check | CRITICAL error hides children | Trigger TypeError or ReferenceError in React | Children NOT rendered; only error dialog shows |
| P1 | `recreate-error-catcher.tsx` → `getPopupJSX()` swallow check | Error with swallow=true not shown | Trigger error matching `IServerIgnoreCodeType` (-2147205027) | No dialog rendered |
| P1 | `recreate-error-catcher.tsx` → details toggle | Show Details toggle works | Trigger error with details → click "Show Details" | Details section toggles visibility |

### 6. Server-Side API — reCreateInstance (from biweb)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `RWManipulationBuilder.java` → `undoHandler` routes `reCreateInstance && stid==-1` | POST reCreateInstance with stid=-1 creates new instance | Send `{ actions: [{ act: "undo", stid: -1, reCreateInstance: true, resolveExecution: true }], noActionMode: true }` | Server routes to `reCreateInstance()`, NOT `undo()`; instance recreated |
| P0 | `RWManipulationImpl.java` → `reCreateInstance()` sets osFlag=8 | osFlag=8 (noActionMode) sent to I-Server | Verify server XML | XML contains `<os>8</os>`; no prompt popup during recreate |
| P1 | `RWManipulationBuilder.java` → stid guard | POST reCreateInstance with stid != -1 does NOT use reCreateInstance path | Send payload with stid=5, reCreateInstance=true | Routes to normal `undo()`, not `reCreateInstance()` |
| P1 | `RWManipulationImpl.java` → existing `cancel()`/`cancelPrompt()` | Existing cancel/cancelPrompt flows unchanged | Run existing cancel tests | No regression; `reCreateInstance=false` param passes through correctly |

### 7. Mojo cmdMgr Reset Guard (from mojojs)

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `RootController.js` → `complete` callback checks `cmdMgr.isReCreateReportInstance` | cancelRequests does NOT reset undo/redo when isReCreateReportInstance=true | Trigger normal manipulation error → observe cancelRequests complete callback | `cmdMgr.reset()` NOT called; undo/redo preserved |
| P0 | `RootController.js` | cancelRequests DOES reset undo/redo when isReCreateReportInstance=false (modeling service) | Trigger modeling service error → observe cancelRequests complete | `cmdMgr.reset()` IS called; undo/redo cleared |
| P1 | `undo-redo-util.ts` → `updateIsReCreateReportInstance()` | Flag lifecycle: set true before API call, false after response | Trace flag through recovery flow | Flag set true → API call → flag set false |

### 8. Scope & Boundary

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `document-view.tsx` → `{!isConsumptionMode && <ReCreateErrorCatcher ...>}` | Consumption mode NOT affected | Open report in consumption mode → trigger error | ReCreateErrorCatcher not rendered; standard error handling applies |
| P0 | `shared-recover-from-error.ts` → `isConsumptionMode` check at top of `recoverReportFromError` | Recovery function skips consumption mode | Trigger recoverable error in consumption mode | `recoverReportFromError` returns `{ handled: false }` |
| P1 | N/A | Dossier (non-report) NOT affected | Open dossier → trigger error | Standard dossier error handling; no report recovery logic interference |
| P1 | N/A | All deployment types (MCE/MEP/MCG/MCP/Tanzu/CMC) | Test error recovery on different deployments | Recovery works consistently |

### 9. Edge Cases & Negative Tests

| Priority | Related Code Change | Acceptance Criteria | Test Key Points | Expected Results |
|----------|---------------------|---------------------|-----------------|------------------|
| P0 | `reCreateReportInstanceThunkHelper` — no try/catch around `service.updateViewTemplate` | Error during reCreateInstance API call itself | Simulate network timeout or server failure during recovery | **Unhandled promise rejection likely** (no try/catch in code). Verify: (1) user does not see blank/crashed screen, (2) existing ErrorCatcher catches the unhandled rejection, (3) escalate to dev team to add try/catch if behavior is ungraceful |
| P1 | `shared-recover-from-error.ts` | Rapid repeated error → recovery cycles | Trigger error → recover → trigger error → recover quickly | Each cycle completes cleanly; no memory leaks, no duplicate dialogs |
| P1 | `shared-recover-from-error.ts` | Multiple different error types in sequence | Max rows error → recover → then modeling error → recover | Each error type handled with correct undo/redo behavior |
| P1 | `recreate-report-error.ts` → `isExceedRowsError` | ExceedRows detection via subError code path | Error with `subErrors` containing `DFC_QRYENG_RES_TRUNC` iServerCode | Correctly identified as exceed rows; recovery triggers |
| P1 | `recreate-report-error.ts` → `isMaximumRowsExceededMessageError` | ExceedRows detection via message string path | Error message containing "Maximum number of results rows per report exceeded" without subError code | Still identified via message matching; recovery triggers |
| P2 | `recreate-report-error.ts` → `ServerAPIErrorCodes.toHex()` | Hex conversion edge cases | Pass NaN, negative ints, hex strings to `toHex()` | NaN → 0; negative int → correct unsigned hex; hex string → correct parse |
| P1 | `shared-recover-from-error.ts` → `isSwitchToDesignMode` check | Error during switch-to-design-mode | Error while switching to unpause mode | `reRenderDocView` NOT set on error (special case handling) |
| P2 | `recreate-error-catcher.tsx` → `onErrorExternal` | External error handler takes priority | External handler returns true | Dialog NOT shown; external handled |
| P2 | `recreate-error-catcher.tsx`, `reCreateReportInstanceThunkHelper` | `window.mstrApp` undefined during error recovery | Trigger error before mstrApp fully initialized | No TypeError crash; error handled gracefully or fallback path taken |
| P1 | `reCreateReportInstanceThunkHelper` → `mstrApp.serverProxy.cancelRequests()` | Concurrent operations during recovery | Trigger error recovery while polling or other operations in-flight | Only error-related requests cancelled; unrelated operations not interrupted |
| P2 | `recreate-error-catcher.tsx` | Error dialog accessibility | Navigate error dialog with keyboard only; test with screen reader | Focus moves to dialog on open; Escape dismisses; screen reader announces error; login form fields labeled |

## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Cross-repo timing: `isReCreateReportInstance` flag set in react-report-editor but read in mojojs via global `window.mstrApp` | High — if flag not set before mojo rebuild completes, cmdMgr.reset() fires incorrectly | Medium | Test with slow/fast network; verify flag lifecycle; add timing traces | `undo-redo-util.ts`, `RootController.js` |
| `cancelRequests()` side effects on unrelated in-flight operations | High — could break parallel features | Medium | Test with concurrent operations active (e.g., auto-save, polling) | `reCreateReportInstanceThunkHelper` line 178 |
| osFlag=8 unknown server behavior edge cases | High — I-Server may have untested edge cases with this new flag | Medium | Coordinate with I-Server team; test with various report types | `RWManipulationImpl.java` → `reCreateInstance()` |
| Circular dependency workaround: actions dispatched by string type `'doc-view/updateManipulationType'` | Medium — fragile if action type strings change | Low | Ensure string matches actual slice name; add comment warning | `shared-recover-from-error.ts` line 195-199 |
| No try/catch around `service.updateViewTemplate` in recovery helper | High — recovery API failure could crash app | Medium | Test network failures during recovery; consider adding error boundary | `reCreateReportInstanceThunkHelper` |
| `ReCreateErrorCatcher` interfering with existing `ErrorCatcher` | Medium — double error handling | Low | Verify only `ReCreateErrorCatcher` handles authoring errors; existing handles others | `document-view.tsx` |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Undo/redo state corruption after recovery | High — user loses edit history unexpectedly | Medium | Verify undo/redo for each error type (modeling vs normal manipulation) | `isReCreateReportInstance` flag |
| State inconsistency between client and server after recreation | High — stid mismatch | Medium | Verify stid synchronization after reCreateInstance | `reCreateReportInstanceThunkHelper` |
| User edits lost despite recovery claim | Critical — defeats purpose of feature | Low | Verify all manipulations preserved after pause mode re-entry | All recovery paths |

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Mojo loading indicator blocks error dialog | Medium — user stuck | Medium | `hideWait(true)` called in componentDidUpdate | `recreate-error-catcher.tsx` |
| Confusing error messages for different error types | Medium — user doesn't understand what happened | Low | Verify error message clarity for each error type | `recreate-report-error.ts` → `GenerateError()` |
| Prompt error "Cancel" button text unclear (TODO in code) | Low — button text says "Cancel" which may be generic | Medium | Review with UX; code has `// TODO lyk` comments | `ActionLinks.js` |

## 📎 Consolidated Reference Data

### 1. Source Documents

**Design & Requirements**:
- [BCIN-6709 Jira Issue](https://microstrategy.atlassian.net/browse/BCIN-6709)
- [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841)

**Implementation**:
- [react-report-editor compare](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) — 14 files, ~1,125 additions
- [mojojs compare](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) — 2 files, 4 additions
- [biweb compare](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport) — 3 files, ~30 additions
- [web-dossier compare](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) — 5 files, ~90 additions

**Related Issues**:
- [F43454](https://microstrategy.atlassian.net/browse/F43454) — Cancel prompt answer and back to prompt (dependency, already implemented)
- [BCIN-974](https://microstrategy.atlassian.net/browse/BCIN-974) — Cartesian join error test case
- [BCIN-6706](https://microstrategy.atlassian.net/browse/BCIN-6706) — SQL failure test case
- [BCIN-6485](https://microstrategy.atlassian.net/browse/BCIN-6485) — Modeling service error test case (attribute in filter)
- [BCEN-4843](https://microstrategy.atlassian.net/browse/BCEN-4843) — Max rows exceeded test case
- [BCEN-4129](https://microstrategy.atlassian.net/browse/BCEN-4129) — MDX/ODBC error test case

### 2. Test Data

**Test Reports Needed**:
- Report exceeding max rows (Results Set Row Limit exceeded)
- Report with SQL failure ([BCIN-6706](https://microstrategy.atlassian.net/browse/BCIN-6706) test object)
- Report with cartesian join error ([BCIN-974](https://microstrategy.atlassian.net/browse/BCIN-974) test object)
- Report with MDX/ODBC error ([BCEN-4129](https://microstrategy.atlassian.net/browse/BCEN-4129) test object)
- Report with filter on attribute ([BCIN-6485](https://microstrategy.atlassian.net/browse/BCIN-6485) test object)
- Prompted report (prompt answers that trigger max rows)
- Report with reprompt flow
- Report with prompt-in-prompt
- Report with unsupported type (analytical engine error 8004da08/8004da0b)

**Server Configuration**:
- Results Set Row Limit: set to low value (e.g., 300) for max rows testing

### 3. Dependencies

- F43454 (Cancel prompt answer) — ✅ Already implemented
- All 4 repos deployed with `revertReport` branch changes
- I-Server support for `<os>8</os>` (noActionMode) flag
- No new feature flags required (NFR-3)

### 4. Key API Contract

```json
{
  "actions": [{ "act": "undo", "stid": -1, "reCreateInstance": true, "resolveExecution": true }],
  "style": { "params": { "treesToRender": "DEFN" }, "name": "RWIVEMojoStyle" },
  "excludeData": false,
  "noActionMode": true,
  "resolveOnly": true,
  "sqlViewMode": false,
  "suppressData": false
}
```

### 5. Error Codes Reference

| Error Code | Type | Severity | Recoverable | Recovery Action |
|------------|------|----------|-------------|-----------------|
| ERR001 (exceed rows) | APPLICATION | INFO | Yes | Recreate instance → pause mode |
| ERR001 (unsupported type) | APPLICATION | INFO | No | "Cannot open report" message |
| ERR003 | AUTHENTICATION | INFO | No | Show login form |
| ERR004 | RESOURCE_NOT_FOUND | ERROR | Yes | Recreate instance → pause mode |
| ERR008 | MSG_RESULT_NOT_READY | ERROR | Yes | Recreate instance → pause mode |
| 8004da22 | ENGINE (ACTION_FAILED) | WARNING | Yes | Recreate instance → pause mode |
| 8004da65 | ENGINE (ACTION_FAILED) | WARNING | Yes | Revert with recovery |
| 8004da08/0b | ENGINE (REPORT_TYPE) | WARNING | No | Cannot open report |
| 8004da03 | ENGINE (DUPLICATE) | WARNING | No | Error message only |
| -2147205027 | IGNORE | — | N/A | Swallowed (no dialog) |
| MSI_DocumentDataPreparationTask_ReportIncomplete + DFC_QRYENG_RES_TRUNC | Prompt answer fail | — | Yes | Cancel prompt → back to prompt |
| MSI_DocumentDataPreparationTask_ReportIncomplete (no max rows) | Prompt answer fail | — | No | OK + Email buttons |

## 🎯 Sign-off Checklist

### 1. Development Team

- [ ] All code reviewed and merged across 4 repos
- [ ] Unit tests passing for new error type system
- [ ] `ServerAPIErrorCodes.toHex()` / `hexToSignedInt32()` unit tested
- [ ] Java compilation verified for modified `refresh()` signature chain

### 2. QA Team

- [ ] All P0 test key points executed and passed
- [ ] All P1 test key points executed (90%+ passed)
- [ ] Cross-repo integration tests passed (5 P0 integration points)
- [ ] Regression: consumption mode unchanged
- [ ] Regression: existing undo/redo works
- [ ] Regression: existing prompt flow works
- [ ] No critical bugs open

### 3. Product Team

- [ ] Error messages reviewed and approved
- [ ] "Cancel"/"Cancel Reprompt" button text finalized (remove `// TODO lyk` comments in `ActionLinks.js`)
- [ ] UX review of error dialog styling

### 4. Security Team

- [ ] No sensitive error details (stack traces, internal codes) leak to end users in production mode
- [ ] Login form in error dialog performs real authentication securely
- [ ] No new attack vectors introduced by error recovery flow

### 5. Release Readiness

- [ ] All 4 repos (`react-report-editor`, `mojojs`, `biweb`, `web-dossier`) merged and deployed together
- [ ] I-Server supports `<os>8</os>` (noActionMode) flag
- [ ] Rollback plan documented (revert all 4 branches)
- [ ] No new feature flags required (confirmed)

## 📝 Notes

### Regression Testing Reminders

- Normal undo/redo still works when no errors occur
- Normal prompt answer flow unchanged when no error occurs
- Consumption mode error handling completely unchanged
- Dossier (non-report) error handling unchanged

### Open Questions

1. What is the expected behavior if the `reCreateInstance` API call itself fails? Code currently has no try/catch — likely results in unhandled promise rejection. **Recommend escalating to dev team to add error boundary.**
2. Are there error types not yet listed that should also trigger recovery?
3. How does this interact with auto-save if implemented in the future?

### Key Design Decisions

- Instance recreation uses `stid=-1` with `noActionMode=true` and `resolveExecution=true` to get a clean instance without data and without prompt resolution
- Prompt error recovery uses the cancel prompt workflow (F43454) rather than instance recreation
- Modeling service errors do NOT crash the instance — handled differently from manipulation errors
- `ReCreateErrorCatcher` is a separate component from existing `ErrorCatcher` to avoid rerender issues in document-view
- `error.applyReportPromptAnswersFailure` flag ensures only authoring mode prompt errors are handled

## 📊 QA Summary

### 1. Code Changes

| Repo | Compare | Files Changed | Key Changes |
|------|---------|---------------|-------------|
| react-report-editor | [m2021...revertReport](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) | 14 files (+1,125) | `ReCreateErrorCatcher`, `shared-recover-from-error.ts`, error type system, undo/redo control, `isModelingServiceManipulation` flag |
| mojojs | [m2021...revertReport](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) | 2 files (+4) | `isReCreateReportInstance` flag to conditionally skip `cmdMgr.reset()` |
| biweb | [m2021...revertReport](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport) | 3 files (+30) | New `reCreateInstance()` method, `<os>8</os>` support, `reCreateInstance` param routing |
| web-dossier | [m2021...revertReport](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) | 5 files (+90) | `CANCEL_AND_GO_BACK_PROMPT/REPROMPT`, error transforms for prompt failures with max rows detection |
