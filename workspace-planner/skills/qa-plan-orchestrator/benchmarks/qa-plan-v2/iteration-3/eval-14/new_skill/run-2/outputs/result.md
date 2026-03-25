# HOLDOUT-REGRESSION-002 — Holdout Regression Result (BCIN-976)

## Benchmark intent (holdout / blocking)
Verify that **promotion/finalization behavior remains stable** when running the orchestrator against **another feature** (here: **BCIN-976**, feature family **report-editor**, knowledge pack **report-editor**), under the current **script-driven phase model**.

## Evidence basis (holdout regression)
This benchmark run is evaluated **only** against the provided workflow snapshot and fixture bundle evidence (no live script execution evidence was provided).

## What “stable promotion/finalization behavior” means per snapshot
Per `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`, promotion/finalization stability is defined by these non-negotiable contract points:

1. **Phase 7 is the only promotion/finalization phase**
   - Phase 7 “archive any existing final plan, promote the best available draft, write the finalization record, generate `context/final_plan_summary_<feature-id>.md`, then attempt Feishu notification.”

2. **Phase 7 requires explicit user approval**
   - Orchestrator must obtain approval before running `scripts/phase7.sh`.

3. **Final overwrite must archive existing final**
   - If `qa_plan_final.md` exists, it must be moved to `archive/qa_plan_final_<timestamp>.md` before promoting the new one.

4. **Finalization outputs are deterministic and feature-scoped**
   - Outputs: `context/finalization_record_<feature-id>.md` and promoted `qa_plan_final.md` under `<skill-root>/runs/<feature-id>/`.

5. **Promotion/finalization is blocked if request requirements are unsatisfied**
   - “Promotion and finalization are blocked if blocking `request_requirements` remain unsatisfied.”

## Holdout regression assessment for BCIN-976
### Pass/Fail outcome: **INCONCLUSIVE (blocking)**
Reason: The provided holdout evidence includes **only** (a) the orchestrator workflow snapshot and (b) a BCIN-976 Jira fixture bundle. It does **not** include any run artifacts (e.g., `runs/BCIN-976/run.json`, any drafts, or `qa_plan_final.md`) or any Phase 7 script stdout/records.

Because the benchmark’s blocking focus is to demonstrate that **promotion/finalization behavior remains stable on another feature**, this cannot be proven without at least one of:
- a Phase 7 execution trace showing approval gating + archive + promotion steps, or
- the resulting Phase 7 artifacts (`qa_plan_final.md`, `context/finalization_record_BCIN-976.md`, and when applicable `archive/qa_plan_final_<timestamp>.md`).

### What can be verified from the snapshot alone (contract stability)
From the authoritative snapshot evidence, the orchestrator’s **intended** promotion/finalization behavior is stable and feature-agnostic (applies equally to BCIN-976):
- Phase 7 is explicitly defined as the promotion/finalization phase.
- Explicit user approval is required before running Phase 7.
- Archiving behavior on final overwrite is explicitly specified.
- Outputs and locations are feature-scoped under `runs/<feature-id>/`.

However, contract presence ≠ demonstrated behavior for this holdout regression case.

## BCIN-976 fixture confirmation (context only)
Fixture confirms the benchmark target feature exists and is in the intended family context:
- Feature key: **BCIN-976**
- Issue type: Feature
- Labels include: `Library_and_Dashboards`, `Report` (aligns to report-editor family scope)
- Customer signal present (from `BCIN-976.customer-scope.json`)

This supports selecting BCIN-976 as the “other feature,” but does not evidence promotion/finalization behavior.

## Required evidence to close this as PASS (what’s missing)
To satisfy the benchmark’s blocking expectation in holdout mode, provide any of the following as benchmark evidence:
- `runs/BCIN-976/qa_plan_final.md`
- `runs/BCIN-976/context/finalization_record_BCIN-976.md`
- If overwrite occurred: `runs/BCIN-976/archive/qa_plan_final_<timestamp>.md`
- `runs/BCIN-976/context/final_plan_summary_BCIN-976.md`
- `runs/BCIN-976/run.json` showing `finalized_at` and phase progression
- Phase 7 stdout/log excerpt demonstrating **explicit approval** occurred prior to finalization

## Decision
**Blocking holdout regression status: INCONCLUSIVE** — cannot demonstrate stable promotion/finalization on BCIN-976 using only the provided evidence.