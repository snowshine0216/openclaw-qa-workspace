Report Editor in Workstation - QA Plan v3 (BCED-2416 / F43445)

- Toggle, Routing & Entry Activation
    * Default-off routing P1
        - Launch Workstation connected to a supported server without changing the Help-menu toggle
            - Legacy editor remains the default path; new embedded report editor does not open unexpectedly
        - Open Help menu
            - "Enable New Dashboard Editor" is visible and unchecked by default
    * Toggle ON and persistence P1
        - Open Help menu and enable "Enable New Dashboard Editor"
            - Toggle changes state without error
        - Restart Workstation and reconnect to the same environment
            - Toggle state persists and the new embedded path is still available
    * Toggle OFF after enabling P1
        - Enable the toggle, open the new editor once, then disable the toggle
            - Subsequent report create/edit flows return to legacy behavior; no orphaned window state remains
    * Supported-server routing P1
        - Connect to a 25.08+ server and open an existing report for editing
            - iFrame-based embedded editor is used inside Workstation
    * Unsupported-server fallback P1
        - Connect to a pre-25.08 server and open an existing report for editing
            - Legacy editor opens automatically; no broken workflow or fallback error is shown
    * Mixed-environment routing P1
        - Keep one supported environment and one unsupported environment connected in the same Workstation session
            - Report create/edit routes correctly per environment; no menu or window confusion leaks across environments
    * Entry-point coverage P1
        - Double-click an existing report
            - Report opens in the correct editor path for the connected server and toggle state
        - Right-click a report and select Edit
            - Report opens for authoring
        - Right-click a report and select Edit Without Data
            - Report opens with data retrieval paused; objects are visible and no rows are loaded
        - Click the + icon next to Reports
            - New blank report flow opens
        - Go to Workstation main menu, click New, then choose Freeform SQL Report
            - Freeform SQL editor opens
        - Go to Workstation main menu, click New, then choose Python Query Report
            - Python query editor opens
        - Right-click a dataset and choose New Subset Report
            - Subset report editor opens scoped to that dataset

- EndToEnd
    * E2E: Create New Report and Save P1
        - Enable the new editor and create a blank report from the Reports area
            - Blank editor canvas opens with data retrieval paused
        - Add one attribute and one metric from the Objects panel
            - Objects land in the expected row and column zones
        - Resume data retrieval
            - Report grid loads data without error
        - Add a report filter and apply it
            - Data narrows to match the filter condition
        - Click Save
            - Native Workstation Save dialog opens; Library web save UI does not appear
        - Enter a name and target folder, then confirm save
            - Save completes without error, data retrieval pauses again, and the new report appears in the folder without manual refresh
    * E2E: Edit Existing Report and Persist Changes P1
        - Open an existing report in the new editor
            - Existing layout and objects load correctly
        - Add a metric, remove an attribute, and modify the filter
            - Changes are reflected immediately in authoring state
        - Save, close, and reopen the report
            - All modifications persist across reopen
    * E2E: Freeform SQL Report Lifecycle P1
        - Create a Freeform SQL report from the Workstation main menu
            - SQL editor opens
        - Enter valid SQL, map columns to report objects, and execute
            - Results load in the report grid and match the SQL query
        - Save the report
            - Native Save dialog opens and the SQL definition persists
        - Attempt Convert to Intelligent Cube
            - Conversion is blocked with a clear error; no crash occurs
    * E2E: Python Query Report Lifecycle P1
        - Create a Python Query Report from the Workstation main menu
            - Python editor opens
        - Enter a Python script and execute it
            - Results populate the report grid
        - Reopen an existing Python query report in Python Editor and save it again
            - Existing script loads correctly and the saved definition remains intact
    * E2E: Convert Standard Report to Intelligent Cube P1
        - Create and execute a standard report with attributes and metrics
            - Report grid shows expected data
        - Click Create Intelligent Cube and complete Save and Publish
            - Cube is created successfully and appears in Datasets
        - Reopen the original report
            - Original report remains usable and unchanged apart from the completed cube workflow

- Core Report Authoring
    * Report Templates P2 ⚠️ RISK: template gating and privilege rules changed in recent releases
        - Create a new report and choose Blank Report
            - Editor opens immediately without template selection
        - Create a report from a template
            - Template layout and objects are pre-populated in the editor
        - Search templates by keyword and enable Certified Only
            - Template list filters correctly
        - Open report creation when blank template is admin-disabled
            - Blank Report option is hidden and the user must choose a template-supported path
        - Create a report from template as a user without template browse or execute permission
            - Template path is blocked appropriately and the user is not allowed into an invalid editor state
        - Open Save menu and set an existing report as a template
            - Saved template appears in the template picker for future report creation
    * Objects Panel & Object Management P2 ⚠️ RISK: editor-mode object editing and drag sources are parity-sensitive
        - Drag and double-click attributes and metrics from the Objects panel into the editor
            - Attributes land in Rows and metrics land in Columns
        - Add the first metric to an empty report
            - Metric Names object is auto-created in Columns
        - Move Metric Names from Columns to Rows
            - Metric names render as row headers
        - Drag objects from Projects, Global Search, and Object Browser into the editor
            - Objects are added successfully from each source
        - Edit an object from the Report Object panel while in editor mode
            - Inline object editor opens and saved changes are reflected in the report
        - Reopen the object edited inside editor mode
            - Saved object changes persist after reopen and match object-browser metadata
        - Verify first-time edit notification and permissions display
            - Notification appears only on first edit and object permissions match Workstation Objects-tab expectations
    * Data Retrieval & Execution P1 ⚠️ RISK: pause and resume state drives multiple downstream behaviors
        - Open a report in authoring mode
            - Data retrieval is paused by default and no rows are loaded
        - Click Resume Data Retrieval
            - Report grid populates correctly
        - Click Pause Data Retrieval
            - Data rows hide and pause state returns
        - Resume retrieval and immediately inspect Undo and Redo state
            - Undo and Redo are disabled during retrieval transition and become available again after a new authoring change
    * Filtering P2 ⚠️ RISK: report filter and view filter semantics must remain distinct
        - Open and close the Filter panel from the toolbar
            - Panel visibility toggles correctly
        - Drag an existing filter from Objects to the Filter panel
            - Filter applies and constrains the data
        - Create a new inline filter from an object and define equals, greater-than, and less-than conditions
            - Each condition type is saved and correctly restricts report results
        - Apply a filter, save the report, close it, and reopen it
            - Report filter persists in the saved report definition
        - Modify a filter while data retrieval is active and apply it
            - Filter updates without corrupting report state
        - Open View Filter and compare it to Report Filter behavior
            - Report Filter persists with the report definition; View Filter resets on reopen
    * Prompts P2 ⚠️ RISK: prompt type coverage and answer preservation are parity-sensitive
        - Execute a prompted report
            - Prompt dialog appears before data retrieval
        - Add a standalone prompt object to a report and execute
            - Standalone prompt triggers correctly
        - Use prompts inside filters and metrics
            - Prompt answers are applied to the correct object logic
        - Execute reports with attribute element, object, numeric, text, and date or time prompts
            - Each prompt type renders and accepts input correctly
        - Execute a report with a metric qualification or hierarchy qualification prompt
            - Qualification prompt is applied to the correct logical component
        - Execute a nested-prompt report
            - Prompt chain appears in the correct order and all answers are applied
        - Answer prompts and inspect Report Filters summary
            - Prompt answers appear in the summary panel
        - Configure page-by on a prompted report and navigate pages after answering prompts
            - Page-by remains functional with prompt-driven execution
        - Cancel during prompted execution and then re-run the prompt flow
            - Prompt answers are preserved or reset exactly as designed and the next execution remains stable
    * SQL View P2 ⚠️ RISK: paused-SQL and executed-SQL parity is migration-sensitive
        - Open SQL tab while a report is paused
            - Generated SQL is visible before execution
        - Resume data retrieval and re-open SQL tab
            - Live executed SQL is shown during execution
        - Review the SQL text
            - SQL matches the report definition and is readable
        - Change a report property that affects SQL generation, then reopen SQL view
            - SQL output changes consistently with the modified property
    * Page-By P2
        - Drag an attribute to the Page-By drop zone
            - Page-by selector appears
        - Navigate between pages
            - Data is partitioned correctly by page-by value
        - Reopen the report and inspect page-by state
            - Last selected page behavior matches product design; reset returns to the default page
    * Subtotals & Totals P2 ⚠️ RISK: subtotal-level configuration is easy to regress under parity changes
        - Enable Show Totals from an attribute header
            - Subtotals and grand total appear in the expected positions
        - Configure Applied Level as By Position and customize subtotal function and label
            - Customized subtotal logic and naming persist and render correctly
        - Switch between All Subtotals and Selected Subtotals
            - Visible subtotal levels change correctly
        - Use advanced subtotals on a page-by report
            - Subtotals apply correctly on each page
    * Formatting & Themes P2
        - Open the Format panel and change banding, outline, spacing, headers, values, and subtotals
            - Each visual change appears in the report grid
        - Open Themes, apply a theme, then manually override one cell format
            - Theme applies globally and the manual override affects only the current report
        - Re-apply the same theme
            - Manual override is reset to theme defaults
        - Save a theme and open another report
            - Saved theme appears in the gallery and object-specific formatting is not incorrectly persisted inside the theme
    * Thresholds P3
        - Create a quick threshold and an advanced threshold
            - Rules apply correctly to matching cells
        - Attempt Convert to Intelligent Cube on a report with thresholds
            - Warning identifies threshold removal before conversion proceeds
    * Advanced Properties (VLDB) P2 ⚠️ RISK: advanced-property parity is a known legacy gap area
        - Open Advanced Properties dialog
            - Dialog opens without error
        - Set metric join type and rerun the report
            - Join-type change is saved and reflected in report behavior where applicable
        - Set attribute join type and rerun the report
            - Attribute-join change persists correctly
        - Set null-value display and rerun the report
            - Null-display behavior updates as configured
        - Change SQL generation settings and reopen SQL view
            - SQL output reflects the updated generation settings
        - Set evaluation order and rerun the report
            - Calculation sequence follows the configured evaluation order
        - Configure drilling options in Report Properties
            - Drilling settings are saved and used by subsequent drill actions
        - Enter Pre SQL and Post SQL statements, then run the report
            - Statements are saved and executed in the correct order around the main SQL
    * Derived Objects P2 ⚠️ RISK: derived-object behavior affects both execution and cube-conversion warnings
        - Create a derived metric and execute the report
            - Derived metric appears in the Objects panel and returns correct values
        - Save and reopen a report containing a derived metric
            - Derived metric definition persists and still returns the expected values
        - Create derived elements and execute
            - Derived elements group data correctly
        - Save and reopen a report containing derived elements
            - Derived elements persist and render correctly after reopen
        - Attempt Convert to Intelligent Cube with derived metrics or derived elements present
            - Warning lists removal impact before proceeding
    * Consolidations, Custom Groups & Transformations P2 ⚠️ RISK: grouping semantics and transformation logic must survive migration intact
        - Add a consolidation and a custom group to a report
            - Grouping renders correctly and related display/subtotal options are available
        - Execute a report containing a consolidation
            - Element grouping and displayed labels match the consolidation definition
        - Execute a report containing a custom group
            - Custom group buckets and subtotals are calculated correctly
        - Add a transformation and execute the report
            - Transformation values are calculated correctly relative to the base metric and time offset
        - Save and reopen a report containing a transformation
            - Transformation definition persists and reruns correctly after reopen
        - Attempt Convert to Intelligent Cube with consolidations or custom groups present
            - Conversion is blocked with a clear message when unsupported objects are present
    * MDX Reports P2
        - Open MDX Objects panel and add an MDX metric to a report
            - MDX objects load correctly and the metric is added without error
        - Execute the MDX report
            - MDX data displays correctly
        - Attempt Convert to Intelligent Cube on an MDX report
            - Conversion is blocked with a descriptive error
    * Undo / Redo P2 ⚠️ RISK: undo-state management can regress around retrieval and multi-step authoring actions
        - Add an object, change formatting, and change a page-by selection
            - Undo reverses each action in order
        - Click Redo after each undo
            - Redo reapplies each action correctly
        - Create an inline filter, then use Undo and Redo
            - Filter creation can be undone and redone without corrupting report state
        - Apply a theme, then use Undo and Redo
            - Theme application participates in undo history correctly
        - Change an Advanced Property, save the report state if required, and inspect Undo behavior
            - Undo behavior matches the designed support level and does not leave the editor in a partial state
        - Resume data retrieval and then try Undo immediately
            - Undo remains disabled during the retrieval-state transition

- Save, Export & Workstation-Specific Actions
    * Save & File Operations P1
        - Save a new unsaved report
            - Native Workstation Save dialog appears and Library web save UI is absent
        - Save As to a different folder
            - Native Save As dialog appears and the saved copy is visible in the chosen folder without manual refresh
        - Inspect Save button behavior when only one save action is available and when multiple save options are available
            - Dropdown arrow visibility matches the available action count
        - Save a newly created report and inspect the dialog
            - Certify and Set as Template options are present when applicable
        - Enter a user comment during save
            - Comment is saved with report metadata
        - Close a dirty report
            - Unsaved-changes confirmation is shown and the chosen action is honored
    * Export P2
        - Export a report to PDF from File and Share flows
            - PDF export succeeds and output content matches the current report view
        - Export a report to Excel from File and Share flows
            - Excel export succeeds and data/formatting are preserved as expected
        - Download the report as .mstr
            - File downloads successfully and can be reopened in Workstation
    * Convert to Intelligent Cube P1
        - Open a standard report and inspect the top-right authoring area
            - Create Intelligent Cube action is visible and enabled when privileges allow
        - Complete the conversion flow
            - Cube is created successfully and listed in Datasets
        - Attempt conversion on Freeform SQL, Subset, Transaction, Incremental Refresh, Datamart, and MDX reports
            - Each unsupported type is blocked with a descriptive error and no crash
        - Attempt conversion on reports with view filter, derived objects, sort, drillmap, threshold, evaluation order, prompts, consolidations, or custom groups
            - Warning or error messaging accurately reflects what will be removed versus what blocks conversion
    * Convert to Datamart P1
        - Open a report and choose Convert to Datamart
            - Datamart action is visible and launches the target-database flow
        - Complete datamart conversion
            - Target database selection, confirmation, and final datamart creation all succeed
    * Open in Python / SQL Editor P1
        - Open an existing Python query report in Python Editor
            - Existing script loads correctly and remains editable
        - Open an existing Freeform SQL report in SQL Editor
            - Existing SQL loads correctly and remains editable

- Native Integration & Menu Parity
    * Native dialog integration P1
        - Open Object Editor and Object Properties from authoring context
            - Workstation-native dialogs open correctly and return control to the editor without broken state
        - Open the user comments flow from save-related actions
            - Native dialog appears and behaves correctly
        - Save a report and inspect the Workstation window title after rename or first save
            - Window title updates to the saved report name
    * Menu visibility and parity P1
        - Inspect report context menus while the new editor path is active
            - Exactly one Edit Without Data entry is shown
        - Inspect menus and toolbars while the new editor path is active
            - No stale legacy-only entries appear and no new-editor-only entry leaks into legacy mode
        - Inspect Theme and other menu-bar actions relevant to report authoring
            - Theme control is placed and behaves as designed
        - Inspect Save menu composition
            - Save-related entries match the report state and do not show duplicate or broken items
    * Toolbar and app-setting isolation P1
        - Apply app-level settings such as Disable toolbar, then open the embedded report editor
            - App-level settings do not incorrectly affect the embedded Workstation report editor
        - Inspect layout near toolbar and top chrome
            - No visual gap, clipped control, or duplicated close button is present

- Drilling, Links & Cross-Function Tests
    * Drilling & Links P2
        - Execute a report with a drill map and drill from a data cell
            - Drill navigation respects the configured drill path and drilled context
        - Configure link drill targets for Report, Document, and Dashboard
            - Linked target opens with correct context applied
        - Click a same-tab link and then use the toolbar
            - Navigation completes and toolbar actions continue to work; no unexpected save flow is triggered
        - Click a link to another dashboard while the report editor is open
            - Editor content does not go blank and Workstation window lifecycle remains stable
    * Cross-function interactions P2
        - Combine filter and prompt behavior in the same report
            - Prompt flow and filter application remain consistent
        - Combine page-by and subtotals
            - Subtotals update correctly as the page changes
        - Combine consolidations or custom groups with subtotals
            - Aggregation values match grouped elements
        - Combine export with themes
            - Theme formatting is reflected in exported output where applicable
        - Combine cube conversion with ACL differences
            - Intelligent Cube action appears only for users with the required privilege
        - Combine Python or SQL editor flows with report objects
            - Editor-specific views and report-object interactions remain stable without data loss
        - Combine MDX and standard objects in the same report
            - Mixed-object rendering works without error

- Performance
    * First open and first create P1
        - Open the embedded report editor for the first time in a fresh Workstation session
            - First-open latency is measured and documented against the known migration baseline
        - Create a new report for the first time on a cold session
            - First-create latency is measured and documented; no timeout or catastrophic hang occurs
    * Warm-state reopen and cache behavior P2
        - Reopen the same report in the same session
            - Warm-state open is materially faster than the first cold open
        - Upgrade Workstation and reopen the editor
            - Fresh resources load correctly and no stale UI cache is observed
    * Network sensitivity P2
        - Repeat first-open and first-create flows on a slower network connection
            - Embedded load behavior remains usable and the network sensitivity is documented
    * Scroll and manipulation responsiveness P2
        - Scroll a large report and perform common manipulations such as drag-and-drop and formatting changes
            - Scrolling and manipulation remain usable; any known roughness is documented as a measured regression, not a silent surprise

- Error Handling & Edge Cases
    * Error dialog behavior P1
        - Trigger an editor-level error in the embedded report flow
            - Native Workstation error dialog appears and Library error UI is not shown
        - Click OK on the error dialog
            - Dialog is dismissed and the editor closes cleanly
        - Trigger a Library-level embedded error
            - Native Workstation error dialog appears instead of raw embedded error UI
        - Click OK on the Library-level error dialog
            - Editor closes cleanly after the error is acknowledged
    * Session timeout P1
        - Allow the session to expire while a report editor is open
            - Native Workstation session-expired dialog appears
        - Inspect the embedded frame during timeout handling
            - Library login page and Library home page do not appear inside the frame
        - Acknowledge the timeout dialog
            - Editor closes cleanly and Workstation remains responsive
    * Cancel / Close behavior P1
        - Cancel while a report is executing
            - Execution stops and Workstation handles the authoring window cleanly without hang or orphaned state
        - Click X while a report is executing
            - Execution is cancelled and window cleanup completes correctly
        - Cancel or close a prompted execution flow
            - Prompt-related state is handled cleanly; no orphaned instance or broken close behavior remains
    * Editor edge cases P2
        - Insert an unpublished dataset
            - Error is shown clearly and the editor remains stable up to the designed post-error behavior
        - Replace a prompted dataset in an existing report
            - Replace flow completes without crash and the report updates correctly
        - Execute SQL or Python with invalid input
            - Error is surfaced clearly and the editor remains recoverable for correction
        - Open a report whose data source is unavailable
            - Missing-source error is clear and Workstation does not crash
        - Attempt Save without a valid report name
            - Validation prevents the save and the user receives a clear message

- Security, Privileges & Auth
    * Privilege enforcement P1
        - Open the report editor as a user without Use Report Editor
            - Editor does not open and access is denied
        - Create a report as a user without Create application objects
            - Create-report action is hidden or disabled
        - Attempt Intelligent Cube conversion without Use Intelligent Editor
            - Cube action is hidden or blocked with a permission error
        - Compare edit permissions in Workstation and Library for the same report
            - ACL enforcement is consistent across both surfaces
    * Template and save privileges P2
        - Create a report from template without required template permissions
            - Template path is blocked appropriately
        - Save As to a folder without write permission
            - Proper permission error is shown and no partial save occurs
    * OAuth and embedded auth flows P1
        - Use Snowflake Azure, Snowflake PingOne, Salesforce, SurveyMonkey, DB OAuth, and Community Connector sources in server-based mode
            - Popup and callback flows complete correctly and data loads successfully
        - Trigger auth-required report access in the embedded editor
            - Embedded auth flow completes without trapping the user in browser-only or broken callback state

- Platform & Compatibility
    * Windows and macOS Workstation P1
        - Execute all P1 save, create, edit, cancel, auth, and upgrade flows on Windows and macOS Workstation
            - Core P1 behavior is consistent across both desktop platforms
    * Environment-specific coverage P2
        - Execute report authoring in Tanzu environment
            - Report executes and remains stable
        - Open and close a report in AQDT environment
            - Close behavior works and no compatibility-specific hang occurs
        - Trigger logout in embedded Library context
            - Session ends cleanly and Workstation responds correctly
    * Upgrade & fallback compatibility P1
        - Repeat create, edit, save, execute, and export flows on supported and unsupported servers
            - Supported servers use the embedded editor and unsupported servers fall back cleanly to legacy behavior
    * Local mode (.mstr) coexistence P2
        - Open a local .mstr file for editing
            - Legacy/local editor behavior is preserved where expected
        - Save As from local mode to metadata server and reopen
            - Reopen behavior follows the designed editor path for the target server and toggle state

- Regression by Known Defects
    * Routing, menus, and chrome regressions P1
        - BCED-2881: inspect the context menu on a report
            - Exactly one Edit Without Data item is shown
        - BCED-3121: inspect close controls on the top chrome
            - Only one X button is visible and it behaves correctly
        - BCED-3142: inspect Save menu when only one save action is available
            - Dropdown arrow is hidden unless multiple actions exist
        - BCED-3149: save or rename a report and inspect the title
            - Window title updates correctly after save
    * Save, template, and refresh regressions P1
        - DE331555 / CGWI-1000 / BCED-2956: save a newly created report
            - Certify and Set as Template options are present when applicable
        - DE332260 / BCVE-1621: save and Save As to folders including AQDT-style environments
            - Save succeeds and the report appears without manual refresh
    * Execution, prompt, and close regressions P1
        - BCED-2893: close while a report is running
            - No crash occurs
        - BCED-2932 / BCED-2947: cancel or close a prompted execution path
            - No orphaned instance remains and subsequent close works correctly
        - BCED-3022: let session expire in the editor
            - Library login page does not appear and native timeout handling is used
    * Navigation and toolbar regressions P1
        - BCED-2926: follow a link to another dashboard while editor is open
            - Editor does not become blank
        - BCED-2967 / BCED-2997: use same-tab link navigation
            - Toolbar actions still work and no unexpected save workflow appears
        - BCED-2907 / BCED-2906: verify toolbar isolation and top layout
            - App-level toolbar settings do not bleed into the embedded editor and layout remains visually correct
    * Performance regressions P1
        - DE331633: scroll a large report
            - Scrolling remains usable and the regression is explicitly documented if still present
        - DE332080: measure first-create and first-open behavior on a cold session
            - Performance results are captured against the known high-risk baseline

- i18n
    * Report editor UI localization P3
        - Open the report editor and Save dialog in a non-English locale
            - Labels, buttons, menus, and dialog text use the correct locale
        - Trigger an error dialog in a non-English locale
            - Error text is localized correctly
    * Data display localization P3
        - Load a report containing CJK, Arabic, accented, and locale-sensitive values
            - Object names, dates, and numbers render correctly without garbling
