# Holdout Regression Result

- Case ID: `HOLDOUT-REGRESSION-001`
- Primary feature: `BCIN-6709`
- Feature family: `report-editor`
- Primary phase: `holdout`
- Evidence mode: `holdout_regression`
- Priority: `blocking`
- Verdict: `FAIL`

## Decision

The supplied evidence does not demonstrate the required holdout condition: that report-editor skill improvements avoid regressing a different feature planning flow. The only fixture is named like a cross-feature comparison, but its content remains centered on `BCED-2416` report-editor plan ranking and plan refinement, not on validating a separate non-report-editor planning flow.

## Expectation Check

- `Not met` — Case focus is explicitly covered: the fixture does not show preservation of a different feature planning flow. It repeatedly evaluates report-editor scope and recommends a report-editor base plan instead.
- `Met` — Output aligns with primary phase `holdout`: this artifact is a holdout checkpoint assessment with an explicit pass/fail decision.

## Evidence

- `compare-result.md:7-17` says "Plan 1 wins on report-editor coverage" and lists report-editor capability families as the basis for the decision.
- `compare-result.md:24-36` criticizes Plan 2 for under-covering report-editor breadth, which keeps the evaluation anchored on report-editor completeness rather than a different feature flow.
- `compare-result.md:28-29` is the closest cross-feature signal, but it only says Plan 2 is strong on embedding-migration shell coverage; it does not establish a preserved end-to-end planning flow for another feature family.
- `compare-result.md:105-124` explicitly scopes the final ranking to "`BCED-2416` report-editor" and recommends keeping Plan 1 as the main report-editor QA plan, while importing only a few shell/regression strengths from Plan 2.

## Holdout Conclusion

This benchmark should be treated as a blocking holdout failure. Based on the provided fixture alone, non-regression for a different feature planning flow is not demonstrated explicitly enough to satisfy the case.
