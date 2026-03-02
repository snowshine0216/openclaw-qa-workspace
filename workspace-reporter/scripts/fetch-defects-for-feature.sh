#!/bin/bash
# fetch-defects-for-feature.sh — Single source of truth for Phase 0a + Phase 1 defect fetch
# Usage: ./fetch-defects-for-feature.sh <feature-id>
# Example: ./fetch-defects-for-feature.sh BCIN-1234
#
# Must be run from workspace-reporter root (or cd there first). Sources .env for Jira credentials.
# Outputs: projects/defects-analysis/<feature-id>/context/jira_raw.json
# Prints: DEFECT_COUNT=N (parsable)
#
# Used by: defect-analysis workflow Phase 1, planner Phase 2a auto-detect

set -euo pipefail

readonly FEATURE_ID="${1:?Usage: fetch-defects-for-feature.sh <feature-id>}"
readonly REPORTER_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
readonly CACHE_FILE="$REPORTER_ROOT/projects/defects-analysis/.cache/project_keys.txt"
readonly CACHE_JSON="$REPORTER_ROOT/projects/defects-analysis/.cache/jira_projects.json"
readonly OUTPUT_DIR="$REPORTER_ROOT/projects/defects-analysis/$FEATURE_ID/context"
readonly OUTPUT_FILE="$OUTPUT_DIR/jira_raw.json"

# Load Jira credentials from workspace .env
if [ -f "$REPORTER_ROOT/.env" ]; then
  # shellcheck source=/dev/null
  set -a
  # Only load Jira vars; avoid polluting env
  export JIRA_API_TOKEN="$(grep -E '^JIRA_API_TOKEN=' "$REPORTER_ROOT/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")"
  export JIRA_SERVER="${JIRA_SERVER:-$(grep -E '^JIRA_SERVER=' "$REPORTER_ROOT/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")}"
  export JIRA_EMAIL="$(grep -E '^JIRA_EMAIL=' "$REPORTER_ROOT/.env" | cut -d= -f2- | tr -d '"' | tr -d "'")"
  set +a
else
  echo "ERROR: .env not found at $REPORTER_ROOT/.env" >&2
  exit 1
fi

# Phase 0a: Ensure project cache exists and is fresh (< 24h)
if [ ! -f "$CACHE_FILE" ] || [ $(( $(date +%s) - $(stat -f %m "$CACHE_FILE" 2>/dev/null || stat -c %Y "$CACHE_FILE" 2>/dev/null || echo 0) )) -ge 86400 ]; then
  echo "🔄 Fetching project list from Jira..." >&2
  mkdir -p "$(dirname "$CACHE_FILE")"
  if [ -f "$REPORTER_ROOT/scripts/retry.sh" ]; then
    "$REPORTER_ROOT/scripts/retry.sh" 3 2 jira project list --format json > "$CACHE_JSON"
  else
    jira project list --format json > "$CACHE_JSON"
  fi
  jq -r '.[].key' "$CACHE_JSON" > "$CACHE_FILE"
  echo "✅ Cached $(wc -l < "$CACHE_FILE" | tr -d ' ') projects" >&2
fi

if [ ! -s "$CACHE_FILE" ]; then
  echo "ERROR: project_keys.txt is empty. Check Jira credentials." >&2
  exit 1
fi

# Phase 1: Run cross-project JQL for defects
PROJECT_KEYS=$(cat "$CACHE_FILE" | tr '\n' ',' | sed 's/,$//')
mkdir -p "$OUTPUT_DIR"

if [ -f "$REPORTER_ROOT/scripts/retry.sh" ]; then
  "$REPORTER_ROOT/scripts/retry.sh" 3 2 jira issue list \
    --jql "project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent=\"$FEATURE_ID\" OR text ~ \"$FEATURE_ID\")" \
    --format json \
    --paginate 50 \
    > "$OUTPUT_FILE"
else
  jira issue list \
    --jql "project in ($PROJECT_KEYS) AND issuetype = Defect AND (parent=\"$FEATURE_ID\" OR text ~ \"$FEATURE_ID\")" \
    --format json \
    --paginate 50 \
    > "$OUTPUT_FILE"
fi

# Parse defect count
DEFECT_COUNT=0
if [ -s "$OUTPUT_FILE" ]; then
  DEFECT_COUNT=$(jq -r 'if type == "array" then length else 0 end' "$OUTPUT_FILE" 2>/dev/null || echo 0)
  # jira-cli may return wrapper object; handle both
  if [ "$DEFECT_COUNT" = "0" ] || [ -z "$DEFECT_COUNT" ]; then
    DEFECT_COUNT=$(jq -r '.issues | length // 0' "$OUTPUT_FILE" 2>/dev/null || echo 0)
  fi
  if [ -z "$DEFECT_COUNT" ] || [ "$DEFECT_COUNT" = "null" ]; then
    DEFECT_COUNT=$(jq -r 'length // 0' "$OUTPUT_FILE" 2>/dev/null || echo 0)
  fi
fi

echo "DEFECT_COUNT=$DEFECT_COUNT"
exit 0
