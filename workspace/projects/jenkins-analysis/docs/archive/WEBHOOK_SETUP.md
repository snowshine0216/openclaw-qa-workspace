# Jenkins Webhook Setup Guide

This guide explains how to configure Jenkins to send webhooks to the analyzer system.

## Architecture

```
Jenkins Job Completes
    ↓
Webhook sent to Node.js server (port 9090)
    ↓
analyzer.sh spawned in background
    ↓
Fetches downstream jobs → Analyzes failures → Generates DOCX → Uploads to Feishu
```

---

## Step 1: Start Webhook Server

```bash
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts
node webhook_server.js
```

The server will listen on port **9090** (configurable via `WEBHOOK_PORT` env var).

**To run as a background service (using PM2):**

```bash
# Install PM2 globally
npm install -g pm2

# Start webhook server
pm2 start webhook_server.js --name jenkins-webhook

# Make it auto-start on system reboot
pm2 startup
pm2 save
```

---

## Step 2: Configure Jenkins Webhooks

### Option A: Using Jenkins Notification Plugin (Recommended)

1. **Install Plugin:**
   - Go to Jenkins → Manage Jenkins → Manage Plugins
   - Search for "Notification Plugin"
   - Install and restart Jenkins

2. **Configure Watched Jobs:**
   
   For each job (`Tanzu_Report_Env_Upgrade` and `TanzuEnvPrepare`):
   
   - Go to job → Configure
   - Scroll to "Post-build Actions"
   - Add "Job Notifications"
   - Set:
     - **Protocol:** HTTP
     - **Format:** JSON
     - **URL:** `http://localhost:9090/webhook` (or your server IP)
     - **Event:** `Job Finalized` (build completed)
   - Save

3. **Test:**
   - Trigger a build manually
   - Check webhook server logs: `tail -f ../tmp/webhook.log`

---

### Option B: Using Generic Webhook Trigger Plugin

1. **Install Plugin:**
   - Go to Jenkins → Manage Jenkins → Manage Plugins
   - Search for "Generic Webhook Trigger Plugin"
   - Install and restart

2. **Configure:**
   - Go to job → Configure
   - Check "Generic Webhook Trigger"
   - Add Post content parameters:
     - Variable: `jobName`, Expression: `$.name`
     - Variable: `buildNumber`, Expression: `$.build.number`
     - Variable: `buildStatus`, Expression: `$.build.status`
   - Token: `jenkins-qa-trigger` (optional, for authentication)
   
3. **Webhook URL:**
   ```
   http://localhost:9090/webhook
   ```

4. **Trigger manually to test:**
   ```bash
   curl -X POST http://localhost:9090/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Tanzu_Report_Env_Upgrade",
       "build": {
         "number": 123,
         "status": "SUCCESS",
         "phase": "COMPLETED"
       }
     }'
   ```

---

## Step 3: Firewall & Network Configuration

If Jenkins and the webhook server are on different machines:

1. **Open port 9090:**
   ```bash
   # macOS
   sudo pfctl -e
   echo "pass in proto tcp from any to any port 9090" | sudo pfctl -f -
   
   # Linux (iptables)
   sudo iptables -A INPUT -p tcp --dport 9090 -j ACCEPT
   sudo iptables-save
   ```

2. **Update webhook URL in Jenkins:**
   - Replace `localhost` with the server's IP address
   - Example: `http://192.168.1.100:9090/webhook`

3. **Test connectivity from Jenkins server:**
   ```bash
   curl http://<webhook-server-ip>:9090/webhook
   ```

---

## Step 4: Verify Setup

1. **Check webhook server is running:**
   ```bash
   pm2 status
   # or
   ps aux | grep webhook_server
   ```

2. **Monitor logs:**
   ```bash
   # Webhook server logs
   tail -f /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/tmp/webhook.log
   
   # Analyzer logs
   tail -f /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/tmp/analyzer_*.log
   ```

3. **Test end-to-end:**
   - Trigger a build on `Tanzu_Report_Env_Upgrade` or `TanzuEnvPrepare`
   - Wait for build completion
   - Check webhook log for "Webhook received"
   - Check analyzer log for "Analysis started"
   - Verify report in Feishu chat

---

## Troubleshooting

### Webhook not received
- Check Jenkins plugin configuration
- Verify network connectivity: `curl http://localhost:9090/webhook`
- Check firewall rules
- Review webhook server logs

### Analysis not triggering
- Verify job names match exactly in `webhook_server.js` (line 12)
- Check analyzer script permissions: `chmod +x scripts/*.sh`
- Review webhook log for errors

### Feishu upload fails
- Verify Feishu credentials in `~/.openclaw/openclaw.json`
- Check Feishu app permissions (needs file upload + message sending)
- Test manually: `bash scripts/feishu_uploader.sh <test.docx>`

### Report already exists but not sent
- Check `reports/` folder structure
- Verify DOCX file exists and is readable
- Re-run manually: `bash scripts/analyzer.sh Tanzu_Report_Env_Upgrade 123`

---

## Maintenance

### View active webhooks
```bash
pm2 status
pm2 logs jenkins-webhook
```

### Restart webhook server
```bash
pm2 restart jenkins-webhook
```

### Stop webhook server
```bash
pm2 stop jenkins-webhook
pm2 delete jenkins-webhook
```

### Clean up old reports (keep last 30 days)
```bash
find reports/ -type d -mtime +30 -exec rm -rf {} \;
```

---

## Security Considerations

1. **Add webhook authentication:**
   - Modify `webhook_server.js` to check for a secret token
   - Configure Jenkins to send `Authorization: Bearer <token>` header

2. **Use HTTPS:**
   - Set up nginx/Apache reverse proxy with SSL
   - Update Jenkins webhook URL to `https://...`

3. **Restrict access:**
   - Bind webhook server to internal IP only
   - Use VPN or SSH tunnel for external Jenkins instances

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WEBHOOK_PORT` | `9090` | Port for webhook server |
| `JENKINS_URL` | `http://tec-l-1081462...` | Jenkins base URL |
| `JENKINS_USER` | `admin` | Jenkins username |
| `JENKINS_API_TOKEN` | (from .env) | Jenkins API token |
| `FEISHU_CHAT_ID` | `oc_f15b73b877...` | Feishu chat ID |
| `TIMEOUT_MINUTES` | `120` | Max wait time for analysis |

---

**Last Updated:** 2026-02-23  
**Author:** Atlas Daily (QA Monitoring Agent)
