# Report Editor — Workstation Features

**Sources:** 
- https://www2.microstrategy.com/producthelp/Current/workstation/en-us/Content/create_static_reports.htm
- https://www2.microstrategy.com/producthelp/Current/workstation/en-us/Content/report_faqs.htm
- https://www2.microstrategy.com/producthelp/current/workstation/en-us/Content/report_to_cube.htm

## Core Report Creation & Editing
- Open existing report: Navigation pane → Reports → double-click
- Create new report: click + next to Reports → select environment/project
- Select blank report or template (Nov 2025+)
- Add objects (attributes/metrics) via drag-and-drop or double-click from Objects panel
- Drag objects from Workstation window (Projects, Objects, Global Search) directly into editor (Jan 2026+)
- Edit objects inside Report Object/Object Browser panel while in Editor mode (Dec 2025+)
- Metric Names object auto-created in Columns drop zone; can move to Rows

## Data Retrieval Control
- Pause Data Retrieval (default on open for performance)
- Resume Data Retrieval
- Undo/Redo actions (Apr 2025+); disabled during Resume/Pause operations

## Filtering
- Report Filter panel (toggle with Filter button)
- Use existing filter: drag from Objects panel to Filter panel
- Create new filter inline: drag object → define condition → Done
- View Filter: dynamic modification of current report components
- Difference between report filters and view filters

## Page-By
- Page-by panel: optional grouping display
- Group data by page

## Subtotals & Totals
- Quick subtotals: right-click attribute header → Show Totals
- Applied Level at By Position (subtotal per attribute level + grand total)
- Customized subtotals (advanced)
- Custom subtotals name, different subtotal functions

## Formatting
- Format panel: banding, outline, spacing, headers, values, subtotals
- Themes (Dec 2025+): predefined grid formats
  - Template Style and Color
  - Banding
  - Merge Row/Column Headers
  - Spacing
  - Cell formatting (All, Both Axes, Rows, Columns, All Metrics)
  - Theme does NOT save formatting of specific object
  - Apply theme; manually override; re-apply to reset to full theme
- Save Theme (via Save menu)

## Thresholds
- Quick Thresholds Editor
- Advanced Thresholds Editor

## Advanced Properties
- VLDB properties: joins, null display, pre/post SQL statements
- Evaluation Order (Report Properties → Calculation)
- Metric Join Type / Attribute Join Type (right-click on object)
- Null Values (Report Properties → Advanced Properties)
- SQL Generation (Report Properties → Advanced Properties)
- Drilling (Report Properties → Drilling)

## SQL View
- SQL view when report execution is paused
- SQL view in execution mode (Update 6+)
- View a Report's SQL

## Prompts
- Support for prompts (Update 6+)
- Prompt answers display in Report Filters summary
- Standalone prompts as report objects
- Prompt in filter, prompt in metric

## Derived Objects
- Create Derived Metrics in Reports
- Derived elements (note: removed when converting to cube)

## Consolidations & Custom Groups
- Consolidations: group attribute elements in new ways
- Custom groups
- Subtotals right-click on custom group

## Transformations
- Support for transformations (Update 7+)

## Templates (Report Templates)
- Create report based on template (Nov 2025+)
- Blank Report option (if admin hasn't disabled)
- Search for templates; filter Certified Only
- Create Report privilege + Browse/Execute on template file required
- Drilling template (formerly just "template" object)

## Save
- Save: triggers Save As dialog with name + location
- Save As
- After save, data retrieval paused again
- User Comments (description) on save (Jul 2025+)
- Set as Template (Save menu option)
- Save Theme
- Certify / Set as template checkboxes (on new save)

## Export
- Export to PDF
- Export to Excel
- Choose File for export options; Click Share for export options

## Convert to Intelligent Cube (Workstation Only)
- Starting Oct 2025: Convert report → Intelligent Cube
- In editor: click "Create Intelligent Cube" top right → confirm → Save and Publish
- Right-click report → New → Intelligent Cube from...
- Unsupported: Freeform SQL, Subset, Transaction, Incremental refresh, Datamart, MDX reports
- Objects removed on convert: View filter, Derived metrics, Derived elements, Sort, Drillmap, Threshold, Evaluation order, Report limit
- Consolidations/custom groups/prompts → error on convert

## Convert to Datamart (Workstation Only)
- Convert report to datamart (legacy feature, available in WS)

## Drilling
- Drill maps
- Link drill
- Link to a Report / Document / Dashboard

## Open in Python / SQL Editor
- Open report in Python editor
- Open report in SQL editor (Freeform SQL / Query Builder)

## New Report Types
- Standard report
- Subset report (from dataset)
- Freeform SQL report
- Python query report
- New report via Workstation main menu

## Accessibility
- Full accessibility compliance in Library for consumption

## Privileges Required
- Use analytics
- Use Report Editor
- Web create new Report
- Modify the list of Report objects (use object browser)
- Create application objects (to create)
- Create Report + Browse/Execute on template (for template-based creation)
- Use Intelligent Editor privilege (for convert to cube)

## MDX Cubes
- MDX Objects panel: add metrics from MDX Cube sources
- MDX reports (cannot convert to cube)
