# Phase 4a (Subcategory-only) QA draft coverage — BCVE-6797 (Visualization)

## Benchmark case
- Case: **VIZ-P4A-HEATMAP-HIGHLIGHT-001**
- Feature: **BCVE-6797**
- Feature family: **visualization**
- Primary phase under test: **phase4a**
- Evidence mode: **blind_pre_defect**
- Focus: **heatmap highlighting effect** scenarios covering **activation, persistence, reset** behavior
- Priority: **advisory**

## Phase 4a alignment (contract check)
Phase 4a requires a **subcategory-only** draft structure:
- central topic → subcategory → scenario → atomic action chain → observable verification leaves
- **must not** use canonical top-layer categories (e.g., Security/Compatibility/EndToEnd)

This benchmark artifact provides a **Phase 4a-style subcategory scenario set** (not Phase 4b grouping) focused on heatmap highlight behavior.

---

# Feature QA Plan (BCVE-6797)

- Heatmap highlight effect (iOS)
    * Tap a single heatmap cell activates highlight styling
        - Open a dashboard containing a Heatmap visualization
            - Ensure the heatmap is fully rendered
                - Tap a specific cell
                    - The tapped cell becomes visually highlighted (selected state is clearly distinguishable)
                    - Non-selected cells reflect the expected de-emphasis (if designed)
                    - No unexpected navigation or drill is triggered

    * Tap a different cell moves highlight to the new cell (activation transfers)
        - Open a dashboard containing a Heatmap visualization
            - Tap cell A
                - Tap cell B
                    - Cell B is highlighted
                    - Cell A is no longer highlighted
                    - Only one cell is highlighted when single-select behavior is expected

    * Tap the currently highlighted cell again resets highlight (toggle off)
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Tap the same cell again
                    - The highlight state is cleared (no cell remains highlighted)
                    - The heatmap returns to the default (non-highlight) appearance

    * Tap outside the visualization clears highlight (reset on outside interaction)
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Tap an empty area outside the heatmap (e.g., dashboard canvas)
                    - The highlight state is cleared
                    - The heatmap returns to its default appearance

    * Scroll within the dashboard does not unintentionally clear highlight (persistence)
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Scroll the dashboard content (vertical scroll)
                    - The same cell remains highlighted after scrolling completes
                    - No additional cells become highlighted

    * Switch to another app and return; highlight persists (app background/foreground)
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Send the app to background
                    - Return to the app
                        - The heatmap remains rendered correctly
                        - The previously selected cell remains highlighted (or clears if the expected design is to reset; behavior is consistent with spec)

    * Rotate device; highlight behavior is correct after layout change (persistence vs reset is consistent)
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Rotate device orientation
                    - The heatmap reflows correctly without rendering artifacts
                    - The highlight state is preserved on the corresponding cell, or cleared if the expected design is to reset
                    - The resulting behavior is consistent across repeated rotations

    * Apply a filter that causes heatmap data to refresh; highlight resets appropriately
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Apply a filter or prompt answer that refreshes the heatmap data
                    - The highlight state is cleared if the selected cell is no longer valid after refresh
                    - No stale highlight remains on an unrelated cell
                    - The post-refresh heatmap shows correct default styling

    * Data refresh that keeps the same cell still present; highlight persistence is correct
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Trigger a refresh that does not change the heatmap dimensionality (e.g., refresh data)
                    - The highlighted cell remains highlighted if the same cell identity is still present
                    - The highlight is not duplicated across multiple cells

    * Navigate away and back to the dashboard; highlight resets (or persists) consistently
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Navigate to another dashboard/page
                    - Navigate back to the heatmap dashboard/page
                        - The heatmap renders correctly
                        - The highlight state matches expected behavior (reset by default, unless specified to persist)

    * Open/close an overlay (e.g., tooltip/details panel) does not break highlight (persistence)
        - Open a dashboard containing a Heatmap visualization
            - Tap a cell to highlight it
                - Open the associated details/tooltip (if supported)
                    - Close the overlay
                        - The originally highlighted cell remains highlighted (unless overlay-close is defined to reset)
                        - The heatmap has no leftover dimming/overlay artifacts

    * Rapid taps across multiple cells produce stable highlight state (activation robustness)
        - Open a dashboard containing a Heatmap visualization
            - Rapidly tap multiple different cells
                - Stop tapping
                    - Exactly one final cell is highlighted (if single-select)
                    - The UI does not enter a mixed/partially-highlighted state
                    - No crash or visible rendering glitch occurs

---

## Benchmark verdict (phase4a advisory)
- **Case focus covered:** Yes — scenarios explicitly cover **activation** (tap-to-highlight, transfer), **persistence** (scroll/background/rotation/overlay), and **reset** (tap-again, tap-outside, refresh/navigation).
- **Phase alignment:** Yes — content is structured as **Phase 4a subcategory-only** scenarios without Phase 4b canonical top-layer grouping.