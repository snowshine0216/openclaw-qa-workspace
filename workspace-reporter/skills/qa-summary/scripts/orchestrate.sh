#!/usr/bin/env bash
set -euo pipefail

feature_key="${1:-}"
run_dir="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

[[ -n "$feature_key" ]] || { echo "Usage: orchestrate.sh <feature-key> [run-dir]" >&2; exit 1; }

run_dir="${run_dir:-$SKILL_ROOT/runs/$feature_key}"
mkdir -p "$run_dir/context" "$run_dir/drafts" "$run_dir/archive"

start_phase="$(node "$SCRIPT_DIR/lib/resolveResumePhase.mjs" "$run_dir")"

phase_range() {
  local start="$1"
  local i
  for (( i=start; i<=6; i++ )); do
    echo "$i"
  done
}

extract_spawn_manifest() {
  sed -n 's/^SPAWN_MANIFEST:[[:space:]]*//p' "$1" | head -n1
}

has_block_marker() {
  grep -qE 'BLOCKED:|Awaiting APPROVE' "$1"
}

emit_output_file() {
  local output_file="$1"
  [[ -f "$output_file" ]] || return 0
  cat "$output_file"
}

run_phase_script() {
  local phase_script="$1"
  local phase_status
  local output_file

  output_file="$(mktemp "${TMPDIR:-/tmp}/qa-summary-phase.XXXXXX")"

  if bash "$phase_script" "$feature_key" "$run_dir" "${@:2}" >"$output_file" 2>&1; then
    phase_status=0
  else
    phase_status=$?
  fi

  RUN_PHASE_OUTPUT_FILE="$output_file"
  return "$phase_status"
}

handle_phase_completion() {
  local phase_script="$1"
  local current_output_file="$2"
  local current_status="$3"
  local manifest_path

  while true; do
    emit_output_file "$current_output_file"

    if grep -q 'PHASE0_USE_EXISTING' "$current_output_file"; then
      rm -f "$current_output_file"
      exit 0
    fi

    if has_block_marker "$current_output_file"; then
      rm -f "$current_output_file"
      exit 2
    fi

    if [[ "$current_status" -ne 0 ]]; then
      rm -f "$current_output_file"
      exit "$current_status"
    fi

    manifest_path="$(extract_spawn_manifest "$current_output_file")"
    if [[ -z "$manifest_path" || ! -f "$manifest_path" ]]; then
      rm -f "$current_output_file"
      return 0
    fi

    rm -f "$current_output_file"
    node "$SCRIPT_DIR/spawn_from_manifest.mjs" "$manifest_path" --cwd "$run_dir" || exit $?
    if run_phase_script "$phase_script" --post; then
      current_status=0
    else
      current_status=$?
    fi
    current_output_file="$RUN_PHASE_OUTPUT_FILE"
  done
}

for phase in $(phase_range "$start_phase"); do
  phase_script="$SCRIPT_DIR/phase${phase}.sh"
  if run_phase_script "$phase_script"; then
    phase_status=0
  else
    phase_status=$?
  fi
  output_file="$RUN_PHASE_OUTPUT_FILE"
  handle_phase_completion "$phase_script" "$output_file" "$phase_status"
done
