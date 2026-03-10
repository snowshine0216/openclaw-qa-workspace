#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

assert_eq() {
  local actual="$1" expected="$2" message="$3"
  [[ "${actual}" == "${expected}" ]] || fail "${message} (expected=${expected}, actual=${actual})"
}

assert_file_exists() {
  [[ -f "$1" ]] || fail "$2 ($1)"
}

assert_contains() {
  printf '%s' "$1" | grep -q "$2" || fail "$3"
}
