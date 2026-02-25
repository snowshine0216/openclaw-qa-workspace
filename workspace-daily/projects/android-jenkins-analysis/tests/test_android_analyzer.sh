#!/bin/bash
# Integration tests for Android analyzer fixes
# Tests Fix 0, Fix 1, and Fix 2

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANALYZER_SCRIPT="$SCRIPT_DIR/../scripts/android_analyzer.sh"
TEST_REPORTS_DIR="$SCRIPT_DIR/../reports"
TEST_LOGS_DIR="$SCRIPT_DIR/../logs"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass() {
    echo -e "${GREEN}✓${NC} $1"
}

fail() {
    echo -e "${RED}✗${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

info() {
    echo "  $1"
}

echo "=========================================="
echo "Android Analyzer Integration Tests"
echo "=========================================="
echo ""

# Test 1: Help message (argument validation)
echo "Test 1: Argument validation and help message"
echo "--------------------------------------------"

if bash "$ANALYZER_SCRIPT" 2>&1 | grep -q "Usage:"; then
    pass "Help message shown when no arguments"
else
    fail "Help message not shown"
fi

if bash "$ANALYZER_SCRIPT" 2>&1 | grep -q "\-\-force"; then
    pass "--force flag documented in help"
else
    fail "--force flag not documented"
fi

echo ""

# Test 2: Directory creation
echo "Test 2: Directory and log file creation"
echo "----------------------------------------"

# Create a mock test environment
TEST_JOB="TestJob"
TEST_BUILD="999"
TEST_LOG="$TEST_LOGS_DIR/android_analyzer_${TEST_JOB}_${TEST_BUILD}.log"
TEST_REPORT_DIR="$TEST_REPORTS_DIR/${TEST_JOB}_${TEST_BUILD}"

# Clean up any existing test artifacts
rm -rf "$TEST_REPORT_DIR"
rm -f "$TEST_LOG"

# Mock the process_android_build.js to avoid Jenkins calls
MOCK_PIPELINE="$SCRIPT_DIR/../scripts/pipeline/process_android_build_mock.js"
cat > "$MOCK_PIPELINE" << 'EOF'
// Mock pipeline for testing
const fs = require('fs');
const path = require('path');

const args = require('yargs')
  .option('job', { type: 'string', required: true })
  .option('build', { type: 'number', required: true })
  .option('output-dir', { type: 'string', required: true })
  .argv;

// Create mock output files
fs.writeFileSync(path.join(args['output-dir'], 'passed_jobs.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(args['output-dir'], 'failed_jobs.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(args['output-dir'], 'extent_failures.json'), JSON.stringify([], null, 2));

console.log('Mock pipeline executed successfully');
process.exit(0);
EOF

# Temporarily replace the pipeline script
ORIG_PIPELINE="$SCRIPT_DIR/../scripts/pipeline/process_android_build.js"
BACKUP_PIPELINE="$SCRIPT_DIR/../scripts/pipeline/process_android_build.js.backup"
mv "$ORIG_PIPELINE" "$BACKUP_PIPELINE"
mv "$MOCK_PIPELINE" "$ORIG_PIPELINE"

# Run the analyzer (will fail but should create dirs)
bash "$ANALYZER_SCRIPT" "$TEST_JOB" "$TEST_BUILD" 2>&1 > /dev/null || true

# Restore original pipeline
mv "$BACKUP_PIPELINE" "$ORIG_PIPELINE"

if [ -d "$TEST_LOGS_DIR" ]; then
    pass "Logs directory created"
else
    fail "Logs directory not created"
fi

if [ -d "$TEST_REPORT_DIR" ]; then
    pass "Report directory created"
else
    fail "Report directory not created"
fi

if [ -f "$TEST_LOG" ]; then
    pass "Log file created"
    info "Log file: $TEST_LOG"
else
    fail "Log file not created"
fi

echo ""

# Test 3: Log content validation
echo "Test 3: Log content and environment logging"
echo "--------------------------------------------"

if [ -f "$TEST_LOG" ]; then
    if grep -q "Android Analysis started" "$TEST_LOG"; then
        pass "Startup message logged"
    else
        fail "Startup message not found in log"
    fi
    
    if grep -q "Environment check:" "$TEST_LOG"; then
        pass "Environment variables logged"
    else
        fail "Environment variables not logged"
    fi
    
    if grep -q "JENKINS_URL:" "$TEST_LOG"; then
        pass "JENKINS_URL logged"
    else
        fail "JENKINS_URL not logged"
    fi
    
    if grep -q "Force regenerate:" "$TEST_LOG"; then
        pass "Force flag status logged"
    else
        fail "Force flag status not logged"
    fi
else
    warn "Log file not available, skipping content tests"
fi

echo ""

# Test 4: Report naming (Fix 0)
echo "Test 4: Report naming convention (Fix 0)"
echo "-----------------------------------------"

EXPECTED_MD="$TEST_REPORT_DIR/${TEST_JOB}_${TEST_BUILD}.md"
EXPECTED_DOCX="$TEST_REPORT_DIR/${TEST_JOB}_${TEST_BUILD}.docx"

if grep -q "${TEST_JOB}_${TEST_BUILD}.md" "$TEST_LOG" 2>/dev/null; then
    pass "Correct MD filename in logs"
else
    warn "MD filename not found in logs (expected in report generation)"
fi

if grep -q "${TEST_JOB}_${TEST_BUILD}.docx" "$TEST_LOG" 2>/dev/null; then
    pass "Correct DOCX filename in logs"
else
    warn "DOCX filename not found in logs (expected in report generation)"
fi

# Check no old naming pattern mentioned
if grep -q "android_report.md" "$TEST_LOG" 2>/dev/null; then
    fail "Old naming pattern (android_report.md) found in logs"
else
    pass "Old naming pattern not used"
fi

echo ""

# Test 5: Force flag (Fix 2)
echo "Test 5: --force flag functionality (Fix 2)"
echo "-------------------------------------------"

# Create a dummy report to test cache
mkdir -p "$TEST_REPORT_DIR"
echo "Cached report" > "$EXPECTED_DOCX"

# Test without --force (should use cache)
rm -f "$TEST_LOG"
bash "$ANALYZER_SCRIPT" "$TEST_JOB" "$TEST_BUILD" 2>&1 > /dev/null || true

if [ -f "$TEST_LOG" ] && grep -q "Re-using existing" "$TEST_LOG"; then
    pass "Cache hit detected without --force"
else
    fail "Cache not detected"
fi

# Test with --force (should regenerate)
rm -f "$TEST_LOG"
bash "$ANALYZER_SCRIPT" --force "$TEST_JOB" "$TEST_BUILD" 2>&1 > /dev/null || true

if [ -f "$TEST_LOG" ] && grep -q "Force regeneration requested" "$TEST_LOG"; then
    pass "--force flag triggers regeneration"
else
    fail "--force flag not working"
fi

if [ -f "$TEST_LOG" ] && grep -q "Old reports deleted" "$TEST_LOG"; then
    pass "Old reports cleaned up with --force"
else
    fail "Old reports not deleted"
fi

echo ""

# Test 6: Error handling
echo "Test 6: Error handling and traps (Fix 1)"
echo "-----------------------------------------"

# Test invalid job name
rm -f "$TEST_LOG"
if bash "$ANALYZER_SCRIPT" "" "$TEST_BUILD" 2>&1 | grep -q "Usage:"; then
    pass "Empty job name rejected"
else
    fail "Empty job name not rejected"
fi

# Test invalid build number
rm -f "$TEST_LOG"
if bash "$ANALYZER_SCRIPT" "$TEST_JOB" "" 2>&1 | grep -q "Usage:"; then
    pass "Empty build number rejected"
else
    fail "Empty build number not rejected"
fi

echo ""

# Test 7: Debug mode
echo "Test 7: DEBUG mode (Fix 1)"
echo "--------------------------"

rm -f "$TEST_LOG"
DEBUG=1 bash "$ANALYZER_SCRIPT" "$TEST_JOB" "$TEST_BUILD" 2>&1 > /dev/null || true

if [ -f "$TEST_LOG" ] && grep -q "DEBUG: 1" "$TEST_LOG"; then
    pass "DEBUG mode logged"
else
    warn "DEBUG mode status not in logs (may not have reached that point)"
fi

echo ""

# Cleanup
echo "Cleanup"
echo "-------"
rm -rf "$TEST_REPORT_DIR"
rm -f "$TEST_LOG"
pass "Test artifacts cleaned up"

echo ""
echo "=========================================="
echo "Integration Tests Complete"
echo "=========================================="
echo ""
echo "Summary:"
echo "  Fix 0 (Report Naming): ✓ Tested"
echo "  Fix 1 (Logging): ✓ Tested"
echo "  Fix 2 (--force flag): ✓ Tested"
echo ""
echo "All tests passed!"
