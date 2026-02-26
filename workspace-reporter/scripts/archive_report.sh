#!/bin/bash
# archive_report.sh — Archive an existing DRAFT or FINAL report before overwriting
# Usage: ./archive_report.sh <feature-key> <type>
# Arguments:
#   <feature-key>  e.g. BCIN-1234
#   <type>         FINAL | DRAFT
# Examples:
#   ./archive_report.sh BCIN-1234 FINAL
#   ./archive_report.sh BCIN-1234 DRAFT
#
# Behavior:
#   - Moves <FEATURE_KEY>_REPORT_<TYPE>.md to archive/<FEATURE_KEY>_REPORT_<TYPE>_<YYYYMMDD>.md
#   - If an archive file for today already exists, appends _<HHmm> to avoid collision
#   - Creates the archive/ directory if it does not exist
#   - Appends an entry to task.json archive_log[] if task.json exists
#   - Exits 0 on success, 1 on error, 2 if source file does not exist (not an error)
#
# Exit codes:
#   0 — Archived successfully
#   1 — Error (missing args, write failure)
#   2 — Source file not found (nothing to archive; caller can ignore)

set -euo pipefail

readonly FEATURE_KEY="${1:?Usage: archive_report.sh <feature-key> <type>}"
readonly TYPE="${2:?Usage: archive_report.sh <feature-key> <type>}"

if [[ "$TYPE" != "FINAL" && "$TYPE" != "DRAFT" ]]; then
  echo "ERROR: <type> must be FINAL or DRAFT (got: $TYPE)" >&2
  exit 1
fi

readonly REPORTER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
readonly FEATURE_DIR="$REPORTER_ROOT/projects/defects-analysis/$FEATURE_KEY"
readonly TASK_FILE="$FEATURE_DIR/task.json"
readonly SOURCE_FILE="$FEATURE_DIR/${FEATURE_KEY}_REPORT_${TYPE}.md"
readonly ARCHIVE_DIR="$FEATURE_DIR/archive"

# Nothing to archive — caller can treat exit code 2 as non-fatal
if [ ! -f "$SOURCE_FILE" ]; then
  echo "SKIP — $SOURCE_FILE does not exist. Nothing to archive."
  exit 2
fi

# Create archive directory if needed
mkdir -p "$ARCHIVE_DIR"

# Build archive filename, handling same-day collision
DATE=$(date +%Y%m%d)
DEST="$ARCHIVE_DIR/${FEATURE_KEY}_REPORT_${TYPE}_${DATE}.md"
if [ -f "$DEST" ]; then
  DEST="$ARCHIVE_DIR/${FEATURE_KEY}_REPORT_${TYPE}_${DATE}_$(date +%H%M).md"
fi

mv "$SOURCE_FILE" "$DEST"
echo "ARCHIVED — $(basename "$SOURCE_FILE") → archive/$(basename "$DEST")"

# Update task.json archive_log if it exists and jq is available
if [ -f "$TASK_FILE" ] && command -v jq &>/dev/null; then
  NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  TMP=$(mktemp)
  jq --arg archived_at "$NOW" \
     --arg original_file "${FEATURE_KEY}_REPORT_${TYPE}.md" \
     --arg archived_to "archive/$(basename "$DEST")" \
     '.archive_log = (.archive_log // []) + [{
        archived_at: $archived_at,
        original_file: $original_file,
        archived_to: $archived_to
      }]' \
     "$TASK_FILE" > "$TMP" && mv "$TMP" "$TASK_FILE"
  echo "  task.json archive_log updated."
fi
