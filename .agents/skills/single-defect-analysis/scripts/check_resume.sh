#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"

if [[ -z "$ISSUE_KEY" || -z "$RUN_DIR" ]]; then
  echo "Usage: check_resume.sh <issue_key> <run_dir>" >&2
  exit 1
fi

if [[ ! -d "$RUN_DIR" ]]; then
  echo "REPORT_STATE=FRESH"
  exit 0
fi

PLAN_FILE="${RUN_DIR}/${ISSUE_KEY}_TESTING_PLAN.md"
if [[ -f "$PLAN_FILE" ]]; then
  echo "REPORT_STATE=FINAL_EXISTS"
  echo "PLAN_PATH=$PLAN_FILE"
  exit 0
fi

if [[ -d "${RUN_DIR}/drafts" ]] && [[ -n "$(ls -A "${RUN_DIR}/drafts" 2>/dev/null)" ]]; then
  echo "REPORT_STATE=DRAFT_EXISTS"
  exit 0
fi

if [[ -f "${RUN_DIR}/context/issue.json" || -f "${RUN_DIR}/context/issue_summary.json" ]]; then
  echo "REPORT_STATE=CONTEXT_ONLY"
  exit 0
fi

echo "REPORT_STATE=FRESH"

