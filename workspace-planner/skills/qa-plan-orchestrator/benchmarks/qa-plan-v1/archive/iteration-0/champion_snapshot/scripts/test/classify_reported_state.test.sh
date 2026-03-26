#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_fresh_state() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-10)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-10","updated_at":"2026-03-10T00:00:00.000Z"}'

  bash "$SKILL_ROOT/scripts/classify_reported_state.sh" "$run_dir" >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"report_state": "FRESH"'
}

test_draft_exists() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-11)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-11","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'draft\n' > "$run_dir/drafts/qa_plan_v1.md"

  bash "$SKILL_ROOT/scripts/classify_reported_state.sh" "$run_dir" >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"report_state": "DRAFT_EXISTS"'
}

test_invalid_run_dir() {
  set +e
  bash "$SKILL_ROOT/scripts/classify_reported_state.sh" "/tmp/does-not-exist" >/tmp/classify.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
}

test_fresh_state
test_draft_exists
test_invalid_run_dir
