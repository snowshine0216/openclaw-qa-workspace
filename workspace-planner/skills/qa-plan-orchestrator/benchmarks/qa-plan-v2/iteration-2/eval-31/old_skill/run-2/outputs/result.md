# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Dashboard — Google Sheets export paths
    * Export to Google Sheets from a dashboard (happy path) <P1>
        - Open a dashboard
            - Open the dashboard-level export entry point
                - Choose Google Sheets as the export format
                    - Confirm export
                        - Export job starts (progress / in-app status becomes visible)
                        - A completion outcome is visible to the user (success state)
    * Distinguish dashboard-level Google Sheets export from report-level export entry points <P1>
        - Open a dashboard
            - Open dashboard-level export entry point
                - Observe the available export formats and options
                    - Navigate to a report’s export entry point (if available in the product)
                        - Observe the available export formats and options
                            - Dashboard-level and report-level export paths are distinguishable by UI location/labeling
                            - The option set for dashboard-level export is not misleadingly presented as report-level export (and vice versa)
    * Export option combinations — baseline set applied consistently <P1>
        - Open a dashboard
            - Start Google Sheets export from the dashboard-level export entry point
                - Toggle each available export option one at a time (record the option list)
                    - Run export for a representative set of option combinations (pairwise)
                        - For each run, observe the visible completion outcome
                            - Each option combination produces a clear success/failure completion state
                            - The selected options shown in the dialog are the options applied for that run (no silent reset)
    * Export option combinations — invalid/unsupported combinations are blocked clearly <P2>
        - Open a dashboard
            - Start Google Sheets export
                - Select an option combination that the UI indicates is unsupported (if any)
                    - Attempt to confirm export
                        - Confirm action is disabled or a clear inline validation message is shown
                        - No export job is started when validation fails
    * Cancel/close during export — user can still understand outcome <P2>
        - Open a dashboard
            - Start Google Sheets export
                - Confirm export
                    - While progress is visible, close the dialog / navigate away (as allowed)
                        - Return to the dashboard
                            - The final completion outcome remains discoverable (success/failure), not permanently lost
    * Failure outcome is visible and actionable (credential/permission/network) <P1>
        - Open a dashboard
            - Start Google Sheets export
                - Induce a failure condition (e.g., disconnect network / revoke permission / use an account without access)
                    - Confirm export
                        - A visible failure completion outcome is shown
                        - The failure message is understandable (user-facing, not raw error)
                        - The user is given an actionable next step (retry / re-auth / learn more), if the UI provides actions

- Dashboard — Export dialog UX and strings
    * Export dialog labels are correct for Google Sheets export settings <P2>
        - Open a dashboard
            - Open dashboard export settings / export dialog (where applicable)
                - Choose Google Sheets export
                    - Review visible headers, labels, helper text
                        - Strings match the intended feature naming (Google Sheets) and dashboard context
                        - No obviously stale or mismatched strings are present in the dialog
    * Export dialog header remains understandable while interacting/scrolling <P3>
        - Open a dashboard
            - Open the export settings dialog
                - Scroll within the dialog (if content is scrollable)
                    - Continue changing options
                        - The dialog context/header remains clear enough for the user to understand what settings they are changing

- Dashboard — Completion outcomes and post-export visibility
    * Success completion outcome includes a clear indicator of where the Sheets output is (link or destination hint) <P1>
        - Open a dashboard
            - Start Google Sheets export
                - Complete export successfully
                    - Observe completion state
                        - User sees a clear success message
                        - If a link is shown, it is visible and can be opened
                        - If no link is shown, the destination (Google Drive/Sheets) is described clearly enough to locate the output
    * Re-run export after success — completion outcome remains correct <P2>
        - Open a dashboard
            - Run Google Sheets export successfully
                - Immediately run the same export again
                    - Observe the second completion state
                        - The second run’s completion outcome reflects the second run (no stale “already exported” ambiguity)
    * Multiple exports in sequence — outcomes are not conflated <P2>
        - Open a dashboard
            - Start Google Sheets export with option set A
                - Complete export
                    - Start Google Sheets export with option set B
                        - Complete export
                            - Each run shows its own completion outcome (no mixing of messages/status)

<!-- Notes:
- Evidence in this benchmark bundle is limited to the feature issue metadata and adjacent issue summaries; scenario drafting here focuses on the benchmark’s required distinctions: dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes.
- Phase 4a intentionally avoids canonical top-layer categories (e.g., E2E/Compatibility/Security) per contract.
-->