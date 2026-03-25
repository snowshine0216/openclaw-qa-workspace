# Phase 4a (BCIN-7289) — Defect Replay Anchor Scenarios (SDK/API-visible outcomes)

Feature QA Plan (BCIN-7289)

- Report Editor (Workstation embedded Library editor) — SDK/API-visible outcomes (Defect replay anchor)
    * Workstation window title is correct when creating a blank report (regression of untranslated/internal key) <P1>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Create a new blank report
                    - Workstation window title is human-readable (not an internal key such as `newReportWithApplication`)
                    - The title corresponds to the created report context (e.g., “New Report”/product-defined naming)
    * Workstation window title is correct for “New Intelligent Cube Report” flow <P1>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Start creating an Intelligent Cube report
                    - Workstation window title shows “New Intelligent Cube Report” (not a generic or stale title)
    * Workstation window title is correct when opening an existing report via double-click (edit context) <P0>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - From the report list, double-click a specific existing report to open it in the embedded editor
                    - Workstation window title matches the opened report’s name/context (not a previous report’s title)
                    - The title updates after the editor finishes loading (no transient incorrect final title)
    * i18n: window title is localized for Chinese users where required (title is not stuck in English) <P1>
        - Set Workstation/UI locale to Chinese (zh-CN)
            - Launch Workstation
                - Sign in (new report editor enabled)
                    - Create a new Intelligent Cube report
                        - Workstation window title is localized (Chinese) rather than English
                        - No fallback/internal string keys are shown in the title

- Report Editor (Workstation embedded Library editor) — Loading indicator observable outcome
    * Exactly one loading indicator appears during create/edit report load (no duplicate spinners) <P2>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Create a new blank report
                    - Observe the loading indicators during initial editor load
                        - Exactly one loading indicator is visible at any time during the load
                        - The loading indicator disappears once the editor is ready
                - Open an existing report for editing
                    - Observe the loading indicators during load
                        - Exactly one loading indicator is visible at any time during the load

- Report Editor (Workstation embedded Library editor) — Prompt editor + report builder interaction chains (replay anchor)
    * Confirm-to-close dialog appears when attempting to close with prompt editor open (unsaved/prompt state transition) <P1>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Open a report that uses prompts
                    - Open prompt editor (or bring prompt UI into an active/unsatisfied state)
                        - Attempt to close the report window (click X)
                            - A confirmation dialog to close/leave appears
                            - The editor does not close silently while prompt editor is open
    * Rapid repeated close attempts do not spawn multiple confirmation dialogs (interaction-pair stress) <P2>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Open a report with unsaved changes or an active prompt editor state
                    - Click the window close (X) repeatedly/rapidly
                        - At most one confirmation dialog is shown
                        - Additional clicks do not create stacked/duplicated dialogs

- Report Editor (Workstation embedded Library editor) — Save-As overwrite state transition (replay anchor)
    * Save-As overwrite of an existing report reaches conflict/confirmation state and completes without JS crash <P0>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Create a new report (or edit an existing report)
                    - Invoke Save As
                        - Choose a target name/location that conflicts with an existing report (attempt overwrite)
                            - An overwrite-conflict confirmation state is shown (or equivalent overwrite UI)
                            - Confirm overwrite
                                - No JavaScript error is thrown (e.g., no `Cannot read properties of null (reading saveAs)`)
                                - Save completes and the report is persisted as the overwritten target

- Report Builder — element interactivity after double-click (observable outcome)
    * Report Builder loads and elements are interactive after double-clicking to edit prompt-related content <P0>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Open a report that contains prompts requiring attribute/metric element selection
                    - Double-click into the prompt-related area / open the element picker via the intended UX path
                        - Prompt elements (attributes/metrics) render in the UI (not empty/missing)
                        - The elements are interactive (click/select works)

- Report Editor — Prompt “pause mode” state transition
    * Template report with prompt using pause mode can run after creation (pause→run transition) <P1>
        - Launch Workstation
            - Sign in (new report editor enabled)
                - Create a report from a template configured with prompts
                    - Configure prompts to use pause mode (per feature UX)
                        - Create/save the report
                            - Run/execute the report
                                - The report runs successfully (no stuck paused state)
                                - Results load and are visible


## Retrospective defect-to-scenario trace (why these are explicit in Phase 4a)

- Window title correctness (explicit observable leaves)
    - BCIN-7674: title shows internal key `newReportWithApplication`
    - BCIN-7719: “New Intelligent Cube Report” title correctness
    - BCIN-7733: wrong/stale title on double-click edit
    - BCIN-7721: i18n title not translated (Chinese)

- State transition chains
    - BCIN-7669: Save-As overwrite → conflict/confirmation → overwrite (and no JS crash)
    - BCIN-7708: prompt editor open → attempt close → confirm-to-close dialog appears
    - BCIN-7730: template + prompt pause mode → run → results

- Interaction pair / stress
    - BCIN-7709: rapid close clicks → multiple confirm popups (must not happen)

- Other observable outcomes
    - BCIN-7668: duplicate loading indicators
    - BCIN-7727: report builder elements not loading/interactivity missing