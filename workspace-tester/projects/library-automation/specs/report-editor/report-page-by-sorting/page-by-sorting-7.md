# Page-by Sorting — Move or Remove PageBy Object

**Migrated from WDIO:** `ReportEditor_PageBySorting7.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85430 — X-Fun test on page by sorting (Move or Remove PageBy Object)

### Steps
1. Edit report by URL (dossier ReportWS_PB_YearCategory1)
2. Switch to design mode
3. Open Year context menu → Sort
4. Verify Sort dialog visible, configure Year + Category as sort rows
5. Click Done, verify dialog closes
6. Open Year context menu → Move (may show dialog), Cancel
7. Remove Year from Page By dropzone
8. Wait 2s
9. Add Year back to Page By from Object Browser
10. Open Category context menu → Sort, verify dialog, Cancel