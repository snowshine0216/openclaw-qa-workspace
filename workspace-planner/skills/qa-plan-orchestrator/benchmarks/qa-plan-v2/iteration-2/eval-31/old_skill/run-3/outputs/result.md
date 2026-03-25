# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Dashboard export — Google Sheets
    * Dashboard-level Google Sheets export path is available
        - Open a dashboard
            - Open the dashboard Export menu
                - Verify Google Sheets is listed as an export destination
    * Start Google Sheets export from dashboard and observe in-product completion outcome
        - Open a dashboard
            - Open the dashboard Export menu
                - Select Google Sheets export
                    - Confirm/submit the export
                        - A visible “export started / in progress” indication appears
                        - A visible “export completed” outcome appears (or an explicit completion state is shown)
    * Google Sheets export shows a visible failure outcome when export cannot be completed
        - Open a dashboard
            - Open the dashboard Export menu
                - Select Google Sheets export
                    - Confirm/submit the export
                        - Force an export failure condition (e.g., revoke required access or use an invalid/expired auth)
                            - A visible “export failed” outcome appears
                            - Any surfaced error message is visible to the user
    * Google Sheets export option combinations are selectable from the dashboard-level export flow
        - Open a dashboard
            - Open the dashboard Export menu
                - Select Google Sheets export
                    - In the export options UI, select a non-default combination of available options
                        - Confirm/submit the export
                            - The selected options are accepted (no validation error)
                            - The export proceeds to a visible completion outcome
    * Distinguish dashboard-level Google Sheets export path vs other export entry points (path identity)
        - Open a dashboard
            - Open the dashboard Export menu
                - Select Google Sheets export
                    - Capture the visible path context (e.g., dashboard title/context in the export dialog)
                        - The export UI indicates it is exporting the dashboard (not a different object type)
    * Repeat dashboard Google Sheets export and verify completion outcome is consistently visible
        - Open a dashboard
            - Run Google Sheets export from the dashboard Export menu
                - Wait for the visible completion outcome
                    - Run Google Sheets export again from the same dashboard
                        - A visible completion outcome appears again

- Export UX strings and UI consistency (dashboard export surface)
    * Dashboard export flow strings are present and readable
        - Open a dashboard
            - Open the dashboard Export menu
                - Open Google Sheets export
                    - Verify export-related labels/headers are present and not truncated
    * Dashboard export settings UI preserves key header/label visibility during scroll
        - Open a dashboard
            - Open the dashboard Export menu
                - Open Google Sheets export settings/options view
                    - Scroll the settings/options content
                        - The key header/label remains visible (no disappearing header regression)

- Application-level defaults impacting dashboard Google Sheets export (interaction)
    * Application-level default for Google Sheets export is reflected in dashboard export options
        - Ensure an application-level default for Google Sheets export exists
            - Open a dashboard
                - Open the dashboard Export menu
                    - Open Google Sheets export
                        - The default option values match the application-level defaults
    * Changing application-level default updates the initial option selection in dashboard Google Sheets export
        - Change the application-level default for Google Sheets export
            - Open a dashboard
                - Open the dashboard Export menu
                    - Open Google Sheets export
                        - The initial option selection reflects the updated default