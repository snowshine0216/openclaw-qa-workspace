# Benchmark Deliverable — P4A-SDK-CONTRACT-001 (BCIN-7289)

## Primary checkpoint under test
**Phase:** phase4a (subcategory-only draft)

## Blocking benchmark expectation (defect replay focus)
**Expectation:** *SDK/API visible outcomes like window title become explicit scenarios.*

## Retrospective replay assessment (from provided evidence)
The provided BCIN-7289 defect replay evidence shows the orchestrator’s **Phase 4a output historically missed SDK/API-visible outcomes** by not making them explicit observable verification leaves.

### Evidence of the miss (SDK/API-visible outcome omissions)
From **`fixture:BCIN-7289-defect-analysis-run/BCIN-7289_SELF_TEST_GAP_ANALYSIS.md`**:
- **BCIN-7733 (Wrong title on double-click)**: the plan lacked the verification leaf ensuring **the window title exactly matches the clicked report context**.
- The “Observable Outcome Omission” bucket explicitly calls out missing **observable details**, including title correctness.

From **`fixture:BCIN-7289-defect-analysis-run/BCIN-7289_QA_PLAN_CROSS_ANALYSIS.md`**:
- **Observable Outcomes (Loading, Titles)** were **missed in Phase 4a** because the draft abbreviated verification leaves.
- It recommends adding **required outcomes** including:
  - **“Workstation window title matching current report context.”**

### Conclusion for the benchmark expectation
**FAIL (blocking):** In the retrospective replay, Phase 4a did not reliably express SDK/API-visible outcomes (notably **window title**) as explicit scenario verification leaves, which is the benchmark’s required focus.

---

## What Phase 4a must do to satisfy the expectation (explicit scenario shape)
Below are **phase4a-compliant, subcategory-only** scenario examples that make SDK/API-visible outcomes explicit (no top-layer categories; atomic steps; observable leaves).

### Subcategory: Workstation window + title contract
* Open report by double-click uses correct window title <P1>
  - In Workstation, locate an existing report in the listing
    - Note the report name shown in the listing
      - Double-click the report to open in the embedded editor
        - Verify the opened window title equals the selected report’s name/context (exact match)
        - Verify the title updates if the report context changes (e.g., Save As to a different name)

* Create blank report uses user-friendly localized title (not internal key) <P1>
  - In Workstation, create a new blank report in the embedded editor
    - Observe the new editor window title
      - Verify the title is human-readable (not an internal token like `newReportWithApplication`)

### Subcategory: Loading indicator observable contract
* Create/edit report shows a single loading indicator <P2>
  - Start creating or opening a report
    - Observe loading indicators during initial load
      - Verify only one loading indicator is present at a time

---

## Phase alignment check (phase4a contract)
These examples adhere to `references/phase4a-contract.md` requirements:
- **Subcategory-only** (no canonical top-layer categories)
- **Atomic nested steps** (no compressed arrows)
- **Observable verification leaves** explicitly include SDK-visible outcomes (window title, loading indicator count)

---

## Short execution summary
Using only the provided BCIN-7289 defect replay evidence, the retrospective assessment shows a **blocking Phase 4a gap**: SDK/API-visible outcomes (especially **window title correctness**) were not consistently made explicit as scenario verification leaves. The deliverable includes phase4a-shaped scenario examples demonstrating the required explicitness.