# Page By - Part 1 (TC81156_1)

**Migrated from WDIO:** `specs/regression/reportEditor/reportPageBy/ReportPageBy1.spec.js`
**Seed:** `tests/seed.spec.ts`

## Scenario TC81156_1: FUN | Report Editor | Editor Panel | Page-by

1. Create a new report by URL.
2. Open the object browser hierarchy (`Schema Objects`/`Public Objects` fallback), then navigate to `Attributes` -> `Geography` when available.
3. Add `Region`, `Manager`, and `Employee` to Page-by.
4. Add `Call Center` to Columns.
5. Navigate up one folder and select `Products`.
6. Add `Category` to Rows.
7. Switch to Design mode.
8. Verify Page-by selector values:
`Region = Central`, `Manager = Lewandowski:Allister`.
