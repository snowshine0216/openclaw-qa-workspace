#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_success_full_run() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-20)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-20","requested_source_families":["jira"],"overall_status":"not_started","updated_at":"2026-03-10T00:00:00.000Z"}'

  local output
  output="$(
    JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    FQPO_RUN_KEY="run-20" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-20 "$project_dir"
  )"

  assert_contains "$output" "PHASE_0_COMPLETE"
  assert_file_exists "$project_dir/context/runtime_setup_BCIN-20.md"
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_0_runtime_setup"'
}

test_concurrent_run_blocked() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-21)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-21","requested_source_families":["jira"],"overall_status":"in_progress","run_key":"existing-run","updated_at":"2026-03-10T00:00:00.000Z"}'

  set +e
  JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    FQPO_RUN_KEY="new-run" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-21 "$project_dir" >/tmp/phase0-concurrent.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$(cat /tmp/phase0-concurrent.stderr)" "CONCURRENT_RUN_BLOCKED"
}

test_script_failure() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-22)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-22","requested_source_families":["jira"],"overall_status":"not_started","updated_at":"2026-03-10T00:00:00.000Z"}'

  set +e
  JIRA_CLI_SCRIPT="$temp_dir/bin/missing-jira-run.sh" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-22 "$project_dir" >/tmp/phase0-failure.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
}

test_success_full_run
test_concurrent_run_blocked
test_script_failure
