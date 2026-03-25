#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase3_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-50)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-50",
    "current_phase":"phase_2_artifact_index",
    "knowledge_pack_key":"report-editor",
    "resolved_knowledge_pack_key":"report-editor",
    "knowledge_pack_version":"2026-03-23",
    "knowledge_pack_path":"workspace-planner/skills/qa-plan-orchestrator/knowledge-packs/report-editor/pack.json",
    "deep_research_topics":[
      "report_editor_workstation_functionality",
      "report_editor_library_vs_workstation_gap"
    ],
    "request_requirements":[
      {
        "requirement_id":"req-research-workstation",
        "required_phase":"phase3",
        "required_artifacts":["context/deep_research_tavily_report_editor_workstation_BCIN-50.md"],
        "blocking_on_missing":true
      },
      {
        "requirement_id":"req-research-gap",
        "required_phase":"phase3",
        "required_artifacts":["context/deep_research_tavily_library_vs_workstation_gap_BCIN-50.md"],
        "blocking_on_missing":true
      }
    ],
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  write_run_json "$run_dir/run.json" '{"run_key":"run-50","spawn_history":[],"request_execution_log":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n\n| # | Artifact Key | File Path | Artifact Kind | Source Family | Policy Tag | Source Phase | Phase Required By | Requirement IDs | Satisfies User Request | Phase 4a | Phase 4b | Phase 5a | Phase 5b | Phase 6 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| 1 | `jira_context` | `context/jira_issue_BCIN-50.md` | jira_issue | jira | primary | Phase 1 | phase3 | `req-research-workstation` | yes | ❌ | ❌ | ❌ | ❌ | ❌ |\n' > "$run_dir/context/artifact_lookup_BCIN-50.md"
  printf '# Jira issue\nBCIN-7730 prompt pause mode\nsetWindowTitle\n' > "$run_dir/context/jira_issue_BCIN-50.md"
  printf '# Pack summary\n' > "$run_dir/context/knowledge_pack_summary_BCIN-50.md"
  printf '{"knowledge_pack_key":"report-editor"}\n' > "$run_dir/context/knowledge_pack_summary_BCIN-50.json"
  cat > "$run_dir/context/request_fulfillment_BCIN-50.json" <<'EOF'
{
  "feature_id":"BCIN-50",
  "requirements":[
    {
      "requirement_id":"req-research-workstation",
      "required_phase":"phase3",
      "blocking_on_missing":true,
      "required_artifacts":["context/deep_research_tavily_report_editor_workstation_BCIN-50.md"],
      "status":"pending",
      "evidence_artifacts":[]
    },
    {
      "requirement_id":"req-research-gap",
      "required_phase":"phase3",
      "blocking_on_missing":true,
      "required_artifacts":["context/deep_research_tavily_library_vs_workstation_gap_BCIN-50.md"],
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
  run_dir="$(prepare_phase3_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-50 "$run_dir")"

  assert_contains "$output" "SPAWN_MANIFEST:"
  assert_file_exists "$run_dir/phase3_spawn_manifest.json"
  assert_file_exists "$run_dir/context/knowledge_pack_retrieval_BCIN-50.md"
  assert_file_exists "$run_dir/context/knowledge_pack_retrieval_BCIN-50.json"
  assert_file_exists "$run_dir/context/coverage_ledger_BCIN-50.md"
  assert_file_exists "$run_dir/context/coverage_ledger_BCIN-50.json"
  assert_file_exists "$run_dir/context/knowledge_pack_qmd.sqlite"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase3_project "$temp_dir")"
  cat > "$run_dir/context/coverage_ledger_BCIN-50.md" <<'EOF'
# Coverage Ledger

## Scenario Mapping Table
- C1 | EndToEnd | Main flow | standalone | covered
EOF
  printf '# Research plan\n' > "$run_dir/context/deep_research_plan_BCIN-50.md"
  cat > "$run_dir/context/deep_research_execution_BCIN-50.json" <<'EOF'
{"steps":[
  {"step":1,"topic_slug":"report_editor_workstation_functionality","tool":"tavily-search","status":"satisfied","artifacts":["context/deep_research_tavily_report_editor_workstation_BCIN-50.md"]},
  {"step":2,"topic_slug":"report_editor_library_vs_workstation_gap","tool":"tavily-search","status":"satisfied","artifacts":["context/deep_research_tavily_library_vs_workstation_gap_BCIN-50.md"]}
]}
EOF
  printf 'Tavily evidence\n' > "$run_dir/context/deep_research_tavily_report_editor_workstation_BCIN-50.md"
  printf 'Tavily evidence\n' > "$run_dir/context/deep_research_tavily_library_vs_workstation_gap_BCIN-50.md"
  printf '# Synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-50.md"

  bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-50 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_3_coverage_mapping"'
  assert_contains "$(cat "$run_dir/context/request_fulfillment_BCIN-50.json")" '"status": "satisfied"'
}

test_post_validation_requires_tavily_first() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase3_project "$temp_dir")"
  cat > "$run_dir/context/coverage_ledger_BCIN-50.md" <<'EOF'
# Coverage Ledger

## Scenario Mapping Table
- C1 | EndToEnd | Main flow | standalone | covered
EOF
  printf '# Research plan\n' > "$run_dir/context/deep_research_plan_BCIN-50.md"
  cat > "$run_dir/context/deep_research_execution_BCIN-50.json" <<'EOF'
{"steps":[
  {"step":1,"topic_slug":"report_editor_workstation_functionality","tool":"confluence","status":"satisfied","artifacts":["context/deep_research_confluence_report_editor_workstation_BCIN-50.md"]},
  {"step":2,"topic_slug":"report_editor_workstation_functionality","tool":"tavily-search","status":"satisfied","artifacts":["context/deep_research_tavily_report_editor_workstation_BCIN-50.md"]}
]}
EOF
  printf 'Fallback confluence evidence\n' > "$run_dir/context/deep_research_confluence_report_editor_workstation_BCIN-50.md"
  printf '# Synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-50.md"

  set +e
  local output
  output="$(bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-50 "$run_dir" --post 2>&1)"
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$output" "Tavily"
}

test_post_validation_requires_deep_research_plan() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase3_project "$temp_dir")"
  cat > "$run_dir/context/coverage_ledger_BCIN-50.md" <<'EOF'
# Coverage Ledger

## Scenario Mapping Table
- C1 | EndToEnd | Main flow | standalone | covered
EOF
  cat > "$run_dir/context/deep_research_execution_BCIN-50.json" <<'EOF'
{"steps":[
  {"step":1,"topic_slug":"report_editor_workstation_functionality","tool":"tavily-search","status":"satisfied","artifacts":["context/deep_research_tavily_report_editor_workstation_BCIN-50.md"]},
  {"step":2,"topic_slug":"report_editor_library_vs_workstation_gap","tool":"tavily-search","status":"satisfied","artifacts":["context/deep_research_tavily_library_vs_workstation_gap_BCIN-50.md"]}
]}
EOF
  printf 'Tavily evidence\n' > "$run_dir/context/deep_research_tavily_report_editor_workstation_BCIN-50.md"
  printf 'Tavily evidence\n' > "$run_dir/context/deep_research_tavily_library_vs_workstation_gap_BCIN-50.md"
  printf '# Synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-50.md"

  set +e
  local output
  output="$(bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-50 "$run_dir" --post 2>&1)"
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$output" "deep_research_plan"
}

test_post_validation_skips_research_validation_when_not_requested() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-51)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-51","current_phase":"phase_2_artifact_index","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-51","spawn_history":[],"request_execution_log":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$run_dir/context/artifact_lookup_BCIN-51.md"
  cat > "$run_dir/context/coverage_ledger_BCIN-51.md" <<'EOF'
# Coverage Ledger

## Scenario Mapping Table
- C1 | EndToEnd | Main flow | standalone | covered
EOF

  bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-51 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_3_coverage_mapping"'
}

test_completed_phase3_short_circuits_before_pack_preparation() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-52)"
  write_task_json "$run_dir/task.json" '{
    "feature_id":"BCIN-52",
    "current_phase":"phase_4a_subcategory_draft",
    "knowledge_pack_key":"missing-pack",
    "updated_at":"2026-03-10T00:00:00.000Z"
  }'
  write_run_json "$run_dir/run.json" '{"run_key":"run-52","spawn_history":[],"request_execution_log":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '{"version":1,"requests":[]}\n' > "$run_dir/phase3_spawn_manifest.json"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-52 "$run_dir")"

  assert_contains "$output" "PHASE_ALREADY_COMPLETE: phase3"
}

test_success_manifest_output
test_post_validation_pass
test_post_validation_requires_tavily_first
test_post_validation_requires_deep_research_plan
test_post_validation_skips_research_validation_when_not_requested
test_completed_phase3_short_circuits_before_pack_preparation
