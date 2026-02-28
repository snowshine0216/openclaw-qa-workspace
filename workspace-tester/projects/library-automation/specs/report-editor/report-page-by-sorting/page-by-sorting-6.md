# Page-by Sorting — Quick Sorting (Workstation)

**Migrated from WDIO:** `ReportEditor_PageBySorting6.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — X-Fun test on page by sorting (Quick Sorting)

### Steps
1. Edit report by URL (dossier ReportWS_PB_YearCategory1)
2. Switch to design mode
3. Open Year context menu → Sort
4. Verify Sort dialog visible, click Cancel
5. Verify Sort dialog closes
6. Open Page By → Year context menu → Sort Descending
7. Wait 2s, verify Year text is present
8. Open Year context menu → Sort, click Cancel
9. Open Page By → Year context menu → Sort Ascending
10. Wait 2s, verify Year text is present