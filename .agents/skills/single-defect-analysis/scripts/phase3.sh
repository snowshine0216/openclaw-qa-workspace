#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
ISSUE_SUM="$CONTEXT_DIR/issue_summary.json"
DOMAINS="$CONTEXT_DIR/affected_domains.json"

[[ -n "$ISSUE_KEY" && -n "$RUN_DIR" ]] || { echo "Usage: phase3.sh <issue_key> <run_dir>" >&2; exit 1; }
[[ -f "$ISSUE_SUM" ]] || { echo "Missing issue_summary.json" >&2; exit 1; }
[[ -f "$DOMAINS" ]] || echo '{"domains":[]}' >"$DOMAINS"

RISK_JSON="$("$SCRIPT_DIR/lib/risk_score.sh" "$ISSUE_SUM" "$DOMAINS")"
echo "$RISK_JSON" >"$CONTEXT_DIR/fc_risk.json"

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
if command -v jq >/dev/null 2>&1 && [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.current_phase = "phase3_done" | .overall_status = "analysis_in_progress" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp" && mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi

echo "PHASE3_DONE"

