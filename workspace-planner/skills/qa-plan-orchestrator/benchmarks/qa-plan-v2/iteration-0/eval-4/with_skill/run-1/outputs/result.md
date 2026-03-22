<!-- Benchmark case: P4A-SDK-CONTRACT-001 -->
<!-- Primary phase: phase4a -->
<!-- Verdict: pass -->
<!-- Retrospective replay evidence: BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md Gap 5 and Gap 10 require explicit window-title scenarios; BCIN-7289_SELF_TEST_GAP_ANALYSIS.md Root Cause D says the setWindowTitle SDK-visible contract was silently dropped; supporting defects: BCIN-7674, BCIN-7719, BCIN-7721, BCIN-7722, BCIN-7733. -->
<!-- Knowledge-pack alignment: report-editor requires window title correctness and lists setWindowTitle as an SDK visible contract. -->

Feature QA Plan (BCIN-7289)

- Workstation Window Title Contracts
    <!-- Evidence: BCIN-7674, BCIN-7719; retrospective replay from BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md; Workstation shell title remains an explicit Library-vs-Workstation integration outcome. -->
    * Blank report creation shows a user-facing title instead of an internal key <P2>
        - Sign in to Workstation with the new report editor enabled
            - Create a blank report
                - A new editor window opens
                    - The window title shows the localized New Report label
                    - The window title does not show the internal key `newReportWithApplication`
    * Intelligent Cube report creation shows the report-type title and updates after save <P1>
        - Open the dataset blade in Workstation
            - Start a new Intelligent Cube report
                - A new editor window opens
                    - The window title shows the localized New Intelligent Cube Report label
                - Save the report with a new name
                    - The window title updates to the saved report name

- Workstation Edit Entry Titles
    <!-- Evidence: BCIN-7733; retrospective replay from BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md Gap 10 and BCIN-7289_SELF_TEST_GAP_ANALYSIS.md Root Cause D. -->
    * Double-click edit opens with the actual report name in the title bar <P1>
        - Locate an existing report in Workstation
            - Double-click the report to edit it in the embedded editor
                - The editor opens in edit mode
                    - The window title shows the selected report name
                    - The window title does not stay blank, stale, or show an unrelated title

- Localized Title Rendering
    <!-- Evidence: BCIN-7721, BCIN-7722; retrospective replay from BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md Gap 7. -->
    * Simplified Chinese locale shows translated titles for blank and Intelligent Cube entry points <P2>
        - Switch the user language to Simplified Chinese
            - Create a blank report
                - The blank-report editor window opens
                    - The window title is shown in Simplified Chinese
                    - The window title does not fall back to English
            - Start a new Intelligent Cube report
                - The Intelligent Cube editor window opens
                    - The window title is shown in Simplified Chinese
                    - The window title does not fall back to English
