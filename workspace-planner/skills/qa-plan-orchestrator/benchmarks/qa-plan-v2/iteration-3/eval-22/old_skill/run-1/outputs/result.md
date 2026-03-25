# Benchmark Result — RE-P4A-SCENARIO-DRAFT-001 (BCIN-7289)

## Phase focus
**Primary phase under test:** Phase **4a** (subcategory-only scenario drafting).

This benchmark checks that Phase 4a scenario drafting (blind, pre-defect) explicitly covers:
- prompt handling
- template save
- report builder loading
- visible report title outcomes

## Evidence used (blind pre-defect)
From fixture bundle **BCIN-7289-blind-pre-defect-bundle**:
- **BCIN-7289.issue.raw.json** — feature description: embed Library report editor into Workstation report authoring to reduce overhead; highlights prompt tech divergence between Workstation vs Library.
- **BCIN-7289.adjacent-issues.summary.json** — adjacent defects include multiple items directly aligned with the benchmark focus:
  - prompt handling issues (e.g., prompt not shown, elements fail to load)
  - template / save-as / save behavior issues
  - report builder loading issues
  - window/report title translation and post-save title update issues
- **BCIN-7289.customer-scope.json** — no explicit customer signal.

## Phase 4a contract alignment (what should be produced)
Per **references/phase4a-contract.md**, Phase 4a must output a **subcategory-only** XMindMark draft containing scenarios with:
- central topic → subcategory → scenario → atomic nested action steps → observable verification leaves
- **no canonical top-layer grouping** (no `Security`, `E2E`, `i18n`, etc.)

## Scenario drafting coverage (Phase 4a subcategory-only set)
The following Phase 4a-ready subcategories and scenarios cover the benchmark focus areas while staying subcategory-first.

Feature QA Plan (BCIN-7289)

- Workstation embedded Library Report Editor — entry & initialization
  * Launch embedded report editor from Workstation successfully
    - Open Workstation
      - Start creating a new report that uses the embedded Library report editor
        - Wait for the editor UI to render
          - Editor shell becomes interactive (no infinite loading)
          - Primary authoring surface is visible
  * Editor open via double-click (open existing report) loads correctly
    - In Workstation, locate an existing report
      - Double-click the report to edit with the embedded editor
        - Wait for report to open
          - Report content renders
          - No blank/empty native top menu state is shown

- Prompt handling — prompting modes and answer lifecycle
  * Template-based creation triggers prompts when configured to prompt
    - Create a report from a template that contains prompts
      - Choose a mode where user should be prompted (e.g., “prompt user”)
        - Confirm or proceed to open the report
          - Prompt dialog appears
          - User can provide prompt answers
  * “Do not prompt” mode does not prompt
    - Create a report from a template that contains prompts
      - Choose a mode where user should not be prompted
        - Open the report
          - No prompt dialog is shown
          - Report opens directly into authoring surface
  * Pause mode + prompts still prompts at the appropriate time
    - Create a report from a template that contains prompts
      - Enable pause mode
        - Continue workflow to the point prompts should be displayed
          - Prompt dialog appears when expected
          - User can proceed after answering
  * Prompt element browser loads items reliably
    - Open a prompt that requires selecting elements
      - Navigate the element/folder browser
        - Double-click a folder
          - Elements list loads and is populated
          - No empty element list is shown after navigation
  * Discarding prompt answers does not retain prior answers after Save As
    - Open a report that contains prompts
      - Provide prompt answers
        - Perform Save As to create a new report
          - Choose to discard current answers
            - Reopen prompt (or reopen report)
              - Prior answers are not pre-filled
              - Prompt state reflects discard choice
  * Prompt answers can be passed/used by the report
    - Open a report with prompts
      - Provide valid prompt answers
        - Run/preview the report
          - Results reflect the provided answers
          - No “answers not passed” behavior occurs

- Save / Save As / Template save
  * Save As creates a new report (does not overwrite template source)
    - Create a report from a template
      - Modify the report
        - Use Save As
          - Pick a destination folder
            - A new report is created
            - The original template remains unchanged
  * Save As override existing report succeeds (no null saveAs/400)
    - Open a report
      - Choose Save As
        - Select an existing report as the target to replace/override
          - Confirm replacement
            - Save completes successfully
            - No 400 error is shown
  * Set as template checkbox is available and usable for new report
    - Create a new report
      - Open Save/Save As dialog
        - Locate “Set as template”
          - Checkbox is enabled
          - User can toggle it and proceed

- Report Builder loading & object browser
  * Report Builder loads expected editor components on open
    - Create a new report (blank or from template)
      - Open Report Builder
        - Wait for left panels/objects to load
          - Object browser/panels render expected nodes
          - No missing element sections appear
  * Loading state resolves to a usable editor (no stuck loading)
    - Open a report in the embedded editor
      - Simulate session timeout or re-auth requirement (if test env supports)
        - Dismiss any error dialog
          - Editor does not remain in perpetual loading
          - User can recover (reload / re-open) to a usable state

- Visible report title outcomes (including post-save update)
  * New blank report shows correct default window title
    - Create a blank report
      - Observe the window/title area
        - Default title is human-readable and correct for the report type
        - Title is not an internal key (e.g., not “newReportWithApplication”)
  * Title updates after saving a new report
    - Create a new report
      - Save the report with a specific name
        - Observe the window/title area
          - Title updates to the saved report name
          - Title does not remain the generic “New …” title
  * Title strings are translated according to user language
    - Switch Workstation/user language to a non-English language (e.g., Chinese)
      - Create a new report / open Report Builder
        - Observe window title and report creation titles
          - Title is translated correctly
          - No untranslated English keys/strings appear

## Determination vs benchmark expectations
- **Explicit coverage of focus areas:** **Meets** (prompt handling, template save, report builder loading, visible report title outcomes all represented as Phase 4a subcategory scenarios).
- **Phase alignment:** **Meets** (subcategory-first, atomic nested steps, observable verification leaves; no canonical top-layer categories used in the scenario set).

## Gaps / limitations (due to evidence mode)
- Evidence is limited to the feature description plus adjacent-issue summaries; there is no detailed PRD/Confluence spec in the fixture. Scenarios therefore emphasize observable outcomes and regression risks implied by adjacent issues, consistent with **blind pre-defect** drafting.