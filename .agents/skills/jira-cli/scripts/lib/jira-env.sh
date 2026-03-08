#!/usr/bin/env bash

# Jira env resolution order:
# 1. JIRA_ENV_FILE (explicit path)
# 2. Skill folder (same dir as SKILL.md, derived from this script's location)
# 3. Workspace root (.env in OPENCLAW_WORKSPACE or dir with AGENTS.md/SOUL.md/workspace-*)
# 4. Repo root

jira_skill_root() {
  local script_dir
  script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
  cd "$script_dir/../.." && pwd
}

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
  local repo_root workspace_root skill_root
  if [[ -n "${JIRA_ENV_FILE:-}" && -f "${JIRA_ENV_FILE}" ]]; then
    printf '%s\n' "$JIRA_ENV_FILE"
    return
  fi
  skill_root=$(jira_skill_root)
  workspace_root=$(jira_workspace_root)
  repo_root=$(jira_repo_root)
  if [[ -f "$skill_root/.env" ]]; then
    printf '%s\n' "$skill_root/.env"
    return
  fi
  if [[ -n "$workspace_root" && -f "$workspace_root/.env" ]]; then
    printf '%s\n' "$workspace_root/.env"
    return
  fi
  if [[ -f "$repo_root/.env" ]]; then
    printf '%s\n' "$repo_root/.env"
    return
  fi
  return 1
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

_jira_env_checked_paths() {
  local workspace_root repo_root skill_root
  skill_root=$(jira_skill_root 2>/dev/null)
  workspace_root=$(jira_workspace_root 2>/dev/null)
  repo_root=$(jira_repo_root 2>/dev/null)
  printf 'Checked (in order):\n'
  [[ -n "${JIRA_ENV_FILE:-}" ]] && printf '  - JIRA_ENV_FILE=%s\n' "$JIRA_ENV_FILE"
  [[ -n "$skill_root" ]] && printf '  - %s/.env (skill folder, recommended)\n' "$skill_root"
  [[ -n "$workspace_root" ]] && printf '  - %s/.env\n' "$workspace_root"
  [[ -n "$repo_root" ]] && printf '  - %s/.env\n' "$repo_root"
  printf 'Create one with JIRA_API_TOKEN and JIRA_BASE_URL. See .env.example in the skill folder.\n'
}

load_jira_env() {
  local env_file token base_url server_url
  env_file=$(jira_env_file) || true
  if [[ -z "$env_file" ]]; then
    echo "jira-cli: No Jira .env file found." >&2
    _jira_env_checked_paths >&2
    return 1
  fi
  token=$(jira_read_env_var JIRA_API_TOKEN "$env_file")
  base_url=$(jira_read_env_var JIRA_BASE_URL "$env_file")
  server_url=$(jira_read_env_var JIRA_SERVER "$env_file")
  if [[ -z "$token" ]]; then
    echo "jira-cli: JIRA_API_TOKEN is missing from $env_file" >&2
    echo "Add JIRA_API_TOKEN=your-token to that file. See .env.example in the skill folder." >&2
    return 1
  fi
  export JIRA_API_TOKEN="$token"
  if [[ -n "$base_url" ]]; then
    export JIRA_BASE_URL="$base_url"
  elif [[ -n "$server_url" ]]; then
    export JIRA_BASE_URL="$server_url"
  fi
}
