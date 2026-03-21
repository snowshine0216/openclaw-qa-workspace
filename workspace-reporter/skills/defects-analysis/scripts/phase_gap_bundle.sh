#!/usr/bin/env bash
set -euo pipefail

RAW_INPUT="${1:-}"
RUN_DIR="${2:-}"
MODE="${3:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

[[ -n "$RAW_INPUT" && -n "$RUN_DIR" ]] || { echo "Usage: phase_gap_bundle.sh <input> <run-dir> [--post]" >&2; exit 1; }

if [[ -f "$RUN_DIR/task.json" ]] && command -v jq >/dev/null 2>&1; then
  RUN_KEY="$(jq -r '.run_key // empty' "$RUN_DIR/task.json")"
fi
RUN_KEY="${RUN_KEY:-$(basename "$RUN_DIR")}"
FEATURE_FAMILY="${FEATURE_FAMILY:-}"
if [[ -z "$FEATURE_FAMILY" && -f "$RUN_DIR/task.json" ]] && command -v jq >/dev/null 2>&1; then
  FEATURE_FAMILY="$(jq -r '.feature_family // empty' "$RUN_DIR/task.json" 2>/dev/null || true)"
fi

MODE_NAME="prepare"
if [[ "$MODE" == "--post" ]]; then
  MODE_NAME="finalize"
fi

node "$SCRIPT_DIR/lib/gap_bundle_phase.mjs" "$MODE_NAME" "$RUN_DIR" "$RUN_KEY" "$FEATURE_FAMILY"
