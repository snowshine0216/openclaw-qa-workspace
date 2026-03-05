# ✅ Deployment Complete - Phase 1

**Date:** 2026-02-23 17:44 GMT+8  
**Status:** Webhook server running ✅

---

## 🎉 What's Running

### Webhook Server (PM2)
```
✓ Name: jenkins-webhook
✓ Status: online
✓ Port: 9090
✓ PID: 37823
✓ Memory: 10.4MB
✓ Auto-restart: enabled
✓ Watching: Tanzu_Report_Env_Upgrade, TanzuEnvPrepare
```

**View logs:**
```bash
pm2 logs jenkins-webhook
tail -f /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/tmp/webhook.log
```

**Manage server:**
```bash
pm2 status                # View status
pm2 restart jenkins-webhook   # Restart
pm2 stop jenkins-webhook      # Stop
pm2 delete jenkins-webhook    # Remove
```

---

## ✅ Test Results

**Webhook test:** ✅ Passed

```bash
curl -X POST http://localhost:9090/webhook \
  -H "Content-Type: application/json" \
  -d '{"name":"Tanzu_Report_Env_Upgrade","build":{"number":999,"status":"SUCCESS","phase":"COMPLETED"}}'

Response: {"status":"ok","message":"Webhook received"}
```

**Analyzer triggered:** ✅ Yes (build #999 not found, as expected)

**Logs created:** ✅ Yes
- `tmp/webhook.log` - Webhook events
- `tmp/analyzer_Tanzu_Report_Env_Upgrade_999.log` - Analysis logs
- `tmp/heartbeat_Tanzu_Report_Env_Upgrade_999.txt` - Progress tracking

**Bug fixed:** ✅ macOS grep compatibility (removed `-P` flag)

---

## 📋 Next: Configure Jenkins Webhooks

### Option A: Jenkins Notification Plugin (Recommended)

**1. Install Plugin**

Go to Jenkins:
```
http://tec-l-1081462.labs.microstrategy.com:8080/pluginManager/available
```

Search for: **"Notification Plugin"**  
Install and restart Jenkins.

**2. Configure Tanzu_Report_Env_Upgrade**

1. Go to: `http://tec-l-1081462.labs.microstrategy.com:8080/job/Tanzu_Report_Env_Upgrade/configure`
2. Scroll to **"Post-build Actions"**
3. Click **"Add post-build action"** → **"Job Notifications"**
4. Configure:
   - **Format:** JSON
   - **Protocol:** HTTP
   - **Event:** Job Finalized
   - **URL:** `http://<your-server-ip>:9090/webhook`
     - If Jenkins and webhook server are on same machine: `http://localhost:9090/webhook`
     - Otherwise: `http://192.168.x.x:9090/webhook` (your Mac's IP)
   - **Timeout:** 30000
5. Save

**3. Configure TanzuEnvPrepare**

Repeat step 2 for:
```
http://tec-l-1081462.labs.microstrategy.com:8080/job/TanzuEnvPrepare/configure
```

---

### Option B: Manual Webhook (For Testing)

If you can't install plugins, you can manually trigger webhooks:

```bash
# When Tanzu_Report_Env_Upgrade #663 completes:
curl -X POST http://localhost:9090/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tanzu_Report_Env_Upgrade",
    "build": {
      "number": 663,
      "status": "SUCCESS",
      "phase": "COMPLETED"
    }
  }'
```

---

## 🔍 How to Get Your Mac's IP Address

If Jenkins is on a different machine, you need your Mac's local IP:

```bash
ipconfig getifaddr en0
# or
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Example: `192.168.1.100`

Then use: `http://192.168.1.100:9090/webhook` in Jenkins config.

---

## 🔥 Firewall Configuration (If Needed)

If Jenkins can't reach your Mac on port 9090:

### macOS Firewall
```bash
# Check if firewall is on
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Allow incoming connections on port 9090 (if needed)
# Go to: System Preferences → Security & Privacy → Firewall → Firewall Options
# Add Node.js app to allowed list
```

### Test connectivity from Jenkins server:
```bash
# From Jenkins server, run:
curl http://<your-mac-ip>:9090/webhook
```

Should return: `Method Not Allowed` (because it's a GET, not POST) - but this confirms connectivity.

---

## 🧪 End-to-End Test

Once Jenkins webhooks are configured:

**1. Trigger a real build:**
- Go to: `http://tec-l-1081462.labs.microstrategy.com:8080/job/Tanzu_Report_Env_Upgrade/`
- Click **"Build Now"**

**2. Wait for build completion**

**3. Monitor webhook receipt:**
```bash
tail -f /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/tmp/webhook.log
```

You should see:
```
[timestamp] ✓ Watched job completed: Tanzu_Report_Env_Upgrade #XXX (SUCCESS)
[timestamp] Triggering analysis for Tanzu_Report_Env_Upgrade #XXX
[timestamp] Analysis spawned for Tanzu_Report_Env_Upgrade #XXX (PID: XXXX)
```

**4. Monitor analysis:**
```bash
tail -f /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/tmp/analyzer_Tanzu_Report_Env_Upgrade_*.log
```

**5. Check heartbeat (every 5 min):**
```bash
cat /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/tmp/heartbeat_Tanzu_Report_Env_Upgrade_*.txt
```

**6. Wait for Feishu delivery:**
Check Feishu chat (ID: `oc_f15b73b877ad243886efaa1e99018807`) for the DOCX report.

---

## 📊 What Happens During Analysis

```
1. Webhook received             → Instant
2. Fetch downstream jobs        → ~10 seconds
3. Check status of 30-40 jobs   → ~30 seconds
4. Fetch console logs (failed)  → ~5 seconds per failed job
5. Generate markdown report     → ~2 seconds
6. Convert to DOCX             → ~3 seconds
7. Upload to Feishu            → ~5 seconds

Total: 1-5 minutes (depends on failure count)
```

**Heartbeat updates every 5 minutes:**
- "Fetching downstream jobs..."
- "Fetching statuses (12/35)..."
- "Analyzing failures (3/8)..."
- "Generating report..."
- "Uploading to Feishu..."

---

## 🐛 Troubleshooting

### Webhook not received
```bash
# Check server status
pm2 status

# View logs
pm2 logs jenkins-webhook --lines 50

# Test locally
curl -X POST http://localhost:9090/webhook \
  -H "Content-Type: application/json" \
  -d '{"name":"Tanzu_Report_Env_Upgrade","build":{"number":1,"status":"SUCCESS","phase":"COMPLETED"}}'
```

### Analysis fails
```bash
# Check analyzer logs
ls -lh tmp/analyzer_*.log
tail -f tmp/analyzer_Tanzu_Report_Env_Upgrade_*.log

# Check heartbeat
cat tmp/heartbeat_*.txt
```

### Feishu upload fails
```bash
# Check Feishu credentials
grep -A 5 '"feishu"' ~/.openclaw/openclaw.json

# Test manually (create a dummy DOCX first)
echo "test" > test.docx
bash scripts/feishu_uploader.sh test.docx
```

---

## 📁 File Locations

**Logs:**
- Webhook: `tmp/webhook.log`
- Analyzer: `tmp/analyzer_JobName_BuildNum.log`
- PM2: `~/.pm2/logs/jenkins-webhook-*.log`

**Reports:**
- `reports/Tanzu_Report_Env_Upgrade_XXX/jenkins_daily_report.docx`

**Heartbeat:**
- `tmp/heartbeat_JobName_BuildNum.txt`

---

## ✅ Deployment Checklist

- [x] Webhook server running (PM2)
- [x] Test webhook successful
- [x] macOS grep bug fixed
- [x] Documentation complete
- [ ] Jenkins webhooks configured (your action)
- [ ] End-to-end test passed
- [ ] Feishu delivery confirmed

---

## 📞 Need Help?

**Documentation:**
- Architecture: `docs/DESIGN.md`
- Setup guide: `docs/WEBHOOK_SETUP.md`
- Deployment: `docs/IMPLEMENTATION_SUMMARY.md`

**Quick commands:**
```bash
# View webhook server logs
pm2 logs jenkins-webhook

# View analysis logs
tail -f tmp/analyzer_*.log

# Check heartbeat
cat tmp/heartbeat_*.txt

# Restart webhook server
pm2 restart jenkins-webhook

# Test webhook manually
curl -X POST http://localhost:9090/webhook \
  -H "Content-Type: application/json" \
  -d '{"name":"Tanzu_Report_Env_Upgrade","build":{"number":1,"status":"SUCCESS","phase":"COMPLETED"}}'
```

---

**Status:** ✅ System deployed and ready for Jenkins configuration

**Next action:** Configure Jenkins webhooks (see Option A above)

---

**Deployed by:** Atlas Daily  
**Date:** 2026-02-23 17:44 GMT+8
