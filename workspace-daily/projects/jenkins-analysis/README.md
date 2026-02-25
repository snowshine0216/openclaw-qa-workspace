# Jenkins QA Daily Monitoring System V2

Automated monitoring for Jenkins CI jobs — parses failures, writes history to SQLite, generates Markdown + DOCX reports, and uploads to Feishu.

Covers **two separate CI systems**:
- **Web Library CI** — parses console logs from `LibraryWeb_*` jobs
- **Android Library CI** — parses ExtentReport v3 HTML from `Library_*` jobs

---

## ✅ Status

| Feature | Web CI | Android CI |
|---------|--------|------------|
| Failure extraction | ✅ Console log parser | ✅ ExtentReport v3 HTML (cheerio) |
| TC ID / Step ID | ✅ | ✅ |
| Config URL | — | ✅ |
| SQLite history | ✅ | ✅ |
| Recurring detection | ✅ | ✅ |
| Re-run annotation | — | ✅ |
| DOCX report | ✅ | ✅ |
| Feishu upload | ✅ | ✅ |

---

## 🚀 First-Time Setup

```bash
cd scripts/
npm install           # installs cheerio, docx, marked, sql.js

# Web CI DB is auto-created on first run.
# Android CI needs a one-time migration:
node database/migrate_android.js
```

---

## 📖 Usage

### ① Web CI — Webhook Mode (Automated, Production)

The webhook server listens for Jenkins POST notifications and runs the analyzer automatically.

```bash
# Start server (development)
cd scripts/
node webhook_server.js

# Start server (production via PM2)
npm install -g pm2
pm2 start webhook_server.js --name jenkins-webhook
pm2 startup && pm2 save
```

Jenkins must be configured to POST to `http://<server>:9090/webhook` on build completion.  
See [docs/WEBHOOK_SETUP.md](docs/WEBHOOK_SETUP.md) for Jenkins configuration.

---

### ② Web CI — Manual Trigger (Watched Jobs Only)

Simulates a Jenkins webhook call. Only works for jobs in the `WATCHED_JOBS` list  
(currently: `Tanzu_Report_Env_Upgrade`, `TanzuEnvPrepare`).

```bash
cd scripts/
bash manual_trigger.sh <job_name> <build_number>

# Examples:
bash manual_trigger.sh Tanzu_Report_Env_Upgrade 1243
bash manual_trigger.sh TanzuEnvPrepare 456
```

Flow: `manual_trigger.sh` → Webhook server (port 9090) → `analyzer.sh` → report

---

### ③ Web CI — Direct Analyzer (Any Job, No Webhook)

Bypasses the webhook server entirely. Works for **any** web CI job.

```bash
cd scripts/
bash direct_analyzer.sh <job_name> <build_number>

# Examples:
bash direct_analyzer.sh LibraryWeb_CustomApp_Pipeline 2201
bash direct_analyzer.sh Tanzu_Report_Env_Upgrade 1243
```

Flow: `direct_analyzer.sh` → `analyzer.sh` → report (no webhook involved)

---

### ④ Android CI — Full Trigger Run (Production)

Analyzes a complete `Trigger_Library_Jobs` build: discovers all downstream `Library_*` jobs,
fetches ExtentReports, classifies failures, writes DB, generates report.

```bash
# From project root
bash scripts/android_analyzer.sh <trigger_job_name> <build_number>

# Examples:
bash scripts/android_analyzer.sh Trigger_Library_Jobs 89
bash scripts/android_analyzer.sh Trigger_Library_Jobs 90 --force   # regenerate even if report exists
```

Flow: `android_analyzer.sh` → `process_android_build.js` (discovers all Library_* jobs) → ExtentReport fetch → DB write → `generate_android_report.mjs` → DOCX → Feishu

---

### ⑤ Android CI — Single Job Mode (Test / Debug)

**Skip trigger discovery** and directly analyze one specific `Library_*` job by name and build number.
Useful for debugging the parser or testing with a known failing job.

```bash
# Via shell script (recommended)
bash scripts/android_analyzer.sh \
  --single-job Library_RSD_MultiMedia \
  --single-build 330

# With --force to overwrite existing report
bash scripts/android_analyzer.sh \
  --single-job Library_RSD_MultiMedia \
  --single-build 330 \
  --force

# Or directly via Node (more verbose output)
cd scripts/
node pipeline/process_android_build.js \
  --single-job Library_RSD_MultiMedia \
  --single-build 330 \
  --output-dir ../reports/Library_RSD_MultiMedia_330

# Then generate the markdown report
node generate_android_report.mjs \
  ../reports/Library_RSD_MultiMedia_330 \
  Library_RSD_MultiMedia \
  330
```

Output files written to `reports/<job>_<build>/`:
- `passed_jobs.json` — jobs that passed
- `failed_jobs.json` — jobs that failed
- `extent_failures.json` — extracted failure details
- `<job>_<build>.md` — markdown report
- `<job>_<build>.docx` — DOCX report (if docx_converter runs)

---

### ⑥ Test Webhook Endpoint

```bash
# Ping
curl http://localhost:9090/webhook

# Simulate Jenkins webhook payload
curl -X POST http://localhost:9090/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tanzu_Report_Env_Upgrade",
    "build": {
      "number": 1243,
      "status": "SUCCESS",
      "phase": "COMPLETED"
    }
  }'
```

---

## 🗄 Database

SQLite database at `scripts/data/jenkins_history.db`.

| Table | Purpose |
|-------|---------|
| `job_runs` | One row per trigger build (pass/fail counts, platform) |
| `failed_jobs` | One row per failing downstream job |
| `failed_steps` | One row per failing test case with TC ID, step, fingerprint |

Rolling window: last **5 builds** per job are kept.  
`platform` column separates `web` and `android` rows throughout.

Android-specific columns in `failed_steps`:

| Column | Content |
|--------|---------|
| `tc_id_raw` | Raw TC ID from ExtentReport (e.g. `TC18072`) |
| `config_url` | Config URL from step details |
| `failed_step_name` | Name of the first failing step |
| `rerun_build_num` | Build number of re-run (if any) |
| `rerun_result` | `SUCCESS` / `FAILURE` of re-run |
| `retry_count` | Total attempts (1 = no re-run, 2 = one re-run) |
| `full_error_msg` | Full failure message text |

---

## 📊 Report Format

Reports are 4 sections (same structure for Web and Android):

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
  - Per-job heading (clickable link)
  - Re-run annotation if applicable
  - Per-test expandable <details> block
```

---

## 🔧 Environment Variables

Set in `workspace-daily/.env`:

| Variable | Used by | Description |
|----------|---------|-------------|
| `JENKINS_URL` | Web CI | Main Jenkins base URL |
| `JENKINS_USER` | Web CI | Jenkins username |
| `JENKINS_API_TOKEN` | Web CI | Jenkins API token |
| `ANDROID_JENKINS_URL` | Android CI | Android Jenkins base URL |
| `ANDROID_JENKINS_USER` | Android CI | Android Jenkins username |
| `ANDROID_JENKINS_TOKEN` | Android CI | Android Jenkins API token |
| `FEISHU_WEBHOOK_URL` | Both | Feishu bot webhook for report delivery |

---

## 🧪 Testing

### Run All Unit Tests

```bash
cd scripts/
npx jest tests/unit/ --forceExit
```

### Individual Test Suites

```bash
cd scripts/

# ExtentReport v3 HTML parser (13 tests)
npx jest tests/unit/extent_parser.test.js --forceExit

# Android DB write/read path (13 tests)
npx jest tests/unit/android_db.test.js --forceExit

# Job discovery — nested causes fix (12 tests)
npx jest tests/unit/job_discovery_bug3.test.js --forceExit

# All other unit tests
npx jest tests/unit/ --forceExit
```

### Integration Test (Live Jenkins)

```bash
cd scripts/

# Single-job integration test — uses real Jenkins API
bash ../tests/test_android_analyzer.sh Library_RSD_MultiMedia 330
```

---

## 📁 Project Layout

```
jenkins-analysis/
├── scripts/
│   ├── android/
│   │   ├── extent_parser.js      # Extent v3 HTML parser (cheerio-based)
│   │   ├── failure_classifier.js # Categorises screenshot vs script failures
│   │   └── job_discovery.js      # Finds Library_* jobs downstream of trigger
│   ├── database/
│   │   ├── adapter.js            # sql.js wrapper (better-sqlite3 API)
│   │   ├── schema.js             # CREATE TABLE definitions
│   │   ├── operations.js         # insert/query helpers
│   │   ├── migrate.js            # Web CI migration
│   │   └── migrate_android.js    # Android CI migration (idempotent)
│   ├── pipeline/
│   │   ├── process_android_build.js  # Android orchestrator (trigger + single-job modes)
│   │   └── process_build.js          # Web CI orchestrator
│   ├── reporting/
│   │   ├── generator.js          # Web CI markdown report
│   │   └── docx_converter.js     # Markdown → DOCX
│   ├── tests/
│   │   └── unit/
│   │       ├── extent_parser.test.js
│   │       ├── android_db.test.js
│   │       └── job_discovery_bug3.test.js
│   ├── generate_android_report.mjs  # Android markdown report generator
│   ├── android_analyzer.sh          # Android CI entry point
│   ├── direct_analyzer.sh           # Web CI direct entry point
│   ├── manual_trigger.sh            # Send webhook to local server
│   └── webhook_server.js            # Webhook listener
├── reports/                         # Generated reports (per build)
├── logs/                            # Analyzer run logs
└── docs/
    ├── ANDROID_DESIGN.md
    └── WEBHOOK_SETUP.md
```

---

## 🚑 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `table failed_steps has no column named full_error_msg` | Run `node scripts/database/migrate_android.js` |
| `Cannot find module 'cheerio'` | Run `cd scripts && npm install` |
| `Missing credentials` | Set `ANDROID_JENKINS_USER` + `ANDROID_JENKINS_TOKEN` in `.env` |
| ExtentReport returns 0 tests | Check `/job/<name>/<build>/ExtentReport/` URL is reachable; report may use a different filename |
| Job discovery finds 0 jobs | Trigger build causes are nested inside `actions[]` — check `job_discovery.js` |
| DOCX has plain URLs not links | Ensure `docx_converter.js` is the v2 version with `createHyperlink` support |

---

## 🔄 Auto-Restart (PM2)

```bash
# Enable PM2 startup on boot
pm2 startup
pm2 save

# Check running processes
pm2 list
pm2 logs jenkins-webhook --lines 50
```

See [docs/AUTO_START.md](docs/AUTO_START.md) for detailed PM2 setup.
