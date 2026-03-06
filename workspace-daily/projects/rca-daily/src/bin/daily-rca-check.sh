#!/bin/bash

# Daily RCA Check - Runs at 8 AM Asia/Shanghai (randomized ±30 min)
# Fetches all defects requiring RCA and sends summary to Feishu

set -e

# Global Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly OUTPUT_DIR="${PROJECT_ROOT}/output"
readonly FETCHERS_DIR="${PROJECT_ROOT}/src/fetchers"
readonly LOG_DIR="${OUTPUT_DIR}/logs"
readonly LOG_FILE="${LOG_DIR}/daily-rca-check-$(date +%Y%m%d).log"
readonly FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"

setup_directories() {
    mkdir -p "${LOG_DIR}"
}

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

fetch_defects() {
    log "Fetching defects requiring RCA..."
    bash "${FETCHERS_DIR}/fetch-rca.sh" 2>&1 | tee -a "${LOG_FILE}"
}

get_latest_json() {
    local latest_json
    latest_json=$(ls -t "${OUTPUT_DIR}"/rca-all-*.json 2>/dev/null | head -1)

    if [ -z "${latest_json}" ]; then
        log "ERROR: No JSON file found"
        exit 1
    fi
    echo "${latest_json}"
}

generate_summary() {
    local latest_json="$1"
    
    local total_count
    total_count=$(jq '.defects | length' "${latest_json}")
    log "Total defects requiring RCA: ${total_count}"

    local owner_summary
    owner_summary=$(jq -r '.defects | group_by(.proposed_owner) | map({owner: .[0].proposed_owner, count: length}) | sort_by(-.count) | .[] | "\(.owner): \(.count)"' "${latest_json}")

    log ""
    log "Summary by Owner:"
    echo "${owner_summary}" | while read -r line; do
        log "  ${line}"
    done

    local summary_file="${OUTPUT_DIR}/feishu-daily-summary-$(date +%Y%m%d).md"

    cat > "${summary_file}" <<EOF
# 📋 Daily RCA Check - $(date '+%Y-%m-%d')

**Total Defects Requiring RCA:** ${total_count}

---

## Summary by Owner

\`\`\`
${owner_summary}
\`\`\`

---

## Top 10 Issues

EOF

    jq -r '.defects[0:10] | .[] | "- [\(.key)](\(.url)) - \(.summary) (Owner: \(.proposed_owner))"' "${latest_json}" >> "${summary_file}"

    cat >> "${summary_file}" <<EOF

---

**Data Source:** API (status=completed, limit=500)  
**Filter:** category = "requires_rca"  
**Generated:** $(date '+%Y-%m-%d %H:%M Asia/Shanghai')
EOF

    log ""
    log "Summary generated: ${summary_file}"
    
    # Return path for caller
    echo "${summary_file}"
}

trigger_feishu_notification() {
    local summary_file="$1"
    
    log "Sending summary to Feishu..."
    log "Summary saved for Feishu notification"
    log "Chat ID: ${FEISHU_CHAT_ID}"
    log "Summary file: ${summary_file}"

    # Output summary for wrapper scripts/OpenClaw to capture
    echo "FEISHU_NOTIFICATION_REQUIRED"
    echo "CHAT_ID:${FEISHU_CHAT_ID}"
    echo "SUMMARY_FILE:${summary_file}"
}

main() {
    setup_directories
    
    log "========================================="
    log "Daily RCA Check Started"
    log "========================================="

    fetch_defects
    
    local latest_json
    latest_json=$(get_latest_json)
    log "Using JSON file: ${latest_json}"
    
    local summary_file
    summary_file=$(generate_summary "${latest_json}")
    
    trigger_feishu_notification "${summary_file}"

    log ""
    log "========================================="
    log "Daily RCA Check Completed"
    log "========================================="
}

main "$@"
