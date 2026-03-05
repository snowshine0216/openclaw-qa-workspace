#!/bin/bash

# RCA Automation Orchestrator
# Processes customer defects requiring RCA for Xue, Yin
# Generates RCA documents, checks automation status, updates Jira, and reports to Feishu

set -e

# Source bash_profile to load Jira token
if [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../output"
RCA_DIR="${OUTPUT_DIR}/rca"
LOG_DIR="${OUTPUT_DIR}/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="${LOG_DIR}/rca-run-${TIMESTAMP}.log"

# Create necessary directories
mkdir -p "${RCA_DIR}" "${LOG_DIR}"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

log "========================================="
log "RCA Automation Started"
log "========================================="

# Step 0: Run fetch script and get latest JSON
log "Step 0: Fetching filtered defects..."
bash "${SCRIPT_DIR}/fetch-xuyin-rca.sh" | tee -a "${LOG_FILE}"

# Find latest JSON file
LATEST_JSON=$(ls -t "${OUTPUT_DIR}"/rca-all-*.json 2>/dev/null | head -1)

if [ -z "$LATEST_JSON" ]; then
    log "ERROR: No JSON file found in ${OUTPUT_DIR}"
    exit 1
fi

log "Using JSON file: ${LATEST_JSON}"

# Extract issue keys
ISSUE_KEYS=$(jq -r '.defects[].key' "${LATEST_JSON}")
ISSUE_COUNT=$(echo "$ISSUE_KEYS" | wc -l | xargs)

log "Found ${ISSUE_COUNT} issues to process"
log ""

# Create summary file for Feishu report
SUMMARY_FILE="${OUTPUT_DIR}/feishu-summary-${TIMESTAMP}.md"
echo "# 📋 RCA Generation Summary - $(date +'%Y-%m-%d')" > "${SUMMARY_FILE}"
echo "" >> "${SUMMARY_FILE}"
echo "**Issues Processed:** ${ISSUE_COUNT}" >> "${SUMMARY_FILE}"
echo "" >> "${SUMMARY_FILE}"
echo "| Issue Key | Summary | Automated | RCA Status |" >> "${SUMMARY_FILE}"
echo "|-----------|---------|-----------|------------|" >> "${SUMMARY_FILE}"

# Process each issue
ISSUE_NUM=0
for ISSUE_KEY in $ISSUE_KEYS; do
    ISSUE_NUM=$((ISSUE_NUM + 1))
    log "========================================="
    log "Processing Issue ${ISSUE_NUM}/${ISSUE_COUNT}: ${ISSUE_KEY}"
    log "========================================="
    
    # Step 1: Fetch Jira details
    log "Step 1: Fetching Jira details for ${ISSUE_KEY}..."
    JIRA_JSON="${OUTPUT_DIR}/jira-${ISSUE_KEY}-${TIMESTAMP}.json"
    
    if jira issue view "${ISSUE_KEY}" --raw --comments 100 > "${JIRA_JSON}" 2>>"${LOG_FILE}"; then
        log "✅ Jira details fetched successfully"
    else
        log "❌ Failed to fetch Jira details for ${ISSUE_KEY}"
        echo "| [${ISSUE_KEY}](https://strategyagile.atlassian.net/browse/${ISSUE_KEY}) | Error fetching details | - | ❌ Failed |" >> "${SUMMARY_FILE}"
        continue
    fi
    
    # Extract summary
    ISSUE_SUMMARY=$(jq -r '.fields.summary // "N/A"' "${JIRA_JSON}")
    log "Summary: ${ISSUE_SUMMARY}"
    
    # Step 2: Extract GitHub PRs from comments
    log "Step 2: Extracting GitHub PRs from comments..."
    PR_URLS=$(jq -r '.fields.comment.comments[]?.body // empty' "${JIRA_JSON}" | grep -oE 'https://github\.com/[^/]+/[^/]+/pull/[0-9]+' | sort -u || echo "")
    
    if [ -z "$PR_URLS" ]; then
        log "⚠️  No GitHub PRs found in comments"
        AUTOMATION_STATUS="Unknown"
        PR_LIST="None found"
    else
        PR_COUNT=$(echo "$PR_URLS" | wc -l | xargs)
        log "Found ${PR_COUNT} GitHub PR(s)"
        
        # Step 3: Fetch PR diffs
        log "Step 3: Fetching PR diffs..."
        PR_DATA_FILE="${OUTPUT_DIR}/pr-data-${ISSUE_KEY}-${TIMESTAMP}.txt"
        > "${PR_DATA_FILE}"  # Clear file
        
        AUTOMATED_PRS=""
        
        for PR_URL in $PR_URLS; do
            # Extract owner, repo, and PR number
            REPO=$(echo "$PR_URL" | sed -E 's|https://github\.com/([^/]+/[^/]+)/pull/.*|\1|')
            PR_NUM=$(echo "$PR_URL" | sed -E 's|.*/pull/([0-9]+)|\1|')
            
            log "  Fetching PR #${PR_NUM} from ${REPO}..."
            
            # Fetch PR metadata
            if gh pr view "${PR_NUM}" --repo "${REPO}" --json title,body,headRefName > /dev/null 2>&1; then
                PR_TITLE=$(gh pr view "${PR_NUM}" --repo "${REPO}" --json title -q '.title')
                PR_BRANCH=$(gh pr view "${PR_NUM}" --repo "${REPO}" --json headRefName -q '.headRefName')
                
                echo "=== PR #${PR_NUM}: ${PR_TITLE} ===" >> "${PR_DATA_FILE}"
                echo "Branch: ${PR_BRANCH}" >> "${PR_DATA_FILE}"
                echo "URL: ${PR_URL}" >> "${PR_DATA_FILE}"
                echo "" >> "${PR_DATA_FILE}"
                
                # Step 4: Check automation status
                if echo "${PR_TITLE}${PR_BRANCH}" | grep -qi "automation"; then
                    log "  ✅ PR #${PR_NUM} contains automation"
                    AUTOMATED_PRS="${AUTOMATED_PRS}${PR_URL}\n"
                fi
                
                # Fetch diff
                log "  Fetching diff for PR #${PR_NUM}..."
                gh pr diff "${PR_NUM}" --repo "${REPO}" >> "${PR_DATA_FILE}" 2>>"${LOG_FILE}" || log "  ⚠️  Could not fetch diff"
                echo "" >> "${PR_DATA_FILE}"
                echo "===========================================" >> "${PR_DATA_FILE}"
                echo "" >> "${PR_DATA_FILE}"
            else
                log "  ❌ Failed to fetch PR #${PR_NUM}"
                echo "=== PR #${PR_NUM}: Failed to fetch ===" >> "${PR_DATA_FILE}"
                echo "URL: ${PR_URL}" >> "${PR_DATA_FILE}"
                echo "" >> "${PR_DATA_FILE}"
            fi
        done
        
        # Determine automation status
        if [ -n "$AUTOMATED_PRS" ]; then
            AUTOMATION_STATUS="Yes"
            PR_LIST=$(echo -e "$AUTOMATED_PRS" | sed '/^$/d')
        else
            AUTOMATION_STATUS="Unknown"
            PR_LIST="None with automation keywords"
        fi
    fi
    
    log "Automation Status: ${AUTOMATION_STATUS}"
    
    # Step 5: Trigger AI agent for RCA generation
    log "Step 5: Preparing data for AI agent RCA generation..."
    
    # Create input file for AI agent
    RCA_INPUT="${OUTPUT_DIR}/rca-input-${ISSUE_KEY}-${TIMESTAMP}.json"
    
    jq -n \
        --arg issue_key "$ISSUE_KEY" \
        --arg issue_summary "$ISSUE_SUMMARY" \
        --arg automation_status "$AUTOMATION_STATUS" \
        --arg pr_list "$PR_LIST" \
        --arg jira_json_path "$JIRA_JSON" \
        --arg pr_data_path "$PR_DATA_FILE" \
        --arg rca_output_path "${RCA_DIR}/${ISSUE_KEY}-rca.md" \
        '{
            issue_key: $issue_key,
            issue_summary: $issue_summary,
            automation_status: $automation_status,
            pr_list: $pr_list,
            jira_json_path: $jira_json_path,
            pr_data_path: $pr_data_path,
            rca_output_path: $rca_output_path
        }' > "${RCA_INPUT}"
    
    log "RCA input prepared: ${RCA_INPUT}"
    log "⏳ Waiting for AI agent to generate RCA..."
    log ""
    log "👉 AI Agent: Please generate RCA for ${ISSUE_KEY}"
    log "   Input file: ${RCA_INPUT}"
    log "   Expected output: ${RCA_DIR}/${ISSUE_KEY}-rca.md"
    log ""
    
    # Add to summary (RCA generation will be manual/AI-driven)
    echo "| [${ISSUE_KEY}](https://strategyagile.atlassian.net/browse/${ISSUE_KEY}) | ${ISSUE_SUMMARY:0:50}... | ${AUTOMATION_STATUS} | ⏳ Pending |" >> "${SUMMARY_FILE}"
    
    log "========================================="
    log ""
done

log "========================================="
log "RCA Automation Completed"
log "Summary file: ${SUMMARY_FILE}"
log "Log file: ${LOG_FILE}"
log "========================================="

echo ""
echo "📋 Next Steps:"
echo "1. AI agent will generate RCA documents for each issue"
echo "2. Review generated RCAs in: ${RCA_DIR}/"
echo "3. Update Jira customfield_10050 for each issue"
echo "4. Send Feishu summary from: ${SUMMARY_FILE}"
echo ""
