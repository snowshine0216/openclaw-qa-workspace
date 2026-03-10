#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

# shellcheck source=./test-lib.sh
source "${SCRIPT_DIR}/test-lib.sh"

MOCK_JIRA="${TMP_DIR}/jira"
mkdir -p "${MOCK_JIRA}/lib"
cat > "${MOCK_JIRA}/lib/jira-env.sh" <<'EOF'
#!/usr/bin/env bash
load_jira_env() { return 0; }
EOF
cat > "${MOCK_JIRA}/resolve-jira-user.sh" <<'EOF'
#!/usr/bin/env bash
if [[ "${1}" == "tqang@microstrategy.com" ]]; then
  exit 1
fi
printf '[{"id":"acc","text":"@User","displayName":"User"}]\n'
EOF
cat > "${MOCK_JIRA}/build-comment-payload.sh" <<'EOF'
#!/usr/bin/env bash
while [[ $# -gt 0 ]]; do
  case "$1" in
    --output) OUTPUT="$2"; shift 2 ;;
    --text) TEXT="$2"; shift 2 ;;
    *) shift ;;
  esac
done
printf '{"body":{"type":"doc","version":1,"content":[{"type":"paragraph","content":[{"type":"text","text":"%s"}]}]}}\n' "${TEXT}" > "${OUTPUT}"
EOF
cat > "${MOCK_JIRA}/jira-publish-playground.sh" <<'EOF'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "${RCA_TEST_PUBLISH_LOG}"
exit 0
EOF
chmod +x "${MOCK_JIRA}/lib/jira-env.sh" "${MOCK_JIRA}/resolve-jira-user.sh" "${MOCK_JIRA}/build-comment-payload.sh" "${MOCK_JIRA}/jira-publish-playground.sh"

MOCK_BUILD_ADF="${TMP_DIR}/build-adf.sh"
cat > "${MOCK_BUILD_ADF}" <<'EOF'
#!/usr/bin/env bash
printf '{"type":"doc","version":1,"content":[]}\n'
EOF
chmod +x "${MOCK_BUILD_ADF}"

TOOLS_FILE="${TMP_DIR}/TOOLS.md"
printf '%s\n' 'chat_id: oc_test_chat' > "${TOOLS_FILE}"
export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
export RCA_ORCHESTRATOR_TOOLS_FILE="${TOOLS_FILE}"
export RCA_ORCHESTRATOR_JIRA_CLI_SCRIPTS="${MOCK_JIRA}"
export RCA_ORCHESTRATOR_BUILD_ADF_SH="${MOCK_BUILD_ADF}"
export RCA_TEST_PUBLISH_LOG="${TMP_DIR}/publish.log"

bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 smart_refresh >/dev/null
mkdir -p "${TMP_DIR}/runs/2026-03-10/output/rca"
cat > "${TMP_DIR}/runs/2026-03-10/manifest.json" <<'EOF'
{
  "run_date": "2026-03-10",
  "built_at": "2026-03-10T00:00:00Z",
  "total_issues": 2,
  "issues": [
    {
      "issue_key": "BCIN-1001",
      "issue_summary": "Publish this RCA",
      "proposed_owner": { "display_name": "Xue, Yin", "account_id": "acc-1001" }
    },
    {
      "issue_key": "BCIN-1002",
      "issue_summary": "Stale RCA should not publish",
      "proposed_owner": { "display_name": "Xue, Yin", "account_id": "acc-1001" }
    }
  ]
}
EOF
cat > "${TMP_DIR}/runs/2026-03-10/task.json" <<'EOF'
{
  "run_key": "2026-03-10",
  "overall_status": "in_progress",
  "current_phase": "phase_3_generate_rca",
  "created_at": "2026-03-10T00:00:00Z",
  "updated_at": "2026-03-10T00:00:00Z",
  "phases": {},
  "items": {
    "BCIN-1001": { "status": "generated" },
    "BCIN-1002": { "status": "generation_failed" }
  }
}
EOF
cat > "${TMP_DIR}/runs/2026-03-10/run.json" <<'EOF'
{
  "data_fetched_at": null,
  "output_generated_at": null,
  "jira_published_at": null,
  "notification_pending": null,
  "updated_at": "2026-03-10T00:00:00Z",
  "subtask_timestamps": {},
  "spawn_sessions": {},
  "jira_publish": {},
  "last_error": null
}
EOF
cat > "${TMP_DIR}/runs/2026-03-10/output/rca/BCIN-1001-rca.md" <<'EOF'
# RCA for BCIN-1001
## 1. Incident Summary
Published RCA summary
## 2. References
EOF
cat > "${TMP_DIR}/runs/2026-03-10/output/rca/BCIN-1002-rca.md" <<'EOF'
# RCA for BCIN-1002
## 1. Incident Summary
Stale RCA summary
## 2. References
EOF

bash "${ROOT}/phase4_publish_to_jira.sh" 2026-03-10 >/dev/null

assert_eq "$(jq -r '.jira_publish["BCIN-1001"].status' "${TMP_DIR}/runs/2026-03-10/run.json")" "success" "generated issue publishes"
assert_eq "$(jq -r '.jira_publish["BCIN-1002"].status' "${TMP_DIR}/runs/2026-03-10/run.json")" "skipped_no_rca" "non-generated issue is skipped"
assert_eq "$(jq -r '.overall_status' "${TMP_DIR}/runs/2026-03-10/task.json")" "in_progress" "optional mention lookup failure does not poison run state"
assert_contains "$(cat "${RCA_TEST_PUBLISH_LOG}")" 'BCIN-1001' "publish log contains generated issue"
if grep -q 'BCIN-1002' "${RCA_TEST_PUBLISH_LOG}"; then
  fail "stale issue should not be published"
fi

printf 'PASS: phase4\n'
