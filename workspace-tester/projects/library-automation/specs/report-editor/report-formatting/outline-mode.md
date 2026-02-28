# Report Outline Mode

**Seed:** `tests/seed.spec.ts`

Migrated from WDIO: `ReportEditor_outlineMode.spec.js`

## Scenarios

### TC88431_1 - FUN | Report Editor | Grid View | Outline Mode
1. Create new report, add Year, Region, Category to rows; Cost, Profit to columns
2. Switch to design mode
3. Verify grid cell texts (Year, Region, Category, Cost, Profit, Mid-Atlantic, Electronics, etc.)
4. Enable outline mode (Format Panel > Layout)
5. Verify outline mode: some cells hidden, totals visible
6. Click outline icon from Year column header
7. Collapse 2014, 2015
8. Enable standard outline mode
9. Verify standard outline mode layout
10. Click outline icon from Year, Region; collapse 2014, 2015

### TC88431_2 - DE241713: Outline mode expand/collapse state persists during column resize
1. Edit ReportPageByContextMenu report
2. Enable outline mode, expand Year
3. Resize columns
4. Verify expand/collapse state persists
5. Collapse 2014, resize column 3
6. Enable standard outline mode, expand Year
7. Resize column, verify state
