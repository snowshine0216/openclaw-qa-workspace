# Page-by Sorting — Acceptance Test

**Migrated from WDIO:** `ReportEditor_PageBySorting1.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85390 — Acceptance test on page by sorting in report editor

### Steps
1. Edit report by URL (dossier ReportWS_PB_YearCategory2)
2. Switch to design mode
3. In Object Browser: Schema Objects → Attributes → Time → add Year to Page By
4. Verify Year selector is visible
5. In Object Browser: Geography → add Region to Page By
6. Verify Region selector is visible
7. Open Year context menu → Sort
8. Verify Sort dialog is visible
9. Configure sorting: Year descending (Criteria: ID), Region descending (Criteria: DESC)
10. Click Done
11. Verify Sort dialog closes
12. Verify Year and Region display text (assertions)