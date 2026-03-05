#!/bin/bash
# Patch script: Fix analyzer.sh to use triggered build numbers instead of lastBuild
# This fixes the "empty reports" issue where result is null

ANALYZER_PATH="/Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts/analyzer.sh"

echo "Patching analyzer.sh to use triggered build numbers..."

# Backup already created by calling script

# Create the patched version
cat > "$ANALYZER_PATH.patched" << 'ANALYZER_EOF'
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

# Step 4: Parse console log to get triggered builds with BOTH name and number
update_heartbeat "Fetching triggered builds..."
log "Parsing console log for triggered builds..."

CONSOLE_TEXT=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
    "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/consoleText")

# Extract "Starting building: JobName #BuildNum" lines
# Format: {"name":"JobName","number":"123"}
DOWNSTREAM_BUILDS=$(echo "$CONSOLE_TEXT" | grep 'Starting building:' | \
    sed -E 's/^Starting building: (.+) #([0-9]+)$/{"name":"\1","number":"\2"}/' | \
    sort -u)

if [ -z "$DOWNSTREAM_BUILDS" ]; then
    log "✗ ERROR: Could not find any triggered builds in console log"
    update_heartbeat "ERROR: No triggered builds found"
    exit 1
fi

TOTAL_JOBS=$(echo "$DOWNSTREAM_BUILDS" | wc -l | xargs)
log "✓ Found $TOTAL_JOBS triggered builds"

# Save to temp file
BUILDS_FILE="$TMP_DIR/${REPORT_FOLDER}_triggered_builds.json"
echo "$DOWNSTREAM_BUILDS" | jq -s '.' > "$BUILDS_FILE"

# Step 5: Check status of each triggered build
update_heartbeat "Checking build statuses (0/$TOTAL_JOBS)..."
log "Checking build statuses..."

FAILED_JOBS="[]"
PASSED_JOBS="[]"
COUNTER=0

while read -r build_json; do
    COUNTER=$((COUNTER + 1))
    
    # Update heartbeat every 5 jobs
    if [ $((COUNTER % 5)) -eq 0 ]; then
        update_heartbeat "Checking statuses ($COUNTER/$TOTAL_JOBS)..."
    fi
    
    job_name=$(echo "$build_json" | jq -r '.name' | xargs)  # trim whitespace
    job_number=$(echo "$build_json" | jq -r '.number')
    
    log "[$COUNTER/$TOTAL_JOBS] Checking: $job_name #$job_number"
    
    # Get status of this SPECIFIC build (not lastBuild)
    JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
        "$JENKINS_URL/job/$job_name/$job_number/api/json?tree=number,result,timestamp,duration" || echo "{}")
    
    JOB_RESULT=$(echo "$JOB_INFO" | jq -r '.result // "UNKNOWN"')
    
    if [ "$JOB_RESULT" = "FAILURE" ] || [ "$JOB_RESULT" = "UNSTABLE" ]; then
        FAILED_JOBS=$(echo "$FAILED_JOBS" | jq --arg name "$job_name" --arg num "$job_number" \
            '. += [{"name": $name, "number": $num}]')
        log "  ❌ FAILED: $job_name #$job_number"
    elif [ "$JOB_RESULT" = "SUCCESS" ]; then
        PASSED_JOBS=$(echo "$PASSED_JOBS" | jq --arg name "$job_name" --arg num "$job_number" \
            '. += [{"name": $name, "number": $num}]')
        log "  ✅ PASSED: $job_name #$job_number"
    else
        log "  ⚠️  UNKNOWN: $job_name #$job_number (result=$JOB_RESULT)"
    fi
done < <(echo "$DOWNSTREAM_BUILDS" | jq -c '.')

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
            5 \
            > "$HISTORY_FILE" 2>&1
        
        if [ $? -eq 0 ]; then
            log "  → History check completed"
        else
            log "  ⚠ History check failed"
        fi
        
    done < "$FAILED_JOBS_LIST"
else
    log "✓ No failures to analyze"
fi

update_heartbeat "Generating report..."

# Step 7: Write to database (detailed failure tracking)
log "Writing detailed failure data to database..."
DB_LOG="$LOGS_DIR/db_write_${JOB_NAME}_${BUILD_NUMBER}.log"

node "$SCRIPT_DIR/pipeline/process_build.js" \
    "$JOB_NAME" \
    "$BUILD_NUMBER" \
    "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/" \
    "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json" \
    "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json" \
    "$REPORT_DIR" \
    > "$DB_LOG" 2>&1

if [ $? -eq 0 ]; then
    log "✓ Database write completed"
else
    log "⚠ Database write failed (check $DB_LOG)"
fi

# Step 8: Generate markdown report
log "Generating markdown report..."
node "$SCRIPT_DIR/reporting/generator.js" \
    "$REPORT_FOLDER" \
    "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json" \
    "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json" \
    "$REPORT_DIR"

if [ ! -f "$REPORT_DIR/${REPORT_FOLDER}.md" ]; then
    log "✗ ERROR: Report generation failed"
    exit 1
fi

log "✓ Markdown report generated"

# Step 9: Convert to DOCX
update_heartbeat "Converting to DOCX..."
log "Converting report to DOCX..."

node "$SCRIPT_DIR/reporting/docx_converter.js" "$REPORT_DIR/${REPORT_FOLDER}.md" "$REPORT_DIR/${REPORT_FOLDER}.docx"

if [ ! -f "$REPORT_DIR/${REPORT_FOLDER}.docx" ]; then
    log "✗ ERROR: DOCX conversion failed"
    exit 1
fi

log "✓ DOCX report generated"

# Step 10: Upload to Feishu
update_heartbeat "Uploading to Feishu..."
log "Uploading report to Feishu..."

bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/${REPORT_FOLDER}.docx"

if [ $? -eq 0 ]; then
    log "✓ Report uploaded to Feishu successfully"
else
    log "⚠ Feishu upload failed (check logs)"
fi

# Step 11: Cleanup
update_heartbeat "Complete"
log "=========================================="
log "Analysis complete for $JOB_NAME #$BUILD_NUMBER"
log "Report: $REPORT_DIR/${REPORT_FOLDER}.docx"
log "=========================================="

ANALYZER_EOF

# Apply the patch
mv "$ANALYZER_PATH.patched" "$ANALYZER_PATH"
chmod +x "$ANALYZER_PATH"

echo "✓ Patch applied successfully"
echo "  Backup saved to: ${ANALYZER_PATH}.backup-*"
echo "  Key fix: Now uses console log to extract specific build numbers"
echo "           instead of checking lastBuild (which may be still running)"
