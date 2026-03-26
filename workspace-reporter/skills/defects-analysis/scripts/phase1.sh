#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONTEXT_DIR="$RUN_DIR/context"
RUN_KEY="$(basename "$RUN_DIR")"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/../../../.." && pwd)}"
REGISTRAR_SH="$REPO_ROOT/.agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh"
RUNS_ROOT="$REPO_ROOT/workspace-reporter/skills/defects-analysis/runs"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase1.sh <input> <run-dir>" >&2; exit 1; }
[[ -f "$CONTEXT_DIR/route_decision.json" ]] || { echo "Missing route_decision.json" >&2; exit 1; }

load_jira_env() {
  [[ -f "$HOME/.agents/skills/jira-cli/.env" ]] && source "$HOME/.agents/skills/jira-cli/.env" >/dev/null 2>&1 || true
  if [[ -f "$REPO_ROOT/workspace-reporter/.env" ]]; then
    export JIRA_API_TOKEN="${JIRA_API_TOKEN:-$(grep -E '^JIRA_API_TOKEN=' "$REPO_ROOT/workspace-reporter/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")}"
    export JIRA_SERVER="${JIRA_SERVER:-$(grep -E '^JIRA_SERVER=' "$REPO_ROOT/workspace-reporter/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")}"
    export JIRA_EMAIL="${JIRA_EMAIL:-$(grep -E '^JIRA_EMAIL=' "$REPO_ROOT/workspace-reporter/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")}"
  fi
}

resolve_jira_runner() {
  if [[ -n "${JIRA_CLI_SCRIPT:-}" && -x "${JIRA_CLI_SCRIPT}" ]]; then
    echo "$JIRA_CLI_SCRIPT"
    return
  fi
  if [[ -f "$REGISTRAR_SH" ]]; then
    source "$REGISTRAR_SH"
    if resolve_shared_skill_script jira-cli scripts/jira-run.sh && [[ -x "$RESOLVED_SKILL_SCRIPT" ]]; then
      echo "$RESOLVED_SKILL_SCRIPT"
      return
    fi
  fi
  echo ""
}

extract_project_keys() {
  awk '
    NR > 1 {
      for (i = 1; i <= NF; i++) {
        if ($i ~ /^[A-Z][A-Z0-9_]+$/ && $i != "KEY" && $i != "NAME" && $i != "TYPE" && $i != "LEAD" && $i != "URL") {
          print $i
        }
      }
    }
  ' | awk '!seen[$0]++'
}

list_payload_keys() {
  local payload_file="$1"
  jq -r 'if type == "array" then .[].key else (.issues // [])[].key end' "$payload_file" | sort -u
}

discover_feature_keys() {
  local jira_runner="$1"
  local output_file="$CONTEXT_DIR/scope_source.json"
  local query=""

  if [[ "$route_kind" == "reporter_scope_release" ]]; then
    /bin/bash "$jira_runner" project list >"$CONTEXT_DIR/jira_projects.txt"
    project_keys="$(extract_project_keys <"$CONTEXT_DIR/jira_projects.txt" | paste -sd, -)"
    query="project in (${project_keys}) AND \"Release[Version Picker (single version)]\" = \"${RAW_INPUT}\" AND type = Feature"
  else
    query="$RAW_INPUT"
  fi

  /bin/bash "$jira_runner" issue list --jql "$query" --raw --paginate 50 >"$output_file"
  jq -n --argjson keys "$(list_payload_keys "$output_file" | jq -R -s 'split("\n") | map(select(length>0))')" '{feature_keys: $keys}'
}

route_kind="$(jq -r '.route_kind' "$CONTEXT_DIR/route_decision.json")"
default_key="$(jq -r '.run_key' "$CONTEXT_DIR/route_decision.json")"

if [[ "$route_kind" == "reporter_scope_single_key" ]]; then
  feature_json="$(jq -n --arg key "$default_key" '{feature_keys: [$key]}')"
elif [[ "$route_kind" == "reporter_scope_jql" ]]; then
  feature_json='{"feature_keys":[]}'
elif [[ -n "${TEST_FEATURE_KEYS_JSON:-}" ]]; then
  feature_json="$(jq -n --argjson keys "$TEST_FEATURE_KEYS_JSON" '{feature_keys: $keys}')"
else
  load_jira_env
  jira_runner="$(resolve_jira_runner)"
  [[ -n "$jira_runner" ]] || { echo "Unable to resolve jira-run.sh for scope discovery" >&2; exit 1; }
  feature_json="$(discover_feature_keys "$jira_runner")"
fi

printf '%s\n' "$feature_json" >"$CONTEXT_DIR/feature_keys.json"
printf '%s\n' "$(jq -n \
  --arg route_kind "$route_kind" \
  --arg raw_input "$RAW_INPUT" \
  --argjson feature_keys "$(printf '%s\n' "$feature_json" | jq '.feature_keys')" \
  --arg query_mode "$([[ "$route_kind" == "reporter_scope_jql" ]] && echo "direct_jql" || echo "")" \
  '{
    route_kind: $route_kind,
    raw_input: $raw_input,
    feature_keys: $feature_keys
  } + (if $query_mode == "" then {} else {query_mode: $query_mode} end)')" >"$CONTEXT_DIR/scope.json"

if [[ "$route_kind" == "reporter_scope_release" ]]; then
  explicit_release_mode=""
  if [[ -f "$RUN_DIR/task.json" ]]; then
    explicit_release_mode="$(jq -r '.selected_mode // empty' "$RUN_DIR/task.json" 2>/dev/null || true)"
  fi
  feature_plan_json="$(node "$SCRIPT_DIR/lib/compute_feature_run_plan.mjs" "$(printf '%s\n' "$feature_json" | jq -c '.feature_keys')" "$RUNS_ROOT" "$RUN_DIR" "$explicit_release_mode")"
  printf '%s\n' "$feature_plan_json" >"$CONTEXT_DIR/feature_state_matrix.json"
  printf '%s\n' "$feature_plan_json" >"$CONTEXT_DIR/feature_runs.json"
else
  default_plan_json="$(printf '%s\n' "$feature_json" | jq '{features: [.feature_keys[] | {
    feature_key: .,
    report_state: "FRESH",
    default_action: "proceed",
    selected_action: "proceed",
    canonical_run_dir: null,
    release_packet_dir: null
  }]}')"
  printf '%s\n' "$default_plan_json" >"$CONTEXT_DIR/feature_state_matrix.json"
fi

if [[ -f "$RUN_DIR/task.json" ]]; then
  jq \
    --argjson feature_keys "$(printf '%s\n' "$feature_json" | jq '.feature_keys')" \
    --arg ts "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
    '.feature_keys = $feature_keys
    | .processed_features = 0
    | .current_phase = "phase1_scope"
    | .updated_at = $ts' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
  mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi

echo "PHASE1_DONE"
