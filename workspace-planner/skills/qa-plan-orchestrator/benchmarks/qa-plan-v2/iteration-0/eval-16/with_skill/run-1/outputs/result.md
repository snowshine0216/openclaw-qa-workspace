# GRID-P4A-BANDING-001

## Phase Contract Assessment (phase4a)
- [satisfied] Case focus explicitly covered: scenarios below distinguish styling variants, interactions, and backward-compatible rendering outcomes for modern grid banding.
- [satisfied] Output aligns with primary phase `phase4a`: subcategory-first draft structure with scenario-level priorities, atomic nested actions, and observable verification leaves; no canonical top-layer grouping.

Feature QA Plan (BCIN-7231)

- Banding Style Variants
    * Row banding color customization applies to data rows only <P1>
        - Open a dashboard that contains a Modern Grid visualization
            - Open grid formatting options
                - Enable row banding
                    - Set odd-row color to Color A and even-row color to Color B
                        - Apply the formatting changes
                            - Alternating row colors render using Color A/Color B in the data region
                            - Grid readability increases without changing row values or row order
    * Column banding can be enabled and rendered independently from row banding <P1>
        - Open a dashboard that contains a Modern Grid visualization
            - Open grid formatting options
                - Enable column banding while row banding is disabled
                    - Apply column banding colors
                        - Apply the formatting changes
                            - Alternating column colors render in the data region
                            - Column banding remains visible after grid refresh

- Header-Scoped Banding Application
    * Banding color can be applied by row header selection and reflected in matching row regions <P1>
        - Open a dashboard that contains a Modern Grid with row headers
            - Open banding configuration
                - Select row-header-based banding target
                    - Assign a banding color set
                        - Apply the formatting changes
                            - Rows mapped to the selected row header target render with the assigned banding colors
                            - Non-targeted row regions keep their prior styling
    * Banding color can be applied by column header selection and reflected in matching column regions <P1>
        - Open a dashboard that contains a Modern Grid with column headers
            - Open banding configuration
                - Select column-header-based banding target
                    - Assign a banding color set
                        - Apply the formatting changes
                            - Columns mapped to the selected column header target render with the assigned banding colors
                            - Non-targeted column regions keep their prior styling

- Banding Interaction and State Transitions
    * Switching between row and column banding modes preserves explicit user color selections <P2>
        - Open a dashboard that contains a Modern Grid visualization
            - Configure row banding with custom colors
                - Switch to column banding and configure a different color pair
                    - Toggle row banding back on
                        - Reopen banding settings
                            - Previously configured row colors are preserved
                            - Previously configured column colors are preserved
    * Banding settings remain stable through common grid interactions <P2>
        - Open a dashboard that contains a Modern Grid with banding enabled
            - Perform grid interactions such as sorting and filtering
                - Trigger a dashboard refresh
                    - Recheck grid rendering
                        - Banding remains applied after sort and filter operations
                        - Banding remains applied after refresh without visual corruption

- Backward-Compatible Rendering Outcomes
    * Report banding intent renders equivalently when viewed in Modern Grid dashboards <P1>
        - Open a Report with known banding configuration in a dashboard using Modern Grid
            - Load the same dataset and layout as the source Report
                - Compare rendered banding behavior in dashboard Modern Grid against expected report intent
                    - Verify row/column banding presence and header-scoped application points
                        - Modern Grid rendering preserves the expected banding intent from Report behavior
                        - No loss of banding capability is observed for row color, column banding, or header-scoped application

<!-- Evidence basis (blind pre-defect, customer-only):
BCIN-7231 issue snapshot states current modern-grid limits: row-only banding, no color formatting, no column banding, no row/column-header banding color application, and requires parity with Report banding capabilities.
Customer policy source: BCIN-7231.customer-scope.json (all_customer_issues_only).
-->
