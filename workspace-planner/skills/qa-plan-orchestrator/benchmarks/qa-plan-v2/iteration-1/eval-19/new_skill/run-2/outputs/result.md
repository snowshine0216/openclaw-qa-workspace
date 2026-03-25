# Phase 4a — Subcategory-only QA draft (advisory)

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect (iOS)
    * Activate highlight on tap of a single heatmap cell <P1>
        - Open a dashboard containing a Heatmap visualization
            - Wait for the visualization to finish rendering
                - Tap a single heatmap cell
                    - The tapped cell becomes visually highlighted
                    - Non-selected cells show the intended de-emphasis (if part of the design)
                    - No unintended navigation or drill action occurs
    * Activate highlight by tapping axis label / legend entry (if supported) <P2>
        - Open a dashboard containing a Heatmap visualization with axis labels and/or legend
            - Tap an axis label or legend item associated with one or more cells
                - The corresponding cell(s) become visually highlighted
                - Highlighting matches the expected selection mapping (1-to-1 or 1-to-many)
    * Highlight persistence while interacting with the page (no reset on scroll) <P1>
        - Open a dashboard containing a Heatmap visualization in a scrollable container
            - Tap a heatmap cell to highlight it
                - Scroll the dashboard/page content (without forcing a full reload)
                    - The previously selected cell remains highlighted when it is visible again
                    - No additional cells become highlighted unintentionally
    * Highlight persistence after device rotation (orientation change) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Rotate the device (portrait → landscape, or landscape → portrait)
                    - The visualization re-lays out correctly
                    - The same cell (same data point) remains highlighted after rotation
                    - Highlight styling is not distorted (no misaligned overlay, wrong cell bounds)
    * Highlight persistence after background/foreground app cycle <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Send the app to background
                    - Return the app to foreground
                        - The dashboard is still usable
                        - The highlight state is preserved if the view is not fully reloaded
                        - If the view is reloaded by the app lifecycle, the highlight is cleared deterministically (no stale highlight on wrong cell)
    * Reset highlight by tapping outside the heatmap (blank area) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap outside the heatmap plot area (e.g., empty canvas/background within the visualization frame)
                    - The highlight is cleared
                    - All cells return to the default (non-highlighted) state
    * Reset highlight by tapping the same cell again (toggle behavior) <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap the same cell again
                    - The highlight toggles off (if toggle-off is intended)
                    - No second, stacked highlight effect remains
    * Reset highlight when selecting a different cell (single-selection replacement) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap one heatmap cell to highlight it
                - Tap a different heatmap cell
                    - The newly tapped cell becomes highlighted
                    - The previously highlighted cell is no longer highlighted
    * Reset highlight on data refresh / re-render (deterministic state) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Trigger a re-render (e.g., change a prompt/filter, pull-to-refresh if supported, or otherwise refresh the visualization)
                    - The highlight state follows the intended rule:
                        - Either highlight is cleared after refresh
                        - Or the same data point is re-highlighted after refresh
                    - No highlight appears on an incorrect cell after the refresh
    * Reset highlight when navigating away and back to the dashboard <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Navigate away to another screen/dashboard
                    - Navigate back to the original dashboard
                        - The highlight is reset (or preserved) according to intended navigation caching
                        - No stale highlight remains on the wrong cell

<!-- Notes (advisory):
- This Phase 4a draft intentionally stays subcategory-first (no top-layer groupings like EndToEnd/Compatibility).
- Focus explicitly covers highlight activation, persistence, and reset behaviors for Heatmap, per benchmark case focus.
- Evidence bundle indicates linkage to “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap” (BCDA-8396) but does not include detailed UX specs; scenarios are written as contract-style behavioral checks.
-->