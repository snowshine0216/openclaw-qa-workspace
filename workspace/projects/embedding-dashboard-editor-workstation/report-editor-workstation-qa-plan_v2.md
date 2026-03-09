Report Editor in Workstation — QA Plan (BCED-2416 / F43445)

- EndToEnd
    * E2E: Create New Report & Save P1
        - Go to Help menu
            - Click "Enable New Dashboard Editor" toggle
                - Toggle switches to ON state, no error
        - Click + icon next to Reports
            - Select environment and project
                - Environment/project selection dialog appears
                    - Select blank report and click Create
                        - Blank editor canvas shown with data retrieval paused indicator
                            - Drag attributes and metrics from Objects panel into editor
                                - Objects land in correct row/column drop zones
        - Click Resume Data Retrieval
            - Report grid populates with data, no error
                - Drag a filter object to the Filter panel and click Apply
                    - Report data narrows to match the filter condition
        - Click Save ⚠️ P1
            - Native Workstation Save dialog opens; Library web save UI does not appear
                - Enter report name and target folder, click Save
                    - Dialog closes without error
        - Check folder view without refreshing
            - Newly saved report visible immediately
    * E2E: Edit Existing Report P1
        - Double-click an existing report
            - Editor opens showing existing objects and data
        - Add a metric and remove an attribute
            - Changes reflected in the editor immediately
        - Modify the filter condition
            - Filter panel updates; data changes on next resume
        - Click Save ⚠️ P1
            - Native Workstation Save dialog opens; Library web dialog does not appear
        - Close the report and reopen it
            - All modifications persisted
    * E2E: Create Report from Dataset P2
        - Right-click a dataset
            - Select Create Report
                - New report editor opens with dataset pre-loaded
        - Right-click the same dataset
            - Select New Subset Report
                - Subset editor opens scoped to that dataset
                    - Click Save, choose folder, confirm
                        - Report saved in chosen folder; native save dialog used
    * E2E: Convert Report to Intelligent Cube P1
        - Create and execute a standard report with attributes and metrics
            - Report grid shows data correctly
        - Click Create Intelligent Cube in the top-right of the editor
            - Confirmation dialog appears
                - Click Yes, then click Save and Publish
                    - Cube created; success indicator shown
        - Navigate to Datasets page
            - New cube listed with correct name
        - Reopen original report
            - Original report unaffected, executes normally
    * E2E: Freeform SQL Report Lifecycle P1
        - Go to main menu, click New, click Freeform SQL Report
            - Freeform SQL editor opens
        - Write a valid SQL statement, map columns to objects, click Execute
            - Report grid shows results matching the SQL query
        - Click Save
            - Native Workstation Save dialog opens
        - Attempt to convert this report to an Intelligent Cube ⚠️ P1
            - Clear error message blocks conversion; no crash
    * E2E: Python Query Report Lifecycle P1
        - Go to main menu, click New, click Python Query Report
            - Python query editor opens
                - Enter a Python script and click Execute
                    - Script runs; results populate the report grid
        - Open an existing Python query report, click Open in Python Editor
            - Python editor opens with the existing script loaded
                - Click Save
                    - Native Workstation Save dialog opens; report saved with Python definition intact
    * E2E: Upgrade Flow — pre-25.08 Server P1
        - Connect Workstation to a pre-25.08 server
            - Connection established successfully
        - Open a report for editing
            - Legacy (non-WebView) editor opens; no error or fallback prompt shown
        - Perform save, execute, and export
            - All three operations complete without error
        - Close and reopen the report multiple times ⚠️ P1
            - No crashes; behavior identical to pre-migration baseline

- Core Functionalities
    * Editor Launch & Entry Points P1
        - Open Help menu
            - Click "Enable New Dashboard Editor" toggle ⚠️ P1
                - Toggle state changes; persists after Workstation restart
        - Connect to a 25.08+ server and open a report for editing P1
            - iFrame-based embedded editor visible; Library web authoring page loaded inside Workstation
        - Connect to a pre-25.08 server and open a report for editing P1
            - Legacy CEF editor opens; no error dialog shown
        - Right-click a report, select Edit
            - Editor opens for that report
        - Right-click a report, select Edit Without Data
            - Editor opens with data retrieval paused; objects panel visible; no data rows
        - Right-click a report and inspect the context menu ⚠️ P1
            - Exactly one "Edit without data" entry in the list
        - Click + icon next to Reports
            - New blank report editor opens
        - Go to main menu, click New, click Freeform SQL Report
            - Freeform SQL editor opens
        - Go to main menu, click New, click Python Query Report
            - Python query editor opens
        - Right-click a dataset, click New, click Subset Report
            - Subset report editor opens scoped to the dataset
    * Report Templates P2
        - Click Create, select Blank Report P2
            - Editor opens immediately without template selection
                - Click Create, select a template, click Create P2
                    - Editor opens pre-populated with template layout and objects
                        - Type a keyword in the template search field P2
                            - List filters to templates matching the keyword
        - Enable Certified Only filter in template selector P2
            - Only certified templates shown
        - With admin-disabled blank template, open the create dialog P2
            - Blank Report option is hidden; user must pick a template
        - Open an existing report, open Save menu, click Set as Template P2
            - Template saved and visible in the template library
        - Start a new report and browse templates P2
            - Previously saved template appears in the selection list
    * Objects Panel & Object Management P2
        - Drag an attribute from Objects panel into the editor P2
            - Attribute appears in the Rows drop zone
        - Double-click an attribute in the Objects panel P2
            - Attribute auto-added to Rows
        - Drag a metric from Objects panel into the editor P2
            - Metric appears in Columns drop zone
        - Double-click a metric in the Objects panel P2
            - Metric auto-added to Columns
        - Add first metric to an empty report P2
            - Metric Names object auto-created in the Columns drop zone
        - Drag the Metric Names object from Columns to Rows P2
            - Metric names rendered as row headers
        - Drag an object from the Projects window into the editor (Jan 2026+) P2
            - Object added to the editor from Projects window
        - Drag a result from Global Search into the editor P2
            - Object lands in the correct drop zone
        - Drag an object from the Object Browser into the editor P2
            - Object added to the editor
        - Right-click an object in the Report Object panel, click Edit (Dec 2025+) P2
            - Inline object editor opens; saved changes reflected in report
        - Trigger the edit notification for the first time P2
            - Notification shown on first edit only; absent on subsequent edits
        - Right-click the edited object and check permissions P2
            - Permissions match those shown in the Workstation Objects tab
    * Filtering P2
        - Click the Filter button P2
            - Filter panel opens
                - Click the Filter button again P2
                    - Filter panel closes
        - Drag an existing filter from Objects panel to the Filter panel P2
            - Filter applied; report data constrained to filter condition
        - Drag an object to the Filter panel, define a condition, click Done P2
            - Inline filter created; condition applied to report data
        - Set filter conditions of type equals, greater than, less than P2
            - Each condition type correctly restricts data
        - Modify filter while data retrieval is active, click Apply P2
            - Filter applied immediately without full re-execute
        - Go to View menu, click View Filter P2
            - View Filter panel opens
        - Modify the View Filter P2
            - Displayed data updates dynamically; underlying report definition unchanged
        - Compare report filter and view filter on the same report P2
            - Report filter persists in the saved definition; view filter resets on reopen
    * Prompts P2
        - Execute a prompted report P2
            - Prompt dialog appears before data is retrieved
        - Add a standalone prompt object to a report and execute P2
            - Prompt dialog triggered by the standalone prompt object
        - Create a filter containing a prompt, execute report P2
            - Filter prompt dialog shown; selected value applied to filter condition
        - Create a metric containing a prompt, execute report P2
            - Metric prompt dialog shown; metric computed using selected value
        - Execute a report with a prompt nested inside another prompt P2
            - Nested prompt chain presented in correct order; all answers applied
        - Answer prompts and check the Report Filters summary panel (Mar 2025+) P2
            - Answered prompt values visible in Report Filters summary
        - Configure page-by on a prompted report, answer prompts, navigate pages P2
            - Page-by navigation works correctly after prompt answers applied
    * Data Retrieval & Execution P1
        - Open a report in the editor P1
            - Editor opens with data retrieval paused; pause indicator visible; no data rows
                - Click Resume Data Retrieval P1
                    - Report grid populates with correct data
                        - Click Pause Data Retrieval P1
                            - Data rows hidden; pause indicator shown
                                - Click Resume Data Retrieval, then immediately check Undo/Redo button state ⚠️ P2
                                    - Undo/Redo buttons greyed out during the transition
    * SQL View P2
        - Open a report in paused state, open the SQL tab P2
            - Generated SQL shown while paused
        - Click Resume Data Retrieval, open the SQL tab P2
            - Live executed SQL shown during execution
        - Review SQL view content P2
            - SQL matches report definition; text is formatted and legible
    * Subtotals & Totals P2
        - Right-click an attribute column header in the report P2
            - "Show Totals" option visible in context menu
        - Click Show Totals, set Applied Level to By Position P2
            - Subtotal row appears after each attribute group; grand total row at bottom
        - Open subtotals settings, customise function and name P2
            - Custom subtotal name and function applied on execute
        - Switch between All Subtotals and Selected Subtotals P2
            - All shows all attribute levels; Selected shows only chosen levels
        - Configure advanced subtotals on a page-by report P2
            - Advanced subtotals dialog accessible; settings apply per page
    * Formatting & Themes P2
        - Click the Format button P2
            - Format panel opens
        - Adjust banding, outline, spacing, headers, values, and subtotals settings P2
            - Each change visually applied to the report grid
        - Click the Themes icon (Dec 2025+) P2
            - Themes panel opens showing current theme and gallery
                - Hover over a theme in the gallery, click Apply P2
                    - Template style, banding, merged headers, spacing, and cell formats all applied
                        - Manually override a cell format after applying a theme P2
                            - Override applies to this report only; theme definition unchanged
                                - Re-apply the same theme P2
                                    - Manual overrides reverted to theme defaults
        - Open Save menu, click Save Theme, check if object-specific formatting is included P2
            - Object-level formats absent from saved theme
                - Verify saved theme in Themes panel on another report P2
                    - Saved theme appears in the gallery
    * Thresholds P3
        - Open Quick Thresholds Editor, define a rule, click Apply P3
            - Threshold rule applied to matching report cells
        - Open Advanced Thresholds Editor, define a complex rule, click Apply P3
            - Complex threshold conditions applied correctly
        - Add thresholds to a report, attempt Convert to Intelligent Cube P2
            - Warning dialog lists thresholds to be removed; proceeding removes them
    * Advanced Properties (VLDB) P2
        - Open Advanced Properties dialog P2
            - Dialog opens without error
        - Right-click a metric, set Metric Join Type P2
            - Join type option visible; selection saved
        - Right-click an attribute, set Attribute Join Type P2
            - Attribute join type saved
        - Set Null Values display in Advanced Properties P2
            - Null display setting saved; reflected in report output
        - Change SQL Generation setting P2
            - Setting saved; visible effect in SQL View
        - Open Report Properties, navigate to Calculation tab, set Evaluation Order P2
            - Evaluation order saved; affects calculation sequence
        - Open Report Properties, navigate to Drilling tab, configure drilling settings P2
            - Drilling on/off and drill template settings saved
        - Enter Pre and Post SQL statements P2
            - Statements saved; executed before/after main SQL on run
    * Page-By P2
        - Drag an attribute to the Page-By drop zone P2
            - Page-by panel appears with a page selector
        - Navigate between pages P2
            - Data split correctly per page-by attribute value on each page
        - Close and reopen the report in Library (same user) P2
            - Last selected page retained on reopen
                - Click the page-by reset control P2
                    - Returns to the default first page
    * Derived Objects P2
        - Click + to create a Derived Metric inside the report P2
            - Derived metric created inline and appears in Objects panel
        - Execute report with the derived metric P2
            - Derived metric values match the expected formula result
        - Add a derived metric to a report, attempt Convert to Intelligent Cube ⚠️ P2
            - Warning dialog lists derived metrics to be removed before proceeding
        - Create derived elements and add to report P2
            - Derived elements applied; data grouped correctly
        - Add derived elements to a report, attempt Convert to Intelligent Cube ⚠️ P2
            - Warning dialog lists derived elements to be removed
    * Consolidations & Custom Groups P2
        - Drag a consolidation from Objects panel into the report P2
            - Consolidation appears in editor; applied to rows/columns
        - Execute report with consolidation P2
            - Attribute elements grouped as defined; labels correct
        - Right-click the consolidation, select Object Display / Subtotals P2
            - Both options appear and function correctly
        - Drag a custom group into the report P2
            - Custom group visible in editor; data grouped as configured
        - Add custom groups or consolidations, attempt Convert to Intelligent Cube ⚠️ P2
            - Clear error message shown; conversion blocked; no crash
    * Transformations P2
        - Drag a transformation object into the report P2
            - Transformation appears in Objects panel
        - Execute report with transformation P2
            - Transformation values correct relative to base metric and time offset
    * Drilling & Links P2
        - Execute a report with a drill map configured, click a data cell to drill P2
            - Drill navigates along drill map path; data scoped to drilled element
        - Configure a link drill targeting a Report, click the link P2
            - Linked report opens with drilled context applied
        - Configure a link drill targeting a Document, click the link P2
            - Linked document opens with drilled context applied
        - Configure a link drill targeting a Dashboard, click the link P2
            - Linked dashboard opens with drilled context applied
        - Navigate to another dashboard via a link, then use the toolbar ⚠️ P2
            - All toolbar actions functional after navigation; none greyed out
        - Click a same-tab link inside the editor ⚠️ P2
            - Navigation completes; no save prompt triggered
        - Click a link to another dashboard while editor is open ⚠️ P2
            - Editor retains its content; canvas does not go blank
        - Add a drillmap to a report, attempt Convert to Intelligent Cube P2
            - Warning shown listing drillmap removal; user can cancel or proceed
    * MDX Reports P2
        - Open the MDX Objects panel in the embedded WS editor ⚠️ P2
            - Panel lists all accessible MDX cube sources
                - Drag a metric from the MDX Objects panel into the report P2
                    - MDX metric appears in Columns drop zone without error
        - Execute the MDX report P2
            - MDX data displayed in report grid correctly
        - Attempt to convert an MDX report to an Intelligent Cube P2
            - Clear error message shown; conversion blocked; no crash
    * Undo / Redo P2
        - Add an object to the report, click Undo P2
            - Object removed; editor reverts to state before the addition
        - Change a number format, click Undo P2
            - Number format reverted to previous state
        - Change the page-by selection, click Undo P2
            - Page-by reverted to previous selection
        - Click Redo after each of the above undos P2
            - Each action re-applied correctly
        - Click Resume Data Retrieval, check Undo/Redo button state P2
            - Both buttons greyed out after retrieval state change
                - Make any object or format change after the above P2
                    - Undo/Redo buttons become active again
    * Save & File Operations P1
        - Click Save on a new unsaved report ⚠️ P1
            - Native Workstation Save dialog opens; Library web save UI absent
                - Enter report name and target folder, click Save P1
                    - Dialog closes; report saved; data retrieval pauses again automatically
        - Check folder immediately after save (BCED-3149) ⚠️ P1
            - Report appears in folder without needing a manual refresh
                - Click Save As ⚠️ P1
                    - Native Workstation Save As dialog opens
                        - Choose a different folder and confirm P1
                            - Saved copy appears in the chosen folder (BCVE-1621)
        - Check Save button when only one save action is available (BCED-3142) P2
            - Dropdown arrow hidden; single Save button shown
        - Check Save button when multiple save options exist P2
            - Dropdown arrow visible; all options listed
        - Check save dialog for a new dashboard P2
            - Certify checkbox and Set as Template checkbox both present
        - Enter a User Comment in the save dialog (Jul 2025+) P3
            - Comment saved with report metadata
        - Open Save menu, click Set as Template P2
            - Template saved and accessible in the template selection list
        - Open Save menu, click Save Theme P2
            - Theme saved; appears in the Themes panel gallery
    * Convert to Intelligent Cube (Workstation Only — Migrated from Legacy) P1
        - Open a standard report in the editor, check the top-right area ⚠️ P1
            - Create Intelligent Cube button visible and enabled
                - Click Create Intelligent Cube P1
                    - Confirmation dialog with Yes/No appears
                        - Click Yes, then click Save and Publish P1
                            - Cube created without error; success confirmation shown
        - Navigate to Datasets page P1
            - New cube listed with correct name
        - Right-click a report, select New, click Intelligent Cube from... P1
            - Intelligent Cube editor opens pre-loaded with report objects
        - Open a Freeform SQL report, attempt Convert to Intelligent Cube ⚠️ P1
            - Descriptive error message shown; conversion blocked; no crash
        - Attempt Convert to Cube on Subset, Transaction, Incremental Refresh, Datamart, and MDX reports ⚠️ P1
            - Each type blocked with a specific error message; no crash
        - Open a report with view filter, derived metrics, sort, drillmap, threshold, and evaluation order, attempt Convert to Intelligent Cube ⚠️ P1
            - Warning dialog lists all objects to be removed; user can cancel before proceeding
        - Open a report with consolidations, custom groups, or prompts, attempt Convert to Intelligent Cube ⚠️ P1
            - Error dialog lists unsupported objects; conversion does not proceed
    * Convert to Datamart (Workstation Only — Migrated from Legacy) P1
        - Open a report, check for Convert to Datamart in menu ⚠️ P1
            - Convert to Datamart menu item visible and clickable
                - Click Convert to Datamart, select target database P1
                    - Target database selection dialog opens with available options
                        - Confirm the conversion P1
                            - Datamart table created in the target database; success confirmation shown
    * Export P2
        - Open File menu, click Export, click PDF P2
            - PDF generation starts; file downloaded or opened in viewer
                - Verify PDF content and layout P2
                    - Content matches the report view; orientation and page size correct
        - Open File menu, click Export, click Excel P2
            - Excel file generated and downloaded
        - Open the exported Excel file P2
            - Data and formatting match the report grid
        - Open Share menu, click Export to PDF P2
            - Same PDF output as File export
        - Open Share menu, click Export to Excel P2
            - Same Excel output as File export
        - Open File menu, click Download .mstr P2
            - .mstr file downloaded; can be reopened in Workstation
    * Python Query Reports P1
        - Go to main menu, click New, click Python Query Report ⚠️ P1
            - Python query editor opens without error
                - Enter a Python script, click Execute P1
                    - Results populate the report grid
        - Open an existing Python query report, click Open in Python Editor P1
            - Existing script loaded and editable
        - Click Save P1
            - Native Save dialog opens; report saved with Python definition intact
        - Use a Python data source on a WS server-based dashboard (BCED-2873) ⚠️ P1
            - Python data source connects and returns data in server-based mode
    * Freeform SQL Reports P1
        - Go to main menu, click New, click Freeform SQL Report ⚠️ P1
            - Freeform SQL editor opens without error
                - Enter a SQL statement in the editor P1
                    - SQL text area accepts input without error
        - Map SQL columns to report objects P1
            - Column mapping dialog works; mapping saved
        - Click Execute P1
            - SQL runs against data source; results appear in report grid
        - Click Save P1
            - Native Save dialog opens; report saved with SQL definition
        - Attempt Convert to Intelligent Cube ⚠️ P1
            - Clear error message shown; cube not created; no crash
        - Open an existing Freeform SQL report, click Open in SQL Editor P1
            - SQL editor opens with existing SQL loaded and editable

- X-function tests
    * Save + Certify / Template Interaction P2
        - Save a new report, inspect the Save dialog P2
            - Both Certify and Set as Template checkboxes visible
        - Check Certify, click Save P2
            - Certified badge appears on the report in the folder
        - Check Set as Template, click Save P2
            - Saved report appears in the template selection list for future reports
    * Filter + Prompt Interaction P2
        - Create a filter containing a prompt, execute the report P2
            - Prompt dialog appears before data fetch; filter applied after answering
                - Answer the prompt, verify report data P2
                    - Data filtered to match the prompt answer
        - Reset prompt answers, re-execute P2
            - Prompt dialog appears again on next execute
    * Themes + Format Panel Interaction P2
        - Apply a theme, then manually override a cell format P2
            - Override applied to this report only; other theme elements intact
                - Re-apply the same theme P2
                    - Cell format reverts to theme default; manual override removed
        - Apply a manual override, then open Save menu, click Save Theme P2
            - Saved theme contains original theme formats only; override not included
    * Drilling + Toolbar Interaction P2
        - Navigate to another dashboard via a link, then use the toolbar ⚠️ P2
            - All toolbar actions (save, export, format) respond correctly
        - Click a same-tab link ⚠️ P2
            - Navigation completes; no save prompt appears
        - Drill into a linked report, then navigate back P2
            - Original editor state intact on return
    * Page-By + Subtotals Interaction P2
        - Add a page-by attribute, enable subtotals, navigate to first page P2
            - Subtotals reflect data on that page
        - Switch to a different page P2
            - Subtotal values update to match the new page's data
    * Consolidations + Subtotals Interaction P2
        - Right-click a custom group, enable Subtotals P2
            - Subtotal rows appear per custom group band
        - Right-click a consolidation, enable Subtotals P2
            - Subtotal values match the aggregate of grouped elements
    * Convert to Cube + ACL Interaction P1
        - Log in as a user with "Use Intelligent Editor" privilege, open a report P1
            - Create Intelligent Cube button visible and functional
        - Log in as a user without the privilege, open the same report ⚠️ P1
            - Button absent or permission error shown; conversion not possible
    * Export + Theme Interaction P2
        - Apply a theme, export to PDF P2
            - PDF reflects theme colors, fonts, and banding as shown on screen
        - Apply a theme, export to Excel P2
            - Excel cells reflect theme formatting where applicable
    * Undo/Redo + Data Retrieval Interaction P2
        - Click Resume Data Retrieval, then immediately click Undo ⚠️ P2
            - Undo button greyed out; action not available
                - Make a format change after retrieval state change P2
                    - Undo button becomes active again
    * Python / SQL Editor + Report Objects Interaction P1
        - Add an object to a Python query report ⚠️ P1
            - Object visible in Objects panel alongside the Python editor
                - Toggle between report grid view and Python editor view P1
                    - Both views accessible without data loss
    * MDX + Report Objects Interaction P2
        - Add an MDX metric and a regular metric to the same report P2
            - Both metrics appear in Columns; data displays without error
        - Add an MDX metric alongside a regular project attribute P2
            - Report grid renders MDX metric values alongside regular attribute data

- Performance
    * First Open Degradation P2
        - Open the embedded editor for the first time on a clean environment P2
            - Load time within ~2-4s above legacy baseline; no timeout
    * First Create Degradation P2
        - Create a new report for the first time (cold network load) P2
            - Create completes within ~20s additional overhead; no error; result documented
    * Subsequent Opens (Caching) P2
        - Open the editor a second time on the same machine P2
            - Load time noticeably faster than first open; cached assets served
                - Upgrade Workstation version, then open editor P2
                    - Fresh resources loaded; no stale UI from previous cache
    * Scroll Performance P3
        - Scroll through a large report in the editor P3
            - Scrolling functional; roughness documented as known issue DE331633; not a blocker

- Error Handling / Edge Case
    * Error Dialog Behavior ⚠️ P1
        - Trigger an error at the Mojo/editor level P1
            - Native Workstation error dialog appears; Library error UI absent
                - Click OK on the Mojo-level error dialog P1
                    - Dialog dismissed; editor remains open and fully usable
        - Trigger an error at the Library (embedded) level ⚠️ P1
            - Native Workstation error dialog shown; not Library's error panel
                - Click OK on the Library-level error dialog ⚠️ P1
                    - Dialog dismissed and editor window closes; error message was readable before close
    * Session Timeout ⚠️ P1
        - Let session expire while editor is open ⚠️ P1
            - Native Workstation session-expired dialog appears
                - Confirm Library login page is absent ⚠️ P1
                    - Library login UI and Library homepage not shown inside editor frame
                        - Confirm Library error dialog is absent ⚠️ P1
                            - Library-level error intercepted by WS; only native dialog visible
                                - Click OK on the timeout dialog P1
                                    - Editor closes cleanly; user returned to Workstation main window without crash
    * Cancel / Close Behavior ⚠️ P1
        - Click Cancel while a report is executing P1
            - Execution stops; editor closes; no hanging process
        - Click the X button while a report is executing P1
            - Execution cancelled immediately; editor window closed
        - Inspect the menu bar ⚠️ P1
            - Exactly one X button visible; no duplicate (BCED-3121)
        - Click close while editor is in a busy/running state ⚠️ P1
            - Close completes gracefully; no Workstation crash (BCED-2893)
        - Cancel out of a prompted dashboard P1
            - Prompted dashboard instance removed from server; no orphan (BCED-2932, BCED-2947)
    * Insert Unpublished Dataset P2
        - Attempt to insert an unpublished dataset P2
            - Error message indicates dataset is unpublished; editor stays open
        - Attempt further actions after the error P2
            - Editor remains fully functional
    * Prompted Dataset Replace P2
        - Replace a prompted dataset in an existing report ⚠️ P2
            - Replace completes without crash; report updates with new dataset (BCED-2928)
    * Freeform SQL / Python Errors P2
        - Enter a SQL statement with a syntax error, click Execute P2
            - Error message shown inline or in dialog; editor remains open
        - Enter a Python script with a runtime error, click Execute P2
            - Python error output shown; editor stays open for correction
    * Edge Cases P2
        - Open a report whose data source is unavailable P2
            - Error message explains missing data source; no crash
        - Click Save without entering a report name P2
            - Inline validation blocks save; "name required" message shown
        - Navigate away from an unsaved edited report P2
            - Unsaved changes warning dialog appears with Save and Discard options
        - Attempt cube conversion on a report with multiple unsupported object types ⚠️ P2
            - Each unsupported type produces a distinct, descriptive error message

- Security
    * Privilege Enforcement P1
        - Log in without "Use Report Editor" privilege, try to open editor ⚠️ P1
            - Editor does not open; access denied message shown
        - Log in without "Create application objects", try to create a report P1
            - Create new report option hidden or disabled
        - Log in without "Use Intelligent Editor", open a report in editor P1
            - Convert to Cube button hidden or shows insufficient privilege
        - Log in without edit permission on a dashboard, inspect context menu P1
            - Edit option absent; view-only access enforced
        - Compare ACL enforcement between WS editor and Library Web P1
            - Same restrictions apply in both interfaces
    * OAuth Connections (Server-Based Mode) P1
        - Connect a Snowflake/Azure OAuth source in WS server-based mode ⚠️ P1
            - OAuth flow completes; data from Snowflake/Azure loads in report
        - Connect a Snowflake/PingOne OAuth source P1
            - PingOne redirects and returns token; data loads
        - Connect a Salesforce OAuth source P1
            - Salesforce OAuth completes; data accessible
        - Connect a SurveyMonkey OAuth source P1
            - SurveyMonkey OAuth completes; survey data accessible
        - Use a DB OAuth source on a WS server-based dashboard (BCED-3066) P1
            - DB OAuth data source connects and returns data
        - Complete CommunityConnector OAuth approval flow (BCED-3089) P1
            - User returned to connector source page in WS after approval
    * Toolbar Isolation from App Settings ⚠️ P1
        - Set app-level "Disable toolbar", then open editor ⚠️ P1
            - Toolbar fully visible and functional; app setting has no effect
        - Apply any other app-level setting, verify inside WS editor ⚠️ P1
            - No app-level setting affects WS embedded editor behavior or appearance
        - Check for visual gap near "Generate embedding URL" button (BCED-2906) P1
            - No gap between toolbar and report content area
        - Verify Theme menu on the menu bar P1
            - Theme menu item renders correctly; no missing or broken items

- Platform
    * Browser
        - Open Report Editor in Chrome P2
            - Full editor functionality; no rendering issues
        - Open Report Editor in Edge P2
            - Full editor functionality; no rendering issues
        - Open Report Editor in Safari P2
            - Full editor functionality; no rendering issues
    * System
        - Run full workflow (create, edit, save, export) on macOS P2
            - All steps complete without OS-specific errors
        - Run full workflow on Windows P2
            - All steps complete without OS-specific errors
    * Workstation
        - Run all P1 test cases on macOS Workstation P1
            - All P1 cases pass on macOS
        - Run all P1 test cases on Windows Workstation P1
            - All P1 cases pass on Windows
        - Execute a report in Tanzu environment (BCED-3009) P2
            - Report executes and data displays correctly
        - Close a report on an AQDT server (BCED-3136) P2
            - Close completes without error
        - Log out from Embedding Library (BCED-3097) P2
            - Logout completes; session ended cleanly
    * BI Web P3
        - Access Report Editor features from BI Web context P3
            - Core features function; no regressions from WS changes

- upgrade / compatibility
    * Server Version Compatibility P1
        - Connect to a 25.08+ server, open report for editing ⚠️ P1
            - iFrame-based editor loads; Library web authoring page visible inside WS
        - Connect to a pre-25.08 server, open report for editing ⚠️ P1
            - Legacy editor opens automatically; no error dialog shown
        - Perform save, execute, and export in legacy fallback mode P1
            - All three operations complete identically to pre-migration baseline
        - Check for crashes or data loss in legacy fallback P1
            - No crash; all existing report data intact
    * Local Mode (.mstr Files) P2
        - Open a .mstr file for editing P2
            - Legacy editor used; new embedded editor not invoked
        - Save As the .mstr file, close and reopen P2
            - Reopen uses new editor style
        - Open, edit, and save a local .mstr file P2
            - Workflow unchanged from before migration
    * Regression from BCED-2416 ⚠️ P1
        - Right-click a report, inspect context menu (BCED-2881) P1
            - Exactly one "Edit without data" menu item
        - Set app-level "Disable toolbar", open editor (BCED-2907) P1
            - Toolbar visible and functional despite app-level setting
        - Navigate via a link, then use the toolbar (BCED-2967) P1
            - All toolbar buttons respond after link navigation
        - Click a same-tab link (BCED-2997) P1
            - No save prompt appears
        - Click a link to another dashboard (BCED-2926) P1
            - Editor content retained; canvas does not go blank
        - Save when only one option available (BCED-3142) P1
            - Dropdown arrow hidden; shown only when multiple options exist
        - Open Dashboard Formatting Properties dialog (BCED-3129) P1
            - Dialog fully visible and scrollable; no content clipped
        - Save a report, check folder (BCED-3149) P1
            - Item appears immediately; no page refresh needed
        - Inspect menu bar for X button (BCED-3121) P1
            - Exactly one X button visible
        - Let session expire in editor (BCED-3022) P1
            - Native WS session dialog shown; Library login page absent
        - Close editor while report is executing (BCED-2893) P1
            - Closes gracefully; no crash
        - Cancel a prompted dashboard (BCED-2932, BCED-2947) P1
            - Instance removed from server; no orphan left
        - Scroll through a large report (DE331633) P3
            - Scroll works; roughness noted as known issue; not marked as fail

- i18n
    * Report Editor UI Labels P3
        - Open editor in a non-English locale P3
            - All UI labels, buttons, and menus in the correct language; no English fallback
        - Open Save dialog in non-English locale P3
            - Save dialog controls displayed in the correct locale
        - Trigger an error dialog in non-English locale P3
            - Error message text in the correct locale
    * Data Display P3
        - Load a report with CJK, Arabic, or accented characters in object names P3
            - All characters render without garbling
        - Load a report with locale-specific date and number formats P3
            - Dates and numbers formatted per locale convention
