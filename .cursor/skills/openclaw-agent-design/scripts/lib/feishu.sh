#!/usr/bin/env bash
# lib/feishu.sh — Feishu send + fallback helpers

feishu_send() {
  local summary_file="$1"
  local chat_id="$2"
  local feishu_script="${FEISHU_SCRIPT_PATH:-../send-feishu-notification.js}"
  if [[ ! -f "$feishu_script" ]]; then
    return 1
  fi
  node "$feishu_script" "$summary_file" "$chat_id"
}

feishu_persist_fallback() {
  local run_json_path="$1"
  local payload="$2"
  local encoded
  encoded=$(echo "$payload" | base64)
  jq --arg payload "$encoded" '.notification_pending = $payload | .updated_at = (now | strftime("%Y-%m-%dT%H:%M:%SZ"))' "$run_json_path" > "${run_json_path}.tmp" && mv "${run_json_path}.tmp" "$run_json_path"
}

feishu_retry_if_pending() {
  local run_json_path="$1"
  local chat_id="$2"
  local pending
  pending=$(jq -r '.notification_pending // empty' "$run_json_path")
  if [[ -n "$pending" ]]; then
    local decoded
    decoded=$(echo "$pending" | base64 --decode)
    local tmp_sum
    tmp_sum="/tmp/feishu_retry_summary_$(date +%s).md"
    echo "$decoded" > "$tmp_sum"
    if feishu_send "$tmp_sum" "$chat_id"; then
      jq '.notification_pending = null | .updated_at = (now | strftime("%Y-%m-%dT%H:%M:%SZ"))' "$run_json_path" > "${run_json_path}.tmp" && mv "${run_json_path}.tmp" "$run_json_path"
    fi
  fi
}
