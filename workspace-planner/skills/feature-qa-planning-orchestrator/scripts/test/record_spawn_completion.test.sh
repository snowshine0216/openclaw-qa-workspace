#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_record_spawn_completion() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-99)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-99","requested_source_families":["jira"],"updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-99","has_supporting_artifacts":false,"spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'

  # Create phase1 manifest
  printf '%s\n' '{
    "version": 1,
    "source_kind": "feature-qa-planning",
    "count": 1,
    "requests": [{
      "source": {"kind": "feature-qa-planning", "source_family": "jira", "feature_id": "BCIN-99"}
    }]
  }' > "$project_dir/phase1_spawn_manifest.json"

  # Create fake jira artifacts
  printf '%s\n' '# Main issue' > "$project_dir/context/jira_issue_BCIN-99.md"
  printf '%s\n' '# Related issues' > "$project_dir/context/jira_related_issues_BCIN-99.md"

  local output
  output="$(bash "$SKILL_ROOT/scripts/record_spawn_completion.sh" phase1 BCIN-99 "$project_dir")"
  assert_contains "$output" "SPAWN_HISTORY_RECORDED"

  local spawn_history
  spawn_history="$(jq -c '.spawn_history' "$project_dir/run.json")"
  assert_contains "$spawn_history" "jira"
  assert_contains "$spawn_history" "jira_issue_BCIN-99"
  assert_contains "$spawn_history" "jira_related_issues_BCIN-99"
}

test_record_spawn_completion
