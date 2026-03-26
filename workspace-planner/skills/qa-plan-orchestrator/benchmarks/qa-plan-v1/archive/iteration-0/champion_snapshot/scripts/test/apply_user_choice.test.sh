#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
APPLY_SCRIPT="$SKILL_ROOT/scripts/apply_user_choice.sh"

temp_dir="$(mktemp -d)"
trap 'rm -rf "$temp_dir"' EXIT

run_dir="$temp_dir/BCIN-TEST"
mkdir -p "$run_dir/context" "$run_dir/drafts"
echo 'evidence' > "$run_dir/context/jira_issue_BCIN-TEST.md"
echo 'draft' > "$run_dir/drafts/qa_plan_v1.md"
echo '{"feature_id":"BCIN-TEST","run_key":"run-1","current_phase":"phase_5_review_refactor"}' > "$run_dir/task.json"
echo '{"run_key":"run-1","spawn_history":[{"source_family":"jira"}]}' > "$run_dir/run.json"

"$APPLY_SCRIPT" full_regenerate BCIN-TEST "$run_dir" 2>&1 | grep -q 'USER_CHOICE_APPLIED: full_regenerate'
"$APPLY_SCRIPT" full_regenerate BCIN-TEST "$run_dir" 2>&1 | grep -q 'NEXT_PHASE: phase0'

# Context and drafts should be empty after full_regenerate
[ "$(ls -A "$run_dir/context" 2>/dev/null | wc -l)" -eq 0 ] || { echo "context should be empty"; exit 1; }
[ "$(ls -A "$run_dir/drafts" 2>/dev/null | wc -l)" -eq 0 ] || { echo "drafts should be empty"; exit 1; }
[ ! -f "$run_dir/qa_plan_final.md" ] || { echo "qa_plan_final should not exist"; exit 1; }

# task should have current_phase null
grep -q '"current_phase": null' "$run_dir/task.json" || { echo "task should have current_phase null"; exit 1; }

# Test smart_refresh
echo 'evidence' > "$run_dir/context/jira_issue_BCIN-TEST.md"
echo 'lookup' > "$run_dir/context/artifact_lookup_BCIN-TEST.md"
echo 'draft' > "$run_dir/drafts/qa_plan_v1.md"
echo '{"feature_id":"BCIN-TEST","run_key":"run-2","current_phase":"phase_5_review_refactor","requested_source_families":["jira"]}' > "$run_dir/task.json"
echo '{"run_key":"run-2","spawn_history":[{"source_family":"jira","artifact_paths":["context/jira_issue_BCIN-TEST.md"]}]}' > "$run_dir/run.json"

"$APPLY_SCRIPT" smart_refresh BCIN-TEST "$run_dir" 2>&1 | grep -q 'USER_CHOICE_APPLIED: smart_refresh'
"$APPLY_SCRIPT" smart_refresh BCIN-TEST "$run_dir" 2>&1 | grep -q 'NEXT_PHASE: phase2'

# Context evidence preserved, artifact_lookup removed
[ -f "$run_dir/context/jira_issue_BCIN-TEST.md" ] || { echo "jira evidence should be preserved"; exit 1; }
[ ! -f "$run_dir/context/artifact_lookup_BCIN-TEST.md" ] || { echo "artifact_lookup should be removed"; exit 1; }
[ "$(ls -A "$run_dir/drafts" 2>/dev/null | wc -l)" -eq 0 ] || { echo "drafts should be empty"; exit 1; }
grep -q '"current_phase": "phase_1_evidence_gathering"' "$run_dir/task.json" || { echo "task should have current_phase phase_1_evidence_gathering"; exit 1; }

# Test invalid mode exits non-zero
output="$("$APPLY_SCRIPT" invalid_mode BCIN-TEST "$run_dir" 2>&1)" || true
echo "$output" | grep -q 'Invalid mode' || { echo "invalid mode should print Invalid mode"; exit 1; }

# Test usage text references run-dir terminology
usage_output="$("$APPLY_SCRIPT" 2>&1)" || true
echo "$usage_output" | grep -q 'run-dir' || { echo "usage should mention run-dir"; exit 1; }
! echo "$usage_output" | grep -q 'project-dir' || { echo "usage should not mention project-dir"; exit 1; }

echo "apply_user_choice.test.sh: all assertions passed"
