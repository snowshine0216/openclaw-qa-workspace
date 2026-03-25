# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a (Advisory) Coverage Check

## Benchmark intent (what must be demonstrated in Phase 4a)
Modern grid **hyperlink-style** coverage must **separate**:
- **Contextual-link styling** (only for cells/objects that have contextual links)
- from **ordinary element rendering** (cells/objects without contextual links should not appear as hyperlinks).

This must appear as **Phase 4a subcategory-level scenarios** (no top-layer grouping), with **atomic action chains** and **observable verification leaves**.

## Evidence (blind pre-defect bundle)
From **BCIN-7547 Jira description** (fixture `BCIN-7547.issue.raw.json`):
- “Contextual links applied to attributes or metrics in grids should be clearly discoverable and intuitive to use.”
- “Objects with contextual links must be visually distinguishable (e.g., blue/underlined hyperlink styling with an indicator icon).”

## Phase 4a scenario coverage required (subcategory-first)
The Phase 4a draft for BCIN-7547 should include scenarios similar to the below (examples are written in Phase 4a style: subcategory → scenario → atomic steps → observable leaves).

Feature QA Plan (BCIN-7547)

- Modern Grid — Contextual link styling
    * Contextual-linked attribute cell is visually distinguishable (hyperlink styling) <P1>
        - Open a dashboard/report containing a grid with at least one attribute that has a contextual link
            - Locate a grid cell for the contextual-linked attribute
                - Observe the cell without interacting
                    - The cell text is styled as a hyperlink (e.g., blue and/or underlined)
                    - A contextual-link indicator icon is visible (per design)
                    - The styling is applied at the linked object/cell (not randomly to the row/column)

    * Contextual-linked metric cell is visually distinguishable (hyperlink styling) <P1>
        - Open a dashboard/report containing a grid with at least one metric that has a contextual link
            - Locate a grid cell for the contextual-linked metric
                - Observe the cell without interacting
                    - The cell text is styled as a hyperlink (e.g., blue and/or underlined)
                    - A contextual-link indicator icon is visible (per design)

- Modern Grid — Non-linked (ordinary) rendering
    * Non-linked attribute/metric cells do not appear as hyperlinks <P1>
        - Open the same grid where only some objects/cells have contextual links
            - Locate a grid cell for an attribute/metric that has no contextual link
                - Observe the cell without interacting
                    - The cell text is not styled like a hyperlink (no blue/underline styling reserved for links)
                    - No contextual-link indicator icon is shown for this cell
                    - Visual styling difference between linked vs non-linked cells is clear and consistent

- Modern Grid — Mixed presence (separation within same grid)
    * Linked and non-linked cells are distinguishable side-by-side <P1>
        - Open a grid that contains both contextual-linked and non-linked objects
            - Identify one linked cell and one non-linked cell in the same view
                - Compare their styling
                    - Only the linked cell has hyperlink styling
                    - Only the linked cell has the indicator icon
                    - Non-linked cell retains standard grid text styling

## Pass/Fail determination for this benchmark
**Expected for PASS (Phase 4a alignment):**
- The Phase 4a subcategory draft includes **explicit scenarios** for:
  1) **linked cells show hyperlink styling + icon**, and
  2) **non-linked cells do not show hyperlink styling/icon**,
  3) preferably a **mixed grid separation** scenario.
- Scenarios are **subcategory-first** (no top-level canonical categories).
- Steps are **atomic** and verifications are **observable leaves**.

**Result for this benchmark run (based on provided evidence only):**
- **Cannot fully verify PASS/FAIL** because the required Phase 4a output artifact (`drafts/qa_plan_phase4a_r<round>.md`) is **not provided in the benchmark evidence**, so we cannot confirm whether the orchestrator produced the required separated coverage.
- However, the **evidence clearly implies** the need for the separated coverage above, and the Phase 4a contract requires representing evidence-backed risks as scenarios.

**Advisory conclusion:** The orchestrator’s Phase 4a output **should** contain the separated “linked styling vs ordinary rendering” coverage shown above to satisfy GRID-P4A-HYPERLINK-STYLE-001.