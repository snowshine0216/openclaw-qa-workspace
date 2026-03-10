#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

# shellcheck source=./test-lib.sh
source "${SCRIPT_DIR}/test-lib.sh"

TOOLS_FILE="${TMP_DIR}/TOOLS.md"
printf '%s\n' 'chat_id: oc_test_chat' > "${TOOLS_FILE}"

export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
export RCA_ORCHESTRATOR_TOOLS_FILE="${TOOLS_FILE}"

OUTPUT=$(bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 smart_refresh)
assert_contains "${OUTPUT}" 'RUN_DECISION=continue' "fresh run should continue"
assert_eq "$(jq -r '.phases.phase_0_prepare_run.status' "${TMP_DIR}/runs/2026-03-10/task.json")" "completed" "phase0 completed"

mkdir -p "${TMP_DIR}/runs/2026-03-10/output/summary"
printf '# done\n' > "${TMP_DIR}/runs/2026-03-10/output/summary/daily-summary.md"
OUTPUT=$(bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 smart_refresh)
assert_contains "${OUTPUT}" 'RUN_DECISION=stop' "finalized run should stop"

set +e
bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 typo-mode >/dev/null 2>&1
STATUS=$?
set -e
assert_eq "${STATUS}" "1" "invalid mode exits non-zero"
assert_eq "$(jq -r '.last_error.phase' "${TMP_DIR}/runs/2026-03-10/run.json")" "phase_0_prepare_run" "invalid mode persisted last_error"

printf 'PASS: phase0\n'
