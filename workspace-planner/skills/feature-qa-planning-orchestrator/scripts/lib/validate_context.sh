#!/bin/bash
# validate_context.sh — Verify required context artifacts exist before phase transition
# Usage: ./validate_context.sh <feature-id> <artifact-name>...
# Modes:
#   --resolve-sub-testcases <domain...>  # compatibility mode for legacy synthesize callers
#   --validate-testcase-structure <file-path>
#   --validate-testcase-executability <file-path>
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_context.sh <feature-id> <artifact-name>...}"
shift
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTEXT_DIR="$BASE_DIR/$FEATURE_ID/context"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

resolve_latest_sub_testcase() {
  local domain="$1"
  local v2="$CONTEXT_DIR/sub_test_cases_${domain}_${FEATURE_ID}_v2.md"
  local base="$CONTEXT_DIR/sub_test_cases_${domain}_${FEATURE_ID}.md"
  if [ -f "$v2" ]; then echo "$v2"; return; fi
  if [ -f "$base" ]; then echo "$base"; return; fi
  echo "MISSING:sub_test_cases_${domain}_${FEATURE_ID}" >&2
  return 1
}

run_child_validator() {
  local label="$1"
  local script_name="$2"
  local file_path="$3"
  local script_path="$SCRIPT_DIR/$script_name"

  if [ ! -f "$script_path" ]; then
    echo "VALIDATOR_MISSING: $script_name"
    exit 1
  fi

  if ! bash "$script_path" "$FEATURE_ID" "$file_path"; then
    echo "${label}_FAILED: $file_path"
    exit 1
  fi
}

case "${1:-}" in
  --resolve-sub-testcases)
    shift
    HAS_ERROR=0
    for domain in "$@"; do
      resolve_latest_sub_testcase "$domain" || HAS_ERROR=1
    done
    [ "$HAS_ERROR" -eq 0 ] && echo "RESOLVED_OK" || { echo "CONTEXT_MISSING: one or more sub_test_cases not found"; exit 1; }
    exit 0
    ;;
  --validate-testcase-structure)
    shift
    run_child_validator "STRUCTURE" "validate_testcase_structure.sh" "${1:?Missing file path for structure validation}"
    echo "CONTEXT_OK — testcase structure valid"
    exit 0
    ;;
  --validate-testcase-executability)
    shift
    run_child_validator "EXECUTABILITY" "validate_testcase_executability.sh" "${1:?Missing file path for executability validation}"
    echo "CONTEXT_OK — testcase executability valid"
    exit 0
    ;;
  '')
    echo "CONTEXT_MISSING: no artifacts requested"
    exit 1
    ;;
esac

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
