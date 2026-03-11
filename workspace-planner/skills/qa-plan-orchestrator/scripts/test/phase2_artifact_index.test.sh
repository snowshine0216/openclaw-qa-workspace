#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_artifact_index_builds_lookup() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-40)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-40","current_phase":"phase_1_evidence_gathering","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-40","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'jira\n' > "$run_dir/context/jira_issue_BCIN-40.md"
  printf 'github\n' > "$run_dir/context/github_diff_BCIN-40.md"

  bash "$SKILL_ROOT/scripts/phase2.sh" BCIN-40 "$run_dir" >/dev/null
  assert_file_exists "$run_dir/context/artifact_lookup_BCIN-40.md"
  assert_contains "$(cat "$run_dir/context/artifact_lookup_BCIN-40.md")" "jira_context"
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_2_artifact_index"'
}

test_artifact_index_builds_lookup
