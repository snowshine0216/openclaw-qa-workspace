# Phase 4a QA Plan Artifact — BCED-4860 (Visualization)  
**Benchmark case:** VIZ-P4A-DONUT-LABELS-001  
**Primary phase under test:** phase4a  
**Evidence mode:** blind_pre_defect (customer issues only; exclude non-customer issues)  
**Priority:** advisory  
**Focus:** Donut-chart data label coverage distinguishing **label visibility**, **density**, and **overlap-sensitive outcomes**.

## 1) Phase 4a Objective (Checkpoint Contract)
Define **targeted, execution-ready coverage** for donut-chart **data labels** such that tests explicitly separate:
- **Visibility** (whether labels appear / are suppressed according to rules)
- **Density** (how many labels can be shown across varying slice counts and distributions)
- **Overlap-sensitive outcomes** (collision handling: hide, truncate, reposition, leader lines, etc.)

This artifact provides the minimum set of scenarios and checks needed to demonstrate that phase4a coverage meets the case focus.

## 2) In-Scope Behaviors (Donut Chart Data Labels)
### A. Label visibility rules (show/hide)
Coverage must include scenarios where labels are:
- Always visible (sufficient space)
- Conditionally hidden (insufficient space / collision)
- Disabled by configuration (if such a toggle exists)
- Affected by segment size thresholds (very small slices)

**Verification outcomes (must be distinguishable in results):**
- Labels rendered for eligible slices
- Labels suppressed for ineligible slices
- No “partial rendering” defects (e.g., orphaned text, missing leader lines if expected)

### B. Label density (slice count & distribution)
Coverage must include a matrix across **slice count** and **value distribution**, e.g.:
- Low count (e.g., 3–6 slices): balanced values
- Medium count (e.g., 8–12 slices): mixed values
- High count (e.g., 20+ slices): many small slices (high density)

**Verification outcomes:**
- System maintains readable labeling strategy under increasing density
- Consistent rule application (e.g., same threshold behavior, consistent collision policy)
- Performance/regression signal (e.g., label layout completion without missing/duplicated labels)

### C. Overlap-sensitive outcomes (collision/space handling)
Coverage must include overlap-provoking layouts and confirm the specific strategy used, such as:
- Hide some labels
- Truncate text
- Reposition labels (inside/outside ring)
- Use leader lines / callouts (if applicable)
- Multi-line wrapping (if applicable)

**Verification outcomes:**
- No overlapping labels in final render when overlap-avoidance is expected
- Deterministic behavior (same input → same visible/hidden set, stable positioning)
- No label-to-slice association errors (label mapped to wrong segment)

## 3) Phase 4a Test Design — Minimal Scenario Set
The following scenarios are the **minimum execution-ready set** to satisfy the benchmark focus.

### Scenario 1 — “Baseline visibility: low density, ample space”
- **Chart:** Donut
- **Data:** 4 slices, roughly even distribution
- **Expectation:** All labels visible; no collisions; correct association.

### Scenario 2 — “High density: many small slices (label suppression expected)”
- **Chart:** Donut
- **Data:** 24 slices, long-tail distribution (many tiny values)
- **Expectation:** Collision strategy triggers; some labels hidden/reduced; no overlapping visible labels; stable mapping.

### Scenario 3 — “Overlap stress: long label text”
- **Chart:** Donut
- **Data:** 10 slices, moderate distribution; labels contain long category names
- **Expectation:** Overlap resolution applied (truncate/wrap/hide/reposition); no visible overlap; labels remain associated to correct slices.

### Scenario 4 — “Mixed distribution: few large + many tiny (threshold behavior)”
- **Chart:** Donut
- **Data:** 3 large slices + 15 tiny slices
- **Expectation:** Large-slice labels visible; tiny-slice labels handled per rules (often hidden); collision policy consistent.

### Scenario 5 — “Responsive container: reduced width/height”
- **Chart:** Donut
- **Data:** 8 slices balanced
- **Layout:** Constrain container to small size
- **Expectation:** Label visibility changes appropriately with space; overlap avoided; behavior consistent across resize.

## 4) Assertions / Checks (What to record in execution)
For each scenario, record:
1. **Visibility count**: number of labels rendered vs total slices  
2. **Overlap status**: any overlapping bounding boxes among visible labels (pass/fail)  
3. **Collision policy evidence**: hide/truncate/reposition/leader lines (which occurred)  
4. **Label correctness**: sampled label → slice mapping correctness  
5. **Stability**: re-render or resize produces consistent outcomes (no flicker / random placement)

## 5) Exit Criteria for Phase 4a (Advisory)
Phase 4a coverage is acceptable for this benchmark case if:
- Test set explicitly distinguishes **visibility**, **density**, and **overlap-sensitive** outcomes.
- At least one scenario each covers: low density, high density, long text, mixed distribution thresholds, and constrained layout.
- Assertions include: rendered label count, overlap detection, and mapping correctness.

## 6) Evidence Constraints Acknowledgment (Blind, Customer-Issues-Only)
No customer-issue evidence was provided in the available fixtures (“BCED-4860-blind-pre-defect-bundle” has no accessible local path). Therefore:
- This phase4a artifact is produced from the benchmark prompt constraints only.
- No defect claims, repro steps, or customer-issue-derived specifics are included.