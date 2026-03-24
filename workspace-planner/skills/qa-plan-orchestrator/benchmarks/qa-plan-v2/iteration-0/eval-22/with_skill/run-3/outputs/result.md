Feature QA Plan (BCIN-7289)

<!-- artifact: phase4a subcategory draft -->
<!-- blind_policy: all_customer_issues_only -->
<!-- direct_customer_signal: none in inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json -->
<!-- trace: inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.issue.raw.json -->
<!-- trace: inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json -->
<!-- trace: inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.adjacent-issues.summary.json -->
<!-- trace: skill_snapshot/knowledge-packs/report-editor/pack.md -->
<!-- blind_bundle_note: frozen adjacent issue summaries are attached for weak customer-signal cases such as BCIN-7289 -->

- Template-Based Creation
    * Create a report from a prompt-enabled template as a new report without overwriting the source template <P1>
        - Launch report creation from a saved template in Workstation
            - Select a template that requires prompt answers
                - Continue into the template flow
                    - Prompt dialog opens before the report builder starts
                    - The source template stays unchanged until a save choice is confirmed
        - Enter the required prompt answers
            - Submit the prompt dialog
                - Wait for the editor to load
                    - Report Builder opens with the template structure visible
                    - The loaded report reflects the submitted prompt values
        - Open Save As for the new report session
            - Choose a destination folder and enter a new report name
                - Confirm the save
                    - A new report is created in the selected folder instead of overwriting the source template
                    - The saved report appears under the chosen folder after the save completes
    * Canceling the first save after template-based creation keeps the unsaved session isolated from the source template <P2>
        - Create a new report from a saved template
            - Submit the required prompt answers
                - Wait for the report builder to open
                    - The editor shows an unsaved report session
                    - The source template is still unchanged before any save confirmation
        - Open Save As for the unsaved report
            - Cancel the save dialog
                - Return to the editor window
                    - The unsaved session stays open for further editing
                    - Reopening save still targets a new report path instead of the source template

- Prompt Handling
    * Pause-mode prompting requires user input before a template-based report continues <P1>
        - Start creation from a template that uses pause-mode prompting
            - Wait for the prompt dialog to appear
                - Choose values in each required prompt control
                    - Submit the prompt dialog
                        - The flow does not bypass the prompt step
                        - The selected answers are carried into the loaded report session
    * Discarding current prompt answers forces fresh input on the next report attempt <P2>
        - Open a prompt-enabled report flow in Workstation
            - Submit one set of prompt answers and enter the editor
                - Start a follow-up flow that offers to discard the current answers
                    - Choose to discard the current answers
                        - The next report attempt asks for prompt input again
                        - Previously discarded answers are not silently reused
    * Closing while the prompt editor is open still shows a visible confirmation choice <P2>
        - Open a prompt-enabled report and keep the prompt editor visible
            - Enter unsaved prompt values
                - Attempt to close the editor window
                    - A close confirmation appears above the active prompt flow
                    - Choosing Cancel keeps the prompt editor and entered values visible

- Report Builder Loading
    * Folder navigation inside prompt selection loads the available elements instead of leaving the selector empty <P1>
        - Open a prompt dialog that uses folder-based element browsing
            - Double-click a folder in the element selector
                - Wait for the selector to refresh
                    - The child elements are listed for selection
                    - The element list does not stay empty after the folder opens
    * Workstation and Library keep the same visible checkpoint order from prompt to builder load <P2>
        - Start the same prompt-enabled template flow in Workstation
            - Start the same prompt-enabled template flow in Library
                - Advance both flows through prompt submission
                    - Both experiences show the prompt before report builder loading
                    - Any Library-vs-Workstation gap is visible at a named step instead of being hidden inside a generic load failure

- Save Override And Dialog
    * Saving over an existing report keeps the current context and completes without an error dialog <P1>
        - Open an existing report in the embedded editor
            - Make a visible change in the report content
                - Save the report to the same name
                    - The save completes without an error dialog
                    - Reopening the report shows the new change under the same report name
    * The save dialog exposes complete, interactive controls for new report and template choices <P2>
        - Open Save As from a newly created report session
            - Review the available destination, naming, and template-related controls
                - Enter a valid report name and target location
                    - The save controls stay enabled for input
                    - The confirm action stays available after valid entries are provided

- Visible Report Title
    * The window title changes from a human-readable new-report label to the saved report name after save <P1>
        - Create a new report in the embedded editor
            - Observe the window title before the first save
                - Save the report with a specific name
                    - Return to the editor after the save finishes
                        - The pre-save title uses a readable new-report label instead of a raw key
                        - The visible title updates to the saved report name after the save completes
    * Non-English sessions show translated report titles and confirmation dialog text <P2>
        - Launch Workstation in a non-English language
            - Create a new report and open its confirmation dialogs
                - Observe the window title and dialog buttons
                    - The new-report title is translated for the selected language
                    - Confirm and Cancel buttons use translated text instead of fallback keys
