#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_success_full_run() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-20)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-20",
    "requested_knowledge_pack_key":"report-editor",
    "requested_source_families":["jira","confluence"],
    "seed_confluence_url":"https://example.atlassian.net/wiki/spaces/BCIN/pages/20",
    "supporting_issue_keys":["BCED-2416"],
    "overall_status":"not_started",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'

  local output
  output="$(
    JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    CONFLUENCE_BIN="$temp_dir/bin/confluence" \
    FQPO_RUN_KEY="run-20" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-20 "$run_dir"
  )"

  assert_contains "$output" "PHASE_0_COMPLETE"
  assert_file_exists "$run_dir/context/runtime_setup_BCIN-20.md"
  assert_file_exists "$run_dir/context/supporting_issue_request_BCIN-20.md"
  assert_file_exists "$run_dir/context/request_fulfillment_BCIN-20.md"
  assert_file_exists "$run_dir/context/request_fulfillment_BCIN-20.json"
  assert_file_exists "$run_dir/context/knowledge_pack_summary_BCIN-20.md"
  assert_file_exists "$run_dir/context/knowledge_pack_summary_BCIN-20.json"
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_0_runtime_setup"'
  assert_contains "$(cat "$run_dir/task.json")" '"knowledge_pack_key": "report-editor"'
  assert_contains "$(cat "$run_dir/task.json")" '"resolved_knowledge_pack_key": "report-editor"'
  assert_contains "$(cat "$run_dir/task.json")" '"knowledge_pack_resolution_source": "provided"'
  assert_contains "$(cat "$run_dir/task.json")" '"supporting_issue_policy": "context_only_no_defect_analysis"'
  assert_contains "$(cat "$run_dir/task.json")" '"deep_research_policy": "tavily_first_confluence_second"'
  assert_contains "$(cat "$run_dir/task.json")" '"report_editor_workstation_functionality"'
  assert_contains "$(cat "$run_dir/context/runtime_setup_BCIN-20.md")" "support issue policy"
  assert_contains "$(cat "$run_dir/context/knowledge_pack_summary_BCIN-20.md")" "report-editor"
  assert_contains "$(cat "$run_dir/context/knowledge_pack_summary_BCIN-20.json")" '"knowledge_pack_row_count"'
  assert_contains "$(cat "$run_dir/run.json")" '"knowledge_pack_loaded_at"'
  assert_contains "$(cat "$run_dir/run.json")" '"knowledge_pack_summary_generated_at"'
  assert_contains "$(cat "$run_dir/context/request_fulfillment_BCIN-20.json")" '"requirement_id": "req-support-only-mode"'
  assert_contains "$(cat "$run_dir/context/request_fulfillment_BCIN-20.json")" '"status": "satisfied"'
}

test_preserves_preseeded_request_contracts() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-25)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-25",
    "requested_knowledge_pack_key":"report-editor",
    "requested_source_families":["jira"],
    "request_materials":[
      {
        "material_id":"material-inline-spec",
        "material_type":"inline_note",
        "source_value":"custom operator note",
        "role":"operator_override",
        "must_read":true,
        "must_summarize":false
      }
    ],
    "request_commands":[
      {
        "command_id":"cmd-custom-preserve-me",
        "policy_type":"operator_guardrail",
        "command_text":"preserve this custom command",
        "enforced_by_phase":"phase3",
        "failure_message":"custom command missing"
      }
    ],
    "request_requirements":[
      {
        "requirement_id":"req-custom-preserve-me",
        "kind":"read_material",
        "user_text":"preserve this custom requirement",
        "required_phase":"phase3",
        "required_artifacts":["context/custom_requirement_BCIN-25.md"],
        "success_predicate":"custom requirement remains tracked",
        "blocking_on_missing":true
      }
    ],
    "overall_status":"not_started",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'

  JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    FQPO_RUN_KEY="run-25" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-25 "$run_dir" >/dev/null

  assert_contains "$(cat "$run_dir/task.json")" '"material-inline-spec"'
  assert_contains "$(cat "$run_dir/task.json")" '"cmd-custom-preserve-me"'
  assert_contains "$(cat "$run_dir/task.json")" '"req-custom-preserve-me"'
}

test_concurrent_run_blocked() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-21)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-21","requested_source_families":["jira"],"overall_status":"in_progress","run_key":"existing-run","updated_at":"2026-03-10T00:00:00.000Z"}'

  set +e
  JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    FQPO_RUN_KEY="new-run" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-21 "$run_dir" >/tmp/phase0-concurrent.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$(cat /tmp/phase0-concurrent.stderr)" "CONCURRENT_RUN_BLOCKED"
}

test_script_failure() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-22)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-22","requested_source_families":["jira"],"overall_status":"not_started","updated_at":"2026-03-10T00:00:00.000Z"}'

  set +e
  JIRA_CLI_SCRIPT="$temp_dir/bin/missing-jira-run.sh" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-22 "$run_dir" >/tmp/phase0-failure.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
}

test_support_issue_defect_analysis_conflict() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-23)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-23",
    "requested_source_families":["jira"],
    "supporting_issue_keys":["BCED-2416"],
    "defect_analysis_mode":true,
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'

  set +e
  JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-23 "$run_dir" >/tmp/phase0-support-conflict.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$(cat /tmp/phase0-support-conflict.stderr)" "support-only issue"
}

test_reuse_preserves_existing_request_fulfillment() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  setup_fake_tooling "$temp_dir/bin"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-24)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-24",
    "requested_source_families":["jira"],
    "supporting_issue_keys":["BCED-2416"],
    "overall_status":"not_started",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  cat > "$run_dir/context/request_fulfillment_BCIN-24.json" <<'EOF'
{
  "feature_id":"BCIN-24",
  "requirements":[
    {
      "requirement_id":"req-save-support-summary",
      "required_phase":"phase1",
      "blocking_on_missing":true,
      "required_artifacts":["context/supporting_issue_summary_BCIN-24.md"],
      "status":"satisfied",
      "evidence_artifacts":["context/supporting_issue_summary_BCIN-24.md"]
    }
  ]
}
EOF

  JIRA_CLI_SCRIPT="$temp_dir/bin/jira-run.sh" \
    bash "$SKILL_ROOT/scripts/phase0.sh" BCIN-24 "$run_dir" >/dev/null

  assert_contains "$(cat "$run_dir/context/request_fulfillment_BCIN-24.json")" '"status": "satisfied"'
}

test_success_full_run
test_preserves_preseeded_request_contracts
test_concurrent_run_blocked
test_script_failure
test_support_issue_defect_analysis_conflict
test_reuse_preserves_existing_request_fulfillment
