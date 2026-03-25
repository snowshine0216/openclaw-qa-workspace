# Phase 4a — Scenario Draft (BCVE-6678)

Feature QA Plan (BCVE-6678)

- Google Sheets export (Dashboard-level)
    * Export to Google Sheets from Dashboard: default path produces visible completion outcome <P1>
        - Open a dashboard
            - Open the dashboard-level export menu
                - Choose **Export → Google Sheets**
                    - Complete any required Google authorization/selection steps
                        - Confirm export
                            - A visible “export started / in progress” indicator appears (toast/banner/dialog)
                            - A visible “export completed / success” outcome appears (toast/banner/dialog)
                            - A Google Sheets destination is created/updated (as indicated by UI link or confirmation details)
    * Export to Google Sheets from Dashboard: verify distinct entry points are available and lead to the same Google Sheets export flow <P1>
        - Open a dashboard
            - Trigger Google Sheets export from dashboard-level export entry point A (e.g., top toolbar menu)
                - Observe the export settings/confirmation UI
                    - Cancel without exporting
                        - No export job is created (no success notification)
            - Trigger Google Sheets export from dashboard-level export entry point B (e.g., overflow/More menu)
                - Observe the export settings/confirmation UI
                    - Proceed to export
                        - A visible success outcome is shown
    * Export to Google Sheets from Dashboard: cancel/close during settings step does not create a completed export <P2>
        - Open a dashboard
            - Open the dashboard-level export menu
                - Choose **Export → Google Sheets**
                    - Close/cancel the export settings dialog
                        - No “export completed” outcome is shown
                        - The UI returns to the dashboard without navigation errors

- Google Sheets export options (Dashboard-level combinations)
    * Export to Google Sheets: option combination A produces success and reflects selections in the output <P1>
        - Open a dashboard
            - Open the dashboard-level export menu
                - Choose **Export → Google Sheets**
                    - In export settings, select option set A (first meaningful combination available)
                        - Confirm export
                            - A visible success outcome is shown
                            - The created/updated Google Sheet reflects option set A (structure/content matches the selected options)
    * Export to Google Sheets: option combination B produces success and reflects selections in the output <P1>
        - Open a dashboard
            - Open the dashboard-level export menu
                - Choose **Export → Google Sheets**
                    - In export settings, select option set B (different from A)
                        - Confirm export
                            - A visible success outcome is shown
                            - The created/updated Google Sheet reflects option set B
    * Export to Google Sheets: changing options updates the enabled/disabled state of the confirmation action appropriately <P2>
        - Open a dashboard
            - Open the dashboard-level export menu
                - Choose **Export → Google Sheets**
                    - Toggle options in the export settings
                        - Observe the primary action button state (enabled/disabled)
                            - The export action is disabled when required selections are missing
                            - The export action becomes enabled when required selections are satisfied

- Google Sheets export completion outcomes (Visible + error handling)
    * Export to Google Sheets: success outcome includes an actionable affordance (open/copy link) <P1>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Confirm export
                    - After completion, interact with the success notification affordance (e.g., “Open in Google Sheets”)
                        - The affordance is present and clickable
                        - The destination opens (or a link is copied) without client-side errors
    * Export to Google Sheets: authorization required path shows a visible prompt and resolves to a success outcome after completion <P1>
        - Open a dashboard in a fresh session (not previously authorized)
            - Start **Export → Google Sheets**
                - When prompted, complete Google authorization
                    - Continue export
                        - A visible “export completed” success outcome is shown
    * Export to Google Sheets: authorization denied/aborted yields a visible error outcome and does not show success <P1>
        - Open a dashboard in a fresh session
            - Start **Export → Google Sheets**
                - When prompted for Google authorization, deny/close/abort
                    - Observe the UI outcome
                        - A visible error message/outcome is shown
                        - No “export completed” success outcome is shown
    * Export to Google Sheets: network/service failure yields a visible failure outcome and allows user to recover <P2>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Induce a failure condition (e.g., disconnect network / block request)
                    - Confirm export
                        - A visible failure outcome is shown (toast/banner/dialog)
                        - The user can dismiss the message
                        - The user can retry export after restoring connectivity

- Google Sheets export paths vs non-dashboard export (Distinguish dashboard-level scope)
    * Google Sheets export is available at dashboard-level (and not only at report/document level) <P1>
        - Open a dashboard
            - Open export menu
                - Verify **Google Sheets** is present as an export target
                    - The option is visible and selectable
    * Dashboard-level Google Sheets export does not require switching to a different editor/context to complete <P2>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Complete export
                    - The export flow completes without forcing navigation to a non-dashboard context
                    - Success/failure outcomes are displayed within the current UX surface

<!-- Notes:
- This Phase 4a draft intentionally avoids canonical top-layer grouping (e.g., Security/E2E/Compatibility).
- “Option set A/B” should be replaced with the concrete settings exposed by the dashboard-level Google Sheets export dialog once captured in evidence.
- “Visible completion outcome” is drafted as toast/banner/dialog + actionable affordance; adjust to the exact UI strings/placement once available.
-->