# Comprehensive QA Plan: BCIN-6709 — Improve Report Error Handling for Continued Editing

## 📊 Summary

| Field | Value |
|-------|-------|
| **Feature Link** | [BCIN-6709](https://strategyagile.atlassian.net/browse/BCIN-6709) |
| **Release Version** | 26.04 (2026-04-17) |
| **QA Owner** | Xue Yin |
| **SE Design Link** | [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841) |
| **UX Design Link** | N/A |
| **GitHub PR Links** | [react-report-editor](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport), [biweb](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport), [mojojs](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport), [web-dossier](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) |
| **Date Generated** | 2026-03-07 |
| **Plan Status** | Draft v1 (Test Generation) |

## 📝 Background

### 1. Key Problem Statement

When a report encounters errors in MicroStrategy Library authoring mode, users must exit the report and reopen it to continue working. **All previous edits are lost.** This causes frustration and has generated customer escalations including:
- JFE Steel Corporation (CS1002664)
- MAXIMUS Inc. (CS0997473)
- MOCOCO Inc. (CS0987755)
- Riso Kagaku Corporation (CS0991930)

### 2. Solution

Instead of forcing users out on error, the system will:
1. **Recreate the server document instance** behind the scenes when manipulation crashes it
2. **Return user to pause mode or prompt** with clear error message
3. **Preserve undo/redo history** where applicable (normal manipulations keep history; modeling service manipulations clear it)
4. **Handle prompt errors gracefully** by returning to prompt with previous answers preserved

### 3. Business Context

- **User Impact**: Users can continue editing reports after errors without losing work
- **Business Value**: Addresses customer escalations and support tickets
- **Technical Scope**: React-report-editor, mojo, biweb, web-dossier (4 repos)
- **Scope Constraint**: Report authoring mode ONLY (consumption mode out of scope)

## 🎯 QA Goals

### 1. E2E: End to End

- Verify complete error → recovery → continue editing flow for each error type
- Validate cross-repo integration: react-report-editor → biweb (Java) → mojo → web-dossier
- Test all manipulation types (normal, modeling service, prompt-related)
- Confirm user never loses work inappropriately

### 2. FUN: Functionality

- Validate error recovery completes successfully for all error types
- Verify undo/redo state management rules (preserve vs. clear)
- Test prompt error flow (back to prompt with answers preserved)
- Confirm NoActionMode flag handling from server
- Verify request queue cleanup after error

### 3. UX: User Experience

- Verify error dialogs show clear, actionable messages
- Validate loading states during recovery
- Ensure no empty grid or stuck states
- Test error severity styling (info, warning, error)
- Confirm no internal error details exposed in production

### 4. PERF: Performance

- Verify recovery completes within acceptable time (<2 seconds ideal)
- Test rapid sequential errors (no race conditions)
- Validate no memory leaks on repeated error/recovery cycles
- Confirm network request cleanup

### 5. SEC: Security

- Verify no stack traces exposed in error messages
- Confirm no internal class/method names in user-facing errors
- Test error handling in production mode vs. dev mode
- Validate no sensitive data in error logs

### 6. ACC: Accessibility

- Error dialog keyboard navigable
- Focus management during error/recovery flow
- Screen reader announces error messages

### 7. CER: Platform Certifications

- Verify error recovery across supported browsers (Chrome, Firefox, Safari, Edge)
- Confirm no platform-specific JavaScript errors
- Test error code conversion functions (toHex, hexToSignedInt32)

### 8. UPG: Upgrade and Compatibility

- Verify consumption mode error handling unchanged (no regression)
- Test all deployment types: MCE, MEP, MCG, MCP, Tanzu, CMC
- Confirm backward compatibility with older instances

### 9. INT: Integration

- Cross-repo integration testing (all 4 repos together)
- API contract validation (reCreateInstance, rebuildDocument)
- Error code mapping consistency (web-dossier → react-report-editor)

### 10. AUTO: Automation

- Unit tests for recoverReportFromError(), reCreateReportInstanceThunkHelper
- Integration tests for request queue cleanup, undo/redo state management
- API contract tests for reCreateInstance endpoint

## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Race condition in error recovery (multiple errors fire simultaneously) | State corruption, undefined behavior | Medium | Test rapid sequential errors, concurrent manipulations | recreate-report-error.ts, recreate-error-catcher.tsx |
| Undo/redo inconsistency (wrong reset decision based on error type) | User loses work or has stale commands | Medium | Verify error type classification correct for each scenario | undo-redo-util.ts, RootController.js, UICmdMgr.js |
| Request queue deadlock (holdRequests not cleared) | All subsequent requests blocked, app frozen | Medium | Test error → recovery → new manipulation cycle | mojo serverProxy, cancelRequests() |
| Cross-repo integration mismatch (flag semantics differ) | Recovery flow breaks silently | Medium | Integration test across all 4 repos together | isReCreateReportInstance flag across repos |
| Memory leaks in error catcher (component unmount during async recovery) | Growing memory usage over time | Low | Test repeated error/recovery cycles | ReCreateErrorCatcher component |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Unsaved property changes lost during recovery | User loses uncommitted edits | Medium | Verify property state preservation | report-property-slice.ts |
| Report definition state corruption after recovery | Report uneditable or shows wrong state | Medium | Validate report-def-slice state updates | report-def-slice.ts |

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Empty grid after recovery (reRenderDocView fails) | User sees blank screen | Medium | Test document-view re-render edge cases | document-view.tsx, doc-view-slice.ts |
| Confusing error messages | User doesn't know how to proceed | Medium | UX review of all error message text | recreate-error-catcher.tsx |
| Indefinite loading state if recovery hangs | User stuck, must refresh page | Low | Implement timeout with fallback error | shared-recover-from-error.ts |

## 📎 Consolidated Reference Data

### 1. Source Documents

**Design & Requirements**:
- [BCIN-6709 Jira Issue](https://strategyagile.atlassian.net/browse/BCIN-6709)
- [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841)
- [F43454 Dependency](https://microstrategy.atlassian.net/browse/F43454) — Cancel prompt answer and back to prompt (already implemented)

**Implementation**:
- [react-report-editor PR](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) — 14 files, ~1,300 additions
- [biweb PR](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport) — Server-side recovery support
- [mojojs PR](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) — Request queue cleanup
- [web-dossier PR](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) — Prompt error handling

**Related Issues**:
- BCIN-974 — Cartesian join errors
- BCIN-6706 — SQL failure errors
- BCEN-4129 — MDX errors

### 2. Stakeholders

- **Product Owner**: Wei (Irene) Jiang — Implementation
- **QA Owner**: Xue Yin — Test strategy and execution
- **Design Reviewer**: Yuan Li — Design doc author
- **Affected Customers**: JFE Steel, MAXIMUS, MOCOCO, Riso Kagaku

### 3. Test Data

**Test Reports Needed**:
- Report exceeding max rows (Results Set Row Limit exceeded)
- Report with SQL failure (BCIN-6706 test object)
- Report with Cartesian join risk (conflicting attributes)
- Report with prompt requiring answer

**Server Configuration**:
- Results Set Row Limit: set to low value (e.g., 300 rows) for testing
- Advanced Properties: modify to trigger various error scenarios

### 4. Dependencies

- **F43454 (Cancel prompt answer)**: ✅ Already implemented
- **All 4 repos deployed with revertReport branch changes**: Required for integration testing

## 🎯 Sign-off Checklist

### 1. Development Team

- [ ] All code reviewed and merged
- [ ] Unit tests passing (target: 80%+ coverage)
- [ ] Documentation updated
- [ ] No high-severity linter errors

### 2. QA Team

- [ ] All P1 tests executed and passed
- [ ] All P2 tests executed (90%+ passed)
- [ ] No critical bugs open
- [ ] Cross-browser testing completed
- [ ] Integration testing (all 4 repos) completed

### 3. Product Team

- [ ] All acceptance criteria validated
- [ ] Error messages reviewed and approved
- [ ] Customer escalation scenarios verified
- [ ] Release notes drafted

### 4. Security Team

- [ ] No sensitive error details exposed
- [ ] Production error handling verified
- [ ] No security vulnerabilities introduced

### 5. Release Readiness

- [ ] Deployment plan reviewed
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Support team notified of new error handling behavior

## 📊 QA Summary

### 1. Code Changes

| Repo | PR | Files Changed | Key Changes |
|------|----|---------------|-------------|
| react-report-editor | [m2021...revertReport](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) | 14 files (+~1,300) | Error recovery engine, error catcher UI, Redux state management |
| mojojjs | [m2021...revertReport](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) | 2 files | isReCreateReportInstance flag handling, cancelRequests() |
| biweb | [m2021...revertReport](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport) | 1 file | Server-side NoActionMode config, reCreateInstance() |
| web-dossier | [m2021...revertReport](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) | 7 files | Error code mapping, prompt back-to-prompt flow |

### 2. Test Coverage Summary

- **Total Test Scenarios**: ~50 (across all categories)
- **P1 (Code Change)**: 18 scenarios (~36%)
- **P2 (Integration/XFUNC)**: 26 scenarios (~52%)
- **P3 (Edge Cases)**: 6 scenarios (~12%)
- **AUTO (Unit/API)**: Covered in automation suite

### 3. Risk Level

**Overall Risk**: **High**
- Cross-repo integration complexity
- Undo/redo state management critical for user experience
- Customer escalation resolution

**Mitigation**: Comprehensive integration testing across all 4 repos, phased rollout recommended

---

**Generated by**: QA Plan Synthesize (Test Mode)  
**Sources**: GitHub + Atlassian + Background Research  
**Last Updated**: 2026-03-07  
**Version**: Draft v1

**Next Steps**:
- Execute P1 tests (code change scenarios)
- Run cross-browser integration tests
- Validate error messages with UX team
- Obtain stakeholder sign-offs
