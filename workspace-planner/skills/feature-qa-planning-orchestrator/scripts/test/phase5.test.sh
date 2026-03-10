#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase5_project() {
  local temp_dir="$1"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-80)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_4b_top_category_draft","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-80","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$project_dir/context/artifact_lookup_BCIN-80.md"
  printf 'before\n' > "$project_dir/drafts/qa_plan_v1.md"
  printf '%s\n' "$project_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5.sh" BCIN-80 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5_project "$temp_dir")"
  printf 'after\n' > "$project_dir/drafts/qa_plan_v2.md"
  printf '# Review Notes\n' > "$project_dir/context/review_notes_BCIN-80.md"
  cat > "$project_dir/context/review_delta_BCIN-80.md" <<'EOF'
# Review Delta

## Blocking Findings Resolution
- RR1 | Old title | New title | Added missing scenario | resolved
EOF

  bash "$SKILL_ROOT/scripts/phase5.sh" BCIN-80 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_5_review_refactor"'
}

test_success_manifest_output
test_post_validation_pass
