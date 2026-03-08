#!/bin/bash
# validate_context.sh — Verify required context artifacts exist before phase transition
# Usage: ./validate_context.sh <feature-id> <artifact-name>...
# Special: pass --resolve-sub-testcases to print the latest sub_test_cases_*.md
#          resolved per domain (v2 if present, else base). Used by Phase 5 synthesis.
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_context.sh <feature-id> <artifact-name>...}"
shift
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTEXT_DIR="$BASE_DIR/$FEATURE_ID/context"

# --resolve-sub-testcases mode: print the latest per-domain file and exit
resolve_latest_sub_testcase() {
  local domain="$1"
  local v2="$CONTEXT_DIR/sub_test_cases_${domain}_${FEATURE_ID}_v2.md"
  local base="$CONTEXT_DIR/sub_test_cases_${domain}_${FEATURE_ID}.md"
  if [ -f "$v2" ];   then echo "$v2";   return; fi
  if [ -f "$base" ]; then echo "$base"; return; fi
  echo "MISSING:sub_test_cases_${domain}_${FEATURE_ID}" >&2
  return 1
}

if [ "${1:-}" = "--resolve-sub-testcases" ]; then
  shift
  # Caller passes the list of domains to resolve, e.g. "atlassian github figma"
  HAS_ERROR=0
  for domain in "$@"; do
    resolve_latest_sub_testcase "$domain" || HAS_ERROR=1
  done
  [ "$HAS_ERROR" -eq 0 ] && echo "RESOLVED_OK" || { echo "CONTEXT_MISSING: one or more sub_test_cases not found"; exit 1; }
  exit 0
fi

# Default mode: check named artifacts exist
MISSING=()
for artifact in "$@"; do
  FILE="$CONTEXT_DIR/${artifact%.md}.md"
  [ ! -f "$FILE" ] && MISSING+=("$artifact")
done

if [ "${#MISSING[@]}" -gt 0 ]; then
  echo "CONTEXT_MISSING:"
  for m in "${MISSING[@]}"; do echo "  ✗ $m"; done
  exit 1
fi

echo "CONTEXT_OK — all $# required artifacts present"
