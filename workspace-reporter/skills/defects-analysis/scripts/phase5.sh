#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase5.sh <input> <run-dir>" >&2; exit 1; }
if [[ -f "$RUN_DIR/task.json" ]] && command -v jq >/dev/null 2>&1; then
  RUN_KEY="$(jq -r '.run_key // empty' "$RUN_DIR/task.json")"
  ROUTE_KIND="$(jq -r '.route_kind // empty' "$RUN_DIR/task.json")"
fi
RUN_KEY="${RUN_KEY:-$(basename "$RUN_DIR")}"
ROUTE_KIND="${ROUTE_KIND:-$(jq -r '.route_kind // empty' "$CONTEXT_DIR/route_decision.json" 2>/dev/null || true)}"

if [[ "$ROUTE_KIND" == "reporter_scope_release" ]]; then
  [[ -f "$CONTEXT_DIR/release_summary_inputs.json" ]] || { echo "Missing release_summary_inputs.json" >&2; exit 1; }
else
  [[ -f "$CONTEXT_DIR/jira_raw.json" ]] || { echo "Missing jira_raw.json" >&2; exit 1; }
  if [[ ! -f "$CONTEXT_DIR/feature_metadata.json" ]]; then
    node "$SCRIPT_DIR/lib/extract_feature_metadata.mjs" "$RUN_DIR" "$RUN_KEY" >/dev/null
  fi
fi

load_jira_server() {
  if [[ -n "${JIRA_SERVER:-}" ]]; then
    printf '%s\n' "${JIRA_SERVER%/}"
    return
  fi
  if [[ -f "$HOME/.agents/skills/jira-cli/.env" ]]; then
    local env_server
    env_server="$(grep -E '^JIRA_SERVER=' "$HOME/.agents/skills/jira-cli/.env" | cut -d= -f2- | tr -d '"' | tr -d "'" | head -n1)"
    if [[ -n "$env_server" ]]; then
      printf '%s\n' "${env_server%/}"
      return
    fi
  fi
  if [[ -f "$REPO_ROOT/workspace-reporter/.env" ]]; then
    local workspace_server
    workspace_server="$(grep -E '^JIRA_SERVER=' "$REPO_ROOT/workspace-reporter/.env" | cut -d= -f2- | tr -d '"' | tr -d "'" | head -n1)"
    if [[ -n "$workspace_server" ]]; then
      printf '%s\n' "${workspace_server%/}"
      return
    fi
  fi
  printf '%s\n' "https://jira.example.com"
}

JIRA_BASE_URL="$(load_jira_server)"

REPORTER_SCRIPT="${REPORTER_SCRIPT:-$SCRIPT_DIR/lib/generate_report.mjs}"
REVIEWER_SCRIPT="${REVIEWER_SCRIPT:-$SCRIPT_DIR/../../report-quality-reviewer/scripts/review.mjs}"
AUTO_FIX_SCRIPT="${AUTO_FIX_SCRIPT:-$SCRIPT_DIR/lib/auto_fix_report_format.mjs}"

generate_report() {
  node "$REPORTER_SCRIPT" "$RUN_DIR" "$RUN_KEY" "$JIRA_BASE_URL"
}

write_evolution_support_artifacts() {
  [[ -f "$CONTEXT_DIR/jira_raw.json" ]] || return 0
  local freshness_json="$CONTEXT_DIR/analysis_freshness_${RUN_KEY}.json"
  local source_issue_timestamp=""
  local pr_timestamp=""
  local upstream_qa_plan_timestamp=""
  local knowledge_pack_version=""

  source_issue_timestamp="$(jq -r '[.issues[]?.fields.updated?, .issues[]?.fields.resolutiondate?, .issues[]?.fields.created?] | map(select(. != null and . != "")) | .[0] // empty' "$CONTEXT_DIR/jira_raw.json" 2>/dev/null || true)"
  if [[ -f "$CONTEXT_DIR/pr_impact_summary.json" ]]; then
    pr_timestamp="$(jq -r '.pr_timestamp // .latest_pr_timestamp // .generated_at // empty' "$CONTEXT_DIR/pr_impact_summary.json" 2>/dev/null || true)"
  fi
  if [[ -f "$CONTEXT_DIR/upstream_qa_plan_metadata.json" ]]; then
    upstream_qa_plan_timestamp="$(jq -r '.updated_at // .qa_plan_timestamp // empty' "$CONTEXT_DIR/upstream_qa_plan_metadata.json" 2>/dev/null || true)"
  fi
  if [[ -f "$CONTEXT_DIR/knowledge_pack_metadata.json" ]]; then
    knowledge_pack_version="$(jq -r '.version // empty' "$CONTEXT_DIR/knowledge_pack_metadata.json" 2>/dev/null || true)"
  fi
  if [[ -z "$knowledge_pack_version" ]]; then
    knowledge_pack_version="${KNOWLEDGE_PACK_VERSION:-}"
  fi

  jq -n \
    --arg generated_at "$TS" \
    --arg source_issue_timestamp "$source_issue_timestamp" \
    --arg pr_timestamp "$pr_timestamp" \
    --arg upstream_qa_plan_timestamp "$upstream_qa_plan_timestamp" \
    --arg knowledge_pack_version "$knowledge_pack_version" \
    '{
      generated_at: $generated_at,
      source_issue_timestamp: ($source_issue_timestamp | select(length > 0) // null),
      pr_timestamp: ($pr_timestamp | select(length > 0) // null),
      upstream_qa_plan_timestamp: ($upstream_qa_plan_timestamp | select(length > 0) // null),
      knowledge_pack_version_used: ($knowledge_pack_version | select(length > 0) // null)
    }' >"$freshness_json"
}

generate_report

attempt=1
status="fail"
while [[ "$attempt" -le 3 ]]; do
  status="$(node "$REVIEWER_SCRIPT" "$RUN_DIR" "$RUN_KEY" 2>/dev/null)" || status="fail"
  if [[ "$status" == "pass" || "$status" == "pass_with_advisories" ]]; then
    break
  fi
  fix_result="$(node "$AUTO_FIX_SCRIPT" "$RUN_DIR" "$RUN_KEY" 2>/dev/null)" || fix_result="unchanged"
  if [[ "$fix_result" != "changed" ]]; then
    break
  fi
  attempt=$((attempt + 1))
done

[[ "$status" == "pass" || "$status" == "pass_with_advisories" ]] || { echo "Phase 5 review loop failed to converge" >&2; exit 1; }
cp "$RUN_DIR/${RUN_KEY}_REPORT_DRAFT.md" "$RUN_DIR/${RUN_KEY}_REPORT_FINAL.md"
if [[ "$ROUTE_KIND" != "reporter_scope_release" ]]; then
  node "$SCRIPT_DIR/lib/build_feature_summary.mjs" "$RUN_DIR" "$RUN_KEY" >/dev/null
fi
node "$SCRIPT_DIR/lib/report_bundle_validator.mjs" "$RUN_KEY" "$RUN_DIR" >/dev/null
write_evolution_support_artifacts

if [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.overall_status = "completed" | .current_phase = "phase5_finalize" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
  mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi
if [[ -f "$RUN_DIR/run.json" ]]; then
  jq '.output_generated_at = "'"$TS"'" | .review_completed_at = "'"$TS"'" | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp"
  mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
fi

if [[ "${SUPPRESS_NOTIFICATION:-0}" == "1" ]]; then
  if [[ -f "$RUN_DIR/task.json" ]]; then
    jq '.notification_status = "suppressed" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
    mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  fi
  echo "NOTIFY_SUPPRESSED: run_key=${RUN_KEY}"
elif [[ -n "${FEISHU_CHAT_ID:-}" ]]; then
  if [[ -f "$RUN_DIR/task.json" ]]; then
    jq '.notification_status = "sent" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
    mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
  fi
  echo "FEISHU_NOTIFY: chat_id=${FEISHU_CHAT_ID} run_key=${RUN_KEY} final=${RUN_DIR}/${RUN_KEY}_REPORT_FINAL.md"
else
  if "$SCRIPT_DIR/notify_feishu.sh" "$RUN_DIR" "${RUN_DIR}/${RUN_KEY}_REPORT_FINAL.md" "${notification_target:-}"; then
    if [[ -f "$RUN_DIR/task.json" ]]; then
      jq '.notification_status = "sent" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
      mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
    fi
  else
    if [[ -f "$RUN_DIR/task.json" ]]; then
      jq '.notification_status = "pending" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
      mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
    fi
  fi
fi

echo "PHASE5_DONE"
