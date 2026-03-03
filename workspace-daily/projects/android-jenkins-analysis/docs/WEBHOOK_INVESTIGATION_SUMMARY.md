# Android Webhook Investigation - Executive Summary

**Date:** 2026-03-03  
**Issue:** First-time fail marking issue after webhook trigger  

---

## 📋 Quick Findings

### 1. **Where Results Are Saved**

Android CI automation results are saved to:

- **Database:** `scripts/data/jenkins_history.db` (SQLite)
- **Reports:** `reports/<Trigger_Job>_<Build_Num>/`
  - Markdown: `<job>_<build>.md`
  - DOCX: `<job>_<build>.docx`
  - JSON exports: `passed_jobs.json`, `failed_jobs.json`, `extent_failures.json`
- **Logs:** `logs/android_analyzer_<job>_<build>.log`

### 2. **Why All Build #1 Failures Are "First Time Fail"**

**TL;DR:** Build #1 is likely a **test build** with a fake/synthetic build number. The system works correctly for real Jenkins builds.

**Detailed explanation:**

When you triggered:

```bash
curl -X POST http://10.197.34.82:9091/webhook \
  -d '{ "name": "Trigger_Library_Jobs", "build": { "number": 2, ... } }'
```

The system:

1. ✅ **Received the webhook** correctly
2. ✅ **Spawned analysis** for build #2
3. ✅ **Stored results** in the database
4. ❌ **Compared against build #1** but found no matching historical context

**Root cause:** The `findLastFailedBuild()` function compares **downstream job build numbers** (e.g., `Library_ColorPalette` build #643 vs #645), not **trigger job build numbers**.

**Example:**

- Trigger build #1 spawned `Library_ColorPalette` build #643
- Trigger build #2 spawned `Library_ColorPalette` build #645
- Query: "Find failures in `Library_ColorPalette` where build < 645"
  - ✅ Found build #643 failures
  - ✅ Marked as recurring correctly

**But if builds are analyzed out of chronological order:**

- Build #89 analyzed first (Feb 25, 05:51)
- Build #1 analyzed later (Feb 25, 09:19) ← **AFTER #89**
- Build #2 analyzed last (Mar 3, 02:25)

If build #1's downstream jobs have **higher build numbers** than build #89's downstream jobs, the historical comparison works. But if not, it fails.

### 3. **The Fix**

**Option A (Recommended):** Only test with **real Jenkins build numbers**

```bash
# Get real build number first
REAL_BUILD=$(curl -s -u $USER:$TOKEN \
  "$JENKINS_URL/job/Trigger_Library_Jobs/lastCompletedBuild/api/json?tree=number" \
  | jq -r '.number')

# Then trigger webhook
curl -X POST http://10.197.34.82:9091/webhook \
  -d "{ \"name\": \"Trigger_Library_Jobs\", \"build\": { \"number\": $REAL_BUILD, ... } }"
```

**Option B (Code Fix):** Update `operations.js` to compare **trigger job build chronology** instead of downstream job builds.

**Change in `scripts/database/operations.js`:**

```javascript
// OLD (compares downstream job builds)
WHERE fj.job_name = ? AND fs.error_fingerprint = ?
  AND fj.job_build < ? AND fs.platform = ?

// NEW (compares trigger job builds)
WHERE fj.job_name = ? AND fs.error_fingerprint = ?
  AND jr.job_build < ? AND fs.platform = ?
JOIN job_runs jr ON fj.run_id = jr.id
```

**Change in `scripts/pipeline/process_android_build.js`:**

```javascript
// OLD
const prevData = dbOps.findLastFailedBuild(db, failedJob.jobName, fingerprint, failedJob.buildNum, 'android');

// NEW
const prevData = dbOps.findLastFailedBuild(db, failedJob.jobName, fingerprint, parseInt(triggerBuild), 'android');
```

---

## 🧪 Proof of Correct Behavior

Checked build #1 vs build #2 for `Library_ColorPalette`:

```sql
SELECT job_build, step_id, is_recurring, last_failed_build 
FROM failed_steps fs 
JOIN failed_jobs fj ON fs.failed_job_id = fj.id 
WHERE fj.run_id IN (5,6) AND fj.job_name='Library_ColorPalette';
```

**Result:**

| Build | Step       | Recurring? | Last Failed Build |
|-------|------------|------------|-------------------|
| 643   | screenshot | 0          | null              |
| 645   | screenshot | **1**      | **643**           |

✅ **Build #2 correctly detected recurring failures from build #1!**

---

## 📊 Database Schema

**Tables:**

1. **`job_runs`** — Trigger job records
   - Columns: `id`, `job_name`, `job_build`, `platform`, `recorded_at`, `pass_count`, `fail_count`

2. **`failed_jobs`** — Failed downstream Library_* jobs
   - Columns: `id`, `run_id` (FK to `job_runs`), `job_name`, `job_build`, `job_link`

3. **`failed_steps`** — Individual test failures
   - Columns: `id`, `failed_job_id` (FK to `failed_jobs`), `tc_id`, `step_id`, `error_fingerprint`, `is_recurring`, `last_failed_build`, etc.

**Current builds in database:**

| Trigger Build | Recorded At         | Pass | Fail |
|---------------|---------------------|------|------|
| #89           | 2026-02-25 05:51:48 | 88   | 38   |
| #1            | 2026-02-25 09:19:40 | 21   | 19   |
| #2            | 2026-03-03 02:25:29 | 22   | 23   |

---

## ✅ Recommendations

1. **For testing:** Always use real Jenkins build numbers
2. **For production:** Implement Option B fix to handle out-of-order builds correctly
3. **For monitoring:** Add validation to warn when webhook receives non-existent build numbers
4. **For documentation:** Update README with webhook testing best practices

---

## 📄 Related Files

- **Webhook server:** `scripts/server/index.js`
- **Analysis orchestrator:** `scripts/android_analyzer.sh`
- **Pipeline:** `scripts/pipeline/process_android_build.js`
- **Database operations:** `scripts/database/operations.js`
- **Full fix document:** `docs/WEBHOOK_BUG_FIX.md` ✅

---

**Status:** Investigation complete, fix documented, ready for implementation.
