#!/bin/bash
# Convenience wrapper for MD → Confluence publishing

set -e

if [ $# -lt 2 ]; then
  echo "Usage: $0 <input.md> <confluence-page-id>"
  echo "Example: $0 qa_plan.md 5903319628"
  exit 1
fi

INPUT_MD="$1"
PAGE_ID="$2"
OUTPUT_HTML="${INPUT_MD%.md}.confluence.html"

echo "📄 Converting Markdown to Confluence HTML..."
node "$(dirname "$0")/md-to-confluence.js" "$INPUT_MD" "$OUTPUT_HTML"

echo "📤 Publishing to Confluence page $PAGE_ID..."
confluence update "$PAGE_ID" --file "$OUTPUT_HTML" --format storage

echo "✅ Published successfully!"
echo "🔗 URL: https://microstrategy.atlassian.net/wiki/spaces/CQT/pages/$PAGE_ID/"
