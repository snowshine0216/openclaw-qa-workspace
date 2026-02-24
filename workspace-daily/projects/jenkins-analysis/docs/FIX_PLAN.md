# Fix Plan: TC ID/Name N/A & History Trend Unknown Issue

## Problem Analysis

### Issue Summary
In build 2442, the report shows:
- **TC ID:** N/A
- **TC Name:** N/A  
- **Last Failed:** Unknown
- **Snapshot URLs:** Not parsed correctly
- **Detailed error logs:** Not extracted

Comparison with build 2441 (correct) vs 2442 (broken) reveals:
- Build 2441: 6 failed_steps for `Dashboard_LockPageSizeE2E #79`
- Build 2442: Only 2 failed_steps for `Dashboard_LockPageSizeE2E #80`

### Root Cause Identified

**Parser deduplication is TOO aggressive:**
- Parser correctly extracts TC IDs, TC Names, and file names
- But deduplication logic is **merging different failure steps within the same TC**
- Example: TC `QAC-487_4` has multiple screenshot failures:
  - `QAC-487_4_1` - Chapter 1 Page Pies after setting zoom level to 125%
  - `QAC-487_4_2` - Chapter 1 Page Pies copy at zoom level 125%
  - `QAC-487_4_3` - Chapter 1 copy Page Pies copy at zoom level 125%
  - `QAC-487_4_4` - Chapter 1 copy Page Pies at zoom level 125%
- Current parser only keeps **ONE** entry instead of all four distinct failures

### Affected Components

1. **Parser (`scripts/parsing/parser.js`)**
   - `deduplicateRetries()` in `scripts/parsing/deduplication.js`
   - Deduplication key is based on `tc_id + step_id`, but it's merging different steps incorrectly

2. **Report Generator (`scripts/reporting/generator.js`)**
   - Relies on database query results
   - If database has incomplete data, report will show N/A

3. **Database Writer (`scripts/pipeline/process_build.js`)**
   - Calls parser and inserts results into DB
   - No issue here - correctly writes what parser returns

---

## Fix Strategy

### Phase 1: Fix Parser Deduplication Logic
**Skill:** `function-test-coverage`

**Goal:** Ensure parser extracts **ALL distinct failure steps**, not just one per TC

**Tasks:**

1. **Review deduplication logic** in `scripts/parsing/deduplication.js`
   - Current key: `tc_id + step_id` (may be incorrect)
   - Should key on: `fileName + tcId + stepId + runLabel`
   - Retries should be deduplicated **per step**, not per TC

2. **Fix deduplication function:**
   ```javascript
   // Current (incorrect):
   const key = `${result.tcId}_${result.stepId}`;
   
   // Should be:
   const key = `${result.fileName}_${result.tcId}_${result.stepId}_${result.runLabel}`;
   ```

3. **Add regression test** for multi-step failure parsing:
   - Fixture: Console log with 1 TC having 4 different screenshot failures
   - Expected: 4 distinct failed_steps entries (not 1)
   - Test file: `scripts/tests/unit/parser_deduplication.test.js`

**Reference files to review:**
- `scripts/parsing/deduplication.js` - deduplication logic
- `scripts/parsing/parser.js` - main parser entry
- `scripts/tests/unit/parser_deduplication.test.js` - existing test to extend

---

### Phase 2: Verify History Trend Logic
**Skill:** `code-structure-quality`

**Goal:** Ensure `findLastFailedBuild` correctly matches failures across builds

**Tasks:**

1. **Review fingerprint logic** in `scripts/analysis/fingerprint.js`
   - Current: `buildFingerprint(fileName, tcId, stepId, stepName, failureType)`
   - Verify fingerprint is unique enough to match recurring failures
   - Should NOT match if `stepId` differs (e.g., `QAC-487_4_1` vs `QAC-487_4_2`)

2. **Check history lookup** in `scripts/database/operations.js`:
   ```javascript
   // Verify this query:
   SELECT fj.job_build
   FROM failed_steps fs
   JOIN failed_jobs fj ON fs.failed_job_id = fj.id
   WHERE fj.job_name = ? AND fs.error_fingerprint = ? AND fj.job_build < ?
   ORDER BY fj.job_build DESC LIMIT 5
   ```
   - Should match failures with **same fingerprint** (fileName + tcId + stepId)
   - If fingerprint changes between builds, will show "🆕 First"

3. **Test history tracking:**
   - Insert test data: same TC failing in build N and N+1 with same stepId
   - Expected: `last_failed_build` = N
   - Test file: `scripts/tests/integration/history_tracking.test.js` (new)

**Reference files to review:**
- `scripts/analysis/fingerprint.js` - fingerprint generation
- `scripts/database/operations.js` - `findLastFailedBuild()`

---

### Phase 3: Fix Snapshot URL Parsing
**Skill:** `function-test-coverage`

**Goal:** Ensure snapshot URLs are correctly extracted and stored

**Tasks:**

1. **Review extractor logic** in `scripts/parsing/extractors.js`:
   ```javascript
   const SPECTRE_URL_RE = /Visit\s+(http:\/\/[^:]+:3000\/\S+)\s+for details/;
   ```
   - Verify regex matches console log format
   - Test with actual console log snippet from build 2442

2. **Check database schema** in `scripts/database/schema.js`:
   - Column: `snapshot_url TEXT`
   - Ensure it's not defaulting to NULL when URL exists

3. **Test snapshot URL extraction:**
   - Fixture: Console log with Spectre URL
   - Expected: `snapshotUrl` field populated
   - Test file: `scripts/tests/unit/extractor.test.js` (new)

**Reference files to review:**
- `scripts/parsing/extractors.js` - `extractSpectreUrl()`
- `scripts/parsing/parser.js` - integration point

---

### Phase 4: Improve Error Extraction
**Skill:** `function-test-coverage`

**Goal:** Extract full error messages and stack traces correctly

**Tasks:**

1. **Review `extractFullError` logic** in `scripts/parsing/extractors.js`:
   - Should capture multi-line error messages
   - Should preserve stack trace for debugging
   - Current implementation may be truncating

2. **Enhance extraction**:
   - Extract first line for `failure_msg` (concise)
   - Store full stack in `full_error_msg` (detailed)

3. **Test error extraction:**
   - Fixture: Console log with stack trace
   - Expected: Both `failure_msg` and `full_error_msg` populated
   - Test file: `scripts/tests/unit/extractor.test.js`

**Reference files to review:**
- `scripts/parsing/extractors.js` - `extractFullError()`

---

### Phase 5: Add Integration Test
**Skill:** `function-test-coverage`

**Goal:** End-to-end test from console log to report generation

**Tasks:**

1. **Create integration test**:
   - Input: Real console log from build 2442 (Dashboard_LockPageSizeE2E_80)
   - Expected output:
     - TC IDs: `QAC-487_3`, `QAC-487_4`
     - TC Names: "Insert pages/chapters", "Duplicate"
     - Step IDs: All 4 steps for `QAC-487_4`
     - Snapshot URLs: All extracted correctly
     - File name: `specs/regression/lockPageSize/CanvasZoomE2E.spec.js`

2. **Test file**: `scripts/tests/integration/full_pipeline.test.js`
   - Parse console log
   - Insert into test DB
   - Generate report
   - Verify report content (no N/A values)

**Reference files to review:**
- `scripts/pipeline/process_build.js` - orchestration
- `scripts/reporting/generator.js` - report generation

---

## Execution Plan

### Step 1: Diagnose with Test First (TDD Approach)
1. Create failing test that reproduces the issue
2. Use actual console log from build 2442 as fixture
3. Assert expected output (all TC IDs, names, steps extracted)

### Step 2: Fix Parser Deduplication
1. Update `scripts/parsing/deduplication.js`
2. Run test - should now pass
3. Commit fix with regression test

### Step 3: Verify History Tracking
1. Review fingerprint logic
2. Add history tracking test
3. Ensure "Last Failed" shows correct build numbers

### Step 4: Validate End-to-End
1. Run full pipeline on build 2442 data
2. Compare output report with build 2441 (correct version)
3. Ensure no N/A values, all data extracted

### Step 5: Add Monitoring
1. Add validation step to pipeline
2. Log warning if:
   - TC ID is N/A
   - File name is N/A
   - Snapshot URL is missing when expected
3. Fail fast if parsing degrades

---

## Acceptance Criteria

### Must Have
- [ ] All TC IDs extracted correctly (no N/A)
- [ ] All TC Names extracted correctly (no N/A)
- [ ] All distinct failure steps captured (not just first one)
- [ ] Snapshot URLs parsed and stored correctly
- [ ] History trend shows correct "Last Failed" build numbers
- [ ] Regression test prevents future breakage

### Nice to Have
- [ ] Full error messages extracted (not just first line)
- [ ] Parser performance maintained (no slowdown)
- [ ] Detailed logging for debugging parse failures
- [ ] Validation warnings for missing data

---

## Risk Assessment

### Low Risk
- Parser deduplication fix (pure function, well-isolated)
- Adding regression tests

### Medium Risk
- Fingerprint logic changes (affects history tracking across all builds)
- Database schema changes (migration required)

### High Risk
- None identified (all changes are non-breaking)

---

## Rollback Plan

If fixes cause issues:
1. Revert parser changes
2. Restore previous deduplication logic
3. Keep tests for future reference
4. Investigate root cause further

---

## Timeline Estimate

- **Phase 1 (Parser Fix):** 2-3 hours
- **Phase 2 (History Tracking):** 1-2 hours
- **Phase 3 (Snapshot URLs):** 1 hour
- **Phase 4 (Error Extraction):** 1 hour
- **Phase 5 (Integration Test):** 2 hours

**Total:** ~7-9 hours

---

## Skills Applied

1. **function-test-coverage** - Adding regression tests for parser, extractor, and integration
2. **code-structure-quality** - Reviewing deduplication logic, fingerprinting, and module boundaries
3. **docs-organization-governance** - Documenting fix plan and rollback strategy

---

## Next Steps

1. ✅ Create fix plan (this document)
2. ⬜ Create failing regression test
3. ⬜ Fix parser deduplication logic
4. ⬜ Verify history tracking
5. ⬜ Test snapshot URL extraction
6. ⬜ Run end-to-end integration test
7. ⬜ Deploy and validate on real builds

---

*Created: 2026-02-24*
*Author: Atlas Daily (QA Daily Check Agent)*
