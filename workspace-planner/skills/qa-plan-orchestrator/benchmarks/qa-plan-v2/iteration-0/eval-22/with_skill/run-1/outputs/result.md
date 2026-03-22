Feature QA Plan (BCIN-7289)

<!-- phase: phase4a -->
<!-- benchmark_case: RE-P4A-SCENARIO-DRAFT-001 -->
<!-- advisory_verdict: satisfied -->
<!-- evidence_used: ./inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.issue.raw.json ; ./inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json ; ./skill_snapshot/knowledge-packs/report-editor/pack.md -->
<!-- blind_policy_note: ./inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.adjacent-issues.summary.json was reviewed for scope only and excluded from direct scenario evidence because it contains non-customer adjacent issues under all_customer_issues_only. -->

- Workstation Embedded Report Authoring
    * Workstation opens the embedded report editor for report authoring <P1>
        - Open report authoring from Workstation
            - Wait for the embedded editor surface to finish loading
                - The report editor opens inside the Workstation authoring flow
                - The user can continue authoring in the same Workstation session without an immediate blocking error
        <!-- Trace: BCIN-7289.issue.raw.json; report-editor pack.md -->

- Template-Based Creation
    * Creating a report from a template pauses for required prompt input <P1>
        - Start creating a report from a template in Workstation
            - Reach the point where required prompts must be answered
                - A prompt dialog appears before template-based creation completes
                - The creation flow does not silently skip the prompt path
        <!-- Trace: BCIN-7289.issue.raw.json; report-editor pack.md -->
    * Saving a template-based report creates the intended saved report target <P1>
        - Complete a template-based report creation flow
            - Save the new report to a chosen folder
                - The save creates the intended saved report target instead of silently reusing the template source
                - The saved report is visible in the chosen location after the save completes
        <!-- Trace: BCIN-7289.issue.raw.json; report-editor pack.md -->

- Save Override
    * Overriding an existing report preserves the latest authoring changes <P1>
        - Open an existing report in the embedded editor
            - Make a visible report change and save by overriding the report
                - The save finishes without a blocking save error
                - Reopening the same report shows the latest saved change
        <!-- Trace: report-editor pack.md -->

- Prompt Handling
    * Prompt answers are applied when the report run continues <P1>
        - Open a report flow that requires prompt input
            - Enter prompt answers and continue the run
                - The report opens with the submitted prompt answers applied
                - The run completes without leaving the user in a stuck loading state
        <!-- Trace: BCIN-7289.issue.raw.json; report-editor pack.md -->
    * Discarded prompt work does not reappear as saved prompt state <P2>
        - Open a prompted report flow
            - Enter prompt answers and discard the unsaved work
                - Reopen the same prompted flow
                    - The previously discarded answers are not preserved as if they had been saved
                    - The user sees a fresh prompt state for the new attempt
        <!-- Trace: report-editor pack.md -->

- Report Builder Interaction
    * Report Builder loads prompt-related elements after folder navigation <P1>
        - Open Report Builder from the embedded report editor
            - Open a folder that contains prompt-related elements
                - The element list loads after the folder is opened
                - The user can continue selecting elements without an empty or stalled loading view
        <!-- Trace: report-editor pack.md -->
    * Report Builder interaction returns to an active Workstation authoring session <P2>
        - Open Report Builder from Workstation report authoring
            - Interact with builder content and return to the report editor
                - Builder controls stay responsive during the interaction
                - Returning from Report Builder keeps the report authoring session available
        <!-- Trace: BCIN-7289.issue.raw.json; report-editor pack.md -->

- Window Title Visibility
    * A new unsaved report shows a human-readable title in Workstation <P1>
        - Create a new blank report in Workstation
            - Wait for the embedded report editor to finish loading
                - The visible window title is a readable report title instead of a placeholder key or raw token
        <!-- Trace: report-editor pack.md -->
    * Saving a new report updates the visible window title to the saved report name <P1>
        - Create a new report in Workstation
            - Save the report with a chosen name
                - The visible window title updates to the saved report name
                - The title stays aligned with the saved report while editing continues
        <!-- Trace: BCIN-7289.issue.raw.json; report-editor pack.md -->
    * Saving a template-based report updates the visible title to the saved report name <P1>
        - Create a report from a template
            - Save the report as a new report
                - The visible window title changes from the new-report state to the saved report name
                - The title matches the report object the user saved and continues editing
        <!-- Trace: report-editor pack.md -->

<!-- explicit_exclusion: i18n dialogs, analog-gate save-dialog depth, and close-confirmation while prompt editor is open are not expanded in this advisory blind case because the current benchmark focus is prompt handling, template save, report builder loading, and visible report title outcomes, and the allowed customer-safe evidence does not establish more specific locale or dialog variants. -->
