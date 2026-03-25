# RE-P4A-SCENARIO-DRAFT-001 — Phase 4a scenario drafting (BCIN-7289)

## Benchmark alignment (phase4a, advisory)
This artifact demonstrates **Phase 4a** compliance: a **subcategory-only** scenario draft that explicitly covers the benchmark focus areas for BCIN-7289 (report-editor), in **blind pre-defect** mode:

- **Prompt handling**
- **Template save**
- **Report builder loading**
- **Visible report title outcomes**

The scenarios below are drafted **without** using canonical top-layer groupings (e.g., “Security”, “E2E”, “i18n”), and use **atomic nested steps** with **observable verification leaves** per the Phase 4a contract.

---

Feature QA Plan (BCIN-7289)

- Workstation report authoring with embedded Library report editor
    * Launch embedded editor from Workstation and reach an editable canvas
        - Open Workstation
            - Navigate to a project where report authoring is available
                - Start creating a new report (entry that uses the embedded Library report editor)
                    - Embedded editor loads and is interactive (no perpetual spinner)
                    - Editing surface is visible (grid/canvas/object browser area)
                    - No duplicate loading indicators block interaction
    * Report Builder loads after creating a report from a template
        - Open Workstation
            - Open the report creation flow
                - Choose a report template
                    - Confirm/continue to create the report
                        - Report Builder view loads successfully
                        - Template content is visible (template layout/objects present)
                        - No empty or missing builder chrome/menus that prevents editing

- Prompt handling (embedded Library prompt UX inside Workstation)
    * Prompt is shown when template/report requires prompting (normal prompt mode)
        - Create a report from a template that contains prompts
            - Proceed to the stage where prompts should appear
                - Prompt UI is displayed to the user
                - Prompt has selectable elements/answers (not empty)
                - User cannot proceed without providing required answers
    * Prompt element browsing loads items when navigating folders
        - Open a prompt that allows browsing/selecting elements
            - In the prompt element browser, open a folder
                - Double click a subfolder
                    - Elements list refreshes to show the selected folder contents
                    - No “empty list” when items exist
                    - No error message appears during folder navigation
    * Do-not-prompt mode prevents prompt UI from appearing on open
        - Create or configure a report/template with prompts set to “Do not prompt”
            - Save the report/template
                - Close and re-open the report in Workstation embedded editor
                    - Prompt UI does not appear
                    - Report opens directly into the editor/builder
    * Pause prompt mode still triggers prompting at the appropriate time
        - Create a report from a template that uses a “pause” prompt mode
            - Start the report creation/open flow
                - Reach the point where prompting should occur
                    - Prompt UI appears (not skipped)
                    - User can answer prompts and continue
    * Prompt answers are passed into report execution/editing state
        - Open a report that requires prompts
            - Provide valid prompt answers
                - Continue into the report builder/editor
                    - Report displays data/objects consistent with provided answers
                    - No indication that answers were ignored (e.g., default/blank state)
    * Discarding current prompt answers clears them for subsequent prompting
        - Open a report with prompts
            - Provide prompt answers
                - Save As the report (new report)
                    - Re-open the new report
                        - Choose “discard current answer” (or equivalent option)
                            - Prompt answers are cleared
                            - Prompt UI requires selecting answers again (no stale selections)

- Save / Save As flows
    * Save newly created report to a folder successfully
        - Create a new blank report in Workstation embedded editor
            - Invoke Save
                - Choose a target folder
                    - Confirm save
                        - Save succeeds without errors
                        - Report is present in the chosen folder location
    * Save As report with prompts preserves prompting configuration appropriately
        - Open a report that uses prompts
            - Invoke Save As
                - Choose a new name and folder
                    - Confirm save
                        - New report is created as a distinct object (not overwriting source unless chosen)
                        - Prompting behavior matches the selected prompt mode for the new report
    * Overwrite existing report via Save As behaves correctly
        - Open a report
            - Invoke Save As
                - Select an existing report as the overwrite target
                    - Confirm overwrite
                        - Overwrite completes without client-side exception
                        - Overwritten report opens successfully afterward
    * Set as template is enabled when saving a newly created report
        - Create a new report
            - Open Save / Save As dialog
                - Observe “Set as template” option
                    - Option is enabled (when applicable)
                    - If selected and saved, the saved object is treated as a template in selection flows

- Visible report title outcomes (window title and in-app title)
    * New blank report shows a human-readable title (not a placeholder)
        - Create a new blank report in Workstation embedded editor
            - Observe the window title / editor title region
                - Title is a human-readable default (not a technical key like “newReportWithApplication”)
    * Title updates after first successful save
        - Create a new report
            - Note the initial title displayed
                - Save the report with a specific name
                    - Observe the window title / editor title region
                        - Title updates to the saved report name
                        - Title update occurs without requiring a restart

- Template creation + prompt handling + builder load (combined flow)
    * Create report from template with prompts; prompt is shown; builder loads with answered context
        - Start “Create from template”
            - Select a template that contains prompts
                - Continue
                    - Prompt UI is shown
                        - Provide valid answers
                            - Continue
                                - Report Builder loads successfully
                                - Report content reflects answered prompt context

---

## Short execution summary
- Produced a **Phase 4a subcategory-only** scenario draft for **BCIN-7289** aligned to the benchmark focus: **prompt handling**, **template save**, **report builder loading**, and **visible report title outcomes**.
- Kept to Phase 4a constraints: no canonical top-layer categories; atomic nested action chains with observable verification leaves.