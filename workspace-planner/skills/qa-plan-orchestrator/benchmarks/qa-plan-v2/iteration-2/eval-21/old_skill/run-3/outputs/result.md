# Benchmark Result — GRID-P4A-HYPERLINK-STYLE-001 (BCIN-7547)

## Primary phase under test
- **phase4a** (Phase 4a subcategory-only QA draft)

## Case focus (must be explicitly covered)
**Modern grid hyperlink-style coverage separates contextual-link styling from ordinary element rendering.**

## Evidence available (blind pre-defect)
From fixture **BCIN-7547.issue.raw.json** (Jira description text):
- “**Contextual links applied to attributes or metrics in grids** should be clearly discoverable and intuitive to use.”
- “Objects with contextual links must be **visually distinguishable** (e.g., **blue/underlined hyperlink styling** with an **indicator icon**).”

## Phase 4a-aligned coverage (subcategory-first; no top-layer categories)
Below are **Phase 4a subcategory scenarios** that explicitly separate:
1) **contextual-link styling** (blue/underline + indicator icon) from
2) **ordinary grid element rendering** (non-linked cells must not inherit hyperlink styling).

Feature QA Plan (BCIN-7547)

- Modern Grid — Contextual link discoverability & styling
    * Linked attribute cell renders hyperlink styling (blue + underline) <P1>
        - Open a dashboard containing a modern grid with an **attribute** that has a contextual link
            - Locate a row where the attribute cell is expected to be link-enabled
                - Observe the attribute cell text styling
                    - The cell text is visually distinguishable as a hyperlink (blue and underlined)
                    - A contextual-link indicator icon is visible for the linked cell
    * Linked metric cell renders hyperlink styling (blue + underline) <P1>
        - Open a dashboard containing a modern grid with a **metric** that has a contextual link
            - Locate a row where the metric cell is expected to be link-enabled
                - Observe the metric cell text styling
                    - The cell text is visually distinguishable as a hyperlink (blue and underlined)
                    - A contextual-link indicator icon is visible for the linked cell
    * Non-linked attribute cells do not look like hyperlinks (separation from ordinary rendering) <P1>
        - Open the same grid where some attribute cells have contextual links and other attribute cells do not
            - Select a **non-linked** attribute cell in the same column (or comparable column)
                - Observe the non-linked cell text styling
                    - The non-linked cell is not blue and not underlined
                    - No contextual-link indicator icon is shown for the non-linked cell
    * Non-linked metric cells do not look like hyperlinks (separation from ordinary rendering) <P1>
        - Open the same grid where some metric cells have contextual links and other metric cells do not
            - Select a **non-linked** metric cell
                - Observe the non-linked cell text styling
                    - The non-linked cell is not blue and not underlined
                    - No contextual-link indicator icon is shown for the non-linked cell
    * Mixed-content row: only linked objects get hyperlink styling (no “row-level” styling bleed) <P1>
        - Open a grid row that contains at least one linked cell and at least one non-linked cell
            - Observe styling across cells within the same row
                - Only the linked cell(s) show blue/underlined styling
                - Non-linked cells keep standard grid text styling
    * Visual affordance remains discoverable at typical scan level (intuitive to use) <P2>
        - Open the grid at a typical dashboard viewing size
            - Without selecting any cell, scan for linked objects
                - Linked objects are discoverable due to hyperlink styling
                - The indicator icon helps distinguish linked objects from ordinary cells

## Contract check (phase4a)
- **Subcategory-first:** Yes (no canonical top-layer buckets like “Security/Compatibility/E2E/i18n”).
- **Atomic steps:** Yes (no compressed “A -> B -> C”).
- **Verification leaves:** Yes (observable styling/icon outcomes are leaves).
- **Case focus explicitly addressed:** Yes (explicit scenarios for linked vs non-linked styling; prevents styling bleed into ordinary rendering).

## Benchmark verdict (advisory)
- **Meets expectations for phase_contract/phase4a** for the stated focus, given the available blind pre-defect evidence.