# Jenkins QA Daily Monitoring System - Design Document

## Overview

Automated Jenkins job monitoring system that watches specific trigger jobs, analyzes downstream test results, generates comprehensive reports, and delivers them to Feishu.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Jenkins Server                            │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │ Tanzu_Report_Env_    │      │ TanzuEnvPrepare      │        │
│  │ Upgrade (Trigger)    │      │ (Trigger)            │        │
│  └──────────┬───────────┘      └──────────┬───────────┘        │
│             │                              │                     │
│             │ Triggers                     │ Triggers            │
│             ↓                              ↓                     │
│  ┌──────────────────────────────────────────────────────┐      │
│  │   Downstream Test Jobs (30-40 jobs)                  │      │
│  │   - LibraryWeb_Report_*                              │      │
│  │   - LibraryWeb_CustomApp_*                           │      │
│  │   - Snapshot_*                                       │      │
│  └──────────────────────────────────────────────────────┘      │
│             │                                                    │
│             │ On Completion                                     │
│             ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │          Jenkins Notification Plugin                  │      │
│  │          Sends HTTP POST webhook                      │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTP POST (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Monitoring Server (localhost)                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐      │
│  │   webhook_server.js (Node.js, Port 9090)            │      │
│  │   - Receives webhook                                 │      │
│  │   - Validates job name (whitelist)                  │      │
│  │   - Spawns analyzer in background                   │      │
│  └──────────────────┬────────────────────────────────────┘      │
│                     │                                            │
│                     │ spawn()                                    │
│                     ↓                                            │
│  ┌──────────────────────────────────────────────────────┐      │
│  │   analyzer.sh (Bash)                                 │      │
│  │   1. Check if report exists (cost optimization)     │      │
│  │   2. Fetch downstream jobs from trigger build       │      │
│  │   3. Get status of each downstream job              │      │
│  │   4. Classify: passed vs failed                     │      │
│  │   5. Fetch console logs for failed jobs             │      │
│  │   6. Generate consolidated report                   │      │
│  │   7. Convert MD → DOCX                              │      │
│  │   8. Upload to Feishu                               │      │
│  │                                                       │      │
│  │   Heartbeat: Every 5 minutes during analysis        │      │
│  └──────────────────┬────────────────────────────────────┘      │
│                     │                                            │
│                     │ calls                                      │
│                     ↓                                            │
│  ┌──────────────────────────────────────────────────────┐      │
│  │   report_generator.js (Node.js)                      │      │
│  │   - Reads failed/passed job lists                   │      │
│  │   - Extracts failure details from console logs      │      │
│  │   - Generates markdown report                       │      │
│  └──────────────────┬────────────────────────────────────┘      │
│                     │                                            │
│                     │ calls                                      │
│                     ↓                                            │
│  ┌──────────────────────────────────────────────────────┐      │
│  │   md_to_docx.js (Node.js)                           │      │
│  │   - Converts markdown → DOCX format                 │      │
│  │   - Uses 'marked' and 'docx' libraries             │      │
│  └──────────────────┬────────────────────────────────────┘      │
│                     │                                            │
│                     │ calls                                      │
│                     ↓                                            │
│  ┌──────────────────────────────────────────────────────┐      │
│  │   feishu_uploader.sh (Bash)                         │      │
│  │   1. Get Feishu tenant access token                 │      │
│  │   2. Upload DOCX file to Feishu                     │      │
│  │   3. Send file message to chat                      │      │
│  └──────────────────┬────────────────────────────────────┘      │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      │ HTTPS API
                      ↓
         ┌────────────────────────────┐
         │    Feishu (Chat)           │
         │    ID: oc_f15b73b877...    │
         │    Receives DOCX report    │
         └────────────────────────────┘
```

---

## Directory Structure

```
projects/jenkins-analysis/
├── scripts/
│   ├── webhook_server.js         # Webhook listener (Node.js)
│   ├── analyzer.sh                # Main analysis orchestrator (Bash)
│   ├── report_generator.js        # Report builder (Node.js)
│   ├── md_to_docx.js             # Markdown → DOCX converter (Node.js)
│   └── feishu_uploader.sh        # Feishu API integration (Bash)
│
├── tmp/                           # Intermediate files (gitignored)
│   ├── webhook.log
│   ├── analyzer_JobName_BuildNum.log
│   ├── heartbeat_JobName_BuildNum.txt
│   ├── JobName_BuildNum_downstream_jobs.txt
│   ├── JobName_BuildNum_failed_jobs.json
│   └── JobName_BuildNum_passed_jobs.json
│
├── reports/                       # Final reports (gitignored)
│   └── Tanzu_Report_Env_Upgrade_663/
│       ├── jenkins_daily_report.md
│       ├── jenkins_daily_report.docx  ← Sent to Feishu
│       └── LibraryWeb_Report_Sort_888_console.json
│
├── docs/
│   ├── DESIGN.md                  # This file
│   └── WEBHOOK_SETUP.md           # Jenkins webhook configuration guide
│
└── .gitignore                     # Excludes /tmp and /reports
```

---

## Component Details

### 1. webhook_server.js
**Purpose:** Webhook endpoint that receives Jenkins build notifications

**Technology:** Node.js (built-in http module)

**Port:** 9090 (configurable via `WEBHOOK_PORT` env var)

**Workflow:**
1. Listen for POST requests
2. Parse JSON payload
3. Extract: job name, build number, status, phase
4. Check if job is in whitelist (`WATCHED_JOBS`)
5. If completed + whitelisted → spawn `analyzer.sh` in background
6. Respond immediately (200 OK) to Jenkins

**Watched Jobs:**
- `Tanzu_Report_Env_Upgrade`
- `TanzuEnvPrepare`

**Logging:** All events logged to `tmp/webhook.log`

---

### 2. analyzer.sh
**Purpose:** Main analysis script that orchestrates the entire workflow

**Technology:** Bash

**Triggered by:** webhook_server.js (background process)

**Arguments:**
- `$1` = job_name (e.g., `Tanzu_Report_Env_Upgrade`)
- `$2` = build_number (e.g., `663`)

**Workflow:**

#### Step 1: Check Existing Report
```bash
if [ -f "$REPORT_DIR/jenkins_daily_report.docx" ]; then
  # Report exists → send directly to Feishu (cost optimization)
  bash feishu_uploader.sh "$REPORT_DIR/jenkins_daily_report.docx"
  exit 0
fi
```

#### Step 2: Register Heartbeat
```bash
HEARTBEAT_FILE="$TMP_DIR/heartbeat_${JOB_NAME}_${BUILD_NUMBER}.txt"
echo "$(date '+%s')|Starting analysis" > "$HEARTBEAT_FILE"
```

Updates every 5 minutes during long operations.

#### Step 3: Fetch Downstream Jobs
```bash
DOWNSTREAM_JOBS=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
    "$JENKINS_URL/job/$JOB_NAME/$BUILD_NUMBER/api/json?tree=downstreamProjects[name]" \
    | jq -r '.downstreamProjects[]?.name // empty')
```

Fallback: Parse console log for triggered jobs.

#### Step 4: Check Job Statuses
For each downstream job:
```bash
JOB_INFO=$(curl -s -u "$JENKINS_USER:$JENKINS_API_TOKEN" \
    "$JENKINS_URL/job/$job_name/lastBuild/api/json")
```

Classify into:
- `failed_jobs.json` (FAILURE, UNSTABLE)
- `passed_jobs.json` (SUCCESS)

#### Step 5: Analyze Failures
For each failed job, fetch console log:
```bash
node scripts/jenkins.mjs console --job "$JOB_NAME" --build "$BUILD_NUM" --tail 200
```

Save to `{JobName}_{BuildNum}_console.json`

#### Step 6: Generate Report
```bash
node report_generator.js \
    "$REPORT_FOLDER" \
    "failed_jobs.json" \
    "passed_jobs.json" \
    "$REPORT_DIR"
```

Produces: `jenkins_daily_report.md`

#### Step 7: Convert to DOCX
```bash
node md_to_docx.js \
    "jenkins_daily_report.md" \
    "jenkins_daily_report.docx"
```

#### Step 8: Upload to Feishu
```bash
bash feishu_uploader.sh "jenkins_daily_report.docx"
```

#### Step 9: Cleanup
```bash
rm -f "$HEARTBEAT_FILE"
```

**Logging:** All steps logged to `tmp/analyzer_JobName_BuildNum.log`

---

### 3. report_generator.js
**Purpose:** Builds consolidated markdown report from job data

**Technology:** Node.js

**Inputs:**
- `failed_jobs.json` - List of failed jobs with build numbers
- `passed_jobs.json` - List of passed jobs
- Console log JSON files for failed jobs

**Output:**
- `jenkins_daily_report.md`

**Report Structure:**
```markdown
# Jenkins Daily QA Report - Tanzu_Report_Env_Upgrade_663

## Executive Summary
- Total jobs: 35
- Pass rate: 85.7%

## Passed Jobs (30)
- LibraryWeb_Report_AdvancedProperties #825
- ...

## Failed Jobs (5)
### LibraryWeb_Report_Sort #888
**Failed Tests:**
- TC12345_01
- TC12345_02

**Console Log (last 50 lines):**
```
[error details]
```

[View in Jenkins](http://...)
```

**Logic:**
- Parse console logs to extract failed test cases
- Format as markdown with tables, lists, code blocks
- Include links to Jenkins for detailed investigation

---

### 4. md_to_docx.js
**Purpose:** Convert markdown report to Microsoft Word format

**Technology:** Node.js

**Libraries:**
- `marked` - Markdown parser
- `docx` - DOCX file generator

**Workflow:**
1. Parse markdown with `marked.lexer()`
2. Convert tokens to DOCX elements:
   - Headings → HeadingLevel.HEADING_1/2/3
   - Paragraphs → Paragraph with TextRun
   - Lists → Paragraph with bullet
   - Code blocks → Paragraph with Courier New font
   - Tables → Text representation (simplified)
3. Generate DOCX file with `Packer.toBuffer()`

**Output:** `jenkins_daily_report.docx` (ready for Feishu)

---

### 5. feishu_uploader.sh
**Purpose:** Upload DOCX report to Feishu chat

**Technology:** Bash + curl

**Authentication:**
- App ID & App Secret from `~/.openclaw/openclaw.json`
- Tenant access token (obtained via Feishu API)

**Workflow:**

#### Step 1: Get Access Token
```bash
curl -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
    -H "Content-Type: application/json" \
    -d '{"app_id":"...", "app_secret":"..."}'
```

#### Step 2: Upload File
```bash
curl -X POST "https://open.feishu.cn/open-apis/im/v1/files" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "file_type=stream" \
    -F "file_name=jenkins_daily_report.docx" \
    -F "file=@$FILE_PATH"
```

Returns: `file_key`

#### Step 3: Send Message
```bash
curl -X POST "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{
      "receive_id": "oc_f15b73b877ad243886efaa1e99018807",
      "msg_type": "file",
      "content": "{\"file_key\":\"...\"}
    }'
```

**Error Handling:**
- Check each API response for errors
- Log failures with detailed JSON output
- Exit with non-zero code on failure

---

## Data Flow

```
Trigger Build Complete
    ↓
Webhook → webhook_server.js
    ↓
spawn analyzer.sh (background)
    ↓
Check: Report exists? → YES → Send to Feishu → Exit
                      ↓ NO
    ↓
Fetch downstream jobs (30-40 jobs)
    ↓
Check status of each job (curl loop)
    ↓
Classify: passed_jobs.json, failed_jobs.json
    ↓
For each failed job: Fetch console log
    ↓
report_generator.js → jenkins_daily_report.md
    ↓
md_to_docx.js → jenkins_daily_report.docx
    ↓
feishu_uploader.sh → Upload to Feishu
    ↓
Done (user receives DOCX in Feishu chat)
```

---

## Heartbeat System

**Purpose:** Monitor long-running analysis tasks and provide progress updates

**Mechanism:**
1. `analyzer.sh` writes to `tmp/heartbeat_JobName_BuildNum.txt` every 5 minutes
2. Format: `timestamp|status_message`
3. External monitor (OpenClaw HEARTBEAT.md) can read this file to check progress

**Heartbeat Messages:**
- `"Fetching downstream jobs..."`
- `"Fetching statuses (12/35)..."`
- `"Analyzing failures (3/8)..."`
- `"Generating report..."`
- `"Uploading to Feishu..."`

**Timeout:**
- If analysis exceeds 120 minutes → alert to Feishu
- Heartbeat file removed on completion

---

## Cost Optimization

**Problem:** Re-analyzing the same build wastes API calls and compute time

**Solution:** Check if report already exists before starting analysis

```bash
REPORT_DIR="reports/${JOB_NAME}_${BUILD_NUMBER}"
if [ -f "$REPORT_DIR/jenkins_daily_report.docx" ]; then
  # Report exists → send directly
  bash feishu_uploader.sh "$REPORT_DIR/jenkins_daily_report.docx"
  exit 0
fi
```

**Benefit:**
- Multiple webhook triggers (e.g., from cron or manual) won't duplicate work
- Instant delivery if report already generated

---

## Error Handling & Alerting

### Scenario 1: Jenkins API Failure
- Log error to `tmp/analyzer_*.log`
- Update heartbeat: `"ERROR: Jenkins API unreachable"`
- Send alert to Feishu (plain text message)
- Exit with code 1

### Scenario 2: No Downstream Jobs Found
- Log warning
- Check alternative methods (parse console log)
- If still empty → alert and exit

### Scenario 3: Feishu Upload Fails
- Retry once after 10 seconds
- If still fails → log error with full API response
- Notify via heartbeat file
- Keep report in `reports/` for manual retrieval

### Scenario 4: Timeout (120 minutes)
- Send timeout alert to Feishu
- Kill analysis process
- Log partial results
- Mark heartbeat as `"TIMEOUT"`

---

## Security Considerations

### 1. Jenkins Credentials
- Stored in `.env` file (gitignored)
- API token used instead of password
- Token has read-only permissions

### 2. Feishu Credentials
- Stored in `~/.openclaw/openclaw.json` (outside git)
- App uses internal authentication (not user tokens)
- Permissions: file upload + message sending only

### 3. Webhook Authentication
- Currently accepts all POST requests
- **TODO:** Add secret token validation
- Recommend: `Authorization: Bearer <secret>` header

### 4. Network Exposure
- Webhook server binds to `0.0.0.0:9090` (accessible from network)
- **Recommendation:** Use firewall to restrict to Jenkins server IP
- Or bind to `127.0.0.1` and use SSH tunnel

---

## Deployment

### Production Setup

1. **Install Dependencies:**
   ```bash
   cd scripts/
   npm install marked docx
   ```

2. **Start Webhook Server (PM2):**
   ```bash
   npm install -g pm2
   pm2 start webhook_server.js --name jenkins-webhook
   pm2 startup
   pm2 save
   ```

3. **Configure Jenkins Webhooks:**
   - Follow `docs/WEBHOOK_SETUP.md`
   - Install "Notification Plugin"
   - Configure both trigger jobs

4. **Test:**
   ```bash
   # Simulate webhook
   curl -X POST http://localhost:9090/webhook \
     -H "Content-Type: application/json" \
     -d '{"name":"Tanzu_Report_Env_Upgrade","build":{"number":999,"status":"SUCCESS","phase":"COMPLETED"}}'
   
   # Check logs
   tail -f tmp/webhook.log
   tail -f tmp/analyzer_*.log
   ```

5. **Monitor:**
   ```bash
   pm2 status
   pm2 logs jenkins-webhook
   ```

---

## Maintenance

### Log Rotation
```bash
# Add to crontab
0 0 * * * find /path/to/tmp/ -name "*.log" -mtime +7 -delete
```

### Report Cleanup
```bash
# Keep last 30 days only
0 2 * * * find /path/to/reports/ -type d -mtime +30 -exec rm -rf {} \;
```

### Restart Webhook Server
```bash
pm2 restart jenkins-webhook
```

### View Active Analysis
```bash
ls -lh tmp/heartbeat_*.txt
cat tmp/heartbeat_*.txt
```

---

## Future Enhancements

1. **AI-Powered Failure Analysis:**
   - Use OpenClaw LLM to analyze console logs
   - Generate root cause summaries
   - Suggest fixes based on historical data

2. **Trend Analysis:**
   - Track failure rates over time
   - Identify flaky tests
   - Predict build stability

3. **Slack/Teams Integration:**
   - Support multiple notification channels
   - Customizable alert rules

4. **Web Dashboard:**
   - Real-time analysis progress
   - Historical report browser
   - Interactive failure drill-down

5. **Parallel Analysis:**
   - Analyze multiple failed jobs concurrently
   - Reduce total analysis time

---

## Glossary

- **Trigger Job:** Jenkins job that starts other jobs (e.g., `Tanzu_Report_Env_Upgrade`)
- **Downstream Job:** Test job triggered by a trigger job
- **Heartbeat:** Periodic status update written to a file
- **Cost Optimization:** Checking if work is already done before repeating it
- **DOCX:** Microsoft Word document format
- **Feishu:** Collaboration platform (similar to Slack)

---

**Author:** Atlas Daily (QA Monitoring Agent)  
**Version:** 1.0  
**Date:** 2026-02-23  
**Last Updated:** 2026-02-23
