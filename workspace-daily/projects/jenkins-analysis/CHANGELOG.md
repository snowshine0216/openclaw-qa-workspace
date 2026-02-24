# Jenkins Analysis - Changelog

## 2026-02-24 - Improved Report Readability

### 🎯 Issues Fixed

1. **Verbose Error Logs in Detailed Failure Section**
   - Problem: Full stack traces displayed in detailed section made reports hard to read
   - Example job: http://tec-l-1081462.labs.microstrategy.com:8080/job/Dashboard_RadiusE2E/367/
   - Expected: Only show the main error line, not the entire stack trace

2. **Missing Snapshot Links in Detailed Failure Section**
   - Problem: Snapshot URLs were only shown in summary table, not in detailed analysis
   - Users had to scroll up to find snapshot links

### ✅ Changes Made

#### Report Generator Updates (`scripts/report_generator.js`)

**1. Concise Error Messages:**
- Changed from displaying `full_error_msg` in expandable `<details>` blocks
- Now shows only the first line of the error message
- Implementation:
  ```javascript
  const firstLine = step.full_error_msg.split('\n')[0].replace(/^- Failed:/, '').trim();
  report += `   - ❌ Error: ${firstLine}\n\n`;
  ```

**2. Added Snapshot Links to Detailed Section:**
- Added snapshot URL display before error message
- Format: `📸 Snapshot: [View Diff](URL) ⚠️ False Alarm`
- Implementation:
  ```javascript
  if (step.snapshot_url) {
    const badge = step.false_alarm ? ' ⚠️ False Alarm' : '';
    report += `   - 📸 Snapshot: [View Diff](${step.snapshot_url})${badge}\n`;
  }
  ```

### 🧪 Test Results

#### Test Case: Dashboard_RadiusE2E #367

**Before:**
```
<details>
<summary>📋 Full Error Message</summary>

```
- Failed:Screenshot "TC99550_16 - Before changing viz types" doesn't match the baseline. Visit http://10.23.33.4:3000/projects/wdio_ci/suites/radius-e2e/runs/503#test_6053608 for details.
at <Jasmine>
at takeScreenshotByElement (file:///home/admin/jenkins/workspace/Dashboard_RadiusE2E/web-dossier/tests/wdio/utils/TakeScreenshot.ts:36:30)
at runMicrotasks (<anonymous>)
at processTicksAndRejections (node:internal/process/task_queues:96:5)
at async UserContext.<anonymous> (file:///home/admin/jenkins/workspace/Dashboard_RadiusE2E/web-dossier/tests/wdio/specs/regression/dashboardAuthoring/adjustRadiusSpacingAndShadow/E2E_radius.spec.js:152:9)
```
</details>
```
(No snapshot link)

**After:**
```
   - Retries: 3x
   - 🆕 First occurrence
   - 📸 Snapshot: [View Diff](http://10.23.33.4:3000/projects/wdio_ci/suites/radius-e2e/runs/503#test_6053608) ⚠️ False Alarm
   - ❌ Error: Screenshot "TC99550_16 - Before changing viz types" doesn't match the baseline. Visit http://10.23.33.4:3000/projects/wdio_ci/suites/radius-e2e/runs/503#test_6053608 for details.
```

### 📋 Files Modified

1. `scripts/report_generator.js` - Improved detailed failure section formatting

### 🎨 Benefits

- ✅ **Cleaner reports**: No verbose stack traces cluttering the view
- ✅ **Better UX**: Snapshot links immediately accessible in detailed section
- ✅ **Consistency**: Same information in both summary table and detailed section
- ✅ **Maintained details**: Full console log still available in expandable section at bottom

### 🔄 Backward Compatibility

✅ **Maintained**
- Summary table unchanged
- Console log section still includes full output
- No breaking changes to report structure

---

## 2026-02-24 - Extended ID Pattern Support & Job Blacklist

### 🎯 Issues Fixed

1. **Missing TC ID/Name for Non-TC Prefixes**
   - URLs affected:
     - http://tec-l-1081462.labs.microstrategy.com:8080/job/Dashboard_LockPageSizeE2E/79/
     - http://tec-l-1081462.labs.microstrategy.com:8080/job/LibraryWeb_Report_UICheck/385/
   - Root cause: Parser only supported `TC` prefix, not `QAC-`, `BCIN-`, etc.

2. **Job Blacklist Requirement**
   - Jobs to skip:
     - `LibraryWeb_AutoAnswer_MultiJob`
     - `api_multijob`

### ✅ Changes Made

#### 1. Parser V2 Updates (`scripts/parser_v2.js`)

**Extended ID Pattern Support:**
- Updated `extractTestCaseInfo()`:
  - Old: `/\[(TC\d+[^\]]*)\]\s+([^:]+)/m`
  - New: `/\[((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+[^\]]*)\]\s+([^:]+)/m`

- Updated `extractScreenshotInfo()`:
  - Old: `/Screenshot\s+"(TC\d+_\d+)\s+-\s+(.+?)"\s+doesn't match/`
  - New: `/Screenshot\s+"((?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)[^"]+)\s+-\s+(.+?)"\s+doesn't match/`

- Updated `extractFailuresFromLog()` TC block splitting:
  - Old: `/(?=.*?\[TC\d+)/m`
  - New: `/(?=.*?\[(?:TC|QAC-|BCIN-|TSTR-|BUG-|TASK-)\d+)/m`

- Updated `extractFailuresFromLogLegacy()`:
  - TC header regex now supports all prefixes
  - Screenshot regex now supports all prefixes
  - TC block splitting now supports all prefixes
  - Run block regex now handles corrupted emoji characters: `/[✗�]+\s+(run_\d+)/g`

**Supported ID Prefixes:**
- `TC` - Standard test case (e.g., TC85322)
- `QAC-` - QA case (e.g., QAC-487_3)
- `BCIN-` - Bug/Change ID (e.g., BCIN-5296)
- `TSTR-` - Test story (e.g., TSTR-1234)
- `BUG-` - Bug ID (e.g., BUG-5678)
- `TASK-` - Task ID (e.g., TASK-9012)

#### 2. Analyzer Updates (`scripts/analyzer.sh`)

**Job Blacklist:**
```bash
BLACKLISTED_JOBS=(
  "LibraryWeb_AutoAnswer_MultiJob"
  "api_multijob"
)
```
- Checks blacklist early (before creating report directory)
- Logs: "⚠ Job X is blacklisted, skipping analysis"
- Exits cleanly with code 0

**Standalone Job Support:**
- When no downstream jobs found, treats job as standalone:
  ```bash
  DOWNSTREAM_JOBS="$JOB_NAME"
  TRIGGERED_BUILDS="${JOB_NAME}|${BUILD_NUMBER}"
  ```
- Logs: "⚠ No downstream jobs found - treating as standalone job"

### 🧪 Test Results

#### Test Case 1: Dashboard_LockPageSizeE2E #79 (QAC- prefix)
✅ **Pass**
- TC ID extracted: `QAC-487_3`, `QAC-487_4`
- TC Names extracted: "Insert pages/chapters", "Duplicate"
- Step IDs extracted: `QAC-487_3_1`, `QAC-487_4_1`
- Snapshot URLs linked correctly
- Report generated successfully

#### Test Case 2: LibraryWeb_Report_UICheck #385 (BCIN- prefix)
✅ **Pass**
- TC ID extracted: `BCIN-5296`
- TC Name extracted: "Verify report format panel under Japanese"
- Step ID extracted: `BCIN-5296_04`
- Snapshot URL linked correctly
- Report generated successfully

#### Test Case 3: Blacklist - LibraryWeb_AutoAnswer_MultiJob #999
✅ **Pass**
- Skipped early with message: "⚠ Job LibraryWeb_AutoAnswer_MultiJob is blacklisted, skipping analysis"
- No report directory created
- Clean exit with code 0

### 📋 Files Modified

1. `scripts/parser_v2.js` - Extended ID pattern support
2. `scripts/analyzer.sh` - Added blacklist and standalone job support

### 🔄 Backward Compatibility

✅ **Maintained**
- All existing `TC` prefix tests continue to work
- Legacy parser fallback still functional
- No breaking changes to database schema or API

### 📌 Notes

- All supported prefixes are regex-based, easy to extend if new patterns emerge
- Blacklist can be extended by adding more job names to `BLACKLISTED_JOBS` array
- Standalone job mode works for both successful and failed jobs

### 🚀 Next Steps (Optional)

- [ ] Add pattern support for other ID formats if discovered
- [ ] Make blacklist configurable via external config file
- [ ] Add metrics tracking for blacklisted job skip rate
