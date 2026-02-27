# Idempotency Review: Feature QA Planning Workflow

**Reference skill:** [agent-idempotency](../../.cursor/skills/agent-idempotency/SKILL.md)

## 1. Overview

This review evaluates the `feature-qa-planning.md` workflow through the lens of **Agent Idempotency**. The goal is to ensure the workflow can be safely interrupted, resumed, retried, and looped without producing unintended side effects such as data duplication, infinite loops, loss of history, or interference from stale artifacts.

**Per the agent-idempotency skill:** Any agent that produces persistent artifacts must handle the case where those artifacts already exist. The workflow must never silently overwrite final output; always archive first.

---

## 2. Domain Mapping (Applying to Your Domain)

| Generic Concept | Feature QA Planning Workflow |
|---|---|
| **Run key** | Feature ID (e.g., `BCIN-1234`) |
| **Primary data source** | Jira, Confluence, GitHub, Figma |
| **Primary cache files** | `context/jira.json`, `context/confluence.md`, `context/github_pr.json`, `context/github_diff.md` |
| **Sub-tasks** | `qa-plan-atlassian`, `qa-plan-figma`, `qa-plan-github` |
| **Sub-task cache files** | `context/qa_plan_atlassian_<feature-id>.md`, `context/qa_plan_figma_<feature-id>.md`, `context/qa_plan_github_<feature-id>.md` |
| **Final output** | `qa_plan_final.md` + published Confluence page |
| **Draft output** | `drafts/qa_plan_v1.md`, `drafts/qa_plan_v2.md`, ... |
| **State file** | `task.json` (equivalent to `run.json`) |
| **Smart Refresh trigger** | Jira ticket, PR, or Figma design changed |

---

## 3. Tiered Existence Check (Phase 0 Gap)

**Per the skill:** At the start of every run, *before any external call*, the agent must classify the current state for the given run key.

### Current State Classification (Missing in Workflow)

| State | Condition | Required User Prompt |
|---|---|---|
| **Final output exists** | `qa_plan_final.md` present | Show date. Offer: Use Existing / Smart Refresh / Full Regenerate |
| **Draft exists, no final** | `drafts/` contains files, no `qa_plan_final.md` | Offer: Resume to Approval / Smart Refresh / Full Regenerate |
| **Cache only** | Raw data in `context/`, no draft or final | Show data age. Offer: Generate from Cache / Re-fetch + Regenerate |
| **Fresh** | No artifacts at all | Proceed normally |

### Current Workflow Behavior

The workflow runs `scripts/check_resume.sh` which:
- Returns `NO_TASK` if `task.json` is missing → treats as fresh
- Returns `COMPLETED` if `overall_status` is `completed` → does **not** present user options
- Returns `RESUMABLE` if in-progress → skips to `resume_from` phase

**Missing:** The workflow does *not* perform a tiered existence check before external calls. It does not:
1. Check for `qa_plan_final.md` before fetching Jira/Confluence/GitHub/Figma
2. Offer Use Existing / Smart Refresh / Full Regenerate when final exists
3. Display cache freshness (`data_fetched_at`, `output_generated_at`) before presenting options
4. Archive existing final output before overwriting (violates skill rule)

---

## 4. Phase-by-Phase Idempotency Analysis

### Phase 0: Preparation and Information Confirmation

**Current State:**  
Reads `task.json` via `scripts/check_resume.sh` and skips to the `resume_from` phase if found. Otherwise, initializes a fresh `task.json`.

**Idempotency Issues:**

1. **Tiered Existence Check not performed:** Phase 0 does not classify state (final / draft / cache / fresh) before any external call. The skill requires this check first.
2. **Completed state:** When `overall_status` is `completed`, `check_resume.sh` exits with "Nothing to resume." The workflow does not instruct the agent to offer: Use Existing / Smart Refresh / Full Regenerate.
3. **Stale directory state:** If forcing a fresh start over an old directory, leftover files may corrupt the new run.
4. **Archive rule violation:** No instruction to archive `qa_plan_final.md` before overwriting on Full Regenerate.

**Recommendations:**
- Add a **Phase 0a: Tiered Existence Check** before any API call:
  - If `qa_plan_final.md` exists: Display freshness from `task.json`. Offer: Use Existing / Smart Refresh / Full Regenerate. Do not proceed until user chooses.
  - If draft exists (no final): Offer: Resume / Smart Refresh / Full Regenerate.
  - If `context/` has data, no output: Offer: Generate from Cache / Re-fetch + Regenerate.
- If user chooses Full Regenerate and final exists: Move `qa_plan_final.md` to `archive/qa_plan_final_<YYYYMMDD>.md` before proceeding.
- On fresh start: Explicitly clear `projects/feature-plan/<feature-id>` (or document that agent must confirm clean slate) before initializing `task.json`.

---

### Phase 1: Information Gathering & Context Extraction

**Current State:**  
Runs CLI tools and overwrites outputs to `context/` (`jira.json`, `confluence.md`, etc.).

**Idempotency Issues:**
1. **Stale optional sources:** If an optional source (e.g., Figma) was provided in Run 1 but removed in Run 2, old `context/` files may remain and be incorrectly ingested.
2. **Freshness tracking:** `task.json` does not explicitly store `data_fetched_at`. Per the skill, this should be recorded for cache freshness display.

**Recommendations:**
- Add a cleanup step at the start of Phase 1 when doing a full re-fetch: `rm -rf projects/feature-plan/<feature-id>/context/*` before generating new context files.
- Update `task.json` with `data_fetched_at` (ISO timestamp) after successful fetch of each primary source. Use `subtask_timestamps` for each source (jira, confluence, github, figma).

---

### Phase 2a: Parallel Source Analysis

**Current State:**  
Spawns parallel tasks that write to `context/qa_plan_<source>_<feature-id>.md`.

**Idempotency Issues:**
1. **Partial resumption:** If resuming mid-phase, it is unclear whether completed sub-tasks are skipped or re-run.
2. **Sub-task staleness:** Per the skill, Smart Refresh should re-run only missing or stale sub-tasks. The workflow does not define staleness rules (e.g., re-run only if Jira ticket changed).

**Recommendations:**
- Phase 2a should check `task.json` for completed sub-tasks. Only re-run tasks whose output is missing or whose source has changed.
- Store `subtask_timestamps` in `task.json` for each domain analysis (qa-plan-atlassian, qa-plan-figma, qa-plan-github).
- Document staleness rules: e.g., re-run atlassian only if Jira/Confluence changed; re-run github only if PR changed.

---

### Phase 2b: Synthesize QA Plan

**Current State:**  
Saves output to `drafts/qa_plan_v1.md`.

**Idempotency Issues:**
1. Hardcoding `v1.md` creates a fragile contract for Phase 3 (Review & Refactor Loop), which may iterate multiple times.
2. If Phase 5 fails and loops back, the workflow may overwrite v1 with regenerated content, losing prior refinements.

**Recommendations:**
- Use dynamic versioning: determine latest `drafts/qa_plan_v<N>.md`, write to `drafts/qa_plan_v<N+1>.md`. Track `latest_draft_version` in `task.json`.

---

### Phase 3: Review & Refactor Loop

**Current State:**  
"If issues found, amend `drafts/qa_plan_v1.md` to `drafts/qa_plan_v2.md`."

**Idempotency Issues:**
1. **Hardcoded v1→v2:** When looping back from Phase 5 (Confluence review FAIL), the workflow forces v1→v2. Subsequent iterations (v3, v4) are not supported.
2. **No archive of abandoned drafts:** Per the skill, old outputs should move to `archive/`. Drafts replaced during refactor are overwritten, not archived.

**Recommendations:**
- Change to: "Amend the latest draft (`drafts/qa_plan_v<N>.md`) to `drafts/qa_plan_v<N+1>.md`." Use `task.json` to track `latest_draft_version`.
- Optionally archive the previous draft to `archive/qa_plan_draft_<YYYYMMDD>_v<N>.md` before writing the new version.
- Add explicit `task.json` update: when looping back from Phase 5, set `current_phase` to `review_refactor`.

---

### Phase 4: Publication

**Current State:**  
Copies final draft to `qa_plan_final.md`, generates `changelog.md`, publishes to Confluence.

**Idempotency Issues:**
1. **Archive rule:** If `qa_plan_final.md` already exists (e.g., from a previous completed run), the workflow overwrites without archiving. **Violates skill rule.**
2. **Changelog:** Unclear whether "save as" means append or overwrite. Append without idempotency check can create duplicate entries on retry.
3. **`output_generated_at`:** Per the skill, record this timestamp in `task.json` when final output is written.

**Recommendations:**
- Before writing `qa_plan_final.md`, if it exists: move to `archive/qa_plan_final_<YYYYMMDD>.md`.
- Clarify `changelog.md`: either (a) overwrite each run, or (b) append only if the current phase's changes are not already recorded.
- Update `task.json` with `output_generated_at` when `qa_plan_final.md` is written.

---

### Phase 5: Confluence Content Review

**Current State:**  
Reviews published page. If FAIL (generation fix), returns to Phase 3.

**Idempotency Issues:**
1. **State reversion:** "Return to Phase 3" does not explicitly update `task.json`. On resume, agent might start at Phase 5 instead of Phase 3.
2. **Review output overwrite:** `qa_plan_confluence_review.md` is overwritten on each loop; review history is lost.
3. **Staleness warning:** If external data (Confluence API) was unreachable and cached content was used, the skill requires embedding a staleness warning in the output header.

**Recommendations:**
- Add explicit instruction: "Update `task.json` phase to `review_refactor`" when looping back.
- Version review outputs: `qa_plan_confluence_review_v<N>.md` or append to a single file with timestamps, so iterative improvements are traceable.
- When using cached data after API failure: embed a warning in the review output header.

---

## 5. Error Handling Scenarios (Skill-Aligned)

| Scenario | Required Behavior (from skill) |
|---|---|
| `task.json` missing or corrupted with partial cache on disk | Reconstruct minimal state from disk artifacts. Present: "Found partial data: [primary cache ✓, 3/7 sub-tasks complete]. Resume from inferred state or restart from scratch?" |
| Jira/Confluence/GitHub unreachable during Smart Refresh | Offer: use cached data with a staleness warning embedded in the output header. Never silently proceed with stale data. |
| Sub-tasks partially cached (some complete, some missing) | Only re-run the missing sub-tasks. Never re-run already-completed sub-tasks unless Full Regenerate is chosen. |
| Output generation fails; raw cache intact | Next invocation detects "cache only" state. Offer "Generate from Cache" as default — no external calls needed. |
| User requests Full Regenerate on data < 1 hour old | Warn: "Data was fetched [N] minutes ago. Are you sure you want to re-fetch everything?" Require explicit confirmation. |

---

## 6. Archive Pattern (Skill-Aligned)

Recommended directory layout:

```
projects/feature-plan/<feature-id>/
├── archive/
│   ├── qa_plan_final_20260128.md      ← previous final
│   ├── qa_plan_draft_20260210_v2.md   ← abandoned draft
│   └── qa_plan_confluence_review_20260210.md
├── task.json
├── context/
│   ├── jira.json
│   ├── qa_plan_atlassian_<feature-id>.md
│   └── ...
├── drafts/
│   └── qa_plan_v<N>.md
├── qa_plan_final.md
├── qa_plan_confluence_review.md
└── changelog.md
```

**Rule:** Never delete old outputs. Archive is the only disposal.

---

## 7. task.json Freshness Fields (Skill-Aligned)

Ensure `task.json` includes:

```json
{
  "run_key": "BCIN-1234",
  "data_fetched_at": "2026-01-28T10:30:00Z",
  "output_generated_at": "2026-01-28T11:45:00Z",
  "subtask_timestamps": {
    "jira": "2026-01-28T10:30:00Z",
    "confluence": "2026-01-28T10:31:00Z",
    "github": "2026-01-28T10:32:00Z",
    "figma": "2026-01-28T10:35:00Z",
    "qa-plan-atlassian": "2026-01-28T11:00:00Z",
    "qa-plan-github": "2026-01-28T11:05:00Z",
    "qa-plan-figma": "2026-01-28T11:08:00Z"
  }
}
```

---

## 8. Quality Gates Checklist

Per the agent-idempotency skill, verify:

- [x] Does Phase 0 check for a final output before any external call? *(workflow + check_resume.sh emit REPORT_STATE)*
- [x] Does Phase 0 check for a draft if no final exists?
- [x] Does Phase 0 check for cached data if no output of either kind exists?
- [x] Does the agent display data freshness (timestamps) before presenting options? *(check_resume.sh outputs freshness)*
- [x] Is the `archive/` subfolder used before any overwrite?
- [x] Is `task.json` updated with `data_fetched_at` and `subtask_timestamps`? *(workflow instructs; schema in DESIGN_ENHANCEMENTS)*
- [x] Is a staleness warning embedded in the output header when cached data is used after an API failure?
- [ ] For batch runs: does the agent present a per-item state matrix? *(N/A for single-feature workflow)*

---

## 9. Summary of Proposed Workflow Updates

| Priority | Update |
|---|---|
| **P0** | Add Phase 0a: Tiered Existence Check. Offer Use Existing / Smart Refresh / Full Regenerate when final or draft exists. Do not proceed with external calls until user chooses. |
| **P0** | Archive `qa_plan_final.md` to `archive/` before overwriting. Never silently overwrite final output. |
| **P0** | When looping back from Phase 5 to Phase 3: explicitly update `task.json` phase to `review_refactor`. |
| **P1** | Add `data_fetched_at`, `output_generated_at`, `subtask_timestamps` to `task.json`. Display cache freshness before options. |
| **P1** | Replace hardcoded v1→v2 with dynamic `v<N>`→`v<N+1>` and track `latest_draft_version` in `task.json`. |
| **P1** | Phase 1: Clear `context/` before full re-fetch when artifacts from optional sources may have been removed. |
| **P2** | Version Confluence review outputs (`qa_plan_confluence_review_v<N>.md`) or append with timestamps. |
| **P2** | Clarify `changelog.md` append vs overwrite behavior; add idempotency check if appending. |
| **P2** | Phase 2a: Implement sub-task staleness logic; only re-run missing or stale analyses. |
| **P2** | Add error-handling flows per §5 (partial cache, API failure, Full Regenerate on fresh data). |
