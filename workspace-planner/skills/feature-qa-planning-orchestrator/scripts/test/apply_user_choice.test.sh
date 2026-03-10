#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
APPLY_SCRIPT="$SKILL_ROOT/scripts/apply_user_choice.sh"

temp_dir="$(mktemp -d)"
trap 'rm -rf "$temp_dir"' EXIT

project_dir="$temp_dir/BCIN-TEST"
mkdir -p "$project_dir/context" "$project_dir/drafts"
echo 'evidence' > "$project_dir/context/jira_issue_BCIN-TEST.md"
echo 'draft' > "$project_dir/drafts/qa_plan_v1.md"
echo '{"feature_id":"BCIN-TEST","run_key":"run-1","current_phase":"phase_5_review_refactor"}' > "$project_dir/task.json"
echo '{"run_key":"run-1","spawn_history":[{"source_family":"jira"}]}' > "$project_dir/run.json"

"$APPLY_SCRIPT" full_regenerate BCIN-TEST "$project_dir" 2>&1 | grep -q 'USER_CHOICE_APPLIED: full_regenerate'
"$APPLY_SCRIPT" full_regenerate BCIN-TEST "$project_dir" 2>&1 | grep -q 'NEXT_PHASE: phase0'

# Context and drafts should be empty after full_regenerate
[ "$(ls -A "$project_dir/context" 2>/dev/null | wc -l)" -eq 0 ] || { echo "context should be empty"; exit 1; }
[ "$(ls -A "$project_dir/drafts" 2>/dev/null | wc -l)" -eq 0 ] || { echo "drafts should be empty"; exit 1; }
[ ! -f "$project_dir/qa_plan_final.md" ] || { echo "qa_plan_final should not exist"; exit 1; }

# task should have current_phase null
grep -q '"current_phase": null' "$project_dir/task.json" || { echo "task should have current_phase null"; exit 1; }

# Test smart_refresh
echo 'evidence' > "$project_dir/context/jira_issue_BCIN-TEST.md"
echo 'lookup' > "$project_dir/context/artifact_lookup_BCIN-TEST.md"
echo 'draft' > "$project_dir/drafts/qa_plan_v1.md"
echo '{"feature_id":"BCIN-TEST","run_key":"run-2","current_phase":"phase_5_review_refactor","requested_source_families":["jira"]}' > "$project_dir/task.json"
echo '{"run_key":"run-2","spawn_history":[{"source_family":"jira","artifact_paths":["context/jira_issue_BCIN-TEST.md"]}]}' > "$project_dir/run.json"

"$APPLY_SCRIPT" smart_refresh BCIN-TEST "$project_dir" 2>&1 | grep -q 'USER_CHOICE_APPLIED: smart_refresh'
"$APPLY_SCRIPT" smart_refresh BCIN-TEST "$project_dir" 2>&1 | grep -q 'NEXT_PHASE: phase2'

# Context evidence preserved, artifact_lookup removed
[ -f "$project_dir/context/jira_issue_BCIN-TEST.md" ] || { echo "jira evidence should be preserved"; exit 1; }
[ ! -f "$project_dir/context/artifact_lookup_BCIN-TEST.md" ] || { echo "artifact_lookup should be removed"; exit 1; }
[ "$(ls -A "$project_dir/drafts" 2>/dev/null | wc -l)" -eq 0 ] || { echo "drafts should be empty"; exit 1; }
grep -q '"current_phase": "phase_1_evidence_gathering"' "$project_dir/task.json" || { echo "task should have current_phase phase_1_evidence_gathering"; exit 1; }

# Test invalid mode exits non-zero
output="$("$APPLY_SCRIPT" invalid_mode BCIN-TEST "$project_dir" 2>&1)" || true
echo "$output" | grep -q 'Invalid mode' || { echo "invalid mode should print Invalid mode"; exit 1; }

echo "apply_user_choice.test.sh: all assertions passed"
