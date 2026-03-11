#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase6_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-90)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-90","current_phase":"phase_5b_checkpoint_refactor","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-90","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n' > "$run_dir/context/artifact_lookup_BCIN-90.md"
  printf '# Review Notes\n' > "$run_dir/context/review_notes_BCIN-90.md"
  printf '# Review Delta\n\n## Source Review\n- review_notes\n\n## Blocking Findings Resolution\n- none\n\n## Non-Blocking Findings Resolution\n- none\n\n## Still Open\n- none\n\n## Evidence Added / Removed\n- none\n\n## Verdict After Refactor\n- accept\n' > "$run_dir/context/review_delta_BCIN-90.md"
  printf '# Checkpoint Audit\n\n## Checkpoint Summary\n- Requirements Traceability | Checkpoint 1 | pass | jira_issue_BCIN-90.md | none\n- Black-Box Behavior Validation | Checkpoint 2 | pass | qa_plan_phase5a_r1.md | none\n- Integration Validation | Checkpoint 3 | pass | github_diff_BCIN-90.md | none\n- Environment Fidelity | Checkpoint 4 | deferred | confluence_design_BCIN-90.md | confirm staging parity\n- Regression Impact | Checkpoint 5 | pass | review_notes_BCIN-90.md | none\n- Non-Functional Quality | Checkpoint 6 | deferred | current draft | define thresholds\n- Test Data Quality | Checkpoint 7 | pass | jira_issue_BCIN-90.md | none\n- Exploratory Testing | Checkpoint 8 | deferred | current draft | schedule session\n- Auditability | Checkpoint 9 | pass | checkpoint_delta_BCIN-90.md | none\n- AI Hallucination Check | Checkpoint 10 | pass | review_notes_BCIN-90.md | none\n- Mutation Testing | Checkpoint 11 | out_of_scope | current draft | none\n- Contract Testing | Checkpoint 12 | out_of_scope | current draft | none\n- Chaos and Resilience | Checkpoint 13 | deferred | current draft | define resilience checks\n- Shift-Right Monitoring | Checkpoint 14 | deferred | current draft | define rollout checks\n- Final Release Gate | Checkpoint 15 | fail | checkpoint summary | close deferred blockers\n\n## Blocking Checkpoints\n- Checkpoint 15 | Release gate is not yet ready | blockers remain open | close deferred blockers\n\n## Advisory Checkpoints\n- none\n\n## Release Recommendation\n- reject | Close deferred blockers before shipment\n' > "$run_dir/context/checkpoint_audit_BCIN-90.md"
  printf '# Checkpoint Delta\n\n## Blocking Checkpoint Resolution\n- Checkpoint 15 | Release gate is not yet ready | carried blockers into final review | open\n\n## Advisory Checkpoint Resolution\n- none\n\n## Final Disposition\n- return phase5b\n' > "$run_dir/context/checkpoint_delta_BCIN-90.md"
  printf 'before\n' > "$run_dir/drafts/qa_plan_phase5b_r1.md"
  printf '%s\n' "$run_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase6_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase6.sh" BCIN-90 "$run_dir")"
  assert_contains "$output" "SPAWN_MANIFEST:"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase6_project "$temp_dir")"
  cat > "$run_dir/drafts/qa_plan_phase6_r1.md" <<'EOF'
Feature QA Plan (BCIN-90)

- EndToEnd
    * Account access
        - Sign in with valid credentials <P1>
            - Open the login page
                - Enter valid credentials
                    - Click "Sign In"
                        - Dashboard loads successfully
                        - Welcome banner shows the user name
- Core Functional Flows
    * Notifications
        - Open unread notification details <P2>
            - Open notifications panel
                - Click the unread item
                    - Notification details drawer opens
EOF
  cat > "$run_dir/context/quality_delta_BCIN-90.md" <<'EOF'
# Quality Delta

## Final Layer Audit
- EndToEnd > Account access > Sign in with valid credentials | canonical layering retained | pass | none
- Core Functional Flows > Notifications > Open notifications panel | canonical layering retained | pass | none

## Few-Shot Rewrite Applications
- FS1 | EndToEnd > Account access | generic sign-in wording | concrete nested actions | applied

## Exceptions Preserved
- none

## Verdict
- accept
EOF

  bash "$SKILL_ROOT/scripts/phase6.sh" BCIN-90 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_6_quality_refactor"'
}

test_success_manifest_output
test_post_validation_pass
