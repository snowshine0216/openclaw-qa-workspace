# Data Flow Diagram - Jenkins Analysis V2

## Current vs. Proposed Flow

### Current Flow (Problems)
```
Console Log
    ↓
extractFailuresFromLog()
    ↓
[TC78888] → TC ID ✓
[run_1, run_2, run_3] → 3 duplicate entries ✗
"Screenshot..." → Short error only ✗
??? → No file name ✗
    ↓
Database Insert
    ↓
findLastFailedBuild()
    ↓
SELECT fs.last_failed_build ✗ (circular logic)
    ↓
Report: "First failure" (always wrong) ✗
```

### Proposed Flow (Fixed)
```
Console Log
    ↓
Step 1: Split by File Pattern
    "specs/regression/customapp/CustomAppShowToolBar.spec.js(1 failed)"
    ↓
Step 2: Extract Test Cases
    [TC78888] Library as home - Show Toolbar - Disable Favorites
    ↓
Step 3: Extract Runs
    ✗ run_1 → Error block 1
    ✗ run_2 → Error block 2
    ✗ run_3 → Error block 3
    ↓
Step 4: Deduplicate Retries
    Error block 1 == Error block 2 == Error block 3
    → Single entry with retry_count = 3
    ↓
Step 5: Extract Full Error
    "- Failed:Screenshot "TC78888_01..." doesn't match the baseline.
     Visit http://10.23.33.4:3000/... for details.
     at <Jasmine>
     at takeScreenshotByElement..."
    ↓
Database Insert
    file_name: "specs/regression/customapp/CustomAppShowToolBar.spec.js"
    tc_id: "TC78888"
    step_id: "TC78888_01"
    retry_count: 3
    full_error_msg: [complete stack trace]
    ↓
Step 6: Historical Lookup
    SELECT jr.job_build FROM ...
    WHERE fingerprint = X AND job_build < current
    ↓
    Build 2200: Found! → last_failed_build = 2200, is_recurring = 1
    ↓
Report Generation
    | File | TC ID | Step | Last Failed | Retries | Error |
    | CustomApp... | TC78888 | TC78888_01 | #2200 | 3x | [expandable] |
```

## Database Schema Evolution

### Before (V1)
```sql
failed_steps
├── tc_id (TC78888)
├── tc_name (Library as home...)
├── step_id (TC78888_01)
├── step_name (Custom info window...)
├── failure_msg ("Screenshot...") ← SHORT ONLY
├── error_fingerprint (sha256)
├── last_failed_build (NULL) ← BROKEN
└── is_recurring (0) ← BROKEN
```

### After (V2)
```sql
failed_steps
├── file_name (specs/regression/...) ← NEW
├── tc_id (TC78888)
├── tc_name (Library as home...)
├── step_id (TC78888_01)
├── step_name (Custom info window...)
├── retry_count (3) ← NEW
├── failure_msg ("Screenshot...") ← SHORT
├── full_error_msg (...complete trace...) ← NEW
├── error_fingerprint (sha256 with file_name)
├── last_failed_build (2200) ← FIXED
└── is_recurring (1) ← FIXED
```

## Example Data Transformation

### Input: Console Log (Build 2201)
```
------------------------------ Failed Detail ------------------------------
specs/regression/customapp/CustomAppShowToolBar.spec.js(1 failed)
  [TC78888] Library as home - Show Toolbar - Disable Favorites:
    ✗ run_1
      - Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" 
        doesn't match the baseline. 
        Visit http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571#test_6055635 for details.
        at <Jasmine>
        at takeScreenshotByElement (file:///home/admin/.../TakeScreenshot.ts:36:30)
        at runMicrotasks (<anonymous>)
        at processTicksAndRejections (node:internal/process/task_queues:96:5)
        at async UserContext.<anonymous> (file:///home/admin/.../CustomAppShowToolBar.spec.js:290:9)
    ✗ run_2
      - Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" 
        doesn't match the baseline. 
        Visit http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2572#test_6055727 for details.
        [same stack trace]
    ✗ run_3
      - Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" 
        doesn't match the baseline. 
        Visit http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2573#test_6055755 for details.
        [same stack trace]
```

### Output: Database Record (Deduplicated)
```javascript
{
  id: 42,
  failed_job_id: 15,
  
  // Identification
  file_name: "specs/regression/customapp/CustomAppShowToolBar.spec.js",
  tc_id: "TC78888",
  tc_name: "Library as home - Show Toolbar - Disable Favorites",
  step_id: "TC78888_01",
  step_name: "Custom info window - Only show all 7 icons",
  
  // Execution
  run_label: "run_1", // First occurrence
  retry_count: 3,     // Deduplicated count
  
  // Error details
  failure_type: "screenshot_mismatch",
  failure_msg: "Screenshot \"TC78888_01...\" doesn't match the baseline.",
  full_error_msg: `- Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" doesn't match the baseline. 
Visit http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571#test_6055635 for details.
at <Jasmine>
at takeScreenshotByElement (file:///home/admin/.../TakeScreenshot.ts:36:30)
at runMicrotasks (<anonymous>)
at processTicksAndRejections (node:internal/process/task_queues:96:5)
at async UserContext.<anonymous> (file:///home/admin/.../CustomAppShowToolBar.spec.js:290:9)`,
  
  error_fingerprint: "sha256:abc123...", // Includes file_name now
  
  // Snapshot
  snapshot_url: "http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571#test_6055635",
  spectre_diff_pct: 2.5,
  false_alarm: 0,
  
  // History (FIXED!)
  last_failed_build: 2200,  // Found in database from previous build
  is_recurring: 1           // True - failed before
}
```

### Output: Report Table Row
```markdown
| CustomAppShowToolBar.spec.js | TC78888 | TC78888_01 | 📸 Screenshot | #2200 | 3x | Screenshot doesn't match... | 🔗 View | Fix baseline |
```

## Historical Lookup Logic

### Build Timeline Example
```
Build 2199: TC78888 PASS ✓ → No database entry

Build 2200: TC78888 FAIL ✗
    ↓
findLastFailedBuild(job="CustomApp", fingerprint="abc123", currentBuild=2200)
    → Query: SELECT job_build WHERE ... AND job_build < 2200
    → Result: NULL (no previous failure)
    ↓
Database: last_failed_build = NULL, is_recurring = 0
Report: "First failure"

Build 2201: TC78888 FAIL ✗
    ↓
findLastFailedBuild(job="CustomApp", fingerprint="abc123", currentBuild=2201)
    → Query: SELECT job_build WHERE ... AND job_build < 2201
    → Result: 2200 ✓ (found previous failure)
    ↓
Database: last_failed_build = 2200, is_recurring = 1
Report: "#2200" (recurring issue)

Build 2202: TC78888 PASS ✓ → No database entry

Build 2203: TC78888 FAIL ✗
    ↓
findLastFailedBuild(job="CustomApp", fingerprint="abc123", currentBuild=2203)
    → Query: SELECT job_build WHERE ... AND job_build < 2203
    → Result: 2201 ✓ (found last failure, skipped 2202 pass)
    ↓
Database: last_failed_build = 2201, is_recurring = 1
Report: "#2201" (recurring issue, intermittent)
```

## Fingerprint Calculation

### Old Fingerprint (Missing Context)
```javascript
const payload = [tcId, stepId, stepName, failureType].join('|');
// "TC78888|TC78888_01|Custom info window...|screenshot_mismatch"

hash = sha256(payload);
```

**Problem:** Same TC ID in different files would collide

### New Fingerprint (With File)
```javascript
const payload = [fileName, tcId, stepId, stepName, failureType].join('|');
// "specs/.../CustomAppShowToolBar.spec.js|TC78888|TC78888_01|Custom info...|screenshot_mismatch"

hash = sha256(payload);
```

**Benefit:** Unique across files, prevents collisions

## Report Evolution

### Old Report (V1)
```markdown
| Job | TC ID | Step ID | Category | Root Cause | Last Failed Build | Snapshot | Suggestion |
|-----|-------|---------|----------|------------|-------------------|----------|------------|
| CustomApp | N/A | N/A | 📝 Script | Unknown | First failure | N/A | See details |
```

### New Report (V2)
```markdown
| Job | File | TC ID | Step ID | Category | Last Failed | Retries | Error | Snapshot | Suggestion |
|-----|------|-------|---------|----------|-------------|---------|-------|----------|------------|
| [CustomApp](link) | CustomAppShowToolBar.spec.js | TC78888 | TC78888_01 | 📸 Visual | #2200 | 3x | Screenshot doesn't match... <details>...</details> | [📸 View](link) | Update baseline |
```

**Improvements:**
✅ File name visible
✅ Test ID extracted correctly
✅ Historical context shown (#2200)
✅ Retry count displayed (3x)
✅ Full error expandable
✅ Direct links to Jenkins and Spectre

---

## File Extraction Logic

### Pattern Matching
```javascript
// Input console log block:
const consoleText = `
------------------------------ Failed Detail ------------------------------
specs/regression/customapp/CustomAppShowToolBar.spec.js(1 failed)
  [TC78888] Library as home - Show Toolbar - Disable Favorites:
    ✗ run_1
      - Failed:Screenshot...
`;

// Step 1: Find file pattern
const FILE_RE = /^(specs\/[^\s]+\.spec\.js)\(\d+\s+failed\)/gm;
const match = consoleText.match(FILE_RE);
// → ["specs/regression/customapp/CustomAppShowToolBar.spec.js(1 failed)"]

// Step 2: Extract file name
const fileName = match[0].replace(/\(\d+\s+failed\)/, '');
// → "specs/regression/customapp/CustomAppShowToolBar.spec.js"

// Step 3: Find associated test cases
const tcStart = match.index + match[0].length;
const nextFileIndex = consoleText.indexOf('\nspecs/', tcStart);
const tcBlock = consoleText.slice(tcStart, nextFileIndex);
// → Contains all test cases for this file
```

### Association Logic
```javascript
// Map structure:
const fileToTests = new Map();

// Parse console log
const files = extractFileBlocks(consoleText);
files.forEach(({ fileName, content }) => {
  const testCases = extractTestCases(content);
  testCases.forEach(tc => {
    tc.fileName = fileName; // Associate file with test
    results.push(tc);
  });
});

// Result:
[
  {
    fileName: "specs/regression/customapp/CustomAppShowToolBar.spec.js",
    tcId: "TC78888",
    tcName: "Library as home - Show Toolbar - Disable Favorites",
    stepId: "TC78888_01",
    ...
  }
]
```

---

**Diagram Status:** 📊 Complete - Ready for Implementation
