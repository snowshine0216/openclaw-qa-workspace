# Baseline Assessment

- eval_id: 1
- case_id: P0-IDEMPOTENCY-001
- feature_id: BCIN-976
- configuration: without_skill
- run: 3

## Summary
- Prompt-only baseline can identify that BCIN-976 has customer signal in Jira, but it does not instantiate the orchestrator state machine.
- No explicit REPORT_STATE table, no resume decision flow, and no phase-0 runtime/request artifacts are produced.

## Expectations
- [phase_contract][blocking] Case focus is explicitly covered: REPORT_STATE and resume semantics remain stable => FAIL
- [phase_contract][blocking] Output aligns with primary phase phase0 => FAIL

## Evidence Sources
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-976.issue.raw.json
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-976.customer-scope.json

## Judgment
- Prompt-only baseline is materially weaker than the champion evidence.
