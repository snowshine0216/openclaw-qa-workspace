# Fix Complete: Empty Reports Issue ✅

**Date:** 2026-02-24 10:05  
**Status:** RESOLVED

## Problem
Jenkins analyzer was generating empty reports showing "0 failed, 0 passed" even when builds actually failed.

## Root Cause
**Race condition with `lastBuild` API:**
- Parent build triggers child builds (e.g., #662)
- While analyzer runs, a new build starts (#664)
- Analyzer checks `/job/JobName/lastBuild/` → gets #664 (still running, result: null)
- No status detected → empty report

## Solution
**Parse console log to extract specific build numbers:**

1. **Step 4 - Job Discovery:**
   - Read parent build's console log
   - Extract "Starting building: JobName #BuildNum" lines
   - Store as `JobName|BuildNum` pairs

2. **Step 5 - Status Check:**
   - Use specific build number from console log
   - Call `/job/JobName/$BUILD_NUM/` instead of `/job/JobName/lastBuild/`
   - Fallback to lastBuild only if console parsing fails

## Before vs After

### Before (Broken)
```
[09:54:55] [1/1] Checking: LibraryWeb_Report_MultiJob
[09:54:56] ✓ Status check complete: 0 failed, 0 passed  ❌
```
→ Empty report, no failures detected

### After (Fixed)
```
[10:04:52] [1/1] Checking: LibraryWeb_Report_MultiJob #662
[10:04:53]   ❌ FAILED: LibraryWeb_Report_MultiJob #662
[10:04:54] ✓ Status check complete: 1 failed, 0 passed  ✅
```
→ Correct report with failure details

## Verification
✅ **Test Build:** Tanzu_Report_Env_Upgrade #1242  
✅ **Report Generated:** 9.7K DOCX with correct failure data  
✅ **Feishu Delivery:** Success  
✅ **All Follow-up Builds:** Working correctly

## Additional Fix
Also resolved npm build error:
- **Problem:** better-sqlite3 requires C++20, incompatible with Node v24 + macOS Xcode 14
- **Solution:** Replaced with sql.js (pure JavaScript SQLite)
- **Result:** No native compilation needed, works everywhere

## Files Changed
- `scripts/analyzer.sh` (Steps 4 & 5)
- `scripts/db-adapter.js` (NEW)
- `scripts/db_writer.js`
- `scripts/report_generator.js`
- `docs/BUG_FIXES.md`

## Backups
- `analyzer.sh.backup-1771898301` (before fix)

---

**System Status:** Fully operational. All known issues resolved. ✅
