#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_artifact_index_builds_lookup() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-40)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-40","current_phase":"phase_1_evidence_gathering","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-40","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'jira\n' > "$project_dir/context/jira_issue_BCIN-40.md"
  printf 'github\n' > "$project_dir/context/github_diff_BCIN-40.md"

  bash "$SKILL_ROOT/scripts/phase2.sh" BCIN-40 "$project_dir" >/dev/null
  assert_file_exists "$project_dir/context/artifact_lookup_BCIN-40.md"
  assert_contains "$(cat "$project_dir/context/artifact_lookup_BCIN-40.md")" "jira_context"
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_2_artifact_index"'
}

test_artifact_index_builds_lookup
