# Execution notes — HOLDOUT-REGRESSION-002 (BCIN-976)

## Evidence used (and only this evidence)
### Skill snapshot (authoritative workflow package)
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`

### Fixture references
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json` (partial/truncated in benchmark evidence)
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json`

## What was produced
- `./outputs/result.md` (this benchmark result)
- `./outputs/execution_notes.md` (this file)

## Blockers / gaps
- No run directory evidence provided for BCIN-976 (no `runs/BCIN-976/*` artifacts).
- No Phase 7 execution evidence (no approval record, no `finalization_record`, no `qa_plan_final.md`, no archive behavior evidence).

## Why this blocks a PASS for holdout_regression
The benchmark requires demonstrating that **promotion/finalization behavior remains stable on another feature** and that output aligns to **primary phase: holdout**. The snapshot defines the contract, but without Phase 7 run artifacts or logs, stability cannot be demonstrated for BCIN-976.

## Runtime Metadata

- executor: benchmark-runner-llm
- duration_ms: 27338
- total_tokens: 12333
- configuration: new_skill