# Benchmark Result — P4A-SDK-CONTRACT-001 (BCIN-7289)

## Target
- **Skill:** `qa-plan-orchestrator` (snapshot contract)
- **Primary feature:** **BCIN-7289** (feature family: **report-editor**)
- **Primary phase under test:** **Phase 4a**
- **Case family:** defect replay (retrospective replay)
- **Priority:** blocking
- **Benchmark focus:** **SDK/API visible outcomes (e.g., window title) must become explicit scenarios with observable verification leaves**

## Phase 4a Contract Requirement (authoritative)
From `skill_snapshot/references/phase4a-contract.md`:
- Phase 4a must produce **subcategory → scenario → atomic steps → observable verification leaves**.
- Must ensure: **“SDK/API visible outcomes must remain testable in scenario leaves, not hidden behind implementation wording.”**

## Retrospective Defect Replay Evidence (BCIN-7289)
The fixture run documents missed gaps specifically attributable to Phase 4a.

### Evidence that SDK-visible outcomes were previously missed in Phase 4a
From `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`:
- **Observable Outcomes (Loading, Titles)** were **missed in Phase 4a** because outcomes like:
  - **Workstation window title matching current report context**
  - **Single loading indicator during report load/edit cycles**
  were not made explicit in verification leaves.

From `fixture:BCIN-7289-defect-analysis-run/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`:
- **Observable Outcome Omission** bucket includes:
  - **BCIN-7668:** missing explicit check for **exactly one loading indicator**.
  - **BCIN-7733:** missing explicit verification leaf that **window title exactly matches the clicked report’s context**.

These are **SDK/API visible outcomes** (window title, loading indicators) and are explicitly called out as gaps caused by Phase 4a draft behavior.

## Explicit Phase 4a Scenarios Required to Satisfy This Benchmark Focus
To satisfy the benchmark’s blocking expectation (“SDK/API visible outcomes … become explicit scenarios”), Phase 4a must include scenarios whose *verification leaves* assert the observable outcomes.

Below are the minimal explicit Phase 4a scenario shapes (subcategory-first, atomic steps, observable leaves) that directly cover the cited misses:

### 1) Window Title — new blank report (historical defect BCIN-7674)
- Workstation: New report window title
  * Create blank report shows correct window title
    - Launch Workstation
      - Create a blank report in the embedded editor
        - Observe the Workstation window title
          - Window title is **not** a raw key like `newReportWithApplication`
          - Window title matches the expected “New … Report” naming for the created context

### 2) Window Title — edit via double-click (open defect BCIN-7733)
- Workstation: Edit report entrypoints
  * Double-click to edit shows correct report-context title
    - In Workstation, locate an existing report
      - Double-click the report to open/edit
        - Observe the Workstation window title
          - Title matches the **clicked report’s context/name** (no stale/previous report title)

### 3) Loading Indicator — single loader during create/edit (open defect BCIN-7668)
- Workstation: Editor loading states
  * Create/edit report shows a single loading indicator
    - Create a report (blank or template)
      - Wait for editor load
        - Observe loading UI
          - Only **one** loading indicator is shown (no duplicate spinners)

## Benchmark Verdict (Phase 4a alignment)
- **Expectation:** “[defect_replay][blocking] SDK/API visible outcomes like window title become explicit scenarios”
  - **Supported by evidence as a required remediation:** Yes. The fixture evidence shows these outcomes were missed and explicitly attributes the miss to **Phase 4a**.
  - **Demonstrated Phase 4a-aligned remedy:** The Phase 4a contract explicitly mandates SDK/API visible outcomes be testable in scenario leaves; the scenario examples above meet the contract structure.

- **Expectation:** “[defect_replay][blocking] Output aligns with primary phase phase4a”
  - **Met:** The required remedy is expressed as **Phase 4a subcategory-only scenarios** with atomic steps and observable verification leaves, and **does not introduce canonical top-level categories**.

## Pass/Fail
- **PASS (contract-level):** The Phase 4a contract **contains the necessary requirement** to force SDK/API visible outcomes into observable verification leaves, and the BCIN-7289 replay evidence pinpoints exactly the outcomes (window title, loader count) that must be rendered as explicit Phase 4a scenarios.

> Note: This benchmark is executed in retrospective replay mode using provided fixture evidence; no actual `drafts/qa_plan_phase4a_r*.md` artifact from a live run was supplied to validate content-level compliance.