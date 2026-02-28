# Page-by Sorting — Consolidation

**Migrated from WDIO:** `ReportEditor_PageBySorting3.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — Regression test on page by sorting in report editor (Consolidation)

### Steps
1. Edit report by URL (dossier DeveloperPBConsolidationSubcategory)
2. Switch to design mode
3. Verify Seasons text contains "Winter"
4. Open Seasons context menu → Sort
5. Select Sort By: Seasons, verify selection visible
6. Click Done
7. Open Seasons dropdown, verify Winter item visible
8. Open Seasons context menu → Sort
9. Select Order: Descending, verify selection visible
10. Click Done
11. Open Seasons dropdown, verify Fall item visible