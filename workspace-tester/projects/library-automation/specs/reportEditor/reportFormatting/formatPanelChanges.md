# Format Panel Changes

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_formatPanelChanges.spec.js`

## Scenarios

### TC86198 - Functional [Report Editor] Formatting
1. Create report: Year, Category, Subcategory; Cost, Profit, Profit Margin
2. Verify default styles (background-color)
3. Format Panel: template classic Blue
4. Text format: Columns/Values (font, bold, size, align)
5. Cost/Headers: underline
6. Year/Values: border style/color
7. Rows/Values: italic
8. Profit/Headers: bold
9. Toggle italic, bold

### TC86199 - E2E create report, apply formatting, save and reopen
1. Create report: Year, Cost
2. Apply text format (bold, size, color)
3. Rows/Headers: bold, italic, size
4. Year/All: bold, italic, size
5. Cost/All: bold, italic, size
6. All/All: borders, bold, italic, size, color
7. Cost/Values, Cost/Headers, Year/Headers/Values variations
8. Verify all grid cell styles
