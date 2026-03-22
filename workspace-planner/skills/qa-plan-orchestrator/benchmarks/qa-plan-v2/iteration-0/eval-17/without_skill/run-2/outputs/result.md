# QA Plan Orchestrator — Phase 4a Deliverable (Baseline)
**Benchmark case:** VIZ-P4A-DONUT-LABELS-001  
**Primary feature:** BCED-4860  
**Feature family / knowledge pack:** Visualization / visualization  
**Primary phase under test:** phase4a  
**Evidence mode:** blind_pre_defect (**customer issues only; exclude non-customer issues**)  
**Priority:** advisory  
**Profile:** global-cross-feature-v1  
**Fixture reference:** BCED-4860-blind-pre-defect-bundle (no local path provided)

---

## Phase 4a — Coverage Refinement for Donut-Chart Data Labels (Visibility, Density, Overlap)

### 4a.1 Scope focus (must be explicitly covered)
This phase refines coverage specifically for **donut-chart data labels** with outcomes that vary by:

1. **Label visibility**  
   - Whether labels are shown/hidden based on configuration and available space.
2. **Label density**  
   - How behavior changes as the number of slices/labels increases (sparse → dense).
3. **Overlap-sensitive outcomes**  
   - Whether labels collide and what the product does: hide, truncate, wrap, reposition, leader lines, etc.

This benchmark requires that these dimensions are **explicitly distinguished in coverage**, not treated as a single “labels render” check.

---

## 4a.2 Test coverage matrix (donut labels)

### A) Label visibility outcomes (space- and config-driven)
**Goal:** Verify labels are correctly visible/hidden in donut charts under varying conditions.

- **A1. Labels enabled (baseline)**
  - Donut with a small number of slices (e.g., 3–5).
  - Expect: all labels visible; no collisions.

- **A2. Labels disabled by config**
  - Expect: no labels rendered.

- **A3. Container/responsive constraints**
  - Same chart at large vs small container sizes.
  - Expect: at smaller sizes labels may be hidden/reduced according to rules; chart remains readable; no broken layout.

- **A4. Inner radius / donut hole size impact**
  - Vary donut thickness (large hole vs small hole).
  - Expect: label placement/visibility changes appropriately; labels not clipped by inner/outer radius.

**Checks (visibility):**
- No labels render outside the canvas/container bounds (unless intentionally allowed).
- No clipped text (unless truncation is the defined behavior).
- Deterministic behavior at breakpoints (no flicker / oscillation across minor size changes).

---

### B) Density-driven outcomes (increasing slice count)
**Goal:** Confirm label strategy changes as slice count grows and labels become dense.

- **B1. Low density (≤5 slices)**
  - Expect: full labels visible.

- **B2. Medium density (6–12 slices)**
  - Expect: label collision handling begins; may introduce truncation/abbreviation/leader lines; verify consistent rules.

- **B3. High density (≥20 slices)**
  - Expect: product may hide some labels, show on hover/tooltip only, or apply aggregation rules.
  - Verify: no overlapping unreadable label pile-ups; performance acceptable; legend/tooltip compensates for hidden labels.

**Checks (density):**
- “Top-N labels only” logic (if present) behaves consistently.
- Deterministic selection of which labels show/hide when not all can be displayed.
- Label text measurement consistent across fonts/locales (if applicable).

---

### C) Overlap-sensitive outcomes (collision resolution behavior)
**Goal:** When labels would overlap, validate the collision strategy and its correctness.

- **C1. Overlap scenario via similar-sized adjacent slices**
  - Construct slices with close angles so labels cluster.
  - Expect: collision is resolved per spec (hide, reposition, leader lines, etc.).

- **C2. Overlap scenario via extremely small slices**
  - Many tiny slices adjacent.
  - Expect: small-slice labels may be suppressed; ensure no unreadable micro-label overlap.

- **C3. Long label text stress**
  - Long category names + percentages/values.
  - Expect: truncation/wrap behavior correct; no overlap; ellipsis rules consistent.

- **C4. Mixed label content**
  - Labels showing both category and value (multi-part).
  - Expect: collision handling still works; spacing correct.

**Checks (overlap):**
- No two visible labels overlap beyond acceptable tolerance.
- Leader lines (if present) do not cross excessively or point to wrong slice.
- Repositioning remains stable (no label jitter between renders).

---

## 4a.3 “Observable outcomes” definition (pass/fail framing)
Because this benchmark is blind pre-defect with limited fixture access, phase4a must still define **observable outcomes** for label behavior:

- **Visibility:** label exists in DOM/canvas and is readable (or intentionally hidden) based on config/space.
- **Density:** as slice count increases, label strategy transitions predictably (not random) and maintains readability.
- **Overlap:** collisions trigger the intended mitigation; no illegible overlapping text.

---

## 4a.4 Required test data patterns (minimal set)
To cover the focus efficiently, define datasets with:

1. **Sparse dataset:** 3–5 slices, short labels  
2. **Medium dataset:** ~10 slices, mixed label lengths  
3. **Dense dataset:** 20–40 slices, includes tiny slices  
4. **Long-text dataset:** 6–12 slices, very long category strings  
5. **Skewed dataset:** 1 dominant slice + many tiny slices (common donut edge case)

---

## 4a.5 Risks / gaps (due to blind fixture access)
- Fixture bundle referenced but **no local evidence provided**, and policy restricts to customer issues only.
- This phase4a output therefore:
  - **Cannot confirm actual product behavior** for BCED-4860,
  - But **does** refine coverage explicitly around donut label visibility/density/overlap outcomes (benchmark focus).

---

## 4a.6 Phase 4a exit criteria (for this benchmark)
- Coverage explicitly distinguishes:
  - **Visibility** scenarios,
  - **Density** escalation,
  - **Overlap-sensitive** collision outcomes,
  aligned to donut charts.
- Defines datasets and observable checks sufficient for later execution/validation.
- Notes evidence limitations under blind pre-defect constraints.

---