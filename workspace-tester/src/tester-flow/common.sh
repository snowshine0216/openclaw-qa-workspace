#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_TESTER_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
RUNNER_PATH="${SCRIPT_DIR}/runner.mjs"

if [[ ! -f "${RUNNER_PATH}" ]]; then
  echo "runner.mjs not found: ${RUNNER_PATH}" >&2
  exit 1
fi
