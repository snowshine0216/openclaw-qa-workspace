#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_success_promotion() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-100)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-100","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r1.md","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-100","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'old final\n' > "$project_dir/qa_plan_final.md"
  printf 'phase6 final\n' > "$project_dir/drafts/qa_plan_phase6_r1.md"

  local output
  output="$(
    FQPO_FEISHU_NOTIFY_CMD="false" \
    bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-100 "$project_dir"
  )"

  assert_contains "$output" "FEISHU_NOTIFY_FAILED"
  assert_file_exists "$project_dir/qa_plan_final.md"
  assert_contains "$(cat "$project_dir/qa_plan_final.md")" "phase6 final"
}

test_feishu_failure_warning() {
  test_success_promotion
}

test_promotes_latest_round_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-101)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-101","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r2.md","latest_draft_phase":"phase6","phase6_round":2,"updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-101","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'round1\n' > "$project_dir/drafts/qa_plan_phase6_r1.md"
  printf 'round2\n' > "$project_dir/drafts/qa_plan_phase6_r2.md"

  FQPO_FEISHU_NOTIFY_CMD="false" \
    bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-101 "$project_dir" >/dev/null

  assert_contains "$(cat "$project_dir/qa_plan_final.md")" "round2"
}

test_success_promotion
test_feishu_failure_warning
test_promotes_latest_round_draft
