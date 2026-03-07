#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BUILD_ADF_SCRIPT="$SCRIPT_DIR/../scripts/build-adf.sh"
BUILD_COMMENT_SCRIPT="$SCRIPT_DIR/../scripts/build-comment-payload.sh"
PUBLISH_SCRIPT="$SCRIPT_DIR/../scripts/jira-publish-playground.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_file_contains() {
  local file=$1
  local needle=$2
  grep -Fq "$needle" "$file" || fail "expected $file to contain [$needle]"
}

main() {
  local tmp bin workspace adf_md mentions_json adf_json comment_json curl_log curl_body
  tmp=$(mktemp -d)
  bin="$tmp/bin"
  workspace="$tmp/workspace-test"
  adf_md="$tmp/rca.md"
  mentions_json="$tmp/mentions.json"
  adf_json="$tmp/adf.json"
  comment_json="$tmp/comment.json"
  curl_log="$tmp/curl.log"
  curl_body="$tmp/curl-body.log"

  mkdir -p "$bin" "$workspace"

  cat > "$workspace/.env" <<'WSENV'
JIRA_API_TOKEN=token
JIRA_BASE_URL=https://example.atlassian.net
WSENV

  cat > "$bin/curl" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$JIRA_CURL_LOG"
args=("$@")
for ((i=0; i<${#args[@]}; i++)); do
  if [[ "${args[$i]}" == "--data" ]]; then
    value=${args[$((i+1))]}
    if [[ "$value" == @* ]]; then
      cat "${value#@}" > "$JIRA_CURL_BODY_LOG"
    else
      printf '%s' "$value" > "$JIRA_CURL_BODY_LOG"
    fi
  fi
done
if [[ "$*" == *"/comment"* ]]; then
  printf '{"id":"10001"}\n'
else
  printf '{}\n'
fi
STUB
  chmod +x "$bin/curl"

  cat > "$adf_md" <<'MD'
# RCA Summary

Owner handoff is **required**.
MD

  cat > "$mentions_json" <<'JSON'
[
  {"id":"acct-1","text":"@Liz Hu"}
]
JSON

  PATH="$bin:$PATH" bash "$BUILD_ADF_SCRIPT" "$adf_md" "$adf_json"
  jq -e '.type == "doc"' "$adf_json" >/dev/null || fail "expected ADF doc"

  bash "$BUILD_COMMENT_SCRIPT" \
    --text "Executive summary is ready." \
    --mentions-file "$mentions_json" \
    --output "$comment_json"
  jq -e '.body.content[0].content[0].type == "mention"' "$comment_json" >/dev/null || fail "expected mention node"

  PATH="$bin:$PATH" \
    OPENCLAW_WORKSPACE="$workspace" \
    JIRA_CURL_LOG="$curl_log" \
    JIRA_CURL_BODY_LOG="$curl_body" \
    JIRA_USER_EMAIL="bot@example.com" \
    bash "$PUBLISH_SCRIPT" \
      --issue ABC-1 \
      --description-file "$adf_json" \
      --comment-file "$comment_json" \
      --update-description \
      --add-comment \
      --post >/dev/null

  assert_file_contains "$curl_log" "/rest/api/3/issue/ABC-1"
  assert_file_contains "$curl_log" "/rest/api/3/issue/ABC-1/comment"
  assert_file_contains "$curl_body" '"body"'

  echo "jira playground integration tests passed"
}

main "$@"
