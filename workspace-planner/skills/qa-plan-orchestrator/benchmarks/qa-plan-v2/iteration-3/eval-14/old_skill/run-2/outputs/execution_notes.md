# Execution Notes — HOLDOUT-REGRESSION-002

## Evidence used (only what was provided)
### Skill snapshot evidence
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`

### Fixture evidence
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json`
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json`

## What was produced
- `./outputs/result.md`
- `./outputs/execution_notes.md`

## Holdout alignment
- Primary phase under test is **holdout**; output is limited to validating that **promotion/finalization behavior** is stable and remains **Phase 7-only with explicit approval + archive-on-overwrite**, per snapshot contract.

## Blockers / limitations
- No runtime `runs/<feature-id>/` artifacts or script outputs were included in evidence, so promotion/finalization behavior could not be verified via observed execution for BCIN-976 (only via the authoritative contract text).

## Runtime Metadata

- executor: benchmark-runner-llm
- duration_ms: 23919
- total_tokens: 11896
- configuration: old_skill