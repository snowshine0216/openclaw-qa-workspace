# Page By - Part 2: Other Context Menus (TC85476)

**Seed:** `tests/seed.spec.ts`

## Scenario: FUN | Report Editor | Page-by | Other Context Menus

- Edit report by URL (ReportPageByContextMenu dossier)
- Switch to design mode
- Verify grid cells (Year, Region, Category, Cost at row 0)
- Add Subcategory to Page-by from Object Browser
- Verify page-by selector and grid data for Subcategory "Art & Architecture"
- Change Subcategory to "Cameras"; verify grid data
- Open context menu for Subcategory; verify Move, Add Attributes, Sort, Drill options
- Add Attributes "Before" Subcategory → Country; verify checkbox; save
- Open Country dropdown; verify USA, Web; select USA; verify grid
- Add Attributes "After" Country → Call Center; verify checkbox; save; verify Atlanta
- Move Cost to Page-by from grid column header context menu
- Add Profit to Page-by from In Report tab
- Verify Metrics dropdown has Cost, Profit; verify selector indices
- Show Metrics: uncheck Cost, check Revenue; verify selector and grid
- Change Call Center to San Diego, Metrics to Revenue; verify grid
- Move Subcategory Left twice; verify Add Attributes disabled, Move submenu options
- Move Metrics Left; verify selector order
- Select Subcategory Business, Country Web, Metrics Profit; verify grid
- Select Subcategory Pop; verify grid
- Sort descending Subcategory in PageBy; verify Pop index 7
- Sort descending Call Center; Move Call Center to Rows; verify grid layout
- Move Country to Columns; verify grid layout
