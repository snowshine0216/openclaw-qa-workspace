# Answers to Your Questions

## 1. ✅ Auto-Start After Reboot

**Current Status:** Webhook is running but **won't auto-start after reboot yet**.

**To enable auto-start:**

```bash
# Step 1: Run this command
pm2 startup

# Step 2: It will output a command starting with "sudo..." - copy and run it
# Example (enter your password when prompted):
sudo env PATH=$PATH:/Users/vizcitest/.nvm/versions/node/v24.13.1/bin /Users/vizcitest/.nvm/versions/node/v24.13.1/lib/node_modules/pm2/bin/pm2 startup launchd -u vizcitest --hp /Users/vizcitest

# Step 3: Save current processes
pm2 save
```

**After reboot:**
```bash
# Check status
pm2 status

# Should show: jenkins-webhook | online
```

**See full guide:** `docs/AUTO_START.md`

---

## 2. 🔄 Alternative to Job Notifications Plugin

**Option A: Polling Script (No Jenkins Plugin Needed)**

I've created `scripts/jenkins_poller.sh` that:
- Polls Jenkins every 60 seconds
- Detects new completed builds
- Automatically triggers webhook

**Start the poller:**
```bash
# Option 1: Run in foreground
bash scripts/jenkins_poller.sh

# Option 2: Run with PM2 (recommended)
cd scripts/
pm2 start jenkins_poller.sh --name jenkins-poller --interpreter bash
pm2 save
```

**How it works:**
```
jenkins_poller.sh → Checks Jenkins every 60s
                 → Detects new build
                 → Triggers webhook (localhost:9090)
                 → analyzer.sh runs
                 → Report sent to Feishu
```

**Advantages:**
- No Jenkins configuration needed
- Works with any Jenkins version
- Easy to customize poll interval

**Disadvantages:**
- 60-second delay (vs instant webhook)
- Uses more API calls

---

**Option B: Jenkins Post-Build Script**

If you have access to Jenkins job configuration, add a post-build step:

1. Go to: `http://tec-l-1081462.labs.microstrategy.com:8080/job/Tanzu_Report_Env_Upgrade/configure`
2. Add "Execute shell" post-build action:

```bash
#!/bin/bash
# Trigger webhook after build completes

curl -X POST http://<your-mac-ip>:9090/webhook \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$JOB_NAME\",
    \"build\": {
      \"number\": $BUILD_NUMBER,
      \"status\": \"$BUILD_STATUS\",
      \"phase\": \"COMPLETED\"
    }
  }"
```

3. Save and repeat for `TanzuEnvPrepare`

---

**Option C: Cron Job (Scheduled Check)**

If you only need reports at specific times:

```bash
# Edit crontab
crontab -e

# Add: Check every hour at :05 (e.g., 9:05, 10:05, 11:05)
5 * * * * bash /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts/check_and_trigger.sh >> /tmp/jenkins_cron.log 2>&1
```

---

**Recommendation:** Use **Option A (Polling Script)** with PM2 - no Jenkins changes needed!

---

## 3. 🚀 Manual Trigger

**Quick Method:**

```bash
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts

# Manual trigger for a specific build
bash manual_trigger.sh Tanzu_Report_Env_Upgrade 663
bash manual_trigger.sh TanzuEnvPrepare 123
```

**What it does:**
1. Triggers webhook for the specified job and build
2. Analyzer runs in background
3. Fetches downstream jobs
4. Analyzes failures
5. Generates DOCX report
6. Uploads to Feishu

**Monitor progress:**
```bash
# View webhook receipt
tail -f tmp/webhook.log

# View analysis progress
tail -f tmp/analyzer_Tanzu_Report_Env_Upgrade_663.log

# Check heartbeat (updates every 5 min)
watch -n 5 cat tmp/heartbeat_Tanzu_Report_Env_Upgrade_663.txt
```

---

**Advanced: Direct Analyzer Call (Skip Webhook)**

If webhook server is down, you can run analyzer directly:

```bash
cd scripts/
bash analyzer.sh Tanzu_Report_Env_Upgrade 663
```

This will:
- Run analysis immediately (no webhook needed)
- Generate report
- Upload to Feishu

---

## Summary of Options

### Auto-Start (Question 1)
**Action:** Run `pm2 startup` + the sudo command it outputs + `pm2 save`  
**Status:** Currently runs until reboot

### Jenkins Integration (Question 2)
**Recommended:** Use polling script (no Jenkins config needed)
```bash
cd scripts/
pm2 start jenkins_poller.sh --name jenkins-poller --interpreter bash
pm2 save
```

### Manual Trigger (Question 3)
**Quick Command:**
```bash
bash scripts/manual_trigger.sh <job_name> <build_number>
```

**Example:**
```bash
bash scripts/manual_trigger.sh Tanzu_Report_Env_Upgrade 663
```

---

## Quick Setup (Recommended)

```bash
# 1. Enable auto-start
pm2 startup
# (run the sudo command it outputs)
pm2 save

# 2. Start polling script (no Jenkins config needed!)
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts
pm2 start jenkins_poller.sh --name jenkins-poller --interpreter bash
pm2 save

# 3. Verify both are running
pm2 status
# Should show:
#   jenkins-webhook | online
#   jenkins-poller  | online

# 4. Manual trigger anytime:
bash scripts/manual_trigger.sh Tanzu_Report_Env_Upgrade 663
```

---

**Next action:** Choose one of the Jenkins integration options above!
