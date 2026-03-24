# Phase 4a (Subcategory-only) QA Draft — BCVE-6797 (Visualization)

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect (iOS)
    * Highlight activation via tap on a single heatmap cell <P1>
        - Open a dashboard containing a Heatmap visualization
            - Ensure the Heatmap renders with multiple visible cells
                - Tap one heatmap cell
                    - The tapped cell becomes visually highlighted (distinct from non-selected cells)
                    - The highlight is clearly attributable to that cell (no ambiguity which cell is selected)
                    - No unrelated UI elements are highlighted
    * Highlight activation via tapping an axis label (if supported by Heatmap UI) <P2>
        - Open a dashboard containing a Heatmap visualization with visible axis labels
            - Tap an X-axis label
                - The corresponding column cells reflect a highlight/selection state (per design)
            - Tap a Y-axis label
                - The corresponding row cells reflect a highlight/selection state (per design)
            <!-- If axis-label selection is not supported for Heatmap on iOS, record as explicit exclusion in later phases once evidence confirms -->

- Highlight persistence
    * Highlight persists while staying on the same dashboard view <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Wait 5–10 seconds without further interaction
                    - The highlight remains visible
                - Scroll the dashboard (vertical)
                    - The highlight remains on the same cell
                - Scroll the dashboard (horizontal, if dashboard supports)
                    - The highlight remains on the same cell
    * Highlight persists across minor layout changes (rotate device) <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Rotate device orientation (portrait → landscape)
                    - The heatmap re-renders
                    - The same cell remains highlighted OR the selection is cleared in a consistent, intentional way
                        - If cleared, the cleared state is visually obvious (no “stuck half-highlight”)
                - Rotate back (landscape → portrait)
                    - Behavior remains consistent with the first rotation
    * Highlight persists after interacting with other dashboard components (non-destructive) <P2>
        - Open a dashboard with a Heatmap and at least one other visualization
            - Tap a heatmap cell to highlight it
                - Tap on another visualization (without applying a filter, if possible)
                    - Heatmap highlight behavior is consistent with intended interaction model
                        - Either: highlight remains and heatmap is still in selected state
                        - Or: highlight is cleared predictably

- Highlight change and multi-selection behavior
    * Change highlight by selecting a different heatmap cell <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap one heatmap cell
                - Confirm it is highlighted
                    - Tap a different heatmap cell
                        - The newly tapped cell becomes highlighted
                        - The prior cell is no longer highlighted (single-selection model)
                        - No flicker/ghost highlight remains on the prior cell
    * Rapid repeated taps do not leave highlight in an inconsistent state <P2>
        - Open a dashboard containing a Heatmap visualization
            - Rapidly tap 3–5 different cells
                - At the end of the interaction burst
                    - Only the last-tapped cell is highlighted (if single-selection)
                    - UI remains responsive (no stuck transitions)

- Highlight reset / clearing behavior
    * Clear highlight by tapping empty space in the Heatmap canvas (if supported) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap an empty area within the Heatmap bounding box (not on a cell)
                    - The highlight clears (no cell remains highlighted)
                    - The visualization returns to the default non-highlighted state
            <!-- If “tap empty space to clear” is not supported, verify the product’s intended clear mechanism (e.g., second tap toggles off, or a clear-selection control) -->
    * Clear highlight by tapping the same cell again (toggle-off behavior, if supported) <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap the same heatmap cell again
                    - The highlight toggles off OR remains on (must be consistent with intended model)
                    - No visual artifacts remain (e.g., partial shading)
    * Clear highlight by leaving and returning to the dashboard (navigation reset) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Navigate away (e.g., back to Library or another dashboard)
                    - Return to the original dashboard
                        - The Heatmap highlight state matches intended persistence model
                            - Either: selection is reset to default (no highlight)
                            - Or: selection is restored deterministically
                        - No stale highlight appears on an incorrect cell

- Interaction side effects / correctness checks
    * Highlight does not unintentionally apply filters or change data unless designed to <P2>
        - Open a dashboard containing a Heatmap visualization
            - Observe baseline values/colors in several cells
                - Tap a cell to highlight it
                    - If highlight is purely visual
                        - No other visualizations change unexpectedly
                        - No filter chips / filter UI appears unexpectedly
                    - If highlight implies selection
                        - Any cross-highlighting or filtering is consistent and explainable
    * Highlight remains accurate after data refresh / re-render <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Trigger a refresh/re-render (e.g., pull to refresh or re-open the dashboard)
                    - Heatmap redraw completes
                    - The highlight is either cleared cleanly or restored correctly
                        - No highlight is shown on the wrong cell

<!-- Notes:
- This Phase 4a draft is intentionally subcategory-first and does not introduce canonical top-level groupings.
- Evidence available in this benchmark bundle indicates BCVE-6797 is linked to an iOS Heatmap highlight optimization (clone link to BCDA-8396).
- Exact intended behaviors (e.g., tap-empty-space to clear, toggle-on-same-cell, axis label selection) should be confirmed by primary feature evidence in earlier phases; for this benchmark we cover activation, persistence, and reset scenarios explicitly.
-->