# RE-P4A-SCENARIO-DRAFT-001 — Phase 4a Scenario Draft (BCIN-7289)

Feature QA Plan (BCIN-7289)

- Prompt handling (Workstation embedded Library Report Editor)
    * Create report from template with prompt (Pause mode) triggers prompt UI before entering editor <P1>
        - In Workstation, start creating a report from a template that includes at least one prompt
            - Ensure the template’s prompt execution mode is set to Pause (prompt should appear before report opens)
                - Proceed with the create flow
                    - Prompt UI is shown to the user (not silently skipped)
                    - User can enter prompt answers
                    - After submitting answers, the report creation continues into the report editor
    * Create report from template with prompt set to “Do not prompt” does not show prompt UI <P1>
        - In Workstation, start creating a report from a template with prompt configured as “Do not prompt”
            - Proceed with the create flow
                - No prompt UI is displayed during creation
                - The report opens directly in the report editor
    * Save As after answering prompts offers “Discard current answers”, and discarding clears answers for the new report session <P1>
        - Open a report created from a template with prompts
            - Provide prompt answers to enter the report
                - Use Save As to create a new report
                    - When prompted about existing prompt answers, choose “Discard current answers”
                        - Prompt answers are cleared for the new saved report
                        - Re-running/triggering prompts for the new report requires answering again (no prior answers carried over)

- Template save
    * Save newly created report as a template: “Set as template” checkbox is enabled and can be selected <P1>
        - Create a new report in Workstation (embedded Library report editor)
            - Open Save / Save As
                - Locate “Set as template” option
                    - “Set as template” checkbox is enabled (not disabled)
                    - Selecting it is allowed
                    - Completing save succeeds and the item is saved as a template

- Report builder loading & prompt element navigation
    * Prompt element browser loads elements when double-clicking folders (no empty pane) <P1>
        - Open a report flow that presents a prompt with an element browser (folder tree)
            - In the element browser, double-click a folder node
                - Elements for that folder load and display
                - No failure/blank state occurs after the double-click
    * Report Builder loads required prompt elements after folder navigation without errors <P1>
        - Open Report Builder in Workstation (embedded editor)
            - Open a prompt that requires selecting elements (attributes/metrics/elements)
                - Navigate the element hierarchy using folder expansion/double-click
                    - Prompt element list populates for the selected node
                    - No load error is shown

- Visible report title outcomes (window title + in-app title)
    * Creating a blank report shows a human-readable title (not an internal key like “newReportWithApplication”) <P1>
        - In Workstation, create a blank report using the embedded report editor
            - Observe the window title / report title immediately after creation
                - Title is user-facing and meaningful (e.g., “Blank Report”/“New Report”), not an internal placeholder string
    * Creating a New Intelligent Cube Report shows correct initial window title <P1>
        - In Workstation, create a “New Intelligent Cube Report”
            - Observe the window title immediately after creation
                - Window title is exactly “New Intelligent Cube Report” (or product-specified equivalent)
    * After saving a newly created Intelligent Cube Report, the window title updates to the saved report name <P1>
        - Create a New Intelligent Cube Report in Workstation
            - Save the report with a specific name
                - Observe the window title after save completes
                    - Window title updates to the saved report name
                    - Title no longer shows the generic “New Intelligent Cube Report” label

- i18n: Titles and key dialogs
    * Report creation titles are correctly translated (New Intelligent Cube Report / Blank Report / Report Builder) <P1>
        - Set Workstation UI language to a non-English locale (e.g., Chinese)
            - Create a Blank Report
                - Observe report/window title
                    - Title is localized and correctly translated
            - Create a New Intelligent Cube Report
                - Observe report/window title
                    - Title is localized and correctly translated
            - Open Report Builder
                - Observe Report Builder title text
                    - Title is localized and correctly translated
    * Confirmation dialog buttons are localized (Confirm / Cancel) <P2>
        - Set Workstation UI language to a non-English locale (e.g., Chinese)
            - Trigger a confirmation dialog related to converting to Intelligent Cube / Datamart
                - Observe the dialog’s action buttons
                    - “Confirm” and “Cancel” are translated correctly

- Close/exit flows impacted by prompts
    * Closing the report editor when prompt editor is open shows confirm-to-close dialog <P1>
        - Open a report that brings up the prompt editor
            - Leave the prompt editor open
                - Attempt to close the report editor window
                    - A confirm-to-close dialog is shown
                    - User can choose to cancel close and remain in the editor
    * Clicking the window close (X) repeatedly does not create multiple stacked confirm dialogs <P2>
        - Open a report in the embedded editor
            - Initiate a close action that triggers a confirm dialog
                - Click the window close (X) multiple times quickly
                    - Only a single confirm dialog is shown
                    - No duplicate dialogs stack on top of each other