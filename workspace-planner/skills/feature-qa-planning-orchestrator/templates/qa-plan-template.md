Feature QA Plan (<FEATURE_ID>)

- EndToEnd
    * Primary user journey <P1>
        - Setup: user is in <REQUIRED_STATE> and meets the required prerequisites
        - Action: open the feature from <ENTRY_POINT> and complete the main workflow until <EXPECTED_COMPLETION_POINT>
            - Expected: the user reaches <EXPECTED_OUTCOME> and the resulting state, output, or notification is visible in <TARGET_LOCATION>
        - Verification note: confirm logs or backend evidence only when user-visible confirmation is insufficient
- Core Functional Flows
    * Capability family <P1/P2/P3>
        - Setup: required data or role is available
        - Action: perform <USER_VISIBLE_ACTION> on <TARGET_OBJECT>
            - Expected: <OBSERVABLE_RESULT>
- Error Handling / Recovery
    * Recoverable failure path <P1/P2/P3>
        - Setup: system is in a state where <FAILURE_TRIGGER> can occur
        - Action: perform <REPRO_ACTION> and trigger <FAILURE_TRIGGER>
            - Expected: the product shows <ERROR_STATE> and recovery path <RECOVERY_RESULT>
        - Comment: trigger still unclear after one-shot research; next action <FOLLOW_UP_ACTION> if needed
- Regression / Known Risks
    * Risk-backed regression case <P1/P2/P3>
        - Setup: risk source <RISK_SOURCE_ID> applies
        - Action: repeat the workflow that previously regressed
            - Expected: the known-risk behavior no longer reproduces
- Permissions / Security / Data Safety
    * Permission or data-safety case <P1/P2/P3>
        - Setup: user has role <ROLE_STATE>
        - Action: attempt <PROTECTED_ACTION>
            - Expected: permission, restriction, or data-safety rule is enforced visibly
- Compatibility / Platform / Environment
    * Platform or environment case <P2/P3>
        - Setup: environment is <PLATFORM_OR_ENV>
        - Action: run the feature workflow in that environment
            - Expected: behavior stays correct for the supported environment
- Observability / Performance / UX Feedback
    * Observability or feedback case <P2/P3>
        - Setup: monitoring or visible feedback can be observed
        - Action: complete <WORKFLOW_STEP>
            - Expected: the user-visible feedback, timing, or observability signal is present
- Out of Scope / Assumptions
    * Explicit omission
        - Reason: <WHY_NOT_APPLICABLE>
        - Evidence: <SOURCE_OR_USER_CONFIRMATION>
