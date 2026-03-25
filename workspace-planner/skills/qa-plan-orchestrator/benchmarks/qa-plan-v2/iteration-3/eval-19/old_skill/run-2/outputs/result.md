# Phase 4a — Subcategory Draft Focus Coverage Check (BCVE-6797)

Benchmark case: **VIZ-P4A-HEATMAP-HIGHLIGHT-001**  
Feature: **BCVE-6797** (visualization)  
Primary phase under test: **phase4a**  
Evidence mode: **blind_pre_defect**  
Focus required by benchmark: **Heatmap highlighting effect scenarios cover activation, persistence, and reset behavior**

## What Phase 4a must demonstrate (contract-aligned)
Per the Phase 4a contract, the Phase 4a output must be a **subcategory-only** QA draft that contains **scenarios** with **atomic nested steps** and **observable verification leaves**. For this benchmark, the Phase 4a scenario set must **explicitly cover heatmap highlight effect behavior** across:

- **Activation** (how highlight is triggered)
- **Persistence** (whether/how highlight remains across interactions)
- **Reset** (how highlight clears)

## Required Phase 4a scenario coverage (heatmap highlight effect)
Below is the minimum Phase 4a scenario set needed to satisfy the benchmark focus. This is written in the **Phase 4a subcategory-first style** (no canonical top-layer grouping), and each scenario includes **atomic action chains** and **observable verification leaves**.

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect
    * Highlight activates on single cell tap <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a single heatmap cell
                - The tapped cell enters a highlighted/selected visual state
                - Non-selected cells reflect the expected de-emphasis (if applicable)
                - No unexpected navigation or edit mode is triggered
    * Highlight activates on axis label tap (row/column selection) <P1>
        - Open a dashboard containing a Heatmap visualization with row/column labels
            - Tap a row label
                - All cells in the row reflect the highlight behavior expected for row selection
            - Tap a column label
                - All cells in the column reflect the highlight behavior expected for column selection
    * Highlight activation updates correctly when tapping a different cell <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell A
                - Cell A is highlighted
            - Tap a different heatmap cell B
                - Cell B becomes highlighted
                - Cell A is no longer highlighted (unless multi-select is supported)

- Heatmap highlight persistence
    * Highlight persists while interacting within the same visualization (non-destructive gestures) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell to highlight it
                - The cell is highlighted
            - Scroll the dashboard slightly (without leaving the page)
                - The same cell remains highlighted after the scroll settles
            - If the visualization supports pinch-to-zoom
                - Pinch to zoom in and then zoom out
                    - The highlight state remains consistent with the previously selected cell
    * Highlight persists when opening and closing an in-place tooltip/details panel (if present) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Open the tooltip/details for the selected cell (if shown on tap)
                - Tooltip/details matches the selected cell
            - Dismiss the tooltip/details
                - The previously selected cell remains highlighted
    * Highlight persistence across dashboard UI chrome changes (orientation / split view) <P2>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Change device orientation (portrait to landscape, or vice versa)
                - The highlight either persists on the same logical data point, or resets consistently per spec
                - No “stuck highlight” or mismatched highlight occurs

- Heatmap highlight reset behavior
    * Highlight resets by tapping on empty space (outside cell area) <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Tap an empty area within the visualization canvas (not on a cell)
                - The highlight clears
                - The visualization returns to the non-highlight baseline state
    * Highlight resets when navigating away and returning to the dashboard <P1>
        - Open a dashboard containing a Heatmap visualization
            - Tap a heatmap cell
                - The cell is highlighted
            - Navigate to a different dashboard/page
                - The heatmap is no longer visible
            - Navigate back to the original dashboard/page
                - The heatmap renders normally
                - No stale highlight is shown (unless persistence across navigation is explicitly supported)
    * Highlight resets when applying a filter that changes the heatmap data <P1>
        - Open a dashboard containing a Heatmap visualization and an interactive filter
            - Tap a heatmap cell
                - The cell is highlighted
            - Change the filter value so the heatmap data refreshes
                - The prior highlight is cleared or remapped deterministically to the same logical data point (per spec)
                - No highlight remains on an incorrect cell

## Benchmark expectation coverage statement
- **Activation**: covered via “single cell tap”, “axis label tap”, and “tap different cell updates highlight”.
- **Persistence**: covered via “scroll/zoom within visualization”, “tooltip open/close”, and “UI chrome/orientation change”.
- **Reset**: covered via “tap empty space”, “navigate away/back”, and “filter-driven data refresh”.

## Phase 4a alignment statement
This content is **phase4a-aligned** because it is:
- **subcategory-first** (no canonical top-layer categories)
- **scenario-focused**
- uses **atomic nested action steps** with **observable expected outcomes** as leaf nodes

---

# Short execution summary
Evaluated the benchmark’s required focus against the Phase 4a contract from the provided skill snapshot evidence, and produced a Phase 4a-style subcategory scenario set that explicitly covers heatmap highlight **activation**, **persistence**, and **reset** behaviors (as required by VIZ-P4A-HEATMAP-HIGHLIGHT-001).