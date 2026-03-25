# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Export — Google Sheets (Dashboard-level)
    * Export dashboard to Google Sheets — default options (baseline) <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets** as the export target
                    - Leave all export options at their default values
                        - Start the export
                            - Export starts without validation errors
                            - A visible “export started / in progress” indicator appears
                            - A visible “export completed” outcome is shown (e.g., success toast/dialog)
                            - The completed outcome indicates the destination is **Google Sheets**
    * Export dashboard to Google Sheets — verify dashboard-level export path (not report/application settings path) <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Observe the export entry point context (dashboard)
                    - Choose **Google Sheets**
                        - Start the export
                            - The UI path clearly indicates a **dashboard export** flow (dashboard context remains visible)
                            - Completion outcome is shown to the user (success / failure)
    * Export dashboard to Google Sheets — change a single option and export succeeds <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Change exactly one export option from its default value
                        - Start the export
                            - Export completes
                            - The completion outcome reflects success
    * Export dashboard to Google Sheets — multiple option combination A and export succeeds <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Set option combination A (two or more non-default options)
                        - Start the export
                            - Export completes
                            - The completion outcome reflects success
    * Export dashboard to Google Sheets — multiple option combination B and export succeeds <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Set option combination B (a different set of two or more non-default options)
                        - Start the export
                            - Export completes
                            - The completion outcome reflects success
    * Export dashboard to Google Sheets — cancel/close export progress UI (if available) preserves clear user outcome <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Start the export
                        - While export is in progress, cancel or dismiss the progress UI (if the UI offers this)
                            - A clear final state remains available to the user (e.g., export canceled, or export continues with a retrievable completion notification)
    * Export dashboard to Google Sheets — export failure shows visible completion outcome <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Configure the environment or inputs so export fails (e.g., revoke required authorization / use invalid destination context if applicable)
                        - Start the export
                            - A visible failure completion outcome is shown (toast/dialog)
                            - The failure message indicates Google Sheets export failed (not a generic error only)

- Export — Google Sheets (Option coverage: permutations)
    * Dashboard-level Google Sheets export — systematically cover option permutations (table-driven) <P2>
        - Identify all options presented in the dashboard-level Google Sheets export dialog
            - For each option, identify possible values (including defaults)
                - Select a minimal set of combinations that cover:
                    - Each option toggled away from default at least once
                    - At least one “all-defaults” run
                    - At least one “many non-defaults” run
                    - At least one run that exercises each mutually exclusive choice
                        - Execute export for each selected combination
                            - Each run ends with a visible completion outcome (success or failure)
                            - Completion outcome is understandable and consistent with the chosen options

- Export — Google Sheets (Completion UX)
    * Completion UX — success indicates where to find the exported Google Sheet <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Start the export
                        - Wait for completion
                            - Success state is visible
                            - The UI provides a clear next step (e.g., open/view the exported sheet, or confirms it was created in Google Drive)
    * Completion UX — repeated exports show distinct outcomes (no silent overwrite) <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose **Google Sheets**
                    - Start export and wait for completion
                        - Start a second export from the same dashboard (same options)
                            - A visible completion outcome is shown for the second export
                            - The completion outcome does not silently reuse the previous completion message without indicating a new run


<!-- Notes (evidence limitations):
- The provided fixture evidence includes only the Jira issue metadata and adjacent issue summaries; no product spec/screenshots were provided.
- Scenarios are drafted to explicitly cover the benchmark focus: dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes.
- Option names/values are intentionally abstract ("option combination A/B") due to missing UI specifics in evidence mode blind_pre_defect.
-->