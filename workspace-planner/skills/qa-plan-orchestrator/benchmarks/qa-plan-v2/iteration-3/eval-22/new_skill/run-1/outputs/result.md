# RE-P4A-SCENARIO-DRAFT-001 — Phase 4a scenario drafting (BCIN-7289)

## Benchmark intent (phase contract: Phase 4a)
Demonstrate that **Phase 4a** scenario drafting (subcategory-only) explicitly captures the **blind scenario drafting focus** for report-editor replay:
- prompt handling
- template save
- report builder loading
- visible report title outcomes

This artifact provides a **Phase 4a-style subcategory-only scenario set** for **BCIN-7289** (feature family: **report-editor**) aligned to the **Phase 4a contract** replay-anchor requirements.

## Feature QA Plan (BCIN-7289)

- Report Editor (Workstation embeds Library report editor)

    - Workstation: entry + embed lifecycle

        * Open report editor from Workstation (blank report) shows embedded Library editor
            - Launch Workstation
                - Workstation shell is visible
            - Start creating a new Blank Report (using the new embedded report editor)
                - A report editor window/popup opens
                - Embedded report editor UI renders (not the legacy prompt UI)

        * Report editor window title uses a user-facing title (not internal placeholder)
            - Launch Workstation
            - Create a new Blank Report in the embedded report editor
                - The window title is a human-readable report creation title (not an internal app string)

    - Prompt handling (prompt-editor ↔ report-builder interaction)

        * Prompt is displayed when report creation requires prompting (prompt mode = prompt)
            - Create a report from a template that has prompts
            - Ensure prompt mode is configured to prompt the user during creation
                - Prompt editor UI opens
            - Provide valid prompt answers
                - Answers are accepted (no validation errors)
            - Continue to build the report
                - Report Builder loads using the provided prompt answers

        * Prompt is not shown when configured to not prompt (prompt mode = do not prompt)
            - Create a report from a template that has prompts
            - Set prompt behavior to “Do not prompt”
                - No prompt dialog is shown
            - Continue to build the report
                - Report Builder opens without prompting

        * Pause mode: prompt is deferred then shown at the intended later step
            - Create a report from a template that has prompts
            - Set prompt behavior to “Pause mode”
                - Prompt is not immediately shown
            - Trigger the step that resumes prompting (per UX flow)
                - Prompt editor is shown at the resume point

        * Discard prompt answers resets the effective answers used for subsequent build
            - Create a report from a template that has prompts
            - Enter prompt answers in the prompt editor
                - Entered answers are visible in the prompt UI
            - Choose the action to discard current answers
                - Prompt answers are cleared/reset in the UI
            - Continue to Report Builder
                - Builder state reflects the discarded/reset answers (not the prior answers)

        * Prompt editor close/confirm behavior is correct while prompt editor is open
            - Open a prompt editor during report creation
                - Prompt editor is visible
            - Attempt to close the report editor window/popup
                - A single confirmation UI is shown (no duplicate confirmations)
                - The prompt editor does not suppress the confirm-close UI

    - Report Builder loading

        * Report Builder loads after prompt completion (no stuck loading)
            - Create a report requiring prompts
            - Complete prompt answers and proceed
                - Report Builder loads
                - No indefinite loading indicator persists

        * Object browser navigation in Report Builder loads items reliably
            - Open Report Builder
            - In the object browser, open a folder and then double-click the folder
                - Items/elements load successfully in the prompt/builder context
                - No empty state that requires retry to load

    - Template save

        * Save newly created report with “Set as template” enabled
            - Create a new report
            - Open Save / Save As
            - Enable “Set as template”
                - Checkbox is enabled and can be toggled
            - Save to a target folder
                - Save completes successfully
                - The saved object is marked as a template

        * Save As from a template creates a new report (does not overwrite the template)
            - Start from an existing template
            - Choose Save As
            - Provide a new report name
            - Confirm save
                - A new report object is created
                - The original template remains unchanged

        * Override existing report during save handles replacement without HTTP 400
            - Open an existing report
            - Choose Save As
            - Select an existing report name/path to replace
            - Confirm replacement
                - Save succeeds (no HTTP 400 error)
                - The replaced report opens correctly afterward

        * Save As into a folder succeeds without instance/binding errors
            - Create a report with content that can be saved
            - Choose Save As
            - Save into a target folder with a new name
                - Save completes
                - No error indicating the instance does not belong to the report/cube

        * Save override does not throw client-side null saveAs errors
            - Open a report
            - Choose Save As
            - Select an existing report to override
            - Confirm
                - Save completes
                - No client error referencing null saveAs

    - Visible report title outcomes (window title correctness on edit + after save)

        * New report window title updates after the first successful save
            - Create a new report
                - Window title indicates a new/unsaved report state
            - Save the report with a specific name
                - Save succeeds
                - Window title updates to the saved report name

        * Double-click to edit report shows correct title and does not break native menu
            - In Workstation, locate an existing report
            - Double-click to open it for editing with the embedded editor
                - The editor opens successfully
                - Window title matches the report name
                - Native top menu is populated (not empty)

        * Creating a new Intelligent Cube Report shows correct title and updates after saving
            - Create a New Intelligent Cube Report
                - Window title shows the correct user-facing title for the new IC report
            - Save the report under a specific name
                - Window title updates to the saved report name

        * i18n: report builder/new report titles are translated in non-English locales
            - Set Workstation language to a non-English locale
            - Create a new Blank Report and open Report Builder
                - New report title string is translated
                - Report Builder title string is translated


---

## Short execution summary
- Primary phase alignment: **Phase 4a** (subcategory-only scenario draft; no canonical top-level categories like Security/Compatibility/E2E/i18n used as layers).
- Case focus explicitly covered via dedicated subcategories and scenarios for:
  - **prompt handling** (prompt / do not prompt / pause / discard answers / confirm-close)
  - **template save** (set-as-template, save-as from template, override/replace flows)
  - **report builder loading** (post-prompt load, object browser interactions)
  - **visible report title outcomes** (new report title, update after save, edit title correctness, i18n title translation)