# QA Plan Benchmark v1

This directory is the frozen benchmark campaign root for `qa-plan-orchestrator`.

Current scope:

1. Seed `iteration-0` as the baseline run.
2. Freeze the current contract-oriented eval set from `evals/evals.json`.
3. Record known fixture gaps before replay and holdout expansion starts.

Initial configurations:

1. `with_skill`
2. `without_skill`

Do not change prompts, fixtures, grading expectations, or scoring rules inside `qa-plan-v1` once `iteration-0` is executed. Start a new benchmark version if the benchmark itself changes.
