# Benchmark Result: VIZ-P4A-DONUT-LABELS-001

## Scope
- Feature: `BCED-4860`
- Feature family: `visualization`
- Primary phase under test: `phase4a`
- Evidence mode: `blind_pre_defect`
- Blind policy applied: customer issues only (`all_customer_issues_only`), non-customer excluded

## Evidence Basis (Local Fixture Only)
- `inputs/fixtures/BCED-4860-blind-pre-defect-bundle/materials/BCED-4860.customer-scope.json`
- `inputs/fixtures/BCED-4860-blind-pre-defect-bundle/materials/BCED-4860.issue.raw.json`
- `inputs/fixtures/BCED-4860-blind-pre-defect-bundle/materials/BCED-4860.parent-feature.summary.json`

## Phase4a Contract Artifact (Subcategory-Only Draft)

Feature QA Plan (BCED-4860)

- Donut Label Visibility
    * Per-slice labels are visible when data labels are enabled <P1>
        - Open an Auto Dashboard containing a Donut chart
            - Load data with multiple category slices
                - Enable Data Labels for the Donut chart
                    - Apply the chart configuration
                        - Label text is rendered on or near each visible slice
                        - Visible label count matches visible slice count

- Donut Label Density
    * High-slice-count datasets keep labels interpretable under dense layout <P1>
        - Open a Donut chart with a high number of slices
            - Enable Data Labels
                - Resize chart area to a compact panel
                    - Refresh chart rendering
                        - Labels do not collapse into unreadable overdrawn text
                        - Any reduced-label behavior is visually consistent across repeated refreshes

- Donut Label Overlap-Sensitive Outcomes
    * Overlap-sensitive layout applies stable avoidance behavior <P1>
        - Open a Donut chart where adjacent slices have narrow angular space
            - Enable Data Labels
                - Trigger rerender (resize or filter change)
                    - Observe final label placement
                        - Overlapping labels are avoided through a consistent visible strategy (offset, suppression, or reposition)
                        - Label placement remains stable for the same data state after rerender

## Expectation Check
1. `[phase_contract][advisory] Case focus is explicitly covered: donut-chart data label coverage distinguishes label visibility, density, and overlap-sensitive outcomes`  
   Status: **PASS** (explicit subcategories and scenarios for visibility, density, and overlap-sensitive outcomes are present).
2. `[phase_contract][advisory] Output aligns with primary phase phase4a`  
   Status: **PASS** (artifact is subcategory-first with scenario/action/outcome nesting and no canonical top-layer grouping).

## Benchmark Verdict
- Advisory assessment: **satisfies the phase4a case focus and contract alignment**.
