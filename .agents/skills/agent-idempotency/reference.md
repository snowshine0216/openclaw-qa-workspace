# Agent Idempotency Reference

Concrete technical mappings for implementing the `agent-idempotency` skill in any agent workflow.

---

## 1. Phase 0 Existence Check — Decision Logic

Run this logic before any external call in Phase 0. Substitute the actual file paths for your domain (see [Domain Mapping](#6-domain-mapping)):

```
function checkExistingState(runKey, baseDir):
  finalOutput  = baseDir/<runKey>_OUTPUT_FINAL.<ext>
  draftOutput  = baseDir/<runKey>_OUTPUT_DRAFT.<ext>
  primaryCache = baseDir/cache/<primary_cache_file>
  runFile      = baseDir/run.json

  if finalOutput exists:
    return state = "FINAL_EXISTS"
  elif draftOutput exists:
    return state = "DRAFT_EXISTS"
  elif primaryCache exists:
    return state = "CACHE_ONLY"
  else:
    return state = "FRESH"
```

---

## 2. run.json Schema

Store freshness metadata in `run.json` alongside the output artifacts. Extend as needed for your domain.

```json
{
  "run_key": "<identifier>",
  "overall_status": "completed",
  "current_phase": "done",
  "data_fetched_at": "2026-01-28T10:30:00Z",
  "output_generated_at": "2026-01-28T11:45:00Z",
  "output_approved_at": "2026-01-28T12:00:00Z",
  "subtask_timestamps": {
    "subtask-A": "2026-01-28T11:00:00Z",
    "subtask-B": "2026-01-28T11:05:00Z"
  },
  "failed_subtasks": [],
  "archive_log": [
    {
      "archived_at": "2026-02-10T09:00:00Z",
      "original_file": "<runKey>_OUTPUT_FINAL.<ext>",
      "archived_to": "archive/<runKey>_OUTPUT_FINAL_20260128.<ext>",
      "reason": "Smart Refresh requested by user"
    }
  ]
}
```

**Key fields:**

| Field | Type | Purpose |
|---|---|---|
| `data_fetched_at` | ISO timestamp | Determines primary data staleness |
| `output_generated_at` | ISO timestamp | When the current draft/final was generated |
| `subtask_timestamps` | Map<ID, timestamp> | Per-subtask cache age for Smart Refresh decisions |
| `failed_subtasks` | Array | Subtasks that errored; targeted for retry |
| `archive_log` | Array | Audit trail of all archived files |

---

## 3. Cache Age Calculation

When building the user-facing prompt, compute human-readable age from `data_fetched_at`:

```
age = now - data_fetched_at
if age < 1 hour   → "just now"
if age < 24 hours → "N hours ago"
if age < 7 days   → "N days ago"
else              → "N weeks ago" (flag as likely stale)
```

For subtasks, show the oldest cached result's age plus total cached count:
```
"5/8 subtask results cached (oldest: 7 days ago)"
```

---

## 4. Archive Procedure

Before any overwrite (Smart Refresh or Full Regenerate):

```bash
# 1. Determine archive filename
DATE=$(date +%Y%m%d)
ARCHIVE_NAME="${RUN_KEY}_OUTPUT_FINAL_${DATE}.${EXT}"

# 2. Create archive directory if needed
mkdir -p <base_dir>/<RUN_KEY>/archive/

# 3. Move (not copy) the old final to archive
mv <base_dir>/<RUN_KEY>/${RUN_KEY}_OUTPUT_FINAL.${EXT} \
   <base_dir>/<RUN_KEY>/archive/${ARCHIVE_NAME}

# 4. Record in run.json archive_log
```

If a same-day collision exists, append `_<HHmm>`:
```
ARCHIVE_NAME="${RUN_KEY}_OUTPUT_FINAL_${DATE}_$(date +%H%M).${EXT}"
```

---

## 5. Smart Refresh: Subtask Cache Reuse Logic

During Smart Refresh, subtask result files are selectively reused based on age and stability:

```
MAX_CACHE_AGE_DAYS = 7   # tune per domain; stable artifacts can use 30+

for each subtask in identified_subtasks:
  result_file = cache/<subtask_id>_result.<ext>
  if result_file exists AND subtask_timestamps[subtask_id] is recent (< MAX_CACHE_AGE_DAYS):
    skip re-run (use cached result)
  else:
    run subtask for this item
```

**Staleness rule guidance by domain:**

| Domain | Subtask | Recommended max age | Rationale |
|---|---|---|---|
| Defect analysis | PR impact | 7–30 days | Merged PRs don't change |
| Browser tests | Passing test case | Until build changes | Rerun only on new build |
| Data pipeline | Enrichment step | 1 day | Source data refreshes daily |
| Code generation | Module synthesis | Until input changes | Pure function of inputs |

---

## 6. Domain Mapping

Fill in this table when applying the skill to a new domain:

| Generic Field | Your Value |
|---|---|
| `run_key` | _(e.g., ticket ID, suite name, pipeline tag)_ |
| `<KEY>_OUTPUT_FINAL.<ext>` | _(e.g., `BCIN-789_REPORT_FINAL.md`, `checkout_TEST_REPORT_FINAL.html`)_ |
| `<KEY>_OUTPUT_DRAFT.<ext>` | _(e.g., `BCIN-789_REPORT_DRAFT.md`, `checkout_TEST_REPORT_DRAFT.html`)_ |
| `cache/<primary_cache_file>` | _(e.g., `cache/jira_raw.json`, `cache/page_snapshot.json`)_ |
| `subtask_timestamps` keys | _(e.g., PR IDs, test case IDs, pipeline step names)_ |
| `data_fetched_at` meaning | _(e.g., Jira fetch time, app build timestamp)_ |
| Smart Refresh trigger | _(e.g., Jira ticket changed, new build deployed)_ |
| Max subtask cache age | _(e.g., 7 days, until build changes)_ |

---

## 7. Staleness Warning in Output Header

When generating output using stale/cached data (e.g., external API was unavailable), embed this banner at the top:

```markdown
> ⚠️ **Data Freshness Warning**: Primary data used in this output was fetched on 2026-01-28
> (3 days ago) due to an API connectivity issue at time of regeneration.
> Re-run with "Smart Refresh" when the data source is available to get current results.
```

---

## 8. Batch State Matrix Template

When running across multiple items, present this table before proceeding:

```
Item State Summary:

| Item       | State          | Last Output Date | Default Action       |
|------------|----------------|-----------------|----------------------|
| ITEM-01    | ✅ Final        | 2026-01-28       | Skip (use existing)  |
| ITEM-02    | 📝 Draft only   | 2026-02-10       | Resume               |
| ITEM-03    | 🔄 Cache only   | 2026-02-12       | Generate from cache  |
| ITEM-04    | 🆕 Fresh        | —                | Full run             |
...

Proceed with defaults? (A) Yes  (B) Regenerate all  (C) Customize per-item
```

---

## 9. Reconstructing State from Disk (Corrupted run.json)

If `run.json` is missing or unparseable, reconstruct minimal state from file presence and modification times:

```
detectedState = {}

if cache/<primary_cache_file> exists:
  detectedState.primary_data_cached = true
  detectedState.data_file_mtime = file modification time

count completed subtask result files in cache/
  detectedState.subtasks_complete = count

if <KEY>_OUTPUT_DRAFT.<ext> exists:
  detectedState.draft_exists = true

if <KEY>_OUTPUT_FINAL.<ext> exists:
  detectedState.final_exists = true
```

Present reconstruction to user:
> *"run.json was missing. I reconstructed the state from disk: primary cache found (modified 3 days ago), 3/7 subtasks complete, draft output exists. Resume from this state or restart from scratch?"*
