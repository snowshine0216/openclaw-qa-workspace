#!/usr/bin/env bash
# Usage: check_resume.sh --run-key <key> [--run-root path]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
RUN_KEY=""
RUN_ROOT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --run-key) RUN_KEY="$2"; shift 2 ;;
    --run-root) RUN_ROOT="$2"; shift 2 ;;
    *) shift ;;
  esac
done
if [[ -z "$RUN_KEY" ]]; then
  echo "usage: $0 --run-key <key> [--run-root path]" >&2
  exit 1
fi
if [[ -z "$RUN_ROOT" ]]; then
  RUN_ROOT="$ROOT/runs/$RUN_KEY"
fi
if [[ -f "$RUN_ROOT/task.json" ]]; then
  echo "task.json present: resume possible"
  jq '{report_state,overall_status,current_phase,current_iteration}' "$RUN_ROOT/task.json"
else
  echo "no task.json: fresh run"
fi
