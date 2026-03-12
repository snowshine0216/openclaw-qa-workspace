#!/usr/bin/env bash
set -euo pipefail

ISSUE_KEY="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
PLAN_FILE="$RUN_DIR/${ISSUE_KEY}_TESTING_PLAN.md"
HANDOFF_FILE="$RUN_DIR/tester_handoff.json"

[[ -n "$ISSUE_KEY" && -n "$RUN_DIR" ]] || { echo "Usage: phase4.sh <issue_key> <run_dir>" >&2; exit 1; }
[[ -f "$CONTEXT_DIR/issue_summary.json" ]] || { echo "Missing issue_summary.json" >&2; exit 1; }
[[ -f "$CONTEXT_DIR/fc_risk.json" ]] || { echo "Missing fc_risk.json" >&2; exit 1; }

"$SCRIPT_DIR/lib/plan_render.sh" "$ISSUE_KEY" "$RUN_DIR" >"$PLAN_FILE"

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
if command -v jq >/dev/null 2>&1; then
  jq '.analysis_ready_at = "'"$TS"'" | .testing_plan_generated_at = "'"$TS"'" | .overall_status = "completed" | .current_phase = "phase4_done" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp" && mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  jq '.output_generated_at = "'"$TS"'" | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp" && mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"

  RISK_LEVEL="$(jq -r '.risk_level // "medium"' "$CONTEXT_DIR/fc_risk.json")"
  FC_STEPS="$(jq -r '.fc_steps_count // 3' "$CONTEXT_DIR/fc_risk.json")"
  EXPLORATORY="$(jq -r 'if .risk_level == "medium" or .risk_level == "high" or .risk_level == "critical" then true else false end' "$CONTEXT_DIR/fc_risk.json")"
  AFFECTED_DOMAINS="$(jq -c '.domains // []' "$CONTEXT_DIR/affected_domains.json" 2>/dev/null || echo '[]')"
  jq -n \
    --arg issue_key "$ISSUE_KEY" \
    --arg plan_path "$PLAN_FILE" \
    --arg risk "$RISK_LEVEL" \
    --argjson fc_steps "$FC_STEPS" \
    --argjson exploratory "$EXPLORATORY" \
    --argjson domains "$AFFECTED_DOMAINS" \
    --arg generated_at "$TS" \
    '{issue_key:$issue_key,testing_plan_path:$plan_path,risk_level:$risk,fc_steps_count:$fc_steps,exploratory_required:$exploratory,affected_domains:$domains,generated_at:$generated_at}' \
    >"$HANDOFF_FILE"
else
  echo '{"issue_key":"'"$ISSUE_KEY"'","testing_plan_path":"'"$PLAN_FILE"'","risk_level":"medium","fc_steps_count":3,"exploratory_required":true,"affected_domains":[],"generated_at":"'"$TS"'"}' >"$HANDOFF_FILE"
fi

# Preserve legacy outputs for downstream consumers (workspace-tester defect-test flow)
REPO_ROOT="$(cd "$SKILL_ROOT/../../.." && pwd)"
LEGACY_DIR="$REPO_ROOT/workspace-reporter/projects/defects-analysis/$ISSUE_KEY"
LEGACY_PLAN_PATH="$LEGACY_DIR/${ISSUE_KEY}_TESTING_PLAN.md"
if [[ -d "$REPO_ROOT/workspace-reporter" ]] && [[ -f "$HANDOFF_FILE" ]]; then
  mkdir -p "$LEGACY_DIR"
  cp "$PLAN_FILE" "$LEGACY_PLAN_PATH"
  if command -v jq >/dev/null 2>&1; then
    jq '.testing_plan_path = "'"$LEGACY_PLAN_PATH"'"' "$HANDOFF_FILE" >"$LEGACY_DIR/tester_handoff.json.tmp" && mv "$LEGACY_DIR/tester_handoff.json.tmp" "$LEGACY_DIR/tester_handoff.json"
  else
    echo '{"issue_key":"'"$ISSUE_KEY"'","testing_plan_path":"'"$LEGACY_PLAN_PATH"'","risk_level":"medium","fc_steps_count":3,"exploratory_required":true,"affected_domains":[],"generated_at":"'"$TS"'"}' >"$LEGACY_DIR/tester_handoff.json"
  fi
fi

PAYLOAD=$(cat <<EOF
{"issue_key":"$ISSUE_KEY","plan_file":"$PLAN_FILE","generated_at":"$TS"}
EOF
)

if ! "$SCRIPT_DIR/notify_feishu.sh" "$RUN_DIR" "$PAYLOAD"; then
  echo "NOTIFY_PENDING"
fi

echo "PHASE4_DONE"

