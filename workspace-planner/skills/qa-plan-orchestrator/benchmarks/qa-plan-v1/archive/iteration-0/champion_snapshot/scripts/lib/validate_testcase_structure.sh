#!/bin/bash
# validate_testcase_structure.sh — Validate QA plan as valid XMindMark via markxmind skill
# Usage: validate_testcase_structure.sh <file-path>
# Or: REPO_ROOT=/path node ... (when run from non-standard location)
set -euo pipefail

FILE_PATH="${1:?Usage: validate_testcase_structure.sh <file-path>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "$SCRIPT_DIR/../../../../.." && pwd)}"
REGISTRAR_SH="$REPO_ROOT/.agents/skills/skill-path-registrar/scripts/skill_path_registrar.sh"
VALIDATOR="${MARKXMIND_VALIDATOR:-}"
if [[ -z "$VALIDATOR" && -f "$REGISTRAR_SH" ]]; then
  source "$REGISTRAR_SH"
  resolve_shared_skill_script markxmind scripts/validate_xmindmark.mjs && VALIDATOR="$RESOLVED_SKILL_SCRIPT"
fi

if [ ! -f "$FILE_PATH" ]; then
  echo "STRUCTURE_FILE_MISSING: $FILE_PATH"
  exit 1
fi

if [[ -z "$VALIDATOR" || ! -f "$VALIDATOR" ]]; then
  echo "MARKXMIND_VALIDATOR_MISSING: set MARKXMIND_VALIDATOR or run ./src/init-skills to link markxmind skill"
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
