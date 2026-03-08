#!/bin/bash
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_testcase_structure.sh <feature-id> <file-path>}"
FILE_PATH="${2:?Usage: validate_testcase_structure.sh <feature-id> <file-path>}"

if [ ! -f "$FILE_PATH" ]; then
  echo "STRUCTURE_FILE_MISSING: $FILE_PATH"
  exit 1
fi

mapfile -t HEADINGS < <(grep '^## ' "$FILE_PATH" | sed -E 's/^##[[:space:]]+//' | sed -E 's/[[:space:]]+-[[:space:]]+P[0-9].*$//' | sed -E 's/[[:space:]]+$//')
EXPECTED=("EndToEnd" "Functional" "xFunction" "Error handling / Special cases" "Accessibility" "i18n" "performance" "upgrade / compatability" "Embedding" "AUTO: Automation-Only Tests" "📎 Artifacts Used")
ALIASES_ENDTOEND=("EndToEnd" "End to End" "End-to-End" "E2E" "User Journey" "User Journeys" "Primary User Flow" "Primary User Flows")
ALIASES_FUNCTIONAL=("Functional" "Functionality" "Functional Coverage" "Core Functional Coverage" "Core Functional Scenarios" "Core Scenarios")

classify_heading() {
  local heading="$1"
  local alias
  for alias in "${ALIASES_ENDTOEND[@]}"; do
    [ "$heading" = "$alias" ] && { echo "EndToEnd"; return 0; }
  done
  for alias in "${ALIASES_FUNCTIONAL[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Functional"; return 0; }
  done
  case "$heading" in
    "xFunction"|"Error handling / Special cases"|"Accessibility"|"i18n"|"performance"|"upgrade / compatability"|"Embedding"|"AUTO: Automation-Only Tests"|"📎 Artifacts Used")
      echo "$heading"
      ;;
    *)
      return 1
      ;;
  esac
}

if [ "${#HEADINGS[@]}" -ne "${#EXPECTED[@]}" ]; then
  echo "MISSING_HEADING_COUNT: expected ${#EXPECTED[@]}, found ${#HEADINGS[@]}"
fi

FAILED=0
for heading in "${HEADINGS[@]}"; do
  if ! classify_heading "$heading" >/dev/null; then
    echo "ILLEGAL_HEADING: $heading"
    FAILED=1
  fi
done

for i in "${!EXPECTED[@]}"; do
  heading="${HEADINGS[$i]:-}"
  if [ -z "$heading" ]; then
    echo "MISSING_HEADING: ${EXPECTED[$i]}"
    FAILED=1
    continue
  fi
  actual="$(classify_heading "$heading" 2>/dev/null || true)"
  if [ "$actual" != "${EXPECTED[$i]}" ]; then
    echo "ORDER_OR_MAPPING_ERROR: expected ${EXPECTED[$i]} at position $((i + 1)), found ${heading:-<missing>}"
    FAILED=1
  fi
done

for fixed in "xFunction" "Error handling / Special cases" "Accessibility" "i18n" "performance" "upgrade / compatability" "Embedding" "AUTO: Automation-Only Tests" "📎 Artifacts Used"; do
  body="$(awk -v heading="$fixed" '
    BEGIN { in_section=0 }
    $0 ~ "^## " {
      if (in_section == 1) exit
      if ($0 == "## " heading || $0 ~ "^## " heading "[[:space:]]+-[[:space:]]+P[0-9]") in_section=1
      next
    }
    in_section == 1 { print }
  ' "$FILE_PATH")"
  if [ -z "$(printf '%s' "$body" | tr -d '[:space:]')" ]; then
    echo "MISSING_NA_REASON: $fixed"
    FAILED=1
    continue
  fi
  if ! printf '%s\n' "$body" | grep -Eq '^(### |- )' && ! printf '%s\n' "$body" | grep -Eqi 'N/A[[:space:]]+[—-][[:space:]]+.+'; then
    echo "MISSING_NA_REASON: $fixed"
    FAILED=1
  fi
done

if [ "$FAILED" -ne 0 ]; then
  exit 1
fi

echo "STRUCTURE_OK: $FEATURE_ID $FILE_PATH"
