#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: build-adf.sh <input.md> [output.json]" >&2
  exit 1
fi

node "$SCRIPT_DIR/lib/jira-payloads.js" markdown-to-adf "$@"
