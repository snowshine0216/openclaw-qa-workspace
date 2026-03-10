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
PHASE_NAME="phase_2_fetch_and_normalize"

fetch_jira_issue() {
  local issue_key="$1"
  local out="${RUN_DIR}/cache/issues/${issue_key}.json"
  [[ -f "${out}" ]] && return 0
  bash "${JIRA_CLI_SCRIPTS}/jira-run.sh" issue view "${issue_key}" --raw --comments 100 > "${out}"
}

extract_pr_urls() {
  jq -r '.fields.comment.comments[]?.body // empty' "$1" \
    | grep -oE 'https://github\.com/[^/]+/[^/]+/pull/[0-9]+' \
    | sort -u || true
}

fetch_pr_diffs() {
  local issue_key="$1"
  local jira_json="${RUN_DIR}/cache/issues/${issue_key}.json"
  local pr_out="${RUN_DIR}/cache/pr/${issue_key}.txt"
  local automation_file="${RUN_DIR}/cache/pr/${issue_key}-automation-status.txt"
  local pr_urls automation_status

  pr_urls="$(extract_pr_urls "${jira_json}")"
  automation_status="no"
  : > "${pr_out}"

  [[ -z "${pr_urls}" ]] && {
    printf 'unknown\n' > "${automation_file}"
    return 0
  }

  while IFS= read -r pr_url; do
    local repo pr_num pr_meta title branch
    repo=$(printf '%s\n' "${pr_url}" | sed -E 's|https://github\.com/([^/]+/[^/]+)/pull/.*|\1|')
    pr_num=$(printf '%s\n' "${pr_url}" | sed -E 's|.*/pull/([0-9]+)|\1|')
    pr_meta=$(gh pr view "${pr_num}" --repo "${repo}" --json title,headRefName 2>/dev/null || printf '{}\n')
    title=$(printf '%s\n' "${pr_meta}" | jq -r '.title // ""')
    branch=$(printf '%s\n' "${pr_meta}" | jq -r '.headRefName // ""')

    {
      printf '=== PR #%s: %s ===\n' "${pr_num}" "${pr_url}"
      printf 'Title: %s\nBranch: %s\n\n' "${title:-"(metadata unavailable)"}" "${branch:-"(metadata unavailable)"}"
      gh pr diff "${pr_num}" --repo "${repo}" 2>/dev/null || printf '(diff unavailable)\n'
      printf '\n===========================================\n\n'
    } >> "${pr_out}"

    if printf '%s%s\n' "${title}" "${branch}" | grep -Eqi 'automation|autotest|auto-test'; then
      automation_status="yes"
    fi
  done < <(printf '%s\n' "${pr_urls}")

  printf '%s\n' "${automation_status}" > "${automation_file}"
}

build_rca_input() {
  local issue_key="$1"
  local jira_json="${RUN_DIR}/cache/issues/${issue_key}.json"
  local pr_out="${RUN_DIR}/cache/pr/${issue_key}.txt"
  local automation_file="${RUN_DIR}/cache/pr/${issue_key}-automation-status.txt"
  local rca_input="${RUN_DIR}/cache/rca-input/${issue_key}.json"
  local issue_summary automation_status pr_list

  issue_summary=$(jq -r '.fields.summary // "N/A"' "${jira_json}")
  automation_status="unknown"
  [[ -f "${automation_file}" ]] && automation_status=$(cat "${automation_file}")
  pr_list=$( (grep -oE 'https://github\.com/[^/]+/[^/]+/pull/[0-9]+' "${pr_out}" || true) | sort -u | jq -R . | jq -s . )

  jq -n \
    --arg issue_key "${issue_key}" \
    --arg issue_summary "${issue_summary}" \
    --arg automation_status "${automation_status}" \
    --argjson pr_list "${pr_list}" \
    --arg jira_json_path "${jira_json}" \
    --arg pr_data_path "${pr_out}" \
    --arg rca_output_path "${RUN_DIR}/output/rca/${issue_key}-rca.md" \
    '{
      issue_key: $issue_key,
      issue_summary: $issue_summary,
      automation_status: $automation_status,
      pr_list: $pr_list,
      jira_json_path: $jira_json_path,
      pr_data_path: $pr_data_path,
      rca_output_path: $rca_output_path
    }' > "${rca_input}"
}

main() {
  trap 'mark_phase_failed "${RUN_DATE}" "${PHASE_NAME}" "$?" "${BASH_COMMAND}"' ERR
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "in_progress"
  load_jira_env_from_skill

  local total
  total=$(jq '.issues | length' "${MANIFEST}")
  log_info "Phase 2: fetching ${total} issues"

  while IFS= read -r issue_key; do
    [[ -z "${issue_key}" ]] && continue
    if fetch_jira_issue "${issue_key}"; then
      fetch_pr_diffs "${issue_key}"
      build_rca_input "${issue_key}"
      set_task_item "${RUN_DATE}" "${issue_key}" "fetch_ready"
    else
      set_task_item "${RUN_DATE}" "${issue_key}" "fetch_failed"
    fi
  done < <(jq -r '.issues[].issue_key' "${MANIFEST}")

  set_run_field "${RUN_DATE}" ".data_fetched_at = \"$(timestamp_utc)\""
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "completed"
  log_info "Phase 2 complete."
}

main
