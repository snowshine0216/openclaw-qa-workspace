# Holdout Regression Result

- Case: HOLDOUT-REGRESSION-001
- Feature under test: BCIN-6709
- Feature family: report-editor
- Phase: holdout
- Evidence mode: holdout_regression
- Priority: blocking
- Verdict: FAIL

## Decision

The holdout case fails. The provided holdout evidence regresses into report-editor-specific evaluation criteria instead of preserving the different planning flow represented by `embedding-dashboard-editor-compare-result`.

## Evidence

1. The comparison explicitly ranks `Plan 1` higher because it covers the "actual report-editor capability map in depth" and because it is stronger on report-specific coverage, executable steps, and context coverage. Evidence: `./inputs/fixtures/embedding-dashboard-editor-compare-result/source/compare-result.md:1-17`, `:38-41`, `:45-69`, `:98-109`.
2. The competing plan's distinct strength is "embedding-migration shell coverage", but that is treated as secondary and only worth borrowing in part, not as the primary decision frame. Evidence: `./inputs/fixtures/embedding-dashboard-editor-compare-result/source/compare-result.md:28-29`, `:113-118`.
3. The final recommendation is explicitly conditioned on the target being "definitively BCED-2416 report-editor", which shows the result is anchored to report-editor heuristics rather than a different holdout feature flow. Evidence: `./inputs/fixtures/embedding-dashboard-editor-compare-result/source/compare-result.md:103-118`.

## Expectation Check

- `Case focus explicitly covered`: Yes. This review explicitly checks whether report-editor improvements regressed a different feature planning flow and concludes that they did.
- `Output aligns with primary phase holdout`: Yes. This artifact is a holdout-phase review of the supplied holdout evidence and records a blocking verdict.
- `Benchmark satisfaction`: No. The evidence shows cross-feature regression because report-editor optimization dominates the decision for a different holdout flow.

## Required Disposition

Blocking fail. To satisfy this benchmark, the planning/review logic must preserve the holdout feature's native decision criteria before importing report-editor-specific coverage preferences.
