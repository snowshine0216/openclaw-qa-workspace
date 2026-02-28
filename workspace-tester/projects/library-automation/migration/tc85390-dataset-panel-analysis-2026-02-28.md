# TC85390 Dataset Panel Issue Analysis

**Test:** page-by-sorting-1.spec.ts (TC85390 Acceptance Test)  
**Date:** 2026-02-28 19:09  
**Status:** FAILED - Dataset structure mismatch

---

## Test URL
```
https://mci-pq2sm-dev.hypernow.microstrategy.com/MicroStrategyLibrary/app/B628A31F11E7BD953EAE0080EF0583BD/DD28BFCC4B4A15978F74CEB3C75E8447/K53--K46/edit
```

**Report:** ReportWS_PB_YearCategory2  
**Project ID:** B628A31F11E7BD953EAE0080EF0583BD  
**Dossier ID:** DD28BFCC4B4A15978F74CEB3C75E8447

---

## Issue: "Schema Objects" Folder Doesn't Exist

### Expected Structure (from test)
```
Schema Objects
  ├── Attributes
  │   ├── Time
  │   │   └── Year
  │   └── Geography
  │       └── Region
  └── Metrics
```

### Actual Structure (screenshot evidence)
```
REPORT OBJECTS
  ├── Quarter
  └── Cost

ALL OBJECTS
  ├── Attributes (root level - NO parent folder)
  ├── Metrics (root level)
  ├── Hierarchies (root level)
  └── Data Explorer (root level)
```

**Root Cause:** This report's dataset panel uses a **flat structure** without "Schema Objects" parent folder.

---

## Screenshots

### Full Page (test-results/tc85390-after-design-mode.png)
Shows:
- Design mode active ✅
- Page-by section visible ✅
- Editor toolbar visible ✅
- Dataset panel on left showing "Attributes", "Metrics", etc. at root level ✅

### Dataset Panel Close-up (test-results/tc85390-dataset-panel.png)
Shows:
- **REPORT OBJECTS** section: Quarter, Cost
- **ALL OBJECTS** section: 
  - 📊 Attributes (icon visible)
  - 📊 Metrics (icon visible)
  - 📊 Hierarchies (icon visible)
  - 📊 Data Explorer (icon visible)
- **12 Object** count indicator at top
- No "Schema Objects" folder anywhere

---

## Fix Options

### Option 1: Update Test Logic (Recommended)
Skip "Schema Objects" navigation and go directly to "Attributes":

```typescript
// Before:
await reportDatasetPanel.selectItemInObjectList('Schema Objects');
await reportDatasetPanel.selectItemInObjectList('Attributes');
await reportDatasetPanel.selectItemInObjectList('Time');
await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Year');

// After:
await reportDatasetPanel.selectItemInObjectList('Attributes'); // Open Attributes directly
await reportDatasetPanel.selectItemInObjectList('Time');
await reportDatasetPanel.addObjectFromObjectBrowserToPageBy('Year');
```

### Option 2: Make Helper Resilient
Add optional folder navigation in `selectItemInObjectList()`:

```typescript
async selectItemInObjectList(name: string, skipIfMissing = false): Promise<void> {
  const el = this.getItemInObjectBrowser(name);
  const exists = await el.count() > 0;
  
  if (!exists && skipIfMissing) {
    console.log(`[Dataset Panel] Skipping "${name}" - not found`);
    return;
  }
  
  await el.waitFor({ state: 'attached', timeout: 60000 });
  await el.scrollIntoViewIfNeeded();
  await el.waitFor({ state: 'visible', timeout: 30000 });
  await el.click({ force: true });
  await this.page.waitForTimeout(1000);
}
```

Then update test:
```typescript
await reportDatasetPanel.selectItemInObjectList('Schema Objects', true); // Skip if missing
await reportDatasetPanel.selectItemInObjectList('Attributes');
```

### Option 3: Use Different Test Report
Find a report in the environment that has "Schema Objects" folder structure and update test data configuration.

---

## Recommendation

**Use Option 1** - Update test to match actual environment structure.

**Reasoning:**
- Fastest fix
- Test logic aligns with actual UI
- No helper changes needed
- Only affects this specific test

Apply same fix to TC85430-8 (Attribute Forms test) which has identical dataset panel navigation.

---

## Related Failures

**TC85430 (Attribute Forms - page-by-sorting-8.spec.ts):**
- Same issue: expects "Schema Objects" folder
- Same fix applies

---

## Environment Note

This dev environment (`mci-pq2sm-dev`) uses a different dataset panel structure than the original WDIO test environment. This is a **test data / environment difference**, not a migration bug.

**Action:** Update test expectations to match dev environment structure.
