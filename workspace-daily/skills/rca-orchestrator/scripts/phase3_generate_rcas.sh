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
PHASE_NAME="phase_3_generate_rca"

build_generation_manifest() {
  local gen_manifest="${RUN_DIR}/manifest-gen.json"
  local rca_inputs=()
  shopt -s nullglob
  rca_inputs=("${RUN_DIR}"/cache/rca-input/*.json)
  shopt -u nullglob

  {
    printf '{\n'
    printf '  "run_date": %s,\n' "$(jq -Rn --arg v "${RUN_DATE}" '$v')"
    printf '  "built_at": %s,\n' "$(jq -Rn --arg v "$(timestamp_utc)" '$v')"
    printf '  "total_issues": %s,\n' "${#rca_inputs[@]}"
    printf '  "rca_inputs": '
    if [[ "${#rca_inputs[@]}" -eq 0 ]]; then
      printf '[]\n'
    else
      jq -s '[.[] | {issue_key, input_file: .jira_json_path, rca_input_file: input_filename, output_file: .rca_output_path}]' \
        --arg input_filename "" \
        "${rca_inputs[@]}"
    fi
    printf '}\n'
  } > "${gen_manifest}.tmp"

  if [[ "${#rca_inputs[@]}" -gt 0 ]]; then
    jq --arg run_dir "${RUN_DIR}" '
      .rca_inputs |= map(.rca_input_file = ($run_dir + "/cache/rca-input/" + .issue_key + ".json"))
    ' "${gen_manifest}.tmp" > "${gen_manifest}" && rm -f "${gen_manifest}.tmp"
  else
    mv "${gen_manifest}.tmp" "${gen_manifest}"
  fi

  printf '%s\n' "${gen_manifest}"
}

main() {
  trap 'mark_phase_failed "${RUN_DATE}" "${PHASE_NAME}" "$?" "${BASH_COMMAND}"' ERR
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "in_progress"

  while IFS= read -r issue_key; do
    [[ -z "${issue_key}" ]] && continue
    if [[ ! -f "${RUN_DIR}/cache/rca-input/${issue_key}.json" ]]; then
      set_task_item "${RUN_DATE}" "${issue_key}" "generation_skipped_fetch_failed"
      set_run_field "${RUN_DATE}" \
        ".spawn_sessions[\"${issue_key}\"] = {label: null, status: \"not_spawned\", reason: \"missing_rca_input\"}"
    fi
  done < <(jq -r '.issues[].issue_key' "${MANIFEST}")

  local gen_manifest
  gen_manifest="$(build_generation_manifest)"

  if [[ "$(jq '.total_issues' "${gen_manifest}")" -gt 0 ]]; then
    node "${SCRIPT_DIR}/lib/generate-rcas-via-agent.js" \
      --manifest "${gen_manifest}" \
      --output "${RUN_DIR}/spawn-results.json"
  else
    jq -n '{generated_at: now | todate, total_issues: 0, results: []}' > "${RUN_DIR}/spawn-results.json"
  fi

  while IFS= read -r item; do
    local issue_key label status started_at finished_at output_file
    issue_key=$(printf '%s\n' "${item}" | jq -r '.issue_key')
    label=$(printf '%s\n' "${item}" | jq -r '.label')
    status=$(printf '%s\n' "${item}" | jq -r '.status')
    started_at=$(printf '%s\n' "${item}" | jq -r '.started_at')
    finished_at=$(printf '%s\n' "${item}" | jq -r '.finished_at')
    output_file=$(printf '%s\n' "${item}" | jq -r '.output_file')

    set_run_field "${RUN_DATE}" \
      ".spawn_sessions[\"${issue_key}\"] = {label: \"${label}\", status: \"${status}\", started_at: \"${started_at}\", finished_at: \"${finished_at}\"}"

    if [[ "${status}" == "completed" && -f "${output_file}" ]]; then
      set_task_item "${RUN_DATE}" "${issue_key}" "generated"
      set_run_field "${RUN_DATE}" ".subtask_timestamps[\"${issue_key}\"] = \"${finished_at}\""
    else
      set_task_item "${RUN_DATE}" "${issue_key}" "generation_failed"
    fi
  done < <(jq -c '.results[]' "${RUN_DIR}/spawn-results.json")

  local terminal_count manifest_total
  terminal_count=$(jq '[.items[] | select(.status=="generated" or .status=="generation_failed" or .status=="generation_skipped_fetch_failed")] | length' "${RUN_DIR}/task.json")
  manifest_total=$(jq '.total_issues' "${MANIFEST}")
  if [[ "${terminal_count}" -ne "${manifest_total}" ]]; then
    fail_phase_and_exit "${RUN_DATE}" "${PHASE_NAME}" 1 \
      "Phase 3 terminal completeness mismatch: terminal_count=${terminal_count} manifest_total=${manifest_total}"
  fi

  set_run_field "${RUN_DATE}" ".output_generated_at = \"$(timestamp_utc)\""
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "completed"
  log_info "Phase 3 complete."
}

main
