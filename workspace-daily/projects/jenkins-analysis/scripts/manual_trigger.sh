#!/bin/bash
# Manual Trigger - Manually analyze a specific Jenkins build

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Usage
if [ $# -lt 2 ]; then
    echo "Usage: bash manual_trigger.sh <job_name> <build_number>"
    echo ""
    echo "Examples:"
    echo "  bash manual_trigger.sh Tanzu_Report_Env_Upgrade 663"
    echo "  bash manual_trigger.sh TanzuEnvPrepare 123"
    echo ""
    echo "This will:"
    echo "  1. Trigger the webhook"
    echo "  2. Start analysis in background"
    echo "  3. Generate report"
    echo "  4. Upload to Feishu"
    exit 1
fi

JOB_NAME="$1"
BUILD_NUMBER="$2"

echo "=========================================="
echo "Manual Trigger"
echo "Job: $JOB_NAME"
echo "Build: #$BUILD_NUMBER"
echo "=========================================="
echo ""

# Trigger webhook
echo "Triggering webhook..."
RESPONSE=$(curl -s -X POST http://localhost:9090/webhook \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$JOB_NAME\",
        \"build\": {
            \"number\": $BUILD_NUMBER,
            \"status\": \"SUCCESS\",
            \"phase\": \"COMPLETED\"
        }
    }")

echo "Response: $RESPONSE"
echo ""

# Check if webhook server is running
if echo "$RESPONSE" | grep -q "ok"; then
    echo "✓ Webhook triggered successfully!"
    echo ""
    echo "Monitor progress:"
    echo "  1. Webhook log: tail -f $SCRIPT_DIR/../logs/webhook.log"
    echo "  2. Analyzer log: tail -f $SCRIPT_DIR/../logs/analyzer_${JOB_NAME}_${BUILD_NUMBER}.log"
    echo "  3. Heartbeat: cat $SCRIPT_DIR/../tmp/heartbeat_${JOB_NAME}_${BUILD_NUMBER}.txt"
    echo ""
    echo "Report will be saved to:"
    echo "  $SCRIPT_DIR/../reports/${JOB_NAME}_${BUILD_NUMBER}/${JOB_NAME}_${BUILD_NUMBER}.docx"
    echo ""
    echo "Feishu delivery: Check chat (oc_f15b73b877ad243886efaa1e99018807)"
else
    echo "✗ Webhook server not responding!"
    echo "  Start it with: pm2 start webhook_server.js --name jenkins-webhook"
    exit 1
fi
