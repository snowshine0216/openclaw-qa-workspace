#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running run-agent-workflow smoke test..."

bash "$script_dir/../run-agent-workflow.sh" BCIN-TEST --dry-run
status=$?

if [[ "$status" -ne 0 ]]; then
  echo "FAIL: run-agent-workflow exited with status $status"
  exit 1
fi

echo "PASS"
