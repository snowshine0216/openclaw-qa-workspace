#!/usr/bin/env bash

jira_repo_root() {
  if [[ -n "${JIRA_SKILL_REPO_ROOT:-}" ]]; then
    printf '%s\n' "$JIRA_SKILL_REPO_ROOT"
    return
  fi
  local script_dir
  script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
  cd "$script_dir/../../../.." && pwd
}

jira_workspace_override() {
  local key value
  for key in OPENCLAW_AGENT_WORKSPACE OPENCLAW_WORKSPACE; do
    value=${!key:-}
    if [[ -n "$value" && -d "$value" ]]; then
      printf '%s\n' "$value"
      return
    fi
  done
}

jira_workspace_marker() {
  local dir=$1
  [[ -f "$dir/AGENTS.md" || -f "$dir/SOUL.md" || "$(basename "$dir")" == workspace-* ]]
}

jira_workspace_root() {
  local cwd override
  override=$(jira_workspace_override)
  if [[ -n "$override" && -f "$override/.env" ]]; then
    printf '%s\n' "$override"
    return
  fi
  cwd=$(pwd -P)
  while [[ "$cwd" != "/" ]]; do
    if [[ -f "$cwd/.env" ]] && jira_workspace_marker "$cwd"; then
      printf '%s\n' "$cwd"
      return
    fi
    cwd=$(dirname "$cwd")
  done
}

jira_env_file() {
  local repo_root workspace_root
  repo_root=$(jira_repo_root)
  workspace_root=$(jira_workspace_root)
  if [[ -n "$workspace_root" && -f "$workspace_root/.env" ]]; then
    printf '%s\n' "$workspace_root/.env"
    return
  fi
  [[ -f "$repo_root/.env" ]] && printf '%s\n' "$repo_root/.env"
}

jira_read_env_var() {
  local key=$1
  local file=$2
  awk -F= -v key="$key" '
    $0 ~ "^[[:space:]]*" key "[[:space:]]*=" {
      value = substr($0, index($0, "=") + 1)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      gsub(/^"|"$/, "", value)
      gsub(/^'"'"'|'"'"'$/, "", value)
      print value
    }
  ' "$file" | tail -n1
}

load_jira_env() {
  local env_file token base_url server_url
  env_file=$(jira_env_file)
  [[ -n "$env_file" ]] || {
    echo "Unable to find Jira .env file in workspace or repo root" >&2
    return 1
  }
  token=$(jira_read_env_var JIRA_API_TOKEN "$env_file")
  base_url=$(jira_read_env_var JIRA_BASE_URL "$env_file")
  server_url=$(jira_read_env_var JIRA_SERVER "$env_file")
  [[ -n "$token" ]] || {
    echo "JIRA_API_TOKEN is missing from $env_file" >&2
    return 1
  }
  export JIRA_API_TOKEN="$token"
  if [[ -n "$base_url" ]]; then
    export JIRA_BASE_URL="$base_url"
  elif [[ -n "$server_url" ]]; then
    export JIRA_BASE_URL="$server_url"
  fi
}
