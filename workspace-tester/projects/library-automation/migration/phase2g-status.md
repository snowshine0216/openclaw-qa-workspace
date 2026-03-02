# Phase 2g (report-theme) — Self-Healing Run Status

**Date:** 2026-02-28  
**Specs:** themeApply.spec.ts, themeGeneral.spec.ts, themeSecurity.spec.ts  
**Total tests:** 23 (10 + 12 + 1)

## Run Command

```bash
npm run test:report-theme
# or: npx playwright test tests/specs/report-editor/report-theme/ --project=report-theme
```

## Status Summary

| Spec | Tests | Last Known | Notes |
|------|-------|------------|-------|
| themeApply.spec.ts | 10 | — | BCIN-6490_01–10: apply theme, undo/redo |
| themeGeneral.spec.ts | 12 | — | BCIN-6488_01–12: panel, auto style, certified, tooltip |
| themeSecurity.spec.ts | 1 | — | BCIN-6493_01: privilege check |

## task.json (Pre-Run)

- **Pass:** 3 (files, not individual tests)
- **Fail:** 0
- **Last run:** 2026-02-28

## Self-Healing Run (2026-02-28)

- **Initiated:** Full suite run started (`npm run test:report-theme`)
- **Output:** Run in progress (~15+ min for 23 tests); × and F seen in terminal (possible failures)
- **task.json:** 3 pass, 0 fail (3 spec files)
- **Action:** If failures detected, run `npx playwright show-report` after completion and fix locators/flows per failing spec

## POMs / Test Data

- **POMs:** ReportThemePanel, ReportMenubar, ReportTOC.switchToThemePanel, NewFormatPanelForGrid
- **Test data:** tests/test-data/report-editor/report-theme.ts
