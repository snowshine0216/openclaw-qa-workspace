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

MOCK_FEISHU="${TMP_DIR}/send-feishu-notification.js"
cat > "${MOCK_FEISHU}" <<'EOF'
#!/usr/bin/env node
process.exit(0);
EOF
chmod +x "${MOCK_FEISHU}"

export RCA_ORCHESTRATOR_RUNS_ROOT="${TMP_DIR}/runs"
export RCA_ORCHESTRATOR_TOOLS_FILE="${TOOLS_FILE}"
export RCA_ORCHESTRATOR_FEISHU_NOTIFY_SCRIPT="${MOCK_FEISHU}"

bash "${ROOT}/phase0_check_resume.sh" 2026-03-10 smart_refresh >/dev/null
cat > "${TMP_DIR}/runs/2026-03-10/manifest.json" <<'EOF'
{
  "run_date": "2026-03-10",
  "built_at": "2026-03-10T00:00:00Z",
  "total_issues": 2,
  "issues": [
    { "issue_key": "BCIN-1001", "issue_summary": "One success" },
    { "issue_key": "BCIN-1002", "issue_summary": "One skip" }
  ]
}
EOF
mkdir -p "${TMP_DIR}/runs/2026-03-10/cache/pr"
printf 'yes\n' > "${TMP_DIR}/runs/2026-03-10/cache/pr/BCIN-1001-automation-status.txt"
printf 'unknown\n' > "${TMP_DIR}/runs/2026-03-10/cache/pr/BCIN-1002-automation-status.txt"
cat > "${TMP_DIR}/runs/2026-03-10/run.json" <<'EOF'
{
  "data_fetched_at": null,
  "output_generated_at": null,
  "jira_published_at": null,
  "notification_pending": null,
  "updated_at": "2026-03-10T00:00:00Z",
  "subtask_timestamps": {},
  "spawn_sessions": {},
  "jira_publish": {
    "BCIN-1001": { "description_updated": true, "comment_added": true, "status": "success" },
    "BCIN-1002": { "description_updated": false, "comment_added": false, "status": "skipped_no_rca" }
  },
  "last_error": null
}
EOF

bash "${ROOT}/phase5_finalize.sh" 2026-03-10 >/dev/null

assert_file_exists "${TMP_DIR}/runs/2026-03-10/output/summary/daily-summary.md" "phase5 writes summary"
assert_eq "$(jq -r '.overall_status' "${TMP_DIR}/runs/2026-03-10/task.json")" "completed_with_item_failures" "phase5 marks mixed results"
assert_eq "$(jq -r '.notification_pending' "${TMP_DIR}/runs/2026-03-10/run.json")" "null" "phase5 clears pending notification on success"

printf 'PASS: phase5\n'
