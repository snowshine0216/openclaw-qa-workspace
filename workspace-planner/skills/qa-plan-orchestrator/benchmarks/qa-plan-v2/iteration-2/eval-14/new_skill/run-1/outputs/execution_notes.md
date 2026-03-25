# Execution notes — HOLDOUT-REGRESSION-002

## Evidence used (only)
1. `skill_snapshot/SKILL.md`
   - Orchestrator responsibilities (script-only; no inline artifact writing)
   - Phase 7 explicit approval requirement
2. `skill_snapshot/reference.md`
   - Phase 7 artifact outputs (`qa_plan_final.md`, `context/finalization_record_<feature-id>.md`, summary generation)
   - Archival behavior on final overwrite
   - Runtime root and artifact naming conventions
3. Fixture bundle:
   - `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json`
   - `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json`

## What was produced
- `./outputs/result.md` (string in `result_md`)
- `./outputs/execution_notes.md` (string in `execution_notes_md`)

## Blockers / gaps
- No actual run logs, `run.json`, manifests, or produced artifacts were provided; therefore this holdout regression determination is **contract-level** only (based on the authoritative workflow package), not an empirical execution trace.

## Phase alignment
- Primary phase under test is **holdout**; this execution limited scope to validating **finalization/promotion stability** (Phase 7 contract and gating) as required by the benchmark focus.

## Runtime Metadata

- executor: benchmark-runner-llm
- duration_ms: 33628
- total_tokens: 12260
- configuration: new_skill