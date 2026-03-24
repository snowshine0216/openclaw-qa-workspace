# Benchmark Result — VIZ-P4A-HEATMAP-HIGHLIGHT-001 (BCVE-6797)

## Verdict (phase contract: advisory)
**Covered, but only at a minimal/evidence-light level given blind pre-defect constraints.**

This benchmark’s focus (“heatmap highlighting effect scenarios cover activation, persistence, and reset behavior”) can be satisfied in **Phase 4a** output by drafting **subcategory-only** scenarios that explicitly test:
- **Activation** of highlight
- **Persistence** of highlight across common interactions
- **Reset/clearing** highlight

Given the provided fixture evidence, we can anchor the heatmap scope to the linked feature **BCDA-8396: “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap”** (linked from BCVE-6797). The fixture does not provide deeper behavior specs, so the Phase 4a plan must remain generic but explicit about the three required behaviors.

## Primary phase alignment: Phase 4a
Phase 4a requires a **subcategory-only draft** (no canonical top categories like “EndToEnd”, “Compatibility”, etc.) with:
- Central topic
- Subcategory
- Scenarios
- Atomic action chains
- Observable verification leaves

The benchmark focus is appropriately expressed as **Heatmap → Highlighting** scenarios.

## What Phase 4a draft must include to satisfy this benchmark
Below is the **minimum scenario set** that demonstrates the benchmark focus under Phase 4a structure rules.

Feature QA Plan (BCVE-6797)

- Heatmap — Highlight effect (iOS)
    * Activate highlight by selecting a heatmap cell
        - Open a dashboard containing a Heatmap visualization
            - Tap a specific heatmap cell
                - The tapped cell enters the highlighted state (visually distinct)
                - Non-selected cells reflect the de-emphasized state (if designed)
                - Any related tooltip/selection affordance appears (if applicable)

    * Activate highlight by selecting a heatmap row/column header (if supported)
        - Open a dashboard containing a Heatmap visualization
            - Tap a row header (or label) in the heatmap
                - The corresponding row becomes highlighted
                - Highlight styling is consistent with cell selection highlight styling

    * Highlight persistence: remains highlighted when interacting outside the heatmap
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap on blank canvas area outside the visualization (not a “clear selection” control)
                    - The highlight remains (no unintended reset)

    * Highlight persistence: switching between visualizations does not corrupt highlight state
        - Open a dashboard with Heatmap and at least one other visualization
            - Tap a heatmap cell to highlight it
                - Tap another visualization (without issuing a “clear selection”)
                    - Heatmap highlight state remains correct when returning focus to the heatmap
                    - No unexpected additional highlights appear

    * Reset highlight: clear selection via explicit clear action
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Use the product’s explicit “clear selection” interaction (e.g., clear button / deselect gesture)
                    - Highlight is removed
                    - All cells return to the normal (non-highlighted) appearance

    * Reset highlight: selecting a different cell updates highlight correctly (no multi-stuck highlight)
        - Open a dashboard containing a Heatmap visualization
            - Tap cell A
                - Cell A is highlighted
                - Tap cell B
                    - Cell B becomes highlighted
                    - Cell A is no longer highlighted (unless multi-select is supported)

    * Reset highlight on data/viewport change (guard against stale highlight)
        - Open a dashboard containing a Heatmap visualization with enough data to scroll or paginate
            - Tap a heatmap cell to highlight it
                - Scroll the visualization (or change viewport) so the selected cell is no longer visible
                    - No orphaned highlight artifacts remain on unrelated cells
                    - Returning to the original position shows expected highlight state (either preserved correctly or cleared consistently per design)

<!-- Note: The above scenarios intentionally focus on activation / persistence / reset and avoid canonical top-layer grouping per Phase 4a contract. Additional evidence would refine which interactions exist on iOS (tap-to-select, clear gesture, header selection, multi-select behavior). -->

## Evidence mapping (from provided fixtures only)
- Heatmap highlighting is in scope due to linked feature:
  - **BCDA-8396** — “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap” (linked from BCVE-6797)
- Visualization family context:
  - BCVE-6797 labels include **Library_and_Dashboards** (suggests dashboard visualization context)

## Benchmark expectations check
- **[phase_contract][advisory] Focus explicitly covered**: Yes — activation, persistence, reset each have dedicated scenarios.
- **[phase_contract][advisory] Output aligns with phase4a**: Yes — subcategory-only (“Heatmap — Highlight effect”), atomic steps, observable leaves, no canonical top categories.

---

# Execution summary
- Produced a Phase 4a-aligned scenario set that explicitly covers heatmap highlight **activation**, **persistence**, and **reset** behaviors.
- Used only fixture evidence to justify heatmap highlight scope via BCVE-6797 clone link to **BCDA-8396**.