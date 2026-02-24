# Jenkins Analysis Enhancement Design V2

**Author:** Atlas Daily (QA Daily Check Agent)  
**Date:** 2026-02-24  
**Status:** 🔄 Design Phase  

---

## Problem Statement

The current implementation has three critical issues:

### Issue 1: Missing Test File Name
- **Current:** Test ID and Step Name show as "N/A" in reports
- **Expected:** Extract from console log's "Failed Detail" section
- **Example:**
  ```
  specs/regression/customapp/CustomAppShowToolBar.spec.js(1 failed)
    [TC78888] Library as home - Show Toolbar - Disable Favorites:
  ```
- **Need:** Capture `specs/regression/customapp/CustomAppShowToolBar.spec.js`

### Issue 2: Incomplete Error Message Extraction
- **Current:** Only captures first line of error
- **Expected:** Extract full detailed error from "Failed Detail" section
- **Example:**
  ```
  - Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" 
    doesn't match the baseline. Visit http://10.23.33.4:3000/... for details.
  ```
- **Problem:** Retries (run_1, run_2, run_3) duplicate same error - need deduplication
- **Need:** Capture complete error message, deduplicate across retries

### Issue 3: History Lookup Not Working
- **Current:** "Last Failed Build" always shows "First failure" even when tested with 2 builds
- **Expected:** Query database to find if same error occurred in previous builds
- **Need:** Fix the historical failure detection logic

---

## Solution Design

### Part 1: Enhanced Console Log Parsing

#### 1.1 Add File Name Extraction

**Location:** `scripts/db_writer.js` → `extractFailuresFromLog()`

**New Regex Pattern:**
```javascript
const FILE_PATTERN = /^(specs\/[^\s]+\.spec\.js)\(\d+\s+failed\)/m;
```

**Logic:**
1. When encountering a test case block, look backwards/upwards for the file name pattern
2. Associate file name with all test cases in that block
3. Store in new column `file_name`

**Example Match:**
```
Input: "specs/regression/customapp/CustomAppShowToolBar.spec.js(1 failed)"
Capture: "specs/regression/customapp/CustomAppShowToolBar.spec.js"
```

#### 1.2 Enhanced Error Message Extraction

**Current Problem:**
```javascript
// Only captures: "Screenshot "TC78888_01..." doesn't match"
const SCREENSHOT_RE = /Screenshot\s+"(TC\d+_\d+)\s+-\s+(.+?)"\s+doesn't match/;
```

**New Approach:**
```javascript
// Capture multi-line error including stack trace
const extractErrorBlock = (runBlock) => {
  // Find from "- Failed:" to next "at <Jasmine>" or end of block
  const errorStart = runBlock.indexOf('- Failed:');
  if (errorStart === -1) return null;
  
  const lines = runBlock.slice(errorStart).split('\n');
  const errorLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('at <Jasmine>')) break;
    errorLines.push(lines[i]);
  }
  
  return errorLines.join('\n').trim();
};
```

**Deduplication Strategy:**
Since `run_1`, `run_2`, `run_3` have identical errors:
- Extract error from first occurrence only
- Skip duplicate runs when building fingerprint
- Store run count separately: `retry_count: 3`

#### 1.3 Updated Database Schema

**Add to `failed_steps` table:**
```sql
ALTER TABLE failed_steps ADD COLUMN file_name TEXT;
ALTER TABLE failed_steps ADD COLUMN retry_count INTEGER DEFAULT 1;
ALTER TABLE failed_steps ADD COLUMN full_error_msg TEXT;  -- Long text field
```

**Modified Structure:**
```sql
CREATE TABLE IF NOT EXISTS failed_steps (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  failed_job_id       INTEGER NOT NULL REFERENCES failed_jobs(id) ON DELETE CASCADE,
  
  -- Test identification
  file_name           TEXT    NOT NULL,  -- NEW: specs/regression/customapp/...
  tc_id               TEXT    NOT NULL,  -- TC78888
  tc_name             TEXT    NOT NULL,  -- Library as home - Show Toolbar...
  step_id             TEXT    NOT NULL,  -- TC78888_01
  step_name           TEXT    NOT NULL,  -- Custom info window - Only show all 7 icons
  
  -- Execution details
  run_label           TEXT,              -- run_1, run_2, etc.
  retry_count         INTEGER DEFAULT 1, -- NEW: How many times this failed (deduplicated)
  
  -- Error details
  failure_type        TEXT,              -- screenshot_mismatch, assertion_failure
  failure_msg         TEXT,              -- Short summary
  full_error_msg      TEXT,              -- NEW: Complete error with stack trace
  error_fingerprint   TEXT,              -- SHA256 hash for matching
  
  -- Snapshot tracking
  snapshot_url        TEXT,
  spectre_test_id     INTEGER,
  spectre_diff_pct    REAL,
  spectre_threshold   REAL,
  spectre_pass        INTEGER,
  snapshot_verified   INTEGER DEFAULT 0,
  false_alarm         INTEGER DEFAULT 0,
  snapshot_reason     TEXT,
  
  -- History tracking
  last_failed_build   INTEGER,
  is_recurring        INTEGER DEFAULT 0
);
```

---

### Part 2: Fix History Lookup

#### 2.1 Current Implementation Analysis

**Function:** `findLastFailedBuild(db, jobName, fingerprint, currentBuild)`

**Current Query:**
```sql
SELECT fs.last_failed_build, jr.job_build
FROM failed_steps fs
JOIN failed_jobs fj ON fs.failed_job_id = fj.id
JOIN job_runs jr ON fj.run_id = jr.id
WHERE fj.job_name = ? AND fs.error_fingerprint = ? AND jr.job_build < ?
ORDER BY jr.job_build DESC LIMIT 1
```

**Problem Identified:**
- Circular logic: `fs.last_failed_build` is the value we're trying to SET, not READ
- Should read `jr.job_build` directly, not `fs.last_failed_build`

#### 2.2 Corrected Logic

**Fixed Query:**
```sql
SELECT jr.job_build
FROM failed_steps fs
JOIN failed_jobs fj ON fs.failed_job_id = fj.id
JOIN job_runs jr ON fj.run_id = jr.id
WHERE fj.job_name = ? 
  AND fs.error_fingerprint = ? 
  AND jr.job_build < ?
ORDER BY jr.job_build DESC 
LIMIT 1
```

**Fixed Function:**
```javascript
const findLastFailedBuild = (db, jobName, fingerprint, currentBuild) => {
  const row = db.prepare(`
    SELECT jr.job_build
    FROM failed_steps fs
    JOIN failed_jobs fj ON fs.failed_job_id = fj.id
    JOIN job_runs jr ON fj.run_id = jr.id
    WHERE fj.job_name = ? 
      AND fs.error_fingerprint = ? 
      AND jr.job_build < ?
    ORDER BY jr.job_build DESC 
    LIMIT 1
  `).get(jobName, fingerprint, currentBuild);
  
  if (row) {
    return { 
      lastFailedBuild: row.job_build, 
      isRecurring: 1 
    };
  }
  
  return { 
    lastFailedBuild: null, 
    isRecurring: 0 
  };
};
```

**Test Scenario:**
```
Build 2200: TC78888 fails → last_failed_build = NULL, is_recurring = 0
Build 2201: TC78888 fails → last_failed_build = 2200, is_recurring = 1
Build 2202: TC78888 passes → (no entry)
Build 2203: TC78888 fails → last_failed_build = 2201, is_recurring = 1
```

---

### Part 3: Enhanced Parsing Flow

#### 3.1 New Parsing Structure

**File:** `db_writer.js` → `extractFailuresFromLog()`

```javascript
const extractFailuresFromLog = (consoleText) => {
  const results = [];
  
  // Step 1: Split into file blocks
  const fileBlocks = splitByFilePattern(consoleText);
  
  fileBlocks.forEach(fileBlock => {
    const fileName = extractFileName(fileBlock);
    const tcBlocks = splitByTestCase(fileBlock);
    
    tcBlocks.forEach(tcBlock => {
      const tcInfo = extractTestCaseInfo(tcBlock);
      const runBlocks = splitByRun(tcBlock);
      
      // Step 2: Deduplicate errors across retries
      const uniqueErrors = deduplicateRetries(runBlocks);
      
      uniqueErrors.forEach(error => {
        results.push({
          fileName: fileName,
          tcId: tcInfo.id,
          tcName: tcInfo.name,
          stepId: error.stepId,
          stepName: error.stepName,
          retryCount: error.retryCount,
          failureType: error.type,
          failureMsg: error.shortMsg,
          fullErrorMsg: error.fullMsg,
          snapshotUrl: error.url
        });
      });
    });
  });
  
  return results;
};
```

#### 3.2 Helper Functions

**Split by File Pattern:**
```javascript
const splitByFilePattern = (consoleText) => {
  // Find all "specs/...spec.js(N failed)" patterns
  const FILE_RE = /^(specs\/[^\s]+\.spec\.js)\(\d+\s+failed\)/gm;
  const matches = [...consoleText.matchAll(FILE_RE)];
  
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = matches[i + 1]?.index || consoleText.length;
    blocks.push({
      fileName: matches[i][1],
      content: consoleText.slice(start, end)
    });
  }
  
  return blocks;
};
```

**Deduplicate Retries:**
```javascript
const deduplicateRetries = (runBlocks) => {
  const errorMap = new Map();
  
  runBlocks.forEach(block => {
    const error = extractErrorFromRun(block);
    const key = `${error.stepId}:${error.stepName}:${error.type}`;
    
    if (!errorMap.has(key)) {
      errorMap.set(key, { ...error, retryCount: 1 });
    } else {
      errorMap.get(key).retryCount++;
    }
  });
  
  return Array.from(errorMap.values());
};
```

**Extract Full Error:**
```javascript
const extractFullError = (runBlock) => {
  const failedIndex = runBlock.indexOf('- Failed:');
  if (failedIndex === -1) return null;
  
  const afterFailed = runBlock.slice(failedIndex);
  const lines = afterFailed.split('\n');
  
  const errorLines = [];
  for (const line of lines) {
    if (line.includes('at <Jasmine>')) break;
    if (line.includes('at runMicrotasks')) break;
    errorLines.push(line.trim());
  }
  
  return errorLines.join('\n');
};
```

---

### Part 4: Updated Report Generation

#### 4.1 Modified Report Table

**File:** `scripts/report_generator.js`

**Current Table:**
```
| Job | TC ID | Step ID | Category | Root Cause | Last Failed Build | Snapshot | Suggestion |
```

**New Table:**
```
| Job | File | TC ID | Step ID | Category | Last Failed | Retries | Error | Snapshot | Suggestion |
```

**Column Definitions:**
- **File:** Short file name (e.g., `CustomAppShowToolBar.spec.js`)
- **TC ID:** Test case ID (e.g., `TC78888`)
- **Step ID:** Step identifier (e.g., `TC78888_01`)
- **Last Failed:** Build number or "First failure"
- **Retries:** Number of retry attempts (e.g., `3x`)
- **Error:** Truncated error message with expand option

#### 4.2 Error Display Strategy

**Short Error (in table):**
```javascript
const shortError = truncate(step.failure_msg, 50);
```

**Full Error (in details):**
```markdown
<details>
<summary>📋 Full Error Message</summary>

\`\`\`
[Full stack trace here]
\`\`\`
</details>
```

#### 4.3 Query Updates

**Fetch steps with file names:**
```javascript
steps = db.prepare(`
  SELECT 
    fs.*,
    fj.job_name,
    fj.job_build,
    jr.job_build as current_build
  FROM failed_steps fs
  JOIN failed_jobs fj ON fs.failed_job_id = fj.id
  JOIN job_runs jr ON fj.run_id = jr.id
  WHERE fj.job_name = ? AND fj.job_build = ?
`).all(jobName, buildNumber);
```

---

## Implementation Plan

### Phase 1: Database Migration
1. ✅ Add new columns to `failed_steps` table
2. ✅ Test migration with existing data
3. ✅ Update schema documentation

### Phase 2: Parser Enhancement
1. ✅ Implement file name extraction
2. ✅ Implement full error message capture
3. ✅ Implement retry deduplication
4. ✅ Update unit tests

### Phase 3: History Fix
1. ✅ Fix `findLastFailedBuild()` query
2. ✅ Test with 2 consecutive failing builds
3. ✅ Verify recurring detection works

### Phase 4: Report Update
1. ✅ Add file name column
2. ✅ Add retry count display
3. ✅ Add expandable error details
4. ✅ Test clickable links in DOCX

### Phase 5: Testing & Validation
1. ✅ Unit tests for new parsing logic
2. ✅ Integration test with real console log
3. ✅ Manual verification with builds 2200 & 2201
4. ✅ Performance test with large logs

---

## Open Questions

### Q1: File Name Storage
**Question:** Should we store full path or just filename?
- Full: `specs/regression/customapp/CustomAppShowToolBar.spec.js`
- Short: `CustomAppShowToolBar.spec.js`

**Recommendation:** Store full path, display short name in reports
**Reason:** Full path needed for uniqueness (avoid name collisions)

### Q2: Retry Deduplication Strategy
**Question:** Should we store all runs or just the deduplicated result?

**Option A:** Store one row per unique failure with `retry_count`
```
TC78888_01 | retry_count=3 | run_label="run_1,run_2,run_3"
```

**Option B:** Store all runs, deduplicate in report
```
TC78888_01 | retry_count=1 | run_label="run_1"
TC78888_01 | retry_count=1 | run_label="run_2"
TC78888_01 | retry_count=1 | run_label="run_3"
```

**Recommendation:** Option A (deduplicate during insertion)
**Reason:** Cleaner database, easier queries, matches actual failure count

### Q3: Error Message Length Limit
**Question:** Should we truncate `full_error_msg` in database?

**Options:**
- No limit (store full stack trace)
- Limit to 5000 characters
- Limit to 1000 characters

**Recommendation:** No limit initially, monitor size
**Reason:** SQLite TEXT type can handle large data, better to have complete info

### Q4: Historical Lookup Scope
**Question:** Should we look back across all builds or just last N builds?

**Current:** Looks back indefinitely (within 5-build retention window)
**Alternative:** Only check last 1 build

**Recommendation:** Keep current (within retention window)
**Reason:** Flaky tests might pass occasionally, need broader history

### Q5: Fingerprint Calculation
**Question:** Should file name be part of the fingerprint?

**Current Fingerprint:**
```javascript
buildFingerprint(tcId, stepId, stepName, failureType)
```

**Proposed Fingerprint:**
```javascript
buildFingerprint(fileName, tcId, stepId, stepName, failureType)
```

**Recommendation:** Add file name to fingerprint
**Reason:** Same TC ID might appear in different files (edge case protection)

---

## Migration Script

```javascript
#!/usr/bin/env node
/**
 * Migration: Add file_name, retry_count, full_error_msg columns
 */

const Database = require('./scripts/db-adapter');
const path = require('path');

const migrate = async () => {
  const dbPath = path.join(__dirname, 'data', 'jenkins_history.db');
  const db = await Database.create(dbPath);
  
  console.log('Running migration: Add v2 columns...');
  
  db.exec(`
    ALTER TABLE failed_steps ADD COLUMN file_name TEXT DEFAULT 'unknown.spec.js';
    ALTER TABLE failed_steps ADD COLUMN retry_count INTEGER DEFAULT 1;
    ALTER TABLE failed_steps ADD COLUMN full_error_msg TEXT;
  `);
  
  console.log('Migration complete ✓');
  db.close();
};

migrate().catch(console.error);
```

---

## Testing Checklist

### Unit Tests
- [ ] Test file name extraction regex
- [ ] Test full error message extraction
- [ ] Test retry deduplication logic
- [ ] Test fingerprint generation with file name
- [ ] Test historical lookup with 2 builds

### Integration Tests
- [ ] Parse actual console log from build 2201
- [ ] Verify file names extracted correctly
- [ ] Verify errors deduplicated (3 retries → 1 entry)
- [ ] Insert into database and verify schema
- [ ] Query with build 2200 and verify history match

### Report Tests
- [ ] Generate report with new columns
- [ ] Verify clickable file names (if converted to links)
- [ ] Verify expandable error details
- [ ] Convert to DOCX and verify formatting
- [ ] Test with 0 failures, 1 failure, multiple failures

---

## Success Criteria

### Must Have (P0)
✅ File name extracted and stored for all failures
✅ Full error message captured (not just first line)
✅ Retries deduplicated (3 runs → 1 entry with count)
✅ Historical lookup works (finds previous build failures)
✅ Report shows file name, retry count, last failed build

### Should Have (P1)
✅ Expandable error details in report
✅ Performance: Parse 1000-line log in < 2 seconds
✅ Migration script for existing database
✅ Unit test coverage > 80%

### Nice to Have (P2)
⚪ Visual diff preview in report (if Spectre API provides thumbnail)
⚪ Trend chart showing failure frequency over time
⚪ Auto-link file names to GitHub (if repo URL configured)

---

## Timeline Estimate

- **Phase 1 (DB Migration):** 30 min
- **Phase 2 (Parser Enhancement):** 2 hours
- **Phase 3 (History Fix):** 30 min
- **Phase 4 (Report Update):** 1 hour
- **Phase 5 (Testing):** 1 hour

**Total:** ~5 hours

---

## Next Steps

1. **Review Questions:** Confirm answers to Q1-Q5 above
2. **Approve Design:** Get explicit approval before implementation
3. **Create Branch:** `feature/jenkins-analysis-v2-fixes`
4. **Implement Phase 1:** Start with database migration
5. **Incremental Testing:** Test each phase before moving to next

---

**Document Status:** 📋 Awaiting Review & Approval
