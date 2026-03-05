#!/bin/bash

# Daily RCA Check - Runs at 8 AM Asia/Shanghai (randomized ±30 min)
# Fetches all defects requiring RCA and sends summary to Feishu

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../output"
LOG_FILE="${OUTPUT_DIR}/logs/daily-rca-check-$(date +%Y%m%d).log"

mkdir -p "${OUTPUT_DIR}/logs"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

log "========================================="
log "Daily RCA Check Started"
log "========================================="

# Step 1: Fetch all defects requiring RCA
log "Fetching defects requiring RCA..."
bash "${SCRIPT_DIR}/fetch-rca.sh" 2>&1 | tee -a "${LOG_FILE}"

# Find latest JSON file
LATEST_JSON=$(ls -t "${OUTPUT_DIR}"/rca-all-*.json 2>/dev/null | head -1)

if [ -z "$LATEST_JSON" ]; then
    log "ERROR: No JSON file found"
    exit 1
fi

log "Using JSON file: ${LATEST_JSON}"

# Count defects
TOTAL_COUNT=$(jq '.defects | length' "${LATEST_JSON}")
log "Total defects requiring RCA: ${TOTAL_COUNT}"

# Group by proposed_owner
OWNER_SUMMARY=$(jq -r '.defects | group_by(.proposed_owner) | map({owner: .[0].proposed_owner, count: length}) | sort_by(-.count) | .[] | "\(.owner): \(.count)"' "${LATEST_JSON}")

log ""
log "Summary by Owner:"
echo "$OWNER_SUMMARY" | while read line; do
    log "  $line"
done

# Create Feishu summary
SUMMARY_FILE="${OUTPUT_DIR}/feishu-daily-summary-$(date +%Y%m%d).md"

cat > "${SUMMARY_FILE}" <<EOF
# 📋 Daily RCA Check - $(date '+%Y-%m-%d')

**Total Defects Requiring RCA:** ${TOTAL_COUNT}

---

## Summary by Owner

\`\`\`
${OWNER_SUMMARY}
\`\`\`

---

## Top 10 Issues

EOF

# Add top 10 issues
jq -r '.defects[0:10] | .[] | "- [\(.key)](\(.url)) - \(.summary) (Owner: \(.proposed_owner))"' "${LATEST_JSON}" >> "${SUMMARY_FILE}"

cat >> "${SUMMARY_FILE}" <<EOF

---

**Data Source:** API (status=completed, limit=500)  
**Filter:** category = "requires_rca"  
**Generated:** $(date '+%Y-%m-%d %H:%M Asia/Shanghai')
EOF

log ""
log "Summary generated: ${SUMMARY_FILE}"

# Send to Feishu
log "Sending summary to Feishu..."

FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

# Read summary content
SUMMARY_CONTENT=$(cat "${SUMMARY_FILE}")

# Use OpenClaw to send message (assuming this is called from OpenClaw context)
# For cron context, we'll save the summary and log the path
log "Summary saved for Feishu notification"
log "Chat ID: ${FEISHU_CHAT_ID}"
log "Summary file: ${SUMMARY_FILE}"

log ""
log "========================================="
log "Daily RCA Check Completed"
log "========================================="

# Output summary for OpenClaw to capture and send
echo "FEISHU_NOTIFICATION_REQUIRED"
echo "CHAT_ID:${FEISHU_CHAT_ID}"
echo "SUMMARY_FILE:${SUMMARY_FILE}"
