# Android Jenkins CI Analysis — Design Document

**Date:** 2026-02-24  
**Status:** Design Finalized (Decisions Incorporated)  
**Version:** 1.1  
**Scope:** Android Library CI — ExtentReport-based failure analysis

---

## 1. Overview

This document describes the design for analyzing Android Library CI test failures from the Jenkins CI server. The system watches the `Trigger_Library_Jobs` trigger job and crawls all downstream `Library_*` test jobs. For each failed job it fetches the **ExtentReport** HTML, extracts screenshot failures and script play failures, and generates a consolidated report.

The architecture mirrors the existing web library CI analyzer (`analyzer.sh` → `pipeline/process_build.js` flow) but replaces console-log parsing with ExtentReport HTML parsing.

**Jenkins Base URL:** `http://ci-master.labs.microstrategy.com:8011`  
**Trigger Job:** `Trigger_Library_Jobs`  
**Downstream Jobs:** ~100 `Library_*` jobs (e.g., `Library_Dossier_InfoWindow`, `Library_CustomApp_Cache`, …)  
**Report Type:** Extent Reports v4 (`newReportVersion2.0/`) served by Jenkins HTML Publisher Plugin

---

## 2. Jenkins Job Hierarchy

The Android CI pipeline has three tiers:

```
┌────────────────────────────────────────────────────────────────┐
│                        Jenkins Server                           │
│                                                                  │
│  ┌─────────────────────────┐                                   │
│  │  Trigger_Library_Jobs   │  ← Weekly timer trigger           │
│  │  (trigger, ~0.72 sec)   │                                   │
│  └──────────┬──────────────┘                                   │
│             │ triggers N downstream jobs                        │
│             ↓                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          Library_* Test Jobs (~100 jobs)                 │   │
│  │                                                           │   │
│  │  Library_Dossier_InfoWindow     Library_Favorite         │   │
│  │  Library_CustomApp_Cache        Library_Home             │   │
│  │  Library_RSD_Graph              Library_Searching        │   │
│  │  … (see Downstream Projects in Trigger_Library_Jobs)     │   │
│  │                                                           │   │
│  │  Each job:                                                │   │
│  │  - Runs Android UI tests (~30-60 min)                    │   │
│  │  - Publishes ExtentReport HTML                           │   │
│  │  - Publishes JUnit TestReport                            │   │
│  │  - Triggers UpdateProjectsForAndroidHub (blocking)       │   │
│  └──────────┬──────────────────────────────────────────────┘   │
│             │ each job triggers                                   │
│             ↓                                                    │
│  ┌─────────────────────────┐                                   │
│  │ UpdateProjectsForAndroid │  ← Blocking subproject, updates  │
│  │ Hub                      │    Android Hub with results       │
│  └─────────────────────────┘                                   │
└────────────────────────────────────────────────────────────────┘
```

**Key characteristics:**
- `Trigger_Library_Jobs` itself has near-zero runtime; it only schedules the downstream Library jobs.
- Each Library job runs independently with its own build number.
- The correlation between a trigger build and its Library job builds is via `upstreamProject` / `upstreamBuild` in Jenkins API causes.
- Each Library job exposes both `/ExtentReport/` and `/testReport/` endpoints.

---

## 3. Failure Types

Android tests produce two distinct failure categories:

### 3.1 Screenshot Failure

A screenshot comparison test where the actual screenshot does not match the stored baseline.

**Indicators:**
- JUnit test name ends with `.screenshot` (e.g., `06_GM_NGM_PositionCustomize.screenshot`)
- ExtentReport shows a failed step where the step detail includes image comparison failure text
- The test script ran to completion but the visual assertion failed

**ExtentReport appearance:**
- Test badge: `Fail`
- Step row: status icon = ❌, STEPNAME = screenshot step name, DETAILS = comparison error message

**Example JUnit test:** `06_GM_NGM_PositionCustomize.screenshot`

### 3.2 Script Play Failure

The test script itself crashed or encountered an unhandled exception before completing (e.g., an element not found, timeout, NullPointerException in the Appium driver, or connectivity failure).

**Indicators:**
- JUnit test name does NOT end with `.screenshot`
- ExtentReport shows a failed step mid-execution with an exception stack trace in DETAILS
- The test may have partially executed (some steps passed) before crashing

**ExtentReport appearance:**
- Test badge: `Fail`
- Step row: status icon = ❌, STEPNAME = last executed step, DETAILS = exception message or stack trace

---

## 4. ExtentReport Structure

Each Library job publishes an Extent Reports v4 HTML artifact via the Jenkins HTML Publisher Plugin.

### 4.1 URL Pattern

```
# Directory listing (served by Jenkins)
http://ci-master.labs.microstrategy.com:8011/job/{JobName}/{BuildNum}/ExtentReport/

# Report subdirectory (discovered dynamically from listing)
.../ExtentReport/newReportVersion2.0/

# Actual HTML file (auto-served as index by Jenkins plugin)
.../ExtentReport/newReportVersion2.0/{report}.html
```

The directory name `newReportVersion2.0` is consistent across jobs but must be verified from the listing. The HTML Publisher plugin serves the directory contents and embeds the report in an iframe on the Jenkins page.

### 4.2 Report HTML Structure

The ExtentReport HTML contains a two-panel layout:

**Left sidebar — test list:**
```html
<div class="test-list">
  <div class="test-item FAIL">06_GM_NGM_PositionCustomize</div>
  <div class="test-item FAIL">07_GM_PositionFix</div>
  <div class="test-item PASS">01_OpenDossier</div>
  ...
</div>
```

**Main panel — test detail (per test):**

| STATUS | TIMESTAMP | STEPNAME | DETAILS |
|--------|-----------|----------|---------|
| ℹ️ | 03:23:55 | `06_GM_NGM_PositionCustomize` | `06_GM_NGM_PositionCustomize starts!` \n `Rally TC id=TC79556` \n `Config url = dossier://...` \n `AuthMode = Standard` \n `user = info` |
| ✅ | 03:23:55 | `openContextMenu` | `Step - 0 openContextMenu Pass` \n `parameters:name=Dossier Info Window Auto;section=All` \n `Execution time=4.111s` \n `result is OK` |
| ✅ | 03:23:56 | `wait` | `Step - 1 wait Pass` \n `parameters:value=1000` |
| ❌ | 03:24:10 | `screenshot` | `Step - N screenshot Fail` \n `[screenshot comparison error]` |

**Key fields extracted per test:**

| Field | Source | Example |
|-------|--------|---------|
| `test_name` | Test item title | `06_GM_NGM_PositionCustomize` |
| `tc_id` | DETAILS "Rally TC id=" | `TC79556` |
| `config_url` | DETAILS "Config url =" | `dossier://?url=http://...` |
| `failure_type` | Step name of failing row | `screenshot` or step name |
| `failed_step_name` | STEPNAME of ❌ row | `screenshot`, `openContextMenu`, etc. |
| `failed_step_details` | DETAILS of ❌ row | Error text or exception |
| `execution_time` | DETAILS "Execution time=" | `4.111s` |

### 4.3 Parsing Strategy (Implemented v2)

Because the ExtentReport is a JavaScript-rendered SPA (Single Page Application), direct HTML parsing via `cheerio` is NOT sufficient — the test data is injected via JS.

**✅ Primary: Multi-pattern JSON extraction (`android/extent_parser.js`)**  
Extent Reports v4 embeds all test data as a JSON payload in a `<script>` tag but the exact variable name and object shape varies by Extent version:

| Pattern | Variable | Shape |
|---------|----------|-------|
| Modern v4 | `window.testData` / `var testData` | `{ report: { testList: [...] } }` |
| Older v4 | `var testData` | Flat array `[{ name, status, logs }]` |
| v3 compat | `window.TESTS` | Array |

The parser (`extractJsonPayload`) tries all known patterns in order using regex. The JSON is extracted and then `parseJsonPayload` normalises it into `ExtentTestResult[]` regardless of shape.

```javascript
// Priority cascade in extent_parser.js:
// 1. window.testData = { report: { testList: [...] } }   ← modern v4
// 2. window.testData = [...]                             ← array form
// 3. window.TESTS = [...]                                ← v3 compat
// 4. Any large JSON array in a <script>                  ← catch-all
// 5. HTML regex block extraction (Rally TC id= patterns) ← last resort
```

**Fallback: Regex on raw HTML**  
Falls back to scanning the raw HTML for `Rally TC id=TC#####` patterns when all JSON extraction attempts yield zero results.

**Note:** JUnit API fallback can be injected via `parseExtentReport(jobName, buildNum, client, { junitFallback: async fn })` but is not wired by default.

**Authentication:** `ANDROID_JENKINS_USER` / `ANDROID_JENKINS_TOKEN` env vars apply Basic Auth to all fetches (`Authorization: Basic base64(user:token)`). This is confirmed to work with the Jenkins HTML Publisher `/ExtentReport/` endpoint.

---

## 5. Job Discovery

### 5.1 Problem

`Trigger_Library_Jobs` does not directly expose its triggered child builds via the standard `subBuilds` API (the job itself completes in ~0.72 sec by simply scheduling the Library jobs). The `downstreamProjects` list on the job page shows all possible downstream jobs (~100), but we need to know which ones actually ran for a specific trigger build number.

### 5.2 Discovery Strategy

**Step 1: Get downstream job names**

Fetch the `Trigger_Library_Jobs` job config to get the static list of all downstream jobs it can trigger:
```
GET /job/Trigger_Library_Jobs/api/json?tree=downstreamProjects[name,url]
```
Returns the full list of ~100 `Library_*` job names.

**Step 2: For each downstream job, find the build triggered by this trigger run**

Query each Library job's recent builds and match by `upstreamProject` + `upstreamBuild` in the cause chain:
```
GET /job/{LibraryJobName}/api/json?tree=builds[number,result,timestamp,causes[upstreamProject,upstreamBuild]]{0,5}
```

A build matches if its cause chain contains:
- `upstreamProject = "Trigger_Library_Jobs"` AND `upstreamBuild = {triggerBuildNum}`

**Step 3: Classify each matched build**

```
result = SUCCESS  →  passed_jobs list
result = FAILURE  →  failed_jobs list (fetch ExtentReport)
result = UNSTABLE →  failed_jobs list (fetch ExtentReport)
result = null     →  still running (retry after delay)
```

### 5.3 Optimizations

- **Parallel fetching**: Query all ~100 downstream jobs concurrently with `Promise.allSettled()`.
- **Early termination**: If trigger build is still running (`Trigger_Library_Jobs` result = `null`), poll until complete.
- **Cache check**: Skip if report already generated for this `{triggerJobName}_{triggerBuildNum}`.

---

## 6. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Monitoring Server                        │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  server/index.js (webhook server, port 9090)             │    │
│  │  - Receives Jenkins webhook POST                         │    │
│  │  - Validates job in WATCHED_JOBS                        │    │
│  │  - Spawns android_analyzer.sh in background             │    │
│  └──────────────────┬────────────────────────────────────────┘    │
│                     │ spawn()                                      │
│                     ↓                                              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  scripts/android_analyzer.sh (Bash)                      │    │
│  │  1. Check existing report (cost optimization)           │    │
│  │  2. Fetch downstream job names (Trigger_Library_Jobs)   │    │
│  │  3. For each Library_* job: find matching build         │    │
│  │  4. Classify: passed / failed / still-running           │    │
│  │  5. For failed jobs: fetch ExtentReport HTML            │    │
│  │  6. Parse ExtentReport → JSON failure list              │    │
│  │  7. Write to DB, generate report                        │    │
│  │  8. Convert MD → DOCX                                   │    │
│  │  9. Upload to Feishu                                    │    │
│  └──────────────────┬────────────────────────────────────────┘    │
│                     │ node calls                                    │
│                     ↓                                              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  pipeline/process_android_build.js (Node.js)             │    │
│  │  - Orchestrates per-job analysis                        │    │
│  │  - Calls android/job_discovery.js                       │    │
│  │  - Calls android/extent_parser.js                       │    │
│  │  - Calls android/failure_classifier.js                  │    │
│  │  - Writes to SQLite via database/operations.js           │    │
│  └──────────────────┬────────────────────────────────────────┘    │
│                     │                                               │
│           ┌─────────┴──────────┐                                  │
│           ↓                    ↓                                   │
│  ┌─────────────────┐  ┌──────────────────────────────────┐       │
│  │ reporting/       │  │ database/operations.js            │       │
│  │ generator.js     │  │ - Upsert job_runs                 │       │
│  │ (Android report  │  │ - Upsert failed_steps             │       │
│  │  format)         │  │ - Enforce 5-build rolling window  │       │
│  └────────┬────────┘  └──────────────────────────────────┘       │
│           │                                                         │
│           ↓                                                         │
│  reporting/docx_converter.js → feishu_uploader.sh                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. New Module Design

Following the refactored grouped structure from `REFACTOR_PLAN.md`, add an `android/` group alongside the existing `parsing/`, `database/`, `analysis/`, `reporting/` groups.

### 7.1 Directory Structure

```
scripts/
├── android/                          # NEW: Android-specific modules
│   ├── index.js                      # Re-export public API
│   ├── job_discovery.js              # Discover Library_* builds from trigger
│   ├── extent_parser.js              # Parse ExtentReport HTML → failure JSON
│   └── failure_classifier.js         # Classify screenshot vs script play failures
│
├── pipeline/
│   ├── process_build.js              # (existing) Web CI orchestration
│   └── process_android_build.js     # NEW: Android CI orchestration
│
├── server/
│   └── config.js                     # Add ANDROID_WATCHED_JOBS, ANDROID_JENKINS_URL
│
└── android_analyzer.sh               # NEW: Android analyzer entry point (Bash)
```

### 7.2 `android/job_discovery.js`

```javascript
/**
 * Discover Library_* builds triggered by a specific Trigger_Library_Jobs run.
 *
 * @param {string} triggerJobName  - "Trigger_Library_Jobs"
 * @param {number} triggerBuildNum - e.g., 89
 * @returns {{ passed: JobInfo[], failed: JobInfo[], running: JobInfo[] }}
 */
async function discoverAndroidBuilds(triggerJobName, triggerBuildNum) { ... }

/**
 * Get the list of downstream Library_* job names from the trigger job config.
 * @returns {string[]}
 */
async function getDownstreamJobNames(triggerJobName) { ... }

/**
 * For a single Library job, find the build number triggered by the given upstream.
 * @returns {BuildInfo | null}
 */
async function findMatchingBuild(libraryJobName, upstreamProject, upstreamBuildNum) { ... }
```

**Algorithm for `findMatchingBuild`:**
1. Fetch `/job/{libraryJobName}/api/json?tree=builds[number,result,causes[upstreamProject,upstreamBuild]]{0,10}`
2. For each build, walk `causes` recursively (causes can be nested for `Started by upstream project X originally caused by...`)
3. Return the first build where any cause has `upstreamProject == triggerJobName && upstreamBuild == triggerBuildNum`

### 7.3 `android/extent_parser.js`

```javascript
/**
 * Fetch and parse the ExtentReport for a given job build.
 *
 * @param {string} jobName
 * @param {number} buildNum
 * @returns {ExtentTestResult[]}
 */
async function parseExtentReport(jobName, buildNum) { ... }

/**
 * Fetch the ExtentReport directory listing and find the report subdirectory.
 * @returns {string} subdirectory name, e.g. "newReportVersion2.0"
 */
async function getReportDirectoryName(jobName, buildNum) { ... }

/**
 * Extract test results from the raw ExtentReport HTML source.
 * Attempts JSON extraction first, falls back to regex parsing.
 * @returns {ExtentTestResult[]}
 */
function extractTestResultsFromHtml(htmlSource) { ... }
```

**`ExtentTestResult` shape:**
```javascript
{
  testName:       string,   // e.g. "06_GM_NGM_PositionCustomize"
  status:         "PASS" | "FAIL",
  tcId:           string,   // e.g. "TC79556"  (null if not found)
  configUrl:      string,   // e.g. "dossier://?url=..."
  failedStepName: string,   // name of the failing step (null if passed)
  failedStepDetails: string,// raw details text from the failing step row
  executionTimeMs: number,  // total test duration
}
```

### 7.4 `android/failure_classifier.js`

```javascript
/**
 * Classify a test failure as screenshot or script_play.
 *
 * @param {ExtentTestResult} testResult
 * @param {string} junitTestName - JUnit test name (may end in ".screenshot")
 * @returns {"screenshot_failure" | "script_play_failure" | "unknown"}
 */
function classifyFailure(testResult, junitTestName) { ... }
```

**Classification rules:**

| Condition | Classification |
|-----------|----------------|
| JUnit test name ends with `.screenshot` | `screenshot_failure` |
| `failedStepName` === `"screenshot"` (case-insensitive) | `screenshot_failure` |
| `failedStepDetails` contains "does not match" / "image comparison" | `screenshot_failure` |
| `failedStepDetails` contains exception class (e.g., `NoSuchElementException`, `TimeoutException`) | `script_play_failure` |
| `failedStepDetails` contains "Script play failed" / "Appium" error | `script_play_failure` |
| None of the above | `unknown` |

### 7.5 `pipeline/process_android_build.js`

Main orchestration entry point, analogous to `process_build.js` for web CI.

```
Input:  --job Trigger_Library_Jobs --build 89 --output-dir /path/to/reports/
Output: failed_jobs.json, passed_jobs.json, extent_failures.json

Steps:
1. discoverAndroidBuilds(triggerJob, triggerBuildNum)
2. For each failed build:
   a. parseExtentReport(jobName, buildNum)       → ExtentTestResult[]
   b. classifyFailure(testResult, junitTestName) → failure_type
   c. buildFingerprint(jobName, tcId, testName, failureType)
   d. findLastFailedBuild(jobName, fingerprint)  → history
   e. insertFailedStep(db, { ...fields })
3. Write extent_failures.json
4. Exit 0
```

### 7.6 `android_analyzer.sh`

New bash entry point for the Android pipeline. Follows the same structure as `analyzer.sh`:

```bash
#!/bin/bash
# android_analyzer.sh - Android Library CI analysis orchestrator
#
# Usage: bash android_analyzer.sh <trigger_job_name> <trigger_build_number>
# Example: bash android_analyzer.sh Trigger_Library_Jobs 89

TRIGGER_JOB="$1"
TRIGGER_BUILD="$2"
REPORT_DIR="reports/${TRIGGER_JOB}_${TRIGGER_BUILD}"

# Step 1: Cost optimization - skip if report already exists
if [ -f "$REPORT_DIR/android_report.docx" ]; then
  bash scripts/feishu_uploader.sh "$REPORT_DIR/android_report.docx"
  exit 0
fi

# Step 2: Heartbeat setup
# Step 3: Discover downstream builds + fetch ExtentReports
node scripts/pipeline/process_android_build.js \
  --job "$TRIGGER_JOB" \
  --build "$TRIGGER_BUILD" \
  --output-dir "$REPORT_DIR"

# Step 4: Generate markdown report
node scripts/generate_android_report.mjs "$REPORT_DIR"

# Step 5: Convert to DOCX
node scripts/reporting/docx_converter.js \
  "$REPORT_DIR/android_report.md" \
  "$REPORT_DIR/android_report.docx"

# Step 6: Upload to Feishu
bash scripts/feishu_uploader.sh "$REPORT_DIR/android_report.docx"
```

---

## 8. Data Flow

```
Trigger_Library_Jobs #89 completes
         ↓
Webhook → server/index.js
         ↓
spawn android_analyzer.sh Trigger_Library_Jobs 89
         ↓
[Cost check: skip if report exists]
         ↓
process_android_build.js
         ↓
    [1. Fetch downstream job names]
    GET /job/Trigger_Library_Jobs/api/json?tree=downstreamProjects[name]
    → ["Library_Dossier_InfoWindow", "Library_Favorite", ...]
         ↓
    [2. For each Library_* job (parallel, ~100 jobs)]
    GET /job/{JobName}/api/json?tree=builds[number,result,causes[...]]
    → Find build where cause matches Trigger_Library_Jobs #89
         ↓
    [3. Classify builds + detect re-runs]
    passed_jobs.json      ← result=SUCCESS
    passed_by_rerun.json  ← primary FAILED but re-run PASSED (excluded from failures)
    failed_jobs.json      ← result=FAILURE/UNSTABLE (no re-run, or re-run also failed)
         ↓
    [4. For each failed job (passedByRerun jobs skip to DB write only)]
    GET /job/{JobName}/{BuildNum}/ExtentReport/
    → Find subdirectory name ("newReportVersion2.0")
         ↓
    GET /job/{JobName}/{BuildNum}/ExtentReport/newReportVersion2.0/
    → Fetch HTML source
         ↓
    extent_parser.js → ExtentTestResult[]
    {
      testName:  "06_GM_NGM_PositionCustomize",
      status:    "FAIL",
      tcId:      "TC79556",
      failedStepName: "screenshot",
      failedStepDetails: "[image comparison error]"
    }
         ↓
    failure_classifier.js
    → failureType: "screenshot_failure"
         ↓
    analysis/fingerprint.js
    → sha256(jobName + tcId + testName + failureType)
         ↓
    database/operations.js
    → findLastFailedBuild(fingerprint) → lastFailedBuild: 563 (recurring)
    → insertFailedStep({
        jobName, buildNum, tcId, testName,
        failureType, failedStepName, fingerprint,
        lastFailedBuild: 563, isRecurring: true
      })
         ↓
generate_android_report.mjs
         ↓
    [Executive Summary]
    | Job | Build | TC ID | Test | Failure Type | Last Failed | Recurring |
    | Library_Dossier_InfoWindow | #564 | TC79556 | 06_GM_NGM_PositionCustomize | screenshot | #563 | ✅ |
         ↓
reporting/docx_converter.js → android_report.docx
         ↓
feishu_uploader.sh → Feishu chat
```

---

## 9. Report Format

The Android report follows the same markdown structure as the web library CI report but uses Android-specific fields.

```markdown
# Android Library CI Report — Trigger_Library_Jobs #89
**Date:** 2026-02-24  **Build:** #89  **Triggered by:** Timer

## Executive Summary
- Total Library jobs: 98
- Passed: 72 (73.5%)
- Failed: 26 (26.5%)
- Screenshot failures: 19 jobs
- Script play failures: 7 jobs

## Passed Jobs (72)
- Library_AddToLibrary #312
- Library_AppLogo #145
...

## Failed Jobs (26)

### Library_Dossier_InfoWindow #564
**ExtentReport:** [View](http://ci-master.../564/ExtentReport/)  
**Build:** [View in Jenkins](http://ci-master.../564/)

| TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |
|-------|-----------|--------------|-------------|-------------|-----------|
| TC79556 | 06_GM_NGM_PositionCustomize | screenshot | screenshot | #563 | 🔁 Yes |
| TC79557 | 07_GM_PositionFix | screenshot | screenshot | #562 | 🔁 Yes |
| TC80100 | 11_CustomViz_1 | script_play | openElement | — | — |

<details>
<summary>06_GM_NGM_PositionCustomize — Failure Details</summary>

**TC ID:** TC79556  
**Config URL:** `dossier://?url=http://ctc-android1...`  
**Failed Step:** `screenshot`  
**Details:** Screenshot comparison failed  
**Last Failed Build:** #563 (recurring in 2 consecutive builds)  

</details>
```

---

## 10. Database Schema Extension

**Decision: Same `jenkins_history.db`, extended with a `platform` column.**  
This keeps reporting unified (single query can compare web vs Android trends) and avoids managing a second DB file.

```sql
-- Migration: add platform discriminator to existing tables
ALTER TABLE job_runs     ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';
ALTER TABLE failed_steps ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';

-- Migration: Android-specific fields on failed_steps
-- These are NULL for web CI rows and populated for android rows.
ALTER TABLE failed_steps ADD COLUMN tc_id_raw        TEXT;   -- "TC79556"
ALTER TABLE failed_steps ADD COLUMN config_url        TEXT;   -- "dossier://?url=..."
ALTER TABLE failed_steps ADD COLUMN failed_step_name  TEXT;   -- "screenshot"
ALTER TABLE failed_steps ADD COLUMN failure_type      TEXT;   -- "screenshot_failure" | "script_play_failure"
ALTER TABLE failed_steps ADD COLUMN rerun_build_num   INTEGER; -- build num of re-run attempt, if any
ALTER TABLE failed_steps ADD COLUMN rerun_result      TEXT;   -- "PASS" | "FAIL" | null
```

**Index additions for Android queries:**
```sql
CREATE INDEX IF NOT EXISTS idx_failed_steps_platform
  ON failed_steps(platform, job_name, build_num);

CREATE INDEX IF NOT EXISTS idx_job_runs_platform
  ON job_runs(platform, trigger_job, trigger_build);
```

**Rolling window:** Android CI uses the same 5-build rolling window as web CI. Records older than the 5 most recent trigger builds per `(job_name, platform)` are pruned after each write.

**`database/operations.js` additions:**

```javascript
// All existing functions gain an optional `platform = 'web'` parameter.
// New Android-specific upsert:
async function insertAndroidFailedStep(db, {
  jobName, buildNum, triggerJob, triggerBuild,
  tcId, configUrl, testName, failureType,
  failedStepName, failedStepDetails, fingerprint,
  lastFailedBuild, isRecurring,
  rerunBuildNum, rerunResult,   // nullable
}) { ... }
```

---

## 11. Watched Job Configuration

Add to `server/config.js`:

```javascript
const ANDROID_WATCHED_JOBS = [
  'Trigger_Library_Jobs',
];

const ANDROID_JENKINS_URL = process.env.ANDROID_JENKINS_URL
  || 'http://ci-master.labs.microstrategy.com:8011';

const ANDROID_JENKINS_USER  = process.env.ANDROID_JENKINS_USER;
const ANDROID_JENKINS_TOKEN = process.env.ANDROID_JENKINS_API_TOKEN;
```

The webhook server dispatches to `android_analyzer.sh` when the completed job name is in `ANDROID_WATCHED_JOBS`.

### 11.1 Feishu Delivery

**Decision: Android reports go to the same Feishu channel as web CI reports.**

No additional channel configuration is needed. `feishu_uploader.sh` is reused as-is. The report title includes `[Android]` as a prefix so recipients can distinguish it from web CI reports at a glance:

```
[Android] Library CI Report — Trigger_Library_Jobs #89
Date: 2026-02-24 | Failed: 26/98 jobs | Screenshot: 19 | Script Play: 7
```

The `android_analyzer.sh` passes the same `FEISHU_WEBHOOK_URL` env var used by the web analyzer. No code changes required in `feishu_uploader.sh`.

---

## 12. Key Differences from Web Library CI

| Aspect | Web Library CI | Android Library CI |
|--------|----------------|-------------------|
| **Trigger job** | `Tanzu_Report_Env_Upgrade` | `Trigger_Library_Jobs` |
| **Test job count** | ~30–40 | ~100 |
| **Failure data source** | Console log (text) | ExtentReport (HTML) |
| **Parser** | `parsing/parser.js` (regex on log text) | `android/extent_parser.js` (HTML → JSON) |
| **TC ID format** | `TC#####`, `QAC-####`, `BCIN-####` | `TC#####` (Rally TC id) |
| **Failure types** | `screenshot_mismatch`, `assertion_failure`, `generic` | `screenshot_failure`, `script_play_failure` |
| **Visual regression** | Spectre (`spectre.js`) | N/A (screenshots in ExtentReport) |
| **Job discovery** | `downstreamProjects` + build lookup | Same approach |
| **Report endpoint** | `/consoleText` | `/ExtentReport/` |
| **Intermediate job** | None | `UpdateProjectsForAndroidHub` (subproject, not analyzed) |
| **Re-run handling** | Deterministic `run_1`/`run_2`/`run_3` suffix | Time-window detection (3 h); some jobs have re-runs, some don't |
| **Re-run result** | Deduplication via `parsing/deduplication.js` | `detectRerun()` in `android/job_discovery.js`; fixed by re-run = excluded from failure list |
| **Feishu channel** | Existing webhook | Same webhook; `[Android]` prefix in title |
| **Database** | `jenkins_history.db` (`platform = 'web'`) | Same `jenkins_history.db` (`platform = 'android'`) |

---

## 13. Error Handling

| Scenario | Handling |
|----------|----------|
| Library job still running at analysis time | Retry up to 3× with 5-min delay; skip and log if still running |
| ExtentReport returns 404 or empty listing | Log warning, record as `extent_report_missing`; include in report |
| ExtentReport HTML has no JSON payload | Fall back to JUnit API (`/testReport/api/json`) |
| JUnit API returns no tests | Log warning; mark job as `no_test_results` |
| Jenkins API rate limit / timeout | Exponential back-off (2s, 4s, 8s), max 3 retries |
| Feishu upload failure | Retry once after 10 sec; keep report file for manual retrieval |

---

## 14. Directory Layout (New Files)

```
projects/jenkins-analysis/
├── scripts/
│   ├── android/                          ← NEW
│   │   ├── index.js
│   │   ├── job_discovery.js
│   │   ├── extent_parser.js
│   │   └── failure_classifier.js
│   │
│   ├── pipeline/
│   │   ├── process_build.js              (existing)
│   │   └── process_android_build.js     ← NEW
│   │
│   ├── android_analyzer.sh              ← NEW
│   └── generate_android_report.mjs     ← NEW
│
├── tests/
│   ├── android/                          ← NEW
│   │   ├── job_discovery.test.js
│   │   ├── extent_parser.test.js
│   │   └── failure_classifier.test.js
│   └── fixtures/
│       ├── sample_extent_report.html    ← NEW  (anonymized ExtentReport HTML)
│       └── sample_android_jobs.json     ← NEW  (Jenkins API response fixture)
│
└── docs/
    └── ANDROID_DESIGN.md               ← This file
```

---

## 15. Implementation Phases

### Phase 1: Job Discovery + Re-run Detection
1. Implement `android/job_discovery.js`:
   - `getDownstreamJobNames(triggerJobName)` — fetch ~100 Library job names
   - `findMatchingBuild(libraryJobName, upstreamProject, upstreamBuildNum)` — match by cause chain
   - `detectRerun(jobName, primaryBuildNum, primaryTimestamp)` — 3-hour window, manual trigger or same upstream (§16.2)
   - `discoverAndroidBuilds(triggerJob, triggerBuildNum)` — top-level orchestrator returning `{ passed, failed, passedByRerun, running }`
2. Write unit tests with fixture Jenkins API responses:
   - fixture: 100 jobs, 26 failed, 3 with re-runs (2 fixed, 1 still failing)
3. Verify against live `Trigger_Library_Jobs #89` data

### Phase 2: ExtentReport Parsing
1. Download a sample ExtentReport HTML from `Library_Dossier_InfoWindow #564` using Basic Auth (`ANDROID_JENKINS_USER` + `ANDROID_JENKINS_API_TOKEN`)
2. Locate the embedded JSON `<script>` tag and document exact variable name / structure
3. Implement `android/extent_parser.js` with:
   - `getReportDirectoryName(jobName, buildNum)` — discover `newReportVersion2.0/`
   - `extractTestResultsFromHtml(htmlSource)` — JSON extraction primary, regex fallback
   - `parseExtentReport(jobName, buildNum)` — fetch + parse + return `ExtentTestResult[]`
4. Write unit tests with the saved HTML fixture (anonymized)

### Phase 3: Failure Classification
1. Implement `android/failure_classifier.js` with classification rules from §7.4
2. Collect samples of both failure types from live reports
3. Write tests covering all classification branches (screenshot, script_play, unknown)

### Phase 4: DB Schema Migration
1. Run schema migration (SQLite `ALTER TABLE`) in `database/migrate.js`:
   ```
   platform, tc_id_raw, config_url, failed_step_name,
   failure_type, rerun_build_num, rerun_result
   ```
2. Add indexes for Android queries (§10)
3. Extend `database/operations.js` with `insertAndroidFailedStep()`
4. Update rolling-window pruning to filter by `platform`

### Phase 5: Pipeline + Report Generation
1. Implement `pipeline/process_android_build.js` — orchestrator with re-run awareness:
   - Calls `discoverAndroidBuilds()` → handles `passedByRerun` separately
   - Skips ExtentReport fetch for `passedByRerun` jobs (write DB record only)
   - Fetches + parses ExtentReport for confirmed-failed jobs
2. Implement `generate_android_report.mjs`:
   - Executive summary with re-run breakdown (§16.5)
   - Per-job tables with re-run annotations (§16.4)
   - `[Android]` prefix in report title for Feishu (§11.1)
3. Implement `android_analyzer.sh` (§7.6)
4. Wire up webhook dispatch in `server/config.js` (§11)

### Phase 6: Integration Test + Feishu Delivery
1. Run end-to-end test against `Trigger_Library_Jobs #89`
2. Verify re-run detection fires correctly for known re-run jobs
3. Verify DB records have correct `platform = 'android'` and `rerun_*` columns
4. Verify Feishu delivery to the same channel with `[Android]` prefix

---

## 16. Re-run Detection

### 16.1 Background

Unlike the web CI pipeline (where retries follow a deterministic `run_1` / `run_2` / `run_3` naming convention), Android Library jobs have **no standard retry naming**. However, some Library jobs are manually re-triggered after an initial failure — resulting in a second (or third) build of the same Library job in the same time window.

**Confirmed:** Some Library jobs have re-runs; others do not. Both cases must be handled without false positives.

### 16.2 Re-run Detection Algorithm

A re-run is a newer build of the same Library job that:
1. Was triggered **after** the upstream-matched build, AND
2. Was triggered **within a 3-hour window** of the original build, AND
3. Has cause `Started by user` (manual re-trigger) **or** was triggered by the same upstream trigger (possible retry via a separate mechanism).

```javascript
/**
 * After finding the primary upstream-matched build, check for a subsequent
 * re-run build of the same job.
 *
 * @param {string} jobName
 * @param {number} primaryBuildNum  - the upstream-matched build
 * @param {number} primaryTimestamp - epoch ms of the primary build
 * @returns {RerunInfo | null}
 */
async function detectRerun(jobName, primaryBuildNum, primaryTimestamp) {
  // Fetch the most recent 5 builds
  const builds = await fetchBuilds(jobName, { limit: 5 });

  // Look for builds with number > primaryBuildNum
  // and started within 3 hours of the primary build
  const RE_RUN_WINDOW_MS = 3 * 60 * 60 * 1000;

  for (const build of builds) {
    if (build.number <= primaryBuildNum) continue;
    if (build.timestamp - primaryTimestamp > RE_RUN_WINDOW_MS) continue;
    if (build.result === null) continue; // still running, skip

    const isManualTrigger = build.causes.some(c => c._class === 'hudson.model.Cause$UserIdCause');
    const isSameUpstream  = build.causes.some(c =>
      c.upstreamProject === TRIGGER_JOB && c.upstreamBuild === primaryTriggerBuild
    );

    if (isManualTrigger || isSameUpstream) {
      return { buildNum: build.number, result: build.result, timestamp: build.timestamp };
    }
  }
  return null;
}
```

### 16.3 Re-run Result Interpretation

| Primary result | Re-run exists? | Re-run result | Final verdict | Action |
|----------------|----------------|---------------|---------------|--------|
| `FAILURE` | No | — | **Fail** | Report normally |
| `FAILURE` | Yes | `SUCCESS` | **Pass (re-run fixed it)** | Exclude from failure list; note in summary |
| `FAILURE` | Yes | `FAILURE` | **Fail (confirmed)** | Report with re-run context |
| `FAILURE` | Yes | `UNSTABLE` | **Fail (confirmed)** | Report with re-run context |
| `UNSTABLE` | No | — | **Fail** | Report normally |
| `UNSTABLE` | Yes | `SUCCESS` | **Pass (re-run fixed it)** | Exclude from failure list |

### 16.4 Report Output for Re-run Cases

When a re-run is detected, the report marks it explicitly:

```markdown
### Library_Dossier_InfoWindow #564 ⟳ Re-run #565 ✅ FIXED
> Initial run failed; re-run #565 passed. Excluded from failure count.

---

### Library_CustomApp_Cache #312 ⟳ Re-run #313 ❌ STILL FAILING
**ExtentReport:** [Run #312](http://ci-master.../312/ExtentReport/) | [Re-run #313](http://ci-master.../313/ExtentReport/)

| TC ID | Test Name | Failure Type | Failed Step | Last Failed | Recurring |
|-------|-----------|--------------|-------------|-------------|-----------|
| TC80100 | 11_CustomViz_1 | script_play | openElement | #311 | 🔁 Yes |
```

### 16.5 Executive Summary Counts

```
## Executive Summary
- Total Library jobs: 98
- Passed: 72 (73.5%)
- Failed: 26 (26.5%)
  - Of which re-runs attempted: 8
    - Re-run fixed: 3 (excluded from failure details)
    - Re-run still failing: 5
- Screenshot failures: 17 jobs (after re-run exclusion)
- Script play failures: 6 jobs (after re-run exclusion)
```

### 16.6 Impact on `job_discovery.js`

`discoverAndroidBuilds` is extended to return `rerunInfo` per job:

```javascript
{
  passed: [{ jobName, buildNum }],
  failed: [
    {
      jobName,
      buildNum,
      rerun: null,                          // no re-run detected
    },
    {
      jobName,
      buildNum,
      rerun: { buildNum: 313, result: 'FAILURE' },  // re-run exists, still failing
    },
    {
      jobName,
      buildNum,
      rerun: { buildNum: 565, result: 'SUCCESS' },  // re-run passed → move to passedByRerun
    },
  ],
  passedByRerun: [{ jobName, primaryBuildNum, rerunBuildNum }],
  running: [],
}
```

The `process_android_build.js` orchestrator handles `passedByRerun` jobs by writing their DB record with `rerun_result = 'PASS'` but skipping ExtentReport parsing.

---

## 17. Decisions Made

All open questions from the initial draft are resolved:

| # | Question | Decision |
|---|----------|----------|
| 1 | **ExtentReport JSON format**: Does Extent Reports v4 HTML embed a JS variable with all test data? | ✅ **Yes** — confirmed. Option A (JSON extraction from `<script>` tag) is the primary parse path. See §4.3. |
| 2 | **Authentication for HTML Publisher**: Do existing env vars work for `/ExtentReport/`? | ✅ **Yes** — `ANDROID_JENKINS_USER` + `ANDROID_JENKINS_API_TOKEN` with Basic Auth covers the HTML Publisher endpoint. No new credentials needed. |
| 3 | **Platform-specific DB separation**: Same `jenkins_history.db` or separate? | ✅ **Same DB** — extend with `platform` column. Enables unified cross-platform trending queries. See §10. |
| 4 | **Feishu channel**: Same channel or separate? | ✅ **Same channel** — Android reports delivered to the existing web CI Feishu webhook. Report title prefixed with `[Android]` for visual differentiation. See §11.1. |
| 5 | **Re-run detection**: Does Android CI re-run failed jobs? | ✅ **Mixed** — some Library jobs are manually re-triggered after failure, others are not. Full re-run detection design added in §16. Jobs fixed by re-run are excluded from failure counts. |

---

## 18. Testing Strategy

Following the `function-test-coverage` governance, the Android CI analysis modules must ensure full test coverage emphasizing exported behavior without relying solely on private internals.

### 18.1 Unit Test Coverage (Pure Functions & Parsers)

Unit tests will validate logic in complete isolation from the network or database:
- **`extent_parser.test.js`**:
  - Tests `extractTestResultsFromHtml` using anonymized HTML fixtures (`sample_extent_report.html`) to ensure JSON `<script>` boundaries are correctly detected.
  - Assertions check the exact parsed shape containing `testName`, `tcId`, `failedStepName`, and `failedStepDetails` independent of the HTTP client.
- **`failure_classifier.test.js`**:
  - Tests `classifyFailure` using mock test result objects matching raw ExtentResult patterns without testing the parsing logic itself.
  - Verifies behavior for known screenshot comparison errors vs normal exceptions vs missing outputs.
- **`job_discovery.test.js`**:
  - Validates `findMatchingBuild` and `detectRerun` logic against structured API JSON mock responses (`sample_android_jobs.json`) to confirm correct time-window calculations and filtering of fixed jobs.

### 18.2 Integration Test Coverage (Module Collaboration & IO)

Integration tests will validate how modules interact, asserting contract boundaries and external API behaviors:
- **`process_android_build` Flow**:
  - A mock Jenkins API/fetch stub is injected to return predefined JSON listings and HTML data.
  - Asserts that a mock run with 1 confirmed failure inserts exactly 1 tracking record configured with `platform = 'android'` into the SQLite DB sandbox.
- **`database/operations.js`**:
  - Tests `insertAndroidFailedStep` to ensure strictly Android-specific fields (`tc_id_raw`, `config_url`) commit correctly, without negatively affecting `platform = 'web'` rows.

### 18.3 Smoke/End-to-End Test

- **`android_analyzer.sh`**:
  - Ensures robust entrypoint validation. Invokes the CLI script via local system calls (`Trigger_Library_Jobs` `89`) using a test `REPORT_DIR`.
  - Confirms it successfully coordinates Node pipelines, cleanly halts on "cache hit" (`android_report.docx` already exists), and intercepts any Feishu transmissions seamlessly during the dry-run mode.

---

**Author:** Atlas Daily (QA Monitoring Agent)  
**Version:** 1.2 — Decisions incorporated + Testing Strategy added  
**Date:** 2026-02-24