#!/bin/bash
# Direct Analyzer - Bypass webhook and analyze any job directly
# Use this for testing or for jobs not in the watched list

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Usage
if [ $# -lt 2 ]; then
    echo "Usage: bash direct_analyzer.sh <job_name> <build_number>"
    echo ""
    echo "Examples:"
    echo "  bash direct_analyzer.sh Tanzu_Report_Env_Upgrade 1243"
    echo "  bash direct_analyzer.sh LibraryWeb_CustomApp_Pipeline 2201"
    echo ""
    echo "This will:"
    echo "  1. Bypass webhook (analyze ANY job, even if not watched)"
    echo "  2. Start analysis in foreground (see live output)"
    echo "  3. Parse failures with V2 parser (file names, retries, full errors)"
    echo "  4. Write to SQLite history database"
    echo "  5. Generate enhanced report"
    echo "  6. Upload to Feishu"
    echo ""
    echo "Difference from manual_trigger.sh:"
    echo "  - manual_trigger.sh → calls webhook → only works for WATCHED_JOBS"
    echo "  - direct_analyzer.sh → calls analyzer.sh directly → works for ANY job"
    exit 1
fi

JOB_NAME="$1"
BUILD_NUMBER="$2"

echo "=========================================="
echo "Direct Analyzer (Bypassing Webhook)"
echo "Job: $JOB_NAME"
echo "Build: #$BUILD_NUMBER"
echo "=========================================="
echo ""

# Call analyzer.sh directly
echo "Starting analysis (V2 parser enabled)..."
echo ""

bash "$SCRIPT_DIR/analyzer.sh" "$JOB_NAME" "$BUILD_NUMBER"

EXIT_CODE=$?

echo ""
echo "=========================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo "✓ Analysis complete!"
    echo ""
    echo "Check outputs:"
    echo "  1. Report: $SCRIPT_DIR/../reports/${JOB_NAME}_${BUILD_NUMBER}/${JOB_NAME}_${BUILD_NUMBER}.docx"
    echo "  2. Database: sqlite3 $SCRIPT_DIR/../data/jenkins_history.db"
    echo "  3. Analyzer log: $SCRIPT_DIR/../logs/analyzer_${JOB_NAME}_${BUILD_NUMBER}.log"
    echo ""
    echo "Feishu delivery: Check chat (oc_f15b73b877ad243886efaa1e99018807)"
else
    echo "✗ Analysis failed with exit code $EXIT_CODE"
    echo "  Check log: $SCRIPT_DIR/../logs/analyzer_${JOB_NAME}_${BUILD_NUMBER}.log"
    exit $EXIT_CODE
fi
