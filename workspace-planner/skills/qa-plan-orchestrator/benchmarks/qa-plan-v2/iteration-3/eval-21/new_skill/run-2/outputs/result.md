# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a Contract Coverage Check (BCIN-7547)

## Benchmark focus (must be explicit)
Modern grid **hyperlink-style coverage**: scenarios must **separate contextual-link styling** (objects that have contextual links) from **ordinary element rendering** (objects without contextual links).

## Primary phase under test
**Phase 4a** (subcategory-only QA draft coverage intent).

## Evidence used (blind pre-defect)
From fixture bundle **BCIN-7547-blind-pre-defect-bundle**:
- **BCIN-7547.issue.raw.json** (Jira issue description)
  - Key requirement stated: “Objects with contextual links must be visually distinguishable (e.g., blue/underlined hyperlink styling with an indicator icon).”
- **BCIN-7547.customer-scope.json** (customer signal metadata; no extra functional requirements)

## Phase 4a-aligned subcategory scenarios (XMindMark-style outline)
Feature QA Plan (BCIN-7547)

- Grid: Contextual link styling vs ordinary rendering
    * Contextual-link cell is visually distinguishable from a normal cell <P1>
        - Open a report/document that contains a grid with at least:
            - One attribute/metric cell that has a contextual link
            - One comparable attribute/metric cell that does not have a contextual link
            - Observe the contextual-link cell styling
                - The value text uses hyperlink styling (e.g., blue and/or underlined)
                - A contextual-link indicator icon is shown with the value (if supported by design)
            - Observe the non-contextual-link cell styling
                - The value text does not use hyperlink styling
                - No contextual-link indicator icon is shown
            - Compare the two cells
                - The contextual-link cell is visually distinguishable from the normal cell

    * Contextual-link styling is applied only to the linked object, not the entire row/column <P2>
        - Open a grid where only a single cell (or a subset of cells) has contextual links
            - Observe cells in the same row and column that do not have contextual links
                - Non-linked cells keep ordinary rendering (no hyperlink styling / no link indicator)
                - Only the linked cell(s) show hyperlink styling / indicator

    * When multiple linked objects exist in the same grid, each linked object is independently distinguishable <P2>
        - Open a grid with multiple attribute/metric values that have contextual links
            - For each linked value
                - Verify hyperlink styling is present
                - Verify an indicator icon is present (if supported by design)
            - For nearby non-linked values
                - Verify ordinary rendering (no hyperlink styling / no link indicator)

    * Contextual-link indicator/icon presence aligns with link availability (no “false positive” icon) <P2>
        - Open a grid with a mix of linked and non-linked objects
            - Scan for the contextual-link indicator icon
                - The icon appears only on objects that have contextual links
                - The icon does not appear on objects without contextual links

<!-- Notes:
- This phase4a content is intentionally subcategory-first and avoids canonical top-layer categories.
- Styling specifics beyond the Jira examples (exact color, underline thickness, icon placement) require design/spec evidence; here we validate the discoverability intent from BCIN-7547 description.
-->

## Benchmark expectation mapping
- **[phase_contract][advisory] Focus explicitly covered**: Yes — scenarios explicitly compare **contextual-link styling** vs **ordinary rendering**, including “only linked objects get styling” and “no false positive icon”.
- **[phase_contract][advisory] Output aligns to Phase 4a**: Yes — subcategory-only, scenario-first, atomic nested steps, observable verification leaves; no canonical top-layer grouping.