#!/usr/bin/env bash
set -euo pipefail

run_dir="$1"
feature_key="${2:-$(basename "$run_dir")}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

[[ -n "$run_dir" ]] || { echo "Usage: check_resume.sh <run-dir> [feature-key]" >&2; exit 1; }

node "$SCRIPT_DIR/lib/detectReportState.mjs" "$run_dir" "$feature_key"
