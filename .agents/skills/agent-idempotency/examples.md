# Agent Idempotency Examples

Practical dialogue and file-system examples illustrating the `agent-idempotency` skill across different domains.

---

## Domain: Defect Analysis Reporter

> **Domain mapping:** Run key = Jira ticket (`BCIN-789`). Primary data = Jira API. Sub-tasks = PR impact analyses. Output format = Markdown report.

### Example 1: Final Report Already Exists

**Context:** User analyzed BCIN-789 on 2026-01-28. Now asks again on 2026-02-26.

**Agent Phase 0 behavior:**

```
Agent checks:
  ✓ projects/defects-analysis/BCIN-789/BCIN-789_REPORT_FINAL.md  → exists
  ✓ run.json → data_fetched_at: 2026-01-28T10:30:00Z (29 days ago)

Agent says:
  "A final report for BCIN-789 already exists (generated: 2026-01-28, 29 days ago).
   Jira data is 29 days old. 8/8 PR impacts cached.

   How would you like to proceed?
   (A) Use existing report — no API calls
   (B) Smart Refresh — re-fetch Jira only, reuse PR cache, archive old report
   (C) Full Regenerate — re-fetch everything from scratch, archive old report"
```

**User picks B (Smart Refresh):**

```
Agent:
  1. Archives: BCIN-789_REPORT_FINAL.md → archive/BCIN-789_REPORT_FINAL_20260128.md
  2. Re-fetches cache/jira_raw.json (Jira call only)
  3. Checks PR cache ages:
     - PR-123: 29 days old → exceeds 7-day threshold → re-analyze
     - PR-456: 29 days old → re-analyze
  4. Spawns PR sub-agents for PR-123, PR-456
  5. Generates new BCIN-789_REPORT_DRAFT.md
  6. "Draft is ready. Please review and approve."
```

---

### Example 2: Draft Exists, Never Approved

**Context:** Analysis was started for BCIN-811 but user never approved it. A `_REPORT_DRAFT.md` exists.

**Agent Phase 0 behavior:**

```
Agent checks:
  ✗ BCIN-811_REPORT_FINAL.md → not found
  ✓ BCIN-811_REPORT_DRAFT.md → exists (modified 2026-02-10, 16 days ago)
  ✓ run.json → current_phase: "approval", data_fetched_at: 2026-02-10T09:00:00Z

Agent says:
  "A draft report for BCIN-811 already exists (created 2026-02-10, 16 days ago).
   It was never approved. Jira data is 16 days old.

   How would you like to proceed?
   (A) Resume — go straight to review/approval of the existing draft
   (B) Smart Refresh — re-fetch Jira, regenerate draft (reuse PR cache), archive existing draft
   (C) Full Regenerate — start from scratch"
```

**User picks A (Resume):**

```
Agent goes directly to Phase 4 (Approval):
  "Please review the draft at:
   projects/defects-analysis/BCIN-811/BCIN-811_REPORT_DRAFT.md
   Reply APPROVE to publish, or provide feedback to revise."
```

---

### Example 3: Cache Only (Report Generation Failed Previously)

**Context:** Phase 3 (report generation) crashed. Raw Jira data and PR impact files exist but no report was ever produced.

**Agent Phase 0 behavior:**

```
Agent checks:
  ✗ BCIN-900_REPORT_FINAL.md → not found
  ✗ BCIN-900_REPORT_DRAFT.md → not found
  ✓ cache/jira_raw.json → exists (modified 2026-02-20T14:00:00Z, 6 days ago)
  ✓ cache/prs/ → 4 files found
  ✓ run.json → current_phase: "synthesis", overall_status: "failed"

Agent says:
  "I found cached data for BCIN-900 (Jira fetched 6 days ago, 4/4 PR impacts cached)
   but no report was generated — it looks like a previous run failed at synthesis.

   How would you like to proceed?
   (A) Generate from cache — no API calls, produce draft from existing data
   (B) Smart Refresh — re-fetch Jira, then generate (reuse PR cache)
   (C) Full Regenerate — re-fetch everything"
```

**User picks A:**

```
Agent invokes defect-analysis-reporter skill directly with cached artifacts.
No external API calls made.
Saves BCIN-900_REPORT_DRAFT.md and goes to approval.
```

---

### Example 4: Jira API Down During Smart Refresh

**Context:** User chose Smart Refresh but Jira is unreachable.

```
Agent (after 3 retry attempts):
  "Jira API is currently unreachable (3 retries failed).

   Options:
   (A) Use cached jira_raw.json from 2026-01-28 (29 days old) and generate report
       — a staleness warning will be embedded in the report header
   (B) Abort and retry later"
```

**User picks A. Report header includes:**

```markdown
> ⚠️ **Data Freshness Warning**: Jira data in this report is from 2026-01-28 (29 days old).
> The Jira API was unreachable at regeneration time (2026-02-26).
> Re-run with Smart Refresh when Jira is available to get current defect statuses.
```

---

### Example 5: Release-Scoped — Mixed Feature States

**Context:** Running analysis for release 26.03 with 12 features. Previous runs exist for some.

```
Agent checks all 12 feature folders and presents:

  Feature State Summary for Release 26.03:

  | Feature    | State          | Last Report    | Default Action      |
  |------------|----------------|----------------|---------------------|
  | BCIN-5809  | ✅ Final        | 2026-01-28     | Skip (use existing) |
  | BCIN-5810  | 📝 Draft only   | 2026-02-10     | Resume to approval  |
  | BCIN-5811  | 🔄 Cache only   | 2026-02-12     | Generate from cache |
  | BCIN-5812  | 🆕 Fresh        | —              | Full analysis       |
  | BCIN-5813  | 🆕 Fresh        | —              | Full analysis       |
  | ... (7 more fresh features)

  Plan: 1 skipped, 1 resumed, 1 from cache, 9 fresh analyses.
  Estimated API calls: ~90 Jira + ~45 GitHub (vs ~120 Jira + ~60 GitHub for all-fresh).

  Proceed with this plan?
  (A) Yes, use defaults
  (B) Regenerate all (including existing finals)
  (C) Let me pick per-feature
```

---

### Example 6: Full Regenerate on Very Recent Data

**Context:** User ran analysis 30 minutes ago and immediately asks to regenerate.

```
Agent:
  "BCIN-789 was analyzed just 30 minutes ago (Jira fetched at 14:00, it's now 14:30).

   ⚠️ Re-fetching now means making redundant API calls on very recent data.
   Are you sure you want to Full Regenerate?

   (A) Yes, re-fetch everything
   (B) Use Smart Refresh instead (reuse all PR cache)
   (C) Cancel"
```

---

### run.json State After Smart Refresh

```json
{
  "run_key": "BCIN-789",
  "overall_status": "draft_ready",
  "current_phase": "approval",
  "data_fetched_at": "2026-02-26T14:00:00Z",
  "output_generated_at": "2026-02-26T14:15:00Z",
  "output_approved_at": null,
  "subtask_timestamps": {
    "PR-123": "2026-02-26T14:05:00Z",
    "PR-456": "2026-01-28T11:05:00Z"
  },
  "failed_subtasks": [],
  "archive_log": [
    {
      "archived_at": "2026-02-26T14:00:00Z",
      "original_file": "BCIN-789_REPORT_FINAL.md",
      "archived_to": "archive/BCIN-789_REPORT_FINAL_20260128.md",
      "reason": "Smart Refresh requested by user"
    }
  ]
}
```

Note: PR-456 retains its old timestamp — it was reused from cache. PR-123 was re-analyzed because it exceeded the 7-day staleness threshold.

---

## Domain: Browser Test Runs

> **Domain mapping:** Run key = test suite name (`suite:checkout`). Primary data = app build / page snapshot. Sub-tasks = individual test cases. Output format = HTML or Markdown test report.

### File Structure

```
test-results/suite:checkout/
├── archive/
│   └── checkout_TEST_REPORT_FINAL_20260220.html   ← previous run
├── run.json
├── cache/
│   ├── page_snapshot.json                          ← captured DOM/state
│   └── tests/
│       ├── TC-001_result.json                      ← individual test result
│       ├── TC-002_result.json
│       └── TC-003_result.json
├── checkout_TEST_REPORT_DRAFT.html                 ← current working report
└── checkout_TEST_REPORT_FINAL.html                 ← approved/published report
```

---

### Example 7: Final Test Report Exists, Build Unchanged

**Context:** Checkout suite was fully run yesterday. User triggers the agent again today, but the app build hasn't changed.

**Agent Phase 0 behavior:**

```
Agent checks:
  ✓ test-results/suite:checkout/checkout_TEST_REPORT_FINAL.html → exists
  ✓ run.json → data_fetched_at: 2026-02-25T09:00:00Z (1 day ago)
                build_id: "build-4421"
  ✓ Current app build: "build-4421" (unchanged)

Agent says:
  "A final test report for suite:checkout already exists (run: 2026-02-25, 1 day ago).
   App build is unchanged (build-4421). All 12 test results are cached.

   How would you like to proceed?
   (A) Use existing report — no browser automation needed
   (B) Smart Refresh — re-capture page snapshot, re-run only failed/missing tests
   (C) Full Re-run — execute all tests against the current app"
```

**User picks A:**

```
Agent returns the existing report path with no browser automation invoked.
```

---

### Example 8: New Build Deployed — Smart Refresh

**Context:** App was redeployed (build-4422). Previous test results exist for build-4421.

**Agent Phase 0 behavior:**

```
Agent checks:
  ✓ checkout_TEST_REPORT_FINAL.html → exists
  ✓ run.json → build_id: "build-4421"
  ✓ Current app build: "build-4422" (CHANGED)

Agent says:
  "A final test report for suite:checkout exists but it's for build-4421.
   The current app is build-4422 (deployed 2 hours ago).

   How would you like to proceed?
   (A) Smart Refresh — re-capture snapshot, re-run tests that failed in the last run
       + any tests without a result for build-4422. Reuse passed tests.
   (B) Full Re-run — execute all 12 tests against build-4422
   (C) Use existing report — keep old results (not recommended for changed build)"
```

**User picks A (Smart Refresh):**

```
Agent:
  1. Archives: checkout_TEST_REPORT_FINAL.html → archive/checkout_TEST_REPORT_FINAL_20260225.html
  2. Re-captures cache/page_snapshot.json (browser automation: navigate + snapshot)
  3. Checks test cache vs build:
     - TC-001: passed on build-4421, no change in affected area → reuse
     - TC-002: failed on build-4421 → re-run
     - TC-003: no result for build-4422 → run fresh
  4. Runs TC-002, TC-003 via browser automation
  5. Generates checkout_TEST_REPORT_DRAFT.html
  6. "Draft report is ready. 10 tests reused, 2 re-run (1 pass, 1 fail). Review?"
```

---

### Example 9: Partial Test Run (Browser Crashed Mid-Suite)

**Context:** Previous run completed 7/12 tests before the browser crashed. No final report exists.

**Agent Phase 0 behavior:**

```
Agent checks:
  ✗ checkout_TEST_REPORT_FINAL.html → not found
  ✗ checkout_TEST_REPORT_DRAFT.html → not found
  ✓ cache/page_snapshot.json → exists (modified 2026-02-26T10:00:00Z, 2 hours ago)
  ✓ cache/tests/ → 7 result files found
  ✓ run.json → current_phase: "execution", overall_status: "failed", failed_subtasks: []

Agent says:
  "I found a partial run for suite:checkout (7/12 tests complete, crashed 2 hours ago).
   Page snapshot is 2 hours old. Build-4422 is still the current build.

   How would you like to proceed?
   (A) Resume — run only the 5 remaining tests, then generate report
   (B) Full Re-run — restart all 12 tests from scratch
   (C) Generate from partial cache — produce report for completed 7 tests only (mark 5 as 'not run')"
```

**User picks A (Resume):**

```
Agent:
  Identifies missing tests: TC-008 through TC-012
  Runs only those 5 tests via browser automation
  Merges new results with cached TC-001–007 results
  Generates checkout_TEST_REPORT_DRAFT.html
  "All 12 tests complete. 10 passed, 2 failed. Review draft?"
```

---

### Example 10: Batch — Multiple Suites, Mixed State

**Context:** Running full regression across 4 test suites before a release.

```
Agent checks all 4 suite folders and presents:

  Test Suite State Summary — Release Candidate build-4422:

  | Suite          | State          | Last Run       | Build Match | Default Action       |
  |----------------|----------------|----------------|-------------|----------------------|
  | suite:checkout | ✅ Final        | 2026-02-25     | ✗ (4421)    | Full re-run          |
  | suite:login    | ✅ Final        | 2026-02-26     | ✓ (4422)    | Skip (use existing)  |
  | suite:search   | 🔄 Cache only   | 2026-02-24     | ✗ (4421)    | Full re-run          |
  | suite:payment  | 🆕 Fresh        | —              | —           | Full run             |

  Plan: 1 skipped, 3 full runs.
  Estimated browser automation: ~45 test executions (vs ~60 for all-fresh).

  Proceed with this plan?
  (A) Yes, use defaults
  (B) Re-run all suites
  (C) Let me pick per-suite
```

---

### run.json State for Browser Test Domain

```json
{
  "run_key": "suite:checkout",
  "overall_status": "draft_ready",
  "current_phase": "review",
  "build_id": "build-4422",
  "data_fetched_at": "2026-02-26T12:00:00Z",
  "output_generated_at": "2026-02-26T12:20:00Z",
  "output_approved_at": null,
  "subtask_timestamps": {
    "TC-001": "2026-02-25T09:05:00Z",
    "TC-002": "2026-02-26T12:05:00Z",
    "TC-003": "2026-02-26T12:10:00Z"
  },
  "failed_subtasks": ["TC-002"],
  "archive_log": [
    {
      "archived_at": "2026-02-26T12:00:00Z",
      "original_file": "checkout_TEST_REPORT_FINAL.html",
      "archived_to": "archive/checkout_TEST_REPORT_FINAL_20260225.html",
      "reason": "Smart Refresh — new build (4422) detected"
    }
  ]
}
```
