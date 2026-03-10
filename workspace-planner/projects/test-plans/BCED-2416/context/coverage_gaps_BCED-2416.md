# Coverage Gaps — BCED-2416

## Visible assumptions / unresolved items

1. **Traceability mismatch**
   - The provided Confluence page is keyed to `BCIN-7289`, not `BCED-2416`.
   - Current working assumption: it is valid upstream design context for the same embedded parity architecture.
   - Impact: final stakeholder review should confirm whether this page is the intended design source for the QA plan.

2. **Incomplete non-functional requirements**
   - Confluence leaves detailed accessibility, telemetry, error taxonomy, automation commitments, and explicit performance acceptance thresholds incomplete.
   - Impact: plan can cover these as risk-based checks, but not as strict pass/fail against a formal acceptance target.

3. **Deployment matrix breadth**
   - Design template marks many deployment types in scope, but collected evidence does not define how deep environment coverage should go for this run.
   - Impact: QA plan should emphasize compatibility smoke coverage rather than exhaustive per-deployment deep testing unless requested.

4. **Local mode retirement timeline interpretation**
   - Jira states legacy local mode remains until a retirement window; exact expectation by release/version may still need confirmation.
   - Impact: local mode should be treated as a compatibility boundary, not assumed parity target.

5. **Platform-specific desktop differences**
   - Background research highlights Windows vs Mac shell differences as a likely risk, but explicit requirements are limited.
   - Impact: include platform-aware exploratory coverage where practical.
