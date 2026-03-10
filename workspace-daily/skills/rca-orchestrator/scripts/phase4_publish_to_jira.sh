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
PHASE_NAME="phase_4_publish_to_jira"

convert_and_save_adf() {
  local issue_key="$1"
  local rca_file="${RUN_DIR}/output/rca/${issue_key}-rca.md"
  local adf_out="${RUN_DIR}/output/adf/${issue_key}.adf.json"
  local header

  bash "${BUILD_ADF_SH}" "${rca_file}" - | jq -c '.' > "${adf_out}.tmp"
  header=$(jq -n \
    --arg ts "$(date -u +"%Y-%m-%d %H:%M UTC")" \
    --arg issue_key "${issue_key}" \
    '{"type":"paragraph","content":[{"type":"text","text": ("[" + $ts + "] RCA Generated for " + $issue_key),"marks":[{"type":"strong"}]},{"type":"hardBreak"}]}')
  jq --argjson header "${header}" '.content = [$header] + .content' "${adf_out}.tmp" > "${adf_out}"
  rm -f "${adf_out}.tmp"
}

publish_description() {
  bash "${JIRA_CLI_SCRIPTS}/jira-publish-playground.sh" \
    --issue "$1" \
    --description-file "${RUN_DIR}/output/adf/$1.adf.json" \
    --update-description \
    --post
}

publish_comment() {
  bash "${JIRA_CLI_SCRIPTS}/jira-publish-playground.sh" \
    --issue "$1" \
    --comment-file "${RUN_DIR}/output/comments/$1-comment.json" \
    --add-comment \
    --post
}

build_executive_summary() {
  awk '/^## 1\. Incident Summary/,/^## 2\./' "$1" | grep -v '^## ' | head -5 | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g'
}

resolve_first_match() {
  local query="$1"
  local result
  result=$(bash "${JIRA_CLI_SCRIPTS}/resolve-jira-user.sh" "${query}" 2>/dev/null | jq -c 'if length > 0 then .[0] else empty end' || true)
  printf '%s\n' "${result}"
}

resolve_plan_user() {
  local name="$1" result='' first='' last=''
  result=$(resolve_first_match "${name}")
  [[ -n "${result}" ]] && { printf '%s\n' "${result}"; return 0; }
  if [[ "${name}" == *","* ]]; then
    last=$(printf '%s\n' "${name%%,*}" | xargs)
    first=$(printf '%s\n' "${name#*,}" | xargs)
    result=$(resolve_first_match "${first} ${last}")
    [[ -n "${result}" ]] && { printf '%s\n' "${result}"; return 0; }
    result=$(resolve_first_match "${last} ${first}")
  fi
  printf '%s\n' "${result}"
}

build_mentions_file() {
  local issue_key="$1"
  local mentions_out="$2"
  local mentions='[]' owner_name='' result=''

  for stakeholder in "tqang@microstrategy.com" "lizhu@microstrategy.com"; do
    result=$(resolve_first_match "${stakeholder}")
    [[ -n "${result}" ]] && mentions=$(printf '%s\n' "${mentions}" | jq --argjson r "${result}" '. += [$r]')
  done

  owner_name=$(jq -r --arg k "${issue_key}" '.issues[] | select(.issue_key==$k) | .proposed_owner.display_name // ""' "${MANIFEST}")
  if [[ -n "${owner_name}" ]]; then
    result=$(resolve_plan_user "${owner_name}")
    [[ -n "${result}" ]] && mentions=$(printf '%s\n' "${mentions}" | jq --argjson r "${result}" '. += [$r]')
  fi

  printf '%s\n' "${mentions}" | jq 'unique_by(.id)' > "${mentions_out}"
}

build_comment_payload() {
  local issue_key="$1"
  local rca_file="${RUN_DIR}/output/rca/${issue_key}-rca.md"
  local mentions_file="${RUN_DIR}/output/comments/${issue_key}-mentions.json"
  local comment_out="${RUN_DIR}/output/comments/${issue_key}-comment.json"
  local summary

  build_mentions_file "${issue_key}" "${mentions_file}"
  summary=$(build_executive_summary "${rca_file}")
  bash "${JIRA_CLI_SCRIPTS}/build-comment-payload.sh" \
    --text "RCA Executive Summary - ${issue_key}. ${summary} - RCA generated and Jira updated." \
    --mentions-file "${mentions_file}" \
    --output "${comment_out}"
}

main() {
  trap 'mark_phase_failed "${RUN_DATE}" "${PHASE_NAME}" "$?" "${BASH_COMMAND}"' ERR
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "in_progress"
  load_jira_env_from_skill

  local total
  total=$(jq '.issues | length' "${MANIFEST}")
  log_info "Phase 4: publishing ${total} issues"

  while IFS= read -r issue_key; do
    local generation_status rca_file desc_ok=false comment_ok=false
    [[ -z "${issue_key}" ]] && continue
    rca_file="${RUN_DIR}/output/rca/${issue_key}-rca.md"
    generation_status=$(jq -r --arg k "${issue_key}" '.items[$k].status // "missing"' "${RUN_DIR}/task.json")

    if [[ "${generation_status}" != "generated" ]]; then
      set_jira_publish_result "${RUN_DATE}" "${issue_key}" false false "skipped_no_rca"
      set_task_item "${RUN_DATE}" "${issue_key}" "publish_skipped_no_rca"
      continue
    fi

    if [[ ! -f "${rca_file}" ]]; then
      set_jira_publish_result "${RUN_DATE}" "${issue_key}" false false "skipped_no_rca"
      set_task_item "${RUN_DATE}" "${issue_key}" "publish_skipped_no_rca"
      continue
    fi

    convert_and_save_adf "${issue_key}" && publish_description "${issue_key}" && desc_ok=true
    if ${desc_ok} && build_comment_payload "${issue_key}" && publish_comment "${issue_key}"; then
      comment_ok=true
    fi

    if ${desc_ok} && ${comment_ok}; then
      set_jira_publish_result "${RUN_DATE}" "${issue_key}" true true "success"
      set_task_item "${RUN_DATE}" "${issue_key}" "published"
    elif ${desc_ok}; then
      set_jira_publish_result "${RUN_DATE}" "${issue_key}" true false "partial_success"
      set_task_item "${RUN_DATE}" "${issue_key}" "publish_partial_success"
    else
      set_jira_publish_result "${RUN_DATE}" "${issue_key}" false false "failed"
      set_task_item "${RUN_DATE}" "${issue_key}" "publish_failed"
    fi
  done < <(jq -r '.issues[].issue_key' "${MANIFEST}")

  set_run_field "${RUN_DATE}" ".jira_published_at = \"$(timestamp_utc)\""
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "completed"
  log_info "Phase 4 complete."
}

main
