#!/bin/bash
set -euo pipefail
if [[ "${1:-}" != "me" ]]; then
  echo "unexpected jira command: $*" >&2
  exit 1
fi
echo "jira ok"
