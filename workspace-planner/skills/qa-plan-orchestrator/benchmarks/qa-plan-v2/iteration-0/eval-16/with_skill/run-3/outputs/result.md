# GRID-P4A-BANDING-001 — Phase4a Benchmark Result

## Scope And Verdict
- Case: `GRID-P4A-BANDING-001`
- Feature: `BCIN-7231` (`modern-grid`)
- Phase under test: `phase4a`
- Evidence mode: `blind_pre_defect` with `all_customer_issues_only`
- Verdict: `PASS (advisory)`

## Customer-Only Evidence Used
- `inputs/fixtures/BCIN-7231-blind-pre-defect-bundle/materials/BCIN-7231.customer-scope.json`
- `inputs/fixtures/BCIN-7231-blind-pre-defect-bundle/materials/BCIN-7231.issue.raw.json`

Evidence-extracted capability targets:
- Modern Grid currently supports row banding only.
- Requested enhancements: banding color formatting, column banding, and applying banding color by row/column header.
- Compatibility expectation: bring Report banding capabilities into Modern Grid dashboards without regressing existing behavior.

## Phase4a Artifact (Subcategory-Only Draft)
Feature QA Plan (BCIN-7231)

- Banding Styling Variants
    * Alternating row colors are configurable <P1>
        - Open a dashboard containing a Modern Grid visualization
            - Select the grid and open formatting options
                - Enable row banding
                    - Set custom banding colors for odd and even rows
                        - Grid rows render alternating colors using the selected palette
                        - Edited banding colors remain visible after saving and reopening the dashboard
    * Alternating column colors are configurable <P1>
        - Open a dashboard containing a Modern Grid visualization
            - Select the grid and open formatting options
                - Enable column banding
                    - Set custom banding colors for odd and even columns
                        - Grid columns render alternating colors using the selected palette
                        - Column banding configuration remains visible after saving and reopening the dashboard

- Banding Interaction Controls
    * Row-header driven banding color application works <P1>
        - Open a dashboard containing a Modern Grid with row headers visible
            - Select a row header banding color control
                - Apply a new banding color scheme
                    - Row-level banding updates immediately in the grid body
                        - Interaction does not alter non-banding cell formatting
    * Column-header driven banding color application works <P1>
        - Open a dashboard containing a Modern Grid with column headers visible
            - Select a column header banding color control
                - Apply a new banding color scheme
                    - Column-level banding updates immediately in the grid body
                        - Interaction does not alter non-banding cell formatting

- Backward-Compatible Rendering Outcomes
    * Existing row-banding dashboards preserve rendering after upgrade <P1>
        - Open a pre-existing dashboard created before enhanced banding support
            - Load a Modern Grid that already has row banding enabled
                - Compare rendered row-banding pattern before and after enabling new banding controls
                    - Original row-banding pattern remains unchanged unless user edits settings
                        - No rendering artifacts appear in cells, headers, or grid boundaries
    * Mixed capability fallback remains stable when only row banding is configured <P2>
        - Open a Modern Grid and configure only row banding
            - Leave column banding disabled
                - Interact with sorting and filtering on the same grid
                    - Row banding persists across interactions
                        - Grid remains readable with no unexpected column banding introduced

## Expectation Check
- `[phase_contract][advisory] Case focus explicitly covered`: `PASS`
- Styling variants covered: row color formatting and column color formatting.
- Interactions covered: row-header and column-header banding application behaviors.
- Backward-compatible rendering outcomes covered: legacy row-banding preservation and stable fallback behavior.

- `[phase_contract][advisory] Output aligns with primary phase phase4a`: `PASS`
- Uses subcategory-first structure with scenario -> atomic action chain -> observable leaves.
- Avoids canonical top-layer grouping (`Security`, `Compatibility`, `EndToEnd`, `i18n`).
- Keeps verification statements in leaf outcomes rather than mixing into action bullets.
