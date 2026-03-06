#!/bin/bash
# check_resume.sh — Check if a feature plan run can be resumed and classify planner state
# Usage: ./check_resume.sh <feature-id>
# Example: ./check_resume.sh BCIN-1234
#
# Plan Status (emitted before resume check):
#   REPORT_STATE: FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH
#   This drives Phase 0 in feature-qa-planning-orchestrator.

set -euo pipefail

readonly FEATURE_ID="${1:?Usage: check_resume.sh <feature-id>}"
readonly BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
readonly FEATURE_DIR="$BASE_DIR/$FEATURE_ID"
readonly TASK_FILE="$FEATURE_DIR/task.json"
readonly RUN_FILE="$FEATURE_DIR/run.json"
readonly PLANNER_ROOT="$(cd "$BASE_DIR/../.." && pwd)"
readonly REPORTER_ROOT="$PLANNER_ROOT/../workspace-reporter"
readonly DEFECT_REPORT_SRC="${REPORTER_ROOT}/projects/defects-analysis/${FEATURE_ID}/${FEATURE_ID}_REPORT_FINAL.md"
readonly REPORTER_TASK_FILE="${REPORTER_ROOT}/projects/defects-analysis/${FEATURE_ID}/task.json"
readonly PLAN_FINAL="$FEATURE_DIR/qa_plan_final.md"
readonly CONTEXT_DIR="$FEATURE_DIR/context"
readonly CONTEXT_JIRA="$CONTEXT_DIR/jira.json"
readonly ARCHIVE_DIR="$FEATURE_DIR/archive"

print_status() {
  local label="$1"
  local value="$2"
  printf "%-22s %s\n" "$label:" "$value"
}

json_value() {
  local file="$1"
  local expr="$2"
  if [ -f "$file" ]; then
    jq -r "$expr // empty" "$file" 2>/dev/null || true
  fi
}

first_non_empty() {
  local value
  for value in "$@"; do
    if [ -n "$value" ] && [ "$value" != "null" ]; then
      printf '%s\n' "$value"
      return 0
    fi
  done
  return 1
}

human_age() {
  local ts="$1"
  if [ -z "$ts" ] || [ "$ts" = "null" ]; then
    echo "unknown"
    return
  fi

  local now epoch_ts diff
  now=$(date +%s)
  epoch_ts=$(date -d "$ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "$ts" +%s 2>/dev/null || echo "$now")
  diff=$(( now - epoch_ts ))

  if (( diff < 3600 )); then
    echo "$((diff / 60)) min ago"
  elif (( diff < 86400 )); then
    echo "$((diff / 3600)) hours ago"
  elif (( diff < 604800 )); then
    echo "$((diff / 86400)) days ago"
  else
    echo "$((diff / 604800)) weeks ago"
  fi
}

file_mtime_utc() {
  local file="$1"
  date -r "$file" -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true
}

latest_draft_version() {
  local from_task=""
  local task_path=""
  from_task=$(json_value "$TASK_FILE" '.latest_draft_version')
  if [ -n "$from_task" ] && [ "$from_task" != "null" ]; then
    task_path="$FEATURE_DIR/drafts/qa_plan_v${from_task}.md"
    if [ -f "$task_path" ]; then
      printf '%s\n' "$from_task"
      return 0
    fi
  fi

  if [ ! -d "$FEATURE_DIR/drafts" ]; then
    echo "0"
    return
  fi

  local version
  version=$(ls "$FEATURE_DIR/drafts"/qa_plan_v*.md 2>/dev/null | sed -n 's/.*qa_plan_v\([0-9]*\)\.md/\1/p' | sort -n | tail -1)
  echo "${version:-0}"
}

context_file_count() {
  if [ ! -d "$CONTEXT_DIR" ]; then
    echo "0"
    return
  fi
  find "$CONTEXT_DIR" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' '
}

phase_entries() {
  jq -r '.phases // {} | to_entries[] | .key + "\t" + ((.value.status // .value // "unknown")|tostring)' "$TASK_FILE" 2>/dev/null || true
}

echo "============================================"
echo " QA Plan Status Check"
echo "============================================"

DATA_TS=$(first_non_empty \
  "$(json_value "$RUN_FILE" '.data_fetched_at')" \
  "$(json_value "$TASK_FILE" '.data_fetched_at')" \
  "$(json_value "$TASK_FILE" '.subtask_timestamps.jira')" || true)
OUTPUT_TS=$(first_non_empty \
  "$(json_value "$RUN_FILE" '.output_generated_at')" \
  "$(json_value "$TASK_FILE" '.output_generated_at')" \
  "$(json_value "$TASK_FILE" '.completed_at')" || true)
DATA_AGE=$(human_age "${DATA_TS:-}")
OUTPUT_AGE=$(human_age "${OUTPUT_TS:-}")

if [ -f "$PLAN_FINAL" ]; then
  REPORT_STATE="FINAL_EXISTS"
  if [ "$OUTPUT_AGE" = "unknown" ]; then
    OUTPUT_AGE=$(human_age "$(file_mtime_utc "$PLAN_FINAL")")
  fi
  print_status "REPORT_STATE" "$REPORT_STATE"
  print_status "Final plan" "$(basename "$PLAN_FINAL") (generated: $OUTPUT_AGE)"
  print_status "Data fetched" "$DATA_AGE"
  ARCHIVE_COUNT=0
  [ -d "$ARCHIVE_DIR" ] && ARCHIVE_COUNT=$(find "$ARCHIVE_DIR" -maxdepth 1 -name '*.md' -type f 2>/dev/null | wc -l | tr -d ' ')
  (( ARCHIVE_COUNT > 0 )) && print_status "Archived plans" "$ARCHIVE_COUNT in archive/"
  echo ""
  echo "Options: (A) Use Existing  (B) Smart Refresh  (C) Full Regenerate"
elif DRAFT_V=$(latest_draft_version) && [ -n "$DRAFT_V" ] && [ "$DRAFT_V" != "0" ] && [ -f "$FEATURE_DIR/drafts/qa_plan_v${DRAFT_V}.md" ]; then
  REPORT_STATE="DRAFT_EXISTS"
  DRAFT_AGE=$(human_age "$(file_mtime_utc "$FEATURE_DIR/drafts/qa_plan_v${DRAFT_V}.md")")
  print_status "REPORT_STATE" "$REPORT_STATE"
  print_status "Latest draft" "qa_plan_v${DRAFT_V}.md (created: $DRAFT_AGE)"
  print_status "Data fetched" "$DATA_AGE"
  echo ""
  echo "Options: (A) Resume  (B) Smart Refresh  (C) Full Regenerate"
elif [ -f "$CONTEXT_JIRA" ] || { [ -d "$CONTEXT_DIR" ] && [ -n "$(ls -A "$CONTEXT_DIR" 2>/dev/null)" ]; }; then
  REPORT_STATE="CONTEXT_ONLY"
  print_status "REPORT_STATE" "$REPORT_STATE"
  print_status "Data fetched" "$DATA_AGE"
  print_status "Context files" "$(context_file_count)"
  if [ ! -f "$TASK_FILE" ]; then
    echo "  ⚠️  task.json missing — state reconstructed from disk artifacts"
  fi
  echo ""
  echo "Options: (A) Generate from Cache  (B) Re-fetch + Regenerate"
else
  REPORT_STATE="FRESH"
  print_status "REPORT_STATE" "$REPORT_STATE"
  echo "  No existing artifacts found. Proceeding with fresh analysis."
fi

echo "============================================"
echo ""
echo "REPORT_STATE=$REPORT_STATE"

if [ ! -f "$TASK_FILE" ]; then
  echo "NO_TASK — No existing run found for $FEATURE_ID. Start fresh."
  [ "$REPORT_STATE" = "CONTEXT_ONLY" ] && echo "  Context data exists — agent can reconstruct state (see Plan Status above)."
  exit 0
fi

CURRENT_PHASE=$(json_value "$TASK_FILE" '.current_phase')
STATUS=$(json_value "$TASK_FILE" '.overall_status')
FEATURE_NAME=$(json_value "$TASK_FILE" '.feature_name')
UPDATED_AT=$(first_non_empty "$(json_value "$RUN_FILE" '.updated_at')" "$(json_value "$TASK_FILE" '.updated_at')" || true)
ERROR_COUNT=$(jq -r '.errors // [] | length' "$TASK_FILE" 2>/dev/null || echo "0")
DEFECT_ANALYSIS=$(first_non_empty "$(json_value "$TASK_FILE" '.defect_analysis')" "not_applicable" || true)
LATEST_DRAFT=$(latest_draft_version)
NOTIFICATION_PENDING=$(json_value "$RUN_FILE" '.notification_pending')

if [ "$DEFECT_ANALYSIS" = "in_progress" ] || [ "$DEFECT_ANALYSIS" = "pending" ]; then
  echo ""
  echo "============================================"
  echo " Defect Analysis Recovery"
  echo "============================================"
  if [ -f "$DEFECT_REPORT_SRC" ]; then
    REPORT_APPROVED_AT=$(json_value "$REPORTER_TASK_FILE" '.report_approved_at')
    if [ -n "$REPORT_APPROVED_AT" ] && [ "$REPORT_APPROVED_AT" != "null" ]; then
      mkdir -p "$CONTEXT_DIR"
      cp "$DEFECT_REPORT_SRC" "$CONTEXT_DIR/qa_plan_defect_analysis_${FEATURE_ID}.md"
      if command -v jq >/dev/null 2>&1; then
        jq '.defect_analysis = "completed"' "$TASK_FILE" > "${TASK_FILE}.tmp" && mv "${TASK_FILE}.tmp" "$TASK_FILE"
      fi
      print_status "DEFECT_ANALYSIS_RESUME" "COMPLETED"
      echo "  Report copied to context/qa_plan_defect_analysis_${FEATURE_ID}.md. Proceed to synthesis."
    else
      print_status "DEFECT_ANALYSIS_RESUME" "AWAITING_APPROVAL"
      echo "  Defect report is AI-reviewed but not yet approved."
      echo "  Options: (A) Open for approval  (B) Skip defect analysis"
    fi
  else
    print_status "DEFECT_ANALYSIS_RESUME" "NOT_FOUND"
    echo "  Defect report does not exist."
    echo "  Options: Resume defect analysis from scratch, or skip entirely."
  fi
  echo "============================================"
  echo ""
fi

echo "============================================"
echo " Feature Plan Recovery Check"
echo "============================================"
print_status "Feature ID" "$FEATURE_ID"
print_status "Feature Name" "${FEATURE_NAME:-unknown}"
print_status "Overall Status" "${STATUS:-unknown}"
print_status "Current Phase" "${CURRENT_PHASE:-unknown}"
print_status "Defect Analysis" "$DEFECT_ANALYSIS"
print_status "Latest Draft" "${LATEST_DRAFT:-0}"
print_status "Last Updated" "${UPDATED_AT:-unknown}"
print_status "Errors" "$ERROR_COUNT"
if [ -n "$NOTIFICATION_PENDING" ] && [ "$NOTIFICATION_PENDING" != "null" ]; then
  print_status "Notification" "pending retry"
fi
echo "--------------------------------------------"

if [ "$STATUS" = "completed" ]; then
  echo "COMPLETED — Nothing to resume. See Plan Status above for re-run options."
  exit 0
fi

if [ "$STATUS" = "failed" ]; then
  echo "FAILED — Previous run encountered a fatal error."
  echo "  Latest errors:"
  jq -r '.errors[-3:][] // "none"' "$TASK_FILE" 2>/dev/null | sed 's/^/    /'
  echo ""
  echo "  Can be resumed after fixing the error."
fi

echo ""
echo "Phase Status:"
PHASE_LINES=$(phase_entries)
if [ -n "$PHASE_LINES" ]; then
  while IFS=$'\t' read -r phase_name phase_status; do
    case "$phase_status" in
      completed) icon="✅" ;;
      in_progress) icon="🔄" ;;
      failed) icon="❌" ;;
      pending) icon="⬜" ;;
      skipped) icon="⏭️" ;;
      *) icon="❓" ;;
    esac
    printf "  %s %-28s %s\n" "$icon" "$phase_name" "$phase_status"
  done <<< "$PHASE_LINES"
else
  echo "  (none recorded)"
fi

echo ""
echo "Available Context Files:"
if [ -d "$CONTEXT_DIR" ]; then
  ls -1 "$CONTEXT_DIR"/ 2>/dev/null | sed 's/^/  📄 /' || echo "  (none)"
else
  echo "  (none)"
fi

echo ""
echo "Incomplete Subtasks in '${CURRENT_PHASE:-unknown}':"
jq -r ".phases[\"${CURRENT_PHASE:-unknown}\"].subtasks // {} | to_entries[] | select((.value.status // \"pending\") != \"completed\") | \"  ⬜ \" + .key + \" (\" + (.value.status // \"pending\") + \")\"" "$TASK_FILE" 2>/dev/null || echo "  (none or unable to parse)"

echo ""
echo "RESUMABLE — Set resume_from: ${CURRENT_PHASE:-unknown}"
