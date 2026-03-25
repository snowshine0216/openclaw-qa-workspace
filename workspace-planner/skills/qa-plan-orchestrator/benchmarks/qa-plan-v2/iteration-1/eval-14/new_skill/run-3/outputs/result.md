# HOLDOUT-REGRESSION-002 — Holdout Regression Verdict (qa-plan-orchestrator)

## Primary benchmark target
- **Feature:** BCIN-976
- **Feature family / knowledge pack:** report-editor
- **Primary phase under test:** **Holdout**
- **Case family / evidence mode:** holdout regression
- **Priority:** **blocking**
- **Fixture reference:** BCIN-976-blind-pre-defect-bundle

## What this holdout regression case is verifying
**Case focus:** *Promotion/finalization behavior remains stable on another feature.*

In this skill package, **promotion/finalization** is explicitly defined as **Phase 7** behavior (user approval gate + promotion of best available draft to `qa_plan_final.md` + archival of any existing final + writing finalization record + generating `final_plan_summary` + attempting notification).

Because this benchmark’s **primary checkpoint is “holdout”**, the artifact here is a **phase-model alignment check**: ensure the orchestrator contract does **not** drift (e.g., finalize earlier than Phase 7, skip the explicit approval requirement, or change promotion semantics) when run against an unrelated feature (BCIN-976) in the report-editor family.

## Evidence-based contract assertions (from snapshot)
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`:

### A. Finalization is Phase 7 only, and requires explicit user approval
- **SKILL.md → Phase 7:** “User interaction: explicit approval before running the script”
- **SKILL.md → Phase 7:** “archive any existing final plan, promote the best available draft, write the finalization record, … generate … final_plan_summary … then attempt Feishu notification.”

### B. Promotion output is deterministic and location-bound
- **reference.md → Phase 7 outputs:**
  - `context/finalization_record_<feature-id>.md`
  - `qa_plan_final.md`
- **reference.md → Final overwrite with archive:** existing `qa_plan_final.md` is moved to `archive/qa_plan_final_<timestamp>.md` before promoting.

### C. Orchestrator must not implement phase logic inline
- **SKILL.md responsibilities:** orchestrator only calls `phaseN.sh`, handles required approvals/choices, spawns from manifests, and runs `--post`.

## Holdout regression verdict
**PASS (contract holds).**

### Rationale
Using only the provided benchmark evidence:
- The authoritative snapshot defines **promotion/finalization behavior entirely in Phase 7**, with a **hard approval gate**.
- The behavior is **feature-agnostic**: the phase model and file outputs are parameterized by `<feature-id>` and run directory, so applying it to **BCIN-976** should not change the semantics.
- No evidence indicates any alternate/early finalization path, bypass of approval, or different promotion behavior for report-editor features.

## What would constitute a holdout regression failure (not observed in evidence)
- Finalization occurring in Phase 6 or earlier.
- No explicit user approval before Phase 7.
- Overwriting `qa_plan_final.md` without archiving.
- Not writing `context/finalization_record_<feature-id>.md`.
- Promotion not selecting “best available draft” per the script-driven contract.

---

# Short execution summary
- Checked the skill snapshot for **Phase 7 promotion/finalization contract** and verified it is **stable, explicit, and approval-gated**.
- Confirmed outputs and archival behavior for `qa_plan_final.md` are specified and feature-id scoped (applies to BCIN-976 as holdout feature).
- No blockers found within provided evidence.