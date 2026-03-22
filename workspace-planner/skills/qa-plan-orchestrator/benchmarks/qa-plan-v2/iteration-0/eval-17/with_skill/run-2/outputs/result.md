# Benchmark Result: VIZ-P4A-DONUT-LABELS-001

## Scope
- Feature: `BCED-4860`
- Feature family: `visualization`
- Evidence mode: `blind_pre_defect` (`all_customer_issues_only`, exclude non-customer issues)
- Primary phase under test: `phase4a`
- Case focus: donut-chart data label coverage distinguishes label visibility, density, and overlap-sensitive outcomes.

## Evidence Used (customer-scope bundle only)
- `inputs/fixtures/BCED-4860-blind-pre-defect-bundle/materials/BCED-4860.issue.raw.json`
- `inputs/fixtures/BCED-4860-blind-pre-defect-bundle/materials/BCED-4860.customer-scope.json`
- `inputs/fixtures/BCED-4860-blind-pre-defect-bundle/materials/BCED-4860.parent-feature.summary.json`

## Phase 4a Compliance Verdict
- Expectation: case focus explicitly covered.
  - Verdict: **PASS** (coverage below includes explicit visibility, density, and overlap-sensitive scenarios for donut data labels).
- Expectation: output aligns with primary phase `phase4a`.
  - Verdict: **PASS** (output is subcategory-first draft structure with atomic action chains and observable leaves; no canonical top-layer categories).

## Phase 4a Artifact (contract-aligned draft)
Feature QA Plan (BCED-4860)

- Donut Slice Label Visibility <P1>
    * Single-slice label renders when data labels are enabled
        - Open a dashboard or dossier containing a donut chart with data labels enabled
            - Ensure at least one slice has a non-zero value
                - Load the visualization
                    - A label is visible for the non-zero slice
                    - The label text is legible and associated with the slice
    * Label hide behavior is deterministic when data labels are disabled
        - Open the same donut chart configuration
            - Disable data labels in chart formatting
                - Refresh or re-render the chart
                    - No slice label is rendered
                    - Slice geometry remains visible without label artifacts

- Donut Label Density Behavior <P1>
    * Multiple eligible slices keep labels without collapsing into unreadable output
        - Open a donut chart with many non-zero slices and data labels enabled
            - Load the visualization at default size
                - Observe label rendering across slices
                    - Labels remain distinguishable per slice
                    - Rendering avoids fully merged or indecipherable label text
    * Density change response stays stable after resizing
        - Open the same donut chart
            - Reduce container size to increase label crowding
                - Expand container size back to baseline
                    - Label rendering updates after each size change
                    - Labels do not remain stuck in an incorrect crowded state

- Donut Label Overlap-Sensitive Outcomes <P1>
    * Overlap pressure does not produce misleading label-to-slice mapping
        - Open a donut chart where adjacent slices create tight label spacing
            - Load and inspect slice labels near crowded regions
                - Compare each label position against adjacent slice boundaries
                    - Each visible label maps to the intended slice
                    - No visible label appears attached to the wrong slice
    * Overlap handling remains stable after data update
        - Open a donut chart with live or refreshed data causing slice proportion changes
            - Trigger data refresh or parameter change
                - Re-evaluate crowded label regions
                    - Label placement updates with the new geometry
                    - Prior overlap artifacts are not retained after refresh

<!-- Traceability: derived from BCED-4860 story and parent-feature requirement for per-slice donut labels; blind mode constrained to bundled customer-scope materials only. -->

## Contract Notes
- `phase4a` structure enforced: central topic -> subcategory -> scenario -> atomic action chain -> observable verification leaves.
- Forbidden phase4a structures avoided: no `Security`/`Compatibility`/`EndToEnd`/`i18n` top categories; no compressed `A -> B -> C` action bullets; no mixed action/verification lines.
- This artifact is intentionally phase4a-only and does not apply phase4b canonical grouping.
