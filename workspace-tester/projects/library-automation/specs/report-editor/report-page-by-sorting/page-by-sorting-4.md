# Page-by Sorting — Metrics in Page By

**Migrated from WDIO:** `ReportEditor_PageBySorting4.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — X-Fun test on page by sorting (Metrics in Page By)

### Steps
1. Edit report by URL (dossier DeveloperPBMetrics)
2. Switch to design mode
3. Verify Metrics text contains "Profit Margin"
4. Change Page By Year to 2015
5. Open Year context menu → Sort
6. Verify Sort dialog is visible
7. Verify Placeholder column contains "Select" or "object"
8. Open Sort By dropdown, select Year
9. Select Criteria: ID, Order: Descending
10. Click Done
11. Verify Sort dialog closes
12. Verify Metrics text still contains "Profit Margin"