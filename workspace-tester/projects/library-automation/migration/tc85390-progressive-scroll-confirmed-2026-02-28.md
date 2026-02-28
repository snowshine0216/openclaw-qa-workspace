# TC85390 - Progressive Scroll Confirmed No "Schema Objects"

**Date:** 2026-02-28 19:47  
**Final Status:** "Schema Objects" folder confirmed absent after progressive scroll

---

## Progressive Scroll Implementation

Updated `selectItemInObjectList()` to:
1. Scroll down in 150px increments
2. Check for item after each scroll
3. Stop when scrollTop stops changing (bottom reached)
4. Scroll back to top and do final check

**Code:** `tests/page-objects/report/report-dataset-panel.ts`

---

## Test Results

```
[Dataset Panel] "Schema Objects" not visible, progressive scrolling...
[Dataset Panel] Reached bottom, "Schema Objects" not found
[Dataset Panel] "Schema Objects" not found after 2 attempts, scrolling to top...
[Dataset Panel] "Schema Objects" count at top: 0
```

**Outcome:** Container scrolled to bottom in 2 attempts (2 × 150px = 300px), confirmed no "Schema Objects" folder exists.

---

## Conclusion

**"Schema Objects" folder does NOT exist in this report's object browser**, even after:
- ✅ Progressive scroll to bottom
- ✅ Full scroll to top
- ✅ Multiple search attempts with `.objectBrowserContainer` scope
- ✅ `getByText()` with exact match

**Root Cause:** Test data / environment mismatch  
**WDIO test:** Written against environment with "Schema Objects" parent folder  
**Dev environment:** Has flat structure (no "Schema Objects")

---

## Fix Applied

**Test updated to skip "Schema Objects" and navigate directly to "Attributes":**

```typescript
// Original WDIO:
await reportDatasetPanel.selectItemInObjectList('Schema Objects');
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('Time');

// Updated for dev environment:
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('Time');
```

**Progressive scroll helper will benefit other tests** that need to find items scrolled out of view.

---

## Next: Check "Time" Folder

Now need to verify "Time" folder exists inside "Attributes" or update to actual folder name (e.g., "01. Date").
