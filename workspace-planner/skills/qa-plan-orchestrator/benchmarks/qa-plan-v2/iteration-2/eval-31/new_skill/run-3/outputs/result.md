# Phase 4a — Scenario Draft (Subcategory-only) — BCVE-6678 (Export)

Feature QA Plan (BCVE-6678)

- Dashboard Google Sheets export (paths, options, completion)
    * Dashboard-level export path is available from Dashboard UI entry points <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Verify a Google Sheets export entry is present
                    - The export option label indicates Google Sheets
                    - The action is enabled (not disabled)
    * Dashboard-level export path is available from Dashboard context menu entry point <P2>
        - Open a dashboard
            - Open a dashboard object / canvas context menu (where export is expected)
                - Verify a Google Sheets export entry is present
                    - The export option label indicates Google Sheets
                    - The action is enabled (not disabled)
    * Dashboard Google Sheets export opens the expected options dialog/panel <P1>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Verify the export options UI is displayed
                    - A visible export options dialog/panel appears
                    - The dialog/panel is clearly associated with Google Sheets export
    * Dashboard Google Sheets export — default option state is visible and deterministic <P2>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Observe the initial option selections
                    - Default selections are visibly indicated (selected state / toggles / radio)
                    - The default selections are consistent across repeated open/close of the dialog
    * Dashboard Google Sheets export — options can be changed before export starts <P1>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Change one available option from its default
                    - The changed option remains visibly selected
                - Click Export / Confirm (the control that starts export)
                    - The export starts (progress indicator, spinner, or similar)
    * Dashboard Google Sheets export — option combination A produces successful completion outcome <P1>
        <!-- Replace “Option combination A” with the exact pair/tuple of options shown in the UI once confirmed from evidence/UI -->
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Set option combination A
                    - Each selected option is visibly reflected in the UI before starting
                - Start export
                    - A visible completion outcome is shown
                        - Success toast / banner appears, or
                        - A download/open-in-sheets outcome appears, or
                        - A status area indicates completion
    * Dashboard Google Sheets export — option combination B produces successful completion outcome <P2>
        <!-- Replace “Option combination B” with a different available combination; ensure it differs by at least one option -->
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Set option combination B
                    - Each selected option is visibly reflected in the UI before starting
                - Start export
                    - A visible completion outcome is shown
                        - Success toast / banner appears, or
                        - A download/open-in-sheets outcome appears, or
                        - A status area indicates completion
    * Dashboard Google Sheets export — cancel from options dialog does not start export <P1>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Click Cancel / Close
                    - The options dialog/panel closes
                    - No export progress indicator appears
                    - No completion toast/banner appears
    * Dashboard Google Sheets export — closing the dialog via X does not start export <P2>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Close the options dialog via the close (X) control
                    - The options dialog/panel closes
                    - No export progress indicator appears
                    - No completion toast/banner appears
    * Dashboard Google Sheets export — export in progress shows visible progress state <P2>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Start export
                    - A visible in-progress state appears
                        - Spinner/progress indicator is visible, or
                        - Export job status UI is visible
    * Dashboard Google Sheets export — completion outcome is visible and unambiguous <P1>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Start export
                    - Verify completion is visible
                        - A success state is presented (toast/banner/status)
                        - The UI indicates what happened next (e.g., file created, link available, or sheet opened)
    * Dashboard Google Sheets export — failure outcome is visible and actionable <P1>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Start export under a condition that causes failure (e.g., disconnect network / invalidate auth / deny permission)
                    - A visible failure outcome is shown
                        - Error message is displayed
                        - The export does not present a success completion signal
                        - A next step is offered (retry, close, learn more) if present
    * Dashboard Google Sheets export — repeated exports show consistent completion signaling <P2>
        - Open a dashboard
            - Trigger Export → Google Sheets
                - Start export
                    - A visible completion outcome is shown
                - Trigger Export → Google Sheets again
                    - Start export again
                        - A visible completion outcome is shown again
                        - The second run does not silently fail without any completion signal