# Phase 4a Retrospective Replay — BCIN-7289 (report-editor)

Primary checkpoint under test: **phase4a**

## Benchmark verdict (phase4a contract adherence)

**Fail (blocking):** The phase4a contract requires that **SDK/API-visible outcomes are explicit, testable scenario leaves** (not implied). Retrospective defect evidence for BCIN-7289 shows the prior plan missed multiple **observable outcome** and **state transition** verifications that are **SDK/UI-contract visible**, especially **window title** and **loading indicator multiplicity**, and the **save-as overwrite** transition.

This benchmark case requires: “SDK/API visible outcomes like **window title become explicit scenarios**.” The evidence indicates Phase 4a output (in the defective run) did not consistently render these outcomes as explicit verification leaves.

## Phase 4a explicit scenario requirements derived from BCIN-7289 defect replay

Below are the **minimum Phase 4a subcategory-first scenarios** that must exist to satisfy the benchmark’s focus (SDK/API visible outcomes made explicit). These are written in Phase 4a structure: *subcategory → scenario → atomic actions → observable leaves*.

> Note: These scenarios are directly driven by the defect replay evidence and are intentionally **observable-outcome heavy** (titles/loading indicators) as required by the benchmark.

### Window title / title localization (SDK/UI contract visible)

- Workstation embedded report editor — window title correctness
    * Create blank report shows correct default title (no raw key like `newReportWithApplication`) <P1>
        - In Workstation, open the embedded (Library) report editor
            - Create a blank report
                - Observe the Workstation window title
                    - Window title is a user-friendly product string (not `newReportWithApplication`) (BCIN-7674)

- Workstation embedded report editor — edit via double-click uses correct report-context title <P1>
    * Double-click a report to edit shows correct/stable title for the opened report
        - In Workstation, locate an existing report in the listing
            - Double-click the report to open in the embedded editor
                - Observe the Workstation window title immediately after open
                    - Window title matches the clicked report’s name/context (not stale/wrong) (BCIN-7733)

- Conversion flow — new Intelligent Cube report title correctness <P1>
    * Converting to Intelligent Cube shows correct window title
        - In Workstation embedded editor, start conversion to Intelligent Cube
            - Complete conversion flow to the point a new IC report opens/appears
                - Observe the window title
                    - Window title equals “New Intelligent Cube Report” (BCIN-7719)

- i18n: window title translated for Chinese (explicit locale outcome) <P1>
    * New Intelligent Cube Report title is localized in zh-CN
        - Set client/Workstation locale to zh-CN
            - Trigger “New Intelligent Cube Report” creation via conversion flow
                - Observe the window title
                    - Title is translated (not English) for zh-CN (BCIN-7721)

### Loading indicator multiplicity (observable UX outcome)

- Create/edit report — single loading indicator during load <P2>
    * Creating or editing a report shows exactly one loading indicator
        - In Workstation embedded editor, create a blank report
            - Observe loading UI during initial load
                - Exactly one loading indicator is visible (no duplicate spinners/icons) (BCIN-7668)

### Save-As overwrite state transition (explicit state chain)

- Save-As overwrite existing report — overwrite conflict confirmation and no crash <P0>
    * Save-As to an existing report triggers overwrite confirmation and completes without JS error
        - In Workstation embedded editor, open/create a report
            - Start “Save As”
                - Choose a name/path that conflicts with an existing report
                    - Confirm overwrite when prompted
                        - No JavaScript error is shown (e.g., no “Cannot read properties of null (reading saveAs)”) (BCIN-7669)
                        - Save completes and the overwritten report can be reopened successfully

### Report Builder interactivity after double-click (observable outcome)

- Prompt editor / Report Builder — elements render and are interactive after double-click <P0>
    * Double-click to edit prompt content loads Report Builder elements interactively
        - Open a report that includes prompts/elements
            - Open the prompt editor experience
                - Double-click an element entry that should open/edit in Report Builder
                    - Report Builder sub-elements render (not empty)
                    - Elements are interactive/selectable (BCIN-7727)

## Why this is a phase4a contract failure (per benchmark evidence)

- The **Self Test Gap Analysis** classifies multiple misses as **Observable Outcome Omission**, including:
  - missing verification that **window title exactly matches report context** (BCIN-7733)
  - missing verification for **exactly one loading indicator** (BCIN-7668)
  - missing verification for **Report Builder element interactivity after double-click** (BCIN-7727)
- The **Cross Analysis** attributes “Observable Outcomes (Loading, Titles)” misses to **Phase 4a** and explicitly calls out:
  - “Workstation window title matching current report context”
  - “Single loading indicator during report load/edit cycles”
- The **phase4a contract** (snapshot) explicitly requires:
  - “SDK/API visible outcomes must remain testable in scenario leaves”
  - “SDK/API visible outcomes must … not [be] hidden behind implementation wording”

Given this retrospective replay, the benchmark expectation (“window title become explicit scenarios”) is not met by the defective run’s Phase 4a behavior/output.

## Blocking acceptance criteria for this benchmark case

To pass **P4A-SDK-CONTRACT-001**, the Phase 4a draft must include, at minimum:

1. At least one scenario where **window title correctness** is a **leaf-level observable** (exact match / correct localization)
2. At least one scenario where **loading indicator count** is explicitly asserted (exactly one)
3. At least one scenario where a **Save-As overwrite transition** is explicit (conflict → confirmation → completion), including the observable “no crash/error”

---

# Short execution summary

- Mode: retrospective replay using provided fixture evidence only.
- Phase focus: validated Phase 4a expectations against BCIN-7289 defect replay artifacts.
- Result: **blocking fail** because evidence shows Phase 4a missed making SDK/UI-contract outcomes (notably **window title**) explicit verification leaves; provided the minimum explicit Phase 4a scenarios required to satisfy the benchmark focus.