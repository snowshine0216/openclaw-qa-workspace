# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Dashboard export → Google Sheets
    * Start Google Sheets export from dashboard-level export entry points (toolbar / menu) <P1>
        - Open a dashboard that has at least one grid/visualization with data
            - Open the dashboard-level Export menu from the primary toolbar
                - Select the Google Sheets export option
                    - The Google Sheets export configuration UI opens for the dashboard context
                    - The configuration UI indicates the export target is Google Sheets
    * Start Google Sheets export from dashboard-level context menu entry points (right-click) <P2>
        - Open a dashboard
            - Right-click within a visualization on the dashboard
                - Choose Export
                    - Choose Google Sheets
                        - The Google Sheets export configuration UI opens
                        - The export flow remains in the dashboard context (no report-level navigation required)

- Dashboard export → Google Sheets → Option combinations
    * Export with default options (no option changes) completes successfully with visible completion outcome <P1>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - Keep all default export options
                    - Click Export/Start (the primary action to begin export)
                        - A progress indicator or in-progress state appears
                        - A completion success outcome becomes visible (e.g., toast/banner/status)
                        - The success outcome includes a way to open the generated Google Sheet (link/button) OR explicitly states where it was saved
    * Toggle each available option (one-at-a-time) and verify the selection is reflected in the export request and result <P1>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - For each option available in the dialog
                    - Change only that option from its default
                        - Start export
                            - The completion outcome is visible
                            - The produced Google Sheet reflects the toggled option (format/content/scope matches selection)
    * Validate incompatible/disabled option combinations are prevented or clearly messaged before export starts <P2>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - Select an option combination that should be invalid (based on what the UI allows/selectors imply)
                    - Observe the primary Export/Start button state
                        - The export cannot be started when the combination is invalid OR
                        - A clear inline validation message indicates what must change

- Dashboard export → Google Sheets → Visible completion outcomes
    * Success outcome is visible and actionable (open sheet / copy link) <P1>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - Start export
                    - Wait for completion
                        - A success toast/banner/status is shown
                        - The UI provides an action to open the created Google Sheet OR copy a link
                        - The opened link targets the expected Google file (newly created export output)
    * Failure outcome is visible and provides next steps (retry / diagnostics) <P1>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - Induce a failure (e.g., disconnect network / revoke access) before starting export
                    - Start export
                        - A visible failure outcome is shown (toast/banner/dialog)
                        - The message indicates the failure reason category (auth/network/permission) without being blank
                        - A retry action is offered OR the user is guided to re-authenticate
    * Cancellation results in a visible canceled state without producing a Google Sheet <P2>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - Start export
                    - Cancel the export while it is in progress
                        - A visible canceled outcome is shown
                        - No success link/action is presented
                        - A new Google Sheet is not created for the canceled attempt

- Dashboard export → Google Sheets → Dashboard vs non-dashboard distinction
    * Dashboard-level export path does not incorrectly route to report-level export settings UI <P1>
        - Open a dashboard
            - Start dashboard-level Export → Google Sheets
                - Observe the configuration UI title/header and context cues
                    - The UI indicates a dashboard export flow (dashboard naming/context)
                    - The user is not taken to report/application-level export settings screens
    * Switching between dashboards keeps the export context correct (no stale dashboard name/scope) <P2>
        - Open dashboard A
            - Start Export → Google Sheets
                - Note the dashboard name/scope shown in the dialog (if present)
                    - Close the dialog without exporting
                        - Open dashboard B
                            - Start Export → Google Sheets
                                - The dialog context reflects dashboard B (not dashboard A)

- Dashboard export → Google Sheets → Preconditions & auth
    * First-time authorization prompts appear and successful authorization returns to export completion flow <P1>
        - Use a user who has not authorized Google Sheets integration
            - Open a dashboard
                - Start Export → Google Sheets
                    - Proceed when prompted to authorize/connect Google account
                        - The authorization UI appears
                        - After successful authorization, the user returns to the export flow
                        - Export can be started and completes with a visible success outcome
    * Already-authorized user does not get re-prompted and export completes <P2>
        - Use a user who has already authorized Google Sheets integration
            - Open a dashboard
                - Start Export → Google Sheets
                    - The export dialog opens without an authorization interruption
                    - Export completes with a visible success outcome