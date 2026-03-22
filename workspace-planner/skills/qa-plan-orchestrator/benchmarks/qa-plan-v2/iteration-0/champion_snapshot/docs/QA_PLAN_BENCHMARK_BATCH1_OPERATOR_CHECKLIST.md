# QA Plan Benchmark Batch 1 Operator Checklist

**Date:** 2026-03-21
**Batch:** `1`
**Goal:** blocking blind signal first
**Cases:** `4`
**Runs:** `24`
**Status:** `completed`

## Workflow

Run Batch 1 in this order:

1. `npm run benchmark:v2:prepare`
2. `npm run benchmark:v2:batch -- --batch 1`
3. execute the listed runs
4. `npm run benchmark:v2:aggregate` after all baseline batches finish

## Cases

- `eval-1` `P0-IDEMPOTENCY-001` `BCIN-976`
- `eval-2` `P1-SUPPORT-CONTEXT-001` `BCIN-7289`
- `eval-3` `P3-RESEARCH-ORDER-001` `BCIN-7289`
- `eval-23` `RE-P5B-SHIP-GATE-001` `BCIN-7289`

## Per-Run Completion Rule

Each run is complete only when all of these exist in the run directory:

- `outputs/`
- `grading.json`
- `timing.json`

## Run Checklist

### Eval 1

- [x] `with_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-1`
- [x] `with_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-2`
- [x] `with_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-1/with_skill/run-3`
- [x] `without_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-1/without_skill/run-1`
- [x] `without_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-1/without_skill/run-2`
- [x] `without_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-1/without_skill/run-3`

### Eval 2

- [x] `with_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-2/with_skill/run-1`
- [x] `with_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-2/with_skill/run-2`
- [x] `with_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-2/with_skill/run-3`
- [x] `without_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-2/without_skill/run-1`
- [x] `without_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-2/without_skill/run-2`
- [x] `without_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-2/without_skill/run-3`

### Eval 3

- [x] `with_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-3/with_skill/run-1`
- [x] `with_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-3/with_skill/run-2`
- [x] `with_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-3/with_skill/run-3`
- [x] `without_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-3/without_skill/run-1`
- [x] `without_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-3/without_skill/run-2`
- [x] `without_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-3/without_skill/run-3`

### Eval 23

- [x] `with_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-23/with_skill/run-1`
- [x] `with_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-23/with_skill/run-2`
- [x] `with_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-23/with_skill/run-3`
- [x] `without_skill` `run-1`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-23/without_skill/run-1`
- [x] `without_skill` `run-2`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-23/without_skill/run-2`
- [x] `without_skill` `run-3`
  Path: `benchmarks/qa-plan-v2/iteration-0/eval-23/without_skill/run-3`

## Batch Completion

Batch 1 is complete only when:

- all `24` runs above are complete
- every run has `outputs/`, `grading.json`, and `timing.json`

Then update:

- this file: `Status: completed`
- `QA_PLAN_BENCHMARK_EXECUTION_BATCHES.md`: `Batch 1: completed`
