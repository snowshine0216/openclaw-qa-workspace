#!/usr/bin/env bash
set -euo pipefail

feature_key="$1"
run_dir="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

[[ -n "$feature_key" ]] || { echo "Usage: phase5.sh <feature-key> [run-dir]" >&2; exit 1; }

run_dir="${run_dir:-$SKILL_ROOT/runs/$feature_key}"
mkdir -p "$run_dir/context"

node "$SCRIPT_DIR/lib/phase5.mjs" "$feature_key" "$run_dir" 2>&1
