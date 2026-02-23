#!/bin/bash
# Jenkins Poller - Alternative to webhook plugin
# Polls Jenkins for build completions and triggers analysis

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JENKINS_URL="http://tec-l-1081462.labs.microstrategy.com:8080/"
JENKINS_USER="admin"
JENKINS_API_TOKEN="11596241e9625bf6e48aca51bf0af0a036"
STATE_FILE="$SCRIPT_DIR/../tmp/poller_state.json"
POLL_INTERVAL=60  # seconds

# Jobs to watch
WATCHED_JOBS=(
  "Tanzu_Report_Env_Upgrade"
  "TanzuEnvPrepare"
)

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Initialize state file
if [ ! -f "$STATE_FILE" ]; then
    echo "{}" > "$STATE_FILE"
fi

# Get last seen build number for a job
get_last_seen_build() {
    local job_name="$1"
    jq -r --arg job "$job_name" '.[$job] // 0' "$STATE_FILE"
}

# Update last seen build number
update_last_seen_build() {
    local job_name="$1"
    local build_number="$2"
    local temp_file="$STATE_FILE.tmp"
    jq --arg job "$job_name" --arg build "$build_number" '.[$job] = $build' "$STATE_FILE" > "$temp_file"
    mv "$temp_file" "$STATE_FILE"
}

# Check job for new builds
check_job() {
    local job_name="$1"
    
    log "Checking $job_name..."
    
    # Get latest build info
    local build_info=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$job_name/lastBuild/api/json?tree=number,result,building")
    
    if [ -z "$build_info" ] || [ "$build_info" = "null" ]; then
        log "  ⚠ Could not fetch build info for $job_name"
        return
    fi
    
    local build_number=$(echo "$build_info" | jq -r '.number')
    local build_result=$(echo "$build_info" | jq -r '.result')
    local is_building=$(echo "$build_info" | jq -r '.building')
    
    # Get last seen build
    local last_seen=$(get_last_seen_build "$job_name")
    
    log "  Current build: #$build_number (result: $build_result, building: $is_building)"
    log "  Last seen: #$last_seen"
    
    # Check if this is a new completed build
    if [ "$build_number" != "$last_seen" ] && [ "$is_building" = "false" ] && [ "$build_result" != "null" ]; then
        log "  ✓ New completed build detected: #$build_number"
        
        # Trigger webhook
        curl -s -X POST http://localhost:9090/webhook \
            -H "Content-Type: application/json" \
            -d "{
                \"name\": \"$job_name\",
                \"build\": {
                    \"number\": $build_number,
                    \"status\": \"$build_result\",
                    \"phase\": \"COMPLETED\"
                }
            }" > /dev/null
        
        log "  → Webhook triggered for $job_name #$build_number"
        
        # Update state
        update_last_seen_build "$job_name" "$build_number"
    else
        log "  → No new builds"
    fi
}

log "=========================================="
log "Jenkins Poller Started"
log "Poll interval: ${POLL_INTERVAL}s"
log "Watched jobs: ${WATCHED_JOBS[*]}"
log "=========================================="

# Main polling loop
while true; do
    for job_name in "${WATCHED_JOBS[@]}"; do
        check_job "$job_name"
    done
    
    log "Sleeping ${POLL_INTERVAL}s..."
    sleep "$POLL_INTERVAL"
done
