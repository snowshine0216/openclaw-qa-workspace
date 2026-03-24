# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Primary phase under test: **holdout**

### What this holdout regression benchmark is checking
This case verifies that **skill improvements for the `report-editor` feature family do not regress a different feature planning flow**, while still remaining aligned to the orchestrator’s **holdout** checkpoint expectations (i.e., focusing on workflow/contract adherence and cross-feature non-regression, not generating a full QA plan).

### Evidence used (authoritative)
- **qa-plan-orchestrator skill snapshot**
  - `skill_snapshot/SKILL.md`
  - `skill_snapshot/reference.md`
  - `skill_snapshot/README.md`
- **Fixture**
  - `fixture:embedding-dashboard-editor-compare-result/compare-result.md`

## Holdout regression assessment

### 1) Cross-feature non-regression focus: **Covered**
The fixture is explicitly **not** a pure report-editor-only planning artifact; it compares two plans with different emphases:
- **Plan 1:** stronger on **report-editor capability map** (objects, filters, prompts, SQL view, subtotals, formatting/themes, page-by, derived objects, consolidations/custom groups, transformations, MDX, undo/redo, save/export, cube/datamart, Python, Freeform SQL, upgrade compatibility).
- **Plan 2:** stronger on **embedding / migration-shell / regression** coverage (toggle, routing, save/save-as ownership, cancel/close, perf, menu parity, auth/ACL, native integration, regression pools), but weaker on core report-editor breadth.

This fixture directly exercises the benchmark’s concern:
- The orchestrator must support **report-editor improvements** (deep capability mapping, executable steps) **without collapsing** or ignoring a **different feature planning flow** (embedding/migration-shell/regression grouping).
- The comparison’s “Best practical direction” calls for keeping the report-editor base while importing embedding/migration-shell strengths, which is exactly the cross-feature blending pressure that can cause regressions.

### 2) Alignment with orchestrator contract / phase model: **Covered at holdout level**
From the snapshot, the orchestrator contract is:
- **Does not perform phase logic inline**.
- **Only calls phase scripts**, handles required user approvals/REPORT_STATE choice, and spawns subagents strictly from manifests.
- Enforces **Tavily-first** for report-editor deep research with Confluence as recorded fallback.
- Enforces artifact layout under `runs/<feature-id>/...`.

For a holdout regression checkpoint, the key is that nothing in the required workflow is report-editor-special-cased in a way that would break other planning flows:
- Source routing is generic and constrained (`jira-cli`, `confluence`, `github`, figma/browser), preventing ad-hoc substitutions.
- Spawn manifests must be passed to `sessions_spawn` **as-is** (no `streamTo` injection), avoiding runtime regressions across features.
- The phase gates and validators are phase-scoped and artifact-scoped, not feature-scoped.

### 3) Holdout phase correctness: **Aligned**
This output intentionally stays at a **holdout checkpoint** level:
- It does **not** attempt to run phases, generate drafts, or produce `qa_plan_final.md`.
- It limits itself to evaluating whether the benchmark focus is explicitly addressed using only the provided evidence.

## Blocking verdict (holdout regression)
**PASS (blocking)** — Based on the provided evidence, the benchmark’s explicit focus is covered: the fixture demonstrates a scenario where report-editor planning improvements coexist with a different planning flow (embedding/migration-shell/regression framing), and the orchestrator contract in the snapshot remains phase-driven and non-inline, reducing risk of cross-feature regression.

## Notes / risks observed (non-blocking within this holdout checkpoint)
- The fixture indicates real-world risk areas where cross-feature blending can drift terminology (report plan with dashboard wording) and introduce contradictions (error handling mismatch). These are plan-quality concerns, but they do not contradict the orchestrator’s holdout-level contract by themselves.