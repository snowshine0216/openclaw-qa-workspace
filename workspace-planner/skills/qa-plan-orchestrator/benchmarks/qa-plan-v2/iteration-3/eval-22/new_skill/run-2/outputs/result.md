# RE-P4A-SCENARIO-DRAFT-001 — Phase 4a scenario-draft contract check (BCIN-7289)

## Benchmark intent (advisory)
Validate that **Phase 4a** scenario drafting (subcategory-only draft) can explicitly cover the blind scenario focus for **BCIN-7289 (report-editor)**:
- prompt handling
- template save
- report builder loading
- visible report title outcomes

This check is **blind_pre_defect**: only the provided fixture evidence may be used.

## Evidence-backed Phase 4a scenario set (subcategory-first)
Feature QA Plan (BCIN-7289)

- Report Editor (Workstation embedding Library report editor)
    * Prompt handling: pause mode should prompt user when creating report by template <P1>
        - In Workstation, start creating a report from a template that contains prompts
            - Set prompt mode to **Pause**
                - Proceed to open/run the report in the embedded (Library) editor
                    - A prompt UI is shown to the user (not silently skipped)
                    - User can provide prompt answers and continue
                    <!-- Evidence seed: adjacent defect BCIN-7730 indicates this is a risk area -->

    * Prompt handling: “do not prompt” should not prompt user <P1>
        - Start creating a report that has prompts
            - Set prompt option to **Do not prompt**
                - Open/run the report
                    - No prompt UI is shown
                    - The report proceeds using the configured behavior for “do not prompt”
                    <!-- Evidence seed: adjacent defect BCIN-7677 indicates this is a risk area -->

    * Report Builder loading: loading prompt elements via folder double-click does not break <P1>
        - Open Prompt Editor / Object Browser within the embedded editor
            - Navigate to a folder that contains selectable elements
                - Double-click the folder
                    - Elements load successfully
                    - No error state blocks selection
                    <!-- Evidence seed: adjacent defect BCIN-7727 indicates this is a risk area -->

    * Template save: set-as-template is available when saving a newly created report <P1>
        - Create a new report in Workstation embedded editor
            - Open Save / Save As
                - Attempt to enable **Set as template**
                    - Checkbox is enabled (not disabled)
                    - Saving as template succeeds
                    <!-- Evidence seed: adjacent defect BCIN-7688 indicates this is a risk area -->

    * Visible title outcome: new blank report window title is correct on create <P1>
        - Create a blank report in Workstation using the embedded editor
            - Observe the window title immediately after creation
                - Title is user-friendly and matches expected “New … Report” wording
                - Title is not a placeholder/technical string (e.g., not `newReportWithApplication`)
                <!-- Evidence seed: adjacent defect BCIN-7674 indicates this is a risk area -->

    * Visible title outcome: title updates after saving a new report <P1>
        - Create a new report in Workstation embedded editor
            - Observe the window title before saving
                - Save the report with a specific name
                    - Window title updates to the saved report name (or expected post-save format)
                    <!-- Evidence seed: adjacent defect BCIN-7719 indicates this is a risk area -->

    * i18n visible title outcome: title strings for New/Blank/Report Builder are translated <P2>
        - Set application language to a non-English locale
            - Create a New Intelligent Cube Report and/or a Blank Report
                - Navigate into Report Builder
                    - Title(s) are translated correctly for the locale
                    - No English fallback strings appear for these titles
                    <!-- Evidence seed: adjacent defect BCIN-7722 indicates i18n title translation risk -->

## Phase 4a contract alignment notes (what this artifact demonstrates)
- Subcategory-first structure is preserved (no canonical top-layer categories like “Security”, “Compatibility”, “EndToEnd”, “i18n” used as top-level buckets).
- Each scenario is an atomic, nested action chain with observable verification leaves.
- The benchmark focus items are explicitly present as scenarios:
  - prompt handling (pause mode; do-not-prompt)
  - template save (set-as-template)
  - report builder loading (prompt elements load)
  - visible report title outcomes (initial title; title update after save; i18n title)

## Limitations under blind_pre_defect mode
- No knowledge-pack artifacts (`coverage_ledger`, `artifact_lookup`, `knowledge_pack_retrieval`) were provided in the fixture evidence, so this is a **contract-focused scenario draft demonstration** rather than a validated Phase 4a output from the scripts.
- Adjacent issues are used only as risk signals to seed scenarios; no defect analysis is performed.

---

## Short execution summary
Drafted a Phase 4a-style, subcategory-only scenario set for BCIN-7289 that explicitly covers the benchmark’s blind scenario drafting focus (prompt handling, template save, builder loading, visible report title outcomes) using only the provided fixture evidence (feature description + adjacent-issues summary).