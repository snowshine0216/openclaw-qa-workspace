<!-- ./outputs/result.md -->

# QA Plan Orchestrator — Phase 4a Deliverable (Advisory)
**Benchmark case:** VIZ-P4A-DONUT-LABELS-001  
**Primary feature:** BCED-4860  
**Feature family / knowledge pack:** visualization  
**Primary phase under test:** phase4a (phase contract)  
**Evidence mode:** blind_pre_defect (customer-issues-only policy)  
**Priority:** advisory  
**Benchmark profile:** global-cross-feature-v1  
**Focus:** donut-chart data label coverage that distinguishes **label visibility**, **label density**, and **overlap-sensitive outcomes**.

## 0) Evidence boundary & compliance
- **Evidence available in this benchmark run:** Only the benchmark prompt + references to `./skill_snapshot/SKILL.md` (authoritative workflow package).  
- **Customer issues evidence:** Not provided in the benchmark evidence list (fixture referenced but no local path).  
- **Blind policy note:** This deliverable does **not** introduce any non-customer issues. It also cannot cite customer issues because none were provided in the accessible evidence set.

## 1) Phase 4a objective (contract-level)
Phase 4a output must demonstrate the **test coverage design** for BCED-4860 focused on donut-chart **data label behavior**, explicitly separating:
1) **Visibility** conditions (when labels should show/hide)  
2) **Density** conditions (how many labels, how close)  
3) **Overlap-sensitive** outcomes (collision handling, prioritization, truncation, leader lines, etc.)

This is an **advisory** phase-contract check: confirm that the plan includes the right *coverage distinctions* and *measurable outcomes*.

## 2) Scope under test (BCED-4860)
**Component:** Donut chart data labels (rendering + layout rules)  
**User-facing behavior under focus:** Whether labels appear, remain legible, and behave predictably as chart segment count and available space change.

## 3) Coverage model (must-hit coverage slices)
The plan must cover donut data labels across three orthogonal axes:

### A. Label visibility (on/off decisions)
Test situations that validate *whether labels should be rendered at all*.

**Coverage requirements**
- Labels enabled vs disabled (per-series / per-slice / global toggle—whatever configuration exists)
- Minimum slice size threshold behavior (tiny slices)
- “Show labels” behavior under small container sizes (responsive)
- Label content availability (null/empty values; zero values; negative values if supported)
- Single slice vs multi-slice donuts (100% segment)
- Inside vs outside label placement (if configurable)

**Expected assertion types**
- Presence/absence of label DOM/canvas primitives
- Consistent rule application (e.g., small slices suppressed)
- No “ghost labels” (hitboxes without visible text)

### B. Label density (high-volume labeling)
Test situations that validate *behavior when many labels compete for limited space*.

**Coverage requirements**
- Segment count sweep: e.g., 1, 2, 5, 10, 20, 50+ slices
- Evenly distributed slices vs many small adjacent slices
- Narrow ring thickness vs thick ring
- Font size variations (small/medium/large)
- Container size sweep: small card tile → medium → full-width
- Localized/long text (label strings expand)

**Expected assertion types**
- Labels remain readable or degrade gracefully (defined by product behavior)
- Stable performance (no severe layout thrashing) at high slice counts
- Deterministic label selection/prioritization if not all labels can show

### C. Overlap-sensitive outcomes (collision handling & resolution)
Test situations that validate *what happens when labels would overlap*.

**Coverage requirements**
- Overlap between adjacent labels at identical radial positions
- Overlap between label and chart edges (clipping)
- Overlap between labels and legend/annotations (if co-present)
- Overlap between label and donut hole center (if inside labels)
- Leader line behavior (if supported): routing, crossings, attachment points
- Truncation/ellipsis/wrapping rules (if supported)
- Priority rules: which labels remain when overlap occurs (largest slice? first? nearest top?)

**Expected assertion types**
- No illegible stacked labels unless that is explicitly accepted behavior
- Correct collision resolution strategy: hide, move, truncate, use leader lines, etc.
- No label jitter across small resizes or minor data changes (layout stability)
- No labels drawn outside viewport (unless intentionally allowed)

## 4) Phase 4a test design artifacts (what should exist)
To satisfy phase4a for this benchmark focus, the orchestrated plan should include:

### 4.1 A donut-label scenario matrix (minimum viable)
A matrix that explicitly enumerates the cross-product of:
- **Visibility controls** (on/off; inside/outside)
- **Density tiers** (low/medium/high segment counts)
- **Overlap stressors** (small container, long labels, tiny slices)

A minimal set (example structure; exact numbers may vary):
- **Visibility:** 4 scenarios  
- **Density:** 3 tiers  
- **Overlap:** 4 stressors  
=> ~12–20 targeted test cases (not exhaustive cross product, but representative).

### 4.2 Oracle definitions (pass/fail criteria)
For each overlap strategy supported by the product, define a crisp oracle:
- Hide threshold: “If computed label bbox intersects another bbox by > X, then …”
- Truncation: “Label text must end with ellipsis and remain within bbox”
- Leader lines: “No line crossing; anchor at slice mid-angle”

If numeric thresholds are unknown, phase4a should still require:
- A **documented** rule source (spec, design decision, or customer issue evidence)  
- Or an **empirical baseline** approach (golden images) with controlled diffs.

### 4.3 Verification methods aligned to visualization
- **Golden image regression** for overlap/placement outcomes (primary)
- **Layout/bbox assertions** when deterministic geometry is expected
- **Responsive snapshots** across container widths
- **A11y checks**: label visibility should not break accessible names if applicable

## 5) Gaps / blockers given available evidence (blind bundle absent)
Because the fixture `BCED-4860-blind-pre-defect-bundle` is referenced but not accessible in provided evidence, phase4a cannot:
- Tie overlap/visibility rules to **specific customer-reported symptoms**
- Confirm actual product configuration options (inside/outside, leader lines, etc.)
- Confirm existing acceptance thresholds or intended collision strategy

**Action needed (outside this run):**
- Provide the customer-issues-only evidence bundle or excerpts so oracles can be anchored to real reported behavior and expected outcomes.

## 6) Phase 4a advisory conclusion (benchmark expectation check)
**Benchmark focus explicitly covered:** Yes — the coverage model and scenario design explicitly distinguish:
- **Label visibility**
- **Label density**
- **Overlap-sensitive outcomes**

**Phase alignment:** This output is scoped as a **phase4a** test design / coverage contract artifact (advisory), not execution results.

**Confidence:** Medium (coverage structure is correct; product-specific rules and customer-issue anchoring cannot be validated without the referenced bundle).