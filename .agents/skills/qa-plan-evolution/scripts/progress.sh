#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
REPO_ROOT="$(cd "$ROOT/../../.." && pwd)"
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
CANONICAL_RUN_ROOT="$REPO_ROOT/workspace-artifacts/skills/shared/qa-plan-evolution/runs/$RUN_KEY"
if [[ -z "$RUN_ROOT" ]]; then
  RUN_ROOT="$CANONICAL_RUN_ROOT"
fi
if [[ -f "$CANONICAL_RUN_ROOT/task.json" ]]; then
  RUN_ROOT="$CANONICAL_RUN_ROOT"
fi
node "$DIR/lib/asyncJobStore.mjs" refresh --run-root "$RUN_ROOT"
