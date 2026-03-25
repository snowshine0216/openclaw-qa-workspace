# Phase 4a (Subcategory-only) QA Plan Draft — BCED-4860

Feature QA Plan (BCED-4860)

- Donut chart — data labels per slice
    * Data label visibility (single slice)
        - Create a donut chart with 1 slice (single data point)
            - Enable “Data label for each slice”
                - Verify the single slice renders a data label
                - Verify the label is readable and not clipped by the chart bounds
    * Data label visibility (few slices)
        - Create a donut chart with 2–3 slices with distinct values
            - Enable “Data label for each slice”
                - Verify each slice renders its own data label
                - Verify labels correspond to the correct slice (no mismatched slice↔label mapping)
    * Label density handling (many slices)
        - Create a donut chart with many slices (e.g., 12–30 categories)
            - Enable “Data label for each slice”
                - Verify the system behavior is deterministic and acceptable under high label density
                - Verify labels do not fully obscure the donut visualization (center hole and slices remain visually interpretable)
    * Overlap-sensitive outcomes (crowded labels)
        - Create a donut chart where multiple adjacent slices are small (many thin slices next to each other)
            - Enable “Data label for each slice”
                - Verify how overlapping labels are handled (e.g., suppression, reposition, truncation, leader lines, or other product-defined behavior)
                - Verify no severe label collisions that make labels unreadable (overlap does not stack text into illegible blocks)
    * Mixed-size slices (big + tiny) overlap behavior
        - Create a donut chart with a few large slices and several very small slices
            - Enable “Data label for each slice”
                - Verify large-slice labels remain visible
                - Verify tiny-slice labels follow the same overlap rules (not randomly missing or flickering)
    * Label truncation / ellipsis under limited space
        - Create a donut chart with long category names and/or long label content
            - Enable “Data label for each slice”
                - Verify long labels truncate/ellipsis (or wrap) according to the product behavior
                - Verify truncation does not cause label overlap regressions beyond the intended handling rules
    * Label placement relative to slice (inside/outside)
        - Create a donut chart with default sizing
            - Enable “Data label for each slice”
                - Verify label placement is consistent across slices (no unexpected jumps between inside/outside for similar-sized slices)
                - Verify labels stay anchored to the correct slice during render
    * Responsive resize (overlap changes with size)
        - With a donut chart that has borderline-overlapping labels
            - Enable “Data label for each slice”
                - Resize the container smaller
                    - Verify the overlap-handling behavior updates correctly (e.g., more suppression/repositioning as space decreases)
                - Resize the container larger
                    - Verify previously suppressed/overlapped labels become visible when space allows (if product behavior supports this)
    * Zoom / scaling behavior (if supported in the embedding surface)
        - With a donut chart that has many slices
            - Enable “Data label for each slice”
                - Change zoom level / scaling
                    - Verify label visibility and overlap handling remain stable and predictable
                    - Verify labels do not detach from slices or misalign after scaling

<!-- Evidence note: This draft is based only on fixture evidence that BCED-4860 scope is “Support data label for each slice in Donut chart” (and its parent BCED-4814 summary). No additional UI/behavior specifics were provided in the blind pre-defect bundle; scenarios above explicitly target label visibility, density, and overlap-sensitive outcomes per benchmark focus. -->