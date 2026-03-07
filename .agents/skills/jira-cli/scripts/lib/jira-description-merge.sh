#!/usr/bin/env bash
# jira-description-merge.sh - ADF description merge utilities
# Merges existing Jira issue descriptions with new content (default behavior)

set -euo pipefail

# Use a unique variable name to avoid collisions
JIRA_MERGE_SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Only source jira-rest if not already loaded
if ! type jira_curl >/dev/null 2>&1; then
  # shellcheck source=./jira-rest.sh
  source "$JIRA_MERGE_SCRIPT_DIR/jira-rest.sh"
fi

# Fetch existing description from a Jira issue
# Args: issue_key
# Returns: ADF JSON document or empty doc structure
fetch_existing_description() {
  local issue_key="$1"
  
  # Fetch issue with description field
  local response
  response=$(jira_curl_json GET "$(jira_api_base)/issue/${issue_key}?fields=description" 2>/dev/null) || {
    # API call failed - return empty doc
    echo '{"version":1,"type":"doc","content":[]}' >&2
    echo '{"version":1,"type":"doc","content":[]}'
    return 0
  }
  
  # Extract description field
  local description
  description=$(echo "$response" | jq -c '.fields.description // empty')
  
  # Return empty doc if no description exists
  if [[ -z "$description" || "$description" == "null" ]]; then
    echo '{"version":1,"type":"doc","content":[]}'
    return 0
  fi
  
  echo "$description"
}

# Merge two ADF documents by appending new content to existing content
# Args: existing_adf_json new_adf_json
# Returns: merged ADF JSON document
merge_adf_documents() {
  local existing_json="$1"
  local new_json="$2"
  
  # Parse both documents
  local existing_content new_content
  existing_content=$(echo "$existing_json" | jq -c '.content // []')
  new_content=$(echo "$new_json" | jq -c '.content // []')
  
  # Merge content arrays
  local merged_content
  merged_content=$(jq -n \
    --argjson existing "$existing_content" \
    --argjson new "$new_content" \
    '$existing + $new')
  
  # Build merged document
  local version type
  version=$(echo "$new_json" | jq -r '.version // 1')
  type=$(echo "$new_json" | jq -r '.type // "doc"')
  
  jq -n \
    --argjson content "$merged_content" \
    --argjson version "$version" \
    --arg type "$type" \
    '{version: $version, type: $type, content: $content}'
}

# Validate ADF structure
# Args: adf_json
# Returns: 0 if valid, 1 if invalid
validate_adf_structure() {
  local adf_json="$1"
  
  # Must be valid JSON
  echo "$adf_json" | jq empty 2>/dev/null || return 1
  
  # Must have required fields
  local version type content
  version=$(echo "$adf_json" | jq -r '.version // empty')
  type=$(echo "$adf_json" | jq -r '.type // empty')
  content=$(echo "$adf_json" | jq -r '.content // empty')
  
  [[ -n "$version" ]] || return 1
  [[ -n "$type" ]] || return 1
  [[ -n "$content" ]] || return 1
  
  return 0
}
