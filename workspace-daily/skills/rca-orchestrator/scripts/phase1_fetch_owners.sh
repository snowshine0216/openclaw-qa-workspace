#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"
# shellcheck source=./lib/state.sh
source "${SCRIPT_DIR}/lib/state.sh"

RUN_DATE="$1"
RUN_DIR="$(run_dir "${RUN_DATE}")"
OWNERS_CACHE="${RUN_DIR}/cache/owners/owners-${RUN_DATE}.json"
MANIFEST="${RUN_DIR}/manifest.json"
PHASE_NAME="phase_1_manifest"

fetch_owner_api() {
  log_info "Fetching owner API..."
  curl -sS --fail "${OWNER_API_URL}" | jq '{
    fetched_at: now | todate,
    defects: [.defects[] | select(.category == "requires_rca")]
  }' > "${OWNERS_CACHE}"
}

build_manifest() {
  jq -n \
    --arg run_date "${RUN_DATE}" \
    --arg ts "$(timestamp_utc)" \
    --slurpfile owners "${OWNERS_CACHE}" \
    '{
      run_date: $run_date,
      built_at: $ts,
      total_issues: ($owners[0].defects | length),
      issues: [
        $owners[0].defects[] | {
          issue_key: .key,
          issue_summary: .summary,
          proposed_owner: {
            display_name: .proposed_owner,
            account_id: (.proposed_owner_account_id // null)
          },
          owner_confidence: (.owner_confidence // "unknown"),
          jira_url: ("https://strategyagile.atlassian.net/browse/" + .key)
        }
      ]
    }' > "${MANIFEST}"
}

main() {
  trap 'mark_phase_failed "${RUN_DATE}" "${PHASE_NAME}" "$?" "${BASH_COMMAND}"' ERR
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "in_progress"
  fetch_owner_api
  build_manifest
  set_task_phase "${RUN_DATE}" "${PHASE_NAME}" "completed"
  log_info "Phase 1 complete."
}

main
