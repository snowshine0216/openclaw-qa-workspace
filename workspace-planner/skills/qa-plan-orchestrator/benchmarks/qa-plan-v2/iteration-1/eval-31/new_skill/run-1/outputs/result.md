# Phase 4a — Scenario Draft (BCVE-6678)

Feature QA Plan (BCVE-6678)

- Dashboard export — Google Sheets (path/choices/outcomes)
    * Dashboard-level export entrypoints are discoverable and distinct <P1>
        - Open a dashboard in Workstation
            - Open the dashboard-level Export menu (top-level dashboard export, not a visualization-specific export)
                - Verify a Google Sheets option is present in the dashboard export destination list
                - Verify this entrypoint is not labeled/placed as “Report export settings” (application-level) and is clearly a dashboard export action
    * Dashboard-level export to Google Sheets completes successfully with default options <P1>
        - Open a dashboard with data
            - Open the dashboard-level Export menu
                - Select Google Sheets as the export destination
                    - Keep default export options (do not change any toggles/options)
                        - Start the export
                            - A visible “export started / in progress” indicator appears (e.g., toast, modal, progress line)
                            - A visible completion outcome appears (e.g., success toast + link/open action, or Google Sheets file created confirmation)
    * Dashboard-level Google Sheets export: cancel/close behavior yields a clear outcome <P2>
        - Open a dashboard with data
            - Open the dashboard-level Export menu
                - Select Google Sheets
                    - Initiate export
                        - Dismiss/close the export dialog (or click Cancel if available)
                            - The UI shows a visible final state (export canceled or export continues in background)
                            - If export continues, a completion notification appears when finished
    * Dashboard-level export to Google Sheets requires Google authorization when not connected <P1>
        - Use a user account that has not authorized Google Sheets access
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets
                        - Start export
                            - An authorization/login prompt appears
                            - After completing authorization, the export proceeds or requires an explicit “Export” confirmation
                            - A visible completion outcome appears
    * Dashboard-level export to Google Sheets reuses existing authorization without re-prompt <P2>
        - Use a user account that has already authorized Google Sheets access
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets
                        - Start export
                            - No authorization prompt appears
                            - A visible completion outcome appears

- Dashboard export — Google Sheets (option combinations)
    * Option combination: include/exclude filters affects exported content (observable) <P1>
        - Open a dashboard with at least one interactive filter (selector)
            - Set the filter to a non-default value
                - Open the dashboard-level Export menu
                    - Select Google Sheets
                        - Toggle the option that controls whether current dashboard filters/selections are applied (if present)
                            - Start export
                                - On completion, open the created Google Sheet
                                    - Exported data reflects the selected filter value when “apply current selections/filters” is enabled
                                    - Exported data reflects the default/unfiltered state when the option is disabled
    * Option combination: include/exclude hidden objects impacts output (observable) <P2>
        - Open a dashboard with at least one hidden object/state (e.g., hidden panel, hidden visualization)
            - Open the dashboard-level Export menu
                - Select Google Sheets
                    - Toggle the option controlling inclusion of hidden objects (if present)
                        - Start export
                            - On completion, open the created Google Sheet
                                - When inclusion is enabled, exported content includes the hidden object’s data (if designed to)
                                - When inclusion is disabled, hidden object’s data is not present
    * Option combination: export scope “current page” vs “all pages” (if available) produces distinct outputs <P1>
        - Open a multi-page dashboard
            - Navigate to a non-first page
                - Open the dashboard-level Export menu
                    - Select Google Sheets
                        - Choose “current page only” (or equivalent)
                            - Start export
                                - On completion, the Google Sheet contains only the current page’s exported data
                        - Repeat export choosing “all pages” (or equivalent)
                            - Start export
                                - On completion, the Google Sheet contains exports for all pages (e.g., multiple tabs/sheets or aggregated sections)

- Dashboard export — Google Sheets (failure and messaging)
    * Network interruption during export shows an actionable failure outcome <P1>
        - Open a dashboard
            - Open the dashboard-level Export menu
                - Select Google Sheets
                    - Start export
                        - Simulate a network loss during the export
                            - A visible failure outcome appears (error toast/dialog)
                            - The message includes a retry or clear next step (retry/export again)
                            - No “success” completion message is shown
    * Permission/Google Drive restrictions produce a clear failure outcome <P2>
        - Use a Google account with restricted Drive/Sheets creation permissions (or simulate policy restriction)
            - Open a dashboard
                - Export to Google Sheets
                    - Start export
                        - A visible failure outcome appears
                        - The failure indicates permission/policy restriction rather than a generic error

- Dashboard export — Distinguish dashboard export vs application/report export settings (adjacent scope guard) <P1>
    * Dashboard Google Sheets export does not require changing application-level “Report export settings” <P1>
        - Open a dashboard
            - Perform dashboard-level export to Google Sheets
                - Complete export
                    - Verify export succeeds without navigating to application-level report export settings
                    - Verify no unexpected prompts to adjust “Report export settings” appear

<!-- Advisory note (phase4a): Evidence bundle lists adjacent items mentioning “Application editor” and “Application Level Default value for Google Sheets Export” (BCIN-7595, BCIN-7106) and export-strings dialog updates (BCIN-7636). Scenarios above keep focus on dashboard-level Google Sheets export paths, option combinations, and visible completion outcomes, and include a scope-guard scenario to distinguish from application-level settings. -->