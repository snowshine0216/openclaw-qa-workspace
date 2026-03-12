#!/usr/bin/env bash
set -euo pipefail

RUN_DIR="${1:-}"
PAYLOAD_JSON="${2:-}"
[[ -n "$RUN_DIR" && -n "$PAYLOAD_JSON" ]] || { echo "Usage: notify_feishu.sh <run_dir> <payload_json>" >&2; exit 1; }
[[ -f "$RUN_DIR/run.json" ]] || echo '{"notification_pending":null}' >"$RUN_DIR/run.json"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
FEISHU_SCRIPT="${SKILL_ROOT}/feishu-notify/scripts/send-feishu-notification.js"

TMP_PAYLOAD="$(mktemp)"
printf '%s\n' "$PAYLOAD_JSON" >"$TMP_PAYLOAD"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

set +e
if [[ -x "$FEISHU_SCRIPT" ]]; then
  node "$FEISHU_SCRIPT" --file "$TMP_PAYLOAD"
  SEND_STATUS=$?
else
  SEND_STATUS=1
fi
set -e

if command -v jq >/dev/null 2>&1; then
  if [[ "$SEND_STATUS" -eq 0 ]]; then
    jq '.notification_pending = null | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp" && mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
  else
    jq --arg payload "$PAYLOAD_JSON" '.notification_pending = {"payload": $payload} | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp" && mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
  fi
else
  if [[ "$SEND_STATUS" -ne 0 ]]; then
    printf '{"notification_pending":{"payload":%q},"updated_at":"%s"}\n' "$PAYLOAD_JSON" "$TS" >"$RUN_DIR/run.json"
  fi
fi

rm -f "$TMP_PAYLOAD"
exit "$SEND_STATUS"

