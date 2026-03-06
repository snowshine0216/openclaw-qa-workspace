---
name: agent-idempotency
description: Idempotency, cache reuse, output versioning, and error handling for agents that generate persistent artifacts. Use when an agent may be asked to re-run a task it has already completed, or when designing Phase 0 of any workflow that produces output files.
---

# Agent Idempotency & Cache Management

## Purpose

Prevent data loss, avoid unnecessary API calls, and give users clear control over when to reuse versus refresh existing work. Any agent that produces persistent artifacts (reports, test results, exports, generated files) must handle the case where those artifacts already exist.

## When To Use

Use this skill when:
- Designing Phase 0 (Preparation) of any agent workflow
- An agent may be re-invoked for the same input it has already processed
- The workflow produces output files (reports, test results, drafts, raw data caches)
- You need to decide what to re-fetch vs. reuse from a previous run
- A user asks to "re-run", "refresh", or "regenerate" existing work

---

## Core Pattern: Tiered Existence Check

At the start of every run, before making any external call, the agent must classify the current state of the workspace for the given **run key** (the unique identifier for this job — e.g., a ticket ID, a test suite name, a pipeline run tag).

### State Classification

| State | Condition | User Prompt |
|---|---|---|
| **Final output exists** | `<KEY>_OUTPUT_FINAL` present | Show date. Offer: Use Existing / Smart Refresh / Full Regenerate |
| **Draft exists, no final** | `<KEY>_OUTPUT_DRAFT` present | Offer: Resume to Approval / Smart Refresh / Full Regenerate |
| **Cache only** | Raw data exists, no output | Show data age. Offer: Generate from Cache / Re-fetch + Regenerate |
| **Fresh** | No artifacts at all | Proceed normally |

The exact file names and cache structure are domain-specific — see [Applying to Your Domain](#applying-to-your-domain) and [examples.md](examples.md) for concrete mappings.

### Option Semantics

| Option | Re-fetches primary data? | Re-runs sub-tasks? | Archives old output? |
|---|---|---|---|
| **Use Existing** | No | No | No |
| **Smart Refresh** | Yes | Only missing or stale | Yes (move to `archive/`) |
| **Full Regenerate** | Yes | Yes, all | Yes (move to `archive/`) |
| **Resume** | No | No | No |
| **Generate from Cache** | No | No | Moves old draft to `archive/` |

**Rule:** Never silently overwrite an existing final output. Always archive it first.

---

## Cache Freshness Display

Before presenting options, state data ages explicitly:

> *"[Run key] was last processed on 2026-01-28 (3 days ago). Primary data: 3 days old. Sub-task results: 5/8 cached (oldest: 7 days ago)."*

Store freshness timestamps in `run.json` (or `task.json` in legacy workflows):

```json
{
  "run_key": "<identifier>",
  "data_fetched_at": "2026-01-28T10:30:00Z",
  "output_generated_at": "2026-01-28T11:45:00Z",
  "subtask_timestamps": {
    "subtask-A": "2026-01-28T11:00:00Z",
    "subtask-B": "2026-01-28T11:05:00Z"
  }
}
```

---

## Versioning: Archive Pattern

Active filenames are always clean (no timestamps). Old outputs move to `archive/`:

```
<RUN_KEY>/
├── archive/
│   ├── <RUN_KEY>_OUTPUT_FINAL_20260128.<ext>   ← previous final
│   └── <RUN_KEY>_OUTPUT_DRAFT_20260210.<ext>   ← abandoned draft
├── run.json
├── cache/
│   └── <domain-specific raw data files>
├── <RUN_KEY>_OUTPUT_DRAFT.<ext>                ← current working draft
└── <RUN_KEY>_OUTPUT_FINAL.<ext>                ← current final
```

Archive naming: `<KEY>_OUTPUT_<TYPE>_<YYYYMMDD>.<ext>`

If multiple outputs were generated on the same day, append `_<HHmm>`.

**Never delete old outputs.** Archive is the only disposal.

---

## Error Handling Scenarios

| Scenario | Required Behavior |
|---|---|
| `run.json` missing or corrupted with partial cache on disk | Reconstruct minimal state from disk artifacts. Present: "Found partial data: [primary cache ✓, 3/7 sub-tasks complete]. Resume from inferred state or restart from scratch?" |
| External data source unreachable during Smart Refresh | Offer: use cached data with a staleness warning embedded in the output header. Never silently proceed with stale data. |
| Sub-tasks partially cached (some complete, some missing) | Only re-run the missing sub-tasks. Never re-run already-completed sub-tasks unless Full Regenerate is chosen. |
| Output generation fails; raw cache is intact | Next invocation detects "cache only" state. Offer "Generate from Cache" as default — no external calls needed. |
| User requests Full Regenerate on data < 1 hour old | Warn: "Data was fetched [N] minutes ago. Are you sure you want to re-fetch everything?" Require explicit confirmation. |
| Batch run: mixed state across multiple items | Show a state matrix per item. Default: skip items with existing finals; ask user whether to include them. |

---

## Batch / Multi-Item Runs

When running across multiple items (e.g., multiple tickets, multiple test suites), states may differ per item:

```
I found 12 items. Current state:
  ITEM-01 ✅ Final output exists (2026-01-28)
  ITEM-02 📝 Draft only (2026-02-10)
  ITEM-03 🔄 Cache only (2026-02-12)
  ITEM-04–12 🆕 No data

Default plan: Skip ITEM-01 (use existing), resume ITEM-02 draft,
              generate ITEM-03 from cache, full run for rest.
Override? (A) Accept default  (B) Regenerate all  (C) Select subset
```

---

## Applying to Your Domain

Map the generic concepts to your specific workflow:

| Generic Concept | Defect Analysis Reporter | Browser Test Run |
|---|---|---|
| Run key | `BCIN-789` | `suite:checkout` |
| Primary data source | Jira API | Test target URL / app build |
| Primary cache file | `cache/jira_raw.json` | `cache/page_snapshot.json` |
| Sub-tasks | PR impact analyses | Individual test cases |
| Sub-task cache files | `cache/prs/<PR_ID>_impact.md` | `cache/tests/<TEST_ID>_result.json` |
| Final output | `BCIN-789_REPORT_FINAL.md` | `checkout_TEST_REPORT_FINAL.md` |
| Draft output | `BCIN-789_REPORT_DRAFT.md` | `checkout_TEST_REPORT_DRAFT.md` |
| `data_fetched_at` | Jira fetch timestamp | App build / snapshot timestamp |
| Smart Refresh trigger | Jira ticket changed | App build changed |
| Sub-task staleness rule | PRs don't change after merge | Passed tests re-run only on build change |

Add a row for your workflow when implementing this skill.

---

## Quality Gates

- [ ] Does Phase 0 check for a final output before any external call?
- [ ] Does Phase 0 check for a draft if no final exists?
- [ ] Does Phase 0 check for cached data if no output of either kind exists?
- [ ] Does the agent display data freshness (timestamps) before presenting options?
- [ ] Is the `archive/` subfolder used before any overwrite?
- [ ] Is `run.json` updated with `data_fetched_at` and `subtask_timestamps`?
- [ ] Is a staleness warning embedded in the output header when cached data is used after an API failure?
- [ ] For batch runs: does the agent present a per-item state matrix?

## Additional Resources

- Implementation details: [reference.md](reference.md)
- Concrete examples by domain: [examples.md](examples.md)
