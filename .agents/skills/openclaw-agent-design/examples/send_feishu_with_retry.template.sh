#!/usr/bin/env bash
# Template: Feishu notification with retry-on-failure (CLI path).
# Use for non-agent contexts (e.g. cron). For agent-orchestrated workflows, prefer
# emit_feishu_notify_marker.template.sh — the CLI subprocess is unreliable for group chats.
#
# Copy into your skill's scripts/. Adapt RUN_KEY, RUN_DIR, SUMMARY_FILE, TOOLS_FILE,
# FEISHU_NOTIFY_SCRIPT, run_dir, set_run_field, load_feishu_chat_id for your skill.
#
# Reference: rca-orchestrator phase5_finalize.sh lines 69–77

set -Eeuo pipefail

# --- ADAPT: Set these for your skill ---
# RUN_KEY="$1"                    # e.g. run date or issue key
# RUN_DIR="$(run_dir "${RUN_KEY}")"
# SUMMARY_FILE="${RUN_DIR}/output/summary/daily-summary.md"
# TOOLS_FILE="${REPO_ROOT}/workspace-daily/TOOLS.md"
# FEISHU_NOTIFY_SCRIPT="${REPO_ROOT}/.agents/skills/feishu-notify/scripts/send-feishu-notification.js"

# load_feishu_chat_id: reads chat_id from TOOLS_FILE (grep oc_[a-zA-Z0-9_]+)
# set_run_field: jq-based update to run.json (see state.sh)
# run_dir: returns path to runs/<run-key>/

send_feishu() {
  local pending=false
  load_feishu_chat_id
  if ! node "${FEISHU_NOTIFY_SCRIPT}" --chat-id "${FEISHU_CHAT_ID}" --file "${SUMMARY_FILE}"; then
    set_run_field "${RUN_KEY}" ".notification_pending = {chat_id: \"${FEISHU_CHAT_ID}\", file: \"${SUMMARY_FILE}\"}"
    pending=true
  fi
  if ${pending}; then
    : # notification_pending already set
  else
    set_run_field "${RUN_KEY}" '.notification_pending = null'
  fi
}

# Example load_feishu_chat_id (adapt TOOLS_FILE):
# load_feishu_chat_id() {
#   FEISHU_CHAT_ID=$(grep -oE 'oc_[a-zA-Z0-9_]+' "${TOOLS_FILE}" | head -1 || true)
#   if [[ -z "${FEISHU_CHAT_ID}" ]]; then
#     echo "FEISHU_CHAT_ID not found in ${TOOLS_FILE}" >&2
#     return 1
#   fi
# }

# Example set_run_field (adapt run_dir, timestamp_utc):
# set_run_field() {
#   local run_file tmp ts
#   run_file="$(run_dir "$1")/run.json"
#   tmp="$(mktemp)"
#   ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
#   jq "$2 | .updated_at = \"${ts}\"" "${run_file}" > "${tmp}" && mv "${tmp}" "${run_file}"
# }
