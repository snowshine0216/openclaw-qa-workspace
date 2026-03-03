# Tester Flow Runbook

This runbook documents the canonical v2 Playwright generation + execution + healing flow for `workspace-tester`.

## Path Policy

All relative paths in this runbook are resolved from `workspace-tester/`.

1. Canonical workflow root: `.agents/workflows/`
2. Canonical runtime orchestration root: `src/tester-flow/`
3. Canonical run-state root: `memory/tester-flow/runs/<work_item_key>/`
4. Planner specs default source: `../workspace-planner/projects/feature-plan/<work_item_key>/specs/`
5. Intake markdown root: `projects/library-automation/specs/feature-plan/<work_item_key>/`
6. Generated spec output root: `projects/library-automation/tests/specs/feature-plan/<work_item_key>/`

Cutover status:

1. Legacy project-local runtime under `projects/library-automation/.agents/scripts/*` is deprecated.
2. `planner-spec-generation-healing` must execute through workspace-root `.agents` + `src/tester-flow` runtime only.
3. Canonical state writes do not mirror to `projects/library-automation/runs/*`.

## Execution Modes

### 1) `planner_first`

Use planner-produced Markdown specs.

Required input:

1. `work_item_key`
2. optional `planner_specs_dir` override

### 2) `direct`

Generate from requirements context without requiring planner markdown upfront.

Required input:

1. `work_item_key`
2. one or more `requirements` paths (`.md/.json/.txt`)

### 3) `provided_plan`

Use explicit user-provided markdown plan/spec files.

Required input:

1. `work_item_key`
2. one or more `provided_plan` file paths (`.md` only)

## Runtime Commands

```bash
cd workspace-tester

# One-command full workflow
src/tester-flow/run_full_flow.sh --work-item-key BCIN-6709 --execution-mode planner_first

# Or phase-by-phase
src/tester-flow/run_r0.sh --work-item-key BCIN-6709 --execution-mode planner_first
src/tester-flow/run_phase0.sh --work-item-key BCIN-6709 --execution-mode planner_first
src/tester-flow/run_phase1.sh --work-item-key BCIN-6709
src/tester-flow/run_phase2.sh --work-item-key BCIN-6709
src/tester-flow/run_phase3.sh --work-item-key BCIN-6709
src/tester-flow/run_phase4.sh --work-item-key BCIN-6709
src/tester-flow/run_phase5.sh --work-item-key BCIN-6709
```

## Command Hooks (Env Vars)

The runtime reads command hooks from environment variables in:

1. [runner.mjs](/Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-tester/src/tester-flow/runner.mjs)

Supported hooks:

1. `PLANNER_PRESOLVE_CMD` or `--planner-presolve-cmd`
2. `PLAYWRIGHT_GENERATOR_CMD` or `--generator-cmd`
3. `PLAYWRIGHT_HEALER_CMD` or `--healer-cmd`
4. `FEISHU_NOTIFY_CMD` or `--notify-cmd`
5. `PLAYWRIGHT_TEST_PROJECT` or `--project` (for example `chromium`)

Important:

1. Phase 2 generation now fails fast if `PLAYWRIGHT_GENERATOR_CMD` is not configured.
2. `.claude/agents/*.md` files are prompt specifications for specialist agents, not shell scripts. They must be invoked by an agent orchestrator and exposed through the command hooks above.
3. If browser launch is unstable on WebKit/Firefox in your environment, run with `PLAYWRIGHT_TEST_PROJECT=chromium`.

## Runtime State Files

1. `memory/tester-flow/runs/<work_item_key>/task.json`
2. `memory/tester-flow/runs/<work_item_key>/run.json`
3. `memory/tester-flow/runs/<work_item_key>/context/spec_manifest.json`
4. `memory/tester-flow/runs/<work_item_key>/reports/execution-summary.md`
5. `memory/tester-flow/runs/<work_item_key>/healing/healing_report.md` (only unresolved)

Mode-shift namespace (when `new_run_on_mode_change=true`):

1. `memory/tester-flow/runs/<work_item_key>/mode-shift-<timestamp>/...`

## Post-Run Verification

```bash
WORK_ITEM_KEY=<work_item_key>

jq -r '.execution_mode' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.execution_mode' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.pre_route_status' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.pre_route_decision_log | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.generated_specs | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.failed_specs | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.healing.current_round' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.notification_pending // ""' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
```

## Failure Triage

### Generation Failure

1. Inspect source markdown and confirm `**Seed:**` exists.
2. Confirm target spec output path is writable.
3. Retry generation once per item.
4. If still failing, record failed targets in `run.json.failed_specs`.

### Execution Failure

1. Baseline run must stay `--retries=0`.
2. Persist failed spec list in `run.json.failed_specs`.
3. Persist execution logs for healer inputs.

### Healing Failure

1. Run healer on failed specs only.
2. Re-run failed specs only after each round.
3. Stop after round 3.
4. Write `healing/healing_report.md` when unresolved.

### Notification Failure

1. On Feishu send failure, write full payload to `run.json.notification_pending`.
2. Replay notification manually with stored payload.
3. Clear pending payload only after successful resend.
