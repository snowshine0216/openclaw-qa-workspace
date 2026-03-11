#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase4a_project() {
  local temp_dir="$1"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-60)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-60","current_phase":"phase_3_coverage_mapping","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-60","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$project_dir/context/artifact_lookup_BCIN-60.md"
  printf '# Jira Issue\n\n## Feature Summary\n- sign in\n' > "$project_dir/context/jira_issue_BCIN-60.md"
  printf '%s\n' "$project_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase4a_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase4a_project "$temp_dir")"
  cat > "$project_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-60)

- Authentication <P1>
    * Sign in with valid credentials
        - Open the login page
            - Enter a valid username
                - Enter a valid password
                    - Click "Sign In"
                        - Dashboard loads successfully
EOF

  bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_4a_subcategory_draft"'
}

test_post_validation_rejects_top_layer_leak() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase4a_project "$temp_dir")"
  cat > "$project_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-60)

- Security
    * Authentication guardrails <P1>
        - Open the login page
            - Click "Sign In"
                - Inline password error appears
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$project_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_prefers_latest_round_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase4a_project "$temp_dir")"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-60","current_phase":"phase_3_coverage_mapping","latest_draft_phase":"phase4a","latest_draft_path":"drafts/qa_plan_phase4a_r1.md","phase4a_round":1,"updated_at":"2026-03-10T00:00:00.000Z"}'
  cat > "$project_dir/drafts/qa_plan_phase4a_r1.md" <<'EOF'
Feature QA Plan (BCIN-60)

- Authentication <P1>
    * Old draft
        - Open the login page
            - Inline password error appears
EOF
  cat > "$project_dir/drafts/qa_plan_phase4a_r2.md" <<'EOF'
Feature QA Plan (BCIN-60)

- Authentication <P1>
    * Incorrect password blocks sign-in
        - Open the login page
            - Enter a valid username
                - Enter an incorrect password
                    - Click Sign in
                        - Inline password error appears
EOF

  bash "$SKILL_ROOT/scripts/phase4a.sh" BCIN-60 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"latest_draft_path": "/'
  assert_contains "$(cat "$project_dir/task.json")" 'qa_plan_phase4a_r2.md'
  assert_contains "$(cat "$project_dir/task.json")" '"phase4a_round": 2'
}

test_success_manifest_output
test_post_validation_pass
test_post_validation_rejects_top_layer_leak
test_post_validation_prefers_latest_round_draft
