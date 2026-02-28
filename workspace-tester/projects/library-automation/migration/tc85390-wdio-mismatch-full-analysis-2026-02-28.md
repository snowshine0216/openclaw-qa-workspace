# TC85390 WDIO vs Environment Mismatch - Full Analysis

**Test:** page-by-sorting-1.spec.ts (TC85390 Acceptance Test)  
**Date:** 2026-02-28 19:22  
**Root Cause:** Test data environment mismatch

---

## WDIO Original Test Structure

**Source:** `projects/wdio/specs/regression/reportEditor/reportPageBySorting/ReportEditor_PageBySorting1.spec.js`

**Expected Navigation (lines 28-32):**
```javascript
await reportDatasetPanel.selectItemInObjectList('Schema Objects');
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('Time');
await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Year');
```

**Expected Hierarchy:**
```
Schema Objects
  └── Attributes
       └── Time
            └── Year ← target attribute
```

---

## Actual Environment Structure (Screenshots)

### Initial Dataset Panel
**Screenshot:** `test-results/tc85390-dataset-panel.png`

**Structure:**
```
REPORT OBJECTS
  ├── Quarter
  └── Cost

ALL OBJECTS
  ├── Attributes ← NO "Schema Objects" parent!
  ├── Metrics
  ├── Hierarchies
  └── Data Explorer
```

### Inside "Attributes" Folder
**Screenshot:** `test-results/tc85390-after-open-attributes.png`

**Structure:**
```
Attributes
  ├── 00. BaseObjects
  ├── 01. Date ← NOT "Time"!
  ├── 01. Zeit
  └── 02. Artikel
```

---

## Mismatch Summary

| Expected (WDIO) | Actual (Dev Env) | Status |
|----------------|------------------|--------|
| Schema Objects folder | No parent folder | ❌ Missing |
| Attributes folder | Attributes (root level) | ✅ Exists (wrong level) |
| Time folder | 01. Date folder | ❌ Missing (different name) |
| Year attribute | ??? | ❓ Unknown (need to check inside "01. Date") |

---

## Root Cause

**This is a test data / environment difference, NOT a migration bug.**

The WDIO test was written against a different MicroStrategy environment with:
- Hierarchical dataset panel structure ("Schema Objects" parent folder)
- "Time" folder containing "Year" attribute

The current dev environment (`mci-pq2sm-dev.hypernow.microstrategy.com`) has:
- Flat dataset panel structure (no "Schema Objects" parent)
- "01. Date" folder (possibly containing "Year" or similar)

---

## Fix Strategy

### Option 1: Update Test to Match Environment (Recommended)
Navigate according to actual structure, checking what's inside "01. Date":

```typescript
// Skip "Schema Objects" - doesn't exist
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('01. Date'); // Instead of "Time"
// Then check what attributes are inside - likely "Year" or similar
```

### Option 2: Find Correct Report
Use a different report that has the expected "Schema Objects" → "Attributes" → "Time" → "Year" structure.

Update test data:
```typescript
const d = reportPageBySortingData.dossiers.ReportWS_PB_WithCorrectStructure; // New report
```

### Option 3: Skip Test
Mark as environment-specific and skip in this dev environment:

```typescript
test.skip('[TC85390] Acceptance test...', () => {
  // Skipped: requires "Schema Objects" → "Attributes" → "Time" structure
  // Current dev env has flat structure with "01. Date" instead
});
```

---

## Next Steps

1. **Check inside "01. Date" folder** - take screenshot to see if "Year" attribute exists there
2. **If "Year" is in "01. Date":** Update test to use correct folder name
3. **If "Year" doesn't exist:** Find which attribute should be used instead (or use different report)
4. **Apply same fix to TC85430-8** (Attribute Forms test) which has identical structure dependency

---

## Command to Check Inside "01. Date"

```typescript
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('01. Date');
await libraryPage.page.screenshot({ path: 'test-results/tc85390-inside-date-folder.png' });
```

---

**Conclusion:** Test expects WDIO environment structure. Need to adapt test to match dev environment's actual folder names and hierarchy.
