#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase6_project() {
  local temp_dir="$1"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-90)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-90","current_phase":"phase_5_review_refactor","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-90","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$project_dir/context/artifact_lookup_BCIN-90.md"
  printf 'before\n' > "$project_dir/drafts/qa_plan_v2.md"
  printf '%s\n' "$project_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase6_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase6.sh" BCIN-90 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase6_project "$temp_dir")"
  cat > "$project_dir/drafts/qa_plan_v3.md" <<'EOF'
Feature QA Plan (BCIN-90)

- High
    * Account access <P1>
        - Sign in with valid credentials
            - Click "Sign In"
                - Dashboard loads successfully
                - Welcome banner shows the user name
- Medium
    * Notifications <P2>
        - Open notifications panel
            - Click the unread item
                - Notification details drawer opens
EOF
  cat > "$project_dir/context/quality_delta_BCIN-90.md" <<'EOF'
# Review Delta

## Blocking Findings Resolution
- Q1 | Prior title | Updated title | Tightened atomic steps | resolved
EOF

  bash "$SKILL_ROOT/scripts/phase6.sh" BCIN-90 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_6_quality_refactor"'
}

test_success_manifest_output
test_post_validation_pass
