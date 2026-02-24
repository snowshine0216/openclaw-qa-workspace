# Implementation Decisions - APPROVED

**Date:** 2026-02-24 10:26 GMT+8  
**Status:** ✅ Approved by Snow - Ready to Implement

---

## Approved Decisions

| # | Question | Decision | Notes |
|---|----------|----------|-------|
| Q1 | File name storage | **Full path** | Store: `specs/regression/customapp/CustomAppShowToolBar.spec.js`<br>Display: Short name in table |
| Q2 | Retry deduplication | **Deduplicate** | 3 retries → 1 DB row with retry_count=3 |
| Q3 | Error message length | **No limit** | Store complete stack trace |
| Q4 | Historical lookup scope | **Last 5 builds** | Modified from "all in retention" to "last 5 specifically" |
| Q5 | Fingerprint calculation | **Include file name** | Prevents collisions across files |
| Q6 | File display in report | **Short name + link** | CustomAppShowToolBar.spec.js (clickable) |
| Q7 | Error display | **Expandable details** | Truncated in table, full in `<details>` |
| Q8 | Retry display | **Badge style** | 🔄 3x |
| Q9 | Implementation priority | **All together** | Complete fix in one go |
| Q10 | Testing strategy | **Both real + mock** | Unit tests + real build 2201 |

---

## Q4 Implementation Details

### Historical Lookup Query
```sql
SELECT jr.job_build 
FROM failed_steps fs
JOIN failed_jobs fj ON fs.failed_job_id = fj.id
JOIN job_runs jr ON fj.run_id = jr.id
WHERE fj.job_name = ? 
  AND fs.error_fingerprint = ? 
  AND jr.job_build < ?
ORDER BY jr.job_build DESC 
LIMIT 5  -- Look back last 5 builds only
```

### Logic Flow
```javascript
const findLastFailedBuild = (db, jobName, fingerprint, currentBuild) => {
  // Get up to 5 previous build failures
  const rows = db.prepare(`
    SELECT jr.job_build 
    FROM failed_steps fs
    JOIN failed_jobs fj ON fs.failed_job_id = fj.id
    JOIN job_runs jr ON fj.run_id = jr.id
    WHERE fj.job_name = ? 
      AND fs.error_fingerprint = ? 
      AND jr.job_build < ?
    ORDER BY jr.job_build DESC 
    LIMIT 5
  `).all(jobName, fingerprint, currentBuild);
  
  if (rows.length === 0) {
    return { 
      lastFailedBuild: null, 
      isRecurring: 0,
      failureHistory: []
    };
  }
  
  return { 
    lastFailedBuild: rows[0].job_build,  // Most recent
    isRecurring: 1,
    failureHistory: rows.map(r => r.job_build)  // All 5
  };
};
```

### Example Timeline
```
Build 2195: TC78888 FAIL ✗
Build 2196: TC78888 PASS ✓
Build 2197: TC78888 FAIL ✗
Build 2198: TC78888 PASS ✓
Build 2199: TC78888 PASS ✓
Build 2200: TC78888 FAIL ✗
Build 2201: TC78888 FAIL ✗ ← Current build

Query returns (last 5 builds):
- 2200 ✗ (most recent failure)
- 2197 ✗
- 2195 ✗

Report shows:
- last_failed_build: 2200
- is_recurring: 1
- Optional: "Failed in 3 of last 5 builds"
```

---

## Snapshot Link Handling

### URL Format (Already Correct)
```
http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571#test_6055635
```

### Extraction Pattern
```javascript
const SPECTRE_URL_RE = /Visit\s+(http:\/\/[^:]+:3000\/projects\/[^\/]+\/suites\/[^\/]+\/runs\/\d+#test_\d+)\s+for details/;
```

### Storage
```sql
snapshot_url TEXT  -- Full URL as-is
```

### Display in Report
```markdown
| Snapshot |
|----------|
| [📸 View](http://10.23.33.4:3000/.../runs/2571#test_6055635) |
```

**✅ No changes needed - already extracting and storing correctly**

---

## Database Schema Changes

### New Columns
```sql
ALTER TABLE failed_steps ADD COLUMN file_name TEXT NOT NULL;
ALTER TABLE failed_steps ADD COLUMN retry_count INTEGER DEFAULT 1;
ALTER TABLE failed_steps ADD COLUMN full_error_msg TEXT;
```

### New Index for Performance
```sql
CREATE INDEX idx_fingerprint_lookup ON failed_steps(error_fingerprint);
CREATE INDEX idx_job_build_lookup ON job_runs(job_name, job_build);
```

---

## Implementation Plan

### Phase 1: Database Migration (30 min)
- [x] Decisions approved
- [ ] Create migration script
- [ ] Test on copy of existing DB
- [ ] Add indexes

### Phase 2: Parser Enhancement (2 hours)
- [ ] Implement file name extraction
- [ ] Implement full error capture
- [ ] Implement retry deduplication
- [ ] Update fingerprint calculation
- [ ] Unit tests

### Phase 3: History Lookup Fix (30 min)
- [ ] Update `findLastFailedBuild()` to LIMIT 5
- [ ] Store failure_history array (optional)
- [ ] Test with consecutive failing builds

### Phase 4: Report Generator Update (1 hour)
- [ ] Add file_name column
- [ ] Add retry_count display
- [ ] Add expandable error details
- [ ] Test clickable links

### Phase 5: Testing & Validation (1 hour)
- [ ] Unit tests for new parsing logic
- [ ] Integration test with real build 2201
- [ ] Verify all 3 issues fixed
- [ ] Performance test with large logs

---

## Expected Timeline

- **Start:** 2026-02-24 10:30 GMT+8
- **Phase 1:** 10:30 - 11:00 (30 min)
- **Phase 2:** 11:00 - 13:00 (2 hours)
- **Phase 3:** 13:00 - 13:30 (30 min)
- **Phase 4:** 13:30 - 14:30 (1 hour)
- **Phase 5:** 14:30 - 15:30 (1 hour)
- **Completion:** ~15:30 GMT+8 (5 hours total)

---

## Success Criteria

### Must Pass
✅ File name extracted for all failures  
✅ TC ID, Step ID, Step Name all populated (no more N/A)  
✅ Full error messages stored  
✅ Retries deduplicated (3 runs → 1 entry)  
✅ Historical lookup finds last 5 builds correctly  
✅ Snapshot URLs displayed as clickable links  
✅ Report shows all new columns  

### Test Cases
1. Parse build 2201 console log
2. Verify file name = `specs/regression/customapp/CustomAppShowToolBar.spec.js`
3. Verify TC78888 extracted with all fields
4. Verify retry_count = 3
5. Insert into database
6. Query with build 2200 and verify last_failed_build populated
7. Generate report and verify new columns
8. Convert to DOCX and verify clickable links

---

**Status:** ✅ Approved - Proceeding with Implementation

---

_All decisions locked in - ready to code!_
