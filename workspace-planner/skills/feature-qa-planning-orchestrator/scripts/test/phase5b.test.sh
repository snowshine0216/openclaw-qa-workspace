#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase5b_project() {
  local temp_dir="$1"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-85)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-85","current_phase":"phase_5a_review_refactor","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-85","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$project_dir/context/artifact_lookup_BCIN-85.md"
  printf '# Review Notes\n' > "$project_dir/context/review_notes_BCIN-85.md"
  printf '# Review Delta\n\n## Source Review\n- review_notes\n\n## Blocking Findings Resolution\n- none\n\n## Non-Blocking Findings Resolution\n- none\n\n## Still Open\n- none\n\n## Evidence Added / Removed\n- none\n\n## Verdict After Refactor\n- accept\n' > "$project_dir/context/review_delta_BCIN-85.md"
  printf 'before\n' > "$project_dir/drafts/qa_plan_phase5a_r1.md"
  printf '%s\n' "$project_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5b_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5b.sh" BCIN-85 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_rerun_manifest_output_when_return_to_phase5b_requested() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5b_project "$temp_dir")"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-85","current_phase":"phase_6_quality_refactor","return_to_phase":"phase5b","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '{"stale":true}\n' > "$project_dir/phase5b_spawn_manifest.json"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5b.sh" BCIN-85 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5b_project "$temp_dir")"
  printf 'after\n' > "$project_dir/drafts/qa_plan_phase5b_r1.md"
  cat > "$project_dir/context/checkpoint_audit_BCIN-85.md" <<'EOF'
# Checkpoint Audit

## Checkpoint Summary
- Requirements Traceability | Checkpoint 1 | pass | jira_issue_BCIN-85.md | none
- Black-Box Behavior Validation | Checkpoint 2 | pass | qa_plan_phase5a_r1.md | none
- Integration Validation | Checkpoint 3 | deferred | github_diff_BCIN-85.md | confirm lower-env integration
- Environment Fidelity | Checkpoint 4 | deferred | confluence_design_BCIN-85.md | confirm staging parity
- Regression Impact | Checkpoint 5 | pass | review_notes_BCIN-85.md | none
- Non-Functional Quality | Checkpoint 6 | deferred | current draft | define thresholds
- Test Data Quality | Checkpoint 7 | pass | jira_issue_BCIN-85.md | none
- Exploratory Testing | Checkpoint 8 | deferred | current draft | schedule focused session
- Auditability | Checkpoint 9 | pass | checkpoint_delta_BCIN-85.md | none
- AI Hallucination Check | Checkpoint 10 | pass | review_notes_BCIN-85.md | none
- Mutation Testing | Checkpoint 11 | out_of_scope | github_diff_BCIN-85.md | none
- Contract Testing | Checkpoint 12 | out_of_scope | current draft | none
- Chaos and Resilience | Checkpoint 13 | deferred | current draft | decide if resilience drill is required
- Shift-Right Monitoring | Checkpoint 14 | deferred | current draft | define rollout checks
- Final Release Gate | Checkpoint 15 | fail | checkpoint summary | close deferred blockers

## Blocking Checkpoints
- Checkpoint 15 | Release gate is not yet ready | missing checkpoint closures | close deferred blockers

## Advisory Checkpoints
- Checkpoint 8 | Add exploratory focus notes | schedule focused session

## Release Recommendation
- reject | Release gate remains blocked until deferred checkpoint actions are resolved
EOF
  cat > "$project_dir/context/checkpoint_delta_BCIN-85.md" <<'EOF'
# Checkpoint Delta

## Blocking Checkpoint Resolution
- Checkpoint 15 | Release gate is not yet ready | added explicit release recommendation and blocker summary | open

## Advisory Checkpoint Resolution
- Checkpoint 8 | Added exploratory follow-up note | tracked

## Final Disposition
- return phase5b
EOF

  bash "$SKILL_ROOT/scripts/phase5b.sh" BCIN-85 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_5b_checkpoint_refactor"'
}

test_post_validation_compares_against_rerun_input_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5b_project "$temp_dir")"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-85","current_phase":"phase_6_quality_refactor","return_to_phase":"phase5b","latest_draft_phase":"phase6","latest_draft_path":"drafts/qa_plan_phase6_r1.md","phase5a_round":1,"phase6_round":1,"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'stale phase5a ancestor\n' > "$project_dir/drafts/qa_plan_phase5a_r1.md"
  printf 'real rerun input\n' > "$project_dir/drafts/qa_plan_phase6_r1.md"
  printf 'real rerun input\n' > "$project_dir/drafts/qa_plan_phase5b_r2.md"
  cat > "$project_dir/context/checkpoint_audit_BCIN-85.md" <<'EOF'
# Checkpoint Audit

## Checkpoint Summary
- Requirements Traceability | Checkpoint 1 | pass | jira_issue_BCIN-85.md | none
- Black-Box Behavior Validation | Checkpoint 2 | pass | qa_plan_phase6_r1.md | none
- Integration Validation | Checkpoint 3 | deferred | github_diff_BCIN-85.md | confirm lower-env integration
- Environment Fidelity | Checkpoint 4 | deferred | confluence_design_BCIN-85.md | confirm staging parity
- Regression Impact | Checkpoint 5 | pass | review_notes_BCIN-85.md | none
- Non-Functional Quality | Checkpoint 6 | deferred | current draft | define thresholds
- Test Data Quality | Checkpoint 7 | pass | jira_issue_BCIN-85.md | none
- Exploratory Testing | Checkpoint 8 | deferred | current draft | schedule focused session
- Auditability | Checkpoint 9 | pass | checkpoint_delta_BCIN-85.md | none
- AI Hallucination Check | Checkpoint 10 | pass | review_notes_BCIN-85.md | none
- Mutation Testing | Checkpoint 11 | out_of_scope | github_diff_BCIN-85.md | none
- Contract Testing | Checkpoint 12 | out_of_scope | current draft | none
- Chaos and Resilience | Checkpoint 13 | deferred | current draft | decide if resilience drill is required
- Shift-Right Monitoring | Checkpoint 14 | deferred | current draft | define rollout checks
- Final Release Gate | Checkpoint 15 | fail | checkpoint summary | close deferred blockers

## Blocking Checkpoints
- Checkpoint 15 | Release gate is not yet ready | missing checkpoint closures | close deferred blockers

## Advisory Checkpoints
- Checkpoint 8 | Add exploratory focus notes | schedule focused session

## Release Recommendation
- reject | Release gate remains blocked until deferred checkpoint actions are resolved
EOF
  cat > "$project_dir/context/checkpoint_delta_BCIN-85.md" <<'EOF'
# Checkpoint Delta

## Blocking Checkpoint Resolution
- Checkpoint 15 | Release gate is not yet ready | added explicit release recommendation and blocker summary | open

## Advisory Checkpoint Resolution
- Checkpoint 8 | Added exploratory follow-up note | tracked

## Final Disposition
- return phase5b
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase5b.sh" BCIN-85 "$project_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_success_manifest_output
test_rerun_manifest_output_when_return_to_phase5b_requested
test_post_validation_pass
test_post_validation_compares_against_rerun_input_draft
