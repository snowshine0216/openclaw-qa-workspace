#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FIXTURES="${SCRIPT_DIR}/fixtures"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

# shellcheck source=./test-lib.sh
source "${SCRIPT_DIR}/test-lib.sh"

MOCK_BIN="${TMP_DIR}/bin"
mkdir -p "${MOCK_BIN}"
cat > "${MOCK_BIN}/curl" <<EOF
#!/usr/bin/env bash
cat "${FIXTURES}/owner-api.json"
EOF
chmod +x "${MOCK_BIN}/curl"

export PATH="${MOCK_BIN}:${PATH}"
export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
TOOLS_FILE="${TMP_DIR}/TOOLS.md"
printf '%s\n' 'chat_id: oc_test_chat' > "${TOOLS_FILE}"
export RCA_ORCHESTRATOR_TOOLS_FILE="${TOOLS_FILE}"

bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 smart_refresh >/dev/null
bash "${ROOT}/phase1_fetch_owners.sh" 2026-03-10 >/dev/null

assert_eq "$(jq -r '.total_issues' "${TMP_DIR}/runs/2026-03-10/manifest.json")" "1" "phase1 filters requires_rca"
assert_eq "$(jq -r '.issues[0].issue_key' "${TMP_DIR}/runs/2026-03-10/manifest.json")" "BCIN-1001" "phase1 keeps expected issue"

printf 'PASS: phase1\n'
