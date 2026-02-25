# Android Jenkins CI Analysis

Automated analysis for Android Library CI jobs on Jenkins. Discovers all downstream
`Library_*` jobs from a `Trigger_Library_Jobs` build, fetches ExtentReport v3 HTML,
classifies failures, persists history to SQLite, and generates Markdown + DOCX reports
uploaded to Feishu.

---

## ✅ Feature Status

| Feature | Status |
|---------|--------|
| Failure extraction (ExtentReport v3 HTML) | ✅ |
| TC ID / Step ID | ✅ |
| Config URL | ✅ |
| Screenshot vs script failure classification | ✅ |
| SQLite history (last 5 builds) | ✅ |
| Recurring failure detection | ✅ |
| Re-run annotation | ✅ |
| DOCX report | ✅ |
| Feishu upload | ✅ |
| Webhook server (port 9091) | ✅ |

---

## 🚀 First-Time Setup

### 1. Install dependencies

```bash
cd scripts/
npm install        # installs cheerio, sql.js, yargs
```

### 2. Set environment variables

Create or update `workspace-daily/.env`:

```bash
ANDROID_JENKINS_URL=http://<your-jenkins-host>:8080
ANDROID_JENKINS_USER=<username>
ANDROID_JENKINS_TOKEN=<api-token>
FEISHU_WEBHOOK_URL=<feishu-bot-webhook-url>
```

### 3. Initialize the database

```bash
cd scripts/
node database/migrate_android.js
```

This is **idempotent** — safe to run again if the schema changes.

---

### 4. Initialize the OpenAI API key (for screenshot analysis)

The screenshot analyzer uses an LLM to classify failures (e.g. ignorable drift vs real issue).
Add to `workspace-daily/.env`:

```bash
OPENAI_API_KEY=<your-openai-api-key>
# Optional: use a proxy or relay endpoint
# OPENAI_BASE_URL=https://your-proxy/v1
```

If `OPENAI_API_KEY` is not set, the analyzer falls back to heuristic-only mode and logs a warning.
See [`docs/SCREENSHOT_ANALYSIS_DESIGN.md`](docs/SCREENSHOT_ANALYSIS_DESIGN.md) for details.

---

## 📖 Usage

### ① Automated — Webhook Server (Production)

The webhook server listens on port **9091** for Jenkins POST notifications and
automatically triggers `android_analyzer.sh` when a watched job completes.

```bash
# Start (development)
cd scripts/
node server/index.js

# Start (production via PM2)
npm install -g pm2
pm2 start server/index.js --name android-webhook
pm2 startup && pm2 save
```

Configure Jenkins to POST to `http://<server>:9091/webhook` on build completion
for jobs in `ANDROID_WATCHED_JOBS` (currently: `Trigger_Library_Jobs`).

#### Testing Webhook via cURL

You can test the webhook server manually by sending a simulated Jenkins build payload:

```bash
curl -X POST http://localhost:9091/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trigger_Library_Jobs",
    "build": {
      "number": 89,
      "status": "SUCCESS",
      "phase": "COMPLETED"
    }
  }'
```

*(Note: The job name in the payload must match an entry in `ANDROID_WATCHED_JOBS` in `scripts/server/config.js` for the analysis script to be triggered).*

---

### ② Full Trigger Run (Production)

Analyzes a complete `Trigger_Library_Jobs` build — discovers all downstream
`Library_*` jobs, fetches ExtentReports, classifies failures, writes DB, generates report.

```bash
# From project root
bash scripts/android_analyzer.sh <trigger_job_name> <build_number>

# Examples:
bash scripts/android_analyzer.sh Trigger_Library_Jobs 89
bash scripts/android_analyzer.sh Trigger_Library_Jobs 90 --force   # regenerate even if report exists
```

**Flow:**  
`android_analyzer.sh` → `pipeline/process_android_build.js` (discovers Library_* jobs)
→ ExtentReport fetch → DB write → `generate_android_report.mjs` → DOCX → Feishu

---

### ③ Single Job Mode (Test / Debug)

Analyze one specific `Library_*` job directly — skips trigger discovery.
Useful for debugging the parser or testing with a known failing build.

```bash
# Via shell script (recommended)
bash scripts/android_analyzer.sh \
  --single-job Library_RSD_MultiMedia \
  --single-build 330

# Force regenerate existing report
bash scripts/android_analyzer.sh \
  --single-job Library_RSD_MultiMedia \
  --single-build 330 \
  --force

# Via Node directly (verbose output)
cd scripts/
node pipeline/process_android_build.js \
  --single-job Library_RSD_MultiMedia \
  --single-build 330 \
  --output-dir ../reports/Library_RSD_MultiMedia_330

# Then generate the markdown/DOCX report
node generate_android_report.mjs \
  ../reports/Library_RSD_MultiMedia_330 \
  Library_RSD_MultiMedia \
  330
```

Output files written to `reports/<job>_<build>/`:

| File | Contents |
|------|----------|
| `passed_jobs.json` | Jobs that passed |
| `failed_jobs.json` | Jobs that failed |
| `extent_failures.json` | Extracted failure details |
| `<job>_<build>.md` | Markdown report |
| `<job>_<build>.docx` | DOCX report (sent to Feishu) |

---

## 🗄 Database

SQLite database at `data/jenkins_history.db` (gitignored).

| Table | Purpose |
|-------|---------|
| `job_runs` | One row per trigger build (pass/fail counts) |
| `failed_jobs` | One row per failing downstream `Library_*` job |
| `failed_steps` | One row per failing test case |

Rolling window: last **5 builds** per job are kept automatically.

Android-specific columns in `failed_steps`:

| Column | Content |
|--------|---------|
| `platform` | Always `android` |
| `tc_id_raw` | Raw TC ID from ExtentReport (e.g. `TC18072`) |
| `config_url` | Config URL from step details |
| `failed_step_name` | Name of the first failing step |
| `rerun_build_num` | Build number of re-run (if any) |
| `rerun_result` | `SUCCESS` / `FAILURE` of re-run |
| `retry_count` | Total attempts (1 = no re-run, 2 = one re-run) |
| `full_error_msg` | Full failure message text |

---

## 📊 Report Format

```
# [Android] Library CI Report — Trigger_Library_Jobs #89

## 📊 Executive Summary
  - Pass/Fail table
  - Failure Breakdown by Type
  - Failure Breakdown by Error Pattern

## ⚠️ Failure Summary Table
  - One row per failing test: TC ID | Test Name | Type | Failed Step | Last Failed | Recurring

## ✅ Passed Jobs

## 📋 Detailed Failure Analysis
  - Per-job heading (clickable Jenkins link)
  - Re-run annotation if applicable
  - Per-test expandable <details> block
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANDROID_JENKINS_URL` | ✅ | Android Jenkins base URL |
| `ANDROID_JENKINS_USER` | ✅ | Jenkins username |
| `ANDROID_JENKINS_TOKEN` | ✅ | Jenkins API token |
| `FEISHU_WEBHOOK_URL` | ✅ | Feishu bot webhook for report delivery |
| `OPENAI_API_KEY` | optional | API key for LLM screenshot analysis; if unset, heuristic-only mode is used |
| `OPENAI_BASE_URL` | optional | Override for OpenAI-compatible proxy (default: `https://api.openai.com/v1`) |
| `ANDROID_WEBHOOK_PORT` | optional | Webhook server port (default: `9091`) |

---

## 🧪 Testing

### Run all unit tests

```bash
cd scripts/
npx jest tests/unit/ --forceExit
```

### Individual suites

```bash
cd scripts/

# ExtentReport v3 HTML parser (13 tests)
npx jest tests/unit/extent_parser.test.js --forceExit

# Android DB write/read path (13 tests)
npx jest tests/unit/android_db.test.js --forceExit

# Job discovery — nested causes fix (12 tests)
npx jest tests/unit/job_discovery_bug3.test.js --forceExit

# Screenshot analyzer
npx jest tests/unit/screenshot_analyzer.test.js --forceExit
```

### Integration test (live Jenkins)

```bash
# Requires ANDROID_JENKINS_* env vars to be set
bash tests/test_android_analyzer.sh Library_RSD_MultiMedia 330
```

---

## 📁 Project Layout

```
android-jenkins-analysis/
├── scripts/
│   ├── android/
│   │   ├── extent_parser.js        # ExtentReport v3 HTML parser (cheerio)
│   │   ├── failure_classifier.js   # Screenshot vs script failure categorisation
│   │   ├── job_discovery.js        # Finds Library_* jobs downstream of trigger
│   │   └── screenshot_analyzer.js  # Screenshot diff analysis
│   ├── database/
│   │   ├── adapter.js              # sql.js wrapper (better-sqlite3-compatible API)
│   │   ├── schema.js               # CREATE TABLE definitions (android schema)
│   │   ├── operations.js           # insert/query helpers incl. insertAndroidFailedStep
│   │   └── migrate_android.js      # Idempotent migration (run once on first setup)
│   ├── pipeline/
│   │   └── process_android_build.js  # Orchestrator: trigger + single-job modes
│   ├── server/
│   │   ├── config.js               # Port 9091, watched jobs, log paths
│   │   └── index.js                # Webhook server (imports base config from jenkins-analysis)
│   ├── tests/
│   │   └── unit/
│   │       ├── extent_parser.test.js
│   │       ├── android_db.test.js
│   │       ├── job_discovery_bug3.test.js
│   │       └── screenshot_analyzer.test.js
│   ├── android_analyzer.sh         # Main entry point (trigger + single-job modes)
│   ├── generate_android_report.mjs # Markdown + DOCX report generator
│   └── package.json
├── tests/
│   └── test_android_analyzer.sh    # Integration test script
├── data/                           # SQLite DB (gitignored)
├── logs/                           # Analyzer run logs (gitignored)
├── reports/                        # Generated reports (gitignored)
├── tmp/                            # Intermediate files (gitignored)
└── docs/
    ├── ANDROID_DESIGN.md           # Architecture & data flow
    └── SCREENSHOT_ANALYSIS_DESIGN.md
```

---

## 🚑 Troubleshooting

### Webhook Issues

**Symptom:** `curl: (7) Failed to connect to localhost port 9091 after XX ms: Connection refused`

**Diagnosis:**
```bash
# Check if webhook server is running
pm2 list | grep android-webhook

# Check server logs
pm2 logs android-webhook --lines 50

# Check if port 9091 is listening
lsof -i :9091
```

**Fix:**
```bash
# Restart webhook server
pm2 restart android-webhook

# If still failing, check the ecosystem config
cat projects/jenkins-analysis/ecosystem.config.js
# Ensure ANDROID_WEBHOOK_PORT=9091 is set

# Delete and restart from ecosystem file
cd projects/jenkins-analysis
pm2 delete android-webhook
pm2 start ecosystem.config.js
pm2 save
```

---

### Feishu Upload Issues

**Symptom:** `⚠ FEISHU_WEBHOOK_URL not set, skipping Feishu upload`

**Root Cause:** Incorrect conditional check in `android_analyzer.sh`

**Fix:**
```bash
# The android_analyzer.sh should reference the shared feishu_uploader.sh
# from jenkins-analysis (not copy it)

# Verify the reference path is correct:
grep -A2 "FEISHU_UPLOADER=" projects/android-jenkins-analysis/scripts/android_analyzer.sh

# Expected output:
# FEISHU_UPLOADER="$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh"
# bash "$FEISHU_UPLOADER" "$REPORT_DOCX"
```

**Key Point:** Do NOT copy `feishu_uploader.sh` to android-jenkins-analysis. Instead, reference the shared script from jenkins-analysis to avoid duplication and maintain consistency.

**Verification:**
```bash
# Trigger a test webhook
curl -X POST http://localhost:9091/webhook \
  -H "Content-Type: application/json" \
  -d '{"name":"Trigger_Library_Jobs","build":{"number":89,"status":"SUCCESS","phase":"COMPLETED"}}'

# Check logs for upload confirmation
tail -50 projects/android-jenkins-analysis/logs/android_analyzer_Trigger_Library_Jobs_89.log | grep "Feishu"

# Expected output:
# ✓ Report delivered to Feishu chat: oc_f15b73b877ad243886efaa1e99018807
```

---

### Analysis Not Running

**Symptom:** Webhook received but analyzer doesn't start

**Diagnosis:**
```bash
# Check webhook logs
tail -50 projects/android-jenkins-analysis/logs/android_webhook.log

# Check if analyzer was spawned
ps aux | grep android_analyzer.sh

# Check analyzer logs
ls -lht projects/android-jenkins-analysis/logs/android_analyzer_*.log | head -5
```

**Common Issues:**
1. **Wrong working directory**: Android webhook should run from `android-jenkins-analysis` folder
2. **Missing scripts**: Ensure `android_analyzer.sh` exists and is executable
3. **PM2 env vars**: Check `pm2 env android-webhook` for ANDROID_WEBHOOK_PORT

---

### Report Already Exists (Cached)

**Symptom:** `✓ Re-using existing Android report` but you want fresh analysis

**Fix:**
```bash
# Force regeneration by deleting existing report
rm -rf projects/android-jenkins-analysis/reports/Trigger_Library_Jobs_89/

# Or use --force flag
bash projects/android-jenkins-analysis/scripts/android_analyzer.sh \
  --force Trigger_Library_Jobs 89
```

---

### Database/Parser/Report Generation Issues

| Symptom | Fix |
|---------|-----|
| `table failed_steps has no column named full_error_msg` | Run `node scripts/database/migrate_android.js` |
| `Cannot find module 'cheerio'` | Run `cd scripts && npm install` |
| `Missing credentials` | Set `ANDROID_JENKINS_USER` + `ANDROID_JENKINS_TOKEN` in `.env` |
| ExtentReport fetch returns 0 tests | Verify `/job/<name>/<build>/ExtentReport/` URL is reachable |
| Job discovery finds 0 jobs | Trigger build causes are nested in `actions[]` — see `android/job_discovery.js` |
| DOCX has plain URLs instead of links | Check `docx_converter.js` has `createHyperlink` support |

---

### Configuration Comparison

**Why does Web Jenkins not need FEISHU_WEBHOOK_URL but Android does?**

**Answer:** It's a **bug in the initial Android implementation**. Both should work the same way:

- **Web jenkins** (`analyzer.sh`): Calls `feishu_uploader.sh` unconditionally ✅
- **Android** (`android_analyzer.sh`): ~~Checked for FEISHU_WEBHOOK_URL before calling~~ **FIXED** ✅

**Both now use the same approach:** 
- Single `feishu_uploader.sh` in `jenkins-analysis/scripts/`
- Android references it via relative path: `$(dirname "$PROJECT_DIR")/jenkins-analysis/scripts/feishu_uploader.sh`
- Script has hardcoded Feishu app credentials (APP_ID + APP_SECRET) and chat ID
- No environment variable needed ✅
- No duplication ✅

---

### PM2 Ecosystem Config

**Correct configuration** (`projects/jenkins-analysis/ecosystem.config.js`):

```javascript
module.exports = {
  apps: [
    {
      name: 'jenkins-webhook',
      script: './scripts/server/index.js',
      cwd: '/path/to/projects/jenkins-analysis',
      env: { WEBHOOK_PORT: 9090 },  // Web Jenkins port
      watch: ['scripts/server'],
      autorestart: true
    },
    {
      name: 'android-webhook',
      script: './scripts/server/index.js',
      cwd: '/path/to/projects/android-jenkins-analysis',  // Different folder!
      env: { ANDROID_WEBHOOK_PORT: 9091 },  // Android Jenkins port
      watch: ['scripts/server'],
      autorestart: true
    }
  ]
};
```

**Key points:**
- Each webhook runs from its own project folder (`cwd`)
- Different port env vars: `WEBHOOK_PORT` (9090) vs `ANDROID_WEBHOOK_PORT` (9091)
- Separate log files automatically created by each script

---

## 🔄 Auto-Restart (PM2)

```bash
pm2 start scripts/server/index.js --name android-webhook
pm2 startup && pm2 save

# Check status
pm2 list
pm2 logs android-webhook --lines 50
```

---

## 📚 Further Reading

- [`docs/ANDROID_DESIGN.md`](docs/ANDROID_DESIGN.md) — full architecture, ExtentReport parsing, re-run detection, DB schema
- [`docs/SCREENSHOT_ANALYSIS_DESIGN.md`](docs/SCREENSHOT_ANALYSIS_DESIGN.md) — screenshot diff analysis design
