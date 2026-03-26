#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
CONTEXT_DIR="$RUN_DIR/context"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/../../../.." && pwd)}"
REGISTRAR_SH="$REPO_ROOT/.agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase2.sh <input> <run-dir>" >&2; exit 1; }
[[ -f "$CONTEXT_DIR/feature_keys.json" ]] || { echo "Missing feature_keys.json" >&2; exit 1; }
mkdir -p "$CONTEXT_DIR/jira_issues"

selected_mode=""
if [[ -f "$RUN_DIR/task.json" ]]; then
  selected_mode="$(jq -r '.selected_mode // empty' "$RUN_DIR/task.json" 2>/dev/null || true)"
fi
route_kind=""
if [[ -f "$CONTEXT_DIR/route_decision.json" ]]; then
  route_kind="$(jq -r '.route_kind // empty' "$CONTEXT_DIR/route_decision.json" 2>/dev/null || true)"
fi

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

normalize_jira_raw_file() {
  local path="$1"
  jq 'if type == "array" then {issues: .} elif (.issues? | type) == "array" then {issues: .issues} else {issues: []} end' "$path" >"$path.tmp"
  mv "$path.tmp" "$path"
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

fetch_project_keys() {
  local jira_runner="$1"
  /bin/bash "$jira_runner" project list >"$CONTEXT_DIR/jira_projects.txt"
  extract_project_keys <"$CONTEXT_DIR/jira_projects.txt" | paste -sd, -
}

feature_count="$(jq '.feature_keys | length' "$CONTEXT_DIR/feature_keys.json")"

if [[ "$selected_mode" == "generate_from_cache" ]] && [[ ! -f "$CONTEXT_DIR/jira_raw.json" ]]; then
  echo "CACHE_REQUIRED_MISSING: jira_raw.json is required for generate_from_cache" >&2
  exit 2
elif [[ "$route_kind" == "reporter_scope_release" ]]; then
  printf '{"issues":[]}\n' >"$CONTEXT_DIR/jira_raw.json"
elif [[ "$route_kind" == "reporter_scope_jql" ]]; then
  if [[ -f "$CONTEXT_DIR/jira_raw.json" ]] && [[ "$selected_mode" == "generate_from_cache" || "$selected_mode" == "resume" || "$selected_mode" == "smart_refresh" ]]; then
    :
  elif [[ -n "${TEST_JIRA_RAW_JSON:-}" ]]; then
    printf '%s\n' "$TEST_JIRA_RAW_JSON" >"$CONTEXT_DIR/jira_raw.json"
  else
    load_jira_env
    jira_runner="$(resolve_jira_runner)"
    [[ -n "$jira_runner" ]] || { echo "Unable to resolve jira-run.sh for Jira extraction" >&2; exit 1; }
    /bin/bash "$jira_runner" issue list --jql "$RAW_INPUT" --raw --paginate 50 >"$CONTEXT_DIR/jira_raw.json"
  fi
  normalize_jira_raw_file "$CONTEXT_DIR/jira_raw.json"
elif [[ "$feature_count" == "0" ]]; then
  printf '{"issues":[]}\n' >"$CONTEXT_DIR/jira_raw.json"
elif [[ "$selected_mode" == "generate_from_cache" || "$selected_mode" == "resume" || "$selected_mode" == "smart_refresh" ]] && [[ -f "$CONTEXT_DIR/jira_raw.json" ]]; then
  :
elif [[ -n "${TEST_JIRA_RAW_JSON:-}" ]]; then
  printf '%s\n' "$TEST_JIRA_RAW_JSON" >"$CONTEXT_DIR/jira_raw.json"
else
  load_jira_env
  jira_runner="$(resolve_jira_runner)"
  [[ -n "$jira_runner" ]] || { echo "Unable to resolve jira-run.sh for Jira extraction" >&2; exit 1; }
  project_keys="$(fetch_project_keys "$jira_runner")"
  tmp_dir="$(mktemp -d)"
  while IFS= read -r feature_key; do
    [[ -n "$feature_key" ]] || continue
    /bin/bash "$jira_runner" issue list --jql "project in (${project_keys}) AND issuetype = Defect AND (issue in linkedIssues(\"${feature_key}\") OR parent = \"${feature_key}\" OR \"Parent Link\" = \"${feature_key}\")" --raw --paginate 50 >"$tmp_dir/${feature_key}.json" 2>/dev/null || printf '{"issues":[]}\n' >"$tmp_dir/${feature_key}.json"
  done < <(jq -r '.feature_keys[]' "$CONTEXT_DIR/feature_keys.json")
  if compgen -G "$tmp_dir/*.json" >/dev/null; then
    jq -s '{issues: ([ .[] | if type == "array" then .[] else (.issues // [])[] end ] | unique_by(.key))}' "$tmp_dir"/*.json >"$CONTEXT_DIR/jira_raw.json"
  else
    printf '{"issues":[]}\n' >"$CONTEXT_DIR/jira_raw.json"
  fi
  rm -rf "$tmp_dir"
fi

jq -c '.issues[]?' "$CONTEXT_DIR/jira_raw.json" | while IFS= read -r issue; do
  key="$(printf '%s\n' "$issue" | jq -r '.key')"
  printf '%s\n' "$issue" >"$CONTEXT_DIR/jira_issues/${key}.json"
done

issue_count="$(jq '.issues | length' "$CONTEXT_DIR/jira_raw.json")"
if [[ -f "$RUN_DIR/task.json" ]]; then
  jq '.processed_defects = '"$issue_count"' | .current_phase = "phase2_extract" | .updated_at = "'"$TS"'"' "$RUN_DIR/task.json" >"$RUN_DIR/task.json.tmp"
  mv "$RUN_DIR/task.json.tmp" "$RUN_DIR/task.json"
fi
if [[ -f "$RUN_DIR/run.json" ]]; then
  jq '.data_fetched_at = (.data_fetched_at // "'"$TS"'") | .updated_at = "'"$TS"'"' "$RUN_DIR/run.json" >"$RUN_DIR/run.json.tmp"
  mv "$RUN_DIR/run.json.tmp" "$RUN_DIR/run.json"
fi

echo "PHASE2_DONE"
