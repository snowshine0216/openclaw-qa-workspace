# HOLDOUT-REGRESSION-001 — Holdout Regression Check (BCIN-6709, report-editor)

## Primary checkpoint: **holdout** (blocking)

### Pass/Fail verdict: **FAIL (blocking)**

## What this holdout regression case is checking
This benchmark is a **holdout regression** guardrail: ensure that **skill improvements made for the `report-editor` feature family do not regress a different feature planning flow**.

Therefore, the required output at the **holdout** checkpoint must demonstrate (at minimum):
1) The orchestrator stays within the **script-driven phase contract** (no inline phase logic), and
2) The workflow remains **cross-feature safe**—i.e., report-editor-specific improvements (notably deep research and knowledge-pack rules) do not break planning for other feature types/flows.

## Evidence available in this benchmark
Only the following benchmark evidence is available:
- `skill_snapshot/SKILL.md`
- `skill_snapshot/reference.md`
- `skill_snapshot/README.md`
- Fixture: `embedding-dashboard-editor-compare-result/compare-result.md`

## Holdout regression assessment

### A) Orchestrator contract vs. holdout objective
The snapshot describes a script-driven orchestrator with strict responsibilities:
- only call `scripts/phaseN.sh` (+ spawn from manifest + `--post`),
- only interact with the user for `REPORT_STATE` choices and Phase 7 approval,
- **no inline phase logic and no artifact writing**.

This is compatible with cross-feature safety in principle.

However, this benchmark requires explicit confirmation that **report-editor improvements do not regress a different feature planning flow**. With the evidence provided, there is:
- no run output for BCIN-6709,
- no `runs/<feature-id>/...` artifacts,
- no phase logs/spawn manifests produced,
- no demonstration of a non-report-editor flow continuing to work after report-editor-specific changes.

So the holdout regression focus is **not explicitly covered** by any produced artifact in this benchmark.

### B) Cross-feature regression risk signaled by provided fixture
The fixture `embedding-dashboard-editor-compare-result/compare-result.md` is explicitly about a **different planning flow**: embedding/migration shell coverage vs report-editor coverage.
It highlights a common cross-feature failure mode:
- Plan 1 (report-editor heavy) is strong on report-editor breadth.
- Plan 2 is strong on embedding-migration shell/regression.
- The recommended direction: use report-editor plan as base, **borrow migration-shell/regression sections**.

This fixture underscores the exact regression risk this benchmark is targeting: report-editor-centric planning can accidentally crowd out or regress embedding/migration-shell planning needs.

But the benchmark deliverables here do not include any orchestration proof (holdout-phase artifact, run record, or gating output) showing that the orchestrator preserves the **embedding/migration-shell** planning flow while improving report-editor behavior.

## Conclusion
This benchmark case requires holdout-phase evidence that cross-feature planning has not regressed due to report-editor improvements.

Given only the snapshot documentation + comparison fixture (and no actual orchestration outputs), the case focus cannot be demonstrated as satisfied.

**Result: FAIL (blocking) at holdout checkpoint** because the output does not explicitly cover the holdout regression focus and does not provide holdout-phase aligned artifacts demonstrating cross-feature safety.