# Benchmark Evaluation — RE-P4A-SCENARIO-DRAFT-001 (BCIN-7289)

## Primary phase under test
- **Phase:** phase4a
- **Feature family / knowledge pack:** report-editor
- **Evidence mode:** blind_pre_defect
- **Priority:** advisory

## Case focus coverage (required)
This benchmark case requires that **Phase 4a (subcategory-only scenario drafting)** explicitly captures scenarios covering:
1. **Prompt handling**
2. **Template save**
3. **Report builder loading**
4. **Visible report title outcomes**

Using only the provided fixture evidence (blind pre-defect bundle), these concerns are directly supported by the adjacent issue summaries under BCIN-7289:
- Prompt handling: BCIN-7730, BCIN-7685, BCIN-7677, BCIN-7707, BCIN-7708
- Template save: BCIN-7688, BCIN-7667
- Report builder loading: BCIN-7727
- Visible report title outcomes: BCIN-7719, BCIN-7674, BCIN-7722

## Phase 4a contract alignment (required)
Phase 4a output must be a **subcategory-only** QA draft with:
- central topic → subcategory → scenario → atomic action chain → observable verification leaves
- **no canonical top-layer categories** (e.g., Security / i18n / EndToEnd as top-level groupings)
- **no compressed steps**

Accordingly, the following **Phase 4a subcategory-first scenario set** is what the orchestrator’s Phase 4a workflow should drive a writer-subagent to produce for BCIN-7289, given the evidence.

---

# Phase 4a Scenario Draft (subcategory-only) — BCIN-7289

Feature QA Plan (BCIN-7289)

- Workstation report authoring uses embedded Library report editor
    * Create report from template with prompt (pause mode) prompts the user <P1>
        - In Workstation, start creating a report from a template that contains prompts
            - Set the prompt execution mode to pause mode (if available in UI)
                - Proceed to open the report editor / run the report
                    - A prompt UI is displayed to the user
                    - The user can provide prompt answers and continue
    * Create report from template with prompt set to “Do not prompt” does not prompt <P1>
        - In Workstation, start creating a report from a template that contains prompts
            - In the prompt settings, select “Do not prompt”
                - Open/run the report
                    - No prompt UI is shown
                    - The report loads using default / saved prompt behavior (observable in UI state)
    * Prompt element browser loads folder contents on navigation (double click) <P1>
        - Open a report/template that shows prompts with an element browser
            - In the prompt element browser, locate a folder
                - Double click the folder
                    - The element list updates to show the folder’s children
                    - No empty/blank element panel is shown
    * Save-as report after answering prompts can discard answers without retaining prior values <P2>
        - Open a report with prompts
            - Provide prompt answers
                - Use “Save as” to create a new report
                    - Re-open / re-run the saved report
                        - When prompted, choose to discard current answers
                            - Previously entered prompt answers are not retained
                            - Prompt answer state reflects discard (observable empty/default selections)
    * Closing the editor with prompt UI open triggers the close confirmation (if unsaved changes) <P2>
        - Open a report that triggers prompt UI
            - Leave prompt UI open
                - Make a change that causes unsaved state (e.g., modify report definition)
                    - Attempt to close the report editor window
                        - A confirmation dialog to close/save is shown
                        - The user is not silently closed without a prompt

- Save / Template behavior
    * New report “Save” allows enabling “Set as template” when applicable <P1>
        - Create a new report in Workstation report editor
            - Open the Save dialog
                - Observe the “Set as template” option
                    - The “Set as template” checkbox is enabled when the report is eligible
                    - Toggling the checkbox updates the UI state (checked/unchecked)
    * Create report from template then save creates a new report (does not overwrite template) <P1>
        - Start creating a report from an existing template
            - Make a small edit
                - Choose Save
                    - A new report object is created (observable via new name/path or new ID in UI)
                    - The original template remains unchanged (observable by reopening template)

- Report Builder loading / editor initialization
    * Report Builder loads prompt elements without missing content after navigation <P1>
        - Open Report Builder in Workstation embedded report editor
            - Navigate to a prompt that uses an element picker
                - Browse into a folder in the element picker
                    - Elements load successfully
                    - No failure-to-load state is shown (e.g., empty panel / stuck loading)

- Window/report title and localization-visible outcomes
    * New report window title is user-friendly (not internal key) when creating blank report <P1>
        - In Workstation, create a new blank report
            - Observe the window title immediately after the editor opens
                - Title is a user-facing string (not an internal token like “newReportWithApplication”)
                - Title matches the report type being created (observable text)
    * Window title updates after saving a newly created report <P1>
        - Create a new report
            - Observe the window title before saving
                - Save the report with a specific name
                    - Window title updates to the saved report name (or expected naming convention)
                    - The updated title remains after refresh/reopen (observable)
    * Localized title strings are translated for “New Intelligent Cube Report / Blank Report / Report Builder” <P2>
        - Switch Workstation UI language to a non-English locale (e.g., Chinese)
            - Create each of the following entry points: New Intelligent Cube Report, Blank Report, open Report Builder
                - Observe the visible titles
                    - Each title is translated (not English fallback)
                    - No placeholder/untranslated keys appear

---

## Benchmark pass/fail determination (advisory)
**Pass (advisory)** if the orchestrator, for Phase 4a, produces (via its phase4a script + spawned subagent) a **subcategory-only** draft that includes scenarios covering all four focus areas:
- prompt handling
- template save
- report builder loading
- visible report title outcomes

**Fail (advisory)** if Phase 4a output:
- introduces forbidden top-level canonical categories (e.g., “i18n” as a top-level category), or
- omits any of the four focus areas above, or
- uses compressed steps / mixes verification text into action bullets.