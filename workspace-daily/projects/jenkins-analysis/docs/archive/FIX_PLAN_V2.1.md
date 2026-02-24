# Jenkins Analysis V2.1 - Fix Plan

**Date:** 2026-02-24  
**Status:** Planning Phase  
**Target:** Fix 4 issues identified in builds 1242/1243

---

## 🐛 Issues to Fix

### Issue 1: Sort & Subtotals Show N/A Despite Having "Failed Detail"

**Observation:**
- `LibraryWeb_Report_Sort` (#888): File/TC ID/Step ID = N/A
- `LibraryWeb_Report_Subtotals` (#919): File/TC ID/Step ID = N/A
- Both have "Failed Detail" section with TC IDs
- Parser returns 0 failures

**Console Sample (Sort #888):**
```
specs/regression/reportEditor/ReportEditor_sort.spec.js(1 failed)
  [TC85322] Report editor sort TC85322:
    ✗ run_1
      - Failed:Error: element (...) still not displayed after 60000ms
```

**Root Cause (Hypothesis):**
- TC header format: `[TC85322] Report editor sort TC85322:`
- Note: TC ID appears twice - once in brackets, once in title
- Our regex: `/\[(TC\d+[^\]]*)\]\s+([^:]+)/m`
- This should match, but may fail if there's extra text after colon

**Investigation Needed:**
1. Print exact TC header line from Sort console
2. Test regex against actual header
3. Check for hidden characters or formatting issues

---

### Issue 2: Remove Step ID from Report (Simplify Display)

**Current Report Columns:**
```
| Job | File | TC ID | Step ID | Category | Root Cause | Last Failed | Retries | Snapshot | Suggestion |
```

**Desired Report Columns:**
```
| Job | File | TC ID (+ Name) | Category | Root Cause | Last Failed | Retries | Snapshot | Suggestion |
```

**Changes Required:**
1. **Report Generator (report_generator.js):**
   - Remove "Step ID" column from summary table
   - Combine "TC ID" and "TC Name" in one column
   - Format: `TC86139_02 - FUN | Report Editor | Grid View`
   - Update detailed failure sections

2. **Database Query:**
   - No schema changes needed (keep step_id for history matching)
   - Just don't display it in report

**Implementation:**
- File: `scripts/report_generator.js`
- Function: `generateSummaryTable()`
- Line: ~50-80 (table header and rows)

---

### Issue 3: Historical Failure Tracking Incorrect

**Problem:**
- GridView TC86139_02 failed in build 1242 (first time)
- Same TC failed again in build 1243 (second time)
- Report for 1243 shows "First failure" instead of "Last Failed: #1242"

**Database Check:**
```sql
SELECT jr.job_build, fj.job_name, fs.tc_id, fs.last_failed_build 
FROM failed_steps fs 
JOIN failed_jobs fj ON fs.failed_job_id = fj.id 
JOIN job_runs jr ON fj.run_id = jr.id 
WHERE fj.job_name = 'LibraryWeb_Report_GridView' AND fs.tc_id = 'TC86139_02';

Results:
1242|LibraryWeb_Report_GridView|TC86139_02| (empty)
1242|LibraryWeb_Report_GridView|TC86139_02| (duplicate entry?)
1243|LibraryWeb_Report_GridView|TC86139_02| (empty)
```

**Root Cause:**
1. `last_failed_build` is NULL/empty for all entries
2. `findLastFailedBuild()` may not be working correctly
3. Possible issues:
   - Fingerprint mismatch (file name included now)
   - Query returning wrong data
   - Timing issue (query runs before insert?)

**Investigation Needed:**
1. Check fingerprint calculation consistency
2. Verify query logic in `findLastFailedBuild()`
3. Check if historical lookup runs AFTER current build is inserted
4. Test query manually with actual fingerprints

**Current Query:**
```javascript
SELECT jr.job_build
FROM failed_steps fs
JOIN failed_jobs fj ON fs.failed_job_id = fj.id
JOIN job_runs jr ON fj.run_id = jr.id
WHERE fj.job_name = ? AND fs.error_fingerprint = ? AND jr.job_build < ?
ORDER BY jr.job_build DESC LIMIT 5
```

**Question for Snow:**
> Q1: Should "Last Failed" compare by:
> - (A) Exact fingerprint (file + TC + step + name + type) - CURRENT
> - (B) Just TC ID across all builds
> - (C) TC ID + file name only
>
> Current implementation (A) is very strict - same test must fail in exact same way.
> Option (B) would show "TC86139_02 last failed in 1242" even if error differs.

---

### Issue 4: Snapshot Link Analysis Not Performed

**Problem:**
- Spectre URLs exist in console logs (e.g., `http://10.23.33.4:3000/...#test_6057285`)
- Parser extracts URLs correctly
- But no image comparison analysis is performed
- No automated diff percentage retrieval

**Current Flow:**
```
Parser → Extracts URL → Stores in DB → Report shows link
(No actual image analysis)
```

**Desired Flow:**
```
Parser → Extracts URL → Fetch Spectre API → Get diff % → Classify → Report shows analysis
```

**Spectre API Integration (Hypothetical):**
```
GET http://10.23.33.4:3000/api/tests/6057285
Response:
{
  "id": 6057285,
  "diff": 2.5,  // percentage
  "threshold": 1.0,
  "pass": false,
  "baseline_url": "...",
  "actual_url": "...",
  "diff_url": "..."
}
```

**Questions for Snow:**
> Q2: Does Spectre have an API endpoint we can query?
> - If yes: Provide endpoint URL and authentication method
> - If no: Should we scrape the HTML page?
> - Alternative: Can we access Spectre database directly?

> Q3: When should we fetch Spectre data?
> - (A) During analysis (real-time, may be slow)
> - (B) After report generation (async, update later)
> - (C) Only on-demand (manual trigger)

> Q4: What analysis do you want displayed?
> - Diff percentage
> - Pass/fail status
> - Baseline vs actual image thumbnails
> - Automatic false alarm detection
> - Recommendation (update baseline / investigate)

**Current Implementation:**
- File: `scripts/db_writer.js`
- Function: `fetchSpectreData(url)` - currently returns null
- Function: `classifySpectreResult(data)` - basic classification logic exists

**Enhancement Needed:**
1. Implement actual Spectre API call
2. Parse response JSON
3. Extract diff percentage and threshold
4. Update report to show image comparison results
5. Add visual indicators (🟢 < 1% | 🟡 1-5% | 🔴 > 5%)

---

## 📋 Implementation Plan

### Phase 1: Fix Sort/Subtotals Parser Issue (Priority: P0)

**Steps:**
1. Debug TC header regex with actual console text
2. Fix regex if needed
3. Test parser on Sort & Subtotals jobs
4. Verify database writes correctly

**Files to Modify:**
- `scripts/parser_v2.js` (TC extraction)

**Testing:**
- Parse Sort #888 console → expect 1 failure with TC85322
- Parse Subtotals #919 console → expect TC IDs extracted

---

### Phase 2: Simplify Report Display (Priority: P1)

**Steps:**
1. Remove "Step ID" column from summary table
2. Combine TC ID + TC Name in format: `TC12345 - Test Name`
3. Update detailed failure sections
4. Test report generation

**Files to Modify:**
- `scripts/report_generator.js`

**Testing:**
- Generate report → verify Step ID column removed
- Verify TC column shows: "TC86139_02 - FUN | Report Editor | Grid View"

---

### Phase 3: Fix Historical Tracking (Priority: P0)

**Steps:**
1. Debug fingerprint calculation
2. Verify query logic
3. Test with builds 1242 → 1243 sequence
4. Ensure `last_failed_build` populated correctly

**Files to Modify:**
- `scripts/db_writer.js` (findLastFailedBuild)

**Testing:**
- Query DB: TC86139_02 in build 1243 should show last_failed_build=1242
- Report should display: "Last Failed: #1242"

---

### Phase 4: Spectre Image Analysis (Priority: P1) - BLOCKED

**Status:** ⏸️ **Waiting for Snow's Answers**

**Questions to Answer:**
- Q2: Spectre API endpoint & auth?
- Q3: When to fetch (real-time / async / on-demand)?
- Q4: What data to display?

**Once Answered:**
1. Implement Spectre API client
2. Integrate into db_writer.js
3. Update report with image comparison results
4. Add visual diff indicators

---

## 🎯 Success Criteria

### Issue 1 Fixed:
- ✅ Sort #888 shows File/TC ID/Step ID (not N/A)
- ✅ Subtotals #919 shows File/TC ID/Step ID (not N/A)

### Issue 2 Fixed:
- ✅ Report has no "Step ID" column
- ✅ TC column shows: "TC12345 - Test Name" format
- ✅ All reports readable and concise

### Issue 3 Fixed:
- ✅ Build 1243 GridView shows "Last Failed: #1242"
- ✅ Database has correct last_failed_build values
- ✅ Historical tracking works across all TC IDs

### Issue 4 Fixed (After Q&A):
- ⏸️ Spectre API integrated
- ⏸️ Diff percentages displayed
- ⏸️ False alarm detection working
- ⏸️ Image comparison results in report

---

## 📊 Testing Strategy

### Unit Tests:
1. Parser test with Sort console (TC85322)
2. Parser test with Subtotals console
3. Fingerprint consistency test
4. Historical lookup query test

### Integration Tests:
1. Full workflow: Build 1242 → 1243 sequence
2. Verify database: last_failed_build populated
3. Verify report: historical data displayed
4. Multi-build test: 3 consecutive builds

### Regression Tests:
1. Build 1242 (GridView) - already working
2. Build 1243 (GridView) - already working
3. Ensure no breaks to existing V2 features

---

## ⏱️ Time Estimates

- **Phase 1 (Sort/Subtotals):** 10 minutes
  - Debug: 5 min
  - Fix: 3 min
  - Test: 2 min

- **Phase 2 (Remove Step ID):** 15 minutes
  - Code changes: 8 min
  - Test report format: 5 min
  - Documentation: 2 min

- **Phase 3 (Historical Tracking):** 20 minutes
  - Debug query: 8 min
  - Fix logic: 7 min
  - Test multi-build: 5 min

- **Phase 4 (Spectre):** TBD (waiting for Q&A)
  - Depends on API complexity and data format

**Total (Phases 1-3):** ~45 minutes

---

## 🚦 Next Steps

1. **IMMEDIATE:** Debug Sort/Subtotals parser issue
2. **IMMEDIATE:** Fix historical tracking (builds 1242→1243)
3. **QUICK WIN:** Remove Step ID column from report
4. **BLOCKED:** Wait for Snow's answers on Spectre integration (Q2-Q4)

---

## ❓ Questions for Snow

**Q1: Historical Tracking Scope**
> Should "Last Failed" match by:
> - (A) Exact fingerprint (strict, current) ← very precise
> - (B) TC ID only (loose) ← easier to track
> - (C) TC ID + file name ← middle ground
>
> Recommendation: **(C)** - Track same TC in same file, ignore error message variations.

**Q2: Spectre API Endpoint**
> - Do you have Spectre API documentation?
> - Endpoint URL: `http://10.23.33.4:3000/api/...`?
> - Authentication required? (token, basic auth, none?)
> - Or should we scrape HTML?

**Q3: Spectre Fetch Timing**
> When should we fetch Spectre data?
> - (A) Real-time during analysis (may slow down reporting)
> - (B) Async after report (update DB later)
> - (C) On-demand only (manual trigger)
>
> Recommendation: **(A)** if API is fast (<500ms), else **(B)**

**Q4: Spectre Data Display**
> What should we show in the report?
> - [ ] Diff percentage (2.5%)
> - [ ] Pass/fail status
> - [ ] Threshold value (1.0%)
> - [ ] Visual indicator (🟢🟡🔴)
> - [ ] Baseline/actual image thumbnails
> - [ ] Auto-classification (false alarm / real issue)
> - [ ] Recommendation (update baseline / investigate)
>
> Check all that apply.

---

**Please review and answer Q1-Q4 so we can proceed with full implementation!**
