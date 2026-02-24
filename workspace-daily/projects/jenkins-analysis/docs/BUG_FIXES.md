# Bug Fixes - 2026-02-24 10:05

## ✅ Issue Fixed: Empty Reports (Build Timing Race Condition)

**Problem:** Reports showing "0 failed, 0 passed" even when builds failed  
**Root Cause:** Analyzer checked `lastBuild` instead of the specific triggered build number. When a new build started during analysis, `lastBuild` pointed to a running build with `result: null`.

**Example:**
- Parent build #1242 triggers `LibraryWeb_Report_MultiJob #662` (FAILURE)
- While analyzer runs, build #664 starts  
- Analyzer checks `/job/LibraryWeb_Report_MultiJob/lastBuild/` → gets #664 (result: null)
- No status logged → empty report ❌

**Fix Applied:**
1. **Step 4 (Job Discovery):** Parse console log for "Starting building: JobName #BuildNum"
2. **Step 5 (Status Check):** Use the specific build number from console log, not `lastBuild`

**Code Changes:**
```bash
# OLD (broken):
DOWNSTREAM_JOBS=$(curl ... | jq '.downstreamProjects[]?.name')
# Later: curl .../job/$job_name/lastBuild/...  ❌

# NEW (fixed):
CONSOLE_TEXT=$(curl .../consoleText)
TRIGGERED_BUILDS=$(echo "$CONSOLE_TEXT" | grep 'Starting building:' | 
  sed -E 's/^Starting building: (.+) #([0-9]+)$/\1|\2/')
# Later: curl .../job/$job_name/$JOB_NUMBER/...  ✅
```

**Test Results (Build #1242):**

Before fix:
```
[2026-02-24 09:54:55] [1/1] Checking: LibraryWeb_Report_MultiJob
[2026-02-24 09:54:56] ✓ Status check complete: 0 failed, 0 passed  ❌
```

After fix:
```
[2026-02-24 10:04:52] [1/1] Checking: LibraryWeb_Report_MultiJob #662
[2026-02-24 10:04:53]   ❌ FAILED: LibraryWeb_Report_MultiJob #662
[2026-02-24 10:04:54] ✓ Status check complete: 1 failed, 0 passed  ✅
```

**Verification:**
- Report generated: `Tanzu_Report_Env_Upgrade_1242.docx` (9.7K)
- Content: Shows 1 failed job with details ✅
- Feishu delivery: Success (message_id: om_x100b56e43b10e844c36f3b458702c38) ✅

**Files Modified:**
- `scripts/analyzer.sh` (Step 4 & Step 5)
  - Backup saved: `analyzer.sh.backup-1771898301`

**Related:**
- Previous fix (2026-02-23): Whitespace trimming for job names (still in place)
- This fix complements the whitespace fix from BUG_FIXES.md

---

## Summary of All Fixes

| Date | Issue | Fix | Status |
|------|-------|-----|--------|
| 2026-02-23 | Job names with trailing spaces | Trim whitespace with `xargs` | ✅ Fixed |
| 2026-02-23 | Feishu upload auth failed | Hard-coded correct credentials | ✅ Fixed |
| 2026-02-23 | Logs in wrong folder | Changed to `logs/` directory | ✅ Fixed |
| 2026-02-23 | Jenkins skill env vars missing | Added `export` statements | ✅ Fixed |
| 2026-02-24 | Empty reports (timing issue) | Use console log build numbers | ✅ Fixed |
| 2026-02-24 | npm better-sqlite3 C++20 error | Replaced with sql.js (pure JS) | ✅ Fixed |

---

**Status:** All known issues resolved. System fully operational. ✅
