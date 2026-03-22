Feature QA Plan (BCIN-7289)

- Template-based creation
    * Template-sourced save creates a new report and preserves the source template <P1>
        - Sign in to Workstation with the new report editor enabled
            - Create a new report from a saved template such as Product Sales
                - Click Save for the new report
                    - A new report is created for the current workflow
                    - The source template remains unchanged and available for reuse
                    - The saved report stays associated with the new report instead of overwriting the template
    * Template-sourced report with a pause-mode prompt requests input before execution <P2>
        - Sign in to Workstation with the new report editor enabled
            - Create a new report from a template that contains a pause-mode prompt
                - Run the new report immediately after creation
                    - A prompt asks for input before the report runs
                    - The report does not skip the prompt or hang
                    - The report completes after the prompt answer is provided
    <!-- Trace: BCIN-7667, BCIN-7730, BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md Gap 3 and Gap 4, BCIN-7289_REPORT_FINAL.md Recommended QA Focus Areas 2-4, report-editor pack required capability template-based creation and interaction pair template-based creation + pause-mode prompts. -->

- Report Builder interaction
    * Report Builder prompt folders load selectable elements after expansion <P1>
        - Sign in to Workstation and create a new report with Report Builder
            - Open a prompt that shows attribute or metric folders
                - Double-click a folder in the prompt tree
                    - The folder expands without leaving the prompt empty
                    - Elements under the folder become visible and selectable
                    - The report author can continue building the report without reopening the prompt
    <!-- Trace: BCIN-7727, BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md Gap 2, BCIN-7289_SELF_TEST_GAP_ANALYSIS.md Root Cause C, BCIN-7289_REPORT_FINAL.md Prompt Handling risk area, report-editor pack required capability report builder interaction. -->
