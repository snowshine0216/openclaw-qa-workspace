# Android CI Analysis - Fix Plan

**Date:** 2026-02-24  
**Version:** 1.0  
**Status:** Ready for Implementation

---

## Problem Summary

Based on the manual testing on 2026-02-24, three critical issues were identified:

### Issue 1: `manual_trigger.sh` generates empty results
**Symptoms:**
```bash
$ bash scripts/manual_trigger.sh Trigger_Library_Jobs 87
$ tail -f logs/webhook.log
[2026-02-24T10:10:56.313Z] ✓ Watched ANDROID job completed: Trigger_Library_Jobs #87 (SUCCESS)
[2026-02-24T10:10:56.313Z] Triggering ANDROID analysis for Trigger_Library_Jobs #87
[2026-02-24T10:10:56.317Z] ANDROID Analysis spawned for Trigger_Library_Jobs #87 (PID: 42346)

$ tail -f logs/analyzer_Trigger_Library_Jobs_87.log
tail: logs/analyzer_Trigger_Library_Jobs_87.log: No such file or directory
```

**Root Cause:**
- The webhook server is correctly detecting the Android job and spawning the analyzer
- The `android_analyzer.sh` script is running but **not writing to its log file** properly
- The log redirection in `android_analyzer.sh` line 31 (`exec > >(tee -a "$LOG_FILE") 2>&1`) may be failing silently

### Issue 2: Direct invocation of `android_analyzer.sh` doesn't produce results
**Symptoms:**
```bash
$ bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
[2026-02-24 18:13:25] ==========================================
[2026-02-24 18:13:25] Android Analysis started for Trigger_Library_Jobs #87
[2026-02-24 18:13:25] Report folder: Trigger_Library_Jobs_87
[2026-02-24 18:13:25] ==========================================
[2026-02-24 18:13:25] ✓ Re-using existing Android report at /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/reports/Trigger_Library_Jobs_87/android_report.docx
[2026-02-24 18:13:25] ⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload
```

**Root Cause:**
- The script is detecting an existing `android_report.docx` and exiting early (cost optimization)
- The script is **not regenerating the report** even when requested manually
- Feishu webhook URL is not set, so even if a report existed, it wouldn't be sent

### Issue 3: `android_analyzer.sh` doesn't support single CI job parsing
**Symptoms:**
- The script only accepts `<trigger_job_name> <trigger_build_number>` arguments
- There is no way to analyze a single Library job (e.g., `Library_Dossier_InfoWindow #564`)
- When debugging specific test failures, engineers need to analyze individual jobs

**Root Cause:**
- By design, the Android analyzer was built to analyze the entire trigger job tree
- The `process_android_build.js` orchestrator is hardcoded to discover all downstream jobs
- No single-job mode was implemented

---

## Fix Plan

### Fix 0: Update Report Naming Convention

**Changes Required:**

The Android report should follow the same naming pattern as web CI reports: `{JOB_NAME}_{BUILD_NUMBER}.docx` instead of `android_report.docx`.

**File:** `scripts/android_analyzer.sh`

1. **Update report filename variable:**
   ```bash
   # Old
   REPORT_DOCX="$REPORT_DIR/android_report.docx"
   
   # New
   REPORT_DOCX="$REPORT_DIR/${TRIGGER_JOB}_${TRIGGER_BUILD}.docx"
   REPORT_MD="$REPORT_DIR/${TRIGGER_JOB}_${TRIGGER_BUILD}.md"
   ```

2. **Update cost optimization check:**
   ```bash
   # Step 1: Cost optimization - skip if report already exists (unless --force)
   if [ "$FORCE_REGENERATE" = "0" ] && [ -f "$REPORT_DOCX" ]; then
     log "✓ Re-using existing Android report at $REPORT_DOCX"
     if [ -n "$FEISHU_WEBHOOK_URL" ]; then
       bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DOCX" "[Android] "
     else
       log "⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload"
     fi
     exit 0
   fi
   ```

3. **Update force regeneration cleanup:**
   ```bash
   if [ "$FORCE_REGENERATE" = "1" ]; then
       log "🔄 Force regeneration requested, removing old reports..."
       rm -f "$REPORT_MD" "$REPORT_DOCX"
       rm -f "$REPORT_DIR"/*.json
   fi
   ```

4. **Update report generation commands:**
   ```bash
   # Step 4: Generate markdown report
   log "Building Android Summary document..."
   node "$SCRIPT_DIR/generate_android_report.mjs" "$REPORT_DIR" "$TRIGGER_JOB" "$TRIGGER_BUILD"
   
   # Step 5: Convert to DOCX
   log "Converting Markdown to Docx format..."
   node "$SCRIPT_DIR/reporting/docx_converter.js" \
     "$REPORT_MD" \
     "$REPORT_DOCX"
   
   # Step 6: Upload to Feishu
   log "Dispatching Docx into designated Feishu channel..."
   bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DOCX" "[Android] "
   ```

**File:** `scripts/generate_android_report.mjs`

5. **Update markdown output filename:**
   ```javascript
   // In generateAndroidReport function
   const reportPath = path.join(reportDir, `${triggerJob}_${triggerBuild}.md`);
   fs.writeFileSync(reportPath, md);
   console.log(`✅ Report written to ${reportPath}`);
   ```

**Benefits:**
- Consistent naming across web and Android reports
- Easier to identify reports by job and build number
- Better file management in reports directory

**Priority:** HIGH (do this first, affects all other fixes)

---

### Fix 1: Improve Logging and Error Handling in `android_analyzer.sh`

**Changes Required:**

1. **Make log directory creation more robust:**
   ```bash
   mkdir -p "$LOGS_DIR" || {
       echo "ERROR: Cannot create logs directory: $LOGS_DIR" >&2
       exit 1
   }
   ```

2. **Add explicit log file creation before redirection:**
   ```bash
   touch "$LOG_FILE" || {
       echo "ERROR: Cannot create log file: $LOG_FILE" >&2
       exit 1
   }
   ```

3. **Add verbose mode for debugging:**
   ```bash
   # Add after argument parsing
   if [ "${DEBUG:-0}" = "1" ]; then
       set -x
   fi
   ```

4. **Log environment variables at startup:**
   ```bash
   log "Environment check:"
   log "  JENKINS_URL: $JENKINS_URL"
   log "  JENKINS_USER: ${JENKINS_USER:-(not set)}"
   log "  FEISHU_WEBHOOK_URL: ${FEISHU_WEBHOOK_URL:-(not set)}"
   log "  ANDROID_JENKINS_URL: ${ANDROID_JENKINS_URL:-(not set)}"
   ```

5. **Add error trapping:**
   ```bash
   trap 'log "❌ Script failed at line $LINENO"; rm -f "$HEARTBEAT_FILE"; exit 1' ERR
   ```

**File:** `scripts/android_analyzer.sh`  
**Lines:** 1-50  
**Priority:** HIGH

---

### Fix 2: Add `--force` Flag to Regenerate Reports

**Changes Required:**

1. **Update argument parsing to support `--force`:**
   ```bash
   TRIGGER_JOB=""
   TRIGGER_BUILD=""
   FORCE_REGENERATE=0
   
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
   ```

2. **Update cost optimization check:**
   ```bash
   # Step 1: Cost optimization - skip if report already exists (unless --force)
   if [ "$FORCE_REGENERATE" = "0" ] && [ -f "$REPORT_DIR/android_report.docx" ]; then
     log "✓ Re-using existing Android report at $REPORT_DIR/android_report.docx"
     if [ -n "$FEISHU_WEBHOOK_URL" ]; then
       bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DIR/android_report.docx" "[Android] "
     else
       log "⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload"
     fi
     exit 0
   fi
   
   if [ "$FORCE_REGENERATE" = "1" ]; then
       log "🔄 Force regeneration requested, removing old reports..."
       rm -f "$REPORT_DIR/android_report.md" "$REPORT_DIR/android_report.docx"
       rm -f "$REPORT_DIR"/*.json
   fi
   ```

3. **Update usage message:**
   ```bash
   if [ -z "$TRIGGER_JOB" ] || [ -z "$TRIGGER_BUILD" ]; then
       echo "Usage: bash android_analyzer.sh [--force] <trigger_job_name> <trigger_build_number>"
       echo ""
       echo "Options:"
       echo "  --force, -f    Force regeneration even if report exists"
       echo ""
       echo "Examples:"
       echo "  bash android_analyzer.sh Trigger_Library_Jobs 89"
       echo "  bash android_analyzer.sh --force Trigger_Library_Jobs 89"
       exit 1
   fi
   ```

**File:** `scripts/android_analyzer.sh`  
**Lines:** 10-60  
**Priority:** HIGH

---

### Fix 3: Set Feishu Webhook URL in Environment

**Changes Required:**

1. **Add to `.env` file (if exists):**
   ```bash
   FEISHU_WEBHOOK_URL=<webhook_url_from_TOOLS.md>
   ```

2. **Or add to PM2 ecosystem config:**
   ```javascript
   // In webhook_server.js config
   module.exports = {
     apps: [{
       name: 'jenkins-webhook',
       script: './server/index.js',
       env: {
         NODE_ENV: 'production',
         PORT: 9090,
         FEISHU_WEBHOOK_URL: '<webhook_url_from_TOOLS.md>'
       }
     }]
   }
   ```

3. **Or export in shell before running:**
   ```bash
   export FEISHU_WEBHOOK_URL=<webhook_url_from_TOOLS.md>
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```

**Note:** The webhook URL should be read from `TOOLS.md` (chat_id: oc_f15b73b877ad243886efaa1e99018807)

**File:** Environment configuration  
**Priority:** MEDIUM

---

### Fix 4: Implement Single Job Analysis Mode

**Design:**

Add a new entry point script `android_analyzer_single.sh` that analyzes one Library job in isolation.

**New Script: `scripts/android_analyzer_single.sh`**

```bash
#!/bin/bash
# android_analyzer_single.sh - Analyze a single Android Library CI job
#
# Usage: bash android_analyzer_single.sh <job_name> <build_number>
# Example: bash android_analyzer_single.sh Library_Dossier_InfoWindow 564

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TMP_DIR="$PROJECT_DIR/tmp"
LOGS_DIR="$PROJECT_DIR/logs"
REPORTS_DIR="$PROJECT_DIR/reports"

# Configuration
export JENKINS_URL="${JENKINS_URL:-http://tec-l-1081462.labs.microstrategy.com:8080/}"
export JENKINS_USER="${JENKINS_USER:-admin}"
export JENKINS_API_TOKEN="${JENKINS_API_TOKEN:-11596241e9625bf6e48aca51bf0af0a036}"

JOB_NAME="$1"
BUILD_NUMBER="$2"

if [ -z "$JOB_NAME" ] || [ -z "$BUILD_NUMBER" ]; then
    echo "Usage: bash android_analyzer_single.sh <job_name> <build_number>"
    echo ""
    echo "Examples:"
    echo "  bash android_analyzer_single.sh Library_Dossier_InfoWindow 564"
    echo "  bash android_analyzer_single.sh Library_CustomApp_Cache 312"
    echo ""
    echo "This analyzes a single Android Library job in isolation."
    exit 1
fi

REPORT_FOLDER="${JOB_NAME}_${BUILD_NUMBER}"
REPORT_DIR="$REPORTS_DIR/$REPORT_FOLDER"

mkdir -p "$LOGS_DIR"
mkdir -p "$REPORT_DIR"
LOG_FILE="$LOGS_DIR/android_single_${JOB_NAME}_${BUILD_NUMBER}.log"
exec > >(tee -a "$LOG_FILE") 2>&1

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

log "=========================================="
log "Android Single Job Analysis: $JOB_NAME #$BUILD_NUMBER"
log "Report folder: $REPORT_FOLDER"
log "=========================================="

# Parse the single job directly
log "Executing single job analysis..."
node "$SCRIPT_DIR/pipeline/process_android_single.js" \
  --job "$JOB_NAME" \
  --build "$BUILD_NUMBER" \
  --output-dir "$REPORT_DIR"

if [ $? -ne 0 ]; then
   log "❌ Single job analysis failed"
   exit 1
fi

# Generate markdown report
log "Building single job report..."
node "$SCRIPT_DIR/generate_android_single_report.mjs" \
  "$REPORT_DIR" \
  "$JOB_NAME" \
  "$BUILD_NUMBER"

# Convert to DOCX
log "Converting Markdown to Docx..."
node "$SCRIPT_DIR/reporting/docx_converter.js" \
  "$REPORT_DIR/android_single_report.md" \
  "$REPORT_DIR/android_single_report.docx"

log "✅ Single job analysis completed successfully"
log "Report: $REPORT_DIR/android_single_report.docx"
```

**New Module: `scripts/pipeline/process_android_single.js`**

```javascript
const parser = require('../android/extent_parser');
const classifier = require('../android/failure_classifier');
const crypto = require('crypto');
const dbOperations = require('../database/operations');
const schema = require('../database/schema');
const path = require('path');
const fs = require('fs');

class JenkinsClient {
  constructor(baseUrl, user, token) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.authHeader = Buffer.from(`${user}:${token}`).toString('base64');
  }

  async fetch(endpoint) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const res = await fetch(url, { headers: { Authorization: `Basic ${this.authHeader}` }});
    if (!res.ok) {
      if (res.status === 404) return {};
      throw new Error(`Jenkins API ${url} failed: ${res.statusText}`);
    }
    return res.json();
  }

  async fetchRaw(endpoint) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const res = await fetch(url, { headers: { Authorization: `Basic ${this.authHeader}` }});
    if (!res.ok) {
      if (res.status === 404) return '';
      throw new Error(`Jenkins API raw ${url} failed: ${res.statusText}`);
    }
    return res.text();
  }
}

function computeFingerprint(jobName, tcId, testName, failureType) {
  const hash = crypto.createHash('sha256');
  hash.update(`${jobName}|${tcId || 'Unknown'}|${testName}|${failureType}`);
  return hash.digest('hex');
}

async function analyzeSingleJob(jobName, buildNum, outputDir) {
  const rootDir = path.resolve(__dirname, '..');
  const dbPath = path.join(rootDir, 'data', 'jenkins_history.db');
  
  const jenkinsUrl = process.env.ANDROID_JENKINS_URL || process.env.JENKINS_URL || 'http://ci-master.labs.microstrategy.com:8011';
  const jenkinsUser = process.env.ANDROID_JENKINS_USER || process.env.JENKINS_USER;
  const jenkinsToken = process.env.ANDROID_JENKINS_API_TOKEN || process.env.JENKINS_API_TOKEN;

  if (!jenkinsUser || !jenkinsToken) {
    throw new Error("Missing Jenkins credentials in environment");
  }

  const client = new JenkinsClient(jenkinsUrl, jenkinsUser, jenkinsToken);

  console.log(`🔍 Analyzing single job: ${jobName} #${buildNum}...`);
  
  // Fetch job build info
  const buildInfo = await client.fetch(`/job/${jobName}/${buildNum}/api/json`);
  const result = buildInfo.result || 'UNKNOWN';
  
  console.log(`📊 Job status: ${result}`);

  fs.mkdirSync(outputDir, { recursive: true });

  const db = await schema.openDb(dbPath);
  
  // Create a synthetic run entry for this single job
  const jobLink = `${jenkinsUrl}/job/${jobName}/${buildNum}`;
  const runId = dbOperations.insertJobRun(db, {
    jobName: jobName, 
    jobBuild: buildNum, 
    jobLink: jobLink, 
    passCount: result === 'SUCCESS' ? 1 : 0, 
    failCount: result === 'SUCCESS' ? 0 : 1, 
    platform: 'android',
    triggerJob: 'MANUAL_SINGLE',
    triggerBuild: buildNum
  });

  if (result === 'SUCCESS') {
    console.log('✅ Job passed - no failures to analyze');
    fs.writeFileSync(path.join(outputDir, 'job_status.json'), JSON.stringify({
      jobName, buildNum, result, failures: []
    }, null, 2));
    db.close();
    return;
  }

  const failedJobId = dbOperations.insertFailedJob(db, runId, {
     jobName: jobName,
     jobBuild: buildNum,
     jobLink: jobLink
  });

  console.log(`🌐 Fetching ExtentReport for ${jobName} #${buildNum}`);
  const extentResults = await parser.parseExtentReport(jobName, buildNum, client);
  const actualFailures = extentResults.filter(r => r.status === 'FAIL');

  if (actualFailures.length === 0) {
    console.warn(`   ⚠ No explicit ExtentReport failures found, flagging unknown`);
  }

  const failureLog = [];

  for (const failure of actualFailures) {
    const type = classifier.classifyFailure(failure, failure.testName);
    const fingerprint = computeFingerprint(jobName, failure.tcId, failure.testName, type);
    
    const prevData = dbOperations.findLastFailedBuild(db, jobName, fingerprint, buildNum, 'android');

    dbOperations.insertFailedStep(db, failedJobId, {
      platform: 'android',
      tcId: failure.tcId || 'N/A',
      tcIdRaw: failure.tcId || null,
      tcName: failure.testName || 'Unknown Test',
      stepId: failure.failedStepName || 'N/A',
      stepName: failure.failedStepName || 'Unknown Step',
      runLabel: 'run_1',
      failureType: type,
      failureMsg: (failure.failedStepDetails || '').slice(0, 150),
      fullErrorMsg: failure.failedStepDetails,
      errorFingerprint: fingerprint,
      lastFailedBuild: prevData.lastFailedBuild,
      isRecurring: prevData.isRecurring,
      configUrl: failure.configUrl,
      failedStepName: failure.failedStepName
    });

    failureLog.push({
      jobName: jobName,
      buildNum: buildNum,
      testResult: failure,
      failureType: type
    });
  }

  fs.writeFileSync(path.join(outputDir, 'extent_failures.json'), JSON.stringify(failureLog, null, 2));
  console.log(`✅ Single job analysis complete. Found ${failureLog.length} failures.`);
  
  db.close();
}

module.exports = {
  analyzeSingleJob
};

// CLI entry point
if (require.main === module) {
  const args = require('yargs')
    .option('job', { type: 'string', required: true })
    .option('build', { type: 'number', required: true })
    .option('output-dir', { type: 'string', required: true })
    .argv;
    
  analyzeSingleJob(args.job, args.build, args['output-dir']).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
```

**New Report Generator: `scripts/generate_android_single_report.mjs`**

```javascript
import fs from 'fs';
import path from 'path';

function generateSingleJobReport(reportDir, jobName, buildNum) {
  const failuresPath = path.join(reportDir, 'extent_failures.json');
  
  if (!fs.existsSync(failuresPath)) {
    throw new Error(`Missing extent_failures.json in ${reportDir}`);
  }

  const failures = JSON.parse(fs.readFileSync(failuresPath, 'utf-8'));
  
  let md = `# Android Single Job Report — ${jobName} #${buildNum}\n\n`;
  md += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Job:** ${jobName}\n`;
  md += `**Build:** #${buildNum}\n\n`;
  
  md += `## Summary\n\n`;
  md += `- Total test failures: ${failures.length}\n`;
  
  const screenshotFails = failures.filter(f => f.failureType === 'screenshot_failure').length;
  const scriptFails = failures.filter(f => f.failureType === 'script_play_failure').length;
  
  md += `- Screenshot failures: ${screenshotFails}\n`;
  md += `- Script play failures: ${scriptFails}\n\n`;
  
  if (failures.length === 0) {
    md += `✅ No failures detected.\n\n`;
    fs.writeFileSync(path.join(reportDir, 'android_single_report.md'), md);
    return;
  }

  md += `## Test Failures\n\n`;
  md += `| TC ID | Test Name | Failure Type | Failed Step | Details |\n`;
  md += `|-------|-----------|--------------|-------------|----------|\n`;
  
  for (const fail of failures) {
    const tr = fail.testResult;
    md += `| ${tr.tcId || 'N/A'} | ${tr.testName} | ${fail.failureType} | ${tr.failedStepName || 'N/A'} | ${(tr.failedStepDetails || '').slice(0, 50)}... |\n`;
  }
  
  md += `\n---\n\n`;
  
  md += `## Detailed Failures\n\n`;
  
  for (const fail of failures) {
    const tr = fail.testResult;
    md += `### ${tr.testName}\n\n`;
    md += `**TC ID:** ${tr.tcId || 'N/A'}\n`;
    md += `**Failure Type:** ${fail.failureType}\n`;
    md += `**Failed Step:** ${tr.failedStepName || 'N/A'}\n`;
    if (tr.configUrl) {
      md += `**Config URL:** \`${tr.configUrl}\`\n`;
    }
    md += `\n**Error Details:**\n\n`;
    md += `\`\`\`\n${tr.failedStepDetails || 'N/A'}\n\`\`\`\n\n`;
    md += `---\n\n`;
  }
  
  fs.writeFileSync(path.join(reportDir, 'android_single_report.md'), md);
  console.log(`✅ Report written to ${path.join(reportDir, 'android_single_report.md')}`);
}

// CLI entry point
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [reportDir, jobName, buildNum] = process.argv.slice(2);
  
  if (!reportDir || !jobName || !buildNum) {
    console.error('Usage: node generate_android_single_report.mjs <report_dir> <job_name> <build_num>');
    process.exit(1);
  }
  
  generateSingleJobReport(reportDir, jobName, parseInt(buildNum));
}

export { generateSingleJobReport };
```

**File:** New files (3 total)  
**Priority:** MEDIUM

---

## Implementation Order

### Phase 1: Critical Fixes (Do First)

**0. Fix 0: Report naming** (15 min) ⚡ **DO THIS FIRST**
   - Update report filename variables
   - Align with web CI naming convention
   - Required by all other fixes

1. **Fix 1: Logging improvements** (1 hour)
   - Better error handling
   - Verbose mode
   - Environment logging
   
2. **Fix 2: Add --force flag** (30 min)
   - Force report regeneration
   - Update usage docs

3. **Fix 3: Set Feishu webhook** (15 min)
   - Add to environment
   - Test delivery

### Phase 2: Feature Addition (Do After)
4. **Fix 4: Single job mode** (2-3 hours)
   - New entry script
   - New pipeline module
   - New report generator
   - Update docs

---

## Testing Protocol

### Test 0: Report naming
```bash
# Clean old reports
rm -rf reports/Trigger_Library_Jobs_87/

# Run analyzer
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87

# Verify correct filename
ls -lh reports/Trigger_Library_Jobs_87/
# Should see: Trigger_Library_Jobs_87.md and Trigger_Library_Jobs_87.docx
# NOT: android_report.md or android_report.docx
```

**Expected:**
- Report files named `Trigger_Library_Jobs_87.md` and `Trigger_Library_Jobs_87.docx`
- Matches web CI naming pattern

### Test 1: Manual trigger with logging
```bash
# Clean old reports
rm -rf reports/Trigger_Library_Jobs_87/

# Set debug mode
export DEBUG=1

# Run analyzer
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87

# Verify log file created
ls -lh logs/android_analyzer_Trigger_Library_Jobs_87.log
cat logs/android_analyzer_Trigger_Library_Jobs_87.log
```

**Expected:**
- Log file created immediately
- Environment variables logged
- Clear error messages if anything fails

### Test 2: Force regeneration
```bash
# First run (normal)
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87

# Second run (cached)
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
# Should exit early with "Re-using existing report"

# Third run (force)
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87
# Should regenerate from scratch
```

**Expected:**
- First run: full analysis
- Second run: cache hit, early exit
- Third run: cache deleted, full re-analysis

### Test 3: Feishu delivery
```bash
# Set webhook URL
export FEISHU_WEBHOOK_URL=<from_TOOLS.md>

# Run analyzer
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87

# Check Feishu chat
# Should receive: "[Android] Library CI Report — Trigger_Library_Jobs #87"
```

**Expected:**
- Report uploaded to Feishu
- Message visible in chat (oc_f15b73b877ad243886efaa1e99018807)

### Test 4: Single job analysis
```bash
# Analyze a single failed job
bash scripts/android_analyzer_single.sh Library_Dossier_InfoWindow 564

# Check output
ls -lh reports/Library_Dossier_InfoWindow_564/
cat reports/Library_Dossier_InfoWindow_564/android_single_report.md
```

**Expected:**
- Single job report generated
- Only failures from that job listed
- No trigger job context

---

## Success Criteria

✅ **Fix 0 Complete:**
- Report files named `{JOB_NAME}_{BUILD_NUMBER}.md` and `.docx`
- No more `android_report.docx` generic naming
- Consistent with web CI naming pattern

✅ **Fix 1 Complete:**
- Log files created immediately
- Clear error messages visible
- Environment variables logged

✅ **Fix 2 Complete:**
- `--force` flag works
- Cache bypass functional
- Old reports deleted before regeneration

✅ **Fix 3 Complete:**
- Feishu webhook URL set
- Reports delivered to chat
- Message format correct

✅ **Fix 4 Complete:**
- Single job script works
- Single job report generated
- No trigger job required

---

## Rollback Plan

If any fix causes problems:

1. **Revert the specific file:**
   ```bash
   git checkout HEAD -- scripts/android_analyzer.sh
   ```

2. **Remove new files (Fix 4 only):**
   ```bash
   rm scripts/android_analyzer_single.sh
   rm scripts/pipeline/process_android_single.js
   rm scripts/generate_android_single_report.mjs
   ```

3. **Clear bad reports:**
   ```bash
   rm -rf reports/Trigger_Library_Jobs_87/
   ```

---

## Documentation Updates

After implementation, update:

1. **ANDROID_DESIGN.md §7.6:**
   - Update report naming in examples
   - Add `--force` flag to usage examples
   - Document single job mode

2. **README.md:**
   - Update report filename examples
   - Add troubleshooting section
   - Document DEBUG mode
   - Add single job examples

3. **TOOLS.md:**
   - Confirm Feishu webhook URL is documented
   - Add Jenkins credentials reference

---

## Files Modified Summary

### Phase 1 Changes
- ✏️ **scripts/android_analyzer.sh** 
  - Report naming (Fix 0)
  - Logging improvements (Fix 1)
  - Error handling (Fix 1)
  - --force flag (Fix 2)
  
- ✏️ **scripts/generate_android_report.mjs**
  - Update output filename to use job name + build number (Fix 0)
  
- 📝 **Environment** 
  - Set FEISHU_WEBHOOK_URL (Fix 3)

### Phase 2 Additions
- ➕ **scripts/android_analyzer_single.sh** (new entry script)
- ➕ **scripts/pipeline/process_android_single.js** (new module)
- ➕ **scripts/generate_android_single_report.mjs** (new report generator)

---

**Next Steps:** Implement Fix 0 first (report naming), then remaining Phase 1 fixes, then test thoroughly before moving to Phase 2.
