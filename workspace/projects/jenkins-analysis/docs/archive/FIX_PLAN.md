# Fix Plan: DOCX Clickable Links + SQLite History Tracking

**Author:** Atlas Daily (QA Monitoring Agent)  
**Date:** 2026-02-24  
**Status:** ✅ Final — Ready for Implementation  
**Scope:** `md_to_docx.js`, `report_generator.js`, `analyzer.sh`, new `db_writer.js`

---

## Overview

Two independent improvements:

1. **Fix #1 — Clickable Hyperlinks in DOCX** (`md_to_docx.js`)  
2. **Fix #2 — SQLite Persistence Layer** (new `db_writer.js` + integration into existing scripts)

---

## Fix #1 — Clickable Hyperlinks in DOCX

### Bug

`md_to_docx.js` lines 88–100: detects `[text](url)` but passes the raw markdown string as `TextRun.text` with no `ExternalHyperlink` — result is unclickable full-URL text bloating the cell.

### Fix in `scripts/md_to_docx.js`

**1. Add `ExternalHyperlink` to imports:**
```js
const {
  Document, Packer, Paragraph, TextRun,
  Table, TableCell, TableRow,
  HeadingLevel, AlignmentType, WidthType,
  BorderStyle, ShadingType, convertInchesToTwip,
  ExternalHyperlink,   // ← ADD
} = require('docx');
```

**2. Add pure parse helper (top of file):**
```js
// Parse "[display](url)" → { text, url, isLink }
const parseMarkdownLink = (raw) => {
  const m = raw.match(/\[(.+?)\]\((.+?)\)/);
  return m ? { text: m[1], url: m[2], isLink: true }
           : { text: raw, url: null, isLink: false };
};
```

**3. Replace `TextRun` with `ExternalHyperlink` in `createTable` cell map:**
```js
const { text, url, isLink } = parseMarkdownLink(cell.text);
const inline = isLink
  ? new ExternalHyperlink({
      link: url,
      children: [new TextRun({ text, style: 'Hyperlink' })],
    })
  : new TextRun({ text });
```

**4. Apply same logic to `processTokens` paragraph tokens** for inline body links.

---

## Fix #2 — SQLite Persistence Layer

### Key Clarifications

| Topic | Decision |
|---|---|
| Snapshot host | Only `http://10.23.33.4:3000` (Spectre). Jenkins Allure URLs are ignored. |
| Multiple snapshots | One test case step can fail in **run_1, run_2…** — each run has its own Spectre URL. Store them all. |
| Step granularity | Two levels: **tc** (`TC78888`) and **step** (`TC78888_01`). Both have separate columns. |
| Spectre verification | Use the JSON API: `GET /projects/{proj}/suites/{suite}/runs/{run_id}.json` — read `pass`, `diff`, `diff_threshold` for the matching `#test_XXXXXX` id. |
| False alarm | The test failure IS real in Spectre (image differs). False alarm means after examining the diff + diff %, it is NOT a product regression (e.g., stale baseline, minor cosmetic pixel noise above threshold). Still shown in report, annotated `⚠️ FA`. |
| Fingerprint | `sha256(tc_id + "\|" + step_id + "\|" + step_name + "\|" + failure_type)` |
| Rolling window | Max 5 `job_run` records per `job_name`. Oldest auto-deleted by cascade. |
| DB path | `data/jenkins_history.db` (relative to project root, gitignored) |

---

### Spectre API — Confirmed Working

**Endpoint:**
```
GET http://10.23.33.4:3000/projects/{project}/suites/{suite}/runs/{run_id}.json
```

**Real API Response (run #2571):**
```json
{
  "id": 3900860,
  "sequential_id": 2571,
  "tests": [
    {
      "id": 6055635,
      "name": "TC78888_01 - Custom info window - Only show all 7 icons",
      "pass": false,
      "diff": 2.07,
      "diff_threshold": 0.1,
      "fuzz_level": "30%",
      "screenshot_uid":          "2026/02/18/..._test.png",
      "screenshot_baseline_uid": "2026/02/18/..._baseline.png",
      "screenshot_diff_uid":     "2026/02/18/..._diff.png"
    }
  ]
}
```

**Spectre URL → API extraction logic:**
```
URL:  http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571#test_6055635
                                        ↓ parse ↓
project  = "wdio_ci"
suite    = "custom-app-show-toolbar"
run_id   = 2571
test_id  = 6055635   ← from "#test_6055635" fragment
```

API call: `GET http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571.json`  
Then find the test in `response.tests[]` where `id === 6055635`.

---

### False Alarm Detection Logic

Once Spectre JSON is fetched for a test instance:

```
pass = false AND diff > diff_threshold   → Confirmed real failure
pass = false AND diff ≤ diff_threshold   → Spectre bug / threshold misconfigured (mark suspicious)
pass = true                              → False alarm (baseline already updated / fluke)
diff < 1.0 (even if pass=false)          → Likely cosmetic / baseline drift → false_alarm = true
diff ≥ 1.0 AND pass = false              → Real visual regression
HTTP error / timeout                     → Unverifiable
```

**False Alarm Reason** stored examples:
- `"diff=2.07% exceeds threshold 0.1% — confirmed visual regression"`
- `"diff=0.2% below 1% margin — likely cosmetic noise"`
- `"Spectre pass=true — baseline already updated or test fluke"`
- `"HTTP 404 — Spectre run expired or URL broken"`

---

### Parsing Console Log — Data Extraction

WDIO console log block structure:
```
[TC78888] Library as home - Show Toolbar - Disable Favorites:
    ✗ run_1
      - Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" doesn't match the baseline.
        Visit http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2571#test_6055635 for details.
    ✗ run_2
      - Failed:Screenshot "TC78888_01 - Custom info window - Only show all 7 icons" doesn't match the baseline.
        Visit http://10.23.33.4:3000/projects/wdio_ci/suites/custom-app-show-toolbar/runs/2572#test_6055727 for details.
```

**Extraction yields:**

| Field | Value | Source |
|---|---|---|
| `tc_id` | `TC78888` | `[TC78888]` header |
| `tc_name` | `Library as home - Show Toolbar - Disable Favorites` | rest of header line |
| `step_id` | `TC78888_01` | first part of screenshot name (`"TC78888_01 - ..."`) |
| `step_name` | `Custom info window - Only show all 7 icons` | rest of screenshot name |
| `failure_type` | `screenshot_mismatch` | "doesn't match the baseline" |
| `run_label` | `run_1`, `run_2` | ✗ run_N marker |
| `snapshot_url` | `http://10.23.33.4:3000/.../runs/2571#test_6055635` | Visit ... line |

**Regex patterns:**

```js
// TC header: "[TC78888] Library as home - Show Toolbar - Disable Favorites:"
const TC_HEADER_RE = /^\[?(TC\d+)\]?\s+(.+?)\s*:/m;

// Run block start: "✗ run_1" or "✗ run_2"
const RUN_BLOCK_RE = /✗\s+(run_\d+)/g;

// Screenshot failure with step_id and step_name
const SCREENSHOT_RE = /Screenshot\s+"(TC\d+_\d+)\s+-\s+(.+?)"\s+doesn't match/;

// Spectre URL in "Visit ... for details"
const SPECTRE_URL_RE = /Visit\s+(http:\/\/10\.23\.33\.4:3000\/\S+)\s+for details/;

// Assertion failure fallback (non-screenshot)
const ASSERTION_RE = /expected\s+(.+?)\s+to\s+(?:equal|be|contain)\s+(.+)/i;
```

**Failure type classification:**
- `"doesn't match the baseline"` → `screenshot_mismatch`
- `"expected X to equal Y"` / `"expected X to be Y"` → `assertion_failure`
- Other → `unknown`

---

### DB Schema (Revised — 3 Tables)

```sql
-- Table 1: One row per trigger job build (the parent job, e.g. Tanzu_Report_Env_Upgrade_663)
CREATE TABLE IF NOT EXISTS job_runs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  job_name      TEXT    NOT NULL,
  job_build     INTEGER NOT NULL,
  job_link      TEXT    NOT NULL,                     -- Jenkins URL to this build
  recorded_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  pass_count    INTEGER DEFAULT 0,
  fail_count    INTEGER DEFAULT 0,
  UNIQUE(job_name, job_build)
);

-- Table 2: One row per FAILED downstream test job within a run
CREATE TABLE IF NOT EXISTS failed_jobs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id        INTEGER NOT NULL REFERENCES job_runs(id) ON DELETE CASCADE,
  job_name      TEXT    NOT NULL,   -- e.g. "LibraryWeb_CustomApp_Pipeline"
  job_build     INTEGER NOT NULL,   -- e.g. 2201
  job_link      TEXT    NOT NULL    -- Jenkins URL to this specific failed job build
);

-- Table 3: One row per failed step (tc_id + step_id + run_label combination)
CREATE TABLE IF NOT EXISTS failed_steps (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  failed_job_id       INTEGER NOT NULL REFERENCES failed_jobs(id) ON DELETE CASCADE,
  tc_id               TEXT    NOT NULL,   -- "TC78888"
  tc_name             TEXT    NOT NULL,   -- "Library as home - Show Toolbar - Disable Favorites"
  step_id             TEXT    NOT NULL,   -- "TC78888_01"
  step_name           TEXT    NOT NULL,   -- "Custom info window - Only show all 7 icons"
  run_label           TEXT,               -- "run_1", "run_2"
  failure_type        TEXT,               -- "screenshot_mismatch" | "assertion_failure" | "unknown"
  failure_msg         TEXT,               -- Raw failure message
  error_fingerprint   TEXT,               -- sha256(tc_id|step_id|step_name|failure_type)
  -- Spectre snapshot data
  snapshot_url        TEXT,               -- Full Spectre URL http://10.23.33.4:3000/...#test_XXXX
  spectre_test_id     INTEGER,            -- Numeric ID from #test_XXXX fragment
  spectre_diff_pct    REAL,               -- e.g. 2.07 (percent pixel diff)
  spectre_threshold   REAL,               -- e.g. 0.1
  spectre_pass        INTEGER,            -- 0=fail, 1=pass per Spectre
  -- Verification result
  snapshot_verified   INTEGER DEFAULT 0,  -- 0=unverified, 1=confirmed_failed, 2=false_alarm
  false_alarm         INTEGER DEFAULT 0,  -- 1 if not a real production regression
  snapshot_reason     TEXT,               -- Human-readable reason
  -- Recurrence tracking
  last_failed_build   INTEGER,            -- job_build# where same fingerprint last appeared
  is_recurring        INTEGER DEFAULT 0   -- 1 if same fingerprint found in prev ≤5 builds
);
```

**Rolling window:** After each insert into `job_runs`, if count for that `job_name` > 5, delete the oldest (cascade deletes `failed_jobs` → `failed_steps`).

---

### New File: `scripts/db_writer.js`

**CLI entry point called from `analyzer.sh`:**
```bash
node db_writer.js <trigger_job_name> <trigger_build_number> <trigger_job_link> \
    <failed_jobs.json> <passed_jobs.json> <report_dir>
```

**Module breakdown (functional, each fn ≤ 20 lines):**

```
db_writer.js
  ├── openDb(dbPath)
  │     → opens or creates SQLite DB, runs initSchema
  │
  ├── initSchema(db)
  │     → CREATE TABLE IF NOT EXISTS for all 3 tables
  │
  ├── insertJobRun(db, {jobName, jobBuild, jobLink, passCount, failCount})
  │     → INSERT OR REPLACE into job_runs, returns runId
  │
  ├── enforceFiveRecordLimit(db, jobName)
  │     → DELETE oldest job_runs beyond 5 for this jobName (cascade handles children)
  │
  ├── insertFailedJob(db, runId, {jobName, jobBuild, jobLink})
  │     → INSERT into failed_jobs, returns failedJobId
  │
  ├── parseConsoleLog(consoleText)
  │     → returns [{ tcId, tcName, stepId, stepName, runLabel,
  │                  failureType, failureMsg, snapshotUrl }]
  │     → handles multiple run_N blocks per TC
  │     → handles multiple TCs per console log
  │
  ├── buildFingerprint(tcId, stepId, stepName, failureType)
  │     → sha256(tcId + "|" + stepId + "|" + stepName + "|" + failureType)
  │
  ├── parseSpectreUrl(snapshotUrl)
  │     → extracts { project, suite, runId, testId } from URL
  │
  ├── fetchSpectreData(baseUrl, project, suite, runId, testId)
  │     → GET /projects/{project}/suites/{suite}/runs/{runId}.json
  │     → finds test by id, returns { pass, diff, threshold, ... }
  │
  ├── classifySpectreResult({pass, diff, threshold})
  │     → returns { verified: 0|1|2, falseAlarm: bool, reason: string }
  │     → verified 0=unverifiable, 1=confirmed_failed, 2=false_alarm
  │     → false_alarm = true if diff < 1.0 OR spectre pass=true
  │
  ├── findLastFailedBuild(db, jobName, fingerprint, currentBuild)
  │     → queries previous ≤5 builds for same fingerprint
  │     → returns { lastFailedBuild: number|null, isRecurring: bool }
  │
  ├── insertFailedStep(db, failedJobId, stepData)
  │     → INSERT into failed_steps with all fields
  │
  └── main()
        → orchestrates: open db → insert run → per failed job:
          load console log → parse steps → per step:
            fingerprint → lookback → fetch spectre → classify → insert
```

---

### Changes to Existing Files

#### `scripts/analyzer.sh` — Add Step 6b (after AI analysis, before report)

```bash
# Step 6b: Persist results to SQLite history DB
update_heartbeat "Writing to history DB..."
log "Writing results to SQLite history DB..."

node "$SCRIPT_DIR/db_writer.js" \
    "$JOB_NAME" \
    "$BUILD_NUMBER" \
    "${JENKINS_URL}job/$JOB_NAME/$BUILD_NUMBER/" \
    "$TMP_DIR/${REPORT_FOLDER}_failed_jobs.json" \
    "$TMP_DIR/${REPORT_FOLDER}_passed_jobs.json" \
    "$REPORT_DIR" \
    > "$LOGS_DIR/db_write_${REPORT_FOLDER}.log" 2>&1 || \
    log "⚠ DB write failed (non-blocking, continuing...)"
```

> DB write is **non-blocking** — a DB failure does not stop report generation.

#### `scripts/report_generator.js` — History from DB

Replace `_history.json` file reads with DB queries. Add to the failure summary table:

| Column before | Column after |
|---|---|
| `Job` | `Job` (clickable hyperlink via ExternalHyperlink) |
| `Failed Steps` | `TC ID` + `Step ID` (separate columns) |
| `Category` | `Category` |
| `Root Cause` | `Root Cause` |
| `Last Failed` | `Last Failed Build` (from DB `last_failed_build`) |
| `Snapshot` | `Snapshot` (clickable Spectre URL, `⚠️ FA` badge if false_alarm) |
| `Suggestion` | `Suggestion` |

**New query for last-failed lookback:**
```js
const getStepHistory = (db, jobName, fingerprint, currentBuild) =>
  db.prepare(`
    SELECT fs.last_failed_build, fs.is_recurring, fs.false_alarm,
           fs.spectre_diff_pct, fs.snapshot_reason, jr.job_build
    FROM failed_steps fs
    JOIN failed_jobs fj ON fs.failed_job_id = fj.id
    JOIN job_runs jr ON fj.run_id = jr.id
    WHERE fj.job_name = ? AND fs.error_fingerprint = ? AND jr.job_build < ?
    ORDER BY jr.job_build DESC
    LIMIT 5
  `).all(jobName, fingerprint, currentBuild);
```

#### `scripts/package.json` — Add dependency

```json
"dependencies": {
  "marked": "^11.1.1",
  "docx": "^8.5.0",
  "better-sqlite3": "^9.4.3"
}
```

#### `.gitignore` — Add data dir

```
data/
```

---

## Implementation Order

| # | Task | File | Key Details |
|---|------|------|-------------|
| 1 | Fix DOCX hyperlinks | `md_to_docx.js` | `ExternalHyperlink`, `parseMarkdownLink` |
| 2 | Add `better-sqlite3` | `package.json` + `npm install` | |
| 3 | Create `db_writer.js` | new `scripts/db_writer.js` | All parsing + Spectre API + DB writes |
| 4 | Wire into `analyzer.sh` | `analyzer.sh` | Step 6b, non-blocking |
| 5 | Update `report_generator.js` | `report_generator.js` | DB-backed history, false alarm badge |
| 6 | Update `.gitignore` | `.gitignore` | Add `data/` |
| 7 | Update `DESIGN.md` (Single Source of Truth) | `docs/DESIGN.md` | Merge all new architecture + SQLite/Spectre details into `DESIGN.md`. Ensure it is the sole source of truth. |
| 8 | Update `README.md` | `../README.md` | Update usage instructions, requirements, setup. |
| 9 | Generate Single Tests | `../tests/*.test.js` | Create isolated, individual tests for each new functionality (e.g. `db_writer.test.js`, `md_to_docx.test.js`) so they can be run one by one. |
| 10 | Create Test Manual | `docs/TEST_MANUAL.md` | Provide separate documented manual explaining how to execute and verify these specific standalone tests. |

---

## Files Summary

```text
scripts/
  ├── md_to_docx.js          ← MODIFY  (Fix #1: ExternalHyperlink)
  ├── db_writer.js           ← CREATE  (Fix #2: SQLite + Spectre verification)
  ├── report_generator.js    ← MODIFY  (Fix #2: DB-backed history, separate TC/Step columns)
  ├── analyzer.sh            ← MODIFY  (Fix #2: Step 6b non-blocking)
  └── package.json           ← MODIFY  (add better-sqlite3)

tests/
  ├── md_to_docx.test.js     ← CREATE  (Single test for md_to_docx.js)
  ├── db_writer.test.js      ← CREATE  (Single test for SQLite & db_writer.js)
  └── ...                    ← CREATE  (Additional standalone tests)

data/
  └── jenkins_history.db     ← AUTO-CREATED at runtime

.gitignore                   ← MODIFY  (add data/)
README.md                    ← MODIFY  (Update usage and requirements)

docs/
  ├── DESIGN.md              ← MODIFY  (Merge changes to make it the single source of truth)
  ├── TEST_MANUAL.md         ← CREATE  (Documentation for running individual tests)
  └── FIX_PLAN.md            ← THIS FILE
```

---

**Status:** ✅ All details confirmed. Implementation begins next.
