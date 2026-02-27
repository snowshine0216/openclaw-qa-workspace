#!/bin/bash
# check_resume.sh — Check if a feature plan run can be resumed AND detect existing QA plan state
# Usage: ./check_resume.sh <feature-id>
# Example: ./check_resume.sh BCIN-1234
#
# Plan Status (emitted before resume check):
#   REPORT_STATE: FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH
#   This drives the Phase 0 idempotency check in feature-qa-planning.md.
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
  printf "%-22s %s\n" "$label:" "$value"
}

# Compute a human-readable age string from an ISO timestamp
human_age() {
  local ts="$1"
  if [ -z "$ts" ] || [ "$ts" = "null" ]; then echo "unknown"; return; fi
  local now epoch_ts diff
  now=$(date +%s)
  epoch_ts=$(date -d "$ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S%z" "$ts" +%s 2>/dev/null || echo "$now")
  diff=$(( now - epoch_ts ))
  if   (( diff < 3600 ));        then echo "$((diff / 60)) min ago"
  elif (( diff < 86400 ));       then echo "$((diff / 3600)) hours ago"
  elif (( diff < 604800 ));      then echo "$((diff / 86400)) days ago"
  else                                echo "$((diff / 604800)) weeks ago"
  fi
}

# Check for latest draft version in drafts/
latest_draft_version() {
  if [ ! -d "$FEATURE_DIR/drafts" ]; then echo "0"; return; fi
  local v
  v=$(ls "$FEATURE_DIR/drafts"/qa_plan_v*.md 2>/dev/null | sed -n 's/.*qa_plan_v\([0-9]*\)\.md/\1/p' | sort -n | tail -1)
  echo "${v:-0}"
}

# ─── PLAN STATUS CHECK (Phase 0 idempotency) ───────────────────────────────────
# Emitted first so the agent can decide before any API calls.

PLAN_FINAL="$FEATURE_DIR/qa_plan_final.md"
CONTEXT_JIRA="$FEATURE_DIR/context/jira.json"
ARCHIVE_DIR="$FEATURE_DIR/archive"

echo "============================================"
echo " QA Plan Status Check"
echo "============================================"

if [ -f "$PLAN_FINAL" ]; then
  REPORT_STATE="FINAL_EXISTS"
  DATA_AGE="unknown"
  OUTPUT_AGE="unknown"
  if [ -f "$TASK_FILE" ]; then
    DATA_TS=$(jq -r '.data_fetched_at // .subtask_timestamps.jira // ""' "$TASK_FILE" 2>/dev/null || true)
    DATA_AGE=$(human_age "$DATA_TS")
    OUTPUT_TS=$(jq -r '.output_generated_at // .completed_at // ""' "$TASK_FILE" 2>/dev/null || true)
    OUTPUT_AGE=$(human_age "$OUTPUT_TS")
  fi
  if [ "$OUTPUT_AGE" = "unknown" ] && [ -f "$PLAN_FINAL" ]; then
    OUTPUT_AGE=$(human_age "$(date -r "$PLAN_FINAL" -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true)")
  fi
  print_status "REPORT_STATE" "FINAL_EXISTS"
  print_status "Final plan" "$(basename "$PLAN_FINAL") (generated: $OUTPUT_AGE)"
  print_status "Data fetched" "$DATA_AGE"
  ARCHIVE_COUNT=0
  [ -d "$ARCHIVE_DIR" ] && ARCHIVE_COUNT=$(ls "$ARCHIVE_DIR/"*.md 2>/dev/null | wc -l | tr -d ' ')
  (( ARCHIVE_COUNT > 0 )) && print_status "Archived plans" "$ARCHIVE_COUNT in archive/"
  echo ""
  echo "Options: (A) Use Existing  (B) Smart Refresh  (C) Full Regenerate"

elif DRAFT_V=$(latest_draft_version) && [ -n "$DRAFT_V" ] && [ "$DRAFT_V" != "0" ]; then
  REPORT_STATE="DRAFT_EXISTS"
  DATA_AGE="unknown"
  DRAFT_AGE="unknown"
  if [ -f "$TASK_FILE" ]; then
    DATA_TS=$(jq -r '.data_fetched_at // .subtask_timestamps.jira // ""' "$TASK_FILE" 2>/dev/null || true)
    DATA_AGE=$(human_age "$DATA_TS")
  fi
  if [ -f "$FEATURE_DIR/drafts/qa_plan_v${DRAFT_V}.md" ]; then
    DRAFT_AGE=$(human_age "$(date -r "$FEATURE_DIR/drafts/qa_plan_v${DRAFT_V}.md" -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true)")
  fi
  print_status "REPORT_STATE" "DRAFT_EXISTS"
  print_status "Latest draft" "qa_plan_v${DRAFT_V}.md (created: $DRAFT_AGE)"
  print_status "Data fetched" "$DATA_AGE"
  echo ""
  echo "Options: (A) Resume to Approval  (B) Smart Refresh  (C) Full Regenerate"

elif [ -f "$CONTEXT_JIRA" ] || [ -d "$FEATURE_DIR/context" ] && [ -n "$(ls -A "$FEATURE_DIR/context" 2>/dev/null)" ]; then
  REPORT_STATE="CONTEXT_ONLY"
  DATA_AGE="unknown"
  if [ -f "$TASK_FILE" ]; then
    DATA_TS=$(jq -r '.data_fetched_at // .subtask_timestamps.jira // ""' "$TASK_FILE" 2>/dev/null || true)
    DATA_AGE=$(human_age "$DATA_TS")
  else
    if [ -f "$CONTEXT_JIRA" ]; then
      DATA_AGE=$(human_age "$(date -r "$CONTEXT_JIRA" -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true)")
    fi
    echo "  ⚠️  task.json missing — state reconstructed from disk artifacts"
  fi
  print_status "REPORT_STATE" "CONTEXT_ONLY"
  print_status "Data fetched" "$DATA_AGE"
  CONTEXT_COUNT=$(ls -1 "$FEATURE_DIR/context/"* 2>/dev/null | wc -l | tr -d ' ')
  print_status "Context files" "$CONTEXT_COUNT"
  echo ""
  echo "Options: (A) Generate from Cache  (B) Re-fetch + Regenerate"

else
  REPORT_STATE="FRESH"
  print_status "REPORT_STATE" "FRESH"
  echo "  No existing artifacts found. Proceeding with fresh analysis."
fi

echo "============================================"
echo ""

# Export state for agent to consume
echo "REPORT_STATE=$REPORT_STATE"

# ─── RESUME CHECK ─────────────────────────────────────────────────────────────

# Check if task.json exists
if [ ! -f "$TASK_FILE" ]; then
  echo "NO_TASK — No existing run found for $FEATURE_ID. Start fresh."
  [ "$REPORT_STATE" = "CONTEXT_ONLY" ] && echo "  Context data exists — agent can reconstruct state (see Plan Status above)."
  exit 0
fi

# Parse task.json
CURRENT_PHASE=$(jq -r '.current_phase // "unknown"' "$TASK_FILE")
STATUS=$(jq -r '.overall_status // "unknown"' "$TASK_FILE")
FEATURE_NAME=$(jq -r '.feature_name // "unknown"' "$TASK_FILE")
UPDATED_AT=$(jq -r '.updated_at // "unknown"' "$TASK_FILE")
ERROR_COUNT=$(jq -r '.errors // [] | length' "$TASK_FILE")

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
  echo "COMPLETED — Nothing to resume. See Plan Status above for re-run options."
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
for phase in context_gathering plan_generation plan_synthesize review_refactor publication confluence_review; do
  phase_status=$(jq -r ".phases.$phase.status // \"unknown\"" "$TASK_FILE" 2>/dev/null || jq -r ".phases.$phase // \"unknown\"" "$TASK_FILE" 2>/dev/null || echo "unknown")
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
  ls -1 "$FEATURE_DIR/context/" 2>/dev/null | sed 's/^/  📄 /' || echo "  (none)"
else
  echo "  (none)"
fi

# Show incomplete subtasks in current phase (if structure exists)
echo ""
echo "Incomplete Subtasks in '$CURRENT_PHASE':"
jq -r ".phases[\"$CURRENT_PHASE\"].subtasks // {} | to_entries[] | select(.value.status != \"completed\") | \"  ⬜ \" + .key + \" (\" + (.value.status // \"pending\") + \")\"" "$TASK_FILE" 2>/dev/null || echo "  (none or unable to parse)"

echo ""
echo "RESUMABLE — Set resume_from: $CURRENT_PHASE"
