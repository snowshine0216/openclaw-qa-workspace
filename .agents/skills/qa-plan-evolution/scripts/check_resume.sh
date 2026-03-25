#!/usr/bin/env bash
# Usage: check_resume.sh --run-key <key> [--run-root path]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
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
CANONICAL_RUN_ROOT="$ROOT/runs/$RUN_KEY"
if [[ -f "$CANONICAL_RUN_ROOT/task.json" ]]; then
  RUN_ROOT="$CANONICAL_RUN_ROOT"
elif [[ -n "$RUN_ROOT" && -f "$RUN_ROOT/.canonical-run-root" ]]; then
  RUN_ROOT="$(cat "$RUN_ROOT/.canonical-run-root")"
elif [[ -z "$RUN_ROOT" ]]; then
  RUN_ROOT="$CANONICAL_RUN_ROOT"
fi
if [[ -f "$RUN_ROOT/task.json" ]]; then
  echo "task.json present: resume possible"
  node "$DIR/lib/asyncJobStore.mjs" refresh --run-root "$RUN_ROOT"
else
  echo "no task.json: fresh run"
fi
