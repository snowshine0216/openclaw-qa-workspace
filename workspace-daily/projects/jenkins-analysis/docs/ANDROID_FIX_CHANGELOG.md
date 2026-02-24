# Android CI Fix Plan - Update Log

**Date:** 2026-02-24 18:24 GMT+8  
**Change:** Added Fix 0 - Report Naming Convention

---

## What Changed

Added **Fix 0: Update Report Naming Convention** as the first fix in Phase 1.

### Reason

Android reports were using a generic filename `android_report.docx` instead of the pattern used by web CI: `{JOB_NAME}_{BUILD_NUMBER}.docx`. This inconsistency makes it harder to:
- Identify reports by job and build number
- Manage multiple reports in the same directory
- Maintain consistency across the codebase

### New Priority Order

**Before:**
1. Fix 1: Logging improvements
2. Fix 2: Add --force flag
3. Fix 3: Set Feishu webhook
4. Fix 4: Single job mode

**After:**
0. **Fix 0: Report naming** (15 min) ⚡ **DO THIS FIRST**
1. Fix 1: Logging improvements (1 hour)
2. Fix 2: Add --force flag (30 min)
3. Fix 3: Set Feishu webhook (15 min)
4. Fix 4: Single job mode (2-3 hours)

---

## Files Modified

### Fix 0 Implementation

**scripts/android_analyzer.sh:**
```bash
# Change from:
REPORT_DOCX="$REPORT_DIR/android_report.docx"

# To:
REPORT_DOCX="$REPORT_DIR/${TRIGGER_JOB}_${TRIGGER_BUILD}.docx"
REPORT_MD="$REPORT_DIR/${TRIGGER_JOB}_${TRIGGER_BUILD}.md"
```

**scripts/generate_android_report.mjs:**
```javascript
// Change output filename from:
const reportPath = path.join(reportDir, 'android_report.md');

// To:
const reportPath = path.join(reportDir, `${triggerJob}_${triggerBuild}.md`);
```

---

## Example Output

### Before Fix 0
```
reports/Trigger_Library_Jobs_87/
├── android_report.md
├── android_report.docx
├── passed_jobs.json
└── failed_jobs.json
```

### After Fix 0
```
reports/Trigger_Library_Jobs_87/
├── Trigger_Library_Jobs_87.md
├── Trigger_Library_Jobs_87.docx
├── passed_jobs.json
└── failed_jobs.json
```

---

## Updated Testing Protocol

Added **Test 0: Report naming** as the first test:

```bash
# Test 0: Report naming
bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
ls -lh reports/Trigger_Library_Jobs_87/
# Should see: Trigger_Library_Jobs_87.md and Trigger_Library_Jobs_87.docx
# NOT: android_report.md or android_report.docx
```

---

## Documentation Updates

Updated the following documents to include Fix 0:

1. ✅ **ANDROID_FIX_PLAN.md**
   - Added Fix 0 section with implementation details
   - Updated Implementation Order
   - Added Test 0 to testing protocol
   - Updated Success Criteria
   - Updated Files Modified section

2. ✅ **ANDROID_FIX_SUMMARY.md**
   - Added Fix 0 to problem list
   - Updated implementation steps
   - Added Test 0 to testing commands
   - Updated files to modify

3. ✅ **ANDROID_TROUBLESHOOTING.md**
   - Updated Issue 2 to mention both naming conventions
   - Added note about old vs new naming

4. ✅ **README_ANDROID.md**
   - Added report naming to problem list
   - Updated Phase 1 timeline (2-3 hours instead of 1-2)
   - Added report naming to testing checklist
   - Updated root causes and design decisions
   - Updated deliverables and timeline

---

## Migration Note

**For existing reports:**

Old reports named `android_report.docx` will continue to work but should be regenerated with the new naming convention:

```bash
# Clean old reports
rm -f reports/Trigger_Library_Jobs_87/android_report.*

# Regenerate with new naming
bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87

# New report will be: Trigger_Library_Jobs_87.docx
```

---

## Impact

- **Breaking:** No (old reports still work, just use old filename)
- **Migration Required:** Optional (regenerate for consistency)
- **Implementation Time:** +15 minutes to Phase 1
- **Benefits:** Consistent naming, better file management, easier identification

---

**Status:** Documentation updated, ready for implementation  
**Next Step:** Implement Fix 0 before other Phase 1 fixes
