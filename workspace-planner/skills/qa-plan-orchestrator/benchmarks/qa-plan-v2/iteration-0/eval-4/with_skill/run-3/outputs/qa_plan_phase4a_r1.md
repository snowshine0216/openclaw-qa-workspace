Feature QA Plan (BCIN-7289)

<!-- Benchmark replay evidence:
- phase4a-contract.md requires SDK/API visible outcomes to remain testable in scenario leaves.
- report-editor knowledge pack requires window title correctness and lists setWindowTitle as an SDK visible contract.
- BCIN-7289_SELF_TEST_GAP_ANALYSIS.md identifies BCIN-7674, BCIN-7719, and BCIN-7733 as missed because window-title outcomes were not translated into explicit scenarios.
-->

- Report Creation
    * Blank report title is explicit in the Workstation editor window <P1>
        - Sign in to Workstation with the new report editor enabled
            - Create a blank report from the Workstation new report entry point
                - Observe the Workstation window title bar after the editor opens
                    - The title bar does not show `newReportWithApplication`
                    - The title bar shows blank-report wording intended for the embedded editor
    * Intelligent Cube report title is explicit before and after save <P1>
        - Open the dataset blade in Workstation
            - Start a New Intelligent Cube Report from an Intelligent Cube entry
                - Observe the Workstation window title bar before saving
                    - The title bar shows `New Intelligent Cube Report`
                - Save the report with a new report name
                    - Observe the Workstation window title bar after saving
                        - The title bar updates to the saved report name

- Report Editing
    * Double-click edit shows the selected report name in the window title <P1>
        - Locate an existing report in Workstation
            - Double-click the report to open edit mode in the embedded editor
                - Observe the Workstation window title bar after the editor loads
                    - The title bar shows the selected report name
                    - The title bar does not keep a stale title from a previous editor session

- Localization
    * Chinese locale translates the Intelligent Cube report title <P1>
        - Switch Workstation to Chinese locale
            - Start a New Intelligent Cube Report
                - Observe the Workstation window title bar after the editor opens
                    - The title bar uses the Chinese translation for the Intelligent Cube report title
