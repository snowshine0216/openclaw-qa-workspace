# Page By - Part 2: Other Context Menus (TC85476)

**Migrated from WDIO:** `specs/regression/reportEditor/reportPageBy/ReportPageBy2.spec.js`
**Seed:** `tests/seed.spec.ts`

## Scenario TC85476: FUN | Report Editor | Page-by | Other Context Menus

1. Edit report by URL (`ReportPageByContextMenu` dossier) and switch to Design mode.
2. Verify base grid headers (`Year`, `Region`, `Category`, `Cost`).
3. Add `Subcategory` to Page-by and verify selector/grid baseline values.
4. Change `Subcategory` to `Cameras` and verify grid values.
5. Open `Subcategory` context menu and verify options (`Move`, `Add Attributes`, `Sort`, `Drill`).
6. Add `Country` before `Subcategory`; save and verify dropdown values (`USA`, `Web`).
7. Select `USA` and verify grid.
8. Add `Call Center` after `Country`; save and verify selector/grid values.
9. Move `Cost` to Page-by from grid context menu.
10. Add `Profit` to Page-by and verify Metrics dropdown/options.
11. Update Show Metrics (`Cost` off, `Revenue` on) and verify selector/grid values.
12. Change `Call Center` to `San Diego` and Metrics to `Revenue`; verify grid values.
13. Move `Subcategory` left twice; verify selector ordering and menu state.
14. Move `Metrics` left; verify selector ordering.
15. Select `Subcategory=Business`, `Country=Web`, `Metrics=Profit`; verify grid.
16. Select `Subcategory=Pop`; verify grid.
17. Sort `Subcategory` descending and verify `Pop` index.
18. Sort `Call Center` descending and move to Rows; verify grid layout.
19. Move `Country` to Columns and verify final grid layout.
