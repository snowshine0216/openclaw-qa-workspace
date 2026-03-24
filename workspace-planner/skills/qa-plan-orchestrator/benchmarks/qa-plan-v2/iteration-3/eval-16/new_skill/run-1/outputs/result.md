# GRID-P4A-BANDING-001 — Phase 4a (Advisory) QA Plan Draft

Feature QA Plan (BCIN-7231)

- Banding — enablement & placement
    * Enable banding for rows (baseline parity)
        - Open a dashboard that contains a Modern Grid
            - Open the grid formatting / properties panel
                - Enable Row banding
                    - Alternating row backgrounds render across the full visible grid body
                    - The banding pattern is stable while scrolling vertically
    * Enable banding for columns
        - Open a dashboard that contains a Modern Grid
            - Open the grid formatting / properties panel
                - Enable Column banding
                    - Alternating column backgrounds render across the full visible grid body
                    - The banding pattern is stable while scrolling horizontally
    * Enable both row and column banding together
        - Open a dashboard that contains a Modern Grid
            - Enable Row banding
                - Enable Column banding
                    - Both banding dimensions are visually present (no dimension silently disabled)
                    - Banding does not obscure text readability in cells
    * Disable banding after it is enabled
        - Open a dashboard that contains a Modern Grid
            - Enable Row banding
                - Disable Row banding
                    - Row banding is removed and the grid returns to its non-banded background rendering

- Banding — styling variants (colors)
    * Format banding colors for rows
        - Open a dashboard that contains a Modern Grid
            - Enable Row banding
                - Set banding color A to a non-default color
                    - Set banding color B to a different non-default color
                        - Alternating rows render using the selected colors
                        - Color selections persist when closing and reopening the formatting panel
    * Format banding colors for columns
        - Open a dashboard that contains a Modern Grid
            - Enable Column banding
                - Set banding color A to a non-default color
                    - Set banding color B to a different non-default color
                        - Alternating columns render using the selected colors
                        - Color selections persist when closing and reopening the formatting panel
    * Reset banding colors to default
        - Open a dashboard that contains a Modern Grid
            - Enable Row banding
                - Change banding colors from default
                    - Use the UI control to reset banding colors
                        - Banding colors return to the default palette/values
                        - The grid rendering updates immediately to reflect the reset

- Banding — header-driven application
    * Apply banding color by row header
        - Open a dashboard that contains a Modern Grid
            - Enable Row banding
                - Apply banding color using the row header (header-driven banding)
                    - Banding color application follows the row header selection rules
                    - Row banding aligns with the row header boundaries (no off-by-one row shift)
    * Apply banding color by column header
        - Open a dashboard that contains a Modern Grid
            - Enable Column banding
                - Apply banding color using the column header (header-driven banding)
                    - Banding color application follows the column header selection rules
                    - Column banding aligns with the column header boundaries (no off-by-one column shift)

- Banding — interactions & rendering outcomes
    * Banding rendering does not break core grid interactions
        - Open a dashboard that contains a Modern Grid with banding enabled
            - Scroll vertically through multiple pages of rows
                - Scroll horizontally through multiple pages of columns
                    - Cell selection remains visible and understandable on top of banded backgrounds
                    - Banding remains consistent (no flicker, no random pattern changes)
    * Backward-compatible rendering outcome vs existing Modern Grid row-only banding behavior
        - Open a dashboard that previously used Modern Grid row banding
            - Verify the existing row banding renders as before after the feature is available
                - Existing row banding remains available without additional user changes
                - No unexpected color changes occur for previously-banded rows

<!-- Advisory notes:
- Evidence is limited to the Jira feature description; exact UI labels, persistence model (save/publish), and precedence rules (row+column overlap) are not specified in provided evidence.
- Scenarios are written to preserve the Phase 4a “subcategory-only” contract and the benchmark focus: styling variants, interactions, and backward-compatible rendering outcomes.
-->