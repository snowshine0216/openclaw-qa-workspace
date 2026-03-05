# Page-by Sorting — Custom Group

**Migrated from WDIO:** `ReportEditor_PageBySorting2.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — Regression test on page by sorting in report editor (Custom Group)

### Steps
1. Edit report by URL (dossier DeveloperPBYearAscCustomCategoriesParentTop)
2. Switch to design mode
3. Verify Year selector pulldown is visible
4. Open Year dropdown, verify 2014 item visible
5. Open Custom Categories dropdown, verify Category Sales item visible
6. Open Year context menu → Sort
7. Verify Sort dialog is visible
8. Configure: Order Descending, Total Position Bottom (rows 1 & 2), Parent Position Default (row 2)
9. Click Done
10. Verify Sort dialog closes
11. Verify Year display text (assertion)