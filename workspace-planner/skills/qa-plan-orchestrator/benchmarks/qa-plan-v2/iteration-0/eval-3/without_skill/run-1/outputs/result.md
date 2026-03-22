# Baseline Assessment

- eval_id: 3
- case_id: P3-RESEARCH-ORDER-001
- feature_id: BCIN-7289
- configuration: without_skill
- run: 1

## Summary
- Prompt-only baseline can extract research themes from the blind fixture bundle, including prompt handling, builder loading, i18n, and close/save risk clusters.
- It does not execute Tavily-first research or record any fallback sequence, so the ordering contract is unproven.
- The output remains a phase-3 research backlog note rather than a later draft.

## Expectations
- [phase_contract][blocking] Case focus is explicitly covered: Tavily-first then Confluence fallback ordering => FAIL
- [phase_contract][blocking] Output aligns with primary phase phase3 => PASS

## Evidence Sources
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-7289.issue.raw.json
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-7289.adjacent-issues.summary.json

## Judgment
- Prompt-only baseline is materially weaker than the champion evidence.
