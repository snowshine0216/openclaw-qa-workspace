# Jenkins Analysis Deployment Guide

This document describes how to deploy and configure the Jenkins Failure Analysis Webhook server. It merges previously separate guides for webhook setup, PM2 auto-start, and environment requirements.

## 1. Prerequisites setup

The Jenkins Analysis system uses Node.js and bash scripts. 

You need:
- Node.js installed (v18 or higher recommended).
- PM2 installed globally for application monitoring: `npm install -g pm2`
- `curl`, `jq` available in the path.

### 2. Jenkins Authentication

Ensure `analyzer.sh` has the correct authentication parameters:
`JENKINS_URL="http://your-jenkins-instance.com/""`
`JENKINS_USER="admin"`
`JENKINS_API_TOKEN="<your_api_token>"`

## 3. Webhook Setup on Jenkins

1. Go to your Jenkins Job -> Configure.
2. Under "Post-build actions" -> "Job Notifications" or "Add webhook".
3. Configure the webhook to point to your deployment server: `http://localhost:9090/webhook`. (Update the host/port if necessary).
4. Select trigger conditions (e.g. Always notify, or On Failure).

## 4. Starting the Analysis Server

You can run the parsing server manually and see local output:
\`\`\`bash
cd scripts
npm run start
\`\`\`

Ideally, run the server inside a daemon like `pm2`:

\`\`\`bash
# 1. Install pm2 (if not already installed)
npm install -g pm2

# 2. Start the webhook server
pm2 start scripts/server/index.js --name jenkins-webhook

# 3. Generate startup script
pm2 startup

# 4. Save the current process list so it survives a reboot
pm2 save
\`\`\`

### Troubleshooting Missing Autostarts
If the server doesn't auto-start upon testing a reboot:
1. `pm2 unstartup`
2. `pm2 startup` (Copy the command it provides and paste into your terminal).
3. Confirm processes are running: `pm2 status`.
4. `pm2 save`.
