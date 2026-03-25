# Phase 4a subcategory-only QA draft (BCVE-6797) — Heatmap highlight effect

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect (iOS Mobile) <!-- linked clone indicates heatmap highlight optimization scope -->
    * Activation — highlight appears when selecting a heatmap cell <P1>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Ensure the Heatmap is fully rendered
                - Tap a single heatmap cell
                    - The tapped cell is highlighted
                    - Non-selected cells reflect the expected de-emphasis (if designed) while the selected cell remains visually distinct
                    - No unexpected layout shift occurs in the visualization container
    * Activation — highlight appears when selecting via long-press (if supported) <P2>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Ensure the Heatmap is fully rendered
                - Long-press a single heatmap cell
                    - The target cell becomes highlighted
                    - The highlight state matches the standard tap-selection highlight styling
    * Activation — change selection updates highlight to the new cell <P1>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a first heatmap cell
                - Confirm the first cell is highlighted
                    - Tap a different heatmap cell
                        - The highlight moves to the second cell
                        - The first cell is no longer highlighted
    * Activation — multi-tap rapid switching does not leave stale highlights <P2>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Rapidly tap different heatmap cells in succession
                - Only the most recently selected cell is highlighted
                - No “ghost” highlight artifacts remain on previously tapped cells

- Heatmap highlight persistence (iOS Mobile)
    * Persistence — highlight persists while staying on the same dashboard <P1>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a heatmap cell
                - Navigate within the same dashboard (e.g., scroll the page)
                    - The previously selected cell remains highlighted when it is visible again
    * Persistence — highlight persists after switching between visualizations on the same page <P2>
        - Open an iOS dashboard that contains both a Heatmap and at least one other visualization
            - Tap a heatmap cell
                - Tap/select an element in another visualization
                    - Return focus to the Heatmap
                        - Heatmap highlight state behaves as designed (either persists or is replaced)
                        - Behavior is consistent across repeated attempts
    * Persistence — highlight remains correct after device rotation <P2>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a heatmap cell
                - Rotate the device (portrait → landscape or landscape → portrait)
                    - The selected cell remains highlighted (or resets) per design
                    - If persisted, the highlight maps to the same data point (not merely the same screen coordinate)
    * Persistence — highlight remains correct after background/foreground app cycle <P2>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a heatmap cell
                - Send the app to background
                    - Bring the app back to foreground
                        - The highlight state behaves as designed (persists or resets)
                        - No visual corruption of highlight styling occurs

- Heatmap highlight reset behavior (iOS Mobile)
    * Reset — tapping outside the heatmap clears highlight (if supported) <P1>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a heatmap cell
                - Tap on a non-interactive area outside the Heatmap visualization
                    - The heatmap highlight is cleared (if the product supports “tap outside to clear”)
                    - No other visualization becomes unintentionally selected
    * Reset — navigating away and back resets highlight to default state <P1>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a heatmap cell
                - Navigate away from the dashboard (e.g., go back to a list or another dashboard)
                    - Return to the original dashboard
                        - The Heatmap shows the default (no selection) state unless the app explicitly restores prior selection
                        - No previously selected cell remains highlighted unexpectedly
    * Reset — data refresh resets highlight (if selection is not meant to persist across refresh) <P1>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a heatmap cell
                - Trigger a data refresh (e.g., pull-to-refresh or explicit refresh action)
                    - The highlight state behaves as designed on refresh (cleared or restored)
                    - If restored, it restores the same logical data point selection
    * Reset — switching to a different dataset/filter clears or updates highlight appropriately <P2>
        - Open an iOS dashboard that contains a Heatmap visualization and supports changing filters/controls
            - Tap a heatmap cell
                - Change a filter/control that changes the Heatmap data
                    - The highlight is cleared if the selected data point no longer exists
                    - If the selected data point still exists, highlight updates to match the post-filter state consistently

- Heatmap highlight visual correctness (iOS Mobile)
    * Visual — highlight is visible across heatmap color ranges <P2>
        - Open an iOS dashboard that contains a Heatmap visualization with varied cell colors (light/dark extremes)
            - Tap cells in both light and dark regions
                - Highlight remains clearly distinguishable on all tested colors
                - Highlight does not reduce legibility of cell label/value beyond acceptable design
    * Visual — highlight does not clip at cell boundaries or chart edges <P2>
        - Open an iOS dashboard that contains a Heatmap visualization
            - Tap a cell near the edge of the Heatmap
                - Highlight is not clipped by the visualization bounds
                - Adjacent gridlines/borders remain visually consistent

<!-- Note: Evidence bundle provided only indicates linked scope (heatmap highlight optimization) but not detailed UX specs; scenarios above focus on activation, persistence, and reset behaviors as required by the benchmark focus. -->