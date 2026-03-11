#!/bin/bash
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_testcase_structure.sh <feature-id> <file-path>}"
FILE_PATH="${2:?Usage: validate_testcase_structure.sh <feature-id> <file-path>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NODE_VALIDATOR="$SCRIPT_DIR/validate_testcase_structure.mjs"

if [ ! -f "$FILE_PATH" ]; then
  echo "STRUCTURE_FILE_MISSING: $FILE_PATH"
  exit 1
fi

if [ ! -f "$NODE_VALIDATOR" ]; then
  echo "STRUCTURE_VALIDATOR_MISSING: $NODE_VALIDATOR"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "NODE_RUNTIME_MISSING: node"
  exit 1
fi

node "$NODE_VALIDATOR" "$FEATURE_ID" "$FILE_PATH"
