# Replace subset report cube

**Source:** WDIO `ReportEditor_replace_cube.spec.js`
**Seed:** `tests/seed.spec.ts`

## Scenarios

1. **[BCIN-6422_01]** UI entry only show in subset report — Cube menu visible in subset report, open Replace Cube dialog; not visible in non-subset report.
2. **[BCIN-6422_02]** Replace by MTDI cube in subset report — Select Airline Data, map objects, verify grid.
3. **[BCIN-6422_03]** Replace by subset cube when creating report — Create from template, replace cube, verify.
4. **[BCIN-6422_04]** Replace by olap cube — Navigate object browser, select Product OLAP cube, map attributes/metrics.
5. **[BCIN-6422_05]** Replace cube when having cube filter — Verify filter panel, replace cube, cube filter removed.
6. **[BCIN-6422_06]** Replace cube when having derived metric and keep definition
7. **[BCIN-6422_07]** Replace cube when having derived metric and remove
8. **[BCIN-6422_08]** Replace cube when having view filter
9. **[BCIN-6422_09]** Replace cube by removing all
10. **[BCIN-6422_10]** undo redo after replace cube

## POMs

- `ReportDatasetPanel`: getThreeDotsToOpenCubeMenu, openSelectCubeDialog, clickBottomBarToLoseFocus, waitForStatusBarText
- `ReportPage`: selectCubeDialog (getDatasetSelectContainer), replaceObjectDialog (for 02-10)
