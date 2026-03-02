# Report Editor — Metric Editor

**Migrated from WDIO:** `ReportEditor_MetricEditor.spec.js`

**Seed:** `tests/seed.spec.ts`

## TC85613_6 — Metric Editor - Create and edit derived metric

### Steps
1. Edit report by URL (dossier ReportGridContextMenu)
2. Open context menu for Cost metric in Metrics dropzone
3. Verify Edit... is NOT displayed for base metric Cost
4. Click "Create Metric..."
5. Switch to Formula mode, verify input contains "Sum"
6. Save metric
7. Switch to design mode
8. Verify "New Metric" visible in Report tab and Metrics dropzone
9. Verify grid (0,0) is "Year", (0,4) is "New Metric"
10. Open context menu for New Metric → Edit...
11. Switch to formula mode, set name to "Test", save
12. Verify "Test" visible in Report tab and Metrics dropzone
