# GRID-P4A-BANDING-001 — Phase 4a (Advisory) QA Plan Draft

Feature QA Plan (BCIN-7231)

- Banding — feature parity & rendering outcomes
    * Row banding — enable/disable parity (baseline)
        - Open a dashboard that contains a Modern Grid
            - Ensure the grid has multiple visible rows (enough to observe alternating patterns)
                - Open grid formatting for banding
                    - Enable Row banding
                        - Alternating row background styling becomes visible across the grid body
                        - The banding pattern is consistent from first visible row onward
                    - Disable Row banding
                        - Alternating row background styling is removed
                        - Grid background returns to the non-banded baseline
    * Row banding — color formatting (new capability)
        - Open a dashboard that contains a Modern Grid
            - Open grid formatting for banding
                - Enable Row banding
                    - Set Row banding color A to a clearly distinguishable color (e.g., light gray)
                        - Row banding color A is applied to the intended alternating rows
                    - Set Row banding color B to a different distinguishable color (e.g., white)
                        - Row banding color B is applied to the complementary alternating rows
                    - Change Row banding color A to a new color
                        - Only the rows using color A update to the new color
                        - Rows using color B remain unchanged
                    - Change Row banding color B to a new color
                        - Only the rows using color B update to the new color
                        - Rows using color A remain unchanged
    * Column banding — enable/disable (new capability)
        - Open a dashboard that contains a Modern Grid with multiple visible columns
            - Open grid formatting for banding
                - Enable Column banding
                    - Alternating column background styling becomes visible across the grid body
                    - The banding pattern is consistent from first visible column onward
                - Disable Column banding
                    - Alternating column background styling is removed
                    - Grid background returns to the non-banded baseline
    * Column banding — color formatting (styling variants)
        - Open a dashboard that contains a Modern Grid with multiple visible columns
            - Open grid formatting for banding
                - Enable Column banding
                    - Set Column banding color A to a clearly distinguishable color
                        - Column banding color A is applied to the intended alternating columns
                    - Set Column banding color B to a different distinguishable color
                        - Column banding color B is applied to the complementary alternating columns
                    - Swap the values of Column banding color A and color B
                        - The visual banding colors swap accordingly
                        - The alternation cadence remains unchanged
    * Banding application mode — apply by row header (new capability)
        - Open a dashboard that contains a Modern Grid where a row header is visible
            - Open grid formatting for banding
                - Enable Row banding
                    - Select banding application mode “by row header”
                        - The row header’s grouping/identity is used as the banding application basis
                        - Rows associated with the same row header grouping follow the expected banding color assignment
    * Banding application mode — apply by column header (new capability)
        - Open a dashboard that contains a Modern Grid where a column header is visible
            - Open grid formatting for banding
                - Enable Column banding
                    - Select banding application mode “by column header”
                        - The column header’s grouping/identity is used as the banding application basis
                        - Columns associated with the same column header grouping follow the expected banding color assignment

- Banding — interactions (modern grid behavior)
    * Banding + scrolling (rendering stability)
        - Open a dashboard that contains a Modern Grid with enough rows to scroll
            - Enable Row banding with two distinct colors
                - Scroll vertically through the grid
                    - Banding remains aligned to the correct rows while scrolling
                    - No flicker, temporary color inversion, or “lost banding” occurs during scroll
                - Scroll back to the original position
                    - Banding presentation matches what was shown before scrolling
    * Banding + horizontal scroll (column banding stability)
        - Open a dashboard that contains a Modern Grid with enough columns to scroll horizontally
            - Enable Column banding with two distinct colors
                - Scroll horizontally through the grid
                    - Banding remains aligned to the correct columns while scrolling
                    - No flicker, temporary color inversion, or “lost banding” occurs during scroll
                - Scroll back to the original position
                    - Banding presentation matches what was shown before scrolling
    * Banding + resize columns (layout change)
        - Open a dashboard that contains a Modern Grid with multiple visible columns
            - Enable Column banding
                - Resize a column to be wider
                    - Banding backgrounds repaint correctly for all visible columns
                    - No column banding offset/shift is introduced
                - Resize a column to be narrower
                    - Banding backgrounds repaint correctly for all visible columns
                    - No column banding offset/shift is introduced
    * Banding + sort (data order change)
        - Open a dashboard that contains a Modern Grid with sortable columns
            - Enable Row banding
                - Sort by a column (ascending)
                    - Banding alternation recomputes against the new row order
                    - Visual alternation remains consistent with the displayed row sequence
                - Sort the same column (descending)
                    - Banding alternation recomputes against the new row order
                    - Visual alternation remains consistent with the displayed row sequence
    * Banding + pivot / layout toggle (if available)
        - Open a dashboard that contains a Modern Grid with a layout change control (e.g., pivot, swap axes, or similar)
            - Enable both Row banding and Column banding
                - Trigger the layout change
                    - Banding remains enabled after layout change
                    - Row/column banding applies to the correct axis after the change
                    - Banding colors remain as configured

- Banding — backward-compatible rendering outcomes
    * Legacy Report parity check — row banding functional equivalence (advisory)
        - Open a legacy Report (or a known baseline rendering) that uses row banding
            - Capture the intended banding behavior (on/off, alternation cadence)
                - Open the same dataset/content in a dashboard Modern Grid
                    - Enable the equivalent Row banding configuration
                        - Modern Grid row banding outcome matches the legacy baseline in alternation cadence
                        - No unexpected differences are observed in which rows receive which banding color
    * Legacy Report parity check — column banding functional equivalence (advisory)
        - Open a legacy Report (or a known baseline rendering) that uses column banding
            - Capture the intended banding behavior (on/off, alternation cadence)
                - Open the same dataset/content in a dashboard Modern Grid
                    - Enable the equivalent Column banding configuration
                        - Modern Grid column banding outcome matches the legacy baseline in alternation cadence
                        - No unexpected differences are observed in which columns receive which banding color
    * Parity under header-based application modes (row/column)
        - Open a legacy Report (or a known baseline rendering) that applies banding by header
            - Capture the intended header-based banding outcome
                - Open the same dataset/content in a dashboard Modern Grid
                    - Configure banding to apply by the same header basis
                        - Modern Grid banding outcome matches the legacy baseline for header-based application
                        - No unexpected shifts occur when header groupings are expanded/collapsed (if applicable)

<!-- Notes (evidence constraints): This Phase 4a draft is based only on the provided Jira feature description excerpt in BCIN-7231.issue.raw.json (blind pre-defect bundle). No additional product doc / UI labels / screenshots were provided in the fixture evidence, so scenario steps reference generic “grid formatting for banding” entry points. -->