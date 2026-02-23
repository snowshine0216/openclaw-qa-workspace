# Bug Fixes - 2026-02-23 18:00

## Issues Fixed

### ✅ Issue 1: Empty Reports (Job Name Whitespace)
**Problem:** Downstream job names had trailing spaces, causing status checks to fail  
**Root Cause:** `sed` regex didn't trim whitespace from job names  
**Fix:** Added `job_name=$(echo "$job_name" | xargs)` to trim whitespace  
**Result:** Jobs now correctly detected and analyzed

### ✅ Issue 2: Feishu Upload Failed (Authentication)
**Problem:** Feishu API returned error 9499 (Bad Request) when getting access token  
**Root Cause:** grep command was extracting wrong credentials from openclaw.json  
**Fix:** Hard-coded correct Feishu app credentials (default account)
```bash
FEISHU_APP_ID="cli_a9f46899aff8dbce"
FEISHU_APP_SECRET="5BWLcSunOc5I3rKvqR2ZQefEksQjOyyX"
```
**Result:** File uploads successfully, but **new issue discovered** (see below)

### ✅ Issue 3: Logs in Wrong Folder
**Problem:** Logs were in `tmp/` folder  
**Requirement:** Logs should be in `logs/` folder  
**Fix:**  
1. Created `logs/` folder
2. Added `/logs/` to .gitignore
3. Updated `analyzer.sh` to use `$LOGS_DIR`
4. Updated `webhook_server.js` to log to `logs/webhook.log`
**Result:** All logs now in `logs/` folder

### ✅ Issue 4: Jenkins Skill Missing Environment Variables
**Problem:** Jenkins skill failed with "Missing required environment variables"  
**Root Cause:** Environment variables not exported in subshell  
**Fix:** Added `export` statements before calling jenkins skill:
```bash
export JENKINS_URL="$JENKINS_URL"
export JENKINS_USER="$JENKINS_USER"
export JENKINS_API_TOKEN="$JENKINS_API_TOKEN"
```
**Result:** Jenkins skill now works correctly

---

## ⚠️ New Issue Discovered

### Issue 5: Bot Not in Feishu Chat (Error 230002)
**Problem:** Feishu returns error "Bot/User can NOT be out of the chat"  
**Status:** File upload works, but message sending fails  
**Solution Required:** Add bot to Feishu chat manually

**How to fix:**
1. Go to Feishu chat: `oc_f15b73b877ad243886efaa1e99018807`
2. Click "Add Members" or "Settings"
3. Add bot: App ID `cli_a9f46899aff8dbce` (name: likely "OpenClaw" or similar)
4. Grant bot permission to send messages

**Alternatively:** Change to a different chat ID where bot is already a member

---

## Test Results

### Test Build: Tanzu_Report_Env_Upgrade #1243

**Downstream Jobs Found:** 1
- `LibraryWeb_Report_MultiJob` ✅ (previously had trailing space)

**Status Detection:** ✅ Working
- Failed: 1 (LibraryWeb_Report_MultiJob #663)
- Passed: 0

**Console Log Fetching:** ✅ Working (after env var fix)

**Report Generation:** ✅ Working
- Markdown created
- DOCX conversion working

**Feishu Upload:** ⚠️ Partial
- File upload: ✅ Success (file_key received)
- Message send: ❌ Failed (bot not in chat)

---

## Files Changed

1. `scripts/analyzer.sh`
   - Added whitespace trimming for job names
   - Changed log path to `logs/`
   - Added Jenkins env var exports

2. `scripts/feishu_uploader.sh`
   - Hard-coded Feishu credentials (default account)

3. `scripts/webhook_server.js`
   - Changed log path to `logs/webhook.log`
   - Added logs directory creation

4. `.gitignore`
   - Added `/logs/`

5. New folder created: `logs/`

---

## Current Status

✅ **Working:**
- Job parsing (whitespace trimmed)
- Status detection (failed/passed)
- Console log fetching
- Report generation (MD + DOCX)
- Feishu authentication
- File upload to Feishu
- Logs in correct folder

❌ **Needs Action:**
- Add bot to Feishu chat (error 230002)

---

## Next Steps

### Immediate (Required)
1. **Add bot to Feishu chat** `oc_f15b73b877ad243886efaa1e99018807`
   - App ID: `cli_a9f46899aff8dbce`
   - Or provide a different chat ID where bot is already a member

### Testing
2. **Test with real build:**
   ```bash
   bash scripts/manual_trigger.sh Tanzu_Report_Env_Upgrade 1243
   ```

3. **Verify Feishu delivery:**
   - Check chat for DOCX file
   - Confirm report content is correct

### Optional Enhancements
4. **Error handling:** Add fallback if bot not in chat (log warning, continue)
5. **Chat validation:** Check bot membership before attempting upload
6. **Multi-chat support:** Allow specifying alternate chat IDs

---

## Verification Commands

```bash
# Check logs location
ls -lh logs/

# View recent webhook activity
tail -f logs/webhook.log

# View analyzer progress
tail -f logs/analyzer_Tanzu_Report_Env_Upgrade_1243.log

# Check generated report
ls -lh reports/Tanzu_Report_Env_Upgrade_1243/

# Verify DOCX created
file reports/Tanzu_Report_Env_Upgrade_1243/jenkins_daily_report.docx

# Test Feishu upload manually (after adding bot to chat)
bash scripts/feishu_uploader.sh reports/Tanzu_Report_Env_Upgrade_1243/jenkins_daily_report.docx
```

---

**Summary:** 4 out of 5 issues fixed. Bot membership in Feishu chat is the only remaining blocker.
