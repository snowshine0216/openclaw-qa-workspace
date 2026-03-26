# QA Plan Benchmark Progress Summary

**Date:** 2026-03-21
**Scope:** `workspace-planner/skills/qa-plan-orchestrator`

## Current Status

Benchmark infrastructure is ready.

The benchmark strategy is now split into:

1. `qa-plan-v1`
   - seed benchmark
   - infrastructure validation only
2. `qa-plan-v2`
   - real global multi-case benchmark
   - intended for meaningful skill comparison and future skill evolution

## Completed

### 1. Seed benchmark completed

`qa-plan-v1` was built and validated end to end.

Completed artifacts:

- `benchmarks/qa-plan-v1/benchmark_manifest.json`
- `benchmarks/qa-plan-v1/fixtures_manifest.json`
- `benchmarks/qa-plan-v1/grading_rubric.md`
- `benchmarks/qa-plan-v1/history.json`
- `benchmarks/qa-plan-v1/iteration-0/benchmark_context.json`
- `benchmarks/qa-plan-v1/iteration-0/champion_snapshot/`
- `benchmarks/qa-plan-v1/iteration-0/spawn_manifest.json`
- `benchmarks/qa-plan-v1/iteration-0/benchmark.json`
- `benchmarks/qa-plan-v1/iteration-0/benchmark.md`

Helper scripts added:

- `benchmarks/qa-plan-v1/scripts/run_iteration0.mjs`
- `benchmarks/qa-plan-v1/scripts/lib/iteration0Benchmark.mjs`

Purpose of `qa-plan-v1`:

- prove snapshotting, workspace seeding, synthetic grading, and aggregation all work

### 2. Real benchmark layout completed

`qa-plan-v2` now exists as the real benchmark campaign.

Completed artifacts:

- `benchmarks/qa-plan-v2/benchmark_manifest.json`
- `benchmarks/qa-plan-v2/cases.json`
- `benchmarks/qa-plan-v2/fixtures_manifest.json`
- `benchmarks/qa-plan-v2/grading_rubric.md`
- `benchmarks/qa-plan-v2/README.md`
- `benchmarks/qa-plan-v2/iteration-0/benchmark_context.json`
- `benchmarks/qa-plan-v2/iteration-0/champion_snapshot/`
- `benchmarks/qa-plan-v2/iteration-0/spawn_manifest.json`

Runner added:

- `benchmarks/qa-plan-v2/scripts/run_baseline.mjs`
- `benchmarks/qa-plan-v2/scripts/lib/benchmarkV2.mjs`

`qa-plan-v2` currently prepares:

- `32` cases
- `3` runs per configuration
- `192` total baseline runs
- `24` blind_pre_defect cases
- `6` retrospective_replay cases
- `2` holdout_regression cases

### 3. Global benchmark schema completed

`qa-plan-v2` is now explicitly a global benchmark, not a single-feature benchmark.

Cases now require:

- `feature_family`
- `knowledge_pack_key`
- `fixture_refs`
- `benchmark_profile`
- `evidence_mode`

Supported `evidence_mode` values:

1. `blind_pre_defect`
2. `retrospective_replay`
3. `holdout_regression`

`blind_pre_defect` now uses a customer-only fixture policy:

- cases reference one frozen `blind_pre_defect_bundle`
- bundle policy is `all_customer_issues_only`
- non-customer issues are excluded from blind mode
- raw materials belong in `fixtures_manifest.json`, not inline in `cases.json`

### 4. Frozen Jira evidence completed

Blind bundles are no longer URL-only placeholders.

Completed:

- frozen Jira raw exports under `benchmarks/qa-plan-v2/fixtures/jira/`
- normalized `*.customer-scope.json` snapshots per feature
- frozen adjacent Jira evidence for weak customer-signal cases
- frozen BCED-2416 parented-issue export for BCIN-7289 analog borrowing

Current blind evidence state:

- direct customer-signal snapshots exist for `BCIN-976`, `BCIN-6709`, `BCED-1719`, `BCIN-7231`, `BCDA-8653`, `BCIN-7547`, and `BCED-2416`
- adjacent frozen Jira evidence is attached for weaker cases such as `BCIN-7289`, `BCED-4860`, `BCVE-6797`, and `BCVE-6678`

This means the blind benchmark is now reproducible from frozen local artifacts instead of depending on live Jira reads at execution time.

### 5. Complete blind-coverage matrix completed

The blind benchmark is no longer only breadth-first.

Completed:

- expanded from `13` blind cases to `24`
- moved from one-case-per-family breadth to multi-phase coverage for key families
- added intake, scenario-draft, and shipment-checkpoint blind cases for tier-1 and tier-2 families
- added one new blocking blind ship-gate case for `BCIN-7289`

Current family coverage:

- `report-editor`
  - `phase0`, `phase1`, `phase3`, `phase4a`, `phase4b`, `phase5b`, `phase6`
- `native-embedding`
  - `phase1`, `phase4a`, `phase5b`
- `modern-grid`
  - `phase1`, `phase4a`, `phase5b`
- `visualization`
  - `phase1`, `phase4a`, `phase5b`
- `export`
  - `phase1`, `phase4a`, `phase5b`
- `search-box-selector`
  - `phase4a`, `phase5b`
- `docs`
  - `docs`

### 6. Evidence-mode scoring completed

Scorer added:

- `benchmarks/qa-plan-v2/scripts/lib/scoreBenchmarkV2.mjs`
- `benchmarks/qa-plan-v2/scripts/score_iteration.mjs`

Acceptance is now split by evidence mode:

1. no regression on `blind_pre_defect`
2. improvement on `retrospective_replay`
3. no regression on `holdout_regression`

### 7. Benchmark spec and docs synced

Updated:

- `references/qa-plan-benchmark-spec.md`
- `benchmarks/qa-plan-v2/README.md`

Also restored required planner doc paths so existing doc-contract tests remain green.

## Verified

Verified with tests:

- targeted benchmark v1/v2 runner tests
- targeted scorer tests
- full `npm test` for `qa-plan-orchestrator`

Current result:

- benchmark-related code and docs are green in the existing package test suite

## Not Done Yet

### 1. Real `qa-plan-v2` execution has not been run

Prepared:

- `benchmarks/qa-plan-v2/iteration-0/spawn_manifest.json`
- `references/qa-plan-benchmark-execution-batches.md`

Not yet done:

- execute the `192` real baseline runs
- create real `grading.json` for each run
- create real `timing.json` for each run
- aggregate to `benchmark.json` / `benchmark.md`

### 2. Real iteration comparison has not been run

The scorer is ready, but it becomes meaningful only after:

1. a real baseline exists
2. a real candidate iteration exists
3. both have aggregated benchmark outputs

### 3. Knowledge packs are not implemented yet

The benchmark schema now supports `knowledge_pack_key`, but feature-family knowledge packs themselves still need to be created and wired into planning/evals.

## Recommended Next Steps

### Immediate next step

Run the real `qa-plan-v2` baseline against the current champion skill:

1. use `benchmarks/qa-plan-v2/iteration-0/spawn_manifest.json`
2. follow `references/qa-plan-benchmark-execution-batches.md` and execute batch by batch with `npm run benchmark:v2:execute -- --batch <N> --executor-script <path> --grader-script <path>`
3. save `grading.json` and `timing.json` for each run
4. run:

```bash
npm run benchmark:v2:aggregate
```

This will produce the first real benchmark aggregate:

- `benchmarks/qa-plan-v2/iteration-0/benchmark.json`
- `benchmarks/qa-plan-v2/iteration-0/benchmark.md`

### After baseline execution

1. inspect the real blind/replay/holdout distribution
2. decide whether any additional cases are needed before freezing `qa-plan-v2`
3. if the benchmark definition changes materially, create `qa-plan-v3` instead of editing an already-used `v2`

### After benchmark freeze

Start the first real skill-evolution iteration:

1. mutate the target skill
2. run candidate vs champion on `qa-plan-v2`
3. aggregate results
4. run:

```bash
npm run benchmark:v2:score -- --iteration <N> --comparison-mode iteration_compare --primary-configuration new_skill --reference-configuration old_skill
```

## Command Summary

Prepare baseline:

```bash
npm run benchmark:v2:prepare
```

Aggregate baseline after grading:

```bash
npm run benchmark:v2:aggregate
```

Score an iteration comparison:

```bash
npm run benchmark:v2:score -- --iteration 1 --comparison-mode iteration_compare --primary-configuration new_skill --reference-configuration old_skill
```

## Key Decision

Use one global benchmark for `qa-plan-orchestrator`, not one benchmark per feature family.

Feature-family variation should be represented inside `qa-plan-v2/cases.json` through:

- `feature_family`
- `knowledge_pack_key`
- `fixture_refs`
- `evidence_mode`

Split to a new benchmark version only when the benchmark contract itself changes materially.
