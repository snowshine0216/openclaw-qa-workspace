#!/bin/bash
# retry.sh — Retry a command with exponential backoff
# Usage: ./retry.sh <max_attempts> <initial_delay_s> <command...>
# Example: ./retry.sh 3 2 jira issue view BCIN-1234 --raw

set -euo pipefail

readonly MAX_ATTEMPTS="${1:?Usage: retry.sh <max_attempts> <initial_delay> <command...>}"
readonly INITIAL_DELAY="${2:?Usage: retry.sh <max_attempts> <initial_delay> <command...>}"
shift 2

retry_command() {
  local max_attempts="$1"
  local delay="$2"
  shift 2
  local attempt=1

  while [ "$attempt" -le "$max_attempts" ]; do
    echo "[retry] Attempt $attempt/$max_attempts: $*" >&2
    if "$@"; then
      echo "[retry] Success on attempt $attempt" >&2
      return 0
    fi

    if [ "$attempt" -eq "$max_attempts" ]; then
      echo "[retry] All $max_attempts attempts failed for: $*" >&2
      return 1
    fi

    echo "[retry] Failed. Retrying in ${delay}s..." >&2
    sleep "$delay"
    delay=$((delay * 2))
    attempt=$((attempt + 1))
  done
}

retry_command "$MAX_ATTEMPTS" "$INITIAL_DELAY" "$@"
