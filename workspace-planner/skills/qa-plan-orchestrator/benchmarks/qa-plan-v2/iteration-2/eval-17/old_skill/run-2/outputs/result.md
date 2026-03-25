# Phase 4a contract check — VIZ-P4A-DONUT-LABELS-001 (BCED-4860)

## Benchmark expectation coverage (advisory)

### 1) Case focus explicitly covered
**Expectation:** donut-chart data label coverage distinguishes **label visibility**, **density**, and **overlap-sensitive outcomes**.

**Evidence available (blind pre-defect bundle):**
- BCED-4860 summary: **"[Dev] Support data label for each slice in Donut chart."**
- Parent BCED-4814 summary: **"Support data label for each slice in Donut chart."**

**Assessment:** **NOT DEMONSTRATED** from the provided evidence.
- The available Jira summaries establish the feature is about **donut slice data labels**, but they do **not** describe requirements/behaviors around:
  - **Visibility rules** (e.g., show/hide thresholds, toggles, min slice size).
  - **Density behavior** (e.g., many slices, max labels, aggregation, prioritization).
  - **Overlap handling** (e.g., collision avoidance, truncation, leader lines, hiding, stacking).
- No Phase 4a draft artifact is provided to show that the QA plan includes scenarios that explicitly separate and verify those outcomes.

### 2) Output aligns with primary phase: phase4a
**Expectation:** output aligns with Phase 4a (subcategory-only QA draft; no canonical top-layer grouping).

**Assessment:** **NOT DEMONSTRATED** from the provided evidence.
- No Phase 4a output artifact is present in evidence (e.g., `drafts/qa_plan_phase4a_r1.md`).
- Therefore we cannot verify Phase 4a-specific constraints such as:
  - subcategory-first structure,
  - atomic step nesting,
  - observable verification leaves,
  - absence of forbidden top-layer categories.

## Conclusion (benchmark verdict)
**This benchmark case is not satisfied with the provided evidence.**

The evidence confirms the feature topic (donut chart slice data labels) but does not provide Phase 4a deliverables or requirement detail sufficient to demonstrate the required coverage distinctions (visibility vs density vs overlap-sensitive outcomes) or Phase 4a contract alignment.