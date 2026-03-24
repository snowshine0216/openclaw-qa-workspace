# Phase 4a — Scenario Draft (BCVE-6678)

Feature QA Plan (BCVE-6678)

- Dashboard export — Google Sheets
    * Dashboard: export to Google Sheets from dashboard-level export entry <P1>
        - Open a dashboard (with at least one grid/visual)
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - A Google Sheets export flow/dialog opens (dashboard context)
                    - The export options shown are for dashboard-level export (not Application/Report settings)
    * Dashboard: export options combinations are selectable (dashboard-level Google Sheets) <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Toggle each available option one-by-one
                        - Each option can be enabled/disabled as allowed
                        - Disabled/unsupported options show a visible disabled state
                    - Select a representative combination of multiple options
                        - The selected combination remains reflected in the UI before starting export
    * Dashboard: successful Google Sheets export shows visible completion outcome <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Start export
                        - A visible in-progress indicator is shown (spinner/progress/toast/dialog)
                        - Export completes with a visible success outcome (toast/dialog state)
                        - A resulting Google Sheets file (or link/open action) is presented or downloadable
    * Dashboard: cancel/close export flow shows visible outcome and no file produced <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Close/cancel the export flow before starting export
                        - The export flow closes
                        - No success completion message is shown
                    - Re-open the dashboard-level Export menu
                        - The export flow can be opened again without error
    * Dashboard: export blocked by invalid option state shows visible error outcome <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Configure an invalid/unsupported option combination (if allowed by UI)
                        - Start export
                            - A visible error message is shown
                            - The user remains able to adjust options and retry
    * Dashboard: export with minimal options (defaults) completes successfully with visible outcome <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Leave options at default values
                        - Start export
                            - Export completes with a visible success outcome
    * Dashboard: export with maximal options (all enabled where possible) completes successfully with visible outcome <P2>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Enable all options that are enabled-capable
                        - Start export
                            - Export completes with a visible success outcome
    * Dashboard vs Application/Report settings: dashboard-level Google Sheets export path remains distinct <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Choose Google Sheets export
                    - Observe the flow entry point and header/context
                        - It indicates dashboard export context
        - Open the application-level Report Export Settings (if accessible from the product)
            - Navigate to Google Sheets export defaults/settings
                - Observe the settings page/dialog
                    - It indicates application/report export settings context
                    - It is not the same UI path as dashboard export
    * Dashboard: exported content matches dashboard context selection (where applicable) <P2>
        - Open a dashboard with multiple content blocks
            - Apply a filter or selection that changes visible data
                - Open the dashboard-level Export menu
                    - Choose Google Sheets export
                        - Start export
                            - The resulting sheet content corresponds to the current dashboard state (filtered/selected)

- Application editor / settings — Report Export Settings (strings + sticky header)
    * Report Export Settings: UI strings render correctly for Google Sheets export settings <P2>
        - Open the application editor
            - Navigate to Report Export Settings
                - Open the Google Sheets export settings section/dialog
                    - Labels and helper text are present
                    - No missing keys/placeholder strings are shown
    * Report Export Settings: header remains visible when scrolling (sticky header behavior) <P2>
        - Open the application editor
            - Navigate to Report Export Settings
                - Scroll within the settings dialog/page
                    - The "REPORT EXPORT SETTINGS" header remains visible
                    - The scrollable content moves while the header stays fixed
    * Report Export Settings: default value for Google Sheets export can be set and persists <P1>
        - Open the application editor
            - Navigate to Report Export Settings
                - Open the Google Sheets export settings
                    - Change the default value (as provided by UI)
                        - Save/apply changes
                            - A visible success confirmation is shown (toast/banner/state)
                    - Refresh or re-open the settings
                        - The updated default value is still selected

<!-- Notes (evidence-limited / blind pre-defect):
- Evidence bundle lists adjacent work items: BCIN-7636 (strings), BCIN-7595 (sticky header), BCIN-7106 (default value).
- Jira feature payload in fixture is truncated; specific option names and exact completion UI (download vs open link vs background job) are not available in provided evidence.
- Scenarios intentionally focus on: (1) dashboard-level Google Sheets export paths, (2) option combinations, (3) visible completion outcomes, per benchmark focus.
-->