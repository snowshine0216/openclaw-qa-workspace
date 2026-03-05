#!/bin/bash
# android_analyzer.sh - Android Library CI analysis orchestrator
#
# Normal mode (trigger job):
#   bash android_analyzer.sh [--force] <trigger_job_name> <trigger_build_number>
#   Example: bash android_analyzer.sh Trigger_Library_Jobs 89
#
# Single-job mode (test/debug one specific Library job by name + build number):
#   bash android_analyzer.sh --single-job <job_name> --single-build <build_num> [--force]
#   Example: bash android_analyzer.sh --single-job Library_RSD_MultiMedia --single-build 330

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$PROJECT_DIR/tmp"
LOGS_DIR="$PROJECT_DIR/logs"
REPORTS_DIR="$PROJECT_DIR/reports"

# Auto-load .env from workspace-daily (contains ANDROID_JENKINS_TOKEN etc)
WORKSPACE_DAILY_ENV="$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")/.env"
if [ -f "$WORKSPACE_DAILY_ENV" ]; then
    set -a
    # shellcheck disable=SC1090
    source "$WORKSPACE_DAILY_ENV"
    set +a
fi

# Configuration — Android Library CI runs on a SEPARATE Jenkins server from the main CI
# Priority: environment variable > .env file > hardcoded default
export ANDROID_JENKINS_URL="${ANDROID_JENKINS_URL:-http://ci-master.labs.microstrategy.com:8011}"
export ANDROID_JENKINS_USER="${ANDROID_JENKINS_USER:-xuyin}"
# Support both ANDROID_JENKINS_TOKEN (real .env name) and ANDROID_JENKINS_API_TOKEN
export ANDROID_JENKINS_API_TOKEN="${ANDROID_JENKINS_API_TOKEN:-${ANDROID_JENKINS_TOKEN:-}}"

# Main Jenkins (used for non-Android jobs only)
export JENKINS_URL="${JENKINS_URL:-http://tec-l-1081462.labs.microstrategy.com:8080/}"

# Parse arguments
FORCE_REGENERATE=0
TRIGGER_JOB=""
TRIGGER_BUILD=""
SINGLE_JOB=""
SINGLE_BUILD=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_REGENERATE=1
            shift
            ;;
        --single-job)
            SINGLE_JOB="$2"
            shift 2
            ;;
        --single-build)
            SINGLE_BUILD="$2"
            shift 2
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

# In single-job mode, synthesise trigger job/build from the Library job name+build
if [ -n "$SINGLE_JOB" ] && [ -n "$SINGLE_BUILD" ]; then
    TRIGGER_JOB="${SINGLE_JOB}"
    TRIGGER_BUILD="${SINGLE_BUILD}"
elif [ -z "$TRIGGER_JOB" ] || [ -z "$TRIGGER_BUILD" ]; then
    echo "Usage (normal):      bash android_analyzer.sh [--force|-f] <trigger_job_name> <trigger_build_number>"
    echo "Usage (single-job):  bash android_analyzer.sh --single-job <job_name> --single-build <build_num> [--force]"
    echo ""
    echo "Examples:"
    echo "  bash android_analyzer.sh Trigger_Library_Jobs 89"
    echo "  bash android_analyzer.sh --force Trigger_Library_Jobs 89"
    echo "  bash android_analyzer.sh --single-job Library_RSD_MultiMedia --single-build 330"
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
  log "Uploading cached report to Feishu..."
  # Reference shared feishu_uploader from jenkins-analysis
  FEISHU_UPLOADER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh"
  bash "$FEISHU_UPLOADER" "$REPORT_DOCX"
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
if [ -n "$SINGLE_JOB" ] && [ -n "$SINGLE_BUILD" ]; then
  log "Mode: single-job  →  $SINGLE_JOB #$SINGLE_BUILD"
  node "$SCRIPT_DIR/pipeline/process_android_build.js" \
    --single-job "$SINGLE_JOB" \
    --single-build "$SINGLE_BUILD" \
    --output-dir "$REPORT_DIR"
else
  node "$SCRIPT_DIR/pipeline/process_android_build.js" \
    --job "$TRIGGER_JOB" \
    --build "$TRIGGER_BUILD" \
    --output-dir "$REPORT_DIR"
fi

if [ $? -ne 0 ]; then
   log "❌ Pipeline execution for Android CI failed"
   rm -f "$HEARTBEAT_FILE"
   exit 1
fi

echo "$(date '+%s')|Generating Markdown/Docx Report..." > "$HEARTBEAT_FILE"

# Step 4: Generate markdown report
log "Building Android Summary document..."
node "$SCRIPT_DIR/generate_android_report.mjs" "$REPORT_DIR" "$TRIGGER_JOB" "$TRIGGER_BUILD"

# Step 5: Convert to DOCX (use shared docx_converter from jenkins-analysis)
log "Converting Markdown to Docx format..."
DOCX_CONVERTER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/reporting/docx_converter.js"
node "$DOCX_CONVERTER" \
  "$REPORT_MD" \
  "$REPORT_DOCX"

# Step 6: Upload to Feishu
log "Dispatching Docx into designated Feishu channel..."
# Reference shared feishu_uploader from jenkins-analysis
FEISHU_UPLOADER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh"
bash "$FEISHU_UPLOADER" "$REPORT_DOCX"

rm -f "$HEARTBEAT_FILE"
log ""
log "✅ Android Jenkins CI check completed successfully"
log "Report saved to: $REPORT_DOCX"
log "Log file: $LOG_FILE"
log "=========================================="
exit 0
