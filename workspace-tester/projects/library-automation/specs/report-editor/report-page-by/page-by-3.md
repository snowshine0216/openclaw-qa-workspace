# Page By - Part 3: Show Totals (TC81156_6)

**Migrated from WDIO:** `specs/regression/reportEditor/reportPageBy/ReportPageBy3.spec.js`
**Seed:** `tests/seed.spec.ts`

## Scenario TC81156_6: FUN | Page by with show totals

1. Open report by URL (`PageByMultiplePBShowTotal` dossier).
2. Set `Category` Page-by selector to `Total`.
3. Verify `Subcategory` selector is at expected baseline (environment may load `Art & Architecture` or persisted `Business`).
4. Set `Subcategory` to `Business`.
5. Verify grid values for the selected context:
`(1,0) = Working With Emotional Intelligence`, `(1,1) = $20,819`, and the next detail row contains `$5,914`.
