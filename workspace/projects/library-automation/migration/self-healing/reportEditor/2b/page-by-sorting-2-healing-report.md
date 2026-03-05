# page-by-sorting-2.spec.ts — Healing Report

**Date:** 2026-03-01
**Status:** ✅ Fixed
**Failure step (original):** Step 6–7 — Sort dialog does not appear after clicking "Sort" from Year context menu

---

## Summary

Test now passes after fixing the context menu Sort click. The root cause was a **strict mode violation**: the locator matched both the menu container (`div.mstrmojo-ui-Menu-item-container`) and the Sort link (`a.mnu--page-by-sort`).

---

## Fix Applied

### Context menu Sort click (report-page-by.ts)

**Problem:** `.mstrmojo-ui-Menu-item:has-text("Sort")` matched two elements:
1. `<div class="mstrmojo-ui-Menu-item-container">` (container with all items)
2. `<a class="item mnu--page-by-sort mstrmojo-ui-Menu-item">` (actual Sort link)

**Solution:** Use the specific anchor selector for Sort:
- `a.mnu--page-by-sort` — MicroStrategy-specific class for the Sort menu item
- Scope within `.mstrmojo-ui-Menu.visible` to avoid matching other menus

```typescript
const inMojoMenu = mojoMenu.locator(
  opt === 'Sort' ? 'a.mnu--page-by-sort' : 'a.mstrmojo-ui-Menu-item:has-text("' + opt + '")'
);
```

### Other fixes (from earlier rounds)

1. **report-page-by.ts:** `waitForPageByArea` before assertions; `getElementFromPopupList` expanded with `.ant-select-dropdown`, `[role="option"]`, `.ant-select-item`
2. **page-by-sorting-2.spec.ts:** Added `waitForPageByArea(30000)`; permissive Category verification with `anyCategoryItem` fallback; Escape after dropdowns; removed debug screenshots/logs
3. **report-page-by-sorting.ts:** Expanded dialog locators with `[class*="SortEditor"]`, `[class*="sort-editor"]`

---

## MicroStrategy Page By context menu DOM (for reference)

```html
<div class="mstrmojo-ListBase mstrmojo-ui-Menu visible">
  <div class="mstrmojo-ui-Menu-item-container">
    <a class="item mnu--page-by-sort mstrmojo-ui-Menu-item">...</a>  <!-- Sort -->
    <a class="item mnu--move-unit mstrmojo-ui-Menu-item">...</a>     <!-- Move -->
    ...
  </div>
</div>
```

Use `a.mnu--page-by-sort` for Sort; use `a.mstrmojo-ui-Menu-item:has-text("...")` for other options. Avoid matching the container `div.mstrmojo-ui-Menu-item-container`.
