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
}

test_success_all_sources
test_missing_jira_env
test_invalid_args
