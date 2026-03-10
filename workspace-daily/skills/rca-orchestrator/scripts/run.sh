#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: bash workspace-daily/skills/rca-orchestrator/scripts/run.sh [YYYY-MM-DD] [refresh_mode]

refresh_mode:
  smart_refresh   default
  full_regenerate
  fresh
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if [[ "${1:-}" == -* ]]; then
  printf 'Unknown option: %s\n\n' "${1}" >&2
  usage >&2
  exit 1
fi

RUN_DATE="${1:-$(TZ="${DEFAULT_RUN_TZ}" date +%Y-%m-%d)}"
REFRESH_MODE="${2:-smart_refresh}"

log_info "=== RCA Daily Run: ${RUN_DATE} [${REFRESH_MODE}] ==="

phase0_output=$(bash "${SCRIPT_DIR}/phase0_check_resume.sh" "${RUN_DATE}" "${REFRESH_MODE}")
printf '%s\n' "${phase0_output}" | tee -a "$(log_file_path "${RUN_DATE}")"

if printf '%s\n' "${phase0_output}" | grep -q '^RUN_DECISION=stop$'; then
  log_info "Phase 0 requested stop; exiting cleanly."
  exit 0
fi

if phase_not_done "${RUN_DATE}" "phase_1_manifest"; then
  bash "${SCRIPT_DIR}/phase1_fetch_owners.sh" "${RUN_DATE}"
fi

if phase_not_done "${RUN_DATE}" "phase_2_fetch_and_normalize"; then
  bash "${SCRIPT_DIR}/phase2_fetch_issues.sh" "${RUN_DATE}"
fi

if phase_not_done "${RUN_DATE}" "phase_3_generate_rca"; then
  bash "${SCRIPT_DIR}/phase3_generate_rcas.sh" "${RUN_DATE}"
fi

if phase_not_done "${RUN_DATE}" "phase_4_publish_to_jira"; then
  bash "${SCRIPT_DIR}/phase4_publish_to_jira.sh" "${RUN_DATE}"
fi

if phase_not_done "${RUN_DATE}" "phase_5_finalize"; then
  bash "${SCRIPT_DIR}/phase5_finalize.sh" "${RUN_DATE}"
fi

log_info "=== RCA Daily Run Complete: ${RUN_DATE} ==="
