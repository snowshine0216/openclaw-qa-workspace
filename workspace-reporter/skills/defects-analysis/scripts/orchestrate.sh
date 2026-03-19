#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
REFRESH_MODE="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

[[ -n "$RAW_INPUT" ]] || { echo "Usage: orchestrate.sh <input> [refresh_mode]" >&2; exit 1; }

derive_run_key() {
  local raw="$1"
  if [[ "$raw" =~ ^[A-Z][A-Z0-9]{1,10}-[0-9]+$ ]]; then
    echo "$raw"
    return
  fi
  if [[ "$raw" =~ /browse/([A-Z][A-Z0-9]{1,10}-[0-9]+)(\?.*)?$ ]]; then
    echo "${BASH_REMATCH[1]}"
    return
  fi
  if [[ "$raw" =~ ^[0-9]+(\.[0-9]+)*$ ]]; then
    echo "release_${raw}"
    return
  fi
  if [[ "$raw" == *"project"* || "$raw" == *"AND"* || "$raw" == *"OR"* || "$raw" == *"="* ]]; then
    node --input-type=module -e "import { createHash } from 'node:crypto'; console.log('jql_' + createHash('sha1').update(process.argv[1]).digest('hex').slice(0, 12));" "$raw"
    return
  fi
  echo "$raw"
}

RUN_KEY="$(derive_run_key "$RAW_INPUT")"
RUN_DIR="$SKILL_ROOT/runs/$RUN_KEY"
mkdir -p "$RUN_DIR/context" "$RUN_DIR/drafts" "$RUN_DIR/reports" "$RUN_DIR/archive"

export SELECTED_MODE="$REFRESH_MODE"

for phase in 0 1 2 3 4 5; do
  phase_script="$SCRIPT_DIR/phase${phase}.sh"
  output="$("$phase_script" "$RAW_INPUT" "$RUN_DIR" 2>&1)" || {
    echo "$output"
    exit 1
  }
  echo "$output"

  if [[ "$phase" == "0" && "$output" == *"PHASE0_USE_EXISTING"* ]]; then
    exit 0
  fi

  if [[ "$output" == *"DELEGATED_RUN:"* ]]; then
    exit 0
  fi

  if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
    manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
    node "$SCRIPT_DIR/spawn_from_manifest.mjs" "$manifest_path" --cwd "$RUN_DIR"
    post_output="$("$phase_script" "$RAW_INPUT" "$RUN_DIR" --post 2>&1)" || {
      echo "$post_output"
      exit 1
    }
    echo "$post_output"
    if [[ "$post_output" == *"DELEGATED_RUN:"* ]]; then
      exit 0
    fi
  fi
done
