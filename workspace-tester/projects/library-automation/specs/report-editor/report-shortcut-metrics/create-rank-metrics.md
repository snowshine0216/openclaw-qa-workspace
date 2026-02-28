# Report Editor — Rank Metrics

**Migrated from WDIO:** `ReportEditor_createRankMetrics.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85613_1 — Creating rank metrics

### Steps
1. Edit report by URL (dossier ReportGridShortcutMx)
2. Create Rank for Cost in Metrics dropzone
3. Verify metrics contain "Rank (Cost)"
4. Switch to design mode, verify grid cell (0,0) is "Subcategory"
5. Create Rank for Cost → Descending
6. Verify metrics contain Rank Descending
