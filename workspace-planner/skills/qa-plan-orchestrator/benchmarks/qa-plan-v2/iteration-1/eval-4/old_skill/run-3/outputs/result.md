# Phase 4a Benchmark Artifact — BCIN-7289 (report-editor)

Central topic: **Feature QA Plan (BCIN-7289) — Phase 4a subcategory draft (defect replay focus)**

- Workstation ↔ Library embedded report editor: launch & shell integration
    * Create blank report shows correct window title (SDK/API-visible outcome) <P1>
        - In Workstation, sign in with the **new report editor** enabled
            - Start **Create > Report > Blank**
                - Wait for the embedded report editor window to open
                    - Verify the window title is **not** the raw key `newReportWithApplication`
                    - Verify the window title is a user-facing localized string for “New Report …”
    * Double-click to edit report shows title matching the clicked report context (SDK/API-visible outcome) <P1>
        - In Workstation, open a folder containing at least two reports with distinct names
            - Double-click **Report A** to open in the embedded editor
                - Verify the window title contains **Report A** (or the expected localized form)
                - Close the editor window
                    - Double-click **Report B**
                        - Verify the window title updates to **Report B** (not stale from Report A)
    * Create/edit report shows a single loading indicator (observable outcome) <P2>
        - In Workstation, start **Create > Report > Blank**
            - During initial load
                - Verify there is **exactly one** loading spinner/indicator visible
        - Open an existing report for edit
            - During edit initialization
                - Verify there is **exactly one** loading spinner/indicator visible

- Save & Save As flows (including overwrite state transitions)
    * Save-As overwriting an existing report does not crash and completes (state transition + observable outcome) <P0>
        - In Workstation, open or create a report with a simple edit so it is “dirty”
            - Trigger **File/Toolbar > Save As**
                - Choose a target folder and enter a name that **matches an existing report**
                    - Confirm overwrite when prompted
                        - Verify **no JS error** is shown (specifically not “Cannot read properties of null (reading 'saveAs')”)
                        - Verify the save completes and the editor remains usable (no frozen UI)
                        - Re-open the overwritten target report
                            - Verify content reflects the saved changes
    * Template-based report creation: Save creates a new report (not overwriting the template) (state transition) <P0>
        - In Workstation, start **Create > Report from Template**
            - Pick a known template (e.g., “Product sales template”)
                - Make a simple edit
                    - Click **Save**
                        - Verify a **new report** is created (new object) rather than updating the template
                        - Re-open the template
                            - Verify the template content is unchanged
    * “Do not prompt” option on Save As prevents prompts on subsequent run (state + observable outcome) <P1>
        - Open a report that has prompts
            - Run once and answer prompts
                - Choose **Save As**
                    - Select option **Do not prompt**
                        - Save the new report
                            - Run the saved report
                                - Verify prompts are **not** shown

- Prompt handling & Report Builder interactivity
    * Prompt pause mode: template-created report runs successfully after creation (state transition) <P1>
        - Create a report from a template that uses **prompt pause mode**
            - Complete the creation flow
                - Attempt to run/execute the report
                    - Verify the report reaches a completed running state (not stuck / not failing to run)
    * Report Builder: double-clicking to edit a prompt loads sub-elements interactively (observable outcome) <P0>
        - Open a report that contains attribute/metric element prompts
            - Open the prompt editing experience
                - Double-click a prompt element to edit
                    - Verify the Report Builder renders its sub-elements (lists/trees/options)
                    - Verify the rendered elements are interactive (can expand/select)

- Close / confirmation dialogs & rapid interactions
    * Closing while prompt editor is open shows confirmation dialog (state transition) <P2>
        - Open a report
            - Open prompt editor (or a state that requires confirmation on close)
                - Click the window close (X)
                    - Verify a **Confirm to close / unsaved changes** dialog appears
    * Rapid clicking close (X) does not create duplicate confirmation dialogs (interaction pair) <P2>
        - Put the editor into a state where close confirmation is expected
            - Click the window close (X) repeatedly and quickly (e.g., 5–10 times)
                - Verify only **one** confirmation dialog is shown
                - Verify the UI remains responsive and dialog focus is correct

- Session expiry handling
    * Session timeout during edit shows clear error and routes to login (state transition + observable outcome) <P2>
        - Open a report for edit and ensure the editor is interactive
            - Invalidate the session (per test tooling/proxy/logout API)
                - Perform an editor action (e.g., remove an attribute)
                    - Verify a session-expired experience occurs (not “unknown error”)
                    - Dismiss any dialog if shown
                        - Verify the app routes to login or a recoverable re-auth flow
                        - Verify it does **not** spin/loading forever

- i18n / localization (SDK/API-visible strings)
    * Converting to Intelligent Cube: Confirm/Cancel buttons are localized (observable outcome) <P1>
        - Switch Workstation UI to **Chinese (zh-CN)**
            - Open a report and start **Convert to Intelligent Cube/Datamart**
                - When the conversion dialog appears
                    - Verify **Confirm** and **Cancel** button labels are translated
    * New Intelligent Cube Report title is localized for Chinese locale (SDK/API-visible outcome) <P1>
        - Set Workstation UI to **Chinese (zh-CN)**
            - Start creating a **New Intelligent Cube Report**
                - Verify the window title is translated (not English-only)
    * Other dialog titles in embedded editor are localized (observable outcome) <P2>
        - Set Workstation UI to **Chinese (zh-CN)**
            - Traverse key dialogs used in save/save-as/close/convert flows
                - Verify each dialog title is translated (no English-only titles where localization is expected)

<!-- Notes (evidence → scenario mapping for defect replay):
- Window title explicit scenarios map to BCIN-7674, BCIN-7719, BCIN-7721, BCIN-7733.
- “Single loader” explicit leaf maps to BCIN-7668.
- Save-as overwrite state transition maps to BCIN-7669.
- Prompt pause mode maps to BCIN-7730.
- Report Builder interactivity maps to BCIN-7727.
- Confirm-close dialog and duplicate popups map to BCIN-7708/BCIN-7709.
- Session timeout routing maps to BCIN-7693.
- i18n buttons/dialog titles map to BCIN-7720/BCIN-7722.
-->