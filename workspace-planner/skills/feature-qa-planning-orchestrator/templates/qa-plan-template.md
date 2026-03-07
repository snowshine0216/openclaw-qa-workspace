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
| **Date Generated** | 2026-02-27 (updated 2026-03-02) |
| **Plan Status** | Draft v3 (Fixed — user-facing rewrite) |

## 📝 Background

### 1. Key Problem Statement


### 2. Solution



### 3. Business Context



## 🎯 QA Goals

### 1. E2E: End to End

- Verify complete error → recovery → continue editing flow for each error type (max rows, SQL failure, analytical engine, prompt)
- Validate cross-repo integration: react-report-editor → biweb (Java) → mojojs → web-dossier


### 2. FUN: Functionality

- Validate all 10 functional requirements from design doc (FR-1 through FR-10)
- Verify reCreateInstance API payload creates a clean instance without data and without prompt resolution


### 3. UX: User Experience

- Verify error dialog shows clear, appropriate messages for each error type
- Validate error dialog severity styling (info, warning, error, critical)


### 4. PERF: Performance

- Verify error recovery completes without visible delay beyond the reCreateInstance API call


### 5. SEC: Security

- Verify login form in error dialog performs real authentication via `service.login()`
- Confirm no sensitive error details (stack traces, internal codes) leak to end users in production mode

### 6. UPG: Upgrade and Compatibility

- Verify all deployment types supported: MCE, MEP, MCG, MCP, Tanzu, CMC
- Confirm backward compatibility: existing error handling in consumption mode is unchanged

### 6. ACC: Accessibility

- Error dialog receives focus when it appears; focus is trapped within the dialog


### 7. CER: Platform Certifications

- Verify error recovery behavior consistent across supported browsers (Chrome, Firefox, Safari, Edge)
- Verify no platform-specific JavaScript errors in error type conversion functions (`toHex`, `hexToSignedInt32`)

### 8. UPG: Upgrade and Compatibility

- Verify all deployment types supported: MCE, MEP, MCG, MCP, Tanzu, CMC
- Confirm backward compatibility: existing error handling in consumption mode is unchanged
- Verify existing ErrorCatcher still works for non-reCreate errors

### 9. AUTO: Automation

- Run regression for XXXX
- Add XXX to new feature automion


## ⚠️ Risk & Mitigation

### 1. Technical Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Cross-repo timing: `isReCreateReportInstance` flag set in react-report-editor but read in mojojs via global `window.mstrApp` | High — if flag not set before mojo rebuild completes, cmdMgr.reset() fires incorrectly | Medium | Test with slow/fast network; verify flag lifecycle; add timing traces | `undo-redo-util.ts`, `RootController.js` |

### 2. Data Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Undo/redo state corruption after recovery | High — user loses edit history unexpectedly | Medium | Verify undo/redo for each error type (modeling vs normal manipulation) | 

### 3. UX Risks

| Risk | Impact | Likelihood | Mitigation Strategy | Code Reference |
|------|--------|------------|---------------------|----------------|
| Mojo loading indicator blocks error dialog | Medium — user stuck | Medium | `hideWait(true)` called in componentDidUpdate | `recreate-error-catcher.tsx` |


## 📎 Consolidated Reference Data

### 1. Source Documents

**Design & Requirements**:
- [BCIN-6709 Jira Issue](https://microstrategy.atlassian.net/browse/BCIN-6709)


**Implementation**:
- [react-report-editor compare](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) — 14 files, ~1,125 additions
- [mojojs compare](https://github.com/mstr-kiai/mojojs/compare/m2021...revertReport) — 2 

**Related Issues**:
- [F43454](https://microstrategy.atlassian.net/browse/F43454) — Cancel prompt answer and back to prompt (dependency, already implemented)


### 2. Test Data

**Test Reports Needed**:
- Report exceeding max rows (Results Set Row Limit exceeded)
- Report with SQL failure ([BCIN-6706](https://microstrategy.atlassian.net/browse/BCIN-6706) test object)


**Server Configuration**:
- Results Set Row Limit: set to low value (e.g., 300) for max rows testing

### 3. Dependencies

- F43454 (Cancel prompt answer) — ✅ Already implemented
- All 4 repos deployed with `revertReport` branch changes

### Regression Testing Reminders

- Normal undo/redo still works when no errors occur
- Normal prompt answer flow unchanged when no error occurs


### Open Questions

1. What is the expected behavior if the `reCreateInstance` API call itself fails? Code currently has no try/catch — likely results in unhandled promise rejection. **Recommend escalating to dev team to add error boundary.**
2. Are there error types not yet listed that should also trigger recovery?


### Key Design Decisions

- Instance recreation uses `stid=-1` with `noActionMode=true` and `resolveExecution=true` to get a clean instance without data and without prompt resolution
- Prompt error recovery uses the cancel prompt workflow (F43454) rather than instance recreation


## 📊 QA Summary

### 1. Code Changes

| Repo | Compare | Files Changed | Key Changes |
|------|---------|---------------|-------------|
| react-report-editor | [m2021...revertReport](https://github.com/mstr-modules/react-report-editor/compare/m2021...revertReport) | 14 files (+1,125) | 

