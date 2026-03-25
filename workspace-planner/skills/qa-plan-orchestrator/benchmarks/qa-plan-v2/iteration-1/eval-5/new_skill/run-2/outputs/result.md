# Phase 4a (BCIN-7289) — Missing Scenario Replay Coverage (Advisory)

Benchmark case: **P4A-MISSING-SCENARIO-001**  
Primary phase under test: **phase4a** (subcategory-only scenario drafting)  
Focus: **missing scenario generation for template-save and report-builder loading**

This artifact provides the **Phase 4a-ready subcategory scenarios** that were missed in the prior run lineage, reconstructed from the retrospective defect evidence for BCIN-7289.

---

Feature QA Plan (BCIN-7289)

- Template save / Template-derived report creation
    * Create report from template: Save creates a new report (does not overwrite the source template) <P1>
        - In Workstation, sign in to Library with an account that has **new report editor** enabled
            - Start creating a report and select an existing template (e.g., “Product sales”)
                - In the embedded editor, click **Save**
                    - A **new report** is created/saved in the chosen location
                    - The original template object is **not modified/overwritten**
                    - Re-opening the original template shows it is unchanged
    * Save newly created report: “Set as template” checkbox is enabled and usable for a new report <P2>
        - In Workstation, sign in to Library with an account that has **new report editor** enabled
            - Create a **blank** report in the embedded editor
                - Open the Save dialog
                    - Observe the **Set as template** option
                        - The checkbox is **enabled** (not disabled)
                        - Toggling it changes the save intent (template vs non-template) in a visible/observable way (e.g., enabled state, saved result type)
    * Save As override existing report: overwrite-conflict confirmation appears and overwrite completes without JS errors <P1>
        - In Workstation, sign in to Library with an account that has **new report editor** enabled
            - Create a new report (or open an unsaved new report)
                - Choose **Save As**
                    - Select a destination/name that conflicts with an existing report (intended overwrite)
                        - Confirm overwrite when prompted
                            - No JS error occurs (specifically no “Cannot read properties of null (reading saveAs)”)
                            - The target existing report is replaced/updated as expected
                            - The editor remains usable after the overwrite completes

- Report loading / Create & edit load indicators
    * Create blank report: only one loading indicator is shown during load <P2>
        - In Workstation, sign in to Library with an account that has **new report editor** enabled
            - Create a **blank report**
                - Observe the UI during the initial load
                    - Exactly **one** loading indicator/spinner is visible (no duplicate loaders)
                    - The loading indicator disappears when the report is ready
    * Edit existing report: only one loading indicator is shown during load <P2>
        - In Workstation, sign in to Library with an account that has **new report editor** enabled
            - Open an existing report for editing in the embedded editor
                - Observe the UI during load
                    - Exactly **one** loading indicator/spinner is visible (no duplicate loaders)
                    - The report becomes interactive once loading completes

- Report Builder / Prompt element loading
    * Prompt editor: double-clicking a prompt element loads its builder elements and is interactive <P1>
        - In Workstation, sign in to Library with an account that has **new report editor** enabled
            - Open or create a report that includes prompts (attribute/metric prompts)
                - Open the prompt editor / prompt area
                    - Double-click a prompt element to edit it
                        - The Report Builder loads the expected sub-elements for that prompt (not blank/missing)
                        - Loaded elements are interactive (clickable/selectable) and respond to user input
                        - No perpetual loading/empty state persists after the double-click

<!--
Phase4a notes (contract alignment):
- Kept as subcategory-first (no canonical top-layer categories).
- Scenarios explicitly encode the missing state transitions and observable outcomes called out by the defect replay:
  - template-save correctness
  - save-as overwrite confirmation flow (overwrite-conflict -> confirmation)
  - single loading indicator
  - report-builder element interactivity after double-click
Evidence mapping (retrospective):
- Template-save overwrite issue: BCIN-7667 (done)
- Save-as override crash: BCIN-7669 (open, High)
- Set-as-template disabled: BCIN-7688 (open)
- Two loading icons: BCIN-7668 (open)
- Report Builder element load failure: BCIN-7727 (open, High)
-->