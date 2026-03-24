# Execution Notes — HOLDOUT-REGRESSION-002

## Evidence used (only)
### Skill snapshot
- `skill_snapshot/SKILL.md` (Phase responsibilities; Phase 7 approval + promotion/finalization steps)
- `skill_snapshot/reference.md` (runtime layout; Phase 7 artifacts; archive-on-overwrite requirement; promotion gate)
- `skill_snapshot/README.md` (high-level description; confirms promoted final only after Phase 7 approval)

### Fixture bundle
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json` (feature identity/context only)
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json` (feature identity/context only)

## Files produced
- `./outputs/result.md`
- `./outputs/execution_notes.md`

## Blockers / gaps
- No Phase 7 execution artifacts for BCIN-976 were provided (e.g., `qa_plan_final.md`, `context/finalization_record_BCIN-976.md`, `archive/` entries). Therefore, validation is limited to **holdout contract stability** from the snapshot evidence and cannot confirm actual script execution outcomes for this feature.

## Holdout alignment
- Output intentionally focuses on **holdout = Phase 7 promotion/finalization** behavior and the benchmark’s cross-feature stability requirement.

## Runtime Metadata

- executor: benchmark-runner-llm
- duration_ms: 35934
- total_tokens: 11780
- configuration: old_skill