#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase5a_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-80)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_4b_top_category_draft","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-80","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$run_dir/context/artifact_lookup_BCIN-80.md"
  printf 'before\n' > "$run_dir/drafts/qa_plan_phase4b_r1.md"
  printf '%s\n' "$run_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_rerun_manifest_output_when_return_to_phase5a_requested() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_6_quality_refactor","return_to_phase":"phase5a","updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '{"stale":true}\n' > "$run_dir/phase5a_spawn_manifest.json"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  printf 'after\n' > "$run_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed
- context/jira_issue_BCIN-80.md | ## Feature Summary | consumed | EndToEnd > Authentication | primary journey | covered

## Supporting Artifact Coverage Audit
- context/supporting_issue_summary_BCIN-80.md | ## Aggregate Summary | consumed | Regression / Known Risks > Support context | support context covered | none

## Deep Research Coverage Audit
- context/deep_research_synthesis_report_editor_BCIN-80.md | ## Research Synthesis | consumed | Core Functional Flows > Report editor | research coverage preserved | none

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
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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

  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_5a_review_refactor"'
}

test_post_validation_sets_return_to_phase_from_review_delta() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  printf 'after\n' > "$run_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed

## Supporting Artifact Coverage Audit
- context/supporting_issue_summary_BCIN-80.md | ## Aggregate Summary | consumed | Regression / Known Risks > Support context | support context covered | none

## Deep Research Coverage Audit
- context/deep_research_synthesis_report_editor_BCIN-80.md | ## Research Synthesis | consumed | Core Functional Flows > Report editor | research coverage preserved | none

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
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
# Review Delta

## Source Review
- review_notes_BCIN-80.md

## Blocking Findings Resolution
- none

## Non-Blocking Findings Resolution
- none

## Still Open
- one more audit pass needed after the refactor

## Evidence Added / Removed
- none

## Verdict After Refactor
- return phase5a
EOF

  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"return_to_phase": "phase5a"'
}

test_post_validation_requires_artifact_lookup_audit() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  printf 'after\n' > "$run_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
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
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_rejects_accept_with_unmapped_required_outcome_and_sdk_rows() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  printf 'after\n' > "$run_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$run_dir/context/coverage_ledger_BCIN-80.json" <<'EOF'
{
  "feature_id": "BCIN-80",
  "candidates": [
    {
      "knowledge_pack_row_id": "outcome:window-title",
      "row_type": "required_outcome",
      "title": "window title correctness",
      "status": "unmapped"
    },
    {
      "knowledge_pack_row_id": "sdk:setwindowtitle",
      "row_type": "sdk_visible_contract",
      "title": "setWindowTitle",
      "status": "unmapped"
    }
  ]
}
EOF
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
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
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_requires_support_and_research_audit_sections() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_4b_top_category_draft","supporting_issue_keys":["BCED-2416"],"deep_research_topics":["report_editor_workstation_functionality","report_editor_library_vs_workstation_gap"],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Support summary\n' > "$run_dir/context/supporting_issue_summary_BCIN-80.md"
  printf '# Research synthesis\n' > "$run_dir/context/deep_research_synthesis_report_editor_BCIN-80.md"
  printf 'after\n' > "$run_dir/drafts/qa_plan_phase5a_r1.md"
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
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
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_compares_against_rerun_input_draft() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_5b_checkpoint_refactor","return_to_phase":"phase5a","latest_draft_phase":"phase5b","latest_draft_path":"drafts/qa_plan_phase5b_r1.md","phase4b_round":1,"phase5b_round":1,"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf 'stale phase4b ancestor\n' > "$run_dir/drafts/qa_plan_phase4b_r1.md"
  printf 'real rerun input\n' > "$run_dir/drafts/qa_plan_phase5b_r1.md"
  printf 'real rerun input\n' > "$run_dir/drafts/qa_plan_phase5a_r2.md"
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
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
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_rejects_silent_scope_shrinkage_without_coverage_audit() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4b_r1.md" <<'EOF'
Feature QA Plan (BCIN-80)

- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
EOF
  cat > "$run_dir/drafts/qa_plan_phase5a_r1.md" <<'EOF'
Feature QA Plan (BCIN-80)

- Core Functional Flows
    * Save
        - Rename report <P1>
            - Open the rename dialog
                - Updated name appears in the header
EOF
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | deferred | current draft | not applicable
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | deferred | current draft | not applicable
- Regression / Known Risks | risky flows are isolated | deferred | current draft | not applicable
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | not applicable
- Security | permission-sensitive flows stay separate | deferred | current draft | not applicable
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not applicable
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not applicable
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not applicable
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
EOF
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_rejects_accept_with_rewrite_required_coverage_item() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase4b_r1.md" <<'EOF'
Feature QA Plan (BCIN-80)

- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
EOF
  cat > "$run_dir/drafts/qa_plan_phase5a_r1.md" <<'EOF'
Feature QA Plan (BCIN-80)

- Out of Scope / Assumptions
    * Save
        - Save report <P1>
            - Coverage deferred for cleanup convenience
EOF
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed

## Coverage Preservation Audit
- Core Functional Flows > Save > Save report | present_in_prior_round | moved_to_out_of_scope | none | rewrite_required | restore as standalone scenario

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | deferred | current draft | not applicable
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | deferred | current draft | not applicable
- Regression / Known Risks | risky flows are isolated | deferred | current draft | not applicable
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | not applicable
- Security | permission-sensitive flows stay separate | deferred | current draft | not applicable
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not applicable
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not applicable
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not applicable
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
EOF
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_post_validation_rejects_inconsistent_coverage_audit_claim() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase5a_project "$temp_dir")"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-80","current_phase":"phase_5b_checkpoint_refactor","return_to_phase":"phase5a","latest_draft_phase":"phase5b","latest_draft_path":"drafts/qa_plan_phase5b_r1.md","updated_at":"2026-03-10T00:00:00.000Z"}'
  cat > "$run_dir/phase5a_spawn_manifest.json" <<EOF
{
  "version": 1,
  "count": 1,
  "requests": [
    {
      "source": {
        "phase": "phase5a",
        "output_draft_path": "$run_dir/drafts/qa_plan_phase5a_r2.md"
      }
    }
  ]
}
EOF
  cat > "$run_dir/drafts/qa_plan_phase5b_r1.md" <<'EOF'
Feature QA Plan (BCIN-80)

- Core Functional Flows
    * Save
        - Save report <P1>
            - Click Save
                - Save banner appears
EOF
  cat > "$run_dir/drafts/qa_plan_phase5a_r2.md" <<'EOF'
Feature QA Plan (BCIN-80)

- Core Functional Flows
    * Rename
        - Rename report <P1>
            - Open rename dialog
                - Updated title appears
EOF
  cat > "$run_dir/context/review_notes_BCIN-80.md" <<'EOF'
# Review Notes

## Context Artifact Coverage Audit
- context/artifact_lookup_BCIN-80.md | (document) | consumed | Planning Inputs | inventory audit | lookup reviewed

## Coverage Preservation Audit
- Core Functional Flows > Save > Save report | present_in_prior_round | preserved | jira_issue_BCIN-80.md | pass | retained after refactor

## Section Review Checklist
- EndToEnd | primary user journey reaches a visible completion or recovery outcome | deferred | current draft | not applicable
- Core Functional Flows | functional scenarios stay behavior-first | pass | current draft | none
- Error Handling / Recovery | failure states are explicit | deferred | current draft | not applicable
- Regression / Known Risks | risky flows are isolated | deferred | current draft | not applicable
- Compatibility | environment coverage is explicit when evidence mentions it | deferred | current draft | not applicable
- Security | permission-sensitive flows stay separate | deferred | current draft | not applicable
- i18n | locale-sensitive rendering is assessed when applicable | deferred | current draft | not applicable
- Accessibility | keyboard/focus coverage is assessed when applicable | deferred | current draft | not applicable
- Performance / Resilience | degraded-state behavior is considered when relevant | deferred | current draft | not applicable
- Out of Scope / Assumptions | exclusions are evidence-backed | pass | current draft | none

## Blocking Findings
- none

## Advisory Findings
- none

## Rewrite Requests
- none
EOF
  cat > "$run_dir/context/review_delta_BCIN-80.md" <<'EOF'
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
  bash "$SKILL_ROOT/scripts/phase5a.sh" BCIN-80 "$run_dir" --post >/dev/null 2>&1
  local code=$?
  set -e
  assert_exit_code 1 "$code"
}

test_success_manifest_output
test_rerun_manifest_output_when_return_to_phase5a_requested
test_post_validation_pass
test_post_validation_sets_return_to_phase_from_review_delta
test_post_validation_requires_artifact_lookup_audit
test_post_validation_rejects_accept_with_unmapped_required_outcome_and_sdk_rows
test_post_validation_requires_support_and_research_audit_sections
test_post_validation_compares_against_rerun_input_draft
test_post_validation_rejects_silent_scope_shrinkage_without_coverage_audit
test_post_validation_rejects_accept_with_rewrite_required_coverage_item
test_post_validation_rejects_inconsistent_coverage_audit_claim
