#!/bin/bash

# RCA Automation Orchestrator
# Processes customer defects requiring RCA for Xue, Yin
# Generates RCA documents, checks automation status, updates Jira, and reports to Feishu

set -e

# Source bash_profile to load Jira token
if [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly OUTPUT_DIR="${PROJECT_ROOT}/output"
readonly RCA_DIR="${OUTPUT_DIR}/rca"
readonly LOG_DIR="${OUTPUT_DIR}/logs"
readonly FETCHERS_DIR="${PROJECT_ROOT}/src/fetchers"
readonly TIMESTAMP=$(date +%Y%m%d-%H%M%S)
readonly LOG_FILE="${LOG_DIR}/rca-run-${TIMESTAMP}.log"

setup_directories() {
    mkdir -p "${RCA_DIR}" "${LOG_DIR}"
}

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

fetch_initial_data() {
    log "Step 0: Fetching filtered defects..."
    bash "${FETCHERS_DIR}/fetch-xuyin-rca.sh" | tee -a "${LOG_FILE}"
    
    local latest_json
    latest_json=$(ls -t "${OUTPUT_DIR}"/rca-all-*.json 2>/dev/null | head -1 || true)
    
    if [ -z "${latest_json}" ]; then
        log "ERROR: No JSON file found in ${OUTPUT_DIR}"
        exit 1
    fi
    
    log "Using JSON file: ${latest_json}"
    
    # Return string path
    echo "${latest_json}"
}

initialize_summary_file() {
    local issue_count="$1"
    local summary_file="${OUTPUT_DIR}/feishu-summary-${TIMESTAMP}.md"
    
    echo "# 📋 RCA Generation Summary - $(date +'%Y-%m-%d')" > "${summary_file}"
    echo "" >> "${summary_file}"
    echo "**Issues Processed:** ${issue_count}" >> "${summary_file}"
    echo "" >> "${summary_file}"
    echo "| Issue Key | Summary | Automated | RCA Status |" >> "${summary_file}"
    echo "|-----------|---------|-----------|------------|" >> "${summary_file}"
    
    echo "${summary_file}"
}

fetch_jira_details() {
    local issue_key="$1"
    local jira_json="${OUTPUT_DIR}/jira-${issue_key}-${TIMESTAMP}.json"
    
    if jira issue view "${issue_key}" --raw --comments 100 > "${jira_json}" 2>>"${LOG_FILE}"; then
        log "✅ Jira details fetched successfully"
        echo "${jira_json}"
    else
        log "❌ Failed to fetch Jira details for ${issue_key}"
        echo "ERROR"
    fi
}

process_pull_requests() {
    local issue_key="$1"
    local pr_urls="$2"
    
    local pr_data_file="${OUTPUT_DIR}/pr-data-${issue_key}-${TIMESTAMP}.txt"
    > "${pr_data_file}"  # Clear file
    
    local automated_prs=""
    
    for pr_url in ${pr_urls}; do
        # Extract owner, repo, and PR number
        local repo
        repo=$(echo "${pr_url}" | sed -E 's|https://github\.com/([^/]+/[^/]+)/pull/.*|\1|')
        local pr_num
        pr_num=$(echo "${pr_url}" | sed -E 's|.*/pull/([0-9]+)|\1|')
        
        log "  Fetching PR #${pr_num} from ${repo}..."
        
        # Fetch PR metadata
        if gh pr view "${pr_num}" --repo "${repo}" --json title,body,headRefName > /dev/null 2>&1; then
            local pr_title
            pr_title=$(gh pr view "${pr_num}" --repo "${repo}" --json title -q '.title')
            local pr_branch
            pr_branch=$(gh pr view "${pr_num}" --repo "${repo}" --json headRefName -q '.headRefName')
            
            echo "=== PR #${pr_num}: ${pr_title} ===" >> "${pr_data_file}"
            echo "Branch: ${pr_branch}" >> "${pr_data_file}"
            echo "URL: ${pr_url}" >> "${pr_data_file}"
            echo "" >> "${pr_data_file}"
            
            # Step 4: Check automation status
            if echo "${pr_title}${pr_branch}" | grep -qi "automation"; then
                log "  ✅ PR #${pr_num} contains automation"
                automated_prs="${automated_prs}${pr_url}\n"
            fi
            
            # Fetch diff
            log "  Fetching diff for PR #${pr_num}..."
            gh pr diff "${pr_num}" --repo "${repo}" >> "${pr_data_file}" 2>>"${LOG_FILE}" || log "  ⚠️  Could not fetch diff"
            echo "" >> "${pr_data_file}"
            echo "===========================================" >> "${pr_data_file}"
            echo "" >> "${pr_data_file}"
        else
            log "  ❌ Failed to fetch PR #${pr_num}"
            echo "=== PR #${pr_num}: Failed to fetch ===" >> "${pr_data_file}"
            echo "URL: ${pr_url}" >> "${pr_data_file}"
            echo "" >> "${pr_data_file}"
        fi
    done
    
    # Return automated_prs list and output diff file path as comma separated
    echo "${automated_prs},${pr_data_file}"
}

create_rca_input() {
    local issue_key="$1"
    local issue_summary="$2"
    local automation_status="$3"
    local pr_list="$4"
    local jira_json="$5"
    local pr_data_file="$6"
    
    local rca_input="${OUTPUT_DIR}/rca-input-${issue_key}-${TIMESTAMP}.json"
    local rca_output_path="${RCA_DIR}/${issue_key}-rca.md"
    
    jq -n \
        --arg issue_key "${issue_key}" \
        --arg issue_summary "${issue_summary}" \
        --arg automation_status "${automation_status}" \
        --arg pr_list "${pr_list}" \
        --arg jira_json_path "${jira_json}" \
        --arg pr_data_path "${pr_data_file}" \
        --arg rca_output_path "${rca_output_path}" \
        '{
            issue_key: $issue_key,
            issue_summary: $issue_summary,
            automation_status: $automation_status,
            pr_list: $pr_list,
            jira_json_path: $jira_json_path,
            pr_data_path: $pr_data_path,
            rca_output_path: $rca_output_path
        }' > "${rca_input}"
        
    log "RCA input prepared: ${rca_input}"
    log "⏳ Waiting for AI agent to generate RCA..."
    log ""
    log "👉 AI Agent: Please generate RCA for ${issue_key}"
    log "   Input file: ${rca_input}"
    log "   Expected output: ${rca_output_path}"
    log ""
}

process_issues() {
    local latest_json="$1"
    
    local issue_keys
    issue_keys=$(jq -r '.defects[].key' "${latest_json}")
    local issue_count
    issue_count=$(echo "${issue_keys}" | wc -l | xargs || echo "0")
    
    log "Found ${issue_count} issues to process"
    log ""
    
    local summary_file
    summary_file=$(initialize_summary_file "${issue_count}")
    
    local issue_num=0
    for issue_key in ${issue_keys}; do
        issue_num=$((issue_num + 1))
        log "========================================="
        log "Processing Issue ${issue_num}/${issue_count}: ${issue_key}"
        log "========================================="
        
        # Step 1: Fetch Jira details
        log "Step 1: Fetching Jira details for ${issue_key}..."
        
        local jira_json
        jira_json=$(fetch_jira_details "${issue_key}")
        
        if [ "${jira_json}" = "ERROR" ]; then
            echo "| [${issue_key}](https://strategyagile.atlassian.net/browse/${issue_key}) | Error fetching details | - | ❌ Failed |" >> "${summary_file}"
            continue
        fi
        
        local issue_summary
        issue_summary=$(jq -r '.fields.summary // "N/A"' "${jira_json}")
        log "Summary: ${issue_summary}"
        
        # Step 2: Extract GitHub PRs from comments
        log "Step 2: Extracting GitHub PRs from comments..."
        local pr_urls
        pr_urls=$(jq -r '.fields.comment.comments[]?.body // empty' "${jira_json}" | grep -oE 'https://github\.com/[^/]+/[^/]+/pull/[0-9]+' | sort -u || echo "")
        
        local automation_status="Unknown"
        local pr_list="None found"
        local pr_data_file="${OUTPUT_DIR}/pr-data-${issue_key}-${TIMESTAMP}.txt"
        
        if [ -z "${pr_urls}" ]; then
            log "⚠️  No GitHub PRs found in comments"
            > "${pr_data_file}" # empty placeholder
        else
            local pr_count
            pr_count=$(echo "${pr_urls}" | wc -l | xargs || echo "0")
            log "Found ${pr_count} GitHub PR(s)"
            
            # Step 3 & 4: Fetch diffs & Check Automation Status
            log "Step 3: Fetching PR diffs..."
            
            local pr_result
            pr_result=$(process_pull_requests "${issue_key}" "${pr_urls}")
            
            local automated_prs
            automated_prs=$(echo "${pr_result}" | cut -d',' -f1)
            pr_data_file=$(echo "${pr_result}" | cut -d',' -f2)
            
            if [ -n "${automated_prs}" ]; then
                automation_status="Yes"
                pr_list=$(echo -e "${automated_prs}" | sed '/^$/d')
            else
                automation_status="Unknown"
                pr_list="None with automation keywords"
            fi
        fi
        
        log "Automation Status: ${automation_status}"
        
        # Step 5: Trigger AI agent for RCA generation
        log "Step 5: Preparing data for AI agent RCA generation..."
        
        create_rca_input "${issue_key}" "${issue_summary}" "${automation_status}" "${pr_list}" "${jira_json}" "${pr_data_file}"
        
        # Add to summary (RCA generation will be manual/AI-driven)
        echo "| [${issue_key}](https://strategyagile.atlassian.net/browse/${issue_key}) | ${issue_summary:0:50}... | ${automation_status} | ⏳ Pending |" >> "${summary_file}"
        
        log "========================================="
        log ""
    done
    
    echo "${summary_file}"
}

print_next_steps() {
    local summary_file="$1"
    
    log "========================================="
    log "RCA Automation Completed"
    log "Summary file: ${summary_file}"
    log "Log file: ${LOG_FILE}"
    log "========================================="

    echo ""
    echo "📋 Next Steps:"
    echo "1. AI agent will generate RCA documents for each issue"
    echo "2. Review generated RCAs in: ${RCA_DIR}/"
    echo "3. Update Jira customfield_10050 for each issue"
    echo "4. Send Feishu summary from: ${summary_file}"
    echo ""
}

main() {
    setup_directories
    
    log "========================================="
    log "RCA Automation Started"
    log "========================================="

    local latest_json
    latest_json=$(fetch_initial_data)

    local summary_file
    # Getting only the last string output line in case of debug warnings
    summary_file=$(process_issues "${latest_json}" | tail -n 1)

    print_next_steps "${summary_file}"
}

main "$@"
