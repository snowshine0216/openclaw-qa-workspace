#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

[[ -n "$ISSUE_KEY" && -n "$RUN_DIR" ]] || { echo "Usage: phase0.sh <issue_key> <run_dir>" >&2; exit 1; }
mkdir -p "$RUN_DIR/context" "$RUN_DIR/drafts"

STATE="$("$SCRIPT_DIR/check_resume.sh" "$ISSUE_KEY" "$RUN_DIR" | awk -F= '/^REPORT_STATE=/{print $2; exit}')"
if [[ "$STATE" != "FRESH" && -z "${SELECTED_MODE:-}" ]]; then
  echo "USER_CHOICE_REQUIRED: $STATE" >&2
  exit 2
fi

if [[ "${SELECTED_MODE:-}" == "use_existing" && "$STATE" == "FINAL_EXISTS" ]]; then
  echo "PHASE0_USE_EXISTING"
  exit 0
fi

if [[ "${SELECTED_MODE:-}" == "full_regenerate" ]]; then
  "$SCRIPT_DIR/archive_run.sh" "$RUN_DIR" "full_regenerate" >/dev/null
fi

if [[ "${SELECTED_MODE:-}" == "resume" || "${SELECTED_MODE:-}" == "smart_refresh" || "${SELECTED_MODE:-}" == "generate_from_cache" ]]; then
  # No archive; proceed with normal phase flow
  :
fi

"$SCRIPT_DIR/check_runtime_env.sh" "$ISSUE_KEY" "jira,github" "$RUN_DIR/context"

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
if command -v jq >/dev/null 2>&1 && [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.run_key = "'"$ISSUE_KEY"'" | .overall_status = "in_progress" | .current_phase = "phase0_prepare" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" > "$RUN_DIR/task.json.tmp" && mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
else
  cat >"$RUN_DIR/task.json" <<EOF
{"run_key":"$ISSUE_KEY","overall_status":"in_progress","current_phase":"phase0_prepare","updated_at":"$TS"}
EOF
fi

if command -v jq >/dev/null 2>&1 && [[ -f "$RUN_DIR/run.json" ]]; then
  jq '.analysis_scope = "phase0_to_phase4_only" | .notification_pending = (.notification_pending // null) | .spawn_history = (.spawn_history // {}) | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" > "$RUN_DIR/run.json.tmp" && mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
else
  cat >"$RUN_DIR/run.json" <<EOF
{"analysis_scope":"phase0_to_phase4_only","spawn_history":{},"notification_pending":null,"updated_at":"$TS"}
EOF
fi

echo "PHASE0_DONE"

