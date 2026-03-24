# Defect Analysis Report — BCIN-7289

**Feature:** Embed Library Report Editor into the Workstation Report Authoring  
**Feature Key:** BCIN-7289  
**Report Date:** 2026-03-21  
**Total Defects:** 26  
**Report State:** DRAFT

---

## 1. Report Header

| Field | Value |
|-------|-------|
| Feature Key | BCIN-7289 |
| Feature Title | Embed Library Report Editor into the Workstation Report Authoring |
| Report Date | 2026-03-21 |
| Total Defects | 26 |
| Open Defects | 13 |
| Resolved Defects | 13 |
| Associated PRs | 15 |
| Repos Changed | 3 (web-dossier, workstation-report-editor, productstrings) |

---

## 2. Executive Summary

This feature replaces the legacy Workstation report editor with the Library report editor (embedded), analogous to how dashboards currently work. The change is significant in scope — touching save/save-as flows, prompt handling, performance, i18n, and UI rendering across two frontend repositories.

**Defect Distribution Table**

| Priority | Total | Done | Open |
|----------|-------|------|------|
| High | 13 | 8 | 5 |
| Low | 11 | 5 | 6 |
| Lowest | 2 | 0 | 2 |
| **Total** | **26** | **13** | **13** |

**Risk Rating: 🔴 HIGH**

13 defects remain open (50% open rate), including 5 High-priority issues. Critical functional areas such as report saving, prompt handling, and Report Builder are still failing. Multiple i18n defects are unresolved. The feature is not yet release-ready.

---

## 3. Defect Breakdown by Status

### ✅ Done (13 defects)

| Key | Priority | Summary |
|-----|----------|---------|
| BCIN-7667 | High | Template report save incorrectly overwrites source template instead of creating new report |
| BCIN-7673 | High | `\n` shows up when converting report into Intelligent Cube / Datamart |
| BCIN-7674 | Low | Window title shows "newReportWithApplication" when creating blank report |
| BCIN-7675 | High | Performance: creating blank report in 26.04 takes 80% longer than 26.03 (9s vs. 5s) |
| BCIN-7677 | High | Save-as report with "do not prompt" still shows prompts |
| BCIN-7680 | Low | After linking to target report, target report not in running mode |
| BCIN-7685 | High | Cannot pass prompt answer in workstation new report editor |
| BCIN-7687 | High | Save-as on newly created subset report throws "instanceId" error |
| BCIN-7691 | Low | After creating report with data retrieval mode and saving to folder, folder not refreshed |
| BCIN-7704 | High | View menu and Format menu in native toolbar missing in new editor |
| BCIN-7707 | High | After save-as report with prompt then discard current answer, report re-runs |
| BCIN-7719 | High | New Intelligent Cube Report: window title should be "New Intelligent Cube Report" |
| BCIN-7724 | High | Throws 400 error when replacing report |

### 🔴 To Do — Open (13 defects)

| Key | Priority | Summary |
|-----|----------|---------|
| BCIN-7668 | Low | Two loading icons when create/edit report (PR #688 open) |
| BCIN-7669 | High | Save-as to override existing report throws JS error: "Cannot read properties of null (reading saveAs)" |
| BCIN-7688 | Low | "Set as template" checkbox disabled when saving newly created report |
| BCIN-7693 | Low | Session timeout shows unknown error and doesn't redirect to login page |
| BCIN-7695 | Low | Tooltip of copy SQL button doesn't show in workstation new report editor |
| BCIN-7708 | Lowest | "Confirm to close" popup not shown when prompt editor is open |
| BCIN-7709 | Lowest | Clicking X button multiple times opens multiple "Confirm to close" popups |
| BCIN-7720 | Low | i18n: Confirm/Cancel button not translated in converting to Intelligent Cube dialog |
| BCIN-7721 | Low | i18n: New Intelligent Cube Report window title not translated for Chinese users |
| BCIN-7722 | Low | i18n: Multiple dialog titles untranslated for non-English users |
| BCIN-7727 | High | Report Builder: fails to load elements in prompt after double-clicking |
| BCIN-7730 | Low | Template report with prompt using pause mode won't run after creation |
| BCIN-7733 | High | Double-clicking to edit report in workstation new editor shows wrong title |

---

## 4. Risk Analysis by Functional Area

| Functional Area | Total | Open | Risk Level | Notes |
|----------------|-------|------|------------|-------|
| Save / Save-As Flows | 7 | 2 (BCIN-7669, BCIN-7688) | 🔴 High | Core save path has multiple defects; BCIN-7669 is a critical JS crash |
| Prompt Handling | 4 | 2 (BCIN-7727, BCIN-7730) | 🔴 High | Prompt pause mode broken; element load failure in Report Builder |
| i18n / Localization | 3 | 3 (BCIN-7720, BCIN-7721, BCIN-7722) | 🟡 Medium | All i18n defects unresolved; blocking for international users |
| UI / Window State | 5 | 3 (BCIN-7693, BCIN-7708, BCIN-7709) | 🟡 Medium | Session handling, confirm dialogs with duplicate popup risk |
| Performance | 1 | 0 | 🟢 Low | BCIN-7675 resolved with PR #684 |
| Toolbar / Menus | 1 | 0 | 🟢 Low | BCIN-7704 resolved (View/Format menus) |
| Edit Report / Title | 1 | 1 (BCIN-7733) | 🟡 Medium | Wrong title on edit could confuse users |
| Tooltip / Minor UI | 1 | 1 (BCIN-7695) | 🟢 Low | Cosmetic, low impact |
| Loading Indicators | 1 | 1 (BCIN-7668) | 🟢 Low | PR open, cosmetic issue |

---

## 5. Defect Analysis by Priority

### High Priority (13 total, 5 open)

**Open High-Priority Defects requiring immediate attention:**

1. **BCIN-7669** — Save-as override throws JS crash (`Cannot read properties of null (reading saveAs)`). Regression risk: any user saving a report will hit a crash when overwriting.
2. **BCIN-7727** — Report Builder fails to load prompt elements after double-click. Blocks report creation with attribute/metric element prompts.
3. **BCIN-7733** — Double-clicking to edit report shows wrong/stale title. UX regression in workstation edit flow.

**Resolved High-Priority (10):** BCIN-7667, BCIN-7673, BCIN-7675, BCIN-7677, BCIN-7685, BCIN-7687, BCIN-7704, BCIN-7707, BCIN-7719, BCIN-7724

### Low Priority (11 total, 6 open)

Primarily cosmetic and i18n issues. The 3 i18n defects (BCIN-7720/21/22) collectively block localized user experience.

### Lowest Priority (2 total, 2 open)

BCIN-7708 and BCIN-7709 both relate to the "Confirm to close" dialog — duplicate popup risk is UX-degrading but not blocking.

---

## 6. Code Change Analysis — PR Impact Summaries

### web-dossier (10 PRs)

| PR | Title | Status | Changes | Risk Area |
|----|-------|--------|---------|-----------|
| #22559 | BCIN-7667: fix template ID not fetched | Merged 2026-03-19 | +167/-27, 7 files | Save/SaveAs flow — high churn in ReportSave.js, ReportSaveAs.js |
| #22560 | BCIN-7673: format msg | Merged 2026-03-19 | +3/-1, 1 file | ReportWorkstationAPIs.js — low risk |
| #22563 | BCIN-7677: fix typo | Merged 2026-03-18 | +3/-3, 1 file | ReportSaveAs.js — minimal risk |
| #22579 | BCIN-7677: fix prompt option | Merged 2026-03-19 | +1/-1, 1 file | ReportSaveAs.js — targeted fix |
| #22582 | BCIN-7708: update z-index | Merged 2026-03-19 | +5/-0, 1 file | ConfirmSaveEditor.js — low risk |
| #22596 | BCIN-7720: retry save with overwrite | Merged 2026-03-20 | +248/-66, 3 files | **High-risk**: ReportSaveAs.js major rework, ReportWorkstationAPIs.js |
| #22603 | BCIN-7695: fix tooltip | Merged 2026-03-20 | +16/-0, 2 files | index.js + SCSS — low risk |
| #22606 | BCIN-7730: fix prompt pause mode | Merged 2026-03-20 | +2/-1, 1 file | dossierPublicSelectors.js — selector fix |
| #22608 | BCIN-7708: increase z-index | Merged 2026-03-20 | +2/-2, 1 file | ConfirmSaveEditor.js — follow-up fix |
| PR for BCIN-7724 | (via BCIN-7720 scope) | — | — | — |

⚠️ **PR #22596 is the highest-risk change**: +248/-66 lines across `ReportSaveAs.js` and `ReportWorkstationAPIs.js`. This implements retry-save-with-overwrite logic and is directly adjacent to the still-open BCIN-7669 crash. Full regression of save flows is required.

### workstation-report-editor (5 PRs)

| PR | Title | Status | Changes | Risk Area |
|----|-------|--------|---------|-----------|
| #684 | BCIN-7675: fix performance | Merged 2026-03-19 | +74/-15, 2 files | index.tsx + styles.css — initialization/CSS optimization |
| #685 | BCIN-7667: pass link params | Merged 2026-03-19 | +17/-0, 1 file | embedding/index.js — additive change |
| #686 | BCIN-7704: new window | Merged 2026-03-19 | +182/-65, 2 files | **High-risk**: main.js + workstation.json major rework for View/Format menus |
| #687 | BCIN-7733: fix edit | Merged 2026-03-20 | +6/-2, 2 files | main.js + workstation.json — title fix |
| #688 | BCIN-7668: update loading icon | **OPEN** | +7/-0, 1 file | styles.css — unmerged, CSS only |

⚠️ **PR #686 is high-risk**: +182/-65 in main.js and workstation.json, implementing new window-level menus. Adjacent to still-open BCIN-7733 edit title issue.

### productstrings (1 PR)

| PR | Title | Status | Changes | Risk Area |
|----|-------|--------|---------|-----------|
| #15114 | BCIN-7704: add new WS menu strings | Merged 2026-03-19 | +117/-0, 2 files | New string keys for View/Format menus — i18n impact |

⚠️ productstrings PR adds 117 new string entries. Combined with 3 open i18n defects (BCIN-7720/21/22), localization coverage is a QA gap.

---

## 7. Residual Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| BCIN-7669 JS crash on save-override | Critical | High | Must fix before release; crash on a core user path |
| BCIN-7727 Report Builder prompt element load failure | High | Medium | Blocks prompt-heavy report creation workflows |
| ReportSaveAs.js churn (PR #22596 +248 lines) | High | Medium | Regression in save/save-as flows likely without full retest |
| 3 open i18n defects across dialogs | Medium | High | All international users affected; strings added but not applied |
| BCIN-7668 PR still open (loading icons) | Low | Low | CSS-only; cosmetic but unmerged |
| BCIN-7733 stale title on edit | Medium | Medium | Poor UX but not data-loss risk |
| Session timeout UX (BCIN-7693) | Low | Medium | Unknown error shown; unfriendly but non-blocking |
| Duplicate confirm popups (BCIN-7709) | Low | Low | Multi-click edge case |

---

## 8. Recommended QA Focus Areas

### 🔴 P0 — Must Verify Before Release

1. **Save-As Override Flow (BCIN-7669)** — Reproduce and confirm fix for JS crash when overwriting existing report.
2. **Template Report Creation + Save (BCIN-7667)** — Verify template save creates a new report, not overwriting source.
3. **Prompt Handling** — Test pass/do-not-prompt, pause mode (BCIN-7677, BCIN-7730), and Report Builder element loading (BCIN-7727).
4. **ReportSaveAs.js full regression** — PR #22596 changed +248/-66 lines; cover: new report save, save-as, overwrite, template save, subset report save.

### 🟡 P1 — Should Verify

5. **i18n coverage** — Run all save/convert dialogs in at least Chinese and one other locale; BCIN-7720/21/22 all unresolved.
6. **Edit report flow** (BCIN-7733) — Double-click to edit in Workstation; verify title correctness.
7. **View/Format menus** (BCIN-7704 area) — Menu presence and functionality after major PR #686.
8. **Intelligent Cube conversion** — BCIN-7673 resolved but conversion flow touched by multiple PRs.

### 🟢 P2 — Nice to Have

9. **Performance baseline** — Confirm new report creation time is back to ≤5s (BCIN-7675 fixed).
10. **Loading indicator** — Single loader on new/edit report after PR #688 merges.
11. **Confirm-to-close dialog** — Verify single popup on X click (BCIN-7709).

---

## 9. Test Environment Recommendations

- **Workstation version:** 26.04 latest build (not 26.03; defects are 26.04-specific regressions)
- **Library backend:** `tec-l-1183620.labs.microstrategy.com` (used in all reproduction steps)
- **Test account:** `bxu` with empty password, **new report editor feature flag enabled**
- **Projects to use:** Platform Analytics Project (perf baseline), any project with prompt-based reports
- **Locales:** Chinese (zh-CN) for i18n defects; default English for core flows
- **New Report Editor flag must be enabled** — all defects in scope require this flag; do not test without it

---

## 10. Verification Checklist for Release

- [ ] BCIN-7669 fixed and save-override verified crash-free
- [ ] BCIN-7727 fixed and Report Builder prompt elements load correctly
- [ ] BCIN-7733 fixed and edit report title correct in Workstation
- [ ] BCIN-7668 PR #688 merged and single loader confirmed
- [ ] BCIN-7720/21/22 fixed or deferred with documented decision
- [ ] BCIN-7708/7709 confirm-close behavior verified (single popup, shown correctly)
- [ ] BCIN-7730 prompt pause mode verified with template reports
- [ ] Full save-as regression suite run against post-PR #22596 build
- [ ] Performance regression check: blank report creation ≤5s

---

## 11. Conclusion

BCIN-7289 (Embed Library Report Editor into Workstation) is a **high-risk, medium-complexity** feature in late-stage stabilization. Of 26 total defects, 13 remain open — exactly 50%. Five open defects are High priority, including a critical JS crash (BCIN-7669), a Report Builder prompt failure (BCIN-7727), and an edit-title regression (BCIN-7733).

The largest PR changes — #22596 (+248/-66 in save logic) and #686 (+182/-65 in editor menus) — require thorough regression. Three i18n defects are fully unresolved and will block international release.

**Recommendation:** Do not release until BCIN-7669 and BCIN-7727 are fixed. Conduct a save-flow regression sweep post-PR #22596 merge. Coordinate with dev on i18n defects timeline; consider deferring BCIN-7720/21/22 to a patch if schedule is tight.

---

## 12. Appendix: Defect Reference List

| Key | Priority | Status | Summary | Jira URL |
|-----|----------|--------|---------|----------|
| BCIN-7667 | High | Done | Template save overwrites source template | https://strategyagile.atlassian.net/browse/BCIN-7667 |
| BCIN-7668 | Low | To Do | Two loading icons when create/edit report | https://strategyagile.atlassian.net/browse/BCIN-7668 |
| BCIN-7669 | High | To Do | Save-as override throws JS crash | https://strategyagile.atlassian.net/browse/BCIN-7669 |
| BCIN-7673 | High | Done | `\n` shows in Intelligent Cube conversion | https://strategyagile.atlassian.net/browse/BCIN-7673 |
| BCIN-7674 | Low | Done | Window title "newReportWithApplication" on blank report | https://strategyagile.atlassian.net/browse/BCIN-7674 |
| BCIN-7675 | High | Done | Blank report creation 80% slower in 26.04 vs 26.03 | https://strategyagile.atlassian.net/browse/BCIN-7675 |
| BCIN-7677 | High | Done | Save-as "do not prompt" still shows prompt | https://strategyagile.atlassian.net/browse/BCIN-7677 |
| BCIN-7680 | Low | Done | Linked target report not in running mode | https://strategyagile.atlassian.net/browse/BCIN-7680 |
| BCIN-7685 | High | Done | Cannot pass prompt answer in new report editor | https://strategyagile.atlassian.net/browse/BCIN-7685 |
| BCIN-7687 | High | Done | Save-as subset report throws instanceId error | https://strategyagile.atlassian.net/browse/BCIN-7687 |
| BCIN-7688 | Low | To Do | "Set as template" checkbox disabled on new report | https://strategyagile.atlassian.net/browse/BCIN-7688 |
| BCIN-7691 | Low | Done | Folder not refreshed after save to folder | https://strategyagile.atlassian.net/browse/BCIN-7691 |
| BCIN-7693 | Low | To Do | Session timeout shows unknown error | https://strategyagile.atlassian.net/browse/BCIN-7693 |
| BCIN-7695 | Low | To Do | Copy SQL tooltip not shown in new editor | https://strategyagile.atlassian.net/browse/BCIN-7695 |
| BCIN-7704 | High | Done | View/Format menus missing in native toolbar | https://strategyagile.atlassian.net/browse/BCIN-7704 |
| BCIN-7707 | High | Done | Discard prompt answer causes report re-run | https://strategyagile.atlassian.net/browse/BCIN-7707 |
| BCIN-7708 | Lowest | To Do | Confirm-close popup not shown when prompt editor open | https://strategyagile.atlassian.net/browse/BCIN-7708 |
| BCIN-7709 | Lowest | To Do | Multiple X clicks opens multiple confirm popups | https://strategyagile.atlassian.net/browse/BCIN-7709 |
| BCIN-7719 | High | Done | New Intelligent Cube Report window title incorrect | https://strategyagile.atlassian.net/browse/BCIN-7719 |
| BCIN-7720 | Low | To Do | i18n: Confirm/Cancel not translated in IC convert dialog | https://strategyagile.atlassian.net/browse/BCIN-7720 |
| BCIN-7721 | Low | To Do | i18n: IC Report window title not translated (Chinese) | https://strategyagile.atlassian.net/browse/BCIN-7721 |
| BCIN-7722 | Low | To Do | i18n: Multiple dialog titles untranslated | https://strategyagile.atlassian.net/browse/BCIN-7722 |
| BCIN-7724 | High | Done | 400 error when replacing report | https://strategyagile.atlassian.net/browse/BCIN-7724 |
| BCIN-7727 | High | To Do | Report Builder: fails to load prompt elements after double-click | https://strategyagile.atlassian.net/browse/BCIN-7727 |
| BCIN-7730 | Low | To Do | Template with prompt pause mode won't run after creation | https://strategyagile.atlassian.net/browse/BCIN-7730 |
| BCIN-7733 | High | To Do | Double-click edit shows wrong title in new editor | https://strategyagile.atlassian.net/browse/BCIN-7733 |
