# Feature QA Plan (BCVE-6678) — Phase 4a Subcategory Draft

- Feature QA Plan (BCVE-6678)
    * Dashboard → Export → Google Sheets (GWS)
        - Dashboard-level export entry points are discoverable
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Google Sheets option is visible (when available)
                    - Google Sheets option is not shown/disabled when unavailable
        - Export to Google Sheets from dashboard-level menu with defaults
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets export
                        - Confirm the default export settings (do not change any options)
                            - Start export
                                - A visible “export started / processing” indicator appears
                                - A visible completion outcome appears (success)
                                - The exported result is a Google Sheets file/link consistent with the dashboard export request
        - Export to Google Sheets from dashboard-level menu after changing export options
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets export
                        - Change one export setting option
                            - Start export
                                - A visible “export started / processing” indicator appears
                                - A visible completion outcome appears (success)
                                - The exported result reflects the changed option
        - Export to Google Sheets from dashboard-level menu with multiple option changes
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets export
                        - Change multiple export setting options
                            - Start export
                                - A visible “export started / processing” indicator appears
                                - A visible completion outcome appears (success)
                                - The exported result reflects the combined option selections
        - Dashboard-level Google Sheets export cancel/close behavior does not create a misleading completion
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets export
                        - Close/cancel the dialog before starting export
                            - No “export completed” success indication is shown
                            - The user remains able to retry export
        - Dashboard-level Google Sheets export failure shows a visible completion outcome (error)
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets export
                        - Start export under a forced failure condition (e.g., revoke connection / network disruption)
                            - A visible “export started / processing” indicator appears
                            - A visible completion outcome appears (error)
                            - The error message is user-readable and indicates next action (retry / reconnect)
        - Dashboard-level Google Sheets export completion outcomes are distinguishable
            - Open a dashboard
                - Run a successful dashboard-level Google Sheets export
                    - Observe the success completion UI
                        - Success completion is clearly distinguishable from in-progress state
            - Open a dashboard
                - Run a failing dashboard-level Google Sheets export
                    - Observe the failure completion UI
                        - Failure completion is clearly distinguishable from in-progress state
        - Dashboard-level export path is distinct from other export contexts
            - Open a dashboard
                - Open the dashboard-level Export menu
                    - Select Google Sheets export
                        - Verify the UI indicates dashboard-level context (not report/library context)
                            - The settings dialog/title/context cues match “dashboard export”
                            - Completion outcome messaging refers to the dashboard export action


## Execution summary (benchmark)

This Phase 4a subcategory draft focuses on **dashboard-level Google Sheets export** and explicitly distinguishes: (1) the dashboard export entry path, (2) option combinations (defaults, single-option change, multiple-option changes), and (3) visible completion outcomes (success vs error vs canceled). It avoids Phase 4b canonical top-layer categories and uses atomic nested steps with observable verification leaves.