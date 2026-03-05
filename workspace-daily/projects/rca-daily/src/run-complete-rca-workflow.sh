#!/bin/bash

# Complete RCA Workflow Orchestrator - SINGLE SOURCE OF TRUTH
# This script runs the full RCA generation workflow:
# 1. Fetch filtered defects + collect Jira/GitHub data (via process-rca.sh)
# 2. Spawn AI agent to generate RCAs
# 3. Update Jira Latest Status
# 4. Auto-send Feishu summary

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../output"
RCA_DIR="${OUTPUT_DIR}/rca"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

echo "========================================="
echo "Complete RCA Workflow - $(date)"
echo "========================================="
echo ""

# Step 1: Run data collection via process-rca.sh
echo "📥 Step 1: Running process-rca.sh to collect data..."
bash "${SCRIPT_DIR}/process-rca.sh"

echo ""
echo "========================================="
echo "🤖 Step 2: Creating RCA generation manifest"
echo "========================================="
echo ""

# Find all RCA input JSON files
RCA_INPUTS=$(ls -1 "${OUTPUT_DIR}"/rca-input-*.json 2>/dev/null | wc -l | xargs)

if [ "$RCA_INPUTS" -eq 0 ]; then
    echo "❌ No RCA input files found. Exiting."
    exit 1
fi

echo "Found ${RCA_INPUTS} RCA input file(s)"
echo ""

# Create manifest file for agent to process
MANIFEST_FILE="${OUTPUT_DIR}/rca-manifest-${TIMESTAMP}.json"
echo "{" > "${MANIFEST_FILE}"
echo "  \"timestamp\": \"${TIMESTAMP}\"," >> "${MANIFEST_FILE}"
echo "  \"total_issues\": ${RCA_INPUTS}," >> "${MANIFEST_FILE}"
echo "  \"rca_inputs\": [" >> "${MANIFEST_FILE}"

FIRST=true
for RCA_INPUT in "${OUTPUT_DIR}"/rca-input-*.json; do
    if [ -f "$RCA_INPUT" ]; then
        if [ "$FIRST" = false ]; then
            echo "," >> "${MANIFEST_FILE}"
        fi
        FIRST=false
        
        ISSUE_KEY=$(jq -r '.issue_key' "$RCA_INPUT")
        RCA_OUTPUT=$(jq -r '.rca_output_path' "$RCA_INPUT")
        
        echo "    {" >> "${MANIFEST_FILE}"
        echo "      \"issue_key\": \"${ISSUE_KEY}\"," >> "${MANIFEST_FILE}"
        echo "      \"input_file\": \"${RCA_INPUT}\"," >> "${MANIFEST_FILE}"
        echo "      \"output_file\": \"${RCA_OUTPUT}\"" >> "${MANIFEST_FILE}"
        echo -n "    }" >> "${MANIFEST_FILE}"
    fi
done

echo "" >> "${MANIFEST_FILE}"
echo "  ]" >> "${MANIFEST_FILE}"
echo "}" >> "${MANIFEST_FILE}"

echo "✅ Manifest created: ${MANIFEST_FILE}"
echo ""
echo "📋 RCA inputs prepared. Ready for agent processing."
echo ""
echo "Next: Run the RCA generator script to spawn agents:"
echo "  node ${SCRIPT_DIR}/generate-rcas-via-agent.js ${MANIFEST_FILE}"
echo ""

# Create trigger file for automation
TRIGGER_FILE="${OUTPUT_DIR}/.rca-trigger-${TIMESTAMP}"
echo "${MANIFEST_FILE}" > "${TRIGGER_FILE}"
echo "✅ Trigger file created: ${TRIGGER_FILE}"
echo ""

# Step 2b: Notify agent via Feishu to spawn RCA sub-agents
echo "========================================="
echo "📤 Step 2b: Notifying agent to process RCA manifest"
echo "========================================="
echo ""

NOTIFICATION_MESSAGE="🤖 **RCA Workflow Ready**

Data collection complete for **${RCA_INPUTS} issues**.

**Manifest:** \`rca-manifest-${TIMESTAMP}.json\`
**Timestamp:** ${TIMESTAMP}

Please process the manifest to generate RCAs, update Jira, and send final notification."

# Try OpenClaw CLI first, fall back to logging
if command -v openclaw &> /dev/null; then
    echo "Sending notification via OpenClaw CLI..."
    if openclaw message send \
        --channel feishu \
        --target "${FEISHU_CHAT_ID}" \
        --message "${NOTIFICATION_MESSAGE}" 2>&1; then
        echo "✅ Feishu notification sent successfully"
    else
        echo "⚠️  OpenClaw CLI failed. Notification logged to manifest."
    fi
else
    echo "⚠️  OpenClaw CLI not available. Notification logged to manifest."
fi

echo ""
echo "========================================="
echo "⏸️  Data collection complete. Waiting for agent."
echo "========================================="
echo ""
echo "Agent will:"
echo "  1. Read manifest: ${MANIFEST_FILE}"
echo "  2. Spawn ${RCA_INPUTS} sub-agents to generate RCAs"
echo "  3. Run post-workflow script to update Jira"
echo "  4. Send final Feishu summary"
echo ""
exit 0


