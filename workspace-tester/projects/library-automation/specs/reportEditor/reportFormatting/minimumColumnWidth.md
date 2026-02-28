# Report Editor - Minimum Column Width

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_minimumColumnWidth.spec.js`

## Scenarios

### TC86499 - E2E Minimum Column Width
1. Create report: Category, Year, Country; Cost, Profit
2. Merge repetitive cells, Fit to Container
3. Add minimum column width: Category 250, Year 250, Profit 250
4. Add Country 100, Cost 75
5. Verify grid cell widths
6. Remove Country, Cost minimum width

### TC86500 - FUN Minimum Column Width
1. Create report: Category, Year, Country; Cost, Profit, Revenue
2. Fit to Container
3. Add Category minimum 250, change to 500
4. Invalid values: -@@@, -100 (uses default)
5. Decimal 444.4 → 444px
6. Zero → default
7. 99999 → 99999px
