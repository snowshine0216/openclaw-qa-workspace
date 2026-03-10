# Comprehensive QA Plan: BCIN-6709 — Improve Report Error Handling for Continued Editing

## 📊 Summary

| Field | Value |
|-------|-------|
| **Feature Link** | [BCIN-6709](https://strategyagile.atlassian.net/browse/BCIN-6709) |
| **Release Version** | 26.04 (2026-04-17) |
| **Priority** | Highest (P0) |
| **QA Owner** | Xue Yin |
| **SE Owner** | Wei (Irene) Jiang |
| **SE Design Link** | [Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens) |
| **UX Design Link** | N/A |
| **GitHub Changes** | 4 repos, 24 files, ~1300+ lines |
| **Date Generated** | 2026-02-28 |
| **Plan Status** | Draft v2 (Reviewed & Approved) |
| **Story Points** | 4.0 |
| **Labels** | Library_Report, Library_and_Dashboards |

## 📝 Background

### 1. Key Problem Statement

**Current Pain Point:**  
When MicroStrategy report instances encounter errors during manipulation (e.g., "Maximum rows exceeded", manipulation failures), the report instance **crashes** and becomes completely unusable. Users are **forced to exit** back to Library home, **losing all unsaved edits**. This requires them to re-open the report and start over from scratch.

**Business Impact:**  
This behavior has generated **4 customer escalations**:
- JFE Steel Corporation (CS1002664)
- MAXIMUS, Inc. (CS0997473)
- MOCOCO, Inc. (CS0987755)
- Riso Kagaku Corporation (CS0991930)

### 2. Solution

**Intelligent Error Recovery System:**

Instead of forcing navigation away, the system will:

1. **Recreate the server document instance** behind the scenes when a manipulation crashes it
2. **Return the user to a safe working state** (Pause Mode or Prompt) with a clear, actionable error message
3. **Preserve user context intelligently**:
   - Keep undo/redo history for **normal manipulation errors** (user can undo the failed operation)
   - Clear undo/redo history for **modeling service errors** (data structure changed, old commands invalid)
   - Preserve **prompt answers** on prompt-related errors
4. **Clean up request queues** to prevent subsequent operations from hanging
5. **Display helpful error messages** explaining what happened and how to proceed

**Technical Implementation (4 Repositories):**

| Repository | Key Changes | Purpose |
|------------|-------------|---------|
| **react-report-editor** | 14 files (~1200 lines) | Error recovery orchestration, undo/redo management, UI state handling |
| **mojojs** | 2 files (+5 lines) | Request queue cleanup, conditional undo/redo reset |
| **biweb** | 3 files (+22 lines) | Server-side `NoActionMode` configuration to support recovery |
| **web-dossier** | 5 files (+84 lines) | Prompt error handling, preserve prompt context |

### 3. Business Context

- **User Impact**: Report authors can continue editing after errors without losing work → **improved productivity**, reduced frustration
- **Technical Scope**: MicroStrategy Library **report authoring mode only** (consumption mode out of scope)
- **Dependencies**: F43454 (cancel prompt answer and back to prompt feature)
- **Success Metrics**: Reduction in customer escalations related to report error handling

---

## 🎯 QA Goals

### 1. E2E: End to End

- Verify complete error recovery workflows from error trigger to successful continuation
- Validate seamless transitions between Pause Mode, Running Mode, and Prompt states
- Test integration across all 4 repositories (react-report-editor, mojojs, biweb, web-dossier)
- Confirm error recovery preserves overall report editing session integrity
- Validate multi-step user workflows: open report → manipulate → error → recover → continue editing

### 2. FUN: Functionality

- Validate all 4 primary error scenarios:
  1. Pause Mode → Resume Data Retrieval failure
  2. Running Mode → Normal manipulation failure
  3. Running Mode → Modeling service manipulation failure
  4. Prompt answer → Get instance failure
- Verify report instance recreation succeeds and restores correct state
- Test undo/redo conditional logic (preserve vs clear based on error type)
- Validate request queue cleanup (`cancelRequests()` prevents hanging)
- Confirm error message display with actionable guidance
- Test NoActionMode configuration from biweb server
- Verify prompt answer preservation on error

### 3. UX: User Experience

- Verify users remain on report editing page (not navigated to Library home)
- Test error dialog/overlay displays clearly during recovery
- Validate document view does not show empty grid after recovery
- Confirm undo/redo buttons behave correctly post-recovery
- Test error messages are user-friendly and actionable
- Verify smooth transition back to Pause Mode or Prompt (no jarring UX)
- Validate visual feedback during recovery process

### 4. PERF: Performance

- Measure error recovery time (target: < 3 seconds for instance recreation)
- Test repeated error/recovery cycles for memory leaks
- Validate no performance degradation after multiple recoveries
- Monitor server-side instance recreation overhead
- Test rapid sequential errors (race condition prevention)

### 5. SEC: Security

- Verify error recovery doesn't expose sensitive instance data
- Test that NoActionMode configuration is correctly scoped (no unauthorized access)
- Validate error messages don't leak internal system details
- Confirm instance recreation maintains same authorization context

### 6. ACC: Accessibility

- Verify error dialog is accessible via screen readers
- Test keyboard navigation during and after error recovery
- Validate focus management when returning to Pause Mode/Prompt
- Ensure error messages meet WCAG 2.1 AA standards

### 7. CER: Platform Certifications

- Test across all deployment types:
  - MCE (AWS, Azure) — VM
  - MEP (OnPrem) — OnPrem
  - MCG (FedRAMP) — Container
  - MCE (GCP) — Container
  - VMWare Tanzu — Container
  - CMC — Container
  - MCP — VM
- Verify browser compatibility: Chrome, Firefox, Safari, Edge

### 8. UPG: Upgrade and Compatibility

- Verify feature works with existing reports (no migration needed)
- Test backward compatibility: reports created before this feature still work
- Validate no impact on embedded SDK reports
- Confirm consumption mode is unaffected (feature scoped to authoring only)

### 9. INT: Internationalization

- Test error messages display correctly in all supported languages
- Verify error dialog localization

### 10. AUTO: Automation

- Automate critical error recovery paths (P0 scenarios)
- Create integration tests spanning all 4 repositories
- Build regression suite for undo/redo state management
- Automate prompt error recovery tests

---

## 🧪 Test Key Points

### 1. Pause Mode → Resume Data Retrieval Failure (Crashed Instance)

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `shared-recover-from-error.ts`: `reCreateReportInstanceThunkHelper` | **TC-01**: User in Pause Mode → clicks "Resume Data Retrieval" → `rebuildDocument` manipulation fails with "Maximum rows exceeded" | Error dialog displayed → user clicks OK → returns to **Pause Mode** (not Library home) → all previous manipulations preserved → can adjust settings and retry |
| P0 | `undo-redo-util.ts`: Conditional reset logic | **TC-02**: After TC-01 recovery, verify undo/redo state | If error caused by **normal manipulation**: undo/redo history **preserved** → user can undo previous operations<br>If error caused by **modeling service manipulation**: undo/redo history **cleared** |
| P0 | `mojojs/ServerProxy.js`: `cancelRequests()` | **TC-03**: After TC-01 error, verify no hanging requests | Click "Resume Data Retrieval" again → new request sends successfully (not blocked by previous error) |
| P0 | `recreate-error-catcher.tsx`: Error boundary component | **TC-04**: Verify error UI during recovery | Error overlay/message displays during instance recreation → "Recovering..." indicator shown → overlay dismisses on completion |
| P0 | `document-view.tsx`: Prevent re-render | **TC-05**: Verify grid view is not empty after recovery | After returning to Pause Mode, document view shows correct content (not empty `<div id="mojo-report"></div>`) |
| P1 | `UICmdMgr.js`: `isReCreateReportInstance` flag | **TC-06**: Rapid clicks on "Resume Data Retrieval" during recovery | Only one recovery executes → no race condition → subsequent clicks ignored until recovery completes |
| P1 | Full flow | **TC-07**: User modifies Advanced Properties (Results Set Row Limit) in Pause Mode → clicks Resume → fails | Instance recreated → returns to Pause Mode → undo/redo **cleared** (modeling service error) → user adjusts row limit → Resume succeeds |

### 2. Running Mode → Normal Manipulation Failure

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `reCreateReportInstanceThunkHelper` | **TC-08**: User in Running Mode → applies filter → manipulation fails | Error displayed → instance recreated → returns to **Pause Mode** → undo/redo **preserved** → user can undo the failed filter |
| P0 | `doc-view-slice.ts`: `reRenderDocView` flag | **TC-09**: After TC-08 recovery, verify document view re-renders | Document view updates to show correct state (not stuck on old view) |
| P0 | `RootController.js`: `isReCreateReportInstance=true` | **TC-10**: After TC-08 recovery, verify undo/redo buttons enabled | Undo/redo buttons functional → user can undo previous successful manipulations |
| P1 | Full flow | **TC-11**: User performs multiple manipulations → last one fails | Recovery triggered → undo/redo preserved → undo stack contains all successful operations before the failed one |

### 3. Running Mode → Modeling Service Manipulation Failure

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `report-def-slice.ts`: Modeling service flag | **TC-12**: User modifies Advanced Properties → `PUT /api/model/reports/{id}` succeeds → `rebuildDocument` fails | Error displayed → instance recreated → undo/redo **cleared** (data structure changed) → returns to Pause Mode |
| P0 | `RWManipulationImpl.java`: NoActionMode config | **TC-13**: Verify server sets `NoActionMode=true` for specific errors | Server response includes `NoActionMode: true` → client does not force navigation → recovery proceeds |
| P0 | `undo-redo-util.ts`: Reset on modeling error | **TC-14**: After TC-12 recovery, verify undo history is empty | No undo/redo actions available → user starts fresh |
| P1 | Related: BCIN-974 | **TC-15**: User adds attribute causing Cartesian join error | Error displayed → recovery → undo/redo cleared → user can adjust report structure |
| P1 | Related: BCIN-6485 | **TC-16**: User removes attribute used in filter (modeling service error) | Instance does **NOT crash** → user can continue editing → grid view displays normally |
| P0 | Design doc §2.2 | **TC-16a**: User modifies report structure → `updateTemplate` manipulation fails (distinct from `rebuildDocument`) | Error displayed → user clicks "Resume Data Retrieval" → UI correctly reverts → undo/redo cleared (modeling service error) |
| P1 | `service.ts`: Modeling service functions | **TC-16b**: User saves report via `saveInstance` → modeling service error occurs | Error displayed → recovery triggered → undo/redo cleared → user can adjust and retry |
| P1 | `service.ts`: Modeling service functions | **TC-16c**: Create new instance via `createInstance` → error occurs | Error displayed → graceful recovery or clear error message |
| P1 | `doc-view-slice.ts`: Flag cleanup | **TC-16d**: Trigger modeling service error (undo/redo cleared) → recover → trigger normal manipulation error | Second error preserves undo/redo (verifies `isModelingServiceManipulation` flag was properly reset to `false`) |
| P1 | Design doc §2.2.2 Issue 4 | **TC-16e**: User adds attribute → error occurs → recovery with undo → undo the add | Attribute removed from both grid **and** report definition panel (verify report data updated after `stid="-1"` undo success) |
| P1 | Related: BCIN-6706 | **TC-16f**: SQL failure error (8004da03 or similar) | Error displayed → recovery to Pause Mode → undo/redo handling correct |
| P1 | Related: BCEN-4129 | **TC-16g**: MDX/ODBC error | Error displayed → recovery to Pause Mode → undo/redo handling correct |

### 4. Prompt Error Handling (Back to Prompt with Preserved Answers)

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `web-dossier/promptActionCreators.js`: `applyReportPromptAnswersFailure` | **TC-17**: User answers prompt → prompt submission succeeds → `GET /api/dossiers/{id}/instances/{id}` fails | Error displayed → user returns to **prompt dialog** → **previous answers preserved** → user can re-submit or adjust |
| P0 | `ErrorObjectTransform.js`: Error code mapping | **TC-18**: Verify prompt-related error codes mapped correctly | Error code from server correctly identified as prompt error → triggers prompt recovery flow (not generic error) |
| P0 | `ActionLinkContainer/index.js`: Action link handling | **TC-19**: User in nested prompt (prompt-in-prompt) → error occurs | Returns to correct prompt level → previous answers preserved |
| P1 | Full flow | **TC-20**: User answers multiple prompts sequentially → last one fails | Returns to last prompt → all previous prompt answers preserved → report does not reload |
| P1 | Related: F43454 | **TC-21**: User cancels prompt answer after error recovery | Prompt cancellation works correctly → no instance corruption |
| P0 | Design doc §2.3.3 | **TC-21a**: Verify prompt recovery sends correct server flags | Network inspector shows: `killJob=true`, `isCancelPromptAnswer=true`, `<os>5</os>`, `<ri>` with `fg=32768` (DssXmlInboxDeleteOnlyGetJobList) |

### 5. Request Queue Management & Concurrent Errors

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `mojojs/ServerProxy.js`: `cancelRequests()` | **TC-22**: Manipulation error triggers recovery → verify `existingRequests` cleaned | `holdRequests` flag set to false → subsequent requests proceed normally |
| P0 | `VisualInsightAppBase.js`: App state management | **TC-23**: User clicks "Resume" → error → immediately clicks "Resume" again | First request cleaned up → second request sends without being blocked |
| P1 | Race condition | **TC-24**: Trigger multiple errors in rapid succession | Only one recovery executes at a time → no state corruption → final state is consistent |
| P1 | Concurrent operations | **TC-25**: Trigger error during in-progress manipulation | Pending operations handled cleanly → no orphaned requests |

### 6. Error Recovery Engine Robustness

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | `recreate-report-error.ts`: Core recovery logic | **TC-26**: Instance recreation itself fails | Graceful fallback → error message shown → user advised to reload or contact support (not infinite loop) |
| P0 | Full flow | **TC-27**: User triggers same error repeatedly (3+ times) | Recovery succeeds each time → no memory leaks → no state accumulation |
| P1 | Edge case | **TC-28**: Error occurs immediately after page load (no undo history) | Recovery succeeds → empty undo/redo state handled gracefully |
| P1 | Edge case | **TC-29**: Error during document view re-render | Recovery aborts gracefully → no React rendering error |
| P1 | Network timeout | **TC-30**: Simulate slow/timeout network during recovery API call | Timeout handled → user shown timeout error → can retry |
| P0 | Design doc §2.3.2 | **TC-30a**: Verify server-side instance recreation protocol | Network inspector or server logs show undo manipulation sent with: `stid="-1"`, `noActionMode: true`, `resolveExecution: true`, `<os>8</os>` without `<ri>` |
| P0 | Design doc §2.4.1 | **TC-30b**: Verify `reCreateInstance` API payload field | Request body to `POST /{id}/instances/{instanceId}/manipulations` includes `reCreateInstance` field when recovery triggered |
| P1 | `doc-view-slice.ts` | **TC-30c**: Verify `reRenderDocView` flag behavior | Running Mode error sets `reRenderDocView=true` → document view re-renders. Pause Mode error does not set flag → no re-render |
| P1 | `VisualInsightAppBase.js` | **TC-30d**: Verify `appState` transitions | Running Mode error recovery sets `mstrApp.appState = DEFAULT` → triggers correct document view update |

### 7. Scope Boundary & Regression Testing

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | Feature scope | **TC-31**: Trigger error in **consumption mode** (out of scope) | Traditional error handling (no recovery) → feature does **not** activate |
| P0 | Regression | **TC-32**: Normal report editing workflow (no errors) | All normal operations work as before → no performance degradation |
| P0 | Regression | **TC-33**: Undo/redo in normal operation (no error) | Undo/redo functions correctly for all manipulation types |
| P1 | Regression | **TC-34**: Prompt/reprompt in normal operation (no error) | Prompt flows work as before → no side effects |
| P1 | Regression | **TC-35**: Save report after error recovery | Report saves successfully → recovered state persists |
| P1 | Regression | **TC-36**: Embedded SDK reports | No impact on embedded reports → error recovery does not interfere with SDK |

### 8. Error Message & UI Validation

| Priority | Related Code Change | Test Key Points | Expected Results |
|----------|---------------------|-----------------|------------------|
| P0 | Error dialog | **TC-37**: Verify error message text for each error type | Messages are user-friendly, actionable, and explain next steps |
| P0 | Error dialog / Design doc §3.4 | **TC-38**: Verify error code mapping matrix — **ERR001 (APPLICATION)** | "Maximum number of rows exceeded" → return to Pause Mode |
| P0 | Error code matrix | **TC-38a**: **ENGINE_ERROR (8004da65)** — Revert report error | Analytical engine failed → recovery to Pause Mode |
| P0 | Error code matrix | **TC-38b**: **ENGINE_ERROR (8004da22)** — ACTION_FAILED | Analytical engine failed → recovery to Pause Mode |
| P0 | Error code matrix | **TC-38c**: **ENGINE_ERROR (8004da08, 8004da0b)** — Unsupported Report Type | "This report type is not supported" → cannot open report (no recovery) |
| P0 | Error code matrix | **TC-38d**: **ENGINE_ERROR (8004da03)** — Duplicate | Analytical engine failed → recovery to Pause Mode |
| P0 | Error code matrix | **TC-38e**: **ERR008 (MSG_RESULT_NOT_READY)** | "An error has occurred while sending a server action" → prompt user to reopen report (no recovery) |
| P0 | Error code matrix | **TC-38f**: **TYPE_ERROR / REFERENCE (CRITICAL)** | "Application code error" / "React render failed" → verify these do NOT trigger recovery (critical errors should fail) |
| P0 | Error code matrix | **TC-38g**: **ERR004 (RESOURCE_NOT_FOUND)** | "Server failed to return object" → verify error handling (no recovery) |
| P0 | Error code matrix | **TC-38h**: **API_ERROR_CODE_MAP (prompt)** | "One or more datasets not loaded" → back to prompt |
| P1 | UI state | **TC-39**: Verify no empty grid after recovery (Issue 3 fix) | Document view shows correct content, not `<div class=""><div id="mojo-report"></div></div>` |
| P1 | Accessibility | **TC-40**: Test error dialog with screen reader | Error message announced correctly, focus moves to OK button |

### 9. Integration Testing (Cross-Repo)

| Priority | Integration | Test Key Points | Expected Results |
|----------|-------------|-----------------|------------------|
| P0 | react-report-editor ↔ mojojs | **TC-41**: Verify `isReCreateReportInstance` flag propagates correctly | Flag passed from React → mojo → RootController → UICmdMgr → conditional undo/redo reset works |
| P0 | react-report-editor ↔ biweb | **TC-42**: Verify `NoActionMode` flag received and respected | Server sends `NoActionMode=true` → client reads it → recovery proceeds (does not force navigation) |
| P0 | react-report-editor ↔ web-dossier | **TC-43**: Verify prompt error triggers React recovery flow | web-dossier error code → React error handler → prompt recovery → preserved answers |
| P1 | All 4 repos | **TC-44**: End-to-end test with all repos deployed | Deploy full stack → trigger each error type → verify recovery across full integration |

### 10. Performance & Memory

| Priority | Test Key Points | Expected Results | Measurement Method |
|----------|-----------------|------------------|-------------------|
| P0 | Error recovery time | Instance recreation completes in < 3 seconds (p95) | Measure from error trigger to "returned to Pause Mode" |
| P1 | Repeated recovery cycles | No memory leaks after 10+ error/recovery cycles | Chrome DevTools memory profiler |
| P1 | Request queue overhead | No significant performance impact from `cancelRequests()` | Measure response time before/after |

---

## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code/Design Reference |
|------|--------|------------|---------------------|----------------------|
| **Race condition in concurrent errors** | Critical | Medium | Test rapid sequential errors → verify single recovery executes → queue subsequent errors | `recreate-report-error.ts`, TC-24 |
| **Undo/redo state corruption** — wrong decision on preserve vs clear | High | Medium | Validate error type classification → test both normal and modeling service scenarios → verify `isReCreateReportInstance` flag | `undo-redo-util.ts`, `RootController.js`, TC-02, TC-10, TC-14 |
| **Request queue deadlock** — `holdRequests` not cleared | High | Medium | Test error → recovery → new manipulation cycle → verify no hanging requests | `ServerProxy.js`, TC-22, TC-23 |
| **Document view empty grid after recovery** (Issue 3) | High | Medium | Verify `<ReCreateErrorCatcher>` component prevents re-render → test TC-05, TC-39 | `document-view.tsx`, `recreate-error-catcher.tsx` |
| **Cross-repo flag propagation mismatch** | High | Medium | Integration testing across all 4 repos → verify flag semantics consistent | TC-41, TC-42, TC-43, TC-44 |
| **Memory leaks in error catcher** | Medium | Low | Repeated error/recovery cycles → monitor memory usage | TC-27, Performance TC |
| **Instance recreation API fails** | Critical | Low | Test error recovery failure fallback → verify graceful degradation | TC-26 |
| **Prompt answers lost on error** | High | Medium | Test TC-17, TC-19, TC-20 → verify preservation across error types | `promptActionCreators.js` |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code/Design Reference |
|------|--------|------------|---------------------|----------------------|
| **User edits lost during recovery** | Critical | Low | Preserve edits in React state → test TC-01, TC-08 → verify no data loss | `doc-view-slice.ts`, `report-def-slice.ts` |
| **Report state inconsistency after recovery** | High | Medium | Test save after recovery (TC-35) → verify state integrity | Full integration |

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Design Reference |
|------|--------|------------|---------------------|------------------|
| **Confusing error messages** | Medium | High | UX review of all error text → user testing → TC-37, TC-38 | Error dialog design |
| **User doesn't understand recovery state** | Medium | Medium | Clear "Recovering..." indicator → test TC-04 | `recreate-error-catcher.tsx` |
| **Jarring transition back to Pause Mode** | Low | Medium | Smooth animation/transition → visual feedback | UX polish |

---

## 📎 Consolidated Reference Data

### 1. Source Documents

**Design & Requirements:**
- [BCIN-6709 Jira Issue](https://strategyagile.atlassian.net/browse/BCIN-6709)
- [Confluence Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841/BCIN-6709+Improve+the+behavior+for+end+user+to+allow+continued+operations+on+report+in+Library+after+error+happens)
- Related Issues: BCIN-974, BCIN-6485, BCIN-6706, BCEN-4129, BCEN-4843, BCIN-6922
- Dependency: F43454 (cancel prompt answer feature)

**Implementation:**
- react-report-editor: `m2021...revertReport` branch (14 files, ~1200 lines)
- mojojs: `m2021...revertReport` branch (2 files, +5 lines)
- biweb: `m2021...revertReport` branch (3 files, +22 lines)
- web-dossier: `m2021...revertReport` branch (5 files, +84 lines)

### 2. Stakeholders

- **SE Owner**: Wei (Irene) Jiang — Technical design
- **QA Owner**: Xue Yin — Test strategy and execution
- **Product Manager**: Lumin Huang — Requirements and business approval
- **Assignee**: Wei (Irene) Jiang — Implementation

### 3. Test Data

**Test Reports Needed:**

| Report Type | Condition | Purpose |
|-------------|-----------|---------|
| Normal report with many rows | Exceeds "Results Set Row Limit" | Test ERR001 exceed rows scenario (TC-01) |
| Report with Cartesian join | BCIN-974 type error | Test ENGINE_ERROR recovery (TC-15) |
| Report with SQL failure | BCIN-6706 type error | Test SQL failure recovery |
| Report with MDX | BCEN-4129 type error | Test MDX/ODBC error recovery |
| Report with prompts | Prompt answer causes error | Test prompt error recovery (TC-17) |
| Report with reprompt | Reprompt answer causes error | Test reprompt flow |
| Report with filter using attribute | Remove attribute used in filter | Test modeling service non-crash error (TC-16) |
| Report with advanced properties | Modify Results Set Row Limit to cause error | Test running mode manipulation error (TC-12) |

**Test Environment:**
- MicroStrategy Library (authoring mode)
- Intelligence Server with report execution capability
- All deployment types: VM (MCE, MEP, MCP), Container (MCG, Tanzu, CMC)
- Browsers: Chrome, Firefox, Safari, Edge

**Test Accounts:**
- Standard user account with report authoring permissions

**Test Report Objects** (from design doc):

| Test Object ID | Purpose | Related TC |
|----------------|---------|------------|
| BCIN-6922 normal report | Row limit exceeded testing | TC-01, TC-07 |
| BCIN-974 report | Cartesian join error (addingattribute causing join conflicts) | TC-15 |
| BCIN-6706 report | SQL failure error testing | TC-16f |
| BCEN-4129 report | MDX/ODBC error testing | TC-16g |
| BCIN-6485 report | Modeling service non-crash error (remove attribute used in filter) | TC-16 |
| Custom test report | Prompt scenarios (for TC-17–TC-21) | Prompt testing |

**Environment URLs** (replace with actual test environment):
- Test Environment: `https://tec-l-[environment-id].labs.microstrategy.com/MicroStrategyLibrary`
- Example from design doc: `http://localhost:8001/MicroStrategyLibrary/app/config/A1C7555FE67448E7B5464FC574D4482C/B7CA92F04B9FAE8D941C3E9B7E0CD754/B30381168A4907792593F5BCAD03AE4A/edit`

### 4. Dependencies

- **Node.js** 22.x ✅ — Frontend runtime
- **MicroStrategy Intelligence Server** ✅ — Report execution
- **Modeling Service** ✅ — Report definition modifications
- **F43454** ⚠️ — Cancel prompt answer and back to prompt feature (status unknown)

---

## 🎯 Sign-off Checklist

### 1. Development Team

- [ ] All 4 repos code reviewed and merged
- [ ] Unit tests passing for new files (`recreate-error-catcher.tsx`, `recreate-report-error.ts`, `shared-recover-from-error.ts`)
- [ ] Integration tests between repos passing
- [ ] Documentation updated (error recovery flow, API changes)
- [ ] No high-severity linter errors

### 2. QA Team

- [ ] All P0 tests executed and passed (TC-01 to TC-38h mandatory, including new v2 additions)
- [ ] All P1 tests executed (90%+ passed, including TC-16a–TC-16g, TC-21a, TC-30a–TC-30d)
- [ ] All error code matrix tests passed (TC-38 through TC-38h)
- [ ] Server-side protocol verification completed (TC-30a, TC-30b)
- [ ] No critical bugs open (P0 severity)
- [ ] No high bugs open in error recovery flow (P1 severity)
- [ ] Regression testing completed (TC-32 to TC-36)
- [ ] Performance benchmarks met (recovery < 3s)
- [ ] Memory leak testing passed (TC-27, Performance TC)
- [ ] Cross-repo integration testing completed (TC-41 to TC-44)

### 3. Product Team

- [ ] All implicit acceptance criteria validated (AC-1 to AC-8)
- [ ] UX reviewed and approved (error messages, transitions)
- [ ] Customer escalation scenarios tested (4 customer cases)
- [ ] Release notes drafted
- [ ] Known limitations documented (authoring mode only)

### 4. Security Team

- [ ] Security scan completed (no sensitive data in error messages)
- [ ] NoActionMode configuration reviewed (no unauthorized access)
- [ ] Instance recreation maintains authorization context

### 5. Release Readiness

- [ ] Deployment plan reviewed (4 repos coordinated deployment)
- [ ] Rollback plan documented (revert all 4 repos if needed)
- [ ] Monitoring alerts configured (error recovery failures)
- [ ] Support team notified (new error handling behavior)
- [ ] Dependency F43454 confirmed available (or contingency plan)

---

## 📝 Notes

**Feature Scope:**
- ✅ **In Scope**: Report authoring mode only
- ❌ **Out of Scope**: Consumption mode, embedded SDK reports

**Known Issues Fixed:**
- Issue 1: `holdRequests` flag stuck after error → fixed with `cancelRequests()`
- Issue 2: Undo/redo reset incorrectly triggered → fixed with `isReCreateReportInstance` flag
- Issue 3: Empty report-editor-grid after revert → fixed with `<ReCreateErrorCatcher>` component

**Next Steps:**
- Complete P0 test execution (expanded from 31 to 44 base TCs + 20 sub-cases in v2)
- Focus on new v2 additions:
  - **P0**: TC-16a (updateTemplate), TC-21a (prompt flags), TC-30a–30b (server protocol), TC-38a–38h (error code matrix)
  - **P1**: TC-16b–16g (modeling service paths, SQL/MDX errors, flag cleanup), TC-30c–30d (reRenderDocView/appState)
- Address any P0/P1 bugs found during testing
- Validate F43454 dependency is available
- Coordinate deployment across 4 repos
- Monitor error recovery success rate post-release
- Collect customer feedback on new error handling

**v2 Changes (2026-02-28):**
Based on QA review feedback (score 8.2/10), addressed **4 P0 gaps** and **6 P1 improvements**:

✅ **P0 Fixes:**
1. Added TC-16a: `updateTemplate` manipulation failure scenario (distinct from `rebuildDocument`)
2. Added TC-30a–30b: Server-side instance recreation protocol verification (`stid="-1"`, `noActionMode`, `resolveExecution`, `reCreateInstance` payload)
3. Expanded TC-38 → TC-38a–TC-38h: Comprehensive error code matrix covering all 12+ documented error types
4. Added TC-21a: Prompt recovery server flag verification (`killJob`, `isCancelPromptAnswer`, `fg=32768`)

✅ **P1 Improvements:**
1. Added TC-16b–16c: Additional modeling service function coverage (`saveInstance`, `createInstance`)
2. Added TC-16d: `isModelingServiceManipulation` flag cleanup verification (modeling→normal sequence)
3. Added TC-16e: Report data update after undo `stid="-1"` success (Issue 4)
4. Added TC-16f–16g: Dedicated SQL failure (BCIN-6706) and MDX/ODBC error (BCEN-4129) test cases
5. Added TC-30c–30d: `reRenderDocView` flag and `appState` transition verification
6. Enhanced Test Data section: Added specific test object IDs/URLs from design doc (BCIN-6922, BCIN-974, etc.)

**Total Test Cases:** 44 base TCs + 20 detailed sub-cases = **64 total test scenarios**

---

## 📊 QA Summary

### 1. Code Changes

| Repository | Files Changed | Key Changes | Risk Level |
|------------|---------------|-------------|------------|
| [react-report-editor](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) | 14 | Error recovery engine (3 new files, ~1030 lines), undo/redo management, document view handling | High |
| [mojojs](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) | 2 | Request queue cleanup, conditional undo/redo reset | High |
| [biweb](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport) | 3 | Server-side NoActionMode configuration | High |
| [web-dossier](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) | 5 | Prompt error handling, back-to-prompt flow | High |

**Total**: 24 files changed, ~1300+ lines added across 4 repositories

---

**Generated by**: QA Plan Synthesize Agent (Atlas Planner)  
**Sources**: Atlassian (Jira + Confluence) + GitHub + Background Research  
**Last Updated**: 2026-02-28 13:15 CST  
**Version**: Draft v2 (reviewed and refactored)  
**Review Score**: v1: 8.2/10 → v2: Pending re-review
