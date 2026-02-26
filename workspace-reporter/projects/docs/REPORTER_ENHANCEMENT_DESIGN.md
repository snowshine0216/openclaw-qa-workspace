# Reporter Agent Enhancement Design

**Version:** 1.1  
**Status:** Draft for Review  
**Date:** 2026-02-26  
**Scope:** Self-evolution items — Jira content relocation, archive strategy reconciliation, AI self-review phase, dynamic project discovery

---

## 1. Summary of Changes

| Item | Action | Status |
|------|--------|--------|
| Jira Authentication & Cross-Project JQL | Moved from MEMORY.md to `skills/jira-cli/references/issue-search.md` and workflow | ✅ Done |
| Dynamic Project Discovery | New Phase 0b — fetches all Jira projects at runtime; Phase 1 JQL uses cached keys instead of hardcoded list | ✅ Done |
| Report Archive Strategy | Gap analysis + reconciliation proposal | In Design |
| AI Self-Review Phase | New phase between Report Generation and User Approval | In Design |

---

## 2. Dynamic Project Discovery (Completed)

**Problem:** Phase 1 JQL used a hardcoded `project in (BCED, CIAD, CGWS, CGAD, BCIN)` list. Any new Jira project added to the org would be silently missed in defect searches.

**Solution:** New **Phase 0b** runs `jira project list` once per session, caches all project keys to `projects/defects-analysis/.cache/project_keys.txt`, and Phase 1 JQL reads from this file at runtime.

**Changes made:**
- **`defect-analysis.md` workflow:** Added Phase 0b "Project Discovery" section (after 0a); Phase 1 JQL updated to load `$PROJECT_KEYS` from cache file
- **`skills/jira-cli/references/issue-search.md`:** Added "Dynamic Project Discovery" section with cache commands and rationale; updated cross-project JQL example to use `$PROJECT_KEYS` variable

**Cache details:**
- Location: `projects/defects-analysis/.cache/` (shared, should be gitignored)
- TTL: 24 hours (re-fetches automatically when stale)
- Force refresh: delete `project_keys.txt`

**Rationale:** Runtime fetch ensures complete coverage as the org grows. The 24h cache avoids redundant API calls across multiple analyses in the same session.

---

## 3. Jira Content Relocation (Completed)

**Before:** Jira Authentication and Cross-Project Linked Issues lived in `MEMORY.md` as lessons learned.

**After:**
- **Skill reference:** `skills/jira-cli/references/issue-search.md` — credential loading and cross-project JQL workaround
- **jira-cli SKILL.md:** Added "Defect Analysis Context" section linking to the reference
- **defect-analysis workflow:** Phase 0 step 3 requires loading credentials from `.env`; Phase 1 JQL updated to use cross-project search pattern

**Rationale:** Operational knowledge belongs in workflow steps and skill references so the agent reads them during execution. MEMORY is for long-term patterns and lessons, not execution prerequisites.

---

## 4. Report Archive Strategy — Gap Analysis & Reconciliation

### 4.1 Current State

**MEMORY.md (lines 161–174)** describes:
```
projects/test-reports/<issue-key>/summary-report.md
projects/test-reports/<issue-key>/bugs/           (individual bug reports)
projects/test-reports/daily/                     (daily summaries)

# Archive: quarterly move
mkdir -p projects/archive/2026-Q1
mv projects/test-reports/BCIN-1[0-9][0-9][0-9] projects/archive/2026-Q1/
```

**REPORTER_AGENT_DESIGN.md** describes:
```
projects/defects-analysis/<FEATURE_KEY>/
├── context/, archive/, _REPORT_DRAFT.md, _REPORT_FINAL.md
# Per-feature archive: archive/<KEY>_REPORT_FINAL_<YYYYMMDD>.md
# No top-level quarterly archive
```

### 4.2 Identified Gaps

| Aspect | MEMORY | REPORTER_AGENT_DESIGN | Gap |
|--------|--------|------------------------|-----|
| **Folder** | `test-reports/` | `defects-analysis/` | Different report types: test execution vs defect analysis |
| **Archive location** | Top-level `projects/archive/2026-Q1/` | Per-feature `archive/` inside each feature dir | No quarterly consolidation in design |
| **Archive trigger** | Manual quarterly `mv` | On overwrite only (via `archive_report.sh`) | Design has no long-term retention policy |
| **Scope** | By issue-key pattern (BCIN-1xxx) | Per feature key | MEMORY uses glob; design uses script |

### 4.3 Reconciliation Proposal

**Two distinct report types:**
1. **Defect Analysis Reports** (`projects/defects-analysis/`) — QA Risk & Defect Analysis from defect-analysis workflow
2. **Test Reports** (`projects/test-reports/`) — Execution summaries, bug reports, daily digests (from qa-test or manual runs)

**Recommendation:**
- **Defect analysis:** Keep per-feature archive as designed. Add optional quarterly consolidation script for long-term retention (e.g., move older feature dirs to `projects/archive/defects-analysis/2026-Q1/`).
- **Test reports:** Keep MEMORY structure but move it to a canonical doc (`projects/docs/TEST_REPORTS_ARCHIVE.md` or `WORKSPACE_RULES.md` section) instead of MEMORY. Ensure WORKSPACE_RULES and REPORTER_AGENT_DESIGN both reference it.
- **MEMORY.md:** Remove the archive strategy block. Replace with a pointer: *"Report archive: see REPORTER_AGENT_DESIGN Section 5 (defect analysis) and WORKSPACE_RULES (test reports)."*

---

## 5. AI Self-Review Phase (New)

### 5.1 Motivation

**Principle (QA 20/80):** Focus effort where vulnerability is highest. A quality gate before human review catches gaps, inconsistencies, and missing focus before the user spends time reading.

**Current gap:** Phase 4 (Report Generation) produces a draft, then Phase 5 (User Approval) waits for human review. There is no automated quality check in between.

### 5.2 Design: Phase 4a — AI Self-Review (Quality Gate)

**Insert between Phase 4 (Report Generation) and Phase 5 (User Approval).**

**Goal:** The agent reviews the draft report against existing content, QA principles, and quality criteria. Acts as a quality gate keeper.

**Inputs:**
- `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REPORT_DRAFT.md`
- `context/jira_raw.json` + `context/jira_issues/*.json`
- `context/prs/*.md`
- Reference format (Section 6 of REPORTER_AGENT_DESIGN)
- Optional: previous `archive/<KEY>_REPORT_FINAL_*.md` for trend comparison

**Process:**
1. **20/80 vulnerability focus:** Identify the top 20% of areas that represent 80% of risk (by defect count, priority, functional area, PR complexity).
2. **Completeness:** Check all required sections present; no placeholders; defect counts match `jira_raw.json`.
3. **Consistency:** Risk ratings aligned with defect distribution; functional area groupings logical.
4. **Warnings:** Surface anything that should be called out to the user (e.g., many High defects open, missing PR analysis, stale data).
5. **Output:** Append a **"Self-Review Summary"** block at the top of the draft (or produce a separate `_REVIEW_SUMMARY.md`):
   - Focus areas (20/80)
   - Quality score or pass/warn/fail
   - Actionable fixes if any
   - Recommendations for the human reviewer

**Output artifact:** 
- Separate file: `projects/defects-analysis/<FEATURE_KEY>/<FEATURE_KEY>_REVIEW_SUMMARY.md` (Keeps downstream parsing clean).

### 5.3 Self-Review Checklist (Agent Must Execute)

| Check | Description |
|-------|-------------|
| **Section completeness** | All 12 sections from Section 6 present; no `[TODO]` or `<X>` placeholders |
| **Defect count** | Total defects in report = `jira_raw.json` length; no duplicates/missing |
| **20/80 identification** | Identify the top 2-3 functional areas, or any area containing >30% of total defects, or any area containing unresolved High priority defects. |
| **Risk rating coherence** | HIGH if open High defects > N; MEDIUM/LOW consistent with distribution |
| **PR coverage** | If PRs in context but not reflected in Code Change Analysis → flag |
| **Warnings** | Open High defects, flaky/frequent reopen, missing evidence → surface to user |

### 5.4 Workflow Integration

**Updated phase flow:**
- Phase 4: Report Generation (unchanged)
- **Phase 4a: AI Self-Review** (new)
- Phase 5: User Approval (unchanged)

**Agent behavior in Phase 4a:**
1. Read the draft and context files.
2. Run the self-review checklist.
3. Produce `_REVIEW_SUMMARY.md` with pass/warn/fail, focus areas, and any suggested edits.
4. **Auto-fix (Objective only):** If the draft fails objective checks (e.g. missing sections, defect counts mismatch), automatically correct the draft and regenerate (max 1-2 retries).
5. If **warn (Subjective):** For subjective issues (e.g., too many high priority defects, vague descriptions), DO NOT auto-fix. Present review summary to user alongside draft: *"⚠️ Self-review found X items to note. See _REVIEW_SUMMARY.md."*
6. If **pass:** Proceed to Phase 5 with optional one-liner: *"Self-review passed. Draft ready for your approval."*

### 5.5 Skill Consideration

A dedicated `report-quality-reviewer` skill could encapsulate:
- Input: draft path + context paths
- Output: structured review (focus areas, quality score, warnings, suggested edits)
- Reusable for other report types (test reports, feature summaries) in the future

**Recommendation:** Implement as a **workflow step with inline instructions** first. Extract to a skill if reuse is needed.

---

## 6. Implementation Order

1. ✅ **Jira relocation** — Done. Credentials and cross-project JQL moved to `skills/jira-cli/references/issue-search.md`.
2. ✅ **Dynamic project discovery** — Done. Phase 0b added; Phase 1 JQL now reads from `project_keys.txt` cache.
3. **Archive reconciliation** — Update MEMORY, add TEST_REPORTS_ARCHIVE doc (or WORKSPACE_RULES section), optionally add quarterly consolidation to REPORTER_AGENT_DESIGN.
4. **AI Self-Review phase** — Add Phase 4a to `defect-analysis.md` workflow; add self-review checklist to REPORTER_AGENT_DESIGN Section 4; implement in agent behavior.

---

## 7. Resolutions for Implementation

1. **Archive:** Maintain per-feature archive inside feature directories (`projects/defects-analysis/<FEATURE_KEY>/archive/`). Add optional quarterly consolidation for long-term retention.
2. **Self-Review output:** Must be a **separate file** (`_REVIEW_SUMMARY.md`) to avoid breaking downstream markdown parsing by Feature Summary Workflow.
3. **Self-Review auto-fix:** **Hybrid approach**. Auto-fix objective errors (missing sections, defect count mismatch) with at most 1-2 retries. Do NOT auto-fix subjective concerns (report warns and presents to user).
4. **20/80 thresholds:** Use **soft numeric heuristics**: "Identify the top 2-3 functional areas, or any area containing >30% of total defects, or any area containing unresolved High priority defects."

---

*This design has been approved and moved to implementation.*
