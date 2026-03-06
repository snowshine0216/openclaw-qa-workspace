#!/usr/bin/env bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=./jira-rest.sh
source "$SCRIPT_DIR/jira-rest.sh"

jira_user_cache_file() {
  printf '%s\n' "${JIRA_USER_CACHE_FILE:-$SCRIPT_DIR/../tmp/user-account-cache.json}"
}

jira_resolve_now_epoch() {
  if [[ -n ${JIRA_RESOLVE_NOW_EPOCH:-} ]]; then
    printf '%s\n' "$JIRA_RESOLVE_NOW_EPOCH"
    return
  fi
  date +%s
}

jira_normalize_query() {
  printf '%s' "$1" | awk '{$1=$1; print}' | tr '[:upper:]' '[:lower:]'
}

jira_is_account_id() {
  local query=$1
  [[ "$query" != *' '* && "$query" != *@* ]] || return 1
  [[ "$query" =~ ^[0-9A-Za-z:-]{20,}$ ]] || return 1
  [[ "$query" == *:* || ${#query} -ge 24 ]]
}

jira_cache_key() {
  local query=$1
  local lowered
  lowered=$(jira_normalize_query "$query")
  if [[ "$query" == *'@'* ]]; then
    printf 'email:%s\n' "$lowered"
    return
  fi
  printf 'name:%s\n' "$lowered"
}

jira_resolved_ttl_seconds() {
  local ttl_days=${JIRA_USER_CACHE_TTL_DAYS:-7}
  printf '%s\n' $((ttl_days * 86400))
}

jira_negative_ttl_seconds() {
  printf '%s\n' "${JIRA_USER_NEGATIVE_CACHE_TTL_SECONDS:-3600}"
}

jira_cache_fresh() {
  local status=$1
  local updated_epoch=$2
  local now_epoch=$3
  local ttl
  [[ -n "$updated_epoch" ]] || return 1
  if [[ "$status" == 'not_found' ]]; then
    ttl=$(jira_negative_ttl_seconds)
  else
    ttl=$(jira_resolved_ttl_seconds)
  fi
  (( now_epoch - updated_epoch >= 0 && now_epoch - updated_epoch < ttl ))
}

jira_ensure_cache_file() {
  local cache_file=$1
  mkdir -p "$(dirname "$cache_file")"
  if [[ ! -f "$cache_file" ]]; then
    printf '{"entries":{}}\n' > "$cache_file"
    return
  fi
  if ! jq -e '.entries | type == "object"' "$cache_file" >/dev/null 2>&1; then
    printf '{"entries":{}}\n' > "$cache_file"
  fi
}

jira_read_cache_entry() {
  local cache_file=$1
  local key=$2
  [[ -f "$cache_file" ]] || return 1
  jq -c --arg key "$key" '.entries[$key] // empty' "$cache_file"
}

jira_write_cache_entry() {
  local cache_file=$1
  local key=$2
  local entry_json=$3
  mkdir -p "$(dirname "$cache_file")"
  if [[ ! -f "$cache_file" ]]; then
    printf '{"entries":{}}\n' > "$cache_file"
  fi
  local tmp_file
  tmp_file=$(mktemp)
  jq --arg key "$key" --argjson entry "$entry_json" '.entries[$key] = $entry' "$cache_file" > "$tmp_file"
  mv "$tmp_file" "$cache_file"
}

jira_pick_user() {
  local query=$1
  local candidates_json=$2
  local normalized
  normalized=$(jira_normalize_query "$query")
  printf '%s\n' "$candidates_json" | jq -c --arg normalized "$normalized" '
    def lower: ascii_downcase;
    (
      first(.[] | select((.emailAddress // "" | lower) == $normalized)) //
      first(.[] | select((.displayName // "" | lower) == $normalized)) //
      first(.[] | select((.username // "" | lower) == $normalized)) //
      (if length == 1 then .[0] else empty end)
    )
  '
}

jira_resolve_user_query() {
  local query=$1
  local cache_file cache_key cache_entry now_epoch entry_status updated_epoch
  local encoded_query result candidates_json candidate_count user_json

  if jira_is_account_id "$query"; then
    jq -n --arg id "$query" '[{id: $id, text: ("@" + $id)}]'
    return
  fi

  jira_require_runtime
  cache_file=$(jira_user_cache_file)
  jira_ensure_cache_file "$cache_file"
  cache_key=$(jira_cache_key "$query")
  now_epoch=$(jira_resolve_now_epoch)
  cache_entry=$(jira_read_cache_entry "$cache_file" "$cache_key" || true)

  if [[ -n "$cache_entry" ]]; then
    entry_status=$(printf '%s\n' "$cache_entry" | jq -r '.status // empty')
    updated_epoch=$(printf '%s\n' "$cache_entry" | jq -r '.updated_epoch // empty')
    if jira_cache_fresh "$entry_status" "$updated_epoch" "$now_epoch"; then
      if [[ "$entry_status" == 'resolved' ]]; then
        printf '%s\n' "$cache_entry" | jq '[.value | del(.username)]'
        return
      fi
      if [[ "$entry_status" == 'not_found' ]]; then
        printf '[]\n'
        return
      fi
    fi
  fi

  encoded_query=$(jq -rn --arg value "$query" '$value|@uri')
  result=$(jira_curl_json GET "$(jira_api_base)/user/search?query=${encoded_query}&maxResults=20")
  candidates_json=$(printf '%s\n' "$result" | jq '
    [.[] | {
      id: .accountId,
      text: (.displayName // .emailAddress // ("@" + (.accountId // ""))),
      displayName: (.displayName // ""),
      emailAddress: (.emailAddress // ""),
      username: (.name // "")
    }]
  ')
  candidate_count=$(printf '%s\n' "$candidates_json" | jq 'length')
  user_json=$(jira_pick_user "$query" "$candidates_json")

  if [[ "$candidate_count" -eq 0 ]]; then
    jira_write_cache_entry "$cache_file" "$cache_key" "{\"status\":\"not_found\",\"updated_epoch\":$now_epoch}"
    printf '[]\n'
    return
  fi

  if [[ -z "$user_json" || "$user_json" == 'null' ]]; then
    printf '%s\n' "$candidates_json" | jq '[.[] | del(.username)]'
    return
  fi

  jira_write_cache_entry "$cache_file" "$cache_key" "{\"status\":\"resolved\",\"updated_epoch\":$now_epoch,\"value\":$user_json}"
  printf '%s\n' "$user_json" | jq '[.|del(.username)]'
}
