# Execution Notes — HOLDOUT-REGRESSION-002

## Evidence used (only what was provided)
- SKILL SNAPSHOT EVIDENCE:
  - `skill_snapshot/SKILL.md`
  - `skill_snapshot/reference.md`
  - `skill_snapshot/README.md`
- FIXTURE EVIDENCE:
  - `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json`
  - `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json`

## What was produced
- `./outputs/result.md` (holdout-phase aligned regression assessment; blocked due to missing Phase 7 artifacts)
- `./outputs/execution_notes.md` (this file)

## Blockers
- The holdout fixture bundle includes only Jira issue/customer-scope exports and contains **no runtime artifacts** required to evaluate promotion/finalization behavior (Phase 7) for BCIN-976.
- Under the benchmark constraint to use only provided evidence, promotion/finalization stability cannot be confirmed or refuted.

## Notes on phase alignment
- The output is intentionally scoped to the **holdout** checkpoint and focuses on the **Phase 7 promotion/finalization** contract as the target regression surface, per the benchmark focus.

## Runtime Metadata

- executor: benchmark-runner-llm
- duration_ms: 23978
- total_tokens: 11898
- configuration: old_skill