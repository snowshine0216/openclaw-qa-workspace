#!/usr/bin/env bash
set -euo pipefail

RUN_KEY="${1:-}"
RUN_DIR="${2:-}"

[[ -n "$RUN_KEY" && -n "$RUN_DIR" ]] || {
  echo "Usage: check_resume.sh <run-key> <run-dir>" >&2
  exit 1
}

if [[ -f "$RUN_DIR/${RUN_KEY}_REPORT_FINAL.md" ]]; then
  echo "REPORT_STATE=FINAL_EXISTS"
elif [[ -f "$RUN_DIR/${RUN_KEY}_REPORT_DRAFT.md" || -f "$RUN_DIR/${RUN_KEY}_REVIEW_SUMMARY.md" ]]; then
  echo "REPORT_STATE=DRAFT_EXISTS"
elif [[ -f "$RUN_DIR/context/jira_raw.json" || -f "$RUN_DIR/context/feature_keys.json" || -f "$RUN_DIR/context/route_decision.json" ]]; then
  echo "REPORT_STATE=CONTEXT_ONLY"
else
  echo "REPORT_STATE=FRESH"
fi
