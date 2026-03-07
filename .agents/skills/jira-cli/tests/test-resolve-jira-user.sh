#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
RESOLVE_SCRIPT="$SCRIPT_DIR/../scripts/resolve-jira-user.sh"
ORIG_PATH=$PATH

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_file_contains() {
  local file=$1
  local needle=$2
  grep -Fq "$needle" "$file" || fail "expected $file to contain [$needle]"
}

setup_case() {
  local root=$1
  mkdir -p "$root/workspace"
  cat > "$root/.env" <<'ENV'
JIRA_API_TOKEN=test-token
JIRA_BASE_URL=https://example.atlassian.net
ENV
}

make_stub_curl() {
  local bin=$1
  cat > "$bin/curl" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail
printf 'ARGS=%s\n' "$*" >> "${JIRA_CURL_LOG:?}"
cat "${JIRA_STUB_RESPONSE_FILE:?}"
STUB
  chmod +x "$bin/curl"
}

run_resolve() {
  local cwd=$1
  shift
  (
    cd "$cwd" && env \
      PATH="$PATH" \
      JIRA_SKILL_REPO_ROOT="${JIRA_SKILL_REPO_ROOT:-}" \
      JIRA_USER_EMAIL="${JIRA_USER_EMAIL:-}" \
      JIRA_USER_CACHE_FILE="${JIRA_USER_CACHE_FILE:-}" \
      JIRA_CURL_LOG="${JIRA_CURL_LOG:-}" \
      JIRA_STUB_RESPONSE_FILE="${JIRA_STUB_RESPONSE_FILE:-}" \
      JIRA_RESOLVE_NOW_EPOCH="${JIRA_RESOLVE_NOW_EPOCH:-}" \
      bash "$RESOLVE_SCRIPT" "$@"
  )
}

run_cache_miss_then_hit_test() {
  local tmp root bin cache curl_log response output lines
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  cache="$tmp/cache.json"
  curl_log="$tmp/curl.log"
  response="$tmp/response.json"
  mkdir -p "$bin"
  setup_case "$root"
  make_stub_curl "$bin"
  cat > "$response" <<'JSON'
[
  {
    "accountId": "acct-1",
    "displayName": "Liz Hu",
    "emailAddress": "lizhu@microstrategy.com"
  }
]
JSON

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    run_resolve "$root/workspace" "lizhu@microstrategy.com")
  [[ "$(printf '%s\n' "$output" | jq -r '.[0].id')" == "acct-1" ]] || fail "expected resolved account id"
  [[ -f "$cache" ]] || fail "expected cache file to be created"
  assert_file_contains "$cache" '"email:lizhu@microstrategy.com"'
  lines=$(wc -l < "$curl_log")
  [[ "$lines" -eq 1 ]] || fail "expected one curl call on cache miss"

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    run_resolve "$root/workspace" "lizhu@microstrategy.com")
  [[ "$(printf '%s\n' "$output" | jq -r '.[0].id')" == "acct-1" ]] || fail "expected cached account id"
  lines=$(wc -l < "$curl_log")
  [[ "$lines" -eq 1 ]] || fail "expected no extra curl call on cache hit"
}

run_display_name_exact_match_test() {
  local tmp root bin cache curl_log response output
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  cache="$tmp/cache.json"
  curl_log="$tmp/curl.log"
  response="$tmp/response.json"
  mkdir -p "$bin"
  setup_case "$root"
  make_stub_curl "$bin"
  cat > "$response" <<'JSON'
[
  {
    "accountId": "acct-7",
    "displayName": "Owner One",
    "emailAddress": "owner.one@example.com"
  },
  {
    "accountId": "acct-8",
    "displayName": "Owner Two",
    "emailAddress": "owner.two@example.com"
  }
]
JSON

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    run_resolve "$root/workspace" "Owner One")
  [[ "$(printf '%s\n' "$output" | jq -r '.[0].id')" == "acct-7" ]] || fail "expected exact display-name match"
}

run_ambiguous_result_test() {
  local tmp root bin cache curl_log response output
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  cache="$tmp/cache.json"
  curl_log="$tmp/curl.log"
  response="$tmp/response.json"
  mkdir -p "$bin"
  setup_case "$root"
  make_stub_curl "$bin"
  cat > "$response" <<'JSON'
[
  {
    "accountId": "acct-3",
    "displayName": "Ambiguous A",
    "emailAddress": "a@example.com"
  },
  {
    "accountId": "acct-4",
    "displayName": "Ambiguous B",
    "emailAddress": "b@example.com"
  }
]
JSON

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    run_resolve "$root/workspace" "Owner")
  [[ "$(printf '%s\n' "$output" | jq 'length')" == "2" ]] || fail "expected ambiguous matches to stay explicit"
  [[ ! -f "$cache" || "$(jq -r '.entries | length' "$cache")" == "0" ]] || fail "expected ambiguous result to avoid cache writes"
}

run_account_id_bypass_test() {
  local tmp root bin cache curl_log response output
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  cache="$tmp/cache.json"
  curl_log="$tmp/curl.log"
  response="$tmp/response.json"
  mkdir -p "$bin"
  setup_case "$root"
  make_stub_curl "$bin"
  cat > "$response" <<'JSON'
[]
JSON

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    run_resolve "$root/workspace" "5b10a2844c20165700ede21g")
  [[ "$(printf '%s\n' "$output" | jq -r '.[0].id')" == "5b10a2844c20165700ede21g" ]] || fail "expected direct account id output"
  [[ ! -s "$curl_log" ]] || fail "expected no search API call for direct accountId"
}

run_long_non_account_id_test() {
  local tmp root bin cache curl_log response output
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  cache="$tmp/cache.json"
  curl_log="$tmp/curl.log"
  response="$tmp/response.json"
  mkdir -p "$bin"
  setup_case "$root"
  make_stub_curl "$bin"
  cat > "$response" <<'JSON'
[]
JSON

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    run_resolve "$root/workspace" "long-username-123")
  [[ "$output" == "[]" ]] || fail "expected non-account long token to resolve through API and return empty"
  [[ -s "$curl_log" ]] || fail "expected search API call for non-account long token"
}

run_fresh_negative_cache_short_circuit_test() {
  local tmp root bin cache curl_log response output now
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  cache="$tmp/cache.json"
  curl_log="$tmp/curl.log"
  response="$tmp/response.json"
  mkdir -p "$bin"
  setup_case "$root"
  make_stub_curl "$bin"
  cat > "$response" <<'JSON'
[
  {
    "accountId": "acct-2",
    "displayName": "Other User",
    "emailAddress": "other@example.com"
  }
]
JSON
  now=$(date +%s)
  cat > "$cache" <<JSON
{
  "entries": {
    "name:missing owner": {
      "status": "not_found",
      "updated_epoch": $now
    }
  }
}
JSON

  output=$(PATH="$bin:$ORIG_PATH" \
    JIRA_SKILL_REPO_ROOT="$root" \
    JIRA_USER_EMAIL="bot@example.com" \
    JIRA_USER_CACHE_FILE="$cache" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_STUB_RESPONSE_FILE="$response" \
    JIRA_RESOLVE_NOW_EPOCH="$now" \
    run_resolve "$root/workspace" "Missing Owner")
  [[ "$output" == "[]" ]] || fail "expected fresh not_found cache to return empty result"
  [[ ! -s "$curl_log" ]] || fail "expected no API call when fresh negative cache exists"
}

main() {
  run_cache_miss_then_hit_test
  run_display_name_exact_match_test
  run_ambiguous_result_test
  run_account_id_bypass_test
  run_long_non_account_id_test
  run_fresh_negative_cache_short_circuit_test
  echo "test-resolve-jira-user: ok"
}

main "$@"
