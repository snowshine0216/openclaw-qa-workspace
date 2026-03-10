#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase1_project() {
  local temp_dir="$1"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-30)"
  write_task_json "$project_dir/task.json" '{
    "feature_id":"BCIN-30",
    "requested_source_families":["jira","github"],
    "current_phase":"phase_0_runtime_setup",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  write_run_json "$project_dir/run.json" '{"run_key":"run-30","has_supporting_artifacts":false,"spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '%s\n' "$project_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase1_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase1.sh" BCIN-30 "$project_dir")"

  assert_contains "$output" "SPAWN_MANIFEST:"
  assert_file_exists "$project_dir/phase1_spawn_manifest.json"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase1_project "$temp_dir")"
  write_run_json "$project_dir/run.json" '{
    "run_key":"run-30",
    "has_supporting_artifacts":false,
    "spawn_history":[
      {"source_family":"jira","approved_skill":"jira-cli","artifact_paths":["context/jira_issue_BCIN-30.md","context/jira_related_issues_BCIN-30.md"],"status":"completed","disallowed_tools":["browser fetch","generic web fetch"]},
      {"source_family":"github","approved_skill":"github","artifact_paths":["context/github_diff_BCIN-30.md","context/github_traceability_BCIN-30.md"],"status":"completed","disallowed_tools":["browser fetch","generic web fetch"]}
    ],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'

  bash "$SKILL_ROOT/scripts/phase1.sh" BCIN-30 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_1_evidence_gathering"'
}

test_post_validation_fail() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase1_project "$temp_dir")"
  write_run_json "$project_dir/run.json" '{
    "run_key":"run-30",
    "has_supporting_artifacts":false,
    "spawn_history":[
      {"source_family":"jira","approved_skill":"jira-cli","artifact_paths":["context/jira_issue_BCIN-30.md"],"status":"completed","disallowed_tools":["browser fetch"]}
    ],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'

  set +e
  local output
  output="$(bash "$SKILL_ROOT/scripts/phase1.sh" BCIN-30 "$project_dir" --post 2>&1)"
  local code=$?
  set -e

  assert_exit_code 2 "$code"
  assert_contains "$output" "REMEDIATION_REQUIRED:"
}

test_success_manifest_output
test_post_validation_pass
test_post_validation_fail
