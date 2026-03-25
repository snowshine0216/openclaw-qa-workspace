# Phase 4a — Subcategory Draft (BCVE-6797)

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect (iOS)
    * Tap cell activates highlight styling
        - Open an iOS dashboard containing a Heatmap visualization
            - Tap a single heatmap cell
                - Tapped cell becomes visually highlighted (new highlight effect)
                - Non-selected cells remain non-highlighted (no unintended highlight)
    * Tap different cell moves highlight to the new cell
        - Open an iOS dashboard containing a Heatmap visualization
            - Tap heatmap cell A
                - Cell A is highlighted
            - Tap heatmap cell B
                - Cell B becomes highlighted
                - Cell A is no longer highlighted
    * Highlight persists after scrolling the dashboard (persistence)
        - Open an iOS dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Scroll the dashboard so the heatmap moves partially off-screen
                - No highlight flicker or unexpected reset occurs while scrolling
            - Scroll back so the same heatmap cell is visible again
                - The previously selected cell is still highlighted
    * Highlight persists when switching away and back within the app (persistence)
        - Open an iOS dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Navigate away from the dashboard (e.g., back to a list / another tab)
                - No crash or UI corruption occurs during navigation
            - Return to the same dashboard
                - The previously selected cell remains highlighted
    * Reset highlight by tapping outside the heatmap (reset)
        - Open an iOS dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Tap an empty area of the dashboard outside the heatmap visualization
                - No heatmap cell remains highlighted
    * Reset highlight when the visualization is refreshed/reloaded (reset)
        - Open an iOS dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Trigger a visualization reload/refresh (e.g., pull-to-refresh / re-open the dashboard)
                - The heatmap renders without a stale highlight selection
    * Reset highlight when the underlying data changes (reset)
        - Open an iOS dashboard containing a Heatmap visualization with a filter
            - Tap a heatmap cell
                - The cell is highlighted
            - Change a filter that materially changes heatmap cells (e.g., different time range)
                - Highlight does not remain on an incorrect/stale cell
                - Heatmap shows either no highlight or a correctly re-mapped highlight consistent with product rules

<!-- Notes (advisory): This Phase 4a draft intentionally stays subcategory-first and focuses on the requested highlight effect behaviors: activation, persistence, and reset. Canonical grouping (e.g., EndToEnd/Compatibility) is deferred to Phase 4b per contract. -->