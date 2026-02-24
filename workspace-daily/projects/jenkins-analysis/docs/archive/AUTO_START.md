# Auto-Start Webhook Server After Reboot

## Quick Setup (Run Once)

```bash
# Enable PM2 startup script
pm2 startup

# Copy the command it outputs (starts with "sudo...") and run it
# Example:
sudo env PATH=$PATH:/Users/vizcitest/.nvm/versions/node/v24.13.1/bin /Users/vizcitest/.nvm/versions/node/v24.13.1/lib/node_modules/pm2/bin/pm2 startup launchd -u vizcitest --hp /Users/vizcitest

# Save current PM2 process list
pm2 save
```

Now the webhook server will auto-start after reboot! ✅

## Verify Auto-Start

```bash
# Check PM2 status
pm2 status

# Should show:
# jenkins-webhook | online
```

## If You've Already Rebooted

```bash
# Check if PM2 is running
pm2 list

# If empty, restore saved processes:
pm2 resurrect

# Or manually start:
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts
pm2 start webhook_server.js --name jenkins-webhook
pm2 save
```

---

**Current Status:** Webhook is running but won't survive reboot yet.  
**Action Needed:** Run the `pm2 startup` commands above (requires sudo password).
