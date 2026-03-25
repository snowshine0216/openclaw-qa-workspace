# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a (advisory) contract coverage check

## Target
- **Primary feature:** BCIN-7547
- **Feature family / knowledge pack:** modern-grid
- **Primary phase under test:** **phase4a** (subcategory-only draft writer)
- **Case focus:** **modern grid hyperlink-style coverage separates contextual-link styling from ordinary element rendering**
- **Evidence mode:** blind_pre_defect

## Evidence-backed intent (from fixture)
BCIN-7547 states:
- “**Contextual links applied to attributes or metrics in grids** should be clearly discoverable and intuitive to use.”
- “Objects with contextual links must be **visually distinguishable** (e.g., **blue/underlined hyperlink styling** with an **indicator icon**).”

This implies Phase 4a scenario coverage must explicitly test:
1) **Contextual-link styling** (hyperlink affordance + indicator) on eligible grid objects (attributes/metrics), and
2) **Non-contextual/ordinary rendering** for similar grid cells/objects without contextual links, ensuring the styling **does not leak**.

## Phase 4a-aligned coverage (what must appear in the Phase 4a subcategory draft)
The Phase 4a draft must remain **subcategory-first** (no top-level canonical groupings like “EndToEnd”, “Compatibility”, etc.) while still separating the two render paths.

### Subcategory: Grid cell rendering — contextual link affordance
Scenarios should include (examples of required separations):
- **Attribute cell with contextual link is visually distinguishable**
  - Verify hyperlink styling (blue/underlined per spec/example) is applied
  - Verify **indicator icon** is present
  - Verify the styling is discoverable at rest (no interaction required)
- **Metric cell with contextual link is visually distinguishable**
  - Same checks as attribute

### Subcategory: Grid cell rendering — ordinary (non-contextual) styling
Scenarios should include explicit “negative”/control comparisons:
- **Attribute cell without contextual link does not look like a hyperlink**
  - Verify no hyperlink styling (no blue/underline treatment)
  - Verify no indicator icon
- **Metric cell without contextual link does not look like a hyperlink**
  - Same checks

### Subcategory: Mixed state within same grid (critical separation)
To demonstrate “separates contextual-link styling from ordinary element rendering” in a grid context:
- **Mixed cells: only linked cells show hyperlink styling**
  - In the same grid, compare linked vs unlinked attribute/metric cells
  - Verify styling is applied only to linked objects and not adjacent/unlinked cells

## Phase contract alignment (phase4a)
- The required coverage can be expressed entirely as **Phase 4a subcategories and scenarios** (no canonical category leakage).
- The case focus is met only if the draft includes **both**:
  - Scenarios asserting the **presence** of contextual-link styling/indicator, and
  - Scenarios asserting the **absence** of hyperlink styling/indicator for ordinary rendering.

## Advisory verdict
- **Meets benchmark expectation if** the Phase 4a scenario set includes explicit “linked vs non-linked” styling separation checks for **attributes and metrics in grids**, including the **indicator icon** mention.
- With the provided evidence bundle, this separation is directly motivated by the Jira description text and should be treated as **required Phase 4a coverage**.