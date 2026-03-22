# GRID-P4A-BANDING-001 — Phase4a Contract Artifact

Feature QA Plan (BCIN-7231)

- Row Banding Style Variants
    * Row banding preset changes are visually distinguishable <P1>
        - Open a dashboard containing a Modern Grid with row banding enabled
            - Open the banding formatting controls for row banding
                - Select a different banding color preset
                    - Apply the formatting change
                        - Banded rows repaint with the selected preset
                        - Adjacent non-banded rows remain visually distinct from banded rows
    * Row banding custom color edits persist after re-open <P1>
        - Open the same Modern Grid in edit mode
            - Configure row banding with a custom color value
                - Save the dashboard
                    - Reopen the dashboard
                        - The custom row banding color matches the last saved value
                        - No fallback to default row banding color is visible

- Column Banding Style Variants
    * Column banding can be enabled without disabling row banding <P1>
        - Open a Modern Grid that already has row banding enabled
            - Enable column banding
                - Apply and refresh the view
                    - Column banding is visible after refresh
                    - Row banding remains enabled and visible after column banding is turned on
    * Column banding palette updates are reflected in rendered cells <P2>
        - Open the column banding style editor
            - Change column banding colors
                - Confirm the style update
                    - Banded columns reflect the new palette
                    - Non-banded columns do not inherit the banding color

- Header-Driven Banding Application
    * Applying banding color by row header scopes to row-oriented bands <P1>
        - Open banding options for header-based application
            - Choose apply by row header
                - Select a visible row header group
                    - Confirm the update
                        - Banding color changes under the selected row header scope
                        - Unselected row header groups keep their prior banding color
    * Applying banding color by column header scopes to column-oriented bands <P1>
        - Open banding options for header-based application
            - Choose apply by column header
                - Select a visible column header group
                    - Confirm the update
                        - Banding color changes under the selected column header scope
                        - Other column header groups keep their prior banding color

- Banding Interaction Behavior
    * Switching row and column banding settings in one session keeps latest selection state <P1>
        - Enable row banding and set a non-default color
            - Enable column banding and set a different non-default color
                - Re-open the banding panel in the same session
                    - Latest row banding color selection is shown in controls
                    - Latest column banding color selection is shown in controls
    * Repeated enable and disable actions do not produce stale visual artifacts <P2>
        - Enable column banding
            - Disable column banding
                - Enable column banding again with a new color
                    - Grid does not show stale color remnants from the disabled state
                    - Final visible banding matches the last enabled color selection

- Backward-Compatible Rendering Outcomes
    * Legacy row banding behavior remains intact when new banding capabilities are used <P1>
        - Open a grid that previously used row-only banding behavior
            - Enable new banding controls and apply updates
                - Render the dashboard
                    - Row readability pattern remains consistent with prior row-only behavior
                    - New controls do not break existing row banding visibility
    * Mixed banding configurations render consistently after save and reopen <P1>
        - Configure both row banding and column banding with distinct colors
            - Save and close the dashboard
                - Reopen and render the same dashboard
                    - Rendered banding distribution matches the saved mixed configuration
                    - No unexpected reversion to row-only rendering is visible

<!-- Evidence scope: customer-only blind bundle from BCIN-7231.issue.raw.json and BCIN-7231.customer-scope.json (all_customer_issues_only, exclude non-customer issues). -->
<!-- Phase alignment: phase4a subcategory-only structure preserved; no canonical top-layer grouping introduced. -->

## Benchmark Expectation Check

- [phase_contract][advisory] Case focus is explicitly covered: PASS
- [phase_contract][advisory] Output aligns with primary phase phase4a: PASS
