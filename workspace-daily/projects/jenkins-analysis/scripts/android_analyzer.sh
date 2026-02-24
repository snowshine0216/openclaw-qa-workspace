#!/bin/bash
# android_analyzer.sh - Android Library CI analysis orchestrator
#
# Usage: bash android_analyzer.sh [--force] <trigger_job_name> <trigger_build_number>
# Example: bash android_analyzer.sh Trigger_Library_Jobs 89
# Example: bash android_analyzer.sh --force Trigger_Library_Jobs 89

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$PROJECT_DIR/tmp"
LOGS_DIR="$PROJECT_DIR/logs"
REPORTS_DIR="$PROJECT_DIR/reports"

# Configuration
export JENKINS_URL="http://tec-l-1081462.labs.microstrategy.com:8080/"
export JENKINS_USER="admin"
export JENKINS_API_TOKEN="11596241e9625bf6e48aca51bf0af0a036"
# For Android specific servers you can also set ANDROID_JENKINS_URL

# Parse arguments
FORCE_REGENERATE=0
TRIGGER_JOB=""
TRIGGER_BUILD=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_REGENERATE=1
            shift
            ;;
        *)
            if [ -z "$TRIGGER_JOB" ]; then
                TRIGGER_JOB="$1"
            elif [ -z "$TRIGGER_BUILD" ]; then
                TRIGGER_BUILD="$1"
            fi
            shift
            ;;
    esac
done

if [ -z "$TRIGGER_JOB" ] || [ -z "$TRIGGER_BUILD" ]; then
    echo "Usage: bash android_analyzer.sh [--force|-f] <trigger_job_name> <trigger_build_number>"
    echo ""
    echo "Options:"
    echo "  --force, -f    Force regeneration even if report exists"
    echo ""
    echo "Examples:"
    echo "  bash android_analyzer.sh Trigger_Library_Jobs 89"
    echo "  bash android_analyzer.sh --force Trigger_Library_Jobs 89"
    exit 1
fi

REPORT_FOLDER="${TRIGGER_JOB}_${TRIGGER_BUILD}"
REPORT_DIR="$REPORTS_DIR/$REPORT_FOLDER"
REPORT_MD="$REPORT_DIR/${TRIGGER_JOB}_${TRIGGER_BUILD}.md"
REPORT_DOCX="$REPORT_DIR/${TRIGGER_JOB}_${TRIGGER_BUILD}.docx"

# Create directories with error checking
mkdir -p "$LOGS_DIR" || {
    echo "ERROR: Cannot create logs directory: $LOGS_DIR" >&2
    exit 1
}

mkdir -p "$REPORT_DIR" || {
    echo "ERROR: Cannot create report directory: $REPORT_DIR" >&2
    exit 1
}

LOG_FILE="$LOGS_DIR/android_analyzer_${TRIGGER_JOB}_${TRIGGER_BUILD}.log"

# Explicitly create log file before redirection
touch "$LOG_FILE" || {
    echo "ERROR: Cannot create log file: $LOG_FILE" >&2
    exit 1
}

# Redirect output to log file
exec > >(tee -a "$LOG_FILE") 2>&1

# Error trap
trap 'echo "[$(date "+%Y-%m-%d %H:%M:%S")] ❌ Script failed at line $LINENO"; rm -f "$HEARTBEAT_FILE"; exit 1' ERR

# Enable debug mode if requested
if [ "${DEBUG:-0}" = "1" ]; then
    set -x
fi

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "=========================================="
log "Android Analysis started for $TRIGGER_JOB #$TRIGGER_BUILD"
log "Report folder: $REPORT_FOLDER"
log "Report files: ${TRIGGER_JOB}_${TRIGGER_BUILD}.md / .docx"
log "Force regenerate: $FORCE_REGENERATE"
log "=========================================="
log ""
log "Environment check:"
log "  JENKINS_URL: $JENKINS_URL"
log "  JENKINS_USER: ${JENKINS_USER:-(not set)}"
log "  JENKINS_API_TOKEN: ${JENKINS_API_TOKEN:+***set***}"
log "  FEISHU_WEBHOOK_URL: ${FEISHU_WEBHOOK_URL:-(not set)}"
log "  ANDROID_JENKINS_URL: ${ANDROID_JENKINS_URL:-(not set)}"
log "  DEBUG: ${DEBUG:-0}"
log ""

# Step 1: Cost optimization - skip if report already exists (unless --force)
if [ "$FORCE_REGENERATE" = "0" ] && [ -f "$REPORT_DOCX" ]; then
  log "✓ Re-using existing Android report at $REPORT_DOCX"
  if [ -n "$FEISHU_WEBHOOK_URL" ]; then
    log "Uploading cached report to Feishu..."
    bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DOCX" "[Android] "
  else
    log "⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload"
  fi
  exit 0
fi

if [ "$FORCE_REGENERATE" = "1" ]; then
    log "🔄 Force regeneration requested, removing old reports..."
    rm -f "$REPORT_MD" "$REPORT_DOCX"
    rm -f "$REPORT_DIR"/*.json
    log "✓ Old reports deleted"
fi

# Step 2: Heartbeat setup
HEARTBEAT_FILE="$TMP_DIR/heartbeat_android_${TRIGGER_JOB}_${TRIGGER_BUILD}.txt"
echo "$(date '+%s')|Starting Android CI Extract..." > "$HEARTBEAT_FILE"

# Step 3: Discover downstream builds + fetch ExtentReports
log "Executing process_android_build pipeline orchestrator..."
node "$SCRIPT_DIR/pipeline/process_android_build.js" \
  --job "$TRIGGER_JOB" \
  --build "$TRIGGER_BUILD" \
  --output-dir "$REPORT_DIR"

if [ $? -ne 0 ]; then
   log "❌ Pipeline execution for Android CI failed"
   rm -f "$HEARTBEAT_FILE"
   exit 1
fi

echo "$(date '+%s')|Generating Markdown/Docx Report..." > "$HEARTBEAT_FILE"

# Step 4: Generate markdown report
log "Building Android Summary document..."
node "$SCRIPT_DIR/generate_android_report.mjs" "$REPORT_DIR" "$TRIGGER_JOB" "$TRIGGER_BUILD"

# Step 5: Convert to DOCX
log "Converting Markdown to Docx format..."
node "$SCRIPT_DIR/reporting/docx_converter.js" \
  "$REPORT_MD" \
  "$REPORT_DOCX"

# Step 6: Upload to Feishu
if [ -n "$FEISHU_WEBHOOK_URL" ]; then
    log "Dispatching Docx into designated Feishu channel..."
    bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DOCX" "[Android] "
else
    log "⚠ FEISHU_WEBHOOK_URL not set, skipping Feishu upload"
    log "   Set FEISHU_WEBHOOK_URL environment variable to enable Feishu delivery"
fi

rm -f "$HEARTBEAT_FILE"
log ""
log "✅ Android Jenkins CI check completed successfully"
log "Report saved to: $REPORT_DOCX"
log "Log file: $LOG_FILE"
log "=========================================="
exit 0
