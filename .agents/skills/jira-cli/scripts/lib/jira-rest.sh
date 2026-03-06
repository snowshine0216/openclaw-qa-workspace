#!/usr/bin/env bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=./jira-env.sh
source "$SCRIPT_DIR/jira-env.sh"

jira_config_login() {
  local config_file=${JIRA_CONFIG_FILE:-$HOME/.config/.jira/.config.yml}
  [[ -f "$config_file" ]] || return 0
  awk -F': ' '$1 == "login" { print $2 }' "$config_file" | tail -n1
}

jira_user_email() {
  local key
  for key in JIRA_USER_EMAIL JIRA_LOGIN JIRA_EMAIL; do
    if [[ -n ${!key:-} ]]; then
      printf '%s\n' "${!key}"
      return
    fi
  done
  jira_config_login
}

jira_require_runtime() {
  command -v curl >/dev/null || {
    echo 'curl is required' >&2
    return 1
  }
  command -v jq >/dev/null || {
    echo 'jq is required' >&2
    return 1
  }
  load_jira_env
  [[ -n ${JIRA_BASE_URL:-} ]] || {
    echo 'JIRA_BASE_URL is required' >&2
    return 1
  }
  [[ -n $(jira_user_email) ]] || {
    echo 'JIRA_USER_EMAIL or jira config login is required' >&2
    return 1
  }
}

jira_api_base() {
  printf '%s/rest/api/3' "${JIRA_BASE_URL%/}"
}

jira_curl_json() {
  local method=$1
  local url=$2
  local data_file=${3:-}
  local login
  login=$(jira_user_email)

  if [[ -n "$data_file" ]]; then
    curl -sS --fail \
      -u "${login}:${JIRA_API_TOKEN}" \
      -H 'Accept: application/json' \
      -H 'Content-Type: application/json' \
      -X "$method" \
      --data @"$data_file" \
      "$url"
    return
  fi

  curl -sS --fail \
    -u "${login}:${JIRA_API_TOKEN}" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    -X "$method" \
    "$url"
}
