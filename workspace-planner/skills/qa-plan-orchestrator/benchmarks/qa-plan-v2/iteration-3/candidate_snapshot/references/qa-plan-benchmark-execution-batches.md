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

- total cases: `33`
- blind cases: `24`
- replay cases: `6`
- holdout cases: `3`
- total runs: `198`

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
**Status:** `completed`
**Operator checklist:** [qa-plan-benchmark-batch1-operator-checklist.md](./qa-plan-benchmark-batch1-operator-checklist.md)

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

Preferred command for one-click execution of the active batch:

```bash
cd workspace-planner/skills/qa-plan-orchestrator
npm run benchmark:v2:execute:codex -- --batch 1
```

Equivalent explicit form:

```bash
cd workspace-planner/skills/qa-plan-orchestrator
npm run benchmark:v2:execute -- \
  --batch 1 \
  --executor-script benchmarks/qa-plan-v2/scripts/benchmark-runner.mjs \
  --grader-script benchmarks/qa-plan-v2/scripts/benchmark-grader.mjs
```

The executor receives `--request <run-dir>/execution_request.json` once per run. The harness copies referenced fixtures into `run-dir/inputs/fixtures/`, writes `timing.json`, and refreshes the batch manifest/checklist after the batch finishes.

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

- Batch 1: `completed`
- Batch 2: `completed`
- Batch 3: `fallback_completed`
- Batch 4: `fallback_completed`
- Batch 5: `completed`
- Batch 6: `completed`

## Notes

- Do not edit `cases.json`, `fixtures_manifest.json`, or `benchmark_manifest.json` once real baseline execution starts.
- Replay remains opt-in for iteration comparison. Batch 5 exists for baseline replay execution, not for implicit challenger promotion.
- Synthetic structural comparison is not equivalent to executed benchmark evidence.

## Executed baseline policy (no placeholder aggregation)

**Do not** create placeholder `outputs/` or use token-only grading to “finish” a baseline that is claimed as executed. A baseline that is intended to be **executed** must use `benchmark-runner.mjs` and `benchmark-grader.mjs`.

If executed benchmark invocation fails, fix the primary runner/grader path and rerun it. Do not switch to a degraded local or manual fallback.

### Legacy placeholder-tagged runs (audit only)

Some historical runs may still contain this marker in `outputs/execution_notes.md`:

- `offline fallback executor: generated deterministic placeholder output for local grading.`
- `- executor: deterministic fallback executor`

And/or this marker in `outputs/metrics.json`:

- `"model": "deterministic-fallback"`
- `"executor": "deterministic-fallback"`

Those runs are **not** equivalent to full executor fidelity. List them for auditing:

```bash
cd workspace-planner/skills/qa-plan-orchestrator
node -e 'const fs=require("fs");const path=require("path");const root="benchmarks/qa-plan-v2/iteration-0";const rows=[];for(const evalDir of fs.readdirSync(root).filter(n=>n.startsWith("eval-"))){for(const cfg of ["with_skill","without_skill"]){const cfgDir=path.join(root,evalDir,cfg);if(!fs.existsSync(cfgDir)) continue;for(const run of fs.readdirSync(cfgDir).filter(n=>n.startsWith("run-"))){const runDir=path.join(cfgDir,run);const notes=path.join(runDir,"outputs","execution_notes.md");const metrics=path.join(runDir,"outputs","metrics.json");const noteText=fs.existsSync(notes)?fs.readFileSync(notes,"utf8"):"";const metricsText=fs.existsSync(metrics)?fs.readFileSync(metrics,"utf8"):"";if(noteText.includes("offline fallback executor")||noteText.includes("deterministic fallback executor")||metricsText.includes("deterministic-fallback")) rows.push(runDir);}}}console.log(rows.join("\n"));'
```

### CI fidelity gate

To fail CI when placeholder-tagged, deterministic-fallback, or `offline-fallback` markers remain under `iteration-0`:

```bash
BENCHMARK_REQUIRE_EXECUTED=1 node benchmarks/qa-plan-v2/scripts/check_benchmark_fidelity.mjs
```

See `benchmarks/qa-plan-v2/README.md` for the canonical executed workflow.

### Operator data hygiene (legacy matrix)

If `iteration-0` still contains placeholder-tagged runs from an older workflow, replace them by re-executing those evals through the canonical `benchmark-runner.mjs` + `benchmark-grader.mjs` path, then re-aggregate. Purging large committed artifacts is a separate git/ops decision; the policy above prevents new placeholder baselines from being treated as executed.
