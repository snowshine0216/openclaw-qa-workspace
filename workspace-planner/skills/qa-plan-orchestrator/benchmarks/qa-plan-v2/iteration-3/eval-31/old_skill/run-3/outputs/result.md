# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Dashboard export → Google Sheets
    * Export path is available from a dashboard context
        - Open a dashboard
            - Open the dashboard-level export menu
                - Verify a Google Sheets export entry is visible/selectable
    * Export initiated from dashboard creates a Google Sheets export job
        - Open a dashboard
            - Open the dashboard-level export menu
                - Choose Google Sheets as the export target
                    - Confirm/submit the export action
                        - A visible “in progress/started” export indication appears (toast/banner/dialog)
                        - The user remains on the dashboard (no unexpected navigation)
    * Export completion produces a visible success outcome
        - Open a dashboard
            - Initiate export to Google Sheets
                - Wait for export completion
                    - A visible success indication appears
                    - A visible “Open in Google Sheets” and/or link to the created file is present (if the product provides it)
    * Export failure produces a visible failure outcome
        - Open a dashboard
            - Initiate export to Google Sheets
                - Force a failure condition (e.g., disconnect network mid-export)
                    - Wait for the export to resolve
                        - A visible failure indication appears
                        - Retry action is available OR the user can re-initiate export from the menu

- Dashboard export → Google Sheets — Options & combinations
    * Default options are pre-populated when opening export settings
        - Open a dashboard
            - Open the dashboard-level export menu
                - Select Google Sheets export
                    - Verify export settings UI opens
                        - Default option values are shown (not blank/undefined)
    * Option toggles can be changed and persist within the export flow
        - Open a dashboard
            - Open Google Sheets export settings
                - Change option A (first visible configurable option)
                    - Change option B (second visible configurable option)
                        - Confirm/submit export
                            - Export starts successfully with the chosen options
    * Valid option combinations succeed
        - Open a dashboard
            - Open Google Sheets export settings
                - Select a “minimal” combination (all optional toggles off, if allowed)
                    - Confirm/submit export
                        - Export completes with visible success
        - Open a dashboard
            - Open Google Sheets export settings
                - Select a “maximal” combination (all optional toggles on, if allowed)
                    - Confirm/submit export
                        - Export completes with visible success
    * Invalid or conflicting option combinations are blocked with clear validation
        - Open a dashboard
            - Open Google Sheets export settings
                - Select an invalid combination (if the UI allows selecting it)
                    - Attempt to confirm/submit export
                        - Confirm action is disabled OR an inline validation message is shown
                        - The export does not start

- Dashboard export → Google Sheets — Permissions & account state
    * User not signed into Google workspace prompts for connection/sign-in
        - Ensure the user is not connected/signed-in for Google integration
            - Open a dashboard
                - Initiate export to Google Sheets
                    - Verify a sign-in/connect prompt appears
                        - Export does not complete successfully without completing auth
    * User without permission to export sees a clear blocked outcome
        - Sign in as a user lacking export permission (or remove export entitlement)
            - Open a dashboard
                - Open export menu
                    - Attempt Google Sheets export
                        - Export action is disabled OR blocked with a visible permission message

- Dashboard export → Google Sheets — Repeatability & concurrency
    * Re-running the same export is allowed and produces a new completion outcome
        - Open a dashboard
            - Export to Google Sheets and wait for success
                - Export to Google Sheets again
                    - A new “started” indication appears
                    - A new “completed” indication appears
    * Multiple exports started back-to-back show sensible progress and completion for each
        - Open a dashboard
            - Start export to Google Sheets
                - Immediately start a second export to Google Sheets
                    - Progress indications are shown without UI breaking
                    - Each export resolves to a visible success or failure outcome

<!-- Notes (contract alignment):
- Subcategory-only structure preserved (no canonical top-layer categories like Security/E2E).
- Focused on: dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes.
- Option names are intentionally generic because the provided evidence bundle does not include UI/field-level option details.
-->