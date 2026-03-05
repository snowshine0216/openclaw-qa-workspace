#!/bin/bash

# Complete RCA Workflow Orchestrator - SINGLE SOURCE OF TRUTH
# This script runs the full RCA generation workflow:
# 1. Fetch filtered defects + collect Jira/GitHub data (via process-rca.sh)
# 2. Spawn AI agent to generate RCAs
# 3. Update Jira Latest Status
# 4. Auto-send Feishu summary

set -e

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly OUTPUT_DIR="${PROJECT_ROOT}/output"
readonly CORE_DIR="${PROJECT_ROOT}/src/core"
readonly UTILS_DIR="${PROJECT_ROOT}/src/utils"
readonly TIMESTAMP=$(date +%Y%m%d-%H%M%S)
readonly FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

run_data_collection() {
    local core_script="${CORE_DIR}/process-rca.sh"
    echo "📥 Step 1: Running process-rca.sh to collect data..."
    bash "${core_script}"
}

create_manifest() {
    local rca_inputs_count
    rca_inputs_count=$(ls -1 "${OUTPUT_DIR}"/rca-input-*.json 2>/dev/null | wc -l | xargs || echo "0")

    if [ "${rca_inputs_count}" -eq 0 ]; then
        echo "❌ No RCA input files found. Exiting."
        exit 1
    fi

    echo "Found ${rca_inputs_count} RCA input file(s)"
    echo ""

    local manifest_file="${OUTPUT_DIR}/rca-manifest-${TIMESTAMP}.json"
    
    echo "{" > "${manifest_file}"
    echo "  \"timestamp\": \"${TIMESTAMP}\"," >> "${manifest_file}"
    echo "  \"total_issues\": ${rca_inputs_count}," >> "${manifest_file}"
    echo "  \"rca_inputs\": [" >> "${manifest_file}"

    local first=true
    for rca_input in "${OUTPUT_DIR}"/rca-input-*.json; do
        if [ -f "${rca_input}" ]; then
            if [ "${first}" = false ]; then
                echo "," >> "${manifest_file}"
            fi
            first=false
            
            local issue_key
            issue_key=$(jq -r '.issue_key' "${rca_input}")
            local rca_output
            rca_output=$(jq -r '.rca_output_path' "${rca_input}")
            
            echo "    {" >> "${manifest_file}"
            echo "      \"issue_key\": \"${issue_key}\"," >> "${manifest_file}"
            echo "      \"input_file\": \"${rca_input}\"," >> "${manifest_file}"
            echo "      \"output_file\": \"${rca_output}\"" >> "${manifest_file}"
            echo -n "    }" >> "${manifest_file}"
        fi
    done

    echo "" >> "${manifest_file}"
    echo "  ]" >> "${manifest_file}"
    echo "}" >> "${manifest_file}"

    echo "✅ Manifest created: ${manifest_file}"
    echo ""
    echo "📋 RCA inputs prepared. Ready for agent processing."
    echo ""
    echo "Next: Run the RCA generator script to spawn agents:"
    echo "  node ${UTILS_DIR}/generate-rcas-via-agent.js ${manifest_file}"
    echo ""

    # Create trigger file for automation
    local trigger_file="${OUTPUT_DIR}/.rca-trigger-${TIMESTAMP}"
    echo "${manifest_file}" > "${trigger_file}"
    echo "✅ Trigger file created: ${trigger_file}"
    echo ""
    
    # Return manifest file name for caller
    echo "${manifest_file}"
}

send_agent_notification() {
    local rca_inputs_count="$1"
    
    local notification_message="🤖 **RCA Workflow Ready**

Data collection complete for **${rca_inputs_count} issues**.

**Manifest:** \`rca-manifest-${TIMESTAMP}.json\`
**Timestamp:** ${TIMESTAMP}

Please process the manifest to generate RCAs, update Jira, and send final notification."

    # Try OpenClaw CLI first, fall back to logging
    if command -v openclaw &> /dev/null; then
        echo "Sending notification via OpenClaw CLI..."
        if openclaw message send \
            --channel feishu \
            --target "${FEISHU_CHAT_ID}" \
            --message "${notification_message}" 2>&1; then
            echo "✅ Feishu notification sent successfully"
        else
            echo "⚠️  OpenClaw CLI failed. Notification logged to manifest."
        fi
    else
        echo "⚠️  OpenClaw CLI not available. Notification logged to manifest."
    fi
}

print_next_steps() {
    local rca_inputs_count="$1"
    local manifest_file="$2"
    
    echo ""
    echo "========================================="
    echo "⏸️  Data collection complete. Waiting for agent."
    echo "========================================="
    echo ""
    echo "Agent will:"
    echo "  1. Read manifest: ${manifest_file}"
    echo "  2. Spawn ${rca_inputs_count} sub-agents to generate RCAs"
    echo "  3. Run post-workflow script to update Jira"
    echo "  4. Send final Feishu summary"
    echo ""
}

main() {
    echo "========================================="
    echo "Complete RCA Workflow - $(date)"
    echo "========================================="
    echo ""

    run_data_collection

    echo ""
    echo "========================================="
    echo "🤖 Step 2: Creating RCA generation manifest"
    echo "========================================="
    echo ""

    local rca_inputs_count
    rca_inputs_count=$(ls -1 "${OUTPUT_DIR}"/rca-input-*.json 2>/dev/null | wc -l | xargs || echo "0")
    
    local manifest_file
    manifest_file=$(create_manifest)

    echo "========================================="
    echo "📤 Step 2b: Notifying agent to process RCA manifest"
    echo "========================================="
    echo ""

    send_agent_notification "${rca_inputs_count}"
    print_next_steps "${rca_inputs_count}" "${manifest_file}"
}

main "$@"



