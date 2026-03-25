# HOLDOUT-REGRESSION-002 — Holdout Regression Check (BCIN-976, report-editor)

## Scope / checkpoint under test
**Primary phase:** Holdout

**Holdout regression focus (blocking):** *Promotion/finalization behavior remains stable on another feature*.

This benchmark validates the **orchestrator contract around Phase 7 (promotion/finalization)** remains unchanged/stable when running against a different feature in the same family (here: **BCIN-976**, report-editor).

---

## Evidence-based contract assertions (Phase 7 stability)
Using the skill snapshot as the authoritative workflow package, the orchestrator’s promotion/finalization behavior is contractually stable and constrained as follows:

### A. Phase 7 is the only promotion/finalization step
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`:
- **Phase 7** is responsible to:
  - **archive any existing final plan**
  - **promote the best available draft** into `qa_plan_final.md`
  - **write finalization record** `context/finalization_record_<feature-id>.md`
  - **generate** `context/final_plan_summary_<feature-id>.md` from `qa_plan_final.md`
  - **attempt notification**
- The orchestrator must not implement finalization logic inline; it only runs the phase script and handles required approvals.

### B. Explicit user approval is required before finalization
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`:
- **User interaction:** “explicit approval before running the script” for Phase 7.
- This is the core stability requirement for “promotion/finalization behavior”: the orchestrator must pause at Phase 7 until approval is granted.

### C. Final overwrite is safe (archive first)
From `skill_snapshot/reference.md`:
- If `qa_plan_final.md` already exists, Phase 7 **moves it to `archive/qa_plan_final_<timestamp>.md` before promoting**.
- This ensures stable, non-destructive finalization behavior across features (including BCIN-976).

### D. Holdout alignment: validate finalization contract without re-planning
Because this is a **holdout regression** checkpoint (not a full plan generation), the expected artifact is a contract-focused verification that:
- finalization remains **Phase 7 only**
- approval gating remains enforced
- archive-then-promote behavior remains enforced
- outputs/paths remain consistent under `runs/<feature-id>/...`

---

## Feature-specific applicability (BCIN-976)
Fixture evidence confirms BCIN-976 is in the **report-editor family** context and is a valid “other feature” to check against:
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.issue.raw.json` shows labels include **"Report"** and **"Library_and_Dashboards"**.
- `fixture:BCIN-976-blind-pre-defect-bundle/BCIN-976.customer-scope.json` indicates **customer signal present** and a policy note: “Feature carries explicit customer references in Jira custom fields.”

Nothing in the fixture evidence changes or relaxes Phase 7 constraints; therefore the promotion/finalization behavior should remain identical for BCIN-976.

---

## Pass/Fail determination (holdout regression)
**PASS (contract-level):** The snapshot evidence specifies a stable, approval-gated, archive-safe promotion/finalization behavior (Phase 7 only), and nothing in the BCIN-976 fixture evidence introduces exceptions.

**Blocking conditions to watch (per contract, not executed here):**
- Attempting promotion/finalization in any phase other than Phase 7.
- Running Phase 7 without explicit user approval.
- Overwriting `qa_plan_final.md` without archiving.

---

## Minimal holdout regression checklist (what must remain true)
1. Orchestrator requests explicit approval before calling `scripts/phase7.sh`.
2. Phase 7 archives existing `qa_plan_final.md` (if present) to `archive/`.
3. Phase 7 promotes best available draft to `qa_plan_final.md`.
4. Phase 7 writes `context/finalization_record_<feature-id>.md`.

(Items are directly derived from the workflow contract in snapshot evidence.)