# Phase 4a deliverable (advisory) — BCVE-6797 (Visualization)

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect
    * Activation — tap a heatmap cell highlights the intended cell
        - Open a dashboard containing a Heatmap visualization
            - Ensure the Heatmap is fully rendered
                - Tap a single heatmap cell once
                    - The tapped cell becomes highlighted (visible highlight effect)
                    - Only the intended cell is highlighted (no adjacent/incorrect cell highlight)
    * Activation — tap a different cell moves highlight to the new cell
        - Open a dashboard containing a Heatmap visualization
            - Tap a first heatmap cell
                - Tap a different heatmap cell
                    - The highlight moves to the second tapped cell
                    - The first cell is no longer highlighted
    * Activation — repeated tap on the same cell does not create multiple highlight layers
        - Open a dashboard containing a Heatmap visualization
            - Tap the same heatmap cell multiple times
                - The highlight appearance remains stable (no cumulative/stacked highlight artifacts)
                - The cell remains the single highlighted target

- Heatmap highlight persistence
    * Persistence — highlight persists after non-destructive interactions within the visualization
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Perform a benign interaction that should not change selection (e.g., scroll the dashboard slightly and stop)
                    - The previously highlighted cell remains highlighted
                    - No unexpected highlight reset occurs
    * Persistence — highlight persists when navigating away and back within the same dashboard context (if applicable)
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Switch focus away from the Heatmap (e.g., tap an empty area of the dashboard)
                    - Return focus to the Heatmap (do not tap a new cell)
                        - The original cell highlight remains visible
                        - No additional cells become highlighted

- Heatmap highlight reset behavior
    * Reset — tapping outside the heatmap clears highlight (if designed to dismiss)
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap outside the Heatmap visualization (on the dashboard background)
                    - The heatmap highlight clears
                    - No cell remains highlighted
    * Reset — changing selection by tapping a different cell clears the previous highlight
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Tap a different heatmap cell
                    - The previously highlighted cell is cleared
                    - Only the newly tapped cell is highlighted
    * Reset — refresh/re-render clears highlight
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - Trigger a content refresh that causes a re-render (e.g., pull-to-refresh or other supported refresh action)
                    - After re-render completes, the prior highlight is cleared
                    - The Heatmap displays with no residual highlight artifacts

<!-- Notes (blind pre-defect):
- Evidence bundle indicates the parent feature BCVE-6797 has linked work including “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap” (BCDA-8396). No detailed acceptance criteria for highlight rules were provided in the fixture; scenarios above focus on the requested activation/persistence/reset behaviors and are meant to be refined once UI spec/source evidence is available.
-->