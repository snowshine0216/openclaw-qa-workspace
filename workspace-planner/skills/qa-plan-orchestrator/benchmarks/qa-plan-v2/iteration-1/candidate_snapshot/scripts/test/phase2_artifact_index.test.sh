#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_artifact_index_builds_lookup() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-40)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-40",
    "current_phase":"phase_1_evidence_gathering",
    "request_requirements":[
      {
        "requirement_id":"req-support",
        "required_artifacts":["context/supporting_issue_summary_BCIN-40.md"],
        "required_phase":"phase2",
        "blocking_on_missing":true
      }
    ],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  write_run_json "$run_dir/run.json" '{"run_key":"run-40","updated_at":"2026-03-10T00:00:00.000Z"}'
  cat > "$run_dir/context/request_fulfillment_BCIN-40.json" <<'EOF'
{
  "feature_id":"BCIN-40",
  "requirements":[
    {
      "requirement_id":"req-support",
      "required_phase":"phase2",
      "blocking_on_missing":true,
      "required_artifacts":["context/supporting_issue_summary_BCIN-40.md"],
      "status":"pending",
      "evidence_artifacts":[]
    }
  ]
}
EOF
  printf 'jira\n' > "$run_dir/context/jira_issue_BCIN-40.md"
  printf 'github\n' > "$run_dir/context/github_diff_BCIN-40.md"
  printf 'support\n' > "$run_dir/context/supporting_issue_summary_BCIN-40.md"
  printf 'synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-40.md"

  bash "$SKILL_ROOT/scripts/phase2.sh" BCIN-40 "$run_dir" >/dev/null
  assert_file_exists "$run_dir/context/artifact_lookup_BCIN-40.md"
  assert_contains "$(cat "$run_dir/context/artifact_lookup_BCIN-40.md")" "jira_context"
  assert_contains "$(cat "$run_dir/context/artifact_lookup_BCIN-40.md")" "Artifact Kind"
  assert_contains "$(cat "$run_dir/context/artifact_lookup_BCIN-40.md")" "Requirement IDs"
  assert_contains "$(cat "$run_dir/context/artifact_lookup_BCIN-40.md")" "supporting_issue_summary"
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_2_artifact_index"'
  assert_contains "$(cat "$run_dir/context/request_fulfillment_BCIN-40.json")" '"status": "satisfied"'
}

test_phase2_does_not_require_future_phase3_artifacts() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-41)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-41",
    "supporting_issue_keys":["BCED-2416"],
    "current_phase":"phase_1_evidence_gathering",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  write_run_json "$run_dir/run.json" '{"run_key":"run-41","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'jira\n' > "$run_dir/context/jira_issue_BCIN-41.md"
  printf 'jira related\n' > "$run_dir/context/jira_related_issues_BCIN-41.md"
  printf 'support request\n' > "$run_dir/context/supporting_issue_request_BCIN-41.md"

  bash "$SKILL_ROOT/scripts/phase2.sh" BCIN-41 "$run_dir" >/dev/null
  assert_file_exists "$run_dir/context/artifact_lookup_BCIN-41.md"
}

test_artifact_index_builds_lookup
test_phase2_does_not_require_future_phase3_artifacts
