#!/usr/bin/env bash
set -euo pipefail

RUN_DIR="${1:-}"
FINAL_REPORT_PATH="${2:-}"
CHAT_ID="${3:-${FEISHU_CHAT_ID:-}}"
[[ -n "$RUN_DIR" && -n "$FINAL_REPORT_PATH" ]] || { echo "Usage: notify_feishu.sh <run-dir> <final-report-path> [chat_id]" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
RUN_JSON="$RUN_DIR/run.json"
[[ -f "$RUN_JSON" ]] || printf '{"notification_pending":null}\n' >"$RUN_JSON"

RUN_KEY="$(basename "$RUN_DIR")"
if [[ -f "$RUN_DIR/task.json" ]] && command -v jq >/dev/null 2>&1; then
  RUN_KEY="$(jq -r '.run_key // empty' "$RUN_DIR/task.json")"
  [[ -n "$RUN_KEY" ]] || RUN_KEY="$(basename "$RUN_DIR")"
fi
PAYLOAD_JSON="$(jq -n --arg run_key "$RUN_KEY" --arg final "$FINAL_REPORT_PATH" '{run_key: $run_key, final: $final}')"

if [[ -z "$CHAT_ID" ]] && [[ -f "$WORKSPACE_ROOT/TOOLS.md" ]]; then
  CHAT_ID="$(awk -F': ' '/chat_id:/ {print $2; exit}' "$WORKSPACE_ROOT/TOOLS.md")"
fi

STATUS=0
if [[ "${FEISHU_NOTIFY_SHOULD_FAIL:-}" == "1" ]]; then
  STATUS=1
elif [[ "${FEISHU_NOTIFY_SHOULD_FAIL:-}" == "0" ]]; then
  STATUS=0
else
  FEISHU_SCRIPT="$WORKSPACE_ROOT/../.agents/skills/feishu-notify/scripts/send-feishu-notification.js"
  if [[ -x "$FEISHU_SCRIPT" || -f "$FEISHU_SCRIPT" ]]; then
    TMP_PAYLOAD="$(mktemp)"
    printf '%s\n' "$PAYLOAD_JSON" >"$TMP_PAYLOAD"
    set +e
    if [[ -n "$CHAT_ID" ]]; then
      node "$FEISHU_SCRIPT" --chat-id "$CHAT_ID" --file "$TMP_PAYLOAD" >/dev/null 2>&1
    else
      node "$FEISHU_SCRIPT" --file "$TMP_PAYLOAD" >/dev/null 2>&1
    fi
    STATUS=$?
    set -e
    rm -f "$TMP_PAYLOAD"
  fi
fi

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
if command -v jq >/dev/null 2>&1; then
  if [[ "$STATUS" -eq 0 ]]; then
    jq '.notification_pending = null | .updated_at = "'"$TS"'"' "$RUN_JSON" >"$RUN_JSON.tmp"
  else
    jq --argjson payload "$PAYLOAD_JSON" '.notification_pending = {payload: $payload} | .updated_at = "'"$TS"'"' "$RUN_JSON" >"$RUN_JSON.tmp"
  fi
  mv "$RUN_JSON.tmp" "$RUN_JSON"
fi

exit "$STATUS"
