# Report Editor — Percent to Total for Attribute

**Migrated from WDIO:** `ReportEditor_createPercentToTotalForAttribute.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85613_3 — Creating percent to total for each attribute

### Steps
1. Edit report by URL (dossier ReportGridShortcutMxAttrInCols)
2. Expand submenu for Percent to Total in Metrics dropzone → Cost
3. Hover "Total for Each", verify Subcategory is displayed
4. Click Subcategory
5. Verify metrics include "Percent to Total"
6. Switch to design mode
7. Verify grid cell (0,0) has text "Year"
