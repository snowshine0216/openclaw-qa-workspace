#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEEP_COUNT="3"
MIN_AGE_SECONDS="3600"
DRY_RUN=false
PROTECT_RUN_KEY=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --keep)
      KEEP_COUNT="$2"
      shift 2
      ;;
    --protect-run-key)
      PROTECT_RUN_KEY="$2"
      shift 2
      ;;
    --min-age-seconds)
      MIN_AGE_SECONDS="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "usage: $0 [--keep <n>] [--protect-run-key <run-key>] [--dry-run]" >&2
      exit 1
      ;;
  esac
done

CMD=(node "$DIR/lib/pruneRuns.mjs" --keep "$KEEP_COUNT" --min-age-seconds "$MIN_AGE_SECONDS")
if [[ "$DRY_RUN" == true ]]; then
  CMD+=(--dry-run)
fi
if [[ -n "$PROTECT_RUN_KEY" ]]; then
  CMD+=(--protect-run-key "$PROTECT_RUN_KEY")
fi

"${CMD[@]}"
