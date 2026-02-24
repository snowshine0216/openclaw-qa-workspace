# Clarifying Questions - Jenkins Analysis V2 Enhancement

**Author:** Atlas Daily  
**Date:** 2026-02-24  
**Status:** 🤔 Awaiting Answers

---

## Critical Design Decisions

These questions need your input before implementation:

### Q1: File Name Storage Format ⭐ HIGH PRIORITY

**Context:** The console log shows file paths like:
```
specs/regression/customapp/CustomAppShowToolBar.spec.js
```

**Question:** Should we store the full path or just the filename?

**Option A: Full Path** (Recommended)
```sql
file_name: "specs/regression/customapp/CustomAppShowToolBar.spec.js"
```
- ✅ Pro: Prevents name collisions (two files with same name in different folders)
- ✅ Pro: Full context for developers
- ✅ Pro: Can generate direct GitHub links
- ❌ Con: Longer database values
- ❌ Con: Report table might be wider

**Option B: Short Name Only**
```sql
file_name: "CustomAppShowToolBar.spec.js"
```
- ✅ Pro: More readable in reports
- ✅ Pro: Shorter database values
- ❌ Con: Potential name collisions
- ❌ Con: Loss of context (which folder?)

**My Recommendation:** Option A (full path)
- Store full path in DB
- Display short name in report table (e.g., `CustomAppShow...`)
- Show full path in hover tooltip or details section

**Your Decision:** A / B / Other? _____

---

### Q2: Retry Deduplication Strategy ⭐ HIGH PRIORITY

**Context:** When a test retries 3 times with the same error:
```
✗ run_1 - Failed:Screenshot "TC78888_01..." doesn't match
✗ run_2 - Failed:Screenshot "TC78888_01..." doesn't match
✗ run_3 - Failed:Screenshot "TC78888_01..." doesn't match
```

**Question:** Should we store one row or three rows?

**Option A: Deduplicate (Recommended)**
```sql
-- Single row in database
file_name: "specs/.../CustomAppShowToolBar.spec.js"
tc_id: "TC78888"
step_id: "TC78888_01"
retry_count: 3
run_label: "run_1,run_2,run_3"  -- or just "run_1"
full_error_msg: "..." -- from first occurrence
```
- ✅ Pro: Cleaner database (1 row instead of 3)
- ✅ Pro: Matches actual failure count
- ✅ Pro: Easier to query ("how many unique failures?")
- ❌ Con: Lose individual run URLs (if Spectre URLs differ)
- ❌ Con: More complex parsing logic

**Option B: Store All Runs**
```sql
-- Three rows in database
Row 1: retry_count=1, run_label="run_1", snapshot_url="...runs/2571..."
Row 2: retry_count=1, run_label="run_2", snapshot_url="...runs/2572..."
Row 3: retry_count=1, run_label="run_3", snapshot_url="...runs/2573..."
```
- ✅ Pro: Simpler parsing logic
- ✅ Pro: Preserve all Spectre URLs
- ❌ Con: Inflates database size (3x rows)
- ❌ Con: Need to GROUP BY in reports

**My Recommendation:** Option A (deduplicate)
- Store only first occurrence
- Store all Spectre URLs in array/JSON if needed: `snapshot_urls: ["url1", "url2", "url3"]`
- Display retry count clearly: "3x retries"

**Your Decision:** A / B / Other? _____

**Follow-up:** If Option A, should we store ALL Spectre URLs or just the first?
- Just first URL (simpler)
- All URLs as JSON array (more data)

**Your Decision:** First only / All URLs? _____

---

### Q3: Error Message Truncation Limit

**Context:** Full error messages can be long (stack traces):
```
- Failed:Screenshot "TC78888_01 - Custom info window..." doesn't match the baseline.
  Visit http://10.23.33.4:3000/... for details.
  at <Jasmine>
  at takeScreenshotByElement (file:///home/admin/.../TakeScreenshot.ts:36:30)
  at runMicrotasks (<anonymous>)
  at processTicksAndRejections (node:internal/process/task_queues:96:5)
  at async UserContext.<anonymous> (file:///home/admin/.../CustomAppShowToolBar.spec.js:290:9)
```

**Question:** Should we limit the size of `full_error_msg` in the database?

**Option A: No Limit** (Recommended)
- ✅ Pro: Complete information preserved
- ✅ Pro: SQLite TEXT type handles it
- ❌ Con: Large database if many failures

**Option B: Limit to 5000 characters**
- ✅ Pro: Prevents runaway DB growth
- ❌ Con: Might truncate important info

**Option C: Limit to 1000 characters**
- ✅ Pro: Keeps DB compact
- ❌ Con: Likely loses stack trace

**My Recommendation:** Option A (no limit initially)
- Monitor database size
- Add limit later if needed
- Typical error: 300-500 chars (well within reason)

**Your Decision:** A / B / C / Other limit? _____

---

### Q4: Historical Lookup Scope

**Context:** When checking if a failure is recurring, should we look back at:

**Option A: All Builds in Retention Window** (Recommended)
```sql
-- Check all previous builds (up to last 5 kept in DB)
WHERE job_build < current_build
ORDER BY job_build DESC
LIMIT 1
```
- ✅ Pro: Catches intermittent failures (pass-fail-pass-fail)
- ✅ Pro: More accurate "last failed" tracking
- ❌ Con: Slightly more complex query

**Option B: Only Last Build**
```sql
-- Only check immediately previous build
WHERE job_build = current_build - 1
```
- ✅ Pro: Simpler logic
- ✅ Pro: Faster query
- ❌ Con: Misses intermittent failures

**Example Scenario:**
```
Build 2200: TC78888 FAIL
Build 2201: TC78888 PASS
Build 2202: TC78888 FAIL ← Is this recurring?

Option A: YES (found build 2200)
Option B: NO (build 2201 passed)
```

**My Recommendation:** Option A (all builds in window)
- Flaky tests are common
- Better historical context
- Query is still fast

**Your Decision:** A / B? _____

---

### Q5: Fingerprint Calculation

**Context:** Fingerprint is used to match failures across builds.

**Current Formula:**
```javascript
sha256(tcId + stepId + stepName + failureType)
```

**Proposed Formula:**
```javascript
sha256(fileName + tcId + stepId + stepName + failureType)
```

**Question:** Should we include `fileName` in the fingerprint?

**Option A: Include File Name** (Recommended)
- ✅ Pro: Prevents collisions if same TC ID exists in different files
- ✅ Pro: More unique identifier
- ❌ Con: If file is renamed, history breaks

**Option B: Exclude File Name**
- ✅ Pro: Survives file renames/moves
- ❌ Con: Potential collisions

**My Recommendation:** Option A (include file name)
- TC IDs should be unique anyway
- File renames are rare
- Better safe than sorry

**Your Decision:** A / B? _____

---

## Report Display Questions

### Q6: File Name Display in Report Table

**Question:** How should we display file names in the summary table?

**Option A: Short Name with Hover Tooltip**
```markdown
| File | ... |
|------|-----|
| [CustomAppShowToolBar.spec.js](full/path) | ... |
```
- ✅ Readable
- ✅ Full path on click
- ❌ Markdown doesn't support hover text natively

**Option B: Truncated Path**
```markdown
| File | ... |
|------|-----|
| .../customapp/CustomAppShow... | ... |
```
- ✅ Shows folder context
- ❌ Might be unclear

**Option C: Full Path (Wrapped)**
```markdown
| File | ... |
|------|-----|
| specs/regression/customapp/CustomAppShowToolBar.spec.js | ... |
```
- ✅ Complete information
- ❌ Very wide table

**My Recommendation:** Option A (short name with link to full path in details section)

**Your Decision:** A / B / C? _____

---

### Q7: Error Display in Report Table

**Question:** Should we show full error in table or make it expandable?

**Option A: Truncated with Expandable Details** (Recommended)
```markdown
| Error | ... |
|-------|-----|
| Screenshot doesn't match... <details><summary>Full Error</summary>...</details> | ... |
```
- ✅ Clean table view
- ✅ Full info available
- ❌ Requires extra click

**Option B: First Line Only**
```markdown
| Error | ... |
|-------|-----|
| Screenshot "TC78888_01..." doesn't match the baseline | ... |
```
- ✅ Simpler
- ❌ Loses detail

**My Recommendation:** Option A (expandable)

**Your Decision:** A / B? _____

---

### Q8: Retry Count Display

**Question:** How should we display retry count in the table?

**Option A: Badge Style**
```markdown
| Retries | ... |
|---------|-----|
| 🔄 3x | ... |
```

**Option B: Number with Icon**
```markdown
| Retries | ... |
|---------|-----|
| ↻3 | ... |
```

**Option C: Descriptive Text**
```markdown
| Retries | ... |
|---------|-----|
| 3 attempts | ... |
```

**My Recommendation:** Option A or B (concise)

**Your Decision:** A / B / C? _____

---

## Implementation Priority

### Q9: Which Issue to Fix First?

Based on your urgency:

**Option A: File Name + Full Error** (most visible)
- Get file names and detailed errors showing
- Deduplication later

**Option B: History Lookup** (most critical)
- Fix recurring detection first
- Other fixes can follow

**Option C: All Together** (complete solution)
- Implement everything at once
- Longer wait, but complete fix

**My Recommendation:** Option C (all together, ~5 hours total)

**Your Decision:** A / B / C? _____

---

## Testing Strategy

### Q10: Test Data

**Question:** Should I test with:

**Option A: Real Builds (2200, 2201)**
- Use actual console logs from Jenkins
- Test against real database

**Option B: Mock Data**
- Create synthetic test cases
- Faster iteration

**My Recommendation:** Both
1. Unit tests with mock data
2. Integration test with real build 2201

**Your Decision:** Agree / Need only real / Need only mock? _____

---

## Summary of Recommendations

| Question | Recommendation | Why |
|----------|----------------|-----|
| Q1: File name storage | **Full path** | Uniqueness + context |
| Q2: Retry deduplication | **Option A (deduplicate)** | Cleaner database |
| Q2b: Spectre URLs | **First URL only** | Simplicity |
| Q3: Error truncation | **No limit** | Preserve all info |
| Q4: Historical lookup | **All builds in window** | Catch intermittent failures |
| Q5: Fingerprint | **Include file name** | Prevent collisions |
| Q6: File display | **Short name + link** | Readable + detailed |
| Q7: Error display | **Expandable** | Clean + complete |
| Q8: Retry display | **Badge (🔄 3x)** | Visual + concise |
| Q9: Priority | **All together** | Complete fix |
| Q10: Testing | **Both real + mock** | Thorough validation |

---

## Your Decisions

Please respond with:

1. Confirm recommendations above, OR
2. Specify alternatives (Q1=B, Q2=A, etc.), OR
3. Ask for more clarification

**Reply Format:**
```
Approved as recommended.

OR

Q1: B (short name only)
Q2: A (deduplicate)
Q3: B (limit 5000 chars)
[etc.]
```

**Once approved, I will:**
1. Create feature branch
2. Implement all fixes
3. Run tests
4. Generate sample report
5. Request final review

---

**Document Status:** 🤔 Awaiting Your Decisions
