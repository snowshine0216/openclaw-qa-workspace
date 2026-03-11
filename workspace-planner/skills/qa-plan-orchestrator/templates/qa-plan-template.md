Feature QA Plan (<FEATURE_ID>)

- EndToEnd
    - End-to-end Subcategory Name
        * Executable end-to-end scenario title <P1>
            - Start from a real user entry point
                - Perform one atomic user-visible action
                    - Perform the next atomic user-visible action
                        - Reach a visible completion outcome
                        - No unexpected fallback or broken state appears

- Core Functional Flows
    - Functional Subcategory Name
        * Executable functional scenario title <P1>
            - Perform one atomic user-visible action
                - Observe the next user-visible system response
                    - Confirm the expected functional outcome
        * Another executable functional scenario title <P2>
            - Perform one atomic user-visible action
                - Confirm the expected visible result

- Error Handling / Recovery
    - Error or Recovery Subcategory Name
        * Executable error-handling scenario title <P1>
            - Trigger the error or interruption condition
                - Observe the user-visible recovery behavior
                    - Confirm the user can dismiss, recover, retry, or safely exit as expected

- Regression / Known Risks
    - Regression Subcategory Name
        * Executable regression scenario title <P1>
            - Reproduce the historical or inferred risk path
                - Observe whether the known-bad behavior is absent
                    - Confirm the visible regression is fixed or explicitly documented

- Compatibility
    - Compatibility Subcategory Name
        * Executable compatibility scenario title <P2>
            - Run the flow on the target environment or platform combination
                - Confirm the same visible behavior holds

- Security
    - Security Subcategory Name
        * Executable security or privilege scenario title <P1>
            - Perform the action with the relevant role, privilege, or ACL setup
                - Confirm access is allowed or blocked as expected
                    - No privilege bypass or unexpected elevation occurs

- i18n
    - i18n Subcategory Name
        * Executable locale or string-surface scenario title <P2>
            - Run the flow in the target locale or language environment
                - Confirm the visible strings, date formats, or number formats appear as expected

- Accessibility
    - Accessibility Subcategory Name
        * Executable accessibility scenario title <P2>
            - Perform the interaction using the accessibility mode or input path under test
                - Confirm the visible focus, navigation, or assistive expectation holds

- Performance / Resilience
    - Performance Subcategory Name
        * Executable performance or resilience scenario title <P1>
            - Run the target flow under the comparison or stress condition
                - Confirm no obvious regression, stall, or unusable degradation appears

- Out of Scope / Assumptions
    - Scope Boundary Notes
        * Explicit out-of-scope or assumption scenario title <P2>
            - State the boundary or assumption clearly
                - Explain why it remains out of scope or assumption-bound for this plan

<!-- Validator-safe authoring rules:
1. Canonical top layers must be real top-level bullets.
2. Subcategory/grouping bullets must NOT carry <P1>/<P2> tags.
3. Only executable scenario bullets carry priority tags.
4. Do not use compressed arrow wording like A -> B -> C.
5. Do not use implementation-heavy wording in executable scenario titles when user-observable wording exists.
6. Prefer one executable scenario per unique trigger + risk + observable outcome combination.
7. If a prior stub is replaced by richer executable coverage, replace or explicitly supersede the stub; do not keep both as active executable content.
-->

<!-- Deduplication rules:
- Merge only when trigger, risk, and visible outcome are materially the same.
- Keep scenarios separate when the trigger, risk, or visible outcome differs in a meaningful way.
- Avoid using the same label as both a grouping node and a scenario node unless preservation logic truly requires it.
-->
