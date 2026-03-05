# V2.3 Fix Plan - Executive Summary Accuracy

**Date:** 2026-02-24 13:02  
**Reported by:** Snow  
**Status:** In Progress

---

## Issues to Fix

### Issue 1: Category Count Mismatch ❌

**Current Problem:**
Executive breakdown counts don't match summary table.

Example (Build 1243):
```
Executive: Production Failure = 10 (100%)
Table: Shows mix of Production, Environment, Unknown
```

**Root Cause:**
- Breakdown counts categories BEFORE table is built
- Uses AI analysis per job, counts all TCs from that job with same category
- But table shows per-TC categories, which may differ

**Fix:**
1. Build summary table FIRST
2. Count categories FROM table rows (single source of truth)
3. Move breakdown AFTER table generation
4. Count what's actually displayed

---

### Issue 2: First Failure Highlighting ❌

**Current:**
`**🆕 First**` (markdown bold with stars)

**Problem:**
- Markdown tables don't support background color
- Bold stars are visible in raw markdown

**Desired:**
Row background highlight for first failures

**Options:**
A. Plain emoji: `🆕 First` (remove `**`)
B. HTML mark: `<mark>🆕 First</mark>` (if Feishu supports)
C. Colored emoji: Different emoji for first vs recurring

**Snow's preference:** Background highlight (need to confirm Feishu capability)

---

## Implementation Plan

### Phase 1: Refactor Report Generation Order (15 min)

**Current flow:**
1. Generate executive summary
2. Count categories/errors (from DB)
3. Generate breakdown
4. Generate summary table

**New flow:**
1. Generate executive summary (pass/fail only)
2. **Generate summary table** (collect category counts)
3. **Generate breakdown** (from table counts)
4. Append breakdown before table

**Code changes:**
```javascript
// Step 1: Build table and collect stats
const tableCategoryCounts = {};
const tableRows = [];

failedJobs.forEach(job => {
  // ... build rows ...
  uniqueSteps.forEach(step => {
    const category = ...; // from AI analysis
    tableCategoryCounts[category] = (tableCategoryCounts[category] || 0) + 1;
    tableRows.push(rowString);
  });
});

// Step 2: Generate breakdown from table stats
report += generateBreakdown(tableCategoryCounts);

// Step 3: Append table
report += tableRows.join('');
```

---

### Phase 2: Fix First Failure Highlight (5 min)

**Option A: Plain Emoji** (simplest)
```javascript
let lastFailedCell = step.last_failed_build ? `#${step.last_failed_build}` : '🆕 First';
```

**Option B: HTML Mark** (if Feishu supports)
```javascript
let lastFailedCell = step.last_failed_build ? `#${step.last_failed_build}` : '<mark>🆕 First</mark>';
```

**Question for Snow:** Which approach do you prefer?

---

## Expected Results

### Build 1243 After Fix

**Executive Breakdown:**
```
By Category:
| 🚨 Production Failure   | 2 | 20% |
| ⚙️ Environment Failure | 6 | 60% |
| ❓ Unknown Failure      | 2 | 20% |
```

(Counts match exactly what's in the table rows)

**Table:**
- GridView: Production Failure
- Sort: Unknown Failure
- Subtotals: Production Failure
- Threshold: Unknown Failure
- UndoRedo (6 TCs): Environment Failure

Total: 2 + 2 + 6 = 10 ✅

---

## Testing

1. Regenerate build 1243 report
2. Verify breakdown counts match table
3. Manually count table rows by category
4. Confirm percentages add to 100%
5. Check first failure highlighting

---

## Time Estimate

- Phase 1: 15 min (refactor)
- Phase 2: 5 min (highlighting)
- Testing: 5 min
- **Total: 25 minutes**

---

## Questions for Snow

**Q1: First Failure Highlighting**
- Do you want plain emoji `🆕 First` or HTML `<mark>🆕 First</mark>`?
- Does Feishu support `<mark>` tags or background colors in markdown tables?

**Q2: Category Display**
- Should breakdown show categories exactly as they appear in table (with emoji)?
- Or text only?

---

Ready to implement once you confirm!
