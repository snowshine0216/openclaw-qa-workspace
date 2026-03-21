# Baseline Assessment

- eval_id: 2
- case_id: P1-SUPPORT-CONTEXT-001
- feature_id: BCIN-7289
- configuration: without_skill
- run: 3

## Summary
- Prompt-only baseline can inventory the blind BCIN-7289 materials and note that no explicit customer support signal is present in the frozen export.
- It does not create support-only routing artifacts, relation maps, or support summaries, so the support-context contract is not actually exercised.
- The note is still phase-1 oriented because it stays at evidence intake / context collection rather than later planning phases.

## Expectations
- [phase_contract][blocking] Case focus is explicitly covered: supporting issues stay context_only_no_defect_analysis and produce summaries => FAIL
- [phase_contract][blocking] Output aligns with primary phase phase1 => PASS

## Evidence Sources
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-7289.issue.raw.json
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-7289.customer-scope.json
- workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2/fixtures/jira/BCIN-7289.adjacent-issues.summary.json

## Judgment
- Prompt-only baseline is materially weaker than the champion evidence.
