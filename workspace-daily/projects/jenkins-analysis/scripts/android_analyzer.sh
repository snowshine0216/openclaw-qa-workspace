#!/bin/bash
# android_analyzer.sh - Android Library CI analysis orchestrator
#
# Usage: bash android_analyzer.sh <trigger_job_name> <trigger_build_number>
# Example: bash android_analyzer.sh Trigger_Library_Jobs 89

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

TRIGGER_JOB="$1"
TRIGGER_BUILD="$2"

if [ -z "$TRIGGER_JOB" ] || [ -z "$TRIGGER_BUILD" ]; then
    echo "Usage: bash android_analyzer.sh <trigger_job_name> <trigger_build_number>"
    exit 1
fi

REPORT_FOLDER="${TRIGGER_JOB}_${TRIGGER_BUILD}"
REPORT_DIR="$REPORTS_DIR/$REPORT_FOLDER"

mkdir -p "$LOGS_DIR"
mkdir -p "$REPORT_DIR"
LOG_FILE="$LOGS_DIR/android_analyzer_${TRIGGER_JOB}_${TRIGGER_BUILD}.log"
exec > >(tee -a "$LOG_FILE") 2>&1

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "=========================================="
log "Android Analysis started for $TRIGGER_JOB #$TRIGGER_BUILD"
log "Report folder: $REPORT_FOLDER"
log "=========================================="

# Step 1: Cost optimization - skip if report already exists
if [ -f "$REPORT_DIR/android_report.docx" ]; then
  log "✓ Re-using existing Android report at $REPORT_DIR/android_report.docx"
  if [ -n "$FEISHU_WEBHOOK_URL" ]; then
    bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/android_report.docx" "[Android] "
  else
    log "⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload"
  fi
  exit 0
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
  "$REPORT_DIR/android_report.md" \
  "$REPORT_DIR/android_report.docx"

# Step 6: Upload to Feishu
log "Dispatching Docx into designated Feishu channel..."
bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/android_report.docx" "[Android] "

rm -f "$HEARTBEAT_FILE"
log "✅ Android Jenkins CI check completed successfully"
exit 0
