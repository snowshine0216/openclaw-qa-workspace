#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

prepare_phase3_project() {
  local temp_dir="$1"
  local run_dir
  run_dir="$(feature_run_dir "$temp_dir" BCIN-50)"
  write_task_json "$run_dir/task.json" '{"feature_id":"BCIN-50","current_phase":"phase_2_artifact_index","updated_at":"2026-03-10T00:00:00.000Z"}'
  write_run_json "$run_dir/run.json" '{"run_key":"run-50","spawn_history":[],"updated_at":"2026-03-10T00:00:00.000Z"}'
  printf '# Artifact Lookup\n\n| # | Artifact Key | File Path | Source Phase | Phase 4a | Phase 4b | Phase 5 | Phase 6 |\n|---|---|---|---|---|---|---|---|\n| 1 | `jira_context` | `context/jira_issue_BCIN-50.md` | Phase 1 | ❌ | ❌ | ❌ | ❌ |\n' > "$run_dir/context/artifact_lookup_BCIN-50.md"
  printf '%s\n' "$run_dir"
}

test_success_manifest_output() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase3_project "$temp_dir")"

  local output
  output="$(bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-50 "$run_dir")"

  assert_contains "$output" "SPAWN_MANIFEST:"
  assert_file_exists "$run_dir/phase3_spawn_manifest.json"
}

test_post_validation_pass() {
  local temp_dir
  temp_dir="$(new_temp_dir)"
  local run_dir
  run_dir="$(prepare_phase3_project "$temp_dir")"
  cat > "$run_dir/context/coverage_ledger_BCIN-50.md" <<'EOF'
# Coverage Ledger

## Scenario Mapping Table
- C1 | EndToEnd | Main flow | standalone | covered
EOF

  bash "$SKILL_ROOT/scripts/phase3.sh" BCIN-50 "$run_dir" --post >/dev/null
  assert_contains "$(cat "$run_dir/task.json")" '"current_phase": "phase_3_coverage_mapping"'
}

test_success_manifest_output
test_post_validation_pass
