# SELECTOR-P4A-CONFIRMATION-001

## Scope
- Feature: `BCDA-8653`
- Primary phase: `phase4a`
- Evidence mode: `blind_pre_defect`
- Blind policy applied: customer issues only (`all_customer_issues_only`), non-customer issues excluded

## Evidence-constrained phase4a draft (contract-aligned)
Feature QA Plan (BCDA-8653)

- Search Box Selector Confirmation and Pending-State Handling
    * OK confirms pending multi-selection <P1>
        - User stages multiple items in the selector dropdown while list loading/debounce is in progress
            - Open the selector dropdown
                - Select item A
                    - Select item B before debounce completion
                        - Click `OK`
                            - Dropdown closes only after explicit confirmation
                            - The staged selections are committed as the applied selection state
                            - No unexpected intermediate dismissal occurs before confirmation
    * Cancel discards pending multi-selection <P1>
        - User stages changes but cancels before commit
            - Open the selector dropdown with an existing baseline selection
                - Add or remove at least one item without clicking `OK`
                    - Click `Cancel`
                        - Dropdown closes through explicit cancel action
                        - Staged (pending) changes are discarded
                        - Baseline selection remains unchanged
    * Pending selection is protected from unexpected dismissal <P1>
        - Selection is still loading/debouncing in a long list
            - Open a long selector list
                - Stage a new selection and keep interaction within dropdown while pending state is active
                    - Wait through debounce/loading window without confirming
                        - Dropdown remains open during pending selection processing
                        - No auto-dismiss occurs while selection is still loading
                        - User can still choose `OK` or `Cancel` after pending state settles

<!-- Explicit exclusion due blind evidence limits: intentional outside-click/Esc dismissal commit semantics are not specified in provided customer issue text; only unexpected dismissal during pending selection is asserted. -->

## Phase4a contract confirmation
- Case focus explicitly covered: `OK or Cancel confirmation`, `pending selection`, `dismissal outcomes`.
- Structure remains phase4a-valid: subcategory-first scenarios with atomic action chains and observable leaves.
- Forbidden phase4a patterns avoided: no canonical top-layer categories (`Security`, `Compatibility`, `EndToEnd`, `i18n`), no compressed `A -> B -> C` bullets.
