#!/bin/bash
# check_resume.sh — Check if a defect analysis run can be resumed AND detect existing report state
# Usage: ./check_resume.sh <feature-key-or-release>
# Examples:
#   ./check_resume.sh BCIN-1234
#   ./check_resume.sh release_26.03
#
# Reporter-specific: uses projects/defects-analysis/<key>/ and defect-analysis phases.
# For release-scoped mode, pass "release_<VERSION>" (e.g., release_26.03);
#   reads batch_task.json instead of task.json.
# Similar to workspace-planner/projects/feature-plan/scripts/check_resume.sh
#
# Report Status (emitted before resume check):
#   REPORT_STATE: FINAL_EXISTS | DRAFT_EXISTS | CONTEXT_ONLY | FRESH
#   This drives the Phase 0 idempotency check in defect-analysis.md.
#
# Exit codes:
#   0 — Resumable or fresh start (check stdout for details)
#   1 — Error reading task file

set -euo pipefail

readonly FEATURE_KEY="${1:?Usage: check_resume.sh <feature-key-or-release>}"
REPORTER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
readonly REPORTER_ROOT
readonly FEATURE_DIR="$REPORTER_ROOT/projects/defects-analysis/$FEATURE_KEY"

# Release-scoped mode uses batch_task.json; single-feature uses task.json
if [[ "$FEATURE_KEY" == release_* ]]; then
  readonly TASK_FILE="$FEATURE_DIR/batch_task.json"
  readonly RELEASE_MODE=true
else
  readonly TASK_FILE="$FEATURE_DIR/task.json"
  readonly RELEASE_MODE=false
fi

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
  epoch_ts=$(date -d "$ts" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$ts" +%s 2>/dev/null || echo "$now")
  diff=$(( now - epoch_ts ))
  if   (( diff < 3600 ));        then echo "$((diff / 60)) min ago"
  elif (( diff < 86400 ));       then echo "$((diff / 3600)) hours ago"
  elif (( diff < 604800 ));      then echo "$((diff / 86400)) days ago"
  else                                echo "$((diff / 604800)) weeks ago"
  fi
}

# ─── REPORT STATUS CHECK (Phase 0 idempotency) ────────────────────────────────
# Emitted first so the agent can decide before any API calls.

REPORT_FINAL="$FEATURE_DIR/${FEATURE_KEY}_REPORT_FINAL.md"
REPORT_DRAFT="$FEATURE_DIR/${FEATURE_KEY}_REPORT_DRAFT.md"
TESTING_PLAN="$FEATURE_DIR/${FEATURE_KEY}_TESTING_PLAN.md"
JIRA_RAW="$FEATURE_DIR/context/jira_raw.json"
ARCHIVE_DIR="$FEATURE_DIR/archive"

echo "============================================"
echo " Report Status Check"
echo "============================================"

# Single-issue testing plan mode: check for TESTING_PLAN_EXISTS first
if [ -f "$TESTING_PLAN" ] && [ ! -f "$REPORT_FINAL" ] && [ ! -f "$REPORT_DRAFT" ]; then
  REPORT_STATE="TESTING_PLAN_EXISTS"
  PLAN_AGE="unknown"
  if [ -f "$TASK_FILE" ]; then
    PLAN_TS=$(jq -r '.testing_plan_generated_at // ""' "$TASK_FILE" 2>/dev/null || true)
    PLAN_AGE=$(human_age "$PLAN_TS")
    TESTER_NOTIFIED=$(jq -r '.tester_notified_at // "null"' "$TASK_FILE" 2>/dev/null || echo "null")
    TEST_RESULT=$(jq -r '.test_result // "null"' "$TASK_FILE" 2>/dev/null || echo "null")
  fi
  print_status "REPORT_STATE" "TESTING_PLAN_EXISTS"
  print_status "Testing plan" "$(basename "$TESTING_PLAN") (generated: $PLAN_AGE)"
  [ "${TESTER_NOTIFIED:-null}" != "null" ] && print_status "Tester notified" "$TESTER_NOTIFIED"
  [ "${TEST_RESULT:-null}" != "null" ] && print_status "Test result" "$TEST_RESULT"
  echo ""
  echo "Options: (A) Use Existing Plan  (B) Regenerate Plan"

elif [ -f "$REPORT_FINAL" ]; then
  REPORT_STATE="FINAL_EXISTS"
  JIRA_AGE="unknown"
  PR_CACHED=0
  PR_TOTAL=0
  if [ -f "$TASK_FILE" ]; then
    JIRA_TS=$(jq -r '.jira_fetched_at // ""' "$TASK_FILE" 2>/dev/null || true)
    JIRA_AGE=$(human_age "$JIRA_TS")
    PR_CACHED=$(jq -r '.pr_analysis_timestamps | length // 0' "$TASK_FILE" 2>/dev/null || echo 0)
    REPORT_GEN_TS=$(jq -r '.report_generated_at // ""' "$TASK_FILE" 2>/dev/null || true)
    REPORT_AGE=$(human_age "$REPORT_GEN_TS")
  fi
  PR_TOTAL=$(ls "$FEATURE_DIR/context/prs/"*_impact.md 2>/dev/null | wc -l | tr -d ' ')
  print_status "REPORT_STATE" "FINAL_EXISTS"
  print_status "Final report" "$(basename "$REPORT_FINAL") (generated: $REPORT_AGE)"
  print_status "Jira data age" "$JIRA_AGE"
  print_status "PR impacts cached" "$PR_CACHED/$PR_TOTAL"
  ARCHIVE_COUNT=$(ls "$ARCHIVE_DIR/"*.md 2>/dev/null | wc -l | tr -d ' ')
  (( ARCHIVE_COUNT > 0 )) && print_status "Archived reports" "$ARCHIVE_COUNT in archive/"
  echo ""
  echo "Options: (A) Use Existing  (B) Smart Refresh  (C) Full Regenerate"

elif [ -f "$REPORT_DRAFT" ]; then
  REPORT_STATE="DRAFT_EXISTS"
  JIRA_AGE="unknown"
  PR_CACHED=0
  PR_TOTAL=0
  if [ -f "$TASK_FILE" ]; then
    JIRA_TS=$(jq -r '.jira_fetched_at // ""' "$TASK_FILE" 2>/dev/null || true)
    JIRA_AGE=$(human_age "$JIRA_TS")
    PR_CACHED=$(jq -r '.pr_analysis_timestamps | length // 0' "$TASK_FILE" 2>/dev/null || echo 0)
    REPORT_GEN_TS=$(jq -r '.report_generated_at // ""' "$TASK_FILE" 2>/dev/null || true)
    REPORT_AGE=$(human_age "$REPORT_GEN_TS")
  fi
  PR_TOTAL=$(ls "$FEATURE_DIR/context/prs/"*_impact.md 2>/dev/null | wc -l | tr -d ' ')
  print_status "REPORT_STATE" "DRAFT_EXISTS"
  print_status "Draft report" "$(basename "$REPORT_DRAFT") (created: $REPORT_AGE)"
  print_status "Jira data age" "$JIRA_AGE"
  print_status "PR impacts cached" "$PR_CACHED/$PR_TOTAL"
  echo ""
  echo "Options: (A) Resume to Approval  (B) Smart Refresh  (C) Full Regenerate"

elif [ -f "$JIRA_RAW" ]; then
  REPORT_STATE="CONTEXT_ONLY"
  JIRA_AGE="unknown"
  if [ -f "$TASK_FILE" ]; then
    JIRA_TS=$(jq -r '.jira_fetched_at // ""' "$TASK_FILE" 2>/dev/null || true)
    JIRA_AGE=$(human_age "$JIRA_TS")
  else
    # Fallback: use file modification time if task.json missing
    JIRA_AGE="$(human_age "$(date -r "$JIRA_RAW" -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true)")"
    echo "  ⚠️  task.json missing — state reconstructed from disk artifacts"
  fi
  PR_TOTAL=$(ls "$FEATURE_DIR/context/prs/"*_impact.md 2>/dev/null | wc -l | tr -d ' ')
  print_status "REPORT_STATE" "CONTEXT_ONLY"
  print_status "Jira data age" "$JIRA_AGE"
  print_status "PR impacts cached" "$PR_TOTAL"
  echo ""
  echo "Options: (A) Generate from Cache  (B) Re-fetch Jira + Regenerate"

else
  REPORT_STATE="FRESH"
  print_status "REPORT_STATE" "FRESH"
  echo "  No existing artifacts found. Proceeding with fresh analysis."
fi

echo "============================================"
echo ""

# Export state for agent to consume
echo "REPORT_STATE=$REPORT_STATE"

# ─── RESUME CHECK ──────────────────────────────────────────────────────────────

# Release-scoped mode: show batch summary and exit
if [ "$RELEASE_MODE" = true ]; then
  if [ ! -f "$TASK_FILE" ]; then
    echo "NO_TASK — No existing release run found for $FEATURE_KEY. Start fresh."
    exit 0
  fi
  STATUS=$(jq -r '.overall_status // "unknown"' "$TASK_FILE")
  TOTAL=$(jq -r '.feature_keys | length // 0' "$TASK_FILE")
  DONE=$(jq -r '.completed_features | length // 0' "$TASK_FILE")
  echo "============================================"
  echo " Release Batch Recovery Check"
  echo "============================================"
  print_status "Release" "$FEATURE_KEY"
  print_status "Overall Status" "$STATUS"
  print_status "Features" "$DONE/$TOTAL completed"
  echo "--------------------------------------------"
  [ "$STATUS" = "completed" ] && echo "COMPLETED — Nothing to resume." || echo "RESUMABLE — $((TOTAL - DONE)) feature(s) remaining."
  exit 0
fi

# Check if task.json exists
if [ ! -f "$TASK_FILE" ]; then
  echo "NO_TASK — No task.json found for $FEATURE_KEY."
  [ "$REPORT_STATE" = "CONTEXT_ONLY" ] && echo "  Context data exists — agent can reconstruct state (see Report Status above)."
  exit 0
fi

# Parse task.json
CURRENT_PHASE=$(jq -r '.current_phase // "unknown"' "$TASK_FILE")
STATUS=$(jq -r '.overall_status // "unknown"' "$TASK_FILE")
PROCESSED_DEFECTS=$(jq -r '.processed_defects // 0' "$TASK_FILE")
TOTAL_DEFECTS=$(jq -r '.total_defects // 0' "$TASK_FILE")
PROCESSED_PRS=$(jq -r '.processed_prs // 0' "$TASK_FILE")
TOTAL_PRS=$(jq -r '.total_prs // 0' "$TASK_FILE")
FAILED_PRS=$(jq -r '.failed_prs | length // 0' "$TASK_FILE")

# Print summary
echo "============================================"
echo " Defect Analysis Recovery Check"
echo "============================================"
print_status "Feature Key" "$FEATURE_KEY"
print_status "Overall Status" "$STATUS"
print_status "Current Phase" "$CURRENT_PHASE"
print_status "Defects" "$PROCESSED_DEFECTS/$TOTAL_DEFECTS"
print_status "PRs Analyzed" "$PROCESSED_PRS/$TOTAL_PRS"
print_status "Failed PRs" "$FAILED_PRS"
echo "--------------------------------------------"

# Check if completed
if [ "$STATUS" = "completed" ]; then
  echo "COMPLETED — Run finished. See Report Status above for re-run options."
  exit 0
fi

# Check if failed
if [ "$STATUS" = "failed" ]; then
  echo "FAILED — Previous run encountered a fatal error."
  echo "  Can be resumed after fixing the error."
fi

# Show available context files
echo ""
echo "Available Context Files:"
if [ -d "$FEATURE_DIR/context" ]; then
  ls -1 "$FEATURE_DIR/context/" 2>/dev/null | sed 's/^/  📄 /'
else
  echo "  (none)"
fi

# Show PR impact summaries
if [ -d "$FEATURE_DIR/context/prs" ]; then
  echo ""
  echo "PR Impact Summaries:"
  ls -1 "$FEATURE_DIR/context/prs/" 2>/dev/null | sed 's/^/  📄 /' || true
fi

echo ""
echo "RESUMABLE — Set resume_from: $CURRENT_PHASE"
