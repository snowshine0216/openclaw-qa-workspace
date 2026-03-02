# TC85390 - Final Root Cause Analysis

**Test:** page-by-sorting-1.spec.ts  
**Date:** 2026-02-28 19:25  
**Finding:** "Schema Objects" folder does NOT exist in this environment

---

## Test URL
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/DD28BFCC4B4A15978F74CEB3C75E8447/K53--K46/edit
```

**Report:** ReportWS_PB_YearCategory2  
**Project:** B628A31F11E7BD953EAE0080EF0583BD  
**Dossier:** DD28BFCC4B4A15978F74CEB3C75E8447

---

## Confirmed: "Schema Objects" Does NOT Exist

### Console Output (Complete List)
```
[TC85390] Total items in object browser: 8
[TC85390] Item 0: "Attributes"
[TC85390] Item 1: "Metrics"  
[TC85390] Item 2: "Hierarchies"
[TC85390] Item 3: "Data Explorer"
[TC85390] Item 4: "My Personal Objects"
[TC85390] Item 5: "Object Templates"
[TC85390] Item 6: "Project Builder"
[TC85390] Item 7: "Project Objects"
[TC85390] Schema Objects count: 0
```

**Result:** "Schema Objects" is confirmed absent.

---

## WDIO Original Test Expected
```javascript
await reportDatasetPanel.selectItemInObjectList('Schema Objects');
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('Time');
await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Year');
```

**Expected hierarchy:**
```
Schema Objects
  └── Attributes
       └── Time
            └── Year
```

---

## Actual Environment Structure

**Root level folders (8):**
```
├── Attributes ← Start here (no parent)
├── Metrics
├── Hierarchies
├── Data Explorer
├── My Personal Objects
├── Object Templates
├── Project Builder
└── Project Objects
```

**No "Schema Objects" parent folder exists.**

---

## Next Steps

1. **Check inside "Attributes"** folder to find where "Year" attribute is:
   ```typescript
   await reportDatasetPanel.selectItemInObjectList('Attributes');
   // Check subfolders (likely "Time" or "01. Date")
   ```

2. **Update test navigation** to skip "Schema Objects":
   ```typescript
   // Before (WDIO):
   await reportDatasetPanel.selectItemInObjectList('Schema Objects');
   await reportDatasetPanel.selectItemInObjectList('Attributes');
   await reportDatasetPanel.selectItemInObjectList('Time');
   
   // After (Playwright, dev env):
   await reportDatasetPanel.selectItemInObjectList('Attributes');
   await reportDatasetPanel.selectItemInObjectList('Time'); // Or '01. Date' if "Time" doesn't exist
   ```

3. **Apply same fix to TC85430-8** (Attribute Forms test) which expects identical structure.

---

## HTML Structure Note

While investigating, we found `.object-item-text` elements have this structure:
```html
<span class="mstr-rc-text-search-highlight object-item-text">
  <span class="">Attributes</span>
</span>
```

**However**, this nested structure is NOT the blocker - the issue is simply that "Schema Objects" doesn't exist in this report's object browser.

---

## Selector Fix Applied

Updated `getItemInObjectBrowser()` to use `.objectBrowserContainer` scope and `getByText()`:

```typescript
// Before:
return this.datasetPanel.locator('.object-item-text').filter({ hasText: /^name$/i });

// After:
const container = this.page.locator('.objectBrowserContainer');
return container.getByText(itemName, { exact: true }).first();
```

This ensures we're searching in the correct panel section.

---

##Conclusion

**Root Cause:** Environment/test data mismatch  
**"Schema Objects" folder does not exist in this MicroStrategy dev environment.**  
**Fix:** Update test to navigate directly to "Attributes" (skip "Schema Objects" step).
