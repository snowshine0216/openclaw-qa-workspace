#!/bin/bash

# Post-RCA Workflow: Update Jira and Send Feishu Summary
# Run this AFTER RCA generation is complete

set -e

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly OUTPUT_DIR="${PROJECT_ROOT}/output"
readonly RCA_DIR="${OUTPUT_DIR}/rca"
readonly INTEGRATIONS_DIR="${PROJECT_ROOT}/src/integrations"
readonly UTILS_DIR="${PROJECT_ROOT}/src/utils"
readonly TIMESTAMP=$(date +%Y%m%d-%H%M%S)
readonly FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

# Global states modified by functions
RCA_UPDATED=0
RCA_COUNT=0
SUMMARY_FILE=""

update_jira_statuses() {
    echo "========================================="
    echo "Step 1: Updating Jira Latest Status"
    echo "========================================="
    echo ""

    RCA_UPDATED=0
    RCA_COUNT=0

    for rca_file in "${RCA_DIR}"/*.md; do
        if [ -f "${rca_file}" ]; then
            RCA_COUNT=$((RCA_COUNT + 1))
            local issue_key
            issue_key=$(basename "${rca_file}" | sed 's/-rca\.md$//')
            echo "Updating ${issue_key}..."
            
            if bash "${INTEGRATIONS_DIR}/update-jira-latest-status.sh" "${issue_key}" "${rca_file}"; then
                echo "✅ ${issue_key} updated"
                RCA_UPDATED=$((RCA_UPDATED + 1))
            else
                echo "❌ ${issue_key} update failed"
            fi
        fi
    done

    echo ""
    echo "Updated ${RCA_UPDATED}/${RCA_COUNT} Jira issue(s)"
    echo ""
}

generate_feishu_summary() {
    echo "========================================="
    echo "Step 2: Generating Feishu Summary"
    echo "========================================="
    echo ""

    SUMMARY_FILE="${OUTPUT_DIR}/feishu-summary-final-${TIMESTAMP}.md"

    cat > "${SUMMARY_FILE}" <<EOF
# 📋 RCA Generation Complete

**Date:** $(date '+%Y-%m-%d %H:%M UTC')

---

## Summary

**Issues Processed:** ${RCA_COUNT}

EOF

    echo "| Issue Key | Summary | Automated | Status |" >> "${SUMMARY_FILE}"
    echo "|-----------|---------|-----------|--------|" >> "${SUMMARY_FILE}"

    for rca_file in "${RCA_DIR}"/*.md; do
        if [ -f "${rca_file}" ]; then
            local issue_key
            issue_key=$(basename "${rca_file}" | sed 's/-rca\.md$//')
            
            # Extract summary from RCA (first line after Incident Summary)
            local summary
            summary=$(grep -A 3 "^## 1\. Incident Summary" "${rca_file}" | tail -1 | sed 's/^[*_-]*//' | cut -c1-60 || echo "N/A")
            
            # Extract automation status
            local automation
            automation=$(grep "^- \*\*Automated:" "${rca_file}" | sed 's/^- \*\*Automated:\*\* //' || echo "Unknown")
            
            echo "| [${issue_key}](https://strategyagile.atlassian.net/browse/${issue_key}) | ${summary}... | ${automation} | ✅ Generated |" >> "${SUMMARY_FILE}"
        fi
    done

    cat >> "${SUMMARY_FILE}" <<EOF

---

## Actions Completed

✅ Generated ${RCA_COUNT} RCA documents
✅ Updated Jira Latest Status for ${RCA_UPDATED} issues
✅ RCA files saved to: \`projects/rca-daily/output/rca/\`

---

**Generated:** $(date '+%Y-%m-%d %H:%M UTC')
**By:** QA Daily Check Agent (Atlas Daily)
EOF

    echo "Summary generated: ${SUMMARY_FILE}"
    echo ""
}

send_feishu_notification() {
    echo "========================================="
    echo "📤 Step 3: Sending Feishu Notification"
    echo "========================================="
    echo ""

    if [ -f "${UTILS_DIR}/send-feishu-notification.js" ]; then
        nvm use default
        node "${UTILS_DIR}/send-feishu-notification.js" "${SUMMARY_FILE}" "${FEISHU_CHAT_ID}" || echo "⚠️  Feishu notification failed (will log instead)"
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
}

main() {
    echo "========================================="
    echo "Post-RCA Workflow - $(date)"
    echo "========================================="
    echo ""

    update_jira_statuses
    generate_feishu_summary
    send_feishu_notification
}

main "$@"
