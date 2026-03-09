<!--
QA Plan Draft v1 — BCED-2416
Feature: Enhance Workstation dashboard authoring experience with Library capability parity
Generated: 2026-03-09
Evidence: qa_plan_atlassian_BCED-2416.md, jira_issue_BCED-2416.md, jira_related_issues_BCED-2416.md,
          research_ws_report_editor_functionality.md, research_library_vs_ws_gap.md

Priority legend:
  P1 — directly relates to the code change in BCED-2416
  P2 — maybe influenced by change (parity, regression risk)
  P3 — nice-to-have / exploratory

⚠️ RISK MARKERS are inline with individual cases.
-->

Workstation New Dashboard Editor — QA Plan (BCED-2416)

- Toggle & Feature Gating
    * Enable New Dashboard Editor — default OFF P1 ⚠️RISK: default behavior must not be broken by opt-in
        - Connect Workstation to any server (25.09+)
        - Do NOT touch Help menu toggle
            - Dashboard create / edit routes to legacy editor
        - Open Help menu
            - "Enable New Dashboard Editor" item is visible and unchecked by default
    * Enable toggle ON P1
        - Go to Help menu → click "Enable New Dashboard Editor" to enable
        - Create a new dashboard / edit existing dashboard
            - New embedded Library-based editor opens (not legacy editor)
    * Toggle persistence P1
        - Enable the toggle
        - Restart Workstation / reconnect to same environment
            - Toggle state persists; new editor still used for dashboards
    * Toggle OFF after enabling P1
        - Enable toggle, open new editor, then disable toggle
        - Create / edit a dashboard again
            - Legacy editor is used; no broken state or orphaned windows
    * Preference key exposed to plugins P2
        - Check Workstation plugin preference key `new-dashboard-editor`
            - Key is readable and reflects toggle state correctly

- Version-based Routing & Upgrade ⚠️RISK: version-gating defects are high-impact
    * Supported server → new editor P1
        - Workstation connected to Library server ≥ 25.08/25.09 with toggle ON
        - Create or edit a dashboard
            - New embedded editor is used
    * Unsupported (pre-25.08) server → legacy fallback P1 ⚠️RISK: wrong routing = regression
        - Workstation connected to older Library server with toggle ON
        - Create or edit a dashboard
            - Legacy editor opens; no broken workflow or error dialog
    * Pre-threshold server: no new-editor menu entries shown P1
        - Connect to old server
        - Check context menu / File menu for dashboard actions
            - New-editor menu entries not visible or canExecute returns false correctly
    * Server upgrade mid-session P2
        - Open Workstation connected to old server (legacy editor active)
        - Admin upgrades Library server to supported version
        - Reconnect or refresh environment
            - Routing correctly switches to new editor
    * Mixed environments (old + new) P1
        - User has two environments: one old server, one new server
        - Create/edit from each environment
            - Correct editor used per environment; no menu confusion between windows

- Core Authoring: Create New Dashboard P1
    * New dashboard from create icon P1 ⚠️RISK: dataset select → editor flow is new
        - Toggle ON, supported server
        - Click Create Dashboard icon / button
        - Dataset select page appears; select a dataset and click Create
            - New Library-embedded editor opens with selected dataset bound
    * New dashboard from Workstation File/menu P1
        - Toggle ON, supported server
        - Use File menu / menu bar to initiate new dashboard
            - Same dataset-select → new editor flow as icon entrypoint
    * Create from dataset context menu P1
        - Right-click a dataset in the object browser
        - Select "Dashboard from dataset" (or equivalent)
            - New editor opens with the selected dataset context pre-loaded
    * Create from template P2
        - Toggle ON, supported server
        - Create new dashboard using a template
            - New editor opens with template applied; template objects visible and editable
    * New dashboard with no dataset (blank) P2
        - Initiate new dashboard and skip/dismiss dataset selection if supported
            - Blank editor opens or correct prompt appears per design spec

- Core Authoring: Edit Existing Dashboard P1
    * Edit existing dashboard via right-click P1 ⚠️RISK: must open new editor, not legacy
        - Toggle ON, supported server, existing dashboard visible in browser
        - Right-click dashboard → select Edit
            - New embedded editor opens with the dashboard loaded
    * Edit via double-click or toolbar (if applicable) P1
        - Toggle ON, existing dashboard
        - Double-click or use toolbar to open for editing
            - New editor opens (consistent with right-click path)
    * Edit without Data (pause mode) P1 ⚠️RISK: was menu-cleanup item in CGWI-661
        - Toggle ON, supported server, existing dashboard
        - Select "Edit without Data" from context menu / menu bar
            - Editor opens in pause mode; data is NOT executed; user can author without live data
        - Verify legacy "Edit without Data" menu entry is hidden when new editor is active
            - Only new-editor-appropriate entry visible in menu
    * Open dashboard for view then switch to edit P2
        - View an existing dashboard in consumption mode
        - Click Edit from toolbar
            - New editor activates in the same window; no re-load from scratch required

- Core Authoring: Save & Save As P1 ⚠️RISK: native Workstation save dialog must appear
    * Save uses native Workstation dialog P1
        - In new editor, make a change to the dashboard
        - Click Save (Ctrl+S or toolbar)
            - Native Workstation save dialog appears (not browser dialog, not Library-side dialog)
    * Save As uses native Workstation dialog P1
        - In new editor, click Save As
            - Native Workstation Save As dialog appears with correct defaults (name, folder)
        - Change name and/or destination folder; confirm save
            - Dashboard saved at new location; visible in object browser without manual refresh ⚠️RISK: DE332260
    * New dashboard visible after create and save P1 ⚠️RISK: DE332260 folder refresh regression
        - Create + save new dashboard to a folder
        - Check object browser / folder view
            - New dashboard appears immediately without requiring manual folder refresh
    * Window title updates after save/rename P2
        - Save or rename a dashboard in the new editor
            - Workstation window title (toolbar) updates to reflect the new name ⚠️RISK: BCED-3149
    * Save As Template / Certify checkbox P1 ⚠️RISK: DE331555 missing checkbox regression
        - Open new editor in an environment where template/certify is applicable
        - Invoke Save / Save As
            - "Set as Template" and "Certify" checkboxes are visible and functional in the save dialog
    * Save to different folder permissions P2
        - Attempt Save As to a folder the user does not have write access to
            - Proper permission error shown; no partial save
    * Unsaved changes protection P1
        - Make changes in editor without saving
        - Close the editor window (X button or Close)
            - Confirmation dialog appears asking to save, discard, or cancel
        - Choose discard
            - Window closes; no changes persisted

- Core Authoring: Edit Without Data / Pause Mode P1
    * Pause mode does not execute data P1
        - Open dashboard in Edit without Data / pause mode
            - Report/dashboard objects visible in authoring state; no data query fired
    * Resume data from pause mode P1
        - In pause mode, click Resume / Re-execute (if available)
            - Data executes and populates the dashboard
    * Cancel during initial pause-to-execute transition P2
        - Start execution resume, then click cancel before data loads
            - Execution cancelled; editor returns to editable state

- Presentation Mode P2
    * Enter presentation mode P2
        - In new editor, click Presentation mode button / menu
            - UI transitions to presentation view (clean viewer mode)
    * Return to authoring from presentation P2
        - In presentation mode, click Edit button
            - Returns to authoring state without losing unsaved changes
    * Presentation mode toolbar and controls P3
        - Inspect toolbar controls in presentation mode
            - Only presentation-appropriate controls shown; authoring controls hidden

- Cancel / Close / Execution Control P1 ⚠️RISK: cancel semantics were a known Library gap
    * Cancel during execution (cancel button) P1
        - Dashboard executing with data load in progress
        - Click Cancel button
            - Execution stops; UI shows canceled/idle state; no error dialog unless expected
    * Cancel with X button during execution P1 ⚠️RISK: BCFR-46 — SQL should cancel on server too
        - Long-running execution in new editor
        - Click X (window close) during execution
            - Execution is canceled on backend; window closes cleanly
    * Cancel during prompt application P1 ⚠️RISK: Library parity — return to prompt page
        - Dashboard with prompts, user answers prompts and clicks Apply
        - During execution after Apply, click Cancel
            - Returns to prompt page with original answers preserved (Library parity)
    * Re-prompt after cancel P2
        - Cancel during execution (prompt-based dashboard)
        - Re-enter prompt answers and apply
            - New execution runs correctly; no stale state from previous cancel
    * Close window with Library-side navigation (goBack/goHome/exit edit mode) P1 ⚠️RISK: embedded-native event bridge
        - In embedded editor, trigger Library-side navigation (e.g., go back / go home)
            - Workstation window closes or transitions correctly; no orphaned window
    * WebError.html must NOT appear P1 ⚠️RISK: CGWI-661 — raw error page regression
        - Induce an internal embedded editor error (e.g., broken resource, bad state)
            - Workstation native error dialog is shown; raw WebError.html is NOT displayed
    * Error dialog in embedded context P1
        - Trigger a Library-side caught error (e.g., session expiry, loading failure)
        - Workstation error dialog shown with appropriate message
            - User can acknowledge and recover; app does not hang

- Security / Privilege / ACL P1 ⚠️RISK: ACL must match Library Web — escalation risk
    * No edit privilege — edit blocked P1
        - Log in as user without edit/write ACL on a dashboard
        - Attempt to open dashboard for edit via context menu
            - Edit action blocked; behavior matches Library Web (no option or appropriate error)
    * Save blocked for unauthorized destination P1
        - User can edit but target folder is read-only or access denied
        - Attempt Save As to that folder
            - Permission error shown; no partial or silent failure
    * Restricted object not accessible in editor P1
        - Open a dashboard that references objects the user has no access to
            - Objects not shown or hidden correctly; no escalation of data access
    * Object creation requires correct privilege P1
        - User without "Create application objects" privilege
        - Attempt to create a new dashboard
            - Action blocked per privilege requirement
    * Auth in embedded context P1
        - Open a dashboard requiring authentication (auth-required data source)
            - Auth workflow completes in embedded context; data loads after auth
    * OAuth / SDK / CC source auth in embedded context P1 ⚠️RISK: DE332662 — known failure
        - Dashboard uses OAuth / SDK / Community Connector data source
        - Trigger auth popup / window flow from new editor
            - Popup opens correctly; context communication works; auth completes; data loads
            - VERIFY: no silent failure or broken popup as per DE332662 regression
    * Session expiry during embedded load P2
        - Allow Library session to expire mid-load of embedded editor
            - cancelLoadingAndShowErrorDialog fires; Workstation shows error dialog; no hang
    * Privilege: no escalation via embedded context P1
        - Attempt to access restricted dashboard via embedded editor path
            - Access denied consistent with direct Library Web access

- Performance P1 ⚠️RISK: known ~20s degradation for first-open (25.09)
    * First-time dashboard creation performance P1 ⚠️RISK: DE332080
        - Fresh Workstation session (cold cache), toggle ON, supported server
        - Time the flow from "click create" to editor fully loaded
            - Total time measured and recorded; note if > 20s (known risk threshold)
    * First-time existing dashboard open performance P1
        - Fresh session, open an existing dashboard in new editor
            - Time measured; compare to 25.07 baseline; note +2s to +4s known risk range
    * Warm-state repeated open P2
        - Open same dashboard a second time in same session (warm cache)
            - Materially faster than cold first-open; acceptable responsiveness
    * Scroll responsiveness P1 ⚠️RISK: DE331633 — hard/unsmooth scrolling known defect
        - Load a dashboard with multiple panels/objects in editor
        - Scroll through the content
            - Scroll is smooth and usable; capture whether DE331633 regression is present
    * Manipulation latency P2
        - Perform drag-and-drop, resize, property change in the editor
            - Manipulations respond without significant lag; compare to classic editor feel
    * Network sensitivity (cold open) P2
        - Open new editor on a slower network connection
        - Time the load
            - Document sensitivity; verify bundles are loaded from local Workstation (CGWI-1570)

- Menu Structure & UI Parity P1 ⚠️RISK: duplicate/stale menu entries from CGWI-661/BCIN-7289
    * No duplicate menu entries P1 ⚠️RISK: workstation.json registers new + old window entries
        - Toggle ON, new editor active
        - Inspect context menus on dashboards and within editor
            - No duplicate "New Dashboard", "Edit Dashboard" entries visible; correct `isVisible` filtering applied
    * No stale legacy entries in new-editor mode P1
        - New editor open
        - Check File menu, right-click menu, toolbar
            - Legacy-only entries (e.g., old "Edit without Data") properly hidden or replaced
    * New-editor entries absent in legacy mode P1
        - Toggle OFF, legacy editor active
        - Check menus
            - New-editor-only entries not shown; no `canExecute=false` visual noise
    * Theme menu location P2
        - New editor open
        - Check Theme controls
            - Theme menu is in the menu bar (not a buried submenu); matches design spec
    * FORMAT and VIEW menu categories P2 ⚠️RISK: BCIN-7289 docs say these may be absent in embedded editor
        - New editor open
        - Inspect top menu bar for FORMAT and VIEW categories
            - Confirm expected presence or intentional absence matches design decision
    * Object editor / properties dialogs open correctly P1
        - Select an object in the editor
        - Open Object Editor / Object Properties from context menu or toolbar
            - Workstation-native dialog opens correctly via `openObjectEditor` / `openObjectProperties` SDK bridge
    * User comments dialog P2
        - In editor, open comments flow (if supported)
            - Comments dialog opens via `getUserComments` bridge; functions correctly
    * Window title set correctly P2
        - Open new editor for a new or existing dashboard
            - `setWindowTitle` called correctly; title reflects dashboard name

- Compatibility: Subsystems in WS Editor P2 ⚠️RISK: parity scope covers DI, vis, export, auth, fonts
    * Data Import (DI) in new editor P2 ⚠️RISK: BCSM-2114 parity scope
        - Toggle ON, supported server, dashboard with DI capability
        - Invoke data import flow from within new editor
            - DI dialog/flow functions; no crash or missing UI
    * Visualizations authoring parity P2 ⚠️RISK: BCVE-1534
        - Open dashboard with various visualization types in new editor
        - Edit visualization properties
            - Properties available and functional per Library Web parity; no regression vs classic
    * Export to Excel from new editor P2 ⚠️RISK: BCVE-1535 / gap was present in classic
        - Dashboard with exportable data open in new editor
        - Export to Excel
            - Export executes and downloads correctly; Library-standard export dialog used
    * Export to PDF from new editor P2
        - Dashboard open in new editor
        - Export to PDF
            - PDF export succeeds; Library-standard export settings dialog shown
    * Custom fonts in font picker P2 ⚠️RISK: BCIN-1190 / BCIN-1263
        - Environment with custom fonts configured
        - Open font picker in new editor
            - Custom fonts appear in the font list and render correctly in dashboard
    * Cancel SQL on close (BCFR-46) P1 ⚠️RISK: SQL must cancel on close — customer requirement
        - Dashboard executing a long-running query
        - Close the editor window
            - Backend SQL execution is cancelled; verified via server-side monitoring or log
    * Convert report/unit settings (BCFR-33) P3
        - Convert a modern grid to classic or compound grid within editor
            - Unit settings cleaned correctly; no unexpected leftover state

- Local Mode & Legacy Editor Coexistence P2
    * Local mode still works before retirement P2
        - Workstation in local mode (no server)
        - Create/edit a dashboard
            - Legacy/local editor is used; no crash or forced redirect to new editor
    * Save-as from local mode to metadata server P2
        - Create dashboard in local mode; save to connected metadata server
            - Object appears on server after save; subsequent open uses new editor if toggle ON and server supported
    * Legacy editor unaffected when toggle OFF P1
        - Ensure toggle OFF means legacy editor is used in all create/edit flows
            - No code path activates new editor when preference is false

- Platform Differences P2
    * Mac Workstation: native dialogs P2 ⚠️RISK: platform-specific dialog behavior
        - Run all save/save-as/cancel/close flows on macOS Workstation
            - Native macOS dialogs appear where expected; no Windows-specific behavior leaked
    * Windows Workstation: native dialogs P2
        - Run same flows on Windows Workstation
            - Native Windows dialogs appear correctly
    * Mac vs Windows: toggle and routing P2
        - Enable toggle, open new editor on both platforms
            - Same behavior; no platform-specific routing difference
    * Mac vs Windows: performance P3
        - Compare first-open timing on Mac vs Windows
            - Document any significant difference; note if Mac WebView vs Windows CEF behaves differently
    * Mac vs Windows: popup / auth windows P2
        - OAuth / auth popup flow on Mac and Windows
            - Popup opens and completes on both platforms; note any window-focus difference

- Regression P1 ⚠️RISK: known defect regression pool from 25.08/25.09 (66+90 defects)
    * DE331555 — missing Set as Template / Certify checkbox P1
        - Save a newly created dashboard in supported environment
            - Both checkboxes are present in native save dialog
    * DE332260 — new object not visible after save/create P1
        - Create and save new dashboard; check object browser
            - Object appears without manual refresh
    * DE331633 — hard scroll regression P1
        - Scroll in editor with larger dashboard
            - Scroll is smooth; capture if DE331633 still reproducible
    * DE332080 — first-create / first-render performance P1
        - Time first dashboard create cold
            - Record and compare; flag if worse than 25.09 known baseline
    * DE334755 — stale message after connection editor closes P2
        - Open connection editor from embedded context; close it
            - No stale notification/message left in editor or WS toolbar
    * DE332662 — OAuth/SDK/CC popup fails in embedded context P1
        - Attempt OAuth auth in new editor context
            - Popup window communicates correctly; no silent failure
    * BCED-3121 — two X buttons on menu bar P1
        - Verify only one X/close button present on menu bar in new editor
            - No duplicate close buttons; clicking X behaves correctly
    * BCED-3136 — cannot close editor in AQDT compatibility environment P2
        - Connect to AQDT-equivalent environment; open and close editor
            - Close button works; no hang or non-responsive state
    * BCED-3149 — window title not updated after new dashboard saved P2
        - Create, save (with custom name), check toolbar title
            - Title reflects saved name correctly
    * BCED-2997 — link click triggers save workflow P2
        - Click a hyperlink/button inside embedded dashboard
            - Link navigates as expected; save dialog does not appear unexpectedly
    * BCED-3097 — no response after logout in embedding library P2
        - Trigger logout within embedded Library context
            - Workstation responds to the embedded logout event; window handles it gracefully

- i18n / Locale P3
    * Non-English Workstation locale P3
        - Set Workstation to a non-English locale (e.g., Japanese, German)
        - Enable new editor and create/edit/save a dashboard
            - Menu items, dialogs, and error messages display in correct locale
    * Non-ASCII characters in dashboard name P3
        - Save a dashboard with a name containing non-ASCII characters
            - Name saved and displayed correctly everywhere

- Embedding (SDK Context) P2
    * Embedding SDK: new EmbedReportAuthoring page type P2 ⚠️RISK: BCIN-7289 SDK scope
        - Embed a report in authoring mode via new SDK (scope: Workstation-only as designed)
            - Embedding loads correctly; `ReportAuthoringService` functions available
    * SDK function: deleteDossierInstance P2
        - Invoke deleteDossierInstance cleanup on embed close
            - Instance cleaned up; no resource leak
    * SDK function: cancelLoadingAndShowErrorDialog P2
        - Simulate session-out during load in embedded mode
            - Error dialog shown; loading cancelled gracefully
    * Embedding from non-Workstation origin rejected P2
        - Attempt to use new embed authoring API from a non-Workstation origin
            - API throws error as per design (origin check enforced)

