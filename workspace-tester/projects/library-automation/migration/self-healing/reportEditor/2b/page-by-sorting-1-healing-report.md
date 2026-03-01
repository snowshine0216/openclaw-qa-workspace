# page-by-sorting-1.spec.ts — Healing Report

**Date:** 2026-03-01  
**Status:** ✅ Fixed (re-investigation with actual DOM)

---

## Summary

Test now passes after aligning selectors with the actual MicroStrategy DOM structure (mstrmojo-ReportPageBySelector-Box, .mstrmojo-Label[aria-label="Year"], [role="combobox"]).

---

## Fixes Applied

### 1. report-page-by.ts
- **getSelector:** Added `[aria-label="${selectorName}"]` as primary match (from actual DOM)
- **getSelectorPulldownTextBox:** Direct locator `[class*="ReportPageBySelector-container"]:has(.mstrmojo-Label[aria-label="Year"]) [role="combobox"]`
- **waitForPageByArea:** Wait for `.mstrmojo-ReportPageBySelector-Box` or `[class*="ReportPageBySelector-container"]`

### 2. page-by-sorting-1.spec.ts
- Switched dossier to **DeveloperPBYearAscCustomCategoriesParentTop** (Year + Custom Categories, same as screenshot)
- Criteria for row 2: use **ID** (Custom Categories doesn't have DESC); fallbacks: DESC, Description

### 3. report-page-by-sorting.ts
- **getDropDownItem:** Scope to `.ant-dropdown:visible .ant-dropdown-menu-item` to avoid strict mode (multiple "Year" on page)
- **selectFromDropdown:** Added `fallbacks` parameter for Criteria options (ID, DESC, Description)
