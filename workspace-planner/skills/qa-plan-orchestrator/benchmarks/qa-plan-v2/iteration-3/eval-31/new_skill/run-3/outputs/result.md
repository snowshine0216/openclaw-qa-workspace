# Phase 4a — Scenario Draft (Subcategory-only)

Feature QA Plan (BCVE-6678)

- Dashboard export to Google Sheets — entry points & path selection <P1>
    * Dashboard-level export: Export menu includes Google Sheets option (feature discoverability)
        - Open a dashboard
            - Open the dashboard Export menu
                - Google Sheets appears as an export destination
                - The option is labeled in a user-understandable way (not blank/missing)
    * Dashboard-level export: “Export to Google Sheets” entry point is not shown where not applicable
        - Open a non-dashboard artifact (e.g., open a report or a document)
            - Open its Export menu
                - Google Sheets export option is not present OR is disabled with an explanatory message
                <!-- exact applicability depends on product requirements; verify per shipped scope -->

- Dashboard export to Google Sheets — export options combinations <P1>
    * Default export options: opening the Google Sheets export flow shows all required option controls
        - Open a dashboard
            - Open Export → Google Sheets
                - Export settings dialog/panel opens
                - All expected option controls are visible and usable (not clipped)
                - Primary action control (e.g., Export/Confirm) is enabled only when required fields are satisfied
    * Toggle combination: changing one option updates the resulting export behavior (basic combinatorial coverage)
        - Open a dashboard
            - Open Export → Google Sheets
                - Change option A
                    - Change option B
                        - Start export
                            - Export result reflects option A+B combination (observable in sheet content/structure)
                <!-- keep option names aligned with UI in build under test -->
    * Option persistence: last-used export options persist per user/session when returning to export flow
        - Open a dashboard
            - Open Export → Google Sheets
                - Set non-default export options
                    - Cancel/close without exporting
                        - Re-open Export → Google Sheets
                            - Previously selected options are preserved OR reset per defined product behavior
                            - Behavior is consistent across repeated opens

- Dashboard export to Google Sheets — completion outcomes & user-visible feedback <P1>
    * Successful export: user sees a clear completion signal and can access the resulting Google Sheet
        - Open a dashboard
            - Open Export → Google Sheets
                - Start export
                    - A progress indicator appears while export is running
                        - Completion message/toast appears when finished
                        - The message includes an actionable way to open the created Google Sheet (or indicates where it is saved)
                        - Opening the sheet shows dashboard data rendered as expected (no empty file)
    * Long-running export: progress feedback remains visible and does not get stuck
        - Open a large/complex dashboard
            - Open Export → Google Sheets
                - Start export
                    - Progress UI updates or remains responsive until completion
                    - Export completes with a success signal OR a clear failure message
    * Export cancellation (if supported): canceling shows a cancellation outcome and does not produce a partial sheet
        - Open a dashboard
            - Open Export → Google Sheets
                - Start export
                    - Cancel export
                        - UI shows export canceled
                        - No new Google Sheet is created OR the created artifact is clearly marked unusable per defined behavior
                <!-- execute only if cancel control exists -->

- Dashboard export to Google Sheets — failure outcomes & recoverability <P2>
    * Permission/auth failure: user sees a clear error and can retry after fixing access
        - Open a dashboard
            - Open Export → Google Sheets
                - Start export while lacking required Google permissions (e.g., not signed in / consent missing)
                    - A clear error message is shown
                    - The message indicates the action needed (sign in / grant access)
                    - After fixing permissions, retrying export can succeed
    * Network failure: transient error message is shown and retry does not duplicate results
        - Open a dashboard
            - Open Export → Google Sheets
                - Start export
                    - Simulate network interruption
                        - Error message is shown with retry guidance
                        - Retrying results in at most one final Google Sheet for a single user-intended export (no duplicates)

- Export strings & UI text (adjacent scope awareness) <P2>
    * Export dialog strings are present and not regressed (labels, header, helper text)
        - Open a dashboard
            - Open Export → Google Sheets
                - Verify dialog header text is present and correct
                - Verify option labels and helper text are present (no placeholder keys)
                - Scroll the dialog if content overflows
                    - Header remains visible OR behavior matches spec
                <!-- adjacent issues mention strings + header-on-scroll; validate visible UX outcomes without defect analysis -->