# Feature QA Plan (BCVE-6678) — Phase 4a Scenario Draft (export)

- Google Sheets export — dashboard-level paths
    * Dashboard: Export via main toolbar > Export > Google Sheets (happy path) <P1>
        - Open a dashboard
            - Ensure at least one visualization exists on the dashboard
                - Open the main toolbar Export menu
                    - Select Google Sheets export
                        - Export flow starts (export dialog opens or export begins)
                        - A visible completion outcome is shown (e.g., success toast / completion message / downloadable/openable result)
                        - The exported file opens/downloads as a Google Sheets-compatible spreadsheet
    * Dashboard: Export via visualization context menu > Export > Google Sheets (happy path) <P1>
        - Open a dashboard
            - Right-click (or open More/… menu) on a visualization
                - Select Export
                    - Select Google Sheets
                        - Export flow starts from the viz context path
                        - A visible completion outcome is shown
                        - The exported spreadsheet content corresponds to the selected visualization (not the entire dashboard)
    * Dashboard: Export via dashboard overflow/… menu > Export > Google Sheets (happy path)
        - Open a dashboard
            - Open the dashboard overflow/… menu
                - Select Export
                    - Select Google Sheets
                        - Export flow starts from the dashboard menu path
                        - A visible completion outcome is shown

- Google Sheets export — option combinations
    * Dashboard: Google Sheets export options default values are applied when user does not change settings <P1>
        - Open a dashboard
            - Start a Google Sheets export (any dashboard-level entry point)
                - Observe the export settings in the export dialog
                    - Default option values are pre-selected as designed
                - Confirm export without changing any options
                    - Export completes with a visible completion outcome
                    - The resulting spreadsheet reflects the default option selections
    * Dashboard: Toggle each Google Sheets export option and verify the output reflects the selection
        - Open a dashboard
            - Start a Google Sheets export
                - For each option available in the export settings dialog
                    - Change the option value
                        - Confirm export
                            - Export completes with a visible completion outcome
                            - The resulting spreadsheet reflects the changed option value
    * Dashboard: Validate option combinations (pairwise) for Google Sheets export <P1>
        - Open a dashboard
            - Start a Google Sheets export
                - Select an option combination set (pairwise across available toggles/dropdowns)
                    - Confirm export
                        - Export completes with a visible completion outcome
                        - The resulting spreadsheet matches the combination’s expected formatting/content
    * Dashboard: Cancel export from Google Sheets export dialog (no export executed)
        - Open a dashboard
            - Start a Google Sheets export
                - In the export dialog, click Cancel/Close
                    - No success completion outcome is shown
                    - No file is downloaded/opened
                    - User remains on the dashboard

- Google Sheets export — visible completion outcomes
    * Dashboard: Successful Google Sheets export shows a success completion message/toast <P1>
        - Open a dashboard
            - Start a Google Sheets export
                - Complete the export flow
                    - A visible success completion outcome is shown
                    - No error banner/toast is shown
    * Dashboard: Export failure shows a visible error outcome (no silent failure) <P1>
        - Open a dashboard
            - Start a Google Sheets export
                - Force an export failure condition (e.g., revoke permission / network offline / server error)
                    - A visible error message/toast is shown
                    - No success completion outcome is shown
                    - User can retry export or exit the flow without breaking the dashboard
    * Dashboard: Long-running Google Sheets export shows in-progress feedback and final completion outcome
        - Open a dashboard
            - Start a Google Sheets export on a large dataset/dashboard
                - Observe in-progress UI feedback (spinner/progress/disabled buttons)
                    - Wait for completion
                        - A visible completion outcome is shown
                        - The final spreadsheet is available and opens/downloads successfully

- Google Sheets export — path distinctions and correctness checks
    * Dashboard: Export entry points (toolbar vs dashboard menu vs viz context menu) all lead to Google Sheets export with consistent settings behavior <P1>
        - Open a dashboard
            - Start Google Sheets export from the main toolbar
                - Observe the export settings and completion outcome
            - Start Google Sheets export from the dashboard overflow/… menu
                - Observe the export settings and completion outcome
            - Start Google Sheets export from the visualization context menu
                - Observe the export settings and completion outcome
                    - Settings are consistent where expected (or differences are explicitly visible and intended)
                    - Completion outcomes are visible and consistent (success/failure/in-progress)
    * Dashboard: Export started from viz context menu does not accidentally export the entire dashboard <P1>
        - Open a dashboard with multiple visualizations
            - Start Google Sheets export from a single visualization context menu
                - Complete export
                    - Exported content is scoped to the chosen visualization
                    - Other visualizations’ data is not included unless explicitly selected by an option