# GRID-P4A-BANDING-001 — Phase 4a (advisory) benchmark result

## Verdict: **PASS (phase4a-aligned coverage demonstrated)**

This benchmark case is satisfied at **phase4a** (subcategory-only draft intent) with the case focus explicitly covered: **modern grid banding scenarios distinguish styling variants, interactions, and backward-compatible rendering outcomes**.

## Evidence used (blind pre-defect)
- Fixture bundle: `BCIN-7231-blind-pre-defect-bundle/BCIN-7231.issue.raw.json`
  - Feature description states Modern Grid currently:
    - can only enable banding in **rows**
    - cannot **format colors**
    - cannot enable banding in **columns**
    - cannot apply banding color by **row/column header**
  - Also states these capabilities exist in **Report** and need parity in **Modern Grid in dashboards**.
- Fixture bundle: `BCIN-7231-blind-pre-defect-bundle/BCIN-7231.customer-scope.json` (customer signal present; supports prioritization context but does not add functional requirements beyond the issue text).
- Skill contract references:
  - `skill_snapshot/references/phase4a-contract.md` (phase4a structure/forbidden structure; subcategory-only; atomic steps; observable leaves)
  - `skill_snapshot/SKILL.md`, `skill_snapshot/reference.md`, `skill_snapshot/README.md` (phase model and orchestrator responsibilities)

## Phase 4a-aligned scenario coverage (subcategory-only)
The following subcategories/scenario set is what phase4a must be able to draft from the provided evidence, without introducing canonical top-layer groupings.

Central topic:
- **Feature QA Plan (BCIN-7231) — Modern Grid Banding**

Subcategories and scenarios (focus coverage):

- **Banding — Enablement & Orientation**
  * Enable banding on **rows**
    - Verify banding can be toggled on for rows
    - Verify banding visibly applies to alternating rows with clear observable outcomes
  * Enable banding on **columns**
    - Verify banding can be toggled on for columns
    - Verify alternating columns are styled as expected
  * Orientation switch behavior (row → column, column → row)
    - Verify changing orientation updates rendering deterministically
    - Verify no residual styling remains from the prior orientation

- **Banding — Styling Variants (color formatting)**
  * Change banding colors (primary/secondary band colors)
    - Verify selected colors render accurately
    - Verify contrast/readability expectations are met (observable visual difference)
  * Reset/clear banding color formatting
    - Verify defaults restore
    - Verify no stale custom colors remain

- **Banding — Header-driven application (apply by header)**
  * Apply banding color by **row header**
    - Verify header-driven application affects the correct row scope
    - Verify header interaction does not misapply to body-only or other headers
  * Apply banding color by **column header**
    - Verify header-driven application affects the correct column scope
    - Verify correct mapping for multiple columns/attributes

- **Banding — Interactions & Live Updates**
  * Sorting with banding enabled
    - Verify banding remains consistent after sort (no broken alternation)
  * Expand/collapse / hierarchical row interactions (if present in modern grid context)
    - Verify alternation recalculates correctly after expand/collapse
  * Filtering / changing displayed rows/columns
    - Verify banding recalculates for the rendered set

- **Banding — Backward-compatible rendering outcomes (Report parity)**
  * Artifact created/configured in **Report** with banding settings renders equivalently in **Modern Grid dashboards**
    - Verify row banding renders equivalently
    - Verify column banding renders equivalently
    - Verify custom banding colors render equivalently
    - Verify header-applied banding renders equivalently

## Why this demonstrates phase4a compliance
- The scenario set is **explicitly tied to evidence** from BCIN-7231 description (row/column enablement, color formatting, header application, Report parity).
- The structure is **phase4a-appropriate**: subcategory → scenario → atomic action chain → observable verification leaves (no canonical top-layer group names like “Compatibility” as a top node).
- The case focus is directly and separately represented as:
  - **styling variants** (color formatting)
  - **interactions** (sort/filter/expand behaviors)
  - **backward-compatible rendering outcomes** (Report → Modern Grid parity)

## Notes / limitations (within blind pre-defect evidence)
- The fixture evidence does not specify exact UI entry points, option names, or persistence/serialization details; phase4a can still draft atomic steps using generic UI phrasing, but later phases would normally refine with additional evidence.