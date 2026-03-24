# HOLDOUT-REGRESSION-002 — Holdout Regression QA Plan Orchestrator Check (BCIN-976)

## Primary phase/checkpoint under test: **Holdout**

### Benchmark focus (blocking)
**Promotion/finalization behavior remains stable on another feature** (feature family: report-editor; feature: **BCIN-976**).

### What must remain stable (contract-level expectations)
Based strictly on the provided qa-plan-orchestrator skill snapshot, the orchestrator’s promotion/finalization behavior is:

1. **Promotion is Phase 7 only**
   - Phase 7 is the only phase allowed to:
     - archive any existing `qa_plan_final.md`
     - promote the best available draft to `qa_plan_final.md`
     - write `context/finalization_record_<feature-id>.md`
     - generate `context/final_plan_summary_<feature-id>.md` via `scripts/lib/finalPlanSummary.mjs`
     - attempt Feishu notification

2. **Explicit user approval is required before Phase 7**
   - “User interaction: explicit approval before running the script” is a hard gate.

3. **Final overwrite must archive existing final**
   - If `qa_plan_final.md` exists, Phase 7 must move it to `archive/qa_plan_final_<timestamp>.md` before promoting a new final.

4. **Holdout-phase alignment: do not perform Phase 7 actions**
   - In holdout (this checkpoint), the orchestrator must **not**:
     - write or overwrite `qa_plan_final.md`
     - create `context/finalization_record_<feature-id>.md`
     - archive prior finals
     - send notifications
   - Instead, holdout should validate that the above Phase 7 behaviors and gates are preserved and unchanged.

### Evidence-bound verification (from provided snapshot)
The snapshot explicitly defines promotion/finalization behavior and gating:

- **SKILL.md → Phase 7**: archive prior final, promote best draft, finalization record, final plan summary generation, Feishu notification attempt; requires **explicit user approval**.
- **reference.md**:
  - Phase 7 artifacts: `context/finalization_record_<feature-id>.md`, `qa_plan_final.md`
  - Final overwrite with archive behavior described under “Failure and Recovery Examples”.
  - Phase gates: “Phase 7: explicit user approval before promotion”.

### Feature anchoring (BCIN-976)
This holdout regression is applied to a different feature (BCIN-976) within the **report-editor** family to ensure promotion/finalization stability cross-feature.

Fixture evidence confirms BCIN-976 exists and is a report-related feature:
- Jira key: **BCIN-976**
- Labels include: `Library_and_Dashboards`, `Report`
- Fix version: `26.04`

### Holdout regression verdict (blocking)
**PASS (contract preserved in evidence).**

Rationale (holdout-aligned): The provided authoritative workflow package defines Phase 7 promotion/finalization as gated, archive-safe, and phase-exclusive; no evidence suggests any deviation for BCIN-976 or report-editor features.

### Risks / gaps (cannot assess in holdout evidence mode)
- No run artifacts (e.g., `runs/BCIN-976/...`) were provided, so we cannot verify runtime execution traces (e.g., whether approval was actually prompted, archive directory created, or whether finalization record was written) for this specific feature.
- This holdout check is therefore **contract conformance by specification evidence**, not an observed execution audit.

---

## Short execution summary
- Checked the provided skill snapshot contract for Phase 7 promotion/finalization stability requirements (approval gate, archive-on-overwrite, Phase 7 exclusivity).
- Anchored the holdout regression to BCIN-976 using the provided fixture evidence.
- Determined the benchmark focus is explicitly covered and stable per contract; no execution artifacts were available to validate behavior empirically.