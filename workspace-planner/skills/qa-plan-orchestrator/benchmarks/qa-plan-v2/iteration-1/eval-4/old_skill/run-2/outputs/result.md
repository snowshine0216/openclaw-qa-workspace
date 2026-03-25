# Phase 4a benchmark deliverable — BCIN-7289 (report-editor)

Central topic: **Feature QA Plan (BCIN-7289) — Phase 4a subcategory draft (defect replay focus)**

- Workstation embedded Library Report Editor — Window / Title / Loading outcomes
    * Create blank report — window title uses localized product string (not raw key) <P1>
        - Launch Workstation
            - Ensure **new report editor** feature flag is enabled
                - Connect to Library server
                    - Create a **blank report**
                        - Observe the Workstation window title
                            - Window title is **not** `newReportWithApplication` (no raw i18n key)
                            - Window title matches expected “New Report …” naming for the product (human-readable)
    * Create Intelligent Cube report — window title matches exact report context <P1>
        - Launch Workstation
            - Enable new report editor
                - Create an **Intelligent Cube Report**
                    - Observe the Workstation window title
                        - Window title is exactly **“New Intelligent Cube Report”** (or the locale-equivalent translation)
    * Edit report by double-click — window title updates to the opened report context <P0>
        - In Workstation report list
            - Locate an existing report
                - Double-click the report to open in the embedded editor
                    - Observe the Workstation window title
                        - Window title matches the **clicked report name/context** (not stale, not previous report)
    * Create/edit report — only one loading indicator is shown during load <P1>
        - Launch Workstation
            - Enable new report editor
                - Create a blank report (or open an existing report)
                    - Observe loading UI while the editor loads
                        - Exactly **one** loading indicator is visible (no duplicate spinners)

- Save / Save-As — overwrite & template edge states (explicit state transitions)
    * Save-As overwrite existing report — overwrite conflict confirmation path does not crash <P0>
        - Open or create a report in the embedded editor
            - Make a change
                - Click **Save As**
                    - Choose an existing report name/location that will **overwrite**
                        - Confirm overwrite in the UI
                            - No JavaScript error appears (e.g., no “Cannot read properties of null (reading saveAs)”)
                            - Save-As completes and the report is saved as the overwritten target
    * Create report from template — Save creates a new report (does not overwrite the template) <P0>
        - Launch Workstation
            - Enable new report editor
                - Create a report using a **template**
                    - Click **Save**
                        - A **new report** is created/saved
                        - The **source template** is not modified/overwritten
    * Save newly created report — “Set as template” option is enabled when applicable <P1>
        - Create a new blank report in the embedded editor
            - Click **Save**
                - In the save dialog
                    - Verify “Set as template” checkbox availability
                        - “Set as template” is **enabled/selectable** (not disabled unexpectedly)

- Prompt handling & Report Builder outcomes (explicit observable leaves)
    * Save-As with prompts — “Do not prompt” truly removes prompts on next run <P0>
        - Open a report that contains prompts
            - Execute the report and answer prompts
                - Click **Save As**
                    - Choose option **Do not prompt**
                        - Save the new report
                            - Re-open and run the saved-as report
                                - The report does **not** show prompts
                                - The report runs directly using saved/default values as designed
    * Template report with prompts in pause mode — creation → run transitions succeed <P0>
        - Create a report from a template configured with **prompt pause mode**
            - Complete creation flow
                - Attempt to run/execute the report
                    - Report enters the expected running/execution state
                    - Report does not get stuck due to pause-mode prompt state
    * Report Builder prompt editing — double-click loads interactive elements (not blank) <P0>
        - Open a report containing attribute/metric prompts
            - Open prompt editor / Report Builder prompt UI
                - Double-click to edit prompt elements
                    - Observe element list/picker rendering
                        - Prompt sub-elements load and are **interactive/selectable**
                        - No empty panel / missing elements state occurs

- Close / Confirm dialogs (modal behavior & interaction pair)
    * Close while prompt editor is open — confirmation dialog is shown <P1>
        - Open a report
            - Open the prompt editor
                - Attempt to close the report window (e.g., click window X)
                    - Confirm-to-close dialog is displayed
                        - User can choose Cancel/Close behavior as expected
    * Rapid repeated close clicks — only one confirm dialog instance appears <P2>
        - Open a report with unsaved changes
            - Attempt to close the window
                - Click the window X multiple times quickly
                    - Observe modal behavior
                        - Only **one** confirm-to-close dialog is present (no stacking/duplicates)

- Session timeout transition (active → expired → routed)
    * Session expires during editing — user is redirected to login and does not load forever <P1>
        - Open a report in the embedded editor
            - Simulate session expiration (e.g., force logout)
                - Perform an edit action (e.g., remove attribute from dropzone)
                    - Observe error handling
                        - A clear session-expired/auth-required message is shown
                        - User is redirected to login (or re-auth flow) after dismissal
                        - UI does **not** remain in infinite loading state

<!-- Notes (phase4a contract alignment):
- Subcategory-only: no canonical top layers.
- Defect replay focus explicitly includes SDK/API-visible outcomes (window title) as scenario verification leaves.
- Observable outcomes explicitly listed for loading indicators and title strings.
- State transitions explicitly rendered for save-as overwrite and session-expired routing.
-->