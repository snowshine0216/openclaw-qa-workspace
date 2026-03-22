# VIZ-P4A-DONUT-LABELS-001

## Phase/Contract Verdict
- Primary phase alignment: `phase4a` confirmed (subcategory-first draft, no canonical top-layer grouping).
- Case focus coverage: explicitly covered for donut-chart data labels across visibility, density, and overlap-sensitive outcomes.
- Blind evidence policy status: `all_customer_issues_only` honored; fixture indicates no customer-signal issues were available, so this phase4a draft is scope-targeted and advisory.

## Phase4a Draft Artifact (XMindMark)
Feature QA Plan (BCED-4860)

- Donut Data Label Visibility
  * Labels render for slices when data labels are enabled <P1>
    - Open a dashboard containing a donut chart with at least three slices
      - Confirm data labels are enabled for the donut visualization
        - Render the visualization
          - A text label is visible for each eligible slice
          - Each visible label value matches its slice data value
  * Labels are not shown when data labels are disabled <P1>
    - Open a dashboard containing a donut chart with data labels currently enabled
      - Disable data labels in donut chart formatting
        - Apply the formatting change
          - No slice-level data labels are visible in the rendered donut chart
          - Slice colors and geometry remain visible after labels are hidden

- Donut Data Label Density
  * High slice count preserves readable label behavior under dense layout <P1>
    - Open a donut chart configured with many small slices (dense distribution)
      - Resize the chart to a constrained canvas area
        - Render the visualization
          - Labels that remain visible are legible and anchored to correct slices
          - Any omitted labels follow deterministic density behavior instead of random disappearance
  * Density behavior remains stable after data refresh <P2>
    - Open a donut chart with dense slice distribution and visible labels
      - Trigger a dataset refresh that keeps category set but changes values
        - Re-render the chart
          - Label visibility decisions remain consistent with post-refresh slice geometry
          - No stale labels remain from the pre-refresh render

- Donut Data Label Overlap-Sensitive Outcomes
  * Overlap resolution prevents unreadable collisions <P1>
    - Open a donut chart where adjacent small slices cause potential label collisions
      - Render the chart at normal dashboard zoom
        - Inspect neighboring label positions
          - Labels do not overlap in a way that makes text unreadable
          - When collision handling activates, the resulting visible/hidden state is consistent across repeated renders
  * Resize/reflow recalculates overlap-sensitive label placement <P2>
    - Open a donut chart with labels visible and potential near-collision cases
      - Resize the container from wide to narrow and then back to wide
        - Wait for chart reflow after each resize
          - Label placement updates to the new geometry after each reflow
          - No duplicated labels or orphaned connector placements remain after reflow

## Focus-to-Scenario Mapping
- Visibility: `Donut Data Label Visibility` scenarios.
- Density: `Donut Data Label Density` scenarios.
- Overlap-sensitive outcomes: `Donut Data Label Overlap-Sensitive Outcomes` scenarios.
