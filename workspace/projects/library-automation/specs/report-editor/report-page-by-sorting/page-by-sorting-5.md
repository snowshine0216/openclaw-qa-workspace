# Page-by Sorting — Hierarchy in Page By

**Migrated from WDIO:** `ReportEditor_PageBySorting5.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC0000_1 — X-Fun test on page by sorting (Hierarchy in Page By)

### Steps
1. Edit report by URL (dossier DeveloperPBHierarchy)
2. Switch to design mode
3. Verify at least one Page-by selector (Month or Category) has display text
4. Open selector context menu → Sort
5. Verify Sort dialog is visible
6. Select Sort By: Month/Category, Criteria: DESC, Order: Descending
7. Click Done
8. Verify Sort dialog closes