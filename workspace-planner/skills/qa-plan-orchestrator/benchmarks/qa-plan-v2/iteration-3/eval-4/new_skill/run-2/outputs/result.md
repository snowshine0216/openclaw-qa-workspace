# Phase 4a — Defect Replay Scenario Addendum (BCIN-7289)

Central topic: Feature QA Plan (BCIN-7289) — Phase 4a replay anchor

- Report-editor replay anchor (BCIN-7289)
    * Workstation window title is correct on edit (double-click entry) <P1>
        - In Workstation with **new report editor** enabled
            - From a folder/listing, identify a saved report with a known name (e.g., “Sales by Region”)
                - Double-click the report to open it in the embedded report editor
                    - Observe the Workstation window title
                        - Window title equals the clicked report’s name (no stale/previous report title)
                        - Window title is not a generic placeholder (e.g., not `newReportWithApplication`)
                        <!-- Defect replay: BCIN-7733 wrong title on edit; also guards against placeholder title class BCIN-7674 -->

    * Workstation window title is correct when creating a new blank report <P2>
        - In Workstation with **new report editor** enabled
            - Create a new blank report
                - Wait for the editor to finish loading
                    - Observe the Workstation window title
                        - Window title is a user-facing localized report title (not `newReportWithApplication`)
                        <!-- Defect replay: BCIN-7674 -->

    * Save-As overwrite confirmation chain does not crash; outcome is explicit <P0>
        - In Workstation with **new report editor** enabled
            - Open or create a report with unsaved changes
                - Choose **Save As**
                    - Select a target folder
                        - Enter a name that already exists (choose an existing report name)
                            - Confirm Save/Overwrite
                                - An overwrite confirmation state is shown (explicit conflict/overwrite prompt)
                                - Choosing confirm completes without JavaScript error (no “Cannot read properties of null (reading saveAs)”) 
                                - The saved report content corresponds to the current editor state after overwrite
                                <!-- State transition replay: “Save-As initiated → overwrite-conflict → overwrite-confirmation → saved”; Defect replay: BCIN-7669 -->

    * Single loading indicator during create/edit load cycle <P2>
        - In Workstation with **new report editor** enabled
            - Create a new blank report
                - Observe the loading UI during initialization
                    - Exactly one loading indicator is visible (no duplicate spinners/icons)
            - Close the report
                - Reopen an existing report
                    - Observe the loading UI during open
                        - Exactly one loading indicator is visible
                        <!-- Defect replay: BCIN-7668 (two loading icons) -->

    * Report Builder prompt elements render and are interactive after double-click to edit <P0>
        - In Workstation with **new report editor** enabled
            - Open a report that contains prompts with selectable elements (attribute/metric element prompts)
                - Open the prompt editor / prompt UI
                    - Double-click into a prompt element area that should reveal sub-elements
                        - Prompt elements load and render (not blank)
                        - Rendered elements are interactive (click/select works)
                        <!-- Defect replay: BCIN-7727 (elements fail to load after double-click) -->

    * Template + prompt pause mode transition: create → run produces correct execution <P1>
        - In Workstation with **new report editor** enabled
            - Create a report from a template that includes prompts
                - Configure prompt to use **pause mode** (where applicable)
                    - Save the report
                        - Run/execute the report
                            - Report runs successfully (not stuck / not blocked due to pause-mode state)
                            <!-- State transition replay: “template with prompt pause mode → run report → correct execution”; Defect replay: BCIN-7730 -->

    * Confirm-to-close dialog appears when prompt editor is open and there are unsaved changes <P2>
        - In Workstation with **new report editor** enabled
            - Open a report
                - Open the prompt editor (or a prompt editing surface)
                    - Make an edit that creates unsaved changes
                        - Attempt to close the report window (click the window close “X”)
                            - A confirm-to-close / unsaved-changes dialog is shown
                            <!-- State transition replay: “prompt editor open → attempt close → confirm dialog visible”; Defect replay: BCIN-7708 -->

    * Fast repeated close attempts do not open multiple confirm dialogs <P2>
        - In Workstation with **new report editor** enabled
            - Ensure there are unsaved changes
                - Click the window close “X” multiple times quickly
                    - At most one confirm-to-close dialog is present
                    - Focus remains on the single dialog; the UI behind does not spawn stacked duplicates
                    <!-- Interaction pair replay: repeated fast actions + modal popup; Defect replay: BCIN-7709 -->

---

## Phase 4a alignment notes (for reviewers)

- Subcategory-first (replay anchor) structure is preserved (no top-layer categories like “Security/i18n/E2E”).
- Each SDK/API-visible outcome that matters for this replay is expressed as an observable, testable verification leaf (e.g., exact window title string correctness; crash absence + overwrite confirmation state; single loader count).
- State transitions are written explicitly as scenario chains where relevant (Save-As overwrite, pause-mode run, confirm-close).