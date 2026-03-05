#!/bin/bash
# ensure_env.sh — Ensure tests/config/.env.report exists. Copy from example if missing.
# Usage: ./ensure_env.sh
# Exit: 0 — .env.report exists (or was created)

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly ENV_FILE="$BASE_DIR/tests/config/.env.report"
readonly EXAMPLE="$BASE_DIR/tests/config/.env.report.example"

if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$EXAMPLE" ]; then
    cp "$EXAMPLE" "$ENV_FILE"
    echo "Created $ENV_FILE from .env.report.example"
  else
    echo "ERROR: .env.report missing and .env.report.example not found" >&2
    exit 1
  fi
else
  echo ".env.report exists"
fi
