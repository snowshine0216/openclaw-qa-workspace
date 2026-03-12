#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
REFRESH_MODE="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Normalize input: accept Jira browse URLs (e.g. https://jira.example.com/browse/ABC-123) or issue key
ISSUE_KEY=""
if [[ "$RAW_INPUT" =~ ^[A-Za-z0-9]+-[0-9]+$ ]]; then
  ISSUE_KEY="$RAW_INPUT"
elif [[ "$RAW_INPUT" =~ /browse/([A-Za-z0-9]+-[0-9]+)(\?.*)?$ ]]; then
  ISSUE_KEY="${BASH_REMATCH[1]}"
elif [[ -n "$RAW_INPUT" ]]; then
  echo "Invalid issue_key or URL: $RAW_INPUT" >&2
  exit 1
fi

[[ -n "$ISSUE_KEY" ]] || { echo "Usage: orchestrate.sh <issue_key|jira_browse_url> [refresh_mode]" >&2; exit 1; }

RUN_DIR="${SKILL_ROOT}/runs/${ISSUE_KEY}"
mkdir -p "$RUN_DIR/context" "$RUN_DIR/drafts"

export SELECTED_MODE="$REFRESH_MODE"

for PHASE in 0 1 2 3 4; do
  PHASE_SCRIPT="${SCRIPT_DIR}/phase${PHASE}.sh"
  [[ -x "$PHASE_SCRIPT" ]] || { echo "Missing phase script: $PHASE_SCRIPT" >&2; exit 1; }
  OUTPUT="$("$PHASE_SCRIPT" "$ISSUE_KEY" "$RUN_DIR" 2>&1)" || { echo "$OUTPUT"; exit 1; }
  echo "$OUTPUT"

  if [[ "$PHASE" == "0" ]] && echo "$OUTPUT" | grep -q "PHASE0_USE_EXISTING"; then
    echo "Using existing plan."
    exit 0
  fi

  if [[ "$PHASE" == "2" ]] && echo "$OUTPUT" | grep -q "SPAWN_MANIFEST:"; then
    MANIFEST_PATH="$(echo "$OUTPUT" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
    if [[ -n "$MANIFEST_PATH" ]]; then
      node "${SCRIPT_DIR}/lib/openclaw-spawn-bridge.js" "$MANIFEST_PATH" --cwd "$SKILL_ROOT"
      "$PHASE_SCRIPT" "$ISSUE_KEY" "$RUN_DIR" --post
    fi
  fi
done

