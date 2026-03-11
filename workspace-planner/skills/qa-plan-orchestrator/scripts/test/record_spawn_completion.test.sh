#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_record_spawn_completion() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-99)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-99","requested_source_families":["jira"],"updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-99","has_supporting_artifacts":false,"spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'

  # Create phase1 manifest
  printf '%s\n' '{
    "version": 1,
    "source_kind": "feature-qa-planning",
    "count": 1,
    "requests": [{
      "source": {"kind": "feature-qa-planning", "source_family": "jira", "feature_id": "BCIN-99"}
    }]
  }' > "$run_dir/phase1_spawn_manifest.json"

  # Create fake jira artifacts
  printf '%s\n' '# Main issue' > "$run_dir/context/jira_issue_BCIN-99.md"
  printf '%s\n' '# Related issues' > "$run_dir/context/jira_related_issues_BCIN-99.md"

  local output
  output="$(bash "$SKILL_ROOT/scripts/record_spawn_completion.sh" phase1 BCIN-99 "$run_dir")"
  assert_contains "$output" "SPAWN_HISTORY_RECORDED"

  local spawn_history
  spawn_history="$(jq -c '.spawn_history' "$run_dir/run.json")"
  assert_contains "$spawn_history" "jira"
  assert_contains "$spawn_history" "jira_issue_BCIN-99"
  assert_contains "$spawn_history" "jira_related_issues_BCIN-99"
}

test_record_spawn_completion_supporting_issue_request() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-98)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-98","requested_source_families":["jira"],"updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-98","has_supporting_artifacts":true,"spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'

  printf '%s\n' '{
    "version": 1,
    "source_kind": "feature-qa-planning",
    "count": 2,
    "requests": [
      {
        "source": {"kind": "feature-qa-planning", "source_family": "jira", "feature_id": "BCIN-98"}
      },
      {
        "source": {
          "kind": "supporting-issue-context",
          "feature_id": "BCIN-98",
          "supporting_issue_key": "BCED-2416",
          "request_requirement_ids": ["req-support"],
          "output_artifact_paths": [
            "context/supporting_issue_relation_map_BCIN-98.md",
            "context/supporting_issue_summary_BCED-2416_BCIN-98.md",
            "context/supporting_issue_summary_BCIN-98.md"
          ]
        }
      }
    ]
  }' > "$run_dir/phase1_spawn_manifest.json"

  printf '%s\n' '# Main issue' > "$run_dir/context/jira_issue_BCIN-98.md"
  printf '%s\n' '# Related issues' > "$run_dir/context/jira_related_issues_BCIN-98.md"
  printf '%s\n' '# Relation map' > "$run_dir/context/supporting_issue_relation_map_BCIN-98.md"
  printf '%s\n' '# Support summary' > "$run_dir/context/supporting_issue_summary_BCED-2416_BCIN-98.md"
  printf '%s\n' '# Aggregate support summary' > "$run_dir/context/supporting_issue_summary_BCIN-98.md"

  bash "$SKILL_ROOT/scripts/record_spawn_completion.sh" phase1 BCIN-98 "$run_dir" >/dev/null

  local spawn_history
  spawn_history="$(jq -c '.spawn_history' "$run_dir/run.json")"
  assert_contains "$spawn_history" "supporting-issue-context"
  assert_contains "$spawn_history" "supporting_issue_relation_map_BCIN-98"
  assert_contains "$spawn_history" "req-support"
}

test_record_spawn_completion
test_record_spawn_completion_supporting_issue_request
