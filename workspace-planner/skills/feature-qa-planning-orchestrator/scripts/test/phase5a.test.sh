#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase5a_project() {
  local temp_dir="$1"
  local project_dir
  project_dir="$(feature_project_dir "$temp_dir" BCIN-80)"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_4b_top_category_draft","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$project_dir/run.json" '{"run_key":"run-80","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$project_dir/context/artifact_lookup_BCIN-80.md"
  printf 'before\n' > "$project_dir/drafts/qa_plan_phase4b_r1.md"
  printf '%s\n' "$project_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5a_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_rerun_manifest_output_when_return_to_phase5a_requested() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5a_project "$temp_dir")"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_6_quality_refactor","return_to_phase":"phase5a","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '{"stale":true}\n' > "$project_dir/phase5a_spawn_manifest.json"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$project_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5a_project "$temp_dir")"
  printf 'after\n' > "$project_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$project_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed
- context/jira_issue_BCIN-80.md | ## Feature Summary | consumed | EndToEnd > Authentication | primary journey | covered

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | pass | jira_issue_BCIN-80.md | none
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | pass | current draft | none
- Regression / Known Risks | risky flows are isolated | pass | current draft | none
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | await browser matrix
- Security | permission-sensitive flows stay separate | pass | current draft | none
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not in scope
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not in scope
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not in scope
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
EOF
  cat > "$project_dir/context/review_delta_BCIN-80.md" <<'EOF'
# Review Delta

## Source Review
- review_notes_BCIN-80.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- none

## Still Open
- none

## Evidence Added / Removed
- none

## Verdict After Refactor
- accept
EOF

  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$project_dir" --post >/dev/null
  assert_contains "$(cat "$project_dir/task.json")" '"current_phase": "phase_5a_review_refactor"'
}

test_post_validation_requires_artifact_lookup_audit() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5a_project "$temp_dir")"
  printf 'after\n' > "$project_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$project_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/jira_issue_BCIN-80.md | ## Feature Summary | consumed | EndToEnd > Authentication | primary journey | covered

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | pass | jira_issue_BCIN-80.md | none
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | pass | current draft | none
- Regression / Known Risks | risky flows are isolated | pass | current draft | none
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | await browser matrix
- Security | permission-sensitive flows stay separate | pass | current draft | none
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not in scope
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not in scope
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not in scope
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
EOF
  cat > "$project_dir/context/review_delta_BCIN-80.md" <<'EOF'
# Review Delta

## Source Review
- review_notes_BCIN-80.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- none

## Still Open
- none

## Evidence Added / Removed
- none

## Verdict After Refactor
- accept
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$project_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_compares_against_rerun_input_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local project_dir
  project_dir="$(prepare_phase5a_project "$temp_dir")"
  write_task_json "$project_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_5b_checkpoint_refactor","return_to_phase":"phase5a","latest_draft_phase":"phase5b","latest_draft_path":"drafts/qa_plan_phase5b_r1.md","phase4b_round":1,"phase5b_round":1,"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'stale phase4b ancestor\n' > "$project_dir/drafts/qa_plan_phase4b_r1.md"
  printf 'real rerun input\n' > "$project_dir/drafts/qa_plan_phase5b_r1.md"
  printf 'real rerun input\n' > "$project_dir/drafts/qa_plan_phase5a_r2.md"
  cat > "$project_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | pass | current draft | none
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | pass | current draft | none
- Regression / Known Risks | risky flows are isolated | pass | current draft | none
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | await browser matrix
- Security | permission-sensitive flows stay separate | pass | current draft | none
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not in scope
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not in scope
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not in scope
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
EOF
  cat > "$project_dir/context/review_delta_BCIN-80.md" <<'EOF'
# Review Delta

## Source Review
- review_notes_BCIN-80.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- none

## Still Open
- none

## Evidence Added / Removed
- none

## Verdict After Refactor
- accept
EOF

  set +e
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$project_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_success_manifest_output
test_rerun_manifest_output_when_return_to_phase5a_requested
test_post_validation_pass
test_post_validation_requires_artifact_lookup_audit
test_post_validation_compares_against_rerun_input_draft
