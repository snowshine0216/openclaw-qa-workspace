#!/bin/bash
# validate_testcase_structure.sh — Validate QA plan as valid XMindMark via markxmind skill
# Usage: validate_testcase_structure.sh <file-path>
# Or: REPO_ROOT=/path node ... (when run from non-standard location)
set -euo pipefail

FILE_PATH="${1:?Usage: validate_testcase_structure.sh <file-path>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/../../../../.." && pwd)}"
VALIDATOR="$REPO_ROOT/.agents/skills/markxmind/scripts/validate_xmindmark.mjs"

if [ ! -f "$FILE_PATH" ]; then
  echo "STRUCTURE_FILE_MISSING: $FILE_PATH"
  exit 1
fi

if [ ! -f "$VALIDATOR" ]; then
  echo "MARKXMIND_VALIDATOR_MISSING: $VALIDATOR"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "NODE_RUNTIME_MISSING: node"
  exit 1
fi

if node "$VALIDATOR" "$FILE_PATH"; then
  echo "STRUCTURE_OK: $FILE_PATH"
else
  exit 1
fi
