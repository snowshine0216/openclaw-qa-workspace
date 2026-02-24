# V2.2 Fix Plan - Report Quality Improvements

**Date:** 2026-02-24 12:40  
**Reporter:** Snow  
**Status:** Planning

---

## Issues to Fix

### Issue 1: Duplicate Rows in Summary Table ❌

**Current Problem:**
- GridView TC86139_02 appears 6 times in the table
- Sort TC85322 appears 2 times
- UndoRedo has 6 different TCs from same job

**Root Cause:**
- `report_generator.js` loops through ALL `failed_steps` entries
- Database has multiple rows per job (one per TC/step combination)
- **Should:** One row per unique TC
- **Is:** One row per database entry (includes duplicates from retries or multiple steps)

**Fix:**
```javascript
// Group by TC ID + Job, show only once
const uniqueFailures = steps.reduce((acc, step) => {
  const key = `${jobName}|${step.tc_id}`;
  if (!acc[key] || step.last_failed_build) {
    acc[key] = step;  // Keep the one with history
  }
  return acc;
}, {});

Object.values(uniqueFailures).forEach(step => {
  // Generate one table row
});
```

---

### Issue 2: Wrong "Last Failed" Display ❌

**Current Problem:**
- GridView #769 shows "First failure" for some rows, "#768" for others
- But database has `last_failed_build=768` for all entries

**Root Cause:**
- Multiple rows for same TC have different `last_failed_build` values
- Some have NULL (first occurrence in THIS build)
- Some have 768 (recurring from previous build)
- Report shows inconsistent data

**Fix:**
- When deduplicating (Issue 1), prioritize row with `last_failed_build` populated
- If ANY entry for a TC has history, show that

---

### Issue 3: Missing Executive Summary Breakdown 📊

**Current Problem:**
```
| Status | Count | Percentage |
| Passed | 14 | 73.7% |
| Failed | 5 | 26.3% |
```

**Missing:**
- Failure category breakdown
- Error type statistics
- Snapshot failure count

**Desired:**
```
| Status | Count | Percentage |
| Passed | 14 | 73.7% |
| Failed | 5 | 26.3% |

### Failure Breakdown by Category
| Category | Count | Description |
| 🚨 Production Failure | 2 | Code/logic bugs |
| ⚙️ Environment Failure | 2 | Infrastructure issues (webdriver, network) |
| ❓ Unknown Failure | 1 | Needs investigation |

### Failure Breakdown by Type
| Type | Count | Examples |
| Webdriver Request Fail | 3 | GridView, Subtotals, UndoRedo |
| Snapshot Diff | 1 | Threshold (⚠️ FA) |
| Other | 1 | Sort |
```

**Fix:**
- Analyze `failureMsg` field to categorize
- Count by failure type (webdriver, snapshot, assertion, timeout)
- Show counts with emoji indicators

---

### Issue 4: No Visual Indicator for First Failures 🆕

**Current Problem:**
- "First failure" text looks same as "#768"
- Hard to spot NEW failures quickly

**Desired:**
```
| Last Failed | ...
| 🆕 First | ...   (highlight in bold or color)
| #768 | ...       (normal)
```

**Fix:**
- Add emoji/badge to first failures
- Optional: Use markdown bold `**🆕 First**`
- Make it visually distinct

---

### Issue 5: Duplicate Failures in Details Section ❌

**Current Problem:**
```
### TC86139_02
(shows same failure 3 times with identical error)
```

**Root Cause:**
- Same as Issue 1 - multiple DB entries
- Details section lists ALL entries without deduplication

**Fix:**
- Group failures by TC ID before rendering details
- Show only unique failures
- Aggregate retry counts

---

## Implementation Plan

### Phase 1: Deduplicate Summary Table (15 min)

**File:** `scripts/report_generator.js`  
**Function:** Loop where table rows are generated

**Changes:**
1. Group `steps` by `tc_id`
2. For each group, pick the "best" entry:
   - Prefer: Has `last_failed_build` populated
   - Prefer: Has `snapshot_url`
   - Prefer: Highest `retry_count`
3. Generate one row per TC

**Test:**
- GridView: 1 row instead of 6 ✅
- Sort: 1 row instead of 2 ✅

---

### Phase 2: Fix Historical Display (5 min)

**Same change as Phase 1** - picking best entry solves this

**Verification:**
- GridView: Always shows "#768" (never "First failure") ✅

---

### Phase 3: Executive Summary Breakdown (20 min)

**File:** `scripts/report_generator.js`  
**Location:** After Executive Summary table

**New Section:**
```markdown
### 📊 Failure Breakdown

#### By Category
| Category | Count | %  |
| 🚨 Production | 2 | 40% |
| ⚙️ Environment | 2 | 40% |
| ❓ Unknown | 1 | 20% |

#### By Error Type
| Error Pattern | Count | Jobs |
| webdriver: Request failed | 3 | GridView, Subtotals, UndoRedo |
| Snapshot diff > threshold | 1 | Threshold |
| Element not displayed | 1 | Sort |
```

**Implementation:**
```javascript
// Categorize failures
const categories = {};
const errorTypes = {};

steps.forEach(step => {
  // Count categories
  const cat = step.failure_type || 'Unknown';
  categories[cat] = (categories[cat] || 0) + 1;
  
  // Detect error patterns
  const msg = step.failureMsg || '';
  if (msg.includes('webdriver')) errorTypes['Webdriver'] = (errorTypes['Webdriver'] || 0) + 1;
  if (step.snapshot_url) errorTypes['Snapshot'] = (errorTypes['Snapshot'] || 0) + 1;
  // ... more patterns
});

// Render tables
```

---

### Phase 4: Visual First Failure Indicator (5 min)

**File:** `scripts/report_generator.js`  
**Line:** Where `lastFailedCell` is generated

**Change:**
```javascript
let lastFailedCell = step.last_failed_build ? `#${step.last_failed_build}` : '**🆕 First**';
```

**Result:**
```
| Job | ... | Last Failed | ...
| GridView | ... | #768 | ...
| Sort | ... | **🆕 First** | ...
```

---

### Phase 5: Deduplicate Details Section (10 min)

**File:** `scripts/report_generator.js`  
**Section:** Failed job details

**Current:**
```javascript
failedJobs.forEach(job => {
  report += `### ${job.name}\n\n`;
  steps.forEach(step => {
    // Shows ALL steps (duplicates)
  });
});
```

**Fix:**
```javascript
failedJobs.forEach(job => {
  report += `### ${job.name}\n\n`;
  
  // Group by TC ID
  const uniqueTCs = {};
  steps.forEach(step => {
    if (!uniqueTCs[step.tc_id]) {
      uniqueTCs[step.tc_id] = step;
    }
  });
  
  Object.values(uniqueTCs).forEach(step => {
    // Show only unique TCs
  });
});
```

---

## Testing Strategy

### Test 1: Compare 1242 vs 1243 Reports

**Check:**
- ✅ GridView appears once per build (not 6 times)
- ✅ GridView in 1243 shows "Last Failed: #768" (not "First")
- ✅ Executive summary has breakdown tables
- ✅ First failures have 🆕 badge

### Test 2: Verify Counts

**Expected for Build 1243:**
```
Total Failures: 5 jobs
Unique TCs: ~10-15 (not 20+)
Categories:
- Production: 2
- Environment: 2
- Unknown: 1
```

### Test 3: Details Section

**Check:**
- GridView section shows TC86139_02 once (not 3-6 times)
- Each TC listed once with aggregated info

---

## Success Criteria

### Summary Table
- ✅ One row per unique TC ID
- ✅ Correct "Last Failed" for recurring failures
- ✅ 🆕 badge for first-time failures

### Executive Summary
- ✅ Failure breakdown by category (with counts)
- ✅ Failure breakdown by error type
- ✅ Counts match reality

### Details Section
- ✅ No duplicate TC listings
- ✅ Clean, readable format

---

## Time Estimate

| Phase | Time | Priority |
|-------|------|----------|
| 1. Deduplicate table | 15 min | P0 |
| 2. Fix history display | 5 min | P0 (same code) |
| 3. Executive breakdown | 20 min | P1 |
| 4. First failure badge | 5 min | P0 |
| 5. Dedupe details | 10 min | P1 |

**Total: 55 minutes** (or 25 min for P0 only)

---

## Questions for Snow

**Q1: Categorization Rules**

For executive summary, how should we categorize errors?

**Option A: By error message pattern** (current proposal)
- "webdriver: Request failed" → Environment Failure
- "Snapshot diff > threshold" → Snapshot Failure
- "element not displayed" → Production Failure

**Option B: By AI analysis** (use existing `analysis.failureType`)
- Already categorized in `_analysis.json` files
- Might not cover all cases

**Q2: Executive Summary Detail Level**

How detailed should the breakdown be?

**Option A: Simple** (2 tables)
```
By Category: Production | Environment | Unknown
By Type: Webdriver | Snapshot | Other
```

**Option B: Detailed** (3+ tables)
```
By Category: ...
By Error Type: ...
By Job: ...
By First/Recurring: ...
```

**Q3: First Failure Badge**

Which format do you prefer?

- A: `**🆕 First**` (bold + emoji)
- B: `🆕 First failure` (emoji + text)
- C: `First (NEW)` (text + marker)

**My recommendation: A** - most visually distinct

---

Ready to implement once you confirm! Or should I proceed with defaults (Option A, Simple, Format A)?
