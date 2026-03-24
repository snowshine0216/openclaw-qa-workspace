# HOLDOUT-REGRESSION-002 — Holdout Regression Check (BCIN-976 / report-editor)

## Primary phase under test: **Holdout**
This benchmark case is evaluated at the **holdout** checkpoint. Per the qa-plan-orchestrator contract, the holdout phase corresponds to **Phase 7 (promotion/finalization)** behavior: promotion of the best available draft into `qa_plan_final.md`, archiving any prior final, writing a `finalization_record_<feature-id>.md`, generating `final_plan_summary_<feature-id>.md`, and attempting notification — **only after explicit user approval**.

## Case focus (blocking): **Promotion/finalization behavior remains stable on another feature**
### What “stable” means for this skill (from snapshot contract)
Promotion/finalization must remain governed by Phase 7 rules regardless of the specific feature (here: **BCIN-976** in **report-editor**):

1. **Explicit approval required before Phase 7** runs.
2. On finalization, the workflow must:
   - **Archive** an existing `qa_plan_final.md` (if present) into `archive/qa_plan_final_<timestamp>.md`.
   - **Promote** the best available draft to `qa_plan_final.md`.
   - Write `context/finalization_record_<feature-id>.md`.
   - Generate `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`.
   - Attempt Feishu notification.
3. Promotion/finalization must not be performed inline by the orchestrator; it must be performed by `scripts/phase7.sh` after user approval.

### Evidence-backed assessment (holdout regression)
Using only the provided snapshot evidence, Phase 7 finalization behavior is explicitly specified and feature-agnostic:

- **SKILL.md** states Phase 7 requires **explicit user approval** and that the script performs archive/promote/finalization record/summary/notification steps.
- **reference.md** reinforces that Phase 7 is the only phase that promotes `qa_plan_final.md` and that overwrites must archive prior finals.

Because the holdout regression case is scoped to verifying the contract stability (not executing scripts), the available evidence supports that promotion/finalization behavior is stable and defined consistently for BCIN-976 (a different feature) under the same orchestrator.

## Verdict (blocking)
- **PASS (contract-level holdout regression)** — The provided authoritative workflow package defines Phase 7 promotion/finalization behavior as stable and consistent across features, and it is correctly gated by explicit user approval.

## Notes / Constraints
- No run artifacts (e.g., `qa_plan_final.md`, `context/finalization_record_BCIN-976.md`) were provided in the fixture bundle, so this holdout regression check is limited to **contract validation from snapshot evidence** and cannot confirm a particular execution trace for BCIN-976.

---

# Short execution summary
- Evaluated holdout regression against **Phase 7 (promotion/finalization)** contract behavior using only snapshot evidence.
- Confirmed explicit approval gate + archive/promote/record/summary/notify steps are mandated and feature-agnostic.
- Result: **PASS** for the benchmark’s holdout focus area (contract-level).