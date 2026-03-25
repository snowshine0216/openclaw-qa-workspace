# HOLDOUT-REGRESSION-002 — Holdout Regression Check (BCIN-976 / report-editor)

## Decision
**BLOCKED (cannot validate holdout regression behavior with provided evidence).**

## What this benchmark is trying to protect (holdout focus)
This holdout-regression case is specifically about ensuring **promotion/finalization behavior remains stable on another feature** (here: **BCIN-976**, feature family **report-editor**), under the orchestrator’s **holdout** phase model.

In the `qa-plan-orchestrator` contract, “promotion/finalization” is governed by **Phase 7**:
- Requires explicit user approval before running `scripts/phase7.sh`.
- Archives any existing `qa_plan_final.md`.
- Promotes the best available draft to `qa_plan_final.md`.
- Writes `context/finalization_record_<feature-id>.md`.
- Generates `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`.
- Attempts Feishu notification.

## Evidence available vs. evidence required for holdout regression
### Evidence provided (authoritative for this benchmark)
- Skill workflow/contract snapshot:
  - `skill_snapshot/SKILL.md`
  - `skill_snapshot/reference.md`
  - `skill_snapshot/README.md`
- Fixture bundle for BCIN-976:
  - `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json`
  - `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json`

### What is missing to actually *demonstrate* stable promotion/finalization
To validate “promotion/finalization remains stable,” the minimum demonstrable artifacts would normally include **runtime outputs from the orchestrator run**, e.g. under `<skill-root>/runs/BCIN-976/`:
- `task.json` / `run.json` showing phase progression to Phase 7
- some eligible draft artifact (`drafts/qa_plan_phase6_r1.md` or similar)
- Phase 7 outputs:
  - `qa_plan_final.md`
  - `context/finalization_record_BCIN-976.md`
  - `context/final_plan_summary_BCIN-976.md`
  - (optional) `archive/qa_plan_final_<timestamp>.md` if overwriting

**None of these runtime artifacts or Phase 7 outputs are included in the provided evidence**, so the benchmark focus cannot be directly verified.

## Holdout-phase alignment check (contract-level)
Given the holdout nature and limited evidence, the only thing that can be checked is whether the snapshot contract still defines stable promotion/finalization behavior:
- Phase 7 exists and is explicitly responsible for finalization/promotion.
- User approval is required before running Phase 7.
- Archive-then-promote behavior is specified.
- Summary generation from final plan is specified.

This indicates the **spec** still encodes the expected behavior, but **holdout regression requires evidence of behavior stability**, not just presence of the spec.

## Conclusion
- **Benchmark expectation (blocking):** “promotion/finalization behavior remains stable on another feature” → **Not demonstrable from provided evidence**.
- **Primary phase alignment (holdout):** addressed by checking the **Phase 7 promotion/finalization contract**, but **no execution artifacts** exist to confirm stability.

**Overall result: BLOCKED** until execution artifacts (or logs/output proving Phase 7 promotion/finalization) for BCIN-976 are available in evidence.