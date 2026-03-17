#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase5.sh <input> <run-dir>" >&2; exit 1; }
[[ -f "$CONTEXT_DIR/jira_raw.json" ]] || { echo "Missing jira_raw.json" >&2; exit 1; }

if [[ -f "$RUN_DIR/task.json" ]] && command -v jq >/dev/null 2>&1; then
  RUN_KEY="$(jq -r '.run_key // empty' "$RUN_DIR/task.json")"
fi
RUN_KEY="${RUN_KEY:-$(basename "$RUN_DIR")}"

load_jira_server() {
  if [[ -n "${JIRA_SERVER:-}" ]]; then
    printf '%s\n' "${JIRA_SERVER%/}"
    return
  fi
  if [[ -f "$HOME/.agents/skills/jira-cli/.env" ]]; then
    local env_server
    env_server="$(grep -E '^JIRA_SERVER=' "$HOME/.agents/skills/jira-cli/.env" | cut -d= -f2- | tr -d '"' | tr -d "'" | head -n1)"
    if [[ -n "$env_server" ]]; then
      printf '%s\n' "${env_server%/}"
      return
    fi
  fi
  if [[ -f "$REPO_ROOT/workspace-reporter/.env" ]]; then
    local workspace_server
    workspace_server="$(grep -E '^JIRA_SERVER=' "$REPO_ROOT/workspace-reporter/.env" | cut -d= -f2- | tr -d '"' | tr -d "'" | head -n1)"
    if [[ -n "$workspace_server" ]]; then
      printf '%s\n' "${workspace_server%/}"
      return
    fi
  fi
  printf '%s\n' "https://jira.example.com"
}

JIRA_BASE_URL="$(load_jira_server)"

REPORTER_SCRIPT="$SCRIPT_DIR/lib/generate_report.mjs"
REVIEWER_SCRIPT="$SCRIPT_DIR/../../report-quality-reviewer/scripts/review.mjs"

generate_report() {
  node "$REPORTER_SCRIPT" "$RUN_DIR" "$RUN_KEY" "$JIRA_BASE_URL"
}

attempt=1
status="fail"
while [[ "$attempt" -le 3 ]]; do
  generate_report
  status="$(node "$REVIEWER_SCRIPT" "$RUN_DIR" "$RUN_KEY" 2>/dev/null)" || status="fail"
  if [[ "$status" == "pass" ]]; then
    break
  fi
  attempt=$((attempt + 1))
done

[[ "$status" == "pass" ]] || { echo "Phase 5 review loop failed to converge" >&2; exit 1; }
cp "$RUN_DIR/${RUN_KEY}_REPORT_DRAFT.md" "$RUN_DIR/${RUN_KEY}_REPORT_FINAL.md"
node "$SCRIPT_DIR/lib/report_bundle_validator.mjs" "$RUN_KEY" "$RUN_DIR" >/dev/null

if [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.overall_status = "completed" | .current_phase = "phase5_finalize" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
  mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi
if [[ -f "$RUN_DIR/run.json" ]]; then
  jq '.output_generated_at = "'"$TS"'" | .review_completed_at = "'"$TS"'" | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp"
  mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
fi

if [[ -n "${FEISHU_CHAT_ID:-}" ]]; then
  if [[ -f "$RUN_DIR/task.json" ]]; then
    jq '.notification_status = "sent" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
    mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  fi
  echo "FEISHU_NOTIFY: chat_id=${FEISHU_CHAT_ID} run_key=${RUN_KEY} final=${RUN_DIR}/${RUN_KEY}_REPORT_FINAL.md"
else
  if "$SCRIPT_DIR/notify_feishu.sh" "$RUN_DIR" "${RUN_DIR}/${RUN_KEY}_REPORT_FINAL.md" "${notification_target:-}"; then
    if [[ -f "$RUN_DIR/task.json" ]]; then
      jq '.notification_status = "sent" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
      mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
    fi
  else
    if [[ -f "$RUN_DIR/task.json" ]]; then
      jq '.notification_status = "pending" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
      mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
    fi
  fi
fi

echo "PHASE5_DONE"
