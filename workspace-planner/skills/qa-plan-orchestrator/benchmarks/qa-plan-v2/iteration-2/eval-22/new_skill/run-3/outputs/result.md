# RE-P4A-SCENARIO-DRAFT-001 — Phase 4a (Scenario Draft) Assessment

**Primary feature:** BCIN-7289

**Feature family / knowledge pack:** report-editor

**Primary phase under test:** phase4a

**Evidence mode:** blind_pre_defect

**Priority:** advisory

## Phase 4a contract alignment (what Phase 4a must produce)
Phase 4a is required to output a **subcategory-only** QA draft (`drafts/qa_plan_phase4a_r<round>.md`) with:

- Central topic line: `Feature QA Plan (BCIN-7289)`
- Subcategory → scenario → atomic nested action chain → observable verification leaves
- **No** canonical top-layer categories (e.g., Security / Compatibility / EndToEnd / i18n)
- No compressed steps (`A -> B -> C`) and no mixing verification text into action bullets

## Case focus coverage (must be explicitly represented in the Phase 4a scenario draft)
This benchmark’s focus requires the Phase 4a scenario set to explicitly cover:

1. **Prompt handling**
2. **Template save**
3. **Report builder loading**
4. **Visible report title outcomes**

### Evidence available in this benchmark bundle (blind pre-defect)
Within the provided fixture evidence, the only concrete, test-seeding signals for the focus area are the **adjacent issues list** under BCIN-7289:

- Prompt handling signals:
  - BCIN-7730: *“When create report by template with prompt using pause mode, it will not prompt user”*
  - BCIN-7727: *“Report Builder｜ Fails to load elements in prompt after double clicking on the folder”*
  - BCIN-7685: *“Cannot pass prompt answer in workstation new report editor”*
  - BCIN-7677: *“When save as report with prompt as do not prompt, the report will still prompt”*
  - BCIN-7707: *“After save as report with prompt, then choose discard current answer, prompt answers still keeps”*

- Template save signals:
  - BCIN-7688: *“Set as template check box is disabled when save a newly create report on workstation”*
  - BCIN-7667: *“When create report by template, save the report will directly save to report rather than create new one”*

- Report builder loading signals:
  - BCIN-7727 (also overlaps): prompt element loading failures

- Visible report title outcomes signals:
  - BCIN-7719: *“The window's title should be `New Intelligent Cube Report` and title should be updated after saving report”*
  - BCIN-7674: *“The window title is "newReportWithApplication" when create blank report from workstation new report editor”*
  - BCIN-7722: *“i18n | ... Report Builder in title is not correctly translated”*

## Benchmark finding (phase4a-focused)
**Not demonstrable / Blocked by missing Phase 4a artifact evidence.**

This benchmark asks to “generate or review only the artifacts needed” to demonstrate whether the orchestrator satisfies **Phase 4a** scenario drafting requirements. However, the provided evidence bundle does **not** include any of the Phase 4a runtime artifacts that would be necessary to evaluate compliance, specifically:

- `drafts/qa_plan_phase4a_r<round>.md`
- `phase4a_spawn_manifest.json`
- `context/artifact_lookup_BCIN-7289.md`
- `context/coverage_ledger_BCIN-7289.md` (+ `.json` when pack active)
- `context/knowledge_pack_retrieval_BCIN-7289.md` / `context/knowledge_pack_summary_BCIN-7289.md`
- `context/deep_research_synthesis_report_editor_BCIN-7289.md`

Because Phase 4a is a **writer phase validated in `--post` against the produced draft**, the absence of the Phase 4a draft prevents confirming:

- Whether scenarios are structured as **subcategory-first** (no top-category leakage)
- Whether steps are **atomic and properly nested**
- Whether verification leaves are **observable**
- Whether the scenario set **explicitly covers** prompt handling, template save, report builder loading, and visible report title outcomes

## What the Phase 4a draft would need to contain to satisfy this case focus (acceptance checklist)
To satisfy the benchmark’s focus, the Phase 4a draft should include (at minimum) subcategory-first scenarios that cover:

- **Prompt handling**
  - Template-based creation where prompt behavior varies by mode (e.g., “pause mode” vs normal)
  - Passing prompt answers into runtime / report execution
  - “Do not prompt” behavior persistence
  - Discarding prompt answers clears state as expected
  - Prompt UI navigation actions (e.g., double-click folder) loads prompt elements

- **Template save**
  - Save-as behavior from a template creates a new report (not overwriting the template)
  - “Set as template” option availability and persistence on newly created reports

- **Report Builder loading**
  - Builder loads reliably; prompt element browser loads elements on navigation
  - No indefinite loading, no missing elements after common navigation paths

- **Visible report title outcomes**
  - Initial window title for new blank/new IC report is correct (not placeholder like `newReportWithApplication`)
  - Title updates after saving (and after Save As)
  - Title localization correctness where applicable (if i18n is in scope for this feature/pack)

All of the above must be represented as:

- Subcategory (e.g., `Workstation Report Authoring`, `Prompting`, `Save / Save As`, `Report Builder`, `Window Title`)
- Scenario titles
- Atomic action chains
- Observable verification leaves (e.g., *window title text equals X*, *prompt dialog appears*, *elements list populated*, *template checkbox enabled*)

## Status
**Outcome:** BLOCKED (insufficient benchmark evidence to verify Phase 4a compliance)

**Why:** Phase 4a contract evaluation requires the produced Phase 4a draft artifact; fixture evidence only provides Jira issue context and adjacent issue summaries.