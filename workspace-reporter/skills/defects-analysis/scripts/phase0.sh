#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
MODE="${3:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUN_KEY="$(basename "$RUN_DIR")"
CONTEXT_DIR="$RUN_DIR/context"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/../../../.." && pwd)}"
REGISTRAR_SH="$REPO_ROOT/.agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase0.sh <input> <run-dir> [--post]" >&2; exit 1; }
mkdir -p "$CONTEXT_DIR" "$RUN_DIR/drafts" "$RUN_DIR/reports" "$RUN_DIR/archive"

write_json_file() {
  local path="$1"
  local content="$2"
  printf '%s\n' "$content" >"$path"
}

select_mode() {
  local state="$1"
  case "$state" in
    FINAL_EXISTS) echo "${SELECTED_MODE:-use_existing}" ;;
    DRAFT_EXISTS) echo "${SELECTED_MODE:-resume}" ;;
    CONTEXT_ONLY) echo "${SELECTED_MODE:-generate_from_cache}" ;;
    *) echo "${SELECTED_MODE:-proceed}" ;;
  esac
}

recent_fetch_guard_required() {
  local run_json="$1"
  [[ -f "$run_json" ]] || return 1
  local ts
  ts="$(jq -r '.data_fetched_at // .output_generated_at // empty' "$run_json" 2>/dev/null || true)"
  [[ -n "$ts" ]] || return 1
  node --input-type=module -e '
    const ts = process.argv[1];
    const parsed = Date.parse(ts);
    if (Number.isNaN(parsed)) process.exit(1);
    const diffMs = Date.now() - parsed;
    process.exit(diffMs >= 0 && diffMs < 3600_000 ? 0 : 1);
  ' "$ts"
}

fetch_issue_type() {
  local input="$1"
  local issue_key="$1"
  if [[ -n "${TEST_JIRA_ISSUE_TYPE:-}" ]]; then
    echo "$TEST_JIRA_ISSUE_TYPE"
    return
  fi
  if [[ "$input" =~ /browse/([A-Z][A-Z0-9]{1,10}-[0-9]+)(\?.*)?$ ]]; then
    issue_key="${BASH_REMATCH[1]}"
  fi
  if [[ ! "$issue_key" =~ ^[A-Z][A-Z0-9]{1,10}-[0-9]+$ ]]; then
    echo ""
    return
  fi
  jira_script="${JIRA_CLI_SCRIPT:-}"
  if [[ -z "$jira_script" && -f "$REGISTRAR_SH" ]]; then
    source "$REGISTRAR_SH"
    resolve_shared_skill_script jira-cli scripts/jira-run.sh && jira_script="$RESOLVED_SKILL_SCRIPT"
  fi
  if [[ -n "$jira_script" && -x "$jira_script" ]]; then
    set +e
    issue_type="$(/bin/bash "$jira_script" issue view "$issue_key" --raw 2>/dev/null | jq -r '.fields.issuetype.name // empty' 2>/dev/null)"
    set -e
    echo "$issue_type"
    return
  fi
  echo ""
}

if [[ "$MODE" == "--post" ]]; then
  issue_key="$(node --input-type=module -e "import { readFileSync } from 'node:fs'; const file=process.argv[1]; const route=JSON.parse(readFileSync(file,'utf8')); console.log(route.issue_key || route.run_key);" "$CONTEXT_DIR/route_decision.json")"
  delegated_path=".agents/skills/single-defect-analysis/runs/${issue_key}"
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  write_json_file "$CONTEXT_DIR/delegated_run.json" "$(cat <<EOF
{
  "run_key": "${issue_key}",
  "route_kind": "issue_class",
  "delegated_skill": ".agents/skills/single-defect-analysis",
  "delegated_run_dir": "${delegated_path}",
  "delegated_at": "${ts}"
}
EOF
)"
  echo "DELEGATED_RUN: ${delegated_path}"
  exit 0
fi

state="$("$SCRIPT_DIR/check_resume.sh" "$RUN_KEY" "$RUN_DIR" | awk -F= '/^REPORT_STATE=/{print $2; exit}')"
selected_mode="$(select_mode "$state")"

if [[ "$selected_mode" == "use_existing" && "$state" == "FINAL_EXISTS" ]]; then
  echo "PHASE0_USE_EXISTING"
  exit 0
fi

if [[ "$selected_mode" == "smart_refresh" || "$selected_mode" == "full_regenerate" ]]; then
  if recent_fetch_guard_required "$RUN_DIR/run.json" && [[ "${DESTRUCTIVE_REFRESH_CONFIRMED:-0}" != "1" ]]; then
    echo "DESTRUCTIVE_REFRESH_CONFIRMATION_REQUIRED: existing data was fetched less than one hour ago" >&2
    exit 2
  fi
  "$SCRIPT_DIR/archive_run.sh" "$RUN_DIR" "$selected_mode"
fi

"$SCRIPT_DIR/check_runtime_env.sh" "$RUN_KEY" "jira,github" "$CONTEXT_DIR"
issue_type="$(fetch_issue_type "$RAW_INPUT")"
route_json="$(node "$SCRIPT_DIR/lib/classify_input.mjs" "$RAW_INPUT" "$issue_type")"
write_json_file "$CONTEXT_DIR/route_decision.json" "$route_json"

route_kind="$(printf '%s\n' "$route_json" | jq -r '.route_kind')"
ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

jq -n \
  --arg run_key "$RUN_KEY" \
  --arg raw_input "$RAW_INPUT" \
  --arg route_kind "$route_kind" \
  --arg selected_mode "$selected_mode" \
  --arg updated_at "$ts" \
  '{
    run_key: $run_key,
    raw_input: $raw_input,
    route_kind: $route_kind,
    selected_mode: $selected_mode,
    overall_status: "analysis_in_progress",
    current_phase: "phase0_prepare",
    feature_keys: [],
    processed_features: 0,
    processed_defects: 0,
    processed_prs: 0,
    failed_prs: [],
    delegated_skill: null,
    delegated_run_dir: null,
    notification_status: "pending",
    updated_at: $updated_at
  }' >"$RUN_DIR/task.json"

jq -n \
  --arg report_state "$state" \
  --arg selected_mode "$selected_mode" \
  --arg updated_at "$ts" \
  '{
    data_fetched_at: null,
    scope_discovered_at: null,
    pr_analysis_completed_at: null,
    output_generated_at: null,
    review_completed_at: null,
    spawn_history: {},
    notification_pending: null,
    auto_selected_defaults: {
      report_state: $report_state,
      selected_mode: $selected_mode
    },
    updated_at: $updated_at
  }' >"$RUN_DIR/run.json"

if [[ "$route_kind" == "issue_class" ]]; then
  issue_key="$(printf '%s\n' "$route_json" | jq -r '.issue_key')"
  if [[ "${TEST_SKIP_DELEGATE_SPAWN:-}" == "1" ]]; then
    write_json_file "$CONTEXT_DIR/delegated_run.json" "$(cat <<EOF
{
  "run_key": "${issue_key}",
  "route_kind": "issue_class",
  "delegated_skill": ".agents/skills/single-defect-analysis",
  "delegated_run_dir": ".agents/skills/single-defect-analysis/runs/${issue_key}",
  "delegated_at": "${ts}"
}
EOF
)"
    echo "DELEGATED_RUN: .agents/skills/single-defect-analysis/runs/${issue_key}"
    exit 0
  fi

  write_json_file "$CONTEXT_DIR/phase0_delegation_manifest.json" "$(cat <<EOF
{
  "requests": [
    {
      "openclaw": {
        "args": {
          "task": "Run single-defect-analysis for ${issue_key}",
          "label": "single-defect-${issue_key}",
          "mode": "run",
          "runtime": "subagent"
        }
      }
    }
  ]
}
EOF
)"
  echo "SPAWN_MANIFEST: $CONTEXT_DIR/phase0_delegation_manifest.json"
  exit 0
fi

echo "PHASE0_DONE"
