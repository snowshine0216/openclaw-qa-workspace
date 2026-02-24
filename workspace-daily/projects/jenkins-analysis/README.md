# Jenkins QA Daily Monitoring System

Automated webhook-based monitoring system for Jenkins test jobs. Analyzes failures, generates reports, and delivers them to Feishu.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd scripts/
npm install
```

### 2. Start Webhook Server
```bash
# Development (foreground)
node webhook_server.js

# Production (PM2)
npm install -g pm2
pm2 start webhook_server.js --name jenkins-webhook
pm2 startup
pm2 save
```

### 3. Configure Jenkins Webhooks
See [docs/WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md) for detailed instructions.

### 4. Test
```bash
# Simulate a webhook
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

# Check logs
tail -f tmp/webhook.log
tail -f tmp/analyzer_*.log
```

## 📁 Folder Structure

```
├── scripts/           # All automation scripts
├── tests/             # Standalone test files
├── data/              # SQLite database (gitignored)
├── tmp/               # Intermediate files (gitignored)
├── reports/           # Final reports organized by build (gitignored)
│   └── Tanzu_Report_Env_Upgrade_663/
│       └── jenkins_daily_report.docx  ← Sent to Feishu
├── docs/              # Documentation
│   ├── DESIGN.md          # System architecture
│   ├── TEST_MANUAL.md     # Test execution guide
│   └── WEBHOOK_SETUP.md   # Jenkins configuration guide
└── .gitignore
```

## 🔄 Workflow

1. **Jenkins build completes** → Sends webhook
2. **Webhook server** receives → Spawns analyzer
3. **Analyzer** fetches downstream jobs → Classifies pass/fail
4. **Report generator** creates markdown → Converts to DOCX
5. **Feishu uploader** sends report to chat

**Key Feature:** Checks if report exists before re-analyzing (cost optimization)

## 💓 Heartbeat Monitoring

Analysis progress is written to `tmp/heartbeat_*.txt` every 5 minutes:
- `"Fetching downstream jobs..."`
- `"Analyzing failures (5/12)..."`
- `"Uploading to Feishu..."`

## 📊 Report Format

- **Executive Summary:** Total jobs, pass rate
- **Passed Jobs:** Simple list with build numbers
- **Failed Jobs:** Detailed analysis with console logs
- **Format:** DOCX (uploaded to Feishu chat)

## 🔧 Configuration

**Watched Jobs** (edit in `scripts/webhook_server.js`):
- `Tanzu_Report_Env_Upgrade`
- `TanzuEnvPrepare`

**Feishu Chat ID** (edit in `scripts/analyzer.sh`):
- `oc_f15b73b877ad243886efaa1e99018807`

**Jenkins Credentials:**
- Set in `.env` file (see `.env.example`)

## 📖 Documentation

- [DESIGN.md](docs/DESIGN.md) - System architecture and data flow
- [WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md) - Jenkins webhook configuration

## Manually trigger
```bash
cd /Users/vizcitest/Documents/Repository/openclaw-qa-workspace/workspace-daily/projects/jenkins-analysis/scripts
bash manual_trigger.sh Tanzu_Report_Env_Upgrade 1242
 ```

## 🐛 Troubleshooting

**Webhook not received?**
```bash
# Check server status
pm2 status

# Test connectivity
curl http://localhost:9090/webhook

# View logs
pm2 logs jenkins-webhook
tail -f tmp/webhook.log
```

**Analysis not starting?**
```bash
# Check analyzer logs
ls -lh tmp/analyzer_*.log
tail -f tmp/analyzer_*.log

# Check heartbeat
cat tmp/heartbeat_*.txt
```

**Feishu upload fails?**
```bash
# Verify credentials
grep -A 5 '"feishu"' ~/.openclaw/openclaw.json

# Test manually
bash scripts/feishu_uploader.sh reports/test.docx
```

## 🔐 Security

- Jenkins credentials stored in `.env` (gitignored)
- Feishu credentials in `~/.openclaw/openclaw.json`
- Webhook server: Add token authentication (TODO)
- Use firewall to restrict webhook port to Jenkins server IP

## 📝 Maintenance

**View active analysis:**
```bash
ls -lh tmp/heartbeat_*.txt
cat tmp/heartbeat_*.txt
```

**Clean old reports (30 days):**
```bash
find reports/ -type d -mtime +30 -exec rm -rf {} \;
```

**Restart webhook server:**
```bash
pm2 restart jenkins-webhook
```

## 📬 Contact

**Agent:** Atlas Daily (QA Monitoring Agent)  
**Version:** 1.0  
**Date:** 2026-02-23

---

**Status:** ✅ System ready for deployment
