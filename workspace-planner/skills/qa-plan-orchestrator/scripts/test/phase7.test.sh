#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

test_success_promotion() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-100)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-100","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r1.md","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-100","unsatisfied_request_requirements":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'old final\n' > "$run_dir/qa_plan_final.md"
  printf 'phase6 final\n' > "$run_dir/drafts/qa_plan_phase6_r1.md"
  printf '# Support summary\n' > "$run_dir/context/supporting_issue_summary_BCIN-100.md"
  printf '# Deep research synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-100.md"
  cat > "$run_dir/context/request_fulfillment_BCIN-100.json" <<'EOF'
{"feature_id":"BCIN-100","requirements":[{"requirement_id":"req-1","blocking_on_missing":true,"status":"satisfied","required_artifacts":["context/supporting_issue_summary_BCIN-100.md"]}]}
EOF

  local output
  output="$(
    FQPO_FEISHU_NOTIFY_CMD="false" \
    bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-100 "$run_dir"
  )"

  assert_contains "$output" "FEISHU_NOTIFY_FAILED"
  assert_file_exists "$run_dir/qa_plan_final.md"
  assert_contains "$(cat "$run_dir/qa_plan_final.md")" "phase6 final"
  assert_contains "$(cat "$run_dir/context/finalization_record_BCIN-100.md")" "Supporting Context Lineage"
  assert_contains "$(cat "$run_dir/run.json")" '"notification_pending"'
}

test_feishu_failure_warning() {
  test_success_promotion
}

test_promotes_latest_round_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-101)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-101","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r2.md","latest_draft_phase":"phase6","phase6_round":2,"updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-101","unsatisfied_request_requirements":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'round1\n' > "$run_dir/drafts/qa_plan_phase6_r1.md"
  printf 'round2\n' > "$run_dir/drafts/qa_plan_phase6_r2.md"
  printf '# Support summary\n' > "$run_dir/context/supporting_issue_summary_BCIN-101.md"
  printf '# Deep research synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-101.md"
  cat > "$run_dir/context/request_fulfillment_BCIN-101.json" <<'EOF'
{"feature_id":"BCIN-101","requirements":[{"requirement_id":"req-1","blocking_on_missing":true,"status":"satisfied","required_artifacts":["context/supporting_issue_summary_BCIN-101.md"]}]}
EOF

  FQPO_FEISHU_NOTIFY_CMD="false" \
    bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-101 "$run_dir" >/dev/null

  assert_contains "$(cat "$run_dir/qa_plan_final.md")" "round2"
}

test_blocks_promotion_when_request_requirements_unsatisfied() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-102)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-102","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r1.md","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-102","unsatisfied_request_requirements":["req-blocking"],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'phase6 final\n' > "$run_dir/drafts/qa_plan_phase6_r1.md"
  cat > "$run_dir/context/request_fulfillment_BCIN-102.json" <<'EOF'
{"feature_id":"BCIN-102","requirements":[{"requirement_id":"req-blocking","blocking_on_missing":true,"status":"pending","required_artifacts":["context/supporting_issue_summary_BCIN-102.md"]}]}
EOF

  set +e
  FQPO_FEISHU_NOTIFY_CMD="false" \
    bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-102 "$run_dir" >/tmp/phase7-unsatisfied.stderr 2>&1
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$(cat /tmp/phase7-unsatisfied.stderr)" "unsatisfied"
}

test_promotion_uses_request_fulfillment_json_over_stale_run_cache() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-103)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-103","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r1.md","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-103","unsatisfied_request_requirements":["req-waived"],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'phase6 final\n' > "$run_dir/drafts/qa_plan_phase6_r1.md"
  cat > "$run_dir/context/request_fulfillment_BCIN-103.json" <<'EOF'
{"feature_id":"BCIN-103","requirements":[{"requirement_id":"req-waived","blocking_on_missing":true,"status":"explicitly_waived_by_user","required_artifacts":["context/supporting_issue_summary_BCIN-103.md"]}]}
EOF

  FQPO_FEISHU_NOTIFY_CMD="false" \
    bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-103 "$run_dir" >/dev/null

  assert_contains "$(cat "$run_dir/qa_plan_final.md")" "phase6 final"
}

test_blocks_promotion_when_required_artifact_deleted() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-104)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-104","current_phase":"phase_6_quality_refactor","overall_status":"awaiting_approval","latest_draft_path":"drafts/qa_plan_phase6_r1.md","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-104","unsatisfied_request_requirements":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'phase6 final\n' > "$run_dir/drafts/qa_plan_phase6_r1.md"
  mkdir -p "$run_dir/context"
  printf '# Support summary\n' > "$run_dir/context/supporting_issue_summary_BCIN-104.md"
  cat > "$run_dir/context/request_fulfillment_BCIN-104.json" <<'EOF'
{"feature_id":"BCIN-104","requirements":[{"requirement_id":"req-1","blocking_on_missing":true,"status":"satisfied","evidence_artifacts":["context/supporting_issue_summary_BCIN-104.md"],"required_artifacts":["context/supporting_issue_summary_BCIN-104.md"]}]}
EOF
  rm -f "$run_dir/context/supporting_issue_summary_BCIN-104.md"

  set +e
  local output
  output="$(FQPO_FEISHU_NOTIFY_CMD="false" bash "$SKILL_ROOT/scripts/phase7.sh" BCIN-104 "$run_dir" 2>&1)"
  local code=$?
  set -e

  assert_exit_code 1 "$code"
  assert_contains "$output" "no longer exists"
  assert_contains "$output" "req-1"
}

test_success_promotion
test_feishu_failure_warning
test_promotes_latest_round_draft
test_blocks_promotion_when_request_requirements_unsatisfied
test_promotion_uses_request_fulfillment_json_over_stale_run_cache
test_blocks_promotion_when_required_artifact_deleted
