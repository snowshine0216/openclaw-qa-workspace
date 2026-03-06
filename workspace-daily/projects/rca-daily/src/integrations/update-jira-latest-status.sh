#!/bin/bash

# Update Jira Latest Status field with RCA summary
# Usage: ./update-jira-latest-status.sh <ISSUE_KEY> <RCA_FILE>

set -e

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly UTILS_DIR="${PROJECT_ROOT}/src/utils"
readonly TIMESTAMP=$(date '+%Y-%m-%d %H:%M UTC')
readonly JIRA_URL="https://strategyagile.atlassian.net"

check_arguments() {
    if [ "$#" -ne 2 ]; then
        echo "Usage: $0 <ISSUE_KEY> <RCA_FILE>"
        exit 1
    fi
}

setup_jira_credentials() {
    # Source bash_profile for Jira credentials
    if [ -f ~/.bash_profile ]; then
        source ~/.bash_profile
    fi
}

convert_markdown_to_adf() {
    local rca_file="$1"
    
    echo "Converting markdown to ADF format..."
    # Call JS via node - nvm use default recommended
    nvm use default >/dev/null 2>&1 || true
    
    local adf_content
    if ! adf_content=$(node "${UTILS_DIR}/markdown-to-adf.js" "${rca_file}" -); then
        echo "❌ Failed to convert markdown to ADF"
        exit 1
    fi
    
    echo "${adf_content}"
}

format_update_payload() {
    local issue_key="$1"
    local adf_content="$2"
    
    # Add header paragraph with timestamp
    local header_para
    header_para=$(jq -n \
      --arg timestamp "${TIMESTAMP}" \
      --arg issue_key "${issue_key}" \
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
    local adf_update
    adf_update=$(echo "${adf_content}" | jq --argjson header "${header_para}" '.content = [$header] + .content')

    # Fetch current customfield_10050 value
    local current_value
    current_value=$(jira issue view "${issue_key}" --raw | jq '.fields.customfield_10050')

    local new_content
    if [ "${current_value}" = "null" ]; then
        # Field is empty, use ADF content directly
        new_content="${adf_update}"
    else
        # Append ADF content to existing content
        new_content=$(echo "${current_value}" | jq --argjson newContent "${adf_update}" '.content += $newContent.content')
    fi

    local update_payload
    update_payload=$(jq -n --argjson content "${new_content}" '{
      "fields": {
        "customfield_10050": $content
      }
    }')
    
    echo "${update_payload}"
}

send_update_to_jira() {
    local issue_key="$1"
    local update_payload="$2"
    
    local jira_api="${JIRA_URL}/rest/api/3/issue/${issue_key}"

    # Get Jira username from config
    local jira_user
    jira_user=$(grep "^login:" ~/.config/.jira/.config.yml | awk '{print $2}')

    # Use curl to update (jira-cli doesn't handle complex ADF well)
    local response
    response=$(curl -s -X PUT "${jira_api}" \
      -u "${jira_user}:${JIRA_API_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "${update_payload}" 2>&1)

    if [ $? -eq 0 ] && [ -z "${response}" ]; then
        echo "✅ Latest Status updated for ${issue_key}"
    else
        echo "❌ Failed to update ${issue_key}"
        echo "Response: ${response}"
        exit 1
    fi
}

main() {
    check_arguments "$@"
    
    local issue_key="$1"
    local rca_file="$2"
    
    setup_jira_credentials
    
    echo "Updating Latest Status for ${issue_key}..."
    
    local adf_content
    adf_content=$(convert_markdown_to_adf "${rca_file}")
    
    local update_payload
    update_payload=$(format_update_payload "${issue_key}" "${adf_content}")
    
    send_update_to_jira "${issue_key}" "${update_payload}"
}

main "$@"
