#!/bin/bash
# Main Analysis Script - Triggered by webhook
# Arguments: $1 = job_name, $2 = build_number

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$PROJECT_DIR/tmp"
REPORTS_DIR="$PROJECT_DIR/reports"
JENKINS_URL="http://tec-l-1081462.labs.microstrategy.com:8080/"
JENKINS_USER="admin"
JENKINS_API_TOKEN="11596241e9625bf6e48aca51bf0af0a036"
FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"
TIMEOUT_MINUTES=120

# Parse arguments
JOB_NAME="$1"
BUILD_NUMBER="$2"
REPORT_FOLDER="${JOB_NAME}_${BUILD_NUMBER}"
REPORT_DIR="$REPORTS_DIR/$REPORT_FOLDER"

# Logging
LOG_FILE="$TMP_DIR/analyzer_${JOB_NAME}_${BUILD_NUMBER}.log"
exec > >(tee -a "$LOG_FILE") 2>&1

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "=========================================="
log "Analysis started for $JOB_NAME #$BUILD_NUMBER"
log "Report folder: $REPORT_FOLDER"
log "=========================================="

# Step 1: Check if report already exists
if [ -f "$REPORT_DIR/jenkins_daily_report.docx" ]; then
    log "✓ Report already exists for $REPORT_FOLDER"
    log "Sending existing report to Feishu..."
    bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/jenkins_daily_report.docx"
    log "✓ Existing report sent successfully"
    exit 0
fi

# Step 2: Create report directory
mkdir -p "$REPORT_DIR"
log "✓ Created report directory: $REPORT_DIR"

# Step 3: Register heartbeat
HEARTBEAT_FILE="$TMP_DIR/heartbeat_${JOB_NAME}_${BUILD_NUMBER}.txt"
echo "$(date '+%s')" > "$HEARTBEAT_FILE"
log "✓ Heartbeat registered"

# Heartbeat update function
update_heartbeat() {
    local message="$1"
    echo "$(date '+%s')|$message" > "$HEARTBEAT_FILE"
    log "💓 Heartbeat: $message"
}

# Step 4: Get downstream jobs triggered by this build
update_heartbeat "Fetching downstream jobs..."
log "Fetching downstream jobs for $JOB_NAME #$BUILD_NUMBER..."

DOWNSTREAM_JOBS=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
    "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/api/json?tree=downstreamProjects[name]" \
    | jq -r '.downstreamProjects[]?.name // empty')

if [ -z "$DOWNSTREAM_JOBS" ]; then
    log "⚠ No downstream jobs found - checking triggered builds..."
    # Alternative: check build log for triggered jobs
    DOWNSTREAM_JOBS=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/consoleText" \
        | grep -oP 'Starting building: \K[^\s]+' \
        | sed 's/#.*//' | sort -u || echo "")
fi

if [ -z "$DOWNSTREAM_JOBS" ]; then
    log "✗ ERROR: Could not find any downstream jobs"
    update_heartbeat "ERROR: No downstream jobs found"
    exit 1
fi

TOTAL_JOBS=$(echo "$DOWNSTREAM_JOBS" | wc -l)
log "✓ Found $TOTAL_JOBS downstream jobs to analyze"
echo "$DOWNSTREAM_JOBS" > "$TMP_DIR/${REPORT_FOLDER}_downstream_jobs.txt"

# Step 5: Fetch job statuses
update_heartbeat "Fetching job statuses (0/$TOTAL_JOBS)..."
log "Fetching job statuses..."

FAILED_JOBS="[]"
PASSED_JOBS="[]"
COUNTER=0

while IFS= read -r job_name; do
    COUNTER=$((COUNTER + 1))
    
    # Update heartbeat every job
    if [ $((COUNTER % 5)) -eq 0 ]; then
        update_heartbeat "Fetching statuses ($COUNTER/$TOTAL_JOBS)..."
    fi
    
    log "[$COUNTER/$TOTAL_JOBS] Checking: $job_name"
    
    JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$job_name/lastBuild/api/json?tree=number,result,timestamp,duration" || echo "{}")
    
    JOB_NUMBER=$(echo "$JOB_INFO" | jq -r '.number // "N/A"')
    JOB_RESULT=$(echo "$JOB_INFO" | jq -r '.result // "UNKNOWN"')
    
    if [ "$JOB_RESULT" = "FAILURE" ] || [ "$JOB_RESULT" = "UNSTABLE" ]; then
        FAILED_JOBS=$(echo "$FAILED_JOBS" | jq --arg name "$job_name" --arg num "$JOB_NUMBER" \
            '. += [{"name": $name, "number": $num}]')
        log "  ❌ FAILED: $job_name #$JOB_NUMBER"
    elif [ "$JOB_RESULT" = "SUCCESS" ]; then
        PASSED_JOBS=$(echo "$PASSED_JOBS" | jq --arg name "$job_name" --arg num "$JOB_NUMBER" \
            '. += [{"name": $name, "number": $num}]')
        log "  ✅ PASSED: $job_name #$JOB_NUMBER"
    fi
done <<< "$DOWNSTREAM_JOBS"

echo "$FAILED_JOBS" > "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json"
echo "$PASSED_JOBS" > "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json"

FAILED_COUNT=$(echo "$FAILED_JOBS" | jq 'length')
PASSED_COUNT=$(echo "$PASSED_JOBS" | jq 'length')

log "✓ Status check complete: $FAILED_COUNT failed, $PASSED_COUNT passed"

# Step 6: Analyze failed jobs
if [ "$FAILED_COUNT" -gt 0 ]; then
    update_heartbeat "Analyzing failures (0/$FAILED_COUNT)..."
    log "Analyzing failed jobs..."
    
    ANALYSIS_COUNTER=0
    echo "$FAILED_JOBS" | jq -c '.[]' | while read -r job; do
        ANALYSIS_COUNTER=$((ANALYSIS_COUNTER + 1))
        
        # Update heartbeat every 5 minutes worth of work
        if [ $((ANALYSIS_COUNTER % 3)) -eq 0 ]; then
            update_heartbeat "Analyzing failures ($ANALYSIS_COUNTER/$FAILED_COUNT)..."
        fi
        
        JOB_NAME_F=$(echo "$job" | jq -r '.name')
        JOB_NUM_F=$(echo "$job" | jq -r '.number')
        
        log "[$ANALYSIS_COUNTER/$FAILED_COUNT] Analyzing: $JOB_NAME_F #$JOB_NUM_F"
        
        # Call Jenkins skill to get console log
        node "$SCRIPT_DIR/../../../skills/jenkins/scripts/jenkins.mjs" console \
            --job "$JOB_NAME_F" \
            --build "$JOB_NUM_F" \
            --tail 200 \
            > "$REPORT_DIR/${JOB_NAME_F}_${JOB_NUM_F}_console.json"
        
        # Generate analysis (placeholder - will use AI)
        log "  → Console log saved"
    done
fi

# Step 7: Generate consolidated report
update_heartbeat "Generating report..."
log "Generating consolidated report..."

node "$SCRIPT_DIR/report_generator.js" \
    "$REPORT_FOLDER" \
    "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json" \
    "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json" \
    "$REPORT_DIR"

log "✓ Report generated"

# Step 8: Convert to DOCX
update_heartbeat "Converting to DOCX..."
log "Converting markdown to DOCX..."

node "$SCRIPT_DIR/md_to_docx.js" \
    "$REPORT_DIR/jenkins_daily_report.md" \
    "$REPORT_DIR/jenkins_daily_report.docx"

log "✓ DOCX created"

# Step 9: Upload to Feishu
update_heartbeat "Uploading to Feishu..."
log "Uploading report to Feishu..."

bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/jenkins_daily_report.docx"

log "✓ Report uploaded to Feishu"

# Step 10: Cleanup
rm -f "$HEARTBEAT_FILE"
log "✓ Heartbeat cleared"

log "=========================================="
log "Analysis complete for $JOB_NAME #$BUILD_NUMBER"
log "Report saved to: $REPORT_DIR"
log "=========================================="
