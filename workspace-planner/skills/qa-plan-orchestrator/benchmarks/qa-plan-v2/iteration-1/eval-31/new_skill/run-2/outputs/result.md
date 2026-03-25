# Phase 4a — Scenario Draft (EXPORT-P4A-SCENARIO-DRAFT-001)

Feature QA Plan (BCVE-6678)

- Dashboard — Google Sheets export entry paths
    * Export from a dashboard-level Export menu to Google Sheets (baseline path) <P1>
        - Open a dashboard
            - Open the dashboard-level **Export** entry (the dashboard’s export menu)
                - Choose **Google Sheets** as the export target
                    - Confirm / start export
                        - A visible “export started / in progress” indicator is shown
                        - A visible completion outcome is shown when export finishes (e.g., success toast, dialog, or link)
    * Export from a dashboard-level toolbar / overflow entry to Google Sheets (alternate UI entry) <P1>
        - Open a dashboard
            - Open the dashboard-level toolbar or overflow (⋯) menu
                - Select **Export**
                    - Choose **Google Sheets**
                        - Start export
                            - The UI indicates export has started
                            - The UI indicates export completed (success state is visible)

- Dashboard — Google Sheets export option combinations
    * Export with default options to Google Sheets (no option changes) <P1>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Leave all options at their defaults
                    - Confirm export
                        - Export completes successfully
                        - The completion outcome is visible to the user (not silent)
    * Export with a single option toggled to a non-default value (option combination coverage) <P1>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Change exactly one available export option from its default (e.g., a checkbox / radio / dropdown choice)
                    - Confirm export
                        - Export completes successfully
                        - The visible completion outcome reflects success
    * Export with multiple options changed (multi-option combination coverage) <P2>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Change two or more available export options from their defaults
                    - Confirm export
                        - Export completes successfully
                        - The visible completion outcome reflects success

- Dashboard — Visible completion outcomes (success / failure / cancellation)
    * Successful export shows a clear completion state and access path to the produced Google Sheet <P1>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Confirm export
                    - Wait for completion
                        - A success completion message is displayed
                        - The UI provides an obvious next step (e.g., open sheet link, copy link, or “View in Google Sheets” action)
    * Cancel export before completion yields a visible cancellation outcome <P2>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - While export is in progress, trigger cancel (if UI supports it)
                    - Confirm cancellation
                        - Export stops (no continued progress)
                        - A visible cancellation outcome is shown
    * Export failure shows a visible error outcome (and does not present a success completion) <P1>
        - Open a dashboard
            - Start **Export → Google Sheets**
                - Trigger a failure condition using available controls (e.g., revoke auth / network disconnect) when feasible
                    - Confirm export / allow it to proceed
                        - A visible error state is shown (toast/dialog/banner)
                        - No success completion outcome is shown

- Dashboard — Option persistence and correctness across entry paths
    * Options set in one dashboard export path are reflected when launching export from another dashboard export path (if shared settings) <P2>
        - Open a dashboard
            - Start **Export → Google Sheets** from entry path A
                - Change one export option
                    - Close the export UI without exporting (or cancel)
                        - Start **Export → Google Sheets** from entry path B
                            - The previously changed option state is preserved (if settings are intended to be shared)
                            - If not intended to be shared, the UI clearly resets to defaults and indicates that behavior consistently

---

## Short execution summary

This Phase 4a scenario draft focuses on dashboard-level **Google Sheets export** and explicitly distinguishes: (1) multiple dashboard entry paths, (2) option combinations (default / single-change / multi-change), and (3) user-visible completion outcomes (success / cancel / failure). It stays subcategory-first (no canonical top-layer grouping) and uses atomic nested steps with observable verification leaves, aligning to the Phase 4a contract.