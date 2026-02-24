# Android CI Troubleshooting Guide

**Version:** 1.0  
**Date:** 2026-02-24

---

## Common Issues & Solutions

### Issue 1: Log file not created

**Symptoms:**
```bash
$ tail -f logs/analyzer_Trigger_Library_Jobs_87.log
tail: logs/analyzer_Trigger_Library_Jobs_87.log: No such file or directory
```

**Diagnosis:**
```bash
# Check if logs directory exists
ls -ld projects/jenkins-analysis/logs/

# Check permissions
ls -l projects/jenkins-analysis/

# Check if script is running
ps aux | grep android_analyzer
```

**Solutions:**

1. **Manually create log directory:**
   ```bash
   mkdir -p projects/jenkins-analysis/logs
   chmod 755 projects/jenkins-analysis/logs
   ```

2. **Enable debug mode:**
   ```bash
   export DEBUG=1
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```

3. **Run with explicit logging:**
   ```bash
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87 2>&1 | tee manual.log
   ```

---

### Issue 2: Report not regenerating

**Symptoms:**
```bash
[2026-02-24 18:13:25] ✓ Re-using existing Android report at .../Trigger_Library_Jobs_87.docx
```

**Diagnosis:**
```bash
# Check if old report exists
ls -lh reports/Trigger_Library_Jobs_87/Trigger_Library_Jobs_87.docx

# Check report timestamp
stat reports/Trigger_Library_Jobs_87/Trigger_Library_Jobs_87.docx

# NOTE: Old reports may be named android_report.docx (before Fix 0)
ls -lh reports/Trigger_Library_Jobs_87/android_report.docx
```

**Solutions:**

1. **Use --force flag (after Phase 1 implementation):**
   ```bash
   bash scripts/android_analyzer.sh --force Trigger_Library_Jobs 87
   ```

2. **Manually delete old reports (both naming conventions):**
   ```bash
   # New naming (after Fix 0)
   rm -f reports/Trigger_Library_Jobs_87/Trigger_Library_Jobs_87.*
   # Old naming (before Fix 0)
   rm -f reports/Trigger_Library_Jobs_87/android_report.*
   # JSON artifacts
   rm -f reports/Trigger_Library_Jobs_87/*.json
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```

3. **Delete entire report directory:**
   ```bash
   rm -rf reports/Trigger_Library_Jobs_87/
   bash scripts/android_analyzer.sh Trigger_Library_Jobs 87
   ```

**Note:** After Fix 0 implementation, reports will be named `{JOB}_{BUILD}.docx` instead of `android_report.docx`.

---

### Issue 3: Feishu delivery fails

**Symptoms:**
```bash
[2026-02-24 18:13:25] ⚠ FEISHU_WEBHOOK_URL not established, skipping Feishu re-upload
```

**Diagnosis:**
```bash
# Check if webhook URL is set
echo $FEISHU_WEBHOOK_URL

# Check feishu_uploader.sh exists
ls -lh scripts/feishu_uploader.sh

# Check if report exists
ls -lh reports/Trigger_Library_Jobs_87/android_report.docx
```

**Solutions:**

1. **Set webhook URL from TOOLS.md:**
   ```bash
   export FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/...
   ```

2. **Get webhook from chat_id (from TOOLS.md: oc_f15b73b877ad243886efaa1e99018807):**
   - Check OpenClaw Feishu app configuration
   - Or ask Snow for the webhook URL

3. **Test webhook manually:**
   ```bash
   curl -X POST "$FEISHU_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"msg_type":"text","content":{"text":"Test message"}}'
   ```

4. **Manual upload (if webhook fails):**
   ```bash
   # Upload via Feishu web interface
   # File: reports/Trigger_Library_Jobs_87/android_report.docx
   # Chat: oc_f15b73b877ad243886efaa1e99018807
   ```

---

### Issue 4: ExtentReport not found (404)

**Symptoms:**
```bash
❌ Jenkins API http://ci-master.../564/ExtentReport/ failed: Not Found
```

**Diagnosis:**
```bash
# Check job exists
curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
  http://tec-l-1081462.labs.microstrategy.com:8080/job/Library_Dossier_InfoWindow/564/api/json

# Check ExtentReport exists
curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
  http://tec-l-1081462.labs.microstrategy.com:8080/job/Library_Dossier_InfoWindow/564/ExtentReport/

# Check credentials
echo $JENKINS_USER
echo $JENKINS_API_TOKEN | wc -c  # Should be ~32 chars
```

**Solutions:**

1. **Verify Jenkins credentials:**
   ```bash
   # From android_analyzer.sh:
   export JENKINS_URL="http://tec-l-1081462.labs.microstrategy.com:8080/"
   export JENKINS_USER="admin"
   export JENKINS_API_TOKEN="11596241e9625bf6e48aca51bf0af0a036"
   ```

2. **Check if build is still running:**
   ```bash
   # Get build status
   curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
     "http://tec-l-1081462.labs.microstrategy.com:8080/job/Library_Dossier_InfoWindow/564/api/json?tree=building,result"
   ```

3. **Fallback to JUnit report:**
   - ExtentReport may not be published yet
   - `extent_parser.js` should automatically fall back to JUnit API
   - Check logs for fallback messages

---

### Issue 5: No failures detected but job failed

**Symptoms:**
```bash
⚠ No explicit ExtentReport failures found for Library_Dossier_InfoWindow
```

**Diagnosis:**
```bash
# Check ExtentReport HTML manually
curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
  "http://tec-l-1081462.labs.microstrategy.com:8080/job/Library_Dossier_InfoWindow/564/ExtentReport/newReportVersion2.0/" \
  > extent.html

# Search for test data
grep -i "var testData" extent.html
grep -i "window.TESTS" extent.html

# Check JUnit report
curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
  "http://tec-l-1081462.labs.microstrategy.com:8080/job/Library_Dossier_InfoWindow/564/testReport/api/json"
```

**Solutions:**

1. **Check if ExtentReport was generated:**
   - Job may have failed before ExtentReport generation
   - Check Jenkins console log for ExtentReport generation errors

2. **Use JUnit fallback:**
   ```javascript
   // In extent_parser.js, this should happen automatically
   // Check if fallback is working:
   grep "Falling back to JUnit" logs/android_analyzer_*.log
   ```

3. **Manual inspection:**
   - Download extent.html
   - Open in browser
   - Verify test data is present

---

### Issue 6: Database errors

**Symptoms:**
```bash
❌ Error: SQLITE_ERROR: no such column: platform
```

**Diagnosis:**
```bash
# Check database schema
sqlite3 data/jenkins_history.db ".schema failed_steps"

# Check if platform column exists
sqlite3 data/jenkins_history.db "PRAGMA table_info(failed_steps);" | grep platform
```

**Solutions:**

1. **Run migration:**
   ```bash
   node scripts/database/migrate.js
   ```

2. **Recreate database (DESTRUCTIVE - loses history):**
   ```bash
   mv data/jenkins_history.db data/jenkins_history.db.backup
   node scripts/database/schema.js
   ```

3. **Manual column addition:**
   ```bash
   sqlite3 data/jenkins_history.db <<EOF
   ALTER TABLE job_runs ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';
   ALTER TABLE failed_steps ADD COLUMN platform TEXT NOT NULL DEFAULT 'web';
   ALTER TABLE failed_steps ADD COLUMN tc_id_raw TEXT;
   ALTER TABLE failed_steps ADD COLUMN config_url TEXT;
   ALTER TABLE failed_steps ADD COLUMN failed_step_name TEXT;
   ALTER TABLE failed_steps ADD COLUMN failure_type TEXT;
   ALTER TABLE failed_steps ADD COLUMN rerun_build_num INTEGER;
   ALTER TABLE failed_steps ADD COLUMN rerun_result TEXT;
   EOF
   ```

---

### Issue 7: Node module errors

**Symptoms:**
```bash
Error: Cannot find module '../android/extent_parser'
```

**Diagnosis:**
```bash
# Check if files exist
ls -l scripts/android/
ls -l scripts/pipeline/process_android_build.js

# Check working directory
pwd

# Check node_modules
ls -l node_modules/
```

**Solutions:**

1. **Install dependencies:**
   ```bash
   cd projects/jenkins-analysis
   npm install
   ```

2. **Check node version:**
   ```bash
   node --version  # Should be v18+
   ```

3. **Verify file paths:**
   ```bash
   # From jenkins-analysis directory:
   node -e "console.log(require.resolve('./scripts/android/extent_parser'))"
   ```

---

### Issue 8: Manual trigger doesn't spawn analyzer

**Symptoms:**
```bash
$ bash scripts/manual_trigger.sh Trigger_Library_Jobs 87
Response: {"error":"Not Found"}
```

**Diagnosis:**
```bash
# Check if webhook server is running
ps aux | grep webhook

# Check webhook server logs
tail -f logs/webhook.log

# Check PM2 status (if using PM2)
pm2 list
pm2 logs jenkins-webhook
```

**Solutions:**

1. **Start webhook server:**
   ```bash
   pm2 start server/index.js --name jenkins-webhook
   ```

2. **Or run manually:**
   ```bash
   node server/index.js &
   ```

3. **Check port 9090:**
   ```bash
   lsof -i :9090
   ```

4. **Test webhook directly:**
   ```bash
   curl http://localhost:9090/webhook
   # Should return: {"ok":true,"message":"Webhook receiver ready"}
   ```

---

## Debug Checklist

When troubleshooting, check these in order:

1. ✅ **Environment variables set:**
   ```bash
   echo $JENKINS_URL
   echo $JENKINS_USER
   echo $JENKINS_API_TOKEN
   echo $FEISHU_WEBHOOK_URL
   ```

2. ✅ **Directories exist and writable:**
   ```bash
   ls -ld logs/ reports/ tmp/ data/
   ```

3. ✅ **Jenkins credentials work:**
   ```bash
   curl -u $JENKINS_USER:$JENKINS_API_TOKEN \
     "$JENKINS_URL/api/json"
   ```

4. ✅ **Node modules installed:**
   ```bash
   ls -ld node_modules/
   npm list
   ```

5. ✅ **Database schema up to date:**
   ```bash
   sqlite3 data/jenkins_history.db ".schema" | grep platform
   ```

6. ✅ **Webhook server running:**
   ```bash
   curl http://localhost:9090/webhook
   ```

7. ✅ **Scripts have execute permissions:**
   ```bash
   ls -l scripts/*.sh
   chmod +x scripts/*.sh  # if needed
   ```

---

## Getting Help

### Log Locations

```bash
# Webhook server logs
logs/webhook.log

# Analyzer logs (trigger job)
logs/android_analyzer_<JOB>_<BUILD>.log

# Single job logs (Phase 2)
logs/android_single_<JOB>_<BUILD>.log

# Node.js error logs
logs/error.log
```

### Debug Output

```bash
# Enable verbose mode
export DEBUG=1

# Increase Node.js verbosity
export NODE_DEBUG=*

# Trace shell execution
bash -x scripts/android_analyzer.sh Trigger_Library_Jobs 87
```

### Contact

- **Project Owner:** Snow
- **QA Agent:** Atlas Daily
- **Chat:** Feishu oc_f15b73b877ad243886efaa1e99018807

---

**Last Updated:** 2026-02-24  
**Version:** 1.0
