#!/usr/bin/env bash
set -euo pipefail

RUN_DIR="${1:-}"
MODE="${2:-}"
if [[ -z "$RUN_DIR" || -z "$MODE" ]]; then
  echo "Usage: archive_run.sh <run_dir> <mode>" >&2
  exit 1
fi
[[ -d "$RUN_DIR" ]] || { echo "archive_run: run_dir not found" >&2; exit 1; }

ARCHIVE_BASE="${RUN_DIR}/archive"
mkdir -p "$ARCHIVE_BASE"
TS="$(date -u +"%Y%m%dT%H%M%SZ")"
ARCHIVE_DIR="${ARCHIVE_BASE}/${TS}"

N=0
while [[ -d "$ARCHIVE_DIR" ]]; do
  N=$((N + 1))
  ARCHIVE_DIR="${ARCHIVE_BASE}/${TS}_${N}"
done
mkdir -p "$ARCHIVE_DIR"

for path in "$RUN_DIR"/*.md "$RUN_DIR"/*.json "$RUN_DIR"/context "$RUN_DIR"/drafts; do
  [[ -e "$path" ]] && cp -R "$path" "$ARCHIVE_DIR/" || true
done

if [[ "$MODE" == "full_regenerate" ]]; then
  rm -f "${RUN_DIR}"/*_TESTING_PLAN.md
  rm -rf "${RUN_DIR}/drafts"/*
  rm -f "${RUN_DIR}/context/prs/"*_impact.md
fi

echo "ARCHIVED_TO=$ARCHIVE_DIR"

