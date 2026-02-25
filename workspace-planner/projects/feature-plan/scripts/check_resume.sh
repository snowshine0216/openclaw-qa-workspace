#!/bin/bash
# check_resume.sh — Check if a feature plan run can be resumed
# Usage: ./check_resume.sh <feature-id>
# Example: ./check_resume.sh BCIN-1234
#
# Exit codes:
#   0 — Resumable or fresh start (check stdout for details)
#   1 — Error reading task file

set -euo pipefail

readonly FEATURE_ID="${1:?Usage: check_resume.sh <feature-id>}"
readonly BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
readonly FEATURE_DIR="$BASE_DIR/$FEATURE_ID"
readonly TASK_FILE="$FEATURE_DIR/task.json"

print_status() {
  local label="$1"
  local value="$2"
  printf "%-20s %s\n" "$label:" "$value"
}

# Check if task.json exists
if [ ! -f "$TASK_FILE" ]; then
  echo "NO_TASK — No existing run found for $FEATURE_ID. Start fresh."
  exit 0
fi

# Parse task.json
CURRENT_PHASE=$(jq -r '.current_phase // "unknown"' "$TASK_FILE")
STATUS=$(jq -r '.overall_status // "unknown"' "$TASK_FILE")
FEATURE_NAME=$(jq -r '.feature_name // "unknown"' "$TASK_FILE")
UPDATED_AT=$(jq -r '.updated_at // "unknown"' "$TASK_FILE")
ERROR_COUNT=$(jq -r '.errors | length' "$TASK_FILE")

# Print summary
echo "============================================"
echo " Feature Plan Recovery Check"
echo "============================================"
print_status "Feature ID" "$FEATURE_ID"
print_status "Feature Name" "$FEATURE_NAME"
print_status "Overall Status" "$STATUS"
print_status "Current Phase" "$CURRENT_PHASE"
print_status "Last Updated" "$UPDATED_AT"
print_status "Errors" "$ERROR_COUNT"
echo "--------------------------------------------"

# Check if completed
if [ "$STATUS" = "completed" ]; then
  echo "COMPLETED — Nothing to resume. Final plan exists."
  [ -f "$FEATURE_DIR/qa_plan_final.md" ] && echo "  Output: $FEATURE_DIR/qa_plan_final.md"
  exit 0
fi

# Check if failed
if [ "$STATUS" = "failed" ]; then
  echo "FAILED — Previous run encountered a fatal error."
  echo "  Latest errors:"
  jq -r '.errors[-3:][] // "none"' "$TASK_FILE" 2>/dev/null | sed 's/^/    /'
  echo ""
  echo "  Can be resumed after fixing the error."
fi

# Show completed phases
echo ""
echo "Phase Status:"
for phase in context_gathering plan_generation review_refactor publication; do
  phase_status=$(jq -r ".phases.$phase.status // \"unknown\"" "$TASK_FILE")
  case "$phase_status" in
    completed) icon="✅" ;;
    in_progress) icon="🔄" ;;
    failed) icon="❌" ;;
    pending) icon="⬜" ;;
    *) icon="❓" ;;
  esac
  printf "  %s %-20s %s\n" "$icon" "$phase" "$phase_status"
done

# Show available context files
echo ""
echo "Available Context Files:"
if [ -d "$FEATURE_DIR/context" ]; then
  ls -1 "$FEATURE_DIR/context/" 2>/dev/null | sed 's/^/  📄 /'
else
  echo "  (none)"
fi

# Show incomplete subtasks in current phase
echo ""
echo "Incomplete Subtasks in '$CURRENT_PHASE':"
jq -r ".phases.$CURRENT_PHASE.subtasks | to_entries[] | select(.value.status != \"completed\") | \"  ⬜ \" + .key + \" (\" + .value.status + \")\"" "$TASK_FILE" 2>/dev/null || echo "  (unable to parse)"

echo ""
echo "RESUMABLE — Set resume_from: $CURRENT_PHASE"
