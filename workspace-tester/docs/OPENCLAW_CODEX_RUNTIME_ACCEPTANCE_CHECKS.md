# OpenClaw and Codex Runtime Acceptance Checks

## Objective

Provide executable checks for validating the NLG-oriented runtime integration across:

1. OpenClaw `sessions_spawn` orchestration.
2. Codex wrapper hook orchestration.
3. Canonical state and artifact outputs.

## Preconditions

1. Current working directory is `workspace-tester/`.
2. Canonical workflow exists at `.agents/workflows/planner-spec-generation-healing.md`.
3. Framework profile is available at `projects/library-automation/.agents/context/framework-profile.json`.

## A. Baseline State and Path Checks

```bash
test -f .agents/workflows/planner-spec-generation-healing.md && echo OK_WORKFLOW
test -f src/tester-flow/runner.mjs && echo OK_RUNNER
test -f projects/library-automation/.agents/context/framework-profile.json && echo OK_PROFILE
```

Expected:

1. `OK_WORKFLOW`
2. `OK_RUNNER`
3. `OK_PROFILE`

## B. Runner Hook Contract Checks

Validate that expected hook env contracts are present in runtime code:

```bash
rg -n "PLANNER_PRESOLVE_CMD|PLAYWRIGHT_GENERATOR_CMD|PLAYWRIGHT_HEALER_CMD|FEISHU_NOTIFY_CMD" src/tester-flow/runner.mjs
rg -n "SOURCE_MARKDOWN|TARGET_SPEC_PATH|SEED_REFERENCE|FAILED_SPECS|FRAMEWORK_PROFILE_PATH|RUN_DIR|WORK_ITEM_KEY" src/tester-flow/runner.mjs
```

Expected:

1. All hook names appear.
2. Required env keys for generator/healer appear.

## C. OpenClaw-Oriented Scenario Checks

### C1. Planner exists route

```bash
WORK_ITEM_KEY=<work_item_key>
src/tester-flow/run_r0.sh --work-item-key "$WORK_ITEM_KEY" --execution-mode planner_first
jq -r '.pre_route_status' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
```

Expected:

1. `pre_route_status` is `plan_exists` when planner artifacts are present.

### C2. Generation phase contract

```bash
WORK_ITEM_KEY=<work_item_key>
src/tester-flow/run_phase2.sh --work-item-key "$WORK_ITEM_KEY" --generator-cmd "<generator_wrapper_or_openclaw_bridge_cmd>"
jq -r '.generated_specs | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
```

Expected:

1. Generated count is greater than zero.

### C3. Healing bounded loop contract

```bash
WORK_ITEM_KEY=<work_item_key>
src/tester-flow/run_phase4.sh --work-item-key "$WORK_ITEM_KEY" --healer-cmd "<healer_wrapper_or_openclaw_bridge_cmd>" --project chromium
jq -r '.healing.current_round' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
```

Expected:

1. `healing.current_round <= 3` always.

## D. Codex Wrapper Scenario Checks

### D1. Full run with wrappers

```bash
WORK_ITEM_KEY=<work_item_key>
export PLANNER_PRESOLVE_CMD="src/tester-flow/scripts/invoke-planner-codex.sh"
export PLAYWRIGHT_GENERATOR_CMD="src/tester-flow/scripts/invoke-generator-codex.sh"
export PLAYWRIGHT_HEALER_CMD="src/tester-flow/scripts/invoke-healer-codex.sh"
export PLAYWRIGHT_TEST_PROJECT=chromium
src/tester-flow/run_full_flow.sh --work-item-key "$WORK_ITEM_KEY" --execution-mode planner_first
```

Expected:

1. `run.json.generated_specs` is populated.
2. Chromium-only execution used.
3. Healing runs only when failures exist.

## E. Notification Fallback Check

```bash
WORK_ITEM_KEY=<work_item_key>
jq -r '.notification_pending // ""' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
```

Expected:

1. Empty string if notify succeeds.
2. Full payload string if notify fails.

## F. Required Acceptance Assertions

Run all assertions:

```bash
WORK_ITEM_KEY=<work_item_key>
jq -r '.execution_mode' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.execution_mode' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.pre_route_status' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.pre_route_decision_log | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.generated_specs | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.failed_specs | length' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
jq -r '.healing.max_rounds' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.healing.current_round' "memory/tester-flow/runs/$WORK_ITEM_KEY/task.json"
jq -r '.notification_pending // ""' "memory/tester-flow/runs/$WORK_ITEM_KEY/run.json"
```

Expected:

1. Mode fields match between task and run state.
2. Route log has at least one entry.
3. `healing.max_rounds` is `3`.
4. `healing.current_round` never exceeds `3`.
5. Notification fallback behavior is explicit and observable.
