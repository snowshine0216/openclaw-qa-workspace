# Phase 4a — Scenario Draft (BCVE-6678)

Feature QA Plan (BCVE-6678)

- Google Sheets export (Dashboard-level)
    * Export from dashboard: Google Sheets path is available when GWS integration is enabled <P1>
        - Open a dashboard
            - Open the dashboard **Export** menu
                - Observe the export destinations/options list
                    - **Google Sheets** export destination is present and selectable
    * Export from dashboard: Google Sheets path is not shown when GWS integration is not configured <P1>
        - Open a dashboard
            - Open the dashboard **Export** menu
                - Observe the export destinations/options list
                    - **Google Sheets** export destination is not present (or is disabled with an explanatory message)
    * Export from dashboard: choose Google Sheets and complete export with default option combination <P1>
        - Open a dashboard
            - Open the dashboard **Export** menu
                - Select **Google Sheets**
                    - Keep default export options
                        - Start export
                            - A visible “export started / in progress” indicator appears
                            - Export completes successfully
                            - A visible completion outcome is shown (e.g., success toast/dialog)
                            - A Google Sheet is created/updated as the export target
    * Export from dashboard: option combinations are selectable and reflected in the Google Sheets result <P1>
        - Open a dashboard
            - Open the dashboard **Export** menu
                - Select **Google Sheets**
                    - Change export option A (first non-default toggle/dropdown)
                        - Change export option B (a second independent toggle/dropdown)
                            - Start export
                                - Export completes successfully
                                - The created Google Sheet reflects option A setting
                                - The created Google Sheet reflects option B setting
    * Export from dashboard: starting export then canceling shows a visible canceled outcome <P2>
        - Open a dashboard
            - Open the dashboard **Export** menu
                - Select **Google Sheets**
                    - Start export
                        - While export is in progress, cancel/close the export flow
                            - A visible cancellation outcome is shown (e.g., canceled toast/state)
                            - No new Google Sheet is created (or the target is not updated)
    * Export from dashboard: export failure shows a visible failure outcome and does not claim success <P1>
        - Open a dashboard
            - Open the dashboard **Export** menu
                - Select **Google Sheets**
                    - Force an export failure condition (e.g., revoke Sheets permissions / lose connectivity)
                        - Start export
                            - A visible failure outcome is shown (toast/dialog/error state)
                            - The UI does not show a success completion message
                            - The export can be retried after restoring the failure condition

- Google Sheets export (Dashboard-level) — Entry point distinctions
    * Export menu entry points (toolbar vs overflow) both lead to the same Google Sheets export flow <P2>
        - Open a dashboard
            - Open export via entry point 1 (e.g., toolbar Export)
                - Select **Google Sheets**
                    - Observe the export options presented
            - Open export via entry point 2 (e.g., overflow/More actions → Export)
                - Select **Google Sheets**
                    - The same export options are available
                    - Completion outcomes are shown in the same way

- Google Sheets export (Dashboard-level) — Completion visibility
    * Completion outcome is visible even when navigating away and returning after export finishes <P2>
        - Open a dashboard
            - Start a Google Sheets export
                - Navigate away (to another page/tab within the app) while export runs
                    - Return to the dashboard
                        - A visible completion outcome is shown (or export status is discoverable from notifications/history)


## Short execution summary

Produced a Phase 4a subcategory-only scenario draft focused on dashboard-level Google Sheets export, explicitly distinguishing export paths/entry points, option combinations, and visible completion outcomes (success/cancel/failure), without introducing top-layer canonical categories.