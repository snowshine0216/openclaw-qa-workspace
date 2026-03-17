#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <path-list-file> [repo-root] [--check-hardcoded]" >&2
  echo "  --check-hardcoded: also scan file contents for hardcoded .agents/skills or workspace-*/skills paths (PATH-001)" >&2
  exit 2
}

trim() {
  printf '%s' "$1" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//'
}

require_inputs() {
  if [ "$#" -lt 1 ]; then
    usage
  fi

  PATH_LIST_FILE="$1"
  CHECK_HARDCODED=false
  if [[ "${2:-}" == "--check-hardcoded" ]]; then
    CHECK_HARDCODED=true
    REPO_ROOT="$(pwd)"
  elif [[ "${3:-}" == "--check-hardcoded" ]]; then
    CHECK_HARDCODED=true
    REPO_ROOT="${2:-$(pwd)}"
  else
    REPO_ROOT="${2:-$(pwd)}"
  fi

  if [ ! -f "$PATH_LIST_FILE" ]; then
    echo "ERROR: path list file not found: $PATH_LIST_FILE" >&2
    exit 2
  fi

  if [ ! -d "$REPO_ROOT" ]; then
    echo "ERROR: repo root not found: $REPO_ROOT" >&2
    exit 2
  fi
}

normalize_line() {
  local line="$1"
  line="${line%%#*}"
  line="$(trim "$line")"

  if printf '%s' "$line" | rg -q '^\[[^]]+\]\([^)]+\)$'; then
    line="$(printf '%s' "$line" | sed -E 's/^\[[^]]+\]\(([^)]+)\)$/\1/')"
  fi

  line="${line#\`}"
  line="${line%\`}"
  trim "$line"
}

validate_entry() {
  local raw_line="$1"
  local line="$2"
  local candidate="$line"

  CHECKED=$((CHECKED + 1))

  if [[ "$line" =~ ^https?:// ]]; then
    echo "INFO: skipped URL reference: $line"
    return 0
  fi

  if [[ "$line" == *"<"* || "$line" == *">"* ]]; then
    echo "FAIL: unresolved placeholder path: $raw_line"
    FAILURES=$((FAILURES + 1))
    return 0
  fi

  if [[ "$line" == /Users/* ]]; then
    echo "FAIL: hardcoded user-home path is not portable: $line"
    FAILURES=$((FAILURES + 1))
    return 0
  fi

  if [[ "$candidate" != /* ]]; then
    candidate="$REPO_ROOT/$candidate"
  fi

  if [ -e "$candidate" ]; then
    if [[ "$CHECK_HARDCODED" == "true" && -f "$candidate" ]]; then
      if grep -E '\$REPO_ROOT/\.agents/skills|\.agents/skills/[^/]+/|workspace-[^/]+/skills/' "$candidate" 2>/dev/null | grep -v -E 'skill-path-registrar|resolveSharedSkill|resolve_shared_skill' >/dev/null 2>&1; then
        echo "FAIL: hardcoded skill path (PATH-001) in: $line"
        FAILURES=$((FAILURES + 1))
        return 0
      fi
    fi
    echo "OK: $line"
    return 0
  fi

  echo "FAIL: missing path: $line"
  FAILURES=$((FAILURES + 1))
}

main() {
  FAILURES=0
  CHECKED=0
  require_inputs "$@"

  while IFS= read -r raw_line || [ -n "$raw_line" ]; do
    local_line="$(normalize_line "$raw_line")"
    [ -z "$local_line" ] && continue
    validate_entry "$raw_line" "$local_line"
  done < "$PATH_LIST_FILE"

  echo "Checked path references: $CHECKED"
  echo "Failures: $FAILURES"

  if [ "$FAILURES" -gt 0 ]; then
    exit 1
  fi
}

main "$@"
