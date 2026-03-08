#!/bin/bash
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_testcase_executability.sh <feature-id> <file-path>}"
FILE_PATH="${2:?Usage: validate_testcase_executability.sh <feature-id> <file-path>}"

if [ ! -f "$FILE_PATH" ]; then
  echo "EXEC_FILE_MISSING: $FILE_PATH"
  exit 1
fi

MANUAL_TEXT="$(awk '
  BEGIN { in_manual=0 }
  /^## / {
    in_manual = 1
    if ($0 == "## AUTO: Automation-Only Tests" || $0 == "## 📎 Artifacts Used") in_manual = 0
  }
  in_manual == 1 { print NR ":" $0 }
' "$FILE_PATH")"

FAILED=0
check_pattern() {
  local code="$1"
  local pattern="$2"
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    echo "$code: $line"
    FAILED=1
  done < <(printf '%s\n' "$MANUAL_TEXT" | grep -iE "$pattern" || true)
}

check_pattern 'EXEC_VAGUE_TRIGGER' 'recover from a supported|when an error occurs|after recovery|supported error|documented branch behavior'
check_pattern 'EXEC_VAGUE_ACTION' 'perform another valid editing action|valid editing action'
check_pattern 'EXEC_VAGUE_EXPECTED_RESULT' 'observe the recovered state|verify correct recovery|verify recovery|matches documented branch behavior'
check_pattern 'EXEC_CODE_VOCAB_IN_MANUAL' 'cmdMgr|reCreateInstance|isReCreateReportInstance|window\.mstrApp|service\.login|returns \{|stid=-?[0-9]+|noActionMode|resolveExecution|[A-Za-z_][A-Za-z0-9_]*\(\)'

if [ "$FAILED" -ne 0 ]; then
  exit 1
fi

echo "EXECUTABILITY_OK: $FEATURE_ID $FILE_PATH"
