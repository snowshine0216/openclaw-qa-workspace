#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase4a_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-60)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-60","current_phase":"phase_3_coverage_mapping","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-60","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$run_dir/context/artifact_lookup_BCIN-60.md"
  printf '# Jira Issue\n\n## Feature Summary\n- sign in\n' > "$run_dir/context/jira_issue_BCIN-60.md"
  printf '# Support summary\n' > "$run_dir/context/supporting_issue_summary_BCIN-60.md"
  printf '# Research synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-60.md"
  printf '%s\n' "$run_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4a_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$run_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4a_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-60)

<!-- trace: supporting_issue_summary_BCIN-60.md -->
<!-- trace: deep_research_synthesis_report_editor_BCIN-60.md -->
- Report editor
    * Workstation editing stays available <P1>
        - Open the Workstation report editor
            - Update the report content
                - Save the report
                    - Workstation keeps the editor open
    * Library-vs-Workstation gap stays visible <P1>
        - Open the embedded Library report editor
            - Compare the available editor actions with Workstation
                - Record the Library-vs-Workstation gap
                    - Gap-specific expectations remain visible
EOF

  bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_4a_subcategory_draft"'
}

test_post_validation_rejects_top_layer_leak() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4a_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-60)

- Security
    * Authentication guardrails <P1>
        - Open the login page
            - Click "Sign In"
                - Inline password error appears
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_prefers_latest_round_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4a_project "$temp_dir")"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-60","current_phase":"phase_3_coverage_mapping","latest_draft_phase":"phase4a","latest_draft_path":"drafts/qa_plan_phase4a_r1.md","phase4a_round":1,"updated_at":"2026-03-10T00:00:00.000Z"}'
  cat > "$run_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-60)

- Authentication <P1>
    * Old draft
        - Open the login page
            - Inline password error appears
EOF
  cat > "$run_dir/drafts/qa_plan_phase4a_r2.md" <<'EOF'
Feature QA Plan (BCIN-60)

<!-- trace: supporting_issue_summary_BCIN-60.md -->
<!-- trace: deep_research_synthesis_report_editor_BCIN-60.md -->
- Report editor
    * Workstation editing stays available <P1>
        - Open the Workstation report editor
            - Update the report content
                - Save the report
                    - Workstation keeps the editor open
    * Library-vs-Workstation gap stays visible <P1>
        - Open the embedded Library report editor
            - Compare the available editor actions with Workstation
                - Record the Library-vs-Workstation gap
                    - Gap-specific expectations remain visible
EOF

  bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"latest_draft_path": "/'
  assert_contains "$(cat "$run_dir/task.json")" 'qa_plan_phase4a_r2.md'
  assert_contains "$(cat "$run_dir/task.json")" '"phase4a_round": 2'
}

test_success_manifest_output
test_post_validation_pass
test_post_validation_rejects_top_layer_leak
test_post_validation_prefers_latest_round_draft
