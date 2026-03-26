#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_success_all_sources() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local output_dir="$temp_dir/context"
  mkdir -p "$output_dir"

  local output
  output="$(
    JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    GH_BIN="$temp_dir/bin/gh" \
    CONFLUENCE_BIN="$temp_dir/bin/confluence" \
    bash "$SKILL_ROOT/scripts/check_runtime_env.sh" BCIN-1 jira,confluence,github "$output_dir"
  )"

  assert_contains "$output" "RUNTIME_SETUP_OK"
  assert_file_exists "$output_dir/runtime_setup_BCIN-1.md"
  assert_file_exists "$output_dir/runtime_setup_BCIN-1.json"
}

test_missing_jira_env() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  mkdir -p "$temp_dir/context"

  set +e
  JIRA_CLI_SCRIPT="$temp_dir/bin/missing-jira-run.sh" \
    bash "$SKILL_ROOT/scripts/check_runtime_env.sh" BCIN-2 jira "$temp_dir/context" >/tmp/check-runtime-env.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
}

test_invalid_args() {
  set +e
  bash "$SKILL_ROOT/scripts/check_runtime_env.sh" >/tmp/check-runtime-env-invalid.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$(cat /tmp/check-runtime-env-invalid.stderr)" "output-dir"
}

test_default_output_dir_uses_workspace_artifact_root() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local workspace_root="$temp_dir/workspace"
  local skill_root="$workspace_root/workspace-planner/skills/qa-plan-orchestrator"
  mkdir -p "$skill_root/scripts"
  cp "$SKILL_ROOT/scripts/check_runtime_env.sh" "$skill_root/scripts/check_runtime_env.sh"
  mkdir -p "$skill_root/scripts/lib"
  cp "$SKILL_ROOT/scripts/lib/runtimeEnv.mjs" "$skill_root/scripts/lib/runtimeEnv.mjs"
  cp "$SKILL_ROOT/scripts/lib/contextRules.mjs" "$skill_root/scripts/lib/contextRules.mjs"
  cp "$SKILL_ROOT/scripts/lib/workflowState.mjs" "$skill_root/scripts/lib/workflowState.mjs"
  mkdir -p "$workspace_root/.agents/skills/lib"
  cp "$SKILL_ROOT/../../../.agents/skills/lib/artifactRoots.mjs" \
    "$workspace_root/.agents/skills/lib/artifactRoots.mjs"

  local output
  output="$(
    cd "$workspace_root" && \
    JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    GH_BIN="$temp_dir/bin/gh" \
    CONFLUENCE_BIN="$temp_dir/bin/confluence" \
    bash "$skill_root/scripts/check_runtime_env.sh" BCIN-RUNS jira
  )"

  local expected_suffix="workspace-artifacts/skills/workspace-planner/qa-plan-orchestrator/runs/BCIN-RUNS/context/runtime_setup_BCIN-RUNS.json"
  assert_contains "$output" "$expected_suffix"
  local actual_json="${output#RUNTIME_SETUP_OK: }"
  assert_file_exists "$actual_json"
}

test_global_jira_path_resolution() {
  # When JIRA_CLI_SCRIPT is unset, resolution tries repo .agents, then ~/.agents, then ~/.openclaw.
  # Create a fake HOME with jira-run.sh to test global path fallback.
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local fake_home="$temp_dir/home"
  mkdir -p "$fake_home/.agents/skills/jira-cli/scripts"
  setup_fake_tooling "$temp_dir/bin"
  cp "$temp_dir/bin/jira-run.sh" "$fake_home/.agents/skills/jira-cli/scripts/jira-run.sh"
  local output_dir="$temp_dir/context"
  mkdir -p "$output_dir"

  # Run from temp_dir (no .agents/AGENTS.md) so findRepoRoot returns null; HOME has jira script
  local output
  output="$(cd "$temp_dir" && HOME="$fake_home" bash "$SKILL_ROOT/scripts/check_runtime_env.sh" BCIN-GLOBAL jira "$output_dir")"

  assert_contains "$output" "RUNTIME_SETUP_OK"
  assert_file_exists "$output_dir/runtime_setup_BCIN-GLOBAL.json"
  assert_contains "$(cat "$output_dir/runtime_setup_BCIN-GLOBAL.json")" "jira"
}

test_success_all_sources
test_missing_jira_env
test_invalid_args
test_default_output_dir_uses_workspace_artifact_root
test_global_jira_path_resolution
