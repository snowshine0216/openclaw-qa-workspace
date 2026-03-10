#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FIXTURES="${SCRIPT_DIR}/fixtures"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

# shellcheck source=./test-lib.sh
source "${SCRIPT_DIR}/test-lib.sh"

MOCK_JIRA="${TMP_DIR}/jira"
mkdir -p "${MOCK_JIRA}/lib"
cat > "${MOCK_JIRA}/jira-run.sh" <<EOF
#!/usr/bin/env bash
cat "${FIXTURES}/jira-issue.json"
EOF
cat > "${MOCK_JIRA}/lib/jira-env.sh" <<'EOF'
#!/usr/bin/env bash
load_jira_env() { return 0; }
EOF
chmod +x "${MOCK_JIRA}/jira-run.sh" "${MOCK_JIRA}/lib/jira-env.sh"

MOCK_BIN="${TMP_DIR}/bin"
mkdir -p "${MOCK_BIN}"
cat > "${MOCK_BIN}/gh" <<'EOF'
#!/usr/bin/env bash
if [[ "$1" == "pr" && "$2" == "view" ]]; then
  printf '{"title":"automation fix","headRefName":"automation/test-branch"}\n'
  exit 0
fi
if [[ "$1" == "pr" && "$2" == "diff" ]]; then
  printf 'diff --git a/file b/file\n'
  exit 0
fi
exit 1
EOF
chmod +x "${MOCK_BIN}/gh"

TOOLS_FILE="${TMP_DIR}/TOOLS.md"
printf '%s\n' 'chat_id: oc_test_chat' > "${TOOLS_FILE}"
export PATH="${MOCK_BIN}:${PATH}"
export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
export RCA_ORCHESTRATOR_TOOLS_FILE="${TOOLS_FILE}"
export RCA_ORCHESTRATOR_JIRA_CLI_SCRIPTS="${MOCK_JIRA}"

bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 smart_refresh >/dev/null
cat > "${TMP_DIR}/runs/2026-03-10/manifest.json" <<'EOF'
{
  "run_date": "2026-03-10",
  "built_at": "2026-03-10T00:00:00Z",
  "total_issues": 1,
  "issues": [
    {
      "issue_key": "BCIN-1001",
      "issue_summary": "Broken workflow after upgrade",
      "proposed_owner": { "display_name": "Xue, Yin", "account_id": "acc-1001" }
    }
  ]
}
EOF

bash "${ROOT}/phase2_fetch_issues.sh" 2026-03-10 >/dev/null

assert_file_exists "${TMP_DIR}/runs/2026-03-10/cache/rca-input/BCIN-1001.json" "phase2 writes rca input"
assert_eq "$(jq -r '.items["BCIN-1001"].status' "${TMP_DIR}/runs/2026-03-10/task.json")" "fetch_ready" "phase2 records fetch_ready"
assert_eq "$(jq -r '.automation_status' "${TMP_DIR}/runs/2026-03-10/cache/rca-input/BCIN-1001.json")" "yes" "phase2 derives automation status"

printf 'PASS: phase2\n'
