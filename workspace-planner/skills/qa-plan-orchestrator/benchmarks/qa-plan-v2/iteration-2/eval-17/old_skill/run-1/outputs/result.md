# Phase 4a (Subcategory-only) QA Draft — BCED-4860

Feature QA Plan (BCED-4860)

- Donut chart — data labels per slice
    * Render & basic visibility
        - Data label displays for each slice (baseline)
            - Create/open a dashboard with a Donut chart using a categorical attribute (multiple slices)
                - Enable data labels (or use default behavior for the feature)
                    - Load/render the visualization
                        - A data label is shown for every slice (no missing slices)
                        - Labels are visually associated with their corresponding slices
        - Data label visibility across slice count changes
            - Start with a Donut chart with a small number of slices (e.g., 3–5)
                - Verify labels are visible for each slice
                    - Increase the number of categories/slices (e.g., 10–20)
                        - Re-render the chart
                            - Labels remain present for each slice (coverage requirement)
                            - Label behavior changes (if any) is consistent and deterministic (no random missing labels)
        - Data label visibility when slices include very small values
            - Create a Donut chart with a mix of large and very small slice values (thin slices)
                - Render the chart with data labels enabled
                    - Observe labels for the smallest slices
                        - Label treatment for thin slices is consistent with the product’s overlap/density rules
                        - If a label is not shown due to density/overlap rules, there is a consistent alternative (e.g., hide, truncate, reposition) rather than partial/corrupted rendering

    * Density & overlap-sensitive outcomes
        - Overlap handling at high slice density (many slices)
            - Create a Donut chart with many categories (enough to crowd labels)
                - Enable data labels for slices
                    - Render the chart
                        - Labels do not overlap in an unreadable way OR the product applies a consistent hide/reposition strategy
                        - No severe label collisions that obscure other labels or chart content
        - Overlap handling with long label text
            - Create categories with long names (or long formatted labels)
                - Render the Donut chart with labels enabled
                    - Observe label placement and collisions
                        - Labels follow an overlap strategy (e.g., truncate, wrap, ellipsis, hide) consistently
                        - Long labels do not cause broken layout (e.g., labels drawn on top of each other without mitigation)
        - Mixed density: few large slices plus many tiny slices
            - Use a dataset where 2–3 slices are large and many slices are tiny
                - Render with data labels enabled
                    - Observe label behavior for both large and tiny slices
                        - Large-slice labels remain visible and readable
                        - Tiny-slice label behavior is consistent with density/overlap strategy
        - Dynamic resize: label layout responds to container size
            - Open a dashboard with a labeled Donut chart
                - Resize the visualization container to smaller and larger sizes
                    - Observe label behavior after each resize
                        - Label layout updates deterministically (reflow/reposition/hide as applicable)
                        - No stale labels left behind (no ghosting) and no labels detached from slices

    * Label-to-slice correctness
        - Label values match the slice’s measure value
            - Create a Donut chart with a known dataset (easy-to-verify values)
                - Enable labels to show value (or value + percent if available)
                    - Compare label text to underlying data
                        - Each slice label value matches the slice’s data
                        - Formatting is applied consistently across all slices
        - Label percent totals and rounding behavior (if percent is shown)
            - Configure labels to show percent (if supported)
                - Use values that produce rounding edge cases (e.g., 3 equal slices; many small slices)
                    - Validate percent labels
                        - Percent labels follow consistent rounding rules
                        - Total percent does not produce obviously inconsistent outcomes (e.g., severe drift) under rounding

    * Formatting & localization sensitivity (strings)
        - Number formatting in labels (thousands separators / decimals)
            - Use measure values that require separators and decimals
                - Render with labels enabled
                    - Verify formatting
                        - Thousands separators and decimals display as expected
                        - No clipping/truncation that makes numbers ambiguous
        - Locale-sensitive formatting (if locale can be changed)
            - Switch the environment/user locale (if supported by product)
                - Render the same Donut chart with labels enabled
                    - Verify label formatting
                        - Numeric formatting updates according to locale
                        - Label text remains readable and does not overlap more than expected due to locale differences

    * Stability / non-regression around label drawing
        - Re-render stability (no intermittent missing labels)
            - Open a dashboard containing a Donut chart with labels enabled
                - Refresh/re-render the visualization multiple times
                    - Observe label presence
                        - No intermittent disappearance of some slice labels across renders
                        - No intermittent overlap regressions across renders

<!-- Evidence note: This Phase 4a draft is written in blind_pre_defect mode using only the fixture bundle summary for BCED-4860 (story: “Support data label for each slice in Donut chart.”). It focuses explicitly on donut-chart data label coverage, distinguishing label visibility, density, and overlap-sensitive outcomes, without introducing Phase 4b canonical top-level categories. -->