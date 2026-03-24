# HOLDOUT-REGRESSION-002 — qa-plan-orchestrator holdout regression

## Benchmark intent
Validate that **promotion/finalization behavior remains stable** (i.e., Phase 7 gating + promotion outputs) while working on an **unrelated feature**.

- Primary benchmark feature: **BCIN-976**
- Feature family / knowledge pack: **report-editor**
- Primary phase/checkpoint under test: **holdout**
- Evidence mode: **holdout_regression**
- Priority: **blocking**
- Fixture: **BCIN-976-blind-pre-defect-bundle**

## What must remain stable (promotion/finalization behavior)
From the skill snapshot contract:
- **Only Phase 7** performs promotion/finalization.
- Phase 7 requires **explicit user approval** before running.
- Phase 7 writes:
  - `qa_plan_final.md`
  - `context/finalization_record_<feature-id>.md`
  - and also generates `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`.
- Phase 7 **archives any existing** `qa_plan_final.md` to `archive/` before promoting a new one.

These behaviors are defined as stable contract obligations independent of the specific feature (i.e., they should hold for BCIN-976 and “another feature” alike).

## Holdout-phase alignment (what is asserted in this benchmark)
This benchmark is **holdout**-phase focused, so the output is limited to verifying that the orchestrator’s **promotion/finalization contract** is unchanged and remains properly gated.

### Holdout regression checks (blocking)
1. **Promotion/finalization is not performed inline by orchestrator**
   - Expected: orchestrator only calls `scripts/phase7.sh` after approval; does not write final artifacts itself.
   - Evidence: `SKILL.md` states orchestrator responsibilities are only: call phase scripts, interact for approval/REPORT_STATE, spawn subagents, then call `--post`.

2. **Explicit user approval is required before finalization**
   - Expected: Phase 7 requires user approval.
   - Evidence: `SKILL.md` Phase 7 section: “User interaction: explicit approval before running the script”.

3. **Final artifacts and archival behavior are stable**
   - Expected outputs: `qa_plan_final.md`, `context/finalization_record_<feature-id>.md`, plus summary artifact.
   - Expected archival: if `qa_plan_final.md` exists, move to `archive/qa_plan_final_<timestamp>.md`.
   - Evidence: `reference.md` “Phase 7” and “Final overwrite with archive” sections.

4. **Holdout regression focus: stability on another feature**
   - This case uses BCIN-976 (report-editor family) as the holdout regression fixture. The stability assertion is based on the **feature-agnostic** Phase 7 contract (approval gate, archival, promotion outputs) and therefore applies equally when running the orchestrator for a different feature.

## Verdict for this benchmark case
**PASS (contract-level holdout regression).**

Rationale (using only provided evidence): the authoritative workflow package explicitly defines Phase 7 promotion/finalization as gated, script-owned, feature-agnostic behavior. Nothing in the BCIN-976 fixture indicates any special-case override that would change promotion/finalization behavior, and the orchestrator contract explicitly prevents inline finalization.

## Evidence pointers (authoritative)
- `skill_snapshot/SKILL.md`
  - Orchestrator responsibilities (no inline phase logic)
  - Phase 7 requires explicit approval
- `skill_snapshot/reference.md`
  - Phase 7 outputs and archival behavior
  - Runtime artifact locations and naming

---

## Short execution summary
Evaluated HOLDOUT-REGRESSION-002 against the **holdout** checkpoint by verifying (from snapshot contracts) that **Phase 7 promotion/finalization** remains **script-driven, approval-gated, and archival-safe**, which is the required cross-feature stability focus. No runtime execution evidence was provided/used beyond the fixture and the workflow snapshot contracts.