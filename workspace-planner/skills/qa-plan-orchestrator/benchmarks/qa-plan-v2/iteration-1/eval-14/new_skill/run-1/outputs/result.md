# HOLDOUT-REGRESSION-002 — qa-plan-orchestrator holdout regression verification

## Scope
- **Benchmark case:** HOLDOUT-REGRESSION-002
- **Primary feature:** **BCIN-976**
- **Feature family / knowledge pack:** report-editor
- **Primary phase under test:** **Holdout (Phase 7: promotion/finalization)**
- **Evidence mode:** holdout_regression
- **Priority:** blocking
- **Case focus (must be explicitly covered):** **promotion/finalization behavior remains stable on another feature**

## What this holdout regression checks
This benchmark is **not** validating feature-specific scenario quality. It verifies the orchestrator’s **Phase 7 promotion/finalization stability** (the “holdout” checkpoint) remains correct when run for a different feature (BCIN-976) within the same feature family (report-editor).

### Promotion/finalization behaviors that must remain stable (per skill snapshot)
From the authoritative workflow package (skill snapshot), Phase 7 is responsible for:
1. **Explicit user approval before running Phase 7**.
2. **Archive any existing final plan** before overwriting (move `qa_plan_final.md` to `archive/qa_plan_final_<timestamp>.md`).
3. **Promote the best available draft** to `qa_plan_final.md`.
4. **Write a finalization record**: `context/finalization_record_<feature-id>.md`.
5. **Generate a final plan summary** using `scripts/lib/finalPlanSummary.mjs` to create:
   - `context/final_plan_summary_<feature-id>.md`
6. Attempt Feishu notification (non-core for this benchmark, but part of Phase 7 behavior).

## Evidence-based determination for this benchmark
### Evidence available (holdout_regression mode)
Only the following evidence is available for this benchmark case:
- Skill snapshot documentation describing the orchestrator’s phase model and Phase 7 responsibilities.
- Fixture bundle containing Jira raw issue JSON and a customer-scope export for BCIN-976.

### What can/cannot be concluded from the provided evidence
- **Can conclude (contract-level):** The skill snapshot explicitly defines Phase 7 finalization behaviors and the requirement for **explicit user approval** and **archival on overwrite**, which are the core “promotion/finalization stability” elements targeted by this benchmark.
- **Cannot conclude (execution-level):** The provided evidence does **not** include any runtime outputs for BCIN-976 (e.g., no `runs/BCIN-976/` artifacts such as `qa_plan_final.md`, `context/finalization_record_BCIN-976.md`, `archive/`, or script logs). Therefore, **there is no execution proof** that Phase 7 ran and behaved correctly for BCIN-976 in this benchmark run.

## Holdout regression verdict
**BLOCKED / INDETERMINATE (insufficient benchmark evidence to verify Phase 7 stability on BCIN-976).**

Reason: The benchmark focus requires demonstrating that **promotion/finalization behavior remains stable on another feature** (BCIN-976). The snapshot defines the intended behavior, but without Phase 7 runtime artifacts or logs for BCIN-976, we cannot verify:
- that user approval gating occurred,
- that an existing final was archived when present,
- that a draft was promoted to `qa_plan_final.md`,
- that `context/finalization_record_BCIN-976.md` and `context/final_plan_summary_BCIN-976.md` were produced.

## Minimum evidence needed to unblock this holdout regression (for BCIN-976)
Any one of the following would allow an execution-level verification aligned to Phase 7:
- `runs/BCIN-976/context/finalization_record_BCIN-976.md`
- `runs/BCIN-976/qa_plan_final.md`
- `runs/BCIN-976/context/final_plan_summary_BCIN-976.md`
- `runs/BCIN-976/archive/qa_plan_final_<timestamp>.md` (if overwriting)
- Phase 7 script stdout/log excerpt showing approval gate + promotion steps

---

## Short execution summary
- Primary phase under test (holdout / Phase 7) and the required promotion/finalization behaviors are clearly defined in the provided skill snapshot.
- The fixture provides BCIN-976 metadata but no Phase 7 runtime artifacts.
- Result is **blocked** because the benchmark evidence does not include the files/logs required to demonstrate Phase 7 promotion/finalization stability on BCIN-976.