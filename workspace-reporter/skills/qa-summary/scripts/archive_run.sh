#!/usr/bin/env bash
set -euo pipefail

run_dir="$1"
feature_key="$2"
timestamp="${3:-$(date -u +%Y%m%dT%H%M%SZ)}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

[[ -n "$run_dir" && -n "$feature_key" ]] || {
  echo "Usage: archive_run.sh <run-dir> <feature-key> [timestamp]" >&2
  exit 1
}

mkdir -p "$run_dir/archive"

if [[ -f "$run_dir/${feature_key}_QA_SUMMARY_FINAL.md" ]]; then
  mv "$run_dir/${feature_key}_QA_SUMMARY_FINAL.md" \
    "$run_dir/archive/${feature_key}_QA_SUMMARY_FINAL_${timestamp}.md"
fi

if [[ -f "$run_dir/drafts/${feature_key}_QA_SUMMARY_DRAFT.md" ]]; then
  mv "$run_dir/drafts/${feature_key}_QA_SUMMARY_DRAFT.md" \
    "$run_dir/archive/${feature_key}_QA_SUMMARY_DRAFT_${timestamp}.md"
fi
