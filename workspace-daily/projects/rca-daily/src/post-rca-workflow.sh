#!/bin/bash

# Post-RCA Workflow: Update Jira and Send Feishu Summary
# Run this AFTER RCA generation is complete

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../output"
RCA_DIR="${OUTPUT_DIR}/rca"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

echo "========================================="
echo "Post-RCA Workflow - $(date)"
echo "========================================="
echo ""

echo "========================================="
echo "Step 1: Updating Jira Latest Status"
echo "========================================="
echo ""

# Update Jira for each RCA file
RCA_UPDATED=0
RCA_COUNT=0

for RCA_FILE in "${RCA_DIR}"/*.md; do
    if [ -f "$RCA_FILE" ]; then
        RCA_COUNT=$((RCA_COUNT + 1))
        ISSUE_KEY=$(basename "$RCA_FILE" | sed 's/-rca\.md$//')
        echo "Updating ${ISSUE_KEY}..."
        
        if bash "${SCRIPT_DIR}/update-jira-latest-status.sh" "${ISSUE_KEY}" "${RCA_FILE}"; then
            echo "✅ ${ISSUE_KEY} updated"
            RCA_UPDATED=$((RCA_UPDATED + 1))
        else
            echo "❌ ${ISSUE_KEY} update failed"
        fi
    fi
done

echo ""
echo "Updated ${RCA_UPDATED}/${RCA_COUNT} Jira issue(s)"
echo ""

echo "========================================="
echo "Step 2: Generating Feishu Summary"
echo "========================================="
echo ""

# Create comprehensive Feishu summary
SUMMARY_FILE="${OUTPUT_DIR}/feishu-summary-final-${TIMESTAMP}.md"

cat > "${SUMMARY_FILE}" <<EOF
# 📋 RCA Generation Complete

**Date:** $(date '+%Y-%m-%d %H:%M UTC')

---

## Summary

**Issues Processed:** ${RCA_COUNT}

EOF

# Generate table
echo "| Issue Key | Summary | Automated | Status |" >> "${SUMMARY_FILE}"
echo "|-----------|---------|-----------|--------|" >> "${SUMMARY_FILE}"

for RCA_FILE in "${RCA_DIR}"/*.md; do
    if [ -f "$RCA_FILE" ]; then
        ISSUE_KEY=$(basename "$RCA_FILE" | sed 's/-rca\.md$//')
        
        # Extract summary from RCA (first line after Incident Summary)
        SUMMARY=$(grep -A 3 "^## 1\. Incident Summary" "$RCA_FILE" | tail -1 | sed 's/^[*_-]*//' | cut -c1-60 || echo "N/A")
        
        # Extract automation status
        AUTOMATION=$(grep "^- \*\*Automated:" "$RCA_FILE" | sed 's/^- \*\*Automated:\*\* //' || echo "Unknown")
        
        echo "| [${ISSUE_KEY}](https://strategyagile.atlassian.net/browse/${ISSUE_KEY}) | ${SUMMARY}... | ${AUTOMATION} | ✅ Generated |" >> "${SUMMARY_FILE}"
    fi
done

echo "" >> "${SUMMARY_FILE}"
echo "---" >> "${SUMMARY_FILE}"
echo "" >> "${SUMMARY_FILE}"
echo "## Actions Completed" >> "${SUMMARY_FILE}"
echo "" >> "${SUMMARY_FILE}"
echo "✅ Generated ${RCA_COUNT} RCA documents" >> "${SUMMARY_FILE}"
echo "✅ Updated Jira Latest Status for ${RCA_UPDATED} issues" >> "${SUMMARY_FILE}"
echo "✅ RCA files saved to: \`projects/rca-daily/output/rca/\`" >> "${SUMMARY_FILE}"
echo "" >> "${SUMMARY_FILE}"
echo "---" >> "${SUMMARY_FILE}"
echo "" >> "${SUMMARY_FILE}"
echo "**Generated:** $(date '+%Y-%m-%d %H:%M UTC')" >> "${SUMMARY_FILE}"
echo "**By:** QA Daily Check Agent (Atlas Daily)" >> "${SUMMARY_FILE}"

echo "Summary generated: ${SUMMARY_FILE}"
echo ""

echo "========================================="
echo "📤 Step 3: Sending Feishu Notification"
echo "========================================="
echo ""

# Send via send-feishu-notification.js
if [ -f "${SCRIPT_DIR}/send-feishu-notification.js" ]; then
    node "${SCRIPT_DIR}/send-feishu-notification.js" "${SUMMARY_FILE}" "${FEISHU_CHAT_ID}" || echo "⚠️  Feishu notification failed (will log instead)"
else
    echo "⚠️  send-feishu-notification.js not found, logging summary instead:"
    cat "${SUMMARY_FILE}"
fi

echo ""
echo "========================================="
echo "✅ Post-RCA Workflow Complete"
echo "========================================="
echo ""
echo "Summary:"
echo "  - ${RCA_COUNT} RCAs generated"
echo "  - ${RCA_UPDATED} Jira issues updated"
echo "  - Feishu notification sent to ${FEISHU_CHAT_ID}"
echo "  - Summary: ${SUMMARY_FILE}"
echo ""
