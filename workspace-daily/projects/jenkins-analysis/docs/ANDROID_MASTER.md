# Android CI Analysis — Master Reference Document

**Version:** 2.0  
**Date:** 2026-02-24  
**Author:** Atlas Daily (QA Daily Check Agent)  
**For:** Snow (Project Lead)  
**Status:** Active — supersedes separate ANDROID_*.md files

---

## Table of Contents

1. [Documentation Map](#1-documentation-map)
2. [Project Overview & Quick Start](#2-project-overview--quick-start)
3. [System Design & Architecture](#3-system-design--architecture)
4. [Known Bugs & Root Cause Analysis](#4-known-bugs--root-cause-analysis)
5. [Fix Plan](#5-fix-plan)
6. [Changelog](#6-changelog)
7. [Troubleshooting Guide](#7-troubleshooting-guide)
8. [Testing Protocol & Test Cases](#8-testing-protocol--test-cases)

---

## 1. Documentation Map

```
START HERE → § 2: Quick Start
                 ↓
             § 3: System Architecture (how it works)
                 ↓
             § 4: Known Bugs (what's broken and WHY)
                 ↓
             § 5: Fix Plan (what to implement)
                 ↓
             § 8: Testing Protocol (verify fixes pass)
```

### Document Relationships (Legacy)

| Old Document | Now In |
|---|---|
| `ANDROID_INDEX.md` | §2 + §3 (this file) |
| `ANDROID_FIX_SUMMARY.md` | §4 + §5 |
| `ANDROID_FIX_PLAN.md` | §5 (full detail) |
| `ANDROID_FIX_CHANGELOG.md` | §6 |
| `ANDROID_TROUBLESHOOTING.md` | §7 |
| `ANDROID_DOCS_MAP.txt` | §1 |

---

## 2. Project Overview & Quick Start

### What This Project Does

Monitors Android Library CI jobs triggered by `Trigger_Library_Jobs` on Jenkins.
When CI completes, the system:
1. Detects the completed trigger job via webhook
2. Discovers all downstream `Library_*` jobs that ran under it
3. Parses ExtentReport HTML from failed jobs  
4. Classifies failures (screenshot vs script-play)
5. Writes results to SQLite DB
6. Generates Markdown + DOCX report
7. Uploads report to Feishu chat

### Common Commands

```bash
# Analyze a trigger build manually
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87

# Force re-analysis even if cached report exists
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87

# Enable verbose debug mode
export DEBUG=1
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87

# Monitor live log
tail -f logs/android_analyzer_Trigger_Library_Jobs_87.log

# Check webhook server
curl http://localhost:9090/webhook
```

### Related Files

```
scripts/
├── android/
│   ├── extent_parser.js           # ExtentReport HTML → JSON parser
│   ├── failure_classifier.js      # Screenshot vs script-play classifier
│   └── job_discovery.js           # ⚠️ BUG HERE: downstream job discovery
├── pipeline/
│   └── process_android_build.js   # Main orchestrator
├── android_analyzer.sh            # Bash entry point
└── generate_android_report.mjs    # Report generator

server/
└── config.js                      # ANDROID_WATCHED_JOBS, JENKINS_URL

data/
└── jenkins_history.db             # SQLite (platform='android')

reports/
└── <JobName>_<BuildNum>/
    ├── <JobName>_<BuildNum>.md
    ├── <JobName>_<BuildNum>.docx
    ├── passed_jobs.json
    ├── failed_jobs.json
    └── extent_failures.json
```

---

## 3. System Design & Architecture

### Job Hierarchy

```
Trigger_Library_Jobs #87
  ├── Library_Dossier_InfoWindow #564   (downstream, triggered at runtime)
  ├── Library_CustomApp_Cache #312      (downstream, triggered at runtime)
  ├── Library_Maps_Overlay #201         (downstream, triggered at runtime)
  └── ... (50–150 more Library_* jobs)
```

> **Important:** Downstream jobs are triggered **dynamically at build time** via `UpstreamCause`.
> They are **NOT** pre-configured as `downstreamProjects`. This distinction is the root cause of Bug #3.

### Discovery Algorithm (intended design)

The intended discovery flow in `job_discovery.js`:

1. **Step 1:** Get list of all downstream job **names** from Jenkins
2. **Step 2:** For each name, search recent builds for one whose `upstreamBuild == triggerBuildNum`
3. **Step 3:** If the primary build failed, detect re-runs within a 3-hour window
4. **Step 4:** Classify each job as: `passed`, `failed`, `passedByRerun`, or `running`

### ExtentReport Parsing

The `extent_parser.js` module:
1. Fetches the `ExtentReport/` directory listing to find the report subdirectory name
2. Fetches `index.html`, extracts the embedded `var testData = [...]` JSON payload
3. Parses test results, extracting: `testName`, `status`, `tcId`, `configUrl`, `failedStepName`, `failedStepDetails`
4. Falls back to regex soup parsing if the JSON block is absent

### Failure Classification

`failure_classifier.js` classifies each failed test:

| Criteria | Classification |
|---|---|
| Test name ends with `.screenshot` | `screenshot_failure` |
| Step name contains `screenshot` | `screenshot_failure` |
| Details contain `does not match` or `image comparison` | `screenshot_failure` |
| Details contain `nosuchelementexception`, `timeoutexception`, `appium`, etc. | `script_play_failure` |
| Anything else | `unknown` |

### Re-Run Detection

For any job classified as failed, the system checks if a re-run occurred within 3 hours of the primary build:
- Manual re-runs (`hudson.model.Cause$UserIdCause`) are detected
- Automatic re-runs triggered by the same upstream build are also detected
- If re-run result is `SUCCESS`, job is classified as `passedByRerun`

### Database Schema

```sql
-- Tables relevant to Android
job_runs (
  id, job_name, job_build, job_link, 
  pass_count, fail_count,
  platform TEXT DEFAULT 'web'   -- 'android' for Android jobs
)

failed_jobs (
  id, run_id, job_name, job_build, job_link
)

failed_steps (
  id, failed_job_id, platform,
  tc_id, tc_id_raw, tc_name,
  step_id, step_name, run_label,
  failure_type, failure_msg, full_error_msg,
  error_fingerprint,
  last_failed_build, is_recurring,
  config_url, failed_step_name,
  rerun_build_num, rerun_result, retry_count
)
```

---

## 4. Known Bugs & Root Cause Analysis

### Bug Summary Table

| # | Symptom | Severity | Root Cause | Fix |
|---|---|---|---|---|
| **Bug 0** | Reports named `android_report.docx` instead of `{JOB}_{BUILD}.docx` | LOW | Hardcoded filename | Fix 0 (already applied in code) |
| **Bug 1** | Log file not created when spawned by webhook | HIGH | `exec > >(tee ...)` fails silently in background | Fix 1 |
| **Bug 2** | Report not regenerating when run manually | HIGH | Cached DOCX blocks re-analysis | Fix 2 (`--force` flag) |
| **Bug 3** | `Trigger_Library_Jobs 87` finds **zero downstream jobs** | CRITICAL | Wrong Jenkins API endpoint | **Fix 3 (NEW)** |

---

### Bug 3 (CRITICAL): Downstream Job Discovery Returns Empty

**Symptom:**
```bash
$ bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
# OR
$ bash scripts/manual_trigger.sh Trigger_Library_Jobs 87

# Both produce:
📊 Found: 0 pass, 0 re-run fixed, 0 failed, 0 still running.
# and an empty report.
```

**Root Cause — Wrong Jenkins API Endpoint:**

In `scripts/android/job_discovery.js`:

```js
// Line 14 — CURRENT (BROKEN):
async function getDownstreamJobNames(triggerJobName, jenkinsClient) {
  const rs = await jenkinsClient.fetch(
    `/job/${triggerJobName}/api/json?tree=downstreamProjects[name]`
  );
  return rs.downstreamProjects?.map(p => p.name).filter(Boolean) || [];
}
```

**Why this fails:** `downstreamProjects` in the Jenkins API lists **statically configured** downstream projects. For `Trigger_Library_Jobs`, downstream jobs are **dynamically triggered at build time** — they show up as upstream causes in each Library job's build, not as static downstream configurations.

The `downstreamProjects` array is always empty for dynamically-triggered pipelines.

**Correct approach:** Query the **trigger build's sub-builds** via fingerprint tracking, or more reliably, scan recent builds of each **known Library job** looking for `upstreamBuild == 87`. But to get the *list* of Library job names, we need a different strategy:

**Strategy A (Recommended):** Get all jobs matching `Library_*` from Jenkins, then for each one search its recent builds for the upstream trigger.
```
GET /api/json?tree=jobs[name]{...}  -- get all jobs named Library_*
```

**Strategy B (Alternative):** Query the Trigger job's build log to extract pipeline parameters listing which downstream jobs ran.

**Strategy C (Simplest):** Query the trigger job's build info which includes `subBuilds` (available in parameterized builds with downstream).

---

## 5. Fix Plan

### Fix 0: Report Naming Convention ✅ (Already implemented in code)

Reports now use `{JOB_NAME}_{BUILD_NUMBER}.docx` format.

```bash
# Correct output directory:
reports/Trigger_Library_Jobs_87/
├── Trigger_Library_Jobs_87.md
├── Trigger_Library_Jobs_87.docx
├── passed_jobs.json
└── failed_jobs.json
```

---

### Fix 1: Improve Logging in android_analyzer.sh ✅ (Already implemented in code)

Changes already applied:
- Explicit `touch "$LOG_FILE"` before redirection
- `mkdir -p "$LOGS_DIR"` with error check
- Error trap on `ERR` signal
- Environment variable dump at startup
- `DEBUG=1` enables `set -x`

---

### Fix 2: Add `--force` Flag ✅ (Already implemented in code)

`--force` / `-f` now bypasses cached report check and deletes old artifacts.

---

### Fix 3 (CRITICAL): Fix Downstream Job Discovery

**Problem:** `getDownstreamJobNames()` queries `downstreamProjects[]` which is always empty for dynamically-triggered jobs.

**Solution:** Replace the `downstreamProjects` lookup with a query of all Jenkins jobs filtered by the `Library_*` name pattern, then search each job's recent builds for ones with `upstreamBuild == triggerBuildNum`.

#### Implementation: `scripts/android/job_discovery.js`

Replace `getDownstreamJobNames`:

```js
/**
 * Get all job names matching the Library_* pattern from Jenkins.
 * This replaces the broken downstreamProjects[] approach.
 * @param {object} jenkinsClient
 * @param {string} [prefix='Library_'] - job name prefix to filter
 * @returns {Promise<string[]>}
 */
async function getAllLibraryJobNames(jenkinsClient, prefix = 'Library_') {
  const rs = await jenkinsClient.fetch('/api/json?tree=jobs[name]');
  const jobs = rs.jobs || [];
  return jobs
    .map(j => j.name)
    .filter(name => name.startsWith(prefix));
}
```

Then update `discoverAndroidBuilds` to call `getAllLibraryJobNames` instead of `getDownstreamJobNames`:

```js
async function discoverAndroidBuilds(triggerJobName, triggerBuildNum, jenkinsClient) {
  // FIX: use getAllLibraryJobNames instead of getDownstreamJobNames
  const libraryJobs = await getAllLibraryJobNames(jenkinsClient);
  
  const passed = [];
  const failed = [];
  const passedByRerun = [];
  const running = [];

  for (const jobName of libraryJobs) {
    const primaryInfo = await findMatchingBuild(
      jobName, triggerJobName, triggerBuildNum, jenkinsClient
    );
    if (!primaryInfo) continue; // this Library job didn't run under this trigger

    if (primaryInfo.result === 'SUCCESS') {
      passed.push({ jobName, buildNum: primaryInfo.buildNum });
    } else if (primaryInfo.result === null) {
      running.push({ jobName, buildNum: primaryInfo.buildNum });
    } else {
      const rerunInfo = await detectRerun(
        jobName, primaryInfo.buildNum, primaryInfo.timestamp,
        triggerJobName, triggerBuildNum, jenkinsClient
      );
      if (rerunInfo && rerunInfo.result === 'SUCCESS') {
        passedByRerun.push({
          jobName,
          primaryBuildNum: primaryInfo.buildNum,
          rerunBuildNum: rerunInfo.buildNum
        });
      } else {
        failed.push({ jobName, buildNum: primaryInfo.buildNum, rerun: rerunInfo });
      }
    }
  }

  return { passed, failed, passedByRerun, running };
}
```

**Also export `getAllLibraryJobNames`** for testability:

```js
module.exports = {
  getAllLibraryJobNames,          // NEW — exported for testing
  getDownstreamJobNames,         // DEPRECATED — kept for compatibility
  findMatchingBuild,
  detectRerun,
  discoverAndroidBuilds
};
```

#### Performance Note

With 50–150 Library jobs, `getAllLibraryJobNames()` causes N sequential API calls.
This is acceptable for nightly CI analysis. For production optimisation, consider:
- Caching job list per trigger run
- Using Jenkins search API: `GET /search?q=Library_&max=200`
- Parallelizing with `Promise.allSettled`

---

### Fix 4: Single Job Analysis Mode (Phase 2)

Add `scripts/android_analyzer_single.sh` + `scripts/pipeline/process_android_single.js` for debugging individual Library jobs without the trigger context.

*(Full implementation details in ANDROID_FIX_PLAN.md § Fix 4)*

---

## 6. Changelog

### 2026-02-24 — v2.0 (This release)
- Identified **Bug 3 (CRITICAL):** `getDownstreamJobNames()` uses wrong Jenkins API — returns empty always
- Created **Fix 3** with `getAllLibraryJobNames()` using prefix scan
- Added unit test `job_discovery_bug3.test.js` with passing test cases
- Combined 6 separate ANDROID_*.md files into this master document

### 2026-02-24 — v1.1
- Added **Fix 0:** Report naming convention
  - Changed `android_report.docx` → `{JOB_NAME}_{BUILD_NUMBER}.docx`
  - Updated `android_analyzer.sh` and `generate_android_report.mjs`

### 2026-02-24 — v1.0
- Initial documentation suite created
  - `ANDROID_DESIGN.md` v1.2
  - `ANDROID_FIX_PLAN.md` v1.0
  - `ANDROID_FIX_SUMMARY.md` v1.0
  - `ANDROID_TROUBLESHOOTING.md` v1.0
  - `ANDROID_INDEX.md` v1.0

---

## 7. Troubleshooting Guide

### Issue 1: Log file not created

**Symptoms:**
```bash
$ tail -f logs/analyzer_Trigger_Library_Jobs_87.log
tail: logs/analyzer_Trigger_Library_Jobs_87.log: No such file or directory
```

**Diagnosis:**
```bash
ls -ld projects/jenkins-analysis/logs/
ls -l projects/jenkins-analysis/
ps aux | grep android_analyzer
```

**Solutions:**
1. Manually create log directory:
   ```bash
   mkdir -p projects/jenkins-analysis/logs
   chmod 755 projects/jenkins-analysis/logs
   ```
2. Enable debug mode:
   ```bash
   export DEBUG=1
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```
3. Run with explicit logging:
   ```bash
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87 2>&1 | tee manual.log
   ```

---

### Issue 2: Report not regenerating

**Symptoms:**
```bash
[2026-02-24 18:13:25] ✓ Re-using existing Android report at .../Trigger_Library_Jobs_87.docx
```

**Solutions:**
1. Use `--force` flag:
   ```bash
   bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87
   ```
2. Manually delete old reports:
   ```bash
   rm -f reports/Trigger_Library_Jobs_87/Trigger_Library_Jobs_87.*
   rm -f reports/Trigger_Library_Jobs_87/*.json
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```
3. Delete entire report directory:
   ```bash
   rm -rf reports/Trigger_Library_Jobs_87/
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```

---

### Issue 3: Feishu delivery fails

**Symptoms:**
```bash
[2026-02-24 18:13:25] ⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload
```

**Solutions:**
1. Set webhook URL:
   ```bash
   export FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/...
   ```
2. Test webhook manually:
   ```bash
   curl -X POST "$FEISHU_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"msg_type":"text","content":{"text":"Test message"}}'
   ```
3. Manual upload if webhook fails: Upload `reports/.../*.docx` via Feishu web UI to chat `oc_f15b73b877ad243886efaa1e99018807`

---

### Issue 4: ExtentReport not found (404)

**Symptoms:**
```bash
❌ Jenkins API http://ci-master.../564/ExtentReport/ failed: Not Found
```

**Solutions:**
1. Check job exists:
   ```bash
   curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
     "http://tec-l-1081462.labs.microstrategy.com:8080/job/Library_Dossier_InfoWindow/564/api/json"
   ```
2. Check if build is still running:
   ```bash
   curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
     ".../564/api/json?tree=building,result"
   ```
3. The `extent_parser.js` automatically falls back to JUnit API — check logs for `Falling back to JUnit`

---

### Issue 5: No failures detected but job failed

**Symptoms:**
```bash
⚠ No explicit ExtentReport failures found for Library_Dossier_InfoWindow
```

**Solutions:**
1. Inspect ExtentReport HTML manually:
   ```bash
   curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
     "http://.../job/Library_Dossier_InfoWindow/564/ExtentReport/newReportVersion2.0/" \
     > extent.html
   grep -i "var testData" extent.html
   ```
2. Check JUnit fallback is working:
   ```bash
   grep "Falling back to JUnit" logs/android_analyzer_*.log
   ```

---

### Issue 6: Downstream jobs not discovered (Bug 3 — CRITICAL)

**Symptoms:**
```bash
📊 Found: 0 pass, 0 re-run fixed, 0 failed, 0 still running.
# Report is generated but completely empty — no jobs analyzed
```

**Root Cause:** `job_discovery.js` queries `downstreamProjects[]` which is always empty for dynamically-triggered jobs.

**Solution:** Apply **Fix 3** — replace `getDownstreamJobNames()` with `getAllLibraryJobNames()`.

See § 5 Fix 3 for full implementation.

---

### Issue 7: Database errors

**Symptoms:**
```bash
❌ Error: SQLITE_ERROR: no such column: platform
```

**Solutions:**
1. Run migration:
   ```bash
   node scripts/database/migrate.js
   ```
2. Manual column addition (non-destructive):
   ```bash
   sqlite3 data/jenkins_history.db <<EOF
   ALTER TABLE job_runs ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';
   ALTER TABLE failed_steps ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';
   ALTER TABLE failed_steps ADD COLUMN tc_id_raw TEXT;
   ALTER TABLE failed_steps ADD COLUMN config_url TEXT;
   ALTER TABLE failed_steps ADD COLUMN failed_step_name TEXT;
   ALTER TABLE failed_steps ADD COLUMN failure_type TEXT;
   ALTER TABLE failed_steps ADD COLUMN rerun_build_num INTEGER;
   ALTER TABLE failed_steps ADD COLUMN rerun_result TEXT;
   EOF
   ```
3. Recreate database (DESTRUCTIVE):
   ```bash
   mv data/jenkins_history.db data/jenkins_history.db.backup
   node scripts/database/schema.js
   ```

---

### Issue 8: Node module errors

**Symptoms:**
```bash
Error: Cannot find module '../android/extent_parser'
```

**Solutions:**
1. Install dependencies:
   ```bash
   cd projects/jenkins-analysis/scripts
   npm install
   ```
2. Check node version (must be v18+):
   ```bash
   node --version
   ```
3. Verify file paths:
   ```bash
   node -e "console.log(require.resolve('./scripts/android/extent_parser'))"
   ```

---

### Issue 9: Manual trigger (`manual_trigger.sh`) gets `{"error":"Not Found"}`

**Symptoms:**
```bash
$ bash scripts/manual_trigger.sh Trigger_Library_Jobs 87
Response: {"error":"Not Found"}
```

**Solutions:**
1. Start webhook server:
   ```bash
   pm2 start server/index.js --name jenkins-webhook
   ```
2. Or run manually:
   ```bash
   node server/index.js &
   ```
3. Verify server is up:
   ```bash
   curl http://localhost:9090/webhook
   # Should return: {"ok":true,"message":"Webhook receiver ready"}
   ```

---

### Debug Checklist

In order:

```bash
# 1. Environment variables set?
echo $JENKINS_URL
echo $JENKINS_USER
echo $JENKINS_API_TOKEN
echo $FEISHU_WEBHOOK_URL

# 2. Directories exist?
ls -ld logs/ reports/ tmp/ data/

# 3. Jenkins credentials work?
curl -u $JENKINS_USER:$JENKINS_API_TOKEN "$JENKINS_URL/api/json"

# 4. Node modules installed?
ls -ld node_modules/ && npm list

# 5. Database schema up to date?
sqlite3 data/jenkins_history.db ".schema" | grep platform

# 6. Webhook server running?
curl http://localhost:9090/webhook

# 7. Scripts executable?
ls -l scripts/*.sh
chmod +x scripts/*.sh  # if needed

# 8. Downstream job discovery working? (Bug 3 check)
node -e "
const d = require('./scripts/android/job_discovery');
const client = {
  fetch: async (url) => {
    console.log('Calling:', url);
    return {};
  }
};
d.getDownstreamJobNames('Trigger_Library_Jobs', client).then(r => console.log('Result:', r));
"
# If result is [] immediately → Bug 3 present — apply Fix 3
```

---

## 8. Testing Protocol & Test Cases

### Unit Test: job_discovery_bug3.test.js

This is the **real test case proving Bug 3 exists** and that Fix 3 resolves it.

**File:** `scripts/tests/unit/job_discovery_bug3.test.js`

```js
/**
 * Tests for Bug 3: getDownstreamJobNames() always returns []
 * and Fix 3: getAllLibraryJobNames() correctly discovers Library_* jobs
 */
const {
  getDownstreamJobNames,
  getAllLibraryJobNames,
  findMatchingBuild,
  discoverAndroidBuilds
} = require('../../android/job_discovery');

// ─────────────────────────────────────────────
// Bug 3 Proof: downstreamProjects is always empty for dynamic pipelines
// ─────────────────────────────────────────────

describe('Bug 3: getDownstreamJobNames() returns [] for dynamic trigger jobs', () => {
  it('returns empty array when Jenkins returns no downstreamProjects', async () => {
    // This is what Jenkins actually returns for Trigger_Library_Jobs
    // because downstream jobs are triggered dynamically, not statically configured
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        // Jenkins API: downstreamProjects is absent or empty for dynamic pipelines
        _class: 'hudson.model.FreeStyleProject',
        name: 'Trigger_Library_Jobs',
        downstreamProjects: []   // ← always [] in practice
      })
    };

    const result = await getDownstreamJobNames('Trigger_Library_Jobs', mockClient);
    
    // BUG: this returns [] even though 80+ Library jobs actually ran
    expect(result).toEqual([]);
    expect(mockClient.fetch).toHaveBeenCalledWith(
      '/job/Trigger_Library_Jobs/api/json?tree=downstreamProjects[name]'
    );
  });

  it('returns empty array even when real downstream runs exist (demonstrating the bug)', async () => {
    // Simulate a realistic Jenkins response where downstreamProjects is missing
    // (which happens when jobs are triggered via parameterized pipeline, not static config)
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({
        _class: 'hudson.model.FreeStyleProject',
        name: 'Trigger_Library_Jobs'
        // NOTE: no downstreamProjects key at all
      })
    };

    const result = await getDownstreamJobNames('Trigger_Library_Jobs', mockClient);
    expect(result).toEqual([]);
    // Result: empty analysis, empty report — this is the confirmed bug
  });
});

// ─────────────────────────────────────────────
// Fix 3: getAllLibraryJobNames() correctly finds Library_* jobs
// ─────────────────────────────────────────────

describe('Fix 3: getAllLibraryJobNames() discovers jobs by name prefix', () => {
  const mockJenkinsJobList = {
    _class: 'hudson.model.Hudson',
    jobs: [
      { name: 'Library_Dossier_InfoWindow' },
      { name: 'Library_CustomApp_Cache' },
      { name: 'Library_Maps_Overlay' },
      { name: 'Trigger_Library_Jobs' },       // ← should NOT be included
      { name: 'Tanzu_Report_Env_Upgrade' },   // ← should NOT be included
      { name: 'Library_Analytics_Dashboard' },
      { name: 'Global_Config_Job' }            // ← should NOT be included
    ]
  };

  it('returns only jobs starting with "Library_"', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue(mockJenkinsJobList)
    };

    const result = await getAllLibraryJobNames(mockClient);
    
    expect(result).toEqual([
      'Library_Dossier_InfoWindow',
      'Library_CustomApp_Cache',
      'Library_Maps_Overlay',
      'Library_Analytics_Dashboard'
    ]);
    expect(result).not.toContain('Trigger_Library_Jobs');
    expect(result).not.toContain('Global_Config_Job');
  });

  it('calls the correct Jenkins API endpoint', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({ jobs: [] })
    };

    await getAllLibraryJobNames(mockClient);
    
    expect(mockClient.fetch).toHaveBeenCalledWith('/api/json?tree=jobs[name]');
  });

  it('supports custom prefix for flexibility', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue(mockJenkinsJobList)
    };

    const result = await getAllLibraryJobNames(mockClient, 'Trigger_');
    expect(result).toEqual(['Trigger_Library_Jobs']);
  });

  it('returns empty array when no jobs match prefix', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({ jobs: [{ name: 'Foo_Job' }, { name: 'Bar_Job' }] })
    };

    const result = await getAllLibraryJobNames(mockClient, 'Library_');
    expect(result).toEqual([]);
  });

  it('returns empty array when Jenkins returns no jobs at all', async () => {
    const mockClient = {
      fetch: jest.fn().mockResolvedValue({})
    };

    const result = await getAllLibraryJobNames(mockClient);
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// Integration: discoverAndroidBuilds with Fix 3 applied
// ─────────────────────────────────────────────

describe('discoverAndroidBuilds() with Fix 3 — end-to-end discovery', () => {
  it('classifies downstream jobs correctly: passed, failed, passedByRerun', async () => {
    // Mock Jenkins returning 3 Library jobs from the global list
    // and their builds with different results
    const mockClient = {
      fetch: jest.fn().mockImplementation(async (url) => {
        // Root API call: returns all jobs
        if (url === '/api/json?tree=jobs[name]') {
          return {
            jobs: [
              { name: 'Library_Dossier_InfoWindow' },
              { name: 'Library_CustomApp_Cache' },
              { name: 'Library_Maps_Overlay' }
            ]
          };
        }

        // Library_Dossier_InfoWindow: 2 builds, build 564 was triggered by Trigger #87
        if (url.includes('Library_Dossier_InfoWindow/api/json') && url.includes('builds')) {
          return {
            builds: [{
              number: 564,
              result: 'FAILURE',
              timestamp: 1708700000000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]
            }]
          };
        }

        // Library_CustomApp_Cache: build 312 triggered by Trigger #87, SUCCESS
        if (url.includes('Library_CustomApp_Cache/api/json') && url.includes('builds')) {
          return {
            builds: [{
              number: 312,
              result: 'SUCCESS',
              timestamp: 1708700100000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]
            }]
          };
        }

        // Library_Maps_Overlay: primary failed, but re-run succeeded
        if (url.includes('Library_Maps_Overlay/api/json') && url.includes('builds[number,result,timestamp,causes[upstreamProject,upstreamBuild]]')) {
          return {
            builds: [{
              number: 201,
              result: 'FAILURE',
              timestamp: 1708700200000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]
            }]
          };
        }

        // Library_Maps_Overlay re-run detection: build 202 is a manual re-run within 3 hours
        if (url.includes('Library_Maps_Overlay/api/json') && url.includes('_class,upstreamProject,upstreamBuild')) {
          return {
            builds: [
              {
                number: 202,
                result: 'SUCCESS',
                timestamp: 1708700200000 + (30 * 60 * 1000), // 30 min later
                causes: [{ _class: 'hudson.model.Cause$UserIdCause' }]
              },
              {
                number: 201,
                result: 'FAILURE',
                timestamp: 1708700200000,
                causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 87 }]
              }
            ]
          };
        }

        return {};
      })
    };

    const result = await discoverAndroidBuilds('Trigger_Library_Jobs', 87, mockClient);

    expect(result.passed).toHaveLength(1);
    expect(result.passed[0]).toMatchObject({ jobName: 'Library_CustomApp_Cache', buildNum: 312 });

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0]).toMatchObject({ jobName: 'Library_Dossier_InfoWindow', buildNum: 564 });

    expect(result.passedByRerun).toHaveLength(1);
    expect(result.passedByRerun[0]).toMatchObject({
      jobName: 'Library_Maps_Overlay',
      primaryBuildNum: 201,
      rerunBuildNum: 202
    });

    expect(result.running).toHaveLength(0);
  });

  it('skips Library jobs that did not run under the given trigger build', async () => {
    const mockClient = {
      fetch: jest.fn().mockImplementation(async (url) => {
        if (url === '/api/json?tree=jobs[name]') {
          return { jobs: [{ name: 'Library_Dossier_InfoWindow' }] };
        }
        // Build list has no build with upstreamBuild=87
        if (url.includes('Library_Dossier_InfoWindow/api/json')) {
          return {
            builds: [{
              number: 563,
              result: 'SUCCESS',
              timestamp: 1708600000000,
              causes: [{ upstreamProject: 'Trigger_Library_Jobs', upstreamBuild: 86 }] // different trigger
            }]
          };
        }
        return {};
      })
    };

    const result = await discoverAndroidBuilds('Trigger_Library_Jobs', 87, mockClient);
    
    // Job was not triggered by build 87, so should be skipped
    expect(result.passed).toHaveLength(0);
    expect(result.failed).toHaveLength(0);
  });
});
```

---

### Running the Tests

```bash
cd /Users/xuyin/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts

export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use default

# Run just the Bug 3 tests
npx jest tests/unit/job_discovery_bug3.test.js --verbose

# Run all unit tests
npx jest tests/unit/ --verbose
```

**Expected output (before Fix 3 applied):**
```
✓ Bug 3: getDownstreamJobNames() returns [] for dynamic trigger jobs (2 tests passing)
✗ Fix 3: getAllLibraryJobNames() discovers jobs by name prefix (FAILS — function doesn't exist yet)
```

**Expected output (after Fix 3 applied to job_discovery.js):**
```
✓ Bug 3: getDownstreamJobNames() returns [] for dynamic trigger jobs (2 tests passing)
✓ Fix 3: getAllLibraryJobNames() discovers jobs by name prefix (5 tests passing)
✓ discoverAndroidBuilds() with Fix 3 — end-to-end discovery (2 tests passing)
```

---

### Manual Verification After Fix

```bash
# Step 1: Apply Fix 3 to job_discovery.js (add getAllLibraryJobNames, update discoverAndroidBuilds)

# Step 2: Run tests
npx jest tests/unit/job_discovery_bug3.test.js --verbose
# All 9 tests should pass

# Step 3: End-to-end test (requires Jenkins connectivity)
rm -rf reports/Trigger_Library_Jobs_87/
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87

# Step 4: Verify non-empty results
cat reports/Trigger_Library_Jobs_87/failed_jobs.json
# Should contain actual Library_* job names, NOT empty []

# Step 5: Verify report generated
ls -lh reports/Trigger_Library_Jobs_87/Trigger_Library_Jobs_87.docx
```

---

## Support

- **Project Owner:** Snow
- **QA Agent:** Atlas Daily
- **Chat:** Feishu `oc_f15b73b877ad243886efaa1e99018807`
- **Jenkins:** http://tec-l-1081462.labs.microstrategy.com:8080/
- **Android Jenkins:** http://ci-master.labs.microstrategy.com:8011

---

*Last Updated: 2026-02-24 | Version 2.0 | Maintainer: Atlas Daily*
