#!/usr/bin/env bash
set -euo pipefail

feature_key="$1"
run_dir="${2:-}"
MODE="${3:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

[[ -n "$feature_key" ]] || { echo "Usage: phase0.sh <feature-key> [run-dir] [--post]" >&2; exit 1; }

run_dir="${run_dir:-$SKILL_ROOT/runs/$feature_key}"
mkdir -p "$run_dir/context" "$run_dir/drafts" "$run_dir/archive"

node "$SCRIPT_DIR/lib/phase0.mjs" "$feature_key" "$run_dir" 2>&1
