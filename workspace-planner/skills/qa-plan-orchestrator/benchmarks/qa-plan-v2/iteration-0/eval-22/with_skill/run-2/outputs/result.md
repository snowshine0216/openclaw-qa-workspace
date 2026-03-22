Feature QA Plan (BCIN-7289)

<!-- phase: phase4a -->
<!-- evidence_mode: blind_pre_defect -->
<!-- blind_policy: all_customer_issues_only; exclude non-customer issues -->
<!-- blind_note: BCIN-7289.customer-scope.json reports no explicit customer signal, so the bundled adjacent issue summary is the only frozen blind risk surface available in this workspace -->
<!-- trace: inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.issue.raw.json -->
<!-- trace: inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.customer-scope.json -->
<!-- trace: inputs/fixtures/BCIN-7289-blind-pre-defect-bundle/materials/BCIN-7289.adjacent-issues.summary.json -->
<!-- trace: skill_snapshot/knowledge-packs/report-editor/pack.md -->

<!-- trace: BCIN-7730, BCIN-7685, BCIN-7707, BCIN-7677 -->
- Template creation and prompt handling
    * Pause-mode template creation prompts before the report opens <P1>
        - Start report creation from a template that contains prompts
            - Keep the prompt mode set to pause and continue into report creation
                - The prompt dialog opens before the report editor finishes loading
                - The user can answer the prompt instead of being dropped into an unprompted report
    * Save As discard current answer clears prior prompt answers <P1>
        - Open a prompted report in the embedded report editor
            - Enter prompt answers and start Save As with discard current answer selected
                - Reopen the saved report
                    - The report asks for prompt answers again
                    - The previous prompt answers are not silently reused
    * Save As do not prompt keeps the saved report from prompting again <P2>
        - Create a prompted report and start Save As
            - Save the report with the do not prompt option selected
                - Open the saved report
                    - The saved report opens without showing the prompt dialog
                    - The saved behavior matches the selected no-prompt option

<!-- trace: BCIN-7667, BCIN-7669, BCIN-7688 -->
- Template save and overwrite behavior
    * Saving a report created from a template creates a new report in the chosen folder <P1>
        - Create a report from a template in Workstation
            - Save the report to a target folder as a new object
                - Open the saved object from the selected folder
                    - The saved object opens as a new report
                    - The original template remains unchanged in its original location
    * Override save to an existing report completes without an error dialog <P1>
        - Open a report and choose to save by overriding an existing report
            - Select the existing target report and confirm the overwrite
                - Wait for the save to finish
                    - The save completes without a null-property error dialog
                    - The target report reflects the updated content after the save
    * Save dialog keeps template-related controls interactive for a new report <P2>
        - Create a new report and open the save dialog
            - Review the set as template option before saving
                - Toggle the template-related control
                    - The template control is enabled for the new report
                    - The save dialog remains interactive long enough to complete the save

<!-- trace: BCIN-7727 -->
- Report Builder loading and Library-vs-Workstation gap
    * Report Builder folder double-click loads prompt elements in Workstation <P1>
        - Open a prompt that uses Report Builder content inside Workstation
            - Double-click a folder in the element browser
                - Wait for the folder contents to load
                    - The elements list is populated for the selected folder
                    - The prompt pane does not stay empty after the folder opens
    * Workstation keeps the embedded Library prompt-selection flow usable <P2>
        - Open a template-based report that reaches a Report Builder prompt
            - Load a folder and choose an element from the prompt browser
                - Apply the prompt selection
                    - The selected element is accepted in Workstation
                    - The embedded flow does not stop on a Workstation-only loading gap

<!-- trace: BCIN-7674, BCIN-7719, BCIN-7722, BCIN-7720 -->
- Window title and localized report identity
    * Blank report shows a readable initial title instead of an internal key <P1>
        - Create a blank report from Workstation
            - Wait for the embedded report editor window to finish opening
                - Look at the report window title
                    - The title uses a human-readable blank report name
                    - The title does not show an internal placeholder such as newReportWithApplication
    * New Intelligent Cube report title updates after the first save <P1>
        - Create a new Intelligent Cube report
            - Save the report with a user-chosen name
                - Return focus to the editor window after the save finishes
                    - The window title changes to the saved report name
                    - The title no longer shows the temporary new-report title
    * Localized report titles stay translated for non-English users <P2>
        - Set Workstation to a supported non-English language
            - Create a blank report or Intelligent Cube report
                - Open the embedded report editor
                    - The visible report title uses the translated product string
                    - The title does not fall back to untranslated English-only labels
    * Conversion confirmation dialog buttons stay translated <P2>
        - Set Workstation to a supported non-English language
            - Start converting the report into an Intelligent Cube or Datamart
                - Wait for the confirmation dialog to appear
                    - The confirmation buttons use translated labels
                    - The dialog does not expose untranslated button text

<!-- trace: BCIN-7708, report-editor interaction pair: close-confirmation + prompt editor open -->
- Prompt editor close confirmation
    * Close confirmation appears while the prompt editor is open <P2>
        - Open a report that launches the prompt editor
            - Leave unsaved changes in the main editor
                - Click the window close control while the prompt editor is still open
                    - A close confirmation dialog appears
                    - The user can decide whether to keep or discard changes before the editor closes
