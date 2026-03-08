#!/bin/bash
set -euo pipefail

FEATURE_ID="${1:?Usage: validate_testcase_structure.sh <feature-id> <file-path>}"
FILE_PATH="${2:?Usage: validate_testcase_structure.sh <feature-id> <file-path>}"

if [ ! -f "$FILE_PATH" ]; then
  echo "STRUCTURE_FILE_MISSING: $FILE_PATH"
  exit 1
fi

HEADINGS_STR=$(grep '^## ' "$FILE_PATH" | sed -E 's/^##[[:space:]]+//' | sed -E 's/[[:space:]]+-[[:space:]]+P[0-9].*$//' | sed -E 's/[[:space:]]+$//' || true)
IFS=$'\n' read -r -d '' -a HEADINGS <<EOF_HEADINGS || true
$HEADINGS_STR
EOF_HEADINGS
EXPECTED=("EndToEnd" "Functional - Pause Mode" "Functional - Running Mode" "Functional - Modeling Service Non-Crash Path" "Functional - MDX / Engine Errors" "Functional - Prompt Flow" "xFunctional" "UI - Messaging" "Platform")
ALIASES_ENDTOEND=("EndToEnd" "End to End" "End-to-End" "E2E" "User Journey" "User Journeys" "Primary User Flow" "Primary User Flows")
ALIASES_FUNCTIONAL_PAUSE=("Functional - Pause Mode" "Pause Mode" "Functional: Pause Mode")
ALIASES_FUNCTIONAL_RUNNING=("Functional - Running Mode" "Running Mode" "Functional: Running Mode")
ALIASES_FUNCTIONAL_MODELING=("Functional - Modeling Service Non-Crash Path" "Modeling Service Non-Crash Path" "Functional: Modeling Service Non-Crash Path")
ALIASES_FUNCTIONAL_MDX=("Functional - MDX / Engine Errors" "MDX / Engine Errors" "Functional: MDX / Engine Errors")
ALIASES_FUNCTIONAL_PROMPT=("Functional - Prompt Flow" "Prompt Flow" "Functional: Prompt Flow")
ALIASES_XFUNCTIONAL=("xFunctional" "xFunction" "Cross Functional" "Cross-Functional")
ALIASES_UI_MESSAGING=("UI - Messaging" "UI Messaging" "Messaging")
ALIASES_PLATFORM=("Platform" "Browser Coverage" "Platform Coverage")
ALIASES_ACCESSIBILITY=("Accessibility")
ALIASES_SECURITY=("Security")
ALIASES_UPGRADE=("Upgrade / compatibility" "upgrade / compatability" "upgrade / compatibility")
ALIASES_I18N=("i18n")
ALIASES_PERFORMANCE=("Performance" "performance")
ALIASES_EMBEDDING=("Embedding")

escape_regex() {
  printf '%s' "$1" | sed -E 's/[][(){}.^$*+?|\\/]/\\&/g'
}

alias_pattern_for_heading() {
  local heading="$1"
  local aliases=()
  case "$heading" in
    "Functional - Pause Mode") aliases=("${ALIASES_FUNCTIONAL_PAUSE[@]}") ;;
    "Functional - Running Mode") aliases=("${ALIASES_FUNCTIONAL_RUNNING[@]}") ;;
    "Functional - Modeling Service Non-Crash Path") aliases=("${ALIASES_FUNCTIONAL_MODELING[@]}") ;;
    "Functional - MDX / Engine Errors") aliases=("${ALIASES_FUNCTIONAL_MDX[@]}") ;;
    "Functional - Prompt Flow") aliases=("${ALIASES_FUNCTIONAL_PROMPT[@]}") ;;
    "xFunctional") aliases=("${ALIASES_XFUNCTIONAL[@]}") ;;
    "UI - Messaging") aliases=("${ALIASES_UI_MESSAGING[@]}") ;;
    "Platform") aliases=("${ALIASES_PLATFORM[@]}") ;;
    *)
      aliases=("$heading")
      ;;
  esac

  local pattern=""
  local alias
  for alias in "${aliases[@]}"; do
    alias="$(escape_regex "$alias")"
    if [ -z "$pattern" ]; then
      pattern="$alias"
    else
      pattern="$pattern|$alias"
    fi
  done
  printf '%s' "$pattern"
}

classify_heading() {
  local heading="$1"
  local alias
  for alias in "${ALIASES_ENDTOEND[@]}"; do
    [ "$heading" = "$alias" ] && { echo "EndToEnd"; return 0; }
  done
  for alias in "${ALIASES_FUNCTIONAL_PAUSE[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Functional - Pause Mode"; return 0; }
  done
  for alias in "${ALIASES_FUNCTIONAL_RUNNING[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Functional - Running Mode"; return 0; }
  done
  for alias in "${ALIASES_FUNCTIONAL_MODELING[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Functional - Modeling Service Non-Crash Path"; return 0; }
  done
  for alias in "${ALIASES_FUNCTIONAL_MDX[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Functional - MDX / Engine Errors"; return 0; }
  done
  for alias in "${ALIASES_FUNCTIONAL_PROMPT[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Functional - Prompt Flow"; return 0; }
  done
  for alias in "${ALIASES_XFUNCTIONAL[@]}"; do
    [ "$heading" = "$alias" ] && { echo "xFunctional"; return 0; }
  done
  for alias in "${ALIASES_UI_MESSAGING[@]}"; do
    [ "$heading" = "$alias" ] && { echo "UI - Messaging"; return 0; }
  done
  for alias in "${ALIASES_PLATFORM[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Platform"; return 0; }
  done
  for alias in "${ALIASES_ACCESSIBILITY[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Accessibility"; return 0; }
  done
  for alias in "${ALIASES_SECURITY[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Security"; return 0; }
  done
  for alias in "${ALIASES_UPGRADE[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Upgrade / compatibility"; return 0; }
  done
  for alias in "${ALIASES_I18N[@]}"; do
    [ "$heading" = "$alias" ] && { echo "i18n"; return 0; }
  done
  for alias in "${ALIASES_PERFORMANCE[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Performance"; return 0; }
  done
  for alias in "${ALIASES_EMBEDDING[@]}"; do
    [ "$heading" = "$alias" ] && { echo "Embedding"; return 0; }
  done
  return 1
}

FAILED=0
for heading in "${HEADINGS[@]}"; do
  if ! classify_heading "$heading" >/dev/null; then
    echo "ILLEGAL_HEADING: $heading"
    FAILED=1
  fi
done

FILTERED_REQUIRED=()
for heading in "${HEADINGS[@]}"; do
  actual="$(classify_heading "$heading" 2>/dev/null || true)"
  for expected in "${EXPECTED[@]}"; do
    if [ "$actual" = "$expected" ]; then
      FILTERED_REQUIRED+=("$actual")
      break
    fi
  done
done

for expected in "${EXPECTED[@]}"; do
  count=0
  for actual in "${FILTERED_REQUIRED[@]}"; do
    if [ "$actual" = "$expected" ]; then
      count=$((count + 1))
    fi
  done
  if [ "$count" -gt 1 ]; then
    echo "DUPLICATE_HEADING: $expected ($count)"
    FAILED=1
  fi
done

for i in "${!EXPECTED[@]}"; do
  heading="${FILTERED_REQUIRED[$i]:-}"
  if [ -z "$heading" ]; then
    echo "MISSING_HEADING: ${EXPECTED[$i]}"
    FAILED=1
    continue
  fi
  if [ "$heading" != "${EXPECTED[$i]}" ]; then
    echo "ORDER_OR_MAPPING_ERROR: expected ${EXPECTED[$i]} at position $((i + 1)), found ${heading:-<missing>}"
    FAILED=1
  fi
done

for fixed in "Functional - Pause Mode" "Functional - Running Mode" "Functional - Modeling Service Non-Crash Path" "Functional - MDX / Engine Errors" "Functional - Prompt Flow" "xFunctional" "UI - Messaging" "Platform"; do
  heading_pattern="$(alias_pattern_for_heading "$fixed")"
  body="$(awk -v pattern="$heading_pattern" '
    BEGIN { in_section=0 }
    $0 ~ "^## " {
      if (in_section == 1) exit
      current=$0
      sub(/^##[[:space:]]+/, "", current)
      sub(/[[:space:]]+-[[:space:]]+P[0-9].*$/, "", current)
      sub(/[[:space:]]+$/, "", current)
      if (current ~ "^(" pattern ")$") in_section=1
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
