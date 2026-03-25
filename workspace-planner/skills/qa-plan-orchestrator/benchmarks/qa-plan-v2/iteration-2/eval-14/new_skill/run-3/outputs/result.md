# HOLDOUT-REGRESSION-002 — Holdout Regression Check (BCIN-976 / report-editor)

## Primary phase under test: **holdout**

### Verdict (blocking)
**BLOCKED / NOT DEMONSTRATED** — With the provided holdout-regression evidence, we cannot demonstrate that the **qa-plan-orchestrator** preserves **promotion/finalization behavior stability** for another feature (BCIN-976). The evidence bundle contains only Jira fixture data for the feature and does **not** include any Phase 7 (promotion/finalization) runtime artifacts, scripts output, or finalization records to evaluate.

## What this holdout regression is supposed to cover (explicit focus)
**Focus requirement:** *“promotion/finalization behavior remains stable on another feature.”*

Concretely, under the orchestrator contract, this means we would need evidence that the orchestrator:
- gates Phase 7 behind explicit user approval,
- archives any existing `qa_plan_final.md` before overwriting,
- promotes the best available draft to `qa_plan_final.md`,
- writes `context/finalization_record_<feature-id>.md`,
- generates `context/final_plan_summary_<feature-id>.md` from the final plan.

## Evidence available in this benchmark
Only fixture-level Jira exports for **BCIN-976** were provided:
- `BCIN-976.issue.raw.json` (Jira issue raw export; truncated in the benchmark)
- `BCIN-976.customer-scope.json` (customer-signal presence metadata)

These artifacts establish feature identity and context (feature family alignment: report-editor-related labels like `Library_and_Dashboards`, `Report`) but do **not** include any orchestrator run state or Phase 7 artifacts.

## Why this is blocked
To validate *promotion/finalization stability* in **holdout** phase, we would minimally need one of the following (none are present in the provided evidence):
- a Phase 7 execution trace (script stdout/stderr) showing archive + promote steps,
- `qa_plan_final.md` for BCIN-976,
- `context/finalization_record_BCIN-976.md`,
- `context/final_plan_summary_BCIN-976.md`,
- `runs/BCIN-976/run.json` and/or `task.json` demonstrating finalized state.

Without those, we cannot assert whether finalization behavior is stable, regressed, or even executed.

## Required next evidence to complete this holdout regression (blocking)
Provide any Phase 7-related runtime artifacts for BCIN-976 produced by the skill snapshot workflow, e.g.:
- `runs/BCIN-976/qa_plan_final.md`
- `runs/BCIN-976/context/finalization_record_BCIN-976.md`
- `runs/BCIN-976/context/final_plan_summary_BCIN-976.md`
- `runs/BCIN-976/run.json` (with `finalized_at`, `notification_pending`, etc.)

---

## Short execution summary
- Checked the provided holdout-regression fixture evidence for BCIN-976.
- No promotion/finalization (Phase 7) artifacts were included, so the holdout regression focus (“promotion/finalization behavior remains stable on another feature”) cannot be evaluated.
- Marked as **BLOCKED** due to insufficient evidence.