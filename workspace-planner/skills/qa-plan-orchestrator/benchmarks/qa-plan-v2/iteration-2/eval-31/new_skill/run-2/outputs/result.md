# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Google Sheets export — dashboard-level paths & completion outcomes
    * Dashboard: export to Google Sheets from dashboard UI entrypoint (happy path) <P1>
        - Open a dashboard
            - Open the dashboard-level export menu/action
                - Choose Google Sheets as the export target
                    - Confirm the export
                        - A visible “export started / in progress” indicator appears
                        - A visible completion outcome appears (success)
                        - The user is shown the destination or link to the created Google Sheet
    * Dashboard: export to Google Sheets from dashboard toolbar vs overflow menu produces same completion outcome <P2>
        - Open a dashboard
            - Trigger export from the dashboard toolbar entrypoint
                - Choose Google Sheets
                    - Confirm export
                        - Export completes with a visible success outcome
            - Trigger export from the dashboard overflow/More (⋯) entrypoint
                - Choose Google Sheets
                    - Confirm export
                        - Export completes with a visible success outcome
                        - The success completion outcome is consistent across both entrypoints
    * Dashboard: export option combinations — toggling options changes what is exported and is reflected in the resulting sheet <P1>
        - Open a dashboard
            - Open the dashboard export dialog
                - Select Google Sheets
                    - Toggle export option A (e.g., include/exclude something offered by the dialog)
                        - Toggle export option B (a second option, if offered)
                            - Confirm export
                                - Export completes with a visible success outcome
                                - The resulting Google Sheet reflects the chosen option combination (content/structure matches selections)
    * Dashboard: export option combinations — invalid/unsupported combination is blocked or yields an explicit, visible error outcome <P1>
        - Open a dashboard
            - Open the dashboard export dialog
                - Select Google Sheets
                    - Select an option combination that should be invalid/unsupported (per requirements/UI constraints)
                        - Attempt to confirm export
                            - The confirm action is disabled OR a validation message is shown
                            - No export is started
                            - The user sees a clear, visible reason the export cannot proceed
    * Dashboard: export completion outcomes — user cancels before confirming export <P2>
        - Open a dashboard
            - Open the dashboard export dialog
                - Select Google Sheets
                    - Click Cancel/Close
                        - The dialog closes
                        - No “export started” indicator appears
                        - No Google Sheet is created/linked
    * Dashboard: export completion outcomes — network interruption or service error yields visible failure state <P1>
        - Open a dashboard
            - Open the dashboard export dialog
                - Select Google Sheets
                    - Confirm export
                        - Simulate a network interruption / service error during export
                            - A visible failure outcome appears
                            - The error message is user-visible (not only in logs)
                            - The user can dismiss the error and remains in a usable state
    * Dashboard: export completion outcomes — retry after failure succeeds and shows success outcome <P2>
        - Open a dashboard
            - Trigger Google Sheets export
                - Force an export failure
                    - Choose Retry (if available) OR repeat the export action
                        - Export completes successfully
                        - The user sees a visible success completion outcome
    * Dashboard: export completion outcomes — long-running export shows progress and eventually completes <P2>
        - Open a dashboard with enough content to make export take noticeable time
            - Trigger Google Sheets export
                - Observe the UI while export runs
                    - A visible in-progress indicator is shown (spinner/progress/toast)
                    - The UI remains responsive enough to continue working or navigate safely (as designed)
                    - A visible completion outcome appears when finished (success or failure)
    * Dashboard: export completion outcomes — user navigates away while export runs; completion outcome is still discoverable <P2>
        - Open a dashboard
            - Trigger Google Sheets export
                - Navigate away (to another dashboard/page) while export is in progress
                    - The export is not silently lost
                    - The user can still discover the completion outcome (toast/notification center/history area, if present)
                    - On success, the user can still access the created Google Sheet link/location

<!-- Notes
- This Phase 4a draft is intentionally subcategory-first (no top-layer categories).
- Scenario text is drafted from blind pre-defect evidence; option names/entrypoints should be refined once export dialog UI + requirements evidence is indexed in context artifacts.
-->