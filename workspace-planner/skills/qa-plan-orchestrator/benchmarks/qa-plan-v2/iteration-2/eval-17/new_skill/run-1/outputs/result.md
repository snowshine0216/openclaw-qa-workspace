# Phase 4a — Subcategory Draft Coverage (BCED-4860)

Feature QA Plan (BCED-4860)

- Donut chart — data labels per slice
    * Data label visibility — default
        - Create a dashboard with a Donut chart and 3 slices
            - Ensure data labels are enabled for the Donut chart
                - Observe each slice
                    - Each slice shows its own data label (one label per slice)
                    - No slice is missing a label when labels are enabled
    * Data label visibility — toggle off/on
        - Open the Donut chart formatting/properties
            - Turn data labels OFF
                - Observe the chart
                    - No slice shows a data label
            - Turn data labels ON
                - Observe the chart
                    - Each slice shows its data label again (one per slice)
    * Data label content — value/percentage/category permutations
        - Configure Donut chart labels to display category only
            - Observe each slice label
                - Each slice label reflects the slice category
        - Configure labels to display value only
            - Observe each slice label
                - Each slice label reflects the correct value for that slice
        - Configure labels to display percentage only
            - Observe each slice label
                - Each slice label reflects the correct percentage for that slice
        - Configure labels to display category + value
            - Observe each slice label
                - Each slice label includes both category and value for that slice
        <!-- If the product supports additional label fields (e.g., value+percent), add permutations accordingly -->

    * Overlap-sensitive outcome — dense slices (many segments)
        - Create a Donut chart with many slices (e.g., 20–50 categories)
            - Enable data labels
                - Observe label rendering
                    - Outcome is overlap-sensitive and must be explicitly characterized:
                        - Labels that are shown are readable (not stacked on top of each other)
                        - If the product hides/skips labels to prevent overlap, the behavior is consistent and deterministic (e.g., some labels omitted)
                        - The chart does not render labels in a way that makes them illegible due to uncontrolled overlap
    * Overlap-sensitive outcome — very small slices
        - Create a Donut chart where several slices are very small (e.g., long tail distribution)
            - Enable data labels
                - Observe small-slice labeling
                    - Outcome is overlap-sensitive and must be explicitly characterized:
                        - If a small slice’s label is hidden/omitted to avoid overlap, it is omitted (not partially drawn or clipped unpredictably)
                        - If shown, the label is legible and clearly associated with the slice
    * Overlap-sensitive outcome — responsive resize
        - With a Donut chart that has many slices and labels enabled
            - Reduce the visual/container width gradually
                - Observe label behavior at multiple sizes
                    - Outcome is overlap-sensitive and must be explicitly characterized:
                        - Label visibility adjusts predictably as space decreases (e.g., some labels hide, or layout adjusts)
                        - No severe label collision that makes the chart unusable
            - Increase the visual/container width again
                - Observe label behavior
                    - Labels that were hidden due to space constraints reappear when space is sufficient (if product behavior is to hide on overlap)
    * Overlap-sensitive outcome — long label text
        - Use category names that are very long
            - Enable data labels
                - Observe label rendering
                    - Outcome is overlap-sensitive and must be explicitly characterized:
                        - Long labels do not overlap in a way that makes multiple labels unreadable
                        - If truncation/ellipsis/wrapping is applied, it is consistent across slices
                        - Labels are not cut off mid-glyph or rendered outside the chart in an unreadable way

    * Label density boundary — threshold characterization
        - Prepare multiple Donut charts with increasing slice count (e.g., 5, 10, 20, 30, 50)
            - Enable data labels on each
                - Compare outcomes
                    - The system exhibits a consistent density/overlap management strategy (e.g., hides some labels after a threshold)
                    - There is no regression where mid-density charts show worse overlap than higher-density charts (non-monotonic behavior)

    * Persistence — save/reopen
        - Enable data labels on a Donut chart
            - Save the dashboard/document
                - Reopen it
                    - Data labels setting persists
                    - Labels still render per-slice according to the saved configuration

    * Cross-check — export/print (if supported for dashboards)
        - With labels enabled on a Donut chart
            - Export/print the dashboard
                - Review the exported output
                    - Each slice label rendering follows the same visibility/overlap strategy as on-screen (no missing-all-labels regression)

<!-- Notes:
- This Phase 4a draft stays subcategory-first (no top-level canonical groupings).
- Focus explicitly includes: label visibility (on/off/default), density (slice count thresholds), and overlap-sensitive outcomes (many slices, small slices, resize, long text).
- Evidence bundle provided does not include product UI specifics (exact toggles/options); scenarios are written to be adapted to the actual property names.
-->