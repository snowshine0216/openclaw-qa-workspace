# QA Plan Benchmark Execution Batches

**Date:** 2026-03-21
**Benchmark:** `workspace-planner/skills/qa-plan-orchestrator/benchmarks/qa-plan-v2`
**Prepared manifest:** `benchmarks/qa-plan-v2/iteration-0/spawn_manifest.json`

Use this document to execute the prepared `iteration-0` baseline in stable batches instead of trying to run all `192` runs at once.

## Precondition

Before materializing any batch, refresh the baseline surface:

```bash
cd workspace-planner/skills/qa-plan-orchestrator
npm run benchmark:v2:prepare
```

`benchmark:v2:batch` depends on the generated `iteration-0/spawn_manifest.json`. The batch command is not missing; it is unblocked by baseline preparation.

## Batch Materialization Command

```bash
cd workspace-planner/skills/qa-plan-orchestrator
npm run benchmark:v2:batch -- --batch 1
```

This writes:

- `benchmarks/qa-plan-v2/iteration-0/batches/batch-1/batch_manifest.json`
- `benchmarks/qa-plan-v2/iteration-0/batches/batch-1/batch_checklist.md`

Batches are for baseline execution only. Challenger iteration comparison is a separate workflow handled by `benchmarks/qa-plan-v2/scripts/run_iteration_compare.mjs`.

## Totals

- total cases: `32`
- blind cases: `24`
- replay cases: `6`
- holdout cases: `2`
- total runs: `192`

## Batch Order

Run the batches in this order:

1. blocking blind
2. remaining report-editor and docs blind
3. native-embedding and modern-grid blind
4. visualization, search-box-selector, and export blind
5. retrospective replay
6. holdout regression

This gives the highest-signal blind gating first, then broadens into the remaining blind surface before replay and holdout.

## Batch 1

**Goal:** blocking blind signal first
**Cases:** `4`
**Runs:** `24`
**Status:** `pending`
**Operator checklist:** [QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md](./QA_PLAN_BENCHMARK_BATCH1_OPERATOR_CHECKLIST.md)

- `eval-1` `P0-IDEMPOTENCY-001` `BCIN-976`
- `eval-2` `P1-SUPPORT-CONTEXT-001` `BCIN-7289`
- `eval-3` `P3-RESEARCH-ORDER-001` `BCIN-7289`
- `eval-23` `RE-P5B-SHIP-GATE-001` `BCIN-7289`

## Batch 2

**Goal:** remaining report-editor and docs blind quality
**Cases:** `4`
**Runs:** `24`
**Status:** `pending`

- `eval-6` `P4B-LAYERING-001` `BCED-2416`
- `eval-10` `P6-QUALITY-POLISH-001` `BCIN-6709`
- `eval-12` `DOC-SYNC-001` `DOCS`
- `eval-22` `RE-P4A-SCENARIO-DRAFT-001` `BCIN-7289`

## Batch 3

**Goal:** native-embedding and modern-grid blind coverage
**Cases:** `7`
**Runs:** `42`
**Status:** `pending`

- `eval-15` `NE-P4A-COMPONENT-STACK-001` `BCED-1719`
- `eval-16` `GRID-P4A-BANDING-001` `BCIN-7231`
- `eval-21` `GRID-P4A-HYPERLINK-STYLE-001` `BCIN-7547`
- `eval-24` `NE-P1-CONTEXT-INTAKE-001` `BCED-1719`
- `eval-25` `NE-P5B-CHECKPOINT-001` `BCED-1719`
- `eval-26` `GRID-P1-CONTEXT-INTAKE-001` `BCIN-7231`
- `eval-27` `GRID-P5B-CHECKPOINT-001` `BCIN-7547`

## Batch 4

**Goal:** visualization, search-box-selector, and export blind coverage
**Cases:** `9`
**Runs:** `54`
**Status:** `pending`

- `eval-17` `VIZ-P4A-DONUT-LABELS-001` `BCED-4860`
- `eval-18` `SELECTOR-P4A-CONFIRMATION-001` `BCDA-8653`
- `eval-19` `VIZ-P4A-HEATMAP-HIGHLIGHT-001` `BCVE-6797`
- `eval-20` `EXPORT-P5B-GSHEETS-001` `BCVE-6678`
- `eval-28` `VIZ-P1-CONTEXT-INTAKE-001` `BCED-4860`
- `eval-29` `VIZ-P5B-CHECKPOINT-001` `BCVE-6797`
- `eval-30` `EXPORT-P1-CONTEXT-INTAKE-001` `BCVE-6678`
- `eval-31` `EXPORT-P4A-SCENARIO-DRAFT-001` `BCVE-6678`
- `eval-32` `SELECTOR-P5B-CHECKPOINT-001` `BCDA-8653`

## Batch 5

**Goal:** retrospective replay coverage
**Cases:** `6`
**Runs:** `36`
**Status:** `pending`

- `eval-4` `P4A-SDK-CONTRACT-001` `BCIN-7289`
- `eval-5` `P4A-MISSING-SCENARIO-001` `BCIN-7289`
- `eval-7` `P5A-INTERACTION-AUDIT-001` `BCIN-7289`
- `eval-8` `P5A-COVERAGE-PRESERVATION-001` `BCIN-7289`
- `eval-9` `P5B-ANALOG-GATE-001` `BCIN-7289`
- `eval-11` `P7-DEV-SMOKE-001` `BCIN-7289`

## Batch 6

**Goal:** holdout regression guardrail
**Cases:** `2`
**Runs:** `12`
**Status:** `pending`

- `eval-13` `HOLDOUT-REGRESSION-001` `BCIN-6709`
- `eval-14` `HOLDOUT-REGRESSION-002` `BCIN-976`

## Run Procedure

For each case in the active batch:

1. execute the `with_skill` runs under `iteration-0/eval-<N>/with_skill/run-1..3/`
2. execute the `without_skill` runs under `iteration-0/eval-<N>/without_skill/run-1..3/`
3. write outputs into each run's `outputs/` directory
4. write `grading.json` for each run
5. write `timing.json` for each run

After all baseline batches complete:

```bash
cd workspace-planner/skills/qa-plan-orchestrator
npm run benchmark:v2:aggregate
```

## Progress Log

Update these lines manually as execution progresses.

- Batch 1: `pending`
- Batch 2: `pending`
- Batch 3: `pending`
- Batch 4: `pending`
- Batch 5: `pending`
- Batch 6: `pending`

## Notes

- Do not edit `cases.json`, `fixtures_manifest.json`, or `benchmark_manifest.json` once real baseline execution starts.
- Replay remains opt-in for iteration comparison. Batch 5 exists for baseline replay execution, not for implicit challenger promotion.
- Synthetic structural comparison is not equivalent to executed benchmark evidence.
