# V2.1 Implementation - Sort/Subtotals Parser Fix

**Date:** 2026-02-24  
**Issue:** Parser returns 0 failures for Sort/Subtotals despite having "Failed Detail"  
**Root Cause:** TC header has unexpected `[0-0]` prefix and emoji before `[TC...]`

---

## Root Cause Analysis

### Expected TC Header Format:
```
  [TC85322] Report editor sort TC85322:
```

### Actual TC Header Format (Sort #888):
```
[0-0] 👉👇 [TC85322] Report editor sort TC85322
```

### Actual TC Header Format (Subtotals #919):
```
[0-0] �������� [TC85744] Create Report, add custom subtotals
```

### Why Parser Fails:

**Current split pattern:**
```javascript
content.split(/(?=\s*\[?TC\d+\])/m)
```

This pattern:
- `(?=...)` - positive lookahead
- `\s*` - optional whitespace
- `\[?` - optional opening bracket
- `TC\d+` - TC followed by digits

**Problem:**
- Pattern expects: whitespace → `[TC...`
- Actual format: `[0-0] emoji [TC...`
- The `[0-0]` prefix breaks the split logic

**Why it worked for GridView:**
- GridView didn't have `[0-0]` prefix
- Direct format: `  [TC86139_02] FUN | ...`

---

## Fix Strategy

### Option 1: Flexible TC Block Split (Recommended)

Update the split pattern to allow ANY content before `[TC`:

```javascript
// Before
const tcBlocks = content.split(/(?=\s*\[?TC\d+\])/m).filter(b => b.trim() !== "");

// After
const tcBlocks = content.split(/(?=.*?\[TC\d+)/m).filter(b => b.trim() !== "" && b.includes('[TC'));
```

**Explanation:**
- `.*?` - match any characters (non-greedy) before `[TC`
- Handles: `[0-0] emoji [TC...`, `  [TC...`, `whatever [TC...`
- Filter ensures block actually contains `[TC`

### Option 2: Two-Pass Parsing (More Robust)

First find all TC patterns, then split:

```javascript
// Find all TC positions
const TC_PATTERN = /\[TC\d+[^\]]*\]/g;
const tcPositions = [...content.matchAll(TC_PATTERN)].map(m => m.index);

// Split at those positions
const tcBlocks = [];
for (let i = 0; i < tcPositions.length; i++) {
  const start = tcPositions[i];
  const end = tcPositions[i + 1] || content.length;
  tcBlocks.push(content.slice(start, end));
}
```

### Option 3: Simpler Regex (Less Flexible)

Just look for `[TC` directly:

```javascript
const tcBlocks = content.split(/(?=\[TC\d+)/m).filter(b => b.trim() !== "");
```

**Trade-off:** Won't handle TC headers without brackets (if they exist)

---

## Recommended Fix (Option 1)

**File:** `scripts/parser_v2.js`  
**Line:** ~230  
**Function:** `extractFailuresFromLog()`

```javascript
// Step 2: Process each file block
fileBlocks.forEach(({ fileName, content }) => {
  // Split into test case blocks - allow any prefix before [TC...]
  const tcBlocks = content.split(/(?=.*?\[TC\d+)/m).filter(b => {
    const trimmed = b.trim();
    return trimmed !== "" && trimmed.includes('[TC');
  });
  
  tcBlocks.forEach(tcBlock => {
    const tcInfo = extractTestCaseInfo(tcBlock);
    if (!tcInfo) return;
    
    // Split into run blocks (handle both ✗ and corrupted emoji)
    const runBlocks = tcBlock.split(/(?=[✗�]+\s+run_\d+)/g).filter(r => /[✗�]+\s+run_\d+/.test(r));
    
    // Parse each run
    const runResults = runBlocks.map(runBlock => parseRunBlock(runBlock, fileName, tcInfo));
    
    // Deduplicate retries
    const deduplicated = deduplicateRetries(runResults);
    
    results.push(...deduplicated);
  });
});
```

**Changes:**
1. `\s*\[?TC\d+\]` → `.*?\[TC\d+` (allow any prefix)
2. Added filter: `trimmed.includes('[TC')` (ensure block has TC header)

---

## Testing

### Test Case 1: Sort #888
**Expected:**
```
File: specs/regression/reportEditor/ReportEditor_sort.spec.js
TC ID: TC85322
TC Name: Report editor sort TC85322
Retry Count: 3
```

### Test Case 2: Subtotals #919
**Expected:**
```
File: specs/regression/reportEditor/ReportEditor_subtotals.spec.js
TC ID: TC85744
TC Name: Create Report, add custom subtotals
Retry Count: 3
```

### Test Case 3: GridView #769 (Regression)
**Ensure no break:**
```
File: specs/regression/reportEditor/ReportEditor_gridView.spec.js
TC ID: TC86139_02
TC Name: FUN | Report Editor | Grid View
Retry Count: 3
```

### Test Script:
```bash
cd scripts
node diagnose_parser.js  # Should show > 0 failures for all jobs
```

---

## Implementation Checklist

- [ ] Update `parser_v2.js` line ~230
- [ ] Test with diagnostic script
- [ ] Run full parser test on Sort console
- [ ] Run full parser test on Subtotals console
- [ ] Verify GridView still works (regression test)
- [ ] Regenerate build 1243 report
- [ ] Verify Sort & Subtotals show TC IDs (not N/A)
- [ ] Update memory log with fix details

---

## Expected Outcome

**Before Fix:**
| Job | File | TC ID | Step ID |
|-----|------|-------|---------|
| Sort | N/A | N/A | N/A |
| Subtotals | N/A | N/A | N/A |
| GridView | ReportEditor_gridView | TC86139_02 | TC86139_02 |

**After Fix:**
| Job | File | TC ID | Step ID |
|-----|------|-------|---------|
| Sort | ReportEditor_sort | TC85322 | TC85322 |
| Subtotals | ReportEditor_subtotals | TC85744 | TC85744 |
| GridView | ReportEditor_gridView | TC86139_02 | TC86139_02 |

✅ **All jobs will have V2 data populated!**
