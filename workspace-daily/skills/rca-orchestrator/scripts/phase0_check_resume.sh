#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
# shellcheck source=./lib/state.sh
source "${SCRIPT_DIR}/lib/state.sh"

RUN_DATE="$1"
REFRESH_MODE="${2:-smart_refresh}"
RUN_DIR="$(run_dir "${RUN_DATE}")"
PHASE_NAME="phase_0_prepare_run"

classify_state() {
  if [[ -f "${RUN_DIR}/output/summary/daily-summary.md" ]]; then
    printf 'FINAL_EXISTS\n'
  elif compgen -G "${RUN_DIR}/output/rca/*.md" > /dev/null; then
    printf 'DRAFT_EXISTS\n'
  elif [[ -f "${RUN_DIR}/cache/owners/owners-${RUN_DATE}.json" ]]; then
    printf 'CONTEXT_ONLY\n'
  else
    printf 'FRESH\n'
  fi
}

archive_existing_outputs() {
  local archive_dir="${RUN_DIR}/archive/$(date -u +%Y%m%dT%H%M%SZ)"
  mkdir -p "${archive_dir}"
  [[ -d "${RUN_DIR}/output" ]] && cp -R "${RUN_DIR}/output" "${archive_dir}/"
  log_info "Archived outputs to ${archive_dir}"
}

wipe_run_payloads() {
  rm -rf \
    "${RUN_DIR}/output" \
    "${RUN_DIR}/cache" \
    "${RUN_DIR}/manifest.json" \
    "${RUN_DIR}/manifest-gen.json" \
    "${RUN_DIR}/spawn-results.json"
  setup_run_dirs "${RUN_DATE}"
}

main() {
  setup_run_dirs "${RUN_DATE}"
  init_task_json "${RUN_DATE}"
  init_run_json "${RUN_DATE}"
  trap 'mark_phase_failed "${RUN_DATE}" "${PHASE_NAME}" "$?" "${BASH_COMMAND}"' ERR

  local state
  state=$(classify_state)
  log_info "Phase 0: run_date=${RUN_DATE} state=${state} mode=${REFRESH_MODE}"
  printf 'REPORT_STATE=%s\n' "${state}"

  case "${REFRESH_MODE}" in
    smart_refresh)
      if [[ "${state}" == "FINAL_EXISTS" ]]; then
        log_info "Final summary already exists; stop requested."
        printf 'RUN_DECISION=stop\n'
        return 0
      fi
      ;;
    full_regenerate)
      if [[ "${state}" != "FRESH" ]]; then
        archive_existing_outputs
        wipe_run_payloads
        reset_task_json "${RUN_DATE}"
        reset_run_json "${RUN_DATE}"
        log_info "Reset run state for full_regenerate."
      fi
      ;;
    fresh)
      wipe_run_payloads
      reset_task_json "${RUN_DATE}"
      reset_run_json "${RUN_DATE}"
      log_info "Reset run state for fresh mode."
      ;;
    *)
      fail_phase_and_exit "${RUN_DATE}" "${PHASE_NAME}" 1 \
        "Invalid refresh_mode: ${REFRESH_MODE}. Expected smart_refresh, full_regenerate, or fresh."
      ;;
  esac

  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "completed"
  set_run_field "${RUN_DATE}" '.last_error = null'
  printf 'RUN_DECISION=continue\n'
  log_info "Phase 0 complete."
}

main
