# TC85430 Phase 2b Single Test Results

**Test:** page-by-sorting-2.spec.ts (Custom Group)
**Date:** 2026-02-28 18:06
**Status:** ❌ Failed (but major progress!)

## What Worked ✅

1. **Login:** Successful (empty password)
2. **Design Mode:** Successfully activated!
   - Button clicked: `span.mstr-ws-icons.single-icon-library-resume`
   - URL changed to `/edit` mode
   - "Pause Data Retrieval" banner visible
3. **PageBy Rendered:** Year and Custom Categories visible in EDITOR panel
4. **Year Selector:** Found and passed visibility check (line 31)
5. **Year Dropdown:** Opened successfully, 2014 item visible
6. **Custom Categories Dropdown:** Opened successfully, "Category Sales" item visible

## Screenshot Evidence

![Design Mode After Switch](test-results/tc85430-after-design-mode.png)

**Screenshot shows:**
- Top banner: "Pause Data Retrieval" + "EDITOR" tab active
- Left panel: REPORT OBJECTS with ALL OBJECTS search
- Center panel: EDITOR with PageBy (2) section showing Year and Custom Categories
- Right panel: Report grid with Category/Cost data (Books $879,398)
- Bottom: "3 Rows, 1 Columns"

**URL:** `https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/71DF87284DDBAF9B3FD77E84073823EE/K53--K46/edit`

## Where It Failed ❌

**Line 48:** `await reportGridView.clickContextMenuOption('Sort');`

**Error:**
```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('.mstr-context-menu li:has-text("Sort"), .ant-dropdown-menu li:has-text("Sort")...').first() to be visible
```

**Root Cause Analysis:**

The test does:
1. Line 47: `await reportPageBy.openSelectorContextMenu('Year');` - Right-click on Year selector in PageBy panel
2. Line 48: `await reportGridView.clickContextMenuOption('Sort');` - Try to click "Sort" in context menu

**Problem:** Using `reportGridView.clickContextMenuOption()` to click an option from a PageBy context menu. These are different context menus:
- **PageBy selector context menu** - appears when right-clicking Year/Custom Categories in the PageBy panel
- **Grid context menu** - appears when right-clicking grid cells/headers

**Solution Needed:** Use `reportPageBy.clickContextMenuOption('Sort')` instead of `reportGridView.clickContextMenuOption('Sort')`.

## Next Steps

1. Check if `reportPageBy` has a `clickContextMenuOption()` method
2. If not, add it (similar to `reportGridView.clickContextMenuOption()`)
3. Update test to use correct POM method
4. Re-run TC85430

## Progress Summary

**Before fixes:**
- 0/8 pass - PageBy never visible

**After switchToDesignMode + wait logic:**
- Design mode works ✅
- PageBy selectors visible ✅
- Dropdowns functional ✅
- Context menu wrong source ❌

**Estimated fix effort:** 5 minutes (add/use correct context menu method)
