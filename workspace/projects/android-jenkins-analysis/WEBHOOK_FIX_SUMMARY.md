# Webhook Server Fix Summary

**Date:** 2026-02-25  
**Issue:** Android webhook no Feishu delivery

---

## Root Causes Identified

### 1. **Incorrect Conditional Check for Feishu Upload**
- **Problem:** `android_analyzer.sh` checked for `FEISHU_WEBHOOK_URL` env var before calling uploader
- **Impact:** Skipped Feishu upload even though the shared script was available
- **Fix:** Removed conditional check, reference shared `feishu_uploader.sh` from jenkins-analysis
- **Reason:** `feishu_uploader.sh` has hardcoded credentials, no env var needed

### 2. **Script Reference Pattern**
- **Problem:** Initially copied `feishu_uploader.sh` to android-jenkins-analysis (duplication)
- **Impact:** Maintenance burden, version drift risk
- **Fix:** Use relative path reference to shared script
- **Pattern:** `FEISHU_UPLOADER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh"`

### 3. **Initial Port Confusion**
- **Problem:** Set jenkins-webhook to port 3000 instead of 9090
- **Impact:** Web jenkins webhook not accessible on default port
- **Fix:** Updated ecosystem.config.js to use correct ports
  - jenkins-webhook: 9090 (web jenkins)
  - android-webhook: 9091 (android jenkins)

---

## Key Differences: Web vs Android

| Aspect | Web Jenkins | Android Jenkins |
|--------|-------------|-----------------|
| **Port** | 9090 | 9091 |
| **Project Folder** | `jenkins-analysis` | `android-jenkins-analysis` |
| **Server Script** | `scripts/server/index.js` | `scripts/server/index.js` (same) |
| **Analyzer Script** | `analyzer.sh` | `android_analyzer.sh` |
| **Watched Jobs** | Tanzu_Report_Env_Upgrade, TanzuEnvPrepare | Trigger_Library_Jobs |
| **Report Format** | V2 console log parsing | ExtentReport v3 HTML parsing |
| **Feishu Upload** | Unconditional, uses local script ✅ | ~~Conditional~~ → Fixed, references shared script ✅ |

---

## Files Changed

### 1. `android-jenkins-analysis/scripts/android_analyzer.sh`
**Changes:**
```diff
  # Step 1: Cost optimization - existing report
  if [ "$FORCE_REGENERATE" = "0" ] && [ -f "$REPORT_DOCX" ]; then
    log "✓ Re-using existing Android report at $REPORT_DOCX"
-   if [ -n "$FEISHU_WEBHOOK_URL" ]; then
-     bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DOCX" "[Android] "
-   else
-     log "⚠ FEISHU_WEBHOOK_URL not set, skipping Feishu upload"
-   fi
+   log "Uploading cached report to Feishu..."
+   FEISHU_UPLOADER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh"
+   bash "$FEISHU_UPLOADER" "$REPORT_DOCX"
    exit 0
  fi

  # Step 6: Upload to Feishu
- if [ -n "$FEISHU_WEBHOOK_URL" ]; then
-   bash "$SCRIPT_DIR/feishu_uploader.sh" "$REPORT_DOCX" "[Android] "
- else
-   log "⚠ FEISHU_WEBHOOK_URL not set, skipping Feishu upload"
- fi
+ log "Dispatching Docx into designated Feishu channel..."
+ FEISHU_UPLOADER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh"
+ bash "$FEISHU_UPLOADER" "$REPORT_DOCX"
```
**Key change:** Reference shared `feishu_uploader.sh` instead of duplicating it

### 3. `android-jenkins-analysis/scripts/server/config.js`
**Changes:**
```diff
- const baseConfig = require('../../jenkins-analysis/scripts/server/config');
  const ANDROID_PORT = process.env.ANDROID_WEBHOOK_PORT || 9091;
- module.exports = { ...baseConfig, ANDROID_PORT, ... };
+ module.exports = { ANDROID_PORT, ... };
```
**Purpose:** Made Android config standalone (no cross-project imports)

### 4. `jenkins-analysis/ecosystem.config.js`
**Changes:**
```diff
  {
    name: 'jenkins-webhook',
-   env: { WEBHOOK_PORT: 3000 },
+   env: { WEBHOOK_PORT: 9090 },
  },
  {
    name: 'android-webhook',
    script: './scripts/server/index.js',
-   cwd: '.../jenkins-analysis',
+   cwd: '.../android-jenkins-analysis',
    env: { ANDROID_WEBHOOK_PORT: 9091 },
  }
```

### 5. `android-jenkins-analysis/README.md`
**Action:** Added comprehensive troubleshooting section
**Topics:**
- Webhook connection issues
- Feishu upload debugging
- Analysis not running
- Report caching
- Configuration comparison
- PM2 ecosystem setup

---

## Verification Steps

### 1. Check Both Webhooks Running
```bash
pm2 list
# Expected:
# jenkins-webhook  (port 9090) - online
# android-webhook  (port 9091) - online
```

### 2. Test Web Jenkins Webhook
```bash
curl -X POST http://localhost:9090/webhook \
  -H "Content-Type: application/json" \
  -d '{"name":"Tanzu_Report_Env_Upgrade","build":{"number":1243,"status":"SUCCESS","phase":"COMPLETED"}}'

# Expected: {"status":"ok","message":"Webhook received"}
```

### 3. Test Android Jenkins Webhook
```bash
curl -X POST http://localhost:9091/webhook \
  -H "Content-Type: application/json" \
  -d '{"name":"Trigger_Library_Jobs","build":{"number":89,"status":"SUCCESS","phase":"COMPLETED"}}'

# Expected: {"status":"ok","message":"Webhook received"}
```

### 4. Verify Feishu Delivery
```bash
tail -50 projects/android-jenkins-analysis/logs/android_analyzer_Trigger_Library_Jobs_89.log | grep "Feishu"

# Expected output:
# ✓ Access token obtained
# ✓ File uploaded (file_key: file_v3_...)
# ✓ Message sent successfully (message_id: om_...)
# ✓ Report delivered to Feishu chat: oc_f15b73b877ad243886efaa1e99018807
```

---

## Lessons Learned

### 1. **Avoid Duplication**
When multiple projects need the same utility script, use relative path references instead of copying.

**Pattern:**
```bash
SHARED_SCRIPT="$(dirname "$PROJECT_DIR")/sibling-project/scripts/utility.sh"
bash "$SHARED_SCRIPT" "$ARG1"
```

### 2. **Consistent Upload Logic**
Web and Android analyzers should use the same Feishu upload approach - don't add unnecessary environment variable checks.

### 3. **Ecosystem Config Best Practices**
- Use separate `cwd` for each webhook
- Use correct env var names (WEBHOOK_PORT vs ANDROID_WEBHOOK_PORT)
- Always `pm2 save` after config changes

### 4. **Documentation is Critical**
Added troubleshooting section to README prevents future confusion about:
- Why no FEISHU_WEBHOOK_URL needed
- How to debug webhook issues
- Port assignments
- PM2 configuration

---

## Status: ✅ Fixed

Both webhook servers now running correctly:
- **jenkins-webhook** (port 9090) → Web Jenkins CI
- **android-webhook** (port 9091) → Android Library CI
- **Feishu delivery** working for both ✅

Reports automatically uploaded to chat: `oc_f15b73b877ad243886efaa1e99018807`
