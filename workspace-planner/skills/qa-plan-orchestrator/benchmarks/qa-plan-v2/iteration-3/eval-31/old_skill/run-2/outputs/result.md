# Phase 4a — Scenario Draft (subcategories only)

Feature QA Plan (BCVE-6678)

- Export — Dashboard → Google Sheets
    * Export dashboard to Google Sheets with default options <P1>
        - Open a dashboard that is eligible for export
            - Open the dashboard-level Export menu
                - Select Google Sheets as the export target
                    - Leave all export options at their defaults
                        - Start the export
                            - A visible “export started / in progress” indication appears
                            - Export completes with a visible “completed / success” outcome
                            - A Google Sheets destination artifact is created/available as the completion outcome
    * Export dashboard to Google Sheets with each option combination (matrix coverage) <P1>
        - Open a dashboard that is eligible for export
            - Open the dashboard-level Export menu
                - Select Google Sheets as the export target
                    - For each supported option toggle/selector in the dialog, generate a minimal pairwise matrix of combinations
                        - For each option combination in the matrix
                            - Apply the option values
                                - Start the export
                                    - A visible “export started / in progress” indication appears
                                    - Export completes with a visible “completed / success” outcome
                                    - The completion outcome reflects the selected option values (observable in the resulting Google Sheet and/or completion UI)
    * Export dashboard to Google Sheets distinguishes dashboard-level path from other export entry points <P1>
        - Open a dashboard
            - Trigger export via the dashboard-level Export entry point
                - Select Google Sheets
                    - Start the export
                        - The UI indicates this is a dashboard export flow (entry point context is clear)
                        - Export completes with a visible “completed / success” outcome
        - Open a non-dashboard export entry point available in the product (if present)
            - Trigger export and select Google Sheets
                - Start the export
                    - The export flow and completion outcome are distinguishable from the dashboard-level export path (e.g., different header/context/breadcrumb)

- Export — Dashboard → Google Sheets (completion outcomes)
    * Completion outcome is visible and user-actionable <P1>
        - Start a dashboard-level export to Google Sheets
            - Wait for export processing to finish
                - A visible completion outcome is presented (not silent)
                - The completion outcome includes a clear success indicator
                - The completion outcome provides an obvious next step to access the created Google Sheet (e.g., open link/button) if the product supports it
    * Completion outcome for repeated exports is consistent and distinguishable per run <P2>
        - Run a dashboard-level export to Google Sheets
            - Confirm completion outcome is visible
                - Run the same export again
                    - A new completion outcome is shown for the second run
                    - The UI does not ambiguously reuse stale completion messaging for the earlier run

- Export — Dashboard → Google Sheets (input/eligibility variations)
    * Export a dashboard with multiple visualizations to Google Sheets <P2>
        - Open a dashboard with multiple visualizations
            - Export to Google Sheets
                - Use default options
                    - Start the export
                        - Export completes with a visible “completed / success” outcome
                        - The resulting Google Sheet contains content for each visualization (observable presence per viz)
    * Export a dashboard with filters/prompts applied to Google Sheets <P2>
        - Open a dashboard
            - Apply dashboard filters/prompts that affect data
                - Export to Google Sheets
                    - Start the export
                        - Export completes with a visible “completed / success” outcome
                        - The resulting Google Sheet reflects the filtered/prompted state (observable via changed values/rows)

<!-- Notes (evidence constraints):
- Fixture evidence provided is limited to Jira metadata/adjacent-issues summaries; no UI strings, option list, or documented completion UX was included.
- Therefore, scenarios are drafted to explicitly cover: (1) dashboard-level Google Sheets export entry path, (2) option combinations, and (3) visible completion outcomes, without asserting specific option names.
-->