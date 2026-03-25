#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase1_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-30)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-30",
    "requested_source_families":["jira","github"],
    "supporting_issue_keys":["BCED-2416"],
    "supporting_issue_policy":"context_only_no_defect_analysis",
    "request_requirements":[
      {
        "requirement_id":"req-support-aggregate",
        "kind":"summarize_material",
        "required_phase":"phase1",
        "required_artifacts":["context/supporting_issue_summary_BCIN-30.md"],
        "blocking_on_missing":true
      }
    ],
    "current_phase":"phase_0_runtime_setup",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  write_run_json "$run_dir/run.json" '{
    "run_key":"run-30",
    "has_supporting_artifacts":true,
    "spawn_history":[],
    "request_execution_log":[],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  cat > "$run_dir/context/request_fulfillment_BCIN-30.json" <<'EOF'
{
  "feature_id":"BCIN-30",
  "requirements":[
    {
      "requirement_id":"req-support-aggregate",
      "required_phase":"phase1",
      "blocking_on_missing":true,
      "required_artifacts":["context/supporting_issue_summary_BCIN-30.md"],
      "status":"pending",
      "evidence_artifacts":[]
    }
  ]
}
EOF
  printf '%s\n' "$run_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase1_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase1.sh" BCIN-30 "$run_dir")"

  assert_contains "$output" "SPAWN_MANIFEST:"
  assert_file_exists "$run_dir/phase1_spawn_manifest.json"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase1_project "$temp_dir")"
  write_run_json "$run_dir/run.json" '{
    "run_key":"run-30",
    "has_supporting_artifacts":true,
    "spawn_history":[
      {"source_family":"jira","approved_skill":"jira-cli","artifact_paths":["context/jira_issue_BCIN-30.md","context/jira_related_issues_BCIN-30.md"],"status":"completed","disallowed_tools":["browser fetch","generic web fetch"]},
      {"source_family":"github","approved_skill":"github","artifact_paths":["context/github_diff_BCIN-30.md","context/github_traceability_BCIN-30.md"],"status":"completed","disallowed_tools":["browser fetch","generic web fetch"]}
    ],
    "request_execution_log":[],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  printf '# Support relation map\n' > "$run_dir/context/supporting_issue_relation_map_BCIN-30.md"
  printf '# Support issue\n' > "$run_dir/context/supporting_issue_summary_BCED-2416_BCIN-30.md"
  printf '# Aggregate support\n' > "$run_dir/context/supporting_issue_summary_BCIN-30.md"

  bash "$SKILL_ROOT/scripts/phase1.sh" BCIN-30 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_1_evidence_gathering"'
  assert_contains "$(cat "$run_dir/context/request_fulfillment_BCIN-30.json")" '"status": "satisfied"'
}

test_post_validation_fail() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase1_project "$temp_dir")"
  write_run_json "$run_dir/run.json" '{
    "run_key":"run-30",
    "has_supporting_artifacts":true,
    "spawn_history":[
      {"source_family":"jira","approved_skill":"jira-cli","artifact_paths":["context/jira_issue_BCIN-30.md"],"status":"completed","disallowed_tools":["browser fetch"]}
    ],
    "request_execution_log":[],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'

  set +e
  local output
  output="$(bash "$SKILL_ROOT/scripts/phase1.sh" BCIN-30 "$run_dir" --post 2>&1)"
  local code=$?
  set -e

  assert_exit_code 2 "$code"
  assert_contains "$output" "REMEDIATION_REQUIRED:"
}

test_success_manifest_output
test_post_validation_pass
test_post_validation_fail
