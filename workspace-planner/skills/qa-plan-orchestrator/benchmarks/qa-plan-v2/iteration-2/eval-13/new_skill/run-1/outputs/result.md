# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Primary phase under test: **holdout**

### Decision
**PASS (no regression indicated)** — Based strictly on the provided snapshot evidence, the qa-plan-orchestrator remains a **phase-script-only orchestrator** and does not inline phase logic. Nothing in the evidence suggests that improvements for the **report-editor** family would regress a **different feature planning flow**, because the workflow is feature-family/knowledge-pack driven via runtime inputs and phase scripts/manifests rather than hardcoded report-editor-only behavior.

## Case focus coverage (blocking): cross-feature non-regression
This benchmark is specifically checking that “skill improvements for report-editor do not regress a different feature planning flow.”

### Evidence-based reasoning
From `skill_snapshot/SKILL.md` and `skill_snapshot/reference.md`:

- The orchestrator contract is **generic** and **feature-id scoped**:
  - All artifacts live under `runs/<feature-id>/`.
  - The orchestrator only:
    1) calls `scripts/phaseN.sh`,
    2) handles user approval/REPORT_STATE choice, and
    3) spawns subagents from the phase spawn manifest and then runs `--post`.
- Feature-family specialization (e.g., report-editor) is handled as **data/config** (knowledge pack selection, deep research topics, policies) within the runtime state and phase scripts, not by orchestrator branching logic.
- Cross-feature planning flow protection is explicitly enforced by strict contracts:
  - **Spawn manifest contract**: orchestrator passes `requests[].openclaw.args` “exactly as-is” and must not add `streamTo`.
  - **Source routing rules** are fixed and apply to all features (Jira/Confluence/GitHub via designated skills).
  - **Support-only Jira policy** is generic and cannot hijack defect-analysis routing.

Therefore, the orchestrator’s behavior remains stable for other feature families because it is not permitted (by contract) to embed report-editor-specific planning logic.

## Holdout alignment
This output is intentionally limited to a **holdout** checkpoint judgment:
- It does **not** generate a QA plan.
- It does **not** invent additional evidence or claim runtime execution.
- It reports only whether the *workflow package* evidence implies a regression risk for non-report-editor flows.

## Fixture reference usage
The fixture `embedding-dashboard-editor-compare-result/compare-result.md` provides cross-feature context (report-editor vs embedding/migration-shell emphases) and reinforces why regressions can happen if a system hardcodes report-editor assumptions.

However, the orchestrator contract explicitly prevents this by:
- keeping phase logic in scripts,
- using manifests as the sole spawn mechanism,
- and encoding report-editor depth research requirements (Tavily-first, Confluence fallback) as **phase rules** rather than orchestrator behavior.

## Conclusion
**PASS** for HOLDOUT-REGRESSION-001: The provided workflow package evidence indicates the orchestrator remains contract-driven and feature-agnostic, so report-editor-oriented improvements should not regress a different feature planning flow.