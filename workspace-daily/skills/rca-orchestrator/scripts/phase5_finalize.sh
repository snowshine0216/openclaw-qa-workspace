#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
# shellcheck source=./lib/state.sh
source "${SCRIPT_DIR}/lib/state.sh"

RUN_DATE="$1"
RUN_DIR="$(run_dir "${RUN_DATE}")"
MANIFEST="${RUN_DIR}/manifest.json"
SUMMARY_FILE="${RUN_DIR}/output/summary/daily-summary.md"
PHASE_NAME="phase_5_finalize"

generate_summary() {
  local total published partial skipped failed
  total=$(jq '.total_issues' "${MANIFEST}")
  published=$(jq '[.jira_publish[] | select(.status=="success")] | length' "${RUN_DIR}/run.json")
  partial=$(jq '[.jira_publish[] | select(.status=="partial_success")] | length' "${RUN_DIR}/run.json")
  skipped=$(jq '[.jira_publish[] | select(.status=="skipped_no_rca")] | length' "${RUN_DIR}/run.json")
  failed=$(jq '[.jira_publish[] | select(.status=="failed")] | length' "${RUN_DIR}/run.json")

  cat > "${SUMMARY_FILE}" <<EOF
# RCA Daily Summary - ${RUN_DATE}

**Date:** $(date -u +"%Y-%m-%d %H:%M UTC")

---

## Results

| Metric | Count |
|--------|-------|
| Total issues | ${total} |
| Published (success) | ${published} |
| Partial success (description only) | ${partial} |
| Skipped (no RCA available) | ${skipped} |
| Failed | ${failed} |

---

## Per-Issue Status

| Issue | Summary | Automation | Jira Status |
|-------|---------|------------|-------------|
EOF

  while IFS= read -r issue_key; do
    local summary automation status
    [[ -z "${issue_key}" ]] && continue
    summary=$(jq -r --arg k "${issue_key}" '.issues[] | select(.issue_key==$k) | .issue_summary' "${MANIFEST}" | cut -c1-60)
    automation=$(cat "${RUN_DIR}/cache/pr/${issue_key}-automation-status.txt" 2>/dev/null || printf 'unknown\n')
    status=$(jq -r --arg k "${issue_key}" '.jira_publish[$k].status // "not_attempted"' "${RUN_DIR}/run.json")
    printf '| [%s](https://strategyagile.atlassian.net/browse/%s) | %s... | %s | %s |\n' \
      "${issue_key}" "${issue_key}" "${summary}" "${automation}" "${status}" >> "${SUMMARY_FILE}"
  done < <(jq -r '.issues[].issue_key' "${MANIFEST}")

  cat >> "${SUMMARY_FILE}" <<EOF

---

**Run directory:** \`${RUN_DIR}\`
**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")
**Agent:** QA Daily Check (rca-orchestrator)
EOF
}

send_feishu() {
  local pending=false
  load_feishu_chat_id
  if ! node "${FEISHU_NOTIFY_SCRIPT}" --chat-id "${FEISHU_CHAT_ID}" --file "${SUMMARY_FILE}"; then
    set_run_field "${RUN_DATE}" ".notification_pending = {chat_id: \"${FEISHU_CHAT_ID}\", file: \"${SUMMARY_FILE}\"}"
    pending=true
  fi
  ${pending} || set_run_field "${RUN_DATE}" '.notification_pending = null'
}

main() {
  trap 'mark_phase_failed "${RUN_DATE}" "${PHASE_NAME}" "$?" "${BASH_COMMAND}"' ERR
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "in_progress"
  generate_summary
  send_feishu
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "completed"

  if jq -e '[.jira_publish[] | select(.status!="success")] | length > 0' "${RUN_DIR}/run.json" >/dev/null; then
    set_task_overall_status "${RUN_DATE}" "completed_with_item_failures"
  else
    set_task_overall_status "${RUN_DATE}" "completed"
  fi
  log_info "Phase 5 complete."
}

main
