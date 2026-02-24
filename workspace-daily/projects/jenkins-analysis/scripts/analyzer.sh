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
# FEISHU_CHAT_ID="oc_f15b73b877ad243886efaa1e99018807"
# TIMEOUT_MINUTES=120

# Job blacklist - skip these jobs
BLACKLISTED_JOBS=(
  "LibraryWeb_AutoAnswer_MultiJob"
  "api_multijob"
)

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

# Step 0: Check if job is blacklisted
for blacklisted in "${BLACKLISTED_JOBS[@]}"; do
    if [ "$JOB_NAME" = "$blacklisted" ]; then
        log "⚠ Job $JOB_NAME is blacklisted, skipping analysis"
        exit 0
    fi
done

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

# Function to get triggered jobs from a MultiJob with build numbers
get_multijob_children() {
    local job_name="$1"
    local build_number="$2"
    
    # Use >&2 to send logs to stderr (not captured in pipe)
    echo "  → Drilling down into MultiJob: $job_name #$build_number" >&2
    
    # Get console log and parse "Starting building: JobName #BuildNum"
    local console_text
    console_text=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$job_name/$build_number/consoleText")
    
    local children_with_builds
    children_with_builds=$(echo "$console_text" | grep 'Starting building:' | \
        sed -E 's/^Starting building: (.+) #([0-9]+)$/\1|\2/' | sort -u || echo "")
    
    if [ -n "$children_with_builds" ]; then
        # Return format: "JobName|BuildNum" (one per line)
        echo "$children_with_builds"
    else
        # Fallback: Try API (but this won't have build numbers)
        echo "    ⚠ No children found in console log, trying API..." >&2
        local children_names
        children_names=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
            "$JENKINS_URL/job/$job_name/$build_number/api/json?tree=downstreamBuilds[jobName]" \
            | jq -r '.downstreamBuilds[]? | .jobName' 2>/dev/null || echo "")
        
        # Return just names (without build numbers - will need lastBuild fallback)
        echo "$children_names"
    fi
}

# Step 4: Get downstream jobs triggered by this build (with MultiJob drill-down)
update_heartbeat "Fetching downstream jobs..."
log "Fetching downstream jobs for $JOB_NAME #$BUILD_NUMBER..."

# Get console log to parse triggered builds with BOTH name and number
CONSOLE_TEXT=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
    "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/consoleText")

# Extract "Starting building: JobName #BuildNum" → save as "JobName|BuildNum"
TRIGGERED_BUILDS=$(echo "$CONSOLE_TEXT" | grep 'Starting building:' | \
    sed -E 's/^Starting building: (.+) #([0-9]+)$/\1|\2/' | sort -u || echo "")

# For compatibility with existing logic, extract just job names
DOWNSTREAM_JOBS=$(echo "$TRIGGERED_BUILDS" | cut -d'|' -f1)

if [ -z "$DOWNSTREAM_JOBS" ]; then
    log "⚠ No triggered builds found in console log - trying API fallback..."
    DOWNSTREAM_JOBS=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/api/json?tree=downstreamProjects[name]" \
        | jq -r '.downstreamProjects[]?.name // empty')
    TRIGGERED_BUILDS=""  # No build numbers available from API
fi

if [ -z "$DOWNSTREAM_JOBS" ]; then
    log "⚠ No downstream jobs found - treating as standalone job"
    DOWNSTREAM_JOBS="$JOB_NAME"
    TRIGGERED_BUILDS="${JOB_NAME}|${BUILD_NUMBER}"
    update_heartbeat "Analyzing standalone job"
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
        
        # Get specific build number from TRIGGERED_BUILDS (not lastBuild!)
        MULTIJOB_BUILD=$(echo "$TRIGGERED_BUILDS" | grep "^${job_name}|" | cut -d'|' -f2 | head -1)
        
        if [ -z "$MULTIJOB_BUILD" ]; then
            # Fallback to lastBuild only if not found in triggered builds
            MULTIJOB_BUILD=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
                "$JENKINS_URL/job/$job_name/lastBuild/api/json?tree=number" \
                | jq -r '.number // empty')
        fi
        
        if [ -n "$MULTIJOB_BUILD" ]; then
            log "    → Drilling into MultiJob build #$MULTIJOB_BUILD"
            # Get children of this MultiJob
            CHILDREN=$(get_multijob_children "$job_name" "$MULTIJOB_BUILD")
            
            if [ -n "$CHILDREN" ]; then
                echo "    ✓ Found $(echo "$CHILDREN" | wc -l | xargs) child jobs" >&2
                # Add children to the lists
                for child_entry in $CHILDREN; do
                    child_entry=$(echo "$child_entry" | xargs)
                    if [ -z "$child_entry" ]; then
                        continue
                    fi
                    
                    # Check if format is "JobName|BuildNum" or just "JobName"
                    if [[ "$child_entry" =~ \| ]]; then
                        # Has build number
                        child_name=$(echo "$child_entry" | cut -d'|' -f1)
                        
                        # Add to TRIGGERED_BUILDS for later status checks
                        if ! echo "$TRIGGERED_BUILDS" | grep -qx "$child_entry"; then
                            TRIGGERED_BUILDS="${TRIGGERED_BUILDS}"$'\n'"${child_entry}"
                        fi
                        
                        # Add to ALL_JOBS (job names only)
                        if ! echo -e "$ALL_JOBS" | grep -qx "$child_name"; then
                            ALL_JOBS="${ALL_JOBS}${child_name}\n"
                        fi
                    else
                        # Just job name (no build number from API fallback)
                        if ! echo -e "$ALL_JOBS" | grep -qx "$child_entry"; then
                            ALL_JOBS="${ALL_JOBS}${child_entry}\n"
                        fi
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

# Save triggered builds for debugging and status checks
echo -e "$TRIGGERED_BUILDS" > "$TMP_DIR/${REPORT_FOLDER}_triggered_builds.txt"

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
    
    # Get specific build number from TRIGGERED_BUILDS (if available)
    JOB_NUMBER=$(echo "$TRIGGERED_BUILDS" | grep "^${job_name}|" | cut -d'|' -f2 | head -1)
    
    if [ -n "$JOB_NUMBER" ]; then
        # Use specific build number from console log
        log "[$COUNTER/$TOTAL_JOBS] Checking: $job_name #$JOB_NUMBER"
        JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
            "$JENKINS_URL/job/$job_name/$JOB_NUMBER/api/json?tree=number,result,timestamp,duration" || echo "{}")
    else
        # Fallback to lastBuild (shouldn't happen if console log parsing worked)
        log "[$COUNTER/$TOTAL_JOBS] Checking: $job_name (lastBuild fallback)"
        JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
            "$JENKINS_URL/job/$job_name/lastBuild/api/json?tree=number,result,timestamp,duration" || echo "{}")
        JOB_NUMBER=$(echo "$JOB_INFO" | jq -r '.number // "N/A"')
    fi
    
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
        node "$SCRIPT_DIR/analysis/ai_analyzer.js" \
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
        node "$SCRIPT_DIR/analysis/history.js" \
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

node "$SCRIPT_DIR/pipeline/process_build.js" \
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

node "$SCRIPT_DIR/reporting/generator.js" \
    "$REPORT_FOLDER" \
    "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json" \
    "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json" \
    "$REPORT_DIR"

log "✓ Report generated"

# Step 8: Convert to DOCX
update_heartbeat "Converting to DOCX..."
log "Converting markdown to DOCX..."

node "$SCRIPT_DIR/reporting/docx_converter.js" \
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
