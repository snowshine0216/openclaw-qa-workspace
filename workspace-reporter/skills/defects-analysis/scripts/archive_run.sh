#!/usr/bin/env bash
set -euo pipefail

RUN_DIR="${1:-}"
MODE="${2:-}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

[[ -n "$RUN_DIR" && -n "$MODE" ]] || {
  echo "Usage: archive_run.sh <run-dir> <smart_refresh|full_regenerate>" >&2
  exit 1
}

ARCHIVE_DIR="$RUN_DIR/archive"
mkdir -p "$ARCHIVE_DIR"

for file in "$RUN_DIR"/*_REPORT_DRAFT.md "$RUN_DIR"/*_REVIEW_SUMMARY.md "$RUN_DIR"/*_REPORT_FINAL.md; do
  [[ -f "$file" ]] || continue
  base="$(basename "$file" .md)"
  mv "$file" "$ARCHIVE_DIR/${base}_${TIMESTAMP}.md"
done

if [[ "$MODE" == "full_regenerate" ]]; then
  rm -rf "$RUN_DIR/context/jira_issues" "$RUN_DIR/context/prs"
  rm -f "$RUN_DIR/context/jira_raw.json" "$RUN_DIR/context/defect_index.json" "$RUN_DIR/context/pr_links.json" \
    "$RUN_DIR/context/no_pr_links.md" "$RUN_DIR/context/pr_impact_summary.json"
fi
