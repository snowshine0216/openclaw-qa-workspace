# Report Editor — Page and Grand Percent to Total Metrics

**Migrated from WDIO:** `ReportEditor_createPageGrandPercentToTotalMetrics.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85613_2 — Creating page and grand percent to total metrics

### Steps
1. Edit report by URL (dossier ReportGridShortcutMxAttrInCols)
2. Expand submenu for Percent to Total in Metrics dropzone → Cost
3. Verify submenu shows Over Rows, Over Columns, Page Total, Grand Total
4. Switch to design mode, verify grid cell (0,0) is "Year"
5. Create Percent to Total for Cost → Grand Total
6. Verify grid shows "Percent to Grand Total (Cost)"
7. Create Percent to Total for Cost → Page Total
8. Verify metrics include "Percent to Page Total"
