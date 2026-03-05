# Page-by Sorting — Metrics in Page By

**Migrated from WDIO:** `ReportEditor_PageBySorting4.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — X-Fun test on page by sorting (Metrics in Page By)

### Steps
1. Edit report by URL (dossier DeveloperPBMetrics)
2. Switch to design mode
3. Verify Metrics text contains "Profit Margin"
4. Open Year Page By dropdown and verify the dropdown is visible
5. Select Year value `2015`
6. Open Year context menu → Sort
7. Verify Sort dialog is visible
8. Verify Placeholder column contains "Select" or "object"
9. Open Sort By dropdown, select Year
10. Select Criteria: ID, Order: Descending
11. Click Done
12. Verify Sort dialog closes
13. Verify Metrics text still contains "Profit Margin"
