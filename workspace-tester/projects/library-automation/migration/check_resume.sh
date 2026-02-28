#!/bin/bash
# check_resume.sh — Check ReportEditor migration state for a phase. Supports idempotency.
# Usage: ./check_resume.sh <phase>
# Example: ./check_resume.sh 2c
#
# Emitted state:
#   REPORT_STATE: COMPLETED | IN_PROGRESS | CONTEXT_ONLY | FRESH
#   RESUMABLE: yes | no
#   resume_from: <step> (e.g. 4.4) — when RESUMABLE=yes
#
# Exit codes:
#   0 — Success (parse stdout for state)
#   1 — Error (missing task.json when expected, or invalid phase)

set -euo pipefail

readonly PHASE="${1:?Usage: check_resume.sh <phase>}"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly TASK_FILE="$SCRIPT_DIR/task.json"
readonly SPECS_DIR="$BASE_DIR/tests/specs/reportEditor"

# Phase to feature mapping
get_feature() {
  case "$PHASE" in
    2a) echo "reportShortcutMetrics" ;;
    2b) echo "reportPageBySorting" ;;
    2c) echo "reportCreator" ;;
    2d) echo "reportSubset" ;;
    2e) echo "reportPageBy" ;;
    2f) echo "reportThreshold" ;;
    2g) echo "reportTheme" ;;
    2h) echo "reportScopeFilter" ;;
    2i) echo "reportFormatting" ;;
    2j) echo "reportCancel" ;;
    2k) echo "reportSqlView" ;;
    2l) echo "mdx" ;;
    2m) echo "reportUICheck" ;;
    2n) echo "reportFolderBrowsing" ;;
    2o) echo "_root" ;;
    *) echo "" ;;
  esac
}

print_status() {
  local label="$1"
  local value="$2"
  printf "%-22s %s\n" "$label:" "$value"
}

FEATURE=$(get_feature)
if [ -z "$FEATURE" ]; then
  echo "ERROR: Invalid phase '$PHASE'. Must be 2a-2o." >&2
  exit 1
fi

PHASE_SPECS="$SPECS_DIR/$FEATURE"
[ "$FEATURE" = "_root" ] && PHASE_SPECS="$SPECS_DIR/_root"

echo "============================================"
echo " ReportEditor Migration Status — Phase $PHASE"
echo "============================================"
print_status "Phase" "$PHASE"
print_status "Feature" "$FEATURE"
echo ""

# Check task.json
if [ ! -f "$TASK_FILE" ]; then
  if [ -d "$PHASE_SPECS" ] && [ -n "$(ls -A "$PHASE_SPECS"/*.spec.ts 2>/dev/null)" ]; then
    REPORT_STATE="CONTEXT_ONLY"
    print_status "REPORT_STATE" "CONTEXT_ONLY"
    echo "  Migrated specs exist but no task.json. State reconstructed from disk."
    echo "  Options: (A) Use existing specs  (B) Full regenerate (re-run migration)"
  else
    REPORT_STATE="FRESH"
    print_status "REPORT_STATE" "FRESH"
    echo "  No artifacts. Proceed with fresh migration."
  fi
  echo ""
  echo "REPORT_STATE=$REPORT_STATE"
  echo "RESUMABLE=no"
  exit 0
fi

# Parse task.json
PHASE_STATUS=$(jq -r ".phases.\"$PHASE\".status // \"pending\"" "$TASK_FILE")
RESUME_FROM=$(jq -r ".phases.\"$PHASE\".resume_from // \"\"" "$TASK_FILE")
LAST_RUN=$(jq -r ".phases.\"$PHASE\".last_run // \"\"" "$TASK_FILE")
PASS=$(jq -r ".phases.\"$PHASE\".pass // 0" "$TASK_FILE")
FAIL=$(jq -r ".phases.\"$PHASE\".fail // 0" "$TASK_FILE")

if [ "$PHASE_STATUS" = "done" ]; then
  REPORT_STATE="COMPLETED"
  print_status "REPORT_STATE" "COMPLETED"
  print_status "Last run" "$LAST_RUN"
  print_status "Pass" "$PASS"
  print_status "Fail" "$FAIL"
  echo ""
  echo "Options: (A) Use Existing  (B) Smart Refresh  (C) Full Regenerate"
  echo ""
  echo "REPORT_STATE=$REPORT_STATE"
  echo "RESUMABLE=no"
  exit 0
fi

if [ "$PHASE_STATUS" = "in_progress" ] && [ -n "$RESUME_FROM" ]; then
  REPORT_STATE="IN_PROGRESS"
  print_status "REPORT_STATE" "IN_PROGRESS"
  print_status "resume_from" "$RESUME_FROM"
  echo ""
  echo "REPORT_STATE=$REPORT_STATE"
  echo "RESUMABLE=yes"
  echo "resume_from=$RESUME_FROM"
  exit 0
fi

# pending or in_progress without resume_from
REPORT_STATE="FRESH"
print_status "REPORT_STATE" "FRESH"
echo "  Phase not started or incomplete. Proceed from step 4.1."
echo ""
echo "REPORT_STATE=$REPORT_STATE"
echo "RESUMABLE=no"
exit 0
