# Page-by Sorting — Attribute Forms

**Migrated from WDIO:** `ReportEditor_PageBySorting8.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — X-Fun test on page by sorting (Attribute Forms)

### Steps
1. Edit report by URL (dossier ReportWS_PB_YearCategory2)
2. Switch to design mode
3. Add Employee to Page By from Object Browser (Geography)
4. Open Employee context menu → Sort
5. Verify Sort dialog visible, select Sort By: Employee
6. Open Criteria dropdown, verify Default item visible
7. Click Cancel
8. Remove Employee from report, add Distribution Center to Page By
9. Open Distribution Center context menu → Sort
10. Verify Sort dialog visible, select Sort By: Distribution Center
11. Click Cancel