# page-by-sorting-6.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ✅ Fixed
**Failure step:** Step 8 — `clickContextMenuOption('Sort')` at page-by-sorting-6.spec.ts:54 (locator matched "Sort Ascending" instead of "Sort")

---

## Summary

Test now passes after fixing `report-page-by.ts` `clickContextMenuOption` to use exact text match for "Sort". The Page By context menu shows both "Sort" (opens Sort dialog) and "Sort Ascending" / "Sort Descending" (quick sort). The previous `has-text("Sort")` matched "Sort Ascending" first (substring match), and that element was hidden (in submenu or different state), causing a 15s timeout.

**Root cause:** Selectors — `has-text("Sort")` is a substring match and matched "Sort Ascending" before "Sort". The matched element was hidden.

---

## URLs to Verify Manually

- **ReportWS_PB_YearCategory1:** `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/5FE3EA2E9F41F5E587B8FB8C03C42809/edit`
- Example: `https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/5FE3EA2E9F41F5E587B8FB8C03C42809/edit`

---

## Fixes Applied

### 1. report-page-by.ts — `clickContextMenuOption`
- **Exact match for "Sort":** When `opt === 'Sort'`, use regex `/^Sort$/` to avoid matching "Sort Ascending" or "Sort Descending".
- **Fallback locator:** Changed from `has-text("Sort")` to `.filter({ hasText: /^Sort$/ })` on `[role="menuitem"]` and menu `li` elements.
- **Other options:** Non-Sort options use escaped regex for the given text.

### 2. page-by-sorting-6.spec.ts (playwright-test-generator alignment)
- Added step comments for all 10 steps.
- Added `waitForPageByArea(30000)` after switch to design mode.
- Aligned describe block and test title with spec.
