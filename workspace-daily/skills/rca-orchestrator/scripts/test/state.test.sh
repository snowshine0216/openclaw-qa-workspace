#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

# shellcheck source=./test-lib.sh
source "${SCRIPT_DIR}/test-lib.sh"

export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
# shellcheck source=../lib/common.sh
source "${ROOT}/lib/common.sh"
# shellcheck source=../lib/state.sh
source "${ROOT}/lib/state.sh"

setup_run_dirs "2026-03-10"
init_task_json "2026-03-10"
init_run_json "2026-03-10"
set_task_phase "2026-03-10" "phase_1_manifest" "completed"
set_task_item "2026-03-10" "BCIN-1001" "generated"
set_run_field "2026-03-10" '.data_fetched_at = "2026-03-10T00:00:00Z"'
set_jira_publish_result "2026-03-10" "BCIN-1001" true false "partial_success"
set_task_overall_status "2026-03-10" "completed_with_item_failures"

assert_eq "$(jq -r '.phases.phase_1_manifest.status' "${TMP_DIR}/runs/2026-03-10/task.json")" "completed" "phase status persisted"
assert_eq "$(jq -r '.items["BCIN-1001"].status' "${TMP_DIR}/runs/2026-03-10/task.json")" "generated" "item status persisted"
assert_eq "$(jq -r '.jira_publish["BCIN-1001"].status' "${TMP_DIR}/runs/2026-03-10/run.json")" "partial_success" "publish result persisted"
assert_eq "$(jq -r '.overall_status' "${TMP_DIR}/runs/2026-03-10/task.json")" "completed_with_item_failures" "overall status persisted"

printf 'PASS: state helpers\n'
