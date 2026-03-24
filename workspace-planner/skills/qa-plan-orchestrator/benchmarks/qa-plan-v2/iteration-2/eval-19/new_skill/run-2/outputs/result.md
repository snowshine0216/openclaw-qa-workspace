# Phase 4a (Subcategory-only) coverage check — VIZ-P4A-HEATMAP-HIGHLIGHT-001 (BCVE-6797)

## Benchmark intent
Validate that **Phase 4a** planning (subcategory-only draft layer) explicitly covers **heatmap highlighting effect** scenarios across:
- **Activation** (how highlight turns on)
- **Persistence** (how highlight behaves across subsequent interactions / time)
- **Reset** (how highlight turns off / clears)

Priority: **advisory** (phase contract alignment + explicit focus coverage).

## Evidence available (blind pre-defect)
From the fixture bundle for **BCVE-6797**:
- Linked feature exists specifically for heatmap highlight optimization:
  - **BCDA-8396** — “iOS mobile - Optimize the highlight effect for Visualizations - Heatmap”
- Also linked (adjacent context):
  - **BCIN-7329** — “iOS Mobile - Optimize the highlight effect for Visualizations Bar Chart”

No other behavior/acceptance details are provided in the benchmark evidence.

## What Phase 4a must produce (contract alignment)
Per `references/phase4a-contract.md`, Phase 4a output must be a **subcategory-only QA draft** (no canonical top-layer categories), with:
- central topic → subcategory → scenario → atomic action chain → observable verification leaves

## Heatmap highlighting scenarios that must appear in Phase 4a (explicit focus coverage)
Below is the minimum scenario set that demonstrates explicit coverage of the benchmark focus, written in **Phase 4a-appropriate subcategory/scenario form**.

Feature QA Plan (BCVE-6797)

- Heatmap highlight effect (iOS)
    * Highlight activation via single tap on a cell
        - Open a dashboard containing a Heatmap visualization
            - Tap a specific heatmap cell
                - The tapped cell becomes highlighted (visually distinct from non-selected cells)
                - Any highlight styling matches the intended “optimized highlight effect” behavior (per design/spec)
    * Highlight activation via tapping a different cell switches highlight target
        - With a heatmap visible
            - Tap cell A
                - Cell A is highlighted
            - Tap cell B
                - Cell B becomes highlighted
                - Cell A is no longer highlighted (or is de-emphasized) according to expected single-selection behavior

    * Highlight persistence when interacting outside the heatmap (no reset trigger)
        - Tap a heatmap cell to highlight it
            - Tap elsewhere on the dashboard canvas (not on another selectable mark)
                - The highlight remains (if expected)
                - No unexpected clearing occurs

    * Highlight persistence through scroll/resize/viewport changes
        - Tap a heatmap cell to highlight it
            - Scroll the dashboard (or the container) so the heatmap partially leaves the viewport
                - Return the heatmap fully into view
                    - The same cell remains highlighted (or clears) according to the intended persistence rules

    * Highlight reset by explicit clear action (tap blank area / deselect gesture)
        - Tap a heatmap cell to highlight it
            - Perform the supported clear interaction (e.g., tap a non-interactive blank area in the visualization)
                - No heatmap cells remain highlighted
                - The visualization returns to the default non-highlight state

    * Highlight reset when switching visualizations / navigating away
        - Tap a heatmap cell to highlight it
            - Navigate away (e.g., switch tab/page or open another dashboard)
                - Return to the original dashboard
                    - Highlight state is cleared (or restored) according to expected navigation persistence rules

    * Highlight reset when filters or selectors change the underlying heatmap data
        - Tap a heatmap cell to highlight it
            - Change a filter/selector that updates the heatmap data
                - Highlight state behaves correctly:
                    - If the previously-selected cell no longer exists, highlight clears
                    - If it still exists, highlight either persists on the same logical data point or resets per spec

<!-- Notes:
- The exact persistence/reset rules (keep vs clear) must be grounded in product/design evidence when available; in blind pre-defect mode, Phase 4a should still enumerate both persistence and reset scenarios explicitly so Phase 4b/5x can refine expected outcomes once evidence is attached.
- Keep this content under a heatmap-focused subcategory; do not use top-layer buckets like “EndToEnd” or “Compatibility” in Phase 4a.
-->

## Benchmark evaluation (against expectations)
- **[phase_contract][advisory] Focus explicitly covered:** **Yes,** if Phase 4a includes scenarios that explicitly address **activation**, **persistence**, and **reset** for the **heatmap highlight effect** (as above).
- **[phase_contract][advisory] Aligns with Phase 4a:** **Yes,** the scenarios are presented as **subcategory → scenario → atomic steps → observable leaves**, with no canonical top-layer grouping.

## Limits / open evidence gaps (allowed in blind pre-defect)
- The fixture evidence confirms **scope exists** (heatmap highlight optimization on iOS) but provides **no acceptance criteria** for the exact visual behavior (e.g., styling specifics, multi-select rules).
- Phase 4a can still satisfy this benchmark by **explicitly enumerating** activation/persistence/reset scenarios; later phases can tighten “expected” leaves once richer evidence is available.

---

## Execution summary
Produced a Phase 4a-aligned, subcategory-only scenario set for BCVE-6797 that explicitly covers heatmap highlight **activation**, **persistence**, and **reset**, using only the provided blind pre-defect fixture evidence (notably the linked heatmap highlight feature BCDA-8396).