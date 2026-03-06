#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
WRAPPER_SCRIPT="$SCRIPT_DIR/../scripts/jira-run.sh"
SEARCH_SCRIPT="$SCRIPT_DIR/../scripts/search-jira.sh"
ORIG_PATH=$PATH

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

reset_overrides() {
  unset JIRA_PROJECT_CACHE_FILE
  unset JIRA_STUB_PROJECT_LIST_FAIL
  unset JIRA_STUB_PROJECT_LIST_OUTPUT_FILE
  unset JIRA_STUB_LOG
  unset JIRA_SKILL_REPO_ROOT
}

assert_contains() {
  local haystack=$1
  local needle=$2
  [[ "$haystack" == *"$needle"* ]] || fail "expected to find [$needle] in [$haystack]"
}

assert_file_contains() {
  local file=$1
  local needle=$2
  grep -Fq "$needle" "$file" || fail "expected $file to contain [$needle]"
}

make_stub_jira() {
  local dir=$1
  cat > "$dir/jira" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail
printf 'TOKEN=%s CMD=%s\n' "${JIRA_API_TOKEN:-}" "$*" >> "${JIRA_STUB_LOG:?}"

if [[ "$1 $2" == "project list" ]]; then
  if [[ "${JIRA_STUB_PROJECT_LIST_FAIL:-0}" == "1" ]]; then
    echo "project list failed" >&2
    exit 1
  fi
  cat "${JIRA_STUB_PROJECT_LIST_OUTPUT_FILE:?}"
  exit 0
fi

if [[ "$1 $2" == "issue list" ]]; then
  printf 'issue list ok\n'
  exit 0
fi

printf 'jira ok\n'
STUB
  chmod +x "$dir/jira"
}

setup_case() {
  local root=$1
  mkdir -p "$root/workspace-planner" "$root/tmp/jira"
  cat > "$root/.env" <<'ROOTENV'
JIRA_API_TOKEN=root-token
JIRA_BASE_URL=https://root.example
ROOTENV
  cat > "$root/workspace-planner/.env" <<'WSENV'
JIRA_API_TOKEN=workspace-token
JIRA_BASE_URL=https://workspace.example
WSENV
}

run_wrapper() {
  local cwd=$1
  shift
  (
    cd "$cwd" && env \
      PATH="$PATH" \
      JIRA_STUB_LOG="${JIRA_STUB_LOG:-}" \
      JIRA_STUB_PROJECT_LIST_FAIL="${JIRA_STUB_PROJECT_LIST_FAIL:-}" \
      JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="${JIRA_STUB_PROJECT_LIST_OUTPUT_FILE:-}" \
      JIRA_SKILL_REPO_ROOT="${JIRA_SKILL_REPO_ROOT:-}" \
      JIRA_PROJECT_CACHE_FILE="${JIRA_PROJECT_CACHE_FILE:-}" \
      bash "$WRAPPER_SCRIPT" "$@"
  )
}

run_search() {
  local cwd=$1
  shift
  (
    cd "$cwd" && env \
      PATH="$PATH" \
      JIRA_STUB_LOG="${JIRA_STUB_LOG:-}" \
      JIRA_STUB_PROJECT_LIST_FAIL="${JIRA_STUB_PROJECT_LIST_FAIL:-}" \
      JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="${JIRA_STUB_PROJECT_LIST_OUTPUT_FILE:-}" \
      JIRA_SKILL_REPO_ROOT="${JIRA_SKILL_REPO_ROOT:-}" \
      JIRA_PROJECT_CACHE_FILE="${JIRA_PROJECT_CACHE_FILE:-}" \
      bash "$SEARCH_SCRIPT" "$@"
  )
}

run_wrapper_env_test() {
  local tmp root bin log output
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  log="$tmp/jira.log"
  mkdir -p "$bin"
  reset_overrides
  setup_case "$root"
  make_stub_jira "$bin"
  output=$(PATH="$bin:$ORIG_PATH" JIRA_STUB_LOG="$log" JIRA_SKILL_REPO_ROOT="$root" run_wrapper "$root/workspace-planner" issue view ABC-1 --plain)
  assert_contains "$output" "jira ok"
  assert_file_contains "$log" "TOKEN=workspace-token"
  assert_file_contains "$log" "CMD=issue view ABC-1 --plain"
}

run_explicit_project_test() {
  local tmp root bin projects log output
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  projects="$tmp/projects.txt"
  log="$tmp/jira.log"
  mkdir -p "$bin"
  reset_overrides
  setup_case "$root"
  make_stub_jira "$bin"
  cat > "$projects" <<'PROJECTS'
NAME KEY TYPE
Alpha ABC software
Beta XYZ software
PROJECTS
  output=$(PATH="$bin:$ORIG_PATH" JIRA_STUB_LOG="$log" JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="$projects" JIRA_SKILL_REPO_ROOT="$root" run_search "$root/workspace-planner" --jql "project = ABC AND status = Open" --plain)
  assert_contains "$output" "issue list ok"
  assert_file_contains "$log" "TOKEN=workspace-token"
  assert_file_contains "$log" "CMD=issue list -q project = ABC AND status = Open --plain"
  if grep -Fq "CMD=project list" "$log"; then
    fail "project list should not be called for explicit project JQL"
  fi
}

run_rewrite_and_cache_test() {
  local tmp root bin projects log output cache
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  projects="$tmp/projects.txt"
  log="$tmp/jira.log"
  cache="$root/tmp/jira/project-keys.json"
  mkdir -p "$bin"
  reset_overrides
  setup_case "$root"
  make_stub_jira "$bin"
  cat > "$projects" <<'PROJECTS'
NAME KEY TYPE
Alpha ABC software
Beta XYZ software
PROJECTS
  output=$(PATH="$bin:$ORIG_PATH" JIRA_STUB_LOG="$log" JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="$projects" JIRA_SKILL_REPO_ROOT="$root" JIRA_PROJECT_CACHE_FILE="$cache" run_search "$root/workspace-planner" --jql "status = Open" --raw)
  assert_contains "$output" "issue list ok"
  assert_file_contains "$log" "CMD=project list"
  assert_file_contains "$log" "CMD=issue list -q project in (ABC, XYZ) AND (status = Open) --raw"
  [[ -f "$cache" ]] || fail "expected cache file to be created"
  assert_file_contains "$cache" '"ABC"'
  assert_file_contains "$cache" '"XYZ"'
}

run_root_fallback_test() {
  local tmp root bin projects log
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  projects="$tmp/projects.txt"
  log="$tmp/jira.log"
  mkdir -p "$bin"
  reset_overrides
  setup_case "$root"
  rm "$root/workspace-planner/.env"
  make_stub_jira "$bin"
  cat > "$projects" <<'PROJECTS'
NAME KEY TYPE
Alpha ABC software
PROJECTS
  PATH="$bin:$ORIG_PATH" JIRA_STUB_LOG="$log" JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="$projects" JIRA_SKILL_REPO_ROOT="$root" run_search "$root/workspace-planner" --jql "status = Open" >/dev/null
  assert_file_contains "$log" "TOKEN=root-token"
}

run_stale_cache_warning_test() {
  local tmp root bin projects log cache stdout stderr
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  projects="$tmp/projects.txt"
  log="$tmp/jira.log"
  cache="$root/tmp/jira/project-keys.json"
  stdout="$tmp/stdout.txt"
  stderr="$tmp/stderr.txt"
  mkdir -p "$bin"
  reset_overrides
  setup_case "$root"
  make_stub_jira "$bin"
  cat > "$projects" <<'PROJECTS'
NAME KEY TYPE
Alpha ABC software
PROJECTS
  cat > "$cache" <<'CACHE'
{"refreshed_on":"2000-01-01","keys":["OLD1","OLD2"]}
CACHE
  PATH="$bin:$ORIG_PATH" JIRA_STUB_LOG="$log" JIRA_STUB_PROJECT_LIST_FAIL=1 JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="$projects" JIRA_SKILL_REPO_ROOT="$root" JIRA_PROJECT_CACHE_FILE="$cache" run_search "$root/workspace-planner" --jql "status = Open" >"$stdout" 2>"$stderr"
  assert_file_contains "$log" "CMD=issue list -q project in (OLD1, OLD2) AND (status = Open)"
  assert_file_contains "$stderr" "Warning"
}

run_no_cache_failure_test() {
  local tmp root bin projects log stderr status
  tmp=$(mktemp -d)
  root="$tmp/repo"
  bin="$tmp/bin"
  projects="$tmp/projects.txt"
  log="$tmp/jira.log"
  stderr="$tmp/stderr.txt"
  mkdir -p "$bin"
  reset_overrides
  setup_case "$root"
  make_stub_jira "$bin"
  cat > "$projects" <<'PROJECTS'
NAME KEY TYPE
Alpha ABC software
PROJECTS
  set +e
  PATH="$bin:$ORIG_PATH" JIRA_STUB_LOG="$log" JIRA_STUB_PROJECT_LIST_FAIL=1 JIRA_STUB_PROJECT_LIST_OUTPUT_FILE="$projects" JIRA_SKILL_REPO_ROOT="$root" run_search "$root/workspace-planner" --jql "status = Open" > /dev/null 2>"$stderr"
  status=$?
  set -e
  [[ "$status" -ne 0 ]] || fail "expected missing-cache search to fail"
  assert_file_contains "$stderr" "no cache is available"
}

main() {
  run_wrapper_env_test
  run_explicit_project_test
  run_rewrite_and_cache_test
  run_root_fallback_test
  run_stale_cache_warning_test
  run_no_cache_failure_test
  echo "test-search-jira: ok"
}

main "$@"
