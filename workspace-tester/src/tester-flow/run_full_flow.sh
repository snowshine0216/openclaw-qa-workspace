#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  node "${RUNNER_PATH}" help
  exit 0
fi

node "${RUNNER_PATH}" full "$@"
