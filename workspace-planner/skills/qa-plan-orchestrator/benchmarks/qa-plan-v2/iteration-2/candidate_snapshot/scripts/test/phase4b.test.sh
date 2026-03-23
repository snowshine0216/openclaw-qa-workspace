#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase4b_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-70)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-70","current_phase":"phase_4a_subcategory_draft","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-70","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  cat > "$run_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-70)

<!-- trace: supporting_issue_summary_BCIN-70.md -->
<!-- trace: deep_research_synthesis_report_editor_BCIN-70.md -->
- Report editor
    * Workstation editing stays available <P1>
        - Open the Workstation report editor
            - Save the report
                - Workstation keeps the editor open
    * Library-vs-Workstation gap stays visible <P1>
        - Open the embedded Library report editor
            - Compare the actions with Workstation
                - Library-vs-Workstation gap remains visible
EOF
  printf '%s\n' "$run_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4b_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase4b.sh" BCIN-70 "$run_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4b_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4b_r1.md" <<'EOF'
Feature QA Plan (BCIN-70)

<!-- trace: supporting_issue_summary_BCIN-70.md -->
<!-- trace: deep_research_synthesis_report_editor_BCIN-70.md -->
- EndToEnd
    * Workstation report editor
        - Workstation editing stays available <P1>
            - Open the Workstation report editor
                - Save the report
                    - Workstation keeps the editor open
- Core Functional Flows
    * Embedded report editor
        - Library-vs-Workstation gap stays visible <P2>
            - Open the embedded Library report editor
                - Compare the actions with Workstation
                    - Library-vs-Workstation gap remains visible
EOF

  bash "$SKILL_ROOT/scripts/phase4b.sh" BCIN-70 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_4b_top_category_draft"'
}

test_post_validation_rejects_noncanonical_layering() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4b_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4b_r1.md" <<'EOF'
Feature QA Plan (BCIN-70)

- Functional
    * Authentication <P1>
        - Open the login page
            - Enter valid credentials
                - Dashboard loads successfully
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase4b.sh" BCIN-70 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_rejects_silent_coverage_drop_from_phase4a() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase4b_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-70)

- Authentication
    * Sign in succeeds <P1>
        - Open the login page
            - Enter valid credentials
                - Dashboard loads successfully
- Notifications
    * Open unread notification details <P2>
        - Open notifications panel
            - Click the unread item
                - Notification details drawer opens
EOF
  cat > "$run_dir/drafts/qa_plan_phase4b_r1.md" <<'EOF'
Feature QA Plan (BCIN-70)

- EndToEnd
    * Authentication
        - Sign in succeeds <P1>
            - Open the login page
                - Enter valid credentials
                    - Dashboard loads successfully
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase4b.sh" BCIN-70 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_success_manifest_output
test_post_validation_pass
test_post_validation_rejects_noncanonical_layering
test_post_validation_rejects_silent_coverage_drop_from_phase4a
