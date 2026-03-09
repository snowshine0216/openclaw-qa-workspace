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
| **Plan Status** | Draft v2 (template-aligned for review) |

## 📝 Background

### 1. Key Problem Statement

When a report encounters errors in MicroStrategy Library authoring mode, users are forced to leave the report and reopen it before they can continue. In many of these cases, previous edits are lost. This creates user frustration and has already led to customer escalations.

### 2. Solution

The feature improves error recovery in report authoring mode by recreating the report instance after supported failures, returning the user to a workable state, preserving prior work where appropriate, and allowing prompt-related recovery to return users to the prompt with previous answers preserved.

### 3. Business Context

This is a high-priority quality and usability improvement for Library authoring. It addresses customer pain, reduces recovery time after supported failures, and aims to let users continue editing instead of restarting their work.

## 🎯 QA Goals

### 1. E2E: End to End

- Verify end-to-end recovery from supported report errors in authoring mode.
- Verify users can continue editing after recovery without reopening the report.
- Verify prompt-related recovery returns users to a usable prompt flow.

### 2. FUN: Functionality

- Verify supported error scenarios return the user to pause mode or prompt as designed.
- Verify prior work is preserved when the design says it should be preserved.
- Verify undo/redo behavior changes correctly based on the type of failed action.

### 3. UX: User Experience

- Verify error dialogs are understandable, actionable, and user-friendly.
- Verify the report view remains usable after recovery.
- Verify recovery does not leave users in a blank, stuck, or confusing state.

### 4. PERF: Performance

- Verify recovery completes in an acceptable time for real editing workflows.
- Verify repeated recovery scenarios do not cause visible degradation or endless loading.

### 5. SEC: Security

- Verify end users do not see internal technical details in production-like error messages.
- Verify recovery does not expose sensitive system information in the UI.

### 6. ACC: Accessibility

- Verify the error dialog receives focus and is keyboard accessible.
- Verify users can complete the recovery flow with keyboard navigation.

### 7. CER: Platform Certifications

- Verify supported recovery behavior is consistent in major browsers.
- Verify browser-specific regressions are not introduced by the new recovery flow.

### 8. UPG: Upgrade and Compatibility

- Verify existing consumption-mode behavior is unchanged.
- Verify supported deployment environments can use the new recovery flow without regression.

### 9. INT: Integration

- Verify the full recovery flow works across the involved services and clients.
- Verify follow-up actions work after recovery completes.

### 10. AUTO: Automation

- Cover recovery logic, follow-up behavior, and contract stability in automated tests.
- Add automation for supported prompt-related recovery scenarios where feasible.

## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Recovery state does not complete cleanly after a supported error | Users cannot continue editing | Medium | Validate repeat recovery flows and follow-up actions after each supported error type | `recreate-report-error.ts`, `shared-recover-from-error.ts` |
| Undo/redo behavior does not match the intended recovery rule | Users lose history incorrectly or keep invalid history | Medium | Validate both preserved-history and cleared-history scenarios | `undo-redo-util.ts`, `RootController.js`, `UICmdMgr.js` |
| The report view does not return to a usable state after recovery | Users see a blank or stale page | Medium | Validate the recovered grid and pause-mode layout after each key scenario | `document-view.tsx`, `doc-view-slice.ts` |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Prompt answers are lost after a prompt-related error | Users must re-enter values and may abandon the task | Medium | Validate that prompt answers are preserved when returning to the prompt | `promptActionCreators.js`, `ActionLinkContainer` |
| In-progress report changes are lost when the design expects them to survive | Users lose work unexpectedly | Medium | Validate preserved-work scenarios against the design doc and Jira context | `report-def-slice.ts` |

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Error messages are too technical or vague | Users cannot decide how to continue | Medium | Review final wording against user-observable behavior and recovery guidance | `recreate-error-catcher.tsx` |
| The page remains blocked after an error | Users must refresh or reopen the report | Medium | Validate that the next supported action works after recovery | `serverProxy`, `shared-recover-from-error.ts` |

## 📎 Consolidated Reference Data

### 1. Source Documents

- [BCIN-6709 Jira Issue](https://strategyagile.atlassian.net/browse/BCIN-6709)
- [BCIN-6709 Design Doc](https://microstrategy.atlassian.net/wiki/spaces/~yuanli/pages/5901516841)
- [F43454 Dependency](https://microstrategy.atlassian.net/browse/F43454)
- [react-report-editor PR](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport)
- [biweb PR](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport)
- [mojojs PR](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport)
- [web-dossier PR](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport)

### 2. Stakeholders

- Product Owner: Wei (Irene) Jiang
- QA Owner: Xue Yin
- Design Reviewer: Yuan Li
- Affected customers include JFE Steel, MAXIMUS, MOCOCO, and Riso Kagaku

### 3. Test Data

- Report exceeding the configured row limit
- Report that can reproduce an SQL failure scenario
- Report that can reproduce a Cartesian-join-related failure scenario
- Prompted report that can reproduce a prompt-related error scenario

### 4. Dependencies

- F43454 is a dependency for the prompt-return behavior
- All involved repository changes must be deployed together for integration validation

## 🎯 Sign-off Checklist

### 1. Development Team

- [ ] Code changes reviewed and merged
- [ ] Relevant automated coverage added or updated
- [ ] Documentation updated where needed

### 2. QA Team

- [ ] P1 recovery scenarios executed and passed
- [ ] P2 integration and compatibility scenarios executed
- [ ] No critical blocker remains open
- [ ] Cross-browser validation completed

### 3. Product Team

- [ ] Acceptance expectations validated
- [ ] User-facing error wording reviewed
- [ ] Escalation-sensitive scenarios confirmed

### 4. Security Team

- [ ] No sensitive internal details are exposed in end-user messaging
- [ ] Production-like behavior reviewed for information leakage

### 5. Release Readiness

- [ ] Deployment sequence reviewed
- [ ] Rollback expectations documented
- [ ] Monitoring/support teams aware of the new recovery behavior

## 📊 QA Summary

### 1. Code Changes

| Repo | PR | Files Changed | PR Summary |
|------|----|---------------|------------|
| react-report-editor | [m2021...revertReport](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) | 14 files | Main authoring recovery flow, UI recovery handling, and state management |
| mojojs | [m2021...revertReport](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) | 2 files | Follow-up action handling after recovery |
| biweb | [m2021...revertReport](https://github.com/mstr-kiai/biweb/compare/m2021...revertReport) | 1 file | Replacement-instance support for recovery |
| web-dossier | [m2021...revertReport](https://github.com/mstr-kiai/web-dossier/compare/m2021...revertReport) | 7 files | Prompt-related recovery and error interpretation support |
