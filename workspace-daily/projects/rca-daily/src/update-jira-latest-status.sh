#!/bin/bash

# Update Jira Latest Status field with RCA summary
# Usage: ./update-jira-latest-status.sh <ISSUE_KEY> <RCA_FILE>

set -e

if [ $# -ne 2 ]; then
    echo "Usage: $0 <ISSUE_KEY> <RCA_FILE>"
    exit 1
fi

ISSUE_KEY="$1"
RCA_FILE="$2"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M UTC')

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source bash_profile for Jira credentials
if [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi

echo "Updating Latest Status for ${ISSUE_KEY}..."

# Convert markdown to ADF format
echo "Converting markdown to ADF format..."
ADF_CONTENT=$(node "${SCRIPT_DIR}/markdown-to-adf.js" "${RCA_FILE}" -)

if [ $? -ne 0 ]; then
    echo "❌ Failed to convert markdown to ADF"
    exit 1
fi

# Add header paragraph with timestamp
HEADER_PARA=$(jq -n \
  --arg timestamp "$TIMESTAMP" \
  --arg issue_key "$ISSUE_KEY" \
  '{
    "type": "paragraph",
    "content": [
      {
        "type": "text",
        "text": ("[" + $timestamp + "] RCA Generated for " + $issue_key),
        "marks": [{"type": "strong"}]
      },
      {
        "type": "hardBreak"
      }
    ]
  }'
)

# Combine header with ADF content
ADF_UPDATE=$(echo "$ADF_CONTENT" | jq --argjson header "$HEADER_PARA" '.content = [$header] + .content')

# Fetch current customfield_10050 value
CURRENT_VALUE=$(jira issue view "${ISSUE_KEY}" --raw | jq '.fields.customfield_10050')

if [ "$CURRENT_VALUE" = "null" ]; then
    # Field is empty, use ADF content directly
    NEW_CONTENT="$ADF_UPDATE"
else
    # Append ADF content to existing content
    NEW_CONTENT=$(echo "$CURRENT_VALUE" | jq --argjson newContent "$ADF_UPDATE" '.content += $newContent.content')
fi

# Update via REST API
JIRA_URL="https://strategyagile.atlassian.net"
JIRA_API="${JIRA_URL}/rest/api/3/issue/${ISSUE_KEY}"

# Create update payload
UPDATE_PAYLOAD=$(jq -n --argjson content "$NEW_CONTENT" '{
  "fields": {
    "customfield_10050": $content
  }
}')

# Get Jira username from config
JIRA_USER=$(grep "^login:" ~/.config/.jira/.config.yml | awk '{print $2}')

# Use curl to update (jira-cli doesn't handle complex ADF well)
RESPONSE=$(curl -s -X PUT "${JIRA_API}" \
  -u "${JIRA_USER}:${JIRA_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD" 2>&1)

if [ $? -eq 0 ] && [ -z "$RESPONSE" ]; then
    echo "✅ Latest Status updated for ${ISSUE_KEY}"
else
    echo "❌ Failed to update ${ISSUE_KEY}"
    echo "Response: ${RESPONSE}"
    exit 1
fi
