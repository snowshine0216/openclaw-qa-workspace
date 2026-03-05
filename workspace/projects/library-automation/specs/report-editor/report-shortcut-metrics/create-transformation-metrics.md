# Report Editor — Transformation Metrics

**Migrated from WDIO:** `ReportEditor_createTransformationMetrics.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85613_5 — Creating Transformation Metrics

### Steps
1. Edit report by URL (dossier ReportGridContextMenu)
2. Switch to design mode
3. Create Transformation "Last Year's" → Normal for Cost
4. Verify grid cell (0,0) is "Year", (0,3) is "Cost"
5. Create Transformation "Last Year's" → Variance for Cost
6. Verify grid cell (0,0) is "Year"
