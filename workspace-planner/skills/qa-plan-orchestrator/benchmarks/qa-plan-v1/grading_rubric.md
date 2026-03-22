# Grading Rubric

## Iteration-0 Scope

Use the current `qa-plan-orchestrator` baseline only.

Grade against:

1. `evals/evals.json` expectations for eval ids `1`, `2`, and `3`
2. existing blocking eval-group intent from `evals/evals.json`
3. `npm test` as the regression gate

## Grader Rules

1. Mark an expectation as passed only when the output contains direct evidence for that expectation.
2. Do not infer missing artifacts from intent. If an artifact path is not present, fail the expectation.
3. When fixture gaps block a fair judgment, record the gap in `evidence` and treat the expectation as failed unless the run explicitly handles the missing fixture.
4. Keep iteration-0 grading focused on current contract and documentation behavior. Do not add replay-style assertions yet.

## Future Expansion

Later benchmark versions or later activation steps inside the evolution workflow may add:

1. defect replay grading
2. knowledge-pack coverage grading
3. self-test actionability grading
4. holdout regression grading

Those additions must not be retrofitted into `qa-plan-v1` after `iteration-0` is executed. If the benchmark contract changes materially, create `qa-plan-v2`.
