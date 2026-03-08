#!/bin/bash
# save_context.sh — Persist a raw artifact into context/ with archive-before-overwrite
# Called by: qa-plan-* sub-agent skills ONLY
# Usage: ./save_context.sh <feature-id> <artifact-name> <content-or-filepath>
set -euo pipefail

FEATURE_ID="${1:?Usage: save_context.sh <feature-id> <artifact-name> <content-or-file>}"
ARTIFACT_NAME="${2:?Missing artifact name}"
CONTENT_OR_FILE="${3:?Missing content or file path}"

# Script runs from projects/feature-plan/scripts/ (orchestrator copies from lib/ at Phase 1)
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONTEXT_DIR="$BASE_DIR/$FEATURE_ID/context"
mkdir -p "$CONTEXT_DIR"

# Support sub-paths like "figma/figma_metadata_..."
OUTFILE="$CONTEXT_DIR/${ARTIFACT_NAME%.md}.md"
mkdir -p "$(dirname "$OUTFILE")"

# Archive if already exists (idempotency)
if [ -f "$OUTFILE" ]; then
  TS=$(date -u +%Y%m%dT%H%M%SZ)
  mv "$OUTFILE" "${OUTFILE%.md}_archived_${TS}.md"
fi

# Write: file path or inline content
if [ -f "$CONTENT_OR_FILE" ]; then
  cp "$CONTENT_OR_FILE" "$OUTFILE"
else
  printf '%s\n' "$CONTENT_OR_FILE" > "$OUTFILE"
fi

echo "SAVED: context/${ARTIFACT_NAME%.md}.md"
