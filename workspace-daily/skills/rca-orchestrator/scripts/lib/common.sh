#!/usr/bin/env bash

COMMON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="${RCA_ORCHESTRATOR_SKILL_ROOT:-$(cd "${COMMON_DIR}/../.." && pwd)}"
REPO_ROOT="${RCA_ORCHESTRATOR_REPO_ROOT:-$(cd "${SKILL_ROOT}/../../.." && pwd)}"
RUNS_ROOT="${RCA_ORCHESTRATOR_RUNS_ROOT:-${SKILL_ROOT}/scripts/runs}"
TOOLS_FILE="${RCA_ORCHESTRATOR_TOOLS_FILE:-${REPO_ROOT}/workspace-daily/TOOLS.md}"
OWNER_API_URL="${RCA_ORCHESTRATOR_OWNER_API_URL:-http://10.23.38.9:8070/api/jira/customer-defects/details/?status=completed&limit=500}"
BUILD_ADF_SH="${RCA_ORCHESTRATOR_BUILD_ADF_SH:-${REPO_ROOT}/.agents/skills/jira-cli/scripts/build-adf.sh}"
FEISHU_NOTIFY_SCRIPT="${RCA_ORCHESTRATOR_FEISHU_NOTIFY_SCRIPT:-${REPO_ROOT}/.agents/skills/feishu-notify/scripts/send-feishu-notification.js}"
JIRA_CLI_SCRIPTS="${RCA_ORCHESTRATOR_JIRA_CLI_SCRIPTS:-${REPO_ROOT}/.agents/skills/jira-cli/scripts}"
DEFAULT_RUN_TZ="${RCA_ORCHESTRATOR_TZ:-Asia/Shanghai}"

run_dir() {
  printf '%s\n' "${RUNS_ROOT}/$1"
}

timestamp_utc() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log_file_path() {
  local run_date="${1:-${RUN_DATE:-unknown}}"
  printf '%s\n' "$(run_dir "${run_date}")/logs/run-${run_date}.log"
}

log_info() {
  local log_file
  log_file="$(log_file_path "${RUN_DATE:-unknown}")"
  mkdir -p "$(dirname "${log_file}")"
  printf '[%s] INFO  %s\n' "$(date +"%Y-%m-%dT%H:%M:%S")" "$*" | tee -a "${log_file}"
}

log_error() {
  local log_file
  log_file="$(log_file_path "${RUN_DATE:-unknown}")"
  mkdir -p "$(dirname "${log_file}")"
  printf '[%s] ERROR %s\n' "$(date +"%Y-%m-%dT%H:%M:%S")" "$*" | tee -a "${log_file}" >&2
}

setup_run_dirs() {
  local base
  base="$(run_dir "$1")"
  mkdir -p \
    "${base}/cache/owners" \
    "${base}/cache/issues" \
    "${base}/cache/pr" \
    "${base}/cache/rca-input" \
    "${base}/output/rca" \
    "${base}/output/adf" \
    "${base}/output/comments" \
    "${base}/output/summary" \
    "${base}/logs" \
    "${base}/archive"
}

phase_not_done() {
  local task_file status
  task_file="$(run_dir "$1")/task.json"
  [[ ! -f "${task_file}" ]] && return 0
  status=$(jq -r --arg p "$2" '.phases[$p].status // "pending"' "${task_file}")
  [[ "${status}" != "completed" ]]
}

load_feishu_chat_id() {
  FEISHU_CHAT_ID=$(grep -oE 'oc_[a-zA-Z0-9_]+' "${TOOLS_FILE}" | head -1 || true)
  if [[ -z "${FEISHU_CHAT_ID}" ]]; then
    log_error "FEISHU_CHAT_ID not found in ${TOOLS_FILE}"
    return 1
  fi
}

load_jira_env_from_skill() {
  local jira_env_sh="${JIRA_CLI_SCRIPTS}/lib/jira-env.sh"
  if [[ ! -f "${jira_env_sh}" ]]; then
    log_error "Jira env loader not found: ${jira_env_sh}"
    return 1
  fi
  # shellcheck source=/dev/null
  source "${jira_env_sh}"
  load_jira_env
}
