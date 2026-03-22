#!/usr/bin/env bash
# Run one evolution cycle. Use --with-phase0 on first run; later runs omit phase0 and pass --choice resume to phase0 when re-init is needed.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WITH_PHASE0=false
STOP_RUN=false
if [[ "${1:-}" == "--with-phase0" ]]; then
  WITH_PHASE0=true
  shift
fi

run_phase() {
  local phase_script="$1"
  shift
  local output
  output="$("$phase_script" "$@" 2>&1)" || {
    local status=$?
    echo "$output"
    if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
      local manifest_path
      manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
      node "$DIR/lib/manifestRunner.mjs" "$manifest_path" --cwd "$(pwd)" || return 1
      local post_output
      post_output="$("$phase_script" "$@" --post 2>&1)" || {
        echo "$post_output"
        return 1
      }
      echo "$post_output"
      return 0
    fi
    return $status
  }
  echo "$output"
  if [[ "$output" == *"STOP_RUN:"* ]]; then
    STOP_RUN=true
    return 0
  fi
  if [[ "$output" == *"SPAWN_MANIFEST:"* ]]; then
    local manifest_path
    manifest_path="$(echo "$output" | sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' | head -n1)"
    node "$DIR/lib/manifestRunner.mjs" "$manifest_path" --cwd "$(pwd)" || return 1
    local post_output
    post_output="$("$phase_script" "$@" --post 2>&1)" || {
      echo "$post_output"
      return 1
    }
    echo "$post_output"
    if [[ "$post_output" == *"STOP_RUN:"* ]]; then
      STOP_RUN=true
    fi
  fi
}

if [[ "$WITH_PHASE0" == true ]]; then
  run_phase "$DIR/phase0.sh" "$@"
  if [[ "$STOP_RUN" == true ]]; then
    exit 0
  fi
fi
for p in 1 2 3 4 5 6; do
  run_phase "$DIR/phase${p}.sh" "$@"
  if [[ "$STOP_RUN" == true ]]; then
    break
  fi
done
