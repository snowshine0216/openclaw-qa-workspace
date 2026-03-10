#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

# shellcheck source=./test-lib.sh
source "${SCRIPT_DIR}/test-lib.sh"

TOOLS_FILE="${TMP_DIR}/TOOLS.md"
cat > "${TOOLS_FILE}" <<'EOF'
# tools
- chat_id: oc_test_chat
EOF

export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
export RCA_ORCHESTRATOR_TOOLS_FILE="${TOOLS_FILE}"
# shellcheck source=../lib/common.sh
source "${ROOT}/lib/common.sh"

setup_run_dirs "2026-03-10"
load_feishu_chat_id

assert_eq "$(run_dir "2026-03-10")" "${TMP_DIR}/runs/2026-03-10" "run_dir uses override"
assert_eq "${FEISHU_CHAT_ID}" "oc_test_chat" "feishu chat id loaded"

printf 'PASS: common helpers\n'
