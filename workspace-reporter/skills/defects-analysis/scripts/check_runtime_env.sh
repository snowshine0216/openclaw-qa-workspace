#!/usr/bin/env bash
set -euo pipefail

RUN_KEY="${1:-}"
SOURCES="${2:-}"
OUT_DIR="${3:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

[[ -n "$RUN_KEY" && -n "$SOURCES" && -n "$OUT_DIR" ]] || {
  echo "Usage: check_runtime_env.sh <run-key> jira,github <out-dir>" >&2
  exit 1
}

node "$SCRIPT_DIR/check_runtime_env.mjs" "$RUN_KEY" "$SOURCES" "$OUT_DIR"
