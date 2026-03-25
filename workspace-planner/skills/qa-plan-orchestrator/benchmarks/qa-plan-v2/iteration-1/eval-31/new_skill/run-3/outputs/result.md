# Phase 4a — Scenario Draft (EXPORT-P4A-SCENARIO-DRAFT-001)

Feature QA Plan (BCVE-6678)

- Dashboard → Export → Google Sheets (GWS)
    * Dashboard-level Google Sheets export entry points are discoverable and consistent
        - Open a dashboard
            - Open the dashboard-level Export entry point (toolbar / overflow menu)
                - Observe Google Sheets appears as an export option for the dashboard
                - Observe the option label/icon matches expected Google Sheets destination
    * Export to Google Sheets starts from dashboard-level Export (not application-level settings)
        - Open a dashboard
            - Open dashboard Export
                - Select Google Sheets
                    - Observe the flow is tied to the current dashboard (dashboard name/context is visible in the dialog or confirmation)
                    - Observe completion outcome is visible after starting export (e.g., toast/progress/completion)

- Dashboard → Export → Google Sheets — Option combinations
    * Default option combination produces a successful completion outcome
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Keep default export options (do not change any toggles/advanced settings)
                        - Start export
                            - Observe an in-product progress indicator or toast appears
                            - Observe a completion outcome is shown (success message and/or link/open action)
    * Changing one export option still results in a visible completion outcome
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Change one available option in the export dialog (any single toggle/dropdown)
                        - Start export
                            - Observe the UI reflects the selected option before submission
                            - Observe a completion outcome is shown (success message and/or link/open action)
    * Multiple non-conflicting options can be combined and produce a visible completion outcome
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Change two or more options that are allowed together (do not select mutually exclusive settings)
                        - Start export
                            - Observe the UI accepts the combination (no inline validation error)
                            - Observe a completion outcome is shown
    * Mutually exclusive/invalid option combinations are blocked with an observable validation outcome
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Select an option combination that the UI disallows (if applicable)
                        - Attempt to start export
                            - Observe the action is blocked OR the invalid option is auto-corrected
                            - Observe an inline validation message or disabled primary action explains the constraint

- Dashboard → Export → Google Sheets — Completion outcomes (visible)
    * Success outcome is visible and actionable
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Start export
                        - Observe a success message is shown
                        - Observe an action is offered (e.g., Open in Google Sheets / Copy link) OR the exported file appears in the expected destination
    * Failure outcome is visible when export cannot complete
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Start export under a condition that prevents completion (e.g., revoke authorization / disconnect workspace / no permission)
                        - Observe a failure message is shown
                        - Observe the message includes a next-step affordance (retry / re-auth / learn more) or a clear reason
    * User cancellation produces a visible end state (no ambiguous “stuck” export)
        - Open a dashboard
            - Open dashboard Export
                - Choose Google Sheets
                    - Initiate export
                        - Cancel/close the export dialog or cancel the in-progress export (if available)
                            - Observe the UI indicates export was canceled OR no success outcome is shown
                            - Observe no lingering progress indicator remains

- Dashboard vs Application-level settings — Path distinction
    * Dashboard-level export does not silently depend on application-level default settings
        - Open a dashboard
            - (Precondition) Ensure application-level report export settings (if accessible) have a known default for Google Sheets export
                - Open dashboard Export → Google Sheets
                    - Do not change options
                        - Start export
                            - Observe the dashboard export flow completes and shows a visible outcome
                            - Observe the applied export behavior matches the dashboard-level choices (or defaults shown in the dashboard dialog), not an unseen application-only configuration
    * Dashboard-level export reflects application defaults only when explicitly surfaced in the dashboard dialog
        - Open a dashboard
            - Open dashboard Export → Google Sheets
                - Observe any defaulted values are visible in the dashboard export dialog before starting export
                - Start export
                    - Observe completion outcome is visible

- Strings / UI text relevant to Google Sheets export (dashboard flow)
    * Export dialog strings render correctly in the dashboard export path
        - Open a dashboard
            - Open dashboard Export → Google Sheets
                - Observe dialog title/headers/labels are present and not truncated
                - Observe critical labels (Google Sheets, primary CTA, option labels) match expected text
    * Export header/scroll behavior does not hide key context during option selection
        - Open a dashboard
            - Open dashboard Export → Google Sheets
                - Scroll within the export dialog (if the dialog is scrollable)
                    - Observe the export header/context remains visible (or remains accessible) while scrolling
                    - Observe the primary action remains discoverable and usable

<!-- Notes:
- Evidence bundle is blind_pre_defect and only includes a feature issue shell + adjacent issue summaries.
- Scenario drafting here focuses on the benchmark focus: dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes.
- This is Phase 4a: subcategory-first only; no canonical top-level categories (Security/E2E/etc.).
-->