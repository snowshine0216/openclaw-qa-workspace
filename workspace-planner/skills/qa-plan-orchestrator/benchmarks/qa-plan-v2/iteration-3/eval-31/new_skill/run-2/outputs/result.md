# Phase 4a — Scenario Draft (BCVE-6678) — Export

Feature QA Plan (BCVE-6678)

- Google Sheets export (Dashboards)
    * Dashboard-level Google Sheets export entrypoints are discoverable from dashboard UI <P1>
        - Sign in to the product
            - Navigate to a project
                - Open a dashboard
                    - Open the dashboard More/overflow menu (or equivalent export entry)
                        - An Export option is present for the dashboard
                        - A Google Sheets option is available from the dashboard export flow
    * Dashboard-level Google Sheets export uses the dashboard path (not the library/document export path) <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Observe the export dialog/screen context
                        - The dialog/screen indicates dashboard-level export (dashboard context is visible)
                        - Options presented are consistent with dashboard export (not report/document-only options)
    * Starting dashboard-level Google Sheets export shows an in-progress/export-started state <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Confirm export (e.g., Export / Create / Continue)
                        - A visible “export started / in progress” indication is shown
                        - UI remains responsive (no frozen state)
    * Successful dashboard-level Google Sheets export shows a visible completion outcome <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Confirm export
                        - Wait for completion
                            - A visible completion outcome appears (e.g., success toast/banner)
                            - The completion outcome clearly references Google Sheets export
    * Canceling dashboard-level Google Sheets export closes the flow and does not show success <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Cancel/Close the export dialog
                        - The export dialog closes
                        - No success/completion indicator is shown

- Google Sheets export (Dashboards) — Option combinations
    * Changing export options changes the export request summary/preview (if present) <P2>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Modify one export option
                        - Any on-screen summary/preview reflects the option change
                        - The option state is retained until export is started
    * Option combination: default options export completes successfully <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Leave options at default values
                        - Confirm export
                            - Export completes with a visible success outcome
    * Option combination: non-default options export completes successfully <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Change multiple options (as available)
                        - Confirm export
                            - Export completes with a visible success outcome
                            - The success outcome corresponds to the initiated option set (no mismatch indicated)
    * Option validation: invalid/unsupported option state is blocked with visible feedback <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Select an option combination that is invalid/unsupported (if possible)
                        - Attempt to confirm export
                            - The export action is blocked/disabled
                            - A visible validation message explains what must be corrected

- Google Sheets export (Dashboards) — Completion outcomes & error handling
    * Export failure shows a visible failure outcome and does not show success <P1>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Confirm export
                        - Force/trigger a failure condition (e.g., network offline)
                            - A visible failure message/toast appears
                            - No success/completion indicator is shown
    * Retrying after failure can succeed and shows the correct completion outcome <P2>
        - Trigger a Google Sheets export failure
            - Return to the dashboard export flow
                - Start Google Sheets export again
                    - Confirm export
                        - A visible success completion outcome appears
    * Navigating away during in-progress export yields a coherent user-visible outcome <P2>
        - Start dashboard-level Google Sheets export
            - While export is in progress, navigate away from the dashboard (e.g., switch page)
                - Return to the dashboard
                    - The user can still observe a coherent end state
                        - Either a visible completion indicator is shown when finished, or a visible “export not completed” state is shown

- Google Sheets export (Dashboards) — State, persistence, and UX consistency
    * Reopening the export dialog resets/retains option state as designed (verify behavior) <P2>
        - Open a dashboard
            - Start Export
                - Choose Google Sheets
                    - Change one or more options
                        - Close the dialog
                            - Reopen the Google Sheets export dialog
                                - Option values match the expected persistence behavior (retained or reset)
    * Export UI strings are correct and consistent throughout the dashboard Google Sheets export flow <P2>
        - Open a dashboard
            - Start Google Sheets export
                - Review key labels (dialog title, primary CTA, success/failure text)
                    - Labels are present and readable
                    - No truncated/overlapping text is observed


---

## Execution summary (phase4a contract focus)

This Phase 4a artifact drafts subcategory-first scenarios that explicitly distinguish **dashboard-level** Google Sheets export entry paths, cover **option combinations**, and verify **visible completion outcomes** (success, cancel, failure). It avoids canonical top-layer categories (per phase4a contract) and uses atomic nested steps with observable verification leaves.