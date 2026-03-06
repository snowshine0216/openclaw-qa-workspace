#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
WRAPPER_SCRIPT="$SCRIPT_DIR/jira-run.sh"
# shellcheck source=./jira-env.sh
source "$SCRIPT_DIR/jira-env.sh"
# shellcheck source=./jira-jql.sh
source "$SCRIPT_DIR/jira-jql.sh"

run_jira() {
  bash "$WRAPPER_SCRIPT" "$@"
}

cache_file_path() {
  local repo_root=$1
  printf '%s\n' "${JIRA_PROJECT_CACHE_FILE:-$repo_root/tmp/jira/project-keys.json}"
}

cache_is_fresh() {
  local cache_file=$1
  [[ -f "$cache_file" ]] || return 1
  [[ "$(jq -r '.refreshed_on // empty' "$cache_file")" == "$(date +%F)" ]]
}

cached_keys() {
  local cache_file=$1
  jq -r '.keys[]?' "$cache_file"
}

write_cache() {
  local cache_file=$1
  local keys=$2
  mkdir -p "$(dirname "$cache_file")"
  printf '%s\n' "$keys" | jq -Rsc --arg today "$(date +%F)" '{refreshed_on: $today, keys: (split("\n") | map(select(length > 0)))}' > "$cache_file"
}

fetch_project_keys() {
  local output keys
  output=$(run_jira project list 2>&1) || {
    echo "$output" >&2
    return 1
  }
  keys=$(printf '%s\n' "$output" | jira_extract_project_keys)
  [[ -n "$keys" ]] || {
    echo "Unable to parse Jira project keys from jira project list" >&2
    return 1
  }
  printf '%s\n' "$keys"
}

resolve_project_keys() {
  local cache_file=$1
  local keys
  if cache_is_fresh "$cache_file"; then
    cached_keys "$cache_file"
    return
  fi
  if keys=$(fetch_project_keys); then
    write_cache "$cache_file" "$keys"
    printf '%s\n' "$keys"
    return
  fi
  [[ -f "$cache_file" ]] || {
    echo "Unable to refresh Jira project keys and no cache is available" >&2
    return 1
  }
  jira_warn "Unable to refresh Jira project keys; using stale cache"
  cached_keys "$cache_file"
}

parse_args() {
  JIRA_SEARCH_JQL=""
  JIRA_SEARCH_HAS_PROJECT_FLAG=0
  JIRA_SEARCH_ARGS=()
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --jql|-q)
        [[ $# -ge 2 ]] || {
          echo "Missing value for $1" >&2
          return 1
        }
        JIRA_SEARCH_JQL=$2
        shift 2
        ;;
      --project|-p)
        [[ $# -ge 2 ]] || {
          echo "Missing value for $1" >&2
          return 1
        }
        JIRA_SEARCH_HAS_PROJECT_FLAG=1
        JIRA_SEARCH_ARGS+=("$1" "$2")
        shift 2
        ;;
      --project=*|-p*)
        JIRA_SEARCH_HAS_PROJECT_FLAG=1
        JIRA_SEARCH_ARGS+=("$1")
        shift
        ;;
      *)
        JIRA_SEARCH_ARGS+=("$1")
        shift
        ;;
    esac
  done
  [[ -n "$JIRA_SEARCH_JQL" ]] || {
    echo "search-jira.sh requires --jql" >&2
    return 1
  }
}

build_final_jql() {
  local repo_root cache_file keys
  if [[ "$JIRA_SEARCH_HAS_PROJECT_FLAG" == "1" ]] || jira_has_project_scope "$JIRA_SEARCH_JQL"; then
    printf '%s\n' "$JIRA_SEARCH_JQL"
    return
  fi
  repo_root=$(jira_repo_root)
  cache_file=$(cache_file_path "$repo_root")
  if ! keys=$(resolve_project_keys "$cache_file"); then
    return 1
  fi
  jira_wrap_jql "$JIRA_SEARCH_JQL" "$(printf '%s\n' "$keys" | jira_join_keys)"
}

main() {
  local final_jql
  parse_args "$@"
  if ! final_jql=$(build_final_jql); then
    return 1
  fi
  [[ -n "$final_jql" ]] || {
    echo "Final Jira JQL is empty" >&2
    return 1
  }
  if [[ ${#JIRA_SEARCH_ARGS[@]:-0} -gt 0 ]]; then
    run_jira issue list -q "$final_jql" "${JIRA_SEARCH_ARGS[@]}"
    return
  fi
  run_jira issue list -q "$final_jql"
}

main "$@"
