# page-by-sorting-5.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ✅ Fixed (re-investigation with playwright-test-healer)
**Failure step:** Step 6 — `selectFromDropdown(1, 'Sort By', selectorName)` at page-by-sorting-5.spec.ts:45 (selecting "Month" in Sort By dropdown)

---

## Summary

Test now passes after enhancing `getDropDownItem` with partial/regex matching and adding explicit wait for the dropdown overlay. For the DeveloperPBHierarchy dossier, the Sort By dropdown displays hierarchy elements with labels that may vary (e.g., "Month (Attribute)" vs. "Month"). The fix uses `usePartialMatch: true` to match labels flexibly and adds `.ant-select-item` to the overlay selectors.

**Root cause:** Selectors / DOM structure — The Sort By dropdown options for hierarchy dossiers use different labels than exact "Month" or "Category". The dropdown overlay needed explicit visibility wait before interacting.

---

## URLs to Verify Manually

- **DeveloperPBHierarchy:** `{reportTestUrl}/app/B628A31F11E7BD953EAE0080EF0583BD/F313C895416AF8DB63206FBE0F2AA47D/edit`
- Example: `https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/F313C895416AF8DB63206FBE0F2AA47D/edit`

---

## Fixes Applied

### 1. report-page-by-sorting.ts — `getDropDownItem`
- **Partial/regex matching:** Added optional `usePartialMatch` parameter. When true, uses `filter({ hasText: new RegExp(item, 'i') })` to match hierarchy labels like "Month (Attribute)" or "Month - Hierarchy".
- **Overlay selectors:** Added `.ant-select-dropdown:visible .ant-select-item`; refactored to use `.filter({ hasText })` for consistent matching across ant-select, ant-dropdown, and PopupList.

### 2. report-page-by-sorting.ts — `openDropdown`
- **Wait for overlay:** Added explicit wait for `.ant-select-dropdown:visible`, `.ant-dropdown:visible`, `.mstrmojo-PopupList:visible` before interacting with dropdown items (similar to page-by-sorting-4 fix for Page By).

### 3. report-page-by-sorting.ts — `selectFromDropdown`
- **usePartialMatch parameter:** Added optional 5th parameter to enable partial matching for Sort By options.
- **dialog getter:** Changed `readonly dialog` to `get dialog()` to fix TypeScript initialization order.

### 4. page-by-sorting-5.spec.ts
- **Sort By fallbacks and partial match:** `selectFromDropdown(1, 'Sort By', selectorName, ['Month', 'Category'], true)` — tries both labels with partial match to handle hierarchy-specific labels.
