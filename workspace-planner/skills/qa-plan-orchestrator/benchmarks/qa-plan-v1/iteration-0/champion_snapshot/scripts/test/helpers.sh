#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

new_temp_dir() {
  mktemp -d "${TMPDIR:-/tmp}/fqpo-test.XXXXXX"
}

feature_run_dir() {
  local skill_root="$1"
  local feature_id="$2"
  local run_dir="$skill_root/runs/$feature_id"
  mkdir -p "$run_dir/context" "$run_dir/drafts"
  printf '%s\n' "$run_dir"
}

assert_contains() {
  local haystack="$1"
  local needle="$2"
  if [[ "$haystack" != *"$needle"* ]]; then
    printf 'Expected output to contain: %s\nActual:\n%s\n' "$needle" "$haystack" >&2
    exit 1
  fi
}

assert_file_exists() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    printf 'Expected file to exist: %s\n' "$path" >&2
    exit 1
  fi
}

assert_exit_code() {
  local expected="$1"
  local actual="$2"
  if [[ "$expected" != "$actual" ]]; then
    printf 'Expected exit code %s, got %s\n' "$expected" "$actual" >&2
    exit 1
  fi
}

setup_fake_tooling() {
  local bin_dir="$1"
  mkdir -p "$bin_dir"

  cat >"$bin_dir/jira-run.sh" <<'EOF'
#!/bin/bash
set -euo pipefail
if [[ "${FAIL_JIRA:-0}" == "1" ]]; then
  echo "jira auth failed" >&2
  exit 1
fi
if [[ "${1:-}" != "me" ]]; then
  echo "unexpected jira command: $*" >&2
  exit 1
fi
echo "jira ok"
EOF
  chmod +x "$bin_dir/jira-run.sh"

  cat >"$bin_dir/gh" <<'EOF'
#!/bin/bash
set -euo pipefail
if [[ "${FAIL_GH:-0}" == "1" ]]; then
  echo "gh auth failed" >&2
  exit 1
fi
if [[ "${1:-}" != "auth" || "${2:-}" != "status" ]]; then
  echo "unexpected gh command: $*" >&2
  exit 1
fi
echo "gh ok"
EOF
  chmod +x "$bin_dir/gh"

  cat >"$bin_dir/confluence" <<'EOF'
#!/bin/bash
set -euo pipefail
if [[ "${FAIL_CONFLUENCE:-0}" == "1" ]]; then
  echo "confluence auth failed" >&2
  exit 1
fi
echo "confluence ok"
EOF
  chmod +x "$bin_dir/confluence"
}

write_task_json() {
  local task_path="$1"
  local content="$2"
  printf '%s\n' "$content" > "$task_path"
}

write_run_json() {
  local run_path="$1"
  local content="$2"
  printf '%s\n' "$content" > "$run_path"
}
