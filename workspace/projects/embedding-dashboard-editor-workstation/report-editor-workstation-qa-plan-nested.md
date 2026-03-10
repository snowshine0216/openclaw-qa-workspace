# Report Editor in Workstation — QA Plan (Nested) (BCED-2416 / F43445)

## EndToEnd

### E2E: Create New Report & Save P1
- Enable New Dashboard Editor
  - Go to Help menu
  - Click "Enable New Dashboard Editor" toggle
- Create new report
  - Click + icon next to Reports
  - Select environment and project
  - Select blank report and click Create
- Add objects and execute
  - Drag attributes and metrics from Objects panel into editor
  - Click Resume Data Retrieval
- Apply filter
  - Drag a filter object to the Filter panel and click Apply
- Save ⚠️ P1
  - Click Save
  - Enter report name and target folder, click Save
  - Check folder view without refreshing

### E2E: Edit Existing Report P1
- Open report
  - Double-click an existing report
- Edit objects
  - Add a metric and remove an attribute
  - Modify the filter condition
- Save and verify ⚠️ P1
  - Click Save
  - Close the report and reopen it

### E2E: Create Report from Dataset P2
- Create from dataset
  - Right-click a dataset
  - Select Create Report
- Create subset report
  - Right-click the same dataset
  - Select New Subset Report
- Save
  - Click Save, choose folder, confirm

### E2E: Convert Report to Intelligent Cube P1
- Create and execute report
  - Create and execute a standard report with attributes and metrics
- Convert to cube
  - Click Create Intelligent Cube in the top-right of the editor
  - Click Yes, then click Save and Publish
- Verify
  - Navigate to Datasets page
  - Reopen original report

### E2E: Freeform SQL Report Lifecycle P1
- Create Freeform SQL report
  - Go to main menu, click New, click Freeform SQL Report
  - Write a valid SQL statement, map columns to objects, click Execute
- Save
  - Click Save
- Attempt cube conversion ⚠️ P1
  - Attempt to convert this report to an Intelligent Cube

### E2E: Python Query Report Lifecycle P1
- Create Python query report
  - Go to main menu, click New, click Python Query Report
  - Enter a Python script and click Execute
- Open existing Python query report
  - Open an existing Python query report, click Open in Python Editor
- Save
  - Click Save

### E2E: Upgrade Flow — pre-25.08 Server P1
- Connect to pre-25.08 server
  - Connect Workstation to a pre-25.08 server
- Open and edit report
  - Open a report for editing
  - Perform save, execute, and export
- Stability check ⚠️ P1
  - Close and reopen the report multiple times

---

## Core Functionalities

### Editor Launch & Entry Points P1
- Enable toggle ⚠️ P1
  - Open Help menu
  - Click "Enable New Dashboard Editor" toggle
- Open on 25.08+ server P1
  - Connect to a 25.08+ server and open a report for editing
- Open on pre-25.08 server P1
  - Connect to a pre-25.08 server and open a report for editing
- Context menu entry points
  - Right-click a report, select Edit
  - Right-click a report, select Edit Without Data
  - Right-click a report and inspect the context menu ⚠️ P1
- New report entry points
  - Click + icon next to Reports
  - Go to main menu, click New, click Freeform SQL Report
  - Go to main menu, click New, click Python Query Report
  - Right-click a dataset, click New, click Subset Report

### Report Templates P2
- Create from blank P2
  - Click Create, select Blank Report
- Create from template P2
  - Click Create, select a template, click Create
- Search templates P2
  - Type a keyword in the template search field
- Filter templates P2
  - Enable Certified Only filter in template selector
- Admin-disabled blank template P2
  - With admin-disabled blank template, open the create dialog
- Save as template P2
  - Open an existing report, open Save menu, click Set as Template
  - Start a new report and browse templates

### Objects Panel & Object Management P2
- Add attributes P2
  - Drag an attribute from Objects panel into the editor
  - Double-click an attribute in the Objects panel
- Add metrics P2
  - Drag a metric from Objects panel into the editor
  - Double-click a metric in the Objects panel
- Metric Names object P2
  - Add first metric to an empty report
  - Drag the Metric Names object from Columns to Rows
- Drag from external sources P2
  - Drag an object from the Projects window into the editor (Jan 2026+)
  - Drag a result from Global Search into the editor
  - Drag an object from the Object Browser into the editor
- Edit object inline P2
  - Right-click an object in the Report Object panel, click Edit (Dec 2025+)
  - Trigger the edit notification for the first time
  - Right-click the edited object and check permissions

### Filtering P2
- Open/close filter panel P2
  - Click the Filter button
  - Click the Filter button again
- Apply filters P2
  - Drag an existing filter from Objects panel to the Filter panel
  - Drag an object to the Filter panel, define a condition, click Done
  - Set filter conditions of type equals, greater than, less than
  - Modify filter while data retrieval is active, click Apply
- View Filter P2
  - Go to View menu, click View Filter
  - Modify the View Filter
  - Compare report filter and view filter on the same report

### Prompts P2
- Execute prompted report P2
  - Execute a prompted report
- Standalone prompt P2
  - Add a standalone prompt object to a report and execute
- Filter prompt P2
  - Create a filter containing a prompt, execute report
- Metric prompt P2
  - Create a metric containing a prompt, execute report
- Nested prompt P2
  - Execute a report with a prompt nested inside another prompt
- Prompt summary (Mar 2025+) P2
  - Answer prompts and check the Report Filters summary panel
- Page-by with prompts P2
  - Configure page-by on a prompted report, answer prompts, navigate pages

### Data Retrieval & Execution P1
- Open and pause P1
  - Open a report in the editor
- Resume retrieval P1
  - Click Resume Data Retrieval
- Pause retrieval P1
  - Click Pause Data Retrieval
- Undo/Redo state during retrieval ⚠️ P2
  - Click Resume Data Retrieval, then immediately check Undo/Redo button state

### SQL View P2
- View SQL while paused P2
  - Open a report in paused state, open the SQL tab
- View SQL while executing P2
  - Click Resume Data Retrieval, open the SQL tab
- Review SQL content P2
  - Review SQL view content

### Subtotals & Totals P2
- Enable subtotals P2
  - Right-click an attribute column header in the report
  - Click Show Totals, set Applied Level to By Position
- Customize subtotals P2
  - Open subtotals settings, customise function and name
- Toggle subtotal scope P2
  - Switch between All Subtotals and Selected Subtotals
- Advanced subtotals P2
  - Configure advanced subtotals on a page-by report

### Formatting & Themes P2
- Format panel P2
  - Click the Format button
  - Adjust banding, outline, spacing, headers, values, and subtotals settings
- Themes (Dec 2025+) P2
  - Click the Themes icon
  - Hover over a theme in the gallery, click Apply
  - Manually override a cell format after applying a theme
  - Re-apply the same theme
- Save theme P2
  - Open Save menu, click Save Theme, check if object-specific formatting is included
  - Verify saved theme in Themes panel on another report

### Thresholds P3
- Quick thresholds P3
  - Open Quick Thresholds Editor, define a rule, click Apply
- Advanced thresholds P3
  - Open Advanced Thresholds Editor, define a complex rule, click Apply
- Thresholds + cube conversion P2
  - Add thresholds to a report, attempt Convert to Intelligent Cube

### Advanced Properties (VLDB) P2
- Open dialog P2
  - Open Advanced Properties dialog
- Join types P2
  - Right-click a metric, set Metric Join Type
  - Right-click an attribute, set Attribute Join Type
- Display settings P2
  - Set Null Values display in Advanced Properties
  - Change SQL Generation setting
- Report properties P2
  - Open Report Properties, navigate to Calculation tab, set Evaluation Order
  - Open Report Properties, navigate to Drilling tab, configure drilling settings
  - Enter Pre and Post SQL statements

### Page-By P2
- Add page-by P2
  - Drag an attribute to the Page-By drop zone
- Navigate pages P2
  - Navigate between pages
- Persistence P2
  - Close and reopen the report in Library (same user)
- Reset P2
  - Click the page-by reset control

### Derived Objects P2
- Derived metric P2
  - Click + to create a Derived Metric inside the report
  - Execute report with the derived metric
- Derived metric + cube ⚠️ P2
  - Add a derived metric to a report, attempt Convert to Intelligent Cube
- Derived elements P2
  - Create derived elements and add to report
- Derived elements + cube ⚠️ P2
  - Add derived elements to a report, attempt Convert to Intelligent Cube

### Consolidations & Custom Groups P2
- Consolidations P2
  - Drag a consolidation from Objects panel into the report
  - Execute report with consolidation
  - Right-click the consolidation, select Object Display / Subtotals
- Custom groups P2
  - Drag a custom group into the report
- Cube conversion block ⚠️ P2
  - Add custom groups or consolidations, attempt Convert to Intelligent Cube

### Transformations P2
- Add transformation P2
  - Drag a transformation object into the report
- Execute with transformation P2
  - Execute report with transformation

### Drilling & Links P2
- Drill map P2
  - Execute a report with a drill map configured, click a data cell to drill
- Link drills P2
  - Configure a link drill targeting a Report, click the link
  - Configure a link drill targeting a Document, click the link
  - Configure a link drill targeting a Dashboard, click the link
- Toolbar after navigation ⚠️ P2
  - Navigate to another dashboard via a link, then use the toolbar
- Same-tab link ⚠️ P2
  - Click a same-tab link inside the editor
- Link while editor open ⚠️ P2
  - Click a link to another dashboard while editor is open
- Drillmap + cube P2
  - Add a drillmap to a report, attempt Convert to Intelligent Cube

### MDX Reports P2
- MDX Objects panel ⚠️ P2
  - Open the MDX Objects panel in the embedded WS editor
- Add MDX metric P2
  - Drag a metric from the MDX Objects panel into the report
- Execute MDX report P2
  - Execute the MDX report
- MDX cube conversion P2
  - Attempt to convert an MDX report to an Intelligent Cube

### Undo / Redo P2
- Undo actions P2
  - Add an object to the report, click Undo
  - Change a number format, click Undo
  - Change the page-by selection, click Undo
- Redo actions P2
  - Click Redo after each of the above undos
- Retrieval state effect P2
  - Click Resume Data Retrieval, check Undo/Redo button state
  - Make any object or format change after the above

### Save & File Operations P1
- Save new report ⚠️ P1
  - Click Save on a new unsaved report
  - Enter report name and target folder, click Save
  - Check folder immediately after save (BCED-3149) ⚠️ P1
- Save As ⚠️ P1
  - Click Save As
  - Choose a different folder and confirm (BCVE-1621)
- Save button states P2
  - Check Save button when only one save action is available (BCED-3142)
  - Check Save button when multiple save options exist
- Save dialog options P2
  - Check save dialog for a new dashboard
  - Enter a User Comment in the save dialog (Jul 2025+)
- Save as template P2
  - Open Save menu, click Set as Template
- Save theme P2
  - Open Save menu, click Save Theme

### Convert to Intelligent Cube (Workstation Only) P1
- Verify button ⚠️ P1
  - Open a standard report in the editor, check the top-right area
- Initiate conversion P1
  - Click Create Intelligent Cube
  - Click Yes, then click Save and Publish
  - Navigate to Datasets page
- Alternative entry point P1
  - Right-click a report, select New, click Intelligent Cube from...
- Blocked conversions ⚠️ P1
  - Open a Freeform SQL report, attempt Convert to Intelligent Cube
  - Attempt Convert to Cube on Subset, Transaction, Incremental Refresh, Datamart, and MDX reports
- Warning for removable objects ⚠️ P1
  - Open a report with view filter, derived metrics, sort, drillmap, threshold, and evaluation order, attempt Convert to Intelligent Cube
  - Open a report with consolidations, custom groups, or prompts, attempt Convert to Intelligent Cube

### Convert to Datamart (Workstation Only) P1
- Verify menu item ⚠️ P1
  - Open a report, check for Convert to Datamart in menu
- Initiate conversion P1
  - Click Convert to Datamart, select target database
  - Confirm the conversion

### Export P2
- Export to PDF P2
  - Open File menu, click Export, click PDF
  - Verify PDF content and layout
- Export to Excel P2
  - Open File menu, click Export, click Excel
  - Open the exported Excel file
- Share menu export P2
  - Open Share menu, click Export to PDF
  - Open Share menu, click Export to Excel
- Download .mstr P2
  - Open File menu, click Download .mstr

### Python Query Reports P1
- Create ⚠️ P1
  - Go to main menu, click New, click Python Query Report
  - Enter a Python script, click Execute
- Open existing P1
  - Open an existing Python query report, click Open in Python Editor
- Save P1
  - Click Save
- Server-based mode ⚠️ P1
  - Use a Python data source on a WS server-based dashboard (BCED-2873)

### Freeform SQL Reports P1
- Create ⚠️ P1
  - Go to main menu, click New, click Freeform SQL Report
  - Enter a SQL statement in the editor
  - Map SQL columns to report objects
  - Click Execute
- Save P1
  - Click Save
- Cube conversion ⚠️ P1
  - Attempt Convert to Intelligent Cube
- Open existing P1
  - Open an existing Freeform SQL report, click Open in SQL Editor

---

## X-function Tests

### Save + Certify / Template Interaction P2
- Inspect save dialog P2
  - Save a new report, inspect the Save dialog
- Certify P2
  - Check Certify, click Save
- Set as template P2
  - Check Set as Template, click Save

### Filter + Prompt Interaction P2
- Execute with filter-prompt P2
  - Create a filter containing a prompt, execute the report
  - Answer the prompt, verify report data
- Re-execute P2
  - Reset prompt answers, re-execute

### Themes + Format Panel Interaction P2
- Apply theme then override P2
  - Apply a theme, then manually override a cell format
  - Re-apply the same theme
- Save theme with override P2
  - Apply a manual override, then open Save menu, click Save Theme

### Drilling + Toolbar Interaction P2
- Post-navigation toolbar ⚠️ P2
  - Navigate to another dashboard via a link, then use the toolbar
- Same-tab link ⚠️ P2
  - Click a same-tab link
- Drill and return P2
  - Drill into a linked report, then navigate back

### Page-By + Subtotals Interaction P2
- Subtotals per page P2
  - Add a page-by attribute, enable subtotals, navigate to first page
  - Switch to a different page

### Consolidations + Subtotals Interaction P2
- Custom group subtotals P2
  - Right-click a custom group, enable Subtotals
- Consolidation subtotals P2
  - Right-click a consolidation, enable Subtotals

### Convert to Cube + ACL Interaction P1
- With privilege P1
  - Log in as a user with "Use Intelligent Editor" privilege, open a report
- Without privilege ⚠️ P1
  - Log in as a user without the privilege, open the same report

### Export + Theme Interaction P2
- Theme in PDF P2
  - Apply a theme, export to PDF
- Theme in Excel P2
  - Apply a theme, export to Excel

### Undo/Redo + Data Retrieval Interaction P2
- Undo after retrieval ⚠️ P2
  - Click Resume Data Retrieval, then immediately click Undo
- Undo after format change P2
  - Make a format change after retrieval state change

### Python / SQL Editor + Report Objects Interaction P1
- Add object to Python report ⚠️ P1
  - Add an object to a Python query report
- Toggle views P1
  - Toggle between report grid view and Python editor view

### MDX + Report Objects Interaction P2
- MDX + regular metric P2
  - Add an MDX metric and a regular metric to the same report
- MDX + regular attribute P2
  - Add an MDX metric alongside a regular project attribute

---

## Performance

### First Open Degradation P2
- Measure first open P2
  - Open the embedded editor for the first time on a clean environment

### First Create Degradation P2
- Measure first create P2
  - Create a new report for the first time (cold network load)

### Subsequent Opens (Caching) P2
- Verify caching P2
  - Open the editor a second time on the same machine
  - Upgrade Workstation version, then open editor

### Scroll Performance P3
- Large report scroll P3
  - Scroll through a large report in the editor

---

## Error Handling / Edge Case

### Error Dialog Behavior ⚠️ P1
- Mojo-level error P1
  - Trigger an error at the Mojo/editor level
  - Click OK on the Mojo-level error dialog
- Library-level error ⚠️ P1
  - Trigger an error at the Library (embedded) level
  - Click OK on the Library-level error dialog ⚠️ P1

### Session Timeout ⚠️ P1
- Trigger timeout ⚠️ P1
  - Let session expire while editor is open
  - Confirm Library login page is absent ⚠️ P1
  - Confirm Library error dialog is absent ⚠️ P1
  - Click OK on the timeout dialog

### Cancel / Close Behavior ⚠️ P1
- Cancel during execution P1
  - Click Cancel while a report is executing
  - Click the X button while a report is executing
- Menu bar check ⚠️ P1
  - Inspect the menu bar (BCED-3121)
- Close while busy ⚠️ P1
  - Click close while editor is in a busy/running state (BCED-2893)
- Cancel prompted dashboard P1
  - Cancel out of a prompted dashboard (BCED-2932, BCED-2947)

### Insert Unpublished Dataset P2
- Attempt insert P2
  - Attempt to insert an unpublished dataset
  - Attempt further actions after the error

### Prompted Dataset Replace P2
- Replace dataset ⚠️ P2
  - Replace a prompted dataset in an existing report (BCED-2928)

### Freeform SQL / Python Errors P2
- SQL syntax error P2
  - Enter a SQL statement with a syntax error, click Execute
- Python runtime error P2
  - Enter a Python script with a runtime error, click Execute

### Edge Cases P2
- Unavailable data source P2
  - Open a report whose data source is unavailable
- Save without name P2
  - Click Save without entering a report name
- Navigate away unsaved P2
  - Navigate away from an unsaved edited report
- Multiple unsupported types ⚠️ P2
  - Attempt cube conversion on a report with multiple unsupported object types

---

## Security

### Privilege Enforcement P1
- No "Use Report Editor" ⚠️ P1
  - Log in without "Use Report Editor" privilege, try to open editor
- No "Create application objects" P1
  - Log in without "Create application objects", try to create a report
- No "Use Intelligent Editor" P1
  - Log in without "Use Intelligent Editor", open a report in editor
- No edit permission P1
  - Log in without edit permission on a dashboard, inspect context menu
- Compare WS vs Library P1
  - Compare ACL enforcement between WS editor and Library Web

### OAuth Connections (Server-Based Mode) P1
- Snowflake/Azure OAuth ⚠️ P1
  - Connect a Snowflake/Azure OAuth source in WS server-based mode
- Snowflake/PingOne OAuth P1
  - Connect a Snowflake/PingOne OAuth source
- Salesforce OAuth P1
  - Connect a Salesforce OAuth source
- SurveyMonkey OAuth P1
  - Connect a SurveyMonkey OAuth source
- DB OAuth (BCED-3066) P1
  - Use a DB OAuth source on a WS server-based dashboard
- CommunityConnector OAuth (BCED-3089) P1
  - Complete CommunityConnector OAuth approval flow

### Toolbar Isolation from App Settings ⚠️ P1
- Disable toolbar setting ⚠️ P1
  - Set app-level "Disable toolbar", then open editor
- Other app-level settings ⚠️ P1
  - Apply any other app-level setting, verify inside WS editor
- Visual gap check (BCED-2906) P1
  - Check for visual gap near "Generate embedding URL" button
- Theme menu P1
  - Verify Theme menu on the menu bar

---

## Platform

### Browser
- Chrome P2
  - Open Report Editor in Chrome
- Edge P2
  - Open Report Editor in Edge
- Safari P2
  - Open Report Editor in Safari

### System
- macOS P2
  - Run full workflow (create, edit, save, export) on macOS
- Windows P2
  - Run full workflow on Windows

### Workstation
- macOS P1 tests P1
  - Run all P1 test cases on macOS Workstation
- Windows P1 tests P1
  - Run all P1 test cases on Windows Workstation
- Tanzu environment (BCED-3009) P2
  - Execute a report in Tanzu environment
- AQDT server close (BCED-3136) P2
  - Close a report on an AQDT server
- Logout (BCED-3097) P2
  - Log out from Embedding Library

### BI Web P3
- BI Web access P3
  - Access Report Editor features from BI Web context

---

## Upgrade / Compatibility

### Server Version Compatibility P1
- 25.08+ server ⚠️ P1
  - Connect to a 25.08+ server, open report for editing
- Pre-25.08 server ⚠️ P1
  - Connect to a pre-25.08 server, open report for editing
  - Perform save, execute, and export in legacy fallback mode
  - Check for crashes or data loss in legacy fallback

### Local Mode (.mstr Files) P2
- Open .mstr P2
  - Open a .mstr file for editing
  - Save As the .mstr file, close and reopen
- Edit and save P2
  - Open, edit, and save a local .mstr file

### Regression from BCED-2416 ⚠️ P1
- Context menu (BCED-2881) P1
  - Right-click a report, inspect context menu
- Toolbar setting (BCED-2907) P1
  - Set app-level "Disable toolbar", open editor
- Toolbar after link (BCED-2967) P1
  - Navigate via a link, then use the toolbar
- Same-tab link (BCED-2997) P1
  - Click a same-tab link
- Link to dashboard (BCED-2926) P1
  - Click a link to another dashboard
- Save button (BCED-3142) P1
  - Save when only one option available
- Formatting dialog (BCED-3129) P1
  - Open Dashboard Formatting Properties dialog
- Folder refresh (BCED-3149) P1
  - Save a report, check folder
- X button (BCED-3121) P1
  - Inspect menu bar for X button
- Session timeout (BCED-3022) P1
  - Let session expire in editor
- Close during execution (BCED-2893) P1
  - Close editor while report is executing
- Cancel prompted dashboard (BCED-2932, BCED-2947) P1
  - Cancel a prompted dashboard
- Large report scroll (DE331633) P3
  - Scroll through a large report

---

## i18n

### Report Editor UI Labels P3
- Non-English locale P3
  - Open editor in a non-English locale
  - Open Save dialog in non-English locale
  - Trigger an error dialog in non-English locale

### Data Display P3
- CJK/Arabic characters P3
  - Load a report with CJK, Arabic, or accented characters in object names
- Locale formats P3
  - Load a report with locale-specific date and number formats
