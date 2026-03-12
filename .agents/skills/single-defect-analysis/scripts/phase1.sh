#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
mkdir -p "$CONTEXT_DIR"

[[ -n "$ISSUE_KEY" && -n "$RUN_DIR" ]] || { echo "Usage: phase1.sh <issue_key> <run_dir>" >&2; exit 1; }

if [[ -n "${JIRA_ISSUE_JSON_OVERRIDE:-}" && -f "${JIRA_ISSUE_JSON_OVERRIDE}" ]]; then
  cp "${JIRA_ISSUE_JSON_OVERRIDE}" "$CONTEXT_DIR/issue.json"
else
  if command -v jira >/dev/null 2>&1; then
    jira issue view "$ISSUE_KEY" --raw >"$CONTEXT_DIR/issue.json"
  elif [[ -n "${JIRA_CLI_SCRIPT:-}" && -x "${JIRA_CLI_SCRIPT}" ]]; then
    "${JIRA_CLI_SCRIPT}" issue view "$ISSUE_KEY" --raw >"$CONTEXT_DIR/issue.json"
  else
    echo "Jira fetch failed: jira-cli unavailable and no override provided" >&2
    exit 1
  fi
fi

if command -v jq >/dev/null 2>&1; then
  jq '{
    issue_key: (.key // "'"$ISSUE_KEY"'"),
    summary: (.fields.summary // ""),
    status: (.fields.status.name // ""),
    priority: (.fields.priority.name // ""),
    description: ((.fields.description // "")|tostring)
  }' "$CONTEXT_DIR/issue.json" >"$CONTEXT_DIR/issue_summary.json"
  jq '[.. | strings | scan("https?://github\\.com/[^/]+/[^/]+/pull/[0-9]+")] | unique' "$CONTEXT_DIR/issue.json" >"$CONTEXT_DIR/pr_links.json"
else
  cat >"$CONTEXT_DIR/issue_summary.json" <<EOF
{"issue_key":"$ISSUE_KEY","summary":"","status":"","priority":"","description":""}
EOF
  echo "[]" >"$CONTEXT_DIR/pr_links.json"
fi

echo "PHASE1_DONE"

