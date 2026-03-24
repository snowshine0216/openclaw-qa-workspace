# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a advisory check (BCIN-7547)

## Scope
- **Primary feature:** BCIN-7547
- **Feature family / knowledge pack:** modern-grid
- **Primary phase under test:** **Phase 4a** (subcategory-only draft contract)
- **Evidence mode:** blind_pre_defect
- **Case focus:** **Modern grid hyperlink-style coverage separates contextual-link styling from ordinary element rendering**

## What Phase 4a must demonstrate (contract-aligned)
Per the Phase 4a contract, the draft must be **subcategory-first** (no canonical top-level buckets), and must include scenarios that make the **contextual-link styling** requirements testable and distinguishable from baseline grid rendering.

## Evidence-backed requirement to cover
From BCIN-7547 Jira description:
- “**Contextual links applied to attributes or metrics in grids** should be clearly discoverable and intuitive to use.”
- “Objects with contextual links must be **visually distinguishable** (e.g., **blue/underlined hyperlink styling** with an **indicator icon**).”

This implies Phase 4a should contain **separate scenarios** for:
1) **Cells/objects that DO have contextual links** → must render hyperlink styling + indicator icon.
2) **Cells/objects that do NOT have contextual links** → must *not* pick up hyperlink styling; they remain ordinary grid text styling.

## Phase 4a subcategory-only scenario set (to satisfy the benchmark focus)
> Note: This is intentionally **Phase 4a-shaped** (no Security/Compatibility/E2E categories), and each scenario is written as atomic nested steps with observable verification leaves.

Feature QA Plan (BCIN-7547)

- Modern Grid — Contextual link styling
    * Contextual-link cell is visually distinguishable from normal cell <P1>
        - Open a dashboard/report containing a grid with at least one attribute/metric that has a contextual link
            - Observe the grid cell for the linked attribute/metric
                - The linked object text is rendered with hyperlink styling (for example, blue and/or underlined)
                - A contextual-link indicator icon is visible on/near the linked object
                - The styling/icon is present before hover or click (discoverable at rest)
    * Non-linked cell does not look like a hyperlink <P1>
        - Open the same grid with at least one attribute/metric that does not have a contextual link
            - Observe a non-linked cell
                - The non-linked object text is rendered with normal grid styling (not blue/underlined like a hyperlink)
                - No contextual-link indicator icon is shown for the non-linked object
    * Mixed linked and non-linked objects remain clearly distinguishable <P1>
        - Open a grid where linked and non-linked attributes/metrics are both visible
            - Compare a linked object cell and a non-linked object cell
                - Linked objects are visually distinguishable via hyperlink styling + indicator icon
                - Non-linked objects do not inherit hyperlink styling/icon
                - The difference remains clear at typical zoom levels used for dashboards (no ambiguity)

## Benchmark expectation coverage statement
- **Explicitly covered:** The scenario set above **separates contextual-link styling from ordinary element rendering** by including **positive** (linked) and **negative** (non-linked) styling assertions, plus a mixed-content comparison scenario.
- **Aligned to Phase 4a:** All coverage is expressed as **subcategory → scenario → atomic steps → verification leaves**, with **no canonical top-layer grouping**.

## Gaps / blockers (evidence-limited)
- The fixture evidence provided includes the styling intent and example images (not available as text detail here). It does **not** specify exact styling rules beyond “e.g., blue/underlined” and “indicator icon,” so the checks above remain **observable/behavioral** rather than pixel-perfect.