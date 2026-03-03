---
description: Canonical workflow entrypoint for R0 normalization, Playwright spec generation, baseline execution, bounded healing, and finalization.
---

# Canonical Workflow: Planner Spec -> Generation -> Healing (v2)

All paths are resolved from `workspace-tester/`.

## Inputs

Required:

1. `work_item_key` (aliases accepted in R0: `feature-id`, `issue-key`)

Optional:

1. `execution_mode`: `planner_first` | `direct` | `provided_plan`
2. `project`: Playwright project name (default: `chromium`; use for Phase 3/4 execution)
3. `new_run_on_mode_change`: `true` | `false` (default `false`)
4. `planner_specs_dir` (override for `planner_first`)
5. `provided_plan` (repeatable `.md` path for `provided_plan`)
6. `requirements` (repeatable `.md/.json/.txt` path for `direct`)
7. `planner_presolve_cmd` (required only when planner artifacts are missing)
8. `framework_profile` (optional path override)
9. `generator_cmd` / `healer_cmd` / `notify_cmd` runtime hook overrides

## Runtime Entrypoints

1. `src/tester-flow/run_r0.sh`
2. `src/tester-flow/run_phase0.sh`
3. `src/tester-flow/run_phase1.sh`
4. `src/tester-flow/run_phase2.sh`
5. `src/tester-flow/run_phase3.sh`
6. `src/tester-flow/run_phase4.sh`
7. `src/tester-flow/run_phase5.sh`
8. `src/tester-flow/run_full_flow.sh`

## One-command Execution

```bash
cd workspace-tester
src/tester-flow/run_full_flow.sh \
  --work-item-key BCIN-6709 \
  --execution-mode planner_first
```

## Runtime Hook Notes

1. `PLAYWRIGHT_GENERATOR_CMD` (or `--generator-cmd`) is required for Phase 2 generation.
2. `PLAYWRIGHT_HEALER_CMD` (or `--healer-cmd`) is used for Phase 4 fixes.
3. `FEISHU_NOTIFY_CMD` (or `--notify-cmd`) is used for Phase 5 notifications.
4. `PLAYWRIGHT_TEST_PROJECT` (or `--project`) can force single-browser execution (for example `chromium`).
5. `.claude/agents/*.md` are specialist prompt specs, not shell executables; invoke them through your orchestrator and expose invocation via these hooks.

## Phase-by-phase Execution

```bash
cd workspace-tester

# R0 intent normalization + planner artifact route
src/tester-flow/run_r0.sh \
  --work-item-key BCIN-6709 \
  --execution-mode planner_first

# Phase 0 preflight + mode gate + idempotency
src/tester-flow/run_phase0.sh \
  --work-item-key BCIN-6709 \
  --execution-mode planner_first

# Phase 1 intake + manifest
src/tester-flow/run_phase1.sh --work-item-key BCIN-6709

# Phase 2 generation (one retry per failed item)
src/tester-flow/run_phase2.sh --work-item-key BCIN-6709

# Phase 3 baseline execution (--retries=0)
src/tester-flow/run_phase3.sh --work-item-key BCIN-6709

# Phase 4 bounded healing (max 3 rounds)
src/tester-flow/run_phase4.sh --work-item-key BCIN-6709

# Phase 5 finalize + notification fallback
src/tester-flow/run_phase5.sh --work-item-key BCIN-6709
```

## State Files (canonical)

1. `memory/tester-flow/runs/<work_item_key>/task.json`
2. `memory/tester-flow/runs/<work_item_key>/run.json`
3. `memory/tester-flow/runs/<work_item_key>/context/spec_manifest.json`
4. `memory/tester-flow/runs/<work_item_key>/reports/execution-summary.md`
5. `memory/tester-flow/runs/<work_item_key>/healing/healing_report.md` (only unresolved after round 3)

## Acceptance Spot Checks

```bash
WORK_ITEM_KEY=BCIN-6709

jq -r '.execution_mode' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.execution_mode' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.pre_route_status' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.pre_route_decision_log | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.healing.max_rounds' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.notification_pending // ""' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
```
