# GRID-P4A-HYPERLINK-STYLE-001 — Phase 4a (BCIN-7547)

Feature QA Plan (BCIN-7547)

- Hyperlink-style (contextual link discoverability)
    * Contextual-link styling is visually distinct from ordinary cell text <P1>
        - Open a dashboard/report that contains a grid with attributes/metrics
            - Identify a baseline cell that has **no** contextual link
                - Observe the baseline cell text styling (color/underline/icon)
            - Identify a cell that **has** a contextual link
                - Observe the contextual-link styling
                    - The linked object is visually distinguishable from ordinary cell text (e.g., blue and/or underlined)
                    - An indicator icon is present (if supported) to signal a contextual link
                    - The styling difference is discoverable without hover/click
    * Mixed cells: only linked objects get hyperlink styling (no “style bleed”) <P1>
        - Open a grid where some attributes/metrics have contextual links and others do not
            - Compare multiple cells in the same column and row region
                - Verify non-linked cells retain normal styling
                - Verify linked cells consistently show hyperlink styling
                - Verify there is no unintended styling on adjacent non-linked cells
    * Same cell, different objects: only the object(s) with contextual links are styled <P1>
        - Open a grid cell that contains multiple displayed objects (e.g., combined label/value, or multiple values in a cell if supported)
            - Ensure only the object(s) configured with contextual links shows hyperlink styling
                - Non-linked object text in the same cell remains ordinary styling
                - The visual indicator (underline/color/icon) maps to the correct object

- Contextual link interaction (basic)
    * Clicking a linked object is possible and feels like a link <P1>
        - In a grid cell with contextual-link styling
            - Move the pointer over the linked object
                - Cursor changes to a link-appropriate cursor (e.g., pointer) if applicable
            - Click the linked object
                - The contextual-link action/menu is invoked (e.g., opens link/menu as designed)
    * Clicking ordinary (non-linked) cell content does not invoke link behavior <P1>
        - In the same grid, choose a cell with no contextual link
            - Click the cell text
                - No contextual-link action/menu is invoked
                - The interaction remains normal cell interaction (selection/focus) as designed

<!-- Evidence note: Jira BCIN-7547 description specifies that contextual links applied to attributes or metrics in grids must be visually distinguishable (e.g., blue/underlined hyperlink styling with an indicator icon) and be clearly discoverable/intuitive. This Phase 4a draft focuses on subcategory-level scenarios to separate contextual-link styling from ordinary element rendering without introducing canonical top-layer grouping. -->