#!/bin/bash
# Main Analysis Script - Triggered by webhook
# Arguments: $1 = job_name, $2 = build_number

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$PROJECT_DIR/tmp"
LOGS_DIR="$PROJECT_DIR/logs"
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
mkdir -p "$LOGS_DIR"
LOG_FILE="$LOGS_DIR/analyzer_${JOB_NAME}_${BUILD_NUMBER}.log"
exec > >(tee -a "$LOG_FILE") 2>&1

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "=========================================="
log "Analysis started for $JOB_NAME #$BUILD_NUMBER"
log "Report folder: $REPORT_FOLDER"
log "=========================================="

# Step 1: Check if report already exists
if [ -f "$REPORT_DIR/${REPORT_FOLDER}.docx" ]; then
    log "✓ Report already exists for $REPORT_FOLDER"
    log "Sending existing report to Feishu..."
    bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/${REPORT_FOLDER}.docx"
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

# Function to check if a job is a MultiJob
is_multijob() {
    local job_name="$1"
    # Check if job name contains "MultiJob" or "Multijob"
    if [[ "$job_name" =~ MultiJob|Multijob ]]; then
        return 0  # true
    fi
    return 1  # false
}

# Function to get triggered jobs from a MultiJob
get_multijob_children() {
    local job_name="$1"
    local build_number="$2"
    
    # Use >&2 to send logs to stderr (not captured in pipe)
    echo "  → Drilling down into MultiJob: $job_name #$build_number" >&2
    
    # Method 1: Get downstream builds from MultiJob API
    local children=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$job_name/$build_number/api/json?tree=downstreamBuilds[jobName,buildNumber]" \
        | jq -r '.downstreamBuilds[]? | .jobName' 2>/dev/null || echo "")
    
    # Method 2: Parse console log for triggered builds (more reliable)
    if [ -z "$children" ]; then
        children=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
            "$JENKINS_URL/job/$job_name/$build_number/consoleText" \
            | grep 'Starting building:' | awk '{print $3}' | sort -u || echo "")
    fi
    
    # Only output job names to stdout
    echo "$children"
}

# Step 4: Get downstream jobs triggered by this build (with MultiJob drill-down)
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
        | grep 'Starting building:' | awk '{print $3}' | sort -u || echo "")
fi

if [ -z "$DOWNSTREAM_JOBS" ]; then
    log "✗ ERROR: Could not find any downstream jobs"
    update_heartbeat "ERROR: No downstream jobs found"
    exit 1
fi

log "✓ Found $(echo "$DOWNSTREAM_JOBS" | wc -l | xargs) initial downstream jobs"

# Expand MultiJobs to find actual pipeline jobs
ALL_JOBS=""
PROCESSED_JOBS=""

for job_name in $DOWNSTREAM_JOBS; do
    job_name=$(echo "$job_name" | xargs)  # trim whitespace
    
    # Check if already processed (avoid duplicates)
    if echo -e "$PROCESSED_JOBS" | grep -qx "$job_name"; then
        continue
    fi
    PROCESSED_JOBS="${PROCESSED_JOBS}${job_name}\n"
    
    if is_multijob "$job_name"; then
        log "  → Found MultiJob: $job_name - drilling down..."
        
        # Get latest build number for this MultiJob
        MULTIJOB_BUILD=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
            "$JENKINS_URL/job/$job_name/lastBuild/api/json?tree=number" \
            | jq -r '.number // empty')
        
        if [ -n "$MULTIJOB_BUILD" ]; then
            # Get children of this MultiJob
            CHILDREN=$(get_multijob_children "$job_name" "$MULTIJOB_BUILD")
            
            if [ -n "$CHILDREN" ]; then
                echo "    ✓ Found $(echo "$CHILDREN" | wc -l | xargs) child jobs" >&2
                # Add children to the list
                for child in $CHILDREN; do
                    child=$(echo "$child" | xargs)
                    if [ -n "$child" ] && ! echo -e "$ALL_JOBS" | grep -qx "$child"; then
                        ALL_JOBS="${ALL_JOBS}${child}\n"
                    fi
                done
            else
                echo "    ⚠ No children found, including MultiJob itself" >&2
                ALL_JOBS="${ALL_JOBS}${job_name}\n"
            fi
        else
            echo "    ⚠ Could not get MultiJob build number, including it anyway" >&2
            ALL_JOBS="${ALL_JOBS}${job_name}\n"
        fi
    else
        # Regular job, add to list
        ALL_JOBS="${ALL_JOBS}${job_name}\n"
    fi
done

# Clean up and deduplicate
DOWNSTREAM_JOBS=$(echo -e "$ALL_JOBS" | grep -v '^$' | grep -v '^#' | grep -v '^\[' | sort -u)

TOTAL_JOBS=$(echo "$DOWNSTREAM_JOBS" | grep -v '^$' | wc -l | xargs)
log "✓ Total jobs to analyze (after MultiJob expansion): $TOTAL_JOBS"
echo "$DOWNSTREAM_JOBS" > "$TMP_DIR/${REPORT_FOLDER}_downstream_jobs.txt"

# Step 5: Fetch job statuses
update_heartbeat "Fetching job statuses (0/$TOTAL_JOBS)..."
log "Fetching job statuses..."

FAILED_JOBS="[]"
PASSED_JOBS="[]"
COUNTER=0

while IFS= read -r job_name; do
    # Trim whitespace
    job_name=$(echo "$job_name" | xargs)
    
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
    
    # Export Jenkins credentials for child processes
    export JENKINS_URL="$JENKINS_URL"
    export JENKINS_USER="$JENKINS_USER"
    export JENKINS_API_TOKEN="$JENKINS_API_TOKEN"
    
    # Save failed jobs to temp file for iteration
    FAILED_JOBS_LIST="$TMP_DIR/${REPORT_FOLDER}_failed_list.txt"
    echo "$FAILED_JOBS" | jq -c '.[]' > "$FAILED_JOBS_LIST"
    
    while read -r job; do
        ANALYSIS_COUNTER=$((ANALYSIS_COUNTER + 1))
        
        # Update heartbeat every 3 jobs
        if [ $((ANALYSIS_COUNTER % 3)) -eq 0 ]; then
            update_heartbeat "Analyzing failures ($ANALYSIS_COUNTER/$FAILED_COUNT)..."
        fi
        
        JOB_NAME_F=$(echo "$job" | jq -r '.name')
        JOB_NUM_F=$(echo "$job" | jq -r '.number')
        
        log "[$ANALYSIS_COUNTER/$FAILED_COUNT] Analyzing: $JOB_NAME_F #$JOB_NUM_F"
        
        # Get console log
        CONSOLE_LOG_FILE="$REPORT_DIR/${JOB_NAME_F}_${JOB_NUM_F}_console.json"
        node "$SCRIPT_DIR/../../../skills/jenkins/scripts/jenkins.mjs" console \
            --job "$JOB_NAME_F" \
            --build "$JOB_NUM_F" \
            --tail 200 \
            > "$CONSOLE_LOG_FILE"
        
        log "  → Console log saved"
        
        # Run AI failure analysis
        ANALYSIS_FILE="$REPORT_DIR/${JOB_NAME_F}_${JOB_NUM_F}_analysis.json"
        node "$SCRIPT_DIR/ai_failure_analyzer.js" \
            "$CONSOLE_LOG_FILE" \
            "$JOB_NAME_F" \
            "$JOB_NUM_F" \
            > "$ANALYSIS_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            log "  → AI analysis completed"
        else
            log "  ⚠ AI analysis failed, using fallback"
        fi
        
        # Check previous failures (last 5 builds)
        HISTORY_FILE="$REPORT_DIR/${JOB_NAME_F}_${JOB_NUM_F}_history.json"
        node "$SCRIPT_DIR/check_previous_failures.js" \
            "$JOB_NAME_F" \
            "$JOB_NUM_F" \
            "$JENKINS_URL" \
            "$JENKINS_USER" \
            "$JENKINS_API_TOKEN" \
            > "$HISTORY_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            log "  → Historical check completed"
        else
            log "  ⚠ Historical check failed"
        fi
    done < "$FAILED_JOBS_LIST"
fi

# Step 6b: Persist results to SQLite history DB
update_heartbeat "Writing to history DB..."
log "Writing results to SQLite history DB..."

node "$SCRIPT_DIR/db_writer.js" \
    "$JOB_NAME" \
    "$BUILD_NUMBER" \
    "${JENKINS_URL}job/$JOB_NAME/$BUILD_NUMBER/" \
    "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json" \
    "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json" \
    "$REPORT_DIR" \
    > "$LOGS_DIR/db_write_${REPORT_FOLDER}.log" 2>&1 || \
    log "⚠ DB write failed (non-blocking, continuing...)"

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
    "$REPORT_DIR/${REPORT_FOLDER}.md" \
    "$REPORT_DIR/${REPORT_FOLDER}.docx"

log "✓ DOCX created"

# Step 9: Upload to Feishu
update_heartbeat "Uploading to Feishu..."
log "Uploading report to Feishu..."

bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/${REPORT_FOLDER}.docx"

log "✓ Report uploaded to Feishu"

# Step 10: Cleanup
rm -f "$HEARTBEAT_FILE"
log "✓ Heartbeat cleared"

log "=========================================="
log "Analysis complete for $JOB_NAME #$BUILD_NUMBER"
log "Report saved to: $REPORT_DIR"
log "=========================================="
